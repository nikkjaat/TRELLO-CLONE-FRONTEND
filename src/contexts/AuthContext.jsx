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
          createdAt: res.data.user.createdAt,
          lastLogin: res.data.user.lastLogin,
          isActive: res.data.user.isActive,
          avatar: res.data.user.avatar || null,
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

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (res.data.success) {
        const updatedUser = res.data.user;
        setUser((prev) => ({
          ...prev,
          ...updatedUser,
        }));
        localStorage.setItem("taskManager_user", JSON.stringify(updatedUser));
        return { success: true, response: res.data };
      }
      return { success: false, error: res.data.message || "Update failed" };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Something went wrong during update",
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (res.data.success) {
        return { success: true, response: res.data };
      }
      return {
        success: false,
        error: res.data.message || "Change password failed",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Something went wrong during password change",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("taskManager_user");
    localStorage.removeItem("authToken");
  };

  // Fetch all users for dropdowns
  const allUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return res.data?.data || []; // fallback if data is undefined
    } catch (error) {
      console.error("Error fetching users:", error);
      return []; // ensures dropdowns don't break
    }
  };

  const value = {
    user,
    login,
    register,
    updateProfile,
    changePassword,
    logout,
    loading,
    allUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
