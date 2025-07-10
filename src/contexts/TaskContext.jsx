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

const initialTasks = [
  {
    id: "1",
    title: "Setup Project Architecture",
    description:
      "Create the basic project structure and setup development environment",
    priority: "high",
    assignee: "Admin User",
    assigneeId: 1,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: format(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    tags: ["setup", "architecture"],
    subtasks: [],
    timeSpent: 0,
    comments: [],
  },
  {
    id: "2",
    title: "Design User Interface",
    description: "Create mockups and design system for the application",
    priority: "medium",
    assignee: "Vendor User",
    assigneeId: 2,
    status: "inprogress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: format(
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    tags: ["design", "ui"],
    subtasks: [
      {
        id: "1",
        text: "Create wireframes",
        completed: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        text: "Design components",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ],
    timeSpent: 3600,
    comments: [
      {
        id: "1",
        text: "Started working on the mockups",
        author: "Vendor User",
        authorId: 2,
        authorRole: "vendor",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "3",
    title: "Implement Authentication",
    description: "Add user login and registration functionality",
    priority: "high",
    assignee: "Admin User",
    assigneeId: 1,
    status: "done",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: format(
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    tags: ["auth", "security"],
    subtasks: [
      {
        id: "1",
        text: "Setup login form",
        completed: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        text: "Add validation",
        completed: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        text: "Test authentication",
        completed: true,
        createdAt: new Date().toISOString(),
      },
    ],
    timeSpent: 7200,
    comments: [],
  },
  {
    id: "4",
    title: "Write Documentation",
    description: "Create comprehensive documentation for the project",
    priority: "low",
    assignee: "Customer User",
    assigneeId: 3,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: format(
      new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    tags: ["docs", "content"],
    subtasks: [],
    timeSpent: 0,
    comments: [],
  },
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    priority: "all",
    assignee: "all",
    dueDate: "all",
  });

  useEffect(() => {
    const storedTasks = localStorage.getItem("taskManager_tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(initialTasks);
    }
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
