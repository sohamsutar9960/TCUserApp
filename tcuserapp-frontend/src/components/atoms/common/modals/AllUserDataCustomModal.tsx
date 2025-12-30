import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { TcConfigResponse } from "../../../../models/tcConfigModel";

interface TcUserCustomModalProps {
  open: boolean;
  onClose: () => void;
  operation: "add" | "edit" | "search";
  handleAddNewItem: (tcConfigData: TcConfigResponse) => void;
  handleEditItem: (editedItem: TcConfigResponse) => void;
  handleProceed: () => void;
  editItem: TcConfigResponse | null;
}

const AllUserDataCustomModal: React.FC<TcUserCustomModalProps> = ({
  open,
  onClose,
  operation,
  editItem,
  handleAddNewItem,
  handleEditItem,
  handleProceed,
}) => {
  const [tcConfigData, setTcConfigData] = useState<TcConfigResponse>({
    tcConfigId: 0,
    firstName: "",
    lastName: "",
    gid: "",
    email: "",
  });
  const [selectedSystem, setSelectedSystem] = useState<string>("");

  useEffect(() => {
    if (editItem) {
      setTcConfigData({ ...editItem });
    } else {
      setTcConfigData({
        tcConfigId: 0,
        firstName: "",
        lastName: "",
        gid: "",
        email: "",
      });
    }
  }, [editItem]);

  const handleSystemChange = (event: SelectChangeEvent<string>) => {
    setSelectedSystem(event.target.value);
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
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
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
                ? "Select System"
                : "Edit Group Role Approver"}
            </Typography>
            <IconButton onClick={onClose}>
              <ClearIcon />
            </IconButton>
          </Box>
          <Box sx={{ padding: 2, pb: 3 }}>
            <InputLabel id="system-select-label">System Name</InputLabel>
            <Select
              labelId="system-select-label"
              id="system-select"
              value={selectedSystem}
              label="System Name"
              onChange={handleSystemChange}
              fullWidth
            >
              <MenuItem value="TCBD10">TCBD10</MenuItem>
              <MenuItem value="OtherSystem">OtherSystem</MenuItem>
            </Select>
            {/* Modal Content */}
          </Box>
          {selectedSystem && (
            <Box
              sx={{
                backgroundColor: "#f5f7fa",
                p: 1,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#2b7985",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={handleProceed}
              >
                Proceed
              </Button>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default AllUserDataCustomModal;
