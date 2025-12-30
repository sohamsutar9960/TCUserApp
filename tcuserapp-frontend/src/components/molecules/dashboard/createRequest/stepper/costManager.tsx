import * as React from "react";
import { useEffect, useState } from "react";
import "./userSelection.scss";
import CloseIcon from "@mui/icons-material/Close";
import { Checkbox, TablePagination, Divider, styled } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Backdrop, CircularProgress } from "@mui/material";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  InputLabel,
  Button,
  Box,
  Typography,
  TableHead,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import TcScdUser from "../../../../../services/ScdUserService";
import { GroupRoleApproversByIdResponse } from "../../../../../models/groupRoleApproverModel";
import { GridSearchIcon } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import { useAuth } from "../../../../auth/AuthProvider/authProvider";
import WarningPopup from "./WarningPopup";
import { StyledTextFieldModal } from "../../groupPage/styledComponent";
import CostPopupModal from "./costpopupModal";

interface CostManagerProps {
  selectedUser: string;
  setSelectedUser: React.Dispatch<React.SetStateAction<string>>;
  updateUserRequest: (data: Partial<{ user: { userId: string } }>) => void;
  handleNext: () => void;
  dataChangeForCostManager: (data1: any, data2: any) => void;
  userRequest: any;
  allPageData: any;
}
interface SearchUserData {
  FirstName: string;
  LastName: string;
  DisplayName: string;
  gid: string;
  GID: string;
  OrganizationID: string;
  Email: string;
}
interface CustomCheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
function CostManager({
  selectedUser,
  setSelectedUser,
  updateUserRequest,
  handleNext,
  dataChangeForCostManager,
  userRequest,
  allPageData,
}: CostManagerProps) {
  const [firstName1, setFirstName1] = useState("");
  const [lastName1, setLastName1] = useState("");
  const [gid1, setGid1] = useState("");
  const [email1, setEmail1] = useState("");
  const [firstName2, setFirstName2] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [gid2, setGid2] = useState("");
  const [email2, setEmail2] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [matchGidUser, setMatchGidUser] = useState(false);
  const [groupRoleApproversById, setGroupRoleApproversById] = useState<
    GroupRoleApproversByIdResponse | any
  >({
    DisplayName: "",
    gid: "",
  });
  const [groupRoleApprovers, setGroupRoleApprovers] = useState<
    GroupRoleApproversByIdResponse[]
  >([]);
  const [isDataAdded, setIsDataAdded] = useState(false);
  const [searchUserData, setSearchUserData] = useState<SearchUserData | null>(
    null,
  );
  const [userChecked, setUserChecked] = useState(false);
  const [showSearchUserData, setShowSearchUserData] = useState<
    SearchUserData | any
  >({
    DisplayName: "",
    gid: "",
  });
  const [selectedApprover, setSelectedApprover] =
    useState<GroupRoleApproversByIdResponse | null>(null);

  const fetchGroupRoleApproversById = async (gid: string) => {
    setLoading(true);
    try {
      const response = await TcScdUser.fetchScdUsersById(gid);

      if (response.data) {
        setGroupRoleApproversById(response.data);
        setGroupRoleApprovers([response.data]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    setGroupRoleApproversById(userRequest.costManager1);
    setShowSearchUserData(userRequest.costManager2);
    if (
      userRequest.costManager2 &&
      Object.keys(userRequest.costManager2).length > 0
    ) {
      setIsDataAdded(true);
    }
  }, []);
  const onChangeCheckbox = () => {
    setUserChecked((prevState) => !prevState);
  };
  const handleProceedForSCD = async () => {
    dataChangeForCostManager(groupRoleApproversById, {});
    handleNext();
  };
  const handleProceedForManager = async () => {
    var finalGid =
      allPageData?.userRequestForAnother != null
        ? allPageData?.userRequestForAnother?.gid
        : allPageData?.userRequestSelf?.gid;
    console.log("gid", finalGid, gid2);
    if (finalGid == gid2) {
      handleOpenPopup();
    } else {
      dataChangeForCostManager({}, showSearchUserData);
      handleNext();
    }
  };

  const noPopup = () => {
    dataChangeForCostManager({}, showSearchUserData);
    handleNext();
  };
  const handleClear = () => {
    setFirstName2("");
    setLastName2("");
    setGid2("");
    setEmail2("");
    setSearchUserData(null);
    setUserChecked(false);
    setShowSearchUserData(null);
    setSelectedApprover(null);
    setIsDataAdded(false);
  };

  useEffect(() => {
    if (showSearchUserData) {
      setFirstName2(showSearchUserData.FirstName);
      setLastName2(showSearchUserData.LastName);
      setGid2(showSearchUserData.GID);
      setEmail2(showSearchUserData.Email);
    }
  }, [showSearchUserData]);

  const [warningOpen, setWarningOpen] = useState<boolean>(false);
  const handleSearch = async () => {
    if (!gid2) {
      setMatchGidUser(true);
      setWarningOpen(true);

      return;
    } else setMatchGidUser(false);
    try {
      const response = await TcScdUser.fetchScdUsersById(gid2);
      setSearchUserData(response.data);
      if (response.data) {
        setFirstName2(response.data.firstName || "");
        setLastName2(response.data.lastName || "");
        setEmail2(response.data.email || "");
        setOpenPopup((prevState) => !prevState);
        setOpenPopup(true);
      } else {
        setWarningOpen(true);
        setOpenPopup(false);
      }
    } catch (error) {}
  };
  const togglePopup = () => {
    setOpenPopup((prevState) => {
      if (prevState === true) {
        setUserChecked(false);
      }
      return !prevState;
    });
  };

  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>,
  ) => {
    setPage(newPage);
  };
  const yesPopup = () => {
    handleClosePopup();
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const StyledDialogContent = styled(DialogContent)({
    padding: "16px",
    margin: "8px",
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

  const StyledHeaderTableCell = styled(TableCell)({
    border: "1px solid #E0E0E0",
  });

  const StyledTableRow = styled(TableRow)({
    padding: 0,
  });
  const StyledTableHeadRow = styled(TableRow)({
    backgroundColor: "#006487",
  });

  const CustomCheckbox = (props: CustomCheckboxProps) => {
    const { checked, onChange } = props;
    return <Checkbox checked={checked} onChange={onChange} color="primary" />;
  };
  const handleOkClick = (UserDataPopup: any) => {
    setShowSearchUserData(UserDataPopup);
    setOpenPopup(false);
    setIsDataAdded(true);
  };
  const logInUserData = useAuth();

  useEffect(() => {
    if (logInUserData && logInUserData.user) {
      fetchGroupRoleApproversById(
        logInUserData.user?.user?.sponsor ||
          logInUserData?.user?.user?.lineManager,
      );
    }
  }, []);
  return (
    <Box
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#006487", height: "30px" }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    borderBottom: "none",
                    padding: "4px",
                    fontSize: "14px",
                  }}
                  colSpan={2}
                >
                  Cost Manager
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
        {!loading ? (
          <Box style={{ display: "flex" }}>
            <Box style={{ width: "50%", padding: "20px" }}>
              <Typography
                variant="h6"
                gutterBottom
                className="bold-black-header"
                sx={{ fontSize: "0.9rem", fontWeight: "bold" }}
              >
                From your SCD entry
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none", padding: "15px" }}>
                        <InputLabel
                          htmlFor="first-name1"
                          className="bold-black-header"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          First Name
                        </InputLabel>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none", padding: "4px" }}>
                        <StyledTextFieldModal
                          id="first-name1"
                          fullWidth
                          variant="outlined"
                          placeholder="Enter first name"
                          value={groupRoleApproversById?.FirstName}
                          onChange={(e) => setFirstName1(e.target.value)}
                          className="textfield-not-allowed"
                          inputProps={{ style: { fontSize: "12px" } }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none", padding: "15px" }}>
                        <InputLabel
                          htmlFor="last-name1"
                          className="bold-black-header"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          Last Name
                        </InputLabel>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none", padding: "4px" }}>
                        <StyledTextFieldModal
                          id="last-name1"
                          fullWidth
                          variant="outlined"
                          placeholder="Enter last name"
                          value={groupRoleApproversById?.LastName}
                          onChange={(e) => setLastName1(e.target.value)}
                          className="textfield-not-allowed"
                          inputProps={{ style: { fontSize: "12px" } }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none", padding: "15px" }}>
                        <InputLabel
                          htmlFor="gid1"
                          className="bold-black-header"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          GID
                        </InputLabel>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none", padding: "4px" }}>
                        <StyledTextFieldModal
                          id="gid1"
                          fullWidth
                          variant="outlined"
                          placeholder="Enter GID"
                          value={groupRoleApproversById?.GID}
                          onChange={(e) => setGid1(e.target.value)}
                          className="textfield-not-allowed"
                          inputProps={{ style: { fontSize: "12px" } }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none", padding: "15px" }}>
                        <InputLabel
                          htmlFor="email1"
                          className="bold-black-header"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          Email
                        </InputLabel>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none", padding: "4px" }}>
                        <StyledTextFieldModal
                          id="email1"
                          fullWidth
                          variant="outlined"
                          placeholder="Enter email"
                          value={groupRoleApproversById?.Email}
                          onChange={(e) => setEmail1(e.target.value)}
                          className="textfield-not-allowed"
                          inputProps={{ style: { fontSize: "12px" } }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        align="right"
                        colSpan={2}
                        sx={{
                          borderBottom: "none",
                          padding: "15px",
                          paddingRight: "5px",
                          marginLeft: "10px",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={handleProceedForSCD}
                          sx={{
                            padding: "3px 6px",
                            fontSize: "0.7rem",
                            minWidth: "60px",
                          }}
                        >
                          Proceed
                          <KeyboardDoubleArrowRightIcon fontSize="small" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderRight: "2px dashed rgba(0, 0, 0, 0.2)",
              }}
            />
            <Box style={{ width: "50%", padding: "20px" }}>
              <Typography
                variant="h6"
                gutterBottom
                className="bold-black-header"
                sx={{ fontSize: "0.9rem", fontWeight: "bold" }}
              >
                Select a specific manager
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none", padding: "15px" }}>
                        <InputLabel
                          htmlFor="first-name2"
                          className="bold-black-header"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          First Name
                        </InputLabel>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none", padding: "4px" }}>
                        <StyledTextFieldModal
                          id="first-name2"
                          fullWidth
                          variant="outlined"
                          placeholder="Enter first name"
                          value={firstName2}
                          onChange={(e) => setFirstName2(e.target.value)}
                          className={isDataAdded ? "textfield-not-allowed" : ""}
                          InputProps={{
                            readOnly: isDataAdded,
                            style: { fontSize: "12px" },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none", padding: "15px" }}>
                        <InputLabel
                          htmlFor="last-name2"
                          className="bold-black-header"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          Last Name
                        </InputLabel>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          padding: "4px",
                          cursor: isDataAdded ? "not-allowed" : "auto",
                        }}
                      >
                        <StyledTextFieldModal
                          id="last-name2"
                          fullWidth
                          variant="outlined"
                          placeholder="Enter last name"
                          value={lastName2}
                          onChange={(e) => setLastName2(e.target.value)}
                          className={isDataAdded ? "textfield-not-allowed" : ""}
                          InputProps={{
                            readOnly: isDataAdded,
                            style: { fontSize: "12px" },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none", padding: "15px" }}>
                        <InputLabel
                          htmlFor="gid2"
                          sx={{ fontSize: "0.8rem" }}
                          className="bold-black-header"
                        >
                          GID
                        </InputLabel>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: "none",
                          padding: "4px",
                          cursor: isDataAdded ? "not-allowed" : "auto",
                        }}
                      >
                        <StyledTextFieldModal
                          id="gid2"
                          fullWidth
                          variant="outlined"
                          placeholder="Enter GID"
                          value={gid2}
                          onChange={(e) => setGid2(e.target.value)}
                          className={isDataAdded ? "textfield-not-allowed" : ""}
                          InputProps={{
                            readOnly: isDataAdded,
                            style: { fontSize: "12px" },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none", padding: "15px" }}>
                        <InputLabel
                          htmlFor="email2"
                          className="bold-black-header"
                          sx={{ fontSize: "0.8rem" }}
                        >
                          Email
                        </InputLabel>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none", padding: "4px" }}>
                        <StyledTextFieldModal
                          id="email2"
                          fullWidth
                          variant="outlined"
                          placeholder="Enter email"
                          value={email2}
                          onChange={(e) => setEmail2(e.target.value)}
                          className={isDataAdded ? "textfield-not-allowed" : ""}
                          InputProps={{
                            readOnly: isDataAdded,
                            style: { fontSize: "12px" },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        align="right"
                        colSpan={2}
                        sx={{
                          borderBottom: "none",
                          padding: "15px",
                          paddingRight: "2px",
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-end"
                          sx={{ paddingRight: "2px" }}
                        >
                          <Box mr={1}>
                            <Button
                              variant="contained"
                              onClick={handleSearch}
                              startIcon={<GridSearchIcon />}
                              sx={{
                                padding: "3px 6px",
                                fontSize: "0.7rem",
                                minWidth: "60px",
                              }}
                            >
                              Search
                            </Button>
                          </Box>
                          <Box mr={1}>
                            <Button
                              variant="outlined"
                              onClick={handleClear}
                              startIcon={
                                <ClearIcon style={{ color: "#333" }} />
                              }
                              sx={{
                                padding: "3px 6px",
                                fontSize: "0.7rem",
                                minWidth: "60px",
                              }}
                            >
                              Clear
                            </Button>
                          </Box>
                          <Button
                            variant="contained"
                            onClick={handleProceedForManager}
                            style={{
                              alignItems: "center",
                              padding: "3px 6px",
                              fontSize: "0.7rem",
                              minWidth: "60px",
                            }}
                            disabled={!showSearchUserData?.FirstName}
                          >
                            Proceed
                            <KeyboardDoubleArrowRightIcon fontSize="small" />
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        ) : (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Box>

      <Dialog
        open={openPopup}
        onClose={togglePopup}
        PaperProps={{
          style: {
            display: "flex",
            justifyContent: "center",
            minWidth: "70%",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#006487",
            color: "white",
            display: "flex",
            alignItems: "center",
            fontSize: "0.9rem",
            padding: "8px 12px",
            borderBottom: "1px solid #ddd",
          }}
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
        <DialogContent sx={{ padding: "16px 24px" }}>
          <Box component={Paper} sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <StyledHeaderTableCell colSpan={6}>
                  <Typography
                    variant="body1"
                    sx={{ color: "red", fontSize: "12px" }}
                  >
                    This search shows a maximum of 50 records per search. It
                    might have more matching records. Please refilter your
                    search to see those records.
                  </Typography>
                </StyledHeaderTableCell>
                <StyledTableHeadRow>
                  <StyledHeadTableCell />
                  <StyledHeadTableCell
                    sx={{ color: "#fff", fontSize: "0.8rem" }}
                  >
                    First Name
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "#fff", fontSize: "0.8rem" }}
                  >
                    Last Name
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "#fff", fontSize: "0.8rem" }}
                  >
                    GID
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "#fff", fontSize: "0.8rem" }}
                  >
                    Org Code
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "#fff", fontSize: "0.8rem" }}
                  >
                    Email
                  </StyledHeadTableCell>
                </StyledTableHeadRow>
              </TableHead>
              {searchUserData != undefined && (
                <TableBody>
                  <StyledTableRow key={1}>
                    <StyledDataTableCell padding="checkbox">
                      <CustomCheckbox
                        checked={userChecked}
                        onChange={() => onChangeCheckbox()}
                      />
                    </StyledDataTableCell>
                    <StyledDataTableCell sx={{ fontSize: "0.8rem" }}>
                      {searchUserData?.FirstName}
                    </StyledDataTableCell>
                    <StyledDataTableCell sx={{ fontSize: "0.8rem" }}>
                      {searchUserData?.LastName}
                    </StyledDataTableCell>
                    <StyledDataTableCell sx={{ fontSize: "0.8rem" }}>
                      {searchUserData?.GID}
                    </StyledDataTableCell>
                    <StyledDataTableCell sx={{ fontSize: "0.8rem" }}>
                      {searchUserData?.OrganizationID}
                    </StyledDataTableCell>
                    <StyledDataTableCell sx={{ fontSize: "0.8rem" }}>
                      {searchUserData?.Email}
                    </StyledDataTableCell>
                  </StyledTableRow>

                  <StyledTableRow>
                    <StyledHeadTableCell colSpan={6}>
                      <TablePagination
                        rowsPerPageOptions={[2, 3, 5, 10, 25, 50]}
                        component="div"
                        count={groupRoleApprovers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </StyledHeadTableCell>
                  </StyledTableRow>
                </TableBody>
              )}
            </Table>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f5f7fa", padding: "8px 24px" }}>
          <Button
            onClick={togglePopup}
            variant="contained"
            color="primary"
            sx={{
              padding: "3px 8px",
              fontSize: "0.8rem",
              minWidth: "60px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleOkClick(searchUserData)}
            sx={{
              padding: "3px 8px",
              fontSize: "0.8rem",
              minWidth: "60px",
            }}
            disabled={!userChecked}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <WarningPopup
        open={warningOpen}
        onClose={() => setWarningOpen(false)}
        gidMatch={matchGidUser}
      />
      <CostPopupModal
        isPopupOpen={isPopupOpen}
        handleClosePopup={handleClosePopup}
        yesPopup={yesPopup}
        noPopup={noPopup}
      />
    </Box>
  );
}

export default CostManager;
