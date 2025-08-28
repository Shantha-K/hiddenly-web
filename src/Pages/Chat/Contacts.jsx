// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Search, Settings, PlusCircle, Plus } from "lucide-react";
// import io from "socket.io-client";

// const SOCKET_SERVER = "http://35.154.10.237:5000";

// const ChatPage = () => {
//   const navigate = useNavigate();

//   const [messages, setMessages] = useState([]);
//   const [activeTab, setActiveTab] = useState("Contacts");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [chatId, setChatId] = useState(null);
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
//   const [showNewGroupModal, setShowNewGroupModal] = useState(false);
//   const [groupName, setGroupName] = useState("");
//   const [selectedContacts, setSelectedContacts] = useState([]);
//   const [isCreatingGroup, setIsCreatingGroup] = useState(false);
//   const [autoDelete, setAutoDelete] = useState(false);
//   const [autoDeleteAt, setAutoDeleteAt] = useState("2025-08-31T12:00:00.000Z");
//   const [contentTypes, setContentTypes] = useState([
//     "text",
//     "documents",
//     "media",
//     "attachments",
//   ]);
//   const [allContacts, setAllContacts] = useState([]);
//   const [chatType, setChatType] = useState("individual"); // 'individual' or 'group'

//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const settingsDropdownRef = useRef(null);

//   const userData = {
//     user_name: localStorage.getItem("user_name") || "User",
//     user_phone: localStorage.getItem("mobile") || "0000000000",
//   };

