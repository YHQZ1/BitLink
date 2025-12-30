const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
