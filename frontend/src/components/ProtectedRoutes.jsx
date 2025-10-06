import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = () => {
    try {
      const token = localStorage.getItem("jwtToken");
      
      if (!token) {
        console.log("No token found");
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      // Check if token is a valid JWT format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.log("Invalid token format");
        localStorage.removeItem("jwtToken");
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Check token expiration
      const currentTime = Date.now() / 1000;
      if (payload.exp && payload.exp < currentTime) {
        console.log("Token expired");
        localStorage.removeItem("jwtToken");
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      console.log("Token validation successful!");
      setIsAuthorized(true);
      setIsValidating(false);
      
    } catch (err) {
      console.error("Token validation error:", err);
      localStorage.removeItem("jwtToken");
      setIsAuthorized(false);
      setIsValidating(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;