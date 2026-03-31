// App.js

import React, { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";
import "./components/Login/Login.css";


function AppRoutes() {
  const [isSignUpView, setIsSignUpView] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const lottieContainer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/animations/login.json",
    });
    return () => anim.destroy();
  }, []);

  const handleLoginSuccess = (userEmail) => {
    setIsLoggedIn(true);
    setUsername(userEmail);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div style={{ position: 'relative', minHeight: '100vh' }}>
            <div className="login-wrapper">
              <div className="container">
                <div className="left">
                  <h1>
                    Department of School Education <br />
                    Uttar Pradesh
                  </h1>
                  <p>
                    Keep learning, keep growing, and keep achieving new heights every day 📚
                  </p>
                  <div ref={lottieContainer} className="lottie-animation"></div>
                </div>
                {isSignUpView ? (
                  <SignUp
                    rightOnly
                    onSwitchToSignIn={() => setIsSignUpView(false)}
                  />
                ) : (
                  <Login
                    rightOnly
                    onSwitchToSignUp={() => setIsSignUpView(true)}
                    onLoginSuccess={handleLoginSuccess}
                  />
                )}
              </div>
            </div>
            <footer style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              fontSize: '12px',
              color: '#666'
            }}>
              © 2026 SchoolOne. All Rights Reserved Privacy Policy Version 
            </footer>
          </div>
        }
      />
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <Dashboard username={username} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;