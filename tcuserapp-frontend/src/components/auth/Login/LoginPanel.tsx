import React, { MouseEvent, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateUserPanel from "./CreateUserPanel";
import "./LoginPanel.scss";
import { LoginPanelProps } from "../../../models/userLoginModel";
import TcLogin from "../../../services/loginService";
import { useAuth } from "../AuthProvider/authProvider";
import Cookies from "js-cookie";
import { StyledTextField } from "../../molecules/dashboard/groupPage/styledComponent";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const intelizignLogo = process.env.PUBLIC_URL + "/images/intelizignLogo.png";

const LoginPanel: React.FC<LoginPanelProps> = ({ onClose }) => {
  const [userCredentials, setUserCredentials] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCreateUserPanel, setShowCreateUserPanel] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSignIn = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await TcLogin.UserLogin(userCredentials);
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.jwtToken);
      login(userData);
      Cookies.set("token", userData.jwtToken, { path: "/" });
      // @ts-ignore
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid credentials, please try again.");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseCreateUserPanel = () => {
    setShowCreateUserPanel(false);
  };

  const handleSubmitCreateUser = () => {
    setShowCreateUserPanel(false);
  };

  return (
    <Box className="boxModel">
      <div className="loginpanel">
        <div className="loginpanel-content">
          <div className="logo-container">
            <img src={intelizignLogo} alt="error" className="logo" />
          </div>
          <StyledTextField
            id="username"
            name="username"
            variant="outlined"
            value={userCredentials.username}
            onChange={handleChange}
            fullWidth
            placeholder="👨‍💼 Username"
            className="input-field"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            sx={{ paddingLeft: 0 }}
          />
          <StyledTextField
            id="password"
            name="password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={userCredentials.password}
            onChange={handleChange}
            fullWidth
            placeholder="👁️ Password"
            className="input-field"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    // style={{
                    //   backgroundColor: "#f5f5f5", // Ensure this matches the background color of your input field
                    //   borderRadius: "5px",
                    // }}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ paddingLeft: 0 }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="button-container">
            <Button
              variant="contained"
              onClick={handleSignIn}
              className="sign-in-button"
              startIcon={<LoginIcon />}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              className="cancel-button"
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {showCreateUserPanel && (
        <CreateUserPanel
          onClose={handleCloseCreateUserPanel}
          onSubmit={handleSubmitCreateUser}
        />
      )}
    </Box>
  );
};

export default LoginPanel;
