import React from 'react';
import { VenturoTable, Chip, Typography, Avatar, Box } from '@venturo/react-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@venturo/react-ui';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import type { Deal } from '../types';

interface DealsTableProps {
  deals: Deal[];
  isLoading: boolean;
  isDeleting: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const DealsTable: React.FC<DealsTableProps> = ({
  deals,
  isLoading,
  isDeleting,
  meta,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
  canEdit = true,
  canDelete = true,
}) => {
  // Column definitions
  const columns: VenturoTableColumn<Deal>[] = [
    {
      id: 'dealId',
      header: 'Deal ID',
      render: (deal) => (
        <Typography variant="body2" fontWeight={600}>
          {deal.id}
        </Typography>
      ),
    },
    {
      id: 'client',
      header: 'Client',
      render: (deal) => (
        <div className="flex flex-col">
          <Typography variant="body2" fontWeight={600}>
            {deal.clientName}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {deal.contactPerson}
          </Typography>
        </div>
      ),
    },
    {
      id: 'salesPerson',
      header: 'Sales Person',
      render: (deal) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src={deal.salesAvatar} sx={{ width: 32, height: 32 }} />
          <Typography variant="body2">{deal.salesPerson}</Typography>
        </Box>
      ),
    },
    {
      id: 'dealValue',
      header: 'Deal Value',
      render: (deal) => (
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(deal.dealValue)}
        </Typography>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (deal) => (
        <Chip
          label={deal.status}
          color={deal.status === 'Won' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      id: 'closeDate',
      header: 'Close Date',
      render: (deal) => (
        <div className="flex flex-col">
          <Typography variant="body2">{deal.closeDate}</Typography>
          <Typography variant="caption" color="textSecondary">
            {deal.duration}
          </Typography>
        </div>
      ),
    },
    {
      id: 'source',
      header: 'Source',
      render: (deal) => (
        <Chip label={deal.source} size="small" variant="outlined" />
      ),
    },
    {
      id: 'commission',
      header: 'Commission',
      render: (deal) => (
        <Typography variant="body2" color={deal.commission > 0 ? 'success.main' : 'textSecondary'}>
          {formatCurrency(deal.commission)}
        </Typography>
      ),
    },
  ];

  // Action buttons configuration
  const getActions = (deal: Deal): VenturoTableAction<Deal>[] => {
    const actions: VenturoTableAction<Deal>[] = [];

    // View action
    actions.push({
      icon: <IconEye size={18} />,
      onClick: () => onView(deal),
      color: 'inherit',
      disabled: isDeleting,
    });

    if (canEdit) {
      actions.push({
        icon: <IconEdit size={18} />,
        onClick: () => onEdit(deal),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    if (canDelete) {
      actions.push({
        icon: <IconTrash size={18} />,
        onClick: () => onDelete(deal.id),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    return actions;
  };

  return (
    <VenturoTable
      columns={columns}
      data={deals}
      loading={isLoading}
      pagination={meta}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      actions={getActions}
      emptyState={{
        title: 'No deals found',
        description: 'Try adjusting your search or filter to find what you are looking for.',
      }}
      getRowKey={(deal) => deal.id}
    />
  );
};
