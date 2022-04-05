# Contributing Guide

We are glad you want to contribute to jenkins-infra - in particular the plugin-site.

Adhering to the following process is the best way to get your work
included in the project:

1. [Fork](https://help.github.com/fork-a-repo/) the project, clone your fork,
   and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/plugin-site.git
   # Navigate to the newly cloned directory
   cd plugin-site
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/jenkins-infra/plugin-site.git
   ```

2. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout master
   git pull upstream master
   ```

3. Create a new topic branch (off the main project development branch) to
   contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

4. Make your changes. You can check in the [README.md](/README.md) file how to
   setup a development environment and how to test the integrity of the code.

5. Commit your changes in logical chunks. Please adhere to these [git commit
   message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
   or your code is unlikely be merged into the main project. Use Git's
   [interactive rebase](https://help.github.com/articles/interactive-rebase)
   feature to tidy up your commits before making them public.

6. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream master
   ```

7. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

8. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
   with a clear title and description against the `master` branch.

**IMPORTANT**: By submitting a patch, you agree to allow the project owners to
license your work under the terms of the [MIT License](LICENSE).

# Running the app

## Requirements

- node 16+

## Run locally

Supposedly the necessary environment variables have been set with the `.env` file. However, to set the `GATSBY_ALGOLIA_APP_ID` and `GATSBY_ALGOLIA_SEARCH_KEY` as environment variables manually, for example if you are using Linux or macOC, please do the following:

```shell
export GATSBY_ALGOLIA_APP_ID=HF9WKP9QU1
export GATSBY_ALGOLIA_SEARCH_KEY=4ef9c8513249915cc20e3b32c450abcb
```
If you are using a Windows computer you can set the above values by creating new environment variables under System. 

```
yarn install
cd ./plugins/plugin-site
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
cd ./plugins/plugin-site
yarn test:watch
```
