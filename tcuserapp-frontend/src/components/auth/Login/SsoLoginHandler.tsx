import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/authProvider";

const SsoLoginHandler = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const loginResponse = urlParams.get("loginResponse");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleLogin = async () => {
      if (loginResponse) {
        const decodedResponse = decodeURIComponent(loginResponse);

        try {
          const responseData = JSON.parse(decodedResponse);
          login(responseData);
          navigate("/home");
        } catch (error) {
          console.error("Failed to parse JSON:", error);
        }
      }
    };

    handleLogin();
  }, [login, navigate]);

  return <div>Loading...</div>;
};

export default SsoLoginHandler;
