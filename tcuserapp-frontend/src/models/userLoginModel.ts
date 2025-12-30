import { User } from "../components/auth/AuthProvider/authProvider";

export interface UserDetails {
  username?: string;
  password?: string;
}
export interface LoginPanelProps {
  onClose?: () => void;
  onLogin?: (response: User) => void;
}
