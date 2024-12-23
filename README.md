# Get get-latest-package-tag Action

This is a GitHub action to retrieve the latest tag of a package from GitHub Api.

## Basic

```yaml
- name: Get latest tag
  uses: maurosala/get-latest-package-tag@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Advanced

```yaml
- name: Get latest tag
  uses: maurosala/get-latest-package-tag@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    package_type: container
    organization: maurosala
    repository: sample-repository
    ignore: latest
```

## Inputs

| Name         | Description              | Required | Default                                                    | Sample           |
| ------------ | ------------------------ | -------- | ---------------------------------------------------------- | ---------------- |
| github_token | GitHub token             | true     |                                                            |                  |
| package_type | Type of package          | false    | container (container, npm, maven, rubygems, docker, nuget) |                  |
| organization | GitHub organization name | false    | ${{ github.repository_owner }}                             |                  |
| repository   | GitHub repository name   | false    | ${{ github.repository }}                                   |                  |
| ignore       | Ignore tag               | false    |                                                            | latest, snapshot |

## Outputs

| Name | Description              |
| ---- | ------------------------ |
| tag  | the latest retrieved tag |
