import React from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PopupProps {
  isPopupOpen: boolean;
  handleClosePopup: () => void;
  yesPopup: () => void;
  noPopup: () => void;
}

const PopupModal: React.FC<PopupProps> = ({
  isPopupOpen,
  handleClosePopup,

  yesPopup,
  noPopup,
}) => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 0,
  };

  return (
    <Modal open={isPopupOpen} onClose={handleClosePopup}>
      <Box sx={style}>
        {/* Header */}
        <DialogTitle
          sx={{
            backgroundColor: "#006487",
            color: "white",
            display: "flex",
            alignItems: "center",
            fontSize: "1rem",
            position: "relative",
            padding: "8px 16px",
            borderBottom: "1px solid #ddd",
          }}
        >
          Warning
          <IconButton
            aria-label="close"
            sx={{
              position: "absolute",
              right: "8px",
              top: "2px",
              color: "inherit",
            }}
            onClick={handleClosePopup}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{ textAlign: "start", mb: 2, fontSize: "0.85rem" }} // Reduced font size here
          >
            Please continue request creation for self from the left-side proceed
            button.
          </Typography>
          <Box display="flex" justifyContent="end" mt={1}>
            <Button
              onClick={handleClosePopup}
              variant="contained"
              color="primary"
              sx={{
                fontSize: "0.75rem",
                padding: "4px 12px",
                minWidth: "80px",
              }}
            >
              Ok
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PopupModal;
