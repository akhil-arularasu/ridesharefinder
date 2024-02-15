import React,{useState, useEffect} from 'react'
import MyRides from "./components/MyRides"
import Dashboard from "./Dashboard"
import {useLocation, useNavigate, BrowserRouter, Routes, Navigate, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import NoPage from './pages/NoPage'
import SignUp from './pages/SignUp'
import Faq from './pages/Faq'
import Account from './pages/Account'
import Navbar from './pages/Navbar'; // Adjust the import path as needed
import PasswordReset from './pages/PasswordReset'
import PasswordResetFinal from './pages/PasswordResetFinal'
import Careers from './pages/Careers'


function LowerCaseRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.pathname.includes('reset')) {
      const lowercasePath = location.pathname.toLowerCase();

    if (location.pathname !== lowercasePath && !location.pathname.match(/^\/reset_password\/[^/]+$/)) {
      navigate(lowercasePath, { replace: true });
    }
  }
  }, [location, navigate]);

  return null;
}

function App() {
   return <div>
    <BrowserRouter>
    <LowerCaseRedirect /> {/* Include LowerCaseRedirect here */}
    <Navbar />
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/account" element={<Account />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/passwordreset" element={<PasswordReset />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/reset_password/:token" element={<PasswordResetFinal />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
    </BrowserRouter>
  </div>;
}

export default App