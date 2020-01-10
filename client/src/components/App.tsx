import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginButton from './LoginButton';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import Feed from '../pages/Feed';
import { RootState } from '../redux/types';
import '../assets/App.scss';
  

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <div className='App'>
      {/* <LoginButton /> */}
      <Switch>
        <PrivateRoute exact path='/' isLoggedIn={isLoggedIn}>
          <Feed />
        </PrivateRoute>
        <Route exact path='/login'>
          <Login />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
