import React from 'react';

function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <div className="text-center max-w-md">
                <img alt="IITJ Logo" src="/iitjlogo1.png" className="mx-auto h-24 w-auto" />
                <h1 className="mt-6 text-6xl font-extrabold text-indigo-600">404</h1>
                <p className="mt-4 text-xl font-semibold text-gray-800">Page Not Found</p>
                <p className="mt-2 text-gray-600">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <div className="mt-6">
                    <a href="/" className="inline-block px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition">Return Home</a>
                </div>
            </div>
        </div>
    );
}

export default NotFound;