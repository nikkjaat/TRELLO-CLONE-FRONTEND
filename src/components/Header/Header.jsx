import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  LogOut,
  User,
  Settings,
  BarChart3,
  Menu,
  X,
  Bell,
  Filter,
} from "lucide-react";
import FilterPanel from "../FilterPanel/FilterPanel";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import SettingsModal from "../SettingsModal/SettingsModal";
import styles from "./Header.module.css";

const Header = ({ onShowDashboard, showingDashboard }) => {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowMobileFilters(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const toggleSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
    setShowMobileMenu(false);
  };

  const handleEditProfile = () => {
    setShowSettingsModal(true);
    setShowProfileDropdown(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Left Section - Brand */}
          <div className={styles.left}>
            <div className={styles.brand}>
              <h1 className={styles.title}>TaskFlow</h1>
              <div className={styles.userInfo}>
                <span className={styles.welcome}>Welcome, {user.name}</span>
                <span
                  className={styles.role}
                  style={{ backgroundColor: getRoleColor(user.role) }}
                >
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className={styles.right}>
            {/* Desktop Actions */}
            <div className={styles.desktopActions}>
              <button
                onClick={toggleMobileFilters}
                className={`${styles.actionButton} ${styles.filterButton}`}
                title="Toggle Filters"
              >
                <Filter size={20} />
                <span className={styles.buttonText}>Filters</span>
              </button>

              <button
                onClick={onShowDashboard}
                className={`${styles.actionButton} ${
                  showingDashboard ? styles.active : ""
                }`}
                title="Dashboard"
              >
                <BarChart3 size={20} />
                <span className={styles.buttonText}>Dashboard</span>
              </button>

              <button className={styles.actionButton} title="Notifications">
                <Bell size={20} />
                <span className={styles.notificationBadge}>3</span>
              </button>

              <button
                onClick={toggleSettingsModal}
                className={styles.actionButton}
                title="Settings"
              >
                <Settings size={20} />
                <span className={styles.buttonText}>Settings</span>
              </button>

              <div className={styles.profileSection}>
                <button
                  onClick={toggleProfileDropdown}
                  className={styles.profileButton}
                  title="Profile"
                >
                  <div className={styles.avatar}>
                    <User size={20} />
                  </div>
                  <span className={styles.profileName}>{user.name}</span>
                </button>

                {showProfileDropdown && (
                  <ProfileDropdown
                    user={user}
                    onClose={() => setShowProfileDropdown(false)}
                    onLogout={logout}
                    onSettings={toggleSettingsModal}
                    onEditProfile={handleEditProfile}
                  />
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={styles.mobileMenuButton}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuContent}>
              <div className={styles.mobileUserInfo}>
                <div className={styles.mobileAvatar}>
                  <User size={24} />
                </div>
                <div className={styles.mobileUserDetails}>
                  <span className={styles.mobileUserName}>{user.name}</span>
                  <span className={styles.mobileUserEmail}>{user.email}</span>
                  <span
                    className={styles.mobileUserRole}
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <div className={styles.mobileActions}>
                <button
                  onClick={() => {
                    toggleMobileFilters();
                    setShowMobileMenu(false);
                  }}
                  className={styles.mobileActionButton}
                >
                  <Filter size={20} />
                  Filters
                </button>

                <button
                  onClick={() => {
                    onShowDashboard();
                    setShowMobileMenu(false);
                  }}
                  className={`${styles.mobileActionButton} ${
                    showingDashboard ? styles.active : ""
                  }`}
                >
                  <BarChart3 size={20} />
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    handleEditProfile();
                    setShowMobileMenu(false);
                  }}
                  className={styles.mobileActionButton}
                >
                  <User size={20} />
                  Edit Profile
                </button>

                <button
                  onClick={() => {
                    toggleSettingsModal();
                    setShowMobileMenu(false);
                  }}
                  className={styles.mobileActionButton}
                >
                  <Settings size={20} />
                  Settings
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                  className={`${styles.mobileActionButton} ${styles.logoutButton}`}
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Filters */}
        {showMobileFilters && (
          <div className={styles.mobileFilters}>
            <div className={styles.mobileFiltersHeader}>
              <h3>Filters</h3>
              <button
                onClick={toggleMobileFilters}
                className={styles.closeFiltersButton}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.mobileFiltersContent}>
              <FilterPanel />
            </div>
          </div>
        )}
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}

      {/* Overlay for mobile menu */}
      {(showMobileMenu || showMobileFilters) && (
        <div
          className={styles.overlay}
          onClick={() => {
            setShowMobileMenu(false);
            setShowMobileFilters(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
