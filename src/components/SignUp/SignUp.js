import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import "../Login/Login.css";

export default function SignUp({ onSwitchToSignIn, rightOnly = false }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // fake signup
    setTimeout(() => {
      setLoading(false);
      alert("Sign Up Successful! Please sign in.");
    }, 1500);
  };

  const rightSection = (
    <div className="right">
      <div className="login-card">
            <div className="logo">🏫 Sitemark</div>
            <h2 className="title">Sign up</h2>

            <form onSubmit={handleSignUp}>
              {/* Name */}
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />

              {/* Email */}
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />

              {/* Password */}
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
              />

              {/* Confirm Password */}
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                {loading ? "Please wait..." : "Sign up"}
              </button>

              {/* Forgot */}
              <p className="forgot">Already have an account?</p>

              {/* Divider */}
              <div className="divider">
                <span>or</span>
              </div>

              {/* Social */}
              <button type="button" className="social-btn">
                <FcGoogle style={{ marginRight: '8px' }} />
                Sign up with Google
              </button>

              <button type="button" className="social-btn">
                <FaFacebook style={{ marginRight: '8px', color: '#1877f2' }} />
                Sign up with Facebook
              </button>

              {/* Signin */}
              <p className="signup-text">
                Already have an account? <span onClick={onSwitchToSignIn} style={{ cursor: 'pointer' }}>Sign in</span>
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

          <div className="lottie-animation">
            {/* Lottie animation would go here */}
          </div>
        </div>

        {rightSection}
      </div>
    </div>
  );
}
