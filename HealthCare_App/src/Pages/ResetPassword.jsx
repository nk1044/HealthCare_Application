import React from 'react';
import Button from '../Components/Button';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {

    const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="IITJ"
                    src="/iitjlogo1.png"
                    className="mx-auto h-28 w-auto"
                />
                <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Reset your password
                </h2>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="#" method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Enter Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className=''>
                        <Button
                            text="Reset Password"
                        />
                    </div>
                </form>

                <p className='mt-2 mb-1 text-center text-sm/6 text-gray-500'>
                    or
                </p>

                <Button
                    text="Back to Login"
                    class_Name="text-black bg-green-400 hover:bg-green-300"
                    onClick={()=>navigate('/login-user')}
                />
            </div>
        </div>
  )
}

export default ResetPassword