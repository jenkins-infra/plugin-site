# Jenkins Plugin Site

[![Join the chat at https://gitter.im/jenkinsci/docs](https://badges.gitter.im/jenkinsci/docs.svg)](https://gitter.im/jenkinsci/docs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![GitHub release](https://img.shields.io/github/release/jenkins-infra/plugin-site.svg?label=changelog)](https://github.com/jenkins-infra/plugin-site/releases/latest)
[![Docker Pulls](https://img.shields.io/docker/pulls/jenkinsciinfra/plugin-site?label=jenkinsciinfra%2Fplugin-site&logo=docker&logoColor=white)](https://hub.docker.com/r/jenkinsciinfra/plugin-site)

This is the frontend application driven by data from the Jenkins Plugin Site API.

## Architecture
The application is developed using [React](https://facebook.github.io/react/), [gatsby](https://www.gatsbyjs.org/), and [Webpack](https://webpack.github.io/).

Production deployments are static html and css files, while development is run through the gatsby development server.

We welcome any enhancements and bugfixes, please see our [guidelines](CONTRIBUTING.md) on how you can
[contribute](CONTRIBUTING.md).

# Running the app

## Requirements

- node 12+
- yarn 1.13+

## Run locally

```
yarn
yarn dev
Open http://localhost:3000
```

To aid with development mode, an environment variable of GET_CONTENT is needed to force gatsby to pull down the slow wiki/github content for each plugin


## Linting

ESLint with React linting options have been enabled.
```
yarn lint
```

## Tests

Execute tests via
```
yarn test
```

or run in watch mode
```
yarn test:watch
```
