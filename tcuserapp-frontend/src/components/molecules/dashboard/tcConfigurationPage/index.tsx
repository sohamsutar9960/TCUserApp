import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableHead,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CachedIcon from "@mui/icons-material/Cached";
import TcConfigurtaion from "../../../../services/tcConfigService";
import { useEffect, useRef, useState } from "react";
import { TcConfig, TcConfigResponse } from "../../../../models/tcConfigModel";
import TcConfigCustomModal from "../../../atoms/common/modals/TcConfigCustomModal";
import TcSystem from "../../../../services/SystemService";
import { SystemResponse } from "../systemPage";
import axios from "axios";
import {
  StyledOuterBox,
  StyledHeaderBox,
  StyledOpenSearchBox,
  StyledOpenSearchGrid,
  StyledCommonGrid,
  StyledEditIcon,
  StyledAddButton,
  StyledAddIcon,
  StyledDataTableCell,
  StyledDeleteButton,
  StyledDeleteIcon,
  StyledEditButton,
  StyledHeadTableCell,
  StyledSearchButton,
  StyledSearchIcon,
  StyledTableHeadRow,
  StyledTablePagination,
  StyledTableRow,
  TablePaginationCell,
  TablePaginationRow,
  StyledTextField,
  StyledTypography,
} from "../groupPage/styledComponent";

