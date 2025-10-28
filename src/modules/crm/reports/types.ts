export interface MonthlyRevenue {
  month: string;
  revenue: number;
  target: number;
  difference: number;
  percentage: number;
  previousYear: number;
  [key: string]: string | number; // For recharts compatibility
}

export interface SalesPerson {
  name: string;
  revenue: number;
  target: number;
  percentage: number;
  deals: number;
  avgDeal: number;
}

export interface SummaryStats {
  totalRevenue: number;
  totalTarget: number;
  avgMonthlyRevenue: number;
  bestMonth: MonthlyRevenue;
  worstMonth: MonthlyRevenue;
  monthsAboveTarget: number;
  yearOverYearGrowth: number;
}

export type TimeFilterOption = 'last3Months' | 'last6Months' | 'last12Months' | 'thisYear';
export type SalesFilterOption = 'all' | string;
export type ComparisonFilterOption = 'monthOverMonth' | 'yearOverYear' | 'cumulative';
