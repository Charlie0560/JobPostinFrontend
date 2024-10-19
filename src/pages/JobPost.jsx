import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/JobPost.css";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import baseURL from "../base_url";

const JobPostingPage = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState(null);
  const [candidateEmails, setCandidateEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const experienceOptions = [
    { value: "0-2", label: "0 to 2 years" },
    { value: "2-4", label: "2 to 4 years" },
    { value: "above-4", label: "Above 4 years" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    const newErrors = {};
    if (!jobTitle || jobTitle.length < 3 || jobTitle.length > 50) {
      newErrors.jobTitle = "Job title must be between 3 and 50 characters.";
    }
    if (!jobDescription || jobDescription.length < 10 || jobDescription.length > 500) {
      newErrors.jobDescription = "Job description must be between 10 and 500 characters.";
    }
    if (candidateEmails.length === 0) {
      newErrors.candidateEmails = "At least one candidate email must be added.";
    } else {
      candidateEmails.forEach((email, index) => {
        if (!validateEmail(email)) {
          newErrors[`email_${index}`] = `Email ${index + 1} is invalid.`;
        }
      });
    }
    if (!endDate) {
      newErrors.endDate = "End date must be selected.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setProcessing(false);
      return;
    }

    const jobData = {
      title: jobTitle,
      description: jobDescription,
      experienceLevel: experienceLevel?.value,
      endDate: endDate,
      emailRecipients: candidateEmails,
    };
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURL}/api/jobs/createjob`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Job posted successfully!");
      console.log(response.data);
      setJobTitle("");
      setJobDescription("");
      setExperienceLevel(null);
      setCandidateEmails([]);
      setNewEmail("");
      setEndDate(null);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" && newEmail) {
      e.preventDefault();
      if (validateEmail(newEmail)) {
        setCandidateEmails((prevEmails) => [...prevEmails, newEmail]);
        setNewEmail("");
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailDelete = (emailToDelete) => {
    setCandidateEmails((prevEmails) =>
      prevEmails.filter((email) => email !== emailToDelete)
    );
  };

  return (
    <div>
      {!isFormVisible && (
        <button
          style={{
            backgroundColor: "#0096FF",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          Create Interview
        </button>
      )}

      {isFormVisible && (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="jobpostForm">
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter Job Title"
                required
              />
              {errors.jobTitle && <span className="error">{errors.jobTitle}</span>}
            </div>

            <div className="form-group">
              <label>Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter Job Description"
                required
              />
              {errors.jobDescription && <span className="error">{errors.jobDescription}</span>}
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <Select
                options={experienceOptions}
                value={experienceLevel}
                onChange={setExperienceLevel}
                placeholder="Select Experience Level"
                className="select"
              />
            </div>

            <div className="form-group">
              <label>Add Candidates</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "5px",
                  fontSize: "12px",
                }}
              >
                {candidateEmails.map((email, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "5px",
                    }}
                  >
                    <span>{email}</span>
                    <CancelIcon
                      style={{ cursor: "pointer", marginLeft: "5px" }}
                      onClick={() => handleEmailDelete(email)}
                    />
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={handleEmailKeyDown}
                placeholder="Enter candidate emails (press Enter to add)"
              />
              {errors.candidateEmails && <span className="error">{errors.candidateEmails}</span>}
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                selected={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholderText="Select a Date"
              />
              {errors.endDate && <span className="error">{errors.endDate}</span>}
            </div>

            <button type="submit" className="submit-button">
              {processing ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobPostingPage;
