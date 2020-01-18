import React from 'react';

const Loader = () => (
  <div className='loader-container'>
    <div className='loader' style={{width: 30, height: 30}}>
      <div className='loader' style={{width: 20, height: 20}}>
        <div className='loader' style={{width: 10, height: 10}} />
      </div>
    </div>
  </div>
);

export default Loader;
