import React, { useEffect, useState } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {
  GroupRoleApprover,
  GroupRoleApproversByIdResponse,
} from "../../../../models/groupRoleApproverModel";
import {
  StyledClearIcon,
  StyledTextFieldModal,
  StyledTypographyModal,
} from "../../../molecules/dashboard/groupPage/styledComponent";
import "./groupRoleApproverCustomModal.scss";

interface Props {
  open: boolean;
  onClose: () => void;
  togglePopup: () => void;
  operation: "add" | "edit" | "activate" | "deActivate";
  handleAddNewItem: (groupRoleApproverData: GroupRoleApprover) => void;
  handleEditItem: (editedItem: GroupRoleApprover) => void;
  editItem: GroupRoleApprover | null;
  fetchGroupRoleApproversById: (id: string) => void;
  selectedApprover: GroupRoleApproversByIdResponse | null;
  setIsDataAdded: (isDataAdded: boolean) => void;
  isDataAdded: boolean;
}

const GroupRoleApproverCustomModal = (props: Props) => {
  const {
    open,
    onClose,
    operation,
    editItem,
    handleAddNewItem,
    handleEditItem,
    fetchGroupRoleApproversById,
    togglePopup,
    selectedApprover,
    setIsDataAdded,
    isDataAdded,
  } = props;
  const initialData = {
    groupRoleApproverId: 0,
    gid: "",
    fullName: "",
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    lineManager: "",
    sponsor: "",
    department: "",
    organization: "",
    organizationID: "",
    country: "",
    osUserName: "",
    locality: "",
    mobileNumber: "",
    city: "",
    isActive: false,
  };

  const [groupRoleApproverData, setGroupRoleApproverData] =
    useState<GroupRoleApprover>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (editItem) {
      setGroupRoleApproverData({
        groupRoleApproverId: editItem.groupRoleApproverId ?? 0,
        gid: editItem.gid ?? "",
        fullName: editItem.fullName ?? "",
        firstName: editItem.firstName ?? "",
        lastName: editItem.lastName ?? "",
        displayName: editItem.displayName ?? "",
        email: editItem.email ?? "",
        lineManager: editItem.lineManager ?? "",
        sponsor: editItem.sponsor ?? "",
        department: editItem.department ?? "",
        organization: editItem.organization ?? "",
        organizationID: editItem.organizationID ?? "",
        country: editItem.country ?? "",
        osUserName: editItem.osUserName ?? "",
        locality: editItem.locality ?? "",
        mobileNumber: editItem.mobileNumber ?? "",
        city: editItem.city ?? "",
        isActive: editItem.isActive ?? false,
      });
    } else {
      setGroupRoleApproverData(initialData);
    }
  }, [editItem]);

  useEffect(() => {
    if (selectedApprover) {
      setGroupRoleApproverData({
        gid: selectedApprover.GID,
        fullName: selectedApprover.FullName,
        firstName: selectedApprover.FirstName,
        lastName: selectedApprover.LastName,
        displayName: selectedApprover.DisplayName,
        email: selectedApprover.Email,
        lineManager: selectedApprover.LineManager,
        sponsor: selectedApprover.Sponsor,
        department: selectedApprover.Department,
        organization: selectedApprover.Organization,
        organizationID: selectedApprover.OrganizationID,
        country: selectedApprover.Country,
        osUserName: "",
        locality: "",
        mobileNumber: selectedApprover.MobileNumber,
        city: "",
        isActive: true,
      });
    }
  }, [selectedApprover]);

  useEffect(() => {
    validateForm();
  }, [groupRoleApproverData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setGroupRoleApproverData({
      ...groupRoleApproverData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (operation === "add") {
      handleAddNewItem(groupRoleApproverData);
      setGroupRoleApproverData(initialData);
    } else if (operation === "edit" && editItem) {
      handleEditItem(groupRoleApproverData);
    }
    onClose();
  };

  const handleClose = () => {
    if (operation === "edit" && editItem) {
      setGroupRoleApproverData({
        groupRoleApproverId: editItem.groupRoleApproverId ?? 0,
        gid: editItem.gid ?? "",
        fullName: editItem.fullName ?? "",
        firstName: editItem.firstName ?? "",
        lastName: editItem.lastName ?? "",
        displayName: editItem.displayName ?? "",
        email: editItem.email ?? "",
        lineManager: editItem.lineManager ?? "",
        sponsor: editItem.sponsor ?? "",
        department: editItem.department ?? "",
        organization: editItem.organization ?? "",
        organizationID: editItem.organizationID ?? "",
        country: editItem.country ?? "",
        osUserName: editItem.osUserName ?? "",
        locality: editItem.locality ?? "",
        mobileNumber: editItem.mobileNumber ?? "",
        city: editItem.city ?? "",
        isActive: editItem.isActive ?? true,
      });
    } else if (operation === "add") {
      setGroupRoleApproverData(initialData);
    }
    onClose();
  };

  const handleDialog = (gid: string) => {
    fetchGroupRoleApproversById(gid);
    togglePopup();
  };

  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "email", "gid"];
    const isValid = requiredFields.every(
      (field) => groupRoleApproverData[field as keyof GroupRoleApprover],
    );
    setIsFormValid(isValid);
  };

  const handleClear = () => {
    setGroupRoleApproverData(initialData);
    setIsDataAdded(false);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "95vh",
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Box
            sx={{
              backgroundColor: "#005f87",
              color: "white",
              pl: 2,
              pr: 1,
              fontWeight: "small",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography component="p" fontWeight="bold">
              {operation === "add"
                ? "Add Group Role Approver"
                : "Edit Group Role Approver"}
            </Typography>
            <StyledClearIcon onClick={handleClose}>
              <ClearIcon />
            </StyledClearIcon>
          </Box>
          {operation === "add" ? (
            <Grid container spacing={2} p={2}>
              <Grid item xs={12} sm={12}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  First Name
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="firstName"
                  name="firstName"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.firstName}
                  onChange={handleInputChange}
                  className={isDataAdded ? "textfield-not-allowed" : ""}
                  InputProps={{
                    readOnly: isDataAdded,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Last Name
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="lastName"
                  name="lastName"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.lastName}
                  onChange={handleInputChange}
                  className={isDataAdded ? "textfield-not-allowed" : ""}
                  InputProps={{
                    readOnly: isDataAdded,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  GID <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="gid"
                  name="gid"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.gid}
                  onChange={handleInputChange}
                  className={isDataAdded ? "textfield-not-allowed" : ""}
                  InputProps={{
                    readOnly: isDataAdded,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Email
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.email}
                  onChange={handleInputChange}
                  className={isDataAdded ? "textfield-not-allowed" : ""}
                  InputProps={{
                    readOnly: isDataAdded,
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2} p={2}>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  First Name
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="firstName"
                  name="firstName"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Last Name
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="lastName"
                  name="lastName"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Full Name
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="fullName"
                  name="fullName"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.fullName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Display Name
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="displayName"
                  name="displayName"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.displayName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  GID
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="gid"
                  name="gid"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.gid}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Email
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Line Manager
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="lineManager"
                  name="lineManager"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.lineManager}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Sponser
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="sponsor"
                  name="sponsor"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.sponsor}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Organization ID
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="organizationID"
                  name="organizationID"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.organizationID}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Organization
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="organization"
                  name="organization"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.organization}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Country
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="country"
                  name="country"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.country}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Department
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="department"
                  name="department"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.department}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  City
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="city"
                  name="city"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.city}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6}>
                <StyledTypographyModal
                  className="labels"
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Mobile Number
                </StyledTypographyModal>
                <StyledTextFieldModal
                  id="mobileNumber"
                  name="mobileNumber"
                  variant="outlined"
                  fullWidth
                  value={groupRoleApproverData.mobileNumber}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            </Grid>
          )}

          {operation === "add" ? (
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
                onClick={handleClear}
              >
                <ClearIcon
                  fontSize="small"
                  sx={{ pr: 0.5, color: "#2b7985" }}
                />
                Clear
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#2b7985",
                  display: "flex",
                  alignItems: "center",
                  mr: 1,
                }}
                onClick={() => handleDialog(groupRoleApproverData?.gid ?? "")}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#2b7985",
                  display: "flex",
                  alignItems: "center",
                }}
                disabled={!isFormValid}
                onClick={handleSubmit}
              >
                <KeyboardDoubleArrowRightIcon fontSize="small" />
                Proceed
              </Button>
            </Box>
          ) : (
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
                onClick={handleClose}
              >
                <ClearIcon
                  fontSize="small"
                  sx={{ pr: 0.5, color: "#2b7985" }}
                />
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
                disabled={!isFormValid}
                onClick={handleSubmit}
              >
                <DoneIcon fontSize="small" />
                Save
              </Button>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default GroupRoleApproverCustomModal;
