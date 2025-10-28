import React from 'react';
import { VenturoTable, Chip, Typography, Avatar, Box } from '@venturo/react-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@venturo/react-ui';
import { IconEdit, IconTrash, IconPhone, IconMessage } from '@tabler/icons-react';
import type { Lead } from '../types';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  isDeleting: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  onEdit: (lead: Lead) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const getCategoryColor = (category: string): 'error' | 'warning' | 'info' => {
  switch (category) {
    case 'hot':
      return 'error';
    case 'warm':
      return 'warning';
    case 'cold':
      return 'info';
    default:
      return 'info';
  }
};

const formatLastContactTime = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const timeStr = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (diffInDays === 0) {
    return `Today, ${timeStr}`;
  } else if (diffInDays === 1) {
    return `Yesterday, ${timeStr}`;
  } else {
    const dateStr = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return `${dateStr}, ${timeStr}`;
  }
};

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  isLoading,
  isDeleting,
  meta,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
  canEdit = true,
  canDelete = true,
}) => {
  // Column definitions
  const columns: VenturoTableColumn<Lead>[] = [
    {
      id: 'contact',
      header: 'Contact',
      render: (lead) => (
        <div className="flex flex-col">
          <Typography variant="body2" fontWeight={600}>
            {lead.contact}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {lead.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <IconPhone size={12} />
            <Typography variant="caption" color="textSecondary">
              {lead.phone}
            </Typography>
          </Box>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      render: (lead) => (
        <div className="flex flex-col gap-1">
          <Chip
            label={lead.category.toUpperCase()}
            color={getCategoryColor(lead.category)}
            size="small"
          />
          <Typography variant="caption" color="textSecondary">
            {lead.responseTime}
          </Typography>
        </div>
      ),
    },
    {
      id: 'assignedTo',
      header: 'Sales',
      render: (lead) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src={lead.assignedToAvatar} sx={{ width: 24, height: 24 }} />
          <Typography variant="body2">{lead.assignedTo}</Typography>
        </Box>
      ),
    },
    {
      id: 'source',
      header: 'Source',
      render: (lead) => <Chip label={lead.source} size="small" variant="outlined" />,
    },
    {
      id: 'lastContact',
      header: 'Last Contact',
      render: (lead) => (
        <div className="flex flex-col">
          <Typography variant="body2">{formatLastContactTime(lead.lastContact)}</Typography>
          <Typography variant="caption" color="textSecondary">
            Next: {lead.nextFollowUp}
          </Typography>
        </div>
      ),
    },
    {
      id: 'aiHighlights',
      header: 'AI Highlights',
      render: (lead) => (
        <div className="flex flex-wrap gap-1">
          {lead.aiHighlights.slice(0, 2).map((highlight, index) => (
            <Chip key={index} label={highlight} size="small" variant="outlined" />
          ))}
          {lead.aiHighlights.length > 2 && (
            <Chip label={`+${lead.aiHighlights.length - 2}`} size="small" variant="outlined" />
          )}
        </div>
      ),
    },
    {
      id: 'deal_value',
      header: 'Deal Value',
      render: (lead) => (
        <Typography variant="body2" fontWeight={500}>
          {lead.deal_value}
        </Typography>
      ),
    },
  ];

  // Action buttons configuration
  const getActions = (lead: Lead): VenturoTableAction<Lead>[] => {
    const actions: VenturoTableAction<Lead>[] = [];

    // Message action
    actions.push({
      icon: <IconMessage size={18} />,
      onClick: () => {
        // Handle message action
        console.log('Message lead:', lead.id);
      },
      color: 'inherit',
      disabled: isDeleting,
    });

    if (canEdit) {
      actions.push({
        icon: <IconEdit size={18} />,
        onClick: () => onEdit(lead),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    if (canDelete) {
      actions.push({
        icon: <IconTrash size={18} />,
        onClick: () => onDelete(lead.id),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    return actions;
  };

  return (
    <VenturoTable
      columns={columns}
      data={leads}
      loading={isLoading}
      pagination={meta}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      actions={getActions}
      emptyState={{
        title: 'No leads found',
        description: 'Try adjusting your search or filter to find what you are looking for.',
      }}
      getRowKey={(lead) => lead.id.toString()}
    />
  );
};
