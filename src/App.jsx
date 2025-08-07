import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Lazy load your pages
const InochatLoadingScreen = lazy(() => import('./Pages/Onboarding/Welcome'));
const LoginScreen = lazy(() => import('./Pages/Onboarding/LoginScreen')); // adjust path as needed

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<InochatLoadingScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
