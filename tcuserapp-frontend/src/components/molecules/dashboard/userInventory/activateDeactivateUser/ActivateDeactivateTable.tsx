/* eslint-disable */
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Tooltip,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CachedIcon from "@mui/icons-material/Cached";
import { useState, useRef, useEffect } from "react";
import {
  StyledOuterBox,
  StyledHeaderBox,
  StyledOpenSearchBox,
  StyledOpenSearchGrid,
  StyledCommonGrid,
  StyledTypography,
  StyledTextField,
  StyledRefreshButton,
  StyledSearchButton,
  StyledSearchIcon,
  StyledTableHeadRow,
  StyledHeadTableCell,
  StyledTableRow,
  StyledDataTableCell,
  StyledTablePagination,
  TablePaginationCell,
  TablePaginationRow,
  StyledDropdownGridInput,
} from "../../groupPage/styledComponent";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import BlockIcon from "@mui/icons-material/Block";

interface UserData {
  userId: string;
  personName: string;
  status: number;
  lastLoginDate: string;
}
interface StatusState {
  status?: string;
}
interface ActivateDeactivateTableProps {
  userData: {
    userId: string;
    personName: string;
    status: number;
    lastLoginDate: string;
  }[];
  systemId: number;
  handleActionButton: (
    systemId: number,
    UserId: string,
    status: number,
  ) => void;
  successMessage: string | null;
  onClose: () => void;
}

