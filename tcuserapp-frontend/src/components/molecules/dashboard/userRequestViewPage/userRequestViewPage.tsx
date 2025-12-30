/* eslint-disable */
import { Box, Grid, MenuItem, SelectChangeEvent, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CachedIcon from "@mui/icons-material/Cached";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  Paper,
  Button,
} from "@mui/material";
import UserRequestViewModal from "../../../atoms/common/modals/UserRequestViewModal";
import UserRequest from "../../../../services/userRequestService";
import {
  StyledCommonGrid,
  StyledDataTableCell,
  StyledDropdownSecondGridInput,
  StyledHeadTableCell,
  StyledHeaderBox,
  StyledOpenSearchBox,
  StyledOpenSearchGrid,
  StyledOuterBox,
  StyledRefreshButton,
  StyledRefreshGrid,
  StyledSearchButton,
  StyledSearchIcon,
  StyledSecondGrid,
  StyledSecondGridTypography,
  StyledTableHeadRow,
  StyledTablePagination,
  StyledTableRow,
  StyledTextField,
  StyledTypography,
  StyledViewButton,
  StyledViewIcon,
  TablePaginationCell,
  TablePaginationRow,
} from "../groupPage/styledComponent";

interface AssignedRole {
  assignedRoleId: number;
  roleName: string;
  isAssigned: boolean;
  groupNamePath: string;
  groupName: string;
  deleted: boolean;
}
export interface SearchFields {
  requestId?: string | null;
  user?: {
    displayName?: string;
  } | null;
  userRequestForAnother?: {
    displayName?: string;
  } | null;
  system?: {
    systemName?: string;
  } | null;
  requestStatus?: string | null;
  requestLicensingLevel?: string | null;
}

export interface userRequest {
  userRequestForAnother: {
    displayName: string;
  };
  requestId: number;
  system: {
    systemName: string;
  };
  assignedRoles: AssignedRole[];
  createdBy: {
    displayName: string;
    gid: string;
  };
  userHistory: {
    tcAccountType: string;
    tcUserId: string;
  };
  service: {
    serviceName: string;
  };
  country: {
    countryName: string;
  };

  volume: {
    volumeName: string;
  };

  defaultGroup: string;
  commentsForApprover: string;
  cancellationComment: string;
  reasonForCancellation: string;
  tcOSUserName: string;
  groupRoleApproverComments: string | null;
  costApproverComments: string | null;
  costApproverDate: string | null;
  groupRoleApproverDate: string | null;
  creationDate: string;
  userRequest_TypeOfRequest: string;
  accountDeactivate: string | null;
  requestStatus: string | undefined;
  ipClearance: string;
  tcAccountType: string;
  neverLock: boolean;
  costManagerSelf: {
    displayName: string;
  };

  userRequestSelf: {
    displayName: string;
  };
}

