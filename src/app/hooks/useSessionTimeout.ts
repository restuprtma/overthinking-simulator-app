/**
 * Session Timeout Hook
 * Automatically logs out user after period of inactivity
 */

import { useEffect, useCallback, useRef } from 'react';
import { authService } from '../services/authService';

interface UseSessionTimeoutOptions {
  onTimeout?: () => void;
  enabled?: boolean;
}

export const useSessionTimeout = ({ onTimeout, enabled = true }: UseSessionTimeoutOptions = {}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const sessionTimeout = authService.getSessionTimeout();

  const handleTimeout = useCallback(() => {
    console.warn('Session timed out due to inactivity');
    authService.clearAuth();
    if (onTimeout) {
      onTimeout();
    } else {
      window.location.href = '/auth/login';
    }
  }, [onTimeout]);

  const checkSessionTimeout = useCallback(() => {
    if (!enabled) return;

    const isTimedOut = authService.isSessionTimedOut(sessionTimeout);
    if (isTimedOut) {
      handleTimeout();
    }
  }, [enabled, sessionTimeout, handleTimeout]);

  const resetTimeout = useCallback(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Update last activity
    authService.updateLastActivity();

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      checkSessionTimeout();
    }, 60000); // Check every minute
  }, [enabled, checkSessionTimeout]);

  // Track user activity events
  useEffect(() => {
    if (!enabled) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimeout);
    });

    // Initial setup
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, resetTimeout]);

  return {
    resetTimeout,
    checkSessionTimeout,
  };
};
