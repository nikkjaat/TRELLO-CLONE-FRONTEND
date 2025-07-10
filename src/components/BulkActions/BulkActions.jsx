import React, { useState } from 'react';
import { useTask } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { CheckSquare, Trash2, Users, RefreshCw, X } from 'lucide-react';
import styles from './BulkActions.module.css';

const BulkActions = ({ selectedTasks, onClearSelection }) => {
  const { deleteTask, updateTask } = useTask();
  const { user, allUsers } = useAuth();
  const [showActions, setShowActions] = useState(false);

  const canPerformBulkActions = () => {
    return user.role === 'admin' || user.role === 'vendor';
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      selectedTasks.forEach(taskId => deleteTask(taskId));
      onClearSelection();
      setShowActions(false);
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    selectedTasks.forEach(taskId => {
      updateTask(taskId, { status: newStatus });
    });
    onClearSelection();
    setShowActions(false);
  };

  const handleBulkReassign = (assigneeId) => {
    const assignee = allUsers.find(u => u.id === parseInt(assigneeId));
    if (assignee) {
      selectedTasks.forEach(taskId => {
        updateTask(taskId, { 
          assignee: assignee.name,
          assigneeId: assignee.id 
        });
      });
      onClearSelection();
      setShowActions(false);
    }
  };

  if (selectedTasks.length === 0 || !canPerformBulkActions()) {
    return null;
  }

  return (
    <div className={styles.bulkActions}>
      <div className={styles.selectionInfo}>
        <CheckSquare size={16} />
        <span>{selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected</span>
        <button onClick={onClearSelection} className={styles.clearButton}>
          <X size={14} />
        </button>
      </div>

      <div className={styles.actions}>
        <div className={styles.actionGroup}>
          <span className={styles.actionLabel}>Status:</span>
          <button
            onClick={() => handleBulkStatusChange('todo')}
            className={`${styles.actionButton} ${styles.todoButton}`}
          >
            To Do
          </button>
          <button
            onClick={() => handleBulkStatusChange('inprogress')}
            className={`${styles.actionButton} ${styles.progressButton}`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleBulkStatusChange('done')}
            className={`${styles.actionButton} ${styles.doneButton}`}
          >
            Done
          </button>
        </div>

        <div className={styles.actionGroup}>
          <span className={styles.actionLabel}>Reassign:</span>
          <select
            onChange={(e) => e.target.value && handleBulkReassign(e.target.value)}
            className={styles.assigneeSelect}
            defaultValue=""
          >
            <option value="">Select assignee...</option>
            {allUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleBulkDelete}
          className={`${styles.actionButton} ${styles.deleteButton}`}
        >
          <Trash2 size={14} />
          Delete All
        </button>
      </div>
    </div>
  );
};

export default BulkActions;