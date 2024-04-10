/* eslint-disable jest/prefer-importing-jest-globals */
const React = require('react');
const gatsby = jest.requireActual('gatsby');

module.exports = {
    ...gatsby,
    graphql: jest.fn(),
    Link: jest.fn().mockImplementation( (options) => {
        const filtered = {href: options.to, ...options};
        ['activeClassName', 'activeStyle', 'getProps', 'innerRef', 'partiallyActive',
            'ref', 'replace', 'to'].forEach(prop => delete filtered[prop]);
        return React.createElement('a', filtered);
    }),
    StaticQuery: jest.fn(),
    useStaticQuery: jest.fn().mockImplementation(() => {
        return {
            jenkinsPluginSiteInfo: {
                website: {
                    commit: 'FAKECommit'
                }
            },
            site: {
                buildTime: new Date(1578980455).getUTCDate(),
                siteMetadata: {
                    githubRepo: 'jenkins-infra/plugin-site',
                    siteUrl: 'https://plugins.jenkins.io'
                }
            },
            labels: {
                edges: [
                    {node: {id: 'something', title: 'title'}}
                ]
            },
        };
    })
};
