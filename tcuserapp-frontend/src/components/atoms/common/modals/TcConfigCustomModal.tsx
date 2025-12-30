import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControlLabel,
  MenuItem,
  Modal,
  Radio,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { TcConfigResponse } from "../../../../models/tcConfigModel";
import { SystemResponse } from "../../../molecules/dashboard/systemPage";
import {
  StyledClearIcon,
  StyledInnerModalBox,
  StyledRadioButton,
  StyledTextFieldModal,
  StyledTypographyModal,
} from "../../../molecules/dashboard/groupPage/styledComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  handleAddNewItem: (tcConfigData: TcConfigResponse) => void;
  handleEditItem: (editedItem: TcConfigResponse) => void;
  editItem: TcConfigResponse | null;
  handleDeleteItem: (tcConfigId: number | undefined) => void;
  systemData: SystemResponse[];
}

const TcConfigCustomModal = (props: Props) => {
  const {
    open,
    operation,
    editItem,
    handleAddNewItem,
    handleEditItem,
    handleDeleteItem,
    systemData,
    onClose,
  } = props;

  const [tcConfigData, setTcConfigData] = useState({
    tcConfigId: 0,
    configName: "",
    systemId: 0,
    tcURL: "",
    fmsURL: "",
    ssoEnabled: false,
    ssoLoginURL: "",
    ssoIdentityURL: "",
    ssoTCAppId: 0,
    active: false,
    userName: "",
    password: "",
  });

  const isSaveButtonDisabled =
    !tcConfigData.tcURL ||
    tcConfigData.systemId === 0 ||
    !tcConfigData.userName ||
    !tcConfigData.password;
  useEffect(() => {
    if (editItem) {
      setTcConfigData({
        tcConfigId: editItem.tcConfigId ?? 0,
        configName: editItem.configName ?? "",
        systemId: editItem.systemId ?? 0,
        tcURL: editItem.tcURL ?? "",
        fmsURL: editItem.fmsURL ?? "",
        ssoEnabled: editItem.ssoEnabled ?? false,
        ssoLoginURL: editItem.ssoLoginURL ?? "",
        ssoIdentityURL: editItem.ssoIdentityURL ?? "",
        ssoTCAppId: editItem.ssoTCAppId ?? 0,
        active: editItem.active ?? false,
        userName: editItem.userName ?? "",
        password: editItem.password ?? "",
      });
    } else {
      setTcConfigData({
        tcConfigId: 0,
        configName: "",
        systemId: 0,
        tcURL: "",
        fmsURL: "",
        ssoEnabled: false,
        ssoLoginURL: "",
        ssoIdentityURL: "",
        ssoTCAppId: 0,
        active: false,
        userName: "",
        password: "",
      });
    }
  }, [editItem]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTcConfigData({
      ...tcConfigData,
      [name]: value,
    });
  };

  const handleInputSystemChange = (e: SelectChangeEvent<number>) => {
    const systemId =
      typeof e.target.value === "string"
        ? parseInt(e.target.value)
        : e.target.value;
    setTcConfigData((prevData) => ({
      ...prevData,
      systemId: systemId,
    }));
  };

  const handleRadioSsoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const booleanValue = value === "a";
    setTcConfigData((prevData) => ({
      ...prevData,
      ssoEnabled: booleanValue,
    }));
  };
  const handleRadioActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const booleanValue = value === "a";
    setTcConfigData((prevData) => ({
      ...prevData,
      active: booleanValue,
    }));
  };

  const addClearInputField = () => {
    handleAddNewItem(tcConfigData);
    setTcConfigData({
      tcConfigId: 0,
      configName: "",
      systemId: 0,
      tcURL: "",
      fmsURL: "",
      ssoEnabled: false,
      ssoLoginURL: "",
      ssoIdentityURL: "",
      ssoTCAppId: 0,
      active: false,
      userName: "",
      password: "",
    });
  };

  useEffect(() => {
    if (open && operation === "add") {
      setTcConfigData({
        tcConfigId: 0,
        configName: "",
        systemId: 0,
        tcURL: "",
        fmsURL: "",
        ssoEnabled: false,
        ssoLoginURL: "",
        ssoIdentityURL: "",
        ssoTCAppId: 0,
        active: false,
        userName: "",
        password: "",
      });
    }
  }, [open]);

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
              pl: 2,
              fontWeight: "small",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography component="p" fontWeight="bold">
              {operation === "add"
                ? "Add Teamcenter Configuration"
                : operation === "edit"
                  ? "Edit Teamcenter Configuration"
                  : "Confirmation"}
            </Typography>
            <StyledClearIcon onClick={onClose}>
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
                margin: "0px 2px 12px",
                padding: "6px 11px 0px 12px",
              }}
            >
              <Box>
                <StyledTypographyModal
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Config Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={tcConfigData.configName}
                  variant="outlined"
                  type="text"
                  name="configName"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 1, margin: "0px -5px" }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  System Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <Select
                  sx={{
                    padding: "0px",

                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    "&:hover": {
                      borderColor: "#888",
                    },
                    "& .MuiSelect-select": {
                      padding: "5px 10px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  fullWidth
                  value={tcConfigData.systemId}
                  variant="outlined"
                  name="systemName"
                  onChange={handleInputSystemChange}
                >
                  {Array.isArray(systemData) &&
                    systemData?.map((system) => (
                      <MenuItem key={system.systemId} value={system.systemId}>
                        {system.systemName}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
              <Box sx={{ padding: 1 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  Teamcenter Host Address{" "}
                  <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={tcConfigData.tcURL}
                  placeholder="http://<HOSTNAME>:<PORTNAME>/tc"
                  variant="outlined"
                  type="text"
                  name="tcURL"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 1 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  Teamcenter FMS URL
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={tcConfigData.fmsURL}
                  placeholder="http://<HOSTNAME>:<FMSPORTNAME>"
                  variant="outlined"
                  type="text"
                  name="fmsURL"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 1 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  User Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={tcConfigData.userName}
                  variant="outlined"
                  type="text"
                  name="userName"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 1 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  Password <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={tcConfigData.password}
                  variant="outlined"
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 2, pb: 0 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  SSO Enabled
                </StyledTypographyModal>
                <StyledRadioButton
                  aria-label="radios"
                  name="radio-buttons"
                  sx={{ display: "flex", flexDirection: "row" }}
                  value={tcConfigData.ssoEnabled ? "a" : "b"}
                  onChange={handleRadioSsoChange}
                >
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value="a"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value="b"
                    control={<Radio />}
                    label="No"
                  />
                </StyledRadioButton>
              </Box>
              {tcConfigData.ssoEnabled === true && (
                <>
                  <Box sx={{ padding: 1 }}>
                    <StyledTypographyModal
                      sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                    >
                      SSO Login Server URL
                    </StyledTypographyModal>
                    <TextField
                      fullWidth
                      value={tcConfigData.ssoLoginURL}
                      variant="outlined"
                      type="text"
                      name="ssoLoginURL"
                      placeholder="http://<HOSTNAME>:<PORTNAME>/<login service>/weblogin/login_redirect"
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box sx={{ padding: 1 }}>
                    <StyledTypographyModal
                      sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                    >
                      SSO Identity Server URL
                    </StyledTypographyModal>
                    <TextField
                      fullWidth
                      value={tcConfigData.ssoIdentityURL}
                      variant="outlined"
                      type="text"
                      name="ssoIdentityURL"
                      placeholder="http://<HOSTNAME>:<PORTNAME>/<identity service>"
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box sx={{ padding: 1 }}>
                    <StyledTypographyModal
                      sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                    >
                      Teamcenter Application ID:
                    </StyledTypographyModal>
                    <TextField
                      fullWidth
                      value={tcConfigData.ssoTCAppId}
                      variant="outlined"
                      type="text"
                      name="ssoTCAppId"
                      onChange={handleInputChange}
                    />
                  </Box>
                </>
              )}
              <Box sx={{ padding: 2, pb: 0 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  Active
                </StyledTypographyModal>
                <StyledRadioButton
                  aria-label="radios"
                  name="radio-buttons"
                  sx={{ display: "flex", flexDirection: "row" }}
                  value={tcConfigData.active ? "a" : "b"}
                  onChange={handleRadioActiveChange}
                >
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value="a"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    sx={{ display: "block" }}
                    value="b"
                    control={<Radio />}
                    label="No"
                  />
                </StyledRadioButton>
              </Box>
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
              onClick={onClose}
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
                  handleEditItem({ ...tcConfigData });
                } else if (operation === "delete") {
                  handleDeleteItem(tcConfigData.tcConfigId);
                }
              }}
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

export default TcConfigCustomModal;
