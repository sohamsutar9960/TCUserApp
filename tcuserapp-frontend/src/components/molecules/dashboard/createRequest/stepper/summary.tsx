import React, { useState } from "react";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Box,
  TablePagination,
  Typography,
} from "@mui/material";
import { StyledHeadTableCell } from "../../groupPage/styledComponent";

interface SummaryProps {
  userRequest: any;
  dataChangeForSummary: (summaryData: any) => void;
  allPageData: any;
}

interface Role {
  id: number;
  groupNamePath: string;
  roleName: string;
  deleted: boolean;
}

const Summary = ({
  userRequest,
  dataChangeForSummary,
  allPageData,
}: SummaryProps) => {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(
    allPageData.assignedRoles || [],
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let displayUserName = allPageData?.userRequestForAnother?.DisplayName
    ? allPageData?.userRequestForAnother?.DisplayName
    : allPageData?.userRequestSelf?.DisplayName;
  let costManagerName = allPageData?.costManagerForAnother?.DisplayName
    ? allPageData?.costManagerForAnother?.DisplayName
    : allPageData?.costManagerSelf?.DisplayName;
  let userName =
    allPageData?.userHistory?.tcUserId !== ""
      ? allPageData?.userHistory?.tcUserId
      : allPageData?.userRequestForAnother?.gid?.toLowerCase();
  let UserGid =
    allPageData?.userHistory?.gid !== undefined
      ? allPageData?.userHistory?.gid
      : allPageData?.userRequestForAnother?.gid;

  const data = {
    Username: userName || "",
    DisplayName: displayUserName || "",
    GID: UserGid || "",
    DefaultGroup: allPageData?.defaultGroup || "",
    DefaultVolume: allPageData?.volume?.volumeName || "",
    CostManager: costManagerName || "",
    OSUser: allPageData?.tcOSUserName || "",
    IPClearance: allPageData?.ipClearance || "",
    Geography: allPageData?.country?.countryCode || "",
    Nationality: allPageData?.country?.countryCode || "",
    CommentsForApproving: allPageData?.commentsForApprover || "",
    NeverLock: allPageData?.neverLock ? "Yes" : "No",
    RequestLicensingLevel:
      allPageData?.requestLicensingLevel === 1 ? "Occasional Author" : "Author",
    AccountType: allPageData?.userHistory?.tcAccountType || "",
  };

  return (
    <Grid container spacing={3} style={{ padding: "16px" }}>
      <Grid item xs={12} md={6}>
        <TableContainer component={Paper} style={{ marginBottom: "16px" }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "#006487",
                    color: "white",
                    padding: "12px 8px",
                    border: "1px solid #cccccc",
                    height: "30px",
                    fontSize: "0.875rem",
                  }}
                >
                  System Name
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#F2F2F2",
                    color: "black",
                    padding: "12px 8px",
                    border: "1px solid #cccccc",
                    fontSize: "0.875rem",
                  }}
                >
                  {allPageData?.system?.systemName || ""}
                </TableCell>
              </TableRow>
              {Object.entries(data).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#006487",
                      color: "white",
                      padding: "12px 8px",
                      border: "1px solid #cccccc",
                      height: "30px",
                      fontSize: "0.875rem",
                    }}
                  >
                    {key}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "#F2F2F2",
                      color: "black",
                      padding: "12px 8px",
                      border: "1px solid #cccccc",
                      fontSize: "0.875rem",
                    }}
                  >
                    {typeof value === "object" ? JSON.stringify(value) : value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={1} md={6}>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              backgroundColor: "#006487",
              color: "white",
              fontWeight: "bold",
              padding: "0.25rem 0.5rem",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            Selected Roles
          </Typography>
          <TableContainer component={Paper} sx={{ border: "1px solid #ccc" }}>
            <Table aria-label="customized table">
              <TableHead
                sx={{
                  backgroundColor: "#006487",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <TableRow>
                  <StyledHeadTableCell
                    sx={{
                      backgroundColor: "#006487",
                      color: "white",
                      fontWeight: "bold",
                      padding: "0.5rem",
                      fontSize: "0.775rem",
                    }}
                  >
                    Group Name
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      backgroundColor: "#006487",
                      color: "white",
                      fontWeight: "bold",
                      padding: "0.5rem",
                      fontSize: "0.775rem",
                    }}
                  >
                    Role Name
                  </StyledHeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedRoles
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          borderRight: "1px solid #ddd",
                          padding: "0.5rem",
                          textDecoration: row.deleted ? "line-through" : "none",
                        }}
                      >
                        {row.groupNamePath}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.75rem",
                          padding: "0.5rem",
                          textDecoration: row.deleted ? "line-through" : "none",
                        }}
                      >
                        {row.roleName}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={selectedRoles.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Summary;
