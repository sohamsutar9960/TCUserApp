import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import { AppRoute } from "./components/atoms/common/interfaces";
import MainLayout from "./components/molecules/dashboard/mainLayout";
import { getRoutes } from "./components/helpers";
import LoginPage from "./components/auth/Login";
import { useAuth } from "./components/auth/AuthProvider/authProvider";
import ProtectedRoute from "./components/auth/protectedRoute/protectedRoute";
import SsoLoginHandler from "./components/auth/Login/SsoLoginHandler";

const App = () => {
  const { user } = useAuth();
  const userRole = user?.roles[0];
  const commonRoutes = getRoutes(userRole ?? "");
  return (
    <>
      <Routes>
        <Route path="/ssoLogin" element={<SsoLoginHandler />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute
              children={<MainLayout commonRoutes={commonRoutes} />}
            />
          }
        >
          {commonRoutes.map(renderRoute)}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

function renderRoute(route: AppRoute) {
  return (
    <Route element={route.component} path={route.to} key={route.to}>
      {route.nestedRoutes && route.nestedRoutes.map(renderRoute)}
    </Route>
  );
}
