import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CachedIcon from "@mui/icons-material/Cached";
import BlockIcon from "@mui/icons-material/Block";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import {
  GroupRoleApprover,
  GroupRoleApproversByIdResponse,
} from "../../../../models/groupRoleApproverModel";
import TcGroupRoleApprover from "../../../../services/groupRoleApproverService";
import GroupRoleApproverCustomModal from "../../../atoms/common/modals/groupRoleApproverCustomModal";
import TcScdUser from "../../../../services/ScdUserService";
import axios from "axios";
import {
  StyledAddButton,
  StyledAddIcon,
  StyledBox,
  StyledButtonGrid,
  StyledCommonGrid,
  StyledDataTableCell,
  StyledDeleteButton,
  StyledDeleteIcon,
  StyledEditButton,
  StyledEditIcon,
  StyledHeaderBox,
  StyledImportButton,
  StyledImportIcon,
  StyledOpenSearchBox,
  StyledOpenSearchGrid,
  StyledOuterBox,
  StyledRefreshButton,
  StyledSearchButton,
  StyledSearchIcon,
  StyledTablePagination,
  StyledTextField,
  StyledTypography,
  TablePaginationCell,
  TablePaginationRow,
} from "../groupPage/styledComponent";

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

const StyledHeaderTableCell = styled(TableCell)({
  border: "1px solid #E0E0E0",
});

const StyledTableRow = styled(TableRow)({
  padding: 0,
});
const StyledTableHeadRow = styled(TableRow)({
  backgroundColor: "#006487",
});

const GroupRoleApproverPage = () => {
  const [groupRoleApprovers, setGroupRoleApprovers] = useState<
    GroupRoleApprover[]
  >([]);
  const [groupRoleApproversById, setGroupRoleApproversById] = useState<
    GroupRoleApproversByIdResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [editItem, setEditItem] = useState<GroupRoleApprover | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [tempSelectedApprover, setTempSelectedApprover] =
    useState<GroupRoleApproversByIdResponse | null>(null);
  const [confirmedApprover, setConfirmedApprover] =
    useState<GroupRoleApproversByIdResponse | null>(null);
  const [proceedEnabled, setProceedEnabled] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit">("add");
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<GroupRoleApprover | undefined>(
    undefined,
  );
  const [openPopup, setOpenPopup] = useState(false);
  const [searchFields, setSearchFields] = useState({
    firstName: "",
    gid: "",
    lastName: "",
  });

  const [duplicateEntityError, setDuplicateEntityError] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [isDataAdded, setIsDataAdded] = useState(false);

  const tableRef = useRef<HTMLTableElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node) &&
        buttonsRef.current &&
        !buttonsRef.current.contains(event.target as Node)
      ) {
        setSelectedRow(undefined);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSearchFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleClearSearchFields = () => {
    setSearchFields({
      firstName: "",
      gid: "",
      lastName: "",
    });
    getGroupRoleApprovers();
  };

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };

  const togglePopup = () => {
    setOpenPopup((prevState) => !prevState);
    if (openPopup) {
      setTempSelectedApprover(null);
      setProceedEnabled(false);
    }
  };

  const handleCheckboxChange = (
    approver: GroupRoleApproversByIdResponse | null,
  ) => {
    if (tempSelectedApprover?.GID === approver?.GID) {
      setTempSelectedApprover(null);
    } else {
      setTempSelectedApprover(approver);
    }
    setProceedEnabled(!tempSelectedApprover);
  };

  const handleOkClick = () => {
    if (tempSelectedApprover) {
      setConfirmedApprover(tempSelectedApprover);
      setOpenPopup(false);
    }
    setIsDataAdded(true);
  };

  const handleOpen = (
    operation: "add" | "edit",
    itemData?: GroupRoleApprover,
  ) => {
    setOperationType(operation);
    setEditItem(itemData || null);
    setOpen(true);
  };
  const handleToggleSearch = () => {
    setOpenSearch(!openSearch);
  };

  const handleRowSelect = (row: GroupRoleApprover) => {
    setSelectedRow(row);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const paginatedData = groupRoleApprovers?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getGroupRoleApprovers = async () => {
    try {
      const response = await TcGroupRoleApprover.findAllGroupRoleApprovers();
      setGroupRoleApprovers(response?.data);
    } catch (error) {
      console.error("Error fetching GroupRoleApprovers:", error);
    }
  };
  const searchGroupRoleApprovers = async (searchFields: any) => {
    try {
      const response =
        await TcGroupRoleApprover.searchGroupRoleApprover(searchFields);
      setGroupRoleApprovers(response?.data ?? []);
    } catch (error) {
      console.error("Error fetching GroupRoleApprovers:", error);
    }
  };

  useEffect(() => {
    getGroupRoleApprovers();
  }, []);

  const handleToggleItemActivation = async (
    item: GroupRoleApprover | undefined,
    isActive: boolean,
  ) => {
    try {
      if (item?.isActive === isActive) {
        setSnackbarMessage(`Already ${isActive ? "Activated" : "Deactivated"}`);
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }
      const updatedItem = {
        groupRoleApproverId: item?.groupRoleApproverId,
        isActive: isActive,
      };
      const response =
        await TcGroupRoleApprover.updateActivateDeactivateGroupRoleApprover(
          updatedItem,
        );
      const updatedData = groupRoleApprovers.map((groupRoleApprover) =>
        groupRoleApprover.groupRoleApproverId === item?.groupRoleApproverId
          ? response.data
          : groupRoleApprover,
      );
      setGroupRoleApprovers(updatedData);
      setSnackbarMessage(
        `Successfully ${isActive ? "Activated" : "Deactivated"}`,
      );
      setSnackbarSeverity(isActive ? "success" : "error");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        `Error ${isActive ? "activating" : "deactivating"} item:`,
        error,
      );

      setSnackbarMessage(
        `Failed to ${isActive ? "Activate" : "Deactivate"} item`,
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAddNewItem = async (groupRoleApproverData: GroupRoleApprover) => {
    try {
      let response = await TcGroupRoleApprover.saveGroupRoleApprover(
        groupRoleApproverData,
      );
      setGroupRoleApprovers((prevData) => [...prevData, response.data]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          setDuplicateEntityError(error.response.data.message);
        }
        console.error("Error creating GroupRoleApprovers:", error);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }

    handleClose();
  };

  const handleEditItem = async (editedItem: GroupRoleApprover) => {
    try {
      await TcGroupRoleApprover.updateGroupRoleApprover(editedItem);
      const updatedData = groupRoleApprovers.map((groupRoleApprover) =>
        groupRoleApprover.groupRoleApproverId === editedItem.groupRoleApproverId
          ? editedItem
          : groupRoleApprover,
      );
      setGroupRoleApprovers(updatedData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          setDuplicateEntityError(error.response.data.message);
        }
        console.error("Error updating GroupRoleApprovers:", error);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
    handleClose();
  };

  const fetchGroupRoleApproversById = async (gid: string) => {
    setLoading(true);
    try {
      const response = await TcScdUser.fetchScdUsersById(gid);
      setTempSelectedApprover(null);
      if (response.data) {
        setGroupRoleApproversById([response.data]);
      }
    } catch (error) {
      console.error("Error fetching groupRoleApprover:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledOuterBox>
        <StyledHeaderBox>Group/Role Approver Overview</StyledHeaderBox>
        <StyledOpenSearchBox m={2} pb={1} component={Paper}>
          {openSearch && (
            <StyledOpenSearchGrid container spacing={1.5} pb={2}>
              <StyledCommonGrid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    ml: 1,
                  }}
                >
                  <StyledCommonGrid container spacing={1.5} mt={0.5}>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        First Name
                      </StyledTypography>
                      <StyledTextField
                        name="firstName"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields?.firstName}
                        onChange={handleSearchChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Last Name
                      </StyledTypography>
                      <StyledTextField
                        name="lastName"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields?.lastName}
                        onChange={handleSearchChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        GID
                      </StyledTypography>
                      <StyledTextField
                        name="gid"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields?.gid}
                        onChange={handleSearchChange}
                      />
                    </Grid>
                  </StyledCommonGrid>
                  <StyledButtonGrid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ textAlign: "end" }}
                  >
                    <Tooltip title="Refresh">
                      <span>
                        <StyledRefreshButton
                          variant="contained"
                          size="small"
                          sx={{
                            mr: 1,
                            minWidth: "35px",
                            height: "35px",
                            bgcolor: "white",
                            "&:hover": {
                              bgcolor: "#1565C0",
                              ".MuiSvgIcon-root": {
                                color: "white",
                              },
                            },
                          }}
                          onClick={handleClearSearchFields}
                        >
                          <CachedIcon sx={{ color: "#1565C0" }} />
                        </StyledRefreshButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Search">
                      <span>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            minWidth: "35px",
                            height: "35px",
                            mr: 1,
                            bgcolor: "#1565C0",
                            "&:hover": {
                              bgcolor: "white",
                              ".MuiSvgIcon-root": {
                                color: "#1565C0",
                              },
                            },
                          }}
                          onClick={() => searchGroupRoleApprovers(searchFields)}
                        >
                          <SearchIcon sx={{ color: "white" }} />
                        </Button>
                      </span>
                    </Tooltip>
                  </StyledButtonGrid>
                </Box>
              </StyledCommonGrid>
            </StyledOpenSearchGrid>
          )}
          <Box sx={{ display: "flex" }} ref={buttonsRef}>
            <Box mt={2} px={1}>
              <Tooltip title="Search">
                <span>
                  <StyledSearchButton
                    variant="contained"
                    color="primary"
                    onClick={handleToggleSearch}
                  >
                    <StyledSearchIcon>
                      <SearchIcon fontSize="medium" />
                    </StyledSearchIcon>
                  </StyledSearchButton>
                </span>
              </Tooltip>
            </Box>
            <Box mt={2}>
              <Tooltip title="Add">
                <span>
                  <StyledAddButton
                    variant="contained"
                    color="success"
                    onClick={() => handleOpen("add")}
                  >
                    <StyledAddIcon>
                      <AddIcon fontSize="medium" />
                    </StyledAddIcon>
                  </StyledAddButton>
                </span>
              </Tooltip>
            </Box>
            <Box mt={2} px={1} sx={{ cursor: "pointer" }}>
              <Tooltip title="Edit">
                <span>
                  <StyledEditButton
                    variant="contained"
                    onClick={() => handleOpen("edit", selectedRow)}
                    color="warning"
                    disabled={!selectedRow}
                  >
                    <StyledEditIcon>
                      <EditIcon fontSize="medium" />
                    </StyledEditIcon>
                  </StyledEditButton>
                </span>
              </Tooltip>
            </Box>
            <Box mt={2} sx={{ cursor: "pointer" }}>
              <Tooltip title="Activate">
                <span>
                  <StyledImportButton
                    variant="contained"
                    onClick={() =>
                      handleToggleItemActivation(selectedRow, true)
                    }
                    color="info"
                    disabled={!selectedRow}
                  >
                    <StyledImportIcon>
                      <HowToRegIcon fontSize="medium" />
                    </StyledImportIcon>
                  </StyledImportButton>
                </span>
              </Tooltip>
            </Box>
            <Box mt={2} px={1} sx={{ cursor: "pointer" }}>
              <Tooltip title="Deactivate">
                <span>
                  <StyledDeleteButton
                    variant="contained"
                    onClick={() =>
                      handleToggleItemActivation(selectedRow, false)
                    }
                    color="error"
                    disabled={!selectedRow}
                  >
                    <StyledDeleteIcon>
                      <BlockIcon fontSize="medium" />
                    </StyledDeleteIcon>
                  </StyledDeleteButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          <StyledBox sx={{ m: 1.5 }} ref={tableRef}>
            <Table sx={{ backgroundColor: "white", mb: 3 }} ref={tableRef}>
              <TableHead sx={{ backgroundColor: "#777", height: "40px" }}>
                <StyledTableHeadRow>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("firstName")}
                  >
                    First Name
                    {sortColumn === "firstName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("lastName")}
                  >
                    Last Name
                    {sortColumn === "lastName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("displayName")}
                  >
                    Display Name
                    {sortColumn === "displayName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("gid")}
                  >
                    GID
                    {sortColumn === "gid" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("email")}
                  >
                    Email
                    {sortColumn === "email" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("sponser")}
                  >
                    Sponser
                    {sortColumn === "sponser" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("lineManager")}
                  >
                    Manager
                    {sortColumn === "lineManager" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("active")}
                  >
                    Active
                    {sortColumn === "active" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                </StyledTableHeadRow>
              </TableHead>
              <TableBody>
                {paginatedData
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((groupRoleApprover) => (
                    <StyledTableRow
                      key={groupRoleApprover?.groupRoleApproverId}
                      selected={
                        selectedRow?.groupRoleApproverId ===
                        groupRoleApprover?.groupRoleApproverId
                      }
                      onClick={() => handleRowSelect(groupRoleApprover)}
                      sx={{ cursor: "pointer" }}
                    >
                      <StyledDataTableCell>
                        {groupRoleApprover?.firstName}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {groupRoleApprover?.lastName}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {groupRoleApprover?.displayName}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {groupRoleApprover?.gid}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {groupRoleApprover?.email}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {groupRoleApprover?.sponsor}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {groupRoleApprover?.lineManager
                          ? groupRoleApprover?.lineManager
                          : "-"}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {groupRoleApprover?.isActive === true ? "Yes" : "No"}
                      </StyledDataTableCell>
                    </StyledTableRow>
                  ))}
                <TablePaginationRow sx={{ border: "1px solid #E0E0E0;" }}>
                  <TablePaginationCell colSpan={10}>
                    <StyledTablePagination
                      className="pagination"
                      rowsPerPageOptions={[8, 16, 24]}
                      count={groupRoleApprovers.length}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TablePaginationCell>
                </TablePaginationRow>
              </TableBody>
            </Table>

            <GroupRoleApproverCustomModal
              handleAddNewItem={handleAddNewItem}
              handleEditItem={handleEditItem}
              editItem={editItem}
              onClose={handleClose}
              operation={operationType}
              open={open}
              fetchGroupRoleApproversById={fetchGroupRoleApproversById}
              togglePopup={togglePopup}
              selectedApprover={confirmedApprover}
              isDataAdded={isDataAdded}
              setIsDataAdded={setIsDataAdded}
            />
          </StyledBox>
        </StyledOpenSearchBox>

        {loading ? (
          <Box
            sx={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0, 0, 0, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "fixed",
              zIndex: 1400,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
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
                    <StyledHeaderTableCell colSpan={6}>
                      <Typography
                        variant="body1"
                        sx={{ color: "red", fontSize: "16px" }}
                      >
                        This search shows a maximum of 50 records per search. It
                        might have more matching records. Please refilter your
                        search to see those records.
                      </Typography>
                    </StyledHeaderTableCell>
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
                    {Array.isArray(groupRoleApproversById) &&
                      groupRoleApproversById
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        .map((groupRoleApprover) => (
                          <TableRow key={groupRoleApprover.GID}>
                            <TableCell>
                              <Checkbox
                                color="primary"
                                checked={
                                  tempSelectedApprover?.GID ===
                                  groupRoleApprover.GID
                                }
                                onChange={() =>
                                  handleCheckboxChange(groupRoleApprover)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {groupRoleApprover?.FirstName}
                            </TableCell>
                            <TableCell>{groupRoleApprover?.LastName}</TableCell>
                            <TableCell>{groupRoleApprover?.GID}</TableCell>
                            <TableCell>
                              {groupRoleApprover?.OrganizationID}
                            </TableCell>
                            <TableCell>{groupRoleApprover?.Email}</TableCell>
                          </TableRow>
                        ))}
                    <StyledTableRow>
                      <StyledHeadTableCell colSpan={6}>
                        <TablePagination
                          rowsPerPageOptions={[2, 3, 5, 10, 25, 50]}
                          component="div"
                          count={groupRoleApproversById.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </StyledHeadTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </Box>
            </StyledDialogContent>
            <DialogActions sx={{ backgroundColor: "#f5f7fa" }}>
              <Button onClick={togglePopup} variant="contained" color="primary">
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleOkClick}
                disabled={!proceedEnabled}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </StyledOuterBox>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GroupRoleApproverPage;
