import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../reducers';

const middlewares = [thunkMiddleware];
if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

export default function configureStore(preloadedState: any) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middlewares),
  );
}
