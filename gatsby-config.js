/* eslint-disable sort-keys, no-console */

// This is the content of your gatsby-config.js
// and what you need to provide as schema:
module.exports = {
    siteMetadata: {
        url: 'https://plugins.jenkins.io/',
        siteUrl: 'https://plugins.jenkins.io/',
        title: 'Jenkins Plugins',
        titleTemplate: '%s | Jenkins plugin',
        description: 'Jenkins – an open source automation server which enables developers around the world to reliably build, test, and deploy their software',
        image: 'https://jenkins.io/images/logo-title-opengraph.png',
        twitterUsername: '@JenkinsCI'
    },
    proxy: {
        prefix: '/api',
        url: process.env.DEV_OVERRIDE_API_PROXY || 'https://plugins.jenkins.io',
    },
    plugins: [
        'gatsby-transformer-sharp',
        'gatsby-plugin-image',
        'gatsby-plugin-sharp',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-plugin-sitemap',
            options: {
                output: '/',
            }
        },
        {
            resolve: 'gatsby-plugin-postcss'
        },
        {
            resolve: 'gatsby-plugin-robots-txt',
            options: {
                policy: process.env.DISABLE_SEARCH_ENGINE ?
                    [{userAgent: '*', disallow: ['/']}] :
                    [{userAgent: '*', allow: '/'}]
            }
        },
        {
            resolve: 'gatsby-source-jenkinsplugins',
            options: { }
        },
        {
            resolve: 'gatsby-plugin-nprogress',
            options: {
                color: 'tomato',
                showSpinner: false,
            },
        },
        process.env.GATSBY_ALGOLIA_WRITE_KEY ? {
            resolve: 'gatsby-plugin-algolia',
            options: {
                appId: process.env.GATSBY_ALGOLIA_APP_ID,
                apiKey: process.env.GATSBY_ALGOLIA_WRITE_KEY,
                queries: require('./src/utils/algolia-queries')
            },
        } : null
    ].filter(Boolean)
};

// fancy little script to take any ENV variables starting with GATSBY_CONFIG_ and replace the existing export
Object.keys(process.env).forEach(key => {
    const PREFIX = 'GATSBY_CONFIG_';
    if (!key.startsWith(PREFIX)) { return; }
    // take the env key, less the prefix, split by __ to get the section, then lowercase, and replace _[letter] to be [upper]
    // so GATSBY_CONFIG_SITE_METADATA__URL => siteMetadata.url = value
    const splits = key.substr(PREFIX.length).split('__').map(k => k.toLowerCase().replace(/_(.)/, (_, val) => val.toUpperCase()));
    let element = module.exports;
    for (const keyPart of splits.slice(0, -1)) {
        element = element[keyPart];
        if (!element) {
            console.log(`cant find ${keyPart} of ${key}`);
            return;
        }
    }
    element[splits.slice(-1)[0]] = process.env[key];
});

// put the site meta tag based on the site url, after env is applied
module.exports.plugins.push({
    resolve: 'gatsby-plugin-canonical-urls',
    options: {
        siteUrl: module.exports.siteMetadata.siteUrl,
    },
});
