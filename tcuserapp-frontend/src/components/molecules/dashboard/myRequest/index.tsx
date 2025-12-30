import {
  Box,
  MenuItem,
  Paper,
  SelectChangeEvent,
  Tab,
  Tabs,
} from "@mui/material";
import OpenRequestTable from "./openRequestTable";
import CloseRequestTable from "./closeRequestTable";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import CloseRequestDetailsView from "./closeRequestDetails";
import { SyntheticEvent, useEffect, useState } from "react";
import TcMyRequest from "../../../../services/myRequestServices";
import { useAuth } from "../../../auth/AuthProvider/authProvider";
import {
  StyledDropdownModalInput,
  StyledHeaderBox,
  StyledOuterBox,
} from "../groupPage/styledComponent";
import { Backdrop, CircularProgress } from "@mui/material";

export interface User {
  historyLogList: any;
  gid: string;
  displayName: string;
  requestId: number;
  requestStatus: string;
  userRequest_TypeOfRequest: string;
  system: any;
  createdBy: any;
  costManagerSelf: any;
  costManagerForAnother: any;
  creationDate: string;
  userRequestSelf : {
    displayName: string, 
    gid: string
  };
  userRequestForAnother : {
    displayName: string,
    gid: string
  }
}

const MyRequest = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("MyRequest");
  const [openRequests, setOpenRequests] = useState<User[]>([]);
  const [closeRequests, setCloseRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const logInUserData = useAuth();
  const [userGID, setUserGID] = useState("");

  useEffect(() => {
    if (logInUserData && logInUserData.user) {
      setUserGID(logInUserData.user.user.gid);
    }
  }, [logInUserData]);

  useEffect(() => {
    if (userGID) {
      handleGoButton();
    }
  }, [userGID, selectedMenu]);

  const handleGoButton = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      if (selectedMenu === "MyRequest") {
        const response = await TcMyRequest.getMyRequest(userGID);
        setOpenRequests(response?.data.openRequests || []);
        setCloseRequests(response?.data.closeRequests || []);
      } else if (selectedMenu === "AllUserRequest") {
        const response = await TcMyRequest.getAllUserRequest(userGID);
        setOpenRequests(response?.data.openRequests || []);
        setCloseRequests(response?.data.closeRequests || []);
      }
    } catch (error) {
      console.error("Error fetching Request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuChange = (e: SelectChangeEvent<string>) => {
    const itemGo = e.target.value;
    setSelectedMenu(itemGo);
  };

  const handleRowClick = () => {
    setShowDetails(true);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { requestId } = useParams();

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const currentTab = location.pathname.endsWith("openRequests")
    ? "openRequests"
    : location.pathname.endsWith("closeRequests")
      ? "closeRequests"
      : "openRequests";

  const isDetailsView =
    location.pathname.includes("closeRequests") &&
    location.pathname.split("/").length > 4;

  return (
    <>
      {!showDetails && (
        <StyledOuterBox>
          <StyledHeaderBox>
            {requestId
              ? `Request ID - ${requestId} Search Result`
              : "My Request View"}
          </StyledHeaderBox>

          <Paper sx={{ m: 0.5, mt: requestId ? 8 : 0, px: 2 }} elevation={3}>
            {!isDetailsView && (
              <Box sx={{ width: "100%", mt: 9 }}>
                <Box sx={{ display: "flex", p: 1.5 }}>
                  <Box sx={{ width: "20%", mt: 1 }}>
                    <StyledDropdownModalInput
                      fullWidth
                      variant="outlined"
                      name="serviceId"
                      value={selectedMenu}
                      //@ts-ignore
                      onChange={handleMenuChange}
                    >
                      <MenuItem value="MyRequest">My Request</MenuItem>
                      <MenuItem value="AllUserRequest">
                        All User Request
                      </MenuItem>
                    </StyledDropdownModalInput>
                  </Box>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs value={currentTab} onChange={handleChange}>
                    <Tab label="Open Requests" value="openRequests" />
                    <Tab label="Close Requests" value="closeRequests" />
                  </Tabs>
                </Box>
              </Box>
            )}

            <Routes>
              <Route
                path="/*"
                element={<Navigate to="openRequests" replace />}
              />
              <Route
                path="openRequests"
                element={
                  <OpenRequestTable
                    openRequests={openRequests}
                    refreshData={handleGoButton}
                  />
                }
              />

              <Route path="closeRequests" element={<Outlet />}>
                <Route
                  index
                  element={<CloseRequestTable closeRequests={closeRequests} />}
                />
                <Route
                  path=":requestId"
                  element={
                    <CloseRequestDetailsView handleRowClick={handleRowClick} />
                  }
                />
              </Route>
            </Routes>
          </Paper>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </StyledOuterBox>
      )}
    </>
  );
};

export default MyRequest;
