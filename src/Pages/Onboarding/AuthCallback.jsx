// src/Pages/AuthCallback.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract query params or hash from URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // after #
    const token = hashParams.get("access_token"); // or `code` depending on provider

    if (token) {
      // Save token in localStorage/sessionStorage
      localStorage.setItem("authToken", token);

      // Redirect to dashboard or home
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <h2 className="text-lg font-bold">Processing authentication...</h2>
    </div>
  );
};

export default AuthCallback;
