import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from '../reducers';

const configureStore = initialState => {
  return createStore(
    reducer,
    initialState,
    applyMiddleware(
      thunkMiddleware
    )
  );
};

export default configureStore;
