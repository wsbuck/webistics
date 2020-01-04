export const LOGIN: string = 'LOGIN';
export const LOGOUT: string = 'LOGOUT';

export function login() {
  return {
    type: LOGIN,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}
