// src/RegistrationPage.jsx
import React, { useState } from "react";
import "../css/Registration.css";
import baseURL from "../base_url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LeftSection from "../components/LeftSection";

const RegistrationPage = () => {
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    companyName: "",
    companyEmail: "",
    employeeSize: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setProcessing(true);
    e.preventDefault();
    const numericFormData = {
      ...formData,
      phone: Number(formData.phone),
      employeeSize: Number(formData.employeeSize),
    };

    try {
      const response = await axios.post(
        `${baseURL}/api/auth/register`,
        numericFormData
      );
      setProcessing(false);
      if (response.data) {
        alert(response.data.message);
        localStorage.setItem("companyData", JSON.stringify(numericFormData));
        navigate("/verify");
      }
    } catch (error) {
      setProcessing(false);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="registration-container">
      <div className="left-section">
        <LeftSection />
      </div>
      <div className="right-section">
        <form className="registration-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <p>Lorem Ipsum is simply dummy text</p>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="phone"
            placeholder="Phone no."
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="companyEmail"
            placeholder="Company Email"
            value={formData.companyEmail}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="employeeSize"
            placeholder="Employee Size"
            value={formData.employeeSize}
            onChange={handleChange}
            required
          />

          <p>
            By clicking on proceed you will accept our{" "}
            <a href="/terms">Terms & Conditions</a>
          </p>

          <button type="submit">{processing ? "Sending Otp..." : "Proceed"}</button>

          <p className="login-link">
            Already have an account?{" "}
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
