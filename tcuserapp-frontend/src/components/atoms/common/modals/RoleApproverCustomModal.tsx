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
import SearchIcon from "@mui/icons-material/Search";
import CachedIcon from "@mui/icons-material/Cached";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { StyledTextFieldModal } from "../../../molecules/dashboard/groupPage/styledComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  addComment: (comment: string) => void;
  rejectRequest: (requestId: number | null, comment: string) => void;
  setOpenPopup: (popState: boolean | undefined) => void;
  searchRoles: (roleName: string) => void;
}

const RoleApproverCustomModal = (props: Props) => {
  const [graComment, setGraComment] = useState("");
  const [roleName, setRoleName] = useState("");
  const {
    open,
    onClose,
    operation,
    addComment,
    rejectRequest,
    setOpenPopup,
    searchRoles,
  } = props;
  const { requestId } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setGraComment(value);
  };
  const handleInputRoleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setRoleName(value);
  };

  const handleButtonClick = () => {
    if (operation === "addComment") {
      addComment(graComment);
    } else if (operation === "reject") {
      rejectRequest(Number(requestId), graComment);
      navigate("/home/graAllRequests/openRequests");
    } else if (operation === "searchRoles") {
      setOpenPopup(true);
      searchRoles(roleName);
      setRoleName("");
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
              {operation === "searchRoles" ? (
                <Box sx={{ padding: 3 }}>
                  <StyledTextFieldModal
                    fullWidth
                    value={roleName}
                    variant="outlined"
                    placeholder="Search"
                    sx={{
                      borderRadius: "4px",
                    }}
                    onChange={handleInputRoleChange}
                  />
                </Box>
              ) : (
                <Box sx={{ padding: 3 }}>
                  <StyledTextFieldModal
                    multiline
                    rows={1}
                    fullWidth
                    value={graComment}
                    variant="outlined"
                    placeholder="Enter your comment here"
                    sx={{
                      borderRadius: "4px",
                    }}
                    onChange={handleInputChange}
                  />
                </Box>
              )}
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
              {operation === "reject"
                ? "No"
                : operation === "addComment"
                  ? "Cancel"
                  : operation === "searchRoles"
                    ? "Close"
                    : ""}
            </Button>
            {operation === "searchRoles" && (
              <Button
                size="small"
                sx={{ mr: 1, color: "#2b7985", borderColor: "#2b7985" }}
                variant="outlined"
                onClick={() => setRoleName("")}
              >
                <CachedIcon
                  fontSize="small"
                  sx={{ pr: 0.5, color: "#2b7985" }}
                />
                Clear
              </Button>
            )}
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#2b7985",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleButtonClick}
              startIcon={operation === "searchRoles" && <SearchIcon />}
            >
              {operation === "addComment"
                ? "Save"
                : operation === "searchRoles"
                  ? "Search"
                  : "Yes"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RoleApproverCustomModal;
