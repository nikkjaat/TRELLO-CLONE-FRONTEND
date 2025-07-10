import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import styles from './App.module.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {user ? (
        <>
          <Header 
            onShowDashboard={() => setShowDashboard(!showDashboard)}
            showingDashboard={showDashboard}
          />
          <main className={styles.main}>
            {showDashboard ? <Dashboard /> : <KanbanBoard />}
          </main>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;