import React,{useState, useEffect} from 'react'
import MyRides from "./components/MyRides"
import Dashboard from "./Dashboard"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import NoPage from './pages/NoPage'
import SignUp from './pages/SignUp'

function App() {
   return <div>
    <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
    </BrowserRouter>
  </div>;
}

export default App