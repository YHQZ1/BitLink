import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/api/user/profile");
      setUser(data);
    } catch {
      localStorage.removeItem("jwtToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (jwtToken) => {
    localStorage.setItem("jwtToken", jwtToken);
    setLoading(true);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
