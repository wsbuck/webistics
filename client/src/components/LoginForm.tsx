import React, { useState, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import clsx from 'clsx';

import { AUTH_TOKEN_NAME } from '../constants';
import Loader from './Loader';

import { login, setToken } from '../redux/actions';
import { RootState } from '../redux/types';

function LoginForm({ history }: RouteComponentProps) {
  const endpoint = useSelector((state: RootState) => state.feed.endpoint);
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
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
    }).then(() => {
      // setTimeout(() => setLoading(false), 1000);
      setLoading(false);
      dispatch(login());
      history.push('/');
    }).catch(err => {
      setLoading(false);
      setError(true);
      setUsername('');
      setPassword('');
      console.error(err);
    });
  }

  function saveToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_NAME, token);
    dispatch(setToken(token));
  }

  return (
    <form className={clsx('loginForm', error && 'error')} onSubmit={handleLogin}>
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
      { loading && (<Loader />) }
    </form>
  );
}

export default withRouter(LoginForm);
