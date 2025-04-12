import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useUser } from "../Store/zustand";

const socket = io(String(import.meta.env.VITE_BACKEND_URI));

// Format time from timestamp
const formatTime = (timestamp) => {
    if (!timestamp) return "";

    try {
        const date = new Date(timestamp);
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } catch (error) {
        console.error("Error formatting time:", error);
        return "";
    }
};

function ChatBox({ roomId, setShowChatBox, patientData }) {
    const [chat, setChat] = useState([]);
    const userMessage = useRef(null);
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const role = patientData ? "Doctor" : "Patient";
    
    const user = useUser(useCallback(state => state.user, []));

    
    // Join chat room when roomId changes
    useEffect(() => {
        setSocketConnected(false);
        socket.emit("leave-chat-room", roomId);
        socket.emit("user-joined",{ userId:user._id,role})
        socket.emit("join-chat-room", roomId);
        setSocketConnected(true);

        return () => {
            socket.emit("leave-chat-room", roomId);
        };
    }, [roomId]);

    useEffect(() => {
        const handleChatHistory = (message) => {
            // console.log("chat-history", message?.chatMessages);
            setChat(message?.chatMessages || []);
        };

        socket.on("chat-history", handleChatHistory);

        return () => {
            socket.off("chat-history", handleChatHistory);
        };
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chat]);

    // Send message
    const handleSendMessage = () => {
        if (!userMessage.current || !userMessage.current.value.trim() || !socketConnected) {
            console.log("Message is empty or socket is not connected");
            return;
        }

        const message = userMessage.current.value.trim();
        console.log("Message to send:", message);

        // Emit message to socket
        socket.emit("send-chat-message", {
            newChat: {
                sender: role,
                message,
                timestamp: Date.now(),
            },
            roomId,
        });

        // Update chat locally
        setChat((prevChat) => [
            ...prevChat,
            { sender: role, message, timestamp: Date.now() },
        ]);

        // Clear input field
        userMessage.current.value = "";
    };

    // Handle enter key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClose = () => {
        socket.emit("leave-chat-room", roomId);
        setShowChatBox(false);
    };

    return (
        <div className="bg-white border rounded-lg shadow-md overflow-hidden pb-2">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
                <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${socketConnected ? "bg-green-400" : "bg-red-400"}`} />
                    <h3 className="font-medium">Chat with {patientData ? "Patient" : "Doctor"}</h3>
                </div>
                <span className="text-xs bg-blue-700 px-2 py-1 rounded">
                    {socketConnected ? "Connected" : "Reconnecting..."}
                </span>
                {patientData && (
                    <button
                        onClick={handleClose}
                        className="ml-2 p-1 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Close chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {chat.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm italic">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    chat.map((message, index) => (
                        <div key={index} className={`flex w-full ${message.sender !== role ? "justify-start" : "justify-end"}`}>
                            <div
                                className={`relative max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${
                                    message.sender !== role ? "bg-white border border-gray-200 text-gray-800" : "bg-blue-600 text-white"
                                }`}
                            >
                                <p className="text-sm mb-2">{message.message}</p>
                                <span className={`absolute bottom-0 ${message.sender === role ? "right-1" : "left-1"} text-xs opacity-70`}>
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
                        ref={userMessage}
                        onKeyDown={handleKeyDown}
                        placeholder={socketConnected ? "Type your message..." : "Reconnecting..."}
                        disabled={!socketConnected}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!socketConnected}
                        className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Video Call Button */}
            {patientData && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button
                        onClick={() => navigate(`/video-call?roomID=${patientData?.roomID}`)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                        Join Video Call
                    </button>
                </div>
            )}
        </div>
    );
}

export default ChatBox;
