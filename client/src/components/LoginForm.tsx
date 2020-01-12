import React, { useState, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { AUTH_TOKEN_NAME } from '../constants';

import { login, setToken } from '../redux/actions';
import { RootState } from '../redux/types';

function LoginForm({ history }: RouteComponentProps) {
  const endpoint = useSelector((state: RootState) => state.feed.endpoint);
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    const data = {
      username,
      password
    };
    fetch(endpoint + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then((resp) => {
      if (resp.status === 200) {
        return resp.json();
      } else {
        throw new Error('Error authenticating user');
      }
    }).then((data) => {
      saveToken(data.token)
      dispatch(login());
      history.push('/');
    }).catch(console.error)
  }

  function saveToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_NAME, token);
    dispatch(setToken(token));
  }

  return (
    <form className='loginForm' onSubmit={handleLogin}>
      <input
        type='text'
        id='username'
        name='username'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='password'
        id='password'
        name='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type='submit'>Submit</button>
    </form>
  );
}

export default withRouter(LoginForm);
