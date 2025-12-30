import {
  Backdrop,
  Box,
  Button,
  Fade,
  MenuItem,
  Modal,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { VolumeResponse } from "../../../../models/VolumeModel";
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
  handleAddNewItem: (volumeResponse: VolumeResponse) => void;
  handleEditItem: (editedItem: VolumeResponse) => void;
  editItem: VolumeResponse | null;
  handleDeleteItem: (volumeId: number | undefined) => void;
  systemResponse: SystemResponse[];
}

const VolumeCustomModal = (props: Props) => {
  const {
    open,
    onClose,
    operation,
    editItem,
    systemResponse,
    handleAddNewItem,
    handleEditItem,
    handleDeleteItem,
  } = props;

  const initialVolumeData = {
    systemId: 0,
    systemName: "",
    volumeId: 0,
    volumeName: "",
  };

  const [volumeData, setVolumeData] = useState(initialVolumeData);
  const [initialData, setInitialData] = useState(initialVolumeData);
  const [currentOperation, setCurrentOperation] = useState(operation);

  const isSaveButtonDisabled =
    !volumeData.volumeName || volumeData.systemId === 0;

  useEffect(() => {
    setCurrentOperation(operation);
    if (operation === "edit" && editItem) {
      const data = {
        systemId: editItem.systemId ?? 0,
        systemName: editItem.systemName ?? "",
        volumeId: editItem.volumeId ?? 0,
        volumeName: editItem.volumeName ?? "",
      };
      setVolumeData(data);
      setInitialData(data);
    } else {
      setVolumeData(initialVolumeData);
    }
  }, [operation, editItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVolumeData({
      ...volumeData,
      [name]: value,
    });
  };

  const handleInputServiceChange = (e: SelectChangeEvent<number>) => {
    const systemId = parseInt(e.target.value as string, 10);
    setVolumeData((prevData) => ({
      ...prevData,
      systemId: systemId,
    }));
  };

  const handleClose = () => {
    onClose();
    if (currentOperation === "edit") {
      setVolumeData(initialData);
    } else {
      setVolumeData(initialVolumeData);
    }
  };

  const addClearInputField = () => {
    handleAddNewItem(volumeData);
    setVolumeData(initialVolumeData);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: operation === "delete" ? 500 : 600,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "90vh",
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
                ? "Add Volume"
                : operation === "edit"
                  ? "Edit Volume"
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
              <Box sx={{ padding: 2, pb: 3 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", mb: 1 }}
                >
                  Volume Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={volumeData.volumeName}
                  variant="outlined"
                  type="text"
                  name="volumeName"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 2, pb: 3 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", mb: 1 }}
                >
                  System Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledDropdownModalInput
                  fullWidth
                  value={volumeData.systemId}
                  variant="outlined"
                  name="systemName"
                  //@ts-ignore
                  onChange={handleInputServiceChange}
                >
                  {Array.isArray(systemResponse) &&
                    systemResponse?.map((system) => (
                      <MenuItem key={system.systemId} value={system.systemId}>
                        {system.systemName}
                      </MenuItem>
                    ))}
                </StyledDropdownModalInput>
              </Box>
            </>
          )}
          <Box
            sx={{
              backgroundColor: "#f5f7fa",
              p: 1.5,
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
                  handleEditItem({ ...volumeData });
                } else if (operation === "delete" && editItem) {
                  handleDeleteItem(editItem.volumeId);
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

export default VolumeCustomModal;
