import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Settings, PlusCircle } from "lucide-react";
import io from "socket.io-client";

const SOCKET_SERVER = "http://35.154.10.237:3000";

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
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(event.target)
      ) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialize socket
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: {
        userId: userData.user_phone,
        userName: "yugandhar",
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      setSocketConnected(true);
      socketRef.current.emit("joinUserRoom", userData.user_phone);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setSocketConnected(false);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    socketRef.current.on("newMessage", (msg) => {
      if (msg.chatId === chatId) {
        setChatHistory((prev) => [...prev, msg]);
      }
    });

    socketRef.current.on("messageReceived", (messageData) => {
      if (messageData.chatId === chatId) {
        setChatHistory((prev) => [
          ...prev,
          {
            chatId: messageData.chatId,
            sender: messageData.senderMobile,
            receiver: userData.user_phone,
            content: messageData.content,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userData.user_phone]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://35.154.10.237:5000/api/getAllUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("API Response:", result);

      let contacts = [];
      if (result?.users?.length) {
        contacts = result.users.map((user) => ({
          name: user.name || user.mobile,
          text: "Available on the platform",
          color: "green",
          mobile: user.mobile,
          unreadCount: 0,
          chatId: null,
        }));
      }

      setMessages(contacts);
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

      if (result?.chats?.length) {
        const chatMessages = result.chats.map((chat) => ({
          name: chat.name || chat.contactMobile || "Unknown",
          text:
            typeof chat.lastMessage === "object"
              ? chat.lastMessage.content
              : chat.lastMessage || "No messages yet",
          color: "green",
          mobile: chat.mobile || "N/A",
          chatId: chat.chatId,
        }));
        setMessages(chatMessages);
      } else {
        setMessages([]);
      }
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
        socketRef.current.emit("joinRoom", {
          chatId: result.chatId,
          userId: userData.user_phone,
        });
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
      console.log(result?.chathistory);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

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
      setChatHistory((prev) => [
        ...prev,
        {
          chatId: finalChatId,
          content: newMessage.trim(),
          senderMobile: userData.user_phone,
        },
      ]);

      socketRef.current.emit("sendMessage", messageData);

      const res = await fetch(`${SOCKET_SERVER}/api/chat/instant-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      const saved = await res.json();
      console.log("objectsaved", saved);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleContactClick = (contact) => {
    setSelectedUser(contact);
    if (contact.chatId) {
      setChatId(contact.chatId);
      socketRef.current.emit("joinRoom", {
        chatId: contact.chatId,
        userId: userData.user_phone,
      });
      fetchChatHistory(contact.chatId, contact.mobile);
    } else {
      createOrGetChatRoom(contact);
    }
  };

  const toggleContactSelection = (contact) => {
    setSelectedContacts((prev) =>
      prev.some((c) => c.mobile === contact.mobile)
        ? prev.filter((c) => c.mobile !== contact.mobile)
        : [...prev, contact]
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

      const raw = JSON.stringify({
        title: groupName.trim(),
        participants: participants,
        autoDelete: false,
        autoDeleteAt: "2025-08-31T12:00:00.000Z",
        contentTypes: ["text"],
      });

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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
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
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

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
                    setShowNewGroupModal(true);
                    setShowSettingsDropdown(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  <PlusCircle className="mr-2" size={16} />
                  New Group
                </button>
                <button
                  onClick={() => {
                    navigate("/settings");
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

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="max-h-60 overflow-y-auto mb-4">
              <h3 className="font-medium mb-2">Select Contacts</h3>
              {messages
                .filter((contact) => contact.color !== "gray")
                .map((contact) => (
                  <div
                    key={contact.mobile}
                    className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => toggleContactSelection(contact)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedContacts.some(
                        (c) => c.mobile === contact.mobile
                      )}
                      readOnly
                      className="mr-2"
                    />
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2"
                      style={{ backgroundColor: avatarColors[contact.color] }}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{contact.name}</span>
                  </div>
                ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewGroupModal(false);
                  setGroupName("");
                  setSelectedContacts([]);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={createNewGroup}
                disabled={
                  !groupName.trim() ||
                  selectedContacts.length === 0 ||
                  isCreatingGroup
                }
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
              >
                {isCreatingGroup ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </button>
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
                    selectedUser?.mobile === msg.mobile ? "bg-blue-100" : ""
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
                      <span className="text-xs text-gray-400">24m ago</span>
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
                  style={{ backgroundColor: avatarColors.green }}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-xs text-gray-500">
                    {socketConnected ? "Online" : "Offline"}
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
                        chat.senderMobile === userData.user_phone
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg break-words ${
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
