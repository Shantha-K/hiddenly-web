import React, { useState, useEffect } from "react";
import { Search, Settings } from "lucide-react";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("Contacts");
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const myMobileNumber = "7283863503";

  const avatarColors = {
    green: "#22c55e",
    pink: "#ec4899",
    yellow: "#eab308",
    purple: "#a855f7",
    gray: "#9ca3af",
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName === "Contacts") {
      fetchContacts();
    } else {
      setMessages([]);
      setSelectedUser(null);
    }
  };

  const fetchContacts = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        mobiles: [
          "7876556789",
          "9150541316",
          "8524930080",
          "9879797975",
          "7871941746",
        ],
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://35.154.10.237:5000/api/contacts/check-exist",
        requestOptions
      );

      const result = await response.json();

      let transformed = [];

      if (result?.users?.length) {
        transformed = transformed.concat(
          result.users.map((user) => ({
            name: user.name || "Unknown",
            text: user.lastMessage || "No messages yet",
            color: "green",
            mobile: user.mobile,
            unreadCount: user.unreadCount || 0,
          }))
        );
      }

      if (result?.notFoundMobiles?.length) {
        transformed = transformed.concat(
          result.notFoundMobiles.map((mobile) => ({
            name: mobile,
            text: "Not on the platform",
            color: "gray",
            mobile,
            unreadCount: 0,
          }))
        );
      }

      setMessages(transformed);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setMessages([]);
    }
  };

  const fetchChatHistory = async (mobile) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTcyMWI1NzNlYWQ1OWMxMDUxNWYyNSIsIm1vYmlsZSI6IjcyODM4NjM1MDMiLCJuYW1lIjoiU2hhbnRoYSBWZW51Z29wYWxhcGEiLCJpYXQiOjE3NTQ3MzUwNjQsImV4cCI6MTc1NzMyNzA2NH0.W9u_s2J6V68zbwxlkQ2VzWWcu5olQYubcC7mTOesTwg"
      );

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `http://35.154.10.237:5000/api/chat/${mobile}`,
        requestOptions
      );

      const result = await response.json();
      
      // Transform the API response to match our expected format
      if (result?.messages) {
        const transformedMessages = result.messages.map(msg => ({
          sender: msg.senderMobile,
          content: msg.content,
          createdAt: msg.createdAt
        }));
        setChatHistory(transformedMessages);
      } else {
        setChatHistory([]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatHistory([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTcyMWI1NzNlYWQ1OWMxMDUxNWYyNSIsIm1vYmlsZSI6IjcyODM4NjM1MDMiLCJuYW1lIjoiU2hhbnRoYSBWZW51Z29wYWxhcGEiLCJpYXQiOjE3NTQ3MzUwNjQsImV4cCI6MTc1NzMyNzA2NH0.W9u_s2J6V68zbwxlkQ2VzWWcu5olQYubcC7mTOesTwg"
      );

      const raw = JSON.stringify({
        receiverMobile: selectedUser.mobile,
        messageType: "text",
        content: newMessage.trim(),
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const url = "http://35.154.10.237:5000/api/chat/message";

      const res = await fetch(url, requestOptions);
      const result = await res.json();

      if (res.ok) {
        // Add the new message to chat history using the API response format
        setChatHistory(prev => [
          ...prev,
          {
            sender: myMobileNumber,
            content: newMessage.trim(),
            createdAt: new Date().toISOString()
          }
        ]);
        setNewMessage("");
        
        // Update the last message in contacts list
        setMessages(prev => 
          prev.map(msg => 
            msg.mobile === selectedUser.mobile 
              ? { ...msg, text: newMessage.trim() } 
              : msg
          )
        );
      } else {
        console.error("Failed to send message:", result);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleContactClick = (contact) => {
    setSelectedUser(contact);
    fetchChatHistory(contact.mobile);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
            IC
          </div>
          <span className="font-semibold text-xl">Inochat</span>
        </div>

        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search messages or contacts..."
            className="pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 w-full"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/3 bg-white border-r flex flex-col">
          {/* Tabs */}
          <p>Messages</p>
          <div className="flex gap-2 p-3 bg-gray-100 justify-center">
            {["Contacts", "Chat", "Status"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`py-2 px-6 rounded-full font-semibold text-sm transition-colors duration-200
                  ${
                    activeTab === tab && tab === "Contacts"
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-600 hover:bg-blue-100"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="overflow-y-auto flex-1">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  onClick={() => handleContactClick(msg)}
                  className="flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-blue-50"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{
                      backgroundColor: avatarColors[msg.color] || "#9ca3af",
                    }}
                  >
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold truncate">{msg.name}</p>
                      <span className="text-xs text-gray-400">24m ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate">
                        {msg.text}
                      </p>
                      {msg.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white rounded-full text-xs px-2 py-0.5">
                          {msg.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500 text-center">
                {activeTab === "Contacts"
                  ? "No contacts found"
                  : "Select a tab to load data"}
              </p>
            )}
          </div>

          {/* Settings button */}
          <div className="p-3 border-t bg-white">
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gradient-to-r from-sky-50 to-blue-100">
          {selectedUser ? (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  {selectedUser.name}
                </h2>
                {chatHistory.length > 0 ? (
                  chatHistory.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`max-w-xs mb-4 p-3 rounded-lg break-words
                        ${
                          chat.sender === myMobileNumber
                            ? "bg-blue-600 text-white ml-auto"
                            : "bg-gray-300 text-gray-800"
                        }`}
                    >
                      {chat.content}
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No messages yet</p>
                )}
              </div>

              {/* Message input */}
              <div className="p-4 bg-white border-t flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center text-gray-600 max-w-md px-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Welcome to Inochat Web
                </h2>
                <p>
                  Select a conversation from the left panel to view messages or
                  start a new chat.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;