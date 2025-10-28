import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AlertDialogConfirmation } from './AlertDialogConfirmation';
import {
  AlertDialogContextValue,
  AlertDialogOptions,
  AlertDialogState,
} from './AlertDialogConfirmation.types';

export const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

interface AlertDialogProviderProps {
  children: ReactNode;
}

const initialState: AlertDialogState = {
  open: false,
  loading: false,
  error: null,
  title: '',
  message: '',
  variant: 'danger',
};

export const AlertDialogProvider: React.FC<AlertDialogProviderProps> = ({ children }) => {
  const [state, setState] = useState<AlertDialogState>(initialState);

  const showAlert = useCallback((options: AlertDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...initialState,
        ...options,
        open: true,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    // If there's an onConfirm action, execute it
    if (state.onConfirm) {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        await state.onConfirm();

        // Success - call onSuccess callback if provided
        if (state.onSuccess) {
          state.onSuccess();
        }

        // Close dialog and resolve with true
        setState(initialState);
        state.resolve?.(true);
      } catch (error) {
        // Error - call onError callback if provided
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';

        if (state.onError && error instanceof Error) {
          state.onError(error);
        }

        // Show error in dialog
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    } else {
      // No action - just close and resolve with true
      setState(initialState);
      state.resolve?.(true);
    }
  }, [state]);

  const handleCancel = useCallback(() => {
    // Don't allow cancel while loading
    if (state.loading) return;

    setState(initialState);
    state.resolve?.(false);
  }, [state]);

  const contextValue: AlertDialogContextValue = {
    showAlert,
  };

  return (
    <AlertDialogContext.Provider value={contextValue}>
      {children}
      <AlertDialogConfirmation
        state={state}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </AlertDialogContext.Provider>
  );
};

AlertDialogProvider.displayName = 'AlertDialogProvider';
