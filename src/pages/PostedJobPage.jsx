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

const JobPostedPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobPosts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${baseURL}/api/jobs/getjobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const jobsWithStatus = response.data.jobs.map((job) => ({
          ...job,
          status: new Date(job.endDate) > new Date() ? "Active" : "Inactive",
        }));
        jobsWithStatus.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJobPosts(jobsWithStatus);
      } catch (error) {
        console.error("Error fetching job posts:", error.response?.data || error.message);
      }
    };

    fetchJobPosts();
  }, []);

  const handleOpen = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedJob(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Job Postings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel>Title</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Description</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Experience Level</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>End Date</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Status</TableSortLabel>
              </TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobPosts.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.experienceLevel}</TableCell>
                <TableCell>{new Date(job.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" onClick={() => handleOpen(job)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
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
          {selectedJob && (
            <Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Title:</strong> {selectedJob.title}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {selectedJob.description}
              </Typography>
              <Typography variant="body1">
                <strong>Experience Level:</strong> {selectedJob.experienceLevel}
              </Typography>
              <Typography variant="body1">
                <strong>End Date:</strong> {new Date(selectedJob.endDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
          <Button variant="outlined" onClick={handleClose} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default JobPostedPage;
