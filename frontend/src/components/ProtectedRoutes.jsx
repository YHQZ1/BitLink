import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoutes;
