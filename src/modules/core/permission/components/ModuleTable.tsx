import React, { useMemo } from 'react';
import { VenturoTable, Chip, Typography, Box, Tooltip } from '@venturo/react-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@venturo/react-ui';
import { IconEdit, IconTrash, IconFolder, IconFile, IconListCheck } from '@tabler/icons-react';
import type { Module } from '@/app/api/core/module/type';
import { APP_CONFIG } from '@/app/constants/app';

interface ModuleTableProps {
  modules: Module[];
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (module: Module) => void;
  onDelete: (id: string, name: string) => void;
  onRestore: (id: string, name: string) => void;
  onManagePermissions?: (module: Module) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canManagePermissions?: boolean;
}

export const ModuleTable: React.FC<ModuleTableProps> = ({
  modules,
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
  onManagePermissions,
  canEdit = true,
  canDelete = true,
  canManagePermissions = false,
}) => {
  // Determine which modules have children (are parents)
  const moduleWithChildren = useMemo(() => {
    const parentIds = new Set(modules.filter((m) => m.parent_id).map((m) => m.parent_id));
    return parentIds;
  }, [modules]);

  // Column definitions
  const columns: VenturoTableColumn<Module>[] = [
    {
      id: 'name',
      header: 'Name',
      render: (module) => {
        const isParent = moduleWithChildren.has(module.id);
        const hasColor = !!module.color;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: module.depth * 2 }}>
            {/* Indentation indicator for child modules */}
            {module.depth > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mr: 0.5,
                  color: 'text.secondary',
                  fontSize: 14,
                }}
              >
                {'└─'}
              </Box>
            )}

            {/* Parent/Child icon indicator */}
            {module.depth === 0 ? (
              isParent ? (
                <IconFolder size={16} style={{ color: module.color || '#6366F1', flexShrink: 0 }} />
              ) : hasColor ? (
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: module.color,
                    flexShrink: 0,
                  }}
                />
              ) : (
                <IconFile size={16} style={{ color: '#9CA3AF', flexShrink: 0 }} />
              )
            ) : hasColor ? (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: module.color,
                  flexShrink: 0,
                }}
              />
            ) : (
              <IconFile size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
            )}

            <Typography variant="body2" fontWeight={module.depth === 0 ? 600 : 500}>
              {module.name}
            </Typography>

            {module.depth > 0 && (
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.25,
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  borderRadius: 1,
                  fontSize: 10,
                }}
              >
                L{module.depth}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      id: 'code',
      header: 'Code',
      render: (module) => <Typography variant="body2">{module.code}</Typography>,
    },
    {
      id: 'hierarchy',
      header: 'Hierarchy',
      render: (module) => {
        if (module.depth === 0) {
          return (
            <Chip label="Root" color="primary" size="small" sx={{ fontSize: 11, height: 20 }} />
          );
        }

        // const parent = modules.find((m) => m.id === module.parent_id);
        return (
          <Chip
            label={`Level ${module.depth}`}
            color="default"
            size="small"
            sx={{ fontSize: 10, height: 18, width: 'fit-content' }}
          />
        );
      },
    },
    // {
    //   id: 'description',
    //   header: 'Description',
    //   render: (module) => (
    //     <Typography variant="body2" color="textSecondary" noWrap sx={{ maxWidth: 250 }}>
    //       {module.description || '-'}
    //     </Typography>
    //   ),
    // },

    {
      id: 'permission',
      header: 'Permissions',
      align: 'center',
      render: (module) => (
        <Chip
          label={module.permissions_count}
          color="default"
          size="small"
          sx={{ fontSize: 11, height: 20 }}
        />
      ),
    },
    {
      id: 'sort_order',
      header: 'Sort',
      align: 'center',
      render: (module) => (
        <Typography variant="body2" textAlign="center">
          {module.sort_order}
        </Typography>
      ),
    },
    {
      id: 'is_active',
      header: 'Status',
      render: (module) => (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
          <Chip
            label={module.is_active ? 'Active' : 'Inactive'}
            color={module.is_active ? 'success' : 'default'}
            size="small"
            sx={{ fontSize: 11, height: 20 }}
          />
          <Chip
            label={module.is_menu_visible ? 'Visible' : 'Hidden'}
            color={module.is_menu_visible ? 'info' : 'default'}
            size="small"
            sx={{ fontSize: 10, height: 18 }}
          />
        </Box>
      ),
    },
    {
      id: 'created_by',
      header: 'Created By',
      render: (module) => (
        <div>
          <Typography variant="body2">{module.created_by ?? ''}</Typography>
          {module.created_at && (
            <Typography variant="body2" color="textSecondary" fontSize={10} paddingTop={0.25}>
              {new Date(module.created_at).toLocaleString(
                APP_CONFIG.DEFAULT_LOCALE,
                APP_CONFIG.LOCALE_DATE_OPTIONS,
              )}
            </Typography>
          )}
        </div>
      ),
    },
  ];

  // Action buttons configuration
  const getActions = (module: Module): VenturoTableAction<Module>[] => {
    const actions: VenturoTableAction<Module>[] = [];

    // Manage Permissions button (only for child modules with depth > 0)
    if (module.depth > 0 && canManagePermissions && onManagePermissions) {
      actions.push({
        icon: (
          <Tooltip title="Manage Permissions">
            <IconListCheck size={18} />
          </Tooltip>
        ),
        onClick: () => onManagePermissions(module),
        color: 'primary',
        disabled: isDeleting,
      });
    }

    if (canEdit) {
      actions.push({
        icon: <IconEdit size={18} />,
        onClick: () => onEdit(module),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    if (canDelete) {
      actions.push({
        icon: <IconTrash size={18} />,
        onClick: () => onDelete(module.id, module.name),
        color: 'inherit',
        disabled: isDeleting,
      });
    }

    return actions;
  };

  return (
    <VenturoTable
      columns={columns}
      data={modules}
      loading={isLoading}
      actions={getActions}
      emptyState={{
        title: 'No modules found',
        description: 'Try adjusting your search or filters',
      }}
      getRowKey={(module) => module.id}
    />
  );
};
