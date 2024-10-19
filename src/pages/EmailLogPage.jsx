import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
  Modal,
  Paper,
} from "@mui/material";
import axios from "axios";
import baseURL from "../base_url";


const EmailLogPage = () => {
  const [emailLogs, setEmailLogs] = useState([]);
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openJobModal, setOpenJobModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  const fetchEmailLogs = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${baseURL}/api/emaillogs/getlogs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sortedEmailLogs = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setEmailLogs(sortedEmailLogs);
    } catch (error) {
      if (error.response) {
        console.error("Error fetching email logs:", error.response.data);
      } else {
        console.error("Error fetching email logs:", error.message);
      }
    }
  };

  const fetchJobDetails = async (jobId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${baseURL}/api/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJobDetails(response.data.job);
      setOpenJobModal(true);
    } catch (error) {
      if (error.response) {
        console.error("Error fetching job details:", error.response.data);
      } else {
        console.error("Error fetching job details:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchEmailLogs();
  }, []);

  const handleOpenEmail = (log) => {
    setSelectedLog(log);
    setOpenEmailModal(true);
  };

  const handleCloseEmail = () => {
    setOpenEmailModal(false);
    setSelectedLog(null);
  };

  const handleCloseJob = () => {
    setOpenJobModal(false);
    setJobDetails(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Email Logs
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel>Recipients</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Job ID</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Subject</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Sent At</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Sender</TableSortLabel>
              </TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emailLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.to.join(", ")}</TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    onClick={() => fetchJobDetails(log.jobId)}
                    sx={{ textDecoration: "underline", color: "primary.main" }}
                  >
                    {log.jobId}
                  </Button>
                </TableCell>
                <TableCell>{log.subject}</TableCell>
                <TableCell>{new Date(log.sentAt).toLocaleString()}</TableCell>
                <TableCell>{log.sender}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    onClick={() => handleOpenEmail(log)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openEmailModal} onClose={handleCloseEmail}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Email Log Details
          </Typography>
          {selectedLog && (
            <Box>
              <Typography variant="body1">
                <strong>Recipients:</strong> {selectedLog.to.join(", ")}
              </Typography>
              <Typography variant="body1">
                <strong>Subject:</strong> {selectedLog.subject}
              </Typography>
              <Typography variant="body1">
                <strong>Body:</strong> {selectedLog.body}
              </Typography>
              <Typography variant="body1">
                <strong>Sent At:</strong> {new Date(selectedLog.sentAt).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>Sender:</strong> {selectedLog.sender}
              </Typography>
            </Box>
          )}
          <Button variant="outlined" onClick={handleCloseEmail} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>

      <Modal open={openJobModal} onClose={handleCloseJob}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Job Details
          </Typography>
          {jobDetails && (
            <Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Job Title:</strong> {jobDetails.title}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {jobDetails.description}
              </Typography>
              <Typography variant="body1">
                <strong>Experience Level:</strong> {jobDetails.experienceLevel}
              </Typography>
              <Typography variant="body1">
                <strong>End Date:</strong> {new Date(jobDetails.endDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
          <Button variant="outlined" onClick={handleCloseJob} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EmailLogPage;
