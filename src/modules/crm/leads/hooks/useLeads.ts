import { useState, useEffect } from 'react';
import type { Lead, SalesTeamMember } from '../types';

export const useLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [salesFilter, setSalesFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const salesTeam: SalesTeamMember[] = [
    {
      id: 'ahmad',
      name: 'Ahmad',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 'sari',
      name: 'Sari',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 'budi',
      name: 'Budi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 'linda',
      name: 'Linda',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 'eko',
      name: 'Eko',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
  ];

  const leadsData: Lead[] = [
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

  const filteredLeads = leadsData.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesSales = salesFilter === 'all' || lead.assignedTo.toLowerCase() === salesFilter;
    const matchesCategory = categoryFilter === 'all' || lead.category === categoryFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;

    const matchesDateRange = (() => {
      if (!dateRange.from && !dateRange.to) return true;
      const leadContactDate = lead.lastContact;
      if (dateRange.from && dateRange.to) {
        return leadContactDate >= dateRange.from && leadContactDate <= dateRange.to;
      } else if (dateRange.from) {
        return leadContactDate >= dateRange.from;
      } else if (dateRange.to) {
        return leadContactDate <= dateRange.to;
      }
      return true;
    })();

    return matchesSearch && matchesSales && matchesCategory && matchesSource && matchesDateRange;
  });

  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, salesFilter, categoryFilter, sourceFilter, dateRange]);

  return {
    searchTerm,
    setSearchTerm,
    salesFilter,
    setSalesFilter,
    categoryFilter,
    setCategoryFilter,
    sourceFilter,
    setSourceFilter,
    dateRange,
    setDateRange,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    salesTeam,
    paginatedLeads,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
  };
};
