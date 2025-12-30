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
  TextareaAutosize,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { RoleResponse } from "../../../../models/roleModel";
import { GroupResponse } from "../../../../models/groupModel";
import { SystemResponse } from "../../../molecules/dashboard/systemPage";
import {
  StyledTypographyModal,
  StyledTextFieldModal,
  StyledClearIcon,
  StyledDropdownModalInput,
} from "../../../molecules/dashboard/groupPage/styledComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  handleAddNewItem: (roleData: RoleResponse) => void;
  handleEditItem: (editedItem: RoleResponse) => void;
  editItem: RoleResponse | null;
  handleDeleteItem: (groupId: number | undefined) => void;
  groupsData: GroupResponse[];
  systemsData: SystemResponse[];
}

const RoleCustomModal = (props: Props) => {
  const {
    open,
    onClose,
    operation,
    editItem,
    groupsData,
    systemsData,
    handleAddNewItem,
    handleEditItem,
    handleDeleteItem,
  } = props;

  const [roleData, setRoleData] = useState({
    assigned: false,
    description: "",
    displayName: "",
    groupId: 0,
    systemId: 0,
    roleId: 0,
    roleName: "",
    status: " ",
    uid: "",
  });

  const isSaveButtonDisabled =
    !roleData.roleName ||
    !roleData.uid ||
    roleData.groupId === 0 ||
    roleData.systemId === 0;

  useEffect(() => {
    if (editItem) {
      setRoleData({
        assigned: editItem.assigned ?? false,
        description: editItem.description ?? "",
        displayName: editItem.displayName ?? "",
        groupId: editItem.groupId ?? 0,
        systemId: editItem.systemId ?? 0,
        roleId: editItem.roleId ?? 0,
        roleName: editItem.roleName ?? "",
        status: editItem.status ?? "",
        uid: editItem.uid ?? "",
      });
    } else {
      setRoleData({
        assigned: false,
        description: "",
        displayName: "",
        groupId: 0,
        systemId: 0,
        roleId: 0,
        roleName: "",
        status: "",
        uid: "",
      });
    }
  }, [editItem]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setRoleData({
      ...roleData,
      [name]: value,
    });
  };

  const handleInputGroupChange = (e: SelectChangeEvent<number>) => {
    const groupId =
      typeof e.target.value === "string"
        ? parseInt(e.target.value)
        : e.target.value;
    setRoleData((prevData) => ({
      ...prevData,
      groupId: groupId,
    }));
  };
  const handleInputSystemChange = (e: SelectChangeEvent<number>) => {
    const systemId =
      typeof e.target.value === "string"
        ? parseInt(e.target.value)
        : e.target.value;
    setRoleData((prevData) => ({
      ...prevData,
      systemId: systemId,
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const booleanValue = value === "a";
    setRoleData({
      ...roleData,
      assigned: booleanValue,
    });
  };

  const addClearInputField = () => {
    handleAddNewItem(roleData);
    setRoleData({
      assigned: false,
      description: "",
      displayName: "",
      groupId: 0,
      systemId: 0,
      roleId: 0,
      roleName: "",
      status: "",
      uid: "",
    });
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: operation === "delete" ? 500 : 600,
    maxHeight: "95vh",
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
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
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography component="p" fontWeight="bold">
              {operation === "add"
                ? "Add Role"
                : operation === "edit"
                  ? "Edit Role"
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
            <>
              <Box sx={{ padding: 0.2, px: 2 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  UID <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={roleData.uid}
                  variant="outlined"
                  type="text"
                  name="uid"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 0.2, px: 2 }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  Role Name <span style={{ color: "red" }}>*</span>
                </Typography>
                <StyledTextFieldModal
                  fullWidth
                  value={roleData.roleName}
                  variant="outlined"
                  type="text"
                  name="roleName"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 0.2, px: 2 }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  Display Name <span style={{ color: "red" }}>*</span>
                </Typography>
                <StyledTextFieldModal
                  fullWidth
                  value={roleData.displayName}
                  variant="outlined"
                  type="text"
                  name="displayName"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 0.2, px: 2 }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  Status
                </Typography>
                <StyledTextFieldModal
                  fullWidth
                  value={roleData.status}
                  variant="outlined"
                  type="text"
                  name="status"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 0.2, pb: 0, px: 2 }}>
                <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                  Is Assigned <span style={{ color: "red" }}>*</span>
                </Typography>
                <RadioGroup
                  aria-label="radios"
                  name="radio-buttons"
                  sx={{ display: "flex", flexDirection: "row" }}
                  value={roleData.assigned ? "a" : "b"}
                  onChange={handleRadioChange}
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
                </RadioGroup>
              </Box>

              <Box sx={{ padding: 0.2, px: 2 }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  Group Name <span style={{ color: "red" }}>*</span>
                </Typography>
                <StyledDropdownModalInput
                  fullWidth
                  value={roleData.groupId}
                  variant="outlined"
                  name="groupId"
                  //@ts-ignore
                  onChange={handleInputGroupChange}
                >
                  {Array.isArray(groupsData) &&
                    groupsData.map((group) => (
                      <MenuItem key={group.groupId} value={group.groupId}>
                        {group.groupName}
                      </MenuItem>
                    ))}
                </StyledDropdownModalInput>
              </Box>
              <Box sx={{ padding: 0.2, px: 2 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  System Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledDropdownModalInput
                  fullWidth
                  value={roleData.systemId}
                  variant="outlined"
                  name="systemId"
                  //@ts-ignore
                  onChange={handleInputSystemChange}
                >
                  {Array.isArray(systemsData) &&
                    systemsData.map((system) => (
                      <MenuItem key={system.systemId} value={system.systemId}>
                        {system.systemName}
                      </MenuItem>
                    ))}
                </StyledDropdownModalInput>
              </Box>
              <Box sx={{ padding: 0.2, px: 2 }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.2 }}
                >
                  Description
                </Typography>
                <TextareaAutosize
                  minRows={3}
                  maxRows={5}
                  value={roleData.description}
                  name="description"
                  onChange={handleInputChange}
                  style={{
                    minWidth: "97%",
                    maxWidth: "97%",
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                />
              </Box>
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
              onClick={onClose}
            >
              <ClearIcon fontSize="small" sx={{ pr: 0.2, color: "#2b7985" }} />
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
                  handleEditItem({ ...roleData });
                } else if (operation === "delete" && editItem) {
                  handleDeleteItem(editItem.roleId);
                }
              }}
              disabled={operation !== "delete" && isSaveButtonDisabled}
            >
              {operation === "delete" ? (
                <DeleteIcon fontSize="small" sx={{ color: "white", pr: 0.2 }} />
              ) : (
                <DoneIcon fontSize="small" sx={{ color: "white", pr: 0.2 }} />
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

export default RoleCustomModal;
