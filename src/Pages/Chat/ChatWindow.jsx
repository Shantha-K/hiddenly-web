// import React, { useState, useEffect } from "react";

// const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTcyMWI1NzNlYWQ1OWMxMDUxNWYyNSIsIm1vYmlsZSI6IjcyODM4NjM1MDMiLCJuYW1lIjoiU2hhbnRoYSBWZW51Z29wYWxhcGEiLCJpYXQiOjE3NTQ3MzUwNjQsImV4cCI6MTc1NzMyNzA2NH0.W9u_s2J6V68zbwxlkQ2VzWWcu5olQYubcC7mTOesTwg";

// const ChatWindow = ({ user, onBack }) => {
//   const [history, setHistory] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     fetchChatHistory();
//   }, [user]);

//   const fetchChatHistory = async () => {
//     try {
//       // const myHeaders = new Headers();
//       // myHeaders.append("Authorization", token);

//       const res = await fetch(
//         `http://35.154.10.237:5000/api/chat/:${user.mobile}`,
//         {
//           method: "GET",
//           // headers: myHeaders,
//           redirect: "follow",
//         }
//       );

//       const data = await res.json();
//       setHistory(data.messages || []);
//     } catch (err) {
//       console.error("Error loading chat:", err);
//     }
//   };

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       // const myHeaders = new Headers();
//       // myHeaders.append("Content-Type", "application/json");
//       // myHeaders.append("Authorization", token);

//       const raw = JSON.stringify({
//         receiverMobile: user.mobile,
//         messageType: "text",
//         content: newMessage,
//       });

//       await fetch("http://35.154.10.237:5000/api/message", {
//         method: "POST",
//         // headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//       });

//       setHistory([...history, { content: newMessage, sender: "me" }]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 bg-white border-b">
//         <button onClick={onBack} className="text-blue-500">⬅ Back</button>
//         <h2 className="font-semibold">{user.name}</h2>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//         {history.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`mb-2 p-2 rounded-lg max-w-xs ${
//               msg.sender === "me"
//                 ? "bg-blue-500 text-white self-end"
//                 : "bg-gray-200 text-black"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="p-3 bg-white border-t flex gap-2">
//         <input
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="flex-1 border rounded-full px-3 py-2"
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-4 rounded-full"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;












// import React, { useState } from 'react';

// const ChatInterface = () => {
//   const [activeTab, setActiveTab] = useState('Chat');
  
//   const contacts = [
//     {
//       id: 1,
//       name: "Anya Sharma",
//       message: "Hey, would you be interested in .....",
//       time: "24m ago",
//       unread: 2,
//       avatar: "AS"
//     },
//     {
//       id: 2,
//       name: "Hannah Chavez",
//       message: "How about PayPal? Let me if that .....",
//       time: "24m ago",
//       unread: 2,
//       avatar: "HC"
//     },
//     {
//       id: 3,
//       name: "Ann Bates",
//       message: "My final price would be 5k. Not mu....",
//       time: "24m ago",
//       unread: 1,
//       avatar: "AB"
//     },
//     {
//       id: 4,
//       name: "Martha Gram",
//       message: "Lets do this. Meet me at Starbucks ....",
//       time: "24m ago",
//       unread: 0,
//       avatar: "MG"
//     },
//     {
//       id: 5,
//       name: "Alexander Scott",
//       message: "Paid for the order, tracking number .....",
//       time: "24m ago",
//       unread: 0,
//       avatar: "AS"
//     },
//     {
//       id: 6,
//       name: "Betty Lynch",
//       message: "Was great dealing with you. Thanks....",
//       time: "24m ago",
//       unread: 0,
//       avatar: "BL"
//     },
//     {
//       id: 7,
//       name: "Betty Lynch",
//       message: "Was great dealing with you. Thanks....",
//       time: "24m ago",
//       unread: 0,
//       avatar: "BL"
//     },
//     {
//       id: 8,
//       name: "Betty Lynch",
//       message: "Was great dealing with you. Thanks....",
//       time: "24m ago",
//       unread: 0,
//       avatar: "BL"
//     }
//   ];

//   const tabs = ['Contacts', 'Chat', 'Status'];

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-96 bg-white border-r border-gray-200">
//         {/* Header */}
//         <div className="p-4 border-b border-gray-200">
//           <h1 className="text-xl font-semibold text-gray-800 mb-4">Messages</h1>
          
//           {/* Tabs */}
//           <div className="flex bg-gray-100 rounded-lg p-1">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                   activeTab === tab
//                     ? 'bg-blue-500 text-white shadow-sm'
//                     : 'text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Chat List */}
//         <div className="overflow-y-auto">
//           {contacts.map((contact) => (
//             <div
//               key={contact.id}
//               className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
//             >
//               {/* Avatar */}
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">
//                 {contact.avatar}
//               </div>
              
//               {/* Message Content */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between mb-1">
//                   <h3 className="text-sm font-medium text-gray-900 truncate">
//                     {contact.name}
//                   </h3>
//                   <span className="text-xs text-gray-500 ml-2">
//                     {contact.time}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-600 truncate">
//                   {contact.message}
//                 </p>
//               </div>
              
//               {/* Unread Badge */}
//               {contact.unread > 0 && (
//                 <div className="ml-2 bg-teal-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium flex-shrink-0">
//                   {contact.unread}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="absolute bottom-4 left-4 flex items-center text-sm text-gray-500">
//           <span>Made with</span>
//           <svg className="w-4 h-4 mx-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
//           </svg>
//           <span className="font-medium text-blue-600">isily</span>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
//         {/* Illustration */}
//         <div className="mb-8">
//           <div className="relative">
//             {/* Simple illustration using CSS */}
//             <div className="w-48 h-48 relative">
//               {/* Background circle */}
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full opacity-50"></div>
              
//               {/* Person 1 */}
//               <div className="absolute bottom-12 left-8 w-16 h-20">
//                 <div className="w-12 h-12 bg-blue-600 rounded-full mb-2"></div>
//                 <div className="w-16 h-8 bg-blue-500 rounded-t-lg"></div>
//               </div>
              
//               {/* Person 2 */}
//               <div className="absolute bottom-12 right-8 w-16 h-20">
//                 <div className="w-12 h-12 bg-orange-400 rounded-full mb-2"></div>
//                 <div className="w-16 h-8 bg-orange-500 rounded-t-lg"></div>
//               </div>
              
//               {/* Chat bubbles */}
//               <div className="absolute top-8 left-12 w-8 h-6 bg-white rounded-lg shadow-sm border"></div>
//               <div className="absolute top-16 right-12 w-6 h-4 bg-blue-500 rounded-lg"></div>
//             </div>
//           </div>
//         </div>

//         {/* Welcome Text */}
//         <div className="text-center max-w-md">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">
//             Welcome to InoChat!
//           </h2>
//           <p className="text-gray-600 mb-8 leading-relaxed">
//             Select a chat from the left sidebar to start messaging or create a new group to connect with friends and colleagues.
//           </p>
          
//           {/* CTA Button */}
//           <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md">
//             Start a New Chat
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;