const TcConfigurationPage = () => {
  const [tcConfigs, setTcConfigs] = useState<TcConfigResponse[]>([]);
  const [systemData, setSystemData] = useState<SystemResponse[]>([]);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSystem, setSearchSystem] = useState("");
  const [page, setPage] = useState(0);
  const [searchTermSystem, setSearchTermSystem] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [editItem, setEditItem] = useState<TcConfigResponse | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TcConfigResponse | undefined>(
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
  const handleOpen = (
    operation: "edit" | "add" | "delete",
    itemData?: TcConfigResponse,
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

  const sortedData = [...tcConfigs].sort((a: any, b: any) => {
    const aValue = sortColumn ? a[sortColumn] : null;
    const bValue = sortColumn ? b[sortColumn] : null;

    return sortDirection === "asc"
      ? aValue?.localeCompare(bValue)
      : bValue?.localeCompare(aValue);
  });
  const filteredData = sortedData.filter(
    (item) =>
      item.configName &&
      item.configName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.systemName &&
      item.systemName.toLowerCase().includes(searchTermSystem.toLowerCase()),
  );
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getTcConfigs = async () => {
    try {
      const response = await TcConfigurtaion.findAllTcConfig();

      setTcConfigs(response?.data);
    } catch (error) {
      console.error("Error fetching systems:", error);
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
    getTcConfigs();
    getSystems();
  }, []);

  const handleAddNewItem = async (tcConfigData: TcConfigResponse) => {
    const {
      configName,
      tcURL,
      fmsURL,
      ssoEnabled,
      ssoLoginURL,
      ssoIdentityURL,
      ssoTCAppId,
      active,
      userName,
      password,
      systemId,
    } = tcConfigData;
    const newTcConfig: TcConfig = {
      configName: configName,
      tcURL: tcURL,
      fmsURL: fmsURL,
      ssoEnabled: ssoEnabled,
      ssoLoginURL: ssoLoginURL,
      ssoIdentityURL: ssoIdentityURL,
      ssoTCAppId: ssoTCAppId,
      active: active,
      userName: userName,
      password: password,
      system: {
        systemId: systemId,
      },
    };

    try {
      const response = await TcConfigurtaion.createTcConfig(newTcConfig);
      setTcConfigs((prevData) => [...prevData, response.data]);
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

  const handleEditItem = async (editedItem: TcConfigResponse) => {
    const {
      configName,
      tcURL,
      fmsURL,
      ssoEnabled,
      ssoLoginURL,
      ssoIdentityURL,
      ssoTCAppId,
      active,
      userName,
      password,
      systemId,
      tcConfigId,
    } = editedItem;
    const editedTcConfig: TcConfig = {
      tcConfigId: tcConfigId,
      configName: configName,
      tcURL: tcURL,
      fmsURL: fmsURL,
      ssoEnabled: ssoEnabled,
      ssoLoginURL: ssoLoginURL,
      ssoIdentityURL: ssoIdentityURL,
      ssoTCAppId: ssoTCAppId,
      active: active,
      userName: userName,
      password: password,
      system: {
        systemId: systemId,
      },
    };
    try {
      const response = await TcConfigurtaion.updateTcConfig(editedTcConfig);
      const updatedData = tcConfigs.map((item) =>
        item.tcConfigId === editedItem.tcConfigId ? response.data : item,
      );
      setTcConfigs(updatedData);
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
        await TcConfigurtaion.deleteTcConfig(id);
        const updatedData = tcConfigs.filter((item) => item.tcConfigId !== id);
        setTcConfigs(updatedData);
        if ((tcConfigs.length - 1) % rowsPerPage === 0 && page > 0) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Error deleting tcConfig:", error);
      }
      handleClose();
    }
  };

  const handleSearch = () => {
    setSearchTerm(search);
    setSearchTermSystem(searchSystem);
  };

  const handleReset = () => {
    setSearch("");
    setSearchSystem("");
    setSearchTerm("");
    setSearchTermSystem("");

    getSystems();
    getTcConfigs();
  };

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch);
    if (!openSearch) {
      setSearch("");
      setSearchTerm("");
      setSearchTermSystem("");
    }
  };

  const handleRowSelect = (row: TcConfigResponse) => {
    setSelectedRow(row);
  };
  return (
    <>
      <StyledOuterBox>
        <StyledHeaderBox className="card-header">
          Teamcenter Configurations
        </StyledHeaderBox>
        <StyledOpenSearchBox m={2} pb={1} component={Paper}>
          {openSearch && (
            <StyledOpenSearchGrid container spacing={1.5} pb={2}>
              <StyledCommonGrid item xs={12}>
                <StyledCommonGrid>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12} sm={6} md={3}>
                      <StyledTypography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Config Name
                      </StyledTypography>
                      <StyledTextField
                        fullWidth
                        name="configName"
                        id="configName"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                        fullWidth
                        name="systemName"
                        id="systemName"
                        variant="outlined"
                        value={searchSystem}
                        onChange={(e) => setSearchSystem(e.target.value)}
                      />
                    </Grid>

                    {/* Search Field, Refresh, and Search Buttons */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Tooltip title="Refresh">
                        <span>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              minWidth: "35px",
                              height: "40px",
                              bgcolor: "white",
                              "&:hover": {
                                bgcolor: "#1565C0",
                                ".MuiSvgIcon-root": {
                                  color: "white",
                                },
                              },
                              marginRight: 1,
                            }}
                            onClick={handleReset}
                          >
                            <CachedIcon sx={{ color: "#1565C0" }} />
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title="Search">
                        <span>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              minWidth: "35px",
                              height: "40px",
                              bgcolor: "#1565C0",
                              "&:hover": {
                                bgcolor: "white",
                                ".MuiSvgIcon-root": {
                                  color: "#1565C0",
                                },
                              },
                              marginRight: 2,
                            }}
                            onClick={handleSearch}
                          >
                            <SearchIcon sx={{ color: "white" }} />
                          </Button>
                        </span>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </StyledCommonGrid>
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
            <Box mt={2} mb={1} px={1}>
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
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("configName")}
                  >
                    Config Name
                    {sortColumn === "configName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("configName")}
                  >
                    System Name
                    {sortColumn === "configName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("tcURL")}
                  >
                    TCURL
                    {sortColumn === "tcURL" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("fmsURL")}
                  >
                    FMSURL
                    {sortColumn === "fmsURL" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>

                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("ssoLoginURL")}
                  >
                    SSO login URL
                    {sortColumn === "ssoLoginURL" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>

                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                    onClick={() => handleSort("userName")}
                  >
                    userName
                    {sortColumn === "userName" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{ color: "white", cursor: "pointer", width: "15%" }}
                  >
                    Active
                  </StyledHeadTableCell>
                </StyledTableHeadRow>
              </TableHead>
              <TableBody>
                {paginatedData
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((tcConfig) => (
                    <StyledTableRow
                      key={tcConfig.tcConfigId}
                      selected={selectedRow?.tcConfigId === tcConfig.tcConfigId}
                      onClick={() => handleRowSelect(tcConfig)}
                      sx={{ cursor: "pointer" }}
                    >
                      <StyledDataTableCell>
                        {tcConfig?.configName}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {tcConfig?.systemName}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {tcConfig?.tcURL}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {tcConfig?.fmsURL}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {tcConfig?.ssoLoginURL}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {tcConfig?.userName}
                      </StyledDataTableCell>
                      <StyledDataTableCell>
                        {tcConfig?.active === true ? "Yes" : "No"}
                      </StyledDataTableCell>
                    </StyledTableRow>
                  ))}
                <TablePaginationRow>
                  <TablePaginationCell colSpan={10}>
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

            <TcConfigCustomModal
              handleAddNewItem={handleAddNewItem}
              handleEditItem={handleEditItem}
              handleDeleteItem={handleDeleteItem}
              editItem={editItem}
              onClose={handleClose}
              open={open}
              operation={operationType}
              systemData={systemData}
            />
          </Box>
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

export default TcConfigurationPage;
