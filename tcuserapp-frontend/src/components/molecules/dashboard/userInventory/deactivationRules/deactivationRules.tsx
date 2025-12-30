import { Box, Grid, TablePagination, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { Country } from "../../../../../models/countryModel";
import DeactivationCustomModal from "../../../../atoms/common/modals/DeactivationCustomModal";

const DeactivationRules = () => {
  const [deactivation, setDeactivation] = useState([]);
  const [deactivationValue, setDeactivationValue] = useState("");
  const [minDeactivationValue, setMinDeactivationValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [editItem, setEditItem] = useState<null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

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
    setDeactivationValue("");
    setMinDeactivationValue("");
    setSearchTerm("");
  };

  const handleSearch = () => {
    const searchString = `${deactivationValue.toLowerCase()} ${minDeactivationValue.toLowerCase()} `;
    setSearchTerm(searchString.trim());
  };

  const handleOpen = (
    operation: "edit" | "add" | "delete",
    selectedRow?: any,
  ) => {
    setOperationType(operation);
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

  const handleEditItem = async (editedItem: Country) => {
    handleClose();
  };

  const handleDeleteItem = async (id: number | undefined) => {};

  return (
    <>
      <Box>
        <Box className="card-header">Deactivation Overview</Box>
        <Box m={2} pb={1} component={Paper}>
          {openSearch && (
            <Grid
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
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Maximum Deactivation Value
                      </Typography>
                      <TextField
                        name="roleName"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={deactivationValue}
                        onChange={(e) => setDeactivationValue(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      >
                        Minimum Warning Value
                      </Typography>
                      <TextField
                        name="uid"
                        fullWidth
                        variant="outlined"
                        type="text"
                        value={minDeactivationValue}
                        onChange={(e) =>
                          setMinDeactivationValue(e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{ textAlign: "end", pr: 1.5, mt: 5 }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        mr: 1,
                        minWidth: "35px",
                        height: "35px",
                      }}
                      onClick={handleResetSearch}
                    >
                      <CachedIcon sx={{ color: "white" }} />
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      sx={{ minWidth: "35px", height: "35px", mr: 1 }}
                      onClick={handleSearch}
                    >
                      <SearchIcon sx={{ color: "white" }} />
                    </Button>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          )}
          <Box sx={{ display: "flex", ml: 0.5 }}>
            <Box mt={2} mb={1} px={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleToggleSearch}
              >
                <IconButton sx={{ p: 0 }}>
                  <SearchIcon fontSize="medium" />
                </IconButton>
              </Button>
            </Box>
            <Box mt={2} mb={1}>
              <Button variant="contained" onClick={() => handleOpen("add")}>
                <IconButton sx={{ p: 0 }}>
                  <AddIcon fontSize="medium" />
                </IconButton>
              </Button>
            </Box>
            <Box mt={2} mb={1} px={1}>
              <Button
                variant="contained"
                onClick={() => handleOpen("edit", selectedRow)}
                disabled={!selectedRow}
              >
                <IconButton sx={{ p: 0 }}>
                  <EditIcon fontSize="medium" />
                </IconButton>
              </Button>
            </Box>
            <Box mt={2} mb={1}>
              <Button
                variant="contained"
                onClick={() => handleOpen("delete", selectedRow)}
                disabled={!selectedRow}
              >
                <IconButton sx={{ p: 0 }}>
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              </Button>
            </Box>
          </Box>
          <Box sx={{ m: 1.5 }}>
            <Table sx={{ backgroundColor: "white" }}>
              <TableHead sx={{ backgroundColor: "#777", height: "40px" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("minDeactivationValue")}
                  >
                    Maximum Deactivation Value
                    {sortColumn === "minDeactivationValue" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                    onClick={() => handleSort("deactivationValue")}
                  >
                    Minimum Warning Value
                    {sortColumn === "deactivationValue" && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ border: "1px solid #E0E0E0;" }}>
                  <TableCell colSpan={6}>
                    <TablePagination
                      className="pagination"
                      component="div"
                      rowsPerPageOptions={[8, 16, 24]}
                      count={deactivation.length}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onPageChange={handleChangePage}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <DeactivationCustomModal
              open={open}
              onClose={handleClose}
              operation={operationType}
              handleEditItem={handleEditItem}
              editItem={editItem}
              handleDeleteItem={handleDeleteItem}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DeactivationRules;
