import { Routes, Route } from "react-router";
import { userInventoryNestedRoutes } from "../../../../routes/izAdminRoutes";
import UserInventoryTiles from "./userInventoryTiles/userInventoryTiles";

const UserInventoryPage = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<UserInventoryTiles />} />
        {userInventoryNestedRoutes.map((route) => (
          <Route key={route.to} path={route.to} element={route.component} />
        ))}
      </Routes>
    </>
  );
};

export default UserInventoryPage;
