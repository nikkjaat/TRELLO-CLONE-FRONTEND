import React from 'react';
import { useTask } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, Users, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { allTasks } = useTask();
  const { allUsers } = useAuth();

  const getTaskStats = () => {
    const stats = {
      total: allTasks.length,
      todo: allTasks.filter(t => t.status === 'todo').length,
      inprogress: allTasks.filter(t => t.status === 'inprogress').length,
      done: allTasks.filter(t => t.status === 'done').length,
      overdue: allTasks.filter(t => {
        const today = new Date();
        const dueDate = new Date(t.dueDate);
        return dueDate < today && t.status !== 'done';
      }).length
    };
    return stats;
  };

  const getPriorityStats = () => {
    return [
      { name: 'High', value: allTasks.filter(t => t.priority === 'high').length, color: '#e53e3e' },
      { name: 'Medium', value: allTasks.filter(t => t.priority === 'medium').length, color: '#ed8936' },
      { name: 'Low', value: allTasks.filter(t => t.priority === 'low').length, color: '#38a169' }
    ];
  };

  const getAssigneeStats = () => {
    const assigneeMap = {};
    allTasks.forEach(task => {
      assigneeMap[task.assignee] = (assigneeMap[task.assignee] || 0) + 1;
    });
    return Object.entries(assigneeMap).map(([name, count]) => ({ name, count }));
  };

  const getWeeklyCompletionData = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const completedTasks = allTasks.filter(task => {
        if (task.status !== 'done') return false;
        const taskDate = new Date(task.updatedAt || task.createdAt);
        return taskDate >= weekStart && taskDate <= weekEnd;
      }).length;

      weeks.push({
        week: `Week ${i === 0 ? 'Current' : `-${i}`}`,
        completed: completedTasks
      });
    }
    return weeks;
  };

  const stats = getTaskStats();
  const priorityData = getPriorityStats();
  const assigneeData = getAssigneeStats();
  const weeklyData = getWeeklyCompletionData();

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dashboard & Analytics</h2>
        <div className={styles.subtitle}>Overview of your project progress</div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.total}</div>
            <div className={styles.statLabel}>Total Tasks</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f56565' }}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.todo}</div>
            <div className={styles.statLabel}>To Do</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#ed8936' }}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.inprogress}</div>
            <div className={styles.statLabel}>In Progress</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#48bb78' }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.done}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#e53e3e' }}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{stats.overdue}</div>
            <div className={styles.statLabel}>Overdue</div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <TrendingUp size={20} />
            Weekly Completion Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <AlertTriangle size={20} />
            Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <Users size={20} />
            Tasks by Assignee
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assigneeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;