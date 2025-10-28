import { useContext } from 'react';
import { SnackbarContext } from './SnackbarProvider';
import { SnackbarContextValue } from './Snackbar.types';

/**
 * Hook to access snackbar functionality
 * Must be used within SnackbarProvider
 *
 * @example
 * ```tsx
 * const snackbar = useSnackbar();
 *
 * // Show success message
 * snackbar.success("Data saved successfully");
 *
 * // Show error message
 * snackbar.error("Failed to save data");
 *
 * // Show warning message
 * snackbar.warning("Connection is slow");
 *
 * // Show info message
 * snackbar.info("New update available");
 *
 * // Custom snackbar
 * snackbar.showSnackbar({
 *   message: "Custom message",
 *   severity: "success",
 *   duration: 3000,
 *   anchorOrigin: { vertical: 'top', horizontal: 'center' }
 * });
 * ```
 */
export const useSnackbar = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }

  return context;
};