// src/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import "../css/Registration.css"; // CSS for styling
import { useNavigate } from "react-router-dom"; // For navigation
import baseURL from "../base_url";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Track the current step
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const response = await axios.post(`${baseURL}/api/auth/send-login-otp`, {
        companyEmail: email,
      });
      alert(response.data.message); // Show success message
      setStep(2); // Move to the next step to enter OTP
    } catch (error) {
      alert(
        error.response
          ? error.response.data.message
          : "An unexpected error occurred."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/verify-login-otp`,
        { companyEmail: email, otp }
      );

      alert(response.data.message); // Show success message
      localStorage.setItem("token", response.data.token); // Save token to local storage
      localStorage.setItem(
        "companyData",
        JSON.stringify(response.data.companyData)
      ); // Save company data to local storage
      window.location.replace("/"); // Redirect to the homepage or dashboard
    } catch (error) {
      alert(
        error.response
          ? error.response.data.message
          : "An unexpected error occurred."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="left-section">
        <h1>Cuvette</h1>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley.
        </p>
      </div>
      <div className="right-section">
        <form className="registration-form">
          <h2>Log In</h2>
          <h2>{step === 1 ? "Enter Your Email" : "Verify OTP"}</h2>
          {step === 1 ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={processing}
                onClick={handleEmailSubmit}
              >
                {processing ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={processing}
                onClick={handleOtpVerify}
              >
                {processing ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}
          <p className="login-link">
            Don't have an account?{" "}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
