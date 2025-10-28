import React from 'react';
import { VenturoTable, Chip, Typography } from '@venturo/react-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@venturo/react-ui';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { PermissionTemplate } from '@/app/api/core/permission-template/type';
import { APP_CONFIG } from '@/app/constants/app';

interface PermissionTemplateTableProps {
  permissionTemplates: PermissionTemplate[];
  isLoading: boolean;
  isDeleting: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  onEdit: (template: PermissionTemplate) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const PermissionTemplateTable: React.FC<PermissionTemplateTableProps> = ({
  permissionTemplates,
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
  const columns: VenturoTableColumn<PermissionTemplate>[] = [
    {
      id: 'name',
      header: 'Template Name',
      render: (template) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Typography variant="body2" fontWeight={500}>
              {template.name}
            </Typography>
          </div>
          {template.description && (
            <Typography variant="caption" color="textSecondary">
              {template.description}
            </Typography>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      render: (template) => (
        <div className="flex flex-wrap gap-1">
          {template.actions && template.actions.length > 0 ? (
            template.actions.map((action, index) => (
              <Chip
                key={`${action}-${index}`}
                label={action.replace('_', ' ')}
                color="primary"
                size="small"
                variant="outlined"
                sx={{ textTransform: 'capitalize' }}
              />
            ))
          ) : (
            <Typography variant="caption" color="textSecondary">
              No actions
            </Typography>
          )}
        </div>
      ),
    },
    {
      id: 'created_by',
      header: 'Created By',
      render: (template) => (
        <div>
          <Typography variant="body2">{template.created_by ?? ''}</Typography>
          <Typography variant="body2" color="textSecondary" fontSize={10} paddingTop={0.25}>
            {' '}
            {new Date(template.created_at).toLocaleString(
              APP_CONFIG.DEFAULT_LOCALE,
              APP_CONFIG.LOCALE_DATE_OPTIONS,
            )}
          </Typography>
        </div>
      ),
    },
    {
      id: 'updated_at',
      header: 'Updated At',
      render: (template) => (
        <Typography variant="body2" color="textSecondary">
          {new Date(template.updated_at).toLocaleString(
            APP_CONFIG.DEFAULT_LOCALE,
            APP_CONFIG.LOCALE_DATE_OPTIONS,
          )}
        </Typography>
      ),
    },
  ];

  // Action buttons configuration
  const getActions = (template: PermissionTemplate): VenturoTableAction<PermissionTemplate>[] => {
    const actions: VenturoTableAction<PermissionTemplate>[] = [];

    if (canEdit) {
      actions.push({
        icon: <IconEdit size={18} />,
        onClick: () => onEdit(template),
        color: 'inherit',
        disabled: isDeleting || template.is_system,
        tooltip: template.is_system ? 'System template cannot be edited' : 'Edit template',
      });
    }

    if (canDelete) {
      actions.push({
        icon: <IconTrash size={18} />,
        onClick: () => onDelete(template.id),
        color: 'inherit',
        disabled: isDeleting || template.is_system,
        tooltip: template.is_system ? 'System template cannot be deleted' : 'Delete template',
      });
    }

    return actions;
  };

  return (
    <VenturoTable
      columns={columns}
      data={permissionTemplates}
      loading={isLoading}
      pagination={meta}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      actions={getActions}
      emptyState={{
        title: 'No permission templates found',
        description: 'Try adjusting your search or filter to find what you are looking for.',
      }}
      getRowKey={(template) => template.id}
    />
  );
};
