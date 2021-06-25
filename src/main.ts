import { getInput, getBooleanInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { Issue, LinearClient, LinearFetch, Team, User, WorkflowState } from '@linear/sdk';
import { WebhookPayload } from '@actions/github/lib/interfaces';

const linearToken = getInput('linear-token', { required: true });
const issuesRequired = getBooleanInput('issues-required', { required: false });
const shouldAddLabels = getBooleanInput('add-labels', { required: false });
const shouldRemoveLabels = getBooleanInput('remove-labels', { required: false });
const createMissingLabels = getBooleanInput('create-missing-labels', { required: false });
const issuePrefixes = getInput('issue-prefixes', { required: true })
  .split(' ')
  .map((prefix) => prefix.trim())
  .filter(Boolean);

// input "drafted = In Progress; ready = In Review; merged = Done; closed = Cancelled"
const stateMap = getInput('state-map', { required: true })
  .split(';')
  .map((pair) =>
    pair
      .trim()
      .split('=')
      .map((chunk) => chunk.trim())
      .filter(Boolean),
  )
  .filter((pair) => pair.length > 1)
  .map(([pullState, linearStateName]) => ({ pullState, linearStateName }));

type PullState = 'drafted' | 'ready' | 'merged' | 'closed';
const allowedPullStates: PullState[] = ['drafted', 'ready', 'merged', 'closed'];

const issueRegex = new RegExp(`((${issuePrefixes.join('|')})-\\d+)`, 'ig');

const linear = new LinearClient({ apiKey: linearToken });
const octokit = getOctokit(getInput('github-token') || process.env.GITHUB_TOKEN);

async function main() {
  const { nodes: allTeams } = await linear.teams();
  // Validate configuration state-map, that all pr state exist in allowedPullStates
  const resolvedTeams = await resolveValidTeamsByPrefixes(allTeams);
  await Promise.all(resolvedTeams.map((team) => linearStateMapAssert(team)));

  console.log('——', context);
  const { action, eventName } = context.payload;
  // before resolving next state (and sending comment) check out, that linear issue already in current state
  const { title, draft, html_url: prHtmlUrl, number: prId } = context.payload.pull_request;

  const foundIssuesIds = findIssuesInText(title);
  if (issuesRequired && foundIssuesIds.length === 0) {
    // stop check
    throw new Error('Please, set issues in PR title');
  }

  const foundIssues = await Promise.all(foundIssuesIds.map((id) => linearIssueFind(id)));

  // just the declarative wrapper over promise array
  // we collect the promises here, and await them at the end
  const jobs = createJobs();

  if (action === 'opened' || action === 'edited') {
    jobs.add(
      githubSyncLabels({
        linearIssues: foundIssues,
        pr: context.payload.pull_request as PR,
      }),
    );
  }

  const prStatus = prStatusDetect(context.payload.pull_request as PR);
  const linearNextState = prStatusMapToLinear(prStatus);
  const linearPrLink = `[#${prId} ${title}](${prHtmlUrl}).`;
  const linearIssueText = linearCommentText[prStatus](context.payload.pull_request as PR);

  const linearComment = `${linearPrLink} ${linearIssueText}`;

  const processIssue = async (issue: Issue) => {
    const currentState = await issue.state;
    if (currentState.name !== linearNextState) {
      await linearIssueMove(issue, linearNextState);
      await linearIssueCommentSend(issue, linearComment);
    }
  };

  for (const issue of foundIssues) {
    jobs.add(processIssue(issue));
  }

  await jobs.complete();
}

function createJobs() {
  const promises: Promise<unknown>[] = [];

  return {
    add: (job: Promise<unknown>) => {
      promises.push(job);
    },
    complete: () => Promise.all(promises),
  };
}

async function githubSyncLabels({ linearIssues, pr }: { linearIssues: Issue[]; pr: PR }) {
  const repoAllLabels = new Set(await githubGetRepoLabels());
  const prCurrentLabels = new Set(pr.labels.map((label) => label.name));
  const linearActualLabels = new Set<string>();
  const linearLabelColors = new Map<string, string>();

  const linearLabels = await Promise.all(linearIssues.map((issue) => issue.labels()));

  for (const linearLabel of linearLabels) {
    for (const node of linearLabel.nodes) {
      linearActualLabels.add(node.name);
      linearLabelColors.set(node.name, node.color);
    }
  }

  const toAdd: string[] = [];
  const toAddMissing: string[] = [];
  const toRemove: string[] = [];

  if (shouldAddLabels) {
    for (const requiredLabel of linearActualLabels.values()) {
      const alreadyHave = prCurrentLabels.has(requiredLabel);
      if (alreadyHave) continue;
      const exist = repoAllLabels.has(requiredLabel);
      if (exist) toAdd.push(requiredLabel);
      else toAddMissing.push(requiredLabel);
    }
  }

  if (shouldRemoveLabels) {
    for (const currentLabel of prCurrentLabels.values()) {
      const isWrong = !linearActualLabels.has(currentLabel);
      if (!isWrong) continue;
      toRemove.push(currentLabel);
    }
  }

  const promises: Promise<void>[] = [];

  if (toAdd.length > 0) {
    promises.push(githubAddLabels(pr.number, toAdd));
  }

  if (toAddMissing.length > 0 && createMissingLabels) {
    const createAndAdd = async () => {
      await githubCreateLabels(toAddMissing, linearLabelColors);
      await githubAddLabels(pr.number, toAddMissing);
    };

    promises.push(createAndAdd());
  }

  if (toRemove.length > 0) {
    promises.push(githubRemoveLabels(pr.number, toRemove));
  }

  return Promise.all(promises).catch((error) => {
    console.log('Failed to sync labels');
    console.log('PR Labels:');
    console.log(pr.labels);
    console.log('Linear Labels:');
    console.log(Array.from(linearActualLabels));
    console.error(error.message);
  });
}

function githubGetRepoLabels() {
  return octokit.rest.issues
    .listLabelsForRepo({
      owner: context.repo.owner,
      repo: context.repo.repo,
    })
    .then((response) => response.data)
    .then((labels) => labels.map((label) => label.name));
}

async function githubCreateLabels(labels: string[], colors: Map<string, string>) {
  await Promise.all(
    labels.map((label) =>
      octokit.rest.issues.createLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        name: label,
        color: colors.get(label),
      }),
    ),
  );
}

