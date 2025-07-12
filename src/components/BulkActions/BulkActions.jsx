import React, { useEffect, useState } from "react";
import { useTask } from "../../contexts/TaskContext";
import { useAuth } from "../../contexts/AuthContext";
import { CheckSquare, Trash2, X } from "lucide-react";
import styles from "./BulkActions.module.css";
import { parse } from "date-fns";

const BulkActions = ({ selectedTasks, onClearSelection }) => {
  const { deleteTask, updateTask } = useTask();
  const { user, allUsers } = useAuth();
  const [allUser, setAllUser] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkAssignee, setBulkAssignee] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await allUsers();
      setAllUser(users);
    };
    fetchUsers();
  }, []);

  const canPerformBulkActions = () => {
    return user.role === "admin" || user.role === "vendor";
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedTasks.length} tasks?`
      )
    ) {
      selectedTasks.forEach((taskId) => deleteTask(taskId));
      onClearSelection();
      setBulkAssignee("");
      setBulkStatus("");
    }
  };

  const handleApplyChanges = () => {
    if (!bulkStatus && !bulkAssignee) return;

    const assignee = bulkAssignee && allUser.find((u) => u.id === bulkAssignee);
    console.log(assignee);

    selectedTasks.forEach((taskId) => {
      const updateData = {};
      if (bulkStatus) updateData.status = bulkStatus;
      if (assignee) {
        updateData.assignee = assignee.name;
        updateData.assigneeId = assignee.id;
      }
      updateTask(taskId, updateData);
    });

    onClearSelection();
    setBulkAssignee("");
    setBulkStatus("");
  };

  if (selectedTasks.length === 0 || !canPerformBulkActions()) {
    return null;
  }

  return (
    <div className={styles.bulkActions}>
      <div className={styles.selectionInfo}>
        <CheckSquare size={16} />
        <span>
          {selectedTasks.length} task{selectedTasks.length > 1 ? "s" : ""}{" "}
          selected
        </span>
        <button onClick={onClearSelection} className={styles.clearButton}>
          <X size={14} />
        </button>
      </div>

      <div className={styles.actions}>
        {/* Status Buttons */}
        <div className={styles.actionGroup}>
          <span className={styles.actionLabel}>Status:</span>
          <button
            onClick={() => setBulkStatus("todo")}
            className={`${styles.actionButton} ${styles.todoButton} ${
              bulkStatus === "todo" ? styles.active : ""
            }`}
          >
            To Do
          </button>
          <button
            onClick={() => setBulkStatus("inprogress")}
            className={`${styles.actionButton} ${styles.progressButton} ${
              bulkStatus === "inprogress" ? styles.active : ""
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setBulkStatus("done")}
            className={`${styles.actionButton} ${styles.doneButton} ${
              bulkStatus === "done" ? styles.active : ""
            }`}
          >
            Done
          </button>
        </div>

        {/* Assignee Dropdown */}
        <div className={styles.actionGroup}>
          <span className={styles.actionLabel}>Reassign:</span>
          <select
            value={bulkAssignee}
            onChange={(e) => setBulkAssignee(e.target.value)}
            className={styles.assigneeSelect}
          >
            <option value="">Select assignee...</option>
            {allUser.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplyChanges}
          disabled={!bulkStatus && !bulkAssignee}
          className={`${styles.actionButton} ${styles.applyButton}`}
        >
          Apply Changes
        </button>

        {/* Delete Button */}
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
