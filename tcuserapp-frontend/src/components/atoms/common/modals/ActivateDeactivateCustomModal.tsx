import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import TcSystem from "../../../../services/SystemService";
import { SystemResponse } from "../../../molecules/dashboard/systemPage";
import {
  StyledClearIcon,
  StyledTypographyModal,
} from "../../../molecules/dashboard/groupPage/styledComponent";

interface TcUserCustomModalProps {
  open: boolean;
  onClose: () => void;
  operation: "add" | "edit" | "search";
  handleProceed: (selectedSystem: number) => void;
}

const ActivateDeactivateCustomModal: React.FC<TcUserCustomModalProps> = ({
  open,
  onClose,
  operation,
  handleProceed,
}) => {
  const [selectedSystem, setSelectedSystem] = useState<number>();
  const [systemsData, setSystemData] = useState<SystemResponse[]>([]);

  useEffect(() => {
    getSystemData();
  }, []);

  const getSystemData = async () => {
    try {
      const response = await TcSystem.findAllSystems();
      setSystemData(response.data);
    } catch (error) {
      console.error("Error fetching systems:", Error);
    }
  };

  const handleInputServiceChange = (e: SelectChangeEvent<unknown>) => {
    const systemId = parseInt(e.target.value as string, 10);
    setSelectedSystem(systemId);
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
    boxSizing: "border-box", // Ensure padding and border are included in width/height
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
            <StyledClearIcon onClick={onClose}>
              <ClearIcon />
            </StyledClearIcon>
          </Box>
          <Box sx={{ padding: 0.5, mb: 2 }}>
            <StyledTypographyModal
              sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
            >
              System Name <span style={{ color: "red" }}>*</span>
            </StyledTypographyModal>
            <Select
              sx={{
                width: "95%",
                padding: "7px 14px 4px 0px",
                margin: "6px 2px 0px 11px",
                "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                  {
                    padding: "0.5px 14px",
                  },
              }}
              fullWidth
              value={selectedSystem}
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
            </Select>
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
                onClick={() => handleProceed(selectedSystem)}
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

export default ActivateDeactivateCustomModal;
