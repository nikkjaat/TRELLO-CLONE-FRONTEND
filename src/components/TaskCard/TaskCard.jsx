import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTask } from "../../contexts/TaskContext";
import {
  Calendar,
  User,
  AlertTriangle,
  Edit,
  Trash2,
  Clock,
  MessageCircle,
  CheckSquare,
} from "lucide-react";
import { format } from "date-fns";
import styles from "./TaskCard.module.css";

const TaskCard = ({ task, onEdit, isSelected, onSelect }) => {
  const { user } = useAuth();
  const { deleteTask } = useTask();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#e53e3e";
      case "medium":
        return "#ed8936";
      case "low":
        return "#38a169";
      default:
        return "#718096";
    }
  };


  const isOverdue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== "done";
  };

  const canEditTask = () => {
    return (
      user.role === "admin" ||
      (user.role === "vendor" && task.assigneeId === user.id) ||
      task.assigneeId === user.id
    );
  };

  const canDeleteTask = () => {
    return user.role === "admin";
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
    }
  };

  const getCompletedSubtasks = () => {
    if (!task.subtasks) return { completed: 0, total: 0 };
    const completed = task.subtasks.filter((s) => s.completed).length;
    return { completed, total: task.subtasks.length };
  };

  const formatTimeSpent = (seconds) => {
    if (!seconds) return null;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const subtaskProgress = getCompletedSubtasks();
  const timeSpent = formatTimeSpent(task.timeSpent);
  const commentsCount = task.comments ? task.comments.length : 0;

  return (
    <div
      className={`${styles.taskCard} ${isOverdue() ? styles.overdue : ""} ${
        isSelected ? styles.selected : ""
      }`}
    >
      {canEditTask() && (
        <div className={styles.selectCheckbox}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(task.id, e.target.checked);
            }}
            className={styles.checkbox}
          />
        </div>
      )}

      <div className={styles.taskHeader}>
        <div
          className={styles.priorityIndicator}
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        />
        <div className={styles.taskActions}>
          {canEditTask() && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className={styles.actionButton}
            >
              <Edit size={14} />
            </button>
          )}
          {canDeleteTask() && (
            <button
              onClick={handleDelete}
              className={`${styles.actionButton} ${styles.deleteButton}`}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.taskContent}>
        <h3 className={styles.taskTitle}>{task.title}</h3>

        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}

        <div className={styles.taskMeta}>
          <div className={styles.metaItem}>
            <User size={14} />
            <span>{task.assignee}</span>
          </div>

          <div className={styles.metaItem}>
            <Calendar size={14} />
            <span>{format(new Date(task.dueDate), "MMM dd")}</span>
          </div>

          <div className={styles.metaItem}>
            <AlertTriangle size={14} />
            <span
              className={styles.priority}
              style={{ color: getPriorityColor(task.priority) }}
            >
              {task.priority}
            </span>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className={styles.tags}>
            {task.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.taskFooter}>
        {subtaskProgress.total > 0 && (
          <div className={styles.subtaskProgress}>
            <CheckSquare size={12} />
            <span>
              {subtaskProgress.completed}/{subtaskProgress.total}
            </span>
          </div>
        )}

        {timeSpent && (
          <div className={styles.timeSpent}>
            <Clock size={12} />
            <span>{timeSpent}</span>
          </div>
        )}

        {commentsCount > 0 && (
          <div className={styles.commentsCount}>
            <MessageCircle size={12} />
            <span>{commentsCount}</span>
          </div>
        )}
      </div>

      {isOverdue() && (
        <div className={styles.overdueIndicator}>
          <AlertTriangle size={14} />
          <span>Overdue</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
