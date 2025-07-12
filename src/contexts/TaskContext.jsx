import React, { createContext, useContext, useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    priority: "all",
    assignee: "all",
    dueDate: "all",
  });
  const { user } = useAuth();

  const getTasks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setTasks(res.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (user) {
      // Fetch tasks only if user is logged in
      getTasks();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("taskManager_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (task) => {
    console.log(task);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
        { task },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (res.data.success) {
        const newTask = {
          ...task,
          id: res.data.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTasks((prev) => [...prev, newTask]);
        getTasks();
      }
    } catch (error) {
      console.error("Error adding task:", error);
      throw new Error("Failed to add task");
    }
  };

  const updateTask = async (taskId, updates) => {
    console.log(taskId, updates);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/bulk/update`,
        { taskIds: [taskId], updates },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update task");
      }
      console.log(res.data);
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (res.data.success) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  };

  const moveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      if (filters.priority !== "all" && task.priority !== filters.priority)
        return false;
      if (filters.assignee !== "all" && task.assignee !== filters.assignee)
        return false;
      if (filters.dueDate !== "all") {
        const today = new Date();
        const taskDueDate = new Date(task.dueDate);
        const timeDiff = taskDueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (filters.dueDate === "overdue" && daysDiff >= 0) return false;
        if (filters.dueDate === "today" && daysDiff !== 0) return false;
        if (filters.dueDate === "thisweek" && (daysDiff < 0 || daysDiff > 7))
          return false;
      }
      return true;
    });
  };

  const value = {
    tasks: getFilteredTasks(),
    allTasks: tasks,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
