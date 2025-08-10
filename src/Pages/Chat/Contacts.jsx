// import React, { useState, useEffect } from "react";
// import { Search, Settings } from "lucide-react";

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [activeTab, setActiveTab] = useState("Contacts"); // load contacts by default

//   // Avatar colors
//   const avatarColors = {
//     green: "#22c55e",
//     pink: "#ec4899",
//     yellow: "#eab308",
//     purple: "#a855f7",
//     gray: "#9ca3af",
//   };

//   const fetchContacts = async () => {
//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//         mobiles: [
//           "7876556789",
//           "9150541316",
//           "8524930080",
//           "9879797975",
//           "7871941746",
//         ],
//       });

//       const requestOptions = {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//       };

//       const response = await fetch(
//         "http://35.154.10.237:5000/api/contacts/check-exist",
//         requestOptions
//       );

//       const result = await response.json();
//       console.log("API Result:", result);

//       let transformed = [];

//       // Add registered users
//       if (result?.users?.length) {
//         transformed = transformed.concat(
//           result.users.map((user) => ({
//             name: user.name || "Unknown",
//             text: user.lastMessage || "No messages yet",
//             color: "green",
//           }))
//         );
//       }

//       // Add not-found contacts
//       if (result?.notFoundMobiles?.length) {
//         transformed = transformed.concat(
//           result.notFoundMobiles.map((mobile) => ({
//             name: mobile,
//             text: "Not on the platform",
//             color: "gray",
//           }))
//         );
//       }

//       setMessages(transformed);
//     } catch (error) {
//       console.error("Error fetching contacts:", error);
//       setMessages([]);
//     }
//   };

//   const handleTabClick = (tabName) => {
//     setActiveTab(tabName);
//     if (tabName === "Contacts") {
//       fetchContacts();
//     } else {
//       setMessages([]);
//     }
//   };

//   // Load contacts immediately when the page opens
//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
//             IC
//           </div>
//           <span className="font-semibold text-lg">Messages</span>
//         </div>

//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search messages or contacts..."
//             className="pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//         </div>
//       </div>

//       {/* Body */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <div className="w-1/3 bg-white border-r flex flex-col">
//           {/* Tabs */}
//           <div className="flex border-b bg-gray-50">
//             <button
//               onClick={() => handleTabClick("Contacts")}
//               className={`flex-1 py-3 text-center border-b-2 ${
//                 activeTab === "Contacts"
//                   ? "border-blue-400 font-semibold"
//                   : "border-transparent hover:border-blue-400"
//               }`}
//             >
//               Contacts
//             </button>
//             <button
//               onClick={() => handleTabClick("Chat")}
//               className={`flex-1 py-3 text-center border-b-2 ${
//                 activeTab === "Chat"
//                   ? "border-blue-400 font-semibold"
//                   : "border-transparent hover:border-blue-400"
//               }`}
//             >
//               Chat
//             </button>
//             <button
//               onClick={() => handleTabClick("Status")}
//               className={`flex-1 py-3 text-center border-b-2 ${
//                 activeTab === "Status"
//                   ? "border-blue-400 font-semibold"
//                   : "border-transparent hover:border-blue-400"
//               }`}
//             >
//               Status
//             </button>
//           </div>

//           {/* Messages list */}
//           <div className="overflow-y-auto flex-1">
//             {messages.length > 0 ? (
//               messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b"
//                 >
//                   <div
//                     className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
//                     style={{
//                       backgroundColor: avatarColors[msg.color] || "#9ca3af",
//                     }}
//                   >
//                     {msg.name.charAt(0)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold truncate">{msg.name}</p>
//                     <p className="text-sm text-gray-500 truncate">
//                       {msg.text || (
//                         <span className="text-gray-300">No messages yet</span>
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="p-4 text-gray-500">
//                 {activeTab === "Contacts"
//                   ? "No contacts found"
//                   : "Select a tab to load data"}
//               </p>
//             )}
//           </div>

//           {/* Settings button */}
//           <div className="p-3 border-t bg-white">
//             <button className="flex items-center gap-2 w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//               <Settings size={20} />
//               <span>Settings</span>
//             </button>
//           </div>
//         </div>

