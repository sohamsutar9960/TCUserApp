import { useEffect, useState } from "react";
import { ChangeEvent, MouseEvent } from "react";
import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Paper,
  Box,
} from "@mui/material";
import { useParams } from "react-router";
import TcMyRequest from "../../../../../services/myRequestServices";
import {
  StyledDataTableCell,
  StyledGroupDataTableCell,
  StyledHeadTableCell,
  StyledTableHeadRow,
  StyledTablePagination,
  StyledTableRow,
  TablePaginationCell,
} from "../../groupPage/styledComponent";
import { Backdrop, CircularProgress } from "@mui/material";
interface RequestHistoryTableProps {
  handleRowClick: () => void;
  historyLogList?: historyLogList[];
  userDetail: UserDetail | null;
}
interface Props {
  handleRowClick: () => void;
}
interface AssignedRole {
  assignedRoleId: number;
  roleName: string;
  isAssigned: boolean;
  groupNamePath: string;
  groupName: string;
  deleted: boolean;
}
interface historyLogList {
  [x: string]: string | number | Date;
  historyId: number;
  displayName: string;
  comments: string;
  createdDate: any;
}
interface UserDetail {
  requestStatus: string;
  createdBy: {
    displayName: string;
    fullName: string;
    gid: string;
    department: string;
    email: string;
  };
  system: {
    systemName: string;
  };
  country: {
    countryCode: string;
  };
  ipClearance: string;
  assignedRoles: AssignedRole[];
  creationDate: any;
  userRequestSelf: any;
  userRequestForAnother: any;
  userRequest_TypeOfRequest: string;
  historyLogList: historyLogList[];
  costManagerForAnother: any;
  costManagerSelf: any;
  defaultGroup: string;
  commentsForApprover?: string;
}

