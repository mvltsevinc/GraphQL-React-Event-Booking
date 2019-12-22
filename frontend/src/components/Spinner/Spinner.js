import React from 'react';

import './Spinner.css';

const Spinner = () => {
  return (
    <div className='spinner'>
      <div className='lds-heart'>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
