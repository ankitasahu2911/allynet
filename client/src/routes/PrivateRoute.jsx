import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;               // or a spinner
  if (!user)  return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role))
      return <Navigate to="/" />;         // not authorized

  return children;
}
