import rootReducer from '../reducers';

export const LOGIN: string = 'LOGIN';
export const LOGOUT: string = 'LOGOUT';

export interface AuthState {
  isLoggedIn: boolean;
};

interface LoginAction {
  type: typeof LOGIN
};

interface LogoutAction {
  type: typeof LOGOUT
};

export type AuthActionTypes = LoginAction | LogoutAction;

export type RootState = ReturnType<typeof rootReducer>;
