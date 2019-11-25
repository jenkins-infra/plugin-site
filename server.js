import React from 'react';
import express from 'express';
import exphbs  from 'express-handlebars';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import routes from './app/routes';
import chalk from 'chalk';
import configureStore from './app/store/configureStore';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import fs from 'fs';
import unirest from 'unirest';
import cheerio from 'cheerio';
import schedule from 'node-schedule';

const app = express();
const port = 5000;
const jsPath = '/assets/js';

// Using helmet to secure Express with various HTTP headers
app.use(helmet());
// Prevent HTTP parameter pollution.
app.use(hpp());
// Compress all requests
app.use(compression());
// Use morgan for http request debug (only show error)
app.use(morgan('dev', { skip: (req, res) => res.statusCode < 400 }));

app.use(express.static('./public'));
app.use(jsPath, express.static('./dist/client'));

app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

const defaultPluginSiteTitle = 'Jenkins Plugins';
const defaultPluginDescription = 'Jenkins – an open source automation server which enables developers around the world to reliably build, test, and deploy their software';
const defaultPluginOpenGraphImage = 'https://jenkins.io/images/logo-title-opengraph.png'

const downloadHeader = () => {
  var headerFile = __HEADER_FILE__;
  if (headerFile !== null && headerFile !== undefined) {
    console.info(`Downloading header file from '${headerFile}'`);
    unirest.get(headerFile).end((response) => {
      if (response.statusCode == 200) {
        var $ = cheerio.load(response.body, { decodeEntities: false });
        $('img, script').each(function() {
          var src = $(this).attr('src');
          if (src !== undefined && src.startsWith('/')) {
            $(this).attr('src', 'https://jenkins.io' + src);
          }
        });
        $('a, link').each(function() {
          var href = $(this).attr('href');
          if (href !== undefined && href.startsWith('/')) {
            $(this).attr('href', 'https://jenkins.io' + href);
          }
        });
        $('head').prepend('{{> header }}');
        // Even though we're supplying our own this one still causes a conflict.
        $('link[href="https://jenkins.io/css/font-icons.css"]').remove();
        // Prevents: Access to resource at 'https://jenkins.io/site.webmanifest' from origin 'https://plugins.jenkins.io' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
        $('link[href="https://jenkins.io/site.webmanifest"]').remove();
        $('head').append('<script>window.__REDUX_STATE__ = {{{reduxState}}};</script>');
        $('#grid-box').append('{{{rendered}}}');
        $('#grid-box').after('<script type="text/javascript" src="{{jsPath}}/main.js"></script>');
        $('#creativecommons').append('{{> version }}');
        fs.writeFileSync('./views/index.hbs', $.html());
      } else {
        console.error(response.statusCode);
        console.error(error);
      }
    });
  } else {
    console.info("HEADER_FILE environment variable null");
  }
}

downloadHeader();

const getPluginSiteVersion = () => {
  const file = './GIT_COMMIT';
  try {
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf-8').substring(0, 7) : 'TBD';
  } catch (err) {
    console.error(chalk.red(`Problem accessing ${file}`), err);
  }
}

const pluginSiteVersion = getPluginSiteVersion();

app.get('*', (req, res, next) => {
  match({ routes: routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (!renderProps) {
      res.sendStatus(404);
    } else {
      const store = configureStore();
      const { location, params, history } = renderProps;
      const promises = renderProps.components
        .filter(component => component.fetchData)
        // Should the component have a static method `fetchData({ store, location, params, history })` then
        // call it.
        .map(component => component.fetchData({ store, location, params, history }));

      Promise.all(promises).then(() => {
        const rendered = renderToString(
          <div>
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          </div>
        );
        const pluginSiteApiVersion = store.getState().data.info.commit.substring(0, 7);
        const reduxState = JSON.stringify(store.getState()).replace(/</g, '\\x3c');
        const pluginNotFound = req.url !== '/' && store.getState().ui.plugin === null;

        const title = store.getState().ui.plugin && store.getState().ui.plugin.title ? `${store.getState().ui.plugin.title} - Jenkins plugin` : defaultPluginTitle;
        const description = store.getState().ui.plugin && store.getState().ui.plugin.excerpt ? store.getState().ui.plugin.excerpt : defaultPluginDescription;
        const opengraphImage = defaultPluginOpenGraphImage; // TODO add support for plugins to provide their own OG imag

        res.status(pluginNotFound ? 404 : 200).render('index', {
          rendered,
          title,
          description,
          reduxState,
          opengraphImage,
          jsPath,
          pluginSiteVersion,
          pluginSiteApiVersion
        });
      }).catch((err) => {
        console.error(chalk.red(error));
        res.sendStatus(404);
      });
    }
  });
});

app.listen(port, (error) => {
  if (error) {
    console.error(chalk.red(error)); // eslint-disable-line no-console
  } else {
    console.info(chalk.green(`==>  Listening on port ${port}`)); // eslint-disable-line no-console
    schedule.scheduleJob('*/15 * * * *', () => {
      downloadHeader();
    });
  }
});
