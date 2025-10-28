import { useContext } from 'react';
import { AlertDialogContext } from './AlertDialogProvider';
import { AlertDialogContextValue } from './AlertDialogConfirmation.types';

/**
 * Hook to access alert dialog functionality
 * Must be used within AlertDialogProvider
 *
 * @example
 * ```tsx
 * const { showAlert } = useAlertDialog();
 *
 * // Simple confirmation
 * const confirmed = await showAlert({
 *   title: "Delete item?",
 *   message: "This action cannot be undone.",
 *   confirmText: "Delete",
 *   variant: "danger"
 * });
 *
 * if (confirmed) {
 *   // Handle confirmation
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With action
 * await showAlert({
 *   title: "Delete item?",
 *   message: "This action cannot be undone.",
 *   confirmText: "Delete",
 *   variant: "danger",
 *   onConfirm: async () => {
 *     await deleteItem(id);
 *   },
 *   onSuccess: () => {
 *     toast.success("Item deleted");
 *   },
 *   onError: (error) => {
 *     toast.error(error.message);
 *   }
 * });
 * ```
 */
export const useAlertDialog = (): AlertDialogContextValue => {
  const context = useContext(AlertDialogContext);

  if (!context) {
    throw new Error('useAlertDialog must be used within AlertDialogProvider');
  }

  return context;
};
