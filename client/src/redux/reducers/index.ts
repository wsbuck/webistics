import { combineReducers } from 'redux';

import {
  LOGIN,
  LOGOUT,
} from '../actions';

const auth = (
  state={
    isLoggedIn: false,
  },
  action: any
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
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;
