import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { userRequest } from "../../../molecules/dashboard/userRequestViewPage/userRequestViewPage";
import { StyledClearIcon } from "../../../molecules/dashboard/groupPage/styledComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  viewDetails: userRequest | null;
}

const UserRequestViewModal = (props: Props) => {
  const { open, onClose, operation, viewDetails } = props;

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "90vh",
  };
  const typographyStyle = {
    fontSize: "0.8rem",
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
            <Typography
              component="p"
              sx={{ ...typographyStyle, fontWeight: "bold" }}
            >
              {operation === "view"
                ? "User Request view"
                : operation === "edit"
                  ? "Edit Role"
                  : "Confirmation"}
            </Typography>
            <StyledClearIcon onClick={onClose}>
              <ClearIcon />
            </StyledClearIcon>
          </Box>

          <>
            <Paper sx={{ padding: 2 }}>
              <Grid container spacing={2}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          border: "1px solid #000",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Box sx={{ backgroundColor: "#777", pl: 1, py: 0.3 }}>
                          <Typography sx={typographyStyle} color="white">
                            Request Data
                          </Typography>
                        </Box>
                        <Grid container spacing={1} sx={{ pl: 1, py: 0.3 }}>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Request ID:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.requestId}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Request Status:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.requestStatus?.replace(/_/g, " ")}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              System:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.system.systemName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Service:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.service.serviceName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Request Type:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.userRequest_TypeOfRequest.replace(
                                /_/g,
                                " ",
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          border: "1px solid #000",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Box sx={{ backgroundColor: "#777", pl: 1, py: 0.3 }}>
                          <Typography sx={typographyStyle} color="white">
                            Comments
                          </Typography>
                        </Box>
                        <Grid container spacing={1} sx={{ pl: 1, py: 0.3 }}>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Comments For Approver:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.commentsForApprover}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Cancellation reason if any:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.reasonForCancellation}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Manager Comments:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.costApproverComments}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Management Comments:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.groupRoleApproverComments}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          border: "1px solid #000",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Box sx={{ backgroundColor: "#777", pl: 1, py: 0.3 }}>
                          <Typography sx={typographyStyle} color="white">
                            Approval/Rejection Dates
                          </Typography>
                        </Box>
                        <Grid container spacing={1} sx={{ pl: 1, py: 0.3 }}>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Creation Date:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.creationDate}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{ pl: 1, py: 0.3 }}>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              CostManager Approval Date
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.costApproverDate}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{ pl: 1, py: 0.3 }}>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              GroupRole Approval Date
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.groupRoleApproverDate}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          border: "1px solid #000",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Box sx={{ backgroundColor: "#777", pl: 1, py: 0.3 }}>
                          <Typography sx={typographyStyle} color="white">
                            Requester & Approver
                          </Typography>
                        </Box>
                        <Grid container spacing={1} sx={{ pl: 1, py: 0.3 }}>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Requested By:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.createdBy?.displayName ?? "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Cost Manager:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.costManagerSelf?.displayName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Other Cost Manager:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.userRequestForAnother?.displayName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>GID:</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.createdBy.gid}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          border: "1px solid #000",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <Box sx={{ backgroundColor: "#777", pl: 1, py: 0.3 }}>
                          <Typography sx={typographyStyle} color="white">
                            Additional Info
                          </Typography>
                        </Box>
                        <Grid container spacing={1} sx={{ pl: 1, py: 0.3 }}>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              TCUser ID:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.userHistory.tcUserId}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Licensing Level:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}></Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Country:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.country.countryName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Default Group:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.defaultGroup}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Volume:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.volume.volumeName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              OSUser Name:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.tcOSUserName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              IP Clearance:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.ipClearance}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              Never Lock:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={typographyStyle}>
                              {viewDetails?.neverLock === false ? "No" : "Yes"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </>

          <Box
            sx={{
              backgroundColor: "#f5f7fa",
              p: 1,
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
              Close
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UserRequestViewModal;