async function githubAddLabels(prNumber: number, labels: string[]) {
  await octokit.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNumber,
    labels,
  });
}

async function githubRemoveLabels(prNumber: number, labels: string[]) {
  await Promise.all(
    labels.map((label) =>
      octokit.rest.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        name: label,
      }),
    ),
  );
}

function prStatusMapToLinear(prStatus: PullState): string {
  const state = stateMap.find(({ pullState }) => pullState === prStatus);
  if (!state) {
    throw new Error(`Not found linear state for "${prStatus}"`);
  }
  return state.linearStateName;
}

interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  description: string;
  color: string;
  default: boolean;
}

interface PR {
  number: number;
  rebaseable: boolean;
  merged: boolean;
  draft: boolean;
  html_url: string;
  state: 'open' | 'closed';
  labels: Label[];
}

function prStatusDetect(pr: PR): PullState {
  if (prIsDrafted(pr)) return 'drafted';
  if (prIsReady(pr)) return 'ready';
  if (prIsMerged(pr)) return 'merged';
  if (prIsClosed(pr)) return 'closed';
  throw new Error('Unknown status of pull request');
}

function prIsDrafted(pr: PR): boolean {
  return pr.draft;
}

function prIsReady(pr: PR): boolean {
  return pr.state === 'open' && !pr.draft;
}

function prIsMerged(pr: PR): boolean {
  return pr.state === 'closed' && pr.merged;
}

function prIsClosed(pr: PR): boolean {
  return pr.state === 'closed' && !pr.merged;
}

const linearCommentText: { [K in PullState]: (pr: PR) => string } = {
  drafted: (pr: PR) => `Work started, pull request in draft.`,
  ready: (pr: PR) => `Pull request updated and [ready for review](${pr.html_url}/files).`,
  merged: (pr: PR) => `Pull request merged.`,
  closed: (pr: PR) => 'Pull request closed without merge.',
};

function findIssuesInText(text: string): string[] {
  return [...text.matchAll(issueRegex)].map(([match]) => match);
}

async function resolveValidTeamsByPrefixes(teams: Team[]): Promise<Team[]> {
  const resolvedTeams: Team[] = [];
  const wrongPrefixes: string[] = [];

  for (const prefix of issuePrefixes) {
    const team = teams.find((team) => team.key === prefix);

    if (!team) {
      wrongPrefixes.push(prefix);
      continue;
    }
    resolvedTeams.push(team);
  }

  if (wrongPrefixes.length > 0) {
    throw new Error(`Cannot find teams with prefixes: ${wrongPrefixes.join(', ')}`);
  }

  return resolvedTeams;
}

async function linearStateMapAssert(team: Team) {
  const workflowStates = await linearWorkflowStatesList(team);

  stateMap.forEach(({ linearStateName, pullState }) => {
    const found = workflowStates.find((workflowState) => workflowState.name === linearStateName);

    if (!found || found.archivedAt) {
      throw new Error(
        `Not found linear workflow state "${linearStateName}" for PR state "${pullState}" in team "${team.name}" (${team.key})`,
      );
    }
  });
}

let statesCache: Record<string, WorkflowState[]> = {};

async function linearWorkflowStatesList(team: Team): Promise<WorkflowState[]> {
  if (statesCache[team.key]?.length > 0) {
    return statesCache[team.key];
  }
  const { nodes: states } = await linear.workflowStates({ first: 100 });
  const teamStates = (
    await Promise.all(
      states.map(async (state) => {
        const found = await state.team;
        if (found.key === team.key) {
          // There is state in required team
          return state;
        }
        return null;
      }),
    )
  ).filter((state) => state !== null);
  statesCache[team.key] = teamStates;
  return teamStates;
}

async function linearIssueFind(identifier: string): Promise<Issue | null> {
  const { nodes: found } = await linear.issueSearch(identifier);
  if (found.length === 0) return null;

  return found.find((issue) => issue.identifier === identifier) ?? null;
}

async function linearIssueMove(issue: Issue, moveTo: string) {
  const currentState = await issue.state;
  if (currentState.name !== moveTo) {
    const team = await issue.team;
    const availableStatesInTeam = await linearWorkflowStatesList(team);
    const moveToState = availableStatesInTeam.find((state) => state.name === moveTo);
    if (!moveToState) {
      throw new Error(`Not found state "${moveTo}" in team ${team.name} ${team.key}`);
    }
    await linear.issueUpdate(issue.id, { stateId: moveToState.id });
  }
}

async function linearIssueCommentSend(issue: Issue, markdown: string) {
  await linear.commentCreate({ body: markdown, issueId: issue.id });
}

main().catch((error) => {
  console.error(error);
  setFailed(error);
  process.exit(-1);
});
