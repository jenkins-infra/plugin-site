def commonCustomEnvs = ['GET_CONTENT=true']

buildWebsite([
  deployFolder: 'plugins/plugin-site/public',
  additionalCredentialsIdsAndVars: [
    'algolia-plugins-app-id': 'GATSBY_ALGOLIA_APP_ID',
    'algolia-plugins-search-key': 'GATSBY_ALGOLIA_SEARCH_KEY',
    'algolia-plugins-write-key': 'GATSBY_ALGOLIA_WRITE_KEY',
  ],
  cronPattern: 'H H/3 * * *',
  customEnvsDevelopment: commonCustomEnvs + ['DISABLE_SEARCH_ENGINE=true', 'NODE_OPTIONS=--experimental-vm-modules'],
  customEnvsProduction: commonCustomEnvs,
])
