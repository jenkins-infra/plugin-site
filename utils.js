/* eslint-env node */
/* eslint-disable no-console */
const url = require('url');

const axios = require('axios');
const cheerio = require('cheerio');

async function makeReactLayout() {
    const headerUrl = process.env.HEADER_FILE || 'https://jenkins.io/template/index.html';

    if (!headerUrl) {
        return null;
    }

    const lines = [
        'import React from \'react\';',
        'import { Helmet } from \'react-helmet\';',
        'import \'./styles/ubuntu-fonts.css\';',
        'import \'./styles/lato-fonts.css\';',
        'import \'./styles/roboto-fonts.css\';',
        'import \'./styles/base.css\';',
        'import \'./styles/font-icons.css\';',
    ];

    console.info(`Downloading header file from '${headerUrl}'`);
    const parsedHeaderUrl = url.parse(headerUrl);
    const baseUrl = `${parsedHeaderUrl.protocol}//${parsedHeaderUrl.hostname}`;
    const content = await axios
        .get(headerUrl)
        .then((results) => {
            if (results.status !== 200) {
                throw results.data;
            }
            return results.data;
        });

    const $ = cheerio.load(content, {decodeEntities: false});
    $('title').text('Title must not be empty');
    $('img, script').each(function () {
        const src = $(this).attr('src');
        if (src && src.startsWith('/')) {
            $(this).attr('src', `${baseUrl}${src}`);
        }
    });
    $('a, link').each(function () {
        const href = $(this).attr('href');
        if (href !== undefined && href.startsWith('/')) {
            $(this).attr('href', `${baseUrl}${href}`);
        }
    });
    // Even though we're supplying our own this one still causes a conflict.
    $('link[href$="/css/font-icons.css"]').remove();
    // Prevents: Access to resource at 'https://jenkins.io/site.webmanifest' from origin 'https://plugins.jenkins.io' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    $('link[href$="site.webmanifest"]').remove();
    // No jquery in react
    $('script[src$="/assets/bower/jquery/jquery.min.js"]').remove();
    // FIXME - delete all the bower items?
    //
    // padd as per https://stackoverflow.com/questions/11124777/twitter-bootstrap-navbar-fixed-top-overlapping-site
    $('head').append('<style>{`body { padding-top: 40px; } @media screen and (max-width: 768px) { body { padding-top: 0px; } } `}</style>');
    $('head').append('<style>{`#grid-box { position: relative } `}</style>');
    $('head').append('<style>{`html { min-height:100%; position: relative; }`}</style>');
    $('head').append('<link type="text/css" rel="stylesheet" href="https://wiki.jenkins.io/s/f68dfafb2b4588f7b31742327b4469ae-CDN/en_GB/6441/82994790ee2f720a5ec8daf4850ac5b7b34d2194/be65c4ed0984ca532b26983f5fc1813e/_/download/contextbatch/css/_super/batch.css?atlassian.aui.raphael.disabled=true" data-wrm-key="_super" data-wrm-batch-type="context" media="all">');

    $('#grid-box').append('{children}');

    const keyConversion = {
        class: 'className',
        'charSet': 'charset',
        'http-equiv': 'httpEquiv',
        'stop-color': 'stopColor',
        'crossorigin': 'crossOrigin'
    };

    const handleNode = (node, indent = 0) => {
        if (node.name === 'script') {
            // FIXME - handle me
            node.children.forEach(child => {
                if (child.type === 'text') {
                    child.data = `{\`${ child.data }\`}`;
                }
            });
        }

        const prefix = ''.padStart(6+indent);
        if (node.name === 'link' && node.attribs && node.attribs.rel === 'stylesheet') {
            delete node.attribs.crossorigin;
            node.attribs.type = 'text/css';
            node.attribs.media = 'all';
        }
        const attrs = Object.entries(node.attribs || {}).map(([key, val]) => {
            key = keyConversion[key] || key;
            val = val.replace(/"/g, '\\"');
            return `${key}="${val}"`;
        }).join(' ');
        if (node.type === 'comment') {
            return;
        } else if (node.type === 'text') {
            const text = node.data;
            lines.push(`${prefix}${text}`);
        } else if (node.children && node.children.length) {
            lines.push(`${prefix}<${node.name} ${attrs}>`);
            node.children.forEach(child => handleNode(child, indent+2));
            lines.push(`${prefix}</${node.name}>`);
        } else {
            if (!node.name) {
                console.log(node);
            }
            lines.push(`${prefix}<${node.name} ${attrs} />`);
        }
    };

    lines.push('export default function Layout({ children }) {');
    lines.push('  return (');
    lines.push('    <div>');
    lines.push('      <Helmet>');
    $('head').children(':not(link[rel="stylesheet"])').each((idx, child) => handleNode(child, 2));
    $('head').children('link[rel="stylesheet"]').each((idx, child) => handleNode(child, 2));
    lines.push('      </Helmet>');
    $('body').children().each((idx, child) => handleNode(child, 0));
    lines.push('    </div>');
    lines.push('  );');


    lines.push('}');
    const output = lines.map(str => str.trimEnd()).filter(Boolean).join('\n');
    return output;
}

exports.makeReactLayout = makeReactLayout;

if (require.main === module) {
    makeReactLayout().then(console.log);
}
