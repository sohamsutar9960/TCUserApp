import { ReactElement, useEffect, useState } from "react";
import { useAuth } from "../AuthProvider/authProvider";
import { Navigate } from "react-router";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    const token = Cookies.get("token");

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);

        if (userData.expiration) {
          const expiration = new Date(userData.expiration).getTime();
          const currentTime = Date.now();

          if (expiration > currentTime) {
            setUser((prevUser) => {
              if (!prevUser || prevUser.user.userId !== userData.id) {
                return userData;
              }
              return prevUser;
            });
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (e) {
        console.error("Error processing stored user:", e);
        logout();
      }
    } else {
      logout();
    }

    setLoading(false);
  }, [setUser, logout]);

  if (loading) {
    return <div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
