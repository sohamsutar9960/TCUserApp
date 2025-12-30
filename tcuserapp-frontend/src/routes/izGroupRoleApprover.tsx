import HomeIcon from "@mui/icons-material/Home";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppRoute } from "../components/atoms/common/interfaces";
import ProfilePage from "../components/molecules/dashboard/profilePage";
import MyRequest from "../components/molecules/dashboard/myRequest";
import CreateRequest from "../components/molecules/dashboard/createRequest/stepperComponent";
import GroupsIcon from "@mui/icons-material/Groups";
import OpenRequestTable from "../components/molecules/dashboard/myRequest/openRequestTable";
import CloseRequestTable from "../components/molecules/dashboard/myRequest/closeRequestTable";
import CloseRequestDetailsView from "../components/molecules/dashboard/myRequest/closeRequestDetails";
import GraAllRequests from "../components/molecules/dashboard/graAllRequests";
import GraHome from "../components/molecules/dashboard/graHome/graHome";
import GraRequestTable from "../components/atoms/common/graRequestsTable/graRequestsTable";
import GraNestedDetailsView from "../components/atoms/common/graNestedDetailsView/graNestedDetailsView";
import { Navigate } from "react-router";

export const graAllRequestsRoutes: AppRoute[] = [
  {
    showOnNavigation: true,
    title: "Open Requests",
    to: "openRequests",
    component: <GraRequestTable />,
  },
  {
    showOnNavigation: false,
    title: "Open Requests",
    to: "openRequests/:requestId",
    component: <GraNestedDetailsView />,
  },
  {
    showOnNavigation: true,
    title: "Approved Requests",
    to: "approvedRequests",
    component: <GraRequestTable />,
  },
  {
    showOnNavigation: false,
    title: "Approved Requests",
    to: "approvedRequests/:requestId",
    component: <GraNestedDetailsView />,
  },
  {
    showOnNavigation: true,
    title: "Rejected Requests",
    to: "rejectedRequests",
    component: <GraRequestTable />,
  },
  {
    showOnNavigation: false,
    title: "Rejected Requests",
    to: "rejectedRequests/:requestId",
    component: <GraNestedDetailsView />,
  },
  {
    showOnNavigation: true,
    title: "Export To Tc",
    to: "exportToTc",
    component: <GraRequestTable />,
  },
  {
    showOnNavigation: false,
    title: "Export To Tc",
    to: "exportToTc/:requestId",
    component: <GraNestedDetailsView />,
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
    icon: <HomeIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "Create Request",
    to: "createRequest",
    component: <CreateRequest />,
  },
  {
    showOnNavigation: true,
    icon: <HomeIcon sx={{ fontSize: "3.4324rem" }} />,
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
    to: "graAllRequests/*",
    component: <GraAllRequests />,
    nestedRoutes: graAllRequestsRoutes,
  },
];

export const izGroupRoleApproverRoutes: AppRoute[] = [
  {
    showOnNavigation: true,
    icon: <HomeIcon sx={{ color: "#fff" }} fontSize="small" />,
    title: "Home",
    to: "home/*",
    component: <GraHome />,
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
