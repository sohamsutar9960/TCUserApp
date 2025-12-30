import { Box, Grid, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import React, { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableHead, Paper, Button } from "@mui/material";
import { RoleResponse } from "../../../../models/roleModel";
import { SCDUser } from "../../../../models/ScdUserModel";
import TcScdUser from "../../../../services/ScdUserService";
import ScdUserCustomModal from "../../../atoms/common/modals/scdUserCustomModal";
import {
  StyledAddButton,
  StyledAddIcon,
  StyledBox,
  StyledButtonGrid,
  StyledCommonGrid,
  StyledDeleteButton,
  StyledDeleteIcon,
  StyledEditButton,
  StyledEditIcon,
  StyledGroupDataTableCell,
  StyledHeadTableCell,
  StyledHeaderBox,
  StyledOpenSearchBox,
  StyledOpenSearchGrid,
  StyledOuterBox,
  StyledRefreshButton,
  StyledSearchButton,
  StyledSearchIcon,
  StyledTableHeadRow,
  StyledTablePagination,
  StyledTableRow,
  StyledTextField,
  StyledTypography,
  TablePaginationCell,
  TablePaginationRow,
} from "../groupPage/styledComponent";

const ScdUserPage = () => {
  const [scdUsers, setScdUsers] = useState<SCDUser[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [editItem, setEditItem] = useState<SCDUser | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SCDUser | undefined>(
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
  const intialFields = {
    firstName: "",
    lastName: "",
    gid: "",
    displayName: "",
    email: "",
    lineManager: "",
    sponsor: "",
    department: "",
    organization: "",
    organizationId: "",
    country: "",
  };
  const [searchFields, setSearchFields] = useState(intialFields);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const sortedData = [...scdUsers].sort((a: any, b: any) => {
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

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch);
    if (!openSearch) {
      setSearchFields(intialFields);
    }
  };
  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };

  const handleResetSearch = () => {
    setSearchFields(intialFields);
    getScdUsers();
  };

  const handleOpen = (
    operation: "add" | "edit" | "delete",
    itemData?: RoleResponse,
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getScdUsers = async () => {
    try {
      const response = await TcScdUser.findAllScdUsers();
      if (response?.data) {
        setScdUsers(response?.data);
      }
    } catch (error) {
      console.error("Error fetching scdUser:", error);
    }
  };

  const searchScdUsers = async (searchFileds: SCDUser) => {
    try {
      const response = await TcScdUser.searchScdUser(searchFileds);
      if (response?.data) {
        setScdUsers(response?.data);
      }
    } catch (error) {
      console.error("Error fetching scdUser:", error);
    }
  };

  useEffect(() => {
    getScdUsers();
  }, []);

  const handleAddNewItem = async (scdUser: SCDUser) => {
    try {
      const response = await TcScdUser.createScdUser(scdUser);
      setScdUsers((prevData) => [...prevData, response.data]);
    } catch (error) {
      console.error("Error creating scdUser:", error);
    }
    handleClose();
  };

  const handleEditItem = async (editedItem: SCDUser) => {
    try {
      await TcScdUser.updateScdUser(editedItem);
      const updatedData = scdUsers.map((scdUser) =>
        scdUser.scdUserId === editedItem.scdUserId ? editedItem : scdUser,
      );
      setScdUsers(updatedData);
    } catch (error) {
      console.error("Error updating scdUser:", error);
    }
    handleClose();
  };
  const handleDeleteItem = async (id: number | undefined) => {
    if (id !== undefined) {
      try {
        await TcScdUser.deleteScdUser(id);
        const updatedData = scdUsers.filter(
          (scdUser) => scdUser.scdUserId !== id,
        );
        setScdUsers(updatedData);
        if ((scdUsers.length - 1) % rowsPerPage === 0 && page > 0) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Error deleting scdUser:", error);
      }
      handleClose();
    }
  };
  const handleRowSelect = (row: SCDUser) => {
    setSelectedRow(row);
  };

  return (
    <>
      <StyledOuterBox>
        <StyledHeaderBox>SCDUser Overview</StyledHeaderBox>
        <StyledOpenSearchBox m={2} pb={1} component={Paper}>
          {openSearch && (
            <StyledOpenSearchGrid container spacing={1.5}>
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
                        value={searchFields.firstName}
                        onChange={handleChange}
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
                        value={searchFields.lastName}
                        onChange={handleChange}
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
                        value={searchFields.gid}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Email
                      </StyledTypography>
                      <StyledTextField
                        name="email"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields.email}
                        onChange={handleChange}
                      />
                    </Grid>
                  </StyledCommonGrid>
                  <StyledButtonGrid
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
                          onClick={() => searchScdUsers(searchFields)}
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

          <Box sx={{ display: "flex", ml: 0.5 }} ref={buttonsRef}>
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
              <Tooltip title="Add">
                <span>
                  <StyledAddButton
                    variant="contained"
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
          <StyledBox sx={{ m: 1.5 }}>
            <Table sx={{ backgroundColor: "white" }} ref={tableRef}>
              <TableHead sx={{ backgroundColor: "#777", height: "40px" }}>
                <StyledTableHeadRow>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("firstName")}
                  >
                    FirstName
                    {sortColumn === "firstName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("lastName")}
                  >
                    LastName
                    {sortColumn === "lastName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  {/* <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("displayName")}
                  >
                    DisplayName
                    {sortColumn === "displayName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell> */}
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("gid")}
                  >
                    GID
                    {sortColumn === "gid" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("lineManager")}
                  >
                    LineManager
                    {sortColumn === "lineManager" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("sponser")}
                  >
                    Sponser
                    {sortColumn === "sponser" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("email")}
                  >
                    Email
                    {sortColumn === "email" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("email")}
                  >
                    Department
                    {sortColumn === "email" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("email")}
                  >
                    Organization
                    {sortColumn === "email" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("email")}
                  >
                    Country
                    {sortColumn === "email" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                </StyledTableHeadRow>
              </TableHead>
              <TableBody>
                {Array.isArray(paginatedData) &&
                  paginatedData.map((scdUser) => (
                    <StyledTableRow
                      key={scdUser?.scdUserId}
                      selected={selectedRow?.scdUserId === scdUser?.scdUserId}
                      onClick={() => handleRowSelect(scdUser)}
                      sx={{ cursor: "pointer" }}
                    >
                      <StyledGroupDataTableCell>
                        {scdUser?.firstName}
                      </StyledGroupDataTableCell>
                      <StyledGroupDataTableCell>
                        {scdUser?.lastName}
                      </StyledGroupDataTableCell>
                      {/* <StyledGroupDataTableCell>
                        {scdUser?.displayName}
                      </StyledGroupDataTableCell> */}
                      <StyledGroupDataTableCell>
                        {scdUser?.gid}
                      </StyledGroupDataTableCell>
                      <StyledGroupDataTableCell>
                        {scdUser?.lineManager}
                      </StyledGroupDataTableCell>
                      <StyledGroupDataTableCell>
                        {scdUser?.sponsor}
                      </StyledGroupDataTableCell>
                      <StyledGroupDataTableCell>
                        {scdUser?.email}
                      </StyledGroupDataTableCell>
                      <StyledGroupDataTableCell>
                        {scdUser?.department}
                      </StyledGroupDataTableCell>
                      <StyledGroupDataTableCell>
                        {scdUser?.organization}
                      </StyledGroupDataTableCell>
                      <StyledGroupDataTableCell>
                        {scdUser?.country}
                      </StyledGroupDataTableCell>
                    </StyledTableRow>
                  ))}

                <TablePaginationRow>
                  <TablePaginationCell colSpan={10}>
                    <StyledTablePagination
                      rowsPerPageOptions={[8, 16, 24]}
                      count={scdUsers.length}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TablePaginationCell>
                </TablePaginationRow>
              </TableBody>
            </Table>

            <ScdUserCustomModal
              open={open}
              onClose={handleClose}
              operation={operationType}
              handleAddNewItem={handleAddNewItem}
              handleEditItem={handleEditItem}
              editItem={editItem}
              handleDeleteItem={handleDeleteItem}
            />
          </StyledBox>
        </StyledOpenSearchBox>
      </StyledOuterBox>
    </>
  );
};

export default ScdUserPage;
