import { Alert, Box, Grid, Snackbar, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableHead, Paper, Button } from "@mui/material";
import Role, { RoleResponse } from "../../../../models/roleModel";
import { GroupResponse } from "../../../../models/groupModel";
import TcRole from "../../../../services/roleService";
import TcGroup from "../../../../services/groupService";
import RoleCustomModal from "../../../atoms/common/modals/roleCustomModal";
import TcSystem from "../../../../services/SystemService";
import { SystemResponse } from "../systemPage";
import axios from "axios";
import {
  StyledCommonGrid,
  StyledDataTableCell,
  StyledHeadTableCell,
  StyledHeaderBox,
  StyledOpenSearchBox,
  StyledOuterBox,
  StyledTableHeadRow,
  StyledTablePagination,
  StyledTableRow,
  StyledTextField,
  StyledTypography,
  StyledButtonGrid,
  StyledRefreshButton,
  StyledSearchButton,
  StyledSearchIcon,
  StyledAddIcon,
  StyledAddButton,
  StyledEditButton,
  StyledEditIcon,
  StyledDeleteButton,
  StyledDeleteIcon,
  TablePaginationRow,
  TablePaginationCell,
} from "../groupPage/styledComponent";
const RolePage = () => {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [groupsData, setGroupsData] = useState<GroupResponse[]>([]);
  const [systemsData, setSystemsData] = useState<SystemResponse[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [editItem, setEditItem] = useState<RoleResponse | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RoleResponse | undefined>(
    undefined,
  );
  const [searchFields, setSearchFields] = useState({
    roleName: "",
    groupName: "",
    systemName: "",
  });

  const [duplicateEntityError, setDuplicateEntityError] = useState("");

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
  const handleRoleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSearchFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch);
    if (!openSearch) {
      setSearchFields({
        roleName: "",
        groupName: "",
        systemName: "",
      });
    }
  };
  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };

  const sortedData = [...roles].sort((a: any, b: any) => {
    const aValue = sortColumn ? a[sortColumn] : null;
    const bValue = sortColumn ? b[sortColumn] : null;

    return sortDirection === "asc"
      ? aValue?.localeCompare(bValue)
      : bValue?.localeCompare(aValue);
  });

  const handleSearch = async (searchFields: Role) => {
    try {
      const searchParams = {
        roleName: searchFields.roleName || undefined,
        group: {
          groupName: searchFields.groupName || undefined,
        },
        system: {
          systemName: searchFields?.systemName || undefined,
        },
      };

      const response = await TcRole.searchRole(searchParams);

      if (response.data) {
        setRoles(response.data);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleResetSearch = () => {
    setSearchFields({
      roleName: "",
      groupName: "",
      systemName: "",
    });
  };

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleOpen = (
    operation: "edit" | "add" | "delete",
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

  const getRoles = async () => {
    try {
      const response = await TcRole.findAllRoles();
      setRoles(response?.data);
    } catch (error) {
      console.error("Error fetching systems:", error);
    }
  };

  const getGroupsData = async () => {
    const response = await TcGroup.findAllGroups();
    if (response) setGroupsData(response?.data);
  };

  const getSystemsData = async () => {
    const response = await TcSystem.findAllSystems();
    if (response) setSystemsData(response?.data);
  };

  useEffect(() => {
    getRoles();
    getGroupsData();
    getSystemsData();
  }, []);
  useEffect(() => {
    getRoles();
  }, [searchFields]);

  const handleAddNewItem = async (roleData: RoleResponse) => {
    const {
      roleName,
      uid,
      description,
      displayName,
      assigned,
      status,
      groupId,
      systemId,
      systemName,
      groupName,
    } = roleData;

    const newRole: Role = {
      roleName: roleName,
      uid: uid,
      description: description,
      displayName: displayName,
      isAssigned: assigned,
      status: status,
      group: {
        groupId: groupId,
        groupName: groupName,
      },
      system: {
        systemId: systemId,
        systemName: systemName,
      },
    };

    try {
      const response = await TcRole.createRole(newRole);

      setRoles((prevData) => [...prevData, response.data]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          setDuplicateEntityError(error.response.data.message);
        }
        console.error("Error creating Role:", error);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
    handleClose();
  };

  const handleEditItem = async (editedItem: RoleResponse) => {
    const {
      roleId,
      roleName,
      uid,
      description,
      displayName,
      assigned,
      status,
      groupId,
      systemId,
      systemName,
      groupName,
    } = editedItem;
    const editedRole: Role = {
      roleId: roleId,
      roleName: roleName,
      uid: uid,
      description: description,
      displayName: displayName,
      isAssigned: assigned,
      status: status,
      group: {
        groupId: groupId,
        groupName: groupName,
      },
      system: {
        systemId: systemId,
        systemName: systemName,
      },
    };
    try {
      // @ts-ignore
      await TcRole.updateRole(editedRole);
      const updatedData = roles.map((item) =>
        item.roleId === editedItem.roleId ? editedItem : item,
      );
      setRoles(updatedData);
    } catch (error) {
      console.error("Error updating service:", error);
    }
    handleClose();
  };
  const handleDeleteItem = async (id: number | undefined) => {
    if (id !== undefined) {
      try {
        await TcRole.deleteRole(id);
        const updatedData = roles.filter((item) => item.roleId !== id);
        setRoles(updatedData);
        if ((roles.length - 1) % rowsPerPage === 0 && page > 0) {
          setPage(page - 1);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 409) {
            setDuplicateEntityError(error.response.data.message);
          }
          console.error("Error creating Role:", error);
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
      handleClose();
    }
  };
  const handleRowSelect = (row: RoleResponse) => {
    setSelectedRow(row);
  };
  return (
    <>
      <StyledOuterBox>
        <StyledHeaderBox className="card-header">Role Overview</StyledHeaderBox>
        <StyledOpenSearchBox m={2} pb={2} component={Paper}>
          {openSearch && (
            <StyledCommonGrid
              container
              spacing={1.5}
              borderBottom="1px solid #E0E0E0"
              pb={2}
            >
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    ml: 1,
                  }}
                >
                  <Grid container spacing={1.5} mt={0.5}>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Role Name
                      </StyledTypography>
                      <StyledTextField
                        name="roleName"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields.roleName}
                        onChange={handleRoleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Group Name
                      </StyledTypography>
                      <StyledTextField
                        name="groupName"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields?.groupName}
                        onChange={handleRoleChange}
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
                        value={searchFields?.systemName}
                        onChange={handleRoleChange}
                      />
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
                  </StyledButtonGrid>
                </Box>
              </Grid>
            </StyledCommonGrid>
          )}
          <Box sx={{ display: "flex", ml: 0.5 }} ref={buttonsRef}>
            <Box mt={2} mb={1}>
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

            <Box mt={2} mb={1} px={1}>
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
          <Box sx={{ m: 1.5 }}>
            <Table sx={{ backgroundColor: "white" }} ref={tableRef}>
              <TableHead sx={{ backgroundColor: "#777", height: "40px" }}>
                <StyledTableHeadRow>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("roleName")}
                  >
                    Role Name
                    {sortColumn === "roleName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("displayName")}
                  >
                    Display Name
                    {sortColumn === "displayName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>

                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("groupName")}
                  >
                    Group Name
                    {sortColumn === "groupName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
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
                    onClick={() => handleSort("description")}
                  >
                    Description
                    {sortColumn === "description" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                </StyledTableHeadRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((role) => (
                  <StyledTableRow
                    key={role?.roleId}
                    selected={selectedRow?.roleId === role.roleId}
                    onClick={() => handleRowSelect(role)}
                    sx={{ cursor: "pointer" }}
                  >
                    <StyledDataTableCell>{role.roleName}</StyledDataTableCell>
                    <StyledDataTableCell>
                      {role.displayName}
                    </StyledDataTableCell>
                    <StyledDataTableCell>{role.groupName}</StyledDataTableCell>
                    <StyledDataTableCell>
                      {role?.systemName}
                    </StyledDataTableCell>
                    <StyledDataTableCell>
                      {role.description}
                    </StyledDataTableCell>
                  </StyledTableRow>
                ))}

                <TablePaginationRow>
                  <TablePaginationCell colSpan={6}>
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

            <RoleCustomModal
              open={open}
              onClose={handleClose}
              operation={operationType}
              handleAddNewItem={handleAddNewItem}
              handleEditItem={handleEditItem}
              editItem={editItem}
              handleDeleteItem={handleDeleteItem}
              groupsData={groupsData}
              systemsData={systemsData}
            />
          </Box>
        </StyledOpenSearchBox>
      </StyledOuterBox>
      {duplicateEntityError && (
        <Snackbar
          autoHideDuration={6000}
          onClose={() => setDuplicateEntityError("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setDuplicateEntityError("")} severity="error">
            {duplicateEntityError}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default RolePage;
