import { useState } from 'react';
import {
  useGetListPermissionTemplates,
  useDeletePermissionTemplate,
} from '@/app/api/core/permission-template/usePermissionTemplateApi';
import { useAlertDialog, useSnackbar } from '@venturo/react-ui';
import type { ListPermissionTemplatesParams } from '@/app/api/core/permission-template/type';

/**
 * Custom hook for managing permission template table data and operations
 * Handles pagination, filtering, and delete operations
 */
export const useTablePermissionTemplate = () => {
  // Hooks
  const { showAlert } = useAlertDialog();
  const snackbar = useSnackbar();

  // State management
  const [page, setPage] = useState(1);
  const [limit, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [includeSystem, setIncludeSystem] = useState<boolean>(true);

  // Build query parameters
  const params: ListPermissionTemplatesParams = {
    page,
    page_size: limit,
    search: search || undefined,
    include_system: includeSystem,
  };

  // Fetch permission templates with React Query
  const { data, isLoading, error, refetch } = useGetListPermissionTemplates(params);

  // Delete mutation
  const deleteMutation = useDeletePermissionTemplate({
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
    setPage(1); // Reset to first page when changing limit
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1); // Reset to first page when searching
  };

  const handleIncludeSystemFilter = (include: boolean) => {
    setIncludeSystem(include);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    // Find template data for display in dialog
    const template = permissionTemplates.find((t) => t.id === id);
    const templateName = template?.name || 'this template';

    // Check if it's a system template
    if (template?.is_system) {
      snackbar.error('System templates cannot be deleted');
      return;
    }

    await showAlert({
      title: `Delete "${templateName}"?`,
      message:
        'This action cannot be undone. Are you sure you want to delete this permission template?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
      },
      onSuccess: () => {
        snackbar.success(`Permission template "${templateName}" has been deleted successfully`);
      },
      onError: (error) => {
        snackbar.error(`Failed to delete permission template: ${error.message}`);
      },
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleReset = () => {
    setSearch('');
    setIncludeSystem(true);
    setPage(1);
  };

  // Extract data from response with proper pagination structure
  const permissionTemplates = data?.data?.data || [];
  const meta = data?.data?.meta?.pagination;

  return {
    // Data
    permissionTemplates,
    meta,

    // Loading states
    isLoading,
    isDeleting: deleteMutation.isPending,
    error,

    // Filters
    search,
    includeSystem,

    // Handlers
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleIncludeSystemFilter,
    handleDelete,
    handleRefresh,
    handleReset,
  };
};
