import React, { useState } from "react";
import axios from "axios";
import "../css/VerifyPage.css";
import { useNavigate } from "react-router-dom";
import baseURL from "../base_url";

const VerifyPage = () => {
  const [emailOtp, setEmailOtp] = useState('');
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState(JSON.parse(localStorage.getItem("companyData")));
  const navigate = useNavigate();

  const handleEmailVerify = async () => {
    setProcessing(true);
    const data = {
      companyEmail: formData.companyEmail,
      otp: Number(emailOtp),
      name: formData.name,
      phone: formData.phone,
      companyName: formData.companyName,
      employeeSize: formData.employeeSize
    }
    try {
      const response = await axios.post(`${baseURL}/api/auth/verify-otp-and-save`,data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("companyData", JSON.stringify(formData));
      }

      setProcessing(false);
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      setProcessing(false);
      console.log(error)
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="verify-container">
      <div className="left-section">
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley.
        </p>
      </div>

      <div className="right-section">
        <div className="verification-form">
          <h2>Verify Your Account</h2>
          <p>Please enter the OTP sent to your email.</p>

          <div className="input-group">
            <input
              type="number"
              placeholder="Email OTP"
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value)}
            />
            <button
              onClick={handleEmailVerify}
              disabled={processing}
            >
              {processing ? "Verifying..." : "Verify"}
            </button>
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Mobile OTP"
              onChange={(e) => setEmailOtp(e.target.value)}
            />
            <button
              onClick={handleEmailVerify}
              disabled={processing}
            >
              {processing ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
