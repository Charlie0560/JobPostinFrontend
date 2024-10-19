import React, { useState } from "react";
import {
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { makeStyles } from "@mui/styles";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  logoText: {
    fontWeight: "bold",
    fontSize: "24px",
    letterSpacing: "0.1em",
    display: "flex",
    alignItems: "center",
  },
  logoHighlight: {
    color: "#0096FF",
  },
  toolbar: {
    justifyContent: "space-between",
  },
  contact: {
    marginRight: "20px",
  },
});

const AppBarStyled = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "white",
  borderBottom: "1px solid grey",
}));

const NavBar = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [companyData, setCompanyData] = useState(null);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("companyEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("companyData");
    window.location.replace("/login");
  };

  const handleProfileClick = () => {
    const data = JSON.parse(localStorage.getItem("companyData"));
    setCompanyData(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCompanyData(null);
  };

  return (
    <>
      <AppBarStyled position="fixed" color="transparent" elevation={0}>
        <Toolbar className={classes.toolbar}>
          <Box>
            <img
              src={logo}
              alt="Cuvette"
              className={classes.logo}
              width="100"
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" className={classes.contact}>
              Contact
            </Typography>
            {isLoggedIn && (
              <IconButton onClick={handleMenuClick}>
                <Avatar alt="User Name" />
              </IconButton>
            )}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
            >
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBarStyled>
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Company Profile</DialogTitle>
        <DialogContent>
          {companyData ? (
            <div>
              <p><strong>Name:</strong> {companyData.name}</p>
              <p><strong>Email:</strong> {companyData.companyEmail}</p>
              <p><strong>Phone:</strong> {companyData.phone}</p>
              <p><strong>Company Name:</strong> {companyData.companyName}</p>
              <p><strong>Employee Size:</strong> {companyData.employeeSize}</p>
            </div>
          ) : (
            <p>No company data found.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavBar;
