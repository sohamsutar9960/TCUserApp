import {
  Backdrop,
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;

  handleEditItem: (editedItem: any) => void;
  editItem: any | null;
  handleDeleteItem: (serviceId: number | undefined) => void;
}

const DeactivationCustomModal = (props: Props) => {
  const { open, onClose, operation } = props;

  const handleInputChange = () => {};

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
                ? "Add Value"
                : operation === "edit"
                  ? "Edit Country"
                  : "Confirmation"}
            </Typography>
            <IconButton onClick={onClose}>
              <ClearIcon />
            </IconButton>
          </Box>
          {operation === "delete" ? (
            <Box sx={{ padding: 2, pb: 3 }}>
              <Typography sx={{ fontSize: "15px", mb: 1 }}>
                Are you sure you want to delete this?
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ padding: 2 }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", mb: 1 }}
                >
                  Maximum Deactivation Value
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  name="countryCode"
                  onChange={handleInputChange}
                />
              </Box>
              <Box sx={{ padding: 2 }}>
                <Typography
                  sx={{ fontSize: "15px", fontWeight: "bold", mb: 1 }}
                >
                  Minimum Warning Value
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  name="countryName"
                  onChange={handleInputChange}
                />
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

export default DeactivationCustomModal;
