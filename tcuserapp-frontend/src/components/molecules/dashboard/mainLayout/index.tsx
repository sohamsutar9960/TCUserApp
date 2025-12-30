import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import "./mainLayout.scss";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigateBack } from "../../../helpers";
import { AppRoute } from "../../../atoms/common/interfaces";
import { useAuth } from "../../../auth/AuthProvider/authProvider";
import ProfilePageModal from "../../../atoms/common/modals/ProfilePageModal";
import TcLogout from "../../../../services/logoutService";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
const drawerWidth = 160;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(6)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
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

interface Props {
  commonRoutes: AppRoute[];
}

const MainLayout = (props: Props) => {
  const [isProfileDialogOpen, setProfileDialogOpen] = React.useState(false);
  const [isLogoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const navigateBack = useNavigateBack();
  const { logout } = useAuth();
  const { commonRoutes } = props;
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const intelizignLogo =
    process.env.PUBLIC_URL + "/images/IntelizignLogoWhite.png";
  const handleDrawerOpenClose = () => {
    setOpen(!open);
  };

  const renderIcon = (icon: React.ReactNode) => (
    <ListItemIcon
      sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}
    >
      {icon}
    </ListItemIcon>
  );

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = async () => {
    try {
      logout();
      setLogoutDialogOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const cancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const handleProfileClick = () => {
    setProfileDialogOpen(true);
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#006487" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpenClose}
            edge="start"
            sx={{ marginRight: 2 }}
          >
            <MenuIcon sx={{ marginLeft: "0.05px" }} fontSize="small" />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ fontSize: "1rem" }}
            className="appBarTitle" // Add this class?
          >
            EzAccessManager
          </Typography>

          <img src={intelizignLogo} alt="logo" className="iznLogoNav" />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <List
          sx={{
            paddingTop: "3rem",
            position: "relative",
            backgroundColor: "#006487",
            height: "100%",
            // overflowY: "auto",
          }}
        >
          <ListItem
            disablePadding
            sx={{ display: "block", position: "relative", bottom: "auto" }}
          >
            <ListItemButton
              onClick={navigateBack}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                color: "#fff",
              }}
            >
              <ArrowBackIosIcon fontSize="small" />
              <ListItemText
                primary="Back"
                sx={{ opacity: open ? 1 : 0, position: "relative", left: 20 }}
              />
            </ListItemButton>
          </ListItem>
          {commonRoutes.map((route: AppRoute, index: number) => (
            <ListItem
              key={route.title}
              disablePadding
              sx={{
                display: "block",
                position:
                  index === commonRoutes.length - 1 ? "absolute" : "relative",
                bottom: index === commonRoutes.length - 1 ? 0 : "auto",
              }}
            >
              {route.title === "Log Out" ? (
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={openLogoutDialog}
                >
                  {renderIcon(route.icon)}
                  <ListItemText
                    primary={route.title}
                    sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                  />
                </ListItemButton>
              ) : route.title === "Profile" ? (
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={handleProfileClick}
                >
                  {renderIcon(route.icon)}
                  <ListItemText
                    primary={route.title}
                    sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                  />
                </ListItemButton>
              ) : (
                <Link
                  to={route.to}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    {renderIcon(route.icon)}
                    <ListItemText
                      primary={route.title}
                      sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                    />
                  </ListItemButton>
                </Link>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
      <ProfilePageModal
        open={isProfileDialogOpen}
        handleClose={handleProfileDialogClose}
      />
      {/* Logout Confirmation Dialog */}

      <Dialog
        open={isLogoutDialogOpen}
        onClose={cancelLogout}
        PaperProps={{
          style: {
            display: "flex",
            justifyContent: "center",
            minWidth: "30%",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#006487",
            color: "white",
            display: "flex",
            alignItems: "center",
            fontSize: "1rem",
            position: "relative",
            padding: "8px 16px",
            borderBottom: "1px solid #ddd",
            textAlign: "center",
          }}
        >
          Confirm Logout
          <IconButton
            aria-label="close"
            sx={{
              position: "absolute",
              right: "8px",
              top: "8px",
              color: "inherit",
            }}
            onClick={cancelLogout}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "30px",
            textAlign: "center", // Center text
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              paddingTop: "15px",
            }}
          >
            Are you sure you want to log out?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "#f5f7fa",
            padding: "8px 30px",
            borderTop: "1px solid #ddd",
            justifyContent: "space-between", // Adjust button alignment
          }}
        >
          <Button
            onClick={cancelLogout}
            variant="outlined"
            color="primary"
            startIcon={<CloseIcon />}
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmLogout}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#d32f2f",
              color: "white",
              "&:hover": {
                backgroundColor: "#b71c1c", // Darker shade on hover
              },
            }}
            startIcon={<ExitToAppIcon />}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout;
