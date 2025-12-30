import { Route, Routes } from "react-router";
import { nestedRoutes } from "../../../../routes/izManagerRoutes";
import ManagerTiles from "../managerTiles/managerTiles";

const ManagerHome = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<ManagerTiles />} />
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

export default ManagerHome;
