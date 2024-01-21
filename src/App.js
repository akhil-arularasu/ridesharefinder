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
      <Route path="/" element={<Navigate replace to="/Home" />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/dashboard" element={<Navigate replace to="/Dashboard" />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Account" element={<Account />} />
      <Route path="/Careers" element={<Careers />} />
      <Route path="/PasswordReset" element={<PasswordReset />} />
      <Route path="/Reset_Password/:token" element={<PasswordResetFinal />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
    </BrowserRouter>
  </div>;
}

export default App