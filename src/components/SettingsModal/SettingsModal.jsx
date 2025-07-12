import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  X,
  User,
  Lock,
  Bell,
  Palette,
  Globe,
  Shield,
  Save,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import styles from "./SettingsModal.module.css";

const SettingsModal = ({ onClose }) => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      taskUpdates: true,
      comments: true,
      deadlines: true,
    },
    theme: "light",
    language: "en",
    timezone: "UTC",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Check if any profile field has actually changed
    const isEmailChanged = profileData.email !== user.email;
    const isNameChanged = profileData.name !== user.name;

    if (!isEmailChanged && !isNameChanged) {
      setMessage({ type: "error", text: "No changes detected" });
      setLoading(false);
      return;
    }

    const updates = {};
    if (isNameChanged) updates.name = profileData.name;
    if (isEmailChanged) updates.email = profileData.email;

    if (Object.keys(updates).length === 0) {
      setMessage({ type: "error", text: "No changes detected" });
      setLoading(false);
      return;
    }

    try {
      const result = await updateProfile(updates);
      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (result.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to change password",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while changing password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Preferences saved successfully!" });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleThemeChange = (newTheme) => {
    switch (newTheme) {
      case "light":
        setLightTheme();
        break;
      case "dark":
        setDarkTheme();
        break;
      case "auto":
        setAutoTheme();
        break;
    }
    setMessage({ type: "success", text: `Theme changed to ${newTheme}!` });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleProfileSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <Globe size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={styles.input}
                required
              />
            </div>

            <div className={styles.roleInfo}>
              <Shield size={16} />
              <div>
                <span className={styles.roleLabel}>Current Role:</span>
                <span className={styles.roleValue}>{user.role}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        );

      case "security":
        return (
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.label}>
                <Lock size={16} />
                Current Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className={styles.passwordToggle}
                >
                  {showPasswords.current ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                <Lock size={16} />
                New Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className={styles.input}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className={styles.passwordToggle}
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                <Lock size={16} />
                Confirm New Password
              </label>
              <div className={styles.passwordInput}>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className={styles.input}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className={styles.passwordToggle}
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              <Save size={16} />
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        );

      case "notifications":
        return (
          <form onSubmit={handlePreferencesSubmit} className={styles.form}>
            <div className={styles.sectionTitle}>
              <Bell size={16} />
              Notification Preferences
            </div>

            {Object.entries(preferences.notifications).map(([key, value]) => (
              <div key={key} className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [key]: e.target.checked,
                        },
                      }))
                    }
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              </div>
            ))}

            <button type="submit" className={styles.submitButton}>
              <Save size={16} />
              Save Preferences
            </button>
          </form>
        );

      case "preferences":
        return (
          <form onSubmit={handlePreferencesSubmit} className={styles.form}>
            <div className={styles.sectionTitle}>
              <Palette size={16} />
              Theme Preferences
            </div>

            <div className={styles.themeOptions}>
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`${styles.themeOption} ${
                  theme === "light" ? styles.active : ""
                }`}
              >
                <Sun size={20} />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`${styles.themeOption} ${
                  theme === "dark" ? styles.active : ""
                }`}
              >
                <Moon size={20} />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange("auto")}
                className={`${styles.themeOption} ${
                  theme === "auto" ? styles.active : ""
                }`}
              >
                <Monitor size={20} />
                <span>Auto</span>
              </button>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="language" className={styles.label}>
                <Globe size={16} />
                Language
              </label>
              <select
                id="language"
                value={preferences.language}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    language: e.target.value,
                  }))
                }
                className={styles.select}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timezone" className={styles.label}>
                <Globe size={16} />
                Timezone
              </label>
              <select
                id="timezone"
                value={preferences.timezone}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    timezone: e.target.value,
                  }))
                }
                className={styles.select}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>

            <button type="submit" className={styles.submitButton}>
              <Save size={16} />
              Save Preferences
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Settings</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.sidebar}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tabButton} ${
                    activeTab === tab.id ? styles.active : ""
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className={styles.content}>
            {message.text && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.type === "success" ? (
                  <Check size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {message.text}
              </div>
            )}

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
