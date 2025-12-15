import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthorizationLayout from "../../layouts/AuthorizationLayout";

/**
 * PublicRoute component handles public routes (login, signup).
 * Redirects authenticated users away from auth pages to dashboard.
 */
const PublicRoute = () => {
  const { user } = useSelector((state: any) => state.user);
  const isAuthenticated = user?.token && user?.userId;

  return !isAuthenticated ?   <Outlet /> : <AuthorizationLayout> <Navigate to="/dashboard" replace />  </AuthorizationLayout>;
};

export default PublicRoute;

