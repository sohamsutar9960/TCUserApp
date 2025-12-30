import { ReactNode } from "react";

export interface AppRoute {
  icon?: React.ReactNode;
  title?: string;
  to: string;
  nestedRoutes?: AppRoute[] | undefined;
  showOnNavigation?: boolean | undefined;
  component?: React.ReactNode;
}

export default interface Tile {
  key?: string;
  name?: string;
  icon?: ReactNode;
  onClick?: (() => void | undefined) | undefined;
  tileFlexBasis?: string;
}

export interface UserData {
  fullName: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  gid: string;
  lineManager: string;
  sponsor: string;
  organizationId: string;
  organization: string;
  department: string;
  locality?: string;
  city: string;
  country: string;
  mobileNumber: string;
  osUserName?: string;
  userRole: string;
  userName: string;
  password: string;
  confirmPassword: string;
}
