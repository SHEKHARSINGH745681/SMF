// App.js

import React, { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import TeacherDashboard from "./components/Dashboard/TeacherDashboard";
import "./components/Login/Login.css";

/**
 * LottieLoginPanel
 * Isolated component so its own useEffect fires on mount — guarantees
 * lottieContainer.current is set when the animation initialises, regardless
 * of how the parent router got here (redirect vs. direct load).
 */
function LottieLoginPanel() {
  const lottieContainer = useRef(null);

  useEffect(() => {
    if (!lottieContainer.current) return;
    const anim = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/animations/login.json",
    });
    return () => anim.destroy();
  }, []);

  return (
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
  );
}

function AppRoutes() {
  const [isSignUpView, setIsSignUpView] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLoginSuccess = (userEmail) => {
    setIsLoggedIn(true);
    setUsername(userEmail);
    if (userEmail?.toLowerCase() === "student@gmail.com") {
      navigate("/studentdashboard");
      return;
    }
    if (userEmail?.toLowerCase() === "teacher@gmail.com") {
      navigate("/teacherdashboard");
      return;
    }
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
          /* Single root element — login-wrapper covers 100vh with the purple
             gradient, so no gray body flash. Footer sits inside the wrapper. */
          <div className="login-wrapper" style={{ position: 'relative' }}>
            <div className="container">
              <LottieLoginPanel />
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
            <footer style={{
              position: 'absolute',
              bottom: '10px',
              right: '14px',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'Poppins, sans-serif',
              pointerEvents: 'none',
            }}>
              © 2026 SchoolOne. All Rights Reserved
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
      <Route
        path="/studentdashboard"
        element={
          isLoggedIn ? (
            <StudentDashboard username={username} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/teacherdashboard"
        element={
          isLoggedIn ? (
            <TeacherDashboard username={username} onLogout={handleLogout} />
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