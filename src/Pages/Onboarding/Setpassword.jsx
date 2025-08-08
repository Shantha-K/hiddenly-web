import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook

const SetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState(null);

  const navigate = useNavigate(); // ✅ Create navigate instance

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZGY5MWFmMC1kOGQzLTRjZTMtOWE2Yi0xMWY5OGU5NjRjMDAiLCJtb2JpbGUiOiI5ODc2NTQzMjIiLCJpYXQiOjE3NTQ1ODM0MjMsImV4cCI6MTc1NTE4ODIyM30.eaD8vWwmY5adVzpVvOQi-wYmBayv3HgawP9KJGBKy6w"
      );

      const raw = JSON.stringify({
        email: email,
        qrText: `this is my qr for ${email}`
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(
        "http://35.154.10.237:5000/api/generate-qr",
        requestOptions
      );

      const result = await response.json();

      if (response.ok) {
        alert("QR Generated Successfully!");
        console.log("QR API Result:", result);
        setQrImage(result.qrCodeUrl || null);

        
        navigate("/Accountcreated", { state: { qrImage: result.qrCodeUrl } });
      } else {
        alert(result?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("QR API Error:", error);
      alert("Failed to generate QR");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-center text-xl font-bold mb-6">
            Set Your Password & Generate QR
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-sm text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium text-sm text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {/* Eye Icon */}
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    // Eye open SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white bg-gray-700 rounded-full p-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    // Eye closed SVG
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white bg-gray-700 rounded-full p-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.373-4.592M6.343 6.343A9.956 9.956 0 0112 5c4.477 0 8.267 2.943 9.541 7a9.956 9.956 0 01-4.129 5.178M15 12a3 3 0 01-3 3m0 0a3 3 0 01-3-3m6 0a3 3 0 00-3-3m0 0a3 3 0 00-3 3"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 18"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
            >
              {loading ? "Generating..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
