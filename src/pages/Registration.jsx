// src/RegistrationPage.jsx
import React, { useState } from "react";
import "../css/Registration.css"; // CSS file for styling
import baseURL from "../base_url";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Change this line

const RegistrationPage = () => {
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

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
      phone: Number(formData.phone), // Convert phone to number
      employeeSize: Number(formData.employeeSize), // Convert employeeSize to number if applicable
    };

    try {
      console.log(numericFormData);
      const response = await axios.post(
        `${baseURL}/api/auth/register`,
        numericFormData
      );
      setProcessing(false);
      if (response.data) {
        alert(response.data.message); // Show alert with the message from the server
        localStorage.setItem("formData", JSON.stringify(numericFormData)); // Store company data as JSON string
        navigate("/verify"); // Redirect to the verification page
      }
    } catch (error) {
      setProcessing(false);
      if (error.response) {
        alert(error.response.data.message); // Show error message from the server
      } else {
        alert("An unexpected error occurred.");
      }
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
            <a href="/login" onClick={(e) => {e.preventDefault(); navigate('/login')}}>
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
