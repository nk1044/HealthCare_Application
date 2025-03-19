import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import { DeleteQueueEntry } from '../Server/Server';

const socket = io(String(import.meta.env.VITE_BACKEND_URI));

const tags = ['All', 'General', 'ENT', 'Dentist'];

const formatTime = (timestamp) => {
    if (!timestamp) return '';

    try {
        const date = new Date(timestamp);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch (error) {
        return '';
    }
};
function ChatBox({ roomId, setShowChatBox, patientData }) {
    const [chat, setChat] = useState([]);
    const [userMessage, setUserMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const chatContainerRef = useRef(null);
    const role=patientData?"Doctor":"Patient";  

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

    // Handle chat room joining when roomId changes
    useEffect(() => {
        if (!roomId || !socketRef.current || !socketConnected) return;

        console.log(`Joining chat room: ${roomId}`);

        // Leave any previous room first (good practice)
        socketRef.current.emit("leaveChatRoom", roomId);

        // Join the new room
        socketRef.current.emit("joinChatRoom", roomId);

        // Request chat history when joining a room
        socketRef.current.emit("getChatHistory", roomId);

        // Clean up when component unmounts or roomId changes
        return () => {
            if (socketRef.current && socketConnected) {
                socketRef.current.emit("leaveChatRoom", roomId);
            }
        };
    }, [roomId, socketConnected]);

    // Handle chat message events
    useEffect(() => {
        if (!socketRef.current) return;

        // Handle receiving a new message
        const onReceiveMessage = (data) => {

            const messageObject = {
                UserId: data.userId || data.UserId,
                Message: data.message || data.Message,
                timestamp: data.timestamp
            };

            setChat(prevChat => [...prevChat, messageObject]);
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

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat]);

    const handleSendMessage = () => {
        if (userMessage.trim() === "" || !socketRef.current || !socketConnected) return;

        const newMessage = {
            UserId: patientData ? "Doctor" : "Patient",
            Message: userMessage.trim(),
            timestamp: new Date().toISOString()
        };

        // Update local state immediately for UI responsiveness
        setChat(prevChat => [...prevChat, newMessage]);
        setUserMessage("");
        console.log(chat);
        

        // Send message to server
        socketRef.current.emit("send-message", {
            roomId: roomId,
            userId: patientData ? "Doctor" : "Patient",
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

    // Format timestamp for display
    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <div className="bg-white border rounded-lg shadow-md overflow-hidden pb-2">
                {/* Chat Header */}
                <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-2 ${socketConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <h3 className="font-medium">Chat with {patientData ? "Patient" : "Doctor"} </h3>
                    </div>
                    <span className="text-xs bg-blue-700 px-2 py-1 rounded">
                        {socketConnected ? 'Connected' : 'Reconnecting...'}
                    </span>
                    {patientData && <button
                        onClick={() => setShowChatBox(false)}
                        className="ml-2 p-1 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Close chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>}
                </div>

                {/* Chat Messages Container */}
                <div
                    ref={chatContainerRef}
                    className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50"
                    style={{ scrollBehavior: "smooth" }}
                >
                    {chat.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 text-sm italic">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        chat.map((message, index) => (
                            <div key={index} className={`flex w-full ${message.UserId != role ? "justify-start" : "justify-end"}`}>
                                <div className={`relative max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${message.UserId != role
                                    ? "bg-white border border-gray-200 text-gray-800"
                                    : "bg-blue-600 text-white"
                                    }`}>
                                    <p className="text-sm mb-2">{message.Message}</p>
                                    <span className={`absolute bottom-1 ${message.UserId === "Doctor" ? "right-1" : "left-1"
                                        } text-xs opacity-70`}>
                                        {formatTime(message.timestamp)}
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
                            className={`px-4 py-2 rounded-lg text-white ${userMessage.trim() && socketConnected
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-blue-400 cursor-not-allowed"
                                } transition-colors shadow-sm`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                style={{ transform: "rotate(90deg)" }}
                            >
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </div>
                {patientData && <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button
                        onClick={() => navigate(`/video-call?roomID=${patient?.roomID}`)}
                        className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Join Video Call
                    </button>
                </div>}
            </div>
        </>
    );
}

export default ChatBox;