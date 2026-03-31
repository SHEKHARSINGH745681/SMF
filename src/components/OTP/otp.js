import React, { useState, useEffect, useRef } from "react";
import "./Otp.css";

function Otp({ onVerify, username, duration = 60, onResend, apiError }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);

  const inputsRef = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move focus to next input if value entered
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
    // move focus back if value cleared
    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timeLeft <= 0) {
      setLocalError("OTP expired. Please login again.");
      return;
    }

    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setLocalError("Please enter complete OTP");
      return;
    }

    setLocalError(""); 
    onVerify(enteredOtp); // ✅ send OTP to Login for API verification
  };

  const handleResend = () => {
    if (onResend) onResend();
    setOtp(["", "", "", ""]);
    setTimeLeft(duration);
    setLocalError("");
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="otp-overlay">
      <div className="otp-popup">
        <h2>Enter OTP</h2>
        <p>We sent the code to your email: <strong>{username}</strong></p>
        <p>OTP valid for <strong>{timeLeft}s</strong></p>

        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                ref={(el) => (inputsRef.current[index] = el)}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Show local validation errors or API errors */}
          {(localError || apiError) && (
            <p className="otp-error">{localError || apiError}</p>
          )}

          <button type="submit" disabled={timeLeft <= 0}>Verify OTP</button>
        </form>

        <p className="resend">
          Didn't receive code? <span onClick={handleResend}>Resend</span>
        </p>
      </div>
    </div>
  );
}

export default Otp;