import { Alert, Backdrop, Box, Grid, Snackbar, Tooltip } from "@mui/material";
import { CircularProgress } from "@mui/material";
import {
  StyledCommonGrid,
  StyledHeadTableCell,
  StyledHeaderBox,
  StyledOpenSearchBox,
  StyledOpenSearchGrid,
  StyledOuterBox,
  StyledTableHeadRow,
  StyledTablePagination,
  StyledTableRow,
  TablePaginationCell,
  TablePaginationRow,
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
  StyledImportButton,
  StyledImportIcon,
  StyledBox,
  StyledGroupDataTableCell,
} from "./styledComponent";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  Paper,
  Button,
} from "@mui/material";
import { SystemResponse } from "../systemPage";
import Group, { GroupResponse } from "../../../../models/groupModel";
import TcGroup from "../../../../services/groupService";
import TcSystem from "../../../../services/SystemService";
import GroupCustomModal from "../../../atoms/common/modals/GroupCustomModal";
import axios from "axios";
export interface SearchFields {
  groupName: string;
  uid: string;
  system: {
    systemName: string;
  };
}

const GroupPage = () => {
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [systemsData, setSystemData] = useState<SystemResponse[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<
    "add" | "edit" | "delete" | "import"
  >("add");
  const [editItem, setEditItem] = useState<GroupResponse | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<GroupResponse | undefined>(
    undefined,
  );
  const [isEnabled, setIsEnabled] = useState(false);
  const [searchFields, setSearchFields] = useState<SearchFields>({
    groupName: "",
    uid: "",
    system: {
      systemName: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleGroupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSearchFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSystemNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setSearchFields((prevFields) => ({
      ...prevFields,
      system: {
        ...prevFields.system,
        systemName: value,
      },
    }));
  };

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch);
    if (!openSearch) {
      setSearchFields({
        groupName: "",
        uid: "",
        system: {
          systemName: "",
        },
      });
    }
  };
  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };

  const sortedData = [...groups].sort((a: any, b: any) => {
    const aValue = sortColumn ? a[sortColumn] : null;
    const bValue = sortColumn ? b[sortColumn] : null;

    return sortDirection === "asc"
      ? aValue?.localeCompare(bValue)
      : bValue?.localeCompare(aValue);
  });

  const handleSearch = async (searchFields: SearchFields) => {
    try {
      const response = await TcGroup.searchGroup(searchFields);
      if (response.data) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error("Error fetching GroupRoleApprovers:", error);
    }
  };

  const handleResetSearch = () => {
    setSearchFields({
      groupName: "",
      uid: "",
      system: {
        systemName: "",
      },
    });
    getGroups();
  };

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleOpen = (
    operation: "edit" | "add" | "delete" | "import",
    itemData?: GroupResponse,
  ) => {
    setOperationType(operation);
    setEditItem(itemData || null);
    setIsEnabled(true);
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
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const getGroups = async () => {
    try {
      const response = await TcGroup.findAllGroups();
      setGroups(response?.data);
    } catch (error) {
      console.error("Error fetching Groups:", error);
    }
  };
  const getSystemData = async () => {
    try {
      const response = await TcSystem.findAllSystems();
      setSystemData(response.data);
    } catch (error) {
      console.error("Error fetching systems:", Error);
    }
  };

  useEffect(() => {
    getGroups();
    getSystemData();
  }, []);

  const handleAddNewItem = async (NewItem: GroupResponse) => {
    const newGroup: Group = {
      groupName: NewItem.groupName,
      uid: NewItem.uid,
      isRoot: NewItem.root,
      description: NewItem.description,
      displayName: NewItem.displayName,
      system: {
        systemId: NewItem.systemId,
      },
      parentGroup: {
        groupId: NewItem.parentGroupId,
      },
      groupNamePath: NewItem?.groupNamePath,
      level: NewItem?.level,
    };
    try {
      const response = await TcGroup.createGroup(newGroup);

      setGroups((prevData) => [...prevData, response.data]);
    } catch (error) {
      console.error("Error creating group:", error);
    }

    handleClose();
  };

  const handleEditItem = async (editedItem: GroupResponse) => {
    const newGroup: Group = {
      groupId: editedItem.groupId,
      groupName: editedItem.groupName,
      uid: editedItem.uid,
      isRoot: editedItem.root,
      description: editedItem.description,
      displayName: editedItem.displayName,
      system: {
        systemId: editedItem.systemId,
      },
      parentGroup: {
        groupId: editedItem.parentGroupId,
      },
      groupNamePath: editedItem?.groupNamePath,
      level: editedItem?.level,
    };
    try {
      const response = await TcGroup.updateGroup(newGroup);
      const updatedData = groups.map((item) =>
        item.groupId === editedItem.groupId ? response.data : item,
      );
      setGroups(updatedData);
    } catch (error) {
      console.error("Error updating service:", error);
    }
    handleClose();
  };

  const handleDeleteItem = async (id: number | undefined) => {
    if (id !== undefined) {
      try {
        await TcGroup.deleteGroup(id);
        const updatedData = groups.filter((item) => item.groupId !== id);
        setGroups(updatedData);
        if ((groups.length - 1) % rowsPerPage === 0 && page > 0) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
      handleClose();
    }
  };

  const importGroups = async (
    groupName: string | undefined,
    systemId: number,
  ) => {
    setLoading(true);
    try {
      const response = await TcGroup.importGroups(groupName, systemId);
      setGroups((prevData) => [...prevData, response.data]);
      getGroups();
      setSuccessMessage("Groups imported successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status !== 201) {
          const message = error.response && error.response.data.message;
          setErrorMessage(message);
        }
      }

      console.error("Error importing groups:", error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };
  const handleRowSelect = (row: GroupResponse) => {
    setSelectedRow(row);
  };

  return (
    <>
      <StyledOuterBox>
        <StyledHeaderBox>Group Overview</StyledHeaderBox>

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
                        Group Name
                      </StyledTypography>
                      <StyledTextField
                        name="groupName"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields?.groupName}
                        onChange={handleGroupChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        UID
                      </StyledTypography>
                      <StyledTextField
                        name="uid"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={searchFields?.uid}
                        onChange={handleGroupChange}
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
                        value={searchFields?.system?.systemName}
                        onChange={handleSystemNameChange}
                      />
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
                  </StyledCommonGrid>
                </Box>
              </StyledCommonGrid>
            </StyledOpenSearchGrid>
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

            <Box mt={2} mb={1}>
              <Tooltip title="Import Group">
                <span>
                  <StyledImportButton
                    variant="contained"
                    onClick={() => handleOpen("import")}
                  >
                    <StyledImportIcon>
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
          <StyledBox sx={{ m: 1.5 }} ref={tableRef}>
            <Table
              sx={{
                backgroundColor: "white",
              }}
            >
              <TableHead sx={{ backgroundColor: "#777", height: "40px" }}>
                <StyledTableHeadRow>
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
                  <TableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("groupNamePath")}
                  >
                    Group Path
                    {sortColumn === "groupNamePath" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </TableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("level")}
                  >
                    Parent Group
                    {sortColumn === "ParentGroupName" && (
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
                  >
                    Root
                  </StyledHeadTableCell>
                </StyledTableHeadRow>
              </TableHead>

              <TableBody>
                {!loading ? (
                  <>
                    {paginatedData.map((group) => (
                      <StyledTableRow
                        key={group?.groupId}
                        selected={selectedRow?.groupId === group.groupId}
                        onClick={() => handleRowSelect(group)}
                        sx={{ cursor: "pointer" }}
                      >
                        <StyledGroupDataTableCell>
                          {group.groupName}
                        </StyledGroupDataTableCell>
                        <StyledGroupDataTableCell>
                          {group.groupNamePath}
                        </StyledGroupDataTableCell>
                        <StyledGroupDataTableCell>
                          {group.parentGroupName}
                        </StyledGroupDataTableCell>
                        <StyledGroupDataTableCell>
                          {group.systemName}
                        </StyledGroupDataTableCell>
                        <StyledGroupDataTableCell>
                          {group?.root ? "Yes" : "No"}
                        </StyledGroupDataTableCell>
                      </StyledTableRow>
                    ))}
                    <TablePaginationRow>
                      <TablePaginationCell colSpan={9}>
                        <StyledTablePagination
                          rowsPerPageOptions={[5, 10, 20]}
                          count={sortedData.length}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TablePaginationCell>
                    </TablePaginationRow>
                  </>
                ) : (
                  <Backdrop
                    sx={{
                      color: "#fff",
                      zIndex: 1301,
                    }}
                    open={loading}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                )}
              </TableBody>
            </Table>
            <GroupCustomModal
              open={open}
              onClose={handleClose}
              operation={operationType}
              handleAddNewItem={handleAddNewItem}
              handleEditItem={handleEditItem}
              editItem={editItem}
              handleDeleteItem={handleDeleteItem}
              systemsData={systemsData}
              groupsData={groups}
              importGroups={importGroups}
            />
          </StyledBox>
        </StyledOpenSearchBox>
      </StyledOuterBox>
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={() => {
          setSuccessMessage(null);
          setErrorMessage(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={successMessage ? "success" : "error"}
          onClose={() => {
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GroupPage;
