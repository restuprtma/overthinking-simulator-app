import React from 'react';
import { VenturoTable, Chip, Typography } from '@venturo/react-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@venturo/react-ui';
import { IconEdit, IconTrash, IconUsers } from '@tabler/icons-react';
import type { Company } from '@/app/api/core/company/type';
import { APP_CONFIG } from '@/app/constants/app';

interface CompanyTableProps {
  companies: Company[];
  isLoading: boolean;
  isDeleting: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onManageUsers: (company: Company) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canManageUsers?: boolean;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  isLoading,
  isDeleting,
  meta,
  onEdit,
  onDelete,
  onManageUsers,
  onPageChange,
  onLimitChange,
  canEdit = true,
  canDelete = true,
  canManageUsers = true,
}) => {
  // Column definitions
  const columns: VenturoTableColumn<Company>[] = [
    {
      id: 'name',
      header: 'Company',
      render: (company) => (
        <div className="flex flex-col">
          <Typography variant="body2" fontWeight={500}>
            {company.name}
          </Typography>
        </div>
      ),
    },
    {
      id: 'code',
      header: 'Company Code',
      render: (company) => (
        <div className="flex flex-col">
          <Typography variant="caption" color="textSecondary">
            {company.code}
          </Typography>
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      render: (company) => (
        <div className="flex flex-col">
          {company.email && (
            <Typography variant="body2" color="textSecondary">
              {company.email}
            </Typography>
          )}
          {company.phone && (
            <Typography variant="caption" color="textSecondary">
              {company.phone}
            </Typography>
          )}
          {!company.email && !company.phone && (
            <Typography variant="caption" color="textSecondary">
              -
            </Typography>
          )}
        </div>
      ),
    },
    {
      id: 'tax_id',
      header: 'Tax ID',
      render: (company) => (
        <Typography variant="body2" color="textSecondary">
          {company.tax_id || '-'}
        </Typography>
      ),
    },
    {
      id: 'limits',
      header: 'Limits',
      render: (company) => (
        <div className="flex flex-row gap-1">
          <Chip label={`${company.max_users} Users`} size="small" />
          <Chip label={`${company.max_branches} Branches`} size="small" />
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (company) => (
        <Chip
          label={company.is_active ? 'Active' : 'Inactive'}
          color={company.is_active ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      id: 'created_by',
      header: 'Created By',
      render: (company) => (
        <div>
          <Typography variant="body2">{company.created_by ?? ''}</Typography>
          <Typography variant="body2" color="textSecondary" fontSize={10} paddingTop={0.25}>
            {' '}
            {new Date(company.created_at).toLocaleString(
              APP_CONFIG.DEFAULT_LOCALE,
              APP_CONFIG.LOCALE_DATE_OPTIONS,
            )}
          </Typography>
        </div>
      ),
    },
  ];

  // Action buttons configuration
  const getActions = (company: Company): VenturoTableAction<Company>[] => {
    const actions: VenturoTableAction<Company>[] = [];

    if (canManageUsers) {
      actions.push({
        icon: <IconUsers size={18} />,
        onClick: () => onManageUsers(company),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    if (canEdit) {
      actions.push({
        icon: <IconEdit size={18} />,
        onClick: () => onEdit(company),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    if (canDelete) {
      actions.push({
        icon: <IconTrash size={18} />,
        onClick: () => onDelete(company.id),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    return actions;
  };

  return (
    <VenturoTable
      columns={columns}
      data={companies}
      loading={isLoading}
      pagination={meta}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      actions={getActions}
      emptyState={{
        title: 'No companies found',
        description: 'Try adjusting your search or filter to find what you are looking for.',
      }}
      getRowKey={(company) => company.id}
    />
  );
};
