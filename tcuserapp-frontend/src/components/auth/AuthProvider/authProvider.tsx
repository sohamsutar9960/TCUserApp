import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import TcLogout from "../../../services/logoutService";

export interface LoggedInUserData {
  userId: number;
  fullName: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  lineManager: string;
  sponsor: string;
  department: string;
  organization: string;
  organizationID: string;
  country: string;
  mobileNumber: string;
  username: string;
  password: string | null;
  roleId: number;
  roleName: string;
  gid: string;
}

interface UserData {
  userId: number;
  fullName: string;
  firstName: string;
  lastName: string;
  displayName: string;
  lineManager: string;
  sponsor: string;
  department: string;
  organization: string;
  organizationID: string;
  country: string;
  mobileNumber: string;
  username: string;
  password: string | null;
  email: string;
  roleId: number;
  roleName: string;
  gid: string;
}

export interface User {
  jwtToken: string;
  userName: string;
  roles: string[];
  expiration: string;
  user: UserData;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const login = (userData: User) => {
    const expirationTime = new Date(userData.expiration).toISOString();
    const userToStore = { ...userData, expiration: expirationTime };
    Cookies.set("user", JSON.stringify(userToStore), { path: "/" });
    Cookies.set("token", userData.jwtToken, { path: "/" });
    setUser(userToStore);
  };

  const logout = useCallback(async () => {
    try {
      await TcLogout.UserLogout();
    } catch (error) {
      console.error("Logout failed: ", error);
    } finally {
      setUser(null);
      Cookies.remove("user", { path: "/" });
      Cookies.remove("token", { path: "/" });
      navigate("/login");
    }
  }, [navigate]);

  const checkTokenExpiration = useCallback(() => {
    const storedUser = Cookies.get("user");
    const token = Cookies.get("token");

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);

        if (userData.expiration) {
          const expiration = new Date(userData.expiration).getTime();
          const currentTime = Date.now();

          if (expiration > currentTime) {
            setUser(userData);
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
  }, [logout]);

  useEffect(() => {
    checkTokenExpiration();

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 30000);

    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
