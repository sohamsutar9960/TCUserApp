import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface WarningPopupProps {
  open: boolean;
  onClose: () => void;
  gidMatch?: boolean;
}

const WarningPopup: React.FC<WarningPopupProps> = ({
  open,
  onClose,
  gidMatch,
}) => {
  const message = gidMatch
    ? "Please provide input from SCD search!"
    : "No User Found";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          display: "flex",
          justifyContent: "center",
          minWidth: "25%", // Reduced width
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#006487",
          color: "white",
          display: "flex",
          alignItems: "center",
          fontSize: "1rem", // Reduced font size
          position: "relative",
          padding: "6px", // Reduced padding
          borderBottom: "1px solid #ddd",
        }}
      >
        Warning
        <IconButton
          aria-label="close"
          sx={{
            position: "absolute",
            right: "6px", // Reduced position offset
            top: "6px", // Reduced position offset
            color: "inherit",
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "20px", // Reduced padding
        }}
      >
        <Typography
          variant="body2" // Reduced text variant
          color="text.secondary"
          sx={{
            paddingTop: "10px", // Reduced padding
            fontSize: "0.875rem", // Reduced font size
          }}
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#f5f7fa",
          padding: "6px 20px", // Reduced padding
          borderTop: "1px solid #ddd",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{
            fontSize: "0.875rem", // Reduced font size
            padding: "4px 5px", // Reduced padding
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningPopup;