const UserRequestViewPage = () => {
  const [userRequest, setUserRequest] = useState<userRequest[]>([]);
  const [viewDetatils, setViewDeatils] = useState<userRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleName, setRoleName] = useState("");
  const [uid, setUID] = useState("");
  const [groupName, setGroupName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<
    "view" | "edit" | "delete"
  >("view");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<userRequest | undefined>();

  const [searchFields, setSearchFields] = useState<SearchFields>({
    requestId: "",
    user: {
      displayName: "",
    },
    userRequestForAnother: {
      displayName: "",
    },
    system: {
      systemName: "",
    },
    requestStatus: "",
  });

  const [request, setRequest] = useState([
    { requestType: "Request Created", requestStatus: "Request_Created" },
    { requestType: "Request Cancelled", requestStatus: "Request_Cancelled" },
    {
      requestType: "Approved By Cost Manager",
      requestStatus: "Approved_By_Cost_Manager",
    },
    {
      requestType: "Rejected By Cost Manager",
      requestStatus: "Rejected_By_Cost_Manager",
    },
    {
      requestType: "Approved By GroupRole Approver",
      requestStatus: "Approved_By_GroupRole_Approver",
    },
    {
      requestType: "Rejected By GroupRole Approver",
      requestStatus: "Rejected_By_GroupRole_Approver",
    },
    {
      requestType: "Exported To Target System",
      requestStatus: "Exported_To_Target_System",
    },
  ]);

  const handleInputSystemChange = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target;
    setSearchFields((prevData) => ({
      ...prevData,
      [name]: value as string,
    }));
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setSearchFields((prevFields) => {
      if (name === "systemName") {
        return {
          ...prevFields,
          system: {
            ...prevFields.system,
            [name]: value,
          },
        };
      } else if (name === "userRequestForAnother") {
        return {
          ...prevFields,
          userRequestForAnother: {
            ...prevFields.userRequestForAnother,
            displayName: value,
          },
        };
      } else if (name === "user") {
        return {
          ...prevFields,
          user: {
            ...prevFields.user,
            displayName: value,
          },
        };
      } else {
        return {
          ...prevFields,
          [name]: value,
        };
      }
    });
  };

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch);
    if (!openSearch) {
      setRoleName("");
      setUID("");
      setGroupName("");
      setSearchTerm("");
    }
  };
  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };

  const sortedData = [...userRequest].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;

    switch (sortColumn) {
      case "requestId":
        aValue = a.requestId;
        bValue = b.requestId;
        break;
      case "requestStatus":
        aValue = a.requestStatus;
        bValue = b.requestStatus;
        break;
      case "userRequest_TypeOfRequest":
        aValue = a.userRequest_TypeOfRequest;
        bValue = b.userRequest_TypeOfRequest;
        break;
      case "systemName":
        aValue = a.system.systemName;
        bValue = b.system.systemName;
        break;
      case "displayName":
        aValue = a.createdBy.displayName;
        bValue = b.createdBy.displayName;
        break;
      case "createdDate":
        aValue = new Date(a.creationDate);
        bValue = new Date(b.creationDate);
        break;
      default:
        return 0;
    }

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });

  const handleSearch = async (searchFields: SearchFields) => {
    try {
      const searchParams = { ...searchFields };

      // Set createdBy, requestedFor, and system to null if they are empty
      if (!searchParams.user?.displayName) {
        searchParams.user = null;
      }
      if (!searchParams.userRequestForAnother?.displayName) {
        searchParams.userRequestForAnother = null;
      }
      if (!searchParams.system?.systemName) {
        searchParams.system = null;
      }
      if (!searchParams.requestStatus) {
        delete searchParams.requestStatus;
      }

      const response = await UserRequest.userRequestSearch(searchParams);
      if (response.data) {
        setUserRequest(response.data);
      }
    } catch (error) {
      console.error("Error fetching GroupRoleApprovers:", error);
    }
  };

  const handleResetSearch = async () => {
    setSearchFields({
      requestId: "",
      user: {
        displayName: "",
      },
      userRequestForAnother: {
        displayName: "",
      },
      system: {
        systemName: "",
      },
      requestStatus: "",
    });
    await getUserRequestData();
  };

  const handleOpen = async (operation: "edit" | "view" | "delete") => {
    const requestedId = selectedRow?.requestId;

    if (requestedId !== undefined) {
      const response = await UserRequest.getRequestById(requestedId);
      setViewDeatils(response?.data);
      setOperationType(operation);
      setOpen(true);
    } else {
      console.error("No row selected");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(undefined);
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

  const getUserRequestData = async () => {
    const response = await UserRequest.allUserRequest();
    if (response) setUserRequest(response?.data);
  };

  useEffect(() => {
    getUserRequestData();
  }, []);

  const handleRowSelect = (row: userRequest) => {
    setSelectedRow(row);
  };

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <StyledOuterBox>
        <StyledHeaderBox>User Request</StyledHeaderBox>
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
                        Requested Id
                      </StyledTypography>
                      <StyledTextField
                        name="requestId"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields.requestId}
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
                        Created By
                      </StyledTypography>
                      <StyledTextField
                        name="user"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields.user?.displayName}
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
                        Requested For
                      </StyledTypography>
                      <StyledTextField
                        name="userRequestForAnother"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields.userRequestForAnother?.displayName}
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
                        System Name
                      </StyledTypography>
                      <StyledTextField
                        name="systemName"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields.system?.systemName}
                        onChange={handleSearchChange}
                      />
                    </Grid>
                  </Grid>
                  <StyledRefreshGrid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    mt={4.2}
                    sx={{ textAlign: "end", pr: 1.5 }}
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
                          onClick={() => handleSearch(searchFields)}
                        >
                          <SearchIcon sx={{ color: "white" }} />
                        </Button>
                      </span>
                    </Tooltip>
                  </StyledRefreshGrid>
                </StyledCommonGrid>
              </StyledCommonGrid>
            </StyledOpenSearchGrid>
          )}

          {openSearch && (
            <StyledOpenSearchGrid container spacing={0.5}>
              <StyledCommonGrid item xs={12}>
                <StyledCommonGrid
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    ml: 1,
                  }}
                >
                  <StyledSecondGrid container spacing={1.5}>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledSecondGridTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Request Status
                      </StyledSecondGridTypography>
                      <StyledDropdownSecondGridInput
                        fullWidth
                        value={searchFields?.requestStatus ?? undefined}
                        variant="outlined"
                        name="requestStatus"
                        onChange={handleInputSystemChange}
                      >
                        {Array.isArray(request) &&
                          request?.map((req) => (
                            <MenuItem
                              key={req.requestType}
                              value={req.requestStatus}
                            >
                              {req.requestType}
                            </MenuItem>
                          ))}
                      </StyledDropdownSecondGridInput>
                    </Grid>
                  </StyledSecondGrid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    mt={4.2}
                    display="flex"
                    justifyContent="space-evenly"
                  ></Grid>
                </StyledCommonGrid>
              </StyledCommonGrid>
            </StyledOpenSearchGrid>
          )}

          <Box sx={{ display: "flex", ml: 0.5 }}>
            <Box mt={2} mb={1} px={1}>
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
            <Box mt={2} mb={1}>
              <Tooltip title="View">
                <span>
                  <StyledViewButton
                    variant="contained"
                    color="success"
                    onClick={() => handleOpen("view")}
                    disabled={!selectedRow}
                  >
                    <StyledViewIcon>
                      <VisibilityIcon fontSize="medium" />
                    </StyledViewIcon>
                  </StyledViewButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ m: 1.5 }}>
            <Table sx={{ backgroundColor: "white" }}>
              <TableHead sx={{ backgroundColor: "#777", height: "40px" }}>
                <StyledTableHeadRow>
                  <TableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "5%",
                      padding: "10px",
                    }}
                    onClick={() => handleSort("requestId")}
                  >
                    Request ID
                    {sortColumn === "requestId" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </TableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("systemName")}
                  >
                    System Name
                    {sortColumn === "systemName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("createdBy")}
                  >
                    Created By
                    {sortColumn === "createdBy" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("userRequestForAnother")}
                  >
                    Requsted For
                    {sortColumn === "userRequestForAnother" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("requestStatus")}
                  >
                    Status
                    {sortColumn === "requestStatus" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "5%",
                    }}
                    onClick={() => handleSort("date")}
                  >
                    Date
                    {sortColumn === "date" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </TableCell>
                </StyledTableHeadRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((request) => (
                  <StyledTableRow
                    key={request.requestId}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleRowSelect(request)}
                  >
                    <StyledDataTableCell>
                      {request.requestId}
                    </StyledDataTableCell>
                    <StyledDataTableCell>
                      {request.system.systemName}
                    </StyledDataTableCell>
                    <StyledDataTableCell>
                      {request.createdBy?.displayName}
                    </StyledDataTableCell>
                    <StyledDataTableCell>
                      {request?.userRequestSelf
                        ? request?.createdBy.displayName
                        : request?.userRequestForAnother.displayName}
                    </StyledDataTableCell>
                    {/* <StyledDataTableCell>{request.requestStatus?.replace(/_/g, ' ')}</StyledDataTableCell> */}
                    <StyledDataTableCell>
                      {request.requestStatus?.replace(/_/g, " ")}
                    </StyledDataTableCell>
                    <StyledDataTableCell>
                      {request.creationDate ?? "-"}
                    </StyledDataTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
              <TablePaginationRow>
                <TablePaginationCell colSpan={7}>
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
            </Table>

            <UserRequestViewModal
              open={open}
              onClose={handleClose}
              operation={operationType}
              viewDetails={viewDetatils}
            />
          </Box>
        </StyledOpenSearchBox>
      </StyledOuterBox>
    </>
  );
};

export default UserRequestViewPage;
