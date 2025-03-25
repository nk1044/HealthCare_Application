import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import { DeleteQueueEntry } from '../Server/Server';
import ChatBox from '../Components/ChatBox';

const socket = io(String(import.meta.env.VITE_BACKEND_URI));

const tags = ['All', 'General', 'ENT', 'Dentist'];


function QueuePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [tag, setTag] = useState('All');
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showChatBox, setShowChatBox] = useState(false);
    const [roomIdForChat, setroomIdForChat] = useState("")


    useEffect(() => {
        try {
            socket.emit("join-queue-room");

            socket.on("queue-data", (data) => {
                // console.log("Queue Data received");
                // console.log(data);

                setData(data || []);
                setLoading(false);
            });

            socket.on("doctor-connected", (data) => {
                console.log(data);
            });
        } catch (error) {
            console.error("Error fetching queue data:", error);
            setLoading(false);
        }

        return () => {
            socket.off("queue-data");
            socket.off("doctor-connected");
        };
    }, []);


    // Filter entries based on the selected tag
    const filterEntries = useCallback(() => {
        if (tag === 'All') {
            setEntries(data.flatMap(entry => entry.Entries.map(e => ({ ...e, tag: entry.tag, Queue_Id: entry._id }))));
        } else {
            const filtered = data
                .filter(entry => entry.tag === tag)
                .flatMap(entry => entry.Entries.map(e => ({ ...e, tag: entry.tag })));
            setEntries(filtered);
        }
    }, [data, tag]);

    // Apply filtering when `tag` or `data` changes
    useEffect(() => {
        filterEntries();
    }, [tag, data, filterEntries]);

    const handleRemoveEntry = (data) => {
        // console.log("Removing entry:", data);
        DeleteQueueEntry(data)
    };

    const getTagColor = (tagName) => {
        switch (tagName) {
            case 'General': return 'bg-blue-100 text-blue-800';
            case 'ENT': return 'bg-green-100 text-green-800';
            case 'Dentist': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Patient Queue</h1>
                        <div className="flex items-center space-x-4">
                            <span className="relative inline-flex">
                                <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">
                                    <span className={`inline-block w-3 h-3 mr-2 rounded-full ${loading ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                                    {loading ? 'Connecting...' : 'Connected'}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Filter by Department</h2>
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex w-48 justify-between items-center rounded-md bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <span>{tag}</span>
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {tags.map((t, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => { setTag(t); setIsOpen(false); }}
                                                className={`block w-full px-4 py-2.5 text-left text-sm ${tag === t
                                                    ? 'bg-gray-100 text-gray-900 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Queue List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-lg font-medium text-gray-900">
                            Patients Waiting
                            {entries.length > 0 && (
                                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {entries.length}
                                </span>
                            )}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No patients waiting</h3>
                            <p className="mt-1 text-sm text-gray-500">The queue is currently empty.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            {entries.map((entry, index) => (
                                <div key={entry._id}
                                    className={`relative ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition-all duration-200 hover:bg-indigo-50 p-6 border-b border-gray-200`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div className="flex items-start space-x-4">
                                            {/* Patient avatar placeholder */}
                                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center mb-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(entry.tag)}`}>
                                                        {entry.tag}
                                                    </span>
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Waiting
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                                    {entry.description || "No description provided"}
                                                </h3>
                                                <div className="mt-1 flex items-center">
                                                    <span className="text-sm text-gray-500">
                                                        Room ID: <span className="font-mono text-gray-600">{entry.roomID}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 flex space-x-3 mt-4 md:mt-0">
                                            <button
                                                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
                                                onClick={() => (
                                                    setroomIdForChat(entry.roomID),
                                                    setShowChatBox(true)
                                                )}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Connect
                                            </button>
                                            <button
                                                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 shadow-sm border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-150"
                                                onClick={() => handleRemoveEntry({ Queue_Id: entry?.Queue_Id, userId: entry?.user })}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showChatBox && (
                <div className='fixed bottom-6 left-6 z-50 w-1/2 h-fit bg-white border border-gray-200 shadow-2xl rounded-lg overflow-hidden transition-all duration-300 ease-in-out animate-slide-up'>
                    <ChatBox
                        roomId={roomIdForChat}
                        setShowChatBox={setShowChatBox}
                        patientData={entries.find(entry => entry.Queue_Id === roomIdForChat)}
                    />
                </div>
            )}
        </div>
    );
}

export default QueuePage;