import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore.js';
import api from '../utils/api.js';

const Navbar = () => {
  const {isLoggedIn, logout, isCaptain} = useUserStore();
  const logoutHandler = async () => {
    try {
      await api.post("/v1/api/auth/logout");
      logout();
    }
    catch {
      return alert("user logout failed");
    }
  };
  return (
  <nav className='flex justify-between px-6 py-8 bg-black text-white'>
    <Link to={'/'}>
    <div className='text-2xl font-bold'>Uber</div>
    </Link>
    <div className='flex flex-row gap-5'>
      {
        isLoggedIn &&
        <>
        {
          isCaptain ? 
          <div>Ride Request</div> :
          <div>Book a ride</div>
        }
        <div>Profile</div>
        <div onClick={logoutHandler} className='cursor-pointer select-none'>Log out</div>
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