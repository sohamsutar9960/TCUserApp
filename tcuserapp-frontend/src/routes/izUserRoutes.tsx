import HomeIcon from "@mui/icons-material/Home";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppRoute } from "../components/atoms/common/interfaces";
import ProfilePage from "../components/molecules/dashboard/profilePage";
import MyRequest from "../components/molecules/dashboard/myRequest";
import UserHome from "../components/molecules/dashboard/userHome/userHome";
import CreateRequest from "../components/molecules/dashboard/createRequest/stepperComponent";
import OpenRequestTable from "../components/molecules/dashboard/myRequest/openRequestTable";
import CloseRequestTable from "../components/molecules/dashboard/myRequest/closeRequestTable";
import CloseRequestDetailsView from "../components/molecules/dashboard/myRequest/closeRequestDetails";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

export const nestedRoutes: AppRoute[] = [
  {
    showOnNavigation: true,
    icon: <NoteAddIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "Create Request",
    to: "createRequest/*",
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
];

export const izUserRoutes: AppRoute[] = [
  {
    showOnNavigation: true,
    icon: <HomeIcon sx={{ color: "#fff" }} fontSize="small" />,
    title: "Home",
    to: "home/*",
    component: <UserHome />,
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
