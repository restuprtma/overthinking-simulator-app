import React, { useEffect, useState, useRef } from 'react';
import MuiSnackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { SnackbarState } from './Snackbar.types';

interface SnackbarProps {
  state: SnackbarState;
  onClose: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({ state, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const pauseStartTimeRef = useRef<number | null>(null);
  const maxPauseDuration = 10000; // 10 seconds failsafe

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  const {
    open,
    message,
    severity = 'success',
    duration = 6000,
    anchorOrigin = { vertical: 'top', horizontal: 'right' },
    showCloseButton = true,
    action,
  } = state;

  // Handle visibility change (tab switch, minimize) and window blur/focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPaused) {
        // When tab becomes hidden and snackbar is paused, force unpause
        setIsPaused(false);
        pauseStartTimeRef.current = null;
      }
    };

    const handleWindowBlur = () => {
      // When window loses focus (mouse outside browser), force unpause after short delay
      if (isPaused) {
        setTimeout(() => {
          setIsPaused(false);
          pauseStartTimeRef.current = null;
        }, 500); // 500ms grace period
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isPaused]);

  // Failsafe: Auto-unpause after maximum pause duration
  useEffect(() => {
    if (isPaused && pauseStartTimeRef.current === null) {
      pauseStartTimeRef.current = Date.now();
    }

    if (!isPaused) {
      pauseStartTimeRef.current = null;
      return;
    }

    const checkPauseDuration = setInterval(() => {
      if (pauseStartTimeRef.current && Date.now() - pauseStartTimeRef.current > maxPauseDuration) {
        // Force unpause after max duration
        setIsPaused(false);
        pauseStartTimeRef.current = null;
      }
    }, 1000);

    return () => clearInterval(checkPauseDuration);
  }, [isPaused, maxPauseDuration]);

  // Countdown progress bar with pause on hover
  useEffect(() => {
    if (!open) {
      setProgress(100);
      setIsPaused(false);
      pauseStartTimeRef.current = null;
      return;
    }

    // Update progress every 50ms
    const interval = 50;
    const steps = duration / interval;
    const decrement = 100 / steps;

    setProgress(100);

    const timer = setInterval(() => {
      setProgress((prev) => {
        // Pause countdown when hovering
        if (isPaused) {
          return prev;
        }
        const next = prev - decrement;
        return next < 0 ? 0 : next;
      });
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [open, duration, isPaused]);

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={isPaused ? null : duration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <MuiAlert
        onClose={showCloseButton ? handleClose : undefined}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', position: 'relative', overflow: 'hidden' }}
        action={action}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {message}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            },
          }}
        />
      </MuiAlert>
    </MuiSnackbar>
  );
};

Snackbar.displayName = 'Snackbar';
