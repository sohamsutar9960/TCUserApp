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
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { TcConfigResponse } from "../../../../models/tcConfigModel";
import TcSystem from "../../../../services/SystemService";
import {
  StyledClearIcon,
  StyledDropdownModalInput,
  StyledTypographyModal,
} from "../../../molecules/dashboard/groupPage/styledComponent";

interface TcUserCustomModalProps {
  open: boolean;
  onClose: () => void;
  operation: "add" | "edit" | "search";
  handleAddNewItem: (tcConfigData: TcConfigResponse) => void;
  handleEditItem: (editedItem: TcConfigResponse) => void;
  handleProceed: (selectedSystem: number) => void;
  editItem: TcConfigResponse | null;
}
export interface SystemResponse {
  systemId: number;
  systemName: string | undefined;
}

const TcUserCustomModal: React.FC<TcUserCustomModalProps> = ({
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
  const [systems, setSystems] = useState<SystemResponse[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);

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

  const getSystems = async () => {
    try {
      const response = await TcSystem.findAllSystems();
      setSystems(response?.data);
    } catch (error) {
      console.error("Error fetching systems:", error);
    }
  };

  useEffect(() => {
    getSystems();
  }, []);

  // const handleSystemChange = (event: SelectChangeEvent<string>) => {
  //   const selectedSystemId = parseInt(event.target.value, 10);
  //   setSelectedSystem(selectedSystemId);
  // };
  const handleSystemChange = (e: SelectChangeEvent<unknown>) => {
    const selectedSystemId = parseInt(e.target.value as string, 10);
    setSelectedSystem(selectedSystemId);
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
          <Box sx={{ padding: 2, pb: 3 }}>
            <StyledTypographyModal
              sx={{ fontSize: "14px", fontWeight: "bold", pb: 1.2 }}
            >
              System Name
            </StyledTypographyModal>
            <StyledDropdownModalInput
              sx={{
                padding: "4px 0px",
                "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                  {
                    padding: "0px 14px",
                  },
              }}
              fullWidth
              value={selectedSystem?.toString() || ""}
              variant="outlined"
              name="systemName"
              onChange={handleSystemChange}
            >
              {systems.map((system) => (
                <MenuItem
                  key={system.systemId}
                  value={system.systemId.toString()}
                >
                  {system.systemName}
                </MenuItem>
              ))}
            </StyledDropdownModalInput>
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

export default TcUserCustomModal;
