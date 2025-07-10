import React, { useState } from 'react';
import { Plus, Check, X, Edit2 } from 'lucide-react';
import styles from './SubtaskList.module.css';

const SubtaskList = ({ subtasks = [], onSubtasksChange }) => {
  const [newSubtask, setNewSubtask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const subtask = {
        id: Date.now().toString(),
        text: newSubtask.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      onSubtasksChange([...subtasks, subtask]);
      setNewSubtask('');
    }
  };

  const toggleSubtask = (id) => {
    const updated = subtasks.map(subtask =>
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    );
    onSubtasksChange(updated);
  };

  const deleteSubtask = (id) => {
    const updated = subtasks.filter(subtask => subtask.id !== id);
    onSubtasksChange(updated);
  };

  const startEdit = (subtask) => {
    setEditingId(subtask.id);
    setEditText(subtask.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      const updated = subtasks.map(subtask =>
        subtask.id === editingId ? { ...subtask, text: editText.trim() } : subtask
      );
      onSubtasksChange(updated);
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const completedCount = subtasks.filter(s => s.completed).length;
  const totalCount = subtasks.length;

  return (
    <div className={styles.subtaskList}>
      <div className={styles.header}>
        <h4 className={styles.title}>Subtasks</h4>
        {totalCount > 0 && (
          <div className={styles.progress}>
            <span className={styles.progressText}>
              {completedCount}/{totalCount} completed
            </span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className={styles.addSubtask}>
        <input
          type="text"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
          placeholder="Add a subtask..."
          className={styles.input}
        />
        <button onClick={addSubtask} className={styles.addButton}>
          <Plus size={16} />
        </button>
      </div>

      <div className={styles.subtasks}>
        {subtasks.map(subtask => (
          <div key={subtask.id} className={styles.subtask}>
            <button
              onClick={() => toggleSubtask(subtask.id)}
              className={`${styles.checkbox} ${subtask.completed ? styles.checked : ''}`}
            >
              {subtask.completed && <Check size={12} />}
            </button>
            
            {editingId === subtask.id ? (
              <div className={styles.editMode}>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  className={styles.editInput}
                  autoFocus
                />
                <button onClick={saveEdit} className={styles.saveButton}>
                  <Check size={14} />
                </button>
                <button onClick={cancelEdit} className={styles.cancelButton}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className={styles.subtaskContent}>
                <span className={`${styles.subtaskText} ${subtask.completed ? styles.completed : ''}`}>
                  {subtask.text}
                </span>
                <div className={styles.subtaskActions}>
                  <button
                    onClick={() => startEdit(subtask)}
                    className={styles.editButton}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => deleteSubtask(subtask.id)}
                    className={styles.deleteButton}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubtaskList;