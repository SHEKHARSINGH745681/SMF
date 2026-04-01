
import React, { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ onSwitchToSignUp, rightOnly = false, onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lottieContainer = useRef(null);

  useEffect(() => {
    if (rightOnly || !lottieContainer.current) {
      return undefined;
    }

    const anim = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/animations/login.json",
    });

    return () => anim.destroy();
  }, [rightOnly]);

  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   if (!email || !password) {
  //     setError("Please fill all fields");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   fetch("https://localhost:7225/api/Login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ email, password })
  //   })
  //     .then(async (response) => {
  //       setLoading(false);
  //       if (!response.ok) {
  //         // Try to parse error message from response
  //         let errorMsg = "Login failed";
  //         try {
  //           const data = await response.json();
  //           errorMsg = data.message || errorMsg;
  //         } catch (err) {}
  //         setError(errorMsg);
  //         return;
  //       }
  //       // Success
  //       const data = await response.json();
  //       if (onLoginSuccess) {
  //         // Pass only email (or adjust as needed)
  //         onLoginSuccess(data.email || "");
  //       }
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       setError("Network error. Please try again.");
  //     });
  // };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    // Dummy login logic for testing
    setTimeout(() => {
      setLoading(false);
      if (email === "admin" && password === "1234") {
        if (onLoginSuccess) onLoginSuccess(email);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password (try admin / 1234)");
      }
    }, 700);
  };

  const rightSection = (
    <div className="right">
      <div className="login-card">

            <h3 className="logo">A Product of  BThrust</h3>
            <h2 className="title">Sign in</h2>

            <form onSubmit={handleLogin}>

              {/* Email */}
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              className=""
              />

              {/* Password */}
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="login-error">{error}</p>}

              {/* Remember */}
              <div className="options">
                <label>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}>
                {loading ? "Please wait..." : "Sign in"}
              </button>

              {/* Forgot */}
              <p className="forgot">Forgot your password?</p>

              {/* Divider */}
              <div className="divider">
                <span>or</span>
              </div>

              {/* Social */}
              <button type="button" className="social-btn">
                <FcGoogle style={{ marginRight: '8px' }} />
                Sign in with Google
              </button>

              <button type="button" className="social-btn">
                <FaFacebook style={{ marginRight: '8px', color: '#1877f2' }} />
                Sign in with Facebook
              </button>

              {/* Signup */}
              <p className="signup-text">
                Don’t have an account? <span onClick={onSwitchToSignUp} style={{ cursor: 'pointer' }}>Sign up</span>
              </p>

            </form>
      </div>
    </div>
  );

  if (rightOnly) {
    return rightSection;
  }

  return (  
    <div className="login-wrapper">
      <div className="container">
        {/* LEFT SECTION */}
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

        {rightSection}
      </div>
    </div>
  );
}