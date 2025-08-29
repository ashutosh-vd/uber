import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import api from '../utils/api.js';
import { useUserStore } from '../stores/useUserStore.js';

const UserSignUpPage = () => {
  const [isCaptain, setIsCaptain] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState(0);
  const {isLoggedIn, setLoggedIn, isLoggingIn, setLoggingIn, setName, setCaptain} = useUserStore();


  if(isLoggedIn) {
    return <Navigate to={"/login"} />;
  }
  const submitHandler = async(e) => {
    e.preventDefault();
    if(!email.trim() || !firstname.trim()) {
      return alert("email or firstname cannot be empty.");
    }
    if(password.length < 6) {
      return alert("password must be at least 6 characters long.");
    }
    if(isCaptain && (vehicleCapacity < 2 || !vehiclePlateNumber || !vehicleType)) {
      return alert("vehicle must be specified properly");
    }
    const userData = {
      fullname : {
        firstname, lastname
      },
      email,
      password,
      isCaptain,
    };
    if(isCaptain) {
      userData.vehicle = {
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
        plate: vehiclePlateNumber,
      }
    }
    // console.log(response.status);
    // console.log(response.data);
    try {
      const response = await api.post("/v1/api/auth/register", userData);
      //no if necessary
      //console.log(response.data);
      setLoggedIn(true);
      setCaptain(response?.data?.isCaptain);
      setName(response?.data?.fullname?.firstname);
    }
    catch(error) {
      const message = error?.response?.data?.message || error?.message || "something went wrong.";
      console.error(error?.response?.status, message);
      alert(message);
    }
    finally {
      setLoggingIn(false);
    }
  }
  return (
    <div className='flex w-screen h-screen'>
      <div className='flex w-1/2 text-7xl justify-center items-center'>
        Register
      </div>
      <div className='w-1/2 flex items-center justify-center'>
        <form action="" method="post" 
          className='flex flex-col gap-5 p-5 text-xl'
          onSubmit={submitHandler}>

          <div className='flex gap-1'>
            <input type="text" name="firstname" placeholder='Firstname'
              className='p-2 w-1/2 bg-zinc-400 border-none outline-none rounded-md'
              onChange={(e) => setFirstname(e.target.value)}/>
            <input type="text" name="lastname" placeholder='Lastname' 
              className='p-2 w-1/2 bg-zinc-400 border-none outline-none rounded-md'
              onChange={(e) => setLastname(e.target.value)}/>
          </div>
          <input type="email" name="email" placeholder='email' 
            className='p-2 bg-zinc-400 border-none outline-none rounded-md'
            onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" name="password" placeholder='password' 
            className='p-2 bg-zinc-400 border-none outline-none rounded-md'
            onChange={(e) => setPassword(e.target.value)}/>
          <div className='flex gap-1 '>
            <input type="checkbox"  name="isCaptain" id='captainConf' onChange={(e) => setIsCaptain(e.target.checked)}/>
            <label htmlFor="captainConf">Register as a captain.</label>
          </div>

          { isCaptain && 
          (<>
          <input type="text" name="vehicleType" placeholder='vehicle type' 
            className='p-2 bg-zinc-400 border-none outline-none rounded-md'
            onChange={(e) => setVehicleType(e.target.value)}/>
          <input type="text" name="vehiclePlateNumber"  placeholder='vehicle plate' 
            className='p-2 bg-zinc-400 border-none outline-none rounded-md'
            onChange={(e) => setVehiclePlateNumber(e.target.value)}/>
          <input type="number" name="vehicleCapacity" placeholder='vehicle capacity'
            className='p-2 bg-zinc-400 border-none outline-none rounded-md'
            onChange={(e) => setVehicleCapacity(Math.max(e.target.value, 0))}/>
          </>)
          }

          <button type="submit" 
          className='bg-blue-300 px-2 py-1 rounded-md hover:bg-blue-400 cursor-pointer select-none transform transition-transform duration-300 hover:scale-110 '
          disabled = {isLoggingIn}
          >
            {isLoggingIn ? "O" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserSignUpPage