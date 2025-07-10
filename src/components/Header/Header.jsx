import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Settings, BarChart3 } from 'lucide-react';
import FilterPanel from '../FilterPanel/FilterPanel';
import styles from './Header.module.css';

const Header = ({ onShowDashboard, showingDashboard }) => {
  const { user, logout } = useAuth();

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#e53e3e';
      case 'vendor': return '#38a169';
      case 'customer': return '#3182ce';
      default: return '#718096';
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h1 className={styles.title}>Task Manager</h1>
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

        <div className={styles.center}>
          <FilterPanel />
        </div>

        <div className={styles.right}>
          <button 
            onClick={onShowDashboard}
            className={`${styles.dashboardButton} ${showingDashboard ? styles.active : ''}`}
          >
            <BarChart3 size={20} />
            Dashboard
          </button>
          <button className={styles.profileButton}>
            <User size={20} />
          </button>
          <button className={styles.settingsButton}>
            <Settings size={20} />
          </button>
          <button onClick={logout} className={styles.logoutButton}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;