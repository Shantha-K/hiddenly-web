import React from "react";
import { useNavigate } from "react-router-dom";

const AccountCreatedScreen = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/"); // change this to your chat/home route
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center">
          <span className="text-white text-3xl font-bold">IC</span>
        </div>
        <h1 className="text-blue-600 text-lg font-semibold mt-2">Inochat</h1>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4315/4315445.png" // You can replace with your thumbs up image
          alt="Thumbs Up"
          className="w-20 h-20 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800">Account Created!</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Dear user, your account has been created successfully. Continue to{" "}
          <strong>Start Chatting</strong> in Inochat.
        </p>
        <button
          onClick={handleContinue}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
        >
          Continue
        </button>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-4">
        Made with <span className="text-blue-600 font-bold">Yrisily</span>
      </p>
    </div>
  );
};

export default AccountCreatedScreen;
