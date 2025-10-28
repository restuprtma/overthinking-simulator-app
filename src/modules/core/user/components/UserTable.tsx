import React from 'react';
import { VenturoTable, Chip, Typography } from '@venturo/react-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@venturo/react-ui';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { User } from '@/app/api/core/user/type';
import { APP_CONFIG } from '@/app/constants/app';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  isDeleting: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
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
  const columns: VenturoTableColumn<User>[] = [
    {
      id: 'full_name',
      header: 'Full Name',
      render: (user) => (
        <div className="flex flex-col">
          <Typography variant="body2" fontWeight={500}>
            {user.full_name}
          </Typography>
        </div>
      ),
    },
    {
      id: 'username',
      header: 'Username',
      render: (user) => (
        <div className="flex flex-col">
          <Typography variant="caption" color="textSecondary">
            @{user.username}
          </Typography>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      render: (user) => (
        <div className="flex flex-col">
          <Typography variant="body2" color="textSecondary">
            {user.email}
          </Typography>
          {user.phone && (
            <Typography variant="caption" color="textSecondary">
              {user.phone}
            </Typography>
          )}
        </div>
      ),
    },
    {
      id: 'roles',
      header: 'Roles',
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role) => (
              <Chip
                key={role.id}
                label={role.name.replace('_', ' ')}
                color="primary"
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            ))
          ) : (
            <Typography variant="caption" color="textSecondary">
              No roles
            </Typography>
          )}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          <Chip
            label={user.is_active ? 'Active' : 'Inactive'}
            color={user.is_active ? 'success' : 'error'}
            size="small"
          />
          {user.is_email_verified && (
            <Chip label="Verified" color="success" size="small" variant="outlined" />
          )}
        </div>
      ),
    },
    {
      id: 'created_by',
      header: 'Created By',
      render: (user) => (
        <div>
          <Typography variant="body2">{user.created_by || 'System'}</Typography>
          <Typography variant="body2" color="textSecondary" fontSize={10} paddingTop={0.25}>
            {' '}
            {new Date(user.created_at).toLocaleString(
              APP_CONFIG.DEFAULT_LOCALE,
              APP_CONFIG.LOCALE_DATE_OPTIONS,
            )}
          </Typography>
        </div>
      ),
    },
  ];

  // Action buttons configuration
  const getActions = (user: User): VenturoTableAction<User>[] => {
    const actions: VenturoTableAction<User>[] = [];

    if (canEdit) {
      actions.push({
        icon: <IconEdit size={18} />,
        onClick: () => onEdit(user),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    if (canDelete) {
      actions.push({
        icon: <IconTrash size={18} />,
        onClick: () => onDelete(user.id),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    return actions;
  };

  return (
    <VenturoTable
      columns={columns}
      data={users}
      loading={isLoading}
      pagination={meta}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      actions={getActions}
      emptyState={{
        title: 'No users found',
        description: 'Try adjusting your search or filter to find what you are looking for.',
      }}
      getRowKey={(user) => user.id}
    />
  );
};
