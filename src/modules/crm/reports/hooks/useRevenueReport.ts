import { useState, useMemo } from 'react';
import type { MonthlyRevenue, SalesPerson, SummaryStats, TimeFilterOption, SalesFilterOption, ComparisonFilterOption } from '../types';

export const useRevenueReport = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>('last12Months');
  const [salesFilter, setSalesFilter] = useState<SalesFilterOption>('all');
  const [comparisonFilter, setComparisonFilter] = useState<ComparisonFilterOption>('monthOverMonth');

  const revenueData: MonthlyRevenue[] = [
    { month: 'Jan', revenue: 450, target: 500, difference: -50, percentage: 90, previousYear: 380 },
    { month: 'Feb', revenue: 520, target: 550, difference: -30, percentage: 95, previousYear: 420 },
    { month: 'Mar', revenue: 680, target: 600, difference: 80, percentage: 113, previousYear: 510 },
    { month: 'Apr', revenue: 590, target: 650, difference: -60, percentage: 91, previousYear: 520 },
    { month: 'May', revenue: 750, target: 700, difference: 50, percentage: 107, previousYear: 580 },
    { month: 'Jun', revenue: 820, target: 750, difference: 70, percentage: 109, previousYear: 640 },
    { month: 'Jul', revenue: 890, target: 800, difference: 90, percentage: 111, previousYear: 690 },
    { month: 'Aug', revenue: 780, target: 850, difference: -70, percentage: 92, previousYear: 720 },
    { month: 'Sep', revenue: 950, target: 900, difference: 50, percentage: 106, previousYear: 780 },
    { month: 'Oct', revenue: 1100, target: 1000, difference: 100, percentage: 110, previousYear: 850 },
    { month: 'Nov', revenue: 1250, target: 1200, difference: 50, percentage: 104, previousYear: 980 },
    { month: 'Dec', revenue: 1400, target: 1300, difference: 100, percentage: 108, previousYear: 1150 },
  ];

  const salesPersonData: SalesPerson[] = [
    { name: 'Ahmad', revenue: 2800, target: 2500, percentage: 112, deals: 24, avgDeal: 116667 },
    { name: 'Sari', revenue: 2400, target: 2200, percentage: 109, deals: 20, avgDeal: 120000 },
    { name: 'Linda', revenue: 2100, target: 2000, percentage: 105, deals: 18, avgDeal: 116667 },
    { name: 'Budi', revenue: 1800, target: 2000, percentage: 90, deals: 15, avgDeal: 120000 },
    { name: 'Eko', revenue: 1500, target: 1800, percentage: 83, deals: 12, avgDeal: 125000 },
  ];

  const summaryStats: SummaryStats = useMemo(() => {
    const totalRevenue = revenueData.reduce((sum, month) => sum + month.revenue, 0) * 1000000;
    const totalTarget = revenueData.reduce((sum, month) => sum + month.target, 0) * 1000000;
    const bestMonth = revenueData.reduce((prev, current) => (current.percentage > prev.percentage ? current : prev));
    const worstMonth = revenueData.reduce((prev, current) => (current.percentage < prev.percentage ? current : prev));
    const monthsAboveTarget = revenueData.filter((month) => month.percentage >= 100).length;
    const yearOverYearGrowth =
      ((revenueData.reduce((sum, month) => sum + month.revenue, 0) -
        revenueData.reduce((sum, month) => sum + month.previousYear, 0)) /
        revenueData.reduce((sum, month) => sum + month.previousYear, 0)) *
      100;

    return {
      totalRevenue,
      totalTarget,
      avgMonthlyRevenue: totalRevenue / revenueData.length,
      bestMonth,
      worstMonth,
      monthsAboveTarget,
      yearOverYearGrowth,
    };
  }, []);

  const overallAchievement = Math.round((summaryStats.totalRevenue / summaryStats.totalTarget) * 100);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: amount >= 1000000000 ? 'compact' : 'standard',
    }).format(amount);
  };

  const formatCompact = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}M`;
    }
    return `${amount}M`;
  };

  return {
    timeFilter,
    setTimeFilter,
    salesFilter,
    setSalesFilter,
    comparisonFilter,
    setComparisonFilter,
    revenueData,
    salesPersonData,
    summaryStats,
    overallAchievement,
    formatCurrency,
    formatCompact,
  };
};
