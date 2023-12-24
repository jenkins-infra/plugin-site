/* eslint-disable no-unused-vars */
const React = require('react');
const gatsby = jest.requireActual('gatsby');

module.exports = {
    ...gatsby,
    graphql: jest.fn(),
    Link: jest.fn().mockImplementation(
        // these props are invalid for an `a` tag
        ({
            activeClassName,
            activeStyle,
            getProps,
            innerRef,
            partiallyActive,
            ref,
            replace,
            to,
            ...rest
        }) =>
            React.createElement('a', {
                ...rest,
                href: to,
            })
    ),
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
