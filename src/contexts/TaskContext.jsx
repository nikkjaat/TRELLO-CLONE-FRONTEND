import React, { createContext, useContext, useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";

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
    getTasks();
  }, []);

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

  const updateTask = (taskId, updates) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
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