//         {/* Chat Window */}
//         <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-sky-50 to-blue-100">
//           <div className="text-center text-gray-500 p-6 max-w-md">
//             <h2 className="text-xl font-semibold mb-2">
//               Welcome Back to your chat!
//             </h2>
//             <p className="text-gray-600">
//               Select a conversation from the left panel to view messages or
//               start a new chat.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;



import React, { useState } from "react";
import { Search, Settings } from "lucide-react";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState(""); // no default

  const avatarColors = {
    green: "#22c55e",
    pink: "#ec4899",
    yellow: "#eab308",
    purple: "#a855f7",
    gray: "#9ca3af",
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
      console.log("API Result:", result);

      let transformed = [];

      if (result?.users?.length) {
        transformed = transformed.concat(
          result.users.map((user) => ({
            name: user.name || "Unknown",
            text: user.lastMessage || "No messages yet",
            color: "green",
          }))
        );
      }

      if (result?.notFoundMobiles?.length) {
        transformed = transformed.concat(
          result.notFoundMobiles.map((mobile) => ({
            name: mobile,
            text: "Not on the platform",
            color: "gray",
          }))
        );
      }

      setMessages(transformed);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setMessages([]);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName === "Contacts") {
      fetchContacts(); // ✅ call API only when Contacts clicked
    } else {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            IC
          </div>
          <span className="font-semibold text-lg">Inochat</span>
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
            <button
              onClick={() => handleTabClick("Contacts")}
              className={`flex-1 py-3 text-center border-b-2 ${
                activeTab === "Contacts"
                  ? "border-blue-400 font-semibold"
                  : "border-transparent hover:border-blue-400"
              }`}
            >
              Contacts
            </button>
            <button
              onClick={() => handleTabClick("Chat")}
              className={`flex-1 py-3 text-center border-b-2 ${
                activeTab === "Chat"
                  ? "border-blue-400 font-semibold"
                  : "border-transparent hover:border-blue-400"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => handleTabClick("Status")}
              className={`flex-1 py-3 text-center border-b-2 ${
                activeTab === "Status"
                  ? "border-blue-400 font-semibold"
                  : "border-transparent hover:border-blue-400"
              }`}
            >
              Status
            </button>
          </div>

          {/* Messages list */}
          <div className="overflow-y-auto flex-1">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                      backgroundColor: avatarColors[msg.color] || "#9ca3af",
                    }}
                  >
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{msg.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {msg.text || (
                        <span className="text-gray-300">No messages yet</span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500">
                {activeTab === "Contacts"
                  ? "No contacts found"
                  : "Select a tab to load data"}
              </p>
            )}
          </div>

          {/* Settings button */}
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
              Select a conversation from the left panel to view messages or
              start a new chat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;



// import React, { useState } from "react";
// import { Search, Settings } from "lucide-react";

// const API_URL = "http://35.154.10.237:5000/api/contacts/check-exist";

// export default function ChatPage() {
//   const [contacts, setContacts] = useState([]);
//   const [activeTab, setActiveTab] = useState("");
//   const [loading, setLoading] = useState(false);

//   const avatarColors = {
//     green: "#22c55e",
//     pink: "#ec4899",
//     yellow: "#eab308",
//     purple: "#a855f7",
//     gray: "#9ca3af",
//   };

//   const pickAndFetchContacts = async () => {
//     if (!("contacts" in navigator) || !("ContactsManager" in window)) {
//       alert("Contact Picker API not supported. Use Chrome with HTTPS.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const props = ["name", "tel"];
//       const opts = { multiple: true };

//       const deviceContacts = await navigator.contacts.select(props, opts);

//       const phoneNumbers = deviceContacts
//         .map(c => (c.tel && c.tel.length > 0 ? c.tel[0].replace(/\D/g, "") : null))
//         .filter(Boolean);

//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ mobiles: phoneNumbers }),
//       });

//       const result = await response.json();

//       const registered = (result.users || []).map(user => ({
//         name: user.name || "Unknown",
//         number: user.mobile || "",
//         isRegistered: true,
//         text: user.lastMessage || "No messages yet",
//         color: "green",
//       }));

//       const unregistered = (result.notFoundMobiles || []).map(num => {
//         const deviceContact = deviceContacts.find(c =>
//           (c.tel && c.tel[0].replace(/\D/g, "")) === num
//         );
//         return {
//           name: deviceContact?.name || num,
//           number: num,
//           isRegistered: false,
//           text: "Not on the platform",
//           color: "gray",
//         };
//       });

//       setContacts([...registered, ...unregistered]);
//     } catch (err) {
//       console.error("Error fetching contacts", err);
//       setContacts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     if (tab === "Contacts") {
//       pickAndFetchContacts();
//     }
//   };

//   const inviteUser = (contact) => {
//     alert(`Invite sent to ${contact.name}`);
//     // Could integrate SMS / WhatsApp deep link here
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
//             IC
//           </div>
//           <span className="font-semibold text-lg">Inochat</span>
//         </div>

//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search messages or contacts..."
//             className="pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//         </div>
//       </div>

//       {/* Body */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <div className="w-1/3 bg-white border-r flex flex-col">
//           {/* Tabs */}
//           <div className="flex border-b bg-gray-50">
//             {["Contacts", "Chat", "Status"].map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => handleTabClick(tab)}
//                 className={`flex-1 py-3 text-center border-b-2 ${
//                   activeTab === tab
//                     ? "border-blue-400 font-semibold"
//                     : "border-transparent hover:border-blue-400"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Contact List */}
//           <div className="overflow-y-auto flex-1">
//             {loading ? (
//               <p className="p-4 text-gray-500">Loading contacts...</p>
//             ) : contacts.length > 0 ? (
//               contacts.map((c, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
//                       style={{ backgroundColor: avatarColors[c.color] || "#9ca3af" }}
//                     >
//                       {c.name.charAt(0)}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="font-semibold truncate">{c.name}</p>
//                       <p className="text-sm text-gray-500 truncate">{c.number}</p>
//                     </div>
//                   </div>
//                   {c.isRegistered ? (
//                     <span className="text-green-500 font-medium">Inochat</span>
//                   ) : (
//                     <button
//                       onClick={() => inviteUser(c)}
//                       className="px-3 py-1 bg-gray-200 rounded text-sm"
//                     >
//                       Invite
//                     </button>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="p-4 text-gray-500">
//                 {activeTab === "Contacts" ? "No contacts found" : "Select a tab"}
//               </p>
//             )}
//           </div>

//           {/* Settings */}
//           <div className="p-3 border-t bg-white">
//             <button className="flex items-center gap-2 w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//               <Settings size={20} />
//               <span>Settings</span>
//             </button>
//           </div>
//         </div>

//         {/* Chat Window */}
//         <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-sky-50 to-blue-100">
//           <div className="text-center text-gray-500 p-6 max-w-md">
//             <h2 className="text-xl font-semibold mb-2">
//               Welcome Back to your chat!
//             </h2>
//             <p className="text-gray-600">
//               Select a conversation from the left panel to view messages or start a new chat.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { Search, Settings } from "lucide-react";

// const API_URL = "http://35.154.10.237:5000/api/contacts/check-exist";

// export default function ChatPage() {
//   const [contacts, setContacts] = useState([]);
//   const [activeTab, setActiveTab] = useState("");
//   const [loading, setLoading] = useState(false);

//   const avatarColors = {
//     green: "#22c55e",
//     pink: "#ec4899",
//     yellow: "#eab308",
//     purple: "#a855f7",
//     gray: "#9ca3af",
//   };

//   const pickAndFetchContacts = async () => {
//     const isSupported =
//       "contacts" in navigator &&
//       navigator.contacts &&
//       typeof navigator.contacts.select === "function";

//     let deviceContacts = [];

//     if (isSupported) {
//       try {
//         setLoading(true);
//         const props = ["name", "tel"];
//         const opts = { multiple: true };
//         deviceContacts = await navigator.contacts.select(props, opts);
//       } catch (err) {
//         console.error("Contact Picker error", err);
//         alert("Could not pick contacts.");
//         return;
//       }
//     } else {
//       // Fallback for unsupported browsers
//       alert("Contact Picker API not supported. Using manual entry.");
//       const manualNumbers = prompt(
//         "Enter comma-separated phone numbers:"
//       );
//       if (!manualNumbers) return;
//       deviceContacts = manualNumbers.split(",").map(num => ({
//         name: num.trim(),
//         tel: [num.trim()],
//       }));
//     }

//     try {
//       const phoneNumbers = deviceContacts
//         .map(c =>
//           c.tel && c.tel.length > 0 ? c.tel[0].replace(/\D/g, "") : null
//         )
//         .filter(Boolean);

//       setLoading(true);
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ mobiles: phoneNumbers }),
//       });

//       const result = await response.json();

//       const registered = (result.users || []).map(user => ({
//         name: user.name || "Unknown",
//         number: user.mobile || "",
//         isRegistered: true,
//         text: user.lastMessage || "No messages yet",
//         color: "green",
//       }));

//       const unregistered = (result.notFoundMobiles || []).map(num => {
//         const deviceContact = deviceContacts.find(
//           c => c.tel && c.tel[0].replace(/\D/g, "") === num
//         );
//         return {
//           name: deviceContact?.name || num,
//           number: num,
//           isRegistered: false,
//           text: "Not on the platform",
//           color: "gray",
//         };
//       });

//       setContacts([...registered, ...unregistered]);
//     } catch (err) {
//       console.error("Error fetching contacts", err);
//       setContacts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabClick = tab => {
//     setActiveTab(tab);
//     if (tab === "Contacts") {
//       pickAndFetchContacts();
//     }
//   };

//   const inviteUser = contact => {
//     alert(`Invite sent to ${contact.name}`);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
//             IC
//           </div>
//           <span className="font-semibold text-lg">Inochat</span>
//         </div>

//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search messages or contacts..."
//             className="pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//         </div>
//       </div>

//       {/* Body */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <div className="w-1/3 bg-white border-r flex flex-col">
//           {/* Tabs */}
//           <div className="flex border-b bg-gray-50">
//             {["Contacts", "Chat", "Status"].map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => handleTabClick(tab)}
//                 className={`flex-1 py-3 text-center border-b-2 ${
//                   activeTab === tab
//                     ? "border-blue-400 font-semibold"
//                     : "border-transparent hover:border-blue-400"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Contact List */}
//           <div className="overflow-y-auto flex-1">
//             {loading ? (
//               <p className="p-4 text-gray-500">Loading contacts...</p>
//             ) : contacts.length > 0 ? (
//               contacts.map((c, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
//                       style={{
//                         backgroundColor:
//                           avatarColors[c.color] || "#9ca3af",
//                       }}
//                     >
//                       {c.name.charAt(0)}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="font-semibold truncate">{c.name}</p>
//                       <p className="text-sm text-gray-500 truncate">
//                         {c.number}
//                       </p>
//                     </div>
//                   </div>
//                   {c.isRegistered ? (
//                     <span className="text-green-500 font-medium">
//                       Inochat
//                     </span>
//                   ) : (
//                     <button
//                       onClick={() => inviteUser(c)}
//                       className="px-3 py-1 bg-gray-200 rounded text-sm"
//                     >
//                       Invite
//                     </button>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="p-4 text-gray-500">
//                 {activeTab === "Contacts"
//                   ? "No contacts found"
//                   : "Select a tab"}
//               </p>
//             )}
//           </div>

//           {/* Settings */}
//           <div className="p-3 border-t bg-white">
//             <button className="flex items-center gap-2 w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
//               <Settings size={20} />
//               <span>Settings</span>
//             </button>
//           </div>
//         </div>

//         {/* Chat Window */}
//         <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-sky-50 to-blue-100">
//           <div className="text-center text-gray-500 p-6 max-w-md">
//             <h2 className="text-xl font-semibold mb-2">
//               Welcome Back to your chat!
//             </h2>
//             <p className="text-gray-600">
//               Select a conversation from the left panel to view messages or
//               start a new chat.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



