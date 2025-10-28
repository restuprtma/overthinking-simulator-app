import { useState, useCallback } from 'react';
import {
  useGetListRoles,
  useDeleteRoles,
  usePostRestoreRoles,
} from '@/app/api/core/role/useRoleApi';
import { useAlertDialog, useSnackbar } from '@venturo/react-ui';
import type { ListRolesParams } from '@/app/api/core/role/type';

export const useTableRole = () => {
  const { showAlert } = useAlertDialog();
  const snackbar = useSnackbar();

  // State management
  const [page, setPage] = useState(1);
  const [limit, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [includeSystem, setIncludeSystem] = useState<boolean | undefined>(true);
  const [showDeleted, setShowDeleted] = useState(false);

  // Build query parameters
  const params: ListRolesParams = {
    page,
    page_size: limit,
    search: search || undefined,
    include_system: includeSystem,
  };

  // Queries and mutations
  const { data, isLoading, error, refetch } = useGetListRoles(params);
  const deleteMutation = useDeleteRoles({
    onSuccess: () => {
      refetch();
    },
  });
  const restoreMutation = usePostRestoreRoles({
    onSuccess: () => {
      refetch();
    },
  });

  // Extract data from response
  const allRoles = data?.data?.data || [];
  const meta = data?.data?.meta?.pagination;

  // Filter roles based on showDeleted state
  const roles = showDeleted
    ? allRoles.filter((role) => role.deleted_at !== null && role.deleted_at !== undefined)
    : allRoles.filter((role) => !role.deleted_at);

  // Handlers
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  }, []);

  const handleIncludeSystemFilter = useCallback((value: boolean | undefined) => {
    setIncludeSystem(value);
    setPage(1);
  }, []);

  const handleDelete = async (id: string) => {
    const role = roles.find((r) => r.id === id);
    const roleName = role?.name || 'this role';

    await showAlert({
      title: `Delete "${roleName}"?`,
      message:
        'This action cannot be undone. All users with this role will lose their permissions.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
      },
      onSuccess: () => {
        snackbar.success(`Role "${roleName}" deleted successfully`);
      },
      onError: (error) => {
        snackbar.error(`Failed to delete role: ${error.message}`);
      },
    });
  };

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRestore = async (id: string) => {
    const role = allRoles.find((r) => r.id === id);
    const roleName = role?.name || 'this role';

    await showAlert({
      title: `Restore "${roleName}"?`,
      message: 'This will restore the role and make it available for assignment again.',
      confirmText: 'Restore',
      cancelText: 'Cancel',
      variant: 'info',
      onConfirm: async () => {
        await restoreMutation.mutateAsync(id);
      },
      onSuccess: () => {
        snackbar.success(`Role "${roleName}" restored successfully`);
      },
      onError: (error) => {
        snackbar.error(`Failed to restore role: ${error.message}`);
      },
    });
  };

  const handleToggleDeleted = useCallback(() => {
    setShowDeleted((prev) => !prev);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearch('');
    setIncludeSystem(true);
    setShowDeleted(false);
    setPage(1);
  }, []);

  return {
    // Data
    roles,
    meta,

    // Loading states
    isLoading,
    isDeleting: deleteMutation.isPending,
    isRestoring: restoreMutation.isPending,
    error,

    // Filter states
    search,
    includeSystem,
    showDeleted,

    // Handlers
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleIncludeSystemFilter,
    handleDelete,
    handleRestore,
    handleToggleDeleted,
    handleRefresh,
    handleReset,
  };
};
