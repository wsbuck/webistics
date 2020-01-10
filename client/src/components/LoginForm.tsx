import React, { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { login } from '../redux/actions';

function LoginForm({ history }: RouteComponentProps) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    dispatch(login());
    history.push('/');
    console.log(event);
  }

  function saveToken(token: String) {
    console.log(token);
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
