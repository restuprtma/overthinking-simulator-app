import React from 'react';
import { VenturoTable, Chip, Typography } from '@venturo/react-ui';
import type {
  VenturoTableColumn,
  VenturoTableAction,
} from '@venturo/react-ui';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { Permission } from '@/app/api/core/permission/type';
import { APP_CONFIG } from '@/app/constants/app';

interface PermissionTableProps {
  permissions: Permission[];
  isLoading: boolean;
  isDeleting: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  onEdit: (permission: Permission) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const PermissionTable: React.FC<PermissionTableProps> = ({
  permissions,
  isLoading,
  isDeleting,
  meta,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
  canEdit = true,
  canDelete = true,
}) => {
  // Column definitions
  const columns: VenturoTableColumn<Permission>[] = [
    {
      id: 'module',
      header: 'Module',
      render: (permission) => (
        <Chip
          label={permission.module?.name || permission.module?.code || '-'}
          size="small"
          sx={{
            bgcolor: permission.module?.color || '#3B82F6',
            color: 'white',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: 'resource',
      header: 'Resource',
      render: (permission) => (
        <Typography variant="body2" fontWeight={500}>
          {permission.resource}
        </Typography>
      ),
    },
    {
      id: 'action',
      header: 'Action',
      render: (permission) => (
        <Chip
          label={permission.action}
          color="primary"
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      id: 'description',
      header: 'Description',
      render: (permission) => (
        <Typography variant="body2" color="textSecondary">
          {permission.description || '-'}
        </Typography>
      ),
    },
    {
      id: 'created_by',
      header: 'Created By',
      render: (permission) => (
        <div>
          <Typography variant="body2">{permission.created_by ?? ''}</Typography>
          <Typography variant="body2" color="textSecondary" fontSize={10} paddingTop={0.25}>
            {' '}
            {new Date(permission.created_at).toLocaleString(
              APP_CONFIG.DEFAULT_LOCALE,
              APP_CONFIG.LOCALE_DATE_OPTIONS,
            )}
          </Typography>
        </div>
      ),
    },
  ];

  // Action buttons configuration
  const getActions = (permission: Permission): VenturoTableAction<Permission>[] => {
    const actions: VenturoTableAction<Permission>[] = [];

    if (canEdit) {
      actions.push({
        icon: <IconEdit size={18} />,
        onClick: () => onEdit(permission),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    if (canDelete) {
      actions.push({
        icon: <IconTrash size={18} />,
        onClick: () => onDelete(permission.id),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    return actions;
  };

  return (
    <VenturoTable
      columns={columns}
      data={permissions}
      loading={isLoading}
      pagination={meta}
      onPageChange={onPageChange}
      onLimitChange={onPageSizeChange}
      actions={getActions}
      emptyState={{
        title: 'No permissions found',
        description:
          'Try adjusting your search or filter to find what you are looking for.',
      }}
      getRowKey={(permission) => permission.id}
    />
  );
};
