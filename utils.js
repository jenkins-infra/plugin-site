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

    const jsxLines = [
        'import React from \'react\';',
        'import { Helmet } from \'react-helmet\';',
        'import SiteVersion from \'./components/SiteVersion\';',
        'import ReportAProblem from \'./components/ReportAProblem\';',
        'import \'./layout.css\';',
        'import JavascriptTimeAgo from \'javascript-time-ago\';',
        'import en from \'javascript-time-ago/locale/en\';',
        'JavascriptTimeAgo.locale(en)'
    ];

    const cssLines = [
        '@import \'./styles/ubuntu-fonts.css\';',
        '@import \'./styles/lato-fonts.css\';',
        '@import \'./styles/roboto-fonts.css\';',
        '@import \'./styles/base.css\';',
        '@import \'./styles/font-icons.css\';',
        '@import \'./styles/tooltip.css\';',
        '@import \'react-time-ago/Tooltip.css\';',
    ];

    console.info(`Downloading header file from '${headerUrl}'`);
    const parsedHeaderUrl = url.parse(headerUrl);
    const baseUrl = `${parsedHeaderUrl.protocol}//${parsedHeaderUrl.hostname}${ parsedHeaderUrl.port ? `:${parsedHeaderUrl.port}` : ''}`;
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
        if (!src) { return; }
        if ( src.startsWith('/')) {
            $(this).attr('src', `${baseUrl}${src}`);
        } else {
            $(this).attr('src', src.replace('https://jenkins.io', baseUrl));
        }
    });
    $('a, link').each(function () {
        const href = $(this).attr('href');
        if (!href) { return; }
        if (href.startsWith('/')) {
            $(this).attr('href', `${baseUrl}${href}`);
        } else {
            $(this).attr('href', href.replace('https://jenkins.io', baseUrl));
        }
    });
    // Even though we're supplying our own this one still causes a conflict.
    $('link[href$="/css/font-icons.css"]').remove();
    // Prevents: Access to resource at 'https://jenkins.io/site.webmanifest' from origin 'https://plugins.jenkins.io' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    $('link[href$="site.webmanifest"]').remove();
    // lets get rid of all the head tags since we are populating them with the SEO component
    $('meta[content*="{{"]').remove();
    //
    // padd as per https://stackoverflow.com/questions/11124777/twitter-bootstrap-navbar-fixed-top-overlapping-site
    $('head').append('<style>{`body { padding-top: 40px; } @media screen and (max-width: 768px) { body { padding-top: 0px; } } `}</style>');
    $('head').append('<style>{`#grid-box { position: relative } `}</style>');
    $('head').append('<style>{`html { min-height:100%; position: relative; }`}</style>');

    $('.nav-link[href="https://plugins.jenkins.io/"]').attr('href', '/');
    $('#grid-box').append('{children}');
    $('#footer .col-md-4').prepend('<ReportAProblem />');
    $('#creativecommons').append('<SiteVersion />');
    $('link[rel="stylesheet"]').each((_, elm) => {
        elm = $(elm);
        cssLines.push(`@import url('${elm.attr('href')}');`);
        elm.remove();
    });

    const keyConversion = {
        class: 'className',
        'charSet': 'charset',
        'http-equiv': 'httpEquiv',
        'stop-color': 'stopColor',
        'crossorigin': 'crossOrigin'
    };

    const handleNode = (node, indent = 0) => {
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
        if (node.name === 'script') {
            // FIXME - handle me
            const text = node.children.map(child => {
                if (child.type === 'text') {
                    return child.data;
                }
                throw new Error(`not sure how to handle ${child.type}`);
            });
            jsxLines.push(`${prefix}<${node.name} ${attrs} dangerouslySetInnerHTML={{__html: ${JSON.stringify(text)}}} />`);
            return;
        } else if (node.type === 'comment') {
            return;
        } else if (node.type === 'text') {
            const text = node.data;
            jsxLines.push(`${prefix}${text}`);
        } else if (node.children && node.children.length) {
            jsxLines.push(`${prefix}<${node.name} ${attrs}>`);
            node.children.forEach(child => handleNode(child, indent+2));
            jsxLines.push(`${prefix}</${node.name}>`);
        } else {
            let tempAttrs = attrs;

            if (!node.name) {
                console.log(node);
            }
            if (node.name === 'siteversion') {
                node.name = 'SiteVersion';
            } else if (node.name === 'reportaproblem') {
                tempAttrs = 'reportProblemUrl={reportProblemUrl} reportProblemTitle={reportProblemTitle} reportProblemRelativeSourcePath={reportProblemRelativeSourcePath}';
                node.name = 'ReportAProblem';
            }
            jsxLines.push(`${prefix}<${node.name} ${tempAttrs} />`);
        }
    };

    jsxLines.push('export default function Layout({ children, id, reportProblemUrl, reportProblemTitle, reportProblemRelativeSourcePath}) {');
    jsxLines.push('  return (');
    jsxLines.push('    <div id={id}>');
    jsxLines.push('      <Helmet>');
    $('head').children(':not(link[rel="stylesheet"])').each((idx, child) => handleNode(child, 2));
    $('head').children('link[rel="stylesheet"]').each((idx, child) => handleNode(child, 2));
    jsxLines.push('      </Helmet>');
    $('body').children().each((idx, child) => handleNode(child, 0));
    jsxLines.push('    </div>');
    jsxLines.push('  );');


    jsxLines.push('}');
    return {
        jsxLines: jsxLines.map(str => str.trimEnd()).filter(Boolean).join('\n'),
        cssLines: cssLines.map(str => str.trimEnd()).filter(Boolean).join('\n')
    };
}

exports.makeReactLayout = makeReactLayout;

if (require.main === module) {
    makeReactLayout().then(data => {
        const fs = require('fs');
        const {jsxLines, cssLines} = data;
        if (jsxLines) {
            fs.writeFileSync('./src/layout.jsx', jsxLines);
        }
        if (cssLines) {
            fs.writeFileSync('./src/layout.css', cssLines);
        }
    });
}
