import React, { useCallback, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { GoogleAuthLogin, LoginUser } from '../Server/Server.js';
import { useUser } from '../Store/zustand.js';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const setUser = useUser(useCallback(state => state.setUser, []));
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [networkStatus, setNetworkStatus] = useState(navigator.onLine);

    // Check if there was a redirect with error message
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorMsg = params.get('error');
        if (errorMsg) {
            setError(decodeURIComponent(errorMsg));
        }
    }, [location]);

    // Monitor network status
    useEffect(() => {
        const handleOnline = () => setNetworkStatus(true);
        const handleOffline = () => {
            setNetworkStatus(false);
            setError('Network connection lost. Please check your internet connection.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleGoogleLogin = async (response) => {
        try {
            setLoading(true);

            if (!response || !response.credential) {
                throw new Error('Google authentication data is missing');
            }

            const user = await GoogleAuthLogin(response);

            if (!user) {
                throw new Error('No response received from authentication server');
            }

            if (user?.status === 400) {
                setError(user?.error || 'Authentication failed. Please try again.');
                return;
            }

            await setUser(user);
            navigate('/');

        } catch (error) {
            console.error('Google login error:', error);
            setError(error.message || 'Authentication failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Input validation
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            const user = await LoginUser(formData);

            if (!user) {
                throw new Error('No response received from server');
            }

            if (user?.status === 400) {
                setError(user?.error || 'Invalid credentials. Please try again.');
                return;
            }

            if (user?.status === 401) {
                setError('Your account is not activated. Please check your email for activation instructions.');
                return;
            }

            if (user?.status === 500) {
                throw new Error('Server error. Please try again later.');
            }

            // Success case
            setUser(user);
            navigate('/');

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed. Server may be unavailable. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GoogleOAuthProvider clientId={String(import.meta.env.VITE_GOOGLE_CLIENT_ID)}>
            <div className="flex min-h-screen bg-gray-50">
                {/* Left side - College branding or image */}
                <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 flex-col justify-center items-center">
                    <img
                        alt="IITJ"
                        src="/iitjlogo1.png"
                        className="w-48 h-auto mb-6"
                        onClick={() => navigate('/')}
                    />
                    <h1 className="text-3xl font-bold text-white text-center px-8">Welcome to Indian Institute of Technology Jodhpur</h1>
                    <p className="text-indigo-200 mt-4 text-center max-w-md px-8">Access your academic portal, course materials, and campus resources</p>
                </div>

                {/* Right side - Login form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
                    <div className="w-full max-w-md mx-auto">
                        <div className="flex justify-center lg:hidden mb-8">
                            <img
                                alt="IITJ"
                                src="/iitjlogo1.png"
                                className="h-20 w-auto cursor-pointer"
                                onClick={() => navigate('/')}
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Sign in to your account
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    placeholder="university@iitj.ac.in"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <span
                                            onClick={() => navigate('/reset-user-password')}
                                            className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500">
                                            Forgot password?
                                        </span>
                                    </div>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || !networkStatus}
                                    className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(loading || !networkStatus) ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : !networkStatus ? 'No Internet Connection' : 'Sign in'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 w-full">
                                {/* Apply a wrapper div with full width and custom styling */}
                                <div className="w-full flex justify-center">
                                    <div style={{ width: '100%' }}>
                                        <GoogleLogin
                                            onSuccess={handleGoogleLogin}
                                            onError={() => setError('Google authentication failed. Please try again or use email login.')}
                                            useOneTap
                                            size="large"
                                            width="100%"
                                            text="signin_with"
                                            shape="rectangular"
                                            logo_alignment="center"
                                            disabled={!networkStatus || loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <span onClick={() => navigate('/register-user')}
                                className='cursor-pointer text-indigo-600 font-medium hover:text-indigo-500'>
                                Register
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    )
}

export default Login