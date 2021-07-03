/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 53:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Context = void 0;
const fs_1 = __nccwpck_require__(747);
const os_1 = __nccwpck_require__(87);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        var _a, _b, _c;
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
        this.job = process.env.GITHUB_JOB;
        this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
        this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
        this.apiUrl = (_a = process.env.GITHUB_API_URL) !== null && _a !== void 0 ? _a : `https://api.github.com`;
        this.serverUrl = (_b = process.env.GITHUB_SERVER_URL) !== null && _b !== void 0 ? _b : `https://github.com`;
        this.graphqlUrl = (_c = process.env.GITHUB_GRAPHQL_URL) !== null && _c !== void 0 ? _c : `https://api.github.com/graphql`;
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 438:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokit = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(53));
const utils_1 = __nccwpck_require__(30);
exports.context = new Context.Context();
/**
 * Returns a hydrated octokit ready to use for GitHub Actions
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokit(token, options) {
    return new utils_1.GitHub(utils_1.getOctokitOptions(token, options));
}
exports.getOctokit = getOctokit;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 914:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getApiBaseUrl = exports.getProxyAgent = exports.getAuthString = void 0;
const httpClient = __importStar(__nccwpck_require__(925));
function getAuthString(token, options) {
    if (!token && !options.auth) {
        throw new Error('Parameter token or opts.auth is required');
    }
    else if (token && options.auth) {
        throw new Error('Parameters token and opts.auth may not both be specified');
    }
    return typeof options.auth === 'string' ? options.auth : `token ${token}`;
}
exports.getAuthString = getAuthString;
function getProxyAgent(destinationUrl) {
    const hc = new httpClient.HttpClient();
    return hc.getAgent(destinationUrl);
}
exports.getProxyAgent = getProxyAgent;
function getApiBaseUrl() {
    return process.env['GITHUB_API_URL'] || 'https://api.github.com';
}
exports.getApiBaseUrl = getApiBaseUrl;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 30:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokitOptions = exports.GitHub = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(53));
const Utils = __importStar(__nccwpck_require__(914));
// octokit + plugins
const core_1 = __nccwpck_require__(762);
const plugin_rest_endpoint_methods_1 = __nccwpck_require__(44);
const plugin_paginate_rest_1 = __nccwpck_require__(193);
exports.context = new Context.Context();
const baseUrl = Utils.getApiBaseUrl();
const defaults = {
    baseUrl,
    request: {
        agent: Utils.getProxyAgent(baseUrl)
    }
};
exports.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(defaults);
/**
 * Convience function to correctly format Octokit Options to pass into the constructor.
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokitOptions(token, options) {
    const opts = Object.assign({}, options || {}); // Shallow clone - don't mutate the object provided by the caller
    // Auth
    const auth = Utils.getAuthString(token, opts);
    if (auth) {
        opts.auth = auth;
    }
    return opts;
}
exports.getOctokitOptions = getOctokitOptions;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(605);
const https = __nccwpck_require__(211);
const pm = __nccwpck_require__(443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 851:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
var __webpack_unused_export__;
__webpack_unused_export__ = ({value:!0});var e=__nccwpck_require__(413),i=__nccwpck_require__(605),n=__nccwpck_require__(211),a=__nccwpck_require__(761);function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var d,l=t(e),o=t(i),r=t(n),s=t(a);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function u(e,i){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&i.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var t=0;for(a=Object.getOwnPropertySymbols(e);t<a.length;t++)i.indexOf(a[t])<0&&Object.prototype.propertyIsEnumerable.call(e,a[t])&&(n[a[t]]=e[a[t]])}return n}function m(e,i,n,a){return new(n||(n=Promise))((function(t,d){function l(e){try{r(a.next(e))}catch(e){d(e)}}function o(e){try{r(a.throw(e))}catch(e){d(e)}}function r(e){var i;e.done?t(e.value):(i=e.value,i instanceof n?i:new n((function(e){e(i)}))).then(l,o)}r((a=a.apply(e,i||[])).next())}))}function k(e){return null!=e}exports.IPH=void 0,(d=exports.IPH||(exports.IPH={})).FeatureNotAccessible="FeatureNotAccessible",d.InvalidInput="InvalidInput",d.Ratelimited="Ratelimited",d.NetworkError="NetworkError",d.AuthenticationError="AuthenticationError",d.Forbidden="Forbidden",d.BootstrapError="BootstrapError",d.Unknown="Unknown",d.InternalError="InternalError",d.Other="Other",d.UserError="UserError",d.GraphqlError="GraphqlError",d.LockTimeout="LockTimeout";const v={[exports.IPH.FeatureNotAccessible]:"feature not accessible",[exports.IPH.InvalidInput]:"invalid input",[exports.IPH.Ratelimited]:"ratelimited",[exports.IPH.NetworkError]:"network error",[exports.IPH.AuthenticationError]:"authentication error",[exports.IPH.Forbidden]:"forbidden",[exports.IPH.BootstrapError]:"bootstrap error",[exports.IPH.Unknown]:"unknown",[exports.IPH.InternalError]:"internal error",[exports.IPH.Other]:"other",[exports.IPH.UserError]:"user error",[exports.IPH.GraphqlError]:"graphql error",[exports.IPH.LockTimeout]:"lock timeout"};function c(e){var i,n,a;return null!==(n=v,a=e,i=Object.keys(n).find((e=>n[e]===a)))&&void 0!==i?i:exports.IPH.Unknown}class p{constructor(e){var i,n,a,t,d,l,o;this.type=c(null===(i=null==e?void 0:e.extensions)||void 0===i?void 0:i.type),this.userError=null===(n=null==e?void 0:e.extensions)||void 0===n?void 0:n.userError,this.path=null==e?void 0:e.path,this.message=null!==(o=null!==(d=null!==(t=null===(a=null==e?void 0:e.extensions)||void 0===a?void 0:a.userPresentableMessage)&&void 0!==t?t:null==e?void 0:e.message)&&void 0!==d?d:null===(l=null==e?void 0:e.extensions)||void 0===l?void 0:l.type)&&void 0!==o?o:"Unknown error from LinearClient"}}class N extends Error{constructor(e,i,n){var a,t,d,l,o,r,s,u,m,v;super(null!==(o=Array.from(new Set([(v=null===(t=null===(a=null==e?void 0:e.message)||void 0===a?void 0:a.split(": {"))||void 0===t?void 0:t[0],v?`${v.charAt(0).toUpperCase()}${v.slice(1)}`:void 0),null===(d=null==e?void 0:e.response)||void 0===d?void 0:d.error,null===(l=null==i?void 0:i[0])||void 0===l?void 0:l.message].filter(k))).filter(k).join(" - "))&&void 0!==o?o:"Unknown error from LinearClient"),this.type=n,this.errors=i,this.query=null===(r=null==e?void 0:e.request)||void 0===r?void 0:r.query,this.variables=null===(s=null==e?void 0:e.request)||void 0===s?void 0:s.variables,this.status=null===(u=null==e?void 0:e.response)||void 0===u?void 0:u.status,this.data=null===(m=null==e?void 0:e.response)||void 0===m?void 0:m.data,this.raw=e}}class h extends N{constructor(e,i){super(e,i,exports.IPH.FeatureNotAccessible)}}class f extends N{constructor(e,i){super(e,i,exports.IPH.InvalidInput)}}class b extends N{constructor(e,i){super(e,i,exports.IPH.Ratelimited)}}class y extends N{constructor(e,i){super(e,i,exports.IPH.NetworkError)}}class S extends N{constructor(e,i){super(e,i,exports.IPH.AuthenticationError)}}class g extends N{constructor(e,i){super(e,i,exports.IPH.Forbidden)}}class D extends N{constructor(e,i){super(e,i,exports.IPH.BootstrapError)}}class V extends N{constructor(e,i){super(e,i,exports.IPH.Unknown)}}class F extends N{constructor(e,i){super(e,i,exports.IPH.InternalError)}}class A extends N{constructor(e,i){super(e,i,exports.IPH.Other)}}class _ extends N{constructor(e,i){super(e,i,exports.IPH.UserError)}}class T extends N{constructor(e,i){super(e,i,exports.IPH.GraphqlError)}}class I extends N{constructor(e,i){super(e,i,exports.IPH.LockTimeout)}}const w={[exports.IPH.FeatureNotAccessible]:h,[exports.IPH.InvalidInput]:f,[exports.IPH.Ratelimited]:b,[exports.IPH.NetworkError]:y,[exports.IPH.AuthenticationError]:S,[exports.IPH.Forbidden]:g,[exports.IPH.BootstrapError]:D,[exports.IPH.Unknown]:V,[exports.IPH.InternalError]:F,[exports.IPH.Other]:A,[exports.IPH.UserError]:_,[exports.IPH.GraphqlError]:T,[exports.IPH.LockTimeout]:I};function q(e){var i,n,a,t,d,l;if(e instanceof N)return e;const o=(null!==(n=null===(i=null==e?void 0:e.response)||void 0===i?void 0:i.errors)&&void 0!==n?n:[]).map((e=>new p(e))),r=null===(a=null==e?void 0:e.response)||void 0===a?void 0:a.status,s=null!==(d=null===(t=o[0])||void 0===t?void 0:t.type)&&void 0!==d?d:403===r?exports.IPH.Forbidden:429===r?exports.IPH.Ratelimited:`${r}`.startsWith("4")?exports.IPH.AuthenticationError:500===r?exports.IPH.InternalError:`${r}`.startsWith("5")?exports.IPH.NetworkError:exports.IPH.Unknown;return new(null!==(l=w[s])&&void 0!==l?l:N)(e,o)}var x="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):void 0;function C(e){return(C="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function O(e){return P(e,[])}function P(e,i){switch(C(e)){case"string":return JSON.stringify(e);case"function":return e.name?"[function ".concat(e.name,"]"):"[function]";case"object":return null===e?"null":function(e,i){if(-1!==i.indexOf(e))return"[Circular]";var n=[].concat(i,[e]),a=function(e){var i=e[String(x)];if("function"==typeof i)return i;if("function"==typeof e.inspect)return e.inspect}(e);if(void 0!==a){var t=a.call(e);if(t!==e)return"string"==typeof t?t:P(t,n)}else if(Array.isArray(e))return function(e,i){if(0===e.length)return"[]";if(i.length>2)return"[Array]";for(var n=Math.min(10,e.length),a=e.length-n,t=[],d=0;d<n;++d)t.push(P(e[d],i));1===a?t.push("... 1 more item"):a>1&&t.push("... ".concat(a," more items"));return"["+t.join(", ")+"]"}(e,n);return function(e,i){var n=Object.keys(e);if(0===n.length)return"{}";if(i.length>2)return"["+function(e){var i=Object.prototype.toString.call(e).replace(/^\[object /,"").replace(/]$/,"");if("Object"===i&&"function"==typeof e.constructor){var n=e.constructor.name;if("string"==typeof n&&""!==n)return n}return i}(e)+"]";return"{ "+n.map((function(n){return n+": "+P(e[n],i)})).join(", ")+" }"}(e,n)}(e,i);default:return String(e)}}function j(e){var i=e.prototype.toJSON;"function"==typeof i||function(e,i){if(!Boolean(e))throw new Error(null!=i?i:"Unexpected invariant triggered.")}(0),e.prototype.inspect=i,x&&(e.prototype[x]=i)}function U(e){return null!=e&&"string"==typeof e.kind}j(function(){function e(e,i,n){this.start=e.start,this.end=i.end,this.startToken=e,this.endToken=i,this.source=n}return e.prototype.toJSON=function(){return{start:this.start,end:this.end}},e}()),j(function(){function e(e,i,n,a,t,d,l){this.kind=e,this.start=i,this.end=n,this.line=a,this.column=t,this.value=l,this.prev=d,this.next=null}return e.prototype.toJSON=function(){return{kind:this.kind,value:this.value,line:this.line,column:this.column}},e}());var B={Name:[],Document:["definitions"],OperationDefinition:["name","variableDefinitions","directives","selectionSet"],VariableDefinition:["variable","type","defaultValue","directives"],Variable:["name"],SelectionSet:["selections"],Field:["alias","name","arguments","directives","selectionSet"],Argument:["name","value"],FragmentSpread:["name","directives"],InlineFragment:["typeCondition","directives","selectionSet"],FragmentDefinition:["name","variableDefinitions","typeCondition","directives","selectionSet"],IntValue:[],FloatValue:[],StringValue:[],BooleanValue:[],NullValue:[],EnumValue:[],ListValue:["values"],ObjectValue:["fields"],ObjectField:["name","value"],Directive:["name","arguments"],NamedType:["name"],ListType:["type"],NonNullType:["type"],SchemaDefinition:["description","directives","operationTypes"],OperationTypeDefinition:["type"],ScalarTypeDefinition:["description","name","directives"],ObjectTypeDefinition:["description","name","interfaces","directives","fields"],FieldDefinition:["description","name","arguments","type","directives"],InputValueDefinition:["description","name","type","defaultValue","directives"],InterfaceTypeDefinition:["description","name","interfaces","directives","fields"],UnionTypeDefinition:["description","name","directives","types"],EnumTypeDefinition:["description","name","directives","values"],EnumValueDefinition:["description","name","directives"],InputObjectTypeDefinition:["description","name","directives","fields"],DirectiveDefinition:["description","name","arguments","locations"],SchemaExtension:["directives","operationTypes"],ScalarTypeExtension:["name","directives"],ObjectTypeExtension:["name","interfaces","directives","fields"],InterfaceTypeExtension:["name","interfaces","directives","fields"],UnionTypeExtension:["name","directives","types"],EnumTypeExtension:["name","directives","values"],InputObjectTypeExtension:["name","directives","fields"]},E=Object.freeze({});function R(e,i,n){var a=e[i];if(a){if(!n&&"function"==typeof a)return a;var t=n?a.leave:a.enter;if("function"==typeof t)return t}else{var d=n?e.leave:e.enter;if(d){if("function"==typeof d)return d;var l=d[i];if("function"==typeof l)return l}}}function z(e){return function(e,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:B,a=void 0,t=Array.isArray(e),d=[e],l=-1,o=[],r=void 0,s=void 0,u=void 0,m=[],k=[],v=e;do{var c=++l===d.length,p=c&&0!==o.length;if(c){if(s=0===k.length?void 0:m[m.length-1],r=u,u=k.pop(),p){if(t)r=r.slice();else{for(var N={},h=0,f=Object.keys(r);h<f.length;h++){var b=f[h];N[b]=r[b]}r=N}for(var y=0,S=0;S<o.length;S++){var g=o[S][0],D=o[S][1];t&&(g-=y),t&&null===D?(r.splice(g,1),y++):r[g]=D}}l=a.index,d=a.keys,o=a.edits,t=a.inArray,a=a.prev}else{if(s=u?t?l:d[l]:void 0,null==(r=u?u[s]:v))continue;u&&m.push(s)}var V,F=void 0;if(!Array.isArray(r)){if(!U(r))throw new Error("Invalid AST Node: ".concat(O(r),"."));var A=R(i,r.kind,c);if(A){if((F=A.call(i,r,s,u,m,k))===E)break;if(!1===F){if(!c){m.pop();continue}}else if(void 0!==F&&(o.push([s,F]),!c)){if(!U(F)){m.pop();continue}r=F}}}void 0===F&&p&&o.push([s,r]),c?m.pop():(a={inArray:t,index:l,keys:d,edits:o,prev:a},d=(t=Array.isArray(r))?r:null!==(V=n[r.kind])&&void 0!==V?V:[],l=-1,o=[],u&&k.push(u),u=r)}while(void 0!==a);return 0!==o.length&&(v=o[o.length-1][1]),v}(e,{leave:L})}var L={Name:function(e){return e.value},Variable:function(e){return"$"+e.name},Document:function(e){return W(e.definitions,"\n\n")+"\n"},OperationDefinition:function(e){var i=e.operation,n=e.name,a=H("(",W(e.variableDefinitions,", "),")"),t=W(e.directives," "),d=e.selectionSet;return n||t||a||"query"!==i?W([i,W([n,a]),t,d]," "):d},VariableDefinition:function(e){var i=e.variable,n=e.type,a=e.defaultValue,t=e.directives;return i+": "+n+H(" = ",a)+H(" ",W(t," "))},SelectionSet:function(e){return Q(e.selections)},Field:function(e){var i=e.alias,n=e.name,a=e.arguments,t=e.directives,d=e.selectionSet,l=H("",i,": ")+n,o=l+H("(",W(a,", "),")");return o.length>80&&(o=l+H("(\n",G(W(a,"\n")),"\n)")),W([o,W(t," "),d]," ")},Argument:function(e){return e.name+": "+e.value},FragmentSpread:function(e){return"..."+e.name+H(" ",W(e.directives," "))},InlineFragment:function(e){var i=e.typeCondition,n=e.directives,a=e.selectionSet;return W(["...",H("on ",i),W(n," "),a]," ")},FragmentDefinition:function(e){var i=e.name,n=e.typeCondition,a=e.variableDefinitions,t=e.directives,d=e.selectionSet;return"fragment ".concat(i).concat(H("(",W(a,", "),")")," ")+"on ".concat(n," ").concat(H("",W(t," ")," "))+d},IntValue:function(e){return e.value},FloatValue:function(e){return e.value},StringValue:function(e,i){var n=e.value;return e.block?function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=-1===e.indexOf("\n"),t=" "===e[0]||"\t"===e[0],d='"'===e[e.length-1],l="\\"===e[e.length-1],o=!a||d||l||n,r="";return!o||a&&t||(r+="\n"+i),r+=i?e.replace(/\n/g,"\n"+i):e,o&&(r+="\n"),'"""'+r.replace(/"""/g,'\\"""')+'"""'}(n,"description"===i?"":"  "):JSON.stringify(n)},BooleanValue:function(e){return e.value?"true":"false"},NullValue:function(){return"null"},EnumValue:function(e){return e.value},ListValue:function(e){return"["+W(e.values,", ")+"]"},ObjectValue:function(e){return"{"+W(e.fields,", ")+"}"},ObjectField:function(e){return e.name+": "+e.value},Directive:function(e){return"@"+e.name+H("(",W(e.arguments,", "),")")},NamedType:function(e){return e.name},ListType:function(e){return"["+e.type+"]"},NonNullType:function(e){return e.type+"!"},SchemaDefinition:M((function(e){var i=e.directives,n=e.operationTypes;return W(["schema",W(i," "),Q(n)]," ")})),OperationTypeDefinition:function(e){return e.operation+": "+e.type},ScalarTypeDefinition:M((function(e){return W(["scalar",e.name,W(e.directives," ")]," ")})),ObjectTypeDefinition:M((function(e){var i=e.name,n=e.interfaces,a=e.directives,t=e.fields;return W(["type",i,H("implements ",W(n," & ")),W(a," "),Q(t)]," ")})),FieldDefinition:M((function(e){var i=e.name,n=e.arguments,a=e.type,t=e.directives;return i+($(n)?H("(\n",G(W(n,"\n")),"\n)"):H("(",W(n,", "),")"))+": "+a+H(" ",W(t," "))})),InputValueDefinition:M((function(e){var i=e.name,n=e.type,a=e.defaultValue,t=e.directives;return W([i+": "+n,H("= ",a),W(t," ")]," ")})),InterfaceTypeDefinition:M((function(e){var i=e.name,n=e.interfaces,a=e.directives,t=e.fields;return W(["interface",i,H("implements ",W(n," & ")),W(a," "),Q(t)]," ")})),UnionTypeDefinition:M((function(e){var i=e.name,n=e.directives,a=e.types;return W(["union",i,W(n," "),a&&0!==a.length?"= "+W(a," | "):""]," ")})),EnumTypeDefinition:M((function(e){var i=e.name,n=e.directives,a=e.values;return W(["enum",i,W(n," "),Q(a)]," ")})),EnumValueDefinition:M((function(e){return W([e.name,W(e.directives," ")]," ")})),InputObjectTypeDefinition:M((function(e){var i=e.name,n=e.directives,a=e.fields;return W(["input",i,W(n," "),Q(a)]," ")})),DirectiveDefinition:M((function(e){var i=e.name,n=e.arguments,a=e.repeatable,t=e.locations;return"directive @"+i+($(n)?H("(\n",G(W(n,"\n")),"\n)"):H("(",W(n,", "),")"))+(a?" repeatable":"")+" on "+W(t," | ")})),SchemaExtension:function(e){var i=e.directives,n=e.operationTypes;return W(["extend schema",W(i," "),Q(n)]," ")},ScalarTypeExtension:function(e){return W(["extend scalar",e.name,W(e.directives," ")]," ")},ObjectTypeExtension:function(e){var i=e.name,n=e.interfaces,a=e.directives,t=e.fields;return W(["extend type",i,H("implements ",W(n," & ")),W(a," "),Q(t)]," ")},InterfaceTypeExtension:function(e){var i=e.name,n=e.interfaces,a=e.directives,t=e.fields;return W(["extend interface",i,H("implements ",W(n," & ")),W(a," "),Q(t)]," ")},UnionTypeExtension:function(e){var i=e.name,n=e.directives,a=e.types;return W(["extend union",i,W(n," "),a&&0!==a.length?"= "+W(a," | "):""]," ")},EnumTypeExtension:function(e){var i=e.name,n=e.directives,a=e.values;return W(["extend enum",i,W(n," "),Q(a)]," ")},InputObjectTypeExtension:function(e){var i=e.name,n=e.directives,a=e.fields;return W(["extend input",i,W(n," "),Q(a)]," ")}};function M(e){return function(i){return W([i.description,e(i)],"\n")}}function W(e){var i,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return null!==(i=null==e?void 0:e.filter((function(e){return e})).join(n))&&void 0!==i?i:""}function Q(e){return H("{\n",G(W(e,"\n")),"\n}")}function H(e,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";return null!=i&&""!==i?e+i+n:""}function G(e){return H("  ",e.replace(/\n/g,"\n  "))}function K(e){return-1!==e.indexOf("\n")}function $(e){return null!=e&&e.some(K)}var J="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function Z(e){if(e.__esModule)return e;var i=Object.defineProperty({},"__esModule",{value:!0});return Object.keys(e).forEach((function(n){var a=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(i,n,a.get?a:{enumerable:!0,get:function(){return e[n]}})})),i}function Y(e){var i={exports:{}};return e(i,i.exports),i.exports}var X=Object.freeze({__proto__:null,default:function(e,i){return i=i||{},new Promise((function(n,a){var t=new XMLHttpRequest,d=[],l=[],o={},r=function(){return{ok:2==(t.status/100|0),statusText:t.statusText,status:t.status,url:t.responseURL,text:function(){return Promise.resolve(t.responseText)},json:function(){return Promise.resolve(t.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([t.response]))},clone:r,headers:{keys:function(){return d},entries:function(){return l},get:function(e){return o[e.toLowerCase()]},has:function(e){return e.toLowerCase()in o}}}};for(var s in t.open(i.method||"get",e,!0),t.onload=function(){t.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,(function(e,i,n){d.push(i=i.toLowerCase()),l.push([i,n]),o[i]=o[i]?o[i]+","+n:n})),n(r())},t.onerror=a,t.withCredentials="include"==i.credentials,i.headers)t.setRequestHeader(s,i.headers[s]);t.send(i.body||null)}))}}),ee=Y((function(e,i){!function(n){var a=i&&!i.nodeType&&i,t=e&&!e.nodeType&&e,d="object"==typeof J&&J;d.global!==d&&d.window!==d&&d.self!==d||(n=d);var l,o,r=2147483647,s=36,u=/^xn--/,m=/[^\x20-\x7E]/,k=/[\x2E\u3002\uFF0E\uFF61]/g,v={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},c=Math.floor,p=String.fromCharCode;function N(e){throw RangeError(v[e])}function h(e,i){for(var n=e.length,a=[];n--;)a[n]=i(e[n]);return a}function f(e,i){var n=e.split("@"),a="";return n.length>1&&(a=n[0]+"@",e=n[1]),a+h((e=e.replace(k,".")).split("."),i).join(".")}function b(e){for(var i,n,a=[],t=0,d=e.length;t<d;)(i=e.charCodeAt(t++))>=55296&&i<=56319&&t<d?56320==(64512&(n=e.charCodeAt(t++)))?a.push(((1023&i)<<10)+(1023&n)+65536):(a.push(i),t--):a.push(i);return a}function y(e){return h(e,(function(e){var i="";return e>65535&&(i+=p((e-=65536)>>>10&1023|55296),e=56320|1023&e),i+=p(e)})).join("")}function S(e,i){return e+22+75*(e<26)-((0!=i)<<5)}function g(e,i,n){var a=0;for(e=n?c(e/700):e>>1,e+=c(e/i);e>455;a+=s)e=c(e/35);return c(a+36*e/(e+38))}function D(e){var i,n,a,t,d,l,o,u,m,k,v,p=[],h=e.length,f=0,b=128,S=72;for((n=e.lastIndexOf("-"))<0&&(n=0),a=0;a<n;++a)e.charCodeAt(a)>=128&&N("not-basic"),p.push(e.charCodeAt(a));for(t=n>0?n+1:0;t<h;){for(d=f,l=1,o=s;t>=h&&N("invalid-input"),((u=(v=e.charCodeAt(t++))-48<10?v-22:v-65<26?v-65:v-97<26?v-97:s)>=s||u>c((r-f)/l))&&N("overflow"),f+=u*l,!(u<(m=o<=S?1:o>=S+26?26:o-S));o+=s)l>c(r/(k=s-m))&&N("overflow"),l*=k;S=g(f-d,i=p.length+1,0==d),c(f/i)>r-b&&N("overflow"),b+=c(f/i),f%=i,p.splice(f++,0,b)}return y(p)}function V(e){var i,n,a,t,d,l,o,u,m,k,v,h,f,y,D,V=[];for(h=(e=b(e)).length,i=128,n=0,d=72,l=0;l<h;++l)(v=e[l])<128&&V.push(p(v));for(a=t=V.length,t&&V.push("-");a<h;){for(o=r,l=0;l<h;++l)(v=e[l])>=i&&v<o&&(o=v);for(o-i>c((r-n)/(f=a+1))&&N("overflow"),n+=(o-i)*f,i=o,l=0;l<h;++l)if((v=e[l])<i&&++n>r&&N("overflow"),v==i){for(u=n,m=s;!(u<(k=m<=d?1:m>=d+26?26:m-d));m+=s)D=u-k,y=s-k,V.push(p(S(k+D%y,0))),u=c(D/y);V.push(p(S(u,0))),d=g(n,f,a==t),n=0,++a}++n,++i}return V.join("")}if(l={version:"1.3.2",ucs2:{decode:b,encode:y},decode:D,encode:V,toASCII:function(e){return f(e,(function(e){return m.test(e)?"xn--"+V(e):e}))},toUnicode:function(e){return f(e,(function(e){return u.test(e)?D(e.slice(4).toLowerCase()):e}))}},a&&t)if(e.exports==a)t.exports=l;else for(o in l)l.hasOwnProperty(o)&&(a[o]=l[o]);else n.punycode=l}(J)})),ie=function(e){return"string"==typeof e},ne=function(e){return"object"==typeof e&&null!==e},ae=function(e){return null===e},te=function(e){return null==e};
/*! https://mths.be/punycode v1.3.2 by @mathias */function de(e,i){return Object.prototype.hasOwnProperty.call(e,i)}var le=function(e,i,n,a){i=i||"&",n=n||"=";var t={};if("string"!=typeof e||0===e.length)return t;var d=/\+/g;e=e.split(i);var l=1e3;a&&"number"==typeof a.maxKeys&&(l=a.maxKeys);var o=e.length;l>0&&o>l&&(o=l);for(var r=0;r<o;++r){var s,u,m,k,v=e[r].replace(d,"%20"),c=v.indexOf(n);c>=0?(s=v.substr(0,c),u=v.substr(c+1)):(s=v,u=""),m=decodeURIComponent(s),k=decodeURIComponent(u),de(t,m)?Array.isArray(t[m])?t[m].push(k):t[m]=[t[m],k]:t[m]=k}return t},oe=function(e){switch(typeof e){case"string":return e;case"boolean":return e?"true":"false";case"number":return isFinite(e)?e:"";default:return""}},re=function(e,i,n,a){return i=i||"&",n=n||"=",null===e&&(e=void 0),"object"==typeof e?Object.keys(e).map((function(a){var t=encodeURIComponent(oe(a))+n;return Array.isArray(e[a])?e[a].map((function(e){return t+encodeURIComponent(oe(e))})).join(i):t+encodeURIComponent(oe(e[a]))})).join(i):a?encodeURIComponent(oe(a))+n+encodeURIComponent(oe(e)):""},se=Y((function(e,i){i.decode=i.parse=le,i.encode=i.stringify=re})),ue=Te,me=function(e,i){return Te(e,!1,!0).resolve(i)},ke=function(e,i){return e?Te(e,!1,!0).resolveObject(i):i},ve=function(e){ie(e)&&(e=Te(e));return e instanceof pe?e.format():pe.prototype.format.call(e)},ce=pe;function pe(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}var Ne=/^([a-z0-9.+-]+:)/i,he=/:[0-9]*$/,fe=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,be=["{","}","|","\\","^","`"].concat(["<",">",'"',"`"," ","\r","\n","\t"]),ye=["'"].concat(be),Se=["%","/","?",";","#"].concat(ye),ge=["/","?","#"],De=/^[+a-z0-9A-Z_-]{0,63}$/,Ve=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,Fe={javascript:!0,"javascript:":!0},Ae={javascript:!0,"javascript:":!0},_e={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0};function Te(e,i,n){if(e&&ne(e)&&e instanceof pe)return e;var a=new pe;return a.parse(e,i,n),a}pe.prototype.parse=function(e,i,n){if(!ie(e))throw new TypeError("Parameter 'url' must be a string, not "+typeof e);var a=e.indexOf("?"),t=-1!==a&&a<e.indexOf("#")?"?":"#",d=e.split(t);d[0]=d[0].replace(/\\/g,"/");var l=e=d.join(t);if(l=l.trim(),!n&&1===e.split("#").length){var o=fe.exec(l);if(o)return this.path=l,this.href=l,this.pathname=o[1],o[2]?(this.search=o[2],this.query=i?se.parse(this.search.substr(1)):this.search.substr(1)):i&&(this.search="",this.query={}),this}var r=Ne.exec(l);if(r){var s=(r=r[0]).toLowerCase();this.protocol=s,l=l.substr(r.length)}if(n||r||l.match(/^\/\/[^@\/]+@[^@\/]+/)){var u="//"===l.substr(0,2);!u||r&&Ae[r]||(l=l.substr(2),this.slashes=!0)}if(!Ae[r]&&(u||r&&!_e[r])){for(var m,k,v=-1,c=0;c<ge.length;c++){-1!==(p=l.indexOf(ge[c]))&&(-1===v||p<v)&&(v=p)}-1!==(k=-1===v?l.lastIndexOf("@"):l.lastIndexOf("@",v))&&(m=l.slice(0,k),l=l.slice(k+1),this.auth=decodeURIComponent(m)),v=-1;for(c=0;c<Se.length;c++){var p;-1!==(p=l.indexOf(Se[c]))&&(-1===v||p<v)&&(v=p)}-1===v&&(v=l.length),this.host=l.slice(0,v),l=l.slice(v),this.parseHost(),this.hostname=this.hostname||"";var N="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!N)for(var h=this.hostname.split(/\./),f=(c=0,h.length);c<f;c++){var b=h[c];if(b&&!b.match(De)){for(var y="",S=0,g=b.length;S<g;S++)b.charCodeAt(S)>127?y+="x":y+=b[S];if(!y.match(De)){var D=h.slice(0,c),V=h.slice(c+1),F=b.match(Ve);F&&(D.push(F[1]),V.unshift(F[2])),V.length&&(l="/"+V.join(".")+l),this.hostname=D.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),N||(this.hostname=ee.toASCII(this.hostname));var A=this.port?":"+this.port:"",_=this.hostname||"";this.host=_+A,this.href+=this.host,N&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==l[0]&&(l="/"+l))}if(!Fe[s])for(c=0,f=ye.length;c<f;c++){var T=ye[c];if(-1!==l.indexOf(T)){var I=encodeURIComponent(T);I===T&&(I=escape(T)),l=l.split(T).join(I)}}var w=l.indexOf("#");-1!==w&&(this.hash=l.substr(w),l=l.slice(0,w));var q=l.indexOf("?");if(-1!==q?(this.search=l.substr(q),this.query=l.substr(q+1),i&&(this.query=se.parse(this.query)),l=l.slice(0,q)):i&&(this.search="",this.query={}),l&&(this.pathname=l),_e[s]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){A=this.pathname||"";var x=this.search||"";this.path=A+x}return this.href=this.format(),this},pe.prototype.format=function(){var e=this.auth||"";e&&(e=(e=encodeURIComponent(e)).replace(/%3A/i,":"),e+="@");var i=this.protocol||"",n=this.pathname||"",a=this.hash||"",t=!1,d="";this.host?t=e+this.host:this.hostname&&(t=e+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(t+=":"+this.port)),this.query&&ne(this.query)&&Object.keys(this.query).length&&(d=se.stringify(this.query));var l=this.search||d&&"?"+d||"";return i&&":"!==i.substr(-1)&&(i+=":"),this.slashes||(!i||_e[i])&&!1!==t?(t="//"+(t||""),n&&"/"!==n.charAt(0)&&(n="/"+n)):t||(t=""),a&&"#"!==a.charAt(0)&&(a="#"+a),l&&"?"!==l.charAt(0)&&(l="?"+l),i+t+(n=n.replace(/[?#]/g,(function(e){return encodeURIComponent(e)})))+(l=l.replace("#","%23"))+a},pe.prototype.resolve=function(e){return this.resolveObject(Te(e,!1,!0)).format()},pe.prototype.resolveObject=function(e){if(ie(e)){var i=new pe;i.parse(e,!1,!0),e=i}for(var n=new pe,a=Object.keys(this),t=0;t<a.length;t++){var d=a[t];n[d]=this[d]}if(n.hash=e.hash,""===e.href)return n.href=n.format(),n;if(e.slashes&&!e.protocol){for(var l=Object.keys(e),o=0;o<l.length;o++){var r=l[o];"protocol"!==r&&(n[r]=e[r])}return _e[n.protocol]&&n.hostname&&!n.pathname&&(n.path=n.pathname="/"),n.href=n.format(),n}if(e.protocol&&e.protocol!==n.protocol){if(!_e[e.protocol]){for(var s=Object.keys(e),u=0;u<s.length;u++){var m=s[u];n[m]=e[m]}return n.href=n.format(),n}if(n.protocol=e.protocol,e.host||Ae[e.protocol])n.pathname=e.pathname;else{for(var k=(e.pathname||"").split("/");k.length&&!(e.host=k.shift()););e.host||(e.host=""),e.hostname||(e.hostname=""),""!==k[0]&&k.unshift(""),k.length<2&&k.unshift(""),n.pathname=k.join("/")}if(n.search=e.search,n.query=e.query,n.host=e.host||"",n.auth=e.auth,n.hostname=e.hostname||e.host,n.port=e.port,n.pathname||n.search){var v=n.pathname||"",c=n.search||"";n.path=v+c}return n.slashes=n.slashes||e.slashes,n.href=n.format(),n}var p=n.pathname&&"/"===n.pathname.charAt(0),N=e.host||e.pathname&&"/"===e.pathname.charAt(0),h=N||p||n.host&&e.pathname,f=h,b=n.pathname&&n.pathname.split("/")||[],y=(k=e.pathname&&e.pathname.split("/")||[],n.protocol&&!_e[n.protocol]);if(y&&(n.hostname="",n.port=null,n.host&&(""===b[0]?b[0]=n.host:b.unshift(n.host)),n.host="",e.protocol&&(e.hostname=null,e.port=null,e.host&&(""===k[0]?k[0]=e.host:k.unshift(e.host)),e.host=null),h=h&&(""===k[0]||""===b[0])),N)n.host=e.host||""===e.host?e.host:n.host,n.hostname=e.hostname||""===e.hostname?e.hostname:n.hostname,n.search=e.search,n.query=e.query,b=k;else if(k.length)b||(b=[]),b.pop(),b=b.concat(k),n.search=e.search,n.query=e.query;else if(!te(e.search)){if(y)n.hostname=n.host=b.shift(),(F=!!(n.host&&n.host.indexOf("@")>0)&&n.host.split("@"))&&(n.auth=F.shift(),n.host=n.hostname=F.shift());return n.search=e.search,n.query=e.query,ae(n.pathname)&&ae(n.search)||(n.path=(n.pathname?n.pathname:"")+(n.search?n.search:"")),n.href=n.format(),n}if(!b.length)return n.pathname=null,n.search?n.path="/"+n.search:n.path=null,n.href=n.format(),n;for(var S=b.slice(-1)[0],g=(n.host||e.host||b.length>1)&&("."===S||".."===S)||""===S,D=0,V=b.length;V>=0;V--)"."===(S=b[V])?b.splice(V,1):".."===S?(b.splice(V,1),D++):D&&(b.splice(V,1),D--);if(!h&&!f)for(;D--;D)b.unshift("..");!h||""===b[0]||b[0]&&"/"===b[0].charAt(0)||b.unshift(""),g&&"/"!==b.join("/").substr(-1)&&b.push("");var F,A=""===b[0]||b[0]&&"/"===b[0].charAt(0);y&&(n.hostname=n.host=A?"":b.length?b.shift():"",(F=!!(n.host&&n.host.indexOf("@")>0)&&n.host.split("@"))&&(n.auth=F.shift(),n.host=n.hostname=F.shift()));return(h=h||n.host&&b.length)&&!A&&b.unshift(""),b.length?n.pathname=b.join("/"):(n.pathname=null,n.path=null),ae(n.pathname)&&ae(n.search)||(n.path=(n.pathname?n.pathname:"")+(n.search?n.search:"")),n.auth=e.auth||n.auth,n.slashes=n.slashes||e.slashes,n.href=n.format(),n},pe.prototype.parseHost=function(){var e=this.host,i=he.exec(e);i&&(":"!==(i=i[0])&&(this.port=i.substr(1)),e=e.substr(0,e.length-i.length)),e&&(this.hostname=e)};var Ie={parse:ue,resolve:me,resolveObject:ke,format:ve,Url:ce};const we=l.default.Readable,qe=Symbol("buffer"),xe=Symbol("type");class Ce{constructor(){this[xe]="";const e=arguments[0],i=arguments[1],n=[];let a=0;if(e){const i=e,t=Number(i.length);for(let e=0;e<t;e++){const t=i[e];let d;d=t instanceof Buffer?t:ArrayBuffer.isView(t)?Buffer.from(t.buffer,t.byteOffset,t.byteLength):t instanceof ArrayBuffer?Buffer.from(t):t instanceof Ce?t[qe]:Buffer.from("string"==typeof t?t:String(t)),a+=d.length,n.push(d)}}this[qe]=Buffer.concat(n);let t=i&&void 0!==i.type&&String(i.type).toLowerCase();t&&!/[^\u0020-\u007E]/.test(t)&&(this[xe]=t)}get size(){return this[qe].length}get type(){return this[xe]}text(){return Promise.resolve(this[qe].toString())}arrayBuffer(){const e=this[qe],i=e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength);return Promise.resolve(i)}stream(){const e=new we;return e._read=function(){},e.push(this[qe]),e.push(null),e}toString(){return"[object Blob]"}slice(){const e=this.size,i=arguments[0],n=arguments[1];let a,t;a=void 0===i?0:i<0?Math.max(e+i,0):Math.min(i,e),t=void 0===n?e:n<0?Math.max(e+n,0):Math.min(n,e);const d=Math.max(t-a,0),l=this[qe].slice(a,a+d),o=new Ce([],{type:arguments[2]});return o[qe]=l,o}}function Oe(e,i,n){Error.call(this,e),this.message=e,this.type=i,n&&(this.code=this.errno=n.code),Error.captureStackTrace(this,this.constructor)}let Pe;Object.defineProperties(Ce.prototype,{size:{enumerable:!0},type:{enumerable:!0},slice:{enumerable:!0}}),Object.defineProperty(Ce.prototype,Symbol.toStringTag,{value:"Blob",writable:!1,enumerable:!1,configurable:!0}),Oe.prototype=Object.create(Error.prototype),Oe.prototype.constructor=Oe,Oe.prototype.name="FetchError";try{Pe=__nccwpck_require__(877).convert}catch(e){}const je=Symbol("Body internals"),Ue=l.default.PassThrough;function Be(e){var i=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=n.size;let t=void 0===a?0:a;var d=n.timeout;let o=void 0===d?0:d;null==e?e=null:Re(e)?e=Buffer.from(e.toString()):ze(e)||Buffer.isBuffer(e)||("[object ArrayBuffer]"===Object.prototype.toString.call(e)?e=Buffer.from(e):ArrayBuffer.isView(e)?e=Buffer.from(e.buffer,e.byteOffset,e.byteLength):e instanceof l.default||(e=Buffer.from(String(e)))),this[je]={body:e,disturbed:!1,error:null},this.size=t,this.timeout=o,e instanceof l.default&&e.on("error",(function(e){const n="AbortError"===e.name?e:new Oe(`Invalid response body while trying to fetch ${i.url}: ${e.message}`,"system",e);i[je].error=n}))}function Ee(){var e=this;if(this[je].disturbed)return Be.Promise.reject(new TypeError(`body used already for: ${this.url}`));if(this[je].disturbed=!0,this[je].error)return Be.Promise.reject(this[je].error);let i=this.body;if(null===i)return Be.Promise.resolve(Buffer.alloc(0));if(ze(i)&&(i=i.stream()),Buffer.isBuffer(i))return Be.Promise.resolve(i);if(!(i instanceof l.default))return Be.Promise.resolve(Buffer.alloc(0));let n=[],a=0,t=!1;return new Be.Promise((function(d,l){let o;e.timeout&&(o=setTimeout((function(){t=!0,l(new Oe(`Response timeout while trying to fetch ${e.url} (over ${e.timeout}ms)`,"body-timeout"))}),e.timeout)),i.on("error",(function(i){"AbortError"===i.name?(t=!0,l(i)):l(new Oe(`Invalid response body while trying to fetch ${e.url}: ${i.message}`,"system",i))})),i.on("data",(function(i){if(!t&&null!==i){if(e.size&&a+i.length>e.size)return t=!0,void l(new Oe(`content size at ${e.url} over limit: ${e.size}`,"max-size"));a+=i.length,n.push(i)}})),i.on("end",(function(){if(!t){clearTimeout(o);try{d(Buffer.concat(n,a))}catch(i){l(new Oe(`Could not create Buffer from response body for ${e.url}: ${i.message}`,"system",i))}}}))}))}function Re(e){return"object"==typeof e&&"function"==typeof e.append&&"function"==typeof e.delete&&"function"==typeof e.get&&"function"==typeof e.getAll&&"function"==typeof e.has&&"function"==typeof e.set&&("URLSearchParams"===e.constructor.name||"[object URLSearchParams]"===Object.prototype.toString.call(e)||"function"==typeof e.sort)}function ze(e){return"object"==typeof e&&"function"==typeof e.arrayBuffer&&"string"==typeof e.type&&"function"==typeof e.stream&&"function"==typeof e.constructor&&"string"==typeof e.constructor.name&&/^(Blob|File)$/.test(e.constructor.name)&&/^(Blob|File)$/.test(e[Symbol.toStringTag])}function Le(e){let i,n,a=e.body;if(e.bodyUsed)throw new Error("cannot clone body after it is used");return a instanceof l.default&&"function"!=typeof a.getBoundary&&(i=new Ue,n=new Ue,a.pipe(i),a.pipe(n),e[je].body=i,a=n),a}function Me(e){return null===e?null:"string"==typeof e?"text/plain;charset=UTF-8":Re(e)?"application/x-www-form-urlencoded;charset=UTF-8":ze(e)?e.type||null:Buffer.isBuffer(e)||"[object ArrayBuffer]"===Object.prototype.toString.call(e)||ArrayBuffer.isView(e)?null:"function"==typeof e.getBoundary?`multipart/form-data;boundary=${e.getBoundary()}`:e instanceof l.default?null:"text/plain;charset=UTF-8"}function We(e){const i=e.body;return null===i?0:ze(i)?i.size:Buffer.isBuffer(i)?i.length:i&&"function"==typeof i.getLengthSync&&(i._lengthRetrievers&&0==i._lengthRetrievers.length||i.hasKnownLength&&i.hasKnownLength())?i.getLengthSync():null}Be.prototype={get body(){return this[je].body},get bodyUsed(){return this[je].disturbed},arrayBuffer(){return Ee.call(this).then((function(e){return e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)}))},blob(){let e=this.headers&&this.headers.get("content-type")||"";return Ee.call(this).then((function(i){return Object.assign(new Ce([],{type:e.toLowerCase()}),{[qe]:i})}))},json(){var e=this;return Ee.call(this).then((function(i){try{return JSON.parse(i.toString())}catch(i){return Be.Promise.reject(new Oe(`invalid json response body at ${e.url} reason: ${i.message}`,"invalid-json"))}}))},text(){return Ee.call(this).then((function(e){return e.toString()}))},buffer(){return Ee.call(this)},textConverted(){var e=this;return Ee.call(this).then((function(i){return function(e,i){if("function"!=typeof Pe)throw new Error("The package `encoding` must be installed to use the textConverted() function");const n=i.get("content-type");let a,t,d="utf-8";n&&(a=/charset=([^;]*)/i.exec(n));t=e.slice(0,1024).toString(),!a&&t&&(a=/<meta.+?charset=(['"])(.+?)\1/i.exec(t));!a&&t&&(a=/<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(t),a||(a=/<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(t),a&&a.pop()),a&&(a=/charset=(.*)/i.exec(a.pop())));!a&&t&&(a=/<\?xml.+?encoding=(['"])(.+?)\1/i.exec(t));a&&(d=a.pop(),"gb2312"!==d&&"gbk"!==d||(d="gb18030"));return Pe(e,"UTF-8",d).toString()}(i,e.headers)}))}},Object.defineProperties(Be.prototype,{body:{enumerable:!0},bodyUsed:{enumerable:!0},arrayBuffer:{enumerable:!0},blob:{enumerable:!0},json:{enumerable:!0},text:{enumerable:!0}}),Be.mixIn=function(e){for(const i of Object.getOwnPropertyNames(Be.prototype))if(!(i in e)){const n=Object.getOwnPropertyDescriptor(Be.prototype,i);Object.defineProperty(e,i,n)}},Be.Promise=global.Promise;const Qe=/[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/,He=/[^\t\x20-\x7e\x80-\xff]/;function Ge(e){if(e=`${e}`,Qe.test(e)||""===e)throw new TypeError(`${e} is not a legal HTTP header name`)}function Ke(e){if(e=`${e}`,He.test(e))throw new TypeError(`${e} is not a legal HTTP header value`)}function $e(e,i){i=i.toLowerCase();for(const n in e)if(n.toLowerCase()===i)return n}const Je=Symbol("map");class Ze{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;if(this[Je]=Object.create(null),e instanceof Ze){const i=e.raw(),n=Object.keys(i);for(const e of n)for(const n of i[e])this.append(e,n)}else if(null==e);else{if("object"!=typeof e)throw new TypeError("Provided initializer must be an object");{const i=e[Symbol.iterator];if(null!=i){if("function"!=typeof i)throw new TypeError("Header pairs must be iterable");const n=[];for(const i of e){if("object"!=typeof i||"function"!=typeof i[Symbol.iterator])throw new TypeError("Each header pair must be iterable");n.push(Array.from(i))}for(const e of n){if(2!==e.length)throw new TypeError("Each header pair must be a name/value tuple");this.append(e[0],e[1])}}else for(const i of Object.keys(e)){const n=e[i];this.append(i,n)}}}}get(e){Ge(e=`${e}`);const i=$e(this[Je],e);return void 0===i?null:this[Je][i].join(", ")}forEach(e){let i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,n=Ye(this),a=0;for(;a<n.length;){var t=n[a];const d=t[0],l=t[1];e.call(i,l,d,this),n=Ye(this),a++}}set(e,i){i=`${i}`,Ge(e=`${e}`),Ke(i);const n=$e(this[Je],e);this[Je][void 0!==n?n:e]=[i]}append(e,i){i=`${i}`,Ge(e=`${e}`),Ke(i);const n=$e(this[Je],e);void 0!==n?this[Je][n].push(i):this[Je][e]=[i]}has(e){return Ge(e=`${e}`),void 0!==$e(this[Je],e)}delete(e){Ge(e=`${e}`);const i=$e(this[Je],e);void 0!==i&&delete this[Je][i]}raw(){return this[Je]}keys(){return ei(this,"key")}values(){return ei(this,"value")}[Symbol.iterator](){return ei(this,"key+value")}}function Ye(e){let i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"key+value";const n=Object.keys(e[Je]).sort();return n.map("key"===i?function(e){return e.toLowerCase()}:"value"===i?function(i){return e[Je][i].join(", ")}:function(i){return[i.toLowerCase(),e[Je][i].join(", ")]})}Ze.prototype.entries=Ze.prototype[Symbol.iterator],Object.defineProperty(Ze.prototype,Symbol.toStringTag,{value:"Headers",writable:!1,enumerable:!1,configurable:!0}),Object.defineProperties(Ze.prototype,{get:{enumerable:!0},forEach:{enumerable:!0},set:{enumerable:!0},append:{enumerable:!0},has:{enumerable:!0},delete:{enumerable:!0},keys:{enumerable:!0},values:{enumerable:!0},entries:{enumerable:!0}});const Xe=Symbol("internal");function ei(e,i){const n=Object.create(ii);return n[Xe]={target:e,kind:i,index:0},n}const ii=Object.setPrototypeOf({next(){if(!this||Object.getPrototypeOf(this)!==ii)throw new TypeError("Value of `this` is not a HeadersIterator");var e=this[Xe];const i=e.target,n=e.kind,a=e.index,t=Ye(i,n);return a>=t.length?{value:void 0,done:!0}:(this[Xe].index=a+1,{value:t[a],done:!1})}},Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));function ni(e){const i=Object.assign({__proto__:null},e[Je]),n=$e(e[Je],"Host");return void 0!==n&&(i[n]=i[n][0]),i}Object.defineProperty(ii,Symbol.toStringTag,{value:"HeadersIterator",writable:!1,enumerable:!1,configurable:!0});const ai=Symbol("Response internals"),ti=o.default.STATUS_CODES;class di{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};Be.call(this,e,i);const n=i.status||200,a=new Ze(i.headers);if(null!=e&&!a.has("Content-Type")){const i=Me(e);i&&a.append("Content-Type",i)}this[ai]={url:i.url,status:n,statusText:i.statusText||ti[n],headers:a,counter:i.counter}}get url(){return this[ai].url||""}get status(){return this[ai].status}get ok(){return this[ai].status>=200&&this[ai].status<300}get redirected(){return this[ai].counter>0}get statusText(){return this[ai].statusText}get headers(){return this[ai].headers}clone(){return new di(Le(this),{url:this.url,status:this.status,statusText:this.statusText,headers:this.headers,ok:this.ok,redirected:this.redirected})}}Be.mixIn(di.prototype),Object.defineProperties(di.prototype,{url:{enumerable:!0},status:{enumerable:!0},ok:{enumerable:!0},redirected:{enumerable:!0},statusText:{enumerable:!0},headers:{enumerable:!0},clone:{enumerable:!0}}),Object.defineProperty(di.prototype,Symbol.toStringTag,{value:"Response",writable:!1,enumerable:!1,configurable:!0});const li=Symbol("Request internals"),oi=Ie.parse,ri=Ie.format,si="destroy"in l.default.Readable.prototype;function ui(e){return"object"==typeof e&&"object"==typeof e[li]}class mi{constructor(e){let i,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};ui(e)?i=oi(e.url):(i=e&&e.href?oi(e.href):oi(`${e}`),e={});let a=n.method||e.method||"GET";if(a=a.toUpperCase(),(null!=n.body||ui(e)&&null!==e.body)&&("GET"===a||"HEAD"===a))throw new TypeError("Request with GET/HEAD method cannot have body");let t=null!=n.body?n.body:ui(e)&&null!==e.body?Le(e):null;Be.call(this,t,{timeout:n.timeout||e.timeout||0,size:n.size||e.size||0});const d=new Ze(n.headers||e.headers||{});if(null!=t&&!d.has("Content-Type")){const e=Me(t);e&&d.append("Content-Type",e)}let l=ui(e)?e.signal:null;if("signal"in n&&(l=n.signal),null!=l&&!function(e){const i=e&&"object"==typeof e&&Object.getPrototypeOf(e);return!(!i||"AbortSignal"!==i.constructor.name)}(l))throw new TypeError("Expected signal to be an instanceof AbortSignal");this[li]={method:a,redirect:n.redirect||e.redirect||"follow",headers:d,parsedURL:i,signal:l},this.follow=void 0!==n.follow?n.follow:void 0!==e.follow?e.follow:20,this.compress=void 0!==n.compress?n.compress:void 0===e.compress||e.compress,this.counter=n.counter||e.counter||0,this.agent=n.agent||e.agent}get method(){return this[li].method}get url(){return ri(this[li].parsedURL)}get headers(){return this[li].headers}get redirect(){return this[li].redirect}get signal(){return this[li].signal}clone(){return new mi(this)}}function ki(e){Error.call(this,e),this.type="aborted",this.message=e,Error.captureStackTrace(this,this.constructor)}Be.mixIn(mi.prototype),Object.defineProperty(mi.prototype,Symbol.toStringTag,{value:"Request",writable:!1,enumerable:!1,configurable:!0}),Object.defineProperties(mi.prototype,{method:{enumerable:!0},url:{enumerable:!0},headers:{enumerable:!0},redirect:{enumerable:!0},clone:{enumerable:!0},signal:{enumerable:!0}}),ki.prototype=Object.create(Error.prototype),ki.prototype.constructor=ki,ki.prototype.name="AbortError";const vi=l.default.PassThrough,ci=Ie.resolve;function pi(e,i){if(!pi.Promise)throw new Error("native promise missing, set fetch.Promise to your favorite alternative");return Be.Promise=pi.Promise,new pi.Promise((function(n,a){const t=new mi(e,i),d=function(e){const i=e[li].parsedURL,n=new Ze(e[li].headers);if(n.has("Accept")||n.set("Accept","*/*"),!i.protocol||!i.hostname)throw new TypeError("Only absolute URLs are supported");if(!/^https?:$/.test(i.protocol))throw new TypeError("Only HTTP(S) protocols are supported");if(e.signal&&e.body instanceof l.default.Readable&&!si)throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");let a=null;if(null==e.body&&/^(POST|PUT)$/i.test(e.method)&&(a="0"),null!=e.body){const i=We(e);"number"==typeof i&&(a=String(i))}a&&n.set("Content-Length",a),n.has("User-Agent")||n.set("User-Agent","node-fetch/1.0 (+https://github.com/bitinn/node-fetch)"),e.compress&&!n.has("Accept-Encoding")&&n.set("Accept-Encoding","gzip,deflate");let t=e.agent;return"function"==typeof t&&(t=t(i)),n.has("Connection")||t||n.set("Connection","close"),Object.assign({},i,{method:e.method,headers:ni(n),agent:t})}(t),u=("https:"===d.protocol?r.default:o.default).request,m=t.signal;let k=null;const v=function(){let e=new ki("The user aborted a request.");a(e),t.body&&t.body instanceof l.default.Readable&&t.body.destroy(e),k&&k.body&&k.body.emit("error",e)};if(m&&m.aborted)return void v();const c=function(){v(),h()},p=u(d);let N;function h(){p.abort(),m&&m.removeEventListener("abort",c),clearTimeout(N)}m&&m.addEventListener("abort",c),t.timeout&&p.once("socket",(function(e){N=setTimeout((function(){a(new Oe(`network timeout at: ${t.url}`,"request-timeout")),h()}),t.timeout)})),p.on("error",(function(e){a(new Oe(`request to ${t.url} failed, reason: ${e.message}`,"system",e)),h()})),p.on("response",(function(e){clearTimeout(N);const i=function(e){const i=new Ze;for(const n of Object.keys(e))if(!Qe.test(n))if(Array.isArray(e[n]))for(const a of e[n])He.test(a)||(void 0===i[Je][n]?i[Je][n]=[a]:i[Je][n].push(a));else He.test(e[n])||(i[Je][n]=[e[n]]);return i}(e.headers);if(pi.isRedirect(e.statusCode)){const d=i.get("Location"),l=null===d?null:ci(t.url,d);switch(t.redirect){case"error":return a(new Oe(`uri requested responds with a redirect, redirect mode is set to error: ${t.url}`,"no-redirect")),void h();case"manual":if(null!==l)try{i.set("Location",l)}catch(e){a(e)}break;case"follow":if(null===l)break;if(t.counter>=t.follow)return a(new Oe(`maximum redirect reached at: ${t.url}`,"max-redirect")),void h();const d={headers:new Ze(t.headers),follow:t.follow,counter:t.counter+1,agent:t.agent,compress:t.compress,method:t.method,body:t.body,signal:t.signal,timeout:t.timeout,size:t.size};return 303!==e.statusCode&&t.body&&null===We(t)?(a(new Oe("Cannot follow redirect with body being a readable stream","unsupported-redirect")),void h()):(303!==e.statusCode&&(301!==e.statusCode&&302!==e.statusCode||"POST"!==t.method)||(d.method="GET",d.body=void 0,d.headers.delete("content-length")),n(pi(new mi(l,d))),void h())}}e.once("end",(function(){m&&m.removeEventListener("abort",c)}));let d=e.pipe(new vi);const l={url:t.url,status:e.statusCode,statusText:e.statusMessage,headers:i,size:t.size,timeout:t.timeout,counter:t.counter},o=i.get("Content-Encoding");if(!t.compress||"HEAD"===t.method||null===o||204===e.statusCode||304===e.statusCode)return k=new di(d,l),void n(k);const r={flush:s.default.Z_SYNC_FLUSH,finishFlush:s.default.Z_SYNC_FLUSH};if("gzip"==o||"x-gzip"==o)return d=d.pipe(s.default.createGunzip(r)),k=new di(d,l),void n(k);if("deflate"!=o&&"x-deflate"!=o){if("br"==o&&"function"==typeof s.default.createBrotliDecompress)return d=d.pipe(s.default.createBrotliDecompress()),k=new di(d,l),void n(k);k=new di(d,l),n(k)}else{e.pipe(new vi).once("data",(function(e){d=8==(15&e[0])?d.pipe(s.default.createInflate()):d.pipe(s.default.createInflateRaw()),k=new di(d,l),n(k)}))}})),function(e,i){const n=i.body;null===n?e.end():ze(n)?n.stream().pipe(e):Buffer.isBuffer(n)?(e.write(n),e.end()):n.pipe(e)}(p,t)}))}pi.isRedirect=function(e){return 301===e||302===e||303===e||307===e||308===e},pi.Promise=global.Promise;var Ni=Object.freeze({__proto__:null,default:pi,Headers:Ze,Request:mi,Response:di,FetchError:Oe}),hi=Z(X),fi=Z(Ni);function bi(e){return e&&e.default||e}var yi,Si,gi,Di,Vi,Fi,Ai,_i=J.fetch=J.fetch||("undefined"==typeof process?bi(hi):function(e,i){return bi(fi)(String(e).replace(/^\/\//g,"https://"),i)});class Ti extends Error{constructor(e,i){super(`${Ti.extractMessage(e)}: ${JSON.stringify({response:e,request:i})}`),Object.setPrototypeOf(this,Ti.prototype),this.response=e,this.request=i,"function"==typeof Error.captureStackTrace&&Error.captureStackTrace(this,Ti)}static extractMessage(e){var i,n,a;try{return null!==(a=null===(n=null===(i=e.errors)||void 0===i?void 0:i[0])||void 0===n?void 0:n.message)&&void 0!==a?a:`GraphQL Error (Code: ${e.status})`}catch(i){return`GraphQL Error (Code: ${e.status})`}}}class Ii{constructor(e,i){this.url=e,this.options=i||{}}rawRequest(e,i,n){return m(this,void 0,void 0,(function*(){const a=this.options,{headers:t}=a,d=u(a,["headers"]),l=JSON.stringify({query:e,variables:i}),o=yield _i(this.url,Object.assign({method:"POST",headers:Object.assign(Object.assign(Object.assign({},"string"==typeof l?{"Content-Type":"application/json"}:{}),qi(t)),qi(n)),body:l},d)),r=yield wi(o);if("string"!=typeof r&&o.ok&&!r.errors&&r.data)return Object.assign(Object.assign({},r),{headers:o.headers,status:o.status});throw q(new Ti(Object.assign(Object.assign({},"string"==typeof r?{error:r}:r),{status:o.status,headers:o.headers}),{query:e,variables:i}))}))}request(e,i,n){return m(this,void 0,void 0,(function*(){const a=this.options,{headers:t}=a,d=u(a,["headers"]),l="string"==typeof e?e:z(e),o=JSON.stringify({query:l,variables:i}),r=yield _i(this.url,Object.assign({method:"POST",headers:Object.assign(Object.assign(Object.assign({},"string"==typeof o?{"Content-Type":"application/json"}:{}),qi(t)),qi(n)),body:o},d)),s=yield wi(r);if("string"!=typeof s&&r.ok&&!s.errors&&s.data)return s.data;throw new Ti(Object.assign(Object.assign({},"string"==typeof s?{error:s}:s),{status:r.status,headers:r.headers}),{query:l,variables:i})}))}setHeaders(e){return this.options.headers=e,this}setHeader(e,i){const{headers:n}=this.options;return n?n[e]=i:this.options.headers={[e]:i},this}}function wi(e){const i=e.headers.get("Content-Type");return i&&i.startsWith("application/json")?e.json():e.text()}function qi(e){let i={};return e&&("undefined"!=typeof Headers&&e instanceof Headers?i=function(e){const i={};return e.forEach(((e,n)=>{i[n]=e})),i}(e):Array.isArray(e)?e.forEach((([e,n])=>{i[e]=n})):i=e),i}!function(e){e.Blocks="blocks",e.Duplicate="duplicate",e.Related="related"}(yi||(yi={})),function(e){e.CreatedAt="createdAt",e.UpdatedAt="updatedAt"}(Si||(Si={})),function(e){e.ExcludeTrash="excludeTrash",e.IncludeTrash="includeTrash",e.TrashOnly="trashOnly"}(gi||(gi={})),function(e){e.AnalyticsWelcomeDismissed="analyticsWelcomeDismissed",e.CanPlaySnake="canPlaySnake",e.CompletedOnboarding="completedOnboarding",e.CycleWelcomeDismissed="cycleWelcomeDismissed",e.DesktopDownloadToastDismissed="desktopDownloadToastDismissed",e.DesktopInstalled="desktopInstalled",e.DueDateShortcutMigration="dueDateShortcutMigration",e.EmptyActiveIssuesDismissed="emptyActiveIssuesDismissed",e.EmptyBacklogDismissed="emptyBacklogDismissed",e.EmptyCustomViewsDismissed="emptyCustomViewsDismissed",e.EmptyMyIssuesDismissed="emptyMyIssuesDismissed",e.FigmaPromptDismissed="figmaPromptDismissed",e.ImportBannerDismissed="importBannerDismissed",e.ListSelectionTip="listSelectionTip",e.MigrateThemePreference="migrateThemePreference",e.ProjectWelcomeDismissed="projectWelcomeDismissed",e.TriageWelcomeDismissed="triageWelcomeDismissed"}(Di||(Di={})),function(e){e.Clear="clear",e.Decr="decr",e.Incr="incr",e.Lock="lock"}(Vi||(Vi={})),function(e){e.Organization="organization",e.User="user"}(Fi||(Fi={})),function(e){e.ActiveIssues="activeIssues",e.AllIssues="allIssues",e.Backlog="backlog",e.Board="board",e.CompletedCycle="completedCycle",e.CustomView="customView",e.Cycle="cycle",e.Inbox="inbox",e.Label="label",e.MyIssues="myIssues",e.Project="project",e.Projects="projects",e.Roadmap="roadmap",e.Triage="triage",e.UserProfile="userProfile"}(Ai||(Ai={}));const xi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Template"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Template"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"templateData"}},{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"type"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},Ci={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"User"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"User"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"avatarUrl"}},{kind:"Field",name:{kind:"Name",value:"createdIssueCount"}},{kind:"Field",name:{kind:"Name",value:"disableReason"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"lastSeen"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"displayName"}},{kind:"Field",name:{kind:"Name",value:"email"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"inviteHash"}},{kind:"Field",name:{kind:"Name",value:"active"}},{kind:"Field",name:{kind:"Name",value:"admin"}}]}}]},Oi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UserAccount"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UserAccount"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"service"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"email"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"users"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"User"}}]}}]}},...Ci.definitions]},Pi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"GithubRepo"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"GithubRepo"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"name"}}]}}]},ji={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"GithubOrg"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"GithubOrg"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"repositories"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"GithubRepo"}}]}},{kind:"Field",name:{kind:"Name",value:"login"}},{kind:"Field",name:{kind:"Name",value:"name"}}]}},...Pi.definitions]},Ui={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"GithubOAuthTokenPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"GithubOAuthTokenPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizations"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"GithubOrg"}}]}},{kind:"Field",name:{kind:"Name",value:"token"}}]}},...ji.definitions]},Bi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"AuthorizedApplication"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"AuthorizedApplication"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"imageUrl"}},{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"developer"}},{kind:"Field",name:{kind:"Name",value:"appId"}},{kind:"Field",name:{kind:"Name",value:"clientId"}},{kind:"Field",name:{kind:"Name",value:"scope"}},{kind:"Field",name:{kind:"Name",value:"developerUrl"}}]}}]},Ei={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UserAuthorizedApplication"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UserAuthorizedApplication"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"imageUrl"}},{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"developer"}},{kind:"Field",name:{kind:"Name",value:"clientId"}},{kind:"Field",name:{kind:"Name",value:"developerUrl"}},{kind:"Field",name:{kind:"Name",value:"createdByLinear"}},{kind:"Field",name:{kind:"Name",value:"isAuthorized"}}]}}]},Ri={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"GoogleSheetsSettings"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"GoogleSheetsSettings"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"sheetId"}},{kind:"Field",name:{kind:"Name",value:"spreadsheetId"}},{kind:"Field",name:{kind:"Name",value:"spreadsheetUrl"}},{kind:"Field",name:{kind:"Name",value:"updatedIssuesAt"}}]}}]},zi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SentrySettings"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SentrySettings"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationSlug"}}]}}]},Li={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SlackPostSettings"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SlackPostSettings"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"channel"}},{kind:"Field",name:{kind:"Name",value:"channelId"}},{kind:"Field",name:{kind:"Name",value:"configurationUrl"}}]}}]},Mi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ZendeskSettings"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ZendeskSettings"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"botUserId"}},{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"subdomain"}}]}}]},Wi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IntegrationSettings"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IntegrationSettings"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"googleSheets"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"GoogleSheetsSettings"}}]}},{kind:"Field",name:{kind:"Name",value:"sentry"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"SentrySettings"}}]}},{kind:"Field",name:{kind:"Name",value:"slackPost"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"SlackPostSettings"}}]}},{kind:"Field",name:{kind:"Name",value:"slackProjectPost"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"SlackPostSettings"}}]}},{kind:"Field",name:{kind:"Name",value:"zendesk"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ZendeskSettings"}}]}}]}},...Ri.definitions,...zi.definitions,...Li.definitions,...Mi.definitions]},Qi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UserSettings"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UserSettings"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"unsubscribedFrom"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"notificationPreferences"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"user"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},Hi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Subscription"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Subscription"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"canceledAt"}},{kind:"Field",name:{kind:"Name",value:"nextBillingAt"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"seats"}},{kind:"Field",name:{kind:"Name",value:"pendingChangeType"}},{kind:"Field",name:{kind:"Name",value:"type"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},Gi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ApiKey"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ApiKey"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"label"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},Ki={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"PageInfo"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"PageInfo"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"startCursor"}},{kind:"Field",name:{kind:"Name",value:"endCursor"}},{kind:"Field",name:{kind:"Name",value:"hasPreviousPage"}},{kind:"Field",name:{kind:"Name",value:"hasNextPage"}}]}}]},$i={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ApiKeyConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ApiKeyConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ApiKey"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Gi.definitions,...Ki.definitions]},Ji={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ApiKeyPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ApiKeyPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"apiKey"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ApiKey"}}]}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...Gi.definitions]},Zi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ArchivePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ArchivePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Yi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Attachment"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Attachment"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"subtitle"}},{kind:"Field",name:{kind:"Name",value:"title"}},{kind:"Field",name:{kind:"Name",value:"metadata"}},{kind:"Field",name:{kind:"Name",value:"groupBySource"}},{kind:"Field",name:{kind:"Name",value:"source"}},{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"issue"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},Xi={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"AttachmentConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"AttachmentConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Attachment"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Yi.definitions,...Ki.definitions]},en={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"AttachmentPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"AttachmentPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"attachment"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},nn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Organization"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Organization"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"allowedAuthServices"}},{kind:"Field",name:{kind:"Name",value:"gitBranchFormat"}},{kind:"Field",name:{kind:"Name",value:"userCount"}},{kind:"Field",name:{kind:"Name",value:"createdIssueCount"}},{kind:"Field",name:{kind:"Name",value:"periodUploadVolume"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"logoUrl"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"urlKey"}},{kind:"Field",name:{kind:"Name",value:"deletionRequestedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"samlEnabled"}},{kind:"Field",name:{kind:"Name",value:"gitLinkbackMessagesEnabled"}},{kind:"Field",name:{kind:"Name",value:"gitPublicLinkbackMessagesEnabled"}},{kind:"Field",name:{kind:"Name",value:"roadmapEnabled"}}]}}]},an={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"AuthResolverResponse"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"AuthResolverResponse"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"email"}},{kind:"Field",name:{kind:"Name",value:"lastUsedOrganizationId"}},{kind:"Field",name:{kind:"Name",value:"token"}},{kind:"Field",name:{kind:"Name",value:"availableOrganizations"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Organization"}}]}},{kind:"Field",name:{kind:"Name",value:"allowDomainAccess"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"users"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"User"}}]}}]}},...nn.definitions,...Ci.definitions]},tn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Invoice"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Invoice"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"created"}},{kind:"Field",name:{kind:"Name",value:"dueDate"}},{kind:"Field",name:{kind:"Name",value:"total"}},{kind:"Field",name:{kind:"Name",value:"status"}}]}}]},dn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Card"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Card"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"brand"}},{kind:"Field",name:{kind:"Name",value:"last4"}}]}}]},ln={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"BillingDetailsPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"BillingDetailsPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"invoices"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Invoice"}}]}},{kind:"Field",name:{kind:"Name",value:"email"}},{kind:"Field",name:{kind:"Name",value:"paymentMethod"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Card"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...tn.definitions,...dn.definitions]},on={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"BillingEmailPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"BillingEmailPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"email"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},rn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"StepsResponse"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"StepsResponse"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"version"}},{kind:"Field",name:{kind:"Name",value:"clientIds"}},{kind:"Field",name:{kind:"Name",value:"steps"}}]}}]},sn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CollaborationDocumentUpdatePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CollaborationDocumentUpdatePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"steps"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"StepsResponse"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...rn.definitions]},un={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Comment"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Comment"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"body"}},{kind:"Field",name:{kind:"Name",value:"issue"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"editedAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"user"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},mn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CommentConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CommentConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Comment"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...un.definitions,...Ki.definitions]},kn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CommentPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CommentPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"comment"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},vn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ContactPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ContactPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},cn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CreateCsvExportReportPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CreateCsvExportReportPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},pn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CreateOrJoinOrganizationResponse"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CreateOrJoinOrganizationResponse"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"user"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},Nn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CustomView"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CustomView"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"color"}},{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"filters"}},{kind:"Field",name:{kind:"Name",value:"icon"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"shared"}}]}}]},hn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CustomViewConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CustomViewConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CustomView"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Nn.definitions,...Ki.definitions]},fn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CustomViewPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CustomViewPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"customView"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},bn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Cycle"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Cycle"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"completedAt"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"endsAt"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"completedScopeHistory"}},{kind:"Field",name:{kind:"Name",value:"completedIssueCountHistory"}},{kind:"Field",name:{kind:"Name",value:"number"}},{kind:"Field",name:{kind:"Name",value:"startsAt"}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"autoArchivedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"scopeHistory"}},{kind:"Field",name:{kind:"Name",value:"issueCountHistory"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},yn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CycleConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CycleConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Cycle"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...bn.definitions,...Ki.definitions]},Sn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CyclePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CyclePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycle"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},gn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"DebugPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"DebugPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Dn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"EmailUnsubscribePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"EmailUnsubscribePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Vn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"EmailUserAccountAuthChallengeResponse"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"EmailUserAccountAuthChallengeResponse"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"authType"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Fn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Emoji"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Emoji"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"source"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},An={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"EmojiConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"EmojiConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Emoji"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Fn.definitions,...Ki.definitions]},_n={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"EmojiPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"EmojiPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"emoji"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Tn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"EventPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"EventPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},In={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Favorite"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Favorite"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycle"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"label"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"issue"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"projectTeam"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"project"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"sortOrder"}},{kind:"Field",name:{kind:"Name",value:"user"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"type"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},wn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"FavoriteConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"FavoriteConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Favorite"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...In.definitions,...Ki.definitions]},qn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"FavoritePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"FavoritePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"favorite"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},xn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"FeedbackPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"FeedbackPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Cn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"FigmaEmbed"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"FigmaEmbed"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastModified"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"nodeName"}}]}}]},On={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"FigmaEmbedPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"FigmaEmbedPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"figmaEmbed"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"FigmaEmbed"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...Cn.definitions]},Pn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ImageUploadFromUrlPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ImageUploadFromUrlPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},jn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Integration"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Integration"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"service"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},Un={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IntegrationConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IntegrationConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Integration"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...jn.definitions,...Ki.definitions]},Bn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IntegrationPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IntegrationPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"integration"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},En={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"CommitPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"CommitPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"added"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"message"}},{kind:"Field",name:{kind:"Name",value:"modified"}},{kind:"Field",name:{kind:"Name",value:"removed"}},{kind:"Field",name:{kind:"Name",value:"timestamp"}},{kind:"Field",name:{kind:"Name",value:"url"}}]}}]},Rn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"PullRequestPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"PullRequestPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"branch"}},{kind:"Field",name:{kind:"Name",value:"closedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"draft"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"mergedAt"}},{kind:"Field",name:{kind:"Name",value:"number"}},{kind:"Field",name:{kind:"Name",value:"repoLogin"}},{kind:"Field",name:{kind:"Name",value:"repoName"}},{kind:"Field",name:{kind:"Name",value:"status"}},{kind:"Field",name:{kind:"Name",value:"title"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"userId"}},{kind:"Field",name:{kind:"Name",value:"userLogin"}}]}}]},zn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SentryIssuePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SentryIssuePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueId"}},{kind:"Field",name:{kind:"Name",value:"actorId"}},{kind:"Field",name:{kind:"Name",value:"projectId"}},{kind:"Field",name:{kind:"Name",value:"firstSeen"}},{kind:"Field",name:{kind:"Name",value:"webUrl"}},{kind:"Field",name:{kind:"Name",value:"actorName"}},{kind:"Field",name:{kind:"Name",value:"firstVersion"}},{kind:"Field",name:{kind:"Name",value:"shortId"}},{kind:"Field",name:{kind:"Name",value:"projectSlug"}},{kind:"Field",name:{kind:"Name",value:"issueTitle"}},{kind:"Field",name:{kind:"Name",value:"actorType"}}]}}]},Ln={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IntegrationResourceData"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IntegrationResourceData"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"githubCommit"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CommitPayload"}}]}},{kind:"Field",name:{kind:"Name",value:"githubPullRequest"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PullRequestPayload"}}]}},{kind:"Field",name:{kind:"Name",value:"gitlabMergeRequest"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PullRequestPayload"}}]}},{kind:"Field",name:{kind:"Name",value:"sentryIssue"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"SentryIssuePayload"}}]}}]}},...En.definitions,...Rn.definitions,...zn.definitions]},Mn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IntegrationResource"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IntegrationResource"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"data"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationResourceData"}}]}},{kind:"Field",name:{kind:"Name",value:"pullRequest"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PullRequestPayload"}}]}},{kind:"Field",name:{kind:"Name",value:"resourceId"}},{kind:"Field",name:{kind:"Name",value:"integration"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"resourceType"}},{kind:"Field",name:{kind:"Name",value:"issue"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}},...Ln.definitions,...Rn.definitions]},Wn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IntegrationResourceConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IntegrationResourceConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationResource"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Mn.definitions,...Ki.definitions]},Qn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"InviteData"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"InviteData"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"avatarURLs"}},{kind:"Field",name:{kind:"Name",value:"teamIds"}},{kind:"Field",name:{kind:"Name",value:"teamNames"}},{kind:"Field",name:{kind:"Name",value:"organizationDomain"}},{kind:"Field",name:{kind:"Name",value:"organizationLogoUrl"}},{kind:"Field",name:{kind:"Name",value:"inviterName"}},{kind:"Field",name:{kind:"Name",value:"organizationName"}},{kind:"Field",name:{kind:"Name",value:"userCount"}}]}}]},Hn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"InvitePagePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"InvitePagePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"inviteData"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"InviteData"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...Qn.definitions]},Gn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Issue"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Issue"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"trashed"}},{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"identifier"}},{kind:"Field",name:{kind:"Name",value:"priorityLabel"}},{kind:"Field",name:{kind:"Name",value:"previousIdentifiers"}},{kind:"Field",name:{kind:"Name",value:"customerTicketCount"}},{kind:"Field",name:{kind:"Name",value:"branchName"}},{kind:"Field",name:{kind:"Name",value:"cycle"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"dueDate"}},{kind:"Field",name:{kind:"Name",value:"estimate"}},{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"title"}},{kind:"Field",name:{kind:"Name",value:"number"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"boardOrder"}},{kind:"Field",name:{kind:"Name",value:"subIssueSortOrder"}},{kind:"Field",name:{kind:"Name",value:"parent"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"priority"}},{kind:"Field",name:{kind:"Name",value:"project"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"autoArchivedAt"}},{kind:"Field",name:{kind:"Name",value:"autoClosedAt"}},{kind:"Field",name:{kind:"Name",value:"canceledAt"}},{kind:"Field",name:{kind:"Name",value:"completedAt"}},{kind:"Field",name:{kind:"Name",value:"startedAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"assignee"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"state"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},Kn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Issue"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Gn.definitions,...Ki.definitions]},$n={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueDescriptionHistory"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueDescriptionHistory"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"actorId"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"descriptionData"}},{kind:"Field",name:{kind:"Name",value:"type"}}]}}]},Jn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueDescriptionHistoryPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueDescriptionHistoryPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"history"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueDescriptionHistory"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...$n.definitions]},Zn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueRelationHistoryPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueRelationHistoryPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"identifier"}},{kind:"Field",name:{kind:"Name",value:"type"}}]}}]},Yn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueHistory"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueHistory"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"relationChanges"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueRelationHistoryPayload"}}]}},{kind:"Field",name:{kind:"Name",value:"addedLabelIds"}},{kind:"Field",name:{kind:"Name",value:"removedLabelIds"}},{kind:"Field",name:{kind:"Name",value:"source"}},{kind:"Field",name:{kind:"Name",value:"issue"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"toCycle"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"toParent"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"toProject"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"toState"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"fromCycle"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"fromParent"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"fromProject"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"fromState"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"fromTeam"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"toTeam"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"fromAssignee"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"toAssignee"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"actor"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"fromDueDate"}},{kind:"Field",name:{kind:"Name",value:"toDueDate"}},{kind:"Field",name:{kind:"Name",value:"fromEstimate"}},{kind:"Field",name:{kind:"Name",value:"toEstimate"}},{kind:"Field",name:{kind:"Name",value:"fromPriority"}},{kind:"Field",name:{kind:"Name",value:"toPriority"}},{kind:"Field",name:{kind:"Name",value:"fromTitle"}},{kind:"Field",name:{kind:"Name",value:"toTitle"}},{kind:"Field",name:{kind:"Name",value:"archived"}},{kind:"Field",name:{kind:"Name",value:"updatedDescription"}},{kind:"Field",name:{kind:"Name",value:"autoArchived"}},{kind:"Field",name:{kind:"Name",value:"autoClosed"}}]}},...Zn.definitions]},Xn={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueHistoryConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueHistoryConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueHistory"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Yn.definitions,...Ki.definitions]},ea={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueImport"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueImport"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"mapping"}},{kind:"Field",name:{kind:"Name",value:"creatorId"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"service"}},{kind:"Field",name:{kind:"Name",value:"status"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"error"}}]}}]},ia={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueImportDeletePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueImportDeletePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"issueImport"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueImport"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...ea.definitions]},na={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueImportPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueImportPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"issueImport"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueImport"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...ea.definitions]},aa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueLabel"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueLabel"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"color"}},{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},ta={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueLabelConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueLabelConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueLabel"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...aa.definitions,...Ki.definitions]},da={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueLabelPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueLabelPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"issueLabel"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},la={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssuePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssuePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"issue"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},oa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssuePriorityValue"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssuePriorityValue"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"label"}},{kind:"Field",name:{kind:"Name",value:"priority"}}]}}]},ra={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueRelation"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueRelation"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issue"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"relatedIssue"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"type"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},sa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueRelationConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueRelationConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueRelation"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...ra.definitions,...Ki.definitions]},ua={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"IssueRelationPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"IssueRelationPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"issueRelation"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},ma={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Milestone"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Milestone"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"sortOrder"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},ka={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"MilestoneConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"MilestoneConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Milestone"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...ma.definitions,...Ki.definitions]},va={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"MilestonePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"MilestonePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"milestone"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},ca={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Notification"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Notification"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"reactionEmoji"}},{kind:"Field",name:{kind:"Name",value:"type"}},{kind:"Field",name:{kind:"Name",value:"comment"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"issue"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"user"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"emailedAt"}},{kind:"Field",name:{kind:"Name",value:"readAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"snoozedUntilAt"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},pa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"NotificationConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"NotificationConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Notification"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...ca.definitions,...Ki.definitions]},Na={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"NotificationPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"NotificationPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"notification"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},ha={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"NotificationSubscription"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"NotificationSubscription"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"project"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"type"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"user"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},fa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"NotificationSubscriptionConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"NotificationSubscriptionConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"NotificationSubscription"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...ha.definitions,...Ki.definitions]},ba={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"NotificationSubscriptionPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"NotificationSubscriptionPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"notificationSubscription"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},ya={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OauthClient"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OauthClient"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"imageUrl"}},{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"redirectUris"}},{kind:"Field",name:{kind:"Name",value:"developer"}},{kind:"Field",name:{kind:"Name",value:"clientId"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"clientSecret"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"developerUrl"}},{kind:"Field",name:{kind:"Name",value:"publicEnabled"}}]}}]},Sa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OauthClientPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OauthClientPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"oauthClient"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OauthClient"}}]}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...ya.definitions]},ga={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OauthTokenRevokePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OauthTokenRevokePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Da={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OrganizationCancelDeletePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OrganizationCancelDeletePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Va={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OrganizationDeletePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OrganizationDeletePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Fa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OrganizationDomain"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OrganizationDomain"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"verificationEmail"}},{kind:"Field",name:{kind:"Name",value:"verified"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},Aa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OrganizationDomainPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OrganizationDomainPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"organizationDomain"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationDomain"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...Fa.definitions]},_a={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OrganizationExistsPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OrganizationExistsPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}},{kind:"Field",name:{kind:"Name",value:"exists"}}]}}]},Ta={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OrganizationInvite"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OrganizationInvite"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"external"}},{kind:"Field",name:{kind:"Name",value:"email"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"acceptedAt"}},{kind:"Field",name:{kind:"Name",value:"expiresAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"inviter"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"invitee"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},Ia={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OrganizationInviteConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OrganizationInviteConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationInvite"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Ta.definitions,...Ki.definitions]},wa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OrganizationInvitePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OrganizationInvitePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"organizationInvite"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationInvite"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...Ta.definitions]},qa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OrganizationPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OrganizationPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},xa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Project"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Project"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"targetDate"}},{kind:"Field",name:{kind:"Name",value:"icon"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"milestone"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"completedScopeHistory"}},{kind:"Field",name:{kind:"Name",value:"completedIssueCountHistory"}},{kind:"Field",name:{kind:"Name",value:"lead"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"color"}},{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"slugId"}},{kind:"Field",name:{kind:"Name",value:"sortOrder"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"autoArchivedAt"}},{kind:"Field",name:{kind:"Name",value:"canceledAt"}},{kind:"Field",name:{kind:"Name",value:"completedAt"}},{kind:"Field",name:{kind:"Name",value:"startedAt"}},{kind:"Field",name:{kind:"Name",value:"scopeHistory"}},{kind:"Field",name:{kind:"Name",value:"issueCountHistory"}},{kind:"Field",name:{kind:"Name",value:"state"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"slackIssueComments"}},{kind:"Field",name:{kind:"Name",value:"slackNewIssue"}},{kind:"Field",name:{kind:"Name",value:"slackIssueStatuses"}}]}}]},Ca={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ProjectConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ProjectConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Project"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...xa.definitions,...Ki.definitions]},Oa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ProjectLink"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ProjectLink"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"label"}},{kind:"Field",name:{kind:"Name",value:"project"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},Pa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ProjectLinkConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ProjectLinkConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ProjectLink"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Oa.definitions,...Ki.definitions]},ja={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ProjectLinkPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ProjectLinkPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"projectLink"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Ua={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ProjectPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ProjectPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"project"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Ba={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"PushSubscription"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"PushSubscription"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},Ea={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"PushSubscriptionConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"PushSubscriptionConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PushSubscription"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Ba.definitions,...Ki.definitions]},Ra={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"PushSubscriptionPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"PushSubscriptionPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},za={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"PushSubscriptionTestPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"PushSubscriptionTestPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},La={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Reaction"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Reaction"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"emoji"}},{kind:"Field",name:{kind:"Name",value:"comment"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"user"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}}]}}]},Ma={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ReactionConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ReactionConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Reaction"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...La.definitions,...Ki.definitions]},Wa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ReactionPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ReactionPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"reaction"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Qa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"RotateSecretPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"RotateSecretPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Ha={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ArchiveResponse"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ArchiveResponse"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"archive"}},{kind:"Field",name:{kind:"Name",value:"totalCount"}},{kind:"Field",name:{kind:"Name",value:"databaseVersion"}}]}}]},Ga={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SearchResultPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SearchResultPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueIds"}},{kind:"Field",name:{kind:"Name",value:"archivePayload"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchiveResponse"}}]}},{kind:"Field",name:{kind:"Name",value:"totalCount"}}]}},...Ha.definitions]},Ka={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SsoUrlFromEmailResponse"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SsoUrlFromEmailResponse"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"samlSsoUrl"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},$a={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SubscriptionPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SubscriptionPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"canceledAt"}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Ja={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SubscriptionSessionPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SubscriptionSessionPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"session"}}]}}]},Za={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Team"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Team"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycleIssueAutoAssignCompleted"}},{kind:"Field",name:{kind:"Name",value:"cycleIssueAutoAssignStarted"}},{kind:"Field",name:{kind:"Name",value:"cycleCalenderUrl"}},{kind:"Field",name:{kind:"Name",value:"upcomingCycleCount"}},{kind:"Field",name:{kind:"Name",value:"cycleLockToActive"}},{kind:"Field",name:{kind:"Name",value:"autoArchivePeriod"}},{kind:"Field",name:{kind:"Name",value:"autoClosePeriod"}},{kind:"Field",name:{kind:"Name",value:"activeCycle"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"autoCloseStateId"}},{kind:"Field",name:{kind:"Name",value:"cycleCooldownTime"}},{kind:"Field",name:{kind:"Name",value:"cycleStartDay"}},{kind:"Field",name:{kind:"Name",value:"defaultTemplateForMembersId"}},{kind:"Field",name:{kind:"Name",value:"defaultTemplateForNonMembersId"}},{kind:"Field",name:{kind:"Name",value:"defaultIssueState"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"cycleDuration"}},{kind:"Field",name:{kind:"Name",value:"issueEstimationType"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"key"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"timezone"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"mergeWorkflowState"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"draftWorkflowState"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"startWorkflowState"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"reviewWorkflowState"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"markedAsDuplicateWorkflowState"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"triageIssueState"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"inviteHash"}},{kind:"Field",name:{kind:"Name",value:"defaultIssueEstimate"}},{kind:"Field",name:{kind:"Name",value:"issueOrderingNoPriorityFirst"}},{kind:"Field",name:{kind:"Name",value:"private"}},{kind:"Field",name:{kind:"Name",value:"cyclesEnabled"}},{kind:"Field",name:{kind:"Name",value:"issueEstimationExtended"}},{kind:"Field",name:{kind:"Name",value:"issueEstimationAllowZero"}},{kind:"Field",name:{kind:"Name",value:"groupIssueHistory"}},{kind:"Field",name:{kind:"Name",value:"slackIssueComments"}},{kind:"Field",name:{kind:"Name",value:"slackNewIssue"}},{kind:"Field",name:{kind:"Name",value:"slackIssueStatuses"}},{kind:"Field",name:{kind:"Name",value:"triageEnabled"}}]}}]},Ya={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"TeamConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"TeamConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Team"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Za.definitions,...Ki.definitions]},Xa={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"TeamMembership"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"TeamMembership"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"user"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"owner"}}]}}]},et={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"TeamMembershipConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"TeamMembershipConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamMembership"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Xa.definitions,...Ki.definitions]},it={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"TeamMembershipPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"TeamMembershipPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"teamMembership"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},nt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"TeamPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"TeamPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},at={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"TemplateConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"TemplateConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Ki.definitions]},tt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"TemplatePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"TemplatePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"template"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},dt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UploadFileHeader"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UploadFileHeader"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"}},{kind:"Field",name:{kind:"Name",value:"value"}}]}}]},lt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UploadFile"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UploadFile"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"assetUrl"}},{kind:"Field",name:{kind:"Name",value:"contentType"}},{kind:"Field",name:{kind:"Name",value:"filename"}},{kind:"Field",name:{kind:"Name",value:"uploadUrl"}},{kind:"Field",name:{kind:"Name",value:"size"}},{kind:"Field",name:{kind:"Name",value:"headers"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UploadFileHeader"}}]}},{kind:"Field",name:{kind:"Name",value:"metaData"}}]}},...dt.definitions]},ot={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UploadPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UploadPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uploadFile"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UploadFile"}}]}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...lt.definitions]},rt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UserAdminPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UserAdminPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},st={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UserConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UserConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"User"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...Ci.definitions,...Ki.definitions]},ut={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UserPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UserPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"user"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},mt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UserSettingsFlagPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UserSettingsFlagPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"flag"}},{kind:"Field",name:{kind:"Name",value:"value"}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},kt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UserSettingsFlagsResetPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UserSettingsFlagsResetPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},vt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UserSettingsPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UserSettingsPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},ct={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"UserSubscribeToNewsletterPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"UserSubscribeToNewsletterPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},pt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ViewPreferences"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ViewPreferences"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"type"}},{kind:"Field",name:{kind:"Name",value:"viewType"}}]}}]},Nt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"ViewPreferencesPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"ViewPreferencesPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"viewPreferences"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ViewPreferences"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}},...pt.definitions]},ht={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Webhook"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Webhook"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"secret"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"resourceTypes"}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}},{kind:"Field",name:{kind:"Name",value:"creator"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"url"}},{kind:"Field",name:{kind:"Name",value:"label"}},{kind:"Field",name:{kind:"Name",value:"enabled"}}]}}]},ft={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"WebhookConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"WebhookConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Webhook"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...ht.definitions,...Ki.definitions]},bt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"WebhookPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"WebhookPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"webhook"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},yt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"WorkflowState"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"WorkflowState"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"position"}},{kind:"Field",name:{kind:"Name",value:"color"}},{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"team"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"type"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},St={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"WorkflowStateConnection"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"WorkflowStateConnection"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"nodes"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"WorkflowState"}}]}},{kind:"Field",name:{kind:"Name",value:"pageInfo"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PageInfo"}}]}}]}},...yt.definitions,...Ki.definitions]},gt={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"WorkflowStatePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"WorkflowStatePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"workflowState"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"}}]}},{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},Dt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"apiKeys"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"apiKeys"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ApiKeyConnection"}}]}}]}},...$i.definitions]},Vt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"applicationWithAuthorization"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"clientId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"scope"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"applicationWithAuthorization"},arguments:[{kind:"Argument",name:{kind:"Name",value:"clientId"},value:{kind:"Variable",name:{kind:"Name",value:"clientId"}}},{kind:"Argument",name:{kind:"Name",value:"redirectUri"},value:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}}},{kind:"Argument",name:{kind:"Name",value:"scope"},value:{kind:"Variable",name:{kind:"Name",value:"scope"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserAuthorizedApplication"}}]}}]}},...Ei.definitions]},Ft={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachment"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachment"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Attachment"}}]}}]}},...Yi.definitions]},At={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachmentIssue"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentIssue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Issue"}}]}}]}},...Gn.definitions]},_t={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachmentIssue_attachments"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentIssue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachments"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AttachmentConnection"}}]}}]}}]}},...Xi.definitions]},Tt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachmentIssue_children"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentIssue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"children"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},It={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachmentIssue_comments"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentIssue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"comments"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CommentConnection"}}]}}]}}]}},...mn.definitions]},wt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachmentIssue_history"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentIssue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"history"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueHistoryConnection"}}]}}]}}]}},...Xn.definitions]},qt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachmentIssue_inverseRelations"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentIssue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"inverseRelations"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueRelationConnection"}}]}}]}}]}},...sa.definitions]},xt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachmentIssue_labels"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentIssue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"labels"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueLabelConnection"}}]}}]}}]}},...ta.definitions]},Ct={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachmentIssue_relations"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentIssue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"relations"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueRelationConnection"}}]}}]}}]}},...sa.definitions]},Ot={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachmentIssue_subscribers"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentIssue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"subscribers"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"includeDisabled"},value:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserConnection"}}]}}]}}]}},...st.definitions]},Pt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachments"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachments"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AttachmentConnection"}}]}}]}},...Xi.definitions]},jt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"attachmentsForURL"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"url"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentsForURL"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}},{kind:"Argument",name:{kind:"Name",value:"url"},value:{kind:"Variable",name:{kind:"Name",value:"url"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AttachmentConnection"}}]}}]}},...Xi.definitions]},Ut={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"authorizedApplications"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"authorizedApplications"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AuthorizedApplication"}}]}}]}},...Bi.definitions]},Bt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"availableUsers"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"availableUsers"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AuthResolverResponse"}}]}}]}},...an.definitions]},Et={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"billingDetails"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"billingDetails"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"BillingDetailsPayload"}}]}}]}},...ln.definitions]},Rt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"billingDetails_paymentMethod"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"billingDetails"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"paymentMethod"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Card"}}]}}]}}]}},...dn.definitions]},zt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"collaborativeDocumentJoin"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"clientId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"issueId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"version"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"collaborativeDocumentJoin"},arguments:[{kind:"Argument",name:{kind:"Name",value:"clientId"},value:{kind:"Variable",name:{kind:"Name",value:"clientId"}}},{kind:"Argument",name:{kind:"Name",value:"issueId"},value:{kind:"Variable",name:{kind:"Name",value:"issueId"}}},{kind:"Argument",name:{kind:"Name",value:"version"},value:{kind:"Variable",name:{kind:"Name",value:"version"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CollaborationDocumentUpdatePayload"}}]}}]}},...sn.definitions]},Lt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"collaborativeDocumentJoin_steps"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"clientId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"issueId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"version"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"collaborativeDocumentJoin"},arguments:[{kind:"Argument",name:{kind:"Name",value:"clientId"},value:{kind:"Variable",name:{kind:"Name",value:"clientId"}}},{kind:"Argument",name:{kind:"Name",value:"issueId"},value:{kind:"Variable",name:{kind:"Name",value:"issueId"}}},{kind:"Argument",name:{kind:"Name",value:"version"},value:{kind:"Variable",name:{kind:"Name",value:"version"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"steps"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"StepsResponse"}}]}}]}}]}},...rn.definitions]},Mt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"comment"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"comment"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Comment"}}]}}]}},...un.definitions]},Wt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"comments"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"comments"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CommentConnection"}}]}}]}},...mn.definitions]},Qt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"customView"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"customView"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CustomView"}}]}}]}},...Nn.definitions]},Ht={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"customViews"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"customViews"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CustomViewConnection"}}]}}]}},...hn.definitions]},Gt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"cycle"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycle"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Cycle"}}]}}]}},...bn.definitions]},Kt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"cycle_issues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycle"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},$t={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"cycle_uncompletedIssuesUponClose"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycle"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uncompletedIssuesUponClose"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},Jt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"cycles"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycles"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CycleConnection"}}]}}]}},...yn.definitions]},Zt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"emoji"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"emoji"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Emoji"}}]}}]}},...Fn.definitions]},Yt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"emojis"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"emojis"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"EmojiConnection"}}]}}]}},...An.definitions]},Xt={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"favorite"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"favorite"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Favorite"}}]}}]}},...In.definitions]},ed={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"favorites"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"favorites"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"FavoriteConnection"}}]}}]}},...wn.definitions]},id={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"figmaEmbedInfo"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"fileId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"nodeId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"figmaEmbedInfo"},arguments:[{kind:"Argument",name:{kind:"Name",value:"fileId"},value:{kind:"Variable",name:{kind:"Name",value:"fileId"}}},{kind:"Argument",name:{kind:"Name",value:"nodeId"},value:{kind:"Variable",name:{kind:"Name",value:"nodeId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"FigmaEmbedPayload"}}]}}]}},...On.definitions]},nd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"figmaEmbedInfo_figmaEmbed"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"fileId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"nodeId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"figmaEmbedInfo"},arguments:[{kind:"Argument",name:{kind:"Name",value:"fileId"},value:{kind:"Variable",name:{kind:"Name",value:"fileId"}}},{kind:"Argument",name:{kind:"Name",value:"nodeId"},value:{kind:"Variable",name:{kind:"Name",value:"nodeId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"figmaEmbed"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"FigmaEmbed"}}]}}]}}]}},...Cn.definitions]},ad={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"integration"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integration"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Integration"}}]}}]}},...jn.definitions]},td={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"integrations"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrations"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationConnection"}}]}}]}},...Un.definitions]},dd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"inviteInfo"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"teamHash"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"userHash"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"inviteInfo"},arguments:[{kind:"Argument",name:{kind:"Name",value:"teamHash"},value:{kind:"Variable",name:{kind:"Name",value:"teamHash"}}},{kind:"Argument",name:{kind:"Name",value:"userHash"},value:{kind:"Variable",name:{kind:"Name",value:"userHash"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"InvitePagePayload"}}]}}]}},...Hn.definitions]},ld={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"inviteInfo_inviteData"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"teamHash"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"userHash"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"inviteInfo"},arguments:[{kind:"Argument",name:{kind:"Name",value:"teamHash"},value:{kind:"Variable",name:{kind:"Name",value:"teamHash"}}},{kind:"Argument",name:{kind:"Name",value:"userHash"},value:{kind:"Variable",name:{kind:"Name",value:"userHash"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"inviteData"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"InviteData"}}]}}]}}]}},...Qn.definitions]},od={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issue"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Issue"}}]}}]}},...Gn.definitions]},rd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issue_attachments"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachments"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AttachmentConnection"}}]}}]}}]}},...Xi.definitions]},sd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issue_children"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"children"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},ud={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issue_comments"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"comments"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CommentConnection"}}]}}]}}]}},...mn.definitions]},md={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issue_history"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"history"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueHistoryConnection"}}]}}]}}]}},...Xn.definitions]},kd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issue_inverseRelations"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"inverseRelations"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueRelationConnection"}}]}}]}}]}},...sa.definitions]},vd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issue_labels"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"labels"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueLabelConnection"}}]}}]}}]}},...ta.definitions]},cd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issue_relations"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"relations"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueRelationConnection"}}]}}]}}]}},...sa.definitions]},pd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issue_subscribers"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issue"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"subscribers"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"includeDisabled"},value:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserConnection"}}]}}]}}]}},...st.definitions]},Nd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issueImportFinishGithubOAuth"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueImportFinishGithubOAuth"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"GithubOAuthTokenPayload"}}]}}]}},...Ui.definitions]},hd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issueLabel"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueLabel"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueLabel"}}]}}]}},...aa.definitions]},fd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issueLabel_issues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueLabel"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},bd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issueLabels"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueLabels"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueLabelConnection"}}]}}]}},...ta.definitions]},yd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issuePriorityValues"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issuePriorityValues"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssuePriorityValue"}}]}}]}},...oa.definitions]},Sd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issueRelation"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueRelation"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueRelation"}}]}}]}},...ra.definitions]},gd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issueRelations"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueRelations"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueRelationConnection"}}]}}]}},...sa.definitions]},Dd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issueSearch"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"query"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueSearch"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}},{kind:"Argument",name:{kind:"Name",value:"query"},value:{kind:"Variable",name:{kind:"Name",value:"query"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}},...Kn.definitions]},Vd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"issues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}},...Kn.definitions]},Fd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"milestone"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"milestone"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Milestone"}}]}}]}},...ma.definitions]},Ad={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"milestone_projects"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"milestone"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projects"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ProjectConnection"}}]}}]}}]}},...Ca.definitions]},_d={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"milestones"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"milestones"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"MilestoneConnection"}}]}}]}},...ka.definitions]},Td={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"notification"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"notification"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Notification"}}]}}]}},...ca.definitions]},Id={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"notificationSubscription"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"notificationSubscription"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"NotificationSubscription"}}]}}]}},...ha.definitions]},wd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"notificationSubscriptions"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"notificationSubscriptions"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"NotificationSubscriptionConnection"}}]}}]}},...fa.definitions]},qd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"notifications"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"notifications"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"NotificationConnection"}}]}}]}},...pa.definitions]},xd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"organization"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organization"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Organization"}}]}}]}},...nn.definitions]},Cd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"organization_integrations"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organization"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrations"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationConnection"}}]}}]}}]}},...Un.definitions]},Od={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"organization_milestones"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organization"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"milestones"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"MilestoneConnection"}}]}}]}}]}},...ka.definitions]},Pd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"organization_teams"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organization"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teams"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamConnection"}}]}}]}}]}},...Ya.definitions]},jd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"organization_users"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organization"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"users"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"includeDisabled"},value:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserConnection"}}]}}]}}]}},...st.definitions]},Ud={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"organizationExists"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"urlKey"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationExists"},arguments:[{kind:"Argument",name:{kind:"Name",value:"urlKey"},value:{kind:"Variable",name:{kind:"Name",value:"urlKey"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationExistsPayload"}}]}}]}},..._a.definitions]},Bd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"organizationInvite"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationInvite"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueLabel"}}]}}]}},...aa.definitions]},Ed={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"organizationInvite_issues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationInvite"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},Rd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"organizationInvites"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationInvites"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationInviteConnection"}}]}}]}},...Ia.definitions]},zd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"project"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"project"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Project"}}]}}]}},...xa.definitions]},Ld={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"project_issues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"project"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},Md={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"project_links"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"project"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"links"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ProjectLinkConnection"}}]}}]}}]}},...Pa.definitions]},Wd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"project_members"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"project"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"members"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"includeDisabled"},value:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserConnection"}}]}}]}}]}},...st.definitions]},Qd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"project_teams"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"project"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teams"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamConnection"}}]}}]}}]}},...Ya.definitions]},Hd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"projectLink"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projectLink"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ProjectLink"}}]}}]}},...Oa.definitions]},Gd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"projectLinks"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projectLinks"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ProjectLinkConnection"}}]}}]}},...Pa.definitions]},Kd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"projects"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projects"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ProjectConnection"}}]}}]}},...Ca.definitions]},$d={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"pushSubscriptionTest"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"pushSubscriptionTest"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PushSubscriptionTestPayload"}}]}}]}},...za.definitions]},Jd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"reaction"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"reaction"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Reaction"}}]}}]}},...La.definitions]},Zd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"reactions"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"reactions"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ReactionConnection"}}]}}]}},...Ma.definitions]},Yd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"ssoUrlFromEmail"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"email"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"isDesktop"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"ssoUrlFromEmail"},arguments:[{kind:"Argument",name:{kind:"Name",value:"email"},value:{kind:"Variable",name:{kind:"Name",value:"email"}}},{kind:"Argument",name:{kind:"Name",value:"isDesktop"},value:{kind:"Variable",name:{kind:"Name",value:"isDesktop"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"SsoUrlFromEmailResponse"}}]}}]}},...Ka.definitions]},Xd={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"subscription"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"subscription"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Subscription"}}]}}]}},...Hi.definitions]},el={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"team"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"team"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Team"}}]}}]}},...Za.definitions]},il={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"team_cycles"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"team"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycles"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CycleConnection"}}]}}]}}]}},...yn.definitions]},nl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"team_issues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"team"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},al={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"team_labels"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"team"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"labels"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueLabelConnection"}}]}}]}}]}},...ta.definitions]},tl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"team_members"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"team"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"members"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"includeDisabled"},value:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserConnection"}}]}}]}}]}},...st.definitions]},dl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"team_memberships"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"team"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"memberships"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamMembershipConnection"}}]}}]}}]}},...et.definitions]},ll={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"team_projects"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"team"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projects"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ProjectConnection"}}]}}]}}]}},...Ca.definitions]},ol={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"team_states"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"team"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"states"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"WorkflowStateConnection"}}]}}]}}]}},...St.definitions]},rl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"team_templates"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"team"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"templates"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TemplateConnection"}}]}}]}}]}},...at.definitions]},sl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"team_webhooks"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"team"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"webhooks"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"WebhookConnection"}}]}}]}}]}},...ft.definitions]},ul={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"teamMembership"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamMembership"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamMembership"}}]}}]}},...Xa.definitions]},ml={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"teamMemberships"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamMemberships"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamMembershipConnection"}}]}}]}},...et.definitions]},kl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"teams"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teams"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamConnection"}}]}}]}},...Ya.definitions]},vl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"template"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"template"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Template"}}]}}]}},...xi.definitions]},cl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"templates"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"templates"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Template"}}]}}]}},...xi.definitions]},pl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"user"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"user"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"User"}}]}}]}},...Ci.definitions]},Nl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"user_assignedIssues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"user"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"assignedIssues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},hl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"user_createdIssues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"user"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"createdIssues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},fl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"user_teamMemberships"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"user"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamMemberships"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamMembershipConnection"}}]}}]}}]}},...et.definitions]},bl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"user_teams"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"user"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teams"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamConnection"}}]}}]}}]}},...Ya.definitions]},yl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"userSettings"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userSettings"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserSettings"}}]}}]}},...Qi.definitions]},Sl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"users"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"users"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"includeDisabled"},value:{kind:"Variable",name:{kind:"Name",value:"includeDisabled"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserConnection"}}]}}]}},...st.definitions]},gl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"viewer"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"viewer"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"User"}}]}}]}},...Ci.definitions]},Dl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"viewer_assignedIssues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"viewer"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"assignedIssues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},Vl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"viewer_createdIssues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"viewer"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"createdIssues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},Fl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"viewer_teamMemberships"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"viewer"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamMemberships"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamMembershipConnection"}}]}}]}}]}},...et.definitions]},Al={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"viewer_teams"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"viewer"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teams"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamConnection"}}]}}]}}]}},...Ya.definitions]},_l={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"webhook"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"webhook"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"Webhook"}}]}}]}},...ht.definitions]},Tl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"webhooks"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"webhooks"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"WebhookConnection"}}]}}]}},...ft.definitions]},Il={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"workflowState"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"workflowState"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"WorkflowState"}}]}}]}},...yt.definitions]},wl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"workflowState_issues"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"workflowState"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issues"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueConnection"}}]}}]}}]}},...Kn.definitions]},ql={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"workflowStates"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"after"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"before"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"first"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"last"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"orderBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"PaginationOrderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"workflowStates"},arguments:[{kind:"Argument",name:{kind:"Name",value:"after"},value:{kind:"Variable",name:{kind:"Name",value:"after"}}},{kind:"Argument",name:{kind:"Name",value:"before"},value:{kind:"Variable",name:{kind:"Name",value:"before"}}},{kind:"Argument",name:{kind:"Name",value:"first"},value:{kind:"Variable",name:{kind:"Name",value:"first"}}},{kind:"Argument",name:{kind:"Name",value:"includeArchived"},value:{kind:"Variable",name:{kind:"Name",value:"includeArchived"}}},{kind:"Argument",name:{kind:"Name",value:"last"},value:{kind:"Variable",name:{kind:"Name",value:"last"}}},{kind:"Argument",name:{kind:"Name",value:"orderBy"},value:{kind:"Variable",name:{kind:"Name",value:"orderBy"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"WorkflowStateConnection"}}]}}]}},...St.definitions]},xl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"apiKeyCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ApiKeyCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"apiKeyCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ApiKeyPayload"}}]}}]}},...Ji.definitions]},Cl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"apiKeyDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"apiKeyDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Ol={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"attachmentArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Pl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"attachmentCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"AttachmentCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AttachmentPayload"}}]}}]}},...en.definitions]},jl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"attachmentDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Ul={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"attachmentLinkFront"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"conversationId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"issueId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentLinkFront"},arguments:[{kind:"Argument",name:{kind:"Name",value:"conversationId"},value:{kind:"Variable",name:{kind:"Name",value:"conversationId"}}},{kind:"Argument",name:{kind:"Name",value:"issueId"},value:{kind:"Variable",name:{kind:"Name",value:"issueId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AttachmentPayload"}}]}}]}},...en.definitions]},Bl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"attachmentLinkIntercom"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"conversationId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"issueId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentLinkIntercom"},arguments:[{kind:"Argument",name:{kind:"Name",value:"conversationId"},value:{kind:"Variable",name:{kind:"Name",value:"conversationId"}}},{kind:"Argument",name:{kind:"Name",value:"issueId"},value:{kind:"Variable",name:{kind:"Name",value:"issueId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AttachmentPayload"}}]}}]}},...en.definitions]},El={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"attachmentLinkURL"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"issueId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"url"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentLinkURL"},arguments:[{kind:"Argument",name:{kind:"Name",value:"issueId"},value:{kind:"Variable",name:{kind:"Name",value:"issueId"}}},{kind:"Argument",name:{kind:"Name",value:"url"},value:{kind:"Variable",name:{kind:"Name",value:"url"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AttachmentPayload"}}]}}]}},...en.definitions]},Rl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"attachmentLinkZendesk"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"issueId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"ticketId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentLinkZendesk"},arguments:[{kind:"Argument",name:{kind:"Name",value:"issueId"},value:{kind:"Variable",name:{kind:"Name",value:"issueId"}}},{kind:"Argument",name:{kind:"Name",value:"ticketId"},value:{kind:"Variable",name:{kind:"Name",value:"ticketId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AttachmentPayload"}}]}}]}},...en.definitions]},zl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"attachmentUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"AttachmentUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"attachmentUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AttachmentPayload"}}]}}]}},...en.definitions]},Ll={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"billingEmailUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"BillingEmailUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"billingEmailUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"BillingEmailPayload"}}]}}]}},...on.definitions]},Ml={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"collaborativeDocumentUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CollaborationDocumentUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"collaborativeDocumentUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CollaborationDocumentUpdatePayload"}}]}}]}},...sn.definitions]},Wl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"commentCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CommentCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"commentCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CommentPayload"}}]}}]}},...kn.definitions]},Ql={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"commentDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"commentDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Hl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"commentUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CommentUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"commentUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CommentPayload"}}]}}]}},...kn.definitions]},Gl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"contactCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ContactCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"contactCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ContactPayload"}}]}}]}},...vn.definitions]},Kl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"createCsvExportReport"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"includePrivateTeamIds"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"createCsvExportReport"},arguments:[{kind:"Argument",name:{kind:"Name",value:"includePrivateTeamIds"},value:{kind:"Variable",name:{kind:"Name",value:"includePrivateTeamIds"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CreateCsvExportReportPayload"}}]}}]}},...cn.definitions]},$l={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"createOrganizationFromOnboarding"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CreateOrganizationInput"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"survey"}},type:{kind:"NamedType",name:{kind:"Name",value:"OnboardingCustomerSurvey"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"createOrganizationFromOnboarding"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}},{kind:"Argument",name:{kind:"Name",value:"survey"},value:{kind:"Variable",name:{kind:"Name",value:"survey"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CreateOrJoinOrganizationResponse"}}]}}]}},...pn.definitions]},Jl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"customViewCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CustomViewCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"customViewCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CustomViewPayload"}}]}}]}},...fn.definitions]},Zl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"customViewDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"customViewDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Yl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"customViewUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CustomViewUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"customViewUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CustomViewPayload"}}]}}]}},...fn.definitions]},Xl={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"cycleArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycleArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},eo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"cycleCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CycleCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycleCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CyclePayload"}}]}}]}},...Sn.definitions]},io={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"cycleUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"CycleUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"cycleUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CyclePayload"}}]}}]}},...Sn.definitions]},no={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"debugCreateSAMLOrg"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"debugCreateSAMLOrg"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"DebugPayload"}}]}}]}},...gn.definitions]},ao={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"debugFailWithInternalError"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"debugFailWithInternalError"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"DebugPayload"}}]}}]}},...gn.definitions]},to={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"debugFailWithWarning"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"debugFailWithWarning"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"DebugPayload"}}]}}]}},...gn.definitions]},lo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"emailTokenUserAccountAuth"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"TokenUserAccountAuthInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"emailTokenUserAccountAuth"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AuthResolverResponse"}}]}}]}},...an.definitions]},oo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"emailUnsubscribe"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"EmailUnsubscribeInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"emailUnsubscribe"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"EmailUnsubscribePayload"}}]}}]}},...Dn.definitions]},ro={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"emailUserAccountAuthChallenge"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"EmailUserAccountAuthChallengeInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"emailUserAccountAuthChallenge"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"EmailUserAccountAuthChallengeResponse"}}]}}]}},...Vn.definitions]},so={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"emojiCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"EmojiCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"emojiCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"EmojiPayload"}}]}}]}},..._n.definitions]},uo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"emojiDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"emojiDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},mo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"eventCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"EventCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"eventCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"EventPayload"}}]}}]}},...Tn.definitions]},ko={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"favoriteCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FavoriteCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"favoriteCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"FavoritePayload"}}]}}]}},...qn.definitions]},vo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"favoriteDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"favoriteDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},co={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"favoriteUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FavoriteUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"favoriteUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"FavoritePayload"}}]}}]}},...qn.definitions]},po={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"feedbackCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FeedbackCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"feedbackCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"FeedbackPayload"}}]}}]}},...xn.definitions]},No={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"fileUpload"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"contentType"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"filename"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"metaData"}},type:{kind:"NamedType",name:{kind:"Name",value:"JSON"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"size"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"fileUpload"},arguments:[{kind:"Argument",name:{kind:"Name",value:"contentType"},value:{kind:"Variable",name:{kind:"Name",value:"contentType"}}},{kind:"Argument",name:{kind:"Name",value:"filename"},value:{kind:"Variable",name:{kind:"Name",value:"filename"}}},{kind:"Argument",name:{kind:"Name",value:"metaData"},value:{kind:"Variable",name:{kind:"Name",value:"metaData"}}},{kind:"Argument",name:{kind:"Name",value:"size"},value:{kind:"Variable",name:{kind:"Name",value:"size"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UploadPayload"}}]}}]}},...ot.definitions]},ho={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"googleUserAccountAuth"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"GoogleUserAccountAuthInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"googleUserAccountAuth"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AuthResolverResponse"}}]}}]}},...an.definitions]},fo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"imageUploadFromUrl"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"url"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"imageUploadFromUrl"},arguments:[{kind:"Argument",name:{kind:"Name",value:"url"},value:{kind:"Variable",name:{kind:"Name",value:"url"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ImageUploadFromUrlPayload"}}]}}]}},...Pn.definitions]},bo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},yo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationFigma"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationFigma"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}},{kind:"Argument",name:{kind:"Name",value:"redirectUri"},value:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},So={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationFront"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationFront"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}},{kind:"Argument",name:{kind:"Name",value:"redirectUri"},value:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},go={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationGithubConnect"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"installationId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationGithubConnect"},arguments:[{kind:"Argument",name:{kind:"Name",value:"installationId"},value:{kind:"Variable",name:{kind:"Name",value:"installationId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},Do={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationGitlabConnect"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"accessToken"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"gitlabUrl"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationGitlabConnect"},arguments:[{kind:"Argument",name:{kind:"Name",value:"accessToken"},value:{kind:"Variable",name:{kind:"Name",value:"accessToken"}}},{kind:"Argument",name:{kind:"Name",value:"gitlabUrl"},value:{kind:"Variable",name:{kind:"Name",value:"gitlabUrl"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},Vo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationGoogleSheets"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationGoogleSheets"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},Fo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationIntercom"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationIntercom"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}},{kind:"Argument",name:{kind:"Name",value:"redirectUri"},value:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},Ao={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationIntercomDelete"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationIntercomDelete"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},_o={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationResourceArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationResourceArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},To={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationSentryConnect"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"installationId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"organizationSlug"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationSentryConnect"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}},{kind:"Argument",name:{kind:"Name",value:"installationId"},value:{kind:"Variable",name:{kind:"Name",value:"installationId"}}},{kind:"Argument",name:{kind:"Name",value:"organizationSlug"},value:{kind:"Variable",name:{kind:"Name",value:"organizationSlug"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},Io={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationSlack"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"shouldUseV2Auth"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationSlack"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}},{kind:"Argument",name:{kind:"Name",value:"redirectUri"},value:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}}},{kind:"Argument",name:{kind:"Name",value:"shouldUseV2Auth"},value:{kind:"Variable",name:{kind:"Name",value:"shouldUseV2Auth"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},wo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationSlackImportEmojis"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationSlackImportEmojis"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}},{kind:"Argument",name:{kind:"Name",value:"redirectUri"},value:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},qo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationSlackPersonal"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationSlackPersonal"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}},{kind:"Argument",name:{kind:"Name",value:"redirectUri"},value:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},xo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationSlackPost"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"shouldUseV2Auth"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"teamId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationSlackPost"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}},{kind:"Argument",name:{kind:"Name",value:"redirectUri"},value:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}}},{kind:"Argument",name:{kind:"Name",value:"shouldUseV2Auth"},value:{kind:"Variable",name:{kind:"Name",value:"shouldUseV2Auth"}}},{kind:"Argument",name:{kind:"Name",value:"teamId"},value:{kind:"Variable",name:{kind:"Name",value:"teamId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},Co={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationSlackProjectPost"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"projectId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationSlackProjectPost"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}},{kind:"Argument",name:{kind:"Name",value:"projectId"},value:{kind:"Variable",name:{kind:"Name",value:"projectId"}}},{kind:"Argument",name:{kind:"Name",value:"redirectUri"},value:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},Oo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"integrationZendesk"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"code"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"scope"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"subdomain"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"integrationZendesk"},arguments:[{kind:"Argument",name:{kind:"Name",value:"code"},value:{kind:"Variable",name:{kind:"Name",value:"code"}}},{kind:"Argument",name:{kind:"Name",value:"redirectUri"},value:{kind:"Variable",name:{kind:"Name",value:"redirectUri"}}},{kind:"Argument",name:{kind:"Name",value:"scope"},value:{kind:"Variable",name:{kind:"Name",value:"scope"}}},{kind:"Argument",name:{kind:"Name",value:"subdomain"},value:{kind:"Variable",name:{kind:"Name",value:"subdomain"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},Po={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"trash"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"trash"},value:{kind:"Variable",name:{kind:"Name",value:"trash"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},jo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"IssueCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssuePayload"}}]}}]}},...la.definitions]},Uo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Bo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueImportCreateAsana"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"asanaTeamName"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"asanaToken"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"instantProcess"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"teamId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueImportCreateAsana"},arguments:[{kind:"Argument",name:{kind:"Name",value:"asanaTeamName"},value:{kind:"Variable",name:{kind:"Name",value:"asanaTeamName"}}},{kind:"Argument",name:{kind:"Name",value:"asanaToken"},value:{kind:"Variable",name:{kind:"Name",value:"asanaToken"}}},{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"instantProcess"},value:{kind:"Variable",name:{kind:"Name",value:"instantProcess"}}},{kind:"Argument",name:{kind:"Name",value:"teamId"},value:{kind:"Variable",name:{kind:"Name",value:"teamId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueImportPayload"}}]}}]}},...na.definitions]},Eo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueImportCreateClubhouse"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"clubhouseTeamName"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"clubhouseToken"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"instantProcess"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"teamId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueImportCreateClubhouse"},arguments:[{kind:"Argument",name:{kind:"Name",value:"clubhouseTeamName"},value:{kind:"Variable",name:{kind:"Name",value:"clubhouseTeamName"}}},{kind:"Argument",name:{kind:"Name",value:"clubhouseToken"},value:{kind:"Variable",name:{kind:"Name",value:"clubhouseToken"}}},{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"instantProcess"},value:{kind:"Variable",name:{kind:"Name",value:"instantProcess"}}},{kind:"Argument",name:{kind:"Name",value:"teamId"},value:{kind:"Variable",name:{kind:"Name",value:"teamId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueImportPayload"}}]}}]}},...na.definitions]},Ro={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueImportCreateGithub"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"githubRepoName"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"githubRepoOwner"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"githubShouldImportOrgProjects"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"githubToken"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"instantProcess"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"teamId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueImportCreateGithub"},arguments:[{kind:"Argument",name:{kind:"Name",value:"githubRepoName"},value:{kind:"Variable",name:{kind:"Name",value:"githubRepoName"}}},{kind:"Argument",name:{kind:"Name",value:"githubRepoOwner"},value:{kind:"Variable",name:{kind:"Name",value:"githubRepoOwner"}}},{kind:"Argument",name:{kind:"Name",value:"githubShouldImportOrgProjects"},value:{kind:"Variable",name:{kind:"Name",value:"githubShouldImportOrgProjects"}}},{kind:"Argument",name:{kind:"Name",value:"githubToken"},value:{kind:"Variable",name:{kind:"Name",value:"githubToken"}}},{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"instantProcess"},value:{kind:"Variable",name:{kind:"Name",value:"instantProcess"}}},{kind:"Argument",name:{kind:"Name",value:"teamId"},value:{kind:"Variable",name:{kind:"Name",value:"teamId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueImportPayload"}}]}}]}},...na.definitions]},zo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueImportCreateJira"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"instantProcess"}},type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"jiraEmail"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"jiraHostname"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"jiraProject"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"jiraToken"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"teamId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueImportCreateJira"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"instantProcess"},value:{kind:"Variable",name:{kind:"Name",value:"instantProcess"}}},{kind:"Argument",name:{kind:"Name",value:"jiraEmail"},value:{kind:"Variable",name:{kind:"Name",value:"jiraEmail"}}},{kind:"Argument",name:{kind:"Name",value:"jiraHostname"},value:{kind:"Variable",name:{kind:"Name",value:"jiraHostname"}}},{kind:"Argument",name:{kind:"Name",value:"jiraProject"},value:{kind:"Variable",name:{kind:"Name",value:"jiraProject"}}},{kind:"Argument",name:{kind:"Name",value:"jiraToken"},value:{kind:"Variable",name:{kind:"Name",value:"jiraToken"}}},{kind:"Argument",name:{kind:"Name",value:"teamId"},value:{kind:"Variable",name:{kind:"Name",value:"teamId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueImportPayload"}}]}}]}},...na.definitions]},Lo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueImportDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"issueImportId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueImportDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"issueImportId"},value:{kind:"Variable",name:{kind:"Name",value:"issueImportId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueImportDeletePayload"}}]}}]}},...ia.definitions]},Mo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueImportProcess"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"issueImportId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"mapping"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"JSONObject"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueImportProcess"},arguments:[{kind:"Argument",name:{kind:"Name",value:"issueImportId"},value:{kind:"Variable",name:{kind:"Name",value:"issueImportId"}}},{kind:"Argument",name:{kind:"Name",value:"mapping"},value:{kind:"Variable",name:{kind:"Name",value:"mapping"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueImportPayload"}}]}}]}},...na.definitions]},Wo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueLabelArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueLabelArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Qo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueLabelCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"IssueLabelCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueLabelCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueLabelPayload"}}]}}]}},...da.definitions]},Ho={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueLabelUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"IssueLabelUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueLabelUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueLabelPayload"}}]}}]}},...da.definitions]},Go={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueRelationCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"IssueRelationCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueRelationCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueRelationPayload"}}]}}]}},...ua.definitions]},Ko={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueRelationDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueRelationDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},$o={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueRelationUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"IssueRelationUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueRelationUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssueRelationPayload"}}]}}]}},...ua.definitions]},Jo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueUnarchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueUnarchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Zo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"issueUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"IssueUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"issueUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IssuePayload"}}]}}]}},...la.definitions]},Yo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"joinOrganizationFromOnboarding"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"JoinOrganizationInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"joinOrganizationFromOnboarding"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CreateOrJoinOrganizationResponse"}}]}}]}},...pn.definitions]},Xo={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"leaveOrganization"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"organizationId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"leaveOrganization"},arguments:[{kind:"Argument",name:{kind:"Name",value:"organizationId"},value:{kind:"Variable",name:{kind:"Name",value:"organizationId"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"CreateOrJoinOrganizationResponse"}}]}}]}},...pn.definitions]},er={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"milestoneCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"MilestoneCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"milestoneCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"MilestonePayload"}}]}}]}},...va.definitions]},ir={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"milestoneDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"milestoneDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},nr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"milestoneUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"MilestoneUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"milestoneUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"MilestonePayload"}}]}}]}},...va.definitions]},ar={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"notificationArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"notificationArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},tr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"notificationCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"NotificationUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"notificationCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"NotificationPayload"}}]}}]}},...Na.definitions]},dr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"notificationSubscriptionCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"NotificationSubscriptionCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"notificationSubscriptionCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"NotificationSubscriptionPayload"}}]}}]}},...ba.definitions]},lr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"notificationSubscriptionDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"notificationSubscriptionDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},or={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"notificationUnarchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"notificationUnarchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},rr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"notificationUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"NotificationUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"notificationUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"NotificationPayload"}}]}}]}},...Na.definitions]},sr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"oauthClientArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"oauthClientArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},ur={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"oauthClientCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"OauthClientCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"oauthClientCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OauthClientPayload"}}]}}]}},...Sa.definitions]},mr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"oauthClientRotateSecret"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"oauthClientRotateSecret"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"RotateSecretPayload"}}]}}]}},...Qa.definitions]},kr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"oauthClientUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"OauthClientUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"oauthClientUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OauthClientPayload"}}]}}]}},...Sa.definitions]},vr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"oauthTokenRevoke"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"appId"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"scope"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"oauthTokenRevoke"},arguments:[{kind:"Argument",name:{kind:"Name",value:"appId"},value:{kind:"Variable",name:{kind:"Name",value:"appId"}}},{kind:"Argument",name:{kind:"Name",value:"scope"},value:{kind:"Variable",name:{kind:"Name",value:"scope"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OauthTokenRevokePayload"}}]}}]}},...ga.definitions]},cr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"organizationCancelDelete"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationCancelDelete"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationCancelDeletePayload"}}]}}]}},...Da.definitions]},pr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"organizationDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"DeleteOrganizationInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationDeletePayload"}}]}}]}},...Va.definitions]},Nr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"organizationDeleteChallenge"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationDeleteChallenge"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationDeletePayload"}}]}}]}},...Va.definitions]},hr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"organizationDomainCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"OrganizationDomainCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationDomainCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationDomainPayload"}}]}}]}},...Aa.definitions]},fr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"organizationDomainDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationDomainDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},br={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"organizationDomainVerify"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"OrganizationDomainVerificationInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationDomainVerify"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationDomainPayload"}}]}}]}},...Aa.definitions]},yr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"organizationInviteCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"OrganizationInviteCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationInviteCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationInvitePayload"}}]}}]}},...wa.definitions]},Sr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"organizationInviteDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationInviteDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},gr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"organizationUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"UpdateOrganizationInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"organizationUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"OrganizationPayload"}}]}}]}},...qa.definitions]},Dr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"projectArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projectArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Vr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"projectCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ProjectCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projectCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ProjectPayload"}}]}}]}},...Ua.definitions]},Fr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"projectLinkCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ProjectLinkCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projectLinkCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ProjectLinkPayload"}}]}}]}},...ja.definitions]},Ar={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"projectLinkDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projectLinkDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},_r={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"projectUnarchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projectUnarchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Tr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"projectUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ProjectUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"projectUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ProjectPayload"}}]}}]}},...Ua.definitions]},Ir={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"pushSubscriptionCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"PushSubscriptionCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"pushSubscriptionCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PushSubscriptionPayload"}}]}}]}},...Ra.definitions]},wr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"pushSubscriptionDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"pushSubscriptionDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"PushSubscriptionPayload"}}]}}]}},...Ra.definitions]},qr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"reactionCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ReactionCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"reactionCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ReactionPayload"}}]}}]}},...Wa.definitions]},xr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"reactionDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"reactionDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Cr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"refreshGoogleSheetsData"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"refreshGoogleSheetsData"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"IntegrationPayload"}}]}}]}},...Bn.definitions]},Or={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"resentOrganizationInvite"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"resentOrganizationInvite"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Pr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"samlTokenUserAccountAuth"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"TokenUserAccountAuthInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"samlTokenUserAccountAuth"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"AuthResolverResponse"}}]}}]}},...an.definitions]},jr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"subscriptionArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"subscriptionArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Ur={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"subscriptionSessionCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"plan"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"subscriptionSessionCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"plan"},value:{kind:"Variable",name:{kind:"Name",value:"plan"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"SubscriptionSessionPayload"}}]}}]}},...Ja.definitions]},Br={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"subscriptionUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"SubscriptionUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"subscriptionUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"SubscriptionPayload"}}]}}]}},...$a.definitions]},Er={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"subscriptionUpdateSessionCreate"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"subscriptionUpdateSessionCreate"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"SubscriptionSessionPayload"}}]}}]}},...Ja.definitions]},Rr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"subscriptionUpgrade"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"type"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"subscriptionUpgrade"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"type"},value:{kind:"Variable",name:{kind:"Name",value:"type"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"SubscriptionPayload"}}]}}]}},...$a.definitions]},zr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"teamArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Lr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"teamCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"copySettingsFromTeamId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"TeamCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"copySettingsFromTeamId"},value:{kind:"Variable",name:{kind:"Name",value:"copySettingsFromTeamId"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamPayload"}}]}}]}},...nt.definitions]},Mr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"teamDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Wr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"teamKeyDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamKeyDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Qr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"teamMembershipCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"TeamMembershipCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamMembershipCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamMembershipPayload"}}]}}]}},...it.definitions]},Hr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"teamMembershipDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamMembershipDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Gr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"teamMembershipUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"TeamMembershipUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamMembershipUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamMembershipPayload"}}]}}]}},...it.definitions]},Kr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"teamUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"TeamUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"teamUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TeamPayload"}}]}}]}},...nt.definitions]},$r={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"templateCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"TemplateCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"templateCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TemplatePayload"}}]}}]}},...tt.definitions]},Jr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"templateDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"templateDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},Zr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"templateUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"TemplateUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"templateUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"TemplatePayload"}}]}}]}},...tt.definitions]},Yr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"userDemoteAdmin"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userDemoteAdmin"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserAdminPayload"}}]}}]}},...rt.definitions]},Xr={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"userFlagUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"flag"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"UserFlagType"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"operation"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"UserFlagUpdateOperation"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userFlagUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"flag"},value:{kind:"Variable",name:{kind:"Name",value:"flag"}}},{kind:"Argument",name:{kind:"Name",value:"operation"},value:{kind:"Variable",name:{kind:"Name",value:"operation"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserSettingsFlagPayload"}}]}}]}},...mt.definitions]},es={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"userPromoteAdmin"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userPromoteAdmin"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserAdminPayload"}}]}}]}},...rt.definitions]},is={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"userSettingsFlagIncrement"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"flag"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userSettingsFlagIncrement"},arguments:[{kind:"Argument",name:{kind:"Name",value:"flag"},value:{kind:"Variable",name:{kind:"Name",value:"flag"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserSettingsFlagPayload"}}]}}]}},...mt.definitions]},ns={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"userSettingsFlagsReset"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userSettingsFlagsReset"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserSettingsFlagsResetPayload"}}]}}]}},...kt.definitions]},as={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"userSettingsUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"UserSettingsUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userSettingsUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserSettingsPayload"}}]}}]}},...vt.definitions]},ts={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"userSubscribeToNewsletter"},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userSubscribeToNewsletter"},selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserSubscribeToNewsletterPayload"}}]}}]}},...ct.definitions]},ds={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"userSuspend"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userSuspend"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserAdminPayload"}}]}}]}},...rt.definitions]},ls={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"userUnsuspend"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userUnsuspend"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserAdminPayload"}}]}}]}},...rt.definitions]},os={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"userUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"UpdateUserInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"userUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"UserPayload"}}]}}]}},...ut.definitions]},rs={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"viewPreferencesCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ViewPreferencesCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"viewPreferencesCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ViewPreferencesPayload"}}]}}]}},...Nt.definitions]},ss={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"viewPreferencesDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"viewPreferencesDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},us={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"viewPreferencesUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ViewPreferencesUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"viewPreferencesUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ViewPreferencesPayload"}}]}}]}},...Nt.definitions]},ms={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"webhookCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"WebhookCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"webhookCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"WebhookPayload"}}]}}]}},...bt.definitions]},ks={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"webhookDelete"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"webhookDelete"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},vs={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"webhookUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"WebhookUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"webhookUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"WebhookPayload"}}]}}]}},...bt.definitions]},cs={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"workflowStateArchive"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"workflowStateArchive"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"ArchivePayload"}}]}}]}},...Zi.definitions]},ps={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"workflowStateCreate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"WorkflowStateCreateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"workflowStateCreate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"WorkflowStatePayload"}}]}}]}},...gt.definitions]},Ns={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"workflowStateUpdate"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"input"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"WorkflowStateUpdateInput"}}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"workflowStateUpdate"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}},{kind:"Argument",name:{kind:"Name",value:"input"},value:{kind:"Variable",name:{kind:"Name",value:"input"}}}],selectionSet:{kind:"SelectionSet",selections:[{kind:"FragmentSpread",name:{kind:"Name",value:"WorkflowStatePayload"}}]}}]}},...gt.definitions]};var hs=Object.freeze({__proto__:null,get IssueRelationType(){return yi},get PaginationOrderBy(){return Si},get TrashOptionType(){return gi},get UserFlagType(){return Di},get UserFlagUpdateOperation(){return Vi},get ViewPreferencesType(){return Fi},get ViewType(){return Ai},TemplateFragmentDoc:xi,UserFragmentDoc:Ci,UserAccountFragmentDoc:Oi,DocumentStepFragmentDoc:{kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"DocumentStep"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"DocumentStep"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"clientId"}},{kind:"Field",name:{kind:"Name",value:"step"}},{kind:"Field",name:{kind:"Name",value:"version"}},{kind:"Field",name:{kind:"Name",value:"updatedAt"}},{kind:"Field",name:{kind:"Name",value:"archivedAt"}},{kind:"Field",name:{kind:"Name",value:"createdAt"}},{kind:"Field",name:{kind:"Name",value:"id"}}]}}]},SyncDeltaResponseFragmentDoc:{kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SyncDeltaResponse"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SyncDeltaResponse"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"updates"}},{kind:"Field",name:{kind:"Name",value:"success"}},{kind:"Field",name:{kind:"Name",value:"loadMore"}}]}}]},SyncResponseFragmentDoc:{kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SyncResponse"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SyncResponse"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"delta"}},{kind:"Field",name:{kind:"Name",value:"state"}},{kind:"Field",name:{kind:"Name",value:"lastSyncId"}},{kind:"Field",name:{kind:"Name",value:"subscribedSyncGroups"}},{kind:"Field",name:{kind:"Name",value:"databaseVersion"}}]}}]},DependencyResponseFragmentDoc:{kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"DependencyResponse"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"DependencyResponse"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"dependencies"}}]}}]},GithubRepoFragmentDoc:Pi,GithubOrgFragmentDoc:ji,GithubOAuthTokenPayloadFragmentDoc:Ui,AuthorizedApplicationFragmentDoc:Bi,UserAuthorizedApplicationFragmentDoc:Ei,ApplicationFragmentDoc:{kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"Application"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Application"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"name"}},{kind:"Field",name:{kind:"Name",value:"imageUrl"}},{kind:"Field",name:{kind:"Name",value:"description"}},{kind:"Field",name:{kind:"Name",value:"developer"}},{kind:"Field",name:{kind:"Name",value:"clientId"}},{kind:"Field",name:{kind:"Name",value:"developerUrl"}}]}}]},GoogleSheetsSettingsFragmentDoc:Ri,SentrySettingsFragmentDoc:zi,SlackPostSettingsFragmentDoc:Li,ZendeskSettingsFragmentDoc:Mi,IntegrationSettingsFragmentDoc:Wi,SamlConfigurationFragmentDoc:{kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SamlConfiguration"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SamlConfiguration"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"ssoBinding"}},{kind:"Field",name:{kind:"Name",value:"allowedDomains"}},{kind:"Field",name:{kind:"Name",value:"ssoEndpoint"}},{kind:"Field",name:{kind:"Name",value:"ssoSignAlgo"}},{kind:"Field",name:{kind:"Name",value:"ssoSigningCert"}}]}}]},UserSettingsFragmentDoc:Qi,SubscriptionFragmentDoc:Hi,ApiKeyFragmentDoc:Gi,PageInfoFragmentDoc:Ki,ApiKeyConnectionFragmentDoc:$i,ApiKeyPayloadFragmentDoc:Ji,ArchivePayloadFragmentDoc:Zi,AttachmentFragmentDoc:Yi,AttachmentConnectionFragmentDoc:Xi,AttachmentPayloadFragmentDoc:en,OrganizationFragmentDoc:nn,AuthResolverResponseFragmentDoc:an,InvoiceFragmentDoc:tn,CardFragmentDoc:dn,BillingDetailsPayloadFragmentDoc:ln,BillingEmailPayloadFragmentDoc:on,StepsResponseFragmentDoc:rn,CollaborationDocumentUpdatePayloadFragmentDoc:sn,CommentFragmentDoc:un,CommentConnectionFragmentDoc:mn,CommentPayloadFragmentDoc:kn,ContactPayloadFragmentDoc:vn,CreateCsvExportReportPayloadFragmentDoc:cn,CreateOrJoinOrganizationResponseFragmentDoc:pn,CustomViewFragmentDoc:Nn,CustomViewConnectionFragmentDoc:hn,CustomViewPayloadFragmentDoc:fn,CycleFragmentDoc:bn,CycleConnectionFragmentDoc:yn,CyclePayloadFragmentDoc:Sn,DebugPayloadFragmentDoc:gn,EmailUnsubscribePayloadFragmentDoc:Dn,EmailUserAccountAuthChallengeResponseFragmentDoc:Vn,EmojiFragmentDoc:Fn,EmojiConnectionFragmentDoc:An,EmojiPayloadFragmentDoc:_n,EventPayloadFragmentDoc:Tn,FavoriteFragmentDoc:In,FavoriteConnectionFragmentDoc:wn,FavoritePayloadFragmentDoc:qn,FeedbackPayloadFragmentDoc:xn,FigmaEmbedFragmentDoc:Cn,FigmaEmbedPayloadFragmentDoc:On,ImageUploadFromUrlPayloadFragmentDoc:Pn,IntegrationFragmentDoc:jn,IntegrationConnectionFragmentDoc:Un,IntegrationPayloadFragmentDoc:Bn,CommitPayloadFragmentDoc:En,PullRequestPayloadFragmentDoc:Rn,SentryIssuePayloadFragmentDoc:zn,IntegrationResourceDataFragmentDoc:Ln,IntegrationResourceFragmentDoc:Mn,IntegrationResourceConnectionFragmentDoc:Wn,InviteDataFragmentDoc:Qn,InvitePagePayloadFragmentDoc:Hn,IssueFragmentDoc:Gn,IssueConnectionFragmentDoc:Kn,IssueDescriptionHistoryFragmentDoc:$n,IssueDescriptionHistoryPayloadFragmentDoc:Jn,IssueRelationHistoryPayloadFragmentDoc:Zn,IssueHistoryFragmentDoc:Yn,IssueHistoryConnectionFragmentDoc:Xn,IssueImportFragmentDoc:ea,IssueImportDeletePayloadFragmentDoc:ia,IssueImportPayloadFragmentDoc:na,IssueLabelFragmentDoc:aa,IssueLabelConnectionFragmentDoc:ta,IssueLabelPayloadFragmentDoc:da,IssuePayloadFragmentDoc:la,IssuePriorityValueFragmentDoc:oa,IssueRelationFragmentDoc:ra,IssueRelationConnectionFragmentDoc:sa,IssueRelationPayloadFragmentDoc:ua,MilestoneFragmentDoc:ma,MilestoneConnectionFragmentDoc:ka,MilestonePayloadFragmentDoc:va,NotificationFragmentDoc:ca,NotificationConnectionFragmentDoc:pa,NotificationPayloadFragmentDoc:Na,NotificationSubscriptionFragmentDoc:ha,NotificationSubscriptionConnectionFragmentDoc:fa,NotificationSubscriptionPayloadFragmentDoc:ba,OauthClientFragmentDoc:ya,OauthClientPayloadFragmentDoc:Sa,OauthTokenRevokePayloadFragmentDoc:ga,OrganizationCancelDeletePayloadFragmentDoc:Da,OrganizationDeletePayloadFragmentDoc:Va,OrganizationDomainFragmentDoc:Fa,OrganizationDomainPayloadFragmentDoc:Aa,OrganizationDomainSimplePayloadFragmentDoc:{kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"OrganizationDomainSimplePayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"OrganizationDomainSimplePayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"success"}}]}}]},OrganizationExistsPayloadFragmentDoc:_a,OrganizationInviteFragmentDoc:Ta,OrganizationInviteConnectionFragmentDoc:Ia,OrganizationInvitePayloadFragmentDoc:wa,OrganizationPayloadFragmentDoc:qa,ProjectFragmentDoc:xa,ProjectConnectionFragmentDoc:Ca,ProjectLinkFragmentDoc:Oa,ProjectLinkConnectionFragmentDoc:Pa,ProjectLinkPayloadFragmentDoc:ja,ProjectPayloadFragmentDoc:Ua,PushSubscriptionFragmentDoc:Ba,PushSubscriptionConnectionFragmentDoc:Ea,PushSubscriptionPayloadFragmentDoc:Ra,PushSubscriptionTestPayloadFragmentDoc:za,ReactionFragmentDoc:La,ReactionConnectionFragmentDoc:Ma,ReactionPayloadFragmentDoc:Wa,RotateSecretPayloadFragmentDoc:Qa,ArchiveResponseFragmentDoc:Ha,SearchResultPayloadFragmentDoc:Ga,SsoUrlFromEmailResponseFragmentDoc:Ka,SubscriptionPayloadFragmentDoc:$a,SubscriptionSessionPayloadFragmentDoc:Ja,SynchronizedPayloadFragmentDoc:{kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"SynchronizedPayload"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"SynchronizedPayload"}},selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lastSyncId"}}]}}]},TeamFragmentDoc:Za,TeamConnectionFragmentDoc:Ya,TeamMembershipFragmentDoc:Xa,TeamMembershipConnectionFragmentDoc:et,TeamMembershipPayloadFragmentDoc:it,TeamPayloadFragmentDoc:nt,TemplateConnectionFragmentDoc:at,TemplatePayloadFragmentDoc:tt,UploadFileHeaderFragmentDoc:dt,UploadFileFragmentDoc:lt,UploadPayloadFragmentDoc:ot,UserAdminPayloadFragmentDoc:rt,UserConnectionFragmentDoc:st,UserPayloadFragmentDoc:ut,UserSettingsFlagPayloadFragmentDoc:mt,UserSettingsFlagsResetPayloadFragmentDoc:kt,UserSettingsPayloadFragmentDoc:vt,UserSubscribeToNewsletterPayloadFragmentDoc:ct,ViewPreferencesFragmentDoc:pt,ViewPreferencesPayloadFragmentDoc:Nt,WebhookFragmentDoc:ht,WebhookConnectionFragmentDoc:ft,WebhookPayloadFragmentDoc:bt,WorkflowStateFragmentDoc:yt,WorkflowStateConnectionFragmentDoc:St,WorkflowStatePayloadFragmentDoc:gt,ApiKeysDocument:Dt,ApplicationWithAuthorizationDocument:Vt,AttachmentDocument:Ft,AttachmentIssueDocument:At,AttachmentIssue_AttachmentsDocument:_t,AttachmentIssue_ChildrenDocument:Tt,AttachmentIssue_CommentsDocument:It,AttachmentIssue_HistoryDocument:wt,AttachmentIssue_InverseRelationsDocument:qt,AttachmentIssue_LabelsDocument:xt,AttachmentIssue_RelationsDocument:Ct,AttachmentIssue_SubscribersDocument:Ot,AttachmentsDocument:Pt,AttachmentsForUrlDocument:jt,AuthorizedApplicationsDocument:Ut,AvailableUsersDocument:Bt,BillingDetailsDocument:Et,BillingDetails_PaymentMethodDocument:Rt,CollaborativeDocumentJoinDocument:zt,CollaborativeDocumentJoin_StepsDocument:Lt,CommentDocument:Mt,CommentsDocument:Wt,CustomViewDocument:Qt,CustomViewsDocument:Ht,CycleDocument:Gt,Cycle_IssuesDocument:Kt,Cycle_UncompletedIssuesUponCloseDocument:$t,CyclesDocument:Jt,EmojiDocument:Zt,EmojisDocument:Yt,FavoriteDocument:Xt,FavoritesDocument:ed,FigmaEmbedInfoDocument:id,FigmaEmbedInfo_FigmaEmbedDocument:nd,IntegrationDocument:ad,IntegrationsDocument:td,InviteInfoDocument:dd,InviteInfo_InviteDataDocument:ld,IssueDocument:od,Issue_AttachmentsDocument:rd,Issue_ChildrenDocument:sd,Issue_CommentsDocument:ud,Issue_HistoryDocument:md,Issue_InverseRelationsDocument:kd,Issue_LabelsDocument:vd,Issue_RelationsDocument:cd,Issue_SubscribersDocument:pd,IssueImportFinishGithubOAuthDocument:Nd,IssueLabelDocument:hd,IssueLabel_IssuesDocument:fd,IssueLabelsDocument:bd,IssuePriorityValuesDocument:yd,IssueRelationDocument:Sd,IssueRelationsDocument:gd,IssueSearchDocument:Dd,IssuesDocument:Vd,MilestoneDocument:Fd,Milestone_ProjectsDocument:Ad,MilestonesDocument:_d,NotificationDocument:Td,NotificationSubscriptionDocument:Id,NotificationSubscriptionsDocument:wd,NotificationsDocument:qd,OrganizationDocument:xd,Organization_IntegrationsDocument:Cd,Organization_MilestonesDocument:Od,Organization_TeamsDocument:Pd,Organization_UsersDocument:jd,OrganizationExistsDocument:Ud,OrganizationInviteDocument:Bd,OrganizationInvite_IssuesDocument:Ed,OrganizationInvitesDocument:Rd,ProjectDocument:zd,Project_IssuesDocument:Ld,Project_LinksDocument:Md,Project_MembersDocument:Wd,Project_TeamsDocument:Qd,ProjectLinkDocument:Hd,ProjectLinksDocument:Gd,ProjectsDocument:Kd,PushSubscriptionTestDocument:$d,ReactionDocument:Jd,ReactionsDocument:Zd,SsoUrlFromEmailDocument:Yd,SubscriptionDocument:Xd,TeamDocument:el,Team_CyclesDocument:il,Team_IssuesDocument:nl,Team_LabelsDocument:al,Team_MembersDocument:tl,Team_MembershipsDocument:dl,Team_ProjectsDocument:ll,Team_StatesDocument:ol,Team_TemplatesDocument:rl,Team_WebhooksDocument:sl,TeamMembershipDocument:ul,TeamMembershipsDocument:ml,TeamsDocument:kl,TemplateDocument:vl,TemplatesDocument:cl,UserDocument:pl,User_AssignedIssuesDocument:Nl,User_CreatedIssuesDocument:hl,User_TeamMembershipsDocument:fl,User_TeamsDocument:bl,UserSettingsDocument:yl,UsersDocument:Sl,ViewerDocument:gl,Viewer_AssignedIssuesDocument:Dl,Viewer_CreatedIssuesDocument:Vl,Viewer_TeamMembershipsDocument:Fl,Viewer_TeamsDocument:Al,WebhookDocument:_l,WebhooksDocument:Tl,WorkflowStateDocument:Il,WorkflowState_IssuesDocument:wl,WorkflowStatesDocument:ql,ApiKeyCreateDocument:xl,ApiKeyDeleteDocument:Cl,AttachmentArchiveDocument:Ol,AttachmentCreateDocument:Pl,AttachmentDeleteDocument:jl,AttachmentLinkFrontDocument:Ul,AttachmentLinkIntercomDocument:Bl,AttachmentLinkUrlDocument:El,AttachmentLinkZendeskDocument:Rl,AttachmentUpdateDocument:zl,BillingEmailUpdateDocument:Ll,CollaborativeDocumentUpdateDocument:Ml,CommentCreateDocument:Wl,CommentDeleteDocument:Ql,CommentUpdateDocument:Hl,ContactCreateDocument:Gl,CreateCsvExportReportDocument:Kl,CreateOrganizationFromOnboardingDocument:$l,CustomViewCreateDocument:Jl,CustomViewDeleteDocument:Zl,CustomViewUpdateDocument:Yl,CycleArchiveDocument:Xl,CycleCreateDocument:eo,CycleUpdateDocument:io,DebugCreateSamlOrgDocument:no,DebugFailWithInternalErrorDocument:ao,DebugFailWithWarningDocument:to,EmailTokenUserAccountAuthDocument:lo,EmailUnsubscribeDocument:oo,EmailUserAccountAuthChallengeDocument:ro,EmojiCreateDocument:so,EmojiDeleteDocument:uo,EventCreateDocument:mo,FavoriteCreateDocument:ko,FavoriteDeleteDocument:vo,FavoriteUpdateDocument:co,FeedbackCreateDocument:po,FileUploadDocument:No,GoogleUserAccountAuthDocument:ho,ImageUploadFromUrlDocument:fo,IntegrationDeleteDocument:bo,IntegrationFigmaDocument:yo,IntegrationFrontDocument:So,IntegrationGithubConnectDocument:go,IntegrationGitlabConnectDocument:Do,IntegrationGoogleSheetsDocument:Vo,IntegrationIntercomDocument:Fo,IntegrationIntercomDeleteDocument:Ao,IntegrationResourceArchiveDocument:_o,IntegrationSentryConnectDocument:To,IntegrationSlackDocument:Io,IntegrationSlackImportEmojisDocument:wo,IntegrationSlackPersonalDocument:qo,IntegrationSlackPostDocument:xo,IntegrationSlackProjectPostDocument:Co,IntegrationZendeskDocument:Oo,IssueArchiveDocument:Po,IssueCreateDocument:jo,IssueDeleteDocument:Uo,IssueImportCreateAsanaDocument:Bo,IssueImportCreateClubhouseDocument:Eo,IssueImportCreateGithubDocument:Ro,IssueImportCreateJiraDocument:zo,IssueImportDeleteDocument:Lo,IssueImportProcessDocument:Mo,IssueLabelArchiveDocument:Wo,IssueLabelCreateDocument:Qo,IssueLabelUpdateDocument:Ho,IssueRelationCreateDocument:Go,IssueRelationDeleteDocument:Ko,IssueRelationUpdateDocument:$o,IssueUnarchiveDocument:Jo,IssueUpdateDocument:Zo,JoinOrganizationFromOnboardingDocument:Yo,LeaveOrganizationDocument:Xo,MilestoneCreateDocument:er,MilestoneDeleteDocument:ir,MilestoneUpdateDocument:nr,NotificationArchiveDocument:ar,NotificationCreateDocument:tr,NotificationSubscriptionCreateDocument:dr,NotificationSubscriptionDeleteDocument:lr,NotificationUnarchiveDocument:or,NotificationUpdateDocument:rr,OauthClientArchiveDocument:sr,OauthClientCreateDocument:ur,OauthClientRotateSecretDocument:mr,OauthClientUpdateDocument:kr,OauthTokenRevokeDocument:vr,OrganizationCancelDeleteDocument:cr,OrganizationDeleteDocument:pr,OrganizationDeleteChallengeDocument:Nr,OrganizationDomainCreateDocument:hr,OrganizationDomainDeleteDocument:fr,OrganizationDomainVerifyDocument:br,OrganizationInviteCreateDocument:yr,OrganizationInviteDeleteDocument:Sr,OrganizationUpdateDocument:gr,ProjectArchiveDocument:Dr,ProjectCreateDocument:Vr,ProjectLinkCreateDocument:Fr,ProjectLinkDeleteDocument:Ar,ProjectUnarchiveDocument:_r,ProjectUpdateDocument:Tr,PushSubscriptionCreateDocument:Ir,PushSubscriptionDeleteDocument:wr,ReactionCreateDocument:qr,ReactionDeleteDocument:xr,RefreshGoogleSheetsDataDocument:Cr,ResentOrganizationInviteDocument:Or,SamlTokenUserAccountAuthDocument:Pr,SubscriptionArchiveDocument:jr,SubscriptionSessionCreateDocument:Ur,SubscriptionUpdateDocument:Br,SubscriptionUpdateSessionCreateDocument:Er,SubscriptionUpgradeDocument:Rr,TeamArchiveDocument:zr,TeamCreateDocument:Lr,TeamDeleteDocument:Mr,TeamKeyDeleteDocument:Wr,TeamMembershipCreateDocument:Qr,TeamMembershipDeleteDocument:Hr,TeamMembershipUpdateDocument:Gr,TeamUpdateDocument:Kr,TemplateCreateDocument:$r,TemplateDeleteDocument:Jr,TemplateUpdateDocument:Zr,UserDemoteAdminDocument:Yr,UserFlagUpdateDocument:Xr,UserPromoteAdminDocument:es,UserSettingsFlagIncrementDocument:is,UserSettingsFlagsResetDocument:ns,UserSettingsUpdateDocument:as,UserSubscribeToNewsletterDocument:ts,UserSuspendDocument:ds,UserUnsuspendDocument:ls,UserUpdateDocument:os,ViewPreferencesCreateDocument:rs,ViewPreferencesDeleteDocument:ss,ViewPreferencesUpdateDocument:us,WebhookCreateDocument:ms,WebhookDeleteDocument:ks,WebhookUpdateDocument:vs,WorkflowStateArchiveDocument:cs,WorkflowStateCreateDocument:ps,WorkflowStateUpdateDocument:Ns});class fs{constructor(e){this._request=e}}class bs extends fs{}class ys extends bs{constructor(e,i,n,a){super(e),this._fetch=i,this.nodes=n,this.pageInfo=a}_appendNodes(e){var i;this.nodes=e?[...null!==(i=this.nodes)&&void 0!==i?i:[],...e]:this.nodes}_prependNodes(e){var i;this.nodes=e?[...e,...null!==(i=this.nodes)&&void 0!==i?i:[]]:this.nodes}_appendPageInfo(e){var i,n;this.pageInfo&&(this.pageInfo.endCursor=null!==(i=null==e?void 0:e.endCursor)&&void 0!==i?i:this.pageInfo.startCursor,this.pageInfo.hasNextPage=null!==(n=null==e?void 0:e.hasNextPage)&&void 0!==n?n:this.pageInfo.hasNextPage)}_prependPageInfo(e){var i,n;this.pageInfo&&(this.pageInfo.startCursor=null!==(i=null==e?void 0:e.startCursor)&&void 0!==i?i:this.pageInfo.startCursor,this.pageInfo.hasPreviousPage=null!==(n=null==e?void 0:e.hasPreviousPage)&&void 0!==n?n:this.pageInfo.hasPreviousPage)}fetchNext(){var e,i;return(null===(e=this.pageInfo)||void 0===e?void 0:e.hasNextPage)?this._fetch({after:null===(i=this.pageInfo)||void 0===i?void 0:i.endCursor}).then((e=>(this._appendNodes(null==e?void 0:e.nodes),this._appendPageInfo(null==e?void 0:e.pageInfo),this))):Promise.resolve(this)}fetchPrevious(){var e,i;return(null===(e=this.pageInfo)||void 0===e?void 0:e.hasPreviousPage)?this._fetch({before:null===(i=this.pageInfo)||void 0===i?void 0:i.startCursor}).then((e=>(this._prependNodes(null==e?void 0:e.nodes),this._prependPageInfo(null==e?void 0:e.pageInfo),this))):Promise.resolve(this)}}function Ss(e){try{return e?new Date(e):void 0}catch(e){return}}function gs(e){try{return e?JSON.parse(e):void 0}catch(e){return}}class Ds extends fs{constructor(e,i){var n,a,t,d,l;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.label=null!==(d=i.label)&&void 0!==d?d:void 0,this.updatedAt=null!==(l=Ss(i.updatedAt))&&void 0!==l?l:void 0}delete(){return this.id?new yv(this._request).fetch(this.id):void 0}}class Vs extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Ds(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class Fs extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.apiKey=i.apiKey?new Ds(e,i.apiKey):void 0}}class As extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0}}class _s extends fs{constructor(e,i){var n,a,t;super(e),this.archive=null!==(n=i.archive)&&void 0!==n?n:void 0,this.databaseVersion=null!==(a=i.databaseVersion)&&void 0!==a?a:void 0,this.totalCount=null!==(t=i.totalCount)&&void 0!==t?t:void 0}}class Ts extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.groupBySource=null!==(t=i.groupBySource)&&void 0!==t?t:void 0,this.id=null!==(d=i.id)&&void 0!==d?d:void 0,this.metadata=null!==(l=gs(i.metadata))&&void 0!==l?l:void 0,this.source=null!==(o=gs(i.source))&&void 0!==o?o:void 0,this.subtitle=null!==(r=i.subtitle)&&void 0!==r?r:void 0,this.title=null!==(s=i.title)&&void 0!==s?s:void 0,this.updatedAt=null!==(u=Ss(i.updatedAt))&&void 0!==u?u:void 0,this.url=null!==(m=i.url)&&void 0!==m?m:void 0,this._issue=null!==(k=i.issue)&&void 0!==k?k:void 0}get issue(){var e,i;return(null===(e=this._issue)||void 0===e?void 0:e.id)?new qk(this._request).fetch(null===(i=this._issue)||void 0===i?void 0:i.id):void 0}archive(){return this.id?new Sv(this._request).fetch(this.id):void 0}delete(){return this.id?new Dv(this._request).fetch(this.id):void 0}update(e){return this.id?new Tv(this._request).fetch(this.id,e):void 0}}class Is extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Ts(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class ws extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._attachment=null!==(t=i.attachment)&&void 0!==t?t:void 0}get attachment(){var e,i;return(null===(e=this._attachment)||void 0===e?void 0:e.id)?new sk(this._request).fetch(null===(i=this._attachment)||void 0===i?void 0:i.id):void 0}}class qs extends fs{constructor(e,i){var n,a,t,d,l;super(e),this.allowDomainAccess=null!==(n=i.allowDomainAccess)&&void 0!==n?n:void 0,this.email=null!==(a=i.email)&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.lastUsedOrganizationId=null!==(d=i.lastUsedOrganizationId)&&void 0!==d?d:void 0,this.token=null!==(l=i.token)&&void 0!==l?l:void 0,this.availableOrganizations=i.availableOrganizations?i.availableOrganizations.map((i=>new Zu(e,i))):void 0,this.users=i.users?i.users.map((i=>new Lm(e,i))):void 0}}class xs extends fs{constructor(e,i){var n,a,t,d,l,o,r,s;super(e),this.appId=null!==(n=i.appId)&&void 0!==n?n:void 0,this.clientId=null!==(a=i.clientId)&&void 0!==a?a:void 0,this.description=null!==(t=i.description)&&void 0!==t?t:void 0,this.developer=null!==(d=i.developer)&&void 0!==d?d:void 0,this.developerUrl=null!==(l=i.developerUrl)&&void 0!==l?l:void 0,this.imageUrl=null!==(o=i.imageUrl)&&void 0!==o?o:void 0,this.name=null!==(r=i.name)&&void 0!==r?r:void 0,this.scope=null!==(s=i.scope)&&void 0!==s?s:void 0}}class Cs extends fs{constructor(e,i){var n,a;super(e),this.email=null!==(n=i.email)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.paymentMethod=i.paymentMethod?new Ps(e,i.paymentMethod):void 0,this.invoices=i.invoices?i.invoices.map((i=>new Su(e,i))):void 0}}class Os extends fs{constructor(e,i){var n,a;super(e),this.email=null!==(n=i.email)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0}}class Ps extends fs{constructor(e,i){var n,a;super(e),this.brand=null!==(n=i.brand)&&void 0!==n?n:void 0,this.last4=null!==(a=i.last4)&&void 0!==a?a:void 0}}class js extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0,this.steps=i.steps?new Am(e,i.steps):void 0}}class Us extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.body=null!==(a=i.body)&&void 0!==a?a:void 0,this.createdAt=null!==(t=Ss(i.createdAt))&&void 0!==t?t:void 0,this.editedAt=null!==(d=Ss(i.editedAt))&&void 0!==d?d:void 0,this.id=null!==(l=i.id)&&void 0!==l?l:void 0,this.updatedAt=null!==(o=Ss(i.updatedAt))&&void 0!==o?o:void 0,this.url=null!==(r=i.url)&&void 0!==r?r:void 0,this._issue=null!==(s=i.issue)&&void 0!==s?s:void 0,this._user=null!==(u=i.user)&&void 0!==u?u:void 0}get issue(){var e,i;return(null===(e=this._issue)||void 0===e?void 0:e.id)?new qk(this._request).fetch(null===(i=this._issue)||void 0===i?void 0:i.id):void 0}get user(){var e,i;return(null===(e=this._user)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._user)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new xv(this._request).fetch(this.id):void 0}update(e){return this.id?new Cv(this._request).fetch(this.id,e):void 0}}class Bs extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Us(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class Es extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._comment=null!==(t=i.comment)&&void 0!==t?t:void 0}get comment(){var e,i;return(null===(e=this._comment)||void 0===e?void 0:e.id)?new hk(this._request).fetch(null===(i=this._comment)||void 0===i?void 0:i.id):void 0}}class Rs extends fs{constructor(e,i){var n,a,t,d,l,o,r;super(e),this.added=null!==(n=i.added)&&void 0!==n?n:void 0,this.id=null!==(a=i.id)&&void 0!==a?a:void 0,this.message=null!==(t=i.message)&&void 0!==t?t:void 0,this.modified=null!==(d=i.modified)&&void 0!==d?d:void 0,this.removed=null!==(l=i.removed)&&void 0!==l?l:void 0,this.timestamp=null!==(o=i.timestamp)&&void 0!==o?o:void 0,this.url=null!==(r=i.url)&&void 0!==r?r:void 0}}class zs extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class Ls extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class Ms extends fs{constructor(e,i){var n;super(e),this._user=null!==(n=i.user)&&void 0!==n?n:void 0}get organization(){return new Hk(this._request).fetch()}get user(){var e,i;return(null===(e=this._user)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._user)||void 0===i?void 0:i.id):void 0}}class Ws extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.color=null!==(a=i.color)&&void 0!==a?a:void 0,this.createdAt=null!==(t=Ss(i.createdAt))&&void 0!==t?t:void 0,this.description=null!==(d=i.description)&&void 0!==d?d:void 0,this.filters=null!==(l=gs(i.filters))&&void 0!==l?l:void 0,this.icon=null!==(o=i.icon)&&void 0!==o?o:void 0,this.id=null!==(r=i.id)&&void 0!==r?r:void 0,this.name=null!==(s=i.name)&&void 0!==s?s:void 0,this.shared=null!==(u=i.shared)&&void 0!==u?u:void 0,this.updatedAt=null!==(m=Ss(i.updatedAt))&&void 0!==m?m:void 0,this._creator=null!==(k=i.creator)&&void 0!==k?k:void 0,this._team=null!==(v=i.team)&&void 0!==v?v:void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}get organization(){return new Hk(this._request).fetch()}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new Bv(this._request).fetch(this.id):void 0}update(e){return this.id?new Ev(this._request).fetch(this.id,e):void 0}}class Qs extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Ws(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class Hs extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._customView=null!==(t=i.customView)&&void 0!==t?t:void 0}get customView(){var e,i;return(null===(e=this._customView)||void 0===e?void 0:e.id)?new bk(this._request).fetch(null===(i=this._customView)||void 0===i?void 0:i.id):void 0}}class Gs extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v,c,p,N;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.autoArchivedAt=null!==(a=Ss(i.autoArchivedAt))&&void 0!==a?a:void 0,this.completedAt=null!==(t=Ss(i.completedAt))&&void 0!==t?t:void 0,this.completedIssueCountHistory=null!==(d=i.completedIssueCountHistory)&&void 0!==d?d:void 0,this.completedScopeHistory=null!==(l=i.completedScopeHistory)&&void 0!==l?l:void 0,this.createdAt=null!==(o=Ss(i.createdAt))&&void 0!==o?o:void 0,this.endsAt=null!==(r=Ss(i.endsAt))&&void 0!==r?r:void 0,this.id=null!==(s=i.id)&&void 0!==s?s:void 0,this.issueCountHistory=null!==(u=i.issueCountHistory)&&void 0!==u?u:void 0,this.name=null!==(m=i.name)&&void 0!==m?m:void 0,this.number=null!==(k=i.number)&&void 0!==k?k:void 0,this.scopeHistory=null!==(v=i.scopeHistory)&&void 0!==v?v:void 0,this.startsAt=null!==(c=Ss(i.startsAt))&&void 0!==c?c:void 0,this.updatedAt=null!==(p=Ss(i.updatedAt))&&void 0!==p?p:void 0,this._team=null!==(N=i.team)&&void 0!==N?N:void 0}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}issues(e){return this.id?new aN(this._request,this.id,e).fetch(e):void 0}uncompletedIssuesUponClose(e){return this.id?new tN(this._request,this.id,e).fetch(e):void 0}archive(){return this.id?new Rv(this._request).fetch(this.id):void 0}update(e){return this.id?new Lv(this._request).fetch(this.id,e):void 0}}class Ks extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Gs(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class $s extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._cycle=null!==(t=i.cycle)&&void 0!==t?t:void 0}get cycle(){var e,i;return(null===(e=this._cycle)||void 0===e?void 0:e.id)?new Sk(this._request).fetch(null===(i=this._cycle)||void 0===i?void 0:i.id):void 0}}class Js extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class Zs extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class Ys extends fs{constructor(e,i){var n,a;super(e),this.authType=null!==(n=i.authType)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0}}class Xs extends fs{constructor(e,i){var n,a,t,d,l,o,r,s;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.name=null!==(d=i.name)&&void 0!==d?d:void 0,this.source=null!==(l=i.source)&&void 0!==l?l:void 0,this.updatedAt=null!==(o=Ss(i.updatedAt))&&void 0!==o?o:void 0,this.url=null!==(r=i.url)&&void 0!==r?r:void 0,this._creator=null!==(s=i.creator)&&void 0!==s?s:void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}get organization(){return new Hk(this._request).fetch()}delete(){return this.id?new Jv(this._request).fetch(this.id):void 0}}class eu extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Xs(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class iu extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._emoji=null!==(t=i.emoji)&&void 0!==t?t:void 0}get emoji(){var e,i;return(null===(e=this._emoji)||void 0===e?void 0:e.id)?new Dk(this._request).fetch(null===(i=this._emoji)||void 0===i?void 0:i.id):void 0}}class nu extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class au extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.sortOrder=null!==(d=i.sortOrder)&&void 0!==d?d:void 0,this.type=null!==(l=i.type)&&void 0!==l?l:void 0,this.updatedAt=null!==(o=Ss(i.updatedAt))&&void 0!==o?o:void 0,this._cycle=null!==(r=i.cycle)&&void 0!==r?r:void 0,this._issue=null!==(s=i.issue)&&void 0!==s?s:void 0,this._label=null!==(u=i.label)&&void 0!==u?u:void 0,this._project=null!==(m=i.project)&&void 0!==m?m:void 0,this._projectTeam=null!==(k=i.projectTeam)&&void 0!==k?k:void 0,this._user=null!==(v=i.user)&&void 0!==v?v:void 0}get cycle(){var e,i;return(null===(e=this._cycle)||void 0===e?void 0:e.id)?new Sk(this._request).fetch(null===(i=this._cycle)||void 0===i?void 0:i.id):void 0}get issue(){var e,i;return(null===(e=this._issue)||void 0===e?void 0:e.id)?new qk(this._request).fetch(null===(i=this._issue)||void 0===i?void 0:i.id):void 0}get label(){var e,i;return(null===(e=this._label)||void 0===e?void 0:e.id)?new Ck(this._request).fetch(null===(i=this._label)||void 0===i?void 0:i.id):void 0}get project(){var e,i;return(null===(e=this._project)||void 0===e?void 0:e.id)?new Jk(this._request).fetch(null===(i=this._project)||void 0===i?void 0:i.id):void 0}get projectTeam(){var e,i;return(null===(e=this._projectTeam)||void 0===e?void 0:e.id)?new Jk(this._request).fetch(null===(i=this._projectTeam)||void 0===i?void 0:i.id):void 0}get user(){var e,i;return(null===(e=this._user)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._user)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new Xv(this._request).fetch(this.id):void 0}update(e){return this.id?new ec(this._request).fetch(this.id,e):void 0}}class tu extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new au(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class du extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._favorite=null!==(t=i.favorite)&&void 0!==t?t:void 0}get favorite(){var e,i;return(null===(e=this._favorite)||void 0===e?void 0:e.id)?new Fk(this._request).fetch(null===(i=this._favorite)||void 0===i?void 0:i.id):void 0}}class lu extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class ou extends fs{constructor(e,i){var n,a,t,d;super(e),this.lastModified=null!==(n=Ss(i.lastModified))&&void 0!==n?n:void 0,this.name=null!==(a=i.name)&&void 0!==a?a:void 0,this.nodeName=null!==(t=i.nodeName)&&void 0!==t?t:void 0,this.url=null!==(d=i.url)&&void 0!==d?d:void 0}}class ru extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0,this.figmaEmbed=i.figmaEmbed?new ou(e,i.figmaEmbed):void 0}}class su extends fs{constructor(e,i){var n;super(e),this.token=null!==(n=i.token)&&void 0!==n?n:void 0,this.organizations=i.organizations?i.organizations.map((i=>new uu(e,i))):void 0}}class uu extends fs{constructor(e,i){var n,a,t;super(e),this.id=null!==(n=i.id)&&void 0!==n?n:void 0,this.login=null!==(a=i.login)&&void 0!==a?a:void 0,this.name=null!==(t=i.name)&&void 0!==t?t:void 0,this.repositories=i.repositories?i.repositories.map((i=>new mu(e,i))):void 0}}class mu extends fs{constructor(e,i){var n,a;super(e),this.id=null!==(n=i.id)&&void 0!==n?n:void 0,this.name=null!==(a=i.name)&&void 0!==a?a:void 0}}class ku extends fs{constructor(e,i){var n,a,t,d;super(e),this.sheetId=null!==(n=i.sheetId)&&void 0!==n?n:void 0,this.spreadsheetId=null!==(a=i.spreadsheetId)&&void 0!==a?a:void 0,this.spreadsheetUrl=null!==(t=i.spreadsheetUrl)&&void 0!==t?t:void 0,this.updatedIssuesAt=null!==(d=Ss(i.updatedIssuesAt))&&void 0!==d?d:void 0}}class vu extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.url=null!==(t=i.url)&&void 0!==t?t:void 0}}class cu extends fs{constructor(e,i){var n,a,t,d,l,o,r;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.service=null!==(d=i.service)&&void 0!==d?d:void 0,this.updatedAt=null!==(l=Ss(i.updatedAt))&&void 0!==l?l:void 0,this._creator=null!==(o=i.creator)&&void 0!==o?o:void 0,this._team=null!==(r=i.team)&&void 0!==r?r:void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}get organization(){return new Hk(this._request).fetch()}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new dc(this._request).fetch(this.id):void 0}resourceArchive(){return this.id?new vc(this._request).fetch(this.id):void 0}}class pu extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new cu(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class Nu extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._integration=null!==(t=i.integration)&&void 0!==t?t:void 0}get integration(){var e,i;return(null===(e=this._integration)||void 0===e?void 0:e.id)?new Tk(this._request).fetch(null===(i=this._integration)||void 0===i?void 0:i.id):void 0}}class hu extends fs{constructor(e,i){var n,a,t,d,l,o,r,s;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.resourceId=null!==(d=i.resourceId)&&void 0!==d?d:void 0,this.resourceType=null!==(l=i.resourceType)&&void 0!==l?l:void 0,this.updatedAt=null!==(o=Ss(i.updatedAt))&&void 0!==o?o:void 0,this.data=i.data?new fu(e,i.data):void 0,this.pullRequest=i.pullRequest?new cm(e,i.pullRequest):void 0,this._integration=null!==(r=i.integration)&&void 0!==r?r:void 0,this._issue=null!==(s=i.issue)&&void 0!==s?s:void 0}get integration(){var e,i;return(null===(e=this._integration)||void 0===e?void 0:e.id)?new Tk(this._request).fetch(null===(i=this._integration)||void 0===i?void 0:i.id):void 0}get issue(){var e,i;return(null===(e=this._issue)||void 0===e?void 0:e.id)?new qk(this._request).fetch(null===(i=this._issue)||void 0===i?void 0:i.id):void 0}archive(){return this.id?new vc(this._request).fetch(this.id):void 0}}class fu extends fs{constructor(e,i){super(e),this.githubCommit=i.githubCommit?new Rs(e,i.githubCommit):void 0,this.githubPullRequest=i.githubPullRequest?new cm(e,i.githubPullRequest):void 0,this.gitlabMergeRequest=i.gitlabMergeRequest?new cm(e,i.gitlabMergeRequest):void 0,this.sentryIssue=i.sentryIssue?new gm(e,i.sentryIssue):void 0}}class bu extends fs{constructor(e,i){var n,a,t,d,l,o,r,s;super(e),this.avatarURLs=null!==(n=i.avatarURLs)&&void 0!==n?n:void 0,this.inviterName=null!==(a=i.inviterName)&&void 0!==a?a:void 0,this.organizationDomain=null!==(t=i.organizationDomain)&&void 0!==t?t:void 0,this.organizationLogoUrl=null!==(d=i.organizationLogoUrl)&&void 0!==d?d:void 0,this.organizationName=null!==(l=i.organizationName)&&void 0!==l?l:void 0,this.teamIds=null!==(o=i.teamIds)&&void 0!==o?o:void 0,this.teamNames=null!==(r=i.teamNames)&&void 0!==r?r:void 0,this.userCount=null!==(s=i.userCount)&&void 0!==s?s:void 0}}class yu extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0,this.inviteData=i.inviteData?new bu(e,i.inviteData):void 0}}class Su extends fs{constructor(e,i){var n,a,t,d,l;super(e),this.created=null!==(n=Ss(i.created))&&void 0!==n?n:void 0,this.dueDate=null!==(a=i.dueDate)&&void 0!==a?a:void 0,this.status=null!==(t=i.status)&&void 0!==t?t:void 0,this.total=null!==(d=i.total)&&void 0!==d?d:void 0,this.url=null!==(l=i.url)&&void 0!==l?l:void 0}}class gu extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v,c,p,N,h,f,b,y,S,g,D,V,F,A,_,T,I,w,q,x;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.autoArchivedAt=null!==(a=Ss(i.autoArchivedAt))&&void 0!==a?a:void 0,this.autoClosedAt=null!==(t=Ss(i.autoClosedAt))&&void 0!==t?t:void 0,this.boardOrder=null!==(d=i.boardOrder)&&void 0!==d?d:void 0,this.branchName=null!==(l=i.branchName)&&void 0!==l?l:void 0,this.canceledAt=null!==(o=Ss(i.canceledAt))&&void 0!==o?o:void 0,this.completedAt=null!==(r=Ss(i.completedAt))&&void 0!==r?r:void 0,this.createdAt=null!==(s=Ss(i.createdAt))&&void 0!==s?s:void 0,this.customerTicketCount=null!==(u=i.customerTicketCount)&&void 0!==u?u:void 0,this.description=null!==(m=i.description)&&void 0!==m?m:void 0,this.dueDate=null!==(k=i.dueDate)&&void 0!==k?k:void 0,this.estimate=null!==(v=i.estimate)&&void 0!==v?v:void 0,this.id=null!==(c=i.id)&&void 0!==c?c:void 0,this.identifier=null!==(p=i.identifier)&&void 0!==p?p:void 0,this.number=null!==(N=i.number)&&void 0!==N?N:void 0,this.previousIdentifiers=null!==(h=i.previousIdentifiers)&&void 0!==h?h:void 0,this.priority=null!==(f=i.priority)&&void 0!==f?f:void 0,this.priorityLabel=null!==(b=i.priorityLabel)&&void 0!==b?b:void 0,this.startedAt=null!==(y=Ss(i.startedAt))&&void 0!==y?y:void 0,this.subIssueSortOrder=null!==(S=i.subIssueSortOrder)&&void 0!==S?S:void 0,this.title=null!==(g=i.title)&&void 0!==g?g:void 0,this.trashed=null!==(D=i.trashed)&&void 0!==D?D:void 0,this.updatedAt=null!==(V=Ss(i.updatedAt))&&void 0!==V?V:void 0,this.url=null!==(F=i.url)&&void 0!==F?F:void 0,this._assignee=null!==(A=i.assignee)&&void 0!==A?A:void 0,this._creator=null!==(_=i.creator)&&void 0!==_?_:void 0,this._cycle=null!==(T=i.cycle)&&void 0!==T?T:void 0,this._parent=null!==(I=i.parent)&&void 0!==I?I:void 0,this._project=null!==(w=i.project)&&void 0!==w?w:void 0,this._state=null!==(q=i.state)&&void 0!==q?q:void 0,this._team=null!==(x=i.team)&&void 0!==x?x:void 0}get assignee(){var e,i;return(null===(e=this._assignee)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._assignee)||void 0===i?void 0:i.id):void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}get cycle(){var e,i;return(null===(e=this._cycle)||void 0===e?void 0:e.id)?new Sk(this._request).fetch(null===(i=this._cycle)||void 0===i?void 0:i.id):void 0}get parent(){var e,i;return(null===(e=this._parent)||void 0===e?void 0:e.id)?new uk(this._request).fetch(null===(i=this._parent)||void 0===i?void 0:i.id):void 0}get project(){var e,i;return(null===(e=this._project)||void 0===e?void 0:e.id)?new Jk(this._request).fetch(null===(i=this._project)||void 0===i?void 0:i.id):void 0}get state(){var e,i;return(null===(e=this._state)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._state)||void 0===i?void 0:i.id):void 0}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}attachments(e){return this.id?new dN(this._request,this.id,e).fetch(e):void 0}children(e){return this.id?new lN(this._request,this.id,e).fetch(e):void 0}comments(e){return this.id?new oN(this._request,this.id,e).fetch(e):void 0}history(e){return this.id?new rN(this._request,this.id,e).fetch(e):void 0}inverseRelations(e){return this.id?new sN(this._request,this.id,e).fetch(e):void 0}labels(e){return this.id?new uN(this._request,this.id,e).fetch(e):void 0}relations(e){return this.id?new mN(this._request,this.id,e).fetch(e):void 0}subscribers(e){return this.id?new kN(this._request,this.id,e).fetch(e):void 0}archive(e){return this.id?new Sc(this._request).fetch(this.id):void 0}delete(){return this.id?new Dc(this._request).fetch(this.id):void 0}unarchive(){return this.id?new jc(this._request).fetch(this.id):void 0}update(e){return this.id?new Uc(this._request).fetch(this.id,e):void 0}}class Du extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new gu(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class Vu extends fs{constructor(e,i){var n,a,t,d,l;super(e),this.actorId=null!==(n=i.actorId)&&void 0!==n?n:void 0,this.descriptionData=null!==(a=i.descriptionData)&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.type=null!==(d=i.type)&&void 0!==d?d:void 0,this.updatedAt=null!==(l=Ss(i.updatedAt))&&void 0!==l?l:void 0}}class Fu extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v,c,p,N,h,f,b,y,S,g,D,V,F,A,_,T,I,w,q,x,C,O;super(e),this.addedLabelIds=null!==(n=i.addedLabelIds)&&void 0!==n?n:void 0,this.archived=null!==(a=i.archived)&&void 0!==a?a:void 0,this.archivedAt=null!==(t=Ss(i.archivedAt))&&void 0!==t?t:void 0,this.autoArchived=null!==(d=i.autoArchived)&&void 0!==d?d:void 0,this.autoClosed=null!==(l=i.autoClosed)&&void 0!==l?l:void 0,this.createdAt=null!==(o=Ss(i.createdAt))&&void 0!==o?o:void 0,this.fromDueDate=null!==(r=i.fromDueDate)&&void 0!==r?r:void 0,this.fromEstimate=null!==(s=i.fromEstimate)&&void 0!==s?s:void 0,this.fromPriority=null!==(u=i.fromPriority)&&void 0!==u?u:void 0,this.fromTitle=null!==(m=i.fromTitle)&&void 0!==m?m:void 0,this.id=null!==(k=i.id)&&void 0!==k?k:void 0,this.removedLabelIds=null!==(v=i.removedLabelIds)&&void 0!==v?v:void 0,this.source=null!==(c=gs(i.source))&&void 0!==c?c:void 0,this.toDueDate=null!==(p=i.toDueDate)&&void 0!==p?p:void 0,this.toEstimate=null!==(N=i.toEstimate)&&void 0!==N?N:void 0,this.toPriority=null!==(h=i.toPriority)&&void 0!==h?h:void 0,this.toTitle=null!==(f=i.toTitle)&&void 0!==f?f:void 0,this.updatedAt=null!==(b=Ss(i.updatedAt))&&void 0!==b?b:void 0,this.updatedDescription=null!==(y=i.updatedDescription)&&void 0!==y?y:void 0,this.relationChanges=i.relationChanges?i.relationChanges.map((i=>new Uu(e,i))):void 0,this._actor=null!==(S=i.actor)&&void 0!==S?S:void 0,this._fromAssignee=null!==(g=i.fromAssignee)&&void 0!==g?g:void 0,this._fromCycle=null!==(D=i.fromCycle)&&void 0!==D?D:void 0,this._fromParent=null!==(V=i.fromParent)&&void 0!==V?V:void 0,this._fromProject=null!==(F=i.fromProject)&&void 0!==F?F:void 0,this._fromState=null!==(A=i.fromState)&&void 0!==A?A:void 0,this._fromTeam=null!==(_=i.fromTeam)&&void 0!==_?_:void 0,this._issue=null!==(T=i.issue)&&void 0!==T?T:void 0,this._toAssignee=null!==(I=i.toAssignee)&&void 0!==I?I:void 0,this._toCycle=null!==(w=i.toCycle)&&void 0!==w?w:void 0,this._toParent=null!==(q=i.toParent)&&void 0!==q?q:void 0,this._toProject=null!==(x=i.toProject)&&void 0!==x?x:void 0,this._toState=null!==(C=i.toState)&&void 0!==C?C:void 0,this._toTeam=null!==(O=i.toTeam)&&void 0!==O?O:void 0}get actor(){var e,i;return(null===(e=this._actor)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._actor)||void 0===i?void 0:i.id):void 0}get fromAssignee(){var e,i;return(null===(e=this._fromAssignee)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._fromAssignee)||void 0===i?void 0:i.id):void 0}get fromCycle(){var e,i;return(null===(e=this._fromCycle)||void 0===e?void 0:e.id)?new Sk(this._request).fetch(null===(i=this._fromCycle)||void 0===i?void 0:i.id):void 0}get fromParent(){var e,i;return(null===(e=this._fromParent)||void 0===e?void 0:e.id)?new uk(this._request).fetch(null===(i=this._fromParent)||void 0===i?void 0:i.id):void 0}get fromProject(){var e,i;return(null===(e=this._fromProject)||void 0===e?void 0:e.id)?new Jk(this._request).fetch(null===(i=this._fromProject)||void 0===i?void 0:i.id):void 0}get fromState(){var e,i;return(null===(e=this._fromState)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._fromState)||void 0===i?void 0:i.id):void 0}get fromTeam(){var e,i;return(null===(e=this._fromTeam)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._fromTeam)||void 0===i?void 0:i.id):void 0}get issue(){var e,i;return(null===(e=this._issue)||void 0===e?void 0:e.id)?new qk(this._request).fetch(null===(i=this._issue)||void 0===i?void 0:i.id):void 0}get toAssignee(){var e,i;return(null===(e=this._toAssignee)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._toAssignee)||void 0===i?void 0:i.id):void 0}get toCycle(){var e,i;return(null===(e=this._toCycle)||void 0===e?void 0:e.id)?new Sk(this._request).fetch(null===(i=this._toCycle)||void 0===i?void 0:i.id):void 0}get toParent(){var e,i;return(null===(e=this._toParent)||void 0===e?void 0:e.id)?new uk(this._request).fetch(null===(i=this._toParent)||void 0===i?void 0:i.id):void 0}get toProject(){var e,i;return(null===(e=this._toProject)||void 0===e?void 0:e.id)?new Jk(this._request).fetch(null===(i=this._toProject)||void 0===i?void 0:i.id):void 0}get toState(){var e,i;return(null===(e=this._toState)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._toState)||void 0===i?void 0:i.id):void 0}get toTeam(){var e,i;return(null===(e=this._toTeam)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._toTeam)||void 0===i?void 0:i.id):void 0}}class Au extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Fu(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class _u extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.creatorId=null!==(t=i.creatorId)&&void 0!==t?t:void 0,this.error=null!==(d=i.error)&&void 0!==d?d:void 0,this.id=null!==(l=i.id)&&void 0!==l?l:void 0,this.mapping=null!==(o=gs(i.mapping))&&void 0!==o?o:void 0,this.service=null!==(r=i.service)&&void 0!==r?r:void 0,this.status=null!==(s=i.status)&&void 0!==s?s:void 0,this.updatedAt=null!==(u=Ss(i.updatedAt))&&void 0!==u?u:void 0}delete(e){return new Tc(this._request).fetch(e)}}class Tu extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.issueImport=i.issueImport?new _u(e,i.issueImport):void 0}}class Iu extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.issueImport=i.issueImport?new _u(e,i.issueImport):void 0}}class wu extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.color=null!==(a=i.color)&&void 0!==a?a:void 0,this.createdAt=null!==(t=Ss(i.createdAt))&&void 0!==t?t:void 0,this.description=null!==(d=i.description)&&void 0!==d?d:void 0,this.id=null!==(l=i.id)&&void 0!==l?l:void 0,this.name=null!==(o=i.name)&&void 0!==o?o:void 0,this.updatedAt=null!==(r=Ss(i.updatedAt))&&void 0!==r?r:void 0,this._creator=null!==(s=i.creator)&&void 0!==s?s:void 0,this._team=null!==(u=i.team)&&void 0!==u?u:void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}issues(e){return this.id?new vN(this._request,this.id,e).fetch(e):void 0}archive(){return this.id?new wc(this._request).fetch(this.id):void 0}update(e){return this.id?new xc(this._request).fetch(this.id,e):void 0}}class qu extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new wu(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class xu extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._issueLabel=null!==(t=i.issueLabel)&&void 0!==t?t:void 0}get issueLabel(){var e,i;return(null===(e=this._issueLabel)||void 0===e?void 0:e.id)?new Ck(this._request).fetch(null===(i=this._issueLabel)||void 0===i?void 0:i.id):void 0}}class Cu extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._issue=null!==(t=i.issue)&&void 0!==t?t:void 0}get issue(){var e,i;return(null===(e=this._issue)||void 0===e?void 0:e.id)?new qk(this._request).fetch(null===(i=this._issue)||void 0===i?void 0:i.id):void 0}}class Ou extends fs{constructor(e,i){var n,a;super(e),this.label=null!==(n=i.label)&&void 0!==n?n:void 0,this.priority=null!==(a=i.priority)&&void 0!==a?a:void 0}}class Pu extends fs{constructor(e,i){var n,a,t,d,l,o,r;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.type=null!==(d=i.type)&&void 0!==d?d:void 0,this.updatedAt=null!==(l=Ss(i.updatedAt))&&void 0!==l?l:void 0,this._issue=null!==(o=i.issue)&&void 0!==o?o:void 0,this._relatedIssue=null!==(r=i.relatedIssue)&&void 0!==r?r:void 0}get issue(){var e,i;return(null===(e=this._issue)||void 0===e?void 0:e.id)?new qk(this._request).fetch(null===(i=this._issue)||void 0===i?void 0:i.id):void 0}get relatedIssue(){var e,i;return(null===(e=this._relatedIssue)||void 0===e?void 0:e.id)?new uk(this._request).fetch(null===(i=this._relatedIssue)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new Oc(this._request).fetch(this.id):void 0}update(e){return this.id?new Pc(this._request).fetch(this.id,e):void 0}}class ju extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Pu(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class Uu extends fs{constructor(e,i){var n,a;super(e),this.identifier=null!==(n=i.identifier)&&void 0!==n?n:void 0,this.type=null!==(a=i.type)&&void 0!==a?a:void 0}}class Bu extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._issueRelation=null!==(t=i.issueRelation)&&void 0!==t?t:void 0}get issueRelation(){var e,i;return(null===(e=this._issueRelation)||void 0===e?void 0:e.id)?new jk(this._request).fetch(null===(i=this._issueRelation)||void 0===i?void 0:i.id):void 0}}class Eu extends fs{constructor(e,i){var n,a,t,d,l,o;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.name=null!==(d=i.name)&&void 0!==d?d:void 0,this.sortOrder=null!==(l=i.sortOrder)&&void 0!==l?l:void 0,this.updatedAt=null!==(o=Ss(i.updatedAt))&&void 0!==o?o:void 0}get organization(){return new Hk(this._request).fetch()}projects(e){return this.id?new cN(this._request,this.id,e).fetch(e):void 0}delete(){return this.id?new zc(this._request).fetch(this.id):void 0}update(e){return this.id?new Lc(this._request).fetch(this.id,e):void 0}}class Ru extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Eu(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class zu extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._milestone=null!==(t=i.milestone)&&void 0!==t?t:void 0}get milestone(){var e,i;return(null===(e=this._milestone)||void 0===e?void 0:e.id)?new Rk(this._request).fetch(null===(i=this._milestone)||void 0===i?void 0:i.id):void 0}}class Lu extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v,c;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.emailedAt=null!==(t=Ss(i.emailedAt))&&void 0!==t?t:void 0,this.id=null!==(d=i.id)&&void 0!==d?d:void 0,this.reactionEmoji=null!==(l=i.reactionEmoji)&&void 0!==l?l:void 0,this.readAt=null!==(o=Ss(i.readAt))&&void 0!==o?o:void 0,this.snoozedUntilAt=null!==(r=Ss(i.snoozedUntilAt))&&void 0!==r?r:void 0,this.type=null!==(s=i.type)&&void 0!==s?s:void 0,this.updatedAt=null!==(u=Ss(i.updatedAt))&&void 0!==u?u:void 0,this._comment=null!==(m=i.comment)&&void 0!==m?m:void 0,this._issue=null!==(k=i.issue)&&void 0!==k?k:void 0,this._team=null!==(v=i.team)&&void 0!==v?v:void 0,this._user=null!==(c=i.user)&&void 0!==c?c:void 0}get comment(){var e,i;return(null===(e=this._comment)||void 0===e?void 0:e.id)?new hk(this._request).fetch(null===(i=this._comment)||void 0===i?void 0:i.id):void 0}get issue(){var e,i;return(null===(e=this._issue)||void 0===e?void 0:e.id)?new qk(this._request).fetch(null===(i=this._issue)||void 0===i?void 0:i.id):void 0}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}get user(){var e,i;return(null===(e=this._user)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._user)||void 0===i?void 0:i.id):void 0}archive(){return this.id?new Mc(this._request).fetch(this.id):void 0}unarchive(){return this.id?new Gc(this._request).fetch(this.id):void 0}update(e){return this.id?new Kc(this._request).fetch(this.id,e):void 0}}class Mu extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Lu(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class Wu extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._notification=null!==(t=i.notification)&&void 0!==t?t:void 0}get notification(){var e,i;return(null===(e=this._notification)||void 0===e?void 0:e.id)?new Lk(this._request).fetch(null===(i=this._notification)||void 0===i?void 0:i.id):void 0}}class Qu extends fs{constructor(e,i){var n,a,t,d,l,o,r,s;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.type=null!==(d=i.type)&&void 0!==d?d:void 0,this.updatedAt=null!==(l=Ss(i.updatedAt))&&void 0!==l?l:void 0,this._project=null!==(o=i.project)&&void 0!==o?o:void 0,this._team=null!==(r=i.team)&&void 0!==r?r:void 0,this._user=null!==(s=i.user)&&void 0!==s?s:void 0}get project(){var e,i;return(null===(e=this._project)||void 0===e?void 0:e.id)?new Jk(this._request).fetch(null===(i=this._project)||void 0===i?void 0:i.id):void 0}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}get user(){var e,i;return(null===(e=this._user)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._user)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new Hc(this._request).fetch(this.id):void 0}}class Hu extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Qu(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class Gu extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._notificationSubscription=null!==(t=i.notificationSubscription)&&void 0!==t?t:void 0}get notificationSubscription(){var e,i;return(null===(e=this._notificationSubscription)||void 0===e?void 0:e.id)?new Mk(this._request).fetch(null===(i=this._notificationSubscription)||void 0===i?void 0:i.id):void 0}}class Ku extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v,c;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.clientId=null!==(a=i.clientId)&&void 0!==a?a:void 0,this.clientSecret=null!==(t=i.clientSecret)&&void 0!==t?t:void 0,this.createdAt=null!==(d=Ss(i.createdAt))&&void 0!==d?d:void 0,this.description=null!==(l=i.description)&&void 0!==l?l:void 0,this.developer=null!==(o=i.developer)&&void 0!==o?o:void 0,this.developerUrl=null!==(r=i.developerUrl)&&void 0!==r?r:void 0,this.id=null!==(s=i.id)&&void 0!==s?s:void 0,this.imageUrl=null!==(u=i.imageUrl)&&void 0!==u?u:void 0,this.name=null!==(m=i.name)&&void 0!==m?m:void 0,this.publicEnabled=null!==(k=i.publicEnabled)&&void 0!==k?k:void 0,this.redirectUris=null!==(v=i.redirectUris)&&void 0!==v?v:void 0,this.updatedAt=null!==(c=Ss(i.updatedAt))&&void 0!==c?c:void 0}archive(){return this.id?new $c(this._request).fetch(this.id):void 0}rotateSecret(){return this.id?new Zc(this._request).fetch(this.id):void 0}update(e){return this.id?new Yc(this._request).fetch(this.id,e):void 0}}class $u extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.oauthClient=i.oauthClient?new Ku(e,i.oauthClient):void 0}}class Ju extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class Zu extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v,c,p,N,h,f;super(e),this.allowedAuthServices=null!==(n=i.allowedAuthServices)&&void 0!==n?n:void 0,this.archivedAt=null!==(a=Ss(i.archivedAt))&&void 0!==a?a:void 0,this.createdAt=null!==(t=Ss(i.createdAt))&&void 0!==t?t:void 0,this.createdIssueCount=null!==(d=i.createdIssueCount)&&void 0!==d?d:void 0,this.deletionRequestedAt=null!==(l=Ss(i.deletionRequestedAt))&&void 0!==l?l:void 0,this.gitBranchFormat=null!==(o=i.gitBranchFormat)&&void 0!==o?o:void 0,this.gitLinkbackMessagesEnabled=null!==(r=i.gitLinkbackMessagesEnabled)&&void 0!==r?r:void 0,this.gitPublicLinkbackMessagesEnabled=null!==(s=i.gitPublicLinkbackMessagesEnabled)&&void 0!==s?s:void 0,this.id=null!==(u=i.id)&&void 0!==u?u:void 0,this.logoUrl=null!==(m=i.logoUrl)&&void 0!==m?m:void 0,this.name=null!==(k=i.name)&&void 0!==k?k:void 0,this.periodUploadVolume=null!==(v=i.periodUploadVolume)&&void 0!==v?v:void 0,this.roadmapEnabled=null!==(c=i.roadmapEnabled)&&void 0!==c?c:void 0,this.samlEnabled=null!==(p=i.samlEnabled)&&void 0!==p?p:void 0,this.updatedAt=null!==(N=Ss(i.updatedAt))&&void 0!==N?N:void 0,this.urlKey=null!==(h=i.urlKey)&&void 0!==h?h:void 0,this.userCount=null!==(f=i.userCount)&&void 0!==f?f:void 0}get subscription(){return new tv(this._request).fetch()}integrations(e){return new pN(this._request,e).fetch(e)}milestones(e){return new NN(this._request,e).fetch(e)}teams(e){return new hN(this._request,e).fetch(e)}users(e){return new fN(this._request,e).fetch(e)}delete(e){return new ip(this._request).fetch(e)}update(e){return new rp(this._request).fetch(e)}}class Yu extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class Xu extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class em extends fs{constructor(e,i){var n,a,t,d,l,o,r,s;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.name=null!==(d=i.name)&&void 0!==d?d:void 0,this.updatedAt=null!==(l=Ss(i.updatedAt))&&void 0!==l?l:void 0,this.verificationEmail=null!==(o=i.verificationEmail)&&void 0!==o?o:void 0,this.verified=null!==(r=i.verified)&&void 0!==r?r:void 0,this._creator=null!==(s=i.creator)&&void 0!==s?s:void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new tp(this._request).fetch(this.id):void 0}}class im extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.organizationDomain=i.organizationDomain?new em(e,i.organizationDomain):void 0}}class nm extends fs{constructor(e,i){var n,a;super(e),this.exists=null!==(n=i.exists)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0}}class am extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m;super(e),this.acceptedAt=null!==(n=Ss(i.acceptedAt))&&void 0!==n?n:void 0,this.archivedAt=null!==(a=Ss(i.archivedAt))&&void 0!==a?a:void 0,this.createdAt=null!==(t=Ss(i.createdAt))&&void 0!==t?t:void 0,this.email=null!==(d=i.email)&&void 0!==d?d:void 0,this.expiresAt=null!==(l=Ss(i.expiresAt))&&void 0!==l?l:void 0,this.external=null!==(o=i.external)&&void 0!==o?o:void 0,this.id=null!==(r=i.id)&&void 0!==r?r:void 0,this.updatedAt=null!==(s=Ss(i.updatedAt))&&void 0!==s?s:void 0,this._invitee=null!==(u=i.invitee)&&void 0!==u?u:void 0,this._inviter=null!==(m=i.inviter)&&void 0!==m?m:void 0}get invitee(){var e,i;return(null===(e=this._invitee)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._invitee)||void 0===i?void 0:i.id):void 0}get inviter(){var e,i;return(null===(e=this._inviter)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._inviter)||void 0===i?void 0:i.id):void 0}get organization(){return new Hk(this._request).fetch()}issues(e){return this.id?new bN(this._request,this.id,e).fetch(e):void 0}delete(){return this.id?new op(this._request).fetch(this.id):void 0}}class tm extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new am(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class dm extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.organizationInvite=i.organizationInvite?new am(e,i.organizationInvite):void 0}}class lm extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0}get organization(){return new Hk(this._request).fetch()}}class om extends fs{constructor(e,i){var n,a,t,d;super(e),this.endCursor=null!==(n=i.endCursor)&&void 0!==n?n:void 0,this.hasNextPage=null!==(a=i.hasNextPage)&&void 0!==a?a:void 0,this.hasPreviousPage=null!==(t=i.hasPreviousPage)&&void 0!==t?t:void 0,this.startCursor=null!==(d=i.startCursor)&&void 0!==d?d:void 0}}class rm extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v,c,p,N,h,f,b,y,S,g,D,V,F,A,_;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.autoArchivedAt=null!==(a=Ss(i.autoArchivedAt))&&void 0!==a?a:void 0,this.canceledAt=null!==(t=Ss(i.canceledAt))&&void 0!==t?t:void 0,this.color=null!==(d=i.color)&&void 0!==d?d:void 0,this.completedAt=null!==(l=Ss(i.completedAt))&&void 0!==l?l:void 0,this.completedIssueCountHistory=null!==(o=i.completedIssueCountHistory)&&void 0!==o?o:void 0,this.completedScopeHistory=null!==(r=i.completedScopeHistory)&&void 0!==r?r:void 0,this.createdAt=null!==(s=Ss(i.createdAt))&&void 0!==s?s:void 0,this.description=null!==(u=i.description)&&void 0!==u?u:void 0,this.icon=null!==(m=i.icon)&&void 0!==m?m:void 0,this.id=null!==(k=i.id)&&void 0!==k?k:void 0,this.issueCountHistory=null!==(v=i.issueCountHistory)&&void 0!==v?v:void 0,this.name=null!==(c=i.name)&&void 0!==c?c:void 0,this.scopeHistory=null!==(p=i.scopeHistory)&&void 0!==p?p:void 0,this.slackIssueComments=null!==(N=i.slackIssueComments)&&void 0!==N?N:void 0,this.slackIssueStatuses=null!==(h=i.slackIssueStatuses)&&void 0!==h?h:void 0,this.slackNewIssue=null!==(f=i.slackNewIssue)&&void 0!==f?f:void 0,this.slugId=null!==(b=i.slugId)&&void 0!==b?b:void 0,this.sortOrder=null!==(y=i.sortOrder)&&void 0!==y?y:void 0,this.startedAt=null!==(S=Ss(i.startedAt))&&void 0!==S?S:void 0,this.state=null!==(g=i.state)&&void 0!==g?g:void 0,this.targetDate=null!==(D=i.targetDate)&&void 0!==D?D:void 0,this.updatedAt=null!==(V=Ss(i.updatedAt))&&void 0!==V?V:void 0,this._creator=null!==(F=i.creator)&&void 0!==F?F:void 0,this._lead=null!==(A=i.lead)&&void 0!==A?A:void 0,this._milestone=null!==(_=i.milestone)&&void 0!==_?_:void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}get lead(){var e,i;return(null===(e=this._lead)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._lead)||void 0===i?void 0:i.id):void 0}get milestone(){var e,i;return(null===(e=this._milestone)||void 0===e?void 0:e.id)?new Rk(this._request).fetch(null===(i=this._milestone)||void 0===i?void 0:i.id):void 0}issues(e){return this.id?new yN(this._request,this.id,e).fetch(e):void 0}links(e){return this.id?new SN(this._request,this.id,e).fetch(e):void 0}members(e){return this.id?new gN(this._request,this.id,e).fetch(e):void 0}teams(e){return this.id?new DN(this._request,this.id,e).fetch(e):void 0}archive(){return this.id?new sp(this._request).fetch(this.id):void 0}unarchive(){return this.id?new vp(this._request).fetch(this.id):void 0}update(e){return this.id?new cp(this._request).fetch(this.id,e):void 0}}class sm extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new rm(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class um extends fs{constructor(e,i){var n,a,t,d,l,o,r,s;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.label=null!==(d=i.label)&&void 0!==d?d:void 0,this.updatedAt=null!==(l=Ss(i.updatedAt))&&void 0!==l?l:void 0,this.url=null!==(o=i.url)&&void 0!==o?o:void 0,this._creator=null!==(r=i.creator)&&void 0!==r?r:void 0,this._project=null!==(s=i.project)&&void 0!==s?s:void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}get project(){var e,i;return(null===(e=this._project)||void 0===e?void 0:e.id)?new Jk(this._request).fetch(null===(i=this._project)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new kp(this._request).fetch(this.id):void 0}}class mm extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new um(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class km extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._projectLink=null!==(t=i.projectLink)&&void 0!==t?t:void 0}get projectLink(){var e,i;return(null===(e=this._projectLink)||void 0===e?void 0:e.id)?new Zk(this._request).fetch(null===(i=this._projectLink)||void 0===i?void 0:i.id):void 0}}class vm extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._project=null!==(t=i.project)&&void 0!==t?t:void 0}get project(){var e,i;return(null===(e=this._project)||void 0===e?void 0:e.id)?new Jk(this._request).fetch(null===(i=this._project)||void 0===i?void 0:i.id):void 0}}class cm extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v,c,p,N;super(e),this.branch=null!==(n=i.branch)&&void 0!==n?n:void 0,this.closedAt=null!==(a=i.closedAt)&&void 0!==a?a:void 0,this.createdAt=null!==(t=i.createdAt)&&void 0!==t?t:void 0,this.draft=null!==(d=i.draft)&&void 0!==d?d:void 0,this.id=null!==(l=i.id)&&void 0!==l?l:void 0,this.mergedAt=null!==(o=i.mergedAt)&&void 0!==o?o:void 0,this.number=null!==(r=i.number)&&void 0!==r?r:void 0,this.repoLogin=null!==(s=i.repoLogin)&&void 0!==s?s:void 0,this.repoName=null!==(u=i.repoName)&&void 0!==u?u:void 0,this.status=null!==(m=i.status)&&void 0!==m?m:void 0,this.title=null!==(k=i.title)&&void 0!==k?k:void 0,this.updatedAt=null!==(v=i.updatedAt)&&void 0!==v?v:void 0,this.url=null!==(c=i.url)&&void 0!==c?c:void 0,this.userId=null!==(p=i.userId)&&void 0!==p?p:void 0,this.userLogin=null!==(N=i.userLogin)&&void 0!==N?N:void 0}}class pm extends fs{constructor(e,i){var n,a,t,d;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.updatedAt=null!==(d=Ss(i.updatedAt))&&void 0!==d?d:void 0}delete(){return this.id?new Np(this._request).fetch(this.id):void 0}}class Nm extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0}}class hm extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class fm extends fs{constructor(e,i){var n,a,t,d,l,o,r;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.emoji=null!==(t=i.emoji)&&void 0!==t?t:void 0,this.id=null!==(d=i.id)&&void 0!==d?d:void 0,this.updatedAt=null!==(l=Ss(i.updatedAt))&&void 0!==l?l:void 0,this._comment=null!==(o=i.comment)&&void 0!==o?o:void 0,this._user=null!==(r=i.user)&&void 0!==r?r:void 0}get comment(){var e,i;return(null===(e=this._comment)||void 0===e?void 0:e.id)?new hk(this._request).fetch(null===(i=this._comment)||void 0===i?void 0:i.id):void 0}get user(){var e,i;return(null===(e=this._user)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._user)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new fp(this._request).fetch(this.id):void 0}}class bm extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new fm(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class ym extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._reaction=null!==(t=i.reaction)&&void 0!==t?t:void 0}get reaction(){var e,i;return(null===(e=this._reaction)||void 0===e?void 0:e.id)?new iv(this._request).fetch(null===(i=this._reaction)||void 0===i?void 0:i.id):void 0}}class Sm extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0}}class gm extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k;super(e),this.actorId=null!==(n=i.actorId)&&void 0!==n?n:void 0,this.actorName=null!==(a=i.actorName)&&void 0!==a?a:void 0,this.actorType=null!==(t=i.actorType)&&void 0!==t?t:void 0,this.firstSeen=null!==(d=i.firstSeen)&&void 0!==d?d:void 0,this.firstVersion=null!==(l=i.firstVersion)&&void 0!==l?l:void 0,this.issueId=null!==(o=i.issueId)&&void 0!==o?o:void 0,this.issueTitle=null!==(r=i.issueTitle)&&void 0!==r?r:void 0,this.projectId=null!==(s=i.projectId)&&void 0!==s?s:void 0,this.projectSlug=null!==(u=i.projectSlug)&&void 0!==u?u:void 0,this.shortId=null!==(m=i.shortId)&&void 0!==m?m:void 0,this.webUrl=null!==(k=i.webUrl)&&void 0!==k?k:void 0}}class Dm extends fs{constructor(e,i){var n;super(e),this.organizationSlug=null!==(n=i.organizationSlug)&&void 0!==n?n:void 0}}class Vm extends fs{constructor(e,i){var n,a,t;super(e),this.channel=null!==(n=i.channel)&&void 0!==n?n:void 0,this.channelId=null!==(a=i.channelId)&&void 0!==a?a:void 0,this.configurationUrl=null!==(t=i.configurationUrl)&&void 0!==t?t:void 0}}class Fm extends fs{constructor(e,i){var n,a;super(e),this.samlSsoUrl=null!==(n=i.samlSsoUrl)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0}}class Am extends fs{constructor(e,i){var n,a,t;super(e),this.clientIds=null!==(n=i.clientIds)&&void 0!==n?n:void 0,this.steps=null!==(a=i.steps)&&void 0!==a?a:void 0,this.version=null!==(t=i.version)&&void 0!==t?t:void 0}}class _m extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.canceledAt=null!==(a=Ss(i.canceledAt))&&void 0!==a?a:void 0,this.createdAt=null!==(t=Ss(i.createdAt))&&void 0!==t?t:void 0,this.id=null!==(d=i.id)&&void 0!==d?d:void 0,this.nextBillingAt=null!==(l=Ss(i.nextBillingAt))&&void 0!==l?l:void 0,this.pendingChangeType=null!==(o=i.pendingChangeType)&&void 0!==o?o:void 0,this.seats=null!==(r=i.seats)&&void 0!==r?r:void 0,this.type=null!==(s=i.type)&&void 0!==s?s:void 0,this.updatedAt=null!==(u=Ss(i.updatedAt))&&void 0!==u?u:void 0,this._creator=null!==(m=i.creator)&&void 0!==m?m:void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}get organization(){return new Hk(this._request).fetch()}archive(){return this.id?new gp(this._request).fetch(this.id):void 0}update(e){return this.id?new Vp(this._request).fetch(this.id,e):void 0}upgrade(){return this.id&&this.type?new Ap(this._request).fetch(this.id,this.type):void 0}}class Tm extends fs{constructor(e,i){var n,a,t;super(e),this.canceledAt=null!==(n=Ss(i.canceledAt))&&void 0!==n?n:void 0,this.lastSyncId=null!==(a=i.lastSyncId)&&void 0!==a?a:void 0,this.success=null!==(t=i.success)&&void 0!==t?t:void 0}get subscription(){return new tv(this._request).fetch()}}class Im extends fs{constructor(e,i){var n;super(e),this.session=null!==(n=i.session)&&void 0!==n?n:void 0}}class wm extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v,c,p,N,h,f,b,y,S,g,D,V,F,A,_,T,I,w,q,x,C,O,P,j,U,B,E,R,z,L,M;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.autoArchivePeriod=null!==(a=i.autoArchivePeriod)&&void 0!==a?a:void 0,this.autoClosePeriod=null!==(t=i.autoClosePeriod)&&void 0!==t?t:void 0,this.autoCloseStateId=null!==(d=i.autoCloseStateId)&&void 0!==d?d:void 0,this.createdAt=null!==(l=Ss(i.createdAt))&&void 0!==l?l:void 0,this.cycleCalenderUrl=null!==(o=i.cycleCalenderUrl)&&void 0!==o?o:void 0,this.cycleCooldownTime=null!==(r=i.cycleCooldownTime)&&void 0!==r?r:void 0,this.cycleDuration=null!==(s=i.cycleDuration)&&void 0!==s?s:void 0,this.cycleIssueAutoAssignCompleted=null!==(u=i.cycleIssueAutoAssignCompleted)&&void 0!==u?u:void 0,this.cycleIssueAutoAssignStarted=null!==(m=i.cycleIssueAutoAssignStarted)&&void 0!==m?m:void 0,this.cycleLockToActive=null!==(k=i.cycleLockToActive)&&void 0!==k?k:void 0,this.cycleStartDay=null!==(v=i.cycleStartDay)&&void 0!==v?v:void 0,this.cyclesEnabled=null!==(c=i.cyclesEnabled)&&void 0!==c?c:void 0,this.defaultIssueEstimate=null!==(p=i.defaultIssueEstimate)&&void 0!==p?p:void 0,this.defaultTemplateForMembersId=null!==(N=i.defaultTemplateForMembersId)&&void 0!==N?N:void 0,this.defaultTemplateForNonMembersId=null!==(h=i.defaultTemplateForNonMembersId)&&void 0!==h?h:void 0,this.description=null!==(f=i.description)&&void 0!==f?f:void 0,this.groupIssueHistory=null!==(b=i.groupIssueHistory)&&void 0!==b?b:void 0,this.id=null!==(y=i.id)&&void 0!==y?y:void 0,this.inviteHash=null!==(S=i.inviteHash)&&void 0!==S?S:void 0,this.issueEstimationAllowZero=null!==(g=i.issueEstimationAllowZero)&&void 0!==g?g:void 0,this.issueEstimationExtended=null!==(D=i.issueEstimationExtended)&&void 0!==D?D:void 0,this.issueEstimationType=null!==(V=i.issueEstimationType)&&void 0!==V?V:void 0,this.issueOrderingNoPriorityFirst=null!==(F=i.issueOrderingNoPriorityFirst)&&void 0!==F?F:void 0,this.key=null!==(A=i.key)&&void 0!==A?A:void 0,this.name=null!==(_=i.name)&&void 0!==_?_:void 0,this.private=null!==(T=i.private)&&void 0!==T?T:void 0,this.slackIssueComments=null!==(I=i.slackIssueComments)&&void 0!==I?I:void 0,this.slackIssueStatuses=null!==(w=i.slackIssueStatuses)&&void 0!==w?w:void 0,this.slackNewIssue=null!==(q=i.slackNewIssue)&&void 0!==q?q:void 0,this.timezone=null!==(x=i.timezone)&&void 0!==x?x:void 0,this.triageEnabled=null!==(C=i.triageEnabled)&&void 0!==C?C:void 0,this.upcomingCycleCount=null!==(O=i.upcomingCycleCount)&&void 0!==O?O:void 0,this.updatedAt=null!==(P=Ss(i.updatedAt))&&void 0!==P?P:void 0,this._activeCycle=null!==(j=i.activeCycle)&&void 0!==j?j:void 0,this._defaultIssueState=null!==(U=i.defaultIssueState)&&void 0!==U?U:void 0,this._draftWorkflowState=null!==(B=i.draftWorkflowState)&&void 0!==B?B:void 0,this._markedAsDuplicateWorkflowState=null!==(E=i.markedAsDuplicateWorkflowState)&&void 0!==E?E:void 0,this._mergeWorkflowState=null!==(R=i.mergeWorkflowState)&&void 0!==R?R:void 0,this._reviewWorkflowState=null!==(z=i.reviewWorkflowState)&&void 0!==z?z:void 0,this._startWorkflowState=null!==(L=i.startWorkflowState)&&void 0!==L?L:void 0,this._triageIssueState=null!==(M=i.triageIssueState)&&void 0!==M?M:void 0}get activeCycle(){var e,i;return(null===(e=this._activeCycle)||void 0===e?void 0:e.id)?new Sk(this._request).fetch(null===(i=this._activeCycle)||void 0===i?void 0:i.id):void 0}get defaultIssueState(){var e,i;return(null===(e=this._defaultIssueState)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._defaultIssueState)||void 0===i?void 0:i.id):void 0}get draftWorkflowState(){var e,i;return(null===(e=this._draftWorkflowState)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._draftWorkflowState)||void 0===i?void 0:i.id):void 0}get markedAsDuplicateWorkflowState(){var e,i;return(null===(e=this._markedAsDuplicateWorkflowState)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._markedAsDuplicateWorkflowState)||void 0===i?void 0:i.id):void 0}get mergeWorkflowState(){var e,i;return(null===(e=this._mergeWorkflowState)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._mergeWorkflowState)||void 0===i?void 0:i.id):void 0}get organization(){return new Hk(this._request).fetch()}get reviewWorkflowState(){var e,i;return(null===(e=this._reviewWorkflowState)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._reviewWorkflowState)||void 0===i?void 0:i.id):void 0}get startWorkflowState(){var e,i;return(null===(e=this._startWorkflowState)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._startWorkflowState)||void 0===i?void 0:i.id):void 0}get triageIssueState(){var e,i;return(null===(e=this._triageIssueState)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._triageIssueState)||void 0===i?void 0:i.id):void 0}cycles(e){return this.id?new VN(this._request,this.id,e).fetch(e):void 0}issues(e){return this.id?new FN(this._request,this.id,e).fetch(e):void 0}labels(e){return this.id?new AN(this._request,this.id,e).fetch(e):void 0}members(e){return this.id?new _N(this._request,this.id,e).fetch(e):void 0}memberships(e){return this.id?new TN(this._request,this.id,e).fetch(e):void 0}projects(e){return this.id?new IN(this._request,this.id,e).fetch(e):void 0}states(e){return this.id?new wN(this._request,this.id,e).fetch(e):void 0}templates(e){return this.id?new qN(this._request,this.id,e).fetch(e):void 0}webhooks(e){return this.id?new xN(this._request,this.id,e).fetch(e):void 0}archive(){return this.id?new _p(this._request).fetch(this.id):void 0}delete(){return this.id?new Ip(this._request).fetch(this.id):void 0}update(e){return this.id?new Op(this._request).fetch(this.id,e):void 0}}class qm extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new wm(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class xm extends fs{constructor(e,i){var n,a,t,d,l,o,r;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.owner=null!==(d=i.owner)&&void 0!==d?d:void 0,this.updatedAt=null!==(l=Ss(i.updatedAt))&&void 0!==l?l:void 0,this._team=null!==(o=i.team)&&void 0!==o?o:void 0,this._user=null!==(r=i.user)&&void 0!==r?r:void 0}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}get user(){var e,i;return(null===(e=this._user)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._user)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new xp(this._request).fetch(this.id):void 0}update(e){return this.id?new Cp(this._request).fetch(this.id,e):void 0}}class Cm extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new xm(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class Om extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._teamMembership=null!==(t=i.teamMembership)&&void 0!==t?t:void 0}get teamMembership(){var e,i;return(null===(e=this._teamMembership)||void 0===e?void 0:e.id)?new lv(this._request).fetch(null===(i=this._teamMembership)||void 0===i?void 0:i.id):void 0}}class Pm extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._team=null!==(t=i.team)&&void 0!==t?t:void 0}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}}class jm extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.description=null!==(t=i.description)&&void 0!==t?t:void 0,this.id=null!==(d=i.id)&&void 0!==d?d:void 0,this.name=null!==(l=i.name)&&void 0!==l?l:void 0,this.templateData=null!==(o=gs(i.templateData))&&void 0!==o?o:void 0,this.type=null!==(r=i.type)&&void 0!==r?r:void 0,this.updatedAt=null!==(s=Ss(i.updatedAt))&&void 0!==s?s:void 0,this._creator=null!==(u=i.creator)&&void 0!==u?u:void 0,this._team=null!==(m=i.team)&&void 0!==m?m:void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new jp(this._request).fetch(this.id):void 0}update(e){return this.id?new Up(this._request).fetch(this.id,e):void 0}}class Um extends fs{constructor(e,i){super(e),this.pageInfo=i.pageInfo?new om(e,i.pageInfo):void 0}get nodes(){return new uv(this._request).fetch()}}class Bm extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._template=null!==(t=i.template)&&void 0!==t?t:void 0}get template(){var e,i;return(null===(e=this._template)||void 0===e?void 0:e.id)?new sv(this._request).fetch(null===(i=this._template)||void 0===i?void 0:i.id):void 0}}class Em extends fs{constructor(e,i){var n,a,t,d,l,o;super(e),this.assetUrl=null!==(n=i.assetUrl)&&void 0!==n?n:void 0,this.contentType=null!==(a=i.contentType)&&void 0!==a?a:void 0,this.filename=null!==(t=i.filename)&&void 0!==t?t:void 0,this.metaData=null!==(d=gs(i.metaData))&&void 0!==d?d:void 0,this.size=null!==(l=i.size)&&void 0!==l?l:void 0,this.uploadUrl=null!==(o=i.uploadUrl)&&void 0!==o?o:void 0,this.headers=i.headers?i.headers.map((i=>new Rm(e,i))):void 0}}class Rm extends fs{constructor(e,i){var n,a;super(e),this.key=null!==(n=i.key)&&void 0!==n?n:void 0,this.value=null!==(a=i.value)&&void 0!==a?a:void 0}}class zm extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.uploadFile=i.uploadFile?new Em(e,i.uploadFile):void 0}}class Lm extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k,v,c,p;super(e),this.active=null!==(n=i.active)&&void 0!==n?n:void 0,this.admin=null!==(a=i.admin)&&void 0!==a?a:void 0,this.archivedAt=null!==(t=Ss(i.archivedAt))&&void 0!==t?t:void 0,this.avatarUrl=null!==(d=i.avatarUrl)&&void 0!==d?d:void 0,this.createdAt=null!==(l=Ss(i.createdAt))&&void 0!==l?l:void 0,this.createdIssueCount=null!==(o=i.createdIssueCount)&&void 0!==o?o:void 0,this.disableReason=null!==(r=i.disableReason)&&void 0!==r?r:void 0,this.displayName=null!==(s=i.displayName)&&void 0!==s?s:void 0,this.email=null!==(u=i.email)&&void 0!==u?u:void 0,this.id=null!==(m=i.id)&&void 0!==m?m:void 0,this.inviteHash=null!==(k=i.inviteHash)&&void 0!==k?k:void 0,this.lastSeen=null!==(v=Ss(i.lastSeen))&&void 0!==v?v:void 0,this.name=null!==(c=i.name)&&void 0!==c?c:void 0,this.updatedAt=null!==(p=Ss(i.updatedAt))&&void 0!==p?p:void 0}get organization(){return new Hk(this._request).fetch()}assignedIssues(e){return this.id?new CN(this._request,this.id,e).fetch(e):void 0}createdIssues(e){return this.id?new ON(this._request,this.id,e).fetch(e):void 0}teamMemberships(e){return this.id?new PN(this._request,this.id,e).fetch(e):void 0}teams(e){return this.id?new jN(this._request,this.id,e).fetch(e):void 0}settingsUpdate(e){return this.id?new Mp(this._request).fetch(this.id,e):void 0}suspend(){return this.id?new Qp(this._request).fetch(this.id):void 0}unsuspend(){return this.id?new Hp(this._request).fetch(this.id):void 0}update(e){return this.id?new Gp(this._request).fetch(this.id,e):void 0}}class Mm extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class Wm extends fs{constructor(e,i){var n,a,t,d,l,o,r,s;super(e),this.clientId=null!==(n=i.clientId)&&void 0!==n?n:void 0,this.createdByLinear=null!==(a=i.createdByLinear)&&void 0!==a?a:void 0,this.description=null!==(t=i.description)&&void 0!==t?t:void 0,this.developer=null!==(d=i.developer)&&void 0!==d?d:void 0,this.developerUrl=null!==(l=i.developerUrl)&&void 0!==l?l:void 0,this.imageUrl=null!==(o=i.imageUrl)&&void 0!==o?o:void 0,this.isAuthorized=null!==(r=i.isAuthorized)&&void 0!==r?r:void 0,this.name=null!==(s=i.name)&&void 0!==s?s:void 0}}class Qm extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new Lm(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class Hm extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._user=null!==(t=i.user)&&void 0!==t?t:void 0}get user(){var e,i;return(null===(e=this._user)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._user)||void 0===i?void 0:i.id):void 0}}class Gm extends fs{constructor(e,i){var n,a,t,d,l,o,r;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.notificationPreferences=null!==(d=gs(i.notificationPreferences))&&void 0!==d?d:void 0,this.unsubscribedFrom=null!==(l=i.unsubscribedFrom)&&void 0!==l?l:void 0,this.updatedAt=null!==(o=Ss(i.updatedAt))&&void 0!==o?o:void 0,this._user=null!==(r=i.user)&&void 0!==r?r:void 0}get user(){var e,i;return(null===(e=this._user)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._user)||void 0===i?void 0:i.id):void 0}update(e){return this.id?new Mp(this._request).fetch(this.id,e):void 0}}class Km extends fs{constructor(e,i){var n,a,t,d;super(e),this.flag=null!==(n=i.flag)&&void 0!==n?n:void 0,this.lastSyncId=null!==(a=i.lastSyncId)&&void 0!==a?a:void 0,this.success=null!==(t=i.success)&&void 0!==t?t:void 0,this.value=null!==(d=i.value)&&void 0!==d?d:void 0}}class $m extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0}}class Jm extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0}get userSettings(){return new kv(this._request).fetch()}}class Zm extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}}class Ym extends fs{constructor(e,i){var n,a,t,d,l,o;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.id=null!==(t=i.id)&&void 0!==t?t:void 0,this.type=null!==(d=i.type)&&void 0!==d?d:void 0,this.updatedAt=null!==(l=Ss(i.updatedAt))&&void 0!==l?l:void 0,this.viewType=null!==(o=i.viewType)&&void 0!==o?o:void 0}delete(){return this.id?new $p(this._request).fetch(this.id):void 0}update(e){return this.id?new Jp(this._request).fetch(this.id,e):void 0}}class Xm extends fs{constructor(e,i){var n,a;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.viewPreferences=i.viewPreferences?new Ym(e,i.viewPreferences):void 0}}class ek extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m,k;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.enabled=null!==(t=i.enabled)&&void 0!==t?t:void 0,this.id=null!==(d=i.id)&&void 0!==d?d:void 0,this.label=null!==(l=i.label)&&void 0!==l?l:void 0,this.resourceTypes=null!==(o=i.resourceTypes)&&void 0!==o?o:void 0,this.secret=null!==(r=i.secret)&&void 0!==r?r:void 0,this.updatedAt=null!==(s=Ss(i.updatedAt))&&void 0!==s?s:void 0,this.url=null!==(u=i.url)&&void 0!==u?u:void 0,this._creator=null!==(m=i.creator)&&void 0!==m?m:void 0,this._team=null!==(k=i.team)&&void 0!==k?k:void 0}get creator(){var e,i;return(null===(e=this._creator)||void 0===e?void 0:e.id)?new mv(this._request).fetch(null===(i=this._creator)||void 0===i?void 0:i.id):void 0}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}delete(){return this.id?new Yp(this._request).fetch(this.id):void 0}update(e){return this.id?new Xp(this._request).fetch(this.id,e):void 0}}class ik extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new ek(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class nk extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._webhook=null!==(t=i.webhook)&&void 0!==t?t:void 0}get webhook(){var e,i;return(null===(e=this._webhook)||void 0===e?void 0:e.id)?new pv(this._request).fetch(null===(i=this._webhook)||void 0===i?void 0:i.id):void 0}}class ak extends fs{constructor(e,i){var n,a,t,d,l,o,r,s,u,m;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.color=null!==(a=i.color)&&void 0!==a?a:void 0,this.createdAt=null!==(t=Ss(i.createdAt))&&void 0!==t?t:void 0,this.description=null!==(d=i.description)&&void 0!==d?d:void 0,this.id=null!==(l=i.id)&&void 0!==l?l:void 0,this.name=null!==(o=i.name)&&void 0!==o?o:void 0,this.position=null!==(r=i.position)&&void 0!==r?r:void 0,this.type=null!==(s=i.type)&&void 0!==s?s:void 0,this.updatedAt=null!==(u=Ss(i.updatedAt))&&void 0!==u?u:void 0,this._team=null!==(m=i.team)&&void 0!==m?m:void 0}get team(){var e,i;return(null===(e=this._team)||void 0===e?void 0:e.id)?new dv(this._request).fetch(null===(i=this._team)||void 0===i?void 0:i.id):void 0}issues(e){return this.id?new UN(this._request,this.id,e).fetch(e):void 0}archive(){return this.id?new eN(this._request).fetch(this.id):void 0}update(e){return this.id?new nN(this._request).fetch(this.id,e):void 0}}class tk extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new ak(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}}class dk extends fs{constructor(e,i){var n,a,t;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this._workflowState=null!==(t=i.workflowState)&&void 0!==t?t:void 0}get workflowState(){var e,i;return(null===(e=this._workflowState)||void 0===e?void 0:e.id)?new hv(this._request).fetch(null===(i=this._workflowState)||void 0===i?void 0:i.id):void 0}}class lk extends fs{constructor(e,i){var n,a,t;super(e),this.botUserId=null!==(n=i.botUserId)&&void 0!==n?n:void 0,this.subdomain=null!==(a=i.subdomain)&&void 0!==a?a:void 0,this.url=null!==(t=i.url)&&void 0!==t?t:void 0}}class ok extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Dt,e).then((i=>{const n=null==i?void 0:i.apiKeys;return n?new Vs(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class rk extends fs{constructor(e){super(e)}fetch(e,i,n){return m(this,void 0,void 0,(function*(){return this._request(Vt,Object.assign({clientId:e,scope:i},n)).then((e=>{const i=null==e?void 0:e.applicationWithAuthorization;return i?new Wm(this._request,i):void 0}))}))}}class sk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ft,{id:e}).then((e=>{const i=null==e?void 0:e.attachment;return i?new Ts(this._request,i):void 0}))}))}}class uk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(At,{id:e}).then((e=>{const i=null==e?void 0:e.attachmentIssue;return i?new gu(this._request,i):void 0}))}))}}class mk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Pt,e).then((i=>{const n=null==i?void 0:i.attachments;return n?new Is(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class kk extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(jt,Object.assign({url:e},i)).then((n=>{const a=null==n?void 0:n.attachmentsForURL;return a?new Is(this._request,(n=>this.fetch(e,Object.assign(Object.assign({},i),n))),a):void 0}))}))}}class vk extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(Ut,{}).then((e=>{const i=null==e?void 0:e.authorizedApplications;return i?i.map((e=>new xs(this._request,e))):void 0}))}))}}class ck extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(Bt,{}).then((e=>{const i=null==e?void 0:e.availableUsers;return i?new qs(this._request,i):void 0}))}))}}class pk extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(Et,{}).then((e=>{const i=null==e?void 0:e.billingDetails;return i?new Cs(this._request,i):void 0}))}))}}class Nk extends fs{constructor(e){super(e)}fetch(e,i,n){return m(this,void 0,void 0,(function*(){return this._request(zt,{clientId:e,issueId:i,version:n}).then((e=>{const i=null==e?void 0:e.collaborativeDocumentJoin;return i?new js(this._request,i):void 0}))}))}}class hk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Mt,{id:e}).then((e=>{const i=null==e?void 0:e.comment;return i?new Us(this._request,i):void 0}))}))}}class fk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Wt,e).then((i=>{const n=null==i?void 0:i.comments;return n?new Bs(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class bk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Qt,{id:e}).then((e=>{const i=null==e?void 0:e.customView;return i?new Ws(this._request,i):void 0}))}))}}class yk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ht,e).then((i=>{const n=null==i?void 0:i.customViews;return n?new Qs(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Sk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Gt,{id:e}).then((e=>{const i=null==e?void 0:e.cycle;return i?new Gs(this._request,i):void 0}))}))}}class gk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Jt,e).then((i=>{const n=null==i?void 0:i.cycles;return n?new Ks(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Dk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Zt,{id:e}).then((e=>{const i=null==e?void 0:e.emoji;return i?new Xs(this._request,i):void 0}))}))}}class Vk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Yt,e).then((i=>{const n=null==i?void 0:i.emojis;return n?new eu(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Fk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Xt,{id:e}).then((e=>{const i=null==e?void 0:e.favorite;return i?new au(this._request,i):void 0}))}))}}class Ak extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ed,e).then((i=>{const n=null==i?void 0:i.favorites;return n?new tu(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class _k extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(id,Object.assign({fileId:e},i)).then((e=>{const i=null==e?void 0:e.figmaEmbedInfo;return i?new ru(this._request,i):void 0}))}))}}class Tk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ad,{id:e}).then((e=>{const i=null==e?void 0:e.integration;return i?new cu(this._request,i):void 0}))}))}}class Ik extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(td,e).then((i=>{const n=null==i?void 0:i.integrations;return n?new pu(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class wk extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(dd,Object.assign({userHash:e},i)).then((e=>{const i=null==e?void 0:e.inviteInfo;return i?new yu(this._request,i):void 0}))}))}}class qk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(od,{id:e}).then((e=>{const i=null==e?void 0:e.issue;return i?new gu(this._request,i):void 0}))}))}}class xk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Nd,{code:e}).then((e=>{const i=null==e?void 0:e.issueImportFinishGithubOAuth;return i?new su(this._request,i):void 0}))}))}}class Ck extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(hd,{id:e}).then((e=>{const i=null==e?void 0:e.issueLabel;return i?new wu(this._request,i):void 0}))}))}}class Ok extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(bd,e).then((i=>{const n=null==i?void 0:i.issueLabels;return n?new qu(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Pk extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(yd,{}).then((e=>{const i=null==e?void 0:e.issuePriorityValues;return i?i.map((e=>new Ou(this._request,e))):void 0}))}))}}class jk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Sd,{id:e}).then((e=>{const i=null==e?void 0:e.issueRelation;return i?new Pu(this._request,i):void 0}))}))}}class Uk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(gd,e).then((i=>{const n=null==i?void 0:i.issueRelations;return n?new ju(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Bk extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Dd,Object.assign({query:e},i)).then((n=>{const a=null==n?void 0:n.issueSearch;return a?new Du(this._request,(n=>this.fetch(e,Object.assign(Object.assign({},i),n))),a):void 0}))}))}}class Ek extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Vd,e).then((i=>{const n=null==i?void 0:i.issues;return n?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Rk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Fd,{id:e}).then((e=>{const i=null==e?void 0:e.milestone;return i?new Eu(this._request,i):void 0}))}))}}class zk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(_d,e).then((i=>{const n=null==i?void 0:i.milestones;return n?new Ru(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Lk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Td,{id:e}).then((e=>{const i=null==e?void 0:e.notification;return i?new Lu(this._request,i):void 0}))}))}}class Mk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Id,{id:e}).then((e=>{const i=null==e?void 0:e.notificationSubscription;return i?new Qu(this._request,i):void 0}))}))}}class Wk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(wd,e).then((i=>{const n=null==i?void 0:i.notificationSubscriptions;return n?new Hu(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Qk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(qd,e).then((i=>{const n=null==i?void 0:i.notifications;return n?new Mu(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Hk extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(xd,{}).then((e=>{const i=null==e?void 0:e.organization;return i?new Zu(this._request,i):void 0}))}))}}class Gk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ud,{urlKey:e}).then((e=>{const i=null==e?void 0:e.organizationExists;return i?new nm(this._request,i):void 0}))}))}}class Kk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Bd,{id:e}).then((e=>{const i=null==e?void 0:e.organizationInvite;return i?new wu(this._request,i):void 0}))}))}}class $k extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Rd,e).then((i=>{const n=null==i?void 0:i.organizationInvites;return n?new tm(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Jk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(zd,{id:e}).then((e=>{const i=null==e?void 0:e.project;return i?new rm(this._request,i):void 0}))}))}}class Zk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Hd,{id:e}).then((e=>{const i=null==e?void 0:e.projectLink;return i?new um(this._request,i):void 0}))}))}}class Yk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Gd,e).then((i=>{const n=null==i?void 0:i.projectLinks;return n?new mm(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class Xk extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Kd,e).then((i=>{const n=null==i?void 0:i.projects;return n?new sm(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class ev extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request($d,{}).then((e=>{const i=null==e?void 0:e.pushSubscriptionTest;return i?new hm(this._request,i):void 0}))}))}}class iv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Jd,{id:e}).then((e=>{const i=null==e?void 0:e.reaction;return i?new fm(this._request,i):void 0}))}))}}class nv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Zd,e).then((i=>{const n=null==i?void 0:i.reactions;return n?new bm(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class av extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Yd,Object.assign({email:e},i)).then((e=>{const i=null==e?void 0:e.ssoUrlFromEmail;return i?new Fm(this._request,i):void 0}))}))}}class tv extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(Xd,{}).then((e=>{const i=null==e?void 0:e.subscription;return i?new _m(this._request,i):void 0}))}))}}class dv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(el,{id:e}).then((e=>{const i=null==e?void 0:e.team;return i?new wm(this._request,i):void 0}))}))}}class lv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ul,{id:e}).then((e=>{const i=null==e?void 0:e.teamMembership;return i?new xm(this._request,i):void 0}))}))}}class ov extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ml,e).then((i=>{const n=null==i?void 0:i.teamMemberships;return n?new Cm(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class rv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(kl,e).then((i=>{const n=null==i?void 0:i.teams;return n?new qm(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class sv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(vl,{id:e}).then((e=>{const i=null==e?void 0:e.template;return i?new jm(this._request,i):void 0}))}))}}class uv extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(cl,{}).then((e=>{const i=null==e?void 0:e.templates;return i?i.map((e=>new jm(this._request,e))):void 0}))}))}}class mv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(pl,{id:e}).then((e=>{const i=null==e?void 0:e.user;return i?new Lm(this._request,i):void 0}))}))}}class kv extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(yl,{}).then((e=>{const i=null==e?void 0:e.userSettings;return i?new Gm(this._request,i):void 0}))}))}}class vv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Sl,e).then((i=>{const n=null==i?void 0:i.users;return n?new Qm(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class cv extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(gl,{}).then((e=>{const i=null==e?void 0:e.viewer;return i?new Lm(this._request,i):void 0}))}))}}class pv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(_l,{id:e}).then((e=>{const i=null==e?void 0:e.webhook;return i?new ek(this._request,i):void 0}))}))}}class Nv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Tl,e).then((i=>{const n=null==i?void 0:i.webhooks;return n?new ik(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class hv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Il,{id:e}).then((e=>{const i=null==e?void 0:e.workflowState;return i?new ak(this._request,i):void 0}))}))}}class fv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ql,e).then((i=>{const n=null==i?void 0:i.workflowStates;return n?new tk(this._request,(i=>this.fetch(Object.assign(Object.assign({},e),i))),n):void 0}))}))}}class bv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(xl,{input:e}).then((e=>{const i=null==e?void 0:e.apiKeyCreate;return i?new Fs(this._request,i):void 0}))}))}}class yv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Cl,{id:e}).then((e=>{const i=null==e?void 0:e.apiKeyDelete;return i?new As(this._request,i):void 0}))}))}}class Sv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ol,{id:e}).then((e=>{const i=null==e?void 0:e.attachmentArchive;return i?new As(this._request,i):void 0}))}))}}class gv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Pl,{input:e}).then((e=>{const i=null==e?void 0:e.attachmentCreate;return i?new ws(this._request,i):void 0}))}))}}class Dv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(jl,{id:e}).then((e=>{const i=null==e?void 0:e.attachmentDelete;return i?new As(this._request,i):void 0}))}))}}class Vv extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Ul,{conversationId:e,issueId:i}).then((e=>{const i=null==e?void 0:e.attachmentLinkFront;return i?new ws(this._request,i):void 0}))}))}}class Fv extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Bl,{conversationId:e,issueId:i}).then((e=>{const i=null==e?void 0:e.attachmentLinkIntercom;return i?new ws(this._request,i):void 0}))}))}}class Av extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(El,{issueId:e,url:i}).then((e=>{const i=null==e?void 0:e.attachmentLinkURL;return i?new ws(this._request,i):void 0}))}))}}class _v extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Rl,{issueId:e,ticketId:i}).then((e=>{const i=null==e?void 0:e.attachmentLinkZendesk;return i?new ws(this._request,i):void 0}))}))}}class Tv extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(zl,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.attachmentUpdate;return i?new ws(this._request,i):void 0}))}))}}class Iv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ll,{input:e}).then((e=>{const i=null==e?void 0:e.billingEmailUpdate;return i?new Os(this._request,i):void 0}))}))}}class wv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ml,{input:e}).then((e=>{const i=null==e?void 0:e.collaborativeDocumentUpdate;return i?new js(this._request,i):void 0}))}))}}class qv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Wl,{input:e}).then((e=>{const i=null==e?void 0:e.commentCreate;return i?new Es(this._request,i):void 0}))}))}}class xv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ql,{id:e}).then((e=>{const i=null==e?void 0:e.commentDelete;return i?new As(this._request,i):void 0}))}))}}class Cv extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Hl,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.commentUpdate;return i?new Es(this._request,i):void 0}))}))}}class Ov extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Gl,{input:e}).then((e=>{const i=null==e?void 0:e.contactCreate;return i?new zs(this._request,i):void 0}))}))}}class Pv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Kl,e).then((e=>{const i=null==e?void 0:e.createCsvExportReport;return i?new Ls(this._request,i):void 0}))}))}}class jv extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request($l,Object.assign({input:e},i)).then((e=>{const i=null==e?void 0:e.createOrganizationFromOnboarding;return i?new Ms(this._request,i):void 0}))}))}}class Uv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Jl,{input:e}).then((e=>{const i=null==e?void 0:e.customViewCreate;return i?new Hs(this._request,i):void 0}))}))}}class Bv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Zl,{id:e}).then((e=>{const i=null==e?void 0:e.customViewDelete;return i?new As(this._request,i):void 0}))}))}}class Ev extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Yl,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.customViewUpdate;return i?new Hs(this._request,i):void 0}))}))}}class Rv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Xl,{id:e}).then((e=>{const i=null==e?void 0:e.cycleArchive;return i?new As(this._request,i):void 0}))}))}}class zv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(eo,{input:e}).then((e=>{const i=null==e?void 0:e.cycleCreate;return i?new $s(this._request,i):void 0}))}))}}class Lv extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(io,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.cycleUpdate;return i?new $s(this._request,i):void 0}))}))}}class Mv extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(no,{}).then((e=>{const i=null==e?void 0:e.debugCreateSAMLOrg;return i?new Js(this._request,i):void 0}))}))}}class Wv extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(ao,{}).then((e=>{const i=null==e?void 0:e.debugFailWithInternalError;return i?new Js(this._request,i):void 0}))}))}}class Qv extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(to,{}).then((e=>{const i=null==e?void 0:e.debugFailWithWarning;return i?new Js(this._request,i):void 0}))}))}}class Hv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(lo,{input:e}).then((e=>{const i=null==e?void 0:e.emailTokenUserAccountAuth;return i?new qs(this._request,i):void 0}))}))}}class Gv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(oo,{input:e}).then((e=>{const i=null==e?void 0:e.emailUnsubscribe;return i?new Zs(this._request,i):void 0}))}))}}class Kv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ro,{input:e}).then((e=>{const i=null==e?void 0:e.emailUserAccountAuthChallenge;return i?new Ys(this._request,i):void 0}))}))}}class $v extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(so,{input:e}).then((e=>{const i=null==e?void 0:e.emojiCreate;return i?new iu(this._request,i):void 0}))}))}}class Jv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(uo,{id:e}).then((e=>{const i=null==e?void 0:e.emojiDelete;return i?new As(this._request,i):void 0}))}))}}class Zv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(mo,{input:e}).then((e=>{const i=null==e?void 0:e.eventCreate;return i?new nu(this._request,i):void 0}))}))}}class Yv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ko,{input:e}).then((e=>{const i=null==e?void 0:e.favoriteCreate;return i?new du(this._request,i):void 0}))}))}}class Xv extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(vo,{id:e}).then((e=>{const i=null==e?void 0:e.favoriteDelete;return i?new As(this._request,i):void 0}))}))}}class ec extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(co,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.favoriteUpdate;return i?new du(this._request,i):void 0}))}))}}class ic extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(po,{input:e}).then((e=>{const i=null==e?void 0:e.feedbackCreate;return i?new lu(this._request,i):void 0}))}))}}class nc extends fs{constructor(e){super(e)}fetch(e,i,n,a){return m(this,void 0,void 0,(function*(){return this._request(No,Object.assign({contentType:e,filename:i,size:n},a)).then((e=>{const i=null==e?void 0:e.fileUpload;return i?new zm(this._request,i):void 0}))}))}}class ac extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ho,{input:e}).then((e=>{const i=null==e?void 0:e.googleUserAccountAuth;return i?new qs(this._request,i):void 0}))}))}}class tc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(fo,{url:e}).then((e=>{const i=null==e?void 0:e.imageUploadFromUrl;return i?new vu(this._request,i):void 0}))}))}}class dc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(bo,{id:e}).then((e=>{const i=null==e?void 0:e.integrationDelete;return i?new As(this._request,i):void 0}))}))}}class lc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(yo,{code:e,redirectUri:i}).then((e=>{const i=null==e?void 0:e.integrationFigma;return i?new Nu(this._request,i):void 0}))}))}}class oc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(So,{code:e,redirectUri:i}).then((e=>{const i=null==e?void 0:e.integrationFront;return i?new Nu(this._request,i):void 0}))}))}}class rc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(go,{installationId:e}).then((e=>{const i=null==e?void 0:e.integrationGithubConnect;return i?new Nu(this._request,i):void 0}))}))}}class sc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Do,{accessToken:e,gitlabUrl:i}).then((e=>{const i=null==e?void 0:e.integrationGitlabConnect;return i?new Nu(this._request,i):void 0}))}))}}class uc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Vo,{code:e}).then((e=>{const i=null==e?void 0:e.integrationGoogleSheets;return i?new Nu(this._request,i):void 0}))}))}}class mc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Fo,{code:e,redirectUri:i}).then((e=>{const i=null==e?void 0:e.integrationIntercom;return i?new Nu(this._request,i):void 0}))}))}}class kc extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(Ao,{}).then((e=>{const i=null==e?void 0:e.integrationIntercomDelete;return i?new Nu(this._request,i):void 0}))}))}}class vc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(_o,{id:e}).then((e=>{const i=null==e?void 0:e.integrationResourceArchive;return i?new As(this._request,i):void 0}))}))}}class cc extends fs{constructor(e){super(e)}fetch(e,i,n){return m(this,void 0,void 0,(function*(){return this._request(To,{code:e,installationId:i,organizationSlug:n}).then((e=>{const i=null==e?void 0:e.integrationSentryConnect;return i?new Nu(this._request,i):void 0}))}))}}class pc extends fs{constructor(e){super(e)}fetch(e,i,n){return m(this,void 0,void 0,(function*(){return this._request(Io,Object.assign({code:e,redirectUri:i},n)).then((e=>{const i=null==e?void 0:e.integrationSlack;return i?new Nu(this._request,i):void 0}))}))}}class Nc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(wo,{code:e,redirectUri:i}).then((e=>{const i=null==e?void 0:e.integrationSlackImportEmojis;return i?new Nu(this._request,i):void 0}))}))}}class hc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(qo,{code:e,redirectUri:i}).then((e=>{const i=null==e?void 0:e.integrationSlackPersonal;return i?new Nu(this._request,i):void 0}))}))}}class fc extends fs{constructor(e){super(e)}fetch(e,i,n,a){return m(this,void 0,void 0,(function*(){return this._request(xo,Object.assign({code:e,redirectUri:i,teamId:n},a)).then((e=>{const i=null==e?void 0:e.integrationSlackPost;return i?new Nu(this._request,i):void 0}))}))}}class bc extends fs{constructor(e){super(e)}fetch(e,i,n){return m(this,void 0,void 0,(function*(){return this._request(Co,{code:e,projectId:i,redirectUri:n}).then((e=>{const i=null==e?void 0:e.integrationSlackProjectPost;return i?new Nu(this._request,i):void 0}))}))}}class yc extends fs{constructor(e){super(e)}fetch(e,i,n,a){return m(this,void 0,void 0,(function*(){return this._request(Oo,{code:e,redirectUri:i,scope:n,subdomain:a}).then((e=>{const i=null==e?void 0:e.integrationZendesk;return i?new Nu(this._request,i):void 0}))}))}}class Sc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Po,Object.assign({id:e},i)).then((e=>{const i=null==e?void 0:e.issueArchive;return i?new As(this._request,i):void 0}))}))}}class gc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(jo,{input:e}).then((e=>{const i=null==e?void 0:e.issueCreate;return i?new Cu(this._request,i):void 0}))}))}}class Dc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Uo,{id:e}).then((e=>{const i=null==e?void 0:e.issueDelete;return i?new As(this._request,i):void 0}))}))}}class Vc extends fs{constructor(e){super(e)}fetch(e,i,n,a){return m(this,void 0,void 0,(function*(){return this._request(Bo,Object.assign({asanaTeamName:e,asanaToken:i,teamId:n},a)).then((e=>{const i=null==e?void 0:e.issueImportCreateAsana;return i?new Iu(this._request,i):void 0}))}))}}class Fc extends fs{constructor(e){super(e)}fetch(e,i,n,a){return m(this,void 0,void 0,(function*(){return this._request(Eo,Object.assign({clubhouseTeamName:e,clubhouseToken:i,teamId:n},a)).then((e=>{const i=null==e?void 0:e.issueImportCreateClubhouse;return i?new Iu(this._request,i):void 0}))}))}}class Ac extends fs{constructor(e){super(e)}fetch(e,i,n,a,t){return m(this,void 0,void 0,(function*(){return this._request(Ro,Object.assign({githubRepoName:e,githubRepoOwner:i,githubToken:n,teamId:a},t)).then((e=>{const i=null==e?void 0:e.issueImportCreateGithub;return i?new Iu(this._request,i):void 0}))}))}}class _c extends fs{constructor(e){super(e)}fetch(e,i,n,a,t,d){return m(this,void 0,void 0,(function*(){return this._request(zo,Object.assign({jiraEmail:e,jiraHostname:i,jiraProject:n,jiraToken:a,teamId:t},d)).then((e=>{const i=null==e?void 0:e.issueImportCreateJira;return i?new Iu(this._request,i):void 0}))}))}}class Tc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Lo,{issueImportId:e}).then((e=>{const i=null==e?void 0:e.issueImportDelete;return i?new Tu(this._request,i):void 0}))}))}}class Ic extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Mo,{issueImportId:e,mapping:i}).then((e=>{const i=null==e?void 0:e.issueImportProcess;return i?new Iu(this._request,i):void 0}))}))}}class wc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Wo,{id:e}).then((e=>{const i=null==e?void 0:e.issueLabelArchive;return i?new As(this._request,i):void 0}))}))}}class qc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Qo,{input:e}).then((e=>{const i=null==e?void 0:e.issueLabelCreate;return i?new xu(this._request,i):void 0}))}))}}class xc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Ho,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.issueLabelUpdate;return i?new xu(this._request,i):void 0}))}))}}class Cc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Go,{input:e}).then((e=>{const i=null==e?void 0:e.issueRelationCreate;return i?new Bu(this._request,i):void 0}))}))}}class Oc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ko,{id:e}).then((e=>{const i=null==e?void 0:e.issueRelationDelete;return i?new As(this._request,i):void 0}))}))}}class Pc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request($o,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.issueRelationUpdate;return i?new Bu(this._request,i):void 0}))}))}}class jc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Jo,{id:e}).then((e=>{const i=null==e?void 0:e.issueUnarchive;return i?new As(this._request,i):void 0}))}))}}class Uc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Zo,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.issueUpdate;return i?new Cu(this._request,i):void 0}))}))}}class Bc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Yo,{input:e}).then((e=>{const i=null==e?void 0:e.joinOrganizationFromOnboarding;return i?new Ms(this._request,i):void 0}))}))}}class Ec extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Xo,{organizationId:e}).then((e=>{const i=null==e?void 0:e.leaveOrganization;return i?new Ms(this._request,i):void 0}))}))}}class Rc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(er,{input:e}).then((e=>{const i=null==e?void 0:e.milestoneCreate;return i?new zu(this._request,i):void 0}))}))}}class zc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ir,{id:e}).then((e=>{const i=null==e?void 0:e.milestoneDelete;return i?new As(this._request,i):void 0}))}))}}class Lc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(nr,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.milestoneUpdate;return i?new zu(this._request,i):void 0}))}))}}class Mc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ar,{id:e}).then((e=>{const i=null==e?void 0:e.notificationArchive;return i?new As(this._request,i):void 0}))}))}}class Wc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(tr,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.notificationCreate;return i?new Wu(this._request,i):void 0}))}))}}class Qc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(dr,{input:e}).then((e=>{const i=null==e?void 0:e.notificationSubscriptionCreate;return i?new Gu(this._request,i):void 0}))}))}}class Hc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(lr,{id:e}).then((e=>{const i=null==e?void 0:e.notificationSubscriptionDelete;return i?new As(this._request,i):void 0}))}))}}class Gc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(or,{id:e}).then((e=>{const i=null==e?void 0:e.notificationUnarchive;return i?new As(this._request,i):void 0}))}))}}class Kc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(rr,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.notificationUpdate;return i?new Wu(this._request,i):void 0}))}))}}class $c extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(sr,{id:e}).then((e=>{const i=null==e?void 0:e.oauthClientArchive;return i?new As(this._request,i):void 0}))}))}}class Jc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ur,{input:e}).then((e=>{const i=null==e?void 0:e.oauthClientCreate;return i?new $u(this._request,i):void 0}))}))}}class Zc extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(mr,{id:e}).then((e=>{const i=null==e?void 0:e.oauthClientRotateSecret;return i?new Sm(this._request,i):void 0}))}))}}class Yc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(kr,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.oauthClientUpdate;return i?new $u(this._request,i):void 0}))}))}}class Xc extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(vr,{appId:e,scope:i}).then((e=>{const i=null==e?void 0:e.oauthTokenRevoke;return i?new Ju(this._request,i):void 0}))}))}}class ep extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(cr,{}).then((e=>{const i=null==e?void 0:e.organizationCancelDelete;return i?new Yu(this._request,i):void 0}))}))}}class ip extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(pr,{input:e}).then((e=>{const i=null==e?void 0:e.organizationDelete;return i?new Xu(this._request,i):void 0}))}))}}class np extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(Nr,{}).then((e=>{const i=null==e?void 0:e.organizationDeleteChallenge;return i?new Xu(this._request,i):void 0}))}))}}class ap extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(hr,{input:e}).then((e=>{const i=null==e?void 0:e.organizationDomainCreate;return i?new im(this._request,i):void 0}))}))}}class tp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(fr,{id:e}).then((e=>{const i=null==e?void 0:e.organizationDomainDelete;return i?new As(this._request,i):void 0}))}))}}class dp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(br,{input:e}).then((e=>{const i=null==e?void 0:e.organizationDomainVerify;return i?new im(this._request,i):void 0}))}))}}class lp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(yr,{input:e}).then((e=>{const i=null==e?void 0:e.organizationInviteCreate;return i?new dm(this._request,i):void 0}))}))}}class op extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Sr,{id:e}).then((e=>{const i=null==e?void 0:e.organizationInviteDelete;return i?new As(this._request,i):void 0}))}))}}class rp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(gr,{input:e}).then((e=>{const i=null==e?void 0:e.organizationUpdate;return i?new lm(this._request,i):void 0}))}))}}class sp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Dr,{id:e}).then((e=>{const i=null==e?void 0:e.projectArchive;return i?new As(this._request,i):void 0}))}))}}class up extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Vr,{input:e}).then((e=>{const i=null==e?void 0:e.projectCreate;return i?new vm(this._request,i):void 0}))}))}}class mp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Fr,{input:e}).then((e=>{const i=null==e?void 0:e.projectLinkCreate;return i?new km(this._request,i):void 0}))}))}}class kp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ar,{id:e}).then((e=>{const i=null==e?void 0:e.projectLinkDelete;return i?new As(this._request,i):void 0}))}))}}class vp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(_r,{id:e}).then((e=>{const i=null==e?void 0:e.projectUnarchive;return i?new As(this._request,i):void 0}))}))}}class cp extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Tr,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.projectUpdate;return i?new vm(this._request,i):void 0}))}))}}class pp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ir,{input:e}).then((e=>{const i=null==e?void 0:e.pushSubscriptionCreate;return i?new Nm(this._request,i):void 0}))}))}}class Np extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(wr,{id:e}).then((e=>{const i=null==e?void 0:e.pushSubscriptionDelete;return i?new Nm(this._request,i):void 0}))}))}}class hp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(qr,{input:e}).then((e=>{const i=null==e?void 0:e.reactionCreate;return i?new ym(this._request,i):void 0}))}))}}class fp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(xr,{id:e}).then((e=>{const i=null==e?void 0:e.reactionDelete;return i?new As(this._request,i):void 0}))}))}}class bp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Cr,{id:e}).then((e=>{const i=null==e?void 0:e.refreshGoogleSheetsData;return i?new Nu(this._request,i):void 0}))}))}}class yp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Or,{id:e}).then((e=>{const i=null==e?void 0:e.resentOrganizationInvite;return i?new As(this._request,i):void 0}))}))}}class Sp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Pr,{input:e}).then((e=>{const i=null==e?void 0:e.samlTokenUserAccountAuth;return i?new qs(this._request,i):void 0}))}))}}class gp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(jr,{id:e}).then((e=>{const i=null==e?void 0:e.subscriptionArchive;return i?new As(this._request,i):void 0}))}))}}class Dp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ur,{plan:e}).then((e=>{const i=null==e?void 0:e.subscriptionSessionCreate;return i?new Im(this._request,i):void 0}))}))}}class Vp extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Br,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.subscriptionUpdate;return i?new Tm(this._request,i):void 0}))}))}}class Fp extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(Er,{}).then((e=>{const i=null==e?void 0:e.subscriptionUpdateSessionCreate;return i?new Im(this._request,i):void 0}))}))}}class Ap extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Rr,{id:e,type:i}).then((e=>{const i=null==e?void 0:e.subscriptionUpgrade;return i?new Tm(this._request,i):void 0}))}))}}class _p extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(zr,{id:e}).then((e=>{const i=null==e?void 0:e.teamArchive;return i?new As(this._request,i):void 0}))}))}}class Tp extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Lr,Object.assign({input:e},i)).then((e=>{const i=null==e?void 0:e.teamCreate;return i?new Pm(this._request,i):void 0}))}))}}class Ip extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Mr,{id:e}).then((e=>{const i=null==e?void 0:e.teamDelete;return i?new As(this._request,i):void 0}))}))}}class wp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Wr,{id:e}).then((e=>{const i=null==e?void 0:e.teamKeyDelete;return i?new As(this._request,i):void 0}))}))}}class qp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Qr,{input:e}).then((e=>{const i=null==e?void 0:e.teamMembershipCreate;return i?new Om(this._request,i):void 0}))}))}}class xp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Hr,{id:e}).then((e=>{const i=null==e?void 0:e.teamMembershipDelete;return i?new As(this._request,i):void 0}))}))}}class Cp extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Gr,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.teamMembershipUpdate;return i?new Om(this._request,i):void 0}))}))}}class Op extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Kr,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.teamUpdate;return i?new Pm(this._request,i):void 0}))}))}}class Pp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request($r,{input:e}).then((e=>{const i=null==e?void 0:e.templateCreate;return i?new Bm(this._request,i):void 0}))}))}}class jp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Jr,{id:e}).then((e=>{const i=null==e?void 0:e.templateDelete;return i?new As(this._request,i):void 0}))}))}}class Up extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Zr,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.templateUpdate;return i?new Bm(this._request,i):void 0}))}))}}class Bp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Yr,{id:e}).then((e=>{const i=null==e?void 0:e.userDemoteAdmin;return i?new Mm(this._request,i):void 0}))}))}}class Ep extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Xr,{flag:e,operation:i}).then((e=>{const i=null==e?void 0:e.userFlagUpdate;return i?new Km(this._request,i):void 0}))}))}}class Rp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(es,{id:e}).then((e=>{const i=null==e?void 0:e.userPromoteAdmin;return i?new Mm(this._request,i):void 0}))}))}}class zp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(is,{flag:e}).then((e=>{const i=null==e?void 0:e.userSettingsFlagIncrement;return i?new Km(this._request,i):void 0}))}))}}class Lp extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(ns,{}).then((e=>{const i=null==e?void 0:e.userSettingsFlagsReset;return i?new $m(this._request,i):void 0}))}))}}class Mp extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(as,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.userSettingsUpdate;return i?new Jm(this._request,i):void 0}))}))}}class Wp extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(ts,{}).then((e=>{const i=null==e?void 0:e.userSubscribeToNewsletter;return i?new Zm(this._request,i):void 0}))}))}}class Qp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ds,{id:e}).then((e=>{const i=null==e?void 0:e.userSuspend;return i?new Mm(this._request,i):void 0}))}))}}class Hp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ls,{id:e}).then((e=>{const i=null==e?void 0:e.userUnsuspend;return i?new Mm(this._request,i):void 0}))}))}}class Gp extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(os,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.userUpdate;return i?new Hm(this._request,i):void 0}))}))}}class Kp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(rs,{input:e}).then((e=>{const i=null==e?void 0:e.viewPreferencesCreate;return i?new Xm(this._request,i):void 0}))}))}}class $p extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ss,{id:e}).then((e=>{const i=null==e?void 0:e.viewPreferencesDelete;return i?new As(this._request,i):void 0}))}))}}class Jp extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(us,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.viewPreferencesUpdate;return i?new Xm(this._request,i):void 0}))}))}}class Zp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ms,{input:e}).then((e=>{const i=null==e?void 0:e.webhookCreate;return i?new nk(this._request,i):void 0}))}))}}class Yp extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ks,{id:e}).then((e=>{const i=null==e?void 0:e.webhookDelete;return i?new As(this._request,i):void 0}))}))}}class Xp extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(vs,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.webhookUpdate;return i?new nk(this._request,i):void 0}))}))}}class eN extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(cs,{id:e}).then((e=>{const i=null==e?void 0:e.workflowStateArchive;return i?new As(this._request,i):void 0}))}))}}class iN extends fs{constructor(e){super(e)}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ps,{input:e}).then((e=>{const i=null==e?void 0:e.workflowStateCreate;return i?new dk(this._request,i):void 0}))}))}}class nN extends fs{constructor(e){super(e)}fetch(e,i){return m(this,void 0,void 0,(function*(){return this._request(Ns,{id:e,input:i}).then((e=>{const i=null==e?void 0:e.workflowStateUpdate;return i?new dk(this._request,i):void 0}))}))}}class aN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Kt,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.cycle)||void 0===n?void 0:n.issues;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class tN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request($t,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.cycle)||void 0===n?void 0:n.uncompletedIssuesUponClose;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class dN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(rd,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.issue)||void 0===n?void 0:n.attachments;return a?new Is(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class lN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(sd,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.issue)||void 0===n?void 0:n.children;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class oN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ud,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.issue)||void 0===n?void 0:n.comments;return a?new Bs(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class rN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(md,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.issue)||void 0===n?void 0:n.history;return a?new Au(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class sN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(kd,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.issue)||void 0===n?void 0:n.inverseRelations;return a?new ju(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class uN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(vd,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.issue)||void 0===n?void 0:n.labels;return a?new qu(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class mN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(cd,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.issue)||void 0===n?void 0:n.relations;return a?new ju(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class kN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(pd,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.issue)||void 0===n?void 0:n.subscribers;return a?new Qm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class vN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(fd,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.issueLabel)||void 0===n?void 0:n.issues;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class cN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ad,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.milestone)||void 0===n?void 0:n.projects;return a?new sm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class pN extends fs{constructor(e,i){super(e),this._variables=i}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Cd,e).then((i=>{var n;const a=null===(n=null==i?void 0:i.organization)||void 0===n?void 0:n.integrations;return a?new pu(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class NN extends fs{constructor(e,i){super(e),this._variables=i}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Od,e).then((i=>{var n;const a=null===(n=null==i?void 0:i.organization)||void 0===n?void 0:n.milestones;return a?new Ru(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class hN extends fs{constructor(e,i){super(e),this._variables=i}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Pd,e).then((i=>{var n;const a=null===(n=null==i?void 0:i.organization)||void 0===n?void 0:n.teams;return a?new qm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class fN extends fs{constructor(e,i){super(e),this._variables=i}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(jd,e).then((i=>{var n;const a=null===(n=null==i?void 0:i.organization)||void 0===n?void 0:n.users;return a?new Qm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class bN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ed,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.organizationInvite)||void 0===n?void 0:n.issues;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class yN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ld,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.project)||void 0===n?void 0:n.issues;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class SN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Md,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.project)||void 0===n?void 0:n.links;return a?new mm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class gN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Wd,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.project)||void 0===n?void 0:n.members;return a?new Qm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class DN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Qd,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.project)||void 0===n?void 0:n.teams;return a?new qm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class VN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(il,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.team)||void 0===n?void 0:n.cycles;return a?new Ks(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class FN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(nl,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.team)||void 0===n?void 0:n.issues;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class AN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(al,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.team)||void 0===n?void 0:n.labels;return a?new qu(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class _N extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(tl,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.team)||void 0===n?void 0:n.members;return a?new Qm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class TN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(dl,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.team)||void 0===n?void 0:n.memberships;return a?new Cm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class IN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ll,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.team)||void 0===n?void 0:n.projects;return a?new sm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class wN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ol,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.team)||void 0===n?void 0:n.states;return a?new tk(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class qN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(rl,Object.assign(Object.assign({id:this._id},this._variables),e)).then((e=>{var i;const n=null===(i=null==e?void 0:e.team)||void 0===i?void 0:i.templates;return n?new Um(this._request,n):void 0}))}))}}class xN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(sl,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.team)||void 0===n?void 0:n.webhooks;return a?new ik(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class CN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Nl,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.user)||void 0===n?void 0:n.assignedIssues;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class ON extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(hl,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.user)||void 0===n?void 0:n.createdIssues;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class PN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(fl,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.user)||void 0===n?void 0:n.teamMemberships;return a?new Cm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class jN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(bl,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.user)||void 0===n?void 0:n.teams;return a?new qm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class UN extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(wl,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.workflowState)||void 0===n?void 0:n.issues;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}}class BN extends fs{constructor(e){super(e)}apiKeys(e){return new ok(this._request).fetch(e)}applicationWithAuthorization(e,i,n){return new rk(this._request).fetch(e,i,n)}attachment(e){return new sk(this._request).fetch(e)}attachmentIssue(e){return new uk(this._request).fetch(e)}attachments(e){return new mk(this._request).fetch(e)}attachmentsForURL(e,i){return new kk(this._request).fetch(e,i)}get authorizedApplications(){return new vk(this._request).fetch()}get availableUsers(){return new ck(this._request).fetch()}get billingDetails(){return new pk(this._request).fetch()}collaborativeDocumentJoin(e,i,n){return new Nk(this._request).fetch(e,i,n)}comment(e){return new hk(this._request).fetch(e)}comments(e){return new fk(this._request).fetch(e)}customView(e){return new bk(this._request).fetch(e)}customViews(e){return new yk(this._request).fetch(e)}cycle(e){return new Sk(this._request).fetch(e)}cycles(e){return new gk(this._request).fetch(e)}emoji(e){return new Dk(this._request).fetch(e)}emojis(e){return new Vk(this._request).fetch(e)}favorite(e){return new Fk(this._request).fetch(e)}favorites(e){return new Ak(this._request).fetch(e)}figmaEmbedInfo(e,i){return new _k(this._request).fetch(e,i)}integration(e){return new Tk(this._request).fetch(e)}integrations(e){return new Ik(this._request).fetch(e)}inviteInfo(e,i){return new wk(this._request).fetch(e,i)}issue(e){return new qk(this._request).fetch(e)}issueImportFinishGithubOAuth(e){return new xk(this._request).fetch(e)}issueLabel(e){return new Ck(this._request).fetch(e)}issueLabels(e){return new Ok(this._request).fetch(e)}get issuePriorityValues(){return new Pk(this._request).fetch()}issueRelation(e){return new jk(this._request).fetch(e)}issueRelations(e){return new Uk(this._request).fetch(e)}issueSearch(e,i){return new Bk(this._request).fetch(e,i)}issues(e){return new Ek(this._request).fetch(e)}milestone(e){return new Rk(this._request).fetch(e)}milestones(e){return new zk(this._request).fetch(e)}notification(e){return new Lk(this._request).fetch(e)}notificationSubscription(e){return new Mk(this._request).fetch(e)}notificationSubscriptions(e){return new Wk(this._request).fetch(e)}notifications(e){return new Qk(this._request).fetch(e)}get organization(){return new Hk(this._request).fetch()}organizationExists(e){return new Gk(this._request).fetch(e)}organizationInvite(e){return new Kk(this._request).fetch(e)}organizationInvites(e){return new $k(this._request).fetch(e)}project(e){return new Jk(this._request).fetch(e)}projectLink(e){return new Zk(this._request).fetch(e)}projectLinks(e){return new Yk(this._request).fetch(e)}projects(e){return new Xk(this._request).fetch(e)}get pushSubscriptionTest(){return new ev(this._request).fetch()}reaction(e){return new iv(this._request).fetch(e)}reactions(e){return new nv(this._request).fetch(e)}ssoUrlFromEmail(e,i){return new av(this._request).fetch(e,i)}get subscription(){return new tv(this._request).fetch()}team(e){return new dv(this._request).fetch(e)}teamMembership(e){return new lv(this._request).fetch(e)}teamMemberships(e){return new ov(this._request).fetch(e)}teams(e){return new rv(this._request).fetch(e)}template(e){return new sv(this._request).fetch(e)}get templates(){return new uv(this._request).fetch()}user(e){return new mv(this._request).fetch(e)}get userSettings(){return new kv(this._request).fetch()}users(e){return new vv(this._request).fetch(e)}get viewer(){return new cv(this._request).fetch()}webhook(e){return new pv(this._request).fetch(e)}webhooks(e){return new Nv(this._request).fetch(e)}workflowState(e){return new hv(this._request).fetch(e)}workflowStates(e){return new fv(this._request).fetch(e)}apiKeyCreate(e){return new bv(this._request).fetch(e)}apiKeyDelete(e){return new yv(this._request).fetch(e)}attachmentArchive(e){return new Sv(this._request).fetch(e)}attachmentCreate(e){return new gv(this._request).fetch(e)}attachmentDelete(e){return new Dv(this._request).fetch(e)}attachmentLinkFront(e,i){return new Vv(this._request).fetch(e,i)}attachmentLinkIntercom(e,i){return new Fv(this._request).fetch(e,i)}attachmentLinkURL(e,i){return new Av(this._request).fetch(e,i)}attachmentLinkZendesk(e,i){return new _v(this._request).fetch(e,i)}attachmentUpdate(e,i){return new Tv(this._request).fetch(e,i)}billingEmailUpdate(e){return new Iv(this._request).fetch(e)}collaborativeDocumentUpdate(e){return new wv(this._request).fetch(e)}commentCreate(e){return new qv(this._request).fetch(e)}commentDelete(e){return new xv(this._request).fetch(e)}commentUpdate(e,i){return new Cv(this._request).fetch(e,i)}contactCreate(e){return new Ov(this._request).fetch(e)}createCsvExportReport(e){return new Pv(this._request).fetch(e)}createOrganizationFromOnboarding(e,i){return new jv(this._request).fetch(e,i)}customViewCreate(e){return new Uv(this._request).fetch(e)}customViewDelete(e){return new Bv(this._request).fetch(e)}customViewUpdate(e,i){return new Ev(this._request).fetch(e,i)}cycleArchive(e){return new Rv(this._request).fetch(e)}cycleCreate(e){return new zv(this._request).fetch(e)}cycleUpdate(e,i){return new Lv(this._request).fetch(e,i)}get debugCreateSAMLOrg(){return new Mv(this._request).fetch()}get debugFailWithInternalError(){return new Wv(this._request).fetch()}get debugFailWithWarning(){return new Qv(this._request).fetch()}emailTokenUserAccountAuth(e){return new Hv(this._request).fetch(e)}emailUnsubscribe(e){return new Gv(this._request).fetch(e)}emailUserAccountAuthChallenge(e){return new Kv(this._request).fetch(e)}emojiCreate(e){return new $v(this._request).fetch(e)}emojiDelete(e){return new Jv(this._request).fetch(e)}eventCreate(e){return new Zv(this._request).fetch(e)}favoriteCreate(e){return new Yv(this._request).fetch(e)}favoriteDelete(e){return new Xv(this._request).fetch(e)}favoriteUpdate(e,i){return new ec(this._request).fetch(e,i)}feedbackCreate(e){return new ic(this._request).fetch(e)}fileUpload(e,i,n,a){return new nc(this._request).fetch(e,i,n,a)}googleUserAccountAuth(e){return new ac(this._request).fetch(e)}imageUploadFromUrl(e){return new tc(this._request).fetch(e)}integrationDelete(e){return new dc(this._request).fetch(e)}integrationFigma(e,i){return new lc(this._request).fetch(e,i)}integrationFront(e,i){return new oc(this._request).fetch(e,i)}integrationGithubConnect(e){return new rc(this._request).fetch(e)}integrationGitlabConnect(e,i){return new sc(this._request).fetch(e,i)}integrationGoogleSheets(e){return new uc(this._request).fetch(e)}integrationIntercom(e,i){return new mc(this._request).fetch(e,i)}get integrationIntercomDelete(){return new kc(this._request).fetch()}integrationResourceArchive(e){return new vc(this._request).fetch(e)}integrationSentryConnect(e,i,n){return new cc(this._request).fetch(e,i,n)}integrationSlack(e,i,n){return new pc(this._request).fetch(e,i,n)}integrationSlackImportEmojis(e,i){return new Nc(this._request).fetch(e,i)}integrationSlackPersonal(e,i){return new hc(this._request).fetch(e,i)}integrationSlackPost(e,i,n,a){return new fc(this._request).fetch(e,i,n,a)}integrationSlackProjectPost(e,i,n){return new bc(this._request).fetch(e,i,n)}integrationZendesk(e,i,n,a){return new yc(this._request).fetch(e,i,n,a)}issueArchive(e,i){return new Sc(this._request).fetch(e,i)}issueCreate(e){return new gc(this._request).fetch(e)}issueDelete(e){return new Dc(this._request).fetch(e)}issueImportCreateAsana(e,i,n,a){return new Vc(this._request).fetch(e,i,n,a)}issueImportCreateClubhouse(e,i,n,a){return new Fc(this._request).fetch(e,i,n,a)}issueImportCreateGithub(e,i,n,a,t){return new Ac(this._request).fetch(e,i,n,a,t)}issueImportCreateJira(e,i,n,a,t,d){return new _c(this._request).fetch(e,i,n,a,t,d)}issueImportDelete(e){return new Tc(this._request).fetch(e)}issueImportProcess(e,i){return new Ic(this._request).fetch(e,i)}issueLabelArchive(e){return new wc(this._request).fetch(e)}issueLabelCreate(e){return new qc(this._request).fetch(e)}issueLabelUpdate(e,i){return new xc(this._request).fetch(e,i)}issueRelationCreate(e){return new Cc(this._request).fetch(e)}issueRelationDelete(e){return new Oc(this._request).fetch(e)}issueRelationUpdate(e,i){return new Pc(this._request).fetch(e,i)}issueUnarchive(e){return new jc(this._request).fetch(e)}issueUpdate(e,i){return new Uc(this._request).fetch(e,i)}joinOrganizationFromOnboarding(e){return new Bc(this._request).fetch(e)}leaveOrganization(e){return new Ec(this._request).fetch(e)}milestoneCreate(e){return new Rc(this._request).fetch(e)}milestoneDelete(e){return new zc(this._request).fetch(e)}milestoneUpdate(e,i){return new Lc(this._request).fetch(e,i)}notificationArchive(e){return new Mc(this._request).fetch(e)}notificationCreate(e,i){return new Wc(this._request).fetch(e,i)}notificationSubscriptionCreate(e){return new Qc(this._request).fetch(e)}notificationSubscriptionDelete(e){return new Hc(this._request).fetch(e)}notificationUnarchive(e){return new Gc(this._request).fetch(e)}notificationUpdate(e,i){return new Kc(this._request).fetch(e,i)}oauthClientArchive(e){return new $c(this._request).fetch(e)}oauthClientCreate(e){return new Jc(this._request).fetch(e)}oauthClientRotateSecret(e){return new Zc(this._request).fetch(e)}oauthClientUpdate(e,i){return new Yc(this._request).fetch(e,i)}oauthTokenRevoke(e,i){return new Xc(this._request).fetch(e,i)}get organizationCancelDelete(){return new ep(this._request).fetch()}organizationDelete(e){return new ip(this._request).fetch(e)}get organizationDeleteChallenge(){return new np(this._request).fetch()}organizationDomainCreate(e){return new ap(this._request).fetch(e)}organizationDomainDelete(e){return new tp(this._request).fetch(e)}organizationDomainVerify(e){return new dp(this._request).fetch(e)}organizationInviteCreate(e){return new lp(this._request).fetch(e)}organizationInviteDelete(e){return new op(this._request).fetch(e)}organizationUpdate(e){return new rp(this._request).fetch(e)}projectArchive(e){return new sp(this._request).fetch(e)}projectCreate(e){return new up(this._request).fetch(e)}projectLinkCreate(e){return new mp(this._request).fetch(e)}projectLinkDelete(e){return new kp(this._request).fetch(e)}projectUnarchive(e){return new vp(this._request).fetch(e)}projectUpdate(e,i){return new cp(this._request).fetch(e,i)}pushSubscriptionCreate(e){return new pp(this._request).fetch(e)}pushSubscriptionDelete(e){return new Np(this._request).fetch(e)}reactionCreate(e){return new hp(this._request).fetch(e)}reactionDelete(e){return new fp(this._request).fetch(e)}refreshGoogleSheetsData(e){return new bp(this._request).fetch(e)}resentOrganizationInvite(e){return new yp(this._request).fetch(e)}samlTokenUserAccountAuth(e){return new Sp(this._request).fetch(e)}subscriptionArchive(e){return new gp(this._request).fetch(e)}subscriptionSessionCreate(e){return new Dp(this._request).fetch(e)}subscriptionUpdate(e,i){return new Vp(this._request).fetch(e,i)}get subscriptionUpdateSessionCreate(){return new Fp(this._request).fetch()}subscriptionUpgrade(e,i){return new Ap(this._request).fetch(e,i)}teamArchive(e){return new _p(this._request).fetch(e)}teamCreate(e,i){return new Tp(this._request).fetch(e,i)}teamDelete(e){return new Ip(this._request).fetch(e)}teamKeyDelete(e){return new wp(this._request).fetch(e)}teamMembershipCreate(e){return new qp(this._request).fetch(e)}teamMembershipDelete(e){return new xp(this._request).fetch(e)}teamMembershipUpdate(e,i){return new Cp(this._request).fetch(e,i)}teamUpdate(e,i){return new Op(this._request).fetch(e,i)}templateCreate(e){return new Pp(this._request).fetch(e)}templateDelete(e){return new jp(this._request).fetch(e)}templateUpdate(e,i){return new Up(this._request).fetch(e,i)}userDemoteAdmin(e){return new Bp(this._request).fetch(e)}userFlagUpdate(e,i){return new Ep(this._request).fetch(e,i)}userPromoteAdmin(e){return new Rp(this._request).fetch(e)}userSettingsFlagIncrement(e){return new zp(this._request).fetch(e)}get userSettingsFlagsReset(){return new Lp(this._request).fetch()}userSettingsUpdate(e,i){return new Mp(this._request).fetch(e,i)}get userSubscribeToNewsletter(){return new Wp(this._request).fetch()}userSuspend(e){return new Qp(this._request).fetch(e)}userUnsuspend(e){return new Hp(this._request).fetch(e)}userUpdate(e,i){return new Gp(this._request).fetch(e,i)}viewPreferencesCreate(e){return new Kp(this._request).fetch(e)}viewPreferencesDelete(e){return new $p(this._request).fetch(e)}viewPreferencesUpdate(e,i){return new Jp(this._request).fetch(e,i)}webhookCreate(e){return new Zp(this._request).fetch(e)}webhookDelete(e){return new Yp(this._request).fetch(e)}webhookUpdate(e,i){return new Xp(this._request).fetch(e,i)}workflowStateArchive(e){return new eN(this._request).fetch(e)}workflowStateCreate(e){return new iN(this._request).fetch(e)}workflowStateUpdate(e,i){return new nN(this._request).fetch(e,i)}}__webpack_unused_export__=Ds,__webpack_unused_export__=Vs,__webpack_unused_export__=bv,__webpack_unused_export__=yv,__webpack_unused_export__=Fs,__webpack_unused_export__=ok,__webpack_unused_export__=class extends fs{constructor(e,i){var n,a,t,d,l,o;super(e),this.clientId=null!==(n=i.clientId)&&void 0!==n?n:void 0,this.description=null!==(a=i.description)&&void 0!==a?a:void 0,this.developer=null!==(t=i.developer)&&void 0!==t?t:void 0,this.developerUrl=null!==(d=i.developerUrl)&&void 0!==d?d:void 0,this.imageUrl=null!==(l=i.imageUrl)&&void 0!==l?l:void 0,this.name=null!==(o=i.name)&&void 0!==o?o:void 0}},__webpack_unused_export__=rk,__webpack_unused_export__=As,__webpack_unused_export__=_s,__webpack_unused_export__=Ts,__webpack_unused_export__=Sv,__webpack_unused_export__=Is,__webpack_unused_export__=gv,__webpack_unused_export__=Dv,__webpack_unused_export__=uk,__webpack_unused_export__=class extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(_t,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.attachmentIssue)||void 0===n?void 0:n.attachments;return a?new Is(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=class extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Tt,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.attachmentIssue)||void 0===n?void 0:n.children;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=class extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(It,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.attachmentIssue)||void 0===n?void 0:n.comments;return a?new Bs(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=class extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(wt,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.attachmentIssue)||void 0===n?void 0:n.history;return a?new Au(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=class extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(qt,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.attachmentIssue)||void 0===n?void 0:n.inverseRelations;return a?new ju(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=class extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(xt,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.attachmentIssue)||void 0===n?void 0:n.labels;return a?new qu(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=class extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ct,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.attachmentIssue)||void 0===n?void 0:n.relations;return a?new ju(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=class extends fs{constructor(e,i,n){super(e),this._id=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Ot,Object.assign(Object.assign({id:this._id},this._variables),e)).then((i=>{var n;const a=null===(n=null==i?void 0:i.attachmentIssue)||void 0===n?void 0:n.subscribers;return a?new Qm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=Vv,__webpack_unused_export__=Fv,__webpack_unused_export__=Av,__webpack_unused_export__=_v,__webpack_unused_export__=ws,__webpack_unused_export__=sk,__webpack_unused_export__=Tv,__webpack_unused_export__=kk,__webpack_unused_export__=mk,__webpack_unused_export__=qs,__webpack_unused_export__=S,__webpack_unused_export__=xs,__webpack_unused_export__=vk,__webpack_unused_export__=ck,__webpack_unused_export__=Cs,__webpack_unused_export__=pk,__webpack_unused_export__=class extends fs{constructor(e){super(e)}fetch(){return m(this,void 0,void 0,(function*(){return this._request(Rt,{}).then((e=>{var i;const n=null===(i=null==e?void 0:e.billingDetails)||void 0===i?void 0:i.paymentMethod;return n?new Ps(this._request,n):void 0}))}))}},__webpack_unused_export__=Os,__webpack_unused_export__=Iv,__webpack_unused_export__=D,__webpack_unused_export__=Ps,__webpack_unused_export__=js,__webpack_unused_export__=Nk,__webpack_unused_export__=class extends fs{constructor(e,i,n,a){super(e),this._clientId=i,this._issueId=n,this._version=a}fetch(){return m(this,void 0,void 0,(function*(){return this._request(Lt,{clientId:this._clientId,issueId:this._issueId,version:this._version}).then((e=>{var i;const n=null===(i=null==e?void 0:e.collaborativeDocumentJoin)||void 0===i?void 0:i.steps;return n?new Am(this._request,n):void 0}))}))}},__webpack_unused_export__=wv,__webpack_unused_export__=Us,__webpack_unused_export__=Bs,__webpack_unused_export__=qv,__webpack_unused_export__=xv,__webpack_unused_export__=Es,__webpack_unused_export__=hk,__webpack_unused_export__=Cv,__webpack_unused_export__=fk,__webpack_unused_export__=Rs,__webpack_unused_export__=ys,__webpack_unused_export__=Ov,__webpack_unused_export__=zs,__webpack_unused_export__=Pv,__webpack_unused_export__=Ls,__webpack_unused_export__=Ms,__webpack_unused_export__=jv,__webpack_unused_export__=Ws,__webpack_unused_export__=Qs,__webpack_unused_export__=Uv,__webpack_unused_export__=Bv,__webpack_unused_export__=Hs,__webpack_unused_export__=bk,__webpack_unused_export__=Ev,__webpack_unused_export__=yk,__webpack_unused_export__=Gs,__webpack_unused_export__=Rv,__webpack_unused_export__=Ks,__webpack_unused_export__=zv,__webpack_unused_export__=$s,__webpack_unused_export__=Sk,__webpack_unused_export__=Lv,__webpack_unused_export__=aN,__webpack_unused_export__=tN,__webpack_unused_export__=gk,__webpack_unused_export__=Mv,__webpack_unused_export__=Wv,__webpack_unused_export__=Qv,__webpack_unused_export__=Js,__webpack_unused_export__=class extends fs{constructor(e,i){var n;super(e),this.dependencies=null!==(n=i.dependencies)&&void 0!==n?n:void 0}},__webpack_unused_export__=class extends fs{constructor(e,i){var n,a,t,d,l,o,r;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.clientId=null!==(a=i.clientId)&&void 0!==a?a:void 0,this.createdAt=null!==(t=Ss(i.createdAt))&&void 0!==t?t:void 0,this.id=null!==(d=i.id)&&void 0!==d?d:void 0,this.step=null!==(l=gs(i.step))&&void 0!==l?l:void 0,this.updatedAt=null!==(o=Ss(i.updatedAt))&&void 0!==o?o:void 0,this.version=null!==(r=i.version)&&void 0!==r?r:void 0}},__webpack_unused_export__=Hv,__webpack_unused_export__=Gv,__webpack_unused_export__=Zs,__webpack_unused_export__=Kv,__webpack_unused_export__=Ys,__webpack_unused_export__=Xs,__webpack_unused_export__=eu,__webpack_unused_export__=$v,__webpack_unused_export__=Jv,__webpack_unused_export__=iu,__webpack_unused_export__=Dk,__webpack_unused_export__=Vk,__webpack_unused_export__=Zv,__webpack_unused_export__=nu,__webpack_unused_export__=au,__webpack_unused_export__=tu,__webpack_unused_export__=Yv,__webpack_unused_export__=Xv,__webpack_unused_export__=du,__webpack_unused_export__=Fk,__webpack_unused_export__=ec,__webpack_unused_export__=Ak,__webpack_unused_export__=h,__webpack_unused_export__=ic,__webpack_unused_export__=lu,__webpack_unused_export__=ou,__webpack_unused_export__=_k,__webpack_unused_export__=class extends fs{constructor(e,i,n){super(e),this._fileId=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(nd,Object.assign(Object.assign({fileId:this._fileId},this._variables),e)).then((e=>{var i;const n=null===(i=null==e?void 0:e.figmaEmbedInfo)||void 0===i?void 0:i.figmaEmbed;return n?new ou(this._request,n):void 0}))}))}},__webpack_unused_export__=ru,__webpack_unused_export__=nc,__webpack_unused_export__=g,__webpack_unused_export__=su,__webpack_unused_export__=uu,__webpack_unused_export__=mu,__webpack_unused_export__=ku,__webpack_unused_export__=ac,__webpack_unused_export__=Ti,__webpack_unused_export__=T,__webpack_unused_export__=tc,__webpack_unused_export__=vu,__webpack_unused_export__=cu,__webpack_unused_export__=pu,__webpack_unused_export__=dc,__webpack_unused_export__=lc,__webpack_unused_export__=oc,__webpack_unused_export__=rc,__webpack_unused_export__=sc,__webpack_unused_export__=uc,__webpack_unused_export__=kc,__webpack_unused_export__=mc,__webpack_unused_export__=Nu,__webpack_unused_export__=Tk,__webpack_unused_export__=hu,__webpack_unused_export__=vc,__webpack_unused_export__=class extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new hu(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}},__webpack_unused_export__=fu,__webpack_unused_export__=cc,__webpack_unused_export__=class extends fs{constructor(e,i){super(e),this.googleSheets=i.googleSheets?new ku(e,i.googleSheets):void 0,this.sentry=i.sentry?new Dm(e,i.sentry):void 0,this.slackPost=i.slackPost?new Vm(e,i.slackPost):void 0,this.slackProjectPost=i.slackProjectPost?new Vm(e,i.slackProjectPost):void 0,this.zendesk=i.zendesk?new lk(e,i.zendesk):void 0}},__webpack_unused_export__=Nc,__webpack_unused_export__=pc,__webpack_unused_export__=hc,__webpack_unused_export__=fc,__webpack_unused_export__=bc,__webpack_unused_export__=yc,__webpack_unused_export__=Ik,__webpack_unused_export__=F,__webpack_unused_export__=f,__webpack_unused_export__=bu,__webpack_unused_export__=wk,__webpack_unused_export__=class extends fs{constructor(e,i,n){super(e),this._userHash=i,this._variables=n}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(ld,Object.assign(Object.assign({userHash:this._userHash},this._variables),e)).then((e=>{var i;const n=null===(i=null==e?void 0:e.inviteInfo)||void 0===i?void 0:i.inviteData;return n?new bu(this._request,n):void 0}))}))}},__webpack_unused_export__=yu,__webpack_unused_export__=Su,__webpack_unused_export__=gu,__webpack_unused_export__=Sc,__webpack_unused_export__=Du,__webpack_unused_export__=gc,__webpack_unused_export__=Dc,__webpack_unused_export__=Vu,__webpack_unused_export__=class extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0,this.history=i.history?i.history.map((i=>new Vu(e,i))):void 0}},__webpack_unused_export__=Fu,__webpack_unused_export__=Au,__webpack_unused_export__=_u,__webpack_unused_export__=Vc,__webpack_unused_export__=Fc,__webpack_unused_export__=Ac,__webpack_unused_export__=_c,__webpack_unused_export__=Tc,__webpack_unused_export__=Tu,__webpack_unused_export__=xk,__webpack_unused_export__=Iu,__webpack_unused_export__=Ic,__webpack_unused_export__=wu,__webpack_unused_export__=wc,__webpack_unused_export__=qu,__webpack_unused_export__=qc,__webpack_unused_export__=xu,__webpack_unused_export__=Ck,__webpack_unused_export__=xc,__webpack_unused_export__=vN,__webpack_unused_export__=Ok,__webpack_unused_export__=Cu,__webpack_unused_export__=Ou,__webpack_unused_export__=Pk,__webpack_unused_export__=qk,__webpack_unused_export__=Pu,__webpack_unused_export__=ju,__webpack_unused_export__=Cc,__webpack_unused_export__=Oc,__webpack_unused_export__=Uu,__webpack_unused_export__=Bu,__webpack_unused_export__=jk,__webpack_unused_export__=Pc,__webpack_unused_export__=Uk,__webpack_unused_export__=Bk,__webpack_unused_export__=jc,__webpack_unused_export__=Uc,__webpack_unused_export__=dN,__webpack_unused_export__=lN,__webpack_unused_export__=oN,__webpack_unused_export__=rN,__webpack_unused_export__=sN,__webpack_unused_export__=uN,__webpack_unused_export__=mN,__webpack_unused_export__=kN,__webpack_unused_export__=Ek,__webpack_unused_export__=Bc,__webpack_unused_export__=Ec,exports.y7h=class extends BN{constructor(e){const i=function(e){var i,n,a,{apiKey:t,accessToken:d,apiUrl:l,headers:o}=e,r=u(e,["apiKey","accessToken","apiUrl","headers"]);if(!d&&!t)throw new Error("No accessToken or apiKey provided to the LinearClient - create one here: https://linear.app/settings/api");return Object.assign({headers:Object.assign(Object.assign({Authorization:d?d.startsWith("Bearer ")?d:`Bearer ${d}`:null!=t?t:""},o),{"User-Agent":(a={[null!==(i=process.env.npm_package_name)&&void 0!==i?i:"@linear/sdk"]:null!==(n=process.env.npm_package_version)&&void 0!==n?n:"unknown"},Object.entries(a).reduce(((e,[i,n])=>{const a=`${i}@${encodeURIComponent(n)}`;return e?`${e} ${a}`:a}),""))}),apiUrl:null!=l?l:"https://api.linear.app/graphql"},r)}(e),n=new Ii(i.apiUrl,i);super(((e,i)=>this.client.request(e,i).catch((e=>{throw q(e)})))),this.options=i,this.client=n}},__webpack_unused_export__=bs,__webpack_unused_export__=hs,__webpack_unused_export__=N,__webpack_unused_export__=Ii,__webpack_unused_export__=p,__webpack_unused_export__=BN,__webpack_unused_export__=I,__webpack_unused_export__=Eu,__webpack_unused_export__=Ru,__webpack_unused_export__=Rc,__webpack_unused_export__=zc,__webpack_unused_export__=zu,__webpack_unused_export__=Rk,__webpack_unused_export__=Lc,__webpack_unused_export__=cN,__webpack_unused_export__=zk,__webpack_unused_export__=y,__webpack_unused_export__=Lu,__webpack_unused_export__=Mc,__webpack_unused_export__=Mu,__webpack_unused_export__=Wc,__webpack_unused_export__=Wu,__webpack_unused_export__=Lk,__webpack_unused_export__=Qu,__webpack_unused_export__=Hu,__webpack_unused_export__=Qc,__webpack_unused_export__=Hc,__webpack_unused_export__=Gu,__webpack_unused_export__=Mk,__webpack_unused_export__=Wk,__webpack_unused_export__=Gc,__webpack_unused_export__=Kc,__webpack_unused_export__=Qk,__webpack_unused_export__=Ku,__webpack_unused_export__=$c,__webpack_unused_export__=Jc,__webpack_unused_export__=$u,__webpack_unused_export__=Zc,__webpack_unused_export__=Yc,__webpack_unused_export__=Xc,__webpack_unused_export__=Ju,__webpack_unused_export__=Zu,__webpack_unused_export__=ep,__webpack_unused_export__=Yu,__webpack_unused_export__=np,__webpack_unused_export__=ip,__webpack_unused_export__=Xu,__webpack_unused_export__=em,__webpack_unused_export__=ap,__webpack_unused_export__=tp,__webpack_unused_export__=im,__webpack_unused_export__=class extends fs{constructor(e,i){var n;super(e),this.success=null!==(n=i.success)&&void 0!==n?n:void 0}},__webpack_unused_export__=dp,__webpack_unused_export__=nm,__webpack_unused_export__=Gk,__webpack_unused_export__=am,__webpack_unused_export__=tm,__webpack_unused_export__=lp,__webpack_unused_export__=op,__webpack_unused_export__=dm,__webpack_unused_export__=Kk,__webpack_unused_export__=bN,__webpack_unused_export__=$k,__webpack_unused_export__=lm,__webpack_unused_export__=Hk,__webpack_unused_export__=rp,__webpack_unused_export__=pN,__webpack_unused_export__=NN,__webpack_unused_export__=hN,__webpack_unused_export__=fN,__webpack_unused_export__=A,__webpack_unused_export__=om,__webpack_unused_export__=rm,__webpack_unused_export__=sp,__webpack_unused_export__=sm,__webpack_unused_export__=up,__webpack_unused_export__=um,__webpack_unused_export__=mm,__webpack_unused_export__=mp,__webpack_unused_export__=kp,__webpack_unused_export__=km,__webpack_unused_export__=Zk,__webpack_unused_export__=Yk,__webpack_unused_export__=vm,__webpack_unused_export__=Jk,__webpack_unused_export__=vp,__webpack_unused_export__=cp,__webpack_unused_export__=yN,__webpack_unused_export__=SN,__webpack_unused_export__=gN,__webpack_unused_export__=DN,__webpack_unused_export__=Xk,__webpack_unused_export__=cm,__webpack_unused_export__=pm,__webpack_unused_export__=class extends ys{constructor(e,i,n){super(e,i,(null==n?void 0:n.nodes)?n.nodes.map((i=>new pm(e,i))):void 0,(null==n?void 0:n.pageInfo)?new om(e,n.pageInfo):void 0)}},__webpack_unused_export__=pp,__webpack_unused_export__=Np,__webpack_unused_export__=Nm,__webpack_unused_export__=hm,__webpack_unused_export__=ev,__webpack_unused_export__=b,__webpack_unused_export__=fm,__webpack_unused_export__=bm,__webpack_unused_export__=hp,__webpack_unused_export__=fp,__webpack_unused_export__=ym,__webpack_unused_export__=iv,__webpack_unused_export__=nv,__webpack_unused_export__=bp,__webpack_unused_export__=fs,__webpack_unused_export__=yp,__webpack_unused_export__=Sm,__webpack_unused_export__=class extends fs{constructor(e,i){var n,a,t,d,l;super(e),this.allowedDomains=null!==(n=i.allowedDomains)&&void 0!==n?n:void 0,this.ssoBinding=null!==(a=i.ssoBinding)&&void 0!==a?a:void 0,this.ssoEndpoint=null!==(t=i.ssoEndpoint)&&void 0!==t?t:void 0,this.ssoSignAlgo=null!==(d=i.ssoSignAlgo)&&void 0!==d?d:void 0,this.ssoSigningCert=null!==(l=i.ssoSigningCert)&&void 0!==l?l:void 0}},__webpack_unused_export__=Sp,__webpack_unused_export__=class extends fs{constructor(e,i){var n,a;super(e),this.issueIds=null!==(n=i.issueIds)&&void 0!==n?n:void 0,this.totalCount=null!==(a=i.totalCount)&&void 0!==a?a:void 0,this.archivePayload=i.archivePayload?new _s(e,i.archivePayload):void 0}},__webpack_unused_export__=gm,__webpack_unused_export__=Dm,__webpack_unused_export__=Vm,__webpack_unused_export__=av,__webpack_unused_export__=Fm,__webpack_unused_export__=Am,__webpack_unused_export__=_m,__webpack_unused_export__=gp,__webpack_unused_export__=Tm,__webpack_unused_export__=tv,__webpack_unused_export__=Dp,__webpack_unused_export__=Im,__webpack_unused_export__=Vp,__webpack_unused_export__=Fp,__webpack_unused_export__=Ap,__webpack_unused_export__=class extends fs{constructor(e,i){var n,a,t;super(e),this.loadMore=null!==(n=i.loadMore)&&void 0!==n?n:void 0,this.success=null!==(a=i.success)&&void 0!==a?a:void 0,this.updates=null!==(t=i.updates)&&void 0!==t?t:void 0}},__webpack_unused_export__=class extends fs{constructor(e,i){var n,a,t,d,l;super(e),this.databaseVersion=null!==(n=i.databaseVersion)&&void 0!==n?n:void 0,this.delta=null!==(a=i.delta)&&void 0!==a?a:void 0,this.lastSyncId=null!==(t=i.lastSyncId)&&void 0!==t?t:void 0,this.state=null!==(d=i.state)&&void 0!==d?d:void 0,this.subscribedSyncGroups=null!==(l=i.subscribedSyncGroups)&&void 0!==l?l:void 0}},__webpack_unused_export__=class extends fs{constructor(e,i){var n;super(e),this.lastSyncId=null!==(n=i.lastSyncId)&&void 0!==n?n:void 0}},__webpack_unused_export__=wm,__webpack_unused_export__=_p,__webpack_unused_export__=qm,__webpack_unused_export__=Tp,__webpack_unused_export__=Ip,__webpack_unused_export__=wp,__webpack_unused_export__=xm,__webpack_unused_export__=Cm,__webpack_unused_export__=qp,__webpack_unused_export__=xp,__webpack_unused_export__=Om,__webpack_unused_export__=lv,__webpack_unused_export__=Cp,__webpack_unused_export__=ov,__webpack_unused_export__=Pm,__webpack_unused_export__=dv,__webpack_unused_export__=Op,__webpack_unused_export__=VN,__webpack_unused_export__=FN,__webpack_unused_export__=AN,__webpack_unused_export__=_N,__webpack_unused_export__=TN,__webpack_unused_export__=IN,__webpack_unused_export__=wN,__webpack_unused_export__=qN,__webpack_unused_export__=xN,__webpack_unused_export__=rv,__webpack_unused_export__=jm,__webpack_unused_export__=Um,__webpack_unused_export__=Pp,__webpack_unused_export__=jp,__webpack_unused_export__=Bm,__webpack_unused_export__=sv,__webpack_unused_export__=Up,__webpack_unused_export__=uv,__webpack_unused_export__=V,__webpack_unused_export__=Em,__webpack_unused_export__=Rm,__webpack_unused_export__=zm,__webpack_unused_export__=Lm,__webpack_unused_export__=class extends fs{constructor(e,i){var n,a,t,d,l,o,r;super(e),this.archivedAt=null!==(n=Ss(i.archivedAt))&&void 0!==n?n:void 0,this.createdAt=null!==(a=Ss(i.createdAt))&&void 0!==a?a:void 0,this.email=null!==(t=i.email)&&void 0!==t?t:void 0,this.id=null!==(d=i.id)&&void 0!==d?d:void 0,this.name=null!==(l=i.name)&&void 0!==l?l:void 0,this.service=null!==(o=i.service)&&void 0!==o?o:void 0,this.updatedAt=null!==(r=Ss(i.updatedAt))&&void 0!==r?r:void 0,this.users=i.users?i.users.map((i=>new Lm(e,i))):void 0}},__webpack_unused_export__=Mm,__webpack_unused_export__=Wm,__webpack_unused_export__=Qm,__webpack_unused_export__=Bp,__webpack_unused_export__=Ep,__webpack_unused_export__=_,__webpack_unused_export__=Hm,__webpack_unused_export__=Rp,__webpack_unused_export__=mv,__webpack_unused_export__=Gm,__webpack_unused_export__=zp,__webpack_unused_export__=Km,__webpack_unused_export__=Lp,__webpack_unused_export__=$m,__webpack_unused_export__=Jm,__webpack_unused_export__=kv,__webpack_unused_export__=Mp,__webpack_unused_export__=Wp,__webpack_unused_export__=Zm,__webpack_unused_export__=Qp,__webpack_unused_export__=Hp,__webpack_unused_export__=Gp,__webpack_unused_export__=CN,__webpack_unused_export__=ON,__webpack_unused_export__=PN,__webpack_unused_export__=jN,__webpack_unused_export__=vv,__webpack_unused_export__=Ym,__webpack_unused_export__=Kp,__webpack_unused_export__=$p,__webpack_unused_export__=Xm,__webpack_unused_export__=Jp,__webpack_unused_export__=cv,__webpack_unused_export__=class extends fs{constructor(e,i){super(e),this._variables=i}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Dl,e).then((i=>{var n;const a=null===(n=null==i?void 0:i.viewer)||void 0===n?void 0:n.assignedIssues;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=class extends fs{constructor(e,i){super(e),this._variables=i}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Vl,e).then((i=>{var n;const a=null===(n=null==i?void 0:i.viewer)||void 0===n?void 0:n.createdIssues;return a?new Du(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=class extends fs{constructor(e,i){super(e),this._variables=i}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Fl,e).then((i=>{var n;const a=null===(n=null==i?void 0:i.viewer)||void 0===n?void 0:n.teamMemberships;return a?new Cm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=class extends fs{constructor(e,i){super(e),this._variables=i}fetch(e){return m(this,void 0,void 0,(function*(){return this._request(Al,e).then((i=>{var n;const a=null===(n=null==i?void 0:i.viewer)||void 0===n?void 0:n.teams;return a?new qm(this._request,(i=>this.fetch(Object.assign(Object.assign(Object.assign({},this._variables),e),i))),a):void 0}))}))}},__webpack_unused_export__=ek,__webpack_unused_export__=ik,__webpack_unused_export__=Zp,__webpack_unused_export__=Yp,__webpack_unused_export__=nk,__webpack_unused_export__=pv,__webpack_unused_export__=Xp,__webpack_unused_export__=Nv,__webpack_unused_export__=ak,__webpack_unused_export__=eN,__webpack_unused_export__=tk,__webpack_unused_export__=iN,__webpack_unused_export__=dk,__webpack_unused_export__=hv,__webpack_unused_export__=nN,__webpack_unused_export__=UN,__webpack_unused_export__=fv,__webpack_unused_export__=lk,__webpack_unused_export__=q;
//# sourceMappingURL=index-cjs.min.js.map


/***/ }),

/***/ 334:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

async function auth(token) {
  const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 762:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var universalUserAgent = __nccwpck_require__(429);
var beforeAfterHook = __nccwpck_require__(682);
var request = __nccwpck_require__(234);
var graphql = __nccwpck_require__(668);
var authToken = __nccwpck_require__(334);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

const VERSION = "3.4.0";

class Octokit {
  constructor(options = {}) {
    const hook = new beforeAfterHook.Collection();
    const requestDefaults = {
      baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        // @ts-ignore internal usage only, no need to type
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    }; // prepend default user agent with `options.userAgent` if set

    requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");

    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }

    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }

    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }

    this.request = request.request.defaults(requestDefaults);
    this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign({
      debug: () => {},
      info: () => {},
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log);
    this.hook = hook; // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    // TODO: type `options.auth` based on `options.authStrategy`.

    if (!options.authStrategy) {
      if (!options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        // (2)
        const auth = authToken.createTokenAuth(options.auth); // @ts-ignore  ¯\_(ツ)_/¯

        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const {
        authStrategy
      } = options,
            otherOptions = _objectWithoutProperties(options, ["authStrategy"]);

      const auth = authStrategy(Object.assign({
        request: this.request,
        log: this.log,
        // we pass the current octokit instance as well as its constructor options
        // to allow for authentication strategies that return a new octokit instance
        // that shares the same internal state as the current one. The original
        // requirement for this was the "event-octokit" authentication strategy
        // of https://github.com/probot/octokit-auth-probot.
        octokit: this,
        octokitOptions: otherOptions
      }, options.auth)); // @ts-ignore  ¯\_(ツ)_/¯

      hook.wrap("request", auth.hook);
      this.auth = auth;
    } // apply plugins
    // https://stackoverflow.com/a/16345172


    const classConstructor = this.constructor;
    classConstructor.plugins.forEach(plugin => {
      Object.assign(this, plugin(this, options));
    });
  }

  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};

        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }

        super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
          userAgent: `${options.userAgent} ${defaults.userAgent}`
        } : null));
      }

    };
    return OctokitWithDefaults;
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */


  static plugin(...newPlugins) {
    var _a;

    const currentPlugins = this.plugins;
    const NewOctokit = (_a = class extends this {}, _a.plugins = currentPlugins.concat(newPlugins.filter(plugin => !currentPlugins.includes(plugin))), _a);
    return NewOctokit;
  }

}
Octokit.VERSION = VERSION;
Octokit.plugins = [];

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 440:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var isPlainObject = __nccwpck_require__(287);
var universalUserAgent = __nccwpck_require__(429);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject.isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }

  return obj;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers); // remove properties with undefined values before merging

  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.11";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 668:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var request = __nccwpck_require__(234);
var universalUserAgent = __nccwpck_require__(429);

const VERSION = "4.6.2";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    Object.assign(this, {
      headers: response.headers
    });
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
const FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
    }

    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
      return Promise.reject(new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`));
    }
  }

  const parsedOptions = typeof query === "string" ? Object.assign({
    query
  }, options) : query;
  const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = parsedOptions[key];
    return result;
  }, {}); // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
  // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451

  const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;

  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }

  return request(requestOptions).then(response => {
    if (response.data.errors) {
      const headers = {};

      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }

      throw new GraphqlError(requestOptions, {
        headers,
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 193:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const VERSION = "2.13.3";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(response) {
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  return response;
}

function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return {
          done: true
        };
        const response = await requestMethod({
          method,
          url,
          headers
        });
        const normalizedResponse = normalizePaginatedListResponse(response); // `response.headers.link` format:
        // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
        // sets `url` to undefined if "next" URL is not present or `link` header is not set

        url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
        return {
          value: normalizedResponse
        };
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

const composePaginateRest = Object.assign(paginate, {
  iterator
});

const paginatingEndpoints = ["GET /app/installations", "GET /applications/grants", "GET /authorizations", "GET /enterprises/{enterprise}/actions/permissions/organizations", "GET /enterprises/{enterprise}/actions/runner-groups", "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/organizations", "GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/runners", "GET /enterprises/{enterprise}/actions/runners", "GET /enterprises/{enterprise}/actions/runners/downloads", "GET /events", "GET /gists", "GET /gists/public", "GET /gists/starred", "GET /gists/{gist_id}/comments", "GET /gists/{gist_id}/commits", "GET /gists/{gist_id}/forks", "GET /installation/repositories", "GET /issues", "GET /marketplace_listing/plans", "GET /marketplace_listing/plans/{plan_id}/accounts", "GET /marketplace_listing/stubbed/plans", "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts", "GET /networks/{owner}/{repo}/events", "GET /notifications", "GET /organizations", "GET /orgs/{org}/actions/permissions/repositories", "GET /orgs/{org}/actions/runner-groups", "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories", "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners", "GET /orgs/{org}/actions/runners", "GET /orgs/{org}/actions/runners/downloads", "GET /orgs/{org}/actions/secrets", "GET /orgs/{org}/actions/secrets/{secret_name}/repositories", "GET /orgs/{org}/blocks", "GET /orgs/{org}/credential-authorizations", "GET /orgs/{org}/events", "GET /orgs/{org}/failed_invitations", "GET /orgs/{org}/hooks", "GET /orgs/{org}/installations", "GET /orgs/{org}/invitations", "GET /orgs/{org}/invitations/{invitation_id}/teams", "GET /orgs/{org}/issues", "GET /orgs/{org}/members", "GET /orgs/{org}/migrations", "GET /orgs/{org}/migrations/{migration_id}/repositories", "GET /orgs/{org}/outside_collaborators", "GET /orgs/{org}/projects", "GET /orgs/{org}/public_members", "GET /orgs/{org}/repos", "GET /orgs/{org}/team-sync/groups", "GET /orgs/{org}/teams", "GET /orgs/{org}/teams/{team_slug}/discussions", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", "GET /orgs/{org}/teams/{team_slug}/invitations", "GET /orgs/{org}/teams/{team_slug}/members", "GET /orgs/{org}/teams/{team_slug}/projects", "GET /orgs/{org}/teams/{team_slug}/repos", "GET /orgs/{org}/teams/{team_slug}/team-sync/group-mappings", "GET /orgs/{org}/teams/{team_slug}/teams", "GET /projects/columns/{column_id}/cards", "GET /projects/{project_id}/collaborators", "GET /projects/{project_id}/columns", "GET /repos/{owner}/{repo}/actions/artifacts", "GET /repos/{owner}/{repo}/actions/runners", "GET /repos/{owner}/{repo}/actions/runners/downloads", "GET /repos/{owner}/{repo}/actions/runs", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts", "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs", "GET /repos/{owner}/{repo}/actions/secrets", "GET /repos/{owner}/{repo}/actions/workflows", "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs", "GET /repos/{owner}/{repo}/assignees", "GET /repos/{owner}/{repo}/branches", "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations", "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs", "GET /repos/{owner}/{repo}/code-scanning/alerts", "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances", "GET /repos/{owner}/{repo}/code-scanning/analyses", "GET /repos/{owner}/{repo}/collaborators", "GET /repos/{owner}/{repo}/comments", "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/commits", "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments", "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", "GET /repos/{owner}/{repo}/commits/{ref}/check-runs", "GET /repos/{owner}/{repo}/commits/{ref}/check-suites", "GET /repos/{owner}/{repo}/commits/{ref}/statuses", "GET /repos/{owner}/{repo}/contributors", "GET /repos/{owner}/{repo}/deployments", "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses", "GET /repos/{owner}/{repo}/events", "GET /repos/{owner}/{repo}/forks", "GET /repos/{owner}/{repo}/git/matching-refs/{ref}", "GET /repos/{owner}/{repo}/hooks", "GET /repos/{owner}/{repo}/invitations", "GET /repos/{owner}/{repo}/issues", "GET /repos/{owner}/{repo}/issues/comments", "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/issues/events", "GET /repos/{owner}/{repo}/issues/{issue_number}/comments", "GET /repos/{owner}/{repo}/issues/{issue_number}/events", "GET /repos/{owner}/{repo}/issues/{issue_number}/labels", "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", "GET /repos/{owner}/{repo}/keys", "GET /repos/{owner}/{repo}/labels", "GET /repos/{owner}/{repo}/milestones", "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels", "GET /repos/{owner}/{repo}/notifications", "GET /repos/{owner}/{repo}/pages/builds", "GET /repos/{owner}/{repo}/projects", "GET /repos/{owner}/{repo}/pulls", "GET /repos/{owner}/{repo}/pulls/comments", "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments", "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits", "GET /repos/{owner}/{repo}/pulls/{pull_number}/files", "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers", "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments", "GET /repos/{owner}/{repo}/releases", "GET /repos/{owner}/{repo}/releases/{release_id}/assets", "GET /repos/{owner}/{repo}/secret-scanning/alerts", "GET /repos/{owner}/{repo}/stargazers", "GET /repos/{owner}/{repo}/subscribers", "GET /repos/{owner}/{repo}/tags", "GET /repos/{owner}/{repo}/teams", "GET /repositories", "GET /repositories/{repository_id}/environments/{environment_name}/secrets", "GET /scim/v2/enterprises/{enterprise}/Groups", "GET /scim/v2/enterprises/{enterprise}/Users", "GET /scim/v2/organizations/{org}/Users", "GET /search/code", "GET /search/commits", "GET /search/issues", "GET /search/labels", "GET /search/repositories", "GET /search/topics", "GET /search/users", "GET /teams/{team_id}/discussions", "GET /teams/{team_id}/discussions/{discussion_number}/comments", "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions", "GET /teams/{team_id}/discussions/{discussion_number}/reactions", "GET /teams/{team_id}/invitations", "GET /teams/{team_id}/members", "GET /teams/{team_id}/projects", "GET /teams/{team_id}/repos", "GET /teams/{team_id}/team-sync/group-mappings", "GET /teams/{team_id}/teams", "GET /user/blocks", "GET /user/emails", "GET /user/followers", "GET /user/following", "GET /user/gpg_keys", "GET /user/installations", "GET /user/installations/{installation_id}/repositories", "GET /user/issues", "GET /user/keys", "GET /user/marketplace_purchases", "GET /user/marketplace_purchases/stubbed", "GET /user/memberships/orgs", "GET /user/migrations", "GET /user/migrations/{migration_id}/repositories", "GET /user/orgs", "GET /user/public_emails", "GET /user/repos", "GET /user/repository_invitations", "GET /user/starred", "GET /user/subscriptions", "GET /user/teams", "GET /users", "GET /users/{username}/events", "GET /users/{username}/events/orgs/{org}", "GET /users/{username}/events/public", "GET /users/{username}/followers", "GET /users/{username}/following", "GET /users/{username}/gists", "GET /users/{username}/gpg_keys", "GET /users/{username}/keys", "GET /users/{username}/orgs", "GET /users/{username}/projects", "GET /users/{username}/received_events", "GET /users/{username}/received_events/public", "GET /users/{username}/repos", "GET /users/{username}/starred", "GET /users/{username}/subscriptions"];

function isPaginatingEndpoint(arg) {
  if (typeof arg === "string") {
    return paginatingEndpoints.includes(arg);
  } else {
    return false;
  }
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.composePaginateRest = composePaginateRest;
exports.isPaginatingEndpoint = isPaginatingEndpoint;
exports.paginateRest = paginateRest;
exports.paginatingEndpoints = paginatingEndpoints;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 44:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const Endpoints = {
  actions: {
    addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    approveWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"],
    cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
    createOrUpdateEnvironmentSecret: ["PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
    createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
    createWorkflowDispatch: ["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],
    deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    deleteEnvironmentSecret: ["DELETE /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
    deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    disableSelectedRepositoryGithubActionsOrganization: ["DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    disableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],
    downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
    downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
    downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    enableSelectedRepositoryGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    enableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],
    getAllowedActionsOrganization: ["GET /orgs/{org}/actions/permissions/selected-actions"],
    getAllowedActionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getEnvironmentPublicKey: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key"],
    getEnvironmentSecret: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"],
    getGithubActionsPermissionsOrganization: ["GET /orgs/{org}/actions/permissions"],
    getGithubActionsPermissionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions"],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getPendingDeploymentsForRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],
    getRepoPermissions: ["GET /repos/{owner}/{repo}/actions/permissions", {}, {
      renamed: ["actions", "getGithubActionsPermissionsRepository"]
    }],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getReviewsForRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
    getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listEnvironmentSecrets: ["GET /repositories/{repository_id}/environments/{environment_name}/secrets"],
    listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
    listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    listSelectedRepositoriesEnabledGithubActionsOrganization: ["GET /orgs/{org}/actions/permissions/repositories"],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
    listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    reviewPendingDeploymentsForRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"],
    setAllowedActionsOrganization: ["PUT /orgs/{org}/actions/permissions/selected-actions"],
    setAllowedActionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    setGithubActionsPermissionsOrganization: ["PUT /orgs/{org}/actions/permissions"],
    setGithubActionsPermissionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions"],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    setSelectedRepositoriesEnabledGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories"]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}"],
    checkToken: ["POST /applications/{client_id}/token"],
    createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
      mediaType: {
        previews: ["corsair"]
      }
    }],
    createContentAttachmentForRepo: ["POST /repos/{owner}/{repo}/content_references/{content_reference_id}/attachments", {
      mediaType: {
        previews: ["corsair"]
      }
    }],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens"],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
    getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
    listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories"],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
    removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
    getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
    getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],
    setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences"],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    deleteAnalysis: ["DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"],
    getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}", {}, {
      renamedParameters: {
        alert_id: "alert_number"
      }
    }],
    getAnalysis: ["GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    listAlertInstances: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances", {}, {
      renamed: ["codeScanning", "listAlertInstances"]
    }],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getConductCode: ["GET /codes_of_conduct/{key}", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }]
  },
  emojis: {
    get: ["GET /emojis"]
  },
  enterpriseAdmin: {
    disableSelectedOrganizationGithubActionsEnterprise: ["DELETE /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    enableSelectedOrganizationGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    getAllowedActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/selected-actions"],
    getGithubActionsPermissionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions"],
    listSelectedOrganizationsEnabledGithubActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/organizations"],
    setAllowedActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/selected-actions"],
    setGithubActionsPermissionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions"],
    setSelectedOrganizationsEnabledGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: ["GET /user/interaction-limits", {}, {
      renamed: ["interactions", "getRestrictionsForAuthenticatedUser"]
    }],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits"],
    removeRestrictionsForYourPublicRepos: ["DELETE /user/interaction-limits", {}, {
      renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"]
    }],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: ["PUT /user/interaction-limits", {}, {
      renamed: ["interactions", "setRestrictionsForAuthenticatedUser"]
    }]
  },
  issues: {
    addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
      mediaType: {
        previews: ["mockingbird"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: ["POST /markdown/raw", {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    }]
  },
  meta: {
    get: ["GET /meta"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
    deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
    getImportStatus: ["GET /repos/{owner}/{repo}/import"],
    getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForUser: ["GET /user/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
    setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    startImport: ["PUT /repos/{owner}/{repo}/import"],
    unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    updateImport: ["PATCH /repos/{owner}/{repo}/import"]
  },
  orgs: {
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    get: ["GET /orgs/{org}"],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
    removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}"],
    deletePackageForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}"],
    deletePackageVersionForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    deletePackageVersionForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getAllPackageVersionsForAPackageOwnedByAnOrg: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions", {}, {
      renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"]
    }],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions", {}, {
      renamed: ["packages", "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"]
    }],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions"],
    getAllPackageVersionsForPackageOwnedByOrg: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions"],
    getAllPackageVersionsForPackageOwnedByUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions"],
    getPackageForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}"],
    getPackageForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}"],
    getPackageForUser: ["GET /users/{username}/packages/{package_type}/{package_name}"],
    getPackageVersionForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getPackageVersionForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getPackageVersionForUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    restorePackageForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/restore{?token}"],
    restorePackageForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"],
    restorePackageVersionForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],
    restorePackageVersionForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createCard: ["POST /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createColumn: ["POST /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForAuthenticatedUser: ["POST /user/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForOrg: ["POST /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForRepo: ["POST /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    delete: ["DELETE /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteColumn: ["DELETE /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    get: ["GET /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getCard: ["GET /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getColumn: ["GET /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCards: ["GET /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCollaborators: ["GET /projects/{project_id}/collaborators", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listColumns: ["GET /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForRepo: ["GET /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForUser: ["GET /users/{username}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveColumn: ["POST /projects/columns/{column_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    update: ["PATCH /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateCard: ["PATCH /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateColumn: ["PATCH /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
      mediaType: {
        previews: ["lydian"]
      }
    }],
    updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
  },
  rateLimit: {
    get: ["GET /rate_limit"]
  },
  reactions: {
    createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForRelease: ["POST /repos/{owner}/{repo}/releases/{release_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteLegacy: ["DELETE /reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }, {
      deprecated: "octokit.rest.reactions.deleteLegacy() is deprecated, see https://docs.github.com/rest/reference/reactions/#delete-a-reaction-legacy"
    }],
    listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }]
  },
  repos: {
    acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
    addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: ["GET /repos/{owner}/{repo}/compare/{basehead}"],
    createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateEnvironment: ["PUT /repos/{owner}/{repo}/environments/{environment_name}"],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
      mediaType: {
        previews: ["baptiste"]
      }
    }],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    deleteAnEnvironment: ["DELETE /repos/{owner}/{repo}/environments/{environment_name}"],
    deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    downloadArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}", {}, {
      renamed: ["repos", "downloadZipballArchive"]
    }],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
    getEnvironment: ["GET /repos/{owner}/{repo}/environments/{environment_name}"],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
    removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
    updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks", {}, {
      renamed: ["repos", "updateStatusCheckProtection"]
    }],
    updateStatusCheckProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
      baseUrl: "https://uploads.github.com"
    }]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits", {
      mediaType: {
        previews: ["cloak"]
      }
    }],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    users: ["GET /search/users"]
  },
  secretScanning: {
    getAlert: ["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
    removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: ["POST /user/emails"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: ["POST /user/keys"],
    deleteEmailForAuthenticated: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
    list: ["GET /users"],
    listBlockedByAuthenticated: ["GET /user/blocks"],
    listEmailsForAuthenticated: ["GET /user/emails"],
    listFollowedByAuthenticated: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: ["GET /user/keys"],
    setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};

const VERSION = "5.3.1";

function endpointsToMethods(octokit, endpointsMap) {
  const newMethods = {};

  for (const [scope, endpoints] of Object.entries(endpointsMap)) {
    for (const [methodName, endpoint] of Object.entries(endpoints)) {
      const [route, defaults, decorations] = endpoint;
      const [method, url] = route.split(/ /);
      const endpointDefaults = Object.assign({
        method,
        url
      }, defaults);

      if (!newMethods[scope]) {
        newMethods[scope] = {};
      }

      const scopeMethods = newMethods[scope];

      if (decorations) {
        scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
        continue;
      }

      scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
    }
  }

  return newMethods;
}

function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  /* istanbul ignore next */

  function withDecorations(...args) {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    let options = requestWithDefaults.endpoint.merge(...args); // There are currently no other decorations than `.mapToData`

    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: undefined
      });
      return requestWithDefaults(options);
    }

    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
    }

    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }

    if (decorations.renamedParameters) {
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
      const options = requestWithDefaults.endpoint.merge(...args);

      for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
        if (name in options) {
          octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);

          if (!(alias in options)) {
            options[alias] = options[name];
          }

          delete options[name];
        }
      }

      return requestWithDefaults(options);
    } // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488


    return requestWithDefaults(...args);
  }

  return Object.assign(withDecorations, requestWithDefaults);
}

function restEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit, Endpoints);
  return {
    rest: api
  };
}
restEndpointMethods.VERSION = VERSION;
function legacyRestEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit, Endpoints);
  return _objectSpread2(_objectSpread2({}, api), {}, {
    rest: api
  });
}
legacyRestEndpointMethods.VERSION = VERSION;

exports.legacyRestEndpointMethods = legacyRestEndpointMethods;
exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 537:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __nccwpck_require__(932);
var once = _interopDefault(__nccwpck_require__(223));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 234:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __nccwpck_require__(440);
var universalUserAgent = __nccwpck_require__(429);
var isPlainObject = __nccwpck_require__(287);
var nodeFetch = _interopDefault(__nccwpck_require__(467));
var requestError = __nccwpck_require__(537);

const VERSION = "5.5.0";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  const log = requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;

  if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, // `requestOptions.request.agent` type is incompatible
  // see https://github.com/octokit/types.ts/pull/264
  requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if ("deprecation" in headers) {
      const matches = headers.link && headers.link.match(/<([^>]+)>; rel="deprecation"/);
      const deprecationLink = matches && matches.pop();
      log.warn(`[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`);
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array format

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 682:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var register = __nccwpck_require__(670)
var addHook = __nccwpck_require__(549)
var removeHook = __nccwpck_require__(819)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 549:
/***/ ((module) => {

module.exports = addHook;

function addHook(state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options);
        })
        .then(function () {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}


/***/ }),

/***/ 670:
/***/ ((module) => {

module.exports = register;

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(function () {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce(function (method, registered) {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}


/***/ }),

/***/ 819:
/***/ ((module) => {

module.exports = removeHook;

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  var index = state.registry[name]
    .map(function (registered) {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}


/***/ }),

/***/ 932:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 287:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 467:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__nccwpck_require__(413));
var http = _interopDefault(__nccwpck_require__(605));
var Url = _interopDefault(__nccwpck_require__(835));
var https = _interopDefault(__nccwpck_require__(211));
var zlib = _interopDefault(__nccwpck_require__(761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __nccwpck_require__(877).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(219);


/***/ }),

/***/ 219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(631);
var tls = __nccwpck_require__(16);
var http = __nccwpck_require__(605);
var https = __nccwpck_require__(211);
var events = __nccwpck_require__(614);
var assert = __nccwpck_require__(357);
var util = __nccwpck_require__(669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 429:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 877:
/***/ ((module) => {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 614:
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 631:
/***/ ((module) => {

"use strict";
module.exports = require("net");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 16:
/***/ ((module) => {

"use strict";
module.exports = require("tls");;

/***/ }),

/***/ 835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ 761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__nccwpck_require__.r(__webpack_exports__);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nccwpck_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(438);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nccwpck_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _linear_sdk__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(851);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const linearToken = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('linear-token', { required: true });
const issuesRequired = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getBooleanInput)('issues-required', { required: false });
const shouldAddLabels = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getBooleanInput)('add-labels', { required: false });
const shouldRemoveLabels = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getBooleanInput)('remove-labels', { required: false });
const createMissingLabels = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getBooleanInput)('create-missing-labels', { required: false });
const issuePrefixes = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('issue-prefixes', { required: true })
    .split(' ')
    .map((prefix) => prefix.trim())
    .filter(Boolean);
// input "drafted = In Progress; ready = In Review; merged = Done; closed = Cancelled"
const stateMap = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('state-map', { required: true })
    .split(';')
    .map((pair) => pair
    .trim()
    .split('=')
    .map((chunk) => chunk.trim())
    .filter(Boolean))
    .filter((pair) => pair.length > 1)
    .map(([pullState, linearStateName]) => ({ pullState, linearStateName }));
const allowedPullStates = (/* unused pure expression or super */ null && (['drafted', 'ready', 'merged', 'closed']));
const issueRegex = new RegExp(`((${issuePrefixes.join('|')})-\\d+)`, 'ig');
const linear = new _linear_sdk__WEBPACK_IMPORTED_MODULE_2__/* .LinearClient */ .y7h({ apiKey: linearToken });
const octokit = (0,_actions_github__WEBPACK_IMPORTED_MODULE_1__.getOctokit)((0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('github-token') || process.env.GITHUB_TOKEN);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { nodes: allTeams } = yield linear.teams();
        // Validate configuration state-map, that all pr state exist in allowedPullStates
        const resolvedTeams = yield resolveValidTeamsByPrefixes(allTeams);
        LOG_LIST('Found teams for prefixes', resolvedTeams.map((t) => t.name));
        yield Promise.all(resolvedTeams.map((team) => linearStateMapAssert(team)));
        // console.log('——', context);
        const { action, eventName } = _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.payload;
        const pullRequest = _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.payload.pull_request;
        const { title, draft, html_url: prHtmlUrl, number: prId } = pullRequest;
        const foundIssuesIds = findIssuesInText(title);
        LOG_LIST('Found issues in PR title', foundIssuesIds);
        if (issuesRequired && foundIssuesIds.length === 0) {
            // stop check
            throw new Error('Please, set issues in PR title');
        }
        const foundIssues = yield Promise.all(foundIssuesIds.map((id) => linearIssueFind(id)));
        console.log(`Resolved ${foundIssues.length} issues with specified prefixes`);
        // just the declarative wrapper over promise array
        // we collect the promises here, and await them at the end
        const batcher = createTaskBatcher();
        if (action === 'opened' || action === 'edited') {
            batcher.add(githubSyncLabels({
                linearIssues: foundIssues,
                pr: pullRequest,
            }));
        }
        const prStatus = prStatusDetect(pullRequest);
        LOG(`Pull request status`, prStatus);
        const linearNextState = prStatusMapToLinear(prStatus);
        LOG(`Linear issues status should be changed to`, linearNextState);
        const linearComment = linearCommentText[prStatus](pullRequest);
        const linearIssueProcess = (issue) => __awaiter(this, void 0, void 0, function* () {
            const currentState = yield issue.state;
            const isDiffers = currentState.name !== linearNextState;
            LOG(`Is linear issue state differs from next state`, isDiffers);
            if (isDiffers) {
                yield linearIssueCommentSend(issue, linearComment);
                yield linearIssueMove(issue, linearNextState);
            }
            yield linearLinkUpdate(issue, pullRequest);
        });
        for (const issue of foundIssues) {
            batcher.add(linearIssueProcess(issue));
        }
        yield batcher.execute();
    });
}
function createTaskBatcher() {
    const promises = [];
    return {
        add: (job) => {
            promises.push(job);
        },
        execute: () => Promise.all(promises),
    };
}
function githubSyncLabels({ linearIssues, pr }) {
    return __awaiter(this, void 0, void 0, function* () {
        const repoAllLabels = yield repoLabelsList();
        const linearActualLabelsMap = new Map();
        const linearLabels = yield Promise.all(linearIssues.map((issue) => issue.labels()));
        for (const linearLabel of linearLabels) {
            for (const node of linearLabel.nodes) {
                linearActualLabelsMap.set(node.name, node);
            }
        }
        const linearActualLabels = Array.from(linearActualLabelsMap.values());
        const toAdd = [];
        const toAddMissing = [];
        const toRemove = [];
        const byName = (label) => (another) => {
            return label.name === another.name;
        };
        if (shouldAddLabels) {
            for (const requiredLabel of linearActualLabels) {
                const foundLabel = pr.labels.find(byName(requiredLabel));
                if (foundLabel)
                    continue;
                const existInRepo = repoAllLabels.find(byName(requiredLabel));
                if (existInRepo)
                    toAdd.push(requiredLabel);
                else
                    toAddMissing.push(requiredLabel);
            }
        }
        if (shouldRemoveLabels) {
            for (const currentLabel of pr.labels) {
                const isWrong = !linearActualLabels.find(byName(currentLabel));
                if (!isWrong)
                    continue;
                toRemove.push(currentLabel);
            }
        }
        const batcher = createTaskBatcher();
        if (toAdd.length > 0) {
            LOG_LIST('Found labels to add', toAdd.map((l) => l.name));
            batcher.add(prLabelsAdd(pr, toAdd));
        }
        if (toAddMissing.length > 0 && createMissingLabels) {
            LOG_LIST('Should create missing labels', toAddMissing.map((l) => l.name));
            const createAndAdd = () => __awaiter(this, void 0, void 0, function* () {
                yield repoLabelsCreate(toAddMissing);
                yield prLabelsAdd(pr, toAddMissing);
            });
            batcher.add(createAndAdd());
        }
        if (toRemove.length > 0) {
            LOG_LIST('Found labels to remove', toRemove.map((l) => l.name));
            batcher.add(prLabelsRemove(pr, toRemove));
        }
        return batcher.execute().catch((error) => {
            console.log('Failed to sync labels');
            console.log('PR Labels:');
            console.log(pr.labels);
            console.log('Linear Labels:');
            console.log(Array.from(linearActualLabels));
            console.error(error.message);
        });
    });
}
function repoLabelsList() {
    return octokit.rest.issues
        .listLabelsForRepo({
        owner: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.owner,
        repo: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.repo,
    })
        .then((response) => response.data);
}
function repoLabelsCreate(labels) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(labels.map((label) => octokit.rest.issues.createLabel({
            owner: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.owner,
            repo: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.repo,
            name: label.name,
            color: ColorFormat.github(label.color),
        }))).then(() => {
            LOG_LIST('Labels created', labels.map((l) => l.name));
        });
    });
}
function prLabelsAdd(pr, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        yield octokit.rest.issues
            .addLabels({
            owner: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.owner,
            repo: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.repo,
            issue_number: pr.number,
            labels: labels.map((label) => label.name),
        })
            .then(() => {
            LOG_LIST(`Labels added to #${pr.number}`, labels.map((l) => l.name));
        });
    });
}
function prLabelsRemove(pr, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(labels.map((label) => octokit.rest.issues.removeLabel({
            owner: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.owner,
            repo: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.repo.repo,
            issue_number: pr.number,
            name: label.name,
        }))).then(() => {
            LOG_LIST(`Labels removed from #${pr.number}`, labels.map((l) => l.name));
        });
    });
}
const ColorFormat = {
    linear: (string) => {
        if (string.startsWith('#'))
            return string.toUpperCase();
        return '#' + string.toUpperCase();
    },
    github: (string) => {
        if (!string.startsWith('#'))
            return string.toLowerCase();
        return string.slice(1).toLowerCase();
    },
};
function prStatusMapToLinear(prStatus) {
    const state = stateMap.find(({ pullState }) => pullState === prStatus);
    if (!state) {
        throw new Error(`Not found linear state for "${prStatus}"`);
    }
    return state.linearStateName;
}
function prStatusDetect(pr) {
    if (prIsDrafted(pr))
        return 'drafted';
    if (prIsReady(pr))
        return 'ready';
    if (prIsMerged(pr))
        return 'merged';
    if (prIsClosed(pr))
        return 'closed';
    throw new Error('Unknown status of pull request');
}
function prIsDrafted(pr) {
    return pr.draft;
}
function prIsReady(pr) {
    return pr.state === 'open' && !pr.draft;
}
function prIsMerged(pr) {
    return pr.state === 'closed' && pr.merged;
}
function prIsClosed(pr) {
    return pr.state === 'closed' && !pr.merged;
}
const linearCommentText = {
    drafted: (pr) => `Work started, pull request in draft.`,
    ready: (pr) => `Pull request updated and [ready for review](${pr.html_url}/files).`,
    merged: (pr) => `Pull request merged.`,
    closed: (pr) => 'Pull request closed without merge.',
};
function findIssuesInText(text) {
    return [...text.matchAll(issueRegex)].map(([match]) => match);
}
function resolveValidTeamsByPrefixes(teams) {
    return __awaiter(this, void 0, void 0, function* () {
        const resolvedTeams = [];
        const wrongPrefixes = [];
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
    });
}
function linearStateMapAssert(team) {
    return __awaiter(this, void 0, void 0, function* () {
        const workflowStates = yield linearWorkflowStatesList(team);
        stateMap.forEach(({ linearStateName, pullState }) => {
            const found = workflowStates.find((workflowState) => workflowState.name === linearStateName);
            if (!found || found.archivedAt) {
                throw new Error(`Not found linear workflow state "${linearStateName}" for PR state "${pullState}" in team "${team.name}" (${team.key})`);
            }
        });
    });
}
let statesCache = {};
function linearWorkflowStatesList(team) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_a = statesCache[team.key]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return statesCache[team.key];
        }
        const { nodes: states } = yield linear.workflowStates({ first: 100 });
        const teamStates = (yield Promise.all(states.map((state) => __awaiter(this, void 0, void 0, function* () {
            const found = yield state.team;
            if (found.key === team.key) {
                // There is state in required team
                return state;
            }
            return null;
        })))).filter((state) => state !== null);
        statesCache[team.key] = teamStates;
        return teamStates;
    });
}
function linearIssueFind(identifier) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { nodes: found } = yield linear.issueSearch(identifier);
        if (found.length === 0)
            return null;
        return (_a = found.find((issue) => issue.identifier === identifier)) !== null && _a !== void 0 ? _a : null;
    });
}
function linearIssueMove(issue, moveTo) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentState = yield issue.state;
        if (currentState.name !== moveTo) {
            const team = yield issue.team;
            const availableStatesInTeam = yield linearWorkflowStatesList(team);
            const moveToState = availableStatesInTeam.find((state) => state.name === moveTo);
            if (!moveToState) {
                throw new Error(`Not found state "${moveTo}" in team ${team.name} ${team.key}`);
            }
            yield linear.issueUpdate(issue.id, { stateId: moveToState.id });
            LOG(`Issue ${issue.identifier} moved from "${currentState.name}" to`, moveTo);
        }
    });
}
function linearLinkUpdate(issue, pr) {
    return __awaiter(this, void 0, void 0, function* () {
        let targetId;
        const attachments = yield issue.attachments();
        if (attachments) {
            const found = attachments.nodes.find((attach) => { var _a; return ((_a = attach.metadata) === null || _a === void 0 ? void 0 : _a.pullRequestId) === pr.number; });
            if (found) {
                targetId = found.id;
            }
        }
        const title = `#${pr.number} ${pr.title}`;
        const subtitle = linearAttachmentStatus(pr);
        yield linear.attachmentCreate({
            issueId: issue.id,
            id: targetId,
            title,
            subtitle,
            url: pr.html_url,
            iconUrl: 'https://sergeysova.github.io/public/GitHub-Mark-64px.png',
            metadata: { pullRequestId: pr.number },
        });
        LOG(`Attachment created for ${issue.identifier}`, `${title} ${subtitle}`);
    });
}
function linearAttachmentStatus(pr) {
    switch (prStatusDetect(pr)) {
        case 'merged':
            return 'Merged';
        case 'closed':
            return 'Closed';
        case 'drafted':
            return 'In Draft';
        case 'ready':
            return 'In Review';
    }
}
function linearIssueCommentSend(issue, markdown) {
    return __awaiter(this, void 0, void 0, function* () {
        yield linear.commentCreate({ body: markdown, issueId: issue.id });
        LOG(`Comment sent to ${issue.identifier}`, markdown);
    });
}
main().catch((error) => {
    console.error(error);
    (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed)(error);
    process.exit(-1);
});
function LOG_LIST(prefix, list) {
    console.log(`${prefix}: [${list.map((e) => JSON.stringify(e)).join(', ')}]`);
}
function LOG(prefix, value) {
    console.log(`${prefix}: ${JSON.stringify(value)}`);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;