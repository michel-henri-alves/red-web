import { Navigate, useLocation } from "react-router-dom";
import { mustChangeInitialPassword, useAuth } from "./context/AuthContext";

export default function PrivateRoute({ children }) {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (mustChangeInitialPassword(user) && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  return children;
}
