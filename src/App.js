import React,{useState, useEffect} from 'react'
import MyRides from "./components/MyRides"
import Dashboard from "./Dashboard"
import {BrowserRouter, Routes, Navigate, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import NoPage from './pages/NoPage'
import SignUp from './pages/SignUp'
import Account from './pages/Account'
import Navbar from './pages/Navbar'; // Adjust the import path as needed
import PasswordReset from './pages/PasswordReset'
import PasswordResetFinal from './pages/PasswordResetFinal'
import Careers from './pages/Careers'

function App() {
   return <div>
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Navigate replace to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/account" element={<Account />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/passwordReset" element={<PasswordReset />} />
      <Route path="/reset_Password/:token" element={<PasswordResetFinal />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
    </BrowserRouter>
  </div>;
}

export default App