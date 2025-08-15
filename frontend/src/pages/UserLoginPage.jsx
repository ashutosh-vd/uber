import React, { useState } from 'react'
import api from '../utils/api.js';
import { useNavigate } from 'react-router-dom';

const UserLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const submitHandler = async(e) => {
    e.preventDefault();
    if(!email.trim() || password.length === 0) {
      return alert("email or password cannot be empty.");
    }
    const userData = {
      email,
      password
    }
    try {
      const response = await api.post("/v1/api/auth/login", userData);
      if(response?.data?.isCaptain) {
        navigate("/captain");
      }
      else {
        navigate("/user");
      }
    }
    catch(err) {
      const message = err?.response?.data?.message || err?.message || "something went wrong";
      console.error(err?.response?.status, " ", message);
      return alert(message);
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
          <button type="submit" className='bg-blue-100 px-2 py-1 rounded-md'>submit</button>
        </form>

      </div>
    </div>
  )
}

export default UserLoginPage