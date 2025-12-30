import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableHead,
  Tooltip,
  SelectChangeEvent,
  MenuItem,
  Backdrop,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CachedIcon from "@mui/icons-material/Cached";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useEffect, useRef, useState } from "react";
import {
  TcUserModel,
  TcUserResponse,
  searchFields,
} from "../../../../models/tcUserModel";
import TcUserService from "../../../../services/tcUserService";
import TcUserModal from "../../../atoms/common/modals/TcUserModal";
import TcSystem from "../../../../services/SystemService";
import { SystemResponse } from "../systemPage";
import TcUserCustomModal from "../../../atoms/common/modals/TcUserCustomModal";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import {
  StyledOuterBox,
  StyledHeaderBox,
  StyledOpenSearchBox,
  StyledOpenSearchGrid,
  StyledTypography,
  StyledTextField,
  StyledButtonGrid,
  StyledRefreshButton,
  StyledAddButton,
  StyledAddIcon,
  StyledDeleteButton,
  StyledDeleteIcon,
  StyledEditButton,
  StyledEditIcon,
  StyledImportButton,
  StyledImportIcon,
  StyledSearchButton,
  StyledSearchIcon,
  StyledHeadTableCell,
  StyledTableHeadRow,
  StyledDataTableCell,
  StyledTableRow,
  StyledTablePagination,
  TablePaginationCell,
  TablePaginationRow,
  StyledCommonGrid,
  StyledDropdownGridInput,
} from "../groupPage/styledComponent";
import axios from "axios";

