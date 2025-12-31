import { useState } from "react";
import { Box, Button } from "@mui/material";
import "./loginPage.scss";
import LoginPanel from "./LoginPanel";
import { LoginPanelProps } from "../../../models/userLoginModel";

const LoginPage = (props: LoginPanelProps) => {
  const { onLogin } = props;
  const simensLogoLogin = process.env.PUBLIC_URL + "/images/IZLogo.png";
  const [showLoginPanel, setShowLoginPanel] = useState(false);

  const handleCloseLoginPanel = () => {
    setShowLoginPanel(false);
  };

  const logInWithIntelizignAccount = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    window.location.href = "http://localhost:8080/oauth2/authorization/azure";
  };

  const toggleLoginPanel = () => {
    setShowLoginPanel((prev) => !prev);
  };

  return (
    <Box className="loginpage">
      <Box className="loginpage-left">
        <img src={simensLogoLogin} alt="Siemens Logo" className="siemensLogo" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "50px",
          }}
        >
          <Button
            className="loginbtn"
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#005f87",
              fontWeight: "bold",
              fontSize: "0.775rem", // Adjust font size as needed
            }}
            onClick={logInWithIntelizignAccount}
          >
            Login with Intelizign Account
          </Button>
          <hr style={{ width: "100%" }} />

          <Button
            className="loginbtn"
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#005f87",
              fontWeight: "bold",
              fontSize: "0.775rem", // Adjust font size as needed
            }}
            onClick={toggleLoginPanel}
          >
            Admin Login
          </Button>
        </Box>
      </Box>
      {showLoginPanel && (
        <Box>
          <LoginPanel onClose={handleCloseLoginPanel} onLogin={onLogin} />
        </Box>
      )}
    </Box>
  );
};

export default LoginPage;
