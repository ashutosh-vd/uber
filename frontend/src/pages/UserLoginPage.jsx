import React, { useState } from 'react'
import api from '../utils/api.js';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore.js';

const UserLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {isLoggedIn, setLoggedIn, isCaptain, setCaptain, isLoggingIn, setLoggingIn, setName} = useUserStore();

  if(isLoggedIn) {
    return <Navigate to={isCaptain? "/captain" : "/user"}/>;
  }
  const submitHandler = async(e) => {
    e.preventDefault();
    if(!email.trim() || password.length === 0) {
      return alert("email or password cannot be empty.");
    }
    const userData = {
      email,
      password
    }
    setLoggingIn(true);
    try {
      const response = await api.post("/v1/api/auth/login", userData);
      console.log(response);
      setLoggedIn(true);
      setName(response?.data?.user?.fullname?.firstname);
      setCaptain(response?.data?.isCaptain);
      console.log(response.data.isCaptain);
      console.log(useUserStore.getState().isLoggedIn);
      console.log(useUserStore.getState().isCaptain);
    }
    catch(err) {
      const message = err?.response?.data?.message || err?.message || "something went wrong";
      console.error(err?.response?.status, " ", message);
      alert(message);
    }
    finally {
      setLoggingIn(false);
    }
  };
  return (
    <div className='flex'>
      <div className='w-1/2 text-7xl flex justify-center items-center'>
        Hello.
      </div>
      <div className='h-screen w-1/2 text-xl flex justify-center items-center'>
        <form action="post" method='post'className='flex flex-col w-1/2 gap-5 m-auto border-2 border-black rounded-md p-3'
          onSubmit={submitHandler}>
          <input type="email" name="email" placeholder='Email'
            className='border-none p-2 rounded-md outline-none bg-zinc-400' 
            onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" name="password" placeholder='Password'
            className='border-none p-2 rounded-md outline-none bg-zinc-400'
            onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit" className='bg-blue-100 px-2 py-1 rounded-md' disabled={isLoggingIn}>
            { !isLoggingIn ? "Submit" : "o"}
          </button>
        </form>

      </div>
    </div>
  )
}

export default UserLoginPage