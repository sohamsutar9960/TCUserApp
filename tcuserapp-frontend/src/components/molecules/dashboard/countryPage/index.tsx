import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
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
} from "../groupPage/styledComponent";
import {
  Table,
  TableBody,
  TableHead,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CountryCustomModal from "../../../atoms/common/modals/countryCustomModal";
import { Country } from "../../../../models/countryModel";
import TcCountry from "../../../../services/countryService";

const CountryPage = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar visibility
  const [editItem, setEditItem] = useState<Country | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Country | undefined>(
    undefined,
  );
  const [searchFields, setSearchFields] = useState({
    countryCode: "",
    countryName: "",
  });
  const [excelFile, setExcelFile] = useState<File | null>(null);

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

  const handleCountryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSearchFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const sortedData = [...countries].sort((a: any, b: any) => {
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
  };
  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };

  const handleResetSearch = () => {
    setSearchFields({ countryCode: "", countryName: "" });
    getCountries();
  };

  const handleOpen = (
    operation: "edit" | "add" | "delete",
    itemData?: Country,
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

  const getCountries = async () => {
    const response = await TcCountry.findAllCountres();
    if (response.data) {
      setCountries(response.data);
    }
  };
  const getSearchCountries = async (searchFields: Country) => {
    const response = await TcCountry.searchCountries(searchFields);
    if (response.data) {
      setCountries(response.data);
    }
  };
  useEffect(() => {
    getCountries();
  }, []);

  const handleAddNewItem = async (countryData: Country) => {
    try {
      const response = await TcCountry.createCountry(countryData);
      setCountries((prevData) => [...prevData, response.data]);
    } catch (error) {
      console.error("Error:", error);
    }
    handleClose();
  };

  const handleEditItem = async (editedItem: Country) => {
    try {
      const response = await TcCountry.updateCountry(editedItem);
      const updatedData = countries.map((country) =>
        country.countryId === editedItem.countryId ? response.data : country,
      );

      setCountries(updatedData);
    } catch (error) {
      console.error("Error updating service:", error);
    }
    handleClose();
  };

  const handleDeleteItem = async (id: number | undefined) => {
    if (id !== undefined) {
      try {
        await TcCountry.deleteCountry(id);
        const updatedData = countries.filter(
          (country) => country.countryId !== id,
        );
        setCountries(updatedData);
        if ((countries.length - 1) % rowsPerPage === 0 && page > 0) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
      handleClose();
    }
  };
  const handleRowSelect = (row: Country) => {
    setSelectedRow(row);
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setExcelFile(file);

      const formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      try {
        const response = await TcCountry.importCountry(formData);

        if (response.status === 201) {
          setSuccessMessage("File imported successfully!");
          setOpenSnackbar(true);
        } else {
          console.warn("Import failed with status:", response.status);
        }

        await getCountries();
      } catch (error) {
        console.error("Error Importing Excel File:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const StyledImportButton = styled(IconButton)(({ theme }) => ({
    marginLeft: "0px",
    marginRight: "0px",
    padding: 0,
    backgroundColor: "#006487",
    border: "1px solid #006487",
    lineHeight: "1.35",
    minWidth: "54px",
    borderRadius: "5px", // Remove rounded corners
    "&:hover": {
      backgroundColor: "#006487",
      "& svg": {
        color: "white", // Change the icon color on hover
      },
    },
    position: "relative",
  }));

  const StyledImportIcon = styled("div")({
    color: "white",
    padding: "5px 0px 0px 0px",
    fontSize: "0.2rem",
  });

  return (
    <>
      <StyledOuterBox>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <StyledHeaderBox className="card-header">
              Country Overview
            </StyledHeaderBox>
            <StyledOpenSearchBox m={1} pb={1} component={Paper}>
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
                            Country Name
                          </StyledTypography>
                          <StyledTextField
                            name="countryName"
                            fullWidth
                            variant="outlined"
                            type="text"
                            value={searchFields?.countryName}
                            onChange={handleCountryChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <StyledTypography
                            sx={{
                              fontSize: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            Country Code
                          </StyledTypography>
                          <StyledTextField
                            name="countryCode"
                            fullWidth
                            variant="outlined"
                            type="text"
                            value={searchFields?.countryCode}
                            onChange={handleCountryChange}
                          />
                        </Grid>
                      </StyledCommonGrid>
                      <StyledButtonGrid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        sx={{ textAlign: "end", pr: 1.5, mt: 5 }}
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
                              onClick={() => getSearchCountries(searchFields)}
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
                <Box mt={2} mb={1}>
                  <Tooltip title="Search">
                    <span>
                      <StyledSearchButton
                        variant="contained"
                        onClick={handleToggleSearch}
                      >
                        <StyledSearchIcon>
                          <SearchIcon fontSize="medium" />
                        </StyledSearchIcon>
                      </StyledSearchButton>
                    </span>
                  </Tooltip>
                </Box>
                <Box mt={2} mb={1} ml={1}>
                  <Tooltip title="Add">
                    <span>
                      <StyledAddButton
                        variant="contained"
                        onClick={() => handleOpen("add")}
                        sx={{ marginRight: "6px" }}
                      >
                        <StyledAddIcon>
                          <AddIcon fontSize="medium" />
                        </StyledAddIcon>
                      </StyledAddButton>
                    </span>
                  </Tooltip>
                </Box>
                <Box mt={2} mb={1}>
                  <Tooltip title="Import Country">
                    <span>
                      <StyledImportButton>
                        <StyledImportIcon>
                          <UploadFileIcon fontSize="medium" />
                        </StyledImportIcon>
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={handleFileUpload}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: "pointer",
                          }}
                        />
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
                        sx={{
                          color: "white",
                          cursor: "pointer",
                          width: "15%",
                        }}
                        onClick={() => handleSort("countryCode")}
                      >
                        Country Code
                        {sortColumn === "countryCode" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </StyledHeadTableCell>
                      <StyledHeadTableCell
                        sx={{
                          color: "white",
                          cursor: "pointer",
                          width: "15%",
                        }}
                        onClick={() => handleSort("countryName")}
                      >
                        Country Name
                        {sortColumn === "countryName" && (
                          <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                        )}
                      </StyledHeadTableCell>
                    </StyledTableHeadRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(paginatedData) &&
                      paginatedData.map((country) => (
                        <StyledTableRow
                          key={country?.countryId}
                          selected={
                            selectedRow?.countryId === country.countryId
                          }
                          onClick={() => handleRowSelect(country)}
                          sx={{ cursor: "pointer" }}
                        >
                          <StyledDataTableCell>
                            {country?.countryCode}
                          </StyledDataTableCell>
                          <StyledDataTableCell>
                            {country?.countryName}
                          </StyledDataTableCell>
                        </StyledTableRow>
                      ))}

                    <TablePaginationRow>
                      <TablePaginationCell colSpan={6}>
                        <StyledTablePagination
                          rowsPerPageOptions={[8, 16, 24]}
                          count={countries.length}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TablePaginationCell>
                    </TablePaginationRow>
                  </TableBody>
                </Table>

                <CountryCustomModal
                  open={open}
                  onClose={handleClose}
                  operation={operationType}
                  handleAddNewItem={handleAddNewItem}
                  handleEditItem={handleEditItem}
                  editItem={editItem}
                  handleDeleteItem={handleDeleteItem}
                />
              </Box>
            </StyledOpenSearchBox>
          </>
        )}
      </StyledOuterBox>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CountryPage;
