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
        url: 'https://plugins.jenkins.io',
    },
    plugins: [
        'gatsby-plugin-emotion',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-plugin-sitemap',
            options: {
                sitemapSize: 5000
            }
        },
        {
            resolve: 'gatsby-plugin-postcss',
            options: {
                postCssPlugins: [
                    require('postcss-import')({
                        // root: path.join(__dirname, 'src', 'styles')
                    }), // Add support for sass-like '@import'
                    require('postcss-extend')(), // Add support for sass-like '@extend'
                    require('postcss-url')(),
                    require('postcss-nesting')(), // Add support for sass-like nesting of rules
                    require('postcss-pxtorem')({
                        mediaQuery: false, // Ignore media queries
                        minPixelValue: 0, // Minimal pixel value that will be processed
                        propList: [], // List of CSS properties that can be changed from px to rem; empty array means that all CSS properties can change from px to rem
                        replace: true, // Replace pixels with rems
                        rootValue: 16, // Root font-size
                        selectorBlackList: ['html'], // Ignore pixels used for html
                        unitPrecision: 4 // Round rem units to 4 digits
                    }),
                    require('postcss-preset-env')({stage: 3}),
                    require('cssnano')()
                ]
            }
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
            resolve: 'gatsby-plugin-manifest',
            options: {
                name: 'Jenkins Plugins',
                short_name: 'jenkins-plugins',
                start_url: '/',
                background_color: '#2b5797',
                theme_color: '#ffffff',
                display: 'minimal-ui',
                src: 'src/images/apple-touch-icon.png', // This path is relative to the root of the site.
                legacy: false, // this will not add apple-touch-icon links to <head>
            },
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
        
    ]
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