//   const avatarColors = {
//     green: "#22c55e",
//     pink: "#ec4899",
//     yellow: "#eab308",
//     purple: "#a855f7",
//     gray: "#9ca3af",
//     blue: "#3b82f6",
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     socketRef.current = io(SOCKET_SERVER, {
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       query: {
//         callerId: userData.user_phone,
//       },
//     });

//     socketRef.current.on("connect", () => {
//       console.log("Socket connected:", socketRef.current.id);
//       setSocketConnected(true);
//       socketRef.current.emit("joinRoom", chatId);
//     });

//     socketRef.current.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//       setSocketConnected(false);
//     });

//     socketRef.current.on("disconnect", () => {
//       console.log("Socket disconnected");
//       setSocketConnected(false);
//     });

//     // Listen for individual messages
//     socketRef.current.on("chatMessage", (msg) => {
//       if (msg.chatId === chatId && msg.senderMobile !== userData.user_phone) {
//         setChatHistory((prev) => [...prev, msg]);
//       }
//     });

//     // Listen for group messages
//     socketRef.current.on("groupMessage", (msg) => {
//       if (msg.groupId === selectedUser?.id) {
//         setChatHistory((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, [userData.user_phone, chatId, selectedUser]);

//   const fetchContacts = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("http://35.154.10.237:5000/api/getAllUser", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();
//       console.log("API Response:", result);

//       let contacts = [];
//       if (result?.users?.length) {
//         contacts = result.users
//           .filter((user) => user.mobile !== userData.user_phone) // Filter out current user
//           .map((user) => ({
//             name: user.name || user.mobile,
//             text: "Available on the platform",
//             color: "green",
//             mobile: user.mobile,
//             unreadCount: 0,
//             chatId: null,
//             type: "individual",
//           }));
//       }

//       setMessages(contacts);
//       setAllContacts(contacts); // Store contacts for group creation modal
//     } catch (error) {
//       console.error("Error fetching contacts:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchChatList = async () => {
//     setIsLoading(true);
//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//         mobile: userData.user_phone || "",
//       });

//       const response = await fetch("http://35.154.10.237:5000/api/chats", {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//       });

//       const result = await response.json();
//       console.log("Chats API Response:", result);

//       let allChats = [];

//       // ✅ Handle user chats
//       if (result?.chats?.length) {
//         const userChats = result.chats.map((chat) => ({
//           id: chat.chatId || chat._id, // unique id
//           name: chat.name || chat.contactMobile || "Unknown",
//           text:
//             typeof chat.lastMessage === "object"
//               ? chat.lastMessage.content
//               : chat.lastMessage || "No messages yet",
//           color: "green",
//           type: "individual", // mark as personal chat
//           mobile: chat.mobile || "N/A",
//           // unreadCount: chat.unreadCount || 0,
//         }));
//         allChats = [...allChats, ...userChats];
//       }

//       // ✅ Handle group chats
//       if (result?.groups?.length) {
//         const groupChats = result.groups.map((group) => ({
//           id: group._id,
//           name: group.title || "Unnamed Group",
//           text: group.lastMessage?.content || "Group chat",
//           color: "blue",
//           type: "group", // mark as group chat
//           participants: group.participants || [],
//           unreadCount: 0, // placeholder (update if API provides)
//         }));
//         allChats = [...allChats, ...groupChats];
//       }

//       setMessages(allChats);
//     } catch (error) {
//       console.error("Error fetching chat list:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     if (tab === "Contacts") {
//       fetchContacts();
//     } else if (tab === "Chat") {
//       fetchChatList();
//     } else {
//       setMessages([]);
//     }
//   };

//   const createOrGetChatRoom = async (contact) => {
//     try {
//       const res = await fetch(`http://35.154.10.237:5000/api/chat/start`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           sender: userData.user_phone,
//           receiver: contact.mobile,
//         }),
//       });

//       const result = await res.json();
//       if (result?.chatId) {
//         setChatId(result.chatId);
//         socketRef.current.emit("joinRoom", {
//           chatId: result.chatId,
//           userId: userData.user_phone,
//         });
//         fetchChatHistory(result.chatId, contact.mobile);
//       }
//     } catch (err) {
//       console.error("Error creating chat room:", err);
//     }
//   };

//   const fetchChatHistory = async (chatId, mobile) => {
//     try {
//       const res = await fetch(`http://35.154.10.237:5000/api/chat/history`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           chatId: chatId,
//           sender: userData.user_phone,
//           receiver: mobile,
//         }),
//       });

//       const result = await res.json();
//       setChatHistory(result?.chathistory || []);
//       console.log("resultchathistory", result?.chathistory);
//     } catch (error) {
//       console.error("Error fetching chat history:", error);
//     }
//   };

//   // New function to fetch group messages
//   const fetchGroupMessages = async (groupId) => {
//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//         groupId: groupId,
//         sender: userData.user_phone,
//       });

//       const requestOptions = {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//       };

//       const response = await fetch(
//         "http://35.154.10.237:5000/api/group/getGroupmessages",
//         requestOptions
//       );
//       const result = await response.json();

//       console.log("Group messages response:", result);

//       // FIXED: Check the actual API response structure
//       if (response.ok && result.messages) {
//         // Format the messages to match the existing chat history format
//         const formattedMessages = result.messages.map((msg) => ({
//           content: msg.content,
//           senderMobile: msg.sender,
//           createdAt: msg.createdAt,
//           messageType: msg.messageType,
//         }));

//         setChatHistory(formattedMessages);
//       } else {
//         console.error(
//           "Failed to fetch group messages:",
//           result.message || "Unknown error"
//         );
//         setChatHistory([]);
//       }
//     } catch (error) {
//       console.error("Error fetching group messages:", error);
//       setChatHistory([]);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedUser) return;

//     // For individual chats
//     if (chatType === "individual") {
//       let finalChatId = chatId;
//       if (!finalChatId) {
//         await createOrGetChatRoom(selectedUser);
//         finalChatId = chatId;
//       }

//       const messageData = {
//         chatId: finalChatId,
//         content: newMessage.trim(),
//         senderMobile: userData.user_phone,
//       };

//       try {
//         setChatHistory((prev) => [
//           ...prev,
//           {
//             chatId: finalChatId,
//             content: newMessage.trim(),
//             senderMobile: userData.user_phone,
//             createdAt: new Date().toISOString(),
//           },
//         ]);

//         socketRef.current.emit("sendMessage", messageData);

//         const res = await fetch(`${SOCKET_SERVER}/api/chat/instant-message`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(messageData),
//         });

//         const saved = await res.json();
//         console.log("objectsaved", saved);
//         setNewMessage("");
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }
//     }
//     // For group chats
//     else if (chatType === "group") {
//       try {
//         const messageData = {
//           groupId: selectedUser.id,
//           sender: userData.user_phone,
//           content: newMessage.trim(),
//           messageType: "text",
//           senderName: userData.user_name,
//           createdAt: new Date().toISOString()
//         };

//         // Add message to UI immediately
//         setChatHistory((prev) => [...prev, messageData]);
        
//         // Emit through socket for real-time updates
//         socketRef.current.emit("sendGroupMessage", messageData);

//         // Send to server for persistence
//         const response = await fetch(
//           "http://35.154.10.237:5000/api/group/sendMessage",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(messageData),
//           }
//         );
        
//         const result = await response.json();
//         console.log("Send group message response:", result);

//         if (response.ok) {
//           setNewMessage("");
//         } else {
//           console.error("Failed to send group message:", result.message);
//           // Remove the message from UI if sending failed
//           setChatHistory((prev) => prev.slice(0, -1));
//         }
//       } catch (error) {
//         console.error("Error sending group message:", error);
//         // Remove the message from UI if sending failed
//         setChatHistory((prev) => prev.slice(0, -1));
//       }
//     }
//   };

//   const handleContactClick = (contact) => {
//     setSelectedUser(contact);
//     setChatType(contact.type); // Set the chat type based on the contact

//     if (contact.type === "individual") {
//       // Individual chat logic
//       if (contact.chatId) {
//         setChatId(contact.chatId);
//         socketRef.current.emit("joinRoom", {
//           chatId: contact.chatId,
//           userId: userData.user_phone,
//         });
//         fetchChatHistory(contact.chatId, contact.mobile);
//       } else {
//         createOrGetChatRoom(contact);
//       }
//     } else if (contact.type === "group") {
//       // Join group room
//       socketRef.current.emit("joinGroup", contact.id);
//       // Group chat logic - fetch group messages
//       fetchGroupMessages(contact.id);
//     }
//   };

//   const toggleContactSelection = (contact) => {
//     setSelectedContacts((prev) =>
//       prev.some((c) => c.mobile === contact.mobile)
//         ? prev.filter((c) => c.mobile !== contact.mobile)
//         : [...prev, contact]
//     );
//   };

//   const handleContentTypeChange = (type) => {
//     setContentTypes((prev) =>
//       prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
//     );
//   };

//   const createNewGroup = async () => {
//     if (!groupName.trim() || selectedContacts.length === 0) return;

//     setIsCreatingGroup(true);
//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       // Extract mobile numbers from selected contacts
//       const participants = selectedContacts.map((contact) => contact.mobile);

//       // Add current user to participants if not already included
//       if (!participants.includes(userData.user_phone)) {
//         participants.push(userData.user_phone);
//       }

//       // Map content types to API format
//       const apiContentTypes = [];
//       if (contentTypes.includes("text")) apiContentTypes.push("text");
//       if (contentTypes.includes("documents")) apiContentTypes.push("documents");
//       if (contentTypes.includes("media")) apiContentTypes.push("media");
//       if (contentTypes.includes("attachments"))
//         apiContentTypes.push("attachments");

//       const raw = JSON.stringify({
//         title: groupName.trim(),
//         participants: participants,
//         autoDelete: autoDelete,
//         autoDeleteAt: autoDelete ? autoDeleteAt : "2025-08-31T12:00:00.000Z",
//         contentTypes: apiContentTypes.length > 0 ? apiContentTypes : ["text"],
//       });

//       console.log("Sending group creation request:", raw);

//       const response = await fetch(
//         "http://35.154.10.237:5000/api/group/Creategroup",
//         {
//           method: "POST",
//           headers: myHeaders,
//           body: raw,
//           redirect: "follow",
//         }
//       );

//       const result = await response.json();
//       console.log("Group creation result:", result);

//       if (response.ok) {
//         // Group created successfully
//         alert("Group created successfully!");
//         setShowNewGroupModal(false);
//         setGroupName("");
//         setSelectedContacts([]);
//         setAutoDelete(false);
//         setContentTypes(["text", "documents", "media", "attachments"]);

//         // Refresh the chat list to show the new group
//         fetchChatList();
//       } else {
//         throw new Error(result.message || "Failed to create group");
//       }
//     } catch (error) {
//       console.error("Error creating group:", error);
//       alert(`Error creating group: ${error.message}`);
//     } finally {
//       setIsCreatingGroup(false);
//     }
//   };

//   // Function to handle Plus button click
//   const handlePlusButtonClick = () => {
//     // Make sure we have contacts loaded
//     if (activeTab !== "Contacts") {
//       setActiveTab("Contacts");
//       fetchContacts();
//     }
//     setShowNewGroupModal(true);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
//         {/* Header (Fixed) */}
//         <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between mb-3 bg-white border-b shadow-sm">
//           <div className="flex items-center gap-4">
//             <div
//               className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xl"
//               style={{ backgroundColor: avatarColors.purple }}
//             >
//               {userData.user_name.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <p className="font-semibold">{userData.user_name}</p>
//               <p className="text-xs text-gray-500">{userData.user_phone}</p>
//             </div>
//           </div>

//           <div className="relative w-1/3">
//             <input
//               type="text"
//               placeholder="Search messages or contacts..."
//               className="pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 w-full"
//             />
//             <Search
//               className="absolute left-3 top-2.5 text-gray-400"
//               size={20}
//             />
//           </div>

//           {/* Plus Button and Settings Button */}
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handlePlusButtonClick}
//               className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
//             >
//               <Plus className="w-4 h-4 text-white" />
//             </button>

//             {/* Settings Button */}
//             <div className="relative" ref={settingsDropdownRef}>
//               <button
//                 onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
//                 className="p-2 rounded-full hover:bg-gray-100"
//               >
//                 <Settings className="text-gray-600" size={24} />
//               </button>

//               {/* Dropdown Menu */}
//               {showSettingsDropdown && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//                   <div
//                     className="py-1"
//                     role="menu"
//                     aria-orientation="vertical"
//                     aria-labelledby="options-menu"
//                   >
//                     <button
//                       onClick={() => {
//                         navigate("/settings");
//                         setShowSettingsDropdown(false);
//                       }}
//                       className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                       role="menuitem"
//                     >
//                       <Settings className="mr-2" size={16} />
//                       Settings
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* New Group Modal */}
//       {showNewGroupModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-semibold mb-6 text-center">
//               New Group
//             </h2>

