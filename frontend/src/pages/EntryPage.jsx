import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore.js';

const EntryPage = () => {
  const { checkAuth , isLoggedIn } = useUserStore() ;
  useEffect(() => {
    const check = async () => {
      await checkAuth(); 
    }
    check();
  }, []);
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Uber Clone</h1>
      <p className="text-lg text-gray-600 mb-8">Get moving with our ride-hailing service</p>
      <div className="flex flex-col space-y-4">
        {
          !isLoggedIn && <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Log in
          </Link>
        }
      </div>
      {
        !isLoggedIn && 
        <p 
        className="text-sm text-gray-500 mt-8"
        >
          Don't have an account? 
          <Link to="/signup" className="text-blue-500 hover:text-blue-700">Sign up here</Link>
        </p>
      }
    </div>
  );
};

export default EntryPage;