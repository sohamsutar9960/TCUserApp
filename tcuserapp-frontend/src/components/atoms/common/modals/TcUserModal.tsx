import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControlLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { TcUserModel } from "../../../../models/tcUserModel";
import { SystemResponse } from "../../../molecules/dashboard/systemPage";
import {
  StyledClearIcon,
  StyledDropdownModalInput,
  StyledInnerModalBox,
  StyledTextFieldModal,
  StyledTypographyModal,
  StyledisRootBox,
} from "../../../molecules/dashboard/groupPage/styledComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  handleAddNewItem: (tcUserData: TcUserModel) => void;
  handleEditItem: (editedItem: TcUserModel) => void;
  editItem: TcUserModel | null;
  handleDeleteItem: (tcUserId: number | undefined) => void;
  systemData: SystemResponse[];
}

const TcUserModal = (props: Props) => {
  const {
    open,
    onClose,
    operation,
    editItem,
    handleAddNewItem,
    handleEditItem,
    handleDeleteItem,
  } = props;

  const [tcUserData, setTcUserData] = useState({
    gid: "",
    userHistoryId: 0,
    tcUserId: "",
    systemName: "",
    requestStatus: "",
    userStatus: "",
    neverLock: false,
    tcCreated: false,
    tcAccountType: "",
  });
  const isSaveButtonDisabled =
    !tcUserData.gid ||
    !tcUserData.tcUserId ||
    !tcUserData.systemName ||
    !tcUserData.requestStatus ||
    !tcUserData.tcAccountType ||
    !tcUserData.userStatus;

  const [userType, setUserType] = useState([
    { userType: "Normal User", userTypeId: 1, tcAccountType: "Normal_User" },
    {
      userType: "BU Admin User",
      userTypeId: 2,
      tcAccountType: "BU_Admin_User",
    },
  ]);

  const [request, setRequest] = useState([
    { requestType: "Request Created", requestStatus: "Request_Created" },
    { requestType: "Request Cancelled", requestStatus: "Request_Cancelled" },
    {
      requestType: "Approved By Cost Manager",
      requestStatus: "Approved_By_Cost_Manager",
    },
    {
      requestType: "Rejected By Cost Manager",
      requestStatus: "Rejected_By_Cost_Manager",
    },
    {
      requestType: "Approved By GroupRole Approver",
      requestStatus: "Approved_By_GroupRole_Approver",
    },
    {
      requestType: "Rejected By GroupRole Approver",
      requestStatus: "Rejected_By_GroupRole_Approver",
    },
    {
      requestType: "Exported To Target System",
      requestStatus: "Exported_To_Target_System",
    },
  ]);
  useEffect(() => {
    if (editItem) {
      setTcUserData({
        gid: editItem.gid ?? "",
        userHistoryId: editItem.userHistoryId ?? 0,
        tcUserId: editItem.tcUserId ?? "",
        systemName: editItem.systemName ?? "",
        requestStatus: editItem.requestStatus ?? "",
        userStatus: editItem.userStatus ?? "",
        neverLock: editItem.neverLock ?? false,
        tcCreated: editItem.tcCreated ?? false,
        tcAccountType: editItem.tcAccountType ?? "",
      });
    } else {
      setTcUserData({
        gid: "",
        userHistoryId: 0,
        tcUserId: "",
        systemName: "",
        requestStatus: "",
        userStatus: "",
        neverLock: false,
        tcCreated: false,
        tcAccountType: "",
      });
    }
  }, [editItem]);

  const handleCancel = () => {
    if (operation === "add") {
      setTcUserData({
        gid: "",
        userHistoryId: 0,
        tcUserId: "",
        systemName: "",
        requestStatus: "",
        userStatus: "",
        neverLock: false,
        tcCreated: false,
        tcAccountType: "",
      });
    } else if (operation === "edit" && editItem) {
      setTcUserData({
        gid: editItem.gid ?? "",
        userHistoryId: editItem.userHistoryId ?? 0,
        tcUserId: editItem.tcUserId ?? "",
        systemName: editItem.systemName ?? "",
        requestStatus: editItem.requestStatus ?? "",
        userStatus: editItem.userStatus ?? "",
        neverLock: editItem.neverLock ?? false,
        tcCreated: editItem.tcCreated ?? false,
        tcAccountType: editItem.tcAccountType ?? "",
      });
    }
    onClose();
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTcUserData({
      ...tcUserData,
      [name]: value,
    });
  };

  const handleInputSystemChange = (e: SelectChangeEvent<unknown>) => {
    const { name, value } = e.target;
    setTcUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRadioSsoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const selectedValue = name === "userStatus" ? value : value === "true";
    setTcUserData((prevData) => ({
      ...prevData,
      [name]: selectedValue,
    }));
  };

  const addClearInputField = () => {
    handleAddNewItem(tcUserData);
    setTcUserData({
      gid: "",
      userHistoryId: 0,
      tcUserId: "",
      systemName: "",
      requestStatus: "",
      userStatus: "",
      neverLock: false,
      tcCreated: false,
      tcAccountType: "",
    });
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    maxHeight: "90vh",
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    overflowY: "auto",
    overflowX: "hidden",
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
              fontWeight: "small",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography component="p" fontWeight="bold">
              {operation === "add"
                ? "Add User History"
                : operation === "edit"
                  ? "Edit User History"
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
            <StyledInnerModalBox
              sx={{
                overflowY: "scroll",
                height: "80vh",
                margin: "0px 2px 12px",
                padding: "6px 11px 0px 12px",
              }}
            >
              <Box sx={{ padding: "13px 0px 0px 0px" }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                >
                  GID<span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={tcUserData.gid}
                  variant="outlined"
                  type="text"
                  name="gid"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: "13px 0px 0px 0px" }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                >
                  TC User ID<span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={tcUserData.tcUserId}
                  variant="outlined"
                  type="text"
                  name="tcUserId"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: "13px 0px 0px 0px" }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                >
                  System<span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={tcUserData.systemName}
                  placeholder=""
                  variant="outlined"
                  type="text"
                  name="systemName"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: "13px 0px 0px 0px" }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                >
                  Request Status<span style={{ color: "red" }}>*</span>
                </Typography>
                <StyledDropdownModalInput
                  fullWidth
                  value={tcUserData.requestStatus}
                  variant="outlined"
                  name="requestStatus"
                  onChange={handleInputSystemChange}
                >
                  {Array.isArray(request) &&
                    request?.map((req) => (
                      <MenuItem key={req.requestType} value={req.requestStatus}>
                        {req.requestType}
                      </MenuItem>
                    ))}
                </StyledDropdownModalInput>
              </Box>

              <Box sx={{ padding: 1 }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                >
                  User Type
                </Typography>
                <StyledDropdownModalInput
                  fullWidth
                  value={tcUserData.tcAccountType}
                  variant="outlined"
                  name="tcAccountType"
                  onChange={handleInputSystemChange}
                >
                  {Array.isArray(userType) &&
                    userType.map((user) => (
                      <MenuItem
                        key={user.userTypeId}
                        value={user.tcAccountType}
                      >
                        {user.userType}
                      </MenuItem>
                    ))}
                </StyledDropdownModalInput>
              </Box>

              <StyledisRootBox sx={{ padding: "13px 0px 0px 0px" }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                >
                  User Status<span style={{ color: "red" }}>*</span>
                </Typography>
                <RadioGroup
                  aria-label="radios"
                  name="userStatus"
                  sx={{ display: "flex", flexDirection: "row" }}
                  value={tcUserData.userStatus}
                  onChange={handleRadioSsoChange}
                >
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value="active"
                    control={<Radio />}
                    label="Active"
                  />
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value="inactive"
                    control={<Radio />}
                    label="Inactive"
                  />
                </RadioGroup>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                >
                  Teamcenter Created
                </Typography>
                <RadioGroup
                  aria-label="radios"
                  name="tcCreated"
                  sx={{ display: "flex", flexDirection: "row" }}
                  value={tcUserData.tcCreated}
                  onChange={handleRadioSsoChange}
                >
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value={true}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value={false}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </StyledisRootBox>

              <StyledisRootBox sx={{ padding: "13px 0px 0px 0px" }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                >
                  Never Lock
                </Typography>
                <RadioGroup
                  aria-label="radios"
                  name="neverLock"
                  sx={{ display: "flex", flexDirection: "row" }}
                  value={tcUserData.neverLock}
                  onChange={handleRadioSsoChange}
                >
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value="true"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value="false"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </StyledisRootBox>
            </StyledInnerModalBox>
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
              onClick={() => {
                if (operation === "add") {
                  addClearInputField();
                } else if (operation === "edit" && editItem) {
                  handleEditItem({ ...tcUserData });
                } else if (operation === "delete") {
                  handleDeleteItem(tcUserData.userHistoryId);
                }
              }}
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

export default TcUserModal;
