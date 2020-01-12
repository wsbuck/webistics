import rootReducer from '../reducers';

export const LOGIN: string = 'LOGIN';
export const LOGOUT: string = 'LOGOUT';
export const SET_TOKEN: string = 'SET_TOKEN';

export interface AuthState {
  isLoggedIn: boolean;
  token: string;
};

export interface FeedState {
  endpoint: string;
};

interface LoginAction {
  type: typeof LOGIN
  payload: void,
};

interface LogoutAction {
  type: typeof LOGOUT,
  payload: void,
};

interface SetTokenAction {
  type: typeof SET_TOKEN,
  payload: string;
};

export type AuthActionTypes = LoginAction | LogoutAction | SetTokenAction;

export type RootState = ReturnType<typeof rootReducer>;
