/* eslint-disable sort-keys, no-console */
try {
    require('dotenv').config();
} catch(e) {
    console.warn('problem loading .env', e);//expected in production
}

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
    }
};

module.exports.plugins = [
    {
        resolve: 'gatsby-transformer-asciidoc',
        options: {
            attributes: {
            },
        },
    },
    {
        resolve: '@halkeye/gatsby-transformer-rehype',
        options: {
            filter: node => node.internal.type === 'JenkinsPluginWiki',
            source: node => node.internal.content,
            contextFields: [],
            // EmitParseErrors mode (optional, default: false)
            emitParseErrors: true,
            // Verbose mode (optional, default: false)
            verbose: true,
            // Plugins configs (optional but most likely you need one)
            plugins: [
                {
                    resolve: '@halkeye/gatsby-rehype-autolink-headers',
                    options: {
                        elements: ['h1', 'h2', 'h3'],
                        isIconAfterHeader: true
                    }
                },
                // 'gatsby-rehype-prismjs',
            ],
        }
    },
    'gatsby-transformer-sharp',
    {
        resolve: 'gatsby-transformer-remark',
        options: {
            excerpt_separator: '<!-- excerpt -->',
            plugins: [
                {resolve: 'gatsby-remark-remote-relative-images'},
                {
                    resolve: 'gatsby-remark-images',
                    options: {
                        maxWidth: 1200
                    }
                },
                {
                    resolve: 'gatsby-remark-responsive-iframe'
                },
                {
                    resolve: 'gatsby-remark-embed-youtube',
                    options: {
                        width: 800,
                        height: 400
                    }
                },
                {
                    resolve: 'gatsby-remark-autolink-headers',
                    options: {
                        isIconAfterHeader: true
                    }
                },
                'gatsby-remark-prismjs',
                'gatsby-remark-copy-linked-files',
                'gatsby-remark-emoji'
            ]
        }
    },
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
    } : null,
    {
        resolve: 'gatsby-plugin-canonical-urls',
        options: {
            siteUrl: module.exports.siteMetadata.siteUrl,
        },
    },
    process.env.GATSBY_MATOMO_SITE_ID && process.env.GATSBY_MATOMO_SITE_URL ? {
        resolve: 'gatsby-plugin-matomo',
        options: {
            siteId: process.env.GATSBY_MATOMO_SITE_ID,
            matomoUrl: process.env.GATSBY_MATOMO_SITE_URL,
            siteUrl: module.exports.siteMetadata.siteUrl.trim('/'),
            respectDnt: false, // firefox has do not track on by default, and all this data is anonymised, so for enable it for now
        }
    } : null,
    {
        resolve: 'gatsby-plugin-extract-schema',
        options: {
            dest: `${__dirname}/schema.graphql`,
        },
    },
].filter(Boolean);
