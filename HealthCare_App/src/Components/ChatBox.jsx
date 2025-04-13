import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useUser } from "../Store/zustand";
import { uploadMediaToCloudinary } from "../Server/Cloudinary";
import { SendHorizontal, Image, Mic, X, Loader } from 'lucide-react';

const socket = io(String(import.meta.env.VITE_BACKEND_URI));

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
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isAudioUploading, setIsAudioUploading] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const role = patientData ? "Doctor" : "Patient";

    const user = useUser(useCallback(state => state.user, []));

    useEffect(() => {
        setSocketConnected(false);
        socket.emit("leave-chat-room", roomId);
        socket.emit("user-joined", { userId: user._id, role })
        socket.emit("join-chat-room", roomId);
        setSocketConnected(true);

        return () => {
            socket.emit("leave-chat-room", roomId);
        };
    }, [roomId]);

    useEffect(() => {
        const handleChatHistory = (message) => {
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

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const imageUrl = await uploadMediaToCloudinary(file);

            socket.emit("send-chat-message", {
                newChat: {
                    sender: role,
                    message: imageUrl,
                    timestamp: Date.now(),
                },
                roomId,
            });

            setChat((prevChat) => [
                ...prevChat,
                { sender: role, message: imageUrl, timestamp: Date.now() },
            ]);
        } catch (error) {
            console.error('Failed to upload image:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleVoiceRecording = async () => {
        if (isRecording) {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
            setIsRecording(false);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            setIsRecording(true);

            const chunks = [];

            recorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            recorder.onstop = async () => {
                // Stop all audio tracks to turn off the microphone
                stream.getTracks().forEach(track => track.stop());

                const audioBlob = new Blob(chunks, { type: "audio/webm" });
                setIsAudioUploading(true);

                try {
                    const audioUrl = await uploadMediaToCloudinary(audioBlob, "voice"); // optional 'folder'
                    socket.emit("send-chat-message", {
                        newChat: {
                            sender: role,
                            message: audioUrl,
                            timestamp: Date.now(),
                        },
                        roomId,
                    });

                    setChat((prevChat) => [
                        ...prevChat,
                        { sender: role, message: audioUrl, timestamp: Date.now() },
                    ]);
                } catch (error) {
                    console.error("Voice upload failed:", error);
                } finally {
                    setIsAudioUploading(false);
                    setMediaRecorder(null);
                }
            };

            recorder.start();
        } catch (error) {
            console.error("Mic access denied or error occurred:", error);
            alert("Could not start recording. Please allow microphone access.");
            setIsRecording(false);
        }
    };


    const handleSendMessage = () => {
        if (!userMessage.current || !userMessage.current.value.trim() || !socketConnected) {
            return;
        }

        const message = userMessage.current.value.trim();

        socket.emit("send-chat-message", {
            newChat: {
                sender: role,
                message,
                timestamp: Date.now(),
            },
            roomId,
        });

        setChat((prevChat) => [
            ...prevChat,
            { sender: role, message, timestamp: Date.now() },
        ]);

        userMessage.current.value = "";
    };

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

    const renderMessage = (message) => {
        if (message.message.match(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)$/i)) {
            return (
                <img
                    src={message.message}
                    alt="Shared"
                    className="max-w-full max-h-48 rounded-md"
                    onLoad={() => {
                        if (chatContainerRef.current) {
                            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                    }}
                />
            );
        }

        if (message.message.match(/^https?:\/\/.*\.(webm|mp3|wav|ogg)$/i)) {
            return (
                <audio controls className="max-w-full rounded-md">
                    <source src={message.message} />
                    Your browser does not support the audio element.
                </audio>
            );
        }

        return <p className="text-sm mb-2">{message.message}</p>;
    };


    return (
        <div className="bg-white border rounded-lg shadow-md overflow-hidden pb-2 mx-2 lg:mx-0">
            <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full ${socketConnected ? "bg-green-400" : "bg-red-400"}`} />
                    <h3 className="font-medium text-sm sm:text-base">
                        Chat with {patientData ? `${patientData?.user?.name}` : "Doctor"}
                    </h3>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-700 px-2 py-1 rounded">
                        {socketConnected ? "Connected" : "Reconnecting..."}
                    </span>

                    {patientData && (
                        <button
                            onClick={handleClose}
                            className="p-1 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
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
            </div>


            <div ref={chatContainerRef} className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {chat.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm italic">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    chat.map((message, index) => (
                        <div
                            key={index}
                            className={`flex w-full ${message.sender !== role ? "justify-start" : "justify-end"} mb-3`}
                        >
                            <div
                                className={`relative max-w-[75%] px-2 py-1 rounded-lg shadow-sm 
                                    ${message.sender !== role
                                        ? "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                                        : "bg-blue-600 text-white rounded-tr-none"
                                    }`}
                            >
                                <div className="mb-0">
                                    {renderMessage(message)}
                                </div>
                                <div
                                    className={`text-xs pt-1 ${message.sender === role ? "text-blue-200 text-right" : "text-gray-500 text-left"}`}
                                >
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 border-t bg-white">
                <div className="flex flex-col space-y-2 w-full">
                    {/* Input field - full width */}
                    <div className="flex w-full">
                        <input
                            ref={userMessage}
                            onKeyDown={handleKeyDown}
                            placeholder={socketConnected ? "Type your message..." : "Reconnecting..."}
                            disabled={!socketConnected || isUploading || isAudioUploading}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        />
                    </div>

                    {/* Action buttons row */}
                    <div className="flex justify-between w-full">
                        {/* Left side buttons */}
                        <div className="flex space-x-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                className="hidden"
                            />

                            <button
                                onClick={() => fileInputRef.current.click()}
                                disabled={isUploading || isAudioUploading || !socketConnected}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                aria-label="Upload image"
                            >
                                {isUploading ? (
                                    <Loader className="h-5 w-5 text-gray-600 animate-spin" />
                                ) : (
                                    <Image className="h-5 w-5 text-gray-600" />
                                )}
                            </button>

                            <button
                                onClick={handleVoiceRecording}
                                disabled={isUploading || isAudioUploading || !socketConnected}
                                className={`p-2 rounded-lg ${isRecording ? "bg-red-500 text-white" : "bg-gray-100 hover:bg-gray-200"} transition-colors`}
                                aria-label={isRecording ? "Stop recording" : "Start voice recording"}
                            >
                                {isRecording ? (
                                    <X className="h-5 w-5" />
                                ) : isAudioUploading ? (
                                    <Loader className="h-5 w-5 text-gray-600 animate-spin" />
                                ) : (
                                    <Mic className="h-5 w-5 text-gray-600" />
                                )}
                            </button>
                        </div>

                        {/* Right side - Send button */}
                        <button
                            onClick={handleSendMessage}
                            disabled={!socketConnected || isUploading || isAudioUploading}
                            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Send message"
                        >
                            <SendHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {patientData && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:-mt-4">
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