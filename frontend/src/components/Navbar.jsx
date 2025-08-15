import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, SetIsLoggedIn] =  useState(false);
  return (
<nav className='flex justify-between px-6 py-8 bg-black text-white'>
    <Link to={'/'}>
    <div className='text-2xl font-bold'>Uber</div>
    </Link>
    <div className='flex flex-row gap-5'>
      {
        isLoggedIn &&
        <>
        <div>Book a ride</div>
        <div>Profile</div>
        </>
      }
      {
        !isLoggedIn &&
        <>
        <Link to={'/login'}>
          <div>Log in</div>
        </Link>
        <Link to={'/signup'}>
          <div>Register</div>
        </Link>
        </>
      }
      <div>Help</div>
    </div>
  </nav>
  );
};

export default Navbar;