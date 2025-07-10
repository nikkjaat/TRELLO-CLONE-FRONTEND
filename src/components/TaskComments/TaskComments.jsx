import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Send, MessageCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import styles from './TaskComments.module.css';

const TaskComments = ({ taskId, comments = [], onCommentsChange }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const commentsEndRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [comments, isExpanded]);

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        author: user.name,
        authorId: user.id,
        authorRole: user.role,
        createdAt: new Date().toISOString()
      };
      onCommentsChange([...comments, comment]);
      setNewComment('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#e53e3e';
      case 'vendor': return '#38a169';
      case 'customer': return '#3182ce';
      default: return '#718096';
    }
  };

  return (
    <div className={styles.taskComments}>
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.headerContent}>
          <MessageCircle size={16} />
          <span className={styles.title}>Comments</span>
          <span className={styles.count}>({comments.length})</span>
        </div>
        <div className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
          ▼
        </div>
      </div>

      {isExpanded && (
        <div className={styles.commentsContainer}>
          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <div className={styles.emptyState}>
                <MessageCircle size={24} />
                <p>No comments yet. Start the conversation!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <div className={styles.authorInfo}>
                      <User size={14} />
                      <span className={styles.authorName}>{comment.author}</span>
                      <span 
                        className={styles.authorRole}
                        style={{ backgroundColor: getRoleColor(comment.authorRole) }}
                      >
                        {comment.authorRole}
                      </span>
                    </div>
                    <span className={styles.timestamp}>
                      {format(new Date(comment.createdAt), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <div className={styles.commentText}>
                    {comment.text}
                  </div>
                </div>
              ))
            )}
            <div ref={commentsEndRef} />
          </div>

          <div className={styles.addComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a comment... (Press Enter to send)"
              className={styles.commentInput}
              rows={2}
            />
            <button 
              onClick={addComment}
              disabled={!newComment.trim()}
              className={styles.sendButton}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskComments;