import { useState, useCallback } from 'react';

/**
 * Dialog state management hook
 * Manages dialog state for create/edit operations with type safety
 *
 * @template T - The type of the item being created/edited
 * @returns Object containing dialog state and control functions
 *
 * @example
 * ```tsx
 * const { dialogState, openCreate, openEdit, reset } = useDialogState<User>();
 *
 * // Open dialog for creating new item
 * <Button onClick={openCreate}>Create</Button>
 *
 * // Open dialog for editing existing item
 * <Button onClick={() => openEdit(user)}>Edit</Button>
 *
 * // Access current state
 * <UserForm
 *   mode={dialogState.mode}
 *   user={dialogState.item}
 *   onClose={reset}
 * />
 * ```
 */
export function useDialogState<T>() {
  const [dialogState, setDialogState] = useState<{
    mode: 'create' | 'edit';
    item: T | null;
  }>({
    mode: 'create',
    item: null,
  });

  /**
   * Opens dialog in create mode
   */
  const openCreate = useCallback(() => {
    setDialogState({ mode: 'create', item: null });
  }, []);

  /**
   * Opens dialog in edit mode with the provided item
   * @param item - The item to edit
   */
  const openEdit = useCallback((item: T) => {
    setDialogState({ mode: 'edit', item });
  }, []);

  /**
   * Resets dialog state to initial create mode
   * Useful for onClose handlers
   */
  const reset = useCallback(() => {
    setDialogState({ mode: 'create', item: null });
  }, []);

  return {
    dialogState,
    openCreate,
    openEdit,
    reset,
    // Expose setter for advanced use cases
    setDialogState,
  };
}
