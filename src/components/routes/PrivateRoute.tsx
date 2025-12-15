import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthorizationLayout from "../../layouts/AuthorizationLayout";

/**
 * PrivateRoute component protects routes that require authentication.
 * Redirects to login page if user is not authenticated.
 */
const PrivateRoute = () => {
  const { user } = useSelector((state: any) => state.user);
  const isAuthenticated = user?.token && user?.userId;

  return isAuthenticated ? <AuthorizationLayout> <Outlet />  </AuthorizationLayout>: <Navigate to="/login" replace />;
};

export default PrivateRoute;

