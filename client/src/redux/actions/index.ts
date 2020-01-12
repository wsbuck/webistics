import { LOGIN, LOGOUT, SET_TOKEN, AuthActionTypes } from '../types';

export function login(): AuthActionTypes {
  return {
    type: LOGIN,
    payload: undefined,
  };
}

export function logout(): AuthActionTypes {
  return {
    type: LOGOUT,
    payload: undefined,
  };
}

export function setToken(token: string): AuthActionTypes {
  return {
    type: SET_TOKEN,
    payload: token,
  }
}
