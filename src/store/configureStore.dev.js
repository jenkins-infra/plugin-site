import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from '../reducers';
import DevTools from '../components/DevTools';

const configureStore = initialState => {

  const loggerMiddleware = createLogger();

  return createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      ),
      DevTools.instrument()
    )
  );
};

export default configureStore;
