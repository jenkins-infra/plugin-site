# Jenkins Plugin Site

[![Join the chat at https://gitter.im/jenkinsci/docs](https://badges.gitter.im/jenkinsci/docs.svg)](https://gitter.im/jenkinsci/docs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![GitHub release](https://img.shields.io/github/release/jenkins-infra/plugin-site.svg?label=changelog)](https://github.com/jenkins-infra/plugin-site/releases/latest)

This is the frontend application driven by data from the Jenkins Plugin Site API.

## Architecture
The application is developed using [React](https://facebook.github.io/react/), [Redux](http://redux.js.org/),
[Express](http://expressjs.com/), [Webpack](https://webpack.github.io/), and
[Reselect](https://github.com/reactjs/reselect).

Production deployments use server side rendering to help ensure quality SEO results.

We welcome any enhancements and bugfixes, please see our [guidelines](CONTRIBUTING.md) on how you can
[contribute](CONTRIBUTING.md).

# Running the app

## Requirements

- node 6.9+
- yarn 0.18+

## Run locally with client side rendering
```
yarn
yarn start
Open http://localhost:5000
```
This is recommended for normal development as it uses webpack-dev-server and enables hot reloading so changes to code
are immediately detected and the application is recompiled. By default it communicates with https://plugins.jenkins.io/api
for the REST API. To specify a different location supply the `REST_API_URL` environment variable.

## Run locally with server side rendering
```
yarn
yarn server
Open http://localhost:5000
```

This uses server side rendering to help ensure SEO results. This does _not_ enable hot reloading.
If `REST_API_URL` is unset it defaults to https://plugins.jenkins.io/api.

When using server side rendering, the application will download a header from an external location and inject itself
into the content and replace the view/index.hbs. This is _intended_ for use in the Dockerfile production deployment.
By default the location is https://jenkins.io/plugins/index.html. To specify a different location supply the
`HEADER_FILE` environment variable.

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

# Deploying the app

It's recommended the application be deployed via it's Dockerfile.

## Requirements

- Docker 1.12+

```
docker build -t jenkinsciinfra/plugin-site --rm --no-cache .
docker run -p 5000:5000 -it jenkinsciinfra/plugin-site
```
 If `REST_API_URL` is unset it defaults to https://plugins.jenkins.io/api. If `HEADER_FILE` is unset it defaults to
 https://jenkins.io/plugins/index.html
