import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
  const { user } = useAuth();

  console.log(user); // This is useful for debugging. You might want to remove it in production.

  // Check if user is authenticated
  if (user) {
    // Check if user has an allowed role
    if (allowedRoles.includes(user.role)) {
      return <Outlet />; // User is authenticated and has an allowed role
    } else {
      return <Navigate to="/" replace />; // User is authenticated but doesn't have permission
    }
  } else {
    return <Navigate to="/account.stacky.vn" replace />; // User is not authenticated
  }
}

export default RequireAuth;
