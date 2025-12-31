import { useLocation, useNavigate } from "react-router-dom";
import { AppRoute } from "./atoms/common/interfaces";
import { izAdminRoutes } from "../routes/izAdminRoutes";
import { izUserRoutes } from "../routes/izUserRoutes";
import { izManagerRoutes } from "../routes/izManagerRoutes";
import { izGroupRoleApproverRoutes } from "../routes/izGroupRoleApprover";
import { useAuth } from "./auth/AuthProvider/authProvider";
import { useEffect, useRef } from "react";

const useNavigationHistory = () => {
  const location = useLocation();
  const history = useRef<string[]>([]);

  useEffect(() => {
    if (location.pathname !== history.current[history.current.length - 1]) {
      history.current.push(location.pathname);
    }
  }, [location]);

  const getPreviousLocation = () => {
    if (history.current.length > 1) {
      return history.current[history.current.length - 2];
    }
    return null;
  };

  return {
    history: history.current,
    getPreviousLocation,
  };
};

export default useNavigationHistory;
export const useNavigateBack = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { getPreviousLocation } = useNavigationHistory();
  const tabRoutes = [
    "openRequests",
    "closeRequests",
    "approvedRequests",
    "rejectedRequests",
    "exportToTc",
  ];
  return () => {
    // const previousLocation = getPreviousLocation();
    if (isAuthenticated) {
      const pathSegments = location.pathname.split("/").filter(Boolean);

      if (pathSegments.length > 1) {
        const parentPath =
          "/" +
          pathSegments
            .slice(
              0,
              tabRoutes.includes(pathSegments[pathSegments.length - 1])
                ? -2
                : -1
            )
            .join("/");
        navigate(parentPath);
      } else {
        navigate("/home"); // If there's only one segment, go back in history
      }
    } else {
      navigate("/login");
    }
  };
};

export const getRoutes = (user: string) => {
  let privateRoutes: AppRoute[] = [];

  switch (user) {
    case "ADMIN":
      privateRoutes = izAdminRoutes;
      break;
    case "USER":
      privateRoutes = izUserRoutes;
      break;
    case "MANAGER":
      privateRoutes = izManagerRoutes;
      break;
    case "ROLEAPPROVER":
      privateRoutes = izGroupRoleApproverRoutes;
      break;
    default:
      break;
  }

  return privateRoutes;
};
