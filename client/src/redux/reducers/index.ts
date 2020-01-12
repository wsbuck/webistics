import { combineReducers } from 'redux';

import {
  AuthState,
  FeedState,
  LOGIN,
  LOGOUT,
  SET_TOKEN,
  AuthActionTypes
} from '../types';

import { AUTH_TOKEN_NAME } from '../../constants';

const token = localStorage.getItem(AUTH_TOKEN_NAME) || 'none';

const initialAuthState: AuthState = {
  isLoggedIn: token !== 'none' ? true : false,
  token: token,
};

const prodEndpoint = process.env.REACT_APP_ANALYTICS_ENDPOINT || 'none';

const endpoint = (process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : prodEndpoint
);

const initialFeedState: FeedState = {
  endpoint: endpoint
};

const auth = (
  state=initialAuthState,
  action: AuthActionTypes,
) => {
  switch (action.type) {
    case LOGIN:
      return Object.assign({}, state, {
        isLoggedIn: true,
      });
    case LOGOUT:
      return Object.assign({}, state, {
        isLoggedIn: false,
      });
    case SET_TOKEN:
      return Object.assign({}, state, {
        token: action.payload,
      });
    default:
      return state;
  }
}

const feed = (
  state=initialFeedState,
  action: any
) => {
  switch (action.type) {
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  auth,
  feed,
});

export default rootReducer;