//             {/* Search input */}
//             <div className="relative mb-6">
//               <input
//                 type="text"
//                 placeholder="Search chats or contacts..."
//                 className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <Search
//                 className="absolute left-3 top-3.5 text-gray-400"
//                 size={18}
//               />
//             </div>

//             {/* Group Details */}
//             <div className="mb-6">
//               <h3 className="font-medium mb-3 text-gray-700">Group Details</h3>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Group Name
//                 </label>
//                 <input
//                   type="text"
//                   value={groupName}
//                   onChange={(e) => setGroupName(e.target.value)}
//                   placeholder="Marketing Campaign Update"
//                   className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Selected Participants
//                 </label>
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {selectedContacts.length > 0 ? (
//                     selectedContacts.map((contact) => (
//                       <div
//                         key={contact.mobile}
//                         className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center"
//                       >
//                         {contact.name}
//                         <button
//                           onClick={() => toggleContactSelection(contact)}
//                           className="ml-1.5 text-blue-600 hover:text-blue-800 text-lg"
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
//                       <Plus className="w-5 h-5 text-gray-400" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-b border-gray-200 py-6 mb-6">
//               {/* Auto-Deletion Settings */}
//               <div className="mb-6">
//                 <h3 className="font-medium mb-3 text-gray-700">
//                   Auto-Deletion Settings
//                 </h3>

//                 <div className="flex items-center mb-2">
//                   <input
//                     type="checkbox"
//                     id="timeBasedDeletion"
//                     checked={autoDelete}
//                     onChange={(e) => setAutoDelete(e.target.checked)}
//                     className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="timeBasedDeletion" className="text-gray-700">
//                     Time-based Deletion
//                   </label>
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="manualDeletion"
//                     checked={!autoDelete}
//                     onChange={(e) => setAutoDelete(!e.target.checked)}
//                     className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="manualDeletion" className="text-gray-700">
//                     Manual Deletion
//                   </label>
//                 </div>
//               </div>

//               {/* Content Filtering */}
//               <div>
//                 <h3 className="font-medium mb-3 text-gray-700">
//                   Content Filtering
//                 </h3>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="textMessages"
//                       checked={contentTypes.includes("text")}
//                       onChange={() => handleContentTypeChange("text")}
//                       className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label
//                       htmlFor="textMessages"
//                       className="text-gray-700 text-sm"
//                     >
//                       Text Messages
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="documents"
//                       checked={contentTypes.includes("documents")}
//                       onChange={() => handleContentTypeChange("documents")}
//                       className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label
//                       htmlFor="documents"
//                       className="text-gray-700 text-sm"
//                     >
//                       Documents (PDFs, Docs)
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="media"
//                       checked={contentTypes.includes("media")}
//                       onChange={() => handleContentTypeChange("media")}
//                       className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label htmlFor="media" className="text-gray-700 text-sm">
//                       Media (Photos, Videos)
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       id="attachments"
//                       checked={contentTypes.includes("attachments")}
//                       onChange={() => handleContentTypeChange("attachments")}
//                       className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <label
//                       htmlFor="attachments"
//                       className="text-gray-700 text-sm"
//                     >
//                       Other Attachments
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div className="flex justify-between items-center">
//               <button
//                 onClick={() => {
//                   setShowNewGroupModal(false);
//                   setGroupName("");
//                   setSelectedContacts([]);
//                   setAutoDelete(false);
//                   setContentTypes([
//                     "text",
//                     "documents",
//                     "media",
//                     "attachments",
//                   ]);
//                 }}
//                 className="text-gray-500 font-medium hover:text-gray-700"
//               >
//                 Discard
//               </button>
//               <button
//                 onClick={createNewGroup}
//                 disabled={
//                   !groupName.trim() ||
//                   selectedContacts.length === 0 ||
//                   isCreatingGroup
//                 }
//                 className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 font-medium flex items-center justify-center"
//               >
//                 {isCreatingGroup ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Creating...
//                   </>
//                 ) : (
//                   "Create group"
//                 )}
//               </button>
//             </div>

//             {/* Contacts List */}
//             <div className="mt-6">
//               <h3 className="font-medium mb-3 text-gray-700">
//                 Select Contacts
//               </h3>
//               <div className="max-h-60 overflow-y-auto border rounded-lg">
//                 {allContacts.length > 0 ? (
//                   allContacts.map((contact) => (
//                     <div
//                       key={contact.mobile}
//                       className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b ${
//                         selectedContacts.some(
//                           (c) => c.mobile === contact.mobile
//                         )
//                           ? "bg-blue-50"
//                           : ""
//                       }`}
//                       onClick={() => toggleContactSelection(contact)}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedContacts.some(
//                           (c) => c.mobile === contact.mobile
//                         )}
//                         readOnly
//                         className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                       <div
//                         className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3"
//                         style={{ backgroundColor: avatarColors[contact.color] }}
//                       >
//                         {contact.name.charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <p className="font-medium">{contact.name}</p>
//                         <p className="text-sm text-gray-500">
//                           {contact.mobile}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-4 text-center text-gray-500">
//                     No contacts available.{" "}
//                     <button
//                       onClick={fetchContacts}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       Load contacts
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Body */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <div className="w-1/3 bg-white border-r flex flex-col">
//           {/* Tabs */}
//           <div className="flex gap-2 p-3 bg-gray-100 justify-center">
//             {["Contacts", "Chat", "Status"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => handleTabChange(tab)}
//                 className={`py-2 px-6 rounded-full font-semibold text-sm ${
//                   activeTab === tab
//                     ? "bg-blue-600 text-white"
//                     : "text-gray-600 hover:bg-blue-100"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Contacts/Chat List */}
//           <div className="overflow-y-auto flex-1">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               </div>
//             ) : messages.length > 0 ? (
//               messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   onClick={() => handleContactClick(msg)}
//                   className={`flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-blue-50 ${
//                     selectedUser?.id === msg.id ? "bg-blue-100" : ""
//                   }`}
//                 >
//                   <div
//                     className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
//                     style={{ backgroundColor: avatarColors[msg.color] }}
//                   >
//                     {msg.name.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-center">
//                       <p className="font-semibold truncate">{msg.name}</p>
//                       {msg.type === "group" && (
//                         <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
//                           Group
//                         </span>
//                       )}
//                       {/* <span className="text-xs text-gray-400">24m ago</span> */}
//                     </div>
//                     <p className="text-sm text-gray-500 truncate">{msg.text}</p>
//                   </div>
//                   {msg.unreadCount > 0 && (
//                     <span className="bg-blue-600 text-white rounded-full text-xs px-2 py-0.5">
//                       {msg.unreadCount}
//                     </span>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="p-4 text-gray-500 text-center">
//                 {activeTab === "Contacts"
//                   ? "No contacts found"
//                   : activeTab === "Chat"
//                   ? "No chats available"
//                   : "No status updates"}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Chat Window */}
//         <div className="flex-1 flex flex-col bg-gradient-to-r from-sky-50 to-blue-100">
//           {selectedUser ? (
//             <>
//               {/* Header */}
//               <div className="p-4 bg-white border-b flex items-center gap-3">
//                 <div
//                   className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
//                   style={{
//                     backgroundColor:
//                       chatType === "group"
//                         ? avatarColors.blue
//                         : avatarColors.green,
//                   }}
//                 >
//                   {selectedUser.name.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <p className="font-semibold">{selectedUser.name}</p>
//                   <p className="text-xs text-gray-500">
//                     {chatType === "group"
//                       ? "Group • " +
//                         (selectedUser.participants?.length || 0) +
//                         " members"
//                       : socketConnected
//                       ? "Online"
//                       : "Offline"}
//                   </p>
//                 </div>
//               </div>

//               {/* Scrollable Messages */}
//               <div className="flex-1 overflow-y-auto p-4 space-y-3">
//                 {chatHistory.length > 0 ? (
//                   chatHistory.map((chat, idx) => (
//                     <div
//                       key={idx}
//                       className={`flex ${
//                         chat.senderMobile === userData.user_phone ||
//                         chat.sender === userData.user_phone
//                           ? "justify-end"
//                           : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-xs p-3 rounded-lg break-words ${
//                           chat.senderMobile === userData.user_phone ||
//                           chat.sender === userData.user_phone
//                             ? "bg-blue-600 text-white"
//                             : "bg-gray-200 text-gray-800"
//                         }`}
//                       >
//                         {chat.content}
//                         <div className="text-xs mt-1 opacity-70">
//                           {new Date(chat.createdAt).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <p className="text-gray-500">
//                       No messages yet. Start the conversation!
//                     </p>
//                   </div>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Fixed Input at Bottom */}
//               <div className="p-4 bg-white border-t flex gap-4 sticky bottom-0">
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Type a message..."
//                   className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   disabled={!newMessage.trim()}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 disabled:bg-blue-400"
//                 >
//                   Send
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center justify-center flex-1">
//               <div className="text-center text-gray-600 max-w-md px-6">
//                 <h2 className="text-2xl font-semibold mb-4">
//                   Welcome {userData.user_name}!
//                 </h2>
//                 <p>
//                   Select a contact from the left panel to view messages or start
//                   a new chat.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;




import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Settings, PlusCircle, Plus } from "lucide-react";
import io from "socket.io-client";

const SOCKET_SERVER = "http://35.154.10.237:5000";

const ChatPage = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("Contacts");
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [autoDelete, setAutoDelete] = useState(false);
  const [autoDeleteAt, setAutoDeleteAt] = useState("2025-08-31T12:00:00.000Z");
  const [contentTypes, setContentTypes] = useState([
    "text",
    "documents",
    "media",
    "attachments",
  ]);
  const [allContacts, setAllContacts] = useState([]);
  const [chatType, setChatType] = useState("individual"); // 'individual' or 'group'

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const settingsDropdownRef = useRef(null);

  const userData = {
    user_name: localStorage.getItem("user_name") || "User",
    user_phone: localStorage.getItem("mobile") || "0000000000",
  };

  const avatarColors = {
    green: "#22c55e",
    pink: "#ec4899",
    yellow: "#eab308",
    purple: "#a855f7",
    gray: "#9ca3af",
    blue: "#3b82f6",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize socket once
useEffect(() => {
  socketRef.current = io(SOCKET_SERVER, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    query: { callerId: userData.user_phone },
  });

  socketRef.current.on("connect", () => {
    console.log("✅ Socket connected:", socketRef.current.id);
    setSocketConnected(true);
  });

  socketRef.current.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err);
    setSocketConnected(false);
  });

  socketRef.current.on("disconnect", () => {
    console.log("⚠️ Socket disconnected");
    setSocketConnected(false);
  });

  return () => {
    socketRef.current.disconnect();
  };
}, [userData.user_phone]);

