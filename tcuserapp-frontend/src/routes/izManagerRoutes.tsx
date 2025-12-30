import HomeIcon from "@mui/icons-material/Home";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppRoute } from "../components/atoms/common/interfaces";
import ProfilePage from "../components/molecules/dashboard/profilePage";
import MyRequest from "../components/molecules/dashboard/myRequest";
import CreateRequest from "../components/molecules/dashboard/createRequest/stepperComponent";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import MgAllRequests from "../components/molecules/dashboard/mgAllRequests";
import ManagerHome from "../components/molecules/dashboard/managerHome/managerHome";
import OpenRequestTable from "../components/molecules/dashboard/myRequest/openRequestTable";
import CloseRequestTable from "../components/molecules/dashboard/myRequest/closeRequestTable";
import CloseRequestDetailsView from "../components/molecules/dashboard/myRequest/closeRequestDetails";
import MgRequestTable from "../components/atoms/common/mgRequestsTable/mgRequestsTable";
import MgNestedDetailsView from "../components/atoms/common/mgNestedDetailsView/mgNestedDetailsView";
import { Navigate } from "react-router";

export const mgAllRequestsRoutes: AppRoute[] = [
  {
    showOnNavigation: true,
    title: "Open Requests",
    to: "openRequests",
    component: <MgRequestTable />,
  },
  {
    showOnNavigation: false,
    title: "Open Requests",
    to: "openRequests/:requestId",
    component: <MgNestedDetailsView />,
  },
  {
    showOnNavigation: true,
    title: "Approved Requests",
    to: "approvedRequests",
    component: <MgRequestTable />,
  },
  {
    showOnNavigation: false,
    title: "Approved Requests",
    to: "approvedRequests/:requestId",
    component: <MgNestedDetailsView />,
  },
  {
    showOnNavigation: true,
    title: "Rejected Requests",
    to: "rejectedRequests",
    component: <MgRequestTable />,
  },
  {
    showOnNavigation: false,
    title: "Rejected Requests",
    to: "rejectedRequests/:requestId",
    component: <MgNestedDetailsView />,
  },
  {
    to: "*",
    title: "Open Requests",
    component: <Navigate to="openRequests" replace={true} />,
  },
];

export const nestedRoutes: AppRoute[] = [
  {
    showOnNavigation: true,
    icon: <NoteAddIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "Create Request",
    to: "createRequest",
    component: <CreateRequest />,
  },
  {
    showOnNavigation: true,
    icon: <AssignmentIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "My Request",
    to: "myRequest/*",
    component: <MyRequest />,
    nestedRoutes: [
      {
        showOnNavigation: true,
        title: "Open Requests",
        to: "openRequests",
        component: (
          <OpenRequestTable
            openRequests={[]}
            refreshData={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        ),
      },
      {
        showOnNavigation: true,
        title: "Close Requests",
        to: "closeRequests/*",
        component: <CloseRequestTable closeRequests={[]} />,
        nestedRoutes: [
          {
            showOnNavigation: false,
            title: "Request Details",
            to: ":requestId",
            component: (
              <CloseRequestDetailsView
                handleRowClick={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            ),
          },
        ],
      },
    ],
  },
  {
    showOnNavigation: true,
    icon: <GroupsIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "All User Requests",
    to: "mgAllRequests/*",
    component: <MgAllRequests />,
    nestedRoutes: mgAllRequestsRoutes,
  },
];

export const izManagerRoutes: AppRoute[] = [
  {
    showOnNavigation: true,
    icon: <HomeIcon sx={{ color: "#fff" }} fontSize="small" />,
    title: "Home",
    to: "home/*",
    component: <ManagerHome />,
    nestedRoutes: nestedRoutes,
  },
  {
    showOnNavigation: true,
    icon: <LogoutIcon sx={{ color: "#fff" }} fontSize="small" />,
    title: "Log Out",
    to: "login",
  },
  {
    showOnNavigation: true,
    icon: <AccountCircleRoundedIcon sx={{ color: "#fff" }} fontSize="small" />,
    title: "Profile",
    to: "profile",
    component: <ProfilePage />,
  },
];
