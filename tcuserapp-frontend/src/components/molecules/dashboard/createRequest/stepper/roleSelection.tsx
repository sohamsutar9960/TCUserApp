import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  FormControlLabel,
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import TcGroup from "../../../../../services/groupService";
import "./roleSelection.scss";
import { Backdrop, CircularProgress } from "@mui/material";
import Popup from "./popup";
import { Snackbar, Alert } from "@mui/material";
import {
  StyledDataTableCell,
  StyledHeadTableCell,
  StyledTableHeadRow,
  StyledTableRow,
} from "../../groupPage/styledComponent";
import {
  RemoveCircleOutline as RemoveCircleOutlineIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
interface RoleSelectionProps {
  updateUserRequest: (data: Partial<{ roleSelection: [] }>) => void;
  dataChangeForRoleSelection: (data1: any, data2: any, data3: any) => void;
  userRequest: any;
  allPageData: any;
}

interface RoleResponse {
  roleId: number;
  roleName: string;
  groupNamePath: string;
  groupId: number;
  groupName: string;
  systemId: number;
  systemName: string;
  uid: string;
  description: string;
  displayName: string;
  status: string;
  assigned: boolean;
}
interface Group {
  groupId: number;
  groupName: string;
  groupNamePath: string;
  uid: string;
  description: string;
  displayName: string;
  level: number;
  systemId: number;
  systemName: string;
  parentGroupId: number | null;
  parentGroupName: string | null;
  roleResponses: RoleResponse[];
  root: boolean;
  children?: Group[];
}

const RoleSelection = ({
  dataChangeForRoleSelection,
  userRequest,
  allPageData,
}: RoleSelectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRoles, setSelectedRoles] = useState<any[]>(
    userRequest?.roleSelection,
  );

  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [groupsData, setGroupsData] = useState<any[]>([]);
  const [nestedGroupsData, setNestedGroupsData] = useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [systemIds, setSystemIds] = useState(0);
  const [tcUsersIds, setTcUserIds] = useState("");
  const [defaultValue, setDefaultValues] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [groupFilterValue, setGroupFilterValue] = useState("");
  const [fromFilter, setFromFilter] = useState<boolean>(false);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [alreadyExistItems, SetAlreadyExistItems] = useState<any[]>([]);
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedRoles, setCheckedRoles] = useState<{ [key: number]: number[] }>(
    {},
  );
  const [hasRoleSelectionChanged, setHasRoleSelectionChanged] = useState(false);

  useEffect(() => {
    if (userRequest.roleSelection.length > 0) {
      const initialCheckedRoles: any = {};
      const initialExpandedGroups: any = [];

      userRequest.roleSelection.forEach((role: any) => {
        if (!initialCheckedRoles[role.groupId]) {
          initialCheckedRoles[role.groupId] = [];
        }
        initialCheckedRoles[role.groupId].push(role.roleId);
        if (!initialExpandedGroups.includes(role.groupId)) {
          initialExpandedGroups.push(role.groupId);
        }
      });

      setCheckedRoles(initialCheckedRoles);
      setExpandedGroups(initialExpandedGroups);
      setSelectedRoles(userRequest.roleSelection);
    }
  }, []);

  useEffect(() => {
    let isModified =
      selectedRoles.length == alreadyExistItems.length ? false : true;
    let isDeleted = selectedRoles.some((item) => item.isDeleted === true);
    let formModiefid = isModified || isDeleted;
    dataChangeForRoleSelection(selectedRoles, defaultValue, formModiefid);
  }, [selectedRoles]);

  const handleDelete = (id: number) => {
    setSelectedRoles((prevRoles) => {
      const roleToModify = prevRoles.find((role) => role.id === id);

      if (roleToModify) {
        // If the role is "Newly_Added", remove it from the list
        if (roleToModify.assignedRole_Status === "Newly_Added") {
          setCheckedRoles((prevCheckedRoles) => {
            const updatedCheckedRoles = {
              ...prevCheckedRoles,
              [roleToModify.groupId]:
                prevCheckedRoles[roleToModify.groupId]?.filter(
                  (roleId) => roleId !== roleToModify.id,
                ) || [],
            };
            return updatedCheckedRoles;
          });
          return prevRoles.filter((role) => role.id !== id);
        }

        // If the role is "Already_Existing", toggle isDeleted without removing it
        if (roleToModify.assignedRole_Status === "Already_Existing") {
          return prevRoles.map((role) =>
            role.id === id ? { ...role, isDeleted: !role.isDeleted } : role,
          );
        }
      }

      return prevRoles;
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleGroup = (groupId: number) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const handleSelectRole = (
    groupId: number,
    role: RoleResponse,
    fromExisting: boolean,
    groupNamePath?: any,
  ) => {
    setHasRoleSelectionChanged(true);
    setCheckedRoles((prevCheckedRoles) => {
      const groupCheckedRoles = prevCheckedRoles[groupId] || [];
      const isChecked =
        role.roleId !== undefined && groupCheckedRoles.includes(role.roleId);
      const newCheckedRoles = isChecked
        ? groupCheckedRoles.filter((roleId) => roleId !== role.roleId)
        : [...groupCheckedRoles, role.roleId];

      if (!fromExisting) {
        if (!isChecked) {
          const newRole = {
            id: role.roleId,
            groupId,
            roleName: role.roleName,
            isAssigned: false,
            groupNamePath: groupNamePath,
            groupName: role.groupName,
            systemName: userRequest.system.systemName,
            assignedRole_Status: "Newly_Added",
            isDeleted: false,
          };
          setSelectedRoles((prevRoles) => [newRole, ...prevRoles]);
        } else {
          setSelectedRoles((prevRoles) =>
            prevRoles.filter((r) => {
              return !(r.groupId === groupId && r.id === role.roleId);
            }),
          );
        }
      }

      return {
        ...prevCheckedRoles,
        [groupId]: newCheckedRoles,
      };
    });
  };

  const getGroupsData = async (systemId: number, tcUserId?: string) => {
    setLoading(true);
    try {
      // Fetch groups by system ID
      const response = await TcGroup.findAllGroupsBySystemID(systemId);
      // Set groups data from system ID
      if (response?.data) {
        setGroupsData(response.data);
        setSelectedRoles(userRequest.roleSelection);
        // Expand level 1 groups by default
        const expandedGroupIds: number[] = response.data
          .filter((item: any) => item.level === 1)
          .map((item: any) => item.groupId);

        setExpandedGroups(expandedGroupIds);

        if (tcUserId && allPageData.userHistory.userHistoryId != null) {
          // Fetch additional data for the specific tcUserId
          const responseData = await TcGroup.findAllSelectedGroupsByTcUserIdID(
            systemId,
            tcUserId,
          );

          if (responseData?.data?.tcGroupAndRoleResponses?.length > 0) {
            const data = responseData.data.tcGroupAndRoleResponses.map(
              (item: any) => ({
                id: Math.random(),
                roleName: item.roleName,
                isAssigned: false,
                groupNamePath: item.groupNamePath,
                groupName: item.groupName,
                systemName: userRequest.system.systemName,
                assignedRole_Status: item.status,
                isDeleted: false,
              }),
            );

            // Set already existing items and selected roles

            let isDeleted = userRequest.roleSelection.some(
              (item: any) => item.isDeleted === true,
            );
            if (userRequest.roleSelection.length > data.length || isDeleted) {
              setSelectedRoles(userRequest.roleSelection);
              SetAlreadyExistItems(
                userRequest.roleSelection.filter((item: any) => {
                  if (item.assignedRole_Status == "Already_Existing") {
                    return item;
                  }
                }),
              );
            } else {
              setSelectedRoles(data);
              SetAlreadyExistItems(data);
            }
            let finalData =
              userRequest.roleSelection.length > data.length
                ? userRequest.roleSelection
                : responseData.data?.tcGroupAndRoleResponses;
            finalData?.forEach((item: any) => {
              const groupId = findGroupIdByName(item.groupName, response.data);
              if (groupId) {
                const role = findRoleByName(
                  item.roleName,
                  groupId,
                  response.data,
                );

                if (groupId !== undefined && role !== undefined) {
                  setCheckedRoles((prevCheckedRoles) => {
                    const updatedCheckedRoles = {
                      ...prevCheckedRoles,
                      [groupId]: [
                        ...(prevCheckedRoles[groupId] || []),
                        role.roleId,
                      ],
                    };
                    return updatedCheckedRoles;
                  });
                }
              }
            });

            setDefaultValues(responseData.data);
          }
        } else {
          SetAlreadyExistItems(
            userRequest.roleSelection.filter((item: any) => {
              if (item.assignedRole_Status == "Already_Existing") {
                return item;
              }
            }),
          );
          userRequest.roleSelection?.forEach((item: any) => {
            const groupId = findGroupIdByName(item.groupName, response.data);
            if (groupId) {
              const role = findRoleByName(
                item.roleName,
                groupId,
                response.data,
              );

              if (groupId !== undefined && role !== undefined) {
                setCheckedRoles((prevCheckedRoles) => {
                  const updatedCheckedRoles = {
                    ...prevCheckedRoles,
                    [groupId]: [
                      ...(prevCheckedRoles[groupId] || []),
                      role.roleId,
                    ],
                  };
                  return updatedCheckedRoles;
                });
              }
            }
          });
        }

        setFilteredGroups(response.data);
      }
    } catch (error) {
      console.error("Error fetching groups data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const systemId = userRequest.system.systemId;
    const tcUserId =
      userRequest.requestType1.selectedUser1 ||
      userRequest.requestType1.selectedUser;
    getGroupsData(systemId, tcUserId);
    setSystemIds(systemId);
    setTcUserIds(tcUserId);
  }, []);

  const findGroupIdByName = (groupName: string, filterData: any) => {
    return filterData?.find((group: any) => group?.groupName === groupName)
      ?.groupId;
  };

  const findRoleByName = (
    roleName: string,
    groupId: number,
    filterData: any,
  ) => {
    const group = filterData?.find((group: any) => group?.groupId === groupId);
    if (group) {
      return group?.roleResponses?.find(
        (role: any) => role?.roleName === roleName,
      );
    } else {
    }
    return undefined;
  };

  const handleGroupFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.toLowerCase();
    setGroupFilterValue(value); // Update the input value

    setFilteredGroups(
      groupsData.filter((group) => {
        const groupNameMatches = (group.groupName ?? "")
          .toLowerCase()
          .includes(value);

        if (value.length === 0) {
          setFromFilter(false);
        } else if (groupNameMatches && value.length > 0) {
          setFromFilter(true);
        }

        return groupNameMatches;
      }),
    );
  };

  const handleResetFilter = () => {
    setGroupFilterValue(""); // Reset the input field
    setFilteredGroups(groupsData); // Reset the filtered groups to show all
    setFromFilter(false); // Reset the filter flag
  };

  useEffect(() => {
    if (defaultValue) {
      let isModified =
        selectedRoles.length == alreadyExistItems.length ? false : true;
      let isDeleted = selectedRoles.some((item) => item.isDeleted === true);
      let formModiefid = isModified || isDeleted;
      dataChangeForRoleSelection(selectedRoles, defaultValue, formModiefid);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (defaultValue) {
      let isModified =
        selectedRoles.length == alreadyExistItems.length ? false : true;
      let isDeleted = selectedRoles.some((item) => item.isDeleted === true);
      let formModiefid = isModified || isDeleted;
      dataChangeForRoleSelection(selectedRoles, defaultValue, formModiefid);
    }
  }, [selectedRoles]);

  const nestGroups = (groups: Group[]): Group[] => {
    setLoading(true);
    const groupMap: { [key: number]: Group } = {};
    const nestedGroups: Group[] = [];

    groups?.forEach((group) => {
      groupMap[group.groupId] = { ...group, children: [] };
    });
    groups?.forEach((group) => {
      if (group.parentGroupId !== null) {
        if (fromFilter) {
          nestedGroups?.push(groupMap[group.groupId]);
          setFromFilter(false);
        } else {
          groupMap[group.parentGroupId]?.children!?.push(
            groupMap[group.groupId],
          );
        }
      } else {
        nestedGroups?.push(groupMap[group.groupId]);
      }
    });
    setLoading(false);
    return nestedGroups;
  };
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const onSearchResult = (data: any) => {
    const existingItems = new Set(
      alreadyExistItems.map(
        (item: any) => `${item.groupNamePath}-${item.roleName}`,
      ),
    );

    const newItems = data.tcGroupAndRoleResponses
      .filter((item: any) => {
        const key = `${item.groupNamePath}-${item.roleName}`;
        if (existingItems.has(key)) {
          setSnackbarMessage(
            `Error: Role "${item.roleName}" already exists in group "${item.groupNamePath}".`,
          );
          setSnackbarOpen(true);
          return false;
        }
        return true;
      })
      .map((item: any) => ({
        id: Math.random(),
        roleName: item.roleName,
        isAssigned: false,
        groupNamePath: item.groupNamePath,
        groupName: item.groupName,
        systemName: userRequest.system.systemName,
        assignedRole_Status: item.status,
        isDeleted: item.isDeleted,
      }));

    if (newItems.length > 0) {
      SetAlreadyExistItems((prevItems) => [...prevItems, ...newItems]);
      setSelectedRoles((prevItems) => [...prevItems, ...newItems]);
    }

    // Handle role selection for the new items only
    newItems.forEach((item: any) => {
      const groupId = findGroupIdByName(item.groupName, filteredGroups);
      if (groupId) {
        const role = findRoleByName(item.roleName, groupId, filteredGroups);
        if (groupId !== undefined && role !== undefined) {
          handleSelectRole(groupId, role, true);
        }
      }
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (filteredGroups.length > 0) {
      let nestedData = nestGroups(filteredGroups);
      setNestedGroupsData(nestedData);
    }
  }, [filteredGroups]);

  const renderGroups = (groups: Group[], level: number = 1) => {
    const getBackgroundColor = (level: number) => {
      switch (level) {
        case 1:
          return "#81d5eb"; // Light Blue
        case 2:
          return "#6bb8d0"; // Slightly Darker Blue
        case 3:
          return "#559bb5"; // Even Darker Blue
        case 4:
          return "#3f7e9a"; // Deep Blue
        default:
          return "";
      }
    };

    const getRoleBackgroundColor = (index: number) => {
      return index % 2 === 0 ? "#f7f7f7" : "#e1e1e1";
    };

    return (
      <div className="nestedRoles">
        <Box>
          {groups.map((group) => (
            <div
              key={group.groupId}
              style={{ paddingLeft: level * 13, marginBottom: "0.2rem" }}
            >
              <ListItemButton
                onClick={() => handleToggleGroup(group.groupId)}
                style={{
                  backgroundColor: getBackgroundColor(level),
                  fontFamily: `"Segoe UI", "Selawik", "Open Sans", Arial, sans-serif`,
                  display: "flex",
                  alignItems: "center",
                  padding: "0.2rem",
                  fontSize:
                    level === 0
                      ? "10px"
                      : level === 1
                        ? "8px"
                        : level === 2
                          ? "5.8px"
                          : "5px",
                }}
              >
                {expandedGroups.includes(group.groupId) ? (
                  <RemoveCircleOutlineIcon
                    sx={{ color: "#000", marginRight: 1, fontSize: "1rem" }}
                  />
                ) : (
                  <AddCircleOutlineIcon
                    sx={{ color: "#000", marginRight: 1, fontSize: "1rem" }}
                  />
                )}
                {expandedGroups.includes(group.groupId) ? (
                  <FolderOpenIcon
                    sx={{ color: "#007bff", marginRight: 1, fontSize: "1rem" }} // Blue for open folder
                  />
                ) : (
                  <FolderIcon
                    sx={{ color: "#6c757d", marginRight: 1, fontSize: "1rem" }} // Gray for closed folder
                  />
                )}
                <ListItemText
                  primary={group.groupName}
                  primaryTypographyProps={{
                    fontSize:
                      level === 0
                        ? "15px"
                        : level === 1
                          ? "13.5px"
                          : level === 2
                            ? "12px"
                            : "12px",
                  }}
                />
              </ListItemButton>
              <Collapse
                in={expandedGroups.includes(group.groupId)}
                timeout="auto"
                unmountOnExit
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {group.roleResponses.map((role, index) => (
                    <ListItem
                      key={role.roleId}
                      sx={{
                        pl: 1,
                        py: 0.4,
                        backgroundColor: getRoleBackgroundColor(index),
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              marginLeft: "22px",
                              paddingBottom: "4px",
                              "& .MuiSvgIcon-root": {
                                fontSize: "1rem",
                              },
                              "&.Mui-disabled": {
                                color: "black",
                                cursor: "not-allowed",
                              },
                            }}
                            disabled={alreadyExistItems.some(
                              (item) =>
                                item.groupName === group.groupName &&
                                item.roleName === role.roleName,
                            )}
                            checked={
                              checkedRoles[group.groupId]?.includes(
                                role.roleId ?? -1,
                              ) || false
                            }
                            onChange={() => {
                              handleSelectRole(
                                group.groupId,
                                role,
                                false,
                                group.groupNamePath,
                              );
                            }}
                          />
                        }
                        label={role.roleName}
                        componentsProps={{
                          typography: {
                            fontSize: "0.75rem",
                            paddingBottom: "0rem",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                  {group.children &&
                    group.children.length > 0 &&
                    renderGroups(group.children, level + 1)}
                </div>
              </Collapse>
            </div>
          ))}
        </Box>
      </div>
    );
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={{ border: "1px solid #ccc", borderRadius: "4px" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                backgroundColor: "#006487",
                color: "white",
                fontWeight: "bold",
                padding: "0.25rem 0.25rem",
                marginBottom: "0.5rem",
                fontSize: "0.8rem",
              }}
            >
              Search Template User
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
                padding: 1,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Search Via GID"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  marginRight: "0.5rem",
                  "& .MuiOutlinedInput-root": {
                    fontSize: "12px",
                    padding: "5px",
                  },
                  "& .MuiInputBase-input": {
                    padding: "2px 2px",
                  },
                }}
                inputProps={{ style: { fontSize: "12px" } }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenPopup}
                sx={{
                  padding: "7px 5px",
                }}
              >
                <SearchIcon sx={{ fontSize: "1rem" }} />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSearchQuery("")}
                sx={{
                  marginLeft: "0.5rem",
                  padding: "7px 5px",
                }}
              >
                <RefreshIcon sx={{ fontSize: "1rem" }} />
              </Button>
            </Box>

            {isPopupOpen && (
              <Popup
                onClose={handleClosePopup}
                systemIds={systemIds}
                tcUsersIds={searchQuery}
                onSearchResult={onSearchResult}
              />
            )}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  backgroundColor: "#006487",
                  color: "white",
                  fontWeight: "bold",
                  padding: "0.25rem 0.5rem",
                  marginBottom: "0.5rem",
                  fontSize: "0.8rem",
                }}
              >
                Siemens
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                  padding: 1,
                }}
              >
                <TextField
                  variant="outlined"
                  placeholder="Enter Group Filter"
                  size="small"
                  fullWidth
                  value={groupFilterValue}
                  onChange={handleGroupFilterChange}
                  sx={{
                    marginRight: "0.5rem",
                    "& .MuiOutlinedInput-root": {
                      fontSize: "12px",
                      padding: "5px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "2px 2px",
                    },
                  }}
                  inputProps={{ style: { fontSize: "12px" } }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleResetFilter}
                  sx={{
                    marginLeft: "0.5rem",
                    padding: "7px 5px",
                  }}
                >
                  <RefreshIcon sx={{ fontSize: "1rem" }} />{" "}
                </Button>
              </Box>

              <Box
                sx={{
                  marginTop: "1rem",
                  borderTop: "1px solid #ccc",
                  padding: 1,
                }}
              >
                {loading ? (
                  <Backdrop
                    sx={{
                      color: "#fff",
                      zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={loading}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                ) : (
                  <List component="nav">{renderGroups(nestedGroupsData)}</List>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "2px",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              style={{
                backgroundColor: "#006487",
                color: "white",
                fontWeight: "bold",
                padding: "0.25rem 0.5rem",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
              }}
            >
              Selected Roles
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <StyledTableHeadRow sx={{ backgroundColor: "#006487" }}>
                    <StyledHeadTableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      Role Name
                    </StyledHeadTableCell>
                    <StyledHeadTableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      Group Name
                    </StyledHeadTableCell>
                    <StyledHeadTableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      Status
                    </StyledHeadTableCell>
                    <StyledHeadTableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      Action
                    </StyledHeadTableCell>
                  </StyledTableHeadRow>
                </TableHead>
                <TableBody>
                  {selectedRoles.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <StyledDataTableCell
                        sx={{
                          padding: "0.25rem",
                          paddingLeft: "0.6rem",
                          fontSize: "0.75rem",
                          textDecoration: row.isDeleted
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {row.roleName}
                      </StyledDataTableCell>
                      <StyledDataTableCell
                        sx={{
                          padding: "0.25rem",
                          paddingLeft: "0.6rem",
                          fontSize: "0.75rem",
                          textDecoration: row.isDeleted
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {row.groupNamePath}
                      </StyledDataTableCell>
                      <StyledDataTableCell
                        sx={{
                          padding: "0.25rem",
                          paddingLeft: "0.6rem",
                          fontSize: "0.75rem",
                          textDecoration: row.isDeleted
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {row.assignedRole_Status}
                      </StyledDataTableCell>
                      <StyledDataTableCell
                        sx={{
                          padding: "0.25rem",
                          paddingLeft: "0.6rem",
                          borderBottom: "none",
                        }}
                      >
                        <IconButton
                          onClick={() => handleDelete(row.id)}
                          sx={{
                            padding: "0.15rem",
                          }}
                        >
                          {row.isDeleted ? (
                            <CheckIcon sx={{ color: "green" }} />
                          ) : (
                            <DeleteOutlineIcon sx={{ color: "#d32f2f" }} />
                          )}
                        </IconButton>
                      </StyledDataTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={selectedRoles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoleSelection;
