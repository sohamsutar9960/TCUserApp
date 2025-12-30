import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CommonRequest } from "../../../../models/ManagerAndGroupRoleApproverModel";
import { useRequestContext } from "../ManagerRequestProvider/ManagerRequestProvider";
import {
  StyledDataTableCell,
  StyledHeadTableCell,
  StyledTableHeadRow,
  StyledTableRow,
} from "../../../molecules/dashboard/groupPage/styledComponent";
interface Props {
  handleRowClick?: () => void;
}

const MgRequestTable = (props: Props) => {
  const { openRequests, approvedRequests, rejectedRequests } =
    useRequestContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [requestData, setRequestData] = useState<CommonRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { "*": requestType } = useParams();

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
  useEffect(() => {
    setLoading(true);
    let requests: CommonRequest[] = [];

    switch (requestType) {
      case "openRequests":
        requests = openRequests;
        break;
      case "approvedRequests":
        requests = approvedRequests;
        break;
      case "rejectedRequests":
        requests = rejectedRequests;
        break;
      default:
        requests = openRequests;
    }

    setRequestData(requests);
    setLoading(false);
  }, [requestType, openRequests, approvedRequests, rejectedRequests]);
  const handleViewDetails = (requestId: number) => {
    if (requestId) {
      navigate(`/home/mgAllRequests/${requestType}/${requestId}`);
    }
  };

  return (
    <>
      <Box sx={{ m: 2, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                sx={{ backgroundColor: "#777", height: "40px", pr: 10 }}
              >
                <StyledTableHeadRow>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                  >
                    Request ID
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                  >
                    System Name
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                  >
                    Requested By
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                  >
                    Requested For
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                  >
                    Department
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                  >
                    Location
                  </StyledHeadTableCell>
                  <StyledHeadTableCell
                    sx={{
                      color: "white",
                      cursor: "pointer",
                      width: "15%",
                    }}
                  >
                    Requested Date
                  </StyledHeadTableCell>
                </StyledTableHeadRow>
              </TableHead>
              <TableBody>
                {requestData &&
                  requestData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((request) => (
                      <StyledTableRow key={request.requestId}>
                        <StyledDataTableCell
                          sx={{ color: "#eb780a", cursor: "pointer" }}
                          // @ts-ignore
                          onClick={() => handleViewDetails(request?.requestId)}
                        >
                          {request.requestId}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {request.system?.systemName}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {request.createdBy?.displayName}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {request.userRequestSelf
                            ? request.userRequestSelf?.displayName
                            : request.userRequestForAnother?.displayName}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {request.userRequestSelf
                            ? request.userRequestSelf.department
                            : request.userRequestForAnother?.department}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {request.userRequestSelf
                            ? request.userRequestSelf.country
                            : request.userRequestForAnother?.country}
                        </StyledDataTableCell>
                        <StyledDataTableCell>
                          {request.creationDate ? request.creationDate : "-"}
                        </StyledDataTableCell>
                      </StyledTableRow>
                    ))}
              </TableBody>
            </Table>
            <Box>
              <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25]}
                count={requestData.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </TableContainer>
        )}
      </Box>
    </>
  );
};

export default MgRequestTable;
