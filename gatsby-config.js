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
        'gatsby-plugin-sharp',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-plugin-polyfill-io',
            options: {
                features: ['Array.prototype.map', 'fetch']
            },
        },
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
                    require('postcss-import')({}), // Add support for sass-like '@import'
                    require('postcss-extend')(), // Add support for sass-like '@extend'
                    require('postcss-url')(),
                    require('postcss-css-variables')(),
                    require('postcss-calc')(),
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
            resolve: 'gatsby-plugin-favicon',
            options: {
                logo: './src/images/apple-touch-icon.png',
                appName: 'Jenkins Plugins',
                appDescription: 'Jenkins – an open source automation server which enables developers around the world to reliably build, test, and deploy their software',
                dir: 'rtl',
                lang: 'en-US',
                background: '#2b5797',
                theme_color: '#ffffff',
                display: 'minimal-ui',
                orientation: 'any',
                start_url: '/',
                version: '1.0',
                icons: {
                    android: true,
                    appleIcon: true,
                    appleStartup: true,
                    coast: false,
                    favicons: true,
                    firefox: true,
                    opengraph: false,
                    twitter: false,
                    yandex: false,
                    windows: false
                }
            }
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'images',
                path: `${__dirname}/src/images`
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
        }
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
