@Library('pipeline-library@pull/1059/head') _

def commonCustomEnvs = ['GET_CONTENT=true']
// TODO: to be removed by making `yarn test` passes even with `NODE_ENV=production`
// Ref: https://github.com/jenkins-infra/helpdesk/issues/5281#issuecomment-5833374957
def prodTestWorkaround = ['NODE_ENV=development']

buildWebsite([
  deployFolder: 'plugins/plugin-site/public',
  additionalCredentialsIdsAndVars: [
    'algolia-plugins-app-id': 'GATSBY_ALGOLIA_APP_ID',
    'algolia-plugins-search-key': 'GATSBY_ALGOLIA_SEARCH_KEY',
    'algolia-plugins-write-key': 'GATSBY_ALGOLIA_WRITE_KEY',
  ],
  cronPattern: 'H H/3 * * *',
  customEnvsDevelopment: commonCustomEnvs + ['DISABLE_SEARCH_ENGINE=true', 'NODE_OPTIONS=--experimental-vm-modules'],
  customEnvsProduction: commonCustomEnvs + prodTestWorkaround,
])
