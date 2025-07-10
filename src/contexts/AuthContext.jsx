import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock users for demonstration
const mockUsers = [
  {
    id: 1,
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    id: 2,
    email: "vendor@example.com",
    password: "vendor123",
    name: "Vendor User",
    role: "vendor",
  },
  {
    id: 3,
    email: "customer@example.com",
    password: "customer123",
    name: "Customer User",
    role: "customer",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("taskManager_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate an API call
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      if (res.data.success) {
        const newUser = {
          id: res.data.user.id,
          email: res.data.user.email,
          name: res.data.user.name,
          role: res.data.user.role,
        };
        setUser(newUser);
        localStorage.setItem("taskManager_user", JSON.stringify(newUser));
        localStorage.setItem("authToken", res.data.token);
        return { success: true, response: res.data };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Something went wrong during login",
      };
    }
  };

  const register = async (email, password, name, role = "customer") => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          name,
          role,
          email,
          password,
        }
      );

      if (!res.data.success) {
        return { success: false, error: res.data || "Registration failed" };
      }

      const newUser = {
        id: res.data.user.id,
        email: res.data.user.email,
        name: res.data.user.name,
        role: res.data.user.role,
      };
      setUser(newUser);
      localStorage.setItem("taskManager_user", JSON.stringify(newUser));
      return { success: true, response: res.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Something went wrong during registration",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("taskManager_user");
    localStorage.removeItem("authToken");
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    allUsers: mockUsers.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
    })),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
