import React, { useCallback, useEffect, useState, useRef } from 'react';
import { AddEntryToQueue, DeleteQueueEntry, getDataByUser } from '../Server/Server.js';
import { useNavigate } from 'react-router-dom';
import Loading from '../Pages/Loading.jsx';
import { useUser } from '../Store/zustand.js';
import { io } from "socket.io-client";

function AddToQueue() {
  const [tags, setTags] = useState(["ENT", "General", "Dentist"]);
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const navigate = useNavigate();
  const user = useUser(useCallback(state => state.user, []));
  const [Queue_Id, setQueue_Id] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [Chat, setChat] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  
  // Use a ref for the socket to persist it between renders
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize socket connection once
  useEffect(() => {
    // Create the socket instance only once
    if (!socketRef.current) {
      socketRef.current = io(String(import.meta.env.VITE_BACKEND_URI), {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false, // We'll connect manually when needed
      });
    }

    // Socket connection event handlers
    const onConnect = () => {
      console.log('Socket connected');
      setSocketConnected(true);
    };

    const onDisconnect = () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    };

    const onConnectionError = (error) => {
      console.error('Socket connection error:', error);
      setSocketConnected(false);
    };

    // Set up event listeners
    socketRef.current.on('connect', onConnect);
    socketRef.current.on('disconnect', onDisconnect);
    socketRef.current.on('connect_error', onConnectionError);

    // Connect the socket
    socketRef.current.connect();

    // Cleanup function
    return () => {
      socketRef.current.off('connect', onConnect);
      socketRef.current.off('disconnect', onDisconnect);
      socketRef.current.off('connect_error', onConnectionError);
      
      // Don't disconnect here - we'll handle that separately
    };
  }, []);

  // Handle chat room joining when Queue_Id changes
  useEffect(() => {
    if (!Queue_Id || !socketRef.current || !socketConnected) return;

    console.log(`Joining chat room: ${Queue_Id}`);
    
    // Leave any previous room first (good practice)
    socketRef.current.emit("leaveChatRoom", Queue_Id);
    
    // Join the new room
    socketRef.current.emit("joinChatRoom", Queue_Id);
    
    // Request chat history when joining a room
    socketRef.current.emit("getChatHistory", Queue_Id);

    // Clean up when component unmounts or Queue_Id changes
    return () => {
      if (socketRef.current && socketConnected) {
        socketRef.current.emit("leaveChatRoom", Queue_Id);
      }
    };
  }, [Queue_Id, socketConnected]);

  // Handle chat message events
  useEffect(() => {
    if (!socketRef.current) return;

    // Handle receiving a new message
    const onReceiveMessage = (message) => {
      console.log("Received message:", message);
      setChat(prevChat => [...prevChat, message]);
    };

    // Handle receiving chat history
    const onChatHistory = (history) => {
      console.log("Received chat history:", history);
      setChat(history || []);
    };

    // Set up event listeners
    socketRef.current.on("receive-chat-message", onReceiveMessage);
    socketRef.current.on("chat-history", onChatHistory);

    // Cleanup function
    return () => {
      socketRef.current.off("receive-chat-message", onReceiveMessage);
      socketRef.current.off("chat-history", onChatHistory);
    };
  }, []);

  // Auto-scroll to the latest message whenever Chat changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [Chat]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user._id) return;
      
      try {
        setLoading(true);
        const userData = await getDataByUser(user._id);
        if (userData && userData.userEntry) {
          setQueueData(userData.userEntry);
          setQueue_Id(userData.queueId);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (userMessage.trim() === "" || !socketRef.current || !socketConnected) return;
    
    const newMessage = {
      UserId: "Patient",
      Message: userMessage.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Update local state immediately for UI responsiveness
    setChat(prevChat => [...prevChat, newMessage]);
    setUserMessage("");

    // Send message to server
    socketRef.current.emit("send-message", {
      roomId: Queue_Id,
      userId: "Patient",
      message: userMessage.trim(),
      timestamp: newMessage.timestamp
    });
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tag === "" || description === "") {
      alert("Please fill all the fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await AddEntryToQueue({
        tag: tag,
        description: description
      });
      
      if (res) {
        console.log("User added to queue successfully");
        // Fetch and display queue data
        const userData = await getDataByUser(user._id);
        if (userData && userData.userEntry) {
          setQueueData(userData.userEntry);
          setQueue_Id(userData.queueId);
        }
      } else {
        alert("Error adding user to queue");
      }
    } catch (error) {
      console.error("Error in submission:", error);
      alert("Error adding user to queue");
    }
    setLoading(false);
  };

  // Handle queue entry deletion
  const handleDelete = async () => {
    setLoading(true);
    try {
      // Leave chat room before deleting queue entry
      if (socketRef.current && socketConnected) {
        socketRef.current.emit("leaveChatRoom", Queue_Id);
      }
      
      await DeleteQueueEntry({ userId: user._id, Queue_Id });
      setQueueData(null);
      setChat([]);
    } catch (error) {
      console.error("Error deleting queue entry:", error);
    }
    setLoading(false);
  };

  // Get tag color for visual indication
  const getTagColor = (tagName) => {
    switch (tagName) {
      case 'General': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ENT': return 'bg-green-100 text-green-800 border-green-200';
      case 'Dentist': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format timestamp for chat messages
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch (error) {
      return '';
    }
  };

  const renderQueueDetails = () => {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your Queue Details</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(queueData.tag)}`}>
              {queueData.tag}
            </span>
          </div>
          <p className="text-blue-100 mt-2">You're currently in the queue. A healthcare professional will connect with you shortly.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
              <p className="font-medium text-gray-800">{queueData.description}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-500 mb-1">Room ID</p>
              <div className="flex items-center">
                <p className="font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded">{queueData.roomID}</p>
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => { navigator.clipboard.writeText(queueData.roomID) }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Improved Chat Component */}
          <div className="bg-white border rounded-lg shadow-md overflow-hidden">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${socketConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <h3 className="font-medium">Chat with Doctor</h3>
              </div>
              <span className="text-xs bg-blue-700 px-2 py-1 rounded">
                {socketConnected ? 'Connected' : 'Reconnecting...'}
              </span>
            </div>
            
            {/* Chat Messages Container */}
            <div 
              ref={chatContainerRef}
              className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50"
              style={{scrollBehavior: "smooth"}}
            >
              {Chat.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-sm italic">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                Chat.map((chat, index) => (
                  <div key={index} className={`flex w-full ${chat.UserId === "Doctor" ? "justify-start" : "justify-end"}`}>
                    <div className={`relative max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${
                      chat.UserId === "Doctor" 
                        ? "bg-white border border-gray-200 text-gray-800" 
                        : "bg-blue-600 text-white"
                    }`}>
                      <p className="text-sm mb-2">{chat.Message}</p>
                      <span className={`absolute bottom-1 ${
                        chat.UserId === "Doctor" ? "right-1" : "left-1"
                      } text-xs opacity-70`}>
                        {formatTime(chat.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Message Input */}
            <div className="p-3 border-t bg-white">
              <div className="flex items-center space-x-2">
                <input
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={socketConnected ? "Type your message..." : "Reconnecting..."}
                  disabled={!socketConnected}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || !socketConnected}
                  className={`px-4 py-2 rounded-lg text-white ${
                    userMessage.trim() && socketConnected
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-blue-400 cursor-not-allowed"
                  } transition-colors shadow-sm`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => navigate(`/video-call?roomID=${queueData.roomID}`)}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Join Video Call
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center px-6 py-3 border border-red-300 text-red-700 bg-white rounded-lg text-lg font-medium shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Leave
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
          <p className="text-blue-100 mt-2">Fill in the details below to join the consultation queue. A healthcare professional will attend to you soon.</p>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="tag">
              Department
            </label>
            <div className="relative border rounded-lg">
              <select
                id="tag"
                name="tag"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-3 pr-10 py-2 text-base focus:outline-none"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="" disabled>Select a department</option>
                {tags.map((tagOption) => (
                  <option key={tagOption} value={tagOption}>
                    {tagOption}
                  </option>
                ))}
              </select>
            
            </div>
            {tag && (
              <p className="mt-2 text-sm text-gray-500">
                You've selected the {tag} department.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
              Reason for Visit
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              name="description"
              rows="4"
              placeholder="Please briefly describe your symptoms or reason for consultation..."
              className="block w-full border rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none p-3"
            ></textarea>
            <p className="mt-2 text-sm text-gray-500">
              Provide a brief description of your symptoms or concerns. This helps the healthcare provider prepare for your consultation.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Privacy Notice</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Your information is secure and will only be shared with healthcare professionals attending to your case.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Join Queue'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">Virtual Consultation</h1>
        <p className="mt-2 text-lg text-gray-600 text-center">Connect with healthcare professionals from the comfort of your home</p>
      </div>

      {loading ? (
        <div className="w-full">
          <Loading />
        </div>
      ) : (
        <div className="transition-all duration-300 ease-in-out">
          {queueData ? renderQueueDetails() : renderForm()}
        </div>
      )}
    </div>
  );
}

export default AddToQueue;