import React from 'react';
import ashLogo from '../../assets/ash-logo.png';

const AppLogo = ({ className }) => {
  return (
    <img 
      src={ashLogo} 
      alt="Ash Logo" 
      className={`${className} object-contain`} 
    />
  );
};

export default AppLogo;