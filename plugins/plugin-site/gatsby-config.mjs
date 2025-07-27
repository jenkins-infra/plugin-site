import dotenv from 'dotenv';
import {dirname} from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import algoliaQueries from './src/utils/algolia-queries.mjs';

try {
    dotenv.config();
} catch (e) {
/* eslint-disable no-console */
    console.warn('problem loading .env', e);//expected in production
}

// fancy little script to take any ENV variables starting with GATSBY_CONFIG_ and replace the existing export
Object.keys(process.env).forEach(key => {
    const PREFIX = 'GATSBY_CONFIG_';
    if (!key.startsWith(PREFIX)) {return;}
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
const resolvePath = fn => new URL(import.meta.resolve(fn));
const darkCodeTheme = fs.readFileSync(resolvePath('github-syntax-dark/lib/github-dark.css'), 'utf8');
const autoCodeTheme = `@media (prefers-color-scheme: dark){${darkCodeTheme}}`;
fs.writeFileSync(resolvePath('github-syntax-dark/lib/github-auto.css'), autoCodeTheme);
// This is the content of your gatsby-config.js
// and what you need to provide as schema:
const config = {
    siteMetadata: {
        url: 'https://plugins.jenkins.io/',
        siteUrl: 'https://plugins.jenkins.io/',
        title: 'Jenkins Plugins',
        titleTemplate: '%s | Jenkins plugin',
        twitter: '@jenkinsci',
        githubRepo: 'jenkins-infra/plugin-site',
        description: 'Jenkins – an open source automation server which enables developers around the world to reliably build, test, and deploy their software',
        image: 'https://jenkins.io/images/logo-title-opengraph.png',
        twitterUsername: '@JenkinsCI'
    }
};

config.plugins = [
    {
        resolve: '@jenkinsci/gatsby-plugin-jenkins-layout',
        options: {
            siteUrl: 'https://plugins.jenkins.io/',
            githubBranch: 'main',
            githubRepo: 'jenkins-infra/plugin-site',
            reportAProblemTemplate: '4-bug.yml',
            theme: 'auto',
            extraCss: [
                '@import \'./styles/base.css\';',
                '@import \'github-syntax-light/lib/github-light.css\';',
                '@import \'github-syntax-dark/lib/github-auto.css\';'
            ],
        },
    },
    {
        resolve: '@jenkins-cd/gatsby-jenkinsci-fieldextensions'
    },
    {
        resolve: 'gatsby-transformer-asciidoc',
        options: {
            attributes: {
            },
        },
    },
    {
        resolve: '@jenkins-cd/gatsby-transformer-rehype',
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
                    resolve: '@jenkins-cd/gatsby-rehype-autolink-headers',
                    options: {
                        isIconAfterHeader: true,
                        icon: '<ion-icon name="link-outline"></ion-icon>'
                    }
                },
                {
                    resolve: '@jenkins-cd/gatsby-rehype-rewrite-ids',
                    options: {
                        prefix: 'plugin-content-'
                    }
                },
                {
                    resolve: '@jenkins-cd/gatsby-rehype-rewrite-img-src',
                },
                {
                    resolve: '@jenkins-cd/gatsby-rehype-wrap-tables-bootstrap',
                }
                // 'gatsby-rehype-prismjs',
            ],
        }
    },
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
        resolve: '@jenkins-cd/gatsby-source-jenkinsplugins',
        options: {}
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
            queries: algoliaQueries
        },
    } : null,
    {
        resolve: 'gatsby-plugin-canonical-urls',
        options: {
            siteUrl: config.siteMetadata.siteUrl,
        },
    },
    {
        resolve: 'gatsby-plugin-extract-schema',
        options: {
            dest: `${dirname(fileURLToPath(import.meta.url))}/schema.graphql`,
        },
    },
].filter(Boolean);

export default config;
