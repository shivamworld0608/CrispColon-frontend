import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Model from "./Pages/Model";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import MyProfile from "./Pages/Profile";
import Payment from "./Pages/Payment";

const App = () => {
  const [authUser, setAuthUser] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    console.log("In App.jsx Cookies:", document.cookie); // Log cookies
    const token = getCookie("token"); // Retrieve the token from cookies
    console.log("Token:", token);
    setAuthUser(!!token);
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("AuthUser state updated:", authUser); // Log updated authUser state
  }, [authUser]); // Log whenever authUser changes

  if (loading) {
    return <div>Loading...</div>; // Render loading state
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/payment" element={<Payment />} />

        <Route
          path="/check"
          element={authUser ? <Model /> : <Navigate to="/signup" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
