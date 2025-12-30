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
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  addComment: (comment: string) => void;
  rejectRequest: (requestId: number | null, comment: string) => void;
}

const ManagerCustomModal = (props: Props) => {
  const [managerComment, setManagerComment] = useState("");
  const { open, onClose, operation, addComment, rejectRequest } = props;
  const { requestId } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setManagerComment(value);
  };

  const handleButtonClick = () => {
    if (operation === "addComment") {
      addComment(managerComment);
    } else if (operation === "reject") {
      rejectRequest(Number(requestId), managerComment);
      navigate("/home/mgAllRequests/openRequests");
    }
    onClose();
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
              {operation === "addComment"
                ? "Add Comment"
                : operation === "searchRoles"
                  ? "Search Role For user request"
                  : "Confirmation"}
            </Typography>
            <IconButton onClick={onClose}>
              <ClearIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          {operation === "reject" ? (
            <Box sx={{ padding: 2, pb: 3 }}>
              <Typography sx={{ fontSize: "15px", mb: 1 }}>
                Are you sure ? You want to reject this User Reqeust ?
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ padding: 3 }}>
                <TextField
                  multiline
                  rows={2}
                  fullWidth
                  value={managerComment}
                  variant="outlined"
                  placeholder="Enter your comment here"
                  sx={{
                    borderRadius: "4px",
                  }}
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
              {operation !== "reject" && (
                <ClearIcon
                  fontSize="small"
                  sx={{ pr: 0.5, color: "#2b7985" }}
                />
              )}
              {operation === "reject" ? "No" : "Cancel"}
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#2b7985",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleButtonClick}
            >
              {operation === "addComment"
                ? "Save"
                : operation === "searchRoles"
                  ? "Save"
                  : "Yes"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ManagerCustomModal;
