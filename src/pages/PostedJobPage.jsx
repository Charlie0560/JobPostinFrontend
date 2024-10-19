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
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import axios from "axios";
import baseURL from "../base_url";
import { useTheme } from "@mui/material/styles";

const JobPostedPage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen size is mobile

  useEffect(() => {
    const fetchJobPosts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(`${baseURL}/api/jobs/getjobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        Posted Jobs
      </Typography>

      {isMobile ? (
        // Mobile View: Render Jobs as Cards
        jobPosts.map((job) => (
          <Card key={job._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{job.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {job.description}
              </Typography>
              <Typography variant="body2">
                <strong>Experience Level:</strong> {job.experienceLevel}
              </Typography>
              <Typography variant="body2">
                <strong>End Date:</strong> {new Date(job.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {job.status}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" onClick={() => handleOpen(job)}>
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
      )}

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
