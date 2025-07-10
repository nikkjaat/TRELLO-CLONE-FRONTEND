import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, RotateCcw } from 'lucide-react';
import styles from './TaskTimer.module.css';

const TaskTimer = ({ taskId, initialTime = 0, onTimeUpdate }) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          setSessionTime(prev => prev + 1);
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setSessionTime(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setSessionTime(0);
    if (onTimeUpdate) {
      onTimeUpdate(0);
    }
  };

  return (
    <div className={styles.taskTimer}>
      <div className={styles.timerHeader}>
        <Clock size={16} />
        <span className={styles.timerLabel}>Time Tracker</span>
      </div>
      
      <div className={styles.timerDisplay}>
        <div className={styles.totalTime}>
          <span className={styles.timeLabel}>Total:</span>
          <span className={styles.timeValue}>{formatTime(time)}</span>
        </div>
        
        {sessionTime > 0 && (
          <div className={styles.sessionTime}>
            <span className={styles.timeLabel}>Session:</span>
            <span className={styles.timeValue}>{formatTime(sessionTime)}</span>
          </div>
        )}
      </div>

      <div className={styles.timerControls}>
        {!isRunning ? (
          <button onClick={handleStart} className={`${styles.controlButton} ${styles.playButton}`}>
            <Play size={14} />
            Start
          </button>
        ) : (
          <button onClick={handlePause} className={`${styles.controlButton} ${styles.pauseButton}`}>
            <Pause size={14} />
            Pause
          </button>
        )}
        
        <button onClick={handleStop} className={`${styles.controlButton} ${styles.stopButton}`}>
          <Square size={14} />
          Stop
        </button>
        
        <button onClick={handleReset} className={`${styles.controlButton} ${styles.resetButton}`}>
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {isRunning && (
        <div className={styles.runningIndicator}>
          <div className={styles.pulse}></div>
          <span>Timer Running</span>
        </div>
      )}
    </div>
  );
};

export default TaskTimer;