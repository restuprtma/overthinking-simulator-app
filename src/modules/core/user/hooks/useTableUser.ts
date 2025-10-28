import { useState } from 'react';
import { useGetListUsers, useDeleteUsers } from '@/app/api/core/user/useUserApi';
import { useAlertDialog, useSnackbar } from '@venturo/react-ui';
import type { ListUsersParams } from '@/app/api/core/user/type';

/**
 * Custom hook for managing user table data and operations
 * Handles pagination, filtering, and delete operations
 */
export const useTableUser = () => {
  // Hooks
  const { showAlert } = useAlertDialog();
  const snackbar = useSnackbar();

  // State management
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  // Build query parameters
  const params: ListUsersParams = {
    page,
    page_size: pageSize,
    search: search || undefined,
    full_name: fullName || undefined,
    username: username || undefined,
    email: email || undefined,
    is_active: isActive,
  };

  // Fetch users with React Query
  const { data, isLoading, error, refetch } = useGetListUsers(params);

  // Delete mutation
  const deleteMutation = useDeleteUsers({
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

  const handleFullNameFilter = (value: string) => {
    setFullName(value);
    setPage(1);
  };

  const handleUsernameFilter = (value: string) => {
    setUsername(value);
    setPage(1);
  };

  const handleEmailFilter = (value: string) => {
    setEmail(value);
    setPage(1);
  };

  const handleStatusFilter = (status: boolean | undefined) => {
    setIsActive(status);
    setPage(1); // Reset to first page when filtering
  };

  const handleDelete = async (id: string) => {
    // Find user data for display in dialog
    const user = users.find((u) => u.id === id);
    const userName = user?.full_name || 'this user';

    await showAlert({
      title: `Delete "${userName}"?`,
      message: 'This action cannot be undone. Are you sure you want to delete this user?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
      },
      onSuccess: () => {
        snackbar.success(`User "${userName}" has been deleted successfully`);
      },
      onError: (error) => {
        snackbar.error(`Failed to delete user: ${error.message}`);
      },
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleReset = () => {
    setSearch('');
    setFullName('');
    setUsername('');
    setEmail('');
    setIsActive(undefined);
    setPage(1);
  };

  // Extract data from response with proper pagination structure
  const users = data?.data?.data || [];
  const meta = data?.data?.meta?.pagination;

  return {
    // Data
    users,
    meta,

    // Loading states
    isLoading,
    isDeleting: deleteMutation.isPending,
    error,

    // Filters
    search,
    fullName,
    username,
    email,
    isActive,

    // Handlers
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleFullNameFilter,
    handleUsernameFilter,
    handleEmailFilter,
    handleStatusFilter,
    handleDelete,
    handleRefresh,
    handleReset,
  };
};
