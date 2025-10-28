import { useState, useEffect } from 'react';
import type { Deal } from '../types';

const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export const useDeals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [salesFilter, setSalesFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [showDealDetail, setShowDealDetail] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const closedDeals: Deal[] = [
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

  const filteredDeals = closedDeals.filter((deal) => {
    const matchesSearch =
      deal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.salesPerson.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSales = salesFilter === 'all' || deal.salesPerson === salesFilter;
    const matchesSource = sourceFilter === 'all' || deal.source === sourceFilter;

    const matchesDateRange = (() => {
      if (!dateRange.from && !dateRange.to) return true;
      const dealDate = parseDate(deal.closeDate);
      if (dateRange.from && dateRange.to) {
        return dealDate >= dateRange.from && dealDate <= dateRange.to;
      } else if (dateRange.from) {
        return dealDate >= dateRange.from;
      } else if (dateRange.to) {
        return dealDate <= dateRange.to;
      }
      return true;
    })();

    return matchesSearch && matchesSales && matchesSource && matchesDateRange;
  });

  const wonDeals = filteredDeals.filter((deal) => deal.status === 'Won');
  const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.dealValue, 0);
  const winRate = filteredDeals.length > 0 ? ((wonDeals.length / filteredDeals.length) * 100).toFixed(1) : '0.0';
  const avgDealValue = wonDeals.length > 0 ? Math.round(totalRevenue / wonDeals.length) : 0;

  const totalItems = filteredDeals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeals = filteredDeals.slice(startIndex, endIndex);

  const currentPageTotalValue = paginatedDeals.reduce((sum, deal) => sum + deal.dealValue, 0);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, salesFilter, sourceFilter, dateRange]);

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDealDetail(true);
  };

  return {
    searchTerm,
    setSearchTerm,
    salesFilter,
    setSalesFilter,
    sourceFilter,
    setSourceFilter,
    dateRange,
    setDateRange,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    paginatedDeals,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    currentPageTotalValue,
    wonDeals,
    totalRevenue,
    winRate,
    avgDealValue,
    showDealDetail,
    setShowDealDetail,
    selectedDeal,
    handleViewDeal,
  };
};
