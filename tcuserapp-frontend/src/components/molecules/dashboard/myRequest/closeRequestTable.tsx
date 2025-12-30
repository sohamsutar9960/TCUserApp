import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TablePagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  StyledGroupDataTableCell,
  StyledHeadTableCell,
  StyledTableHeadRow,
  StyledTableRow,
} from "../groupPage/styledComponent";

interface Request {
  historyLogList: any;
  createdBy: any;
  system: any;
  userRequest_TypeOfRequest: string;
  requestId: number;
  gid: string;
  requestStatus: string;
  costManagerSelf: any;
  costManagerForAnother: any;
  creationDate: string;
  userRequestForAnother : {
    displayName: string
  };
  userRequestSelf : {
    displayName: string
  }
  // other properties
}

interface closeRequestTableProps {
  closeRequests: Request[];
}

const CloseRequestTable: React.FC<closeRequestTableProps> = ({
  closeRequests,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const handleViewDetails = (requestId: number) => {
    navigate(`/home/myRequest/closeRequests/${requestId}`); // Navigate to the details page for the specific request
  };

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };

  const sortedData = [...closeRequests].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;

    switch (sortColumn) {
      case "requestId":
        aValue = a.requestId;
        bValue = b.requestId;
        break;
      case "requestStatus":
        aValue = a.requestStatus;
        bValue = b.requestStatus;
        break;
      case "userRequest_TypeOfRequest":
        aValue = a.userRequest_TypeOfRequest;
        bValue = b.userRequest_TypeOfRequest;
        break;
      case "systemName":
        aValue = a.system.systemName;
        bValue = b.system.systemName;
        break;
      case "displayName":
        aValue = a.createdBy.displayName;
        bValue = b.createdBy.displayName;
        break;
      case "manager":
        aValue = a.costManagerSelf
          ? a.costManagerSelf.displayName
          : a.costManagerForAnother.displayName;
        bValue = b.costManagerSelf
          ? b.costManagerSelf.displayName
          : b.costManagerForAnother.displayName;
        break;
      case "createdDate":
        aValue = new Date(a.historyLogList[0]?.creationDate);
        bValue = new Date(b.historyLogList[0]?.creationDate);
        break;
      default:
        return 0;
    }

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box sx={{ m: 2, pb: 3 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#777", height: "40px", pr: 10 }}>
          <StyledTableHeadRow>
            <StyledHeadTableCell
              sx={{ textAlign: "center" }}
              onClick={() => handleSort("requestId")}
            >
              Request ID
              {sortColumn === "requestId" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </StyledHeadTableCell>
            <StyledHeadTableCell onClick={() => handleSort("requestStatus")}>
              Request Status
              {sortColumn === "requestStatus" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </StyledHeadTableCell>
            <StyledHeadTableCell
              onClick={() => handleSort("userRequest_TypeOfRequest")}
            >
              Request Type
              {sortColumn === "userRequest_TypeOfRequest" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </StyledHeadTableCell>
            <StyledHeadTableCell onClick={() => handleSort("systemName")}>
              System Name
              {sortColumn === "systemName" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </StyledHeadTableCell>
            <StyledHeadTableCell onClick={() => handleSort("displayName")}>
              Display Name
              {sortColumn === "displayName" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </StyledHeadTableCell>
            <StyledHeadTableCell onClick={() => handleSort("manager")}>
              Manager
              {sortColumn === "manager" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </StyledHeadTableCell>
            <StyledHeadTableCell onClick={() => handleSort("createdDate")}>
              Created Date
              {sortColumn === "createdDate" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </StyledHeadTableCell>
            <StyledHeadTableCell sx={{ mr: 0 }}>Actions</StyledHeadTableCell>
          </StyledTableHeadRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((request) => (
            <StyledTableRow key={request.gid}>
              <StyledGroupDataTableCell sx={{ textAlign: "center" }}>
                {request.requestId}
              </StyledGroupDataTableCell>
              <StyledGroupDataTableCell>
                {request.requestStatus.replace(/_/g, " ")}
              </StyledGroupDataTableCell>
              <StyledGroupDataTableCell>
                {request.userRequest_TypeOfRequest.replace(/_/g, " ")}
              </StyledGroupDataTableCell>
              <StyledGroupDataTableCell>
                {request.system.systemName}
              </StyledGroupDataTableCell>
              <StyledGroupDataTableCell>
                {request?.userRequestForAnother != null ? request.userRequestForAnother.displayName : request.userRequestSelf.displayName}
              </StyledGroupDataTableCell>
              <StyledGroupDataTableCell>
                {request.costManagerSelf === null
                  ? request.costManagerForAnother.displayName
                  : request.costManagerSelf.displayName}
              </StyledGroupDataTableCell>
              <StyledGroupDataTableCell>
                {
                  request.creationDate
                    ? new Date(request.creationDate).toLocaleDateString()
                    : "-" // Or any placeholder text if creationDate is null
                }
              </StyledGroupDataTableCell>
              <StyledGroupDataTableCell>
                <IconButton
                  onClick={() => handleViewDetails(request.requestId)}
                >
                  <VisibilityIcon color="primary" />
                </IconButton>
              </StyledGroupDataTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Box>
        <TablePagination
          component="div"
          rowsPerPageOptions={[8, 16, 24]}
          count={sortedData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default CloseRequestTable;
