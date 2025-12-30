import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextareaAutosize,
  Typography,
  styled,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import TcMyRequest from "../../../../services/myRequestServices";
import {
  StyledClearIcon,
  StyledInnerModalBox,
  StyledTextFieldModal,
  StyledTypographyModal,
} from "../../../molecules/dashboard/groupPage/styledComponent";
import MyRequestWarningPopup from "./MyRequestWarningPopup";
import { UserRequest } from "../../../molecules/dashboard/myRequest/openRequestTable";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  requestId: number | null;
  refreshData: () => void;
  openRequests: UserRequest | undefined;
}

interface GroupRoleApproversByIdResponse {
  Country?: string;
  Department?: string;
  DisplayName?: string;
  Email?: string;
  FirstName?: string;
  FullName?: string;
  GID?: string;
  LastName?: string;
  LineManager?: string;
  MobileNumber?: string;
  Organization?: string;
  OrganizationID?: string;
  Sponsor?: string;
  checked?: boolean;
}

interface SearchManager {
  FirstName: string;
  LastName: string;
  GID: string;
  Email: string;
  OrganizationID?: string;
}


const MyRequestCustomModal = (props: Props) => {
  const { open, onClose, operation, requestId, refreshData, openRequests } = props;

  const [data, setData] = useState({
    requestId: null,
    comment: "",
    reason: "",
  });

  const [duplicateEntityError, setDuplicateEntityError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedApprover, setSelectedApprover] =
    useState<GroupRoleApproversByIdResponse>({});
  const [proceedEnabled, setProceedEnabled] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [warningPopup, setWarningPopup] = useState(false);
  const [operationWarning, setOpreationWarning] = useState('search');
  const [searchData, setSearchData] = useState({
    firstName: "",
    lastName: "",
    gid: "",
    email: "",
  });
  const [isDataAdded, setIsDataAdded] = useState(false);

  const [searchManager, setSearchManager] = useState<SearchManager | null>(
    null,
  );
  const isSaveButtonDisabled = !data.reason;
  const [userChecked, setUserChecked] = useState(false);
  console.log('open', openRequests)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value,
    });
  };

  const handleDelete = async () => {
    const requestData = {
      requestId: requestId,
      cancellationComment: data.comment,
      reasonForCancellation: data.reason,
    };
    try {
      await TcMyRequest.cancelUserRequest(requestData);
      refreshData();
    } catch (error) {
      console.error("Error Cancelling Request:", error);
    }
    addClearInputField();
    onClose();
  };

  const handleProceed = async () => {
    const proceedData = {
      requestId: requestId,
      costManagerForAnother: { gid: selectedApprover.GID || "" },
    };
    const rowGid = openRequests?.userRequestForAnother !=null ? 
                   openRequests.userRequestForAnother.gid : 
                   openRequests?.userRequestSelf?.gid;
    if(selectedApprover.GID  === rowGid){
      setWarningPopup(true);
    } else {
      try {
        await TcMyRequest.changeManagerRequest(proceedData);
        refreshData();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 409) {
            setDuplicateEntityError(error.response.data.message);
          }
          console.error("Error Changing Manager:", error);
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
      addClearSearchField();
      setIsDataAdded(false);
      onClose();
    }
  };

  const addClearInputField = () => {
    setData({
      requestId: null,
      comment: "",
      reason: "",
    });
    setIsDataAdded(false);
  };

  const clearClickButton = () => {
    addClearSearchField();
    onClose();
    setIsDataAdded(false);
  };
  const addClearSearchField = () => {
    setSearchData({
      firstName: "",
      lastName: "",
      gid: "",
      email: "",
    });
    setSelectedApprover({
      FirstName: "",
      LastName: "",
      GID: "",
      Email: "",
    });
    setUserChecked(false);
    setProceedEnabled(false);
    setIsDataAdded(false);
    setOpenPopup(false);
  };
  const handleSearch = async () => {
    setOpenPopup(true);
    setLoading(true);
    setOpreationWarning(operationWarning);
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    try {
      const response = await TcMyRequest.getSearchManager(searchData.gid);
      setSearchManager(response?.data || null);
      if (!searchManager) {
        // If response is null or no data, show the warning popup
        setWarningPopup(true);
      }
    } catch (error) {
      console.error("Error fetching Request:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const togglePopup = () => {
    setOpenPopup((prevState) => !prevState);
  };
  interface CustomCheckboxProps {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
  const CustomCheckbox = (props: CustomCheckboxProps) => {
    const { checked, onChange } = props;
    return <Checkbox checked={checked} onChange={onChange} />;
  };

  const handleCheckboxChange = (approver: GroupRoleApproversByIdResponse) => {
    setSelectedApprover(approver);
    setUserChecked((prevState) => !prevState);
    setProceedEnabled(true);
  };

  const handleOkClick = () => {
    if (selectedApprover) {
      setOpenPopup(false);
      setSearchManager(null);
      setSearchData({
        firstName: selectedApprover.FirstName ?? "",
        lastName: selectedApprover.LastName ?? "",
        gid: selectedApprover.GID ?? "",
        email: selectedApprover.Email ?? "",
      });
      setIsDataAdded(true);
    }
  };

  const handleClosePopup = () => {
    setWarningPopup(false);
    setIsDataAdded(false);
  };
  const StyledDialogContent = styled(DialogContent)({
    padding: "16px",
    margin: "8px",
  });

  const StyledTableHeadRow = styled(TableRow)({
    backgroundColor: "#006487",
  });
  const StyledHeadTableCell = styled(TableCell)({
    padding: 8,
    marginLeft: 7,
    borderBottom: "none",
    border: "1px solid #E0E0E0",
    textAlign: "left",
  });
  const StyledDataTableCell = styled(TableCell)({
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 7,
    borderBottom: "none",
    border: "1px solid #E0E0E0",
    textAlign: "left",
  });
  const StyledTableRow = styled(TableRow)({
    padding: 0,
  });

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
      <>
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
                {operation === "edit" ? "Change Approver" : "Cancel Request"}
              </Typography>
              <StyledClearIcon onClick={clearClickButton}>
                <ClearIcon />
              </StyledClearIcon>
            </Box>
            {operation === "delete" ? (
              <>
                <StyledInnerModalBox>
                  <Box sx={{ padding: 1 }}>
                    <Typography
                      sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                    >
                      Reason <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextareaAutosize
                      minRows={3}
                      maxRows={5}
                      value={data.reason}
                      name="reason"
                      onChange={handleInputChange}
                      style={{
                        minWidth: "97%",
                        maxWidth: "97%",
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>

                  <Box sx={{ padding: 1, mb: 4 }}>
                    <Typography
                      sx={{ fontSize: "14px", fontWeight: "bold", pb: 0.2 }}
                    >
                      Comment
                    </Typography>
                    <TextareaAutosize
                      minRows={3}
                      maxRows={5}
                      value={data.comment}
                      name="comment"
                      onChange={handleInputChange}
                      style={{
                        minWidth: "97%",
                        maxWidth: "97%",
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>
                </StyledInnerModalBox>
                <Box
                  sx={{
                    backgroundColor: "#f5f7fa",
                    p: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box sx={{ mr: 1 }}>
                    <Button
                      size="small"
                      sx={{ color: "#2b7985", borderColor: "#2b7985" }}
                      variant="outlined"
                      onClick={onClose}
                    >
                      <ClearIcon
                        fontSize="small"
                        sx={{ pr: 0.5, color: "#2b7985" }}
                      />
                      Cancel
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#2b7985",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={handleDelete}
                      disabled={isSaveButtonDisabled}
                    >
                      <DoneIcon
                        fontSize="small"
                        sx={{ color: "white", pr: 0.5 }}
                      />
                      Save
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Box sx={{ padding: 1 }}>
                    <StyledTypographyModal
                      sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                    >
                      First Name
                    </StyledTypographyModal>
                    <StyledTextFieldModal
                      fullWidth
                      value={searchData.firstName}
                      variant="outlined"
                      type="text"
                      name="firstName"
                      onChange={handleSearchChange}
                      className={isDataAdded ? "textfield-not-allowed" : ""}
                      InputProps={{
                        readOnly: isDataAdded,
                        style: { fontSize: "12px" },
                      }}
                    />
                  </Box>
                  <Box sx={{ padding: 1 }}>
                    <StyledTypographyModal
                      sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                    >
                      Last Name
                    </StyledTypographyModal>
                    <StyledTextFieldModal
                      fullWidth
                      value={searchData.lastName}
                      variant="outlined"
                      type="text"
                      name="lastName"
                      onChange={handleSearchChange}
                      className={isDataAdded ? "textfield-not-allowed" : ""}
                      InputProps={{
                        readOnly: isDataAdded,
                        style: { fontSize: "12px" },
                      }}
                    />
                  </Box>
                  <Box sx={{ padding: 1 }}>
                    <StyledTypographyModal
                      sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                    >
                      GID
                    </StyledTypographyModal>
                    <StyledTextFieldModal
                      fullWidth
                      value={searchData.gid}
                      variant="outlined"
                      type="text"
                      name="gid"
                      onChange={handleSearchChange}
                      className={isDataAdded ? "textfield-not-allowed" : ""}
                      InputProps={{
                        readOnly: isDataAdded,
                        style: { fontSize: "12px" },
                      }}
                    />
                  </Box>

                  <Box sx={{ padding: 1 }}>
                    <StyledTypographyModal
                      sx={{ fontSize: "15px", fontWeight: "bold", pb: 0.3 }}
                    >
                      Email
                    </StyledTypographyModal>
                    <StyledTextFieldModal
                      fullWidth
                      value={searchData.email}
                      variant="outlined"
                      type="email"
                      name="email"
                      onChange={handleSearchChange}
                      className={isDataAdded ? "textfield-not-allowed" : ""}
                      InputProps={{
                        readOnly: isDataAdded,
                        style: { fontSize: "12px" },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      mt: 2,
                      display: "flex",
                      justifyContent: "flex-end",
                      backgroundColor: "#f5f7fa",
                    }}
                  >
                    <Box sx={{ mr: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#2b7985",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={addClearSearchField}
                      >
                        <SyncIcon fontSize="small" />
                        Clear
                      </Button>
                    </Box>
                    <Box sx={{ mr: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#2b7985",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={handleSearch}
                      >
                        <SearchIcon fontSize="small" />
                        Search
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#005f87",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={handleProceed}
                        disabled={!proceedEnabled}
                      >
                        <KeyboardDoubleArrowRightIcon fontSize="small" />
                        Proceed
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Fade>
        {loading ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading} // Controls visibility of Backdrop
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : searchManager ? (
          <Dialog
            open={openPopup}
            onClose={togglePopup}
            PaperProps={{
              style: {
                display: "flex",
                justifyContent: "center",
                minWidth: "70%",
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: "#006487",
                color: "white",
                display: "flex",
                alignItems: "center",
                fontSize: "1.1rem",
              }}
              height={10}
            >
              Select User
              <IconButton
                aria-label="close"
                sx={{
                  position: "absolute",
                  right: 8,
                  color: "inherit",
                }}
                onClick={togglePopup}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <StyledDialogContent>
              <Box component={Paper} sx={{ p: 2 }}>
                <Table>
                  <TableHead>
                    <StyledTableHeadRow>
                      <StyledHeadTableCell />
                      <StyledHeadTableCell sx={{ color: "#fff" }}>
                        First Name
                      </StyledHeadTableCell>
                      <StyledHeadTableCell sx={{ color: "#fff" }}>
                        Last Name
                      </StyledHeadTableCell>
                      <StyledHeadTableCell sx={{ color: "#fff" }}>
                        GID
                      </StyledHeadTableCell>
                      <StyledHeadTableCell sx={{ color: "#fff" }}>
                        Org Code
                      </StyledHeadTableCell>
                      <StyledHeadTableCell sx={{ color: "#fff" }}>
                        Email
                      </StyledHeadTableCell>
                    </StyledTableHeadRow>
                  </TableHead>
                  <TableBody>
                    {searchManager && (
                      <StyledTableRow key={searchManager.GID}>
                        <StyledDataTableCell padding="checkbox">
                          <CustomCheckbox
                            checked={userChecked}
                            onChange={() => handleCheckboxChange(searchManager)}
                          />
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {searchManager?.FirstName}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {searchManager?.LastName}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {searchManager?.GID}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {searchManager?.OrganizationID}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {searchManager?.Email}
                        </StyledDataTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </StyledDialogContent>

            <DialogActions sx={{ backgroundColor: "#f5f7fa" }}>
              <Button
                onClick={addClearSearchField}
                variant="contained"
                color="primary"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleOkClick}
                disabled={!userChecked}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Typography>No results found.</Typography>
        )}
        {duplicateEntityError && (
          <Snackbar
            open
            autoHideDuration={6000}
            onClose={() => setDuplicateEntityError("")}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert onClose={() => setDuplicateEntityError("")} severity="error">
              {duplicateEntityError}
            </Alert>
          </Snackbar>
        )}
        <MyRequestWarningPopup 
              isPopupOpen={warningPopup} 
              handleClosePopup={handleClosePopup}
              operation={operationWarning}  
  />
      </>
    </Modal>
  );
};

export default MyRequestCustomModal;
