import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTask } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import TaskCard from '../TaskCard/TaskCard';
import TaskModal from '../TaskModal/TaskModal';
import BulkActions from '../BulkActions/BulkActions';
import { Plus, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import styles from './KanbanBoard.module.css';

const KanbanBoard = () => {
  const { tasks, moveTask } = useTask();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const columns = [
    { id: 'todo', title: 'To Do', icon: AlertCircle, color: '#f56565' },
    { id: 'inprogress', title: 'In Progress', icon: Clock, color: '#ed8936' },
    { id: 'done', title: 'Done', icon: CheckCircle, color: '#48bb78' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    moveTask(draggableId, destination.droppableId);
  };

  const handleAddTask = (columnId) => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const canAddTask = () => {
    return user.role === 'admin' || user.role === 'vendor';
  };

  const handleTaskSelect = (taskId, isSelected) => {
    setSelectedTasks(prev => {
      if (isSelected) {
        return [...prev, taskId];
      } else {
        return prev.filter(id => id !== taskId);
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
  };

  return (
    <div className={styles.kanbanBoard}>
      <div className={styles.boardHeader}>
        <h2 className={styles.boardTitle}>Project Board</h2>
        <div className={styles.taskCount}>
          Total Tasks: {tasks.length}
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.columns}>
          {columns.map(column => {
            const columnTasks = getTasksByStatus(column.id);
            const IconComponent = column.icon;

            return (
              <div key={column.id} className={styles.column}>
                <div className={styles.columnHeader}>
                  <div className={styles.columnTitle}>
                    <IconComponent 
                      size={20} 
                      style={{ color: column.color }}
                    />
                    <span>{column.title}</span>
                    <span className={styles.taskCount}>
                      {columnTasks.length}
                    </span>
                  </div>
                  
                  {canAddTask() && column.id === 'todo' && (
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className={styles.addButton}
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`${styles.columnContent} ${
                        snapshot.isDraggingOver ? styles.draggingOver : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${styles.taskWrapper} ${
                                snapshot.isDragging ? styles.dragging : ''
                              }`}
                            >
                              <TaskCard
                                task={task}
                                onEdit={handleEditTask}
                                isSelected={selectedTasks.includes(task.id)}
                                onSelect={handleTaskSelect}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {columnTasks.length === 0 && (
                        <div className={styles.emptyColumn}>
                          <p>No tasks in {column.title.toLowerCase()}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <BulkActions
        selectedTasks={selectedTasks}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
};

export default KanbanBoard;