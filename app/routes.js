import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Main from './components/Main';
import PluginDetail from './components/PluginDetail';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Main} />
    <Route path="/:pluginName" component={PluginDetail} />
  </Route>
);

export default routes;
