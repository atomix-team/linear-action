import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { Issue, LinearClient, LinearFetch, Team, User, WorkflowState } from '@linear/sdk';

const linearToken = getInput('linear-token', { required: true });
const issuesRequired = getInput('issues-required', { required: false }) === 'true';
const issuePrefixes = getInput('issue-prefixes', { required: true })
  .split(' ')
  .map((prefix) => prefix.trim())
  .filter(Boolean);

// input "drafted = In Progress; ready = In Review; review_requested = In Review; merged = Done; closed = Cancelled"
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

const allowedPullStates = ['drafted', 'ready', 'review_requested', 'merged', 'closed'];

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
  const { title, url: prUrl, review_comments_url: prReviewUrl } = context.payload.pull_request;

  const foundIssuesIds = findIssuesInText(title);
  if (issuesRequired && foundIssuesIds.length === 0) {
    // stop check
    throw new Error('Please, set issues in PR title');
  }

  await Promise.all(
    foundIssuesIds.map(async (id) => {
      const issue = await linearIssueFind(id);
      await linearIssueCommentSend(
        issue,
        `PR for this link [here](${prUrl}). You can review it on [this link](${prReviewUrl})`,
      );
    }),
  );
}

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
