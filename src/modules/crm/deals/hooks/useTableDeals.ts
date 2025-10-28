import { useState } from 'react';
import { useAlertDialog, useSnackbar } from '@venturo/react-ui';
import type { Deal } from '../types';

/**
 * Custom hook for managing deals table data and operations
 * Handles pagination, filtering, and delete operations
 *
 * Note: This currently uses mock data. Replace with actual API calls when available.
 */
export const useTableDeals = () => {
  // Hooks
  const { showAlert } = useAlertDialog();
  const snackbar = useSnackbar();

  // State management
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [source, setSource] = useState('all');
  const [salesPerson, setSalesPerson] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data - replace with actual API call
  const mockDealsData: Deal[] = [
    {
      id: 'DEAL-001',
      clientName: 'PT. Maju Jaya',
      contactPerson: 'Budi Santoso',
      phone: '+62 812-3456-7890',
      email: 'budi@majujaya.com',
      salesPerson: 'Ahmad',
      salesAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      dealValue: 250000000,
      status: 'Won',
      closeDate: '15/12/2024',
      duration: '45 hari',
      category: 'Enterprise',
      source: 'WhatsApp',
      notes: 'Deal closed successfully after 3 meetings. Client satisfied with proposal.',
      commission: 12500000,
    },
    {
      id: 'DEAL-002',
      clientName: 'CV. Berkah Mandiri',
      contactPerson: 'Siti Nurhaliza',
      phone: '+62 813-9876-5432',
      email: 'siti@berkah.co.id',
      salesPerson: 'Sari',
      salesAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
      dealValue: 180000000,
      status: 'Won',
      closeDate: '14/12/2024',
      duration: '32 hari',
      category: 'SME',
      source: 'Referral',
      notes: 'Quick conversion. Client was referred by existing customer.',
      commission: 9000000,
    },
    {
      id: 'DEAL-003',
      clientName: 'PT. Teknologi Masa Depan',
      contactPerson: 'Doni Wirawan',
      phone: '+62 821-1111-2222',
      email: 'doni@tekmas.com',
      salesPerson: 'Linda',
      salesAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      dealValue: 500000000,
      status: 'Won',
      closeDate: '13/12/2024',
      duration: '67 hari',
      category: 'Enterprise',
      source: 'Cold Call',
      notes: 'Large enterprise deal. Required extensive negotiation and multiple approvals.',
      commission: 25000000,
    },
    {
      id: 'DEAL-004',
      clientName: 'Toko Sejahtera',
      contactPerson: 'Andi Pratama',
      phone: '+62 817-3333-4444',
      email: 'andi@sejahtera.id',
      salesPerson: 'Budi',
      salesAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      dealValue: 75000000,
      status: 'Lost',
      closeDate: '12/12/2024',
      duration: '28 hari',
      category: 'SME',
      source: 'Website',
      notes: 'Lost to competitor due to pricing. Client chose cheaper alternative.',
      commission: 0,
    },
    {
      id: 'DEAL-005',
      clientName: 'PT. Inovasi Digital',
      contactPerson: 'Maya Sari',
      phone: '+62 811-5555-6666',
      email: 'maya@inovasidigital.com',
      salesPerson: 'Eko',
      salesAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      dealValue: 320000000,
      status: 'Won',
      closeDate: '11/12/2024',
      duration: '52 hari',
      category: 'Enterprise',
      source: 'WhatsApp',
      notes: 'Technical solution deal. Required demo and POC phase.',
      commission: 16000000,
    },
  ];

  // Filter deals
  const filteredDeals = mockDealsData.filter((deal) => {
    const matchesSearch =
      search === '' ||
      deal.clientName.toLowerCase().includes(search.toLowerCase()) ||
      deal.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      deal.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === 'all' || deal.status === status;
    const matchesSource = source === 'all' || deal.source === source;
    const matchesSalesPerson = salesPerson === 'all' || deal.salesPerson === salesPerson;

    return matchesSearch && matchesStatus && matchesSource && matchesSalesPerson;
  });

  // Pagination
  const totalItems = filteredDeals.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDeals = filteredDeals.slice(startIndex, endIndex);

  // Build meta for VenturoTable
  const meta = {
    total: totalItems,
    page: page,
    limit: pageSize,
    total_pages: totalPages,
  };

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

  const handleStatusFilter = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleSourceFilter = (value: string) => {
    setSource(value);
    setPage(1);
  };

  const handleSalesPersonFilter = (value: string) => {
    setSalesPerson(value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    // Find deal data for display in dialog
    const deal = paginatedDeals.find((d) => d.id === id);
    const dealName = deal?.clientName || 'this deal';

    await showAlert({
      title: `Delete "${dealName}"?`,
      message: 'This action cannot be undone. Are you sure you want to delete this deal?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        setIsDeleting(true);
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsDeleting(false);
      },
      onSuccess: () => {
        snackbar.success(`Deal "${dealName}" has been deleted successfully`);
      },
      onError: (error) => {
        snackbar.error(`Failed to delete deal: ${error.message}`);
      },
    });
  };

  const handleRefresh = () => {
    // TODO: Replace with actual refetch when API is implemented
    snackbar.success('Data refreshed');
  };

  const handleReset = () => {
    setSearch('');
    setStatus('all');
    setSource('all');
    setSalesPerson('all');
    setPage(1);
  };

  return {
    // Data
    deals: paginatedDeals,
    meta,

    // Loading states
    isLoading: false, // TODO: Replace with actual loading state from API
    isDeleting,
    error: null, // TODO: Replace with actual error from API

    // Filters
    search,
    status,
    source,
    salesPerson,

    // Handlers
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleStatusFilter,
    handleSourceFilter,
    handleSalesPersonFilter,
    handleDelete,
    handleRefresh,
    handleReset,
  };
};
