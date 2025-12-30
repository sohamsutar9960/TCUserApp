import { Route, Routes } from "react-router";
import UserHomeTiles from "../userTiles/userHomeTiles";
import { nestedRoutes } from "../../../../routes/izUserRoutes";

const UserHome = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<UserHomeTiles />} />
        {nestedRoutes.map((route) => (
          <Route
            key={route.title}
            path={`${route.to}`}
            element={route?.component}
          />
        ))}
      </Routes>
    </>
  );
};

export default UserHome;
