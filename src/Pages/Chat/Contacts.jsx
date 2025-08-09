import React, { useState } from "react";
import { Search, Settings } from "lucide-react";

const ChatPage = () => {
  const [messages] = useState([
    { name: "Keith Mills", text: "Hey, would you be interested in a quick chat?", color: "green" },
    { name: "Hannah Chavez", text: "How about PayPal? Let me know if that work.", color: "pink" },
    { name: "Ann Bates", text: "My final price would be 5k. Not much room!", color: "yellow" },
    { name: "Martha Gram", text: "Less do this. Meet me at Starbucks next Tuesday.", color: "pink" },
    { name: "Alexander Scott", text: "Paid for the order, tracking number will be 1.", color: "green" },
    { name: "Betty Lynch", text: "Was great dealing with you. Thanks for the help.", color: "pink" },
    { name: "Debra Martin", text: "", color: "purple" }
  ]);

  // Custom vivid avatar colors
  const avatarColors = {
    green: "#22c55e",  // Tailwind green-500
    pink: "#ec4899",   // Tailwind pink-500
    yellow: "#eab308", // Tailwind yellow-500
    purple: "#a855f7", // Tailwind purple-500
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            IC
          </div>
          <span className="font-semibold text-lg">Messages</span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search messages or contacts..."
            className="pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/3 bg-white border-r flex flex-col">
          {/* Tabs */}
          <div className="flex border-b bg-gray-50">
            <button className="flex-1 py-3 text-center border-b-2 border-transparent hover:border-blue-400">
              Contacts
            </button>
            <button className="flex-1 py-3 text-center border-b-2 border-blue-400 font-semibold">
              Chat
            </button>
            <button className="flex-1 py-3 text-center border-b-2 border-transparent hover:border-blue-400">
              Status
            </button>
          </div>

          {/* Messages list */}
          <div className="overflow-y-auto flex-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: avatarColors[msg.color] || "#9ca3af" }}
                >
                  {msg.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{msg.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {msg.text || <span className="text-gray-300">No messages yet</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Settings button at bottom of sidebar */}
          <div className="p-3 border-t bg-white">
            <button className="flex items-center gap-2 w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-sky-50 to-blue-100">
          <div className="text-center text-gray-500 p-6 max-w-md">
            <h2 className="text-xl font-semibold mb-2">
              Welcome Back to your chat!
            </h2>
            <p className="text-gray-600">
              Select a conversation from the left panel to view messages or start a new chat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
