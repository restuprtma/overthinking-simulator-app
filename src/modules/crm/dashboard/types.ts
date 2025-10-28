/**
 * Dashboard Types
 * Type definitions for CRM Dashboard data
 */

export interface DashboardStats {
  totalLeads: number;
  followUps: number;
  dealsClosedToday: number;
  conversionRate: number;
  revenue: number;
}

export interface LeadDistributionItem {
  name: 'Hot' | 'Warm' | 'Cold';
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for recharts compatibility
}

export interface LeadSourceItem {
  source: string;
  leads: number;
  color: string;
  [key: string]: string | number; // Index signature for recharts compatibility
}

export interface SalesPerformance {
  name: string;
  followUps: number;
  deals: number;
  score: number;
  avatar: string;
}

export interface PerformanceBadgeConfig {
  label: string;
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  sx?: Record<string, unknown>;
}

export type DateFilterOption = 'today' | 'week' | 'month';
export type SalesFilterOption = 'all' | 'ahmad' | 'sari' | 'budi' | 'linda' | 'eko';
