import React, { useEffect, useState, useCallback } from 'react';
import { getChatHistory } from '../Server/Server.js';
import { useUser } from '../Store/zustand.js';
import ChatDetailView from '../Components/ChatDetailView.jsx';

function Profile() {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const user = useUser(useCallback(state => state.user, []));

  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        const data = await getChatHistory();
        if (data) {
          setChatHistory(data);
        } else {
          setError('Failed to fetch chat history');
        }
      } catch (err) {
        setError('An error occurred');
      }
      setLoading(false);
    };

    fetchChatHistory();
  }, []);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackClick = () => {
    setSelectedChat(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          {selectedChat && (
            <button 
              onClick={handleBackClick}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Chat History
            </button>
          )}
        </div>

        {selectedChat ? (
          <ChatDetailView chat={selectedChat} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Card */}
            <div className="col-span-1">
              <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">{user.name}</h2>
                <p className="text-gray-500 text-center mb-4">{user.role}</p>
                <div className="border-t pt-4 mt-2">
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-gray-700">{user.role}</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="col-span-1 lg:col-span-3">
              <div className="bg-white shadow rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">Chat History</h2>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                      <p className="mt-4 text-gray-500">Loading your chat history...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
                      <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    </div>
                  ) : chatHistory.length === 0 ? (
                    <div className="text-center py-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No chat history found</h3>
                      <p className="mt-1 text-gray-500">Start a new chat to get the conversation going!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
                      {chatHistory.map((chat, index) => (
                        <div
                          key={index}
                          onClick={() => handleChatClick(chat)}
                          className="cursor-pointer transition-all duration-200 bg-white hover:bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-indigo-600">{chat.tag}</h3>
                            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                              {new Date(chat.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-2 line-clamp-2">{chat.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-gray-500">
                              {new Date(chat.createdAt).toLocaleTimeString()}
                            </p>
                            <button className="text-indigo-600 text-sm hover:text-indigo-800 font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Chat Detail View Component


export default Profile;