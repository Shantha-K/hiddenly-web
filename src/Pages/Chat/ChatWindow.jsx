import React, { useState, useEffect } from "react";

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTcyMWI1NzNlYWQ1OWMxMDUxNWYyNSIsIm1vYmlsZSI6IjcyODM4NjM1MDMiLCJuYW1lIjoiU2hhbnRoYSBWZW51Z29wYWxhcGEiLCJpYXQiOjE3NTQ3MzUwNjQsImV4cCI6MTc1NzMyNzA2NH0.W9u_s2J6V68zbwxlkQ2VzWWcu5olQYubcC7mTOesTwg";

const ChatWindow = ({ user, onBack }) => {
  const [history, setHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchChatHistory();
  }, [user]);

  const fetchChatHistory = async () => {
    try {
      // const myHeaders = new Headers();
      // myHeaders.append("Authorization", token);

      const res = await fetch(
        `http://35.154.10.237:5000/api/chat/:${user.mobile}`,
        {
          method: "GET",
          // headers: myHeaders,
          redirect: "follow",
        }
      );

      const data = await res.json();
      setHistory(data.messages || []);
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      // const myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");
      // myHeaders.append("Authorization", token);

      const raw = JSON.stringify({
        receiverMobile: user.mobile,
        messageType: "text",
        content: newMessage,
      });

      await fetch("http://35.154.10.237:5000/api/message", {
        method: "POST",
        // headers: myHeaders,
        body: raw,
        redirect: "follow",
      });

      setHistory([...history, { content: newMessage, sender: "me" }]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button onClick={onBack} className="text-blue-500">⬅ Back</button>
        <h2 className="font-semibold">{user.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-lg max-w-xs ${
              msg.sender === "me"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded-full px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
