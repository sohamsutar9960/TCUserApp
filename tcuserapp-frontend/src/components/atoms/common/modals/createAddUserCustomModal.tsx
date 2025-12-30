import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  MenuItem,
  Modal,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import {
  UserCreationData,
  UserResponse,
} from "../../../../models/userCreationModel";
import { UserRole } from "../../../../models/tcUserRoleModel";
import {
  StyledClearIcon,
  StyledDropdownModalInput,
  StyledTextFieldModal,
  StyledTypographyModal,
} from "../../../molecules/dashboard/groupPage/styledComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  handleAddNewItem: (createdUserData: UserCreationData) => void;
  handleEditItem: (editedItem: UserCreationData) => void;
  editItem: UserResponse | null;
  handleDeleteItem: (groupId: number | undefined) => void;
  userRoles: UserRole[];
}

const CreateAddUserCustomModal = (props: Props) => {
  const {
    open,
    onClose,
    operation,
    editItem,
    handleAddNewItem,
    handleEditItem,
    handleDeleteItem,
    userRoles,
  } = props;
  const initialState = {
    userId: 0,
    fullName: "",
    displayName: "",
    firstName: "",
    lastName: "",
    email: "",
    gid: "",
    lineManager: "",
    sponsor: "",
    organizationID: "",
    organization: "",
    department: "",
    country: "",
    mobileNumber: "",
    userRole: {
      roleId: 0,
    },
    username: "",
    password: "",
  };
  const [userData, setUserData] = useState<UserCreationData>(initialState);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isSaveButtonDisabled =
    !userData.fullName ||
    !userData.firstName ||
    !userData.lastName ||
    !userData.displayName ||
    !userData.email ||
    !userData.gid ||
    !userData.lineManager ||
    !userData.sponsor ||
    !userData.organizationID ||
    !userData.organization ||
    !userData.department ||
    !userData.country ||
    !userData.mobileNumber ||
    !userData.username ||
    !userData.password ||
    userData.userRole.roleId === 0;

  useEffect(() => {
    if (editItem) {
      setUserData({
        userId: editItem.userId ?? 0,
        fullName: editItem.fullName ?? "",
        displayName: editItem.displayName ?? "",
        firstName: editItem.firstName ?? "",
        lastName: editItem.lastName ?? "",
        email: editItem.email ?? "",
        gid: editItem.gid ?? "",
        lineManager: editItem.lineManager ?? "",
        sponsor: editItem.sponsor ?? "",
        organizationID: editItem.organizationID ?? "",
        organization: editItem.organization ?? "",
        department: editItem.department ?? "",
        country: editItem.country ?? "",
        mobileNumber: editItem.mobileNumber ?? "",
        userRole: {
          roleId: editItem.roleId ?? 0,
        },
        username: editItem.username ?? "",
        password: editItem.password ?? "",
      });
      setConfirmPassword(editItem.password ?? "");
    } else {
      setUserData(initialState);
      setConfirmPassword("");
    }
  }, [editItem]);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: operation === "delete" ? 500 : 900,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "90vh",
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      // Check if passwords match
      setPasswordError(
        name === "confirmPassword" && userData.password !== value
          ? "Passwords do not match"
          : null,
      );
    }
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordError(
      userData.password !== value ? "Passwords do not match" : null,
    );
  };
  const handleInputRoleChange = (e: SelectChangeEvent<number>) => {
    const roleId =
      typeof e.target.value === "string"
        ? parseInt(e.target.value)
        : e.target.value;
    setUserData((prevData) => ({
      ...prevData,
      userRole: { roleId },
    }));
  };

  const handleSubmit = () => {
    if (userData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError(null);

    if (operation === "add") {
      handleAddNewItem(userData as UserCreationData);
    } else if (operation === "edit" && editItem) {
      handleEditItem(userData as UserCreationData);
    } else if (operation === "delete" && editItem) {
      handleDeleteItem(editItem.userId);
    }
    onClose();
  };

  const handleReset = () => {
    if (operation === "add") {
      setUserData({
        userId: 0,
        fullName: "",
        displayName: "",
        firstName: "",
        lastName: "",
        email: "",
        gid: "",
        lineManager: "",
        sponsor: "",
        organizationID: "",
        organization: "",
        department: "",
        country: "",
        mobileNumber: "",
        userRole: {
          roleId: 0,
        },
        username: "",
        password: "",
      });
    } else if (operation === "edit" && editItem) {
      setUserData({
        userId: editItem.userId ?? 0,
        fullName: editItem.fullName ?? "",
        displayName: editItem.displayName ?? "",
        firstName: editItem.firstName ?? "",
        lastName: editItem.lastName ?? "",
        email: editItem.email ?? "",
        gid: editItem.gid ?? "",
        lineManager: editItem.lineManager ?? "",
        sponsor: editItem.sponsor ?? "",
        organizationID: editItem.organizationID ?? "",
        organization: editItem.organization ?? "",
        department: editItem.department ?? "",
        country: editItem.country ?? "",
        mobileNumber: editItem.mobileNumber ?? "",
        userRole: {
          roleId: editItem.roleId ?? 0,
        },
        username: editItem.username ?? "",
        password: editItem.password ?? "",
      });
    }
    onClose();
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Box
            sx={{
              backgroundColor: "#005f87",
              color: "white",
              p: 0.2,
              pl: 2,
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography component="p" fontWeight="bold">
              {operation === "add"
                ? "Add User"
                : operation === "edit"
                  ? "Edit User"
                  : "Confirmation"}
            </Typography>
            <StyledClearIcon onClick={handleReset}>
              <ClearIcon />
            </StyledClearIcon>
          </Box>
          {operation === "delete" ? (
            <Box sx={{ padding: 2, pb: 3 }}>
              <Typography sx={{ fontSize: "15px", mb: 1 }}>
                Are you sure you want to delete this?
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={2} p={2}>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Full Name
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="fullName"
                    name="fullName"
                    variant="outlined"
                    fullWidth
                    value={userData.fullName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Display Name
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="displayName"
                    name="displayName"
                    variant="outlined"
                    fullWidth
                    value={userData.displayName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    First Name
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="firstName"
                    name="firstName"
                    variant="outlined"
                    fullWidth
                    value={userData.firstName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Last Name
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="lastName"
                    name="lastName"
                    variant="outlined"
                    fullWidth
                    value={userData.lastName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Email
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    value={userData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    GID
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="gid"
                    name="gid"
                    variant="outlined"
                    fullWidth
                    value={userData.gid}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Line Manager
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="lineManager"
                    name="lineManager"
                    variant="outlined"
                    fullWidth
                    value={userData.lineManager}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Sponsor
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="sponsor"
                    name="sponsor"
                    variant="outlined"
                    fullWidth
                    value={userData.sponsor}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    OrganizationId
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="organizationID"
                    name="organizationID"
                    variant="outlined"
                    fullWidth
                    value={userData.organizationID}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Organization
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="organization"
                    name="organization"
                    variant="outlined"
                    fullWidth
                    value={userData.organization}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Department
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="department"
                    name="department"
                    variant="outlined"
                    fullWidth
                    value={userData.department}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Country
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="country"
                    name="country"
                    variant="outlined"
                    fullWidth
                    value={userData.country}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Mobile Number
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="mobileNumber"
                    name="mobileNumber"
                    variant="outlined"
                    fullWidth
                    value={userData.mobileNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    User Role
                  </StyledTypographyModal>
                  <StyledDropdownModalInput
                    fullWidth
                    value={userData.userRole.roleId}
                    variant="outlined"
                    name="roleId"
                    // @ts-ignore
                    onChange={handleInputRoleChange}
                  >
                    {Array.isArray(userRoles) &&
                      userRoles.map((role) => (
                        <MenuItem key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </MenuItem>
                      ))}
                  </StyledDropdownModalInput>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    UserName
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="username"
                    name="username"
                    variant="outlined"
                    fullWidth
                    value={userData.username}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Password <span style={{ color: "red" }}>*</span>
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="password"
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    value={userData.password}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal className="labels">
                    Confirm Password <span style={{ color: "red" }}>*</span>
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {passwordError && (
                    <Grid item xs={12}>
                      <Typography color="error">{passwordError}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </>
          )}
          <Box
            sx={{
              backgroundColor: "#f5f7fa",
              p: 1,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              size="small"
              sx={{ mr: 1, color: "#2b7985", borderColor: "#2b7985" }}
              variant="outlined"
              onClick={handleReset}
            >
              <ClearIcon fontSize="small" sx={{ pr: 0.5, color: "#2b7985" }} />
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#2b7985",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleSubmit}
              disabled={operation !== "delete" && isSaveButtonDisabled}
            >
              {operation === "delete" ? (
                <DeleteIcon fontSize="small" sx={{ color: "white", pr: 0.5 }} />
              ) : (
                <DoneIcon fontSize="small" sx={{ color: "white", pr: 0.5 }} />
              )}
              {operation === "add"
                ? "Save"
                : operation === "edit"
                  ? "Save"
                  : "Ok"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateAddUserCustomModal;
