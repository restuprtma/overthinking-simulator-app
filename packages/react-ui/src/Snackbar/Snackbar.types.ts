import { ReactNode } from 'react';
import { AlertColor } from '@mui/material/Alert';

export type SnackbarSeverity = AlertColor; // 'success' | 'error' | 'warning' | 'info'

export interface SnackbarOptions {
  /** Message to display */
  message: string | ReactNode;
  /** Severity/type of the snackbar */
  severity?: SnackbarSeverity;
  /** Duration in milliseconds before auto-hide (default: 6000) */
  duration?: number;
  /** Position of the snackbar */
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /** Show close button */
  showCloseButton?: boolean;
  /** Custom action button */
  action?: ReactNode;
}

export interface SnackbarContextValue {
  /** Show a snackbar notification */
  showSnackbar: (options: SnackbarOptions) => void;
  /** Show success snackbar */
  success: (message: string | ReactNode, duration?: number) => void;
  /** Show error snackbar */
  error: (message: string | ReactNode, duration?: number) => void;
  /** Show warning snackbar */
  warning: (message: string | ReactNode, duration?: number) => void;
  /** Show info snackbar */
  info: (message: string | ReactNode, duration?: number) => void;
  /** Close current snackbar */
  close: () => void;
}

export interface SnackbarState extends SnackbarOptions {
  open: boolean;
}