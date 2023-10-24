/* eslint-env node */
/* eslint-disable no-console */
import path from 'path';

async function createPluginPages({graphql, createPage}) {
    const templatesPluginReleases = path.resolve('src/templates/plugin_releases.jsx');
    const templatesPluginDocumentation = path.resolve('src/templates/plugin_documentation.jsx');
    const templatesPluginIssues = path.resolve('src/templates/plugin_issues.jsx');
    const templatesPluginDependencies = path.resolve('src/templates/plugin_dependencies.jsx');
    const templatesPluginHealthScore = path.resolve('src/templates/plugin_healthScore.jsx');
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
            component: templatesPluginDocumentation,
            context: {
                name: edge.node.name.trim()
            }
        });
        createPage({
            path: `/${edge.node.name.trim()}/releases/`,
            component: templatesPluginReleases,
            context: {
                name: edge.node.name.trim()
            }
        });
        createPage({
            path: `/${edge.node.name.trim()}/issues/`,
            component: templatesPluginIssues,
            context: {
                name: edge.node.name.trim()
            }
        });
        createPage({
            path: `/${edge.node.name.trim()}/dependencies/`,
            component: templatesPluginDependencies,
            context: {
                name: edge.node.name.trim()
            }
        });
        createPage({
            path: `/${edge.node.name.trim()}/healthscore/`,
            component: templatesPluginHealthScore,
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
export const createPages = async ({graphql, actions: {createPage}}) => {
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

