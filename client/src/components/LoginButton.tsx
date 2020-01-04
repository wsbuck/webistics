import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { login, logout } from '../redux/actions';

function LoginButton() {
  const [open, setOpen] = useState(false);
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  function handleClick() {
    if (isLoggedIn) {
      dispatch(logout())
    } else {
      dispatch(login());
    }
    
  }

  return (
    <div>
      <button
        className='login-button'
        onClick={handleClick}
        // onClick={() => setOpen(!open)}
      >
        {isLoggedIn ? 'Log Out' : 'Log In'}
      </button>
    </div>
  );
}

export default LoginButton;
