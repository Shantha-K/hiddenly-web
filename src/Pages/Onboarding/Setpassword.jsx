import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const SetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100 px-4">
      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center">
          <div className="bg-blue-600 text-white text-3xl font-bold p-4 rounded-2xl">
            IC
          </div>
          <h1 className="text-xl font-semibold mt-2">Inochat</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl p-8 rounded-lg w-full">
          <h2 className="text-center text-xl font-bold mb-6">Set Your Password</h2>

          <form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-sm text-gray-700">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border rounded-md px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
