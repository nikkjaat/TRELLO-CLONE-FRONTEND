import React, { useState, useEffect } from "react";
import { useTask } from "../../contexts/TaskContext";
import { useAuth } from "../../contexts/AuthContext";
import SubtaskList from "../SubtaskList/SubtaskList";
import TaskTimer from "../TaskTimer/TaskTimer";
import TaskComments from "../TaskComments/TaskComments";
import { X, Save, Calendar, User, AlertTriangle, Tag } from "lucide-react";
import { format } from "date-fns";
import styles from "./TaskModal.module.css";

const TaskModal = ({ task, onClose }) => {
  const { addTask, updateTask } = useTask();
  const { user, allUsers } = useAuth();
  const [allUserList, setAllUserList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: user.name,
    assigneeId: user.id,
    dueDate: format(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    tags: [],
    subtasks: [],
    timeSpent: 0,
    comments: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await allUsers();
      if (users) {
        setAllUserList(users);
      }
    };

    if (canAssignToOthers()) {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        assignee: task.assignee || user.name,
        assigneeId: task.assigneeId || user.id,
        dueDate:
          task.dueDate ||
          format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        tags: task.tags || [],
        subtasks: task.subtasks || [],
        timeSpent: task.timeSpent || 0,
        comments: task.comments || [],
      });
    }
  }, [task, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAssigneeChange = (e) => {
    const selectedUser = allUsers.find(
      (u) => u.id === parseInt(e.target.value)
    );
    setFormData((prev) => ({
      ...prev,
      assignee: selectedUser.name,
      assigneeId: selectedUser.id,
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubtasksChange = (newSubtasks) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: newSubtasks,
    }));
  };

  const handleTimeUpdate = (newTime) => {
    setFormData((prev) => ({
      ...prev,
      timeSpent: newTime,
    }));
  };

  const handleCommentsChange = (newComments) => {
    setFormData((prev) => ({
      ...prev,
      comments: newComments,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (task) {
      updateTask(task.id, formData);
    } else {
      addTask(formData);
    }

    onClose();
  };

  const canAssignToOthers = () => {
    return user.role === "admin" || user.role === "vendor";
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`${styles.input} ${
                errors.title ? styles.inputError : ""
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="priority" className={styles.label}>
                <AlertTriangle size={16} />
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="assignee" className={styles.label}>
                <User size={16} />
                Assignee
              </label>
              <select
                id="assignee"
                name="assignee"
                value={formData.assigneeId}
                onChange={handleAssigneeChange}
                className={styles.select}
                disabled={!canAssignToOthers()}
              >
                {canAssignToOthers() ? (
                  allUserList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))
                ) : (
                  <option value={user.id}>{user.name}</option>
                )}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dueDate" className={styles.label}>
              <Calendar size={16} />
              Due Date *
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className={`${styles.input} ${
                errors.dueDate ? styles.inputError : ""
              }`}
              min={format(new Date(), "yyyy-MM-dd")}
            />
            {errors.dueDate && (
              <span className={styles.errorText}>{errors.dueDate}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Tag size={16} />
              Tags
            </label>
            <div className={styles.tagInput}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                className={styles.input}
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={styles.addTagButton}
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className={styles.tags}>
                {formData.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={styles.removeTagButton}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <SubtaskList
            subtasks={formData.subtasks}
            onSubtasksChange={handleSubtasksChange}
          />

          <TaskTimer
            taskId={task?.id}
            initialTime={formData.timeSpent}
            onTimeUpdate={handleTimeUpdate}
          />

          <TaskComments
            taskId={task?.id}
            comments={formData.comments}
            onCommentsChange={handleCommentsChange}
          />

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              <Save size={16} />
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
