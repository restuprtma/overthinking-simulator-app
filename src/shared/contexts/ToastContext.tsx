import { createContext, ReactNode } from 'react';
import { useSnackbar } from '@venturo/react-ui';
import type { AlertColor } from '@venturo/react-ui';

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * ToastProvider - Legacy wrapper for backward compatibility
 * This now uses the new SnackbarProvider under the hood
 *
 * @deprecated Use SnackbarProvider and useSnackbar directly instead
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const snackbar = useSnackbar();

  const value: ToastContextType = {
    showToast: (message: string, severity: AlertColor = 'info') => {
      snackbar.showSnackbar({
        message,
        severity,
        duration: 4000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    },
    success: (message: string) => snackbar.success(message, 4000),
    error: (message: string) => snackbar.error(message, 4000),
    warning: (message: string) => snackbar.warning(message, 4000),
    info: (message: string) => snackbar.info(message, 4000),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}
