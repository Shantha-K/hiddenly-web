// Status.js
import React from "react";

const Status = () => {
  return (
    <div className="h-full p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">Status</h2>

      {/* My Status */}
      <div className="mb-6">
        <p className="font-semibold mb-1">My Status</p>
        <p className="text-sm text-gray-500">Tap to add status update</p>
      </div>

      {/* Unseen */}
      <div className="mb-6">
        <p className="font-semibold mb-2">Unseen</p>
        <div className="flex justify-between mb-2">
          <div>
            <p>Ann Bates</p>
            <p className="text-xs text-gray-500">New status available</p>
          </div>
          <p className="text-xs text-gray-400">1 min ago</p>
        </div>
        <div className="flex justify-between mb-2">
          <div>
            <p>Martha Gram</p>
            <p className="text-xs text-gray-500">New status available</p>
          </div>
          <p className="text-xs text-gray-400">2 min ago</p>
        </div>
      </div>

      {/* Seen */}
      <div>
        <p className="font-semibold mb-2">Seen</p>
        <div className="flex justify-between mb-2">
          <div>
            <p>Betty Lynch</p>
            <p className="text-xs text-gray-500">Viewed 12 minutes ago</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p>Alexander Scott</p>
            <p className="text-xs text-gray-500">Viewed 30 minutes ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;