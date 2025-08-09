// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SetPassword = () => {
//   const [email, setEmail] = useState("");
//   const [qrText, setQrText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [qrImage, setQrImage] = useState(null);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // 1. First make the API call
//       const response = await fetch(
//         "http://35.154.10.237:5000/api/generate-qr",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZGY5MWFmMC1kOGQzLTRjZTMtOWE2Yi0xMWY5OGU5NjRjMDAiLCJtb2JpbGUiOiI5ODc2NTQzMjIiLCJpYXQiOjE3NTQ1ODM0MjMsImV4cCI6MTc1NTE4ODIyM30.eaD8vWwmY5adVzpVvOQi-wYmBayv3HgawP9KJGBKy6w"
//           },
//           body: JSON.stringify({
//             email: email,
//             qrText: qrText || `QR for ${email}`
//           })
//         }
//       );

//       // 2. Check if response is OK
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to generate QR code");
//       }

//       // 3. Try to parse response in different ways
//       const result = await response.json();
//       console.log("Full API Response:", result);

//       // 4. Check for QR code in different possible formats
//       let qrUrl = null;
      
//       // Case 1: Direct image data (base64)
//       if (result.data && result.data.startsWith("data:image")) {
//         qrUrl = result.data;
//       }
//       // Case 2: URL string
//       else if (result.qrCodeUrl) {
//         qrUrl = result.qrCodeUrl;
//       }
//       // Case 3: Nested object
//       else if (result.data && result.data.qrCode) {
//         qrUrl = result.data.qrCode;
//       }
//       // Case 4: Binary image data
//       else if (result instanceof Blob) {
//         qrUrl = URL.createObjectURL(result);
//       }

//       if (!qrUrl) {
//         console.warn("Couldn't find QR code in response. Trying alternative approach...");
        
//         // Alternative approach: Generate QR client-side as fallback
//         const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
//           qrText || email || "No content provided"
//         )}`;
//         qrUrl = fallbackUrl;
//       }

//       setQrImage(qrUrl);
      
//     } catch (error) {
//       console.error("API Error Details:", error);
//       setError(error.message);
      
//       // Fallback QR generation
//       const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
//         qrText || email || "Error occurred"
//       )}`;
//       setQrImage(fallbackUrl);
      
//       alert("QR generation failed. Using fallback method.\nError: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100 px-4">
//       <div className="flex flex-col items-center space-y-4 w-full max-w-md">
//         {/* Form Content */}
//         <div className="bg-white shadow-xl p-8 rounded-lg w-full">
//           <h2 className="text-center text-xl font-bold mb-6">Generate QR</h2>

//           {error && (
//             <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
//               Note: {error} (Using fallback QR generator)
//             </div>
//           )}

//           {qrImage ? (
//             <div className="text-center space-y-4">
//               <h3 className="font-medium">Your QR Code:</h3>
//               <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
//                 <img
//                   src={qrImage}
//                   alt="Generated QR Code"
//                   className="max-w-full h-64 object-contain border rounded"
//                   onError={(e) => {
//                     e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Error+loading+QR`;
//                   }}
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setQrImage(null)}
//                   className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md"
//                 >
//                   Generate Another
//                 </button>
//                 <button
//                   onClick={() => navigate("/Accountcreated", { state: { qrImage } })}
//                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
//                 >
//                   Continue
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               {/* Email Input */}
//               <div>
//                 <label className="block mb-1 font-medium text-sm text-gray-700">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="your.email@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               {/* QR Text Input */}
//               <div>
//                 <label className="block mb-1 font-medium text-sm text-gray-700">
//                   QR Code Content
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter text for QR code"
//                   value={qrText}
//                   onChange={(e) => setQrText(e.target.value)}
//                   className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Generating...
//                   </>
//                 ) : "Generate QR Code"}
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SetPassword; 


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";

// Your Google OAuth credentials
const CLIENT_ID = "403492068330-4lp0vvsvl6frhnjk64ff1aqqpo8757qo.apps.googleusercontent.com";
const API_KEY = "AIzaSyCaUi9Ulf6xNfeYw4DAQ1oj3rSESj-wBKc";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

const SetPassword = () => {
  const [email, setEmail] = useState("");
  const [qrText, setQrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const navigate = useNavigate();

  // Load Google API Client
  useEffect(() => {
    function initClient() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        })
        .then(() => {
          console.log("Google API initialized");
        });
    }
    gapi.load("client:auth2", initClient);
  }, []);

  const handleGoogleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
      setAccessToken(token);
      console.log("Google Drive Access Token:", token);
    });
  };

  const uploadToGoogleDrive = async (qrUrl) => {
    if (!accessToken) {
      alert("Please sign in with Google first.");
      return;
    }
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();

      const metadata = {
        name: `QR_${Date.now()}.png`,
        mimeType: "image/png",
      };

      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      form.append("file", blob);

      const uploadRes = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
          body: form,
        }
      );

      const data = await uploadRes.json();
      console.log("Uploaded to Drive:", data);
      alert("QR uploaded to Google Drive successfully!");
    } catch (err) {
      console.error("Drive Upload Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://35.154.10.237:5000/api/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZGY5MWFmMC1kOGQzLTRjZTMtOWE2Yi0xMWY5OGU5NjRjMDAiLCJtb2JpbGUiOiI5ODc2NTQzMjIiLCJpYXQiOjE3NTQ1ODM0MjMsImV4cCI6MTc1NTE4ODIyM30.eaD8vWwmY5adVzpVvOQi-wYmBayv3HgawP9KJGBKy6w",
        },
        body: JSON.stringify({
          email: email,
          qrText: qrText || `QR for ${email}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate QR code");
      }

      const result = await response.json();
      console.log("Full API Response:", result);

      let qrUrl = null;

      if (result.data && result.data.startsWith("data:image")) {
        qrUrl = result.data;
      } else if (result.qrCodeUrl) {
        qrUrl = result.qrCodeUrl;
      } else if (result.data && result.data.qrCode) {
        qrUrl = result.data.qrCode;
      } else if (result instanceof Blob) {
        qrUrl = URL.createObjectURL(result);
      }

      if (!qrUrl) {
        qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          qrText || email || "No content provided"
        )}`;
      }

      setQrImage(qrUrl);

      // Upload automatically after generation if signed in
      if (accessToken) {
        await uploadToGoogleDrive(qrUrl);
      }

    } catch (error) {
      console.error("API Error Details:", error);
      setError(error.message);
      setQrImage(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          qrText || email || "Error occurred"
        )}`
      );
      alert("QR generation failed. Using fallback method.\nError: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100 px-4">
      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        <div className="bg-white shadow-xl p-8 rounded-lg w-full">
          <h2 className="text-center text-xl font-bold mb-6">Generate QR</h2>

          {error && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
              Note: {error} (Using fallback QR generator)
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            className="mb-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
          >
            Sign in with Google
          </button>

          {qrImage ? (
            <div className="text-center space-y-4">
              <h3 className="font-medium">Your QR Code:</h3>
              <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                <img
                  src={qrImage}
                  alt="Generated QR Code"
                  className="max-w-full h-64 object-contain border rounded"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setQrImage(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md"
                >
                  Generate Another
                </button>
                <button
                  onClick={() => navigate("/Accountcreated", { state: { qrImage } })}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">QR Code Content</label>
                <input
                  type="text"
                  placeholder="Enter text for QR code"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md flex items-center justify-center"
              >
                {loading ? "Generating..." : "Generate QR Code"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetPassword;



