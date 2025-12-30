export interface UserRole {
  roleId: number;
}

export interface UserCreationData {
  userId?: number;
  fullName: string;
  firstName: string;
  lastName: string;
  displayName: string;
  lineManager: string | null;
  sponsor: string;
  department: string;
  organization: string;
  organizationID: string | null;
  country: string;
  mobileNumber: string;
  username: string;
  email: string;
  gid: string;
  userRole: UserRole;
  password: string;
  confirmPassword?: string;
}

export interface UserResponse {
  userId: number;
  fullName: string;
  firstName: string;
  lastName: string;
  displayName: string;
  lineManager: string | null;
  sponsor: string;
  department: string;
  organization: string;
  organizationID: string | null;
  country: string;
  mobileNumber: string;
  username: string;
  password: string;
  email: string;
  roleId: number;
  roleName: string;
  gid: string | null;
}
