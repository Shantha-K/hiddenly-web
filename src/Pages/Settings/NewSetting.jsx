import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  User,
  Settings,
  Bell,
  HelpCircle,
  Camera,
  Pencil,
  Check,
} from "lucide-react";

const SettingsScreens = () => {
  const [currentScreen, setCurrentScreen] = useState("main"); 
  const [deletionSetting, setDeletionSetting] = useState("manual");

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    conversationTones: true,
    messageTone: "Default",
    messageVibrate: "Default",
    groupTone: "Default",
    groupVibrate: "Default",
    callTone: "Default",
    callVibrate: "Default",
  });

  // Profile Data
  const [profile, setProfile] = useState({
    name: "Balaji Govindaraj",
    about: "Life is about continuous learning and grow",
    phone: "+91 9876543210",
    image: "https://i.pravatar.cc/200",
  });

  // Privacy Options State
  const [privacySettings, setPrivacySettings] = useState({
    lastSeen: "Everyone",
    profilePhoto: "Everyone",
    about: "Everyone",
    status: "My contacts",
    groups: "Everyone",
  });

  const [showPrivacyModal, setShowPrivacyModal] = useState(null); // lastSeen | profilePhoto | about | status | groups
  const [showToneModal, setShowToneModal] = useState(null); // messageTone | groupTone | callTone

  // Blocked Contacts Data
  const [blockedContacts, setBlockedContacts] = useState([
    { id: 1, name: "Aarya", phone: "+91 9876543210", image: "https://i.pravatar.cc/200?img=5" },
    { id: 2, name: "Abhimanyu", phone: "+91 9876543210", image: "https://i.pravatar.cc/200?img=12" },
    { id: 3, name: "Abhimanyu", phone: "+91 9876543210", image: "https://i.pravatar.cc/200?img=13" },
  ]);

  // Header Component
  const Header = ({ title, back }) => (
    <div className="flex items-center mb-6 bg-cyan-300 -mx-6 -mt-6 px-6 py-4">
      {back && (
        <button onClick={() => setCurrentScreen("main")}>
          <ChevronLeft className="w-5 h-5 text-gray-700 mr-3" />
        </button>
      )}
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
    </div>
  );

  // Notification Screen
  const NotificationScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <Header title="Notifications" back />
        
        {/* Conversation Tones */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Conversation tones</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationSettings.conversationTones}
                onChange={() => setNotificationSettings({
                  ...notificationSettings,
                  conversationTones: !notificationSettings.conversationTones
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-500">Play sounds for incoming and outgoing messages.</p>
        </div>

        {/* Messages Section */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Messages</h3>
          
          <div 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2 cursor-pointer hover:bg-gray-100"
            onClick={() => setShowToneModal("messageTone")}
          >
            <span>Notification tone</span>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">{notificationSettings.messageTone}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => setShowToneModal("messageVibrate")}
          >
            <span>Vibrate</span>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">{notificationSettings.messageVibrate}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Groups Section */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Groups</h3>
          
          <div 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2 cursor-pointer hover:bg-gray-100"
            onClick={() => setShowToneModal("groupTone")}
          >
            <span>Notification tone</span>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">{notificationSettings.groupTone}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => setShowToneModal("groupVibrate")}
          >
            <span>Vibrate</span>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">{notificationSettings.groupVibrate}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Calls Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Calls</h3>
          
          <div 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2 cursor-pointer hover:bg-gray-100"
            onClick={() => setShowToneModal("callTone")}
          >
            <span>Notification tone</span>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">{notificationSettings.callTone}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => setShowToneModal("callVibrate")}
          >
            <span>Vibrate</span>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">{notificationSettings.callVibrate}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tone Selection Modal */}
      {showToneModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {showToneModal.includes("Tone") ? "Notification tone" : "Vibrate"}
            </h2>
            {["Default", "Tone 1", "Tone 2", "Tone 3", "Silent"].map((option) => (
              <div 
                key={option} 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 rounded"
                onClick={() => {
                  setNotificationSettings({...notificationSettings, [showToneModal]: option});
                  setShowToneModal(null);
                }}
              >
                <span>{option}</span>
                {notificationSettings[showToneModal] === option && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
              </div>
            ))}
            <button
              onClick={() => setShowToneModal(null)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Profile Screen
  const ProfileScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <Header title="Profile" back />

        {/* Profile Image */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <img src={profile.image} alt="Profile" className="w-40 h-40 rounded-xl object-cover border" />
          <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100">
            <Camera className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Profile Fields */}
        <div className="space-y-4">
          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3">
            <span className="flex-1">
              <div className="text-xs text-gray-500">Name</div>
              <div className="font-medium">{profile.name}</div>
            </span>
            <Pencil className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3">
            <span className="flex-1">
              <div className="text-xs text-gray-500">About</div>
              <div className="font-medium">{profile.about}</div>
            </span>
            <Pencil className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3">
            <span className="flex-1">
              <div className="text-xs text-gray-500">Phone</div>
              <div className="font-medium">{profile.phone}</div>
            </span>
          </div>
        </div>

        {/* Delete Button */}
        <button className="mt-8 w-full bg-red-50 text-red-600 font-medium py-3 rounded-lg border border-red-200 hover:bg-red-100">
          Delete my account
        </button>
      </div>
    </div>
  );

  // Auto Deletion Screen
  const AutoDeletionSettings = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border p-8 w-full max-w-md">
        <Header title="Auto-Deletion Settings" back />
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="deletion"
              value="time-based"
              checked={deletionSetting === "time-based"}
              onChange={(e) => setDeletionSetting(e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">Time-based Deletion</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="deletion"
              value="manual"
              checked={deletionSetting === "manual"}
              onChange={(e) => setDeletionSetting(e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">Manual Deletion</span>
          </label>
        </div>
      </div>
    </div>
  );

  // Accounts → Privacy Screen
  const AccountsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <Header title="Privacy" back />

        <div className="space-y-3">
          {["lastSeen", "profilePhoto", "about", "status", "groups"].map((field) => (
            <div
              key={field}
              onClick={() => setShowPrivacyModal(field)}
              className="p-4 bg-gray-50 rounded-lg flex justify-between cursor-pointer hover:bg-gray-100"
            >
              <span className="capitalize">{field.replace(/([A-Z])/g, " $1")}</span>
              <span className="text-gray-500">{privacySettings[field]}</span>
            </div>
          ))}

          {/* Blocked Contacts */}
          <div
            onClick={() => setCurrentScreen("blocked")}
            className="p-4 bg-gray-50 rounded-lg flex justify-between cursor-pointer hover:bg-gray-100"
          >
            <span>Blocked contacts</span>
            <span className="text-gray-500">{blockedContacts.length}</span>
          </div>
        </div>
      </div>

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 capitalize">
              {showPrivacyModal.replace(/([A-Z])/g, " $1")}
            </h2>
            {["Everyone", "My contacts", "Nobody"].map((option) => (
              <label key={option} className="flex items-center space-x-3 mb-2 cursor-pointer">
                <input
                  type="radio"
                  name={showPrivacyModal}
                  value={option}
                  checked={privacySettings[showPrivacyModal] === option}
                  onChange={(e) =>
                    setPrivacySettings({ ...privacySettings, [showPrivacyModal]: e.target.value })
                  }
                />
                <span>{option}</span>
              </label>
            ))}
            <button
              onClick={() => setShowPrivacyModal(null)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Blocked Contacts Screen
  const BlockedContactsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <Header title="Blocked contacts" back />
        <div className="space-y-3">
          {blockedContacts.map((contact) => (
            <div key={contact.id} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
              <img src={contact.image} alt={contact.name} className="w-12 h-12 rounded-full" />
              <div>
                <div className="font-medium">{contact.name}</div>
                <div className="text-gray-500 text-sm">{contact.phone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main Settings
  const MainSettings = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center p-4">
      <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl h-[600px]">
        {/* Left Panel */}
        <div className="w-1/2 p-6">
          <Header title="Settings" />
          <div className="space-y-1">
            {/* Profile */}
            <div
              onClick={() => setCurrentScreen("profile")}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Profile</div>
                  <div className="text-sm text-gray-500">Change your profile details</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* Accounts */}
            <div
              onClick={() => setCurrentScreen("accounts")}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Accounts</div>
                  <div className="text-sm text-gray-500">Privacy, security, change number</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* Notifications */}
            <div
              onClick={() => setCurrentScreen("notifications")}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Notifications</div>
                  <div className="text-sm text-gray-500">Change your notification settings</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* Help */}
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Help</div>
                  <div className="text-sm text-gray-500">Help center, contact us, privacy policy</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-gradient-to-br from-cyan-100 to-cyan-200 flex flex-col items-center justify-center p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <span className="text-white text-2xl font-bold">IC</span>
            </div>
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Inochat</h2>
            <p className="text-gray-600 text-center leading-relaxed">
              Your conversations, your way.
              <br />
              Manage your account settings here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentScreen === "main" && <MainSettings />}
      {currentScreen === "profile" && <ProfileScreen />}
      {currentScreen === "auto-deletion" && <AutoDeletionSettings />}
      {currentScreen === "notifications" && <NotificationScreen />}
      {currentScreen === "accounts" && <AccountsScreen />}
      {currentScreen === "blocked" && <BlockedContactsScreen />}
    </>
  );
};

export default SettingsScreens;