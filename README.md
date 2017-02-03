# Jenkins Plugin Site
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

- node 6.9.5+
- yarn 0.18+

## Run locally with client side rendering
```
yarn
REST_API_URL=<URL to plugin-site-api> yarn start
Open http://localhost:5000
```
This is recommended for normal development as it uses webpack-dev-server and enables hot reloading so changes to code
are immediately detected and the application is recompiled. If `REST_API_URL` is unset it defaults to
http://localhost:8080.

## Run locally with server side rendering
```
yarn
REST_API_URL=<URL to plugin-site-api> yarn server
Open http://localhost:5000
```

This uses server side rendering to help ensure SEO results. This does _not_ enable hot reloading.
If `REST_API_URL` is unset it defaults to localhost:8080.

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
docker build -t jenkinsciinfra/plugin-site .
docker run -p 5000:5000 -it -e REST_API_URL="http://url.to.api" jenkinsciinfra/plugin-site
```
 If `REST_API_URL` is unset it defaults to http://localhost:8080. If `HEADER_FILE` is unset it defaults to
 https://jenkins.io/plugins/index.html
