import React from 'react'
import { useUserStore } from '../stores/useUserStore.js'
import { Navigate } from 'react-router-dom';

const CaptainHomePage = () => {
  const {isLoggedIn, isCaptain} = useUserStore();
  if(!isLoggedIn || !isCaptain) {
    return <Navigate to={"/login"}/>;
  }
  return (
    <div>
      captainhomepage
    </div>
  )
}

export default CaptainHomePage