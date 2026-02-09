import { Navigate } from "react-router-dom";
import { session } from "../services/session";
import { useUser } from "../context/UserContext";

export default function PrivateRoute({ children }) {
  const { isUserReady } = useUser();
  if (!isUserReady) return null;
  if (!session.isLoggedIn()) return <Navigate to="/login" replace />;
  return children;
}
