import { Box, Grid, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CachedIcon from "@mui/icons-material/Cached";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import {
  StyledCommonGrid,
  StyledDataTableCell,
  StyledHeadTableCell,
  StyledHeaderBox,
  StyledOpenSearchBox,
  StyledOpenSearchGrid,
  StyledOuterBox,
  StyledTableHeadRow,
  StyledTablePagination,
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
import { VolumeResponse } from "../../../../models/VolumeModel";
import { SystemResponse } from "../systemPage";
import TcVolume from "../../../../services/VolumeService";
import TcSystem from "../../../../services/SystemService";
import VolumeCustomModal from "../../../atoms/common/modals/VolumeCustomModal";

const VolumePage = () => {
  const [volumes, setVolumes] = useState<VolumeResponse[]>([]);
  const [systemData, setSystemData] = useState<SystemResponse[]>([]);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [editItem, setEditItem] = useState<VolumeResponse | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<VolumeResponse | undefined>(
    undefined,
  );
  const [searchFields, setSearchFields] = useState({
    volumeName: "",
    system: {
      systemName: "",
    },
  });

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };

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
  const sortedData = [...volumes].sort((a: any, b: any) => {
    const aValue = sortColumn ? a[sortColumn] : null;
    const bValue = sortColumn ? b[sortColumn] : null;

    return sortDirection === "asc"
      ? aValue?.localeCompare(bValue)
      : bValue?.localeCompare(aValue);
  });
  const filteredData = sortedData.filter(
    (item) =>
      item.volumeName &&
      item.volumeName.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const handleOpen = (
    operation: "edit" | "add" | "delete",
    itemData?: VolumeResponse,
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

  const getVolumes = async () => {
    try {
      const response = await TcVolume.findAllVolumes();
      setVolumes(response?.data);
    } catch (error) {
      console.error("Error fetching systems:", error);
    }
  };

  const getSystemsData = async () => {
    const response = await TcSystem.findAllSystems();
    if (response) setSystemData(response?.data);
  };

  useEffect(() => {
    getVolumes();
    getSystemsData();
  }, []);

  const handleAddNewItem = async (volumeData: VolumeResponse) => {
    const newVolume = {
      volumeName: volumeData.volumeName,
      system: {
        systemId: volumeData.systemId,
        systemName: volumeData.systemName,
      },
    };
    try {
      const response = await TcVolume.createVolume(newVolume);
      setVolumes((prevData) => [...prevData, response.data]);
    } catch (error) {
      console.error("Error creating system:", error);
    }
    handleClose();
  };

  const handleEditItem = async (editedItem: VolumeResponse) => {
    const newSystem = {
      volumeId: editedItem.volumeId,
      volumeName: editedItem.volumeName,
      system: {
        systemId: editedItem.systemId,
        systemName: editedItem.systemName,
      },
    };
    try {
      const response = await TcVolume.updateVolume(newSystem);
      // Update the local state with the edited service
      const updatedData = volumes.map((item) =>
        item.volumeId === editedItem.volumeId ? response.data : item,
      );
      setVolumes(updatedData);
    } catch (error) {
      console.error("Error updating service:", error);
    }
    handleClose();
  };
  const handleDeleteItem = async (id: number | undefined) => {
    if (id !== undefined) {
      try {
        await TcVolume.deleteVolume(id);
        const updatedData = volumes.filter((item) => item.volumeId !== id);
        setVolumes(updatedData);
        if ((volumes.length - 1) % rowsPerPage === 0 && page > 0) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
      handleClose();
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setSearchFields((prevFields) => ({
      ...prevFields,
      [name === "volumeName" ? name : "system"]:
        name === "volumeName" ? value : { ...prevFields.system, [name]: value },
    }));
  };

  const handleSearch = () => {
    setSearchTerm(search);

    const filteredData = volumes.filter((item: any) => {
      const isVolumeNameMatch = item?.volumeName
        .toLowerCase()
        .includes(searchFields.volumeName.toLowerCase());
      const isSystemNameMatch = item?.systemName
        .toLowerCase()
        .includes(searchFields.system.systemName.toLowerCase());

      return isVolumeNameMatch && isSystemNameMatch;
    });

    setVolumes(filteredData);
  };

  const handleReset = () => {
    setSearchFields({
      volumeName: "",
      system: {
        systemName: "",
      },
    });
    getVolumes();
  };

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch);
    if (!openSearch) {
      setSearch("");
      setSearchTerm("");
    }
  };
  const handleRowSelect = (row: VolumeResponse) => {
    setSelectedRow(row);
  };

  return (
    <>
      <StyledOuterBox>
        <StyledHeaderBox className="card-header">
          Volume Overview
        </StyledHeaderBox>
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
                        Volume Name
                      </StyledTypography>
                      <StyledTextField
                        fullWidth
                        name="volumeName"
                        id="standard-bare"
                        variant="outlined"
                        value={searchFields.volumeName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          pl: 2,
                        }}
                      >
                        System Name
                      </Typography>
                      <StyledTextField
                        fullWidth
                        name="systemName"
                        variant="outlined"
                        type="text"
                        value={searchFields.system.systemName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <StyledButtonGrid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      sx={{
                        textAlign: "end",
                        ml: "17rem",
                      }}
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
                            onClick={handleReset}
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
                            onClick={handleSearch}
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
          <Box sx={{ m: 1.5 }}>
            <Table sx={{ backgroundColor: "white" }} ref={tableRef}>
              <TableHead sx={{ backgroundColor: "#777", height: "40px" }}>
                <StyledTableHeadRow>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "50%",
                    }}
                    onClick={() => handleSort("volumeName")}
                  >
                    Volume Name
                    {sortColumn === "volumeName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "50%",
                    }}
                    onClick={() => handleSort("systemName")}
                  >
                    System Name
                    {sortColumn === "systemName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                </StyledTableHeadRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((volume) => (
                  <TableRow
                    key={volume.volumeId}
                    selected={selectedRow?.volumeId === volume.volumeId}
                    onClick={() => handleRowSelect(volume)}
                    sx={{ cursor: "pointer" }}
                  >
                    <StyledDataTableCell>
                      {volume?.volumeName}
                    </StyledDataTableCell>
                    <StyledDataTableCell>
                      {volume?.systemName}
                    </StyledDataTableCell>
                  </TableRow>
                ))}
                <TablePaginationRow>
                  <TablePaginationCell colSpan={2}>
                    <StyledTablePagination
                      rowsPerPageOptions={[8, 16, 24]}
                      count={filteredData.length}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TablePaginationCell>
                </TablePaginationRow>
              </TableBody>
            </Table>

            <VolumeCustomModal
              open={open}
              onClose={handleClose}
              operation={operationType}
              handleAddNewItem={handleAddNewItem}
              handleEditItem={handleEditItem}
              editItem={editItem}
              handleDeleteItem={handleDeleteItem}
              systemResponse={systemData}
            />
          </Box>
        </StyledOpenSearchBox>
      </StyledOuterBox>
    </>
  );
};

export default VolumePage;
