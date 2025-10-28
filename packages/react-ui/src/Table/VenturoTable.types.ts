import { ReactNode } from 'react';

/**
 * Column configuration for VenturoTable
 */
export interface VenturoTableColumn<TData = any> {
  /** Unique column identifier */
  id: string;
  /** Column header text */
  header: string;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Custom render function for cell content */
  render: (row: TData, index: number) => ReactNode;
}

/**
 * Action button configuration
 */
export interface VenturoTableAction<TData = any> {
  /** Icon to display in button */
  icon: ReactNode;
  /** Click handler */
  onClick: (row: TData) => void;
  /** Button color */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'inherit';
  /** Disabled state (static or dynamic) */
  disabled?: boolean | ((row: TData) => boolean);
  /** Tooltip text (static or dynamic based on row data) */
  tooltip?: string | ((row: TData) => string);
  /** Show confirmation dialog before executing */
  needsConfirmation?: boolean;
  /** Confirmation dialog title */
  confirmationTitle?: string;
  /** Confirmation message (can use row data) */
  confirmationMessage?: (row: TData) => string;
}

/**
 * Pagination metadata
 */
export interface VenturoTablePagination {
  /** Total number of items */
  total: number;
  /** Current page (1-based) */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of pages */
  total_pages: number;
}

/**
 * Empty state configuration
 */
export interface VenturoTableEmptyState {
  /** Icon to display */
  icon?: ReactNode;
  /** Main title */
  title: string;
  /** Optional description */
  description?: string;
}

/**
 * Main VenturoTable props
 */
export interface VenturoTableProps<TData = any> {
  /** Column definitions */
  columns: VenturoTableColumn<TData>[];
  /** Table data */
  data: TData[];
  /** Loading state */
  loading?: boolean;
  /** Pagination metadata */
  pagination?: VenturoTablePagination;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Rows per page change handler */
  onLimitChange?: (limit: number) => void;
  /** Action buttons per row */
  actions?: (row: TData) => VenturoTableAction<TData>[];
  /** Empty state configuration */
  emptyState?: VenturoTableEmptyState;
  /** Loading text */
  loadingText?: string;
  /** Rows per page options */
  rowsPerPageOptions?: number[];
  /** Row key extractor */
  getRowKey?: (row: TData, index: number) => string;
}
