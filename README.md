# Jenkins Plugin Site

[![Join the chat at https://app.gitter.im/#/room/#jenkins/docs:matrix.org](https://badges.gitter.im/jenkinsci/docs.svg)](https://gitter.im/jenkinsci/docs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![GitHub release](https://img.shields.io/github/release/jenkins-infra/plugin-site.svg?label=changelog)](https://github.com/jenkins-infra/plugin-site/releases/latest)
[![Docker Pulls](https://img.shields.io/docker/pulls/jenkinsciinfra/plugin-site?label=jenkinsciinfra%2Fplugin-site&logo=docker&logoColor=white)](https://hub.docker.com/r/jenkinsciinfra/plugin-site)

This is the frontend application driven by data from the Jenkins Update Center.

## Architecture

The application is developed using [React](https://facebook.github.io/react/), [gatsby](https://www.gatsbyjs.org/), and [Webpack](https://webpack.github.io/).

Production deployments are static html and css files, while development is run through the Gatsby development server.

We welcome any enhancements and bugfixes, please see our [guidelines](CONTRIBUTING.md) on how you can
[contribute](CONTRIBUTING.md).
