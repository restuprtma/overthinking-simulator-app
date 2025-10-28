import { useState } from 'react';
import type {
  DashboardStats,
  LeadDistributionItem,
  LeadSourceItem,
  SalesPerformance,
  DateFilterOption,
  SalesFilterOption,
} from '../types';

/**
 * Custom hook for dashboard data management
 * Currently uses mock data, will be replaced with API calls later
 */
export const useDashboardData = () => {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('today');
  const [salesFilter, setSalesFilter] = useState<SalesFilterOption>('all');

  // Mock Stats Data
  const statsData: DashboardStats = {
    totalLeads: 156,
    followUps: 12,
    dealsClosedToday: 3,
    conversionRate: 18.5,
    revenue: 425000000,
  };

  // Mock Lead Distribution Data
  const leadDistribution: LeadDistributionItem[] = [
    { name: 'Hot', value: 45, color: '#E34234' },
    { name: 'Warm', value: 67, color: '#f59e0b' },
    { name: 'Cold', value: 44, color: '#3b82f6' },
  ];

  // Mock Lead Source Data
  const leadSourceData: LeadSourceItem[] = [
    { source: 'WhatsApp', leads: 89, color: '#25D366' },
    { source: 'Website', leads: 34, color: '#3b82f6' },
    { source: 'Referral', leads: 23, color: '#f59e0b' },
    { source: 'Social Media', leads: 18, color: '#E34234' },
    { source: 'Direct Contact', leads: 12, color: '#8b5cf6' },
  ];

  // Mock Sales Performance Data
  const salesPerformanceData: SalesPerformance[] = [
    {
      name: 'Ahmad',
      followUps: 28,
      deals: 12,
      score: 92,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Sari',
      followUps: 25,
      deals: 10,
      score: 87,
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Budi',
      followUps: 22,
      deals: 8,
      score: 75,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Linda',
      followUps: 27,
      deals: 11,
      score: 89,
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Eko',
      followUps: 18,
      deals: 6,
      score: 68,
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
  ];

  return {
    // Filters
    dateFilter,
    salesFilter,
    setDateFilter,
    setSalesFilter,

    // Data
    statsData,
    leadDistribution,
    leadSourceData,
    salesPerformanceData,
  };
};
