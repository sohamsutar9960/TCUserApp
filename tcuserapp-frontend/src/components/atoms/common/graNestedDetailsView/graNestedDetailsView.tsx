import {
  Paper,
  Grid,
  Typography,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  AssignedRole,
  CommonRequest,
} from "../../../../models/ManagerAndGroupRoleApproverModel";
import TcRoleApprover from "../../../../services/RoleApproverService";
import RoleApproverCustomModal from "../modals/RoleApproverCustomModal";
import { useRequestContext } from "../RoleApproverRequestProvider/RoleApproverRequestProvider";
import GraSearchModal from "../modals/GraSearchModal";
import {
  StyledDataTableCell,
  StyledHeadTableCell,
  StyledTableHeadRow,
  StyledTablePagination,
  StyledTableRow,
  TablePaginationCell,
} from "../../../molecules/dashboard/groupPage/styledComponent";

const GraNestedDetailsView = () => {
  const { handleApproveRequest, handleRejectRequest } = useRequestContext();
  const [requestData, setRequestData] = useState<CommonRequest | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<AssignedRole[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<
    "addComment" | "searchRoles" | "reject"
  >("addComment");
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMesage] = useState("");
  const [approvedMessage, setApprovedMessage] = useState("");
  const [openPopup, setOpenPopup] = useState<boolean | undefined>(false);
  const [searchedRoles, setSerachedRoles] = useState([]);

  const { "*": requestType, requestId } = useParams();

  const navigate = useNavigate();
  const type = requestType?.split("/")[0];

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRequestDetailsDataById = async (requestId: number) => {
    try {
      const response = await TcRoleApprover.getRequestDetailsView(requestId);
      if (response.data) {
        setRequestData(response.data);
        setSelectedRoles(response.data?.assignedRoles);
      }
    } catch (error) {
      console.error("not getting  RequestId data");
    }
  };

  const getSelectedRoles = async (roles: AssignedRole[]) => {
    try {
      const response = await TcRoleApprover.addAssignedRoles(
        Number(requestId),
        roles,
      );
      if (response.data) {
        setSelectedRoles(response.data?.assignedRoles);
      }
    } catch (error) {
      console.error("not getting  RequestId data");
    }
  };

  const addComment = (comment: string) => {
    setComment(comment);
  };

  const approveRquest = async (requestId: number | null, comment: string) => {
    const requestForApproval: CommonRequest = {
      requestId: requestId,
      groupRoleApproverComments: comment,
    };
    try {
      const response =
        await TcRoleApprover.approveRequestByRoleApprover(requestForApproval);
      if (response.data) {
        handleApproveRequest(response.data);
        setRequestData(response.data);
        const requestStatus = response.data.requestStatus.split("_")[0];
        if (requestStatus === "Approved" || requestStatus === "APPROVED") {
          setApprovedMessage(
            `Request ${response.data.requestStatus} successfully.`,
          );
        } else {
          console.error(
            "Request not approved. Status:",
            response.data.requestStatus,
          );
        }
      }
      navigate("/home/graAllRequests/openRequests");
    } catch (error) {
      console.error("not able Approve the request");
    }
  };

  const rejectRquest = async (requestId: number | null, comment: string) => {
    const requestForRejection: CommonRequest = {
      requestId: requestId,
      groupRoleApproverComments: comment,
    };

    try {
      const response =
        await TcRoleApprover.rejectRequestByRoleApprover(requestForRejection);
      if (response.data) {
        handleRejectRequest(response.data);
        setRequestData(response.data);
      }
    } catch (error) {
      console.error("not able reject the request");
    }
  };

  const deleteAssignedRole = async (assignedRoleId: number) => {
    try {
      const response =
        await TcRoleApprover.deleteAssignedRoleByRoleApprover(assignedRoleId);
      if (response.status === 200 && response.data) {
        setRequestData(response.data);
        setSelectedRoles(response.data?.assignedRoles);
      } else if (response.status === 202) {
        setErrorMesage(response.data.message);
      }
    } catch (error) {
      console.error("not able reject the request");
    }
  };

  const handleOpen = (operation: "addComment" | "searchRoles" | "reject") => {
    setOperationType(operation);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (requestId) {
      getRequestDetailsDataById(Number(requestId));
      setLoading(false);
    }
  }, [requestId]);

  const userDetails = [
    { label: "Requested By:", value: requestData?.createdBy?.displayName },
    {
      label: "GID:",
      value: requestData?.userRequestSelf
        ? requestData?.userRequestSelf.gid
        : requestData?.userRequestForAnother?.gid,
    },
    {
      label: "Department:",
      value: requestData?.userRequestSelf
        ? requestData.userRequestSelf.department
        : requestData?.userRequestForAnother?.department,
    },
    {
      label: "Location:",
      value: requestData?.userRequestSelf
        ? requestData.userRequestSelf.country
        : requestData?.userRequestForAnother?.country,
    },
    {
      label: "Email:",
      value: requestData?.userRequestSelf
        ? requestData.userRequestSelf.email
        : requestData?.userRequestForAnother?.email,
    },
    { label: "IP Clearance:", value: requestData?.ipClearance },
    {
      label: "Requested For:",
      value: requestData?.userRequestSelf
        ? requestData.userRequestSelf.displayName
        : requestData?.userRequestForAnother?.displayName,
    },
    { label: "User Type:", value: requestData?.userHistory?.tcAccountType },
    { label: "TCUser ID:", value: requestData?.userHistory?.tcUserId },
    { label: "Default Group:", value: requestData?.defaultGroup },
    { label: "User Comment:", value: requestData?.commentsForApprover },
    {
      label: "Requested Date:",
      value: requestData?.creationDate ? requestData?.creationDate : "-",
    },
  ];

  const searchRoles = async (roleName: string) => {
    try {
      const response = await TcRoleApprover.searchRoles(roleName);
      if (response.data) {
        setSerachedRoles(response.data);
      }
    } catch (error) {
      console.error("not able reject the request");
    }
  };

  return (
    <>
      <Paper sx={{ p: 2, pb: 3 }} elevation={1}>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1} display="flex" justifyContent="center">
            <Typography fontWeight="bold">
              Request Exported to Teamcenter for Request ID : {requestId}
            </Typography>
          </Box>
        </Box>
        <Grid item xs={12} mt={2}>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: "#006487",
              color: "white",
              padding: "8px 8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="inherit"
              sx={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: 200,
                fontSize: "0.9rem",
              }}
            >
              Requested By : {requestData?.createdBy?.displayName}
            </Typography>
            <Typography
              variant="inherit"
              sx={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: 200,
                fontSize: "0.9rem",
              }}
            >
              <span style={{ marginRight: "15px" }}>
                System ID : {requestData?.system?.systemId}
              </span>
              <span>System : {requestData?.system?.systemName}</span>
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={4} sx={{ backgroundColor: "#ccc", pl: "16px", py: 3 }}>
            {userDetails.slice(0, 6).map((detail, index) => (
              <Box key={index} display="flex">
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    marginRight: "8px",
                  }}
                >
                  {detail.label}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "0.8rem" }}>
                  {detail.value}
                </Typography>
              </Box>
            ))}
            {type === "openRequests" && (
              <Box mt={2} display="flex">
                <Button
                  onClick={() => handleOpen("addComment")}
                  sx={{
                    color: "blue",
                    marginRight: "1rem",
                    padding: "6px",
                    fontSize: "0.9rem",
                    textTransform: "none",
                  }}
                >
                  + Add Comment
                </Button>
              </Box>
            )}
            <Typography
              variant="body2"
              sx={{ marginTop: "16px", fontSize: "0.8rem" }}
            >
              {comment && <strong>Cost Approver Comments :</strong>}
              {comment}
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginTop: "16px", fontSize: "0.8rem" }}
            >
              By approving the roles and groups for this user you confirm that
              the data shown above are correct to your knowledge and the group
              access and read or write permissions for this user comply with the
              intellectual property regulations for those groups. Before
              confirming this request please remove all group/role
              constellations you do not approve.
            </Typography>
          </Grid>
          <Grid item xs={3} sx={{ backgroundColor: "#ccc", pl: "16px", py: 3 }}>
            {userDetails.slice(6, 12).map((detail, index) => (
              <Box key={index} display="flex">
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    marginRight: "8px",
                  }}
                >
                  {detail.label}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "0.8rem" }}>
                  {detail.value}
                </Typography>
              </Box>
            ))}
          </Grid>

          <Grid item xs={5} sx={{ backgroundColor: "#ccc", px: "16px", py: 1 }}>
            <Box style={{ border: "1px solid #ccc", marginTop: "16px" }}>
              <Table>
                <TableHead>
                  <StyledTableHeadRow>
                    <StyledHeadTableCell sx={{ color: "white" }}>
                      Selected Roles
                    </StyledHeadTableCell>
                  </StyledTableHeadRow>
                </TableHead>
              </Table>
              <Box sx={{ p: 1 }} bgcolor="white">
                {type === "openRequests" && (
                  <Box
                    mb={1}
                    px={1}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Tooltip title="Add">
                      <span>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpen("searchRoles")}
                          size="small"
                        >
                          <IconButton sx={{ p: 0 }}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                )}

                <TableContainer
                  component={Paper}
                  style={{ border: "1px solid #ccc" }}
                >
                  <Table>
                    <TableHead>
                      <StyledTableHeadRow sx={{ backgroundColor: "#006487" }}>
                        <StyledHeadTableCell
                          sx={{
                            color: "white",
                            textAlign: "left",
                            fontSize: "0.75rem",
                          }}
                        >
                          Role Name
                        </StyledHeadTableCell>
                        <StyledHeadTableCell
                          sx={{
                            color: "white",
                            textAlign: "left",
                            fontSize: "0.75rem",
                          }}
                        >
                          Group Name
                        </StyledHeadTableCell>
                        <StyledHeadTableCell
                          sx={{
                            color: "white",
                            textAlign: "left",
                            fontSize: "0.75rem",
                          }}
                        >
                          Status
                        </StyledHeadTableCell>
                        {type === "openRequests" && (
                          <StyledHeadTableCell
                            sx={{
                              color: "white",
                              textAlign: "left",
                              fontSize: "0.75rem",
                            }}
                          >
                            Action
                          </StyledHeadTableCell>
                        )}
                      </StyledTableHeadRow>
                    </TableHead>
                    <TableBody>
                      {loading && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            zIndex: 1,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      )}

                      {selectedRoles &&
                        selectedRoles.map((selectedRole) => (
                          <StyledTableRow
                            key={selectedRole.assignedRoleId}
                            sx={{
                              "&:hover": {
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                          >
                            <StyledDataTableCell
                              sx={{
                                fontSize: "0.75rem",
                                textAlign: "left",
                                textDecoration:
                                  selectedRole.deleted === true
                                    ? "line-through"
                                    : "none",
                                width: "25%",
                              }}
                            >
                              {selectedRole?.roleName}
                            </StyledDataTableCell>
                            <StyledDataTableCell
                              sx={{
                                fontSize: "0.75rem",
                                textAlign: "left",
                                textDecoration:
                                  selectedRole.deleted === true
                                    ? "line-through"
                                    : "none",
                                width: "25%",
                              }}
                            >
                              {selectedRole?.groupNamePath}
                            </StyledDataTableCell>
                            <StyledDataTableCell
                              sx={{
                                fontSize: "0.75rem",
                                textAlign: "left",
                                textDecoration:
                                  selectedRole.deleted === true
                                    ? "line-through"
                                    : "none",
                                width: "25%",
                              }}
                            >
                              {selectedRole?.assignedRole_Status}
                            </StyledDataTableCell>
                            {type === "openRequests" && (
                              <StyledDataTableCell
                                sx={{
                                  textAlign: "left",
                                  width: "25%",
                                }}
                              >
                                <IconButton
                                  onClick={() =>
                                    deleteAssignedRole(
                                      // @ts-ignore
                                      selectedRole?.assignedRoleId,
                                    )
                                  }
                                >
                                  {selectedRole.deleted === true ? (
                                    <CheckIcon sx={{ color: "#4caf50" }} />
                                  ) : (
                                    <DeleteOutlineIcon
                                      sx={{ color: "#d32f2f" }}
                                    />
                                  )}
                                </IconButton>
                              </StyledDataTableCell>
                            )}
                          </StyledTableRow>
                        ))}
                      <StyledTableRow
                        sx={{
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <TablePaginationCell
                          sx={{ textAlign: "center" }}
                          colSpan={4}
                        >
                          <StyledTablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={selectedRoles?.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </TablePaginationCell>
                      </StyledTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {type === "openRequests" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "16px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4caf50",
                color: "white",
                "&:hover": { backgroundColor: "#45a049" },
              }}
              size="small"
              startIcon={<CheckCircleIcon />}
              onClick={() => approveRquest(Number(requestId), comment)}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#f44336",
                color: "white",
                "&:hover": { backgroundColor: "#e53935" },
              }}
              size="small"
              startIcon={<CancelIcon />}
              onClick={() => handleOpen("reject")}
            >
              Reject
            </Button>
          </Box>
        )}
      </Paper>
      <RoleApproverCustomModal
        open={open}
        operation={operationType}
        onClose={handleClose}
        addComment={addComment}
        rejectRequest={rejectRquest}
        setOpenPopup={setOpenPopup}
        searchRoles={searchRoles}
      />
      <GraSearchModal
        openPopup={openPopup}
        searchedRoles={searchedRoles}
        setOpenPopup={setOpenPopup}
        getSelectedRoles={getSelectedRoles}
      />
      {errorMessage && (
        <Snackbar
          open
          autoHideDuration={6000}
          onClose={() => setErrorMesage("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setErrorMesage("")} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
      {approvedMessage && (
        <Snackbar
          open
          autoHideDuration={6000}
          onClose={() => setApprovedMessage("")}
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Alert onClose={() => setApprovedMessage("")} severity="success">
            {approvedMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default GraNestedDetailsView;
