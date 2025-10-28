import React from 'react';
import { VenturoTable, Typography } from '@venturo/react-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@venturo/react-ui';
import { IconEdit, IconTrash, IconRestore } from '@tabler/icons-react';
import type { Role } from '@/app/api/core/role/type';
import moment from 'moment';

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  isDeleting: boolean;
  isRestoring?: boolean;
  showDeleted?: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canRestore?: boolean;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  isLoading,
  isDeleting,
  isRestoring = false,
  showDeleted = false,
  meta,
  onEdit,
  onDelete,
  onRestore,
  onPageChange,
  onLimitChange,
  canEdit = true,
  canDelete = true,
  canRestore = true,
}) => {
  // Column definitions
  const columns: VenturoTableColumn<Role>[] = [
    {
      id: 'name',
      header: 'Role Name',
      render: (role) => (
        <div className="flex flex-col">
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {role.name}
          </Typography>
        </div>
      ),
    },
    // {
    //   id: 'description',
    //   header: 'Description',
    //   render: (role) => (
    //     <Typography variant="body2" sx={{ color: 'text.secondary' }}>
    //       {role.description || '-'}
    //     </Typography>
    //   ),
    // },
    {
      id: 'created_by',
      header: 'Created By',
      render: (role) => (
        <div>
          <Typography variant="body2">{role.created_by ?? ''}</Typography>
          <Typography variant="body2" color="textSecondary" fontSize={10} paddingTop={0.25}>
            {' '}
            {moment(role.created_at).format('DD MMM YYYY, HH:mm')}
          </Typography>
        </div>
      ),
    },
  ];

  // Action buttons configuration
  const getActions = (role: Role): VenturoTableAction<Role>[] => {
    const actions: VenturoTableAction<Role>[] = [];

    // Show restore button for deleted roles
    if (showDeleted && canRestore && onRestore) {
      actions.push({
        icon: <IconRestore size={18} />,
        onClick: () => onRestore(role.id),
        color: 'inherit',
        disabled: isRestoring,
      });
    }

    // Show edit and delete for active roles
    if (!showDeleted) {
      if (canEdit) {
        actions.push({
          icon: <IconEdit size={18} />,
          onClick: () => onEdit(role),
          color: 'inherit',
          disabled: isDeleting || role.is_system,
          tooltip: role.is_system ? 'System role cannot be edited' : 'Edit role',
        });
      }

      if (canDelete) {
        actions.push({
          icon: <IconTrash size={18} />,
          onClick: () => onDelete(role.id),
          color: 'inherit',
          disabled: isDeleting || role.is_system,
          tooltip: role.is_system ? 'System role cannot be deleted' : 'Delete role',
        });
      }
    }

    return actions;
  };

  return (
    <VenturoTable
      columns={columns}
      data={roles}
      loading={isLoading}
      pagination={meta}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      actions={getActions}
      emptyState={{
        title: showDeleted ? 'No deleted roles found' : 'No roles found',
        description: showDeleted
          ? 'There are no deleted roles to restore.'
          : 'Try adjusting your search or filter to find what you are looking for.',
      }}
      getRowKey={(role) => role.id}
    />
  );
};
