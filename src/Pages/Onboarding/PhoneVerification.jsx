// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const PhoneVerificationScreen = () => {
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const navigate = useNavigate();

//   const handleContinue = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://35.154.10.237:5000/api/sign-up", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           name: name,
//           mobile: phone
//         })
//       });

//       const result = await response.json();

//       if (response.ok) {
//         // TEMP: Show OTP for testing in development
//         if (result.otp) {
//           console.log("DEBUG OTP:", result.otp);
//           alert(`Verification code sent! OTP `);
//         } else {
//           alert("Verification code sent! Check your phone.");
//         }

//         // Store for Verify OTP screen
//         localStorage.setItem('user_name', name);
//         localStorage.setItem('user_phone', phone);

//         navigate('/verify-otp');
//       } else {
//         alert(result?.message || 'Something went wrong');
//       }
//     } catch (error) {
//       console.error('API error:', error);
//       alert('Failed to send verification code');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 flex flex-col items-center justify-center px-4 relative">
//       {/* Logo */}
//       <div className="flex flex-col items-center space-y-2 mb-8">
//         <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center">
//           <span className="text-white text-2xl font-bold">IC</span>
//         </div>
//         <h1 className="text-blue-600 text-xl font-semibold">Inochat</h1>
//       </div>

//       <form
//         onSubmit={handleContinue}
//         className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
//       >
//         <h2 className="text-2xl font-semibold text-center text-gray-800">Phone Verification</h2>

//         <div>
//           <label className="block text-sm text-gray-600 mb-1">Name</label>
//           <input
//             type="text"
//             placeholder="Enter Your Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
//           <input
//             type="tel"
//             placeholder="Enter Your Phone number"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
//         >
//           Continue
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PhoneVerificationScreen;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const PhoneVerificationScreen = () => {
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleContinue = async (e) => {
//     e.preventDefault();

//     if (!name || name.length < 3) {
//       alert('Please enter a valid name (at least 3 characters)');
//       return;
//     }

//     if (!phone || phone.length !== 10) {
//       alert('Please enter a valid 10-digit phone number');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch("http://35.154.10.237:5000/api/sign-up", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           mobile: phone,
//           name: name,
//           isNewUser: true
//         })
//       });

//       const result = await response.json();

//       if (response.ok) {
//         localStorage.setItem('user_name', name);
//         localStorage.setItem('user_phone', phone);
//         localStorage.setItem('is_new_user', 'true');

//         // For development testing only
//         if (process.env.NODE_ENV === 'development' && result.otp) {
//           console.log("DEBUG OTP:", result.otp);
//         }

//         navigate('/verify-otp');
//       } else {
//         alert(result?.message || 'Registration failed');
//       }
//     } catch (error) {
//       console.error('Signup error:', error);
//       alert('Network error during signup');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 flex flex-col items-center justify-center px-4">
//       {/* Logo and Form */}
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-blue-600 text-2xl font-bold">Inochat</h1>
//         </div>

//         <form onSubmit={handleContinue} className="bg-white p-8 rounded-2xl shadow-md space-y-6">
//           <h2 className="text-2xl font-semibold text-center">Create Account</h2>

//           {/* Name and Phone Inputs */}
//           <div>
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-3 border rounded-md"
//               required
//               minLength={3}
//             />
//           </div>

//           <div>
//             <input
//               type="tel"
//               placeholder="Phone Number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
//               className="w-full p-3 border rounded-md"
//               maxLength={10}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-blue-600 text-white p-3 rounded-md disabled:opacity-70"
//           >
//             {isLoading ? 'Creating Account...' : 'Continue'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PhoneVerificationScreen;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PhoneVerificationScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!name || name.length < 3) {
      alert("Please enter a valid name (at least 3 characters)");
      return;
    }
    if (!phone || phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://35.154.10.237:5000/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: phone,
          name: name,
          isNewUser: true,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("user_name", name);
        localStorage.setItem("user_phone", phone);
        localStorage.setItem("is_new_user", "true"); // ✅ Mark signup
        console.log("OTP:", result.otp);
        navigate("/verify-otp");
      } else {
        alert(result?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Network error during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-blue-600 text-2xl font-bold">Inochat</h1>
        </div>
        <form
          onSubmit={handleContinue}
          className="bg-white p-8 rounded-2xl shadow-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center">Create Account</h2>
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md"
              required
              minLength={3}
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="w-full p-3 border rounded-md"
              maxLength={10}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-md disabled:opacity-70"
          >
            {isLoading ? "Creating Account..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneVerificationScreen;