// Listen for messages
useEffect(() => {
  if (!socketRef.current) return;

  const handleChatMessage = (msg) => {
    if (msg.chatId === chatId && msg.senderMobile !== userData.user_phone) {
      setChatHistory((prev) => [...prev, msg]);
    }
  };

  const handleGroupMessage = (msg) => {
    // ✅ Add filter so your own message isn’t duplicated
    if (msg.groupId === selectedUser?.id && msg.senderMobile !== userData.user_phone) {
      setChatHistory((prev) => [...prev, msg]);
    }
  };

  socketRef.current.on("chatMessage", handleChatMessage);
  socketRef.current.on("groupMessage", handleGroupMessage);

  return () => {
    socketRef.current.off("chatMessage", handleChatMessage);
    socketRef.current.off("groupMessage", handleGroupMessage);
  };
}, [chatId, selectedUser?.id]);

// Join rooms when chat changes
useEffect(() => {
  if (!socketRef.current) return;

  if (chatId && chatType === "individual") {
    socketRef.current.emit("joinRoom", chatId);
  }
  if (selectedUser?.id && chatType === "group") {
    socketRef.current.emit("joinGroupRoom", selectedUser.id);
  }
}, [chatId, selectedUser?.id, chatType]);



  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://35.154.10.237:5000/api/getAllUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("API Response:", result);

      let contacts = [];
      if (result?.users?.length) {
        contacts = result.users
          .filter((user) => user.mobile !== userData.user_phone) // Filter out current user
          .map((user) => ({
            name: user.name || user.mobile,
            text: "Available on the platform",
            color: "green",
            mobile: user.mobile,
            unreadCount: 0,
            chatId: null,
            type: "individual",
          }));
      }

      setMessages(contacts);
      setAllContacts(contacts); // Store contacts for group creation modal
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatList = async () => {
    setIsLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        mobile: userData.user_phone || "",
      });

      const response = await fetch("http://35.154.10.237:5000/api/chats", {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });

      const result = await response.json();
      console.log("Chats API Response:", result);

      let allChats = [];

      // ✅ Handle user chats
      if (result?.chats?.length) {
        const userChats = result.chats.map((chat) => ({
          id: chat.chatId || chat._id, // unique id
          name: chat.name || chat.contactMobile || "Unknown",
          text:
            typeof chat.lastMessage === "object"
              ? chat.lastMessage.content
              : chat.lastMessage || "No messages yet",
          color: "green",
          type: "individual", // mark as personal chat
          mobile: chat.mobile || "N/A",
          // unreadCount: chat.unreadCount || 0,
        }));
        allChats = [...allChats, ...userChats];
      }

      // ✅ Handle group chats
      if (result?.groups?.length) {
        const groupChats = result.groups.map((group) => ({
          id: group._id,
          name: group.title || "Unnamed Group",
          text: group.lastMessage?.content || "Group chat",
          color: "blue",
          type: "group", // mark as group chat
          participants: group.participants || [],
          unreadCount: 0, // placeholder (update if API provides)
        }));
        allChats = [...allChats, ...groupChats];
      }

      setMessages(allChats);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Contacts") {
      fetchContacts();
    } else if (tab === "Chat") {
      fetchChatList();
    } else {
      setMessages([]);
    }
  };

  const createOrGetChatRoom = async (contact) => {
    try {
      const res = await fetch(`http://35.154.10.237:5000/api/chat/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          sender: userData.user_phone,
          receiver: contact.mobile,
        }),
      });

      const result = await res.json();
      if (result?.chatId) {
        setChatId(result.chatId);
        socketRef.current.emit("joinRoom", result.chatId);
        fetchChatHistory(result.chatId, contact.mobile);
      }
    } catch (err) {
      console.error("Error creating chat room:", err);
    }
  };

  const fetchChatHistory = async (chatId, mobile) => {
    try {
      const res = await fetch(`http://35.154.10.237:5000/api/chat/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId,
          sender: userData.user_phone,
          receiver: mobile,
        }),
      });

      const result = await res.json();
      setChatHistory(result?.chathistory || []);
      console.log("resultchathistory", result?.chathistory);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // New function to fetch group messages
  const fetchGroupMessages = async (groupId) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        groupId: groupId,
        sender: userData.user_phone,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch(
        "http://35.154.10.237:5000/api/group/getGroupmessages",
        requestOptions
      );
      const result = await response.json();

      console.log("Group messages response:", result);

      // FIXED: Check the actual API response structure
      if (response.ok && result.messages) {
        // Format the messages to match the existing chat history format
        const formattedMessages = result.messages.map((msg) => ({
          content: msg.content,
          senderMobile: msg.sender,
          createdAt: msg.createdAt,
          messageType: msg.messageType,
        }));

        setChatHistory(formattedMessages);
      } else {
        console.error(
          "Failed to fetch group messages:",
          result.message || "Unknown error"
        );
        setChatHistory([]);
      }
    } catch (error) {
      console.error("Error fetching group messages:", error);
      setChatHistory([]);
    }
  };

  const handleSendMessage = async () => {
  if (!newMessage.trim() || !selectedUser) return;

  // 🔹 Individual chat
  if (chatType === "individual") {
    let finalChatId = chatId;
    if (!finalChatId) {
      await createOrGetChatRoom(selectedUser);
      finalChatId = chatId;
    }

    const messageData = {
      chatId: finalChatId,
      content: newMessage.trim(),
      senderMobile: userData.user_phone,
    };

    try {
      // Add immediately to UI
      setChatHistory((prev) => [
        ...prev,
        {
          chatId: finalChatId,
          content: newMessage.trim(),
          senderMobile: userData.user_phone,
          createdAt: new Date().toISOString(),
        },
      ]);

      socketRef.current.emit("sendMessage", messageData);

      await fetch(`${SOCKET_SERVER}/api/chat/instant-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  // 🔹 Group chat
  else if (chatType === "group") {
    try {
      const messageData = {
        groupId: selectedUser.id,
        sender: userData.user_phone,
        content: newMessage.trim(),
        messageType: "text",
        senderName: userData.user_name,
      };

      // Emit through socket
      socketRef.current.emit("sendGroupMessage", {
        groupId: selectedUser.id,
        senderMobile: userData.user_phone,
        content: newMessage.trim(),
      });

      // Save on server
      const response = await fetch(`${SOCKET_SERVER}/api/group/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      const result = await response.json();
      console.log("Send group message response:", result);

      if (response.ok) {
        // ✅ Manually add *only once* for sender (avoid duplication)
        setChatHistory((prev) => [
          ...prev,
          {
            groupId: selectedUser.id,
            senderMobile: userData.user_phone,
            content: newMessage.trim(),
            createdAt: new Date().toISOString(),
          },
        ]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending group message:", error);
    }
  }
};

  // const handleSendMessage = async () => {
  //   if (!newMessage.trim() || !selectedUser) return;

  //   // For individual chats
  //   if (chatType === "individual") {
  //     let finalChatId = chatId;
  //     if (!finalChatId) {
  //       await createOrGetChatRoom(selectedUser);
  //       finalChatId = chatId;
  //     }

  //     const messageData = {
  //       chatId: finalChatId,
  //       content: newMessage.trim(),
  //       senderMobile: userData.user_phone,
  //     };

  //     try {
  //       setChatHistory((prev) => [
  //         ...prev,
  //         {
  //           chatId: finalChatId,
  //           content: newMessage.trim(),
  //           senderMobile: userData.user_phone,
  //           createdAt: new Date().toISOString(),
  //         },
  //       ]);

  //       socketRef.current.emit("sendMessage", messageData);

  //       const res = await fetch(`${SOCKET_SERVER}/api/chat/instant-message`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(messageData),
  //       });

  //       const saved = await res.json();
  //       console.log("objectsaved", saved);
  //       setNewMessage("");
  //     } catch (error) {
  //       console.error("Error sending message:", error);
  //     }
  //   }
  //   // For group chats
  //   else if (chatType === "group") {
  //     try {
  //       const messageData = {
  //         groupId: selectedUser.id,
  //         sender: userData.user_phone,
  //         content: newMessage.trim(),
  //         messageType: "text",
  //         senderName: userData.user_name,
  //       };

  //       // Add message to UI immediately
  //       setChatHistory((prev) => [
  //         ...prev,
  //         {
  //           groupId: selectedUser.id,
  //           senderMobile: userData.user_phone,
  //           content: newMessage.trim(),
  //           createdAt: new Date().toISOString(),
  //         },
  //       ]);
        
  //       // Emit through socket for real-time updates
  //       socketRef.current.emit("sendGroupMessage", {
  //         groupId: selectedUser.id,
  //         senderMobile: userData.user_phone,
  //         content: newMessage.trim(),
  //       });

  //       // Send to server for persistence
  //       const response = await fetch(
  //         "http://35.154.10.237:5000/api/group/sendMessage",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(messageData),
  //         }
  //       );
        
  //       const result = await response.json();
  //       console.log("Send group message response:", result);

  //       if (response.ok) {
  //         setNewMessage("");
  //       } else {
  //         console.error("Failed to send group message:", result.message);
  //         // Remove the message from UI if sending failed
  //         setChatHistory((prev) => prev.slice(0, -1));
  //       }
  //     } catch (error) {
  //       console.error("Error sending group message:", error);
  //       // Remove the message from UI if sending failed
  //       setChatHistory((prev) => prev.slice(0, -1));
  //     }
  //   }
  // };

  const handleContactClick = (contact) => {
    setSelectedUser(contact);
    setChatType(contact.type); // Set the chat type based on the contact

    if (contact.type === "individual") {
      // Individual chat logic
      if (contact.chatId) {
        setChatId(contact.chatId);
        socketRef.current.emit("joinRoom", contact.chatId);
        fetchChatHistory(contact.chatId, contact.mobile);
      } else {
        createOrGetChatRoom(contact);
      }
    } else if (contact.type === "group") {
      // Group chat logic - join group room and fetch group messages
      socketRef.current.emit("joinGroupRoom", contact.id);
      fetchGroupMessages(contact.id);
    }
  };

  const toggleContactSelection = (contact) => {
    setSelectedContacts((prev) =>
      prev.some((c) => c.mobile === contact.mobile)
        ? prev.filter((c) => c.mobile !== contact.mobile)
        : [...prev, contact]
    );
  };

  const handleContentTypeChange = (type) => {
    setContentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const createNewGroup = async () => {
    if (!groupName.trim() || selectedContacts.length === 0) return;

    setIsCreatingGroup(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Extract mobile numbers from selected contacts
      const participants = selectedContacts.map((contact) => contact.mobile);

      // Add current user to participants if not already included
      if (!participants.includes(userData.user_phone)) {
        participants.push(userData.user_phone);
      }

      // Map content types to API format
      const apiContentTypes = [];
      if (contentTypes.includes("text")) apiContentTypes.push("text");
      if (contentTypes.includes("documents")) apiContentTypes.push("documents");
      if (contentTypes.includes("media")) apiContentTypes.push("media");
      if (contentTypes.includes("attachments"))
        apiContentTypes.push("attachments");

      const raw = JSON.stringify({
        title: groupName.trim(),
        participants: participants,
        autoDelete: autoDelete,
        autoDeleteAt: autoDelete ? autoDeleteAt : "2025-08-31T12:00:00.000Z",
        contentTypes: apiContentTypes.length > 0 ? apiContentTypes : ["text"],
      });

      console.log("Sending group creation request:", raw);

      const response = await fetch(
        "http://35.154.10.237:5000/api/group/Creategroup",
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      );

      const result = await response.json();
      console.log("Group creation result:", result);

      if (response.ok) {
        // Group created successfully
        alert("Group created successfully!");
        setShowNewGroupModal(false);
        setGroupName("");
        setSelectedContacts([]);
        setAutoDelete(false);
        setContentTypes(["text", "documents", "media", "attachments"]);

        // Refresh the chat list to show the new group
        fetchChatList();
      } else {
        throw new Error(result.message || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert(`Error creating group: ${error.message}`);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  // Function to handle Plus button click
  const handlePlusButtonClick = () => {
    // Make sure we have contacts loaded
    if (activeTab !== "Contacts") {
      setActiveTab("Contacts");
      fetchContacts();
    }
    setShowNewGroupModal(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        {/* Header (Fixed) */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between mb-3 bg-white border-b shadow-sm">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xl"
              style={{ backgroundColor: avatarColors.purple }}
            >
              {userData.user_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{userData.user_name}</p>
              <p className="text-xs text-gray-500">{userData.user_phone}</p>
            </div>
          </div>

          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search messages or contacts..."
              className="pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 w-full"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>

          {/* Plus Button and Settings Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlusButtonClick}
              className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>

            {/* Settings Button */}
            <div className="relative" ref={settingsDropdownRef}>
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Settings className="text-gray-600" size={24} />
              </button>

              {/* Dropdown Menu */}
              {showSettingsDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      onClick={() => {
                        navigate("/NewSetting");
                        setShowSettingsDropdown(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      role="menuitem"
                    >
                      <Settings className="mr-2" size={16} />
                      Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">
              New Group
            </h2>

            {/* Search input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search chats or contacts..."
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
            </div>

            {/* Group Details */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-700">Group Details</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Marketing Campaign Update"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Selected Participants
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedContacts.length > 0 ? (
                    selectedContacts.map((contact) => (
                      <div
                        key={contact.mobile}
                        className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center"
                      >
                        {contact.name}
                        <button
                          onClick={() => toggleContactSelection(contact)}
                          className="ml-1.5 text-blue-600 hover:text-blue-800 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              {/* Auto-Deletion Settings */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">
                  Auto-Deletion Settings
                </h3>

                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="timeBasedDeletion"
                    checked={autoDelete}
                    onChange={(e) => setAutoDelete(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="timeBasedDeletion" className="text-gray-700">
                    Time-based Deletion
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="manualDeletion"
                    checked={!autoDelete}
                    onChange={(e) => setAutoDelete(!e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="manualDeletion" className="text-gray-700">
                    Manual Deletion
                  </label>
                </div>
              </div>

              {/* Content Filtering */}
              <div>
                <h3 className="font-medium mb-3 text-gray-700">
                  Content Filtering
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="textMessages"
                      checked={contentTypes.includes("text")}
                      onChange={() => handleContentTypeChange("text")}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="textMessages"
                      className="text-gray-700 text-sm"
                    >
                      Text Messages
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="documents"
                      checked={contentTypes.includes("documents")}
                      onChange={() => handleContentTypeChange("documents")}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="documents"
                      className="text-gray-700 text-sm"
                    >
                      Documents (PDFs, Docs)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="media"
                      checked={contentTypes.includes("media")}
                      onChange={() => handleContentTypeChange("media")}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="media" className="text-gray-700 text-sm">
                      Media (Photos, Videos)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="attachments"
                      checked={contentTypes.includes("attachments")}
                      onChange={() => handleContentTypeChange("attachments")}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="attachments"
                      className="text-gray-700 text-sm"
                    >
                      Other Attachments
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setShowNewGroupModal(false);
                  setGroupName("");
                  setSelectedContacts([]);
                  setAutoDelete(false);
                  setContentTypes([
                    "text",
                    "documents",
                    "media",
                    "attachments",
                  ]);
                }}
                className="text-gray-500 font-medium hover:text-gray-700"
              >
                Discard
              </button>
              <button
                onClick={createNewGroup}
                disabled={
                  !groupName.trim() ||
                  selectedContacts.length === 0 ||
                  isCreatingGroup
                }
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 font-medium flex items-center justify-center"
              >
                {isCreatingGroup ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create group"
                )}
              </button>
            </div>

            {/* Contacts List */}
            <div className="mt-6">
              <h3 className="font-medium mb-3 text-gray-700">
                Select Contacts
              </h3>
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {allContacts.length > 0 ? (
                  allContacts.map((contact) => (
                    <div
                      key={contact.mobile}
                      className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b ${
                        selectedContacts.some(
                          (c) => c.mobile === contact.mobile
                        )
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onClick={() => toggleContactSelection(contact)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedContacts.some(
                          (c) => c.mobile === contact.mobile
                        )}
                        readOnly
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3"
                        style={{ backgroundColor: avatarColors[contact.color] }}
                      >
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-500">
                          {contact.mobile}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No contacts available.{" "}
                    <button
                      onClick={fetchContacts}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Load contacts
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/3 bg-white border-r flex flex-col">
          {/* Tabs */}
          <div className="flex gap-2 p-3 bg-gray-100 justify-center">
            {["Contacts", "Chat", "Status"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`py-2 px-6 rounded-full font-semibold text-sm ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Contacts/Chat List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  onClick={() => handleContactClick(msg)}
                  className={`flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-blue-50 ${
                    selectedUser?.id === msg.id ? "bg-blue-100" : ""
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: avatarColors[msg.color] }}
                  >
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold truncate">{msg.name}</p>
                      {msg.type === "group" && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Group
                        </span>
                      )}
                      {/* <span className="text-xs text-gray-400">24m ago</span> */}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{msg.text}</p>
                  </div>
                  {msg.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white rounded-full text-xs px-2 py-0.5">
                      {msg.unreadCount}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500 text-center">
                {activeTab === "Contacts"
                  ? "No contacts found"
                  : activeTab === "Chat"
                  ? "No chats available"
                  : "No status updates"}
              </p>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gradient-to-r from-sky-50 to-blue-100">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    backgroundColor:
                      chatType === "group"
                        ? avatarColors.blue
                        : avatarColors.green,
                  }}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-xs text-gray-500">
                    {chatType === "group"
                      ? "Group • " +
                        (selectedUser.participants?.length || 0) +
                        " members"
                      : socketConnected
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>

              {/* Scrollable Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatHistory.length > 0 ? (
                  chatHistory.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        chat.senderMobile === userData.user_phone ||
                        chat.sender === userData.user_phone
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg break-words ${
                          chat.senderMobile === userData.user_phone ||
                          chat.sender === userData.user_phone
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {chat.content}
                        <div className="text-xs mt-1 opacity-70">
                          {new Date(chat.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Fixed Input at Bottom */}
              <div className="p-4 bg-white border-t flex gap-4 sticky bottom-0">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 disabled:bg-blue-400"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center text-gray-600 max-w-md px-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Welcome {userData.user_name}!
                </h2>
                <p>
                  Select a contact from the left panel to view messages or start
                  a new chat.
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