import { ReactNode } from 'react';

export type AlertDialogVariant = 'danger' | 'warning' | 'info' | 'success';

export interface AlertDialogOptions {
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string | ReactNode;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Visual variant for the dialog */
  variant?: AlertDialogVariant;
  /** Optional icon to display */
  icon?: ReactNode;
  /** Hide cancel button */
  hideCancelButton?: boolean;
  /** Action to execute on confirm - if provided, dialog will handle loading state */
  onConfirm?: () => Promise<void> | void;
  /** Callback when action succeeds */
  onSuccess?: () => void;
  /** Callback when action fails */
  onError?: (error: Error) => void;
  /** Custom content to render instead of message */
  customContent?: ReactNode;
}

export interface AlertDialogContextValue {
  /** Show alert dialog and return promise that resolves to boolean (true if confirmed, false if cancelled) */
  showAlert: (options: AlertDialogOptions) => Promise<boolean>;
}

export interface AlertDialogState extends AlertDialogOptions {
  open: boolean;
  loading: boolean;
  error: string | null;
  resolve?: (value: boolean) => void;
}
