import {
  Backdrop,
  Box,
  Button,
  Fade,
  IconButton,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { SystemResponse } from "../../../molecules/dashboard/systemPage";
import Service from "../../../../models/ServiceModel";
import {
  StyledClearIcon,
  StyledDropdownModalInput,
  StyledTextFieldModal,
  StyledTypographyModal,
} from "../../../molecules/dashboard/groupPage/styledComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  handleAddNewItem: (systemData: SystemResponse) => void;
  handleEditItem: (editedItem: any) => void;
  editItem: SystemResponse | null;
  handleDeleteItem: (serviceId: number | undefined) => void;
  serviceData: Service[];
}

const SystemCustomModal = (props: Props) => {
  const {
    open,
    onClose,
    operation,
    handleAddNewItem,
    editItem,
    handleEditItem,
    handleDeleteItem,
    serviceData,
  } = props;

  const [systemData, setSystemData] = useState<SystemResponse>({
    systemId: 0,
    systemName: "",
    serviceId: 0,
    serviceName: "",
  });

  const [initialSystemData, setInitialSystemData] = useState<SystemResponse>({
    systemId: 0,
    systemName: "",
    serviceId: 0,
    serviceName: "",
  });

  useEffect(() => {
    if (editItem) {
      setSystemData({
        systemId: editItem.systemId ?? 0,
        systemName: editItem.systemName ?? "",
        serviceName: editItem.serviceName ?? "",
        serviceId: editItem.serviceId ?? 0,
      });
      setInitialSystemData({
        systemId: editItem.systemId ?? 0,
        systemName: editItem.systemName ?? "",
        serviceName: editItem.serviceName ?? "",
        serviceId: editItem.serviceId ?? 0,
      });
    } else {
      setSystemData({
        systemId: 0,
        systemName: "",
        serviceName: "",
        serviceId: 0,
      });
      setInitialSystemData({
        systemId: 0,
        systemName: "",
        serviceName: "",
        serviceId: 0,
      });
    }
  }, [editItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSystemData({
      ...systemData,
      [name]: value,
    });
  };

  const handleInputServiceChange = (e: SelectChangeEvent<number>) => {
    const serviceId = e.target.value as number;
    setSystemData((prevData) => ({
      ...prevData,
      serviceId: serviceId,
    }));
  };

  const addClearInputField = () => {
    handleAddNewItem(systemData);
    setSystemData({
      systemId: 0,
      systemName: "",
      serviceId: 0,
      serviceName: "",
    });
  };

  const handleCancel = () => {
    setSystemData(initialSystemData);
    onClose();
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

  const isSaveButtonDisabled =
    !systemData.systemName || systemData.serviceId === 0;

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
                ? "Add System"
                : operation === "edit"
                  ? "Edit System"
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
              <Box sx={{ padding: 2, pb: 3 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", mb: 1 }}
                >
                  System Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={systemData.systemName}
                  variant="outlined"
                  type="text"
                  name="systemName"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 2, pb: 3 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", mb: 1 }}
                >
                  Service Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledDropdownModalInput
                  fullWidth
                  value={systemData.serviceId}
                  variant="outlined"
                  name="serviceId"
                  // @ts-ignore
                  onChange={handleInputServiceChange}
                >
                  {Array.isArray(serviceData) &&
                    serviceData.map((service) => (
                      <MenuItem
                        key={service.serviceId}
                        value={service.serviceId}
                      >
                        {service.serviceName}
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
                  handleEditItem({ ...systemData });
                } else if (operation === "delete" && editItem) {
                  handleDeleteItem(editItem.systemId);
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

export default SystemCustomModal;
