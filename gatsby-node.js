/* eslint-env node */
/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');

const {makeReactLayout} = require('./utils.js');

exports.onPreBootstrap = async () => {
    const {jsxLines, cssLines} = await makeReactLayout();
    if (jsxLines) {
        fs.writeFileSync('./src/layout.jsx', jsxLines);
    }
    if (cssLines) {
        fs.writeFileSync('./src/layout.css', cssLines);
    }
};

exports.createPages = async ({graphql, actions}) => {
    const {createPage} = actions;
    const pluginPage = path.resolve('src/templates/plugin.jsx');
    const indexPage = path.resolve('src/templates/index.jsx');
    const searchPage = path.resolve('src/templates/search.jsx');

    createPage({
        path: '/',
        component: indexPage,
        context: { }
    });

    
    createPage({
        path: '/ui/search',
        component: searchPage,
        context: { }
    });

    await graphql(`{
      allJenkinsPlugin {
        edges {
          node {
            id
            name
          }
        }
      }
    }`).then(result => {
        if (result.errors) {
            console.log(result.errors);
            throw result.errors;
        }

        result.data.allJenkinsPlugin.edges.forEach(edge => {
            createPage({
                path: edge.node.name.trim(),
                component: pluginPage,
                context: {
                    name: edge.node.name.trim()
                }
            });
        });
    });
};

