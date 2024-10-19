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
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import baseURL from "../base_url";
import "../css/table.css"; // Optional CSS

const EmailLogPage = () => {
  const [emailLogs, setEmailLogs] = useState([]);
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openJobModal, setOpenJobModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect screen size

  const fetchEmailLogs = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${baseURL}/api/emaillogs/getlogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedEmailLogs = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setEmailLogs(sortedEmailLogs);
    } catch (error) {
      console.error(
        "Error fetching email logs:",
        error.response?.data || error.message
      );
    }
  };

  const fetchJobDetails = async (jobId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${baseURL}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobDetails(response.data.job);
      setOpenJobModal(true);
    } catch (error) {
      console.error(
        "Error fetching job details:",
        error.response?.data || error.message
      );
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
    <Box sx={{ p: 0}} className="pageBox">
      <Typography variant="h4" gutterBottom>
        Email Logs
      </Typography>

      {isMobile ? (
        // Mobile View: Render logs as Cards
        emailLogs.map((log) => (
          <Card key={log.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{log.subject}</Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Recipients:</strong> {log.to.join(", ")}
              </Typography>
              <Typography variant="body2">
                <strong>Job ID:</strong>{" "}
                <Button
                  variant="text"
                  onClick={() => fetchJobDetails(log.jobId)}
                  sx={{ textDecoration: "underline", color: "primary.main" }}
                >
                  {log.jobId}
                </Button>
              </Typography>
              <Typography variant="body2">
                <strong>Sent At:</strong> {new Date(log.sentAt).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Sender:</strong> {log.sender}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleOpenEmail(log)}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        // Desktop View: Render Table
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
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
                  <TableCell>
                    {new Date(log.sentAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.sender}</TableCell>
                  <TableCell align="right">
                    <Button
                     size="small"
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
      )}

      {/* Email Log Modal */}
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
          <Typography variant="h6">Email Log Details</Typography>
          {selectedLog && (
            <Box>
              <Typography>
                <strong>Recipients:</strong> {selectedLog.to.join(", ")}
              </Typography>
              <Typography>
                <strong>Subject:</strong> {selectedLog.subject}
              </Typography>
              <Typography>
                <strong>Body:</strong> {selectedLog.body}
              </Typography>
              <Typography>
                <strong>Sent At:</strong>{" "}
                {new Date(selectedLog.sentAt).toLocaleString()}
              </Typography>
              <Typography>
                <strong>Sender:</strong> {selectedLog.sender}
              </Typography>
            </Box>
          )}
          <Button onClick={handleCloseEmail} sx={{ mt: 2 }} variant="outlined">
            Close
          </Button>
        </Box>
      </Modal>

      {/* Job Details Modal */}
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
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Job Details</Typography>
          {jobDetails && (
            <Box>
              <Typography sx={{ mt: 2 }}>
                <strong>Job Title:</strong> {jobDetails.title}
              </Typography>
              <Typography>
                <strong>Description:</strong> {jobDetails.description}
              </Typography>
              <Typography>
                <strong>Experience Level:</strong>{" "}
                {jobDetails.experienceLevel}
              </Typography>
              <Typography>
                <strong>End Date:</strong>{" "}
                {new Date(jobDetails.endDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
          <Button onClick={handleCloseJob} sx={{ mt: 2 }} variant="outlined">
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EmailLogPage;
