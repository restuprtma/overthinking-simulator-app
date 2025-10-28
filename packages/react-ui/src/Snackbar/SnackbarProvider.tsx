import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar } from './Snackbar';
import {
  SnackbarContextValue,
  SnackbarOptions,
  SnackbarState,
} from './Snackbar.types';

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

interface SnackbarProviderProps {
  children: ReactNode;
}

const initialState: SnackbarState = {
  open: false,
  message: '',
  severity: 'success',
  duration: 6000,
  anchorOrigin: { vertical: 'top', horizontal: 'right' },
  showCloseButton: true,
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [state, setState] = useState<SnackbarState>(initialState);

  const showSnackbar = useCallback((options: SnackbarOptions) => {
    setState({
      ...initialState,
      ...options,
      open: true,
    });
  }, []);

  const success = useCallback(
    (message: string | ReactNode, duration?: number) => {
      showSnackbar({
        message,
        severity: 'success',
        duration,
      });
    },
    [showSnackbar]
  );

  const error = useCallback(
    (message: string | ReactNode, duration?: number) => {
      showSnackbar({
        message,
        severity: 'error',
        duration,
      });
    },
    [showSnackbar]
  );

  const warning = useCallback(
    (message: string | ReactNode, duration?: number) => {
      showSnackbar({
        message,
        severity: 'warning',
        duration,
      });
    },
    [showSnackbar]
  );

  const info = useCallback(
    (message: string | ReactNode, duration?: number) => {
      showSnackbar({
        message,
        severity: 'info',
        duration,
      });
    },
    [showSnackbar]
  );

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const contextValue: SnackbarContextValue = {
    showSnackbar,
    success,
    error,
    warning,
    info,
    close,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar state={state} onClose={close} />
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.displayName = 'SnackbarProvider';