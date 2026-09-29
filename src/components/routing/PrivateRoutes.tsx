import { Outlet, Navigate } from "react-router";
import { useAuth } from "../../context/useAuth";

const PrivateRoutes = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : <Outlet />;
};

export default PrivateRoutes;
