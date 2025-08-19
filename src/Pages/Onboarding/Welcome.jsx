import React, { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Inochat from "../../assets/Inochat.png";

// Lazy import the login screen
const LoginScreen = React.lazy(() => import("../Onboarding/LoginScreen"));

const InochatLoadingScreen = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 flex flex-col items-center justify-center relative">
      {/* Main content container */}
      <div className="flex flex-col items-center space-y-6">
        {/* App icon */}
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-lg flex items-center justify-center">
          <img
            src={Inochat}
            alt="App Logo"
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* App name */}
        <h1 className="text-blue-600 text-4xl font-light tracking-wide">
          Inochat
        </h1>

        {/* Sign In / Sign Up buttons */}
        <div className="mt-8 flex flex-col space-y-4">
           <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 shadow-lg"
        onClick={() => navigate("/set-Phoneverficationsignin")}
      >
        Sign In
      </button>
          {/* <button
            onClick={handleSignUp}
            className="bg-transparent hover:bg-blue-50 text-blue-500 border-2 border-blue-500 px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200"
          >
            Sign Up
          </button> */}
        </div>
      </div>

      

      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default InochatLoadingScreen;
