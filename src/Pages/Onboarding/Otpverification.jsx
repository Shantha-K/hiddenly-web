// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const OTPVerification = () => {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [timer, setTimer] = useState(60);
//   const navigate = useNavigate();

//   // Handle OTP input change
//   const handleChange = (value, index) => {
//     if (!/^\d*$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto focus next
//     if (value && index < 3) {
//       document.getElementById(`otp-${index + 1}`).focus();
//     }

//     // Auto submit when all digits filled (optional)
//     if (index === 3 && newOtp.every((d) => d.length === 1)) {
//       handleSubmit(newOtp.join(""));
//     }
//   };

//   // Handle OTP submit
//   const handleSubmit = async (enteredOtp) => {
//     const fullOtp = enteredOtp || otp.join("");

//     if (timer === 0) {
//       alert("OTP expired. Please resend.");
//       return;
//     }

//     if (fullOtp.length !== 4) {
//       alert("Please enter the full 4-digit OTP.");
//       return;
//     }

//     const mobile = localStorage.getItem("user_phone");
//     const raw = JSON.stringify({ mobile, otp: fullOtp });

//     try {
//       const response = await fetch("http://35.154.10.237:5000/api/verify-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: raw
//       });

//       const result = await response.json();
//       console.log("API Response:", result);

//       if (response.ok) {
//         // Clear localStorage and navigate
//         localStorage.removeItem("user_name");
//         localStorage.removeItem("user_phone");
//         navigate("/set-password");
//       } else {
//         alert(result.message || "OTP verification failed");
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   // Handle resend OTP
//   const handleResend = async () => {
//     const mobile = localStorage.getItem("user_phone");
//     const name = localStorage.getItem("user_name");

//     try {
//       const response = await fetch("http://35.154.10.237:5000/api/resend-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ name, mobile })
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert("OTP resent successfully!");
//         setTimer(60);
//         setOtp(["", "", "", ""]);
//       } else {
//         alert(result.message || "Failed to resend OTP");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong.");
//     }
//   };

//   // Countdown timer
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200">
//       <div className="bg-white p-8 rounded-xl shadow-md w-[400px] text-center">
//         <div className="mb-6">
//           <h1 className="text-blue-700 font-bold text-xl">Inochat</h1>
//         </div>

//         <h2 className="text-lg font-semibold mb-1">Verify Account</h2>
//         <p className="text-gray-600 text-sm mb-4">
//           Enter the 4-digit OTP sent to your registered number.
//         </p>

//         <div className="flex justify-center gap-3 mb-3">
//           {otp.map((digit, idx) => (
//             <input
//               key={idx}
//               id={`otp-${idx}`}
//               maxLength="1"
//               className="w-12 h-12 text-center border border-gray-300 rounded text-lg"
//               value={digit}
//               onChange={(e) => handleChange(e.target.value, idx)}
//               disabled={timer === 0}
//             />
//           ))}
//         </div>

//         <p className="text-gray-500 text-sm mb-3">Remaining: 00:{String(timer).padStart(2, "0")}</p>

//         <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
//         <button
//           onClick={handleResend}
//           disabled={timer > 0}
//           className={`text-sm text-blue-600 underline mb-4 ${timer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
//         >
//           Resend Code
//         </button>

//         <button
//           onClick={() => handleSubmit()}
//           className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OTPVerification;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle OTP input
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    if (index === 3 && newOtp.every(d => d.length === 1)) {
      handleSubmit(newOtp.join(''));
    }
  };

  // Handle OTP submission
  const handleSubmit = async (enteredOtp = '') => {
    const fullOtp = enteredOtp || otp.join('');
    
    if (timer === 0) {
      alert('OTP expired. Please resend.');
      return;
    }

    if (fullOtp.length !== 4) {
      alert('Please enter the full 4-digit OTP');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("http://35.154.10.237:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: localStorage.getItem('user_phone'),
          otp: fullOtp
        })
      });

      const result = await response.json();

      if (response.ok) {
        const isNewUser = localStorage.getItem('is_new_user') === 'true';
        
        // Cleanup storage
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_phone');
        localStorage.removeItem('is_new_user');
        
        // Route based on user type
        navigate(isNewUser ? '/set-password' : '/contacts');
      } else {
        alert(result.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Network error during verification');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP resend
  const handleResend = async () => {
    const mobile = localStorage.getItem('user_phone');
    const name = localStorage.getItem('user_name');

    try {
      const response = await fetch("http://35.154.10.237:5000/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile })
      });

      const result = await response.json();

      if (response.ok) {
        alert('OTP resent successfully!');
        setTimer(60);
        setOtp(['', '', '', '']);
      } else {
        alert(result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to resend OTP');
    }
  };

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md text-center">
        <h1 className="text-blue-600 text-2xl font-bold mb-2">Inochat</h1>
        <h2 className="text-xl font-semibold mb-2">Verify Account</h2>
        <p className="text-gray-600 mb-6">Enter the 4-digit OTP sent to your number</p>
        
        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength="1"
              value={otp[idx]}
              onChange={(e) => handleChange(e.target.value, idx)}
              className="w-14 h-14 text-center border-2 border-gray-300 rounded-lg text-xl"
              disabled={timer === 0 || isLoading}
            />
          ))}
        </div>
        
        <p className="text-gray-500 mb-2">
          {timer > 0 ? `Code expires in 00:${String(timer).padStart(2, '0')}` : 'Code expired'}
        </p>
        
        <button
          onClick={handleResend}
          disabled={timer > 0}
          className={`text-blue-600 underline mb-6 ${timer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Resend Code
        </button>
        
        <button
          onClick={() => handleSubmit()}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-70"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;