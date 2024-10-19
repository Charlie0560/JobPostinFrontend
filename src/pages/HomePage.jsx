import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home"; 
import SubjectIcon from "@mui/icons-material/Subject"; 
import SendIcon from "@mui/icons-material/Send";
import NavBar from "./Navbar"; 
import JobPostingPage from "./JobPost";
import EmailLogPage from "./EmailLogPage"; 
import PostedJobPage from "./PostedJobPage";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function HomePage() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [currentComponent, setCurrentComponent] = React.useState("jobPosting"); // State to manage the current component

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleHomeClick = () => setCurrentComponent("jobPosting");
  const handleEmailLogClick = () => setCurrentComponent("emailLog");
  const handleSendClick = () => setCurrentComponent("postedJobs");

  const renderComponent = () => {
    switch (currentComponent) {
      case "jobPosting":
        return <JobPostingPage />;
      case "emailLog":
        return <EmailLogPage />;
      case "postedJobs":
        return <PostedJobPage />;
      default:
        return <JobPostingPage />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <NavBar /> 
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List className="drawerlist">
          {/* Home Icon - show JobPostingPage */}
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={handleHomeClick} // Attach click handler
              sx={[
                { minHeight: 48, px: 2.5 },
                open
                  ? { justifyContent: "initial" }
                  : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: "center" },
                  open ? { mr: 3 } : { mr: "auto" },
                ]}
              >
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary="Job Posting"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          {/* Send Icon - show PostedJobPage */}
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={handleSendClick} // Attach click handler
              sx={[
                { minHeight: 48, px: 2.5 },
                open
                  ? { justifyContent: "initial" }
                  : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: "center" },
                  open ? { mr: 3 } : { mr: "auto" },
                ]}
              >
                <SendIcon />
              </ListItemIcon>
              <ListItemText
                primary="Posted Jobs"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          {/* Email Log Icon - show EmailLogPage */}
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={handleEmailLogClick} // Attach click handler
              sx={[
                { minHeight: 48, px: 2.5 },
                open
                  ? { justifyContent: "initial" }
                  : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: "center" },
                  open ? { mr: 3 } : { mr: "auto" },
                ]}
              >
                <SubjectIcon />
              </ListItemIcon>
              <ListItemText
                primary="Email Log"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {renderComponent()}
      </Box>
    </Box>
  );
}
