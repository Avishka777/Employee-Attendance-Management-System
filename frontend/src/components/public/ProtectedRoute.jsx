/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);
  const profileType = user?.profileType;
  const location = useLocation();

  if (!profileType) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(profileType)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
