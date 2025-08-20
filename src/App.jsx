import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Lazy load your pages
const InochatLoadingScreen = lazy(() => import("./Pages/Onboarding/Welcome"));
const LoginScreen = lazy(() => import("./Pages/Onboarding/LoginScreen"));
const PhoneVerificationScreen = lazy(() =>
  import("./Pages/Onboarding/PhoneVerification")
);
const OTPVerification = lazy(() =>
  import("./Pages/Onboarding/Otpverification")
);
const Setpassword = lazy(() => import("./Pages/Onboarding/Setpassword"));
const Qrscan = lazy(() => import("./Pages/Onboarding/Qrscan"));
const Accountcreated = lazy(() => import("./Pages/Onboarding/Accountcreated"));
const Phoneverficationsignin = lazy(() => import("./Pages/Onboarding/Phoneverficationsignin"));
const WelcomeChat= lazy(() => import("./Pages/Chat/WelcomeChat"));
const AuthCallback = lazy(() => import("./Pages/Onboarding/AuthCallback"));
const Contacts = lazy(() => import("./Pages/Chat/Contacts"));
const ChatWindow = lazy(() => import("./Pages/Chat/ChatWindow"));
const GroupContcats = lazy(() => import("./Pages/Chat/GroupContcats"));


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
  <Route path="/qrscan" element={<Qrscan />} />
  <Route path="/Accountcreated" element={<Accountcreated />} /> {/* ✅ fixed */}
  <Route path="/WelcomeChat" element={<WelcomeChat />} />       {/* ✅ fixed */}
  <Route path="/set-Phoneverficationsignin" element={<Phoneverficationsignin />} />
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route path="/Contacts" element={<Contacts />} />
   <Route path="/chat/:mobile" element={<ChatWindow />} />
     <Route path="/GroupContcats" element={<GroupContcats />} />
   
</Routes>
      </Suspense>
    </Router>
  );
}

export default App;
