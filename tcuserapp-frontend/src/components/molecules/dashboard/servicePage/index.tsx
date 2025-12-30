import { Box, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CachedIcon from "@mui/icons-material/Cached";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useRef, useState } from "react";
import { Table, TableBody, Paper, Button } from "@mui/material";
import Service from "../../../../models/ServiceModel";
import TcService from "../../../../services/UserService";
import CustomModal from "../../../atoms/common/modals/CustomModal";
import {
  StyledCommonGrid,
  StyledDataTableCell,
  StyledHeaderBox,
  StyledOpenSearchBox,
  StyledOpenSearchGrid,
  StyledOuterBox,
  StyledTableHeadRow,
  StyledTablePagination,
  StyledTextField,
  StyledTypography,
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
  TablePaginationRow,
  TablePaginationCell,
  StyledTableRow,
  StyledHeadTableCell,
} from "../groupPage/styledComponent";
const ServicePage = () => {
  const [data1, setData1] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [editItem, setEditItem] = useState<Service | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Service | undefined>(
    undefined,
  );

  const tableRef = useRef<HTMLTableElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const getServiceData = async () => {
    const response = await TcService.findAllServices();
    if (response) setData1(response?.data);
  };

  useEffect(() => {
    getServiceData();
  }, []);

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

  const sortedData = [...data1].sort((a: any, b: any) => {
    const aValue = sortColumn ? a[sortColumn] : null;
    const bValue = sortColumn ? b[sortColumn] : null;

    return sortDirection === "asc"
      ? aValue?.localeCompare(bValue)
      : bValue?.localeCompare(aValue);
  });

  const filteredData = sortedData.filter((item: any) =>
    item?.serviceName?.toLowerCase().includes(searchTerm?.toLowerCase()),
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleOpen = (
    operation: "edit" | "add" | "delete",
    itemData?: { id: number; serviceName: string },
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

  const handleAddNewItem = async (newItem: string) => {
    if (newItem.trim() !== "") {
      const newService: Service = {
        serviceName: newItem,
      };

      try {
        const response = await TcService.createService(newService);
        setData1((prevData) => [...prevData, response.data]);
      } catch (error) {
        console.error("Error creating service:", error);
      }
    }
    handleClose();
  };

  const handleEditItem = async (editedItem: Service) => {
    try {
      // @ts-ignore
      await TcService.updateService(editedItem);
      const updatedData = data1.map((item) =>
        item.serviceId === editedItem.serviceId ? editedItem : item,
      );
      setData1(updatedData);
    } catch (error) {
      console.error("Error updating service:", error);
    }
    handleClose();
  };

  const handleDeleteItem = async (id: number | undefined) => {
    if (id !== undefined) {
      try {
        await TcService.deleteService(id);
        const updatedData = data1.filter((item) => item.serviceId !== id);
        setData1(updatedData);
        if ((data1.length - 1) % rowsPerPage === 0 && page > 0) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Error deleting service:", error);
      }
      handleClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(search);
  };

  const handleReset = () => {
    setSearch("");
    setSearchTerm("");
  };

  const handleToggleSearch = () => {
    setOpenSearch(!openSearch);
    if (!openSearch) {
      setSearch("");
      setSearchTerm("");
    }
  };

  const handleRowSelect = (row: Service) => {
    setSelectedRow(row);
  };

  return (
    <>
      <StyledOuterBox>
        <StyledHeaderBox className="card-header">
          Service Overview
        </StyledHeaderBox>
        <StyledOpenSearchBox m={2} pb={1} component={Paper}>
          {openSearch && (
            <StyledOpenSearchGrid>
              <StyledCommonGrid
                container
                spacing={1.5}
                my={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <StyledCommonGrid item xs={12} sm={6} md={3} sx={{ ml: 1 }}>
                  <StyledTypography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    Service Name
                  </StyledTypography>
                  <StyledTextField
                    fullWidth
                    id="standard-bare"
                    variant="outlined"
                    value={search}
                    onChange={handleInputChange}
                  />
                </StyledCommonGrid>
                <StyledCommonGrid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  sx={{ textAlign: "end", pr: 1.5, mt: 6 }}
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
                </StyledCommonGrid>
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
              <StyledTableHeadRow
                sx={{ backgroundColor: "#006487", height: "40px" }}
              >
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
              <TableBody>
                {paginatedData.map((service) => (
                  <StyledTableRow
                    key={service.serviceId}
                    selected={selectedRow?.serviceId === service.serviceId}
                    onClick={() => handleRowSelect(service)}
                    sx={{ cursor: "pointer" }}
                  >
                    <StyledDataTableCell>
                      {service.serviceName}
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

            <CustomModal
              open={open}
              onClose={handleClose}
              operation={operationType}
              handleAddNewItem={handleAddNewItem}
              // @ts-ignore
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

export default ServicePage;
