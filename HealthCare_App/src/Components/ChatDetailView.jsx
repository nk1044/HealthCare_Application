import React, { useState, useRef, useEffect } from 'react';

function ChatDetailView({ chat }) {
  const [messages, setMessages] = useState(chat.chat || []);
  const chatContainerRef = useRef(null);
  console.log(chat);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

    return <span className="text-sm">{message.message}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {chat.tag}
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
              {chat.doctorId?.name || "Doctor"}
            </span>
          </h2>
          <p className="text-sm text-gray-500">Created on {formatDate(chat.createdAt)}</p>
        </div>
        
        {/* <div className="flex gap-2">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium transition duration-200">
            Export
          </button>
          <button className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-medium transition duration-200">
            Delete
          </button>
        </div> */}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Description section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700">
            {chat.description || "No description provided."}
          </div>
        </div>

        {/* Conversation section */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            Conversation
            <span className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
              {messages.length} messages
            </span>
          </h3>
          
          {/* Chat container */}
          <div 
            ref={chatContainerRef}
            className="space-y-4 max-h-[70vh] overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50"
          >
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No messages in this conversation yet.
              </div>
            ) : (
              messages.map((message, index) => {
                const isPatient = message.sender === 'Patient';
                const prevSender = index > 0 ? messages[index - 1].sender : null;
                const isFirstInGroup = prevSender !== message.sender;
                const showSenderName = isFirstInGroup;
                
                return (
                  <div
                    key={index}
                    className={`flex ${isPatient ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-4' : 'mt-1'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 
                        ${isPatient 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                        }
                        ${index === 0 ? 'mt-2' : ''}`
                      }
                    >
                      {showSenderName && (
                        <p className={`text-xs font-medium mb-1 ${isPatient ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {message.sender}
                        </p>
                      )}
                      <div className="break-words">
                        {renderMessage(message)}
                      </div>
                      <p className={`text-xs mt-1 text-right ${isPatient ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatDetailView;