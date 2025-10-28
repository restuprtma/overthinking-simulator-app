import { useState, useCallback } from 'react';
import {
  useGetListModules,
  useDeleteModules,
  useRestoreModule,
} from '@/app/api/core/module/useModuleApi';
import { useSnackbar, useAlertDialog } from '@venturo/react-ui';
import type { ApiError } from '@/shared/types/api/type';

export const useTableModule = () => {
  const { success, error: showError } = useSnackbar();
  const { showAlert } = useAlertDialog();

  // Table state
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  // Fetch modules (no pagination in v3 API)
  const {
    data: modulesData,
    isLoading,
    error,
  } = useGetListModules({
    search: search || undefined,
    is_active: isActive,
  });

  // Delete mutation
  const deleteMutation = useDeleteModules();
  const restoreMutation = useRestoreModule();

  // Extract data (no pagination wrapper in v3 API)
  const modules = modulesData?.data?.data || [];

  // Handlers
  const handleSearch = useCallback((searchValue: string) => {
    setSearch(searchValue);
  }, []);

  const handleIsActiveFilter = useCallback((value: boolean | undefined) => {
    setIsActive(value);
  }, []);

  const handleDelete = useCallback(
    async (id: string, moduleName: string) => {
      const confirmed = await showAlert({
        title: 'Delete Module',
        message: `Are you sure you want to delete module "${moduleName}"? This action can be undone by restoring the module.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger',
      });

      if (confirmed) {
        try {
          await deleteMutation.mutateAsync(id);
          success(`Module "${moduleName}" deleted successfully`);
        } catch (err) {
          const apiError = err as ApiError;
          const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to delete module';
          showError(errorMessage);
        }
      }
    },
    [deleteMutation, success, showError, showAlert],
  );

  const handleRestore = useCallback(
    async (id: string, moduleName: string) => {
      const confirmed = await showAlert({
        title: 'Restore Module',
        message: `Are you sure you want to restore module "${moduleName}"?`,
        confirmText: 'Restore',
        cancelText: 'Cancel',
        variant: 'info',
      });

      if (confirmed) {
        try {
          await restoreMutation.mutateAsync(id);
          success(`Module "${moduleName}" restored successfully`);
        } catch (err) {
          const apiError = err as ApiError;
          const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to restore module';
          showError(errorMessage);
        }
      }
    },
    [restoreMutation, success, showError, showAlert],
  );

  const handleReset = useCallback(() => {
    setSearch('');
    setIsActive(undefined);
  }, []);

  return {
    modules,
    isLoading,
    isDeleting: deleteMutation.isPending || restoreMutation.isPending,
    error,
    search,
    isActive,
    handleSearch,
    handleIsActiveFilter,
    handleDelete,
    handleRestore,
    handleReset,
  };
};
