import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ThreePIcon from "@mui/icons-material/ThreeP";
import FlagIcon from "@mui/icons-material/Flag";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ServicePage from "../components/molecules/dashboard/servicePage";
import SystemPage from "../components/molecules/dashboard/systemPage";
import GroupPage from "../components/molecules/dashboard/groupPage";
import VolumePage from "../components/molecules/dashboard/volumePage";
import TcConfigurationPage from "../components/molecules/dashboard/tcConfigurationPage";
import HomePage from "../components/molecules/dashboard/homePage";
import ProfilePage from "../components/molecules/dashboard/profilePage";
import RolePage from "../components/molecules/dashboard/rolePage";
import { AppRoute } from "../components/atoms/common/interfaces";
import CreateAddUserTable from "../components/molecules/dashboard/createAddUser";
import UserRequestViewPage from "../components/molecules/dashboard/userRequestViewPage/userRequestViewPage";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import CountryPage from "../components/molecules/dashboard/countryPage";
import ScdUserPage from "../components/molecules/dashboard/scdUserPage";
import GroupRoleApproverPage from "../components/molecules/dashboard/groupRoleApprover";
import ActivateDeactivateUser from "../components/molecules/dashboard/userInventory/activateDeactivateUser/activateDeactivateUser";
import UserInventoryPage from "../components/molecules/dashboard/userInventory";
import TeamCenterTable from "../components/molecules/dashboard/teamcenterUser/TeamCenterTable";

export const userInventoryNestedRoutes: AppRoute[] = [
  {
    showOnNavigation: true,
    icon: <ManageAccountsIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "Activate/ Deactivate User",
    to: "activateDeactivateUser",
    component: <ActivateDeactivateUser />,
  },
];
export const nestedRoutes: AppRoute[] = [
  {
    showOnNavigation: true,
    icon: (
      <AccountCircleRoundedIcon
        sx={{
          fontSize: "3.4324rem",
        }}
      />
    ),
    title: "Service",
    to: "service",
    component: <ServicePage />,
  },
  {
    showOnNavigation: true,
    icon: <LaptopChromebookIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "System",
    to: "system",
    component: <SystemPage />,
  },
  {
    showOnNavigation: true,
    icon: <GroupsIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "Group",
    to: "group",
    component: <GroupPage />,
  },

  {
    showOnNavigation: true,
    icon: <PersonIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "Roles",
    to: "roles",
    component: <RolePage />,
  },
  {
    showOnNavigation: true,
    icon: <Inventory2Icon sx={{ fontSize: "3.4324rem" }} />,
    title: "Volume",
    to: "volume",
    component: <VolumePage />,
  },
  {
    showOnNavigation: true,
    icon: <RoomPreferencesIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "TC Configuration",
    to: "tcConfiguration",
    component: <TcConfigurationPage />,
  },
  {
    showOnNavigation: true,
    icon: <PersonAddAltIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "Create/Add User",
    to: "createAddUser",
    component: <CreateAddUserTable />,
  },
  {
    icon: <ThreePIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "User Request",
    to: "userRequests",
    component: <UserRequestViewPage />,
  },
  {
    showOnNavigation: true,
    icon: <Groups2OutlinedIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "Group Role Approver",
    to: "groupRoleApprover",
    component: <GroupRoleApproverPage />,
  },
  {
    showOnNavigation: true,
    icon: <GroupOutlinedIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "Teamcenter User",
    to: "teamCenterUser",
    component: <TeamCenterTable />,
  },
  {
    showOnNavigation: true,
    icon: <FlagIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "Country",
    to: "country",
    component: <CountryPage />,
  },
  {
    showOnNavigation: true,
    icon: <GroupsIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "SCD User",
    to: "scdUser",
    component: <ScdUserPage />,
  },
  {
    showOnNavigation: true,
    icon: <GroupsIcon sx={{ fontSize: "3.4324rem" }} />,
    title: "User Inventory",
    to: "userInventory/*",
    component: <UserInventoryPage />,
    nestedRoutes: userInventoryNestedRoutes,
  },
];

export const izAdminRoutes: AppRoute[] = [
  {
    showOnNavigation: true,
    icon: <HomeIcon sx={{ color: "#fff" }} fontSize="small" />,
    title: "Home",
    to: "home/*",
    component: <HomePage />,
    nestedRoutes: nestedRoutes,
  },
  {
    showOnNavigation: true,
    icon: <SettingsIcon sx={{ color: "#fff" }} fontSize="small" />,
    title: "Service",
    to: "service",
    component: <ServicePage />,
  },
  {
    showOnNavigation: true,
    icon: <LaptopChromebookIcon sx={{ color: "#fff" }} fontSize="small" />,
    title: "System",
    to: "system",
    component: <SystemPage />,
  },
  {
    showOnNavigation: true,
    icon: <GroupsIcon sx={{ color: "#fff" }} fontSize="small" />,
    title: "Group",
    to: "group",
    component: <GroupPage />,
  },
  {
    showOnNavigation: true,
    icon: <PersonIcon sx={{ color: "#fff" }} fontSize="small" />,
    title: "Role",
    to: "role",
    component: <RolePage />,
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
