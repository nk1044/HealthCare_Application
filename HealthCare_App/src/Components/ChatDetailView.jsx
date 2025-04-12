import React, {useState} from 'react';

function ChatDetailView({ chat }) {
  const [messages, setMessages] = useState(chat.chat || []);
  console.log(chat);


  return (
    <div className="bg-white shadow rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{chat.tag}</h2>
          <p className="text-sm text-gray-500">Created on {new Date(chat.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium transition duration-200">
            Export
          </button>
          <button className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-medium transition duration-200">
            Delete
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
          <p className="text-gray-700">{chat.description}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Conversation</h3>
          <div className="space-y-4 max-h-[50vh] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default ChatDetailView;
