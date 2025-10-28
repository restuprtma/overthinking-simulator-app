import { useState } from 'react';
import { useGetListCompanies, useDeleteCompanies } from '@/app/api/core/company/useCompanyApi';
import { useAlertDialog, useSnackbar } from '@venturo/react-ui';
import type { ListCompaniesParams } from '@/app/api/core/company/type';

/**
 * Custom hook for managing company table data and operations
 * Handles pagination, filtering, and delete operations
 */
export const useTableCompany = () => {
  // Hooks
  const { showAlert } = useAlertDialog();
  const snackbar = useSnackbar();

  // State management
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined);

  // Build query parameters
  const params: ListCompaniesParams = {
    page,
    page_size: pageSize,
    search: search || undefined,
    is_active: isActive,
    owner_id: ownerId,
  };

  // Fetch companies with React Query
  const { data, isLoading, error, refetch } = useGetListCompanies(params);

  // Delete mutation
  const deleteMutation = useDeleteCompanies({
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

  const handleStatusFilter = (status: boolean | undefined) => {
    setIsActive(status);
    setPage(1); // Reset to first page when filtering
  };

  const handleOwnerFilter = (owner: string | undefined) => {
    setOwnerId(owner);
    setPage(1); // Reset to first page when filtering
  };

  const handleDelete = async (id: string) => {
    // Find company data for display in dialog
    const company = companies.find((c) => c.id === id);
    const companyName = company?.name || 'this company';

    await showAlert({
      title: `Delete "${companyName}"?`,
      message: 'This action will soft delete the company. Are you sure you want to continue?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
      },
      onSuccess: () => {
        snackbar.success(`Company "${companyName}" has been deleted successfully`);
      },
      onError: (error) => {
        snackbar.error(`Failed to delete company: ${error.message}`);
      },
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleReset = () => {
    setSearch('');
    setIsActive(undefined);
    setOwnerId(undefined);
    setPage(1);
  };

  // Extract data from response with proper pagination structure
  const companies = data?.data?.data || [];
  const meta = data?.data?.meta?.pagination;

  return {
    // Data
    companies,
    meta,

    // Loading states
    isLoading,
    isDeleting: deleteMutation.isPending,
    error,

    // Filters
    search,
    isActive,
    ownerId,

    // Handlers
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleStatusFilter,
    handleOwnerFilter,
    handleDelete,
    handleRefresh,
    handleReset,
  };
};
