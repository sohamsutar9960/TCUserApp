import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControlLabel,
  MenuItem,
  Modal,
  Radio,
  SelectChangeEvent,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { GroupResponse } from "../../../../models/groupModel";
import { SystemResponse } from "../../../molecules/dashboard/systemPage";
import {
  StyledTypographyModal,
  StyledTextFieldModal,
  StyledClearIcon,
  StyledInnerModalBox,
  StyledisRootBox,
  StyledRadioButton,
  StyledDropdownModalInput,
} from "../../../molecules/dashboard/groupPage/styledComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  handleAddNewItem: (groupdata: GroupResponse) => void;
  handleEditItem: (editedItem: GroupResponse) => void;
  editItem: GroupResponse | null;
  handleDeleteItem: (groupId: number | undefined) => void;
  systemsData: SystemResponse[];
  groupsData: GroupResponse[];
  importGroups: (groupName: string | undefined, systemId: number) => void;
}

const GroupCustomModal = (props: Props) => {
  const {
    open,
    onClose,
    operation,
    editItem,
    systemsData,
    handleAddNewItem,
    handleEditItem,
    handleDeleteItem,
    groupsData,
    importGroups,
  } = props;
  const initialData = {
    id: "",
    name: "",
    description: "",
    displayName: "",
    groupId: 0,
    groupName: "",
    parentGroupName: "",
    parentGroupId: 0,

    root: false,
    systemId: 0,
    systemName: "",
    uid: "",
    groupNamePath: "",
    level: "",
  };
  const [groupData, setGroupData] = useState<GroupResponse>(initialData);

  const isSaveButtonDisabled =
    !groupData.groupName || !groupData.uid || groupData.systemId === 0;

  useEffect(() => {
    if (editItem) {
      setGroupData({
        id: editItem.id ?? "",
        name: editItem.name ?? "",
        description: editItem.description ?? "",
        displayName: editItem.displayName ?? "",
        groupId: editItem.groupId ?? 0,
        groupName: editItem.groupName ?? "",
        parentGroupName: editItem.parentGroupName ?? "",
        root: editItem.root,
        systemId: editItem.systemId ?? 0,
        systemName: editItem.systemName ?? "",
        uid: editItem.uid ?? "",
        parentGroupId: editItem.parentGroupId ?? 0,
        groupNamePath: editItem.groupNamePath ?? "",
        level: editItem.level ?? "",
      });
    } else {
      setGroupData(initialData);
    }
  }, [editItem]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setGroupData({
      ...groupData,
      [name]: value,
    });
  };
  const handleInputServiceChange = (e: SelectChangeEvent<unknown>) => {
    const systemId = parseInt(e.target.value as string, 10);
    setGroupData((prevData) => ({
      ...prevData,
      systemId: systemId,
    }));
  };

  const handleInputGroupChange = (e: SelectChangeEvent<unknown>) => {
    const groupId = parseInt(e.target.value as string, 10);
    setGroupData((prevData) => ({
      ...prevData,
      parentGroupId: groupId,
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const booleanValue = value === "a";
    setGroupData({
      ...groupData,
      root: booleanValue,
    });
  };

  const addClearInputField = () => {
    // @ts-ignore
    handleAddNewItem(groupData);
    setGroupData(initialData);
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
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography component="p" fontWeight="bold">
              {operation === "add"
                ? "Add Group"
                : operation === "edit"
                  ? "Edit Group"
                  : operation === "import"
                    ? "Create Group"
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
          ) : operation === "import" ? (
            <Box mx={1}>
              <Box sx={{ padding: 0.5, my: 2 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Group Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={groupData.groupName}
                  variant="outlined"
                  type="text"
                  name="groupName"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 0.5, mb: 2 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  System Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledDropdownModalInput
                  fullWidth
                  value={groupData.systemId}
                  variant="outlined"
                  name="systemName"
                  onChange={handleInputServiceChange}
                >
                  {Array.isArray(systemsData) &&
                    systemsData.map((system) => (
                      <MenuItem key={system.systemId} value={system.systemId}>
                        {system.systemName}
                      </MenuItem>
                    ))}
                </StyledDropdownModalInput>
              </Box>
            </Box>
          ) : (
            <StyledInnerModalBox>
              <Box sx={{ padding: 0.5 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  UID <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={groupData.uid}
                  variant="outlined"
                  type="text"
                  name="uid"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 0.5 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Group Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={groupData.groupName}
                  variant="outlined"
                  type="text"
                  name="groupName"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 0.5 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Display Name
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={groupData.displayName}
                  variant="outlined"
                  type="text"
                  name="displayName"
                  onChange={handleInputChange}
                />
              </Box>
              <StyledisRootBox>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Is Root
                </Typography>
                <StyledRadioButton
                  aria-label="radios"
                  name="radio-buttons"
                  sx={{ display: "flex", flexDirection: "row" }}
                  value={groupData.root ? "a" : "b"}
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
                </StyledRadioButton>
              </StyledisRootBox>
              <Box sx={{ padding: 0.5 }}>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Parent Group Name
                </Typography>
                <StyledDropdownModalInput
                  fullWidth
                  value={groupData?.parentGroupId}
                  variant="outlined"
                  name="parentGroupName"
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
              <Box sx={{ padding: 0.5 }}>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  System Name <span style={{ color: "red" }}>*</span>
                </Typography>
                <StyledDropdownModalInput
                  fullWidth
                  value={groupData.systemId}
                  variant="outlined"
                  name="systemName"
                  onChange={handleInputServiceChange}
                >
                  {Array.isArray(systemsData) &&
                    systemsData.map((system) => (
                      <MenuItem key={system.systemId} value={system.systemId}>
                        {system.systemName}
                      </MenuItem>
                    ))}
                </StyledDropdownModalInput>
              </Box>
              <Box sx={{ padding: 0.5 }}>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                >
                  Description
                </Typography>
                <TextareaAutosize
                  value={groupData.description}
                  name="description"
                  onChange={handleInputChange}
                  style={{
                    minWidth: "97%",
                    maxWidth: "97%",
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    height: "30px !important",
                  }}
                />
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
            {operation !== "import" && (
              <Button
                size="small"
                sx={{ mr: 1, color: "#2b7985", borderColor: "#2b7985" }}
                variant="outlined"
                onClick={onClose}
              >
                <ClearIcon
                  fontSize="small"
                  sx={{ pr: 0.5, color: "#2b7985" }}
                />
                Cancel
              </Button>
            )}
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#2b7985",
                display: "flex",
                alignItems: "center",
              }}
              disabled={
                (operation === "add" || operation === "edit") &&
                isSaveButtonDisabled
              }
              onClick={() => {
                if (operation === "add") {
                  addClearInputField();
                } else if (operation === "edit" && editItem) {
                  handleEditItem({ ...groupData });
                } else if (operation === "delete" && editItem) {
                  handleDeleteItem(editItem.groupId);
                } else if (operation === "import") {
                  importGroups(groupData.groupName, groupData.systemId);
                  setGroupData(initialData);
                }
              }}
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
                  : operation === "import"
                    ? "Create Group"
                    : "Ok"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default GroupCustomModal;
