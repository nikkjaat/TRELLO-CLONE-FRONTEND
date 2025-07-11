import React, { useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  Mail,
  Calendar,
  Shield,
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import styles from "./ProfileDropdown.module.css";

const ProfileDropdown = ({
  user,
  onClose,
  onLogout,
  onSettings,
  onEditProfile,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "#e53e3e";
      case "vendor":
        return "#38a169";
      case "customer":
        return "#3182ce";
      default:
        return "#718096";
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case "admin":
        return "Full system access";
      case "vendor":
        return "Can create and manage tasks";
      case "customer":
        return "Can view assigned tasks";
      default:
        return "User";
    }
  };

  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <User size={24} />
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{user.name}</h3>
          <p className={styles.userEmail}>{user.email}</p>
          <div className={styles.roleContainer}>
            <span
              className={styles.role}
              style={{ backgroundColor: getRoleColor(user.role) }}
            >
              <Shield size={12} />
              {user.role}
            </span>
            <span className={styles.roleDescription}>
              {getRoleDescription(user.role)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <Calendar size={16} />
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Member since</span>
            <span className={styles.statValue}>
              {format(new Date(user.createdAt || Date.now()), "MMM yyyy")}
            </span>
          </div>
        </div>

        {user.lastLogin && (
          <div className={styles.statItem}>
            <User size={16} />
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Last login</span>
              <span className={styles.statValue}>
                {format(new Date(user.lastLogin), "MMM dd, HH:mm")}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={() => {
            onEditProfile();
            onClose();
          }}
        >
          <Edit size={16} />
          <span>Edit Profile</span>
        </button>

        <button
          className={styles.actionButton}
          onClick={() => {
            onSettings();
            onClose();
          }}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>

        <div className={styles.divider} />

        <button
          className={`${styles.actionButton} ${styles.logoutButton}`}
          onClick={() => {
            onLogout();
            onClose();
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