const CloseRequestDetailsView = (props: Props) => {
  const { handleRowClick } = props;
  const { requestId } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (requestId) {
        const numericRequestId = parseInt(requestId, 10);
        if (!isNaN(numericRequestId)) {
          try {
            const response = await TcMyRequest.getRequestById(numericRequestId);
            if (response?.data) {
              setUserDetail(response.data);
            }
          } catch (error) {
            console.error("Error fetching Request:", error);
          } finally {
            setLoading(false);
          }
        } else {
          console.error("Invalid requestId, not a number:", requestId);
        }
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  const userDetails = [
    { label: " Requested By:", value: userDetail?.createdBy.displayName },
    { label: "GID:", value: userDetail?.createdBy.gid },
    { label: "Department:", value: userDetail?.createdBy.department },
    { label: "Location:", value: userDetail?.country.countryCode },
    { label: "Email:", value: userDetail?.createdBy.email },
    { label: "IP Clearance:", value: userDetail?.ipClearance },
    {
      label: "Requested For:",
      value: userDetail?.userRequestSelf
        ? userDetail?.createdBy.displayName
        : userDetail?.userRequestForAnother.displayName,
    },
    { label: "Requested Date:", value: userDetail?.creationDate || "-" },
    { label: "Default Group:", value: userDetail?.defaultGroup },
    { label: "UserComment:", value: userDetail?.commentsForApprover },
  ];

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getBackgroundColor = (tabNum: any): string => {
    const status = userDetail?.requestStatus;
    switch (status) {
      case "Request_Cancelled":
        return tabNum <= 1 ? "#F44336" : "#01B4CD47";

      case "Rejected_By_Cost_Manager":
        return tabNum <= 2 ? "#F44336" : "#01B4CD47";

      case "Rejected_By_GroupRole_Approver":
        return tabNum <= 3 ? "#F44336" : "#01B4CD47";

      case "Exported_To_Target_System":
        return (tabNum = "#01B4CD47");

      default:
        return "#01B4CD47";
    }
  };
  const paginatedData = userDetail?.assignedRoles?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Grid container spacing={2} px={1}>
      <Grid container item xs={12} spacing={2} mt={0.5}>
        <Grid item xs={4} textAlign="left">
          <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>
            <strong>Request Status:</strong>{" "}
            {userDetail?.requestStatus.replace(/_/g, " ") || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={4} textAlign="center">
          <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>
            <strong>Request Date:</strong> {userDetail?.creationDate || "-"}
          </Typography>
        </Grid>
        <Grid item xs={4} textAlign="right">
          <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>
            <strong>Request Type:</strong>{" "}
            {userDetail?.userRequest_TypeOfRequest.replace(/_/g, " ") || "N/A"}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2} mt={0.5}>
        <Grid item xs={3} textAlign="center">
          <Typography
            variant="h6"
            bgcolor={getBackgroundColor(1)}
            sx={{ fontSize: "0.9rem", p: 0.3 }}
          >
            <strong>
              {userDetail?.requestStatus === "Request_Cancelled"
                ? "Request Cancelled"
                : "Request Created"}
            </strong>
          </Typography>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Typography
            variant="h6"
            bgcolor={getBackgroundColor(2)}
            sx={{ fontSize: "0.9rem", p: 0.3 }}
          >
            <strong>
              {userDetail?.requestStatus === "Rejected_By_Cost_Manager"
                ? "Request Cancelled by Manager"
                : "User Approved"}
            </strong>
          </Typography>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Typography
            variant="h6"
            bgcolor={getBackgroundColor(3)}
            sx={{ fontSize: "0.9rem", p: 0.3 }}
          >
            <strong>
              {userDetail?.requestStatus === "Rejected_By_GroupRole_Approver"
                ? "Rejected By GroupRole Approver"
                : "Roles Approved"}
            </strong>
          </Typography>
        </Grid>
        <Grid item xs={3} textAlign="center">
          <Typography
            variant="h6"
            bgcolor={getBackgroundColor(4)}
            sx={{ fontSize: "0.9rem", p: 0.3 }}
          >
            <strong>
              {userDetail?.requestStatus === "Exported_To_Target_System"
                ? "Approved"
                : "Exported to target System"}
            </strong>
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} mt={2}>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          bgcolor="#006487"
          px={2}
        >
          <Typography
            variant="h6"
            color="white"
            sx={{ fontSize: "1rem", p: 0.3 }}
          >
            Requested By : {userDetail?.createdBy.displayName}
          </Typography>
          <Typography
            variant="h6"
            color="white"
            sx={{ fontSize: "1rem", p: 0.3 }}
          >
            ID : {requestId} System : {userDetail?.system.systemName}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12} mt={-2}>
        <Grid item xs={4} bgcolor="#c1b7b7" p={2}>
          {userDetails.slice(0, 6).map((detail, index) => (
            <Box key={index} display="flex">
              <Typography
                variant="body1"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  marginRight: "8px",
                }}
              >
                {detail.label}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "0.8rem" }}>
                {detail.value}
              </Typography>
            </Box>
          ))}
        </Grid>
        <Grid item xs={4} bgcolor="#c1b7b7" p={2}>
          {userDetails.slice(6, 10).map((detail, index) => (
            <Box key={index} display="flex">
              <Typography
                variant="body1"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  marginRight: "8px",
                }}
              >
                {detail.label}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "0.8rem" }}>
                {detail.value}
              </Typography>
            </Box>
          ))}
        </Grid>
        <Grid item xs={4} bgcolor="#c1b7b7" p={2}>
          <Box style={{ border: "1px solid #ccc" }}>
            <Table>
              <TableHead>
                <StyledTableHeadRow>
                  <StyledHeadTableCell sx={{ color: "white" }}>
                    Selected Roles
                  </StyledHeadTableCell>
                </StyledTableHeadRow>
              </TableHead>
            </Table>

            <Box bgcolor="white">
              <TableContainer
                component={Paper}
                style={{ border: "1px solid #ccc" }}
              >
                <Table>
                  <TableHead>
                    <StyledTableHeadRow sx={{ backgroundColor: "#006487" }}>
                      <StyledHeadTableCell
                        sx={{
                          color: "white",
                          textAlign: "left",
                          width: "45%",
                        }}
                      >
                        Group Name
                      </StyledHeadTableCell>
                      <StyledHeadTableCell
                        sx={{
                          color: "white",
                          textAlign: "left",
                          width: "45%",
                        }}
                      >
                        Role Name
                      </StyledHeadTableCell>
                    </StyledTableHeadRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData?.map((row, index) => (
                      <StyledTableRow
                        key={index}
                        sx={{
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <StyledGroupDataTableCell
                          sx={{
                            textAlign: "left",
                            textDecoration:
                              row.deleted === true ? "line-through" : "none",
                          }}
                        >
                          {row.groupName}
                        </StyledGroupDataTableCell>
                        <StyledGroupDataTableCell
                          sx={{
                            textAlign: "left",
                            textDecoration:
                              row.deleted === true ? "line-through" : "none",
                          }}
                        >
                          {row.roleName}
                        </StyledGroupDataTableCell>
                      </StyledTableRow>
                    ))}
                    <StyledTableRow>
                      <TablePaginationCell colSpan={3}>
                        <StyledTablePagination
                          count={userDetail?.assignedRoles?.length || 0}
                          page={page}
                          onPageChange={handleChangePage}
                          rowsPerPage={rowsPerPage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          rowsPerPageOptions={[3, 6, 9]}
                        />
                      </TablePaginationCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={12} mt={2} mb={4}>
        <RequestHistoryTable
          handleRowClick={handleRowClick}
          historyLogList={userDetail?.historyLogList || []}
          userDetail={userDetail}
        />
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading} // Controls visibility of Backdrop
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
};
function RequestHistoryTable(props: RequestHistoryTableProps) {
  const { historyLogList, userDetail } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc",
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...(historyLogList || [])].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn as keyof historyLogList];
      const bValue = b[sortColumn as keyof historyLogList];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        return 0;
      }
    }
    return 0;
  });

  // Apply pagination after sorting
  const paginatedDataRequestHistory = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableHeadRow sx={{ backgroundColor: "#006487" }}>
            <StyledHeadTableCell
              sx={{
                color: "white",
              }}
            >
              Display Name
            </StyledHeadTableCell>
            <StyledHeadTableCell
              sx={{
                color: "white",
              }}
            >
              Comments
            </StyledHeadTableCell>
            <StyledHeadTableCell
              sx={{
                color: "white",
              }}
            >
              Created Date
            </StyledHeadTableCell>
          </StyledTableHeadRow>
        </TableHead>
        <TableBody>
          {paginatedDataRequestHistory.length > 0 ? (
            paginatedDataRequestHistory
              .map((row) => (
                <StyledTableRow key={row.historyId}>
                  <StyledDataTableCell>
                    {userDetail?.userRequestSelf
                      ? userDetail?.createdBy.displayName
                      : userDetail?.userRequestForAnother.displayName}
                  </StyledDataTableCell>
                  <StyledDataTableCell>{row.comments}</StyledDataTableCell>
                  <StyledDataTableCell>
                    {row?.creationDate
                      ? new Date(row.creationDate).toLocaleDateString()
                      : "-"}
                  </StyledDataTableCell>
                </StyledTableRow>
              ))
          ) : (
            <StyledTableRow>
              <StyledDataTableCell colSpan={4} align="center">
                No history available
              </StyledDataTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
      
      <StyledTablePagination
         count={historyLogList?.length || 0}
         page={page}
         onPageChange={handleChangePage}
         rowsPerPage={rowsPerPage}
         onRowsPerPageChange={handleChangeRowsPerPage}
         rowsPerPageOptions={[8, 16, 24]}
      />
    </TableContainer>
  );
}

export default CloseRequestDetailsView;
