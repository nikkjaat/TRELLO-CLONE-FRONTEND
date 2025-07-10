import React from 'react';
import { useTask } from '../../contexts/TaskContext';
import { Filter, X } from 'lucide-react';
import styles from './FilterPanel.module.css';

const FilterPanel = () => {
  const { filters, setFilters, allTasks } = useTask();

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priority: 'all',
      assignee: 'all',
      dueDate: 'all'
    });
  };

  const getUniqueAssignees = () => {
    const assignees = [...new Set(allTasks.map(task => task.assignee))];
    return assignees.sort();
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== 'all');

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterGroup}>
        <Filter className={styles.filterIcon} size={16} />
        
        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={filters.assignee}
          onChange={(e) => handleFilterChange('assignee', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Assignees</option>
          {getUniqueAssignees().map(assignee => (
            <option key={assignee} value={assignee}>{assignee}</option>
          ))}
        </select>

        <select
          value={filters.dueDate}
          onChange={(e) => handleFilterChange('dueDate', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Due Dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due Today</option>
          <option value="thisweek">Due This Week</option>
        </select>

        {hasActiveFilters && (
          <button onClick={clearFilters} className={styles.clearButton}>
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;