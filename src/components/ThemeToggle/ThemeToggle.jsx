import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = ({ showLabel = true, size = "medium" }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.themeToggle} ${styles[size]} ${
        isDark ? styles.dark : styles.light
      }`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className={styles.iconContainer}>
        <Sun
          className={`${styles.icon} ${styles.sunIcon}`}
          size={size === "small" ? 16 : 20}
        />
        <Moon
          className={`${styles.icon} ${styles.moonIcon}`}
          size={size === "small" ? 16 : 20}
        />
      </div>

      <div className={styles.slider}>
        <div className={styles.sliderThumb}>
          {isDark ? (
            <Moon size={size === "small" ? 12 : 14} />
          ) : (
            <Sun color="black" size={size === "small" ? 12 : 14} />
          )}
        </div>
      </div>

      {showLabel && (
        <span className={styles.label}>{isDark ? "Dark" : "Light"}</span>
      )}
    </button>
  );
};

export default ThemeToggle;
