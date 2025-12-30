import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
  styled,
  TablePagination,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { AssignedRole } from "../../../../models/ManagerAndGroupRoleApproverModel";

export interface GroupRole {
  roleName?: string;
  groupName?: string;
  groupNamePath?: string;
}

interface Props {
  openPopup?: boolean | undefined;
  getSelectedRoles?: (selected: AssignedRole[]) => void;
  searchedRoles?: GroupRole[];
  setOpenPopup: (popState: boolean | undefined) => void;
}

const GraSearchModal: React.FC<Props> = ({
  openPopup,
  searchedRoles,
  setOpenPopup,
  getSelectedRoles,
}) => {
  const [selected, setSelected] = useState<GroupRole[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [roles, setRoles] = useState<GroupRole[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSelect = (groupRole: GroupRole) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(groupRole)) {
        return prevSelected.filter((gr) => gr !== groupRole);
      } else {
        return [...prevSelected, groupRole];
      }
    });
  };
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(roles);
    } else {
      setSelected([]);
    }
  };

  useEffect(() => {
    if (searchedRoles) {
      setRoles(searchedRoles);
    }
    setLoading(false);
  }, [searchedRoles]);

  const handleOk = () => {
    if (getSelectedRoles && selected.length > 0) {
      getSelectedRoles(selected);
      setOpenPopup(false);
    }
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
  const StyledDialogContent = styled(DialogContent)({
    padding: "16px",
    margin: "8px",
  });
  const StyledTableHeadRow = styled(TableRow)({
    backgroundColor: "#006487",
  });
  const StyledHeadTableCell = styled(TableCell)({
    padding: 8,
    marginLeft: 7,
    borderBottom: "none",
    border: "1px solid #E0E0E0",
    textAlign: "left",
  });
  const StyledDataTableCell = styled(TableCell)({
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 7,
    borderBottom: "none",
    border: "1px solid #E0E0E0",
    textAlign: "left",
  });
  const StyledTableRow = styled(TableRow)({
    padding: 0,
  });

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : searchedRoles ? (
        <Box sx={style}>
          <Dialog
            //   @ts-ignore
            open={openPopup}
            PaperProps={{
              style: {
                display: "flex",
                justifyContent: "center",
                minWidth: "60%",
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: "#006487",
                color: "white",
                display: "flex",
                alignItems: "center",
                fontSize: "1.1rem",
              }}
              height={10}
            >
              Select Roles
              <IconButton
                aria-label="close"
                sx={{
                  position: "absolute",
                  right: 8,
                  color: "inherit",
                }}
                onClick={() => setOpenPopup(false)}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitle>

            <StyledDialogContent>
              <Box component={Paper} sx={{ p: 2 }}>
                <Table>
                  <TableHead>
                    <StyledTableHeadRow>
                      <StyledHeadTableCell sx={{ width: "10%" }}>
                        <Checkbox
                          checked={
                            selected.length === roles.length && roles.length > 0
                          }
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < roles.length
                          }
                          onChange={handleSelectAll}
                        />
                      </StyledHeadTableCell>
                      <StyledHeadTableCell sx={{ color: "#fff", width: "40%" }}>
                        Role Name
                      </StyledHeadTableCell>
                      <StyledHeadTableCell sx={{ color: "#fff", width: "40%" }}>
                        Group Name
                      </StyledHeadTableCell>
                    </StyledTableHeadRow>
                  </TableHead>
                  <TableBody>
                    {roles
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((role, index) => (
                        <StyledTableRow key={index}>
                          <StyledDataTableCell>
                            <Checkbox
                              color="primary"
                              checked={selected.includes(role)}
                              onChange={() => handleSelect(role)}
                            />
                          </StyledDataTableCell>
                          <StyledDataTableCell>
                            {role.roleName}
                          </StyledDataTableCell>
                          <StyledDataTableCell>
                            {role.groupNamePath}
                          </StyledDataTableCell>
                        </StyledTableRow>
                      ))}
                    <StyledTableRow sx={{ border: "1px solid #E0E0E0;" }}>
                      <TableCell colSpan={9}>
                        <TablePagination
                          className="pagination"
                          component="div"
                          rowsPerPageOptions={[8, 16, 24]}
                          count={searchedRoles.length}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </Box>
            </StyledDialogContent>

            <DialogActions sx={{ backgroundColor: "#f5f7fa" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenPopup(false)}
              >
                Cancel
              </Button>
              <Button variant="contained" color="success" onClick={handleOk}>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <Typography>No results found.</Typography>
      )}
    </>
  );
};

export default GraSearchModal;
