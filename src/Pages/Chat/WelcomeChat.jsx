import React from 'react';
import { useNavigate } from 'react-router-dom';

const InotChatLanding = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to the contacts route
    navigate('/Contacts');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex flex-col">
      {/* Main content container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Welcome heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-12 tracking-tight">
          Welcome to InotChat Web
        </h1>
        
        {/* Get Started button */}
        <button 
          onClick={handleGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default InotChatLanding;