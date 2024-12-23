/**
 * The entrypoint for the action.
 */
import * as core from '@actions/core'
import { getOctokit } from '@actions/github'

// enum PackageType {
//   container,
//   npm,
//   maven,
//   nuget,
//   rubygems,
//   docker
// }

async function run(): Promise<void> {
  try {
    const github_token: string =
      core.getInput('github_token') || process.env.GITHUB_TOKEN || ''
    const package_type: any =
      core.getInput('package_type') || process.env.PACKAGE_TYPE || 'container'

    const organization: string =
      core.getInput('organization') || process.env.ORGANIZATION || ''
    const repository: string =
      core.getInput('repository') || process.env.REPOSITORY || ''
    const ignore: string[] = (core.getInput('ignore') || '')
      .trim()
      .split(',')
      .map((i) => i.trim())

    let tag = ''

    const client = getOctokit(github_token)

    await client
      .request(
        'GET /orgs/{org}/packages/{package_type}/{package_name}/versions',
        {
          package_type,
          package_name: repository,
          org: organization,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      )
      .then((response: any) => {
        if (response.status === 200) {
          const list = response.data

          for (const element of list) {
            for (const t of element.metadata.container.tags) {
              if (t && tag === '' && !ignore.includes(t)) {
                tag = t
                break
              }
            }
            if (tag !== '') {
              break
            }
          }

          core.setOutput('tag', tag)
        }
      })
      .catch((e) => {
        core.setFailed(e.message)
      })
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
