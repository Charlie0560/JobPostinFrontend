import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/JobPost.css"; // CSS styling
import CancelIcon from '@mui/icons-material/Cancel'; // Import CancelIcon from MUI

const JobPostingPage = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState(null);
  const [candidateEmails, setCandidateEmails] = useState([]); // Array to store multiple emails
  const [newEmail, setNewEmail] = useState(""); // State for new email input
  const [endDate, setEndDate] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // State for form visibility

  const experienceOptions = [
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid" },
    { value: "senior", label: "Senior" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Job posted successfully!");
    // Further submission logic here
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" && newEmail) {
      e.preventDefault();
      // Add the new email to the list if it's valid
      if (validateEmail(newEmail)) {
        setCandidateEmails((prevEmails) => [...prevEmails, newEmail]);
        setNewEmail(""); // Clear the input
      } else {
        alert("Please enter a valid email address."); // Optional: Alert for invalid email
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return re.test(email);
  };

  const handleEmailDelete = (emailToDelete) => {
    setCandidateEmails((prevEmails) => prevEmails.filter(email => email !== emailToDelete));
  };

  return (
    <div>
      {!isFormVisible && <button 
        style={{ 
          backgroundColor: '#0096FF', // Blue background
          color: 'white', // White text
          padding: '10px 20px', // Padding
          border: 'none', // No border
          borderRadius: '5px', // Rounded corners
          cursor: 'pointer', // Pointer cursor
          marginBottom: '20px', // Space below the button
        }} 
        onClick={() => setIsFormVisible(!isFormVisible)} // Toggle form visibility
      >
        Create Interview
      </button>}

      {isFormVisible && ( // Conditionally render the form
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter Job Title"
                required
              />
            </div>

            <div className="form-group">
              <label>Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter Job Description"
                required
              />
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <Select
                options={experienceOptions}
                value={experienceLevel}
                onChange={setExperienceLevel}
                placeholder="Select Experience Level"
              />
            </div>

            <div className="form-group">
              <label>Add Candidates</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {candidateEmails.map((email, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
                    <span>{email}</span>
                    <CancelIcon 
                      style={{ cursor: 'pointer', marginLeft: '5px' }} 
                      onClick={() => handleEmailDelete(email)} // Delete email on click
                    />
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)} // Control input for new email
                onKeyDown={handleEmailKeyDown}
                placeholder="Enter candidate emails (press Enter to add)"
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Select a Date"
              />
            </div>

            <button type="submit" className="submit-button">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobPostingPage;
