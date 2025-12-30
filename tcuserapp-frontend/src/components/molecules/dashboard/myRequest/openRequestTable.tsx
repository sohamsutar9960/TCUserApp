import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TablePagination,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useState } from "react";
import MyRequestCustomModal from "../../../atoms/common/modals/MyRequestCustomModal";
import { User } from "./index"; // Adjust the import path if needed
import {
  StyledGroupDataTableCell,
  StyledHeadTableCell,
  StyledTableHeadRow,
  StyledTableRow,
} from "../groupPage/styledComponent";

interface HistoryLog {
  creationDate: string;
  // other properties if needed
}

interface System {
  systemName: string;
  // other properties if needed
}

interface CostManager {
  displayName: string;
  // other properties if needed
}

export interface UserRequest {
  userRequestForAnother?: {
    displayName: string,
    gid: string
  };
  userRequestSelf? : {
    displayName: string,
    gid: string
  };
  historyLogList: HistoryLog[];
  createdBy: User;
  system: System;
  userRequest_TypeOfRequest: string;
  requestId: number;
  gid: string;
  requestStatus: string;
  costManagerSelf: CostManager | null;
  costManagerForAnother: CostManager;
  creationDate: string;
  
  // other properties
}

export interface OpenRequestTableProps {
  openRequests: UserRequest[];
  refreshData: () => void;
}

const OpenRequestTable: React.FC<OpenRequestTableProps> = ({
  openRequests,
  refreshData,
}) => {
  const [open, setOpen] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "edit" | "delete">(
    "add",
  );
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const [myRequestFormData, setMyRequestFormData] = useState<UserRequest |  undefined>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);

  const handleOpen = (
    operation: "edit" | "add" | "delete",
    requestId: number,
    rowData: UserRequest
  ) => {
    setOperationType(operation);
    setSelectedRequestId(requestId);
    setOpen(true);
    setMyRequestFormData(rowData);
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

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc",
    );
  };

  const sortedData = [...openRequests].sort((a, b) => {
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
    <>
      <Box sx={{ m: 2.5 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#777", height: "40px", pr: 10 }}>
            <StyledTableHeadRow>
              <StyledHeadTableCell
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "15%",
                  textAlign: "center",
                }}
                onClick={() => handleSort("requestId")}
              >
                Request ID
                {sortColumn === "requestId" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </StyledHeadTableCell>
              <StyledHeadTableCell
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "15%",
                }}
                onClick={() => handleSort("requestStatus")}
              >
                Request Status
                {sortColumn === "requestStatus" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </StyledHeadTableCell>
              <StyledHeadTableCell
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "15%",
                }}
                onClick={() => handleSort("userRequest_TypeOfRequest")}
              >
                Request Type
                {sortColumn === "userRequest_TypeOfRequest" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </StyledHeadTableCell>
              <StyledHeadTableCell
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "15%",
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
                  width: "15%",
                }}
                onClick={() => handleSort("displayName")}
              >
                Display Name
                {sortColumn === "displayName" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </StyledHeadTableCell>
              <StyledHeadTableCell
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "15%",
                }}
                onClick={() => handleSort("manager")}
              >
                Manager
                {sortColumn === "manager" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </StyledHeadTableCell>
              <StyledHeadTableCell
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "15%",
                }}
                onClick={() => handleSort("createdDate")}
              >
                Created Date
                {sortColumn === "createdDate" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </StyledHeadTableCell>
              <StyledHeadTableCell
                sx={{
                  color: "white",
                  cursor: "pointer",
                  width: "15%",
                }}
              >
                Actions
              </StyledHeadTableCell>
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
                  {request?.userRequestForAnother != null ? request.userRequestForAnother.displayName : request?.userRequestSelf?.displayName}
                </StyledGroupDataTableCell>
                <StyledGroupDataTableCell>
                  {request.costManagerSelf
                    ? request.costManagerSelf.displayName
                    : request.costManagerForAnother.displayName}
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
                    disabled={request.requestStatus !== "Request_Created"}
                    onClick={() => handleOpen("edit", request.requestId, request)}
                  >
                    <EditNoteIcon color="success" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpen("delete", request.requestId,request)}
                  >
                    <CancelIcon color="error" />
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
        <MyRequestCustomModal
          onClose={handleClose}
          openRequests={myRequestFormData}
          open={open}
          operation={operationType}
          requestId={selectedRequestId}
          refreshData={refreshData}
        />
      </Box>
    </>
  );
};

export default OpenRequestTable;
