import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Components/Button';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { GoogleAuthLogin } from '../Server/Server.js';
import { RegisterUser } from '../Server/Server.js';
import { useUser } from '../Store/zustand.js';


function Register() {
  const navigate = useNavigate();
  const setUser = useUser(useCallback(state => state.setUser, []));
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleGoogleLogin = async (response) => {
    try {
      const user = await GoogleAuthLogin(response);
      if (user?.status === 400) {
        setError(user?.error);
      }
      else if (user) {
        setUser(user);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    
    const user = await RegisterUser(formData);
    console.log(user);
    if (user?.status === 400) {
        setError(user?.error);
    }
    else if (user) {
      console.log(user);
      setUser(user);
      navigate('/');
    }
  };

  return (
    <GoogleOAuthProvider clientId={String(import.meta.env.VITE_GOOGLE_CLIENT_ID)}>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="IITJ" src="/iitjlogo1.png" className="mx-auto h-28 w-auto" />
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Create an account
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="username"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
                />
              </div>
            </div>

            <div>
              <Button text="Sign Up" type="submit" />
            </div>
          </form>

          <p className="mt-2 mb-1 text-center text-sm text-gray-500">or</p>

          <GoogleLogin
            onSuccess={(response) => handleGoogleLogin(response)}
            useOneTap
            size="large"
            shape="pill"
            text="Login with Google"
          />

          <p className="mt-3 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <span onClick={() => navigate('/login-user')} className="cursor-pointer text-blue-500">
              Login
            </span>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Register;
