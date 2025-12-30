import { Alert, Box, Grid, Snackbar, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableHead, Paper, Button } from "@mui/material";
import Service from "../../../../models/ServiceModel";
import TcSystem from "../../../../services/SystemService";
import TcService from "../../../../services/UserService";
import SystemCustomModal from "../../../atoms/common/modals/SystemCustomModal";
import axios from "axios";
import {
  StyledCommonGrid,
  StyledDataTableCell,
  StyledHeadTableCell,
  StyledHeaderBox,
  StyledOpenSearchBox,
  StyledOuterBox,
  StyledTableHeadRow,
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
  StyledBox,
  StyledTableRow,
  TablePaginationRow,
  TablePaginationCell,
  StyledTablePagination,
  StyledOpenSearchGrid,
} from "../groupPage/styledComponent";
export interface SystemResponse {
  serviceId: number;
  serviceName: string | undefined;
  systemId: number;
  systemName: string | undefined;
}

const SystemPage = () => {
  const [systems, setSystems] = useState<SystemResponse[]>([]);
  const [serviceData, setServiceData] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [searchService, setSearchService] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermService, setSearchTermService] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [editItem, setEditItem] = useState<SystemResponse | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SystemResponse | undefined>(
    undefined,
  );
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

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };

  const sortedData = [...systems].sort((a: any, b: any) => {
    const aValue = sortColumn ? a[sortColumn] : null;
    const bValue = sortColumn ? b[sortColumn] : null;

    return sortDirection === "asc"
      ? aValue?.localeCompare(bValue)
      : bValue?.localeCompare(aValue);
  });
  const filteredData = sortedData.filter(
    (item) =>
      item.systemName &&
      item.systemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.serviceName &&
      item.serviceName.toLowerCase().includes(searchTermService.toLowerCase()),
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  const handleOpen = (
    operation: "edit" | "add" | "delete",
    itemData?: SystemResponse,
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

  const getSystems = async () => {
    try {
      const response = await TcSystem.findAllSystems();
      setSystems(response?.data);
    } catch (error) {
      console.error("Error fetching systems:", error);
    }
  };

  const getServiceData = async () => {
    const response = await TcService.findAllServices();
    if (response) setServiceData(response?.data);
  };

  useEffect(() => {
    getSystems();
  }, []);

  useEffect(() => {
    getServiceData();
  }, []);

  const handleAddNewItem = async (systemData: SystemResponse) => {
    const newSystem = {
      systemName: systemData?.systemName,
      service: {
        serviceId: systemData.serviceId,
      },
    };
    try {
      const response = await TcSystem.createSystem(newSystem);
      setSystems((prevData) => [...prevData, response.data]);
      if ((systems.length - 1) % rowsPerPage === 0 && page > 0) {
        setPage(page - 1);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          setDuplicateEntityError(error.response.data.message);
        }
        console.error("Error creating System:", error);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
    handleClose();
  };

  const handleEditItem = async (editedItem: SystemResponse) => {
    const newSystem = {
      systemId: editedItem?.systemId,
      systemName: editedItem?.systemName,
      service: {
        serviceId: editedItem?.serviceId,
      },
    };
    try {
      let response = await TcSystem.updateSystem(newSystem);
      let editedData = response.data;
      const updatedData = systems.map((item) =>
        item.systemId === editedItem.systemId ? editedData : item,
      );
      setSystems(updatedData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          setDuplicateEntityError(error.response.data.message);
        }
        console.error("Error creating System:", error);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
    handleClose();
  };

  const handleDeleteItem = async (id: number | undefined) => {
    if (id !== undefined) {
      try {
        await TcSystem.deleteSystem(id);
        const updatedData = systems.filter((item) => item.systemId !== id);
        setSystems(updatedData);
      } catch (error) {
        console.error("Error deleting service:", error);
      }
      handleClose();
    }
  };

  const handleSearch = () => {
    setSearchTerm(search);
    setSearchTermService(searchService);
  };

  const handleReset = () => {
    // Clear search input fields
    setSearch("");
    setSearchService("");

    // Reset search terms
    setSearchTerm("");
    setSearchTermService("");

    // Re-fetch the data to reset the table view
    getSystems();
    getServiceData();
  };

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch); // Toggle visibility
    if (!openSearch) {
      setSearch("");
      setSearchTerm("");
      setSearchTermService("");
    }
  };

  const handleRowSelect = (row: SystemResponse) => {
    setSelectedRow(row);
  };

  return (
    <>
      <StyledOuterBox>
        <StyledHeaderBox className="card-header">
          System Overview
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
                        System Name
                      </StyledTypography>
                      <StyledTextField
                        fullWidth
                        id="system-name-search"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                        Service Name
                      </Typography>
                      <StyledTextField
                        fullWidth
                        id="service-name-search"
                        variant="outlined"
                        value={searchService}
                        onChange={(e) => setSearchService(e.target.value)}
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
                    onClick={() => handleOpen("add")}
                  >
                    <StyledAddIcon>
                      <AddIcon fontSize="medium" />
                    </StyledAddIcon>
                  </StyledAddButton>
                </span>
              </Tooltip>
            </Box>
            <Box mt={2} px={1}>
              <Tooltip title="Edit">
                <span>
                  <StyledEditButton
                    variant="contained"
                    // @ts-ignore
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
            <Box mt={2}>
              <Tooltip title="Delete">
                <span>
                  <StyledDeleteButton
                    variant="contained"
                    color="error"
                    // @ts-ignore
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
            <Table sx={{ backgroundColor: "white" }}>
              <TableHead sx={{ backgroundColor: "#006487", height: "40px" }}>
                <StyledTableHeadRow>
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
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "50%",
                    }}
                    onClick={() => handleSort("serviceName")}
                  >
                    Service Name
                    {sortColumn === "serviceName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                </StyledTableHeadRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((system) => (
                  <StyledTableRow
                    key={system.systemId}
                    selected={selectedRow?.systemId === system.systemId}
                    onClick={() => handleRowSelect(system)}
                    sx={{ cursor: "pointer" }}
                  >
                    <StyledDataTableCell>
                      {system.systemName}
                    </StyledDataTableCell>
                    <StyledDataTableCell>
                      {system.serviceName}
                    </StyledDataTableCell>
                  </StyledTableRow>
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

            <SystemCustomModal
              open={open}
              onClose={handleClose}
              operation={operationType}
              // @ts-ignore
              handleAddNewItem={handleAddNewItem}
              handleEditItem={handleEditItem}
              editItem={editItem}
              handleDeleteItem={handleDeleteItem}
              serviceData={serviceData}
            />
          </StyledBox>
        </StyledOpenSearchBox>
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
    </>
  );
};

export default SystemPage;
