import { useState } from 'react';
import {
  useGetListPermissions,
  useDeletePermissions,
} from '@/app/api/core/permission/usePermissionApi';
import { useAlertDialog, useSnackbar } from '@venturo/react-ui';
import type { ListPermissionsParams } from '@/app/api/core/permission/type';

/**
 * Custom hook for managing permission table data and operations
 * Handles pagination, filtering, and delete operations
 */
export const useTablePermission = () => {
  // Hooks
  const { showAlert } = useAlertDialog();
  const snackbar = useSnackbar();

  // State management
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [resource, setResource] = useState('');
  const [action, setAction] = useState('');
  const [moduleId, setModuleId] = useState('');

  // Build query parameters
  const params: ListPermissionsParams = {
    page,
    page_size: pageSize,
    search: search || undefined,
    resource: resource || undefined,
    action: action || undefined,
    module_id: moduleId || undefined,
  };

  // Fetch permissions with React Query
  const { data, isLoading, error, refetch } = useGetListPermissions(params);

  // Delete mutation
  const deleteMutation = useDeletePermissions({
    onSuccess: () => {
      refetch();
    },
  });

  // Handler functions
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1); // Reset to first page when searching
  };

  const handleResourceFilter = (value: string) => {
    setResource(value);
    setPage(1);
  };

  const handleActionFilter = (value: string) => {
    setAction(value);
    setPage(1);
  };

  const handleModuleIdFilter = (value: string) => {
    setModuleId(value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    // Find permission data for display in dialog
    const permission = permissions.find((p) => p.id === id);
    const permissionName = permission
      ? `${permission.resource}:${permission.action}`
      : 'this permission';

    await showAlert({
      title: `Delete "${permissionName}"?`,
      message:
        'This action cannot be undone. The permission will be removed from all roles. Are you sure you want to delete this permission?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
      },
      onSuccess: () => {
        snackbar.success(`Permission "${permissionName}" has been deleted successfully`);
      },
      onError: (error) => {
        snackbar.error(`Failed to delete permission: ${error.message}`);
      },
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleReset = () => {
    setSearch('');
    setResource('');
    setAction('');
    setModuleId('');
    setPage(1);
  };

  // Extract data from response with proper pagination structure
  const permissions = data?.data?.data || [];
  const meta = data?.data?.meta?.pagination;

  return {
    // Data
    permissions,
    meta,

    // Loading states
    isLoading,
    isDeleting: deleteMutation.isPending,
    error,

    // Filters
    search,
    resource,
    action,
    moduleId,

    // Handlers
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleResourceFilter,
    handleActionFilter,
    handleModuleIdFilter,
    handleDelete,
    handleRefresh,
    handleReset,
  };
};