const TcUserPage = () => {
  const [tcUser, setTcUser] = useState<TcUserResponse[]>([]);
  const [systemData, setSystemData] = useState<SystemResponse[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [editItem, setEditItem] = useState<TcUserResponse | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [operationType, setOperationType] = useState<
    "add" | "edit" | "delete" | "import"
  >("add");
  const [loading, setLoading] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TcUserResponse | undefined>(
    undefined,
  );
  const tableRef = useRef<HTMLTableElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );
  const [searchFields, setSearchFields] = useState<searchFields>({
    tcUserId: "",
    gid: "",
    systemName: "",
    userStatus: "",
  });
  const [userStatus, setUserStatus] = useState([
    { userType: "Active", userStatus: "active" },
    { userType: "InActive", userStatus: "inactive" },
  ]);

  const handleSearch = async (searchFields: searchFields) => {
    const searchParams = { ...searchFields };
    if (!searchParams.userStatus) {
      delete searchParams?.userStatus;
    }
    try {
      const response = await TcUserService.searchUserHistory(searchParams);
      if (response.data) {
        setTcUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching Tc user history :", error);
    }
  };

  const handleImportClick = () => {
    setOpenImport(true);
  };
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSearchFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleUserStatus = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target;
    setSearchFields((prevData) => ({
      ...prevData,
      [name]: value as string, // Cast to string here
    }));
  };

  const handleProceed = async (systemId?: number) => {
    if (systemId) {
      setLoading(true);
      try {
        const response = await TcUserService.getAllTcUserBySelect(systemId);
        setTcUser(response?.data);
        setSnackbarMessage("Teamcenter user imported successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status !== 201) {
            const message = error.response && error.response.data.message;
            setSnackbarMessage(message);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    setOpenImport(false);
    getTcUser();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
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
  const handleSort = (column: keyof TcUserResponse) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };
  const handleOpen = (
    operation: "edit" | "add" | "delete" | "import",
    itemData?: TcUserResponse,
  ) => {
    setOperationType(operation);
    setEditItem(itemData || null);
    setOpen(true);
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
    const newRowsPerPage = parseInt(event.target.value, 8);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const sortedData = [...tcUser].sort((a: any, b: any) => {
    const aValue = sortColumn ? a[sortColumn] : null;
    const bValue = sortColumn ? b[sortColumn] : null;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    } else if (aValue && bValue) {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return 0;
    }
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getTcUser = async () => {
    try {
      const response = await TcUserService.findAllTcUser();
      setTcUser(response?.data);
    } catch (error) {
      console.error("Error fetching User:", error);
    }
  };

  const getSystems = async () => {
    try {
      const response = await TcSystem.findAllSystems();
      setSystemData(response?.data);
    } catch (error) {
      console.error("Error fetching systems:", error);
    }
  };
  useEffect(() => {
    getTcUser();
    getSystems();
  }, []);

  const handleAddNewItem = async (tcUserData: TcUserResponse) => {
    const {
      gid,
      userHistoryId,
      tcUserId,
      systemName,
      requestStatus,
      userStatus,
      neverLock,
      tcCreated,
      tcAccountType,
    } = tcUserData;
    const newTcUser: TcUserModel = {
      gid: gid,
      userHistoryId: userHistoryId,
      tcUserId: tcUserId,
      systemName: systemName,
      requestStatus: requestStatus,
      userStatus: userStatus,
      neverLock: neverLock,
      tcCreated: tcCreated,
      tcAccountType: tcAccountType,
    };

    try {
      const response = await TcUserService.createTcUser(newTcUser);
      setTcUser((prevData) => [...prevData, response.data]);
    } catch (error) {
      console.error("Error creating User:", error);
    }
    handleClose();
  };

  const handleEditItem = async (editedItem: TcUserResponse) => {
    const {
      gid,
      userHistoryId,
      tcUserId,
      systemName,
      requestStatus,
      userStatus,
      neverLock,
      tcCreated,
      tcAccountType,
    } = editedItem;
    const editedTcUser: TcUserModel = {
      gid: gid,
      userHistoryId: userHistoryId,
      tcUserId: tcUserId,
      systemName: systemName,
      requestStatus: requestStatus,
      userStatus: userStatus,
      neverLock: neverLock,
      tcCreated: tcCreated,
      tcAccountType: tcAccountType,
    };
    try {
      await TcUserService.updateTcUser(editedTcUser);
      const updatedData = tcUser.map((item) =>
        item.tcUserId === editedItem.tcUserId ? editedItem : item,
      );
      setTcUser(updatedData);
    } catch (error) {
      console.error("Error updating service:", error);
    }
    handleClose();
  };
  const handleDeleteItem = async (id: number | undefined) => {
    if (id !== undefined) {
      try {
        await TcUserService.deleteTcUser(id);
        const updatedData = tcUser.filter((item) => item.userHistoryId !== id);
        setTcUser(updatedData);
        if ((tcUser.length - 1) % rowsPerPage === 0 && page > 0) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Error deleting tcConfig:", error);
      }
      handleClose();
    }
  };

  const handleResetSearch = () => {
    setSearchFields({
      tcUserId: "",
      gid: "",
      systemName: "",
      userStatus: "",
    });
    getTcUser();
  };

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch);
    if (!openSearch) {
      handleResetSearch();
    }
  };

  const handleRowSelect = (row: TcUserResponse) => {
    setSelectedRow(row);
  };
  return (
    <>
      <StyledOuterBox>
        {loading ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            <StyledHeaderBox className="card-header">
              Teamcenter Users Overview
            </StyledHeaderBox>
            <StyledOpenSearchBox
              m={2}
              pb={1}
              component={Paper}
              style={{ paddingTop: "24px" }}
            >
              {openSearch && (
                <StyledOpenSearchGrid container spacing={1.5}>
                  <StyledCommonGrid item xs={12}>
                    <StyledCommonGrid
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        ml: 1,
                      }}
                    >
                      <Grid container spacing={1.5}>
                        <Grid item xs={12} sm={6} md={3}>
                          <StyledTypography
                            sx={{
                              fontSize: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            TC User ID
                          </StyledTypography>
                          <StyledTextField
                            fullWidth
                            name="tcUserId"
                            id="standard-bare"
                            variant="outlined"
                            value={searchFields.tcUserId}
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
                            fullWidth
                            name="gid"
                            id="standard-bare"
                            variant="outlined"
                            value={searchFields.gid}
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
                            System
                          </StyledTypography>
                          <StyledTextField
                            fullWidth
                            name="systemName"
                            id="standard-bare"
                            variant="outlined"
                            value={searchFields?.systemName}
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
                            User Status
                          </StyledTypography>
                          <StyledDropdownGridInput
                            fullWidth
                            sx={{ padding: "4.5px 2px" }}
                            value={searchFields?.userStatus ?? undefined}
                            variant="outlined"
                            name="userStatus"
                            onChange={handleUserStatus}
                          >
                            {Array.isArray(userStatus) &&
                              userStatus?.map((req) => (
                                <MenuItem
                                  key={req.userType}
                                  value={req.userStatus}
                                >
                                  {req.userType}
                                </MenuItem>
                              ))}
                          </StyledDropdownGridInput>
                        </Grid>
                      </Grid>

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
                              onClick={handleResetSearch}
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
                              onClick={() => handleSearch(searchFields)}
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
                            >
                              <SearchIcon sx={{ color: "white" }} />
                            </Button>
                          </span>
                        </Tooltip>
                      </StyledButtonGrid>
                    </StyledCommonGrid>
                  </StyledCommonGrid>
                </StyledOpenSearchGrid>
              )}
              <Box sx={{ display: "flex", ml: 0.5 }} ref={buttonsRef}>
                <Box mt={2} mb={1} px={1}>
                  <Tooltip title="Search">
                    <span>
                      <StyledSearchButton
                        sx={{ marginLeft: "0px" }}
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

                <Box mt={2} mb={1} px={1}>
                  <Tooltip title="Add">
                    <span>
                      <StyledAddButton
                        variant="contained"
                        sx={{ marginLeft: "-8px" }}
                        onClick={() => handleOpen("add")}
                      >
                        <StyledAddIcon>
                          <AddIcon fontSize="medium" />
                        </StyledAddIcon>
                      </StyledAddButton>
                    </span>
                  </Tooltip>
                </Box>
                <Box mt={2} mb={1} px={1}>
                  <Tooltip title="Import ">
                    <span>
                      <StyledImportButton
                        sx={{ marginLeft: "-8px" }}
                        variant="contained"
                        onClick={handleImportClick}
                      >
                        <StyledImportIcon sx={{ padding: "4px 0px 5px 0px" }}>
                          <UploadFileIcon fontSize="medium" />{" "}
                        </StyledImportIcon>
                      </StyledImportButton>
                    </span>
                  </Tooltip>
                </Box>

                <Box mt={2} mb={1} px={1}>
                  <Tooltip title="Edit">
                    <span>
                      <StyledEditButton
                        sx={{ marginLeft: "-8px" }}
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
                <Box mt={2} mb={1}>
                  <Tooltip title="Delete">
                    <span>
                      <StyledDeleteButton
                        variant="contained"
                        color="error"
                        onClick={() => handleOpen("delete", selectedRow)}
                        disabled={!selectedRow}
                      >
                        <StyledDeleteIcon>
                          <DeleteIcon fontSize="medium" />
                        </StyledDeleteIcon>
                      </StyledDeleteButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={{ m: 1.5 }} ref={tableRef}>
                <Table sx={{ backgroundColor: "white" }}>
                  <TableHead sx={{ backgroundColor: "#777", height: "40px" }}>
                    <StyledTableHeadRow>
                      <StyledHeadTableCell
                        sx={{ color: "white", cursor: "pointer" }}
                        onClick={() => handleSort("gid")}
                      >
                        ID
                        {sortColumn === "gid" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </StyledHeadTableCell>
                      <StyledHeadTableCell
                        sx={{ color: "white", cursor: "pointer", width: "15%" }}
                        onClick={() => handleSort("tcUserId")}
                      >
                        TC UserID
                        {sortColumn === "tcUserId" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </StyledHeadTableCell>
                      <StyledHeadTableCell
                        sx={{ color: "white", cursor: "pointer", width: "15%" }}
                        onClick={() => handleSort("systemName")}
                      >
                        System
                        {sortColumn === "systemName" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </StyledHeadTableCell>
                      <StyledHeadTableCell
                        sx={{ color: "white", cursor: "pointer", width: "15%" }}
                        onClick={() => handleSort("requestStatus")}
                      >
                        Request Status
                        {sortColumn === "requestStatus" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </StyledHeadTableCell>
                      <StyledHeadTableCell
                        sx={{ color: "white", cursor: "pointer", width: "15%" }}
                        onClick={() => handleSort("userStatus")}
                      >
                        User Status
                        {sortColumn === "userStatus" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </StyledHeadTableCell>
                      <StyledHeadTableCell
                        sx={{ color: "white", cursor: "pointer", width: "15%" }}
                        onClick={() => handleSort("tcAccountType")}
                      >
                        User Type
                        {sortColumn === "tcAccountType" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </StyledHeadTableCell>
                      <StyledHeadTableCell
                        sx={{ color: "white", cursor: "pointer", width: "15%" }}
                        onClick={() => handleSort("tcCreated")}
                      >
                        TC Created
                        {sortColumn === "tcCreated" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </StyledHeadTableCell>
                      <StyledHeadTableCell
                        sx={{ color: "white", cursor: "pointer", width: "15%" }}
                        onClick={() => handleSort("neverLock")}
                      >
                        Never Lock
                        {sortColumn === "neverLock" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </StyledHeadTableCell>
                    </StyledTableHeadRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.map((tcUser) => (
                      <StyledTableRow
                        key={tcUser.userHistoryId}
                        selected={selectedRow?.tcUserId === tcUser.tcUserId}
                        onClick={() => handleRowSelect(tcUser)}
                        sx={{ cursor: "pointer" }}
                      >
                        <StyledDataTableCell>
                          {tcUser?.userHistoryId}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {tcUser?.tcUserId}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {tcUser?.systemName}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {tcUser?.requestStatus}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {tcUser?.userStatus}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {tcUser?.tcAccountType}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {tcUser?.tcCreated ? "true" : "false"}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {" "}
                          {tcUser?.neverLock ? "true" : "false"}
                        </StyledDataTableCell>
                      </StyledTableRow>
                    ))}
                    <TablePaginationRow>
                      <TablePaginationCell colSpan={9}>
                        <StyledTablePagination
                          rowsPerPageOptions={[8, 16, 24]}
                          count={sortedData.length}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TablePaginationCell>
                    </TablePaginationRow>
                  </TableBody>
                </Table>

                <TcUserModal
                  handleAddNewItem={handleAddNewItem}
                  handleEditItem={handleEditItem}
                  handleDeleteItem={handleDeleteItem}
                  editItem={editItem}
                  onClose={handleClose}
                  open={open}
                  operation={operationType}
                  systemData={systemData}
                />
                <TcUserCustomModal
                  open={openImport}
                  onClose={() => setOpenImport(false)}
                  operation="add"
                  editItem={null}
                  handleAddNewItem={handleAddNewItem}
                  handleEditItem={handleEditItem}
                  handleProceed={(selectedSystem) =>
                    handleProceed(selectedSystem)
                  }
                />
              </Box>
            </StyledOpenSearchBox>
          </>
        )}
      </StyledOuterBox>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TcUserPage;
