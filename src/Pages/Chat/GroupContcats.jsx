import React, { useState } from 'react';
import { MessageCircle, Plus, Users, Clock } from 'lucide-react';

const ChatInterface = () => {
  const [activeTab, setActiveTab] = useState('Chat');
  
  const conversations = [
    {
      id: 1,
      name: "Anya Sharma",
      message: "Hey, would you be interested in .....",
      time: "24m ago",
      unread: 2,
      avatar: "AS"
    },
    {
      id: 2,
      name: "Hannah Chavez",
      message: "How about PayPal? Let me if that .....",
      time: "24m ago",
      unread: 2,
      avatar: "HC"
    },
    {
      id: 3,
      name: "Ann Bates",
      message: "My final price would be 5k. Not mu....",
      time: "24m ago",
      unread: 1,
      avatar: "AB"
    },
    {
      id: 4,
      name: "Martha Gram",
      message: "Lets do this. Meet me at Starbucks ....",
      time: "24m ago",
      unread: 0,
      avatar: "MG"
    },
    {
      id: 5,
      name: "Alexander Scott",
      message: "Paid for the order, tracking number .....",
      time: "24m ago",
      unread: 0,
      avatar: "AS"
    },
    {
      id: 6,
      name: "Betty Lynch",
      message: "Was great dealing with you. Thanks....",
      time: "24m ago",
      unread: 0,
      avatar: "BL"
    },
    {
      id: 7,
      name: "Betty Lynch",
      message: "Was great dealing with you. Thanks....",
      time: "24m ago",
      unread: 0,
      avatar: "BL"
    },
    {
      id: 8,
      name: "Betty Lynch",
      message: "Was great dealing with you. Thanks....",
      time: "24m ago",
      unread: 0,
      avatar: "BL"
    }
  ];

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
            <button className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {['Contacts', 'Chat', 'Status'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3 ${getAvatarColor(conversation.name)}`}>
                {conversation.avatar}
              </div>
              
              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-gray-500 ml-2">
                    {conversation.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conversation.message}
                </p>
              </div>
              
              {/* Unread Badge */}
              {conversation.unread > 0 && (
                <div className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {conversation.unread}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Illustration */}
          <div className="mb-8 relative">
            <div className="w-48 h-48 mx-auto mb-6 relative">
              {/* Chat bubble illustration */}
              <div className="absolute top-8 left-8 w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center transform rotate-12">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute top-16 right-8 w-24 h-24 bg-orange-400 rounded-full flex items-center justify-center transform -rotate-12">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to InoChat!
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Select a chat from the left sidebar to start messaging or create a new group to connect with friends and colleagues.
          </p>

          {/* Start Chat Button */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm">
            Start a New Chat
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-1">Made with</span>
          <div className="text-blue-500 font-semibold">
            ✓isily
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;