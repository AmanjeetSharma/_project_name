// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch current user
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/user/profile");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔹 Register
  const register = async (data) => {
    return await axiosInstance.post("/auth/register", data);
  };

  // 🔹 Login
  const login = async (data) => {
    const res = await axiosInstance.post("/auth/login", data);
    await fetchUser(); // update state
    return res;
  };

  // 🔹 Logout
  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook
export const useAuth = () => useContext(AuthContext);