"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The entrypoint for the action.
 */
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
// enum PackageType {
//   container,
//   npm,
//   maven,
//   nuget,
//   rubygems,
//   docker
// }
async function run() {
    try {
        const github_token = core.getInput('github_token') || process.env.GITHUB_TOKEN || '';
        const package_type = core.getInput('package_type') || process.env.PACKAGE_TYPE || 'container';
        const organization = core.getInput('organization') || process.env.ORGANIZATION || '';
        const repository = core.getInput('repository') || process.env.REPOSITORY || '';
        const ignore = (core.getInput('ignore') || '')
            .trim()
            .split(',')
            .map((i) => i.trim());
        let tag = '';
        const client = (0, github_1.getOctokit)(github_token);
        await client
            .request('GET /orgs/{org}/packages/{package_type}/{package_name}/versions', {
            package_type,
            package_name: repository,
            org: organization,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
            .then((response) => {
            if (response.status === 200) {
                const list = response.data;
                for (const element of list) {
                    for (const t of element.metadata.container.tags) {
                        if (t && tag === '' && !ignore.includes(t)) {
                            tag = t;
                            break;
                        }
                    }
                    if (tag !== '') {
                        break;
                    }
                }
                core.setOutput('tag', tag);
            }
        })
            .catch((e) => {
            core.setFailed(e.message);
        });
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
run();
