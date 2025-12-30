import { Route, Routes } from "react-router";
import { nestedRoutes } from "../../../../routes/izGroupRoleApprover";
import GraTiles from "../graTiles/graTiles";

const GraHome = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<GraTiles />} />
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

export default GraHome;
