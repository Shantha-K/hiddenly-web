import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Lazy load your pages
const InochatLoadingScreen = lazy(() => import('./Pages/Onboarding/Welcome'));
const LoginScreen = lazy(() => import('./Pages/Onboarding/LoginScreen')); 
const PhoneVerificationScreen = lazy(() => import('./Pages/Onboarding/PhoneVerification'));
const OTPVerification = lazy(() => import('./Pages/Onboarding/Otpverification'));
const Setpassword = lazy(() => import('./Pages/Onboarding/Setpassword'));// adjust path as needed

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<InochatLoadingScreen />} />
          <Route path="/login" element={<LoginScreen />} />
           <Route path="/verify/phone" element={<PhoneVerificationScreen />} />
             <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/set-password" element={<Setpassword />} />
           
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
