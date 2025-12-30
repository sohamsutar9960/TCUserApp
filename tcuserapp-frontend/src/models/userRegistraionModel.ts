interface UserRegistration {
  fullName: string;
  firstName: string;
  lastName: string;
  gid: string;
  displayName: string;
  email: string;
  lineManager: string;
  sponsor: string;
  department: string;
  organization: string;
  organizationId: string;
  country: string;
  mobileNumber: string;
  osUserName: string;
  userRole: string;
  userName: string;
  password: string;
  confirmPassword: string;
  locality: string;
  city: string;
}

export default UserRegistration;

export interface UserRegistrationResponse {
  // Define the response properties based on your API response
  success: boolean;
  message: string;
  // Add any other properties returned by the API
}
