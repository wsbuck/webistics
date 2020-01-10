import { combineReducers } from 'redux';

import { AuthState, LOGIN, LOGOUT, AuthActionTypes } from '../types';

const initialAuthState: AuthState = {
  isLoggedIn: false,
};

const auth = (
  state=initialAuthState,
  action: AuthActionTypes
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
