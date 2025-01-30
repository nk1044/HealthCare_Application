import React from 'react';

function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                <img alt="IITJ" src="/iitjlogo1.png" className="mx-auto h-20 w-auto animate-pulse" />
                <div className="mt-5 flex items-center justify-center">
                    <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-3 text-lg text-gray-700">Loading...</p>
            </div>
        </div>
    );
}

export default Loading;
