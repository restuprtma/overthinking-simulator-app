/**
 * CRM Dashboard Module
 * Barrel export for dashboard components and pages
 */

// Pages
export { default as DashboardPage } from './pages/DashboardPage';

// Components
export { StatsCards } from './components/StatsCards';
export { LeadDistributionCard } from './components/LeadDistributionCard';
export { LeadSourceCard } from './components/LeadSourceCard';
export { SalesPerformanceCard } from './components/SalesPerformanceCard';
export { LeadInfoModal } from './components/LeadInfoModal';
export { PerformanceModal } from './components/PerformanceModal';

// Hooks
export { useDashboardData } from './hooks/useDashboardData';

// Types
export type * from './types';
