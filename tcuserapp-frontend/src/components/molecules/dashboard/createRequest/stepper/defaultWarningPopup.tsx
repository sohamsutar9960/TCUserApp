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
  defaultGroupName: string;
}

const DefaultWarningPopup: React.FC<WarningPopupProps> = ({
  open,
  onClose,
  defaultGroupName,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      style: {
        display: "flex",
        justifyContent: "center",
        minWidth: "30%",
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
        fontSize: "1.2rem",
        position: "relative",
        padding: "6px",
        borderBottom: "1px solid #ddd",
      }}
    >
      Warning
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: "8px",
          top: "8px",
          color: "inherit",
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent
      sx={{
        padding: "20px",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          paddingTop: "10px",
          fontSize: "0.85rem",
        }}
      >
        Deletion of all roles from the default group is not allowed. <br />
        Selected Default Group: <strong>{defaultGroupName}</strong> <br />
        Minimum 1 role is required for the selected default group.
      </Typography>
    </DialogContent>
    <DialogActions
      sx={{
        backgroundColor: "#f5f7fa",
        padding: "8px 20px", // Reduced padding
        borderTop: "1px solid #ddd",
      }}
    >
      <Button
        onClick={onClose}
        variant="contained"
        color="primary"
        sx={{
          fontSize: "0.75rem",
          padding: "4px 12px",
          minWidth: "60px",
        }}
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default DefaultWarningPopup;
