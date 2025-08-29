import React from 'react'
import { useUserStore } from '../stores/useUserStore.js'
import { Navigate } from 'react-router-dom';

const UserHomePage = () => {
  const { isLoggedIn, isCaptain } = useUserStore();
  if(!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }
  if(isCaptain) {
    return <Navigate to={"/captain"} />;
  }
  return (
    <div>UserHomePage</div>
  )
}

export default UserHomePage