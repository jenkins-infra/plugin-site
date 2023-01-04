/* eslint-env node */
/* eslint-disable no-console */
const path = require('path');

async function createPluginPages({graphql, createPage}) {
    const pluginPage = path.resolve('src/templates/plugin.jsx');
    const result = await graphql(`{
      allJenkinsPlugin {
        edges {
          node {
            id
            name
          }
        }
      }
    }`);
    if (result.errors) {
        console.log(result.errors);
        throw result.errors;
    }

    result.data.allJenkinsPlugin.edges.forEach(edge => {
        createPage({
            path: `/${edge.node.name.trim()}/`,
            component: pluginPage,
            context: {
                name: edge.node.name.trim()
            }
        });
    });
}

async function createSuspendedPluginPages({graphql, createPage}) {
    const tombstonePage = path.resolve('src/templates/tombstone.jsx');
    const result = await graphql(`{
      allSuspendedPlugin {
        edges {
          node {
            id
            url
          }
        }
      }
    }`);
    if (result.errors) {
        console.log(result.errors);
        throw result.errors;
    }

    result.data.allSuspendedPlugin.edges.forEach(edge => {
        createPage({
            path: `/${edge.node.id.trim()}/`,
            component: tombstonePage,
            context: {
                name: edge.node.id.trim()
            }
        });
    });
}
exports.createPages = async ({graphql, actions: {createPage}}) => {
    const indexPage = path.resolve('src/templates/index.jsx');
    const searchPage = path.resolve('src/templates/search.jsx');

    createPage({
        path: '/',
        component: indexPage,
        context: {}
    });

    createPage({
        path: '/ui/search/',
        component: searchPage,
        context: {}
    });

    await Promise.all([
        createPluginPages({graphql, createPage}),
        createSuspendedPluginPages({graphql, createPage}),
    ]);
};

