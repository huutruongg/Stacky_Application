import React, { createContext, useState, useEffect } from "react";

// Define the context
const AuthContext = createContext(null);

// Helper functions for localStorage operations
const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem("userInfo");
  return storedUser ? JSON.parse(storedUser) : null;
};

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("accessToken") || null;
};

export const AuthProvider = ({ children }) => {
  // Initialize state with data from localStorage
  const [user, setUser] = useState(getUserFromLocalStorage);
  const [accessToken, setAccessToken] = useState(getTokenFromLocalStorage);

  const login = (userInfo, token) => {
    setUser(userInfo);
    setAccessToken(token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("accessToken", token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");
  };

  // Sync localStorage with state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("userInfo", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
