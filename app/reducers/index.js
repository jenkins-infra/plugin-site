import { combineReducers } from 'redux';
import { data } from './data';
import { ui } from './ui';
import { routerReducer as routing } from 'react-router-redux';

const reducer = combineReducers({
  ui,
  data,
  routing
});

export default reducer;
