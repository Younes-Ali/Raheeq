import { Navigate, Outlet } from "react-router-dom";
import { isAdminAuthenticated } from "../../api/admin";

export default function ProtectedRoute() {
  return isAdminAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace />
  );
}
