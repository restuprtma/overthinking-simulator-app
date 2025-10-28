import { useState } from 'react';
import { useAlertDialog, useSnackbar } from '@venturo/react-ui';
import type { Lead } from '../types';

/**
 * Custom hook for managing leads table data and operations
 * Handles pagination, filtering, and delete operations
 *
 * Note: This currently uses mock data. Replace with actual API calls when available.
 */
export const useTableLeads = () => {
  // Hooks
  const { showAlert } = useAlertDialog();
  const snackbar = useSnackbar();

  // State management
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [source, setSource] = useState('all');
  const [assignedTo, setAssignedTo] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data - replace with actual API call
  const mockLeadsData: Lead[] = [
    {
      id: 1,
      name: 'PT. Maju Jaya',
      contact: 'Pak Bambang',
      phone: '+62 812-3456-7890',
      email: 'bambang@majujaya.com',
      category: 'hot',
      assignedTo: 'Ahmad',
      assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextFollowUp: 'Besok 14:00',
      source: 'WhatsApp',
      deal_value: 'Rp 50,000,000',
      status: 'in_progress',
      aiHighlights: ['Minta penawaran', 'Budget ready', 'Butuh cepat'],
      responseTime: 'Cepat (< 1 jam)',
    },
    {
      id: 2,
      name: 'CV. Berkah Mandiri',
      contact: 'Bu Sari',
      phone: '+62 813-9876-5432',
      email: 'sari@berkahmandiri.co.id',
      category: 'warm',
      assignedTo: 'Sari',
      assignedToAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
      lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000),
      nextFollowUp: 'Minggu depan',
      source: 'Website Form',
      deal_value: 'Rp 25,000,000',
      status: 'qualified',
      aiHighlights: ['Tertarik produk', 'Minta demo'],
      responseTime: 'Sedang (1-4 jam)',
    },
    {
      id: 3,
      name: 'Toko Sumber Rezeki',
      contact: 'Pak Andi',
      phone: '+62 814-5555-1234',
      email: 'andi@sumberrezeki.com',
      category: 'cold',
      assignedTo: 'Budi',
      assignedToAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      nextFollowUp: 'Overdue - 1 hari lalu',
      source: 'Cold Call',
      deal_value: 'Rp 10,000,000',
      status: 'new',
      aiHighlights: ['Belum yakin', 'Perlu waktu'],
      responseTime: 'Lambat (> 1 hari)',
    },
    {
      id: 4,
      name: 'PT. Sejahtera Abadi',
      contact: 'Bu Linda',
      phone: '+62 815-7777-9999',
      email: 'linda@sejahtera.co.id',
      category: 'hot',
      assignedTo: 'Linda',
      assignedToAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      lastContact: new Date(Date.now() - 30 * 60 * 1000),
      nextFollowUp: 'Hari ini 16:00',
      source: 'Referral',
      deal_value: 'Rp 75,000,000',
      status: 'proposal_sent',
      aiHighlights: ['Deal hampir close', 'Tunggu approval'],
      responseTime: 'Sangat Cepat (< 30 menit)',
    },
    {
      id: 5,
      name: 'UD. Makmur Sentosa',
      contact: 'Pak Eko',
      phone: '+62 816-3333-8888',
      email: 'eko@makmursentosa.com',
      category: 'warm',
      assignedTo: 'Eko',
      assignedToAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      nextFollowUp: 'Besok 10:00',
      source: 'Social Media',
      deal_value: 'Rp 30,000,000',
      status: 'follow_up',
      aiHighlights: ['Bandingkan harga', 'Tertarik fitur'],
      responseTime: 'Cepat (< 2 jam)',
    },
  ];

  // Filter leads
  const filteredLeads = mockLeadsData.filter((lead) => {
    const matchesSearch =
      search === '' ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.contact.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.email.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === 'all' || lead.category === category;
    const matchesSource = source === 'all' || lead.source === source;
    const matchesAssignedTo = assignedTo === 'all' || lead.assignedTo === assignedTo;

    return matchesSearch && matchesCategory && matchesSource && matchesAssignedTo;
  });

  // Pagination
  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

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

  const handleCategoryFilter = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleSourceFilter = (value: string) => {
    setSource(value);
    setPage(1);
  };

  const handleAssignedToFilter = (value: string) => {
    setAssignedTo(value);
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    // Find lead data for display in dialog
    const lead = paginatedLeads.find((l) => l.id === id);
    const leadName = lead?.name || 'this lead';

    await showAlert({
      title: `Delete "${leadName}"?`,
      message: 'This action cannot be undone. Are you sure you want to delete this lead?',
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
        snackbar.success(`Lead "${leadName}" has been deleted successfully`);
      },
      onError: (error) => {
        snackbar.error(`Failed to delete lead: ${error.message}`);
      },
    });
  };

  const handleRefresh = () => {
    // TODO: Replace with actual refetch when API is implemented
    snackbar.success('Data refreshed');
  };

  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setSource('all');
    setAssignedTo('all');
    setPage(1);
  };

  return {
    // Data
    leads: paginatedLeads,
    meta,

    // Loading states
    isLoading: false, // TODO: Replace with actual loading state from API
    isDeleting,
    error: null, // TODO: Replace with actual error from API

    // Filters
    search,
    category,
    source,
    assignedTo,

    // Handlers
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleCategoryFilter,
    handleSourceFilter,
    handleAssignedToFilter,
    handleDelete,
    handleRefresh,
    handleReset,
  };
};
