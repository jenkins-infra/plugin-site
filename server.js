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
        const finalState = JSON.stringify(store.getState()).replace(/</g, '\\x3c');
        res.status(200).render('index', {
          rendered: rendered,
          reduxState: finalState,
          jsPath: jsPath
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
  }
});
