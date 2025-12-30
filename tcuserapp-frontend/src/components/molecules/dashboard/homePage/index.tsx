import { Route, Routes } from "react-router-dom";
import SiemensAdminTile from "./siemensAdminTile";
import SiemensAdminTiles from "./siemensAdminTiles/SiemensAdminTiles";
import { nestedRoutes } from "../../../../routes/izAdminRoutes";

const HomePage = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<SiemensAdminTile />} />
        <Route path="/siemensAdminTiles/*" element={<SiemensAdminTiles />} />
        {nestedRoutes.map((route) => (
          <Route
            key={route.title}
            path={`siemensAdminTiles/${route.to}`}
            element={route?.component}
          />
        ))}
      </Routes>
    </>
  );
};

export default HomePage;
