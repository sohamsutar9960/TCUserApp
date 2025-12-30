import React, { useState } from "react";
import { Grid, InputLabel, Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import "./CreateUserPanel.scss";

interface CreateUserPanelProps {
  onClose: () => void;
  onSubmit: (userData: UserData) => void;
}

interface UserData {
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
  locality: string;
  city: string;
  country: string;
  mobileNumber: string;
  osUserName: string;
  userRole: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

const CreateUserPanel: React.FC<CreateUserPanelProps> = ({
  onClose,
  onSubmit,
}) => {
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    displayName: "",
    firstName: "",
    lastName: "",
    email: "",
    gid: "",
    lineManager: "",
    sponsor: "",
    organizationId: "",
    organization: "",
    department: "",
    locality: "",
    city: "",
    country: "",
    mobileNumber: "",
    osUserName: "",
    userRole: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<UserData>>({});
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const newErrors: Partial<UserData> = {};

    if (!userData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.error("Validation errors:", newErrors);
      return;
    }

    try {
      await saveUser(userData);
      onSubmit(userData);
      onClose();
      navigate("/home");
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <>
      {isPopupOpen && <div className="backdrop-overlay" />}
      <div className={`create-user-popup ${isPopupOpen ? "open" : ""}`}>
        <div className="create-user-label">
          Create User
          <CloseIcon onClick={onClose} style={{ cursor: "pointer" }} />
        </div>
        <Box padding={2}>
          <div className="create-user-panel">
            <div className="form-container">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="fullName">
                    Full Name
                  </InputLabel>
                  <TextField
                    id="fullName"
                    name="fullName"
                    variant="outlined"
                    fullWidth
                    value={userData.fullName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="displayName">
                    Display Name
                  </InputLabel>
                  <TextField
                    id="displayName"
                    name="displayName"
                    variant="outlined"
                    fullWidth
                    value={userData.displayName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="firstName">
                    First Name
                  </InputLabel>
                  <TextField
                    id="firstName"
                    name="firstName"
                    variant="outlined"
                    fullWidth
                    value={userData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="Last Name">
                    Last Name
                  </InputLabel>
                  <TextField
                    id="lastName"
                    name="lastName"
                    variant="outlined"
                    fullWidth
                    value={userData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="Email">
                    Email
                  </InputLabel>
                  <TextField
                    id="email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    value={userData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="GID">
                    GID
                  </InputLabel>
                  <TextField
                    id="gid"
                    name="gid"
                    variant="outlined"
                    fullWidth
                    value={userData.gid}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="Line Manager">
                    Line Manager
                  </InputLabel>
                  <TextField
                    id="lineManager"
                    name="lineManager"
                    variant="outlined"
                    fullWidth
                    value={userData.lineManager}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="Sponsor">
                    Sponsor
                  </InputLabel>
                  <TextField
                    id="sponsor"
                    name="sponsor"
                    variant="outlined"
                    fullWidth
                    value={userData.sponsor}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="OrganizationId">
                    OrganizationId
                  </InputLabel>
                  <TextField
                    id="organizationId"
                    name="organizationId"
                    variant="outlined"
                    fullWidth
                    value={userData.organizationId}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="Organization">
                    Organization
                  </InputLabel>
                  <TextField
                    id="organization"
                    name="organization"
                    variant="outlined"
                    fullWidth
                    value={userData.organization}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="epartment">
                    Department
                  </InputLabel>
                  <TextField
                    id="department"
                    name="department"
                    variant="outlined"
                    fullWidth
                    value={userData.department}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="Locality">
                    Locality
                  </InputLabel>
                  <TextField
                    id="locality"
                    name="locality"
                    variant="outlined"
                    fullWidth
                    value={userData.locality}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="City">
                    City
                  </InputLabel>
                  <TextField
                    id="city"
                    name="city"
                    variant="outlined"
                    fullWidth
                    value={userData.city}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="Country">
                    Country
                  </InputLabel>
                  <TextField
                    id="country"
                    name="country"
                    variant="outlined"
                    fullWidth
                    value={userData.country}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="Mobile Number">
                    Mobile Number
                  </InputLabel>
                  <TextField
                    id="mobileNumber"
                    name="mobileNumber"
                    variant="outlined"
                    fullWidth
                    value={userData.mobileNumber}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="Os UserName">
                    Os UserName
                  </InputLabel>
                  <TextField
                    id="osUserName"
                    name="osUserName"
                    variant="outlined"
                    fullWidth
                    value={userData.osUserName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="userRole">
                    User Role
                  </InputLabel>
                  <TextField
                    id="userRole"
                    name="userRole"
                    variant="outlined"
                    fullWidth
                    value={userData.userRole}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="UserName">
                    UserName
                  </InputLabel>
                  <TextField
                    id="userName"
                    name="userName"
                    variant="outlined"
                    fullWidth
                    value={userData.userName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="password">
                    Password <span style={{ color: "red" }}>*</span>
                  </InputLabel>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InputLabel className="labels" htmlFor="confirmPassword">
                    Confirm Password <span style={{ color: "red" }}>*</span>
                  </InputLabel>
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
            </div>
            <div className="button-container">
              <Button
                variant="contained"
                onClick={handleSubmit}
                className="submit-button"
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                onClick={onClose}
                className="cancel-button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </div>
    </>
  );
};

export default CreateUserPanel;
function saveUser(userData: UserData) {
  throw new Error("Function not implemented.");
}
