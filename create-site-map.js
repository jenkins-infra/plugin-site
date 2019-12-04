/* eslint-disable no-console */
const unirest = require('unirest');

const pluginSite = process.env.REST_API_URL || 'https://plugins.jenkins.io/api';

function formatDate(date) {
  var d = new Date(date),
    month = `${  d.getMonth() + 1}`,
    day = `${  d.getDate()}`,
    year = d.getFullYear();

  if (month.length < 2) month = `0${  month}`;
  if (day.length < 2) day = `0${  day}`;

  return [year, month, day].join('-');
}


const loggerInfo = console.info.bind('[create-site-map.js][createSiteMap]'); 

function getPage(page) {
  const url = `${pluginSite}/plugins/?limit=100&page=${page}`;
  loggerInfo(`Fetching '${url}'`);
  return unirest.get(url).then(results => {
    if (results.statusCode !== 200) {
      throw results.body;
    }
    return results.body;
  });
}

function createSiteMap() {
  const plugins = [];
  loggerInfo('Starting to fetch plugins for sitemap');

  const handlePromise = pluginsContainer => {
    for (const plugin of pluginsContainer.plugins) {
      plugins.push(plugin);
    }
    if(pluginsContainer.page <= pluginsContainer.pages) {
      return getPage(pluginsContainer.page+1).then(handlePromise);
    }
    return null;
  };

  return getPage(1).then(handlePromise).then(() => {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${plugins.map(plugin =>   `<url>
          <loc>https://plugins.jenkins.io/${plugin.name}</loc>
          <lastmod>${formatDate(new Date(plugin.releaseTimestamp))}</lastmod>
        </url>`
        ).join('')}
      </urlset>`;
    });
}

if (require.main == module) {
  createSiteMap()
    .then(console.log)
    .then(() => {
      console.log('done');
      process.exit(0);
    })
    .catch(console.error);
}

module.exports = {
  createSiteMap
};
