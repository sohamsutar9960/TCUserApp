import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from "react-router";
import { CommonRequest } from "../../../../models/ManagerAndGroupRoleApproverModel";
import TcRoleApprover from "../../../../services/RoleApproverService";
import { graAllRequestsRoutes } from "../../../../routes/izGroupRoleApprover";
import { RequestProvider } from "../../../atoms/common/RoleApproverRequestProvider/RoleApproverRequestProvider";
import { StyledHeaderBox, StyledOuterBox } from "../groupPage/styledComponent";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabIndices {
  [key: string]: number;
}

type TabVisibility = boolean | (() => boolean);

const GraAllRequests = () => {
  const [openRequests, setOpenRequests] = useState<CommonRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<CommonRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<CommonRequest[]>([]);
  const [exportToTcRequests, setExportToTcRequests] = useState<CommonRequest[]>(
    [],
  );

  const navigate = useNavigate();
  const { "*": param } = useParams<{ "*": string | undefined }>();
  const isDetailView = param && param.split("/").length > 1;

  const getRoleApproverRequests = async () => {
    try {
      const response = await TcRoleApprover.getGroupRoleApproverAllRequests();
      if (response.data) {
        setOpenRequests(response.data?.openRequests);
        setApprovedRequests(response.data?.approvedRequests);
        setRejectedRequests(response.data?.rejectedRequests);
        setExportToTcRequests(response.data?.exportedRequests);
      }
    } catch (error) {
      console.error("not getting manager Requests");
    }
  };

  useEffect(() => {
    getRoleApproverRequests();
  }, []);

  const getVisibleTabIndices = useCallback(
    (tabs: [string, TabVisibility][]) =>
      tabs
        .filter((k) => (typeof k[1] === "boolean" ? k[1] : typeof k[1]()))
        .map((k, index) => ({
          [k[0]]: index,
        }))
        .reduce((acc, i) => Object.assign(acc, i)),
    [],
  );

  const tabIndices: TabIndices = useMemo(() => {
    const tabs: [string, TabVisibility][] = [
      ["openRequests", true],
      ["approvedRequests", true],
      ["rejectedRequests", true],
      ["exportToTc", true],
    ];

    return getVisibleTabIndices(tabs);
  }, [getVisibleTabIndices]);

  const activeTab = useMemo(() => param?.split("/")[0], [param]);

  const handleApproveRequest = (updatedRequest: CommonRequest) => {
    setApprovedRequests((prev) => [...prev, updatedRequest]);
    setOpenRequests((prev) =>
      prev.filter((request) => request.requestId !== updatedRequest.requestId),
    );
  };

  const handleRejectRequest = (updatedRequest: CommonRequest) => {
    setRejectedRequests((prev) => [...prev, updatedRequest]);
    setOpenRequests((prev) =>
      prev.filter((request) => request.requestId !== updatedRequest.requestId),
    );
  };

  const requestContextValue = {
    openRequests,
    approvedRequests,
    rejectedRequests,
    exportToTcRequests,
    handleApproveRequest,
    handleRejectRequest,
  };

  return (
    <RequestProvider value={requestContextValue}>
      <StyledOuterBox>
        <StyledHeaderBox>Group/Role Approver Request Overview</StyledHeaderBox>
        <Paper sx={{ mt: 10 }}>
          {!isDetailView && (
            <>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs value={activeTab}>
                    {graAllRequestsRoutes.map(
                      (page) =>
                        page.showOnNavigation &&
                        page.to in tabIndices && (
                          <Tab
                            key={page.to}
                            label={page.title}
                            value={page.to}
                            onClick={() => navigate(page.to)}
                            {...a11yProps(tabIndices[page.to])}
                          />
                        ),
                    )}
                  </Tabs>
                </Box>
              </Box>
              <Outlet />
            </>
          )}
          <Routes>
            {graAllRequestsRoutes.map((route) => (
              <Route key={route.to} path={route.to} element={route.component} />
            ))}
            <Route path="*" element={<Navigate to="openRequests" replace />} />
          </Routes>
        </Paper>
      </StyledOuterBox>
    </RequestProvider>
  );
};

export default GraAllRequests;
