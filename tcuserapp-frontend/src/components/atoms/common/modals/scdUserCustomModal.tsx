import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { SCDUser } from "../../../../models/ScdUserModel";
import {
  StyledClearIcon,
  StyledTextFieldModal,
  StyledTypographyModal,
} from "../../../molecules/dashboard/groupPage/styledComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  handleAddNewItem: (createdUserData: SCDUser) => void;
  handleEditItem: (editedItem: SCDUser) => void;
  editItem: SCDUser | null;
  handleDeleteItem: (ScdUserId: number | undefined) => void;
}

const ScdUserCustomModal = (props: Props) => {
  const {
    open,
    onClose,
    operation,
    editItem,
    handleAddNewItem,
    handleEditItem,
    handleDeleteItem,
  } = props;
  const initialState = {
    scdUserId: 0,
    fullName: "",
    firstName: "",
    lastName: "",
    gid: "",
    displayName: "",
    email: "",
    lineManager: "",
    sponsor: "",
    department: "",
    organization: "",
    organizationID: "",
    country: "",
    mobileNumber: "",
  };

  const [scdUserData, setScdUserData] = useState<SCDUser>(initialState);
  const isSaveButtonDisabled =
    !scdUserData.fullName ||
    !scdUserData.firstName ||
    !scdUserData.lastName ||
    !scdUserData.displayName ||
    !scdUserData.email ||
    !scdUserData.gid ||
    !scdUserData.department ||
    !scdUserData.country ||
    !scdUserData.mobileNumber;

  useEffect(() => {
    if (editItem) {
      setScdUserData({
        scdUserId: editItem.scdUserId ?? 0,
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
      });
    } else {
      setScdUserData(initialState);
    }
  }, [editItem]);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: operation === "delete" ? 500 : 700,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "90vh",
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScdUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (operation === "add") {
      handleAddNewItem(scdUserData as SCDUser);
    } else if (operation === "edit" && editItem) {
      handleEditItem(scdUserData as SCDUser);
    } else if (operation === "delete" && editItem) {
      handleDeleteItem(editItem.scdUserId);
    }
    onClose();
  };

  const handleCancel = () => {
    if (operation === "add") {
      setScdUserData(initialState);
    } else if (operation === "edit" && editItem) {
      setScdUserData({
        scdUserId: editItem.scdUserId ?? 0,
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
                ? "Add Scd User"
                : operation === "edit"
                  ? "Edit Scd User"
                  : "Confirmation"}
            </Typography>
            <StyledClearIcon onClick={handleCancel}>
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
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    Full Name
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="fullName"
                    name="fullName"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.fullName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    Display Name
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="displayName"
                    name="displayName"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.displayName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    First Name
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="firstName"
                    name="firstName"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.firstName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    Last Name
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="lastName"
                    name="lastName"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.lastName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    Email
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    GID
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="gid"
                    name="gid"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.gid}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    Line Manager
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="lineManager"
                    name="lineManager"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.lineManager}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    Sponsor
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="sponsor"
                    name="sponsor"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.sponsor}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    OrganizationId
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="organizationID"
                    name="organizationID"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.organizationID}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    Organization
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="organization"
                    name="organization"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.organization}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    Department
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="department"
                    name="department"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.department}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    Country
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="country"
                    name="country"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.country}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTypographyModal
                    sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                  >
                    Mobile Number
                  </StyledTypographyModal>
                  <StyledTextFieldModal
                    id="mobileNumber"
                    name="mobileNumber"
                    variant="outlined"
                    fullWidth
                    value={scdUserData.mobileNumber}
                    onChange={handleInputChange}
                  />
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
              onClick={handleCancel}
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
              disabled={isSaveButtonDisabled}
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

export default ScdUserCustomModal;