const ActivateDeactivateTable: React.FC<ActivateDeactivateTableProps> = ({
  userData,
  systemId,
  handleActionButton,
  successMessage,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [loginName, setLoginName] = useState<string>("");
  const [contactDisplay, setContactDisplay] = useState<string>("");
  const [status, setStatus] = useState<StatusState>({});
  const [filteredData, setFilteredData] = useState<UserData[]>(userData);

  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UserData | undefined>(
    undefined,
  );
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
  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
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
    setRowsPerPage(parseInt(event.target.value, 8));
    setPage(0);
  };

  const sortedData = [...userData].sort((a: any, b: any) => {
    const aValue = sortColumn ? a[sortColumn] : null;
    const bValue = sortColumn ? b[sortColumn] : null;

    return sortDirection === "asc"
      ? aValue?.localeCompare(bValue)
      : bValue?.localeCompare(aValue);
  });
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleSearch = () => {
    const filtered = userData.filter((user) => {
      const matchLoginName =
        loginName.trim() === "" ||
        user.userId.toLowerCase().includes(loginName.trim().toLowerCase());
      const matchContactDisplay =
        contactDisplay.trim() === "" ||
        user.personName
          .toLowerCase()
          .includes(contactDisplay.trim().toLowerCase());
      const matchStatus =
        status.status === undefined || user.status === parseInt(status.status);

      return matchLoginName && matchContactDisplay && matchStatus;
    });

    setFilteredData(filtered);
    setPage(0);
  };

  const handleReset = () => {
    setLoginName("");
    setContactDisplay("");
    setStatus({ status: "" });
    setSearchTerm("");
    setFilteredData(userData);
  };
  const handleUserStatus = (event: SelectChangeEvent<unknown>) => {
    const { value } = event.target;
    setStatus((prevData) => ({
      ...prevData,
      status: value as string,
    }));
  };
  const handleStatusToggle = (userId: string, currentStatus: number) => {
    const newStatus = currentStatus === 0 ? 1 : 0;
    handleActionButton(systemId, userId, newStatus);
  };

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch);
    if (!openSearch) {
      handleReset();
    }
  };

  const handleRowSelect = (row: UserData) => {
    setSelectedRow(row);
  };
  return (
    <>
      <StyledOuterBox>
        <StyledHeaderBox className="card-header">
          Activate/Deactivate
        </StyledHeaderBox>
        <StyledOpenSearchBox m={2} pb={1} component={Paper}>
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
                        Login Name
                      </StyledTypography>
                      <StyledTextField
                        fullWidth
                        id="loginName"
                        variant="outlined"
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Contact Display
                      </StyledTypography>
                      <StyledTextField
                        fullWidth
                        id="contactDisplay"
                        variant="outlined"
                        value={contactDisplay}
                        onChange={(e) => setContactDisplay(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Status
                      </StyledTypography>
                      <StyledDropdownGridInput
                        sx={{ padding: "3.5px 0px" }}
                        fullWidth
                        id="status"
                        value={status.status || ""}
                        onChange={handleUserStatus}
                        variant="outlined"
                      >
                        <MenuItem value="0">Active</MenuItem>
                        <MenuItem value="1">Inactive</MenuItem>
                      </StyledDropdownGridInput>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ textAlign: "end", pr: 1.5 }}
                  >
                    <Tooltip title="Refresh">
                      <span>
                        <StyledRefreshButton
                          variant="contained"
                          size="small"
                          onClick={handleReset}
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
                          onClick={handleSearch}
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
                  </Grid>
                </StyledCommonGrid>
              </StyledCommonGrid>
            </StyledOpenSearchGrid>
          )}
          <Box sx={{ display: "flex", ml: 0.5 }} ref={buttonsRef}>
            <Box mt={2} px={1}>
              <Tooltip title="Search">
                <span>
                  <StyledSearchButton
                    variant="contained"
                    color="primary"
                    onClick={handleToggleSearch}
                  >
                    <StyledSearchIcon sx={{ p: 0 }}>
                      <SearchIcon fontSize="medium" />
                    </StyledSearchIcon>
                  </StyledSearchButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ m: 1.5 }}>
            <Table sx={{ backgroundColor: "white" }} ref={tableRef}>
              <TableHead sx={{ backgroundColor: "#777", height: "40px" }}>
                <StyledTableHeadRow>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer" }}
                    onClick={() => handleSort("configName")}
                  >
                    Login Name
                    {sortColumn === "configName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("tcURL")}
                  >
                    Contact Display
                    {sortColumn === "tcURL" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("fmsURL")}
                  >
                    LastLoginDate
                    {sortColumn === "fmsURL" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("ssoEnabled")}
                  >
                    Status
                    {sortColumn === "ssoEnabled" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <TableCell sx={{ width: "0%", color: "white" }}>
                    Actions
                  </TableCell>
                </StyledTableHeadRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((tcUser) => (
                  <StyledTableRow
                    key={tcUser.userId}
                    selected={selectedRow?.userId === tcUser.userId}
                    onClick={() => handleRowSelect(tcUser)}
                    sx={{ cursor: "pointer" }}
                  >
                    <StyledDataTableCell>{tcUser?.userId}</StyledDataTableCell>
                    <StyledDataTableCell>
                      {tcUser?.personName}
                    </StyledDataTableCell>
                    <StyledDataTableCell>
                      {tcUser?.lastLoginDate}
                    </StyledDataTableCell>
                    <StyledDataTableCell>
                      {tcUser.status === 0 ? "Active" : "Inactive"}
                    </StyledDataTableCell>
                    <StyledDataTableCell>
                      <Button
                        onClick={() =>
                          handleStatusToggle(tcUser.userId, tcUser.status)
                        }
                      >
                        {tcUser.status === 0 ? (
                          <Tooltip title="Deactivate">
                            <span>
                              <IconButton sx={{ p: 0 }}>
                                <BlockIcon fontSize="medium" color="error" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Activate">
                            <span>
                              <IconButton sx={{ p: 0 }}>
                                <HowToRegIcon fontSize="medium" color="info" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </Button>
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
          </Box>
        </StyledOpenSearchBox>
      </StyledOuterBox>
      {successMessage && (
        <Snackbar
          open
          autoHideDuration={6000}
          onClose={onClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity="success" onClose={onClose}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default ActivateDeactivateTable;
