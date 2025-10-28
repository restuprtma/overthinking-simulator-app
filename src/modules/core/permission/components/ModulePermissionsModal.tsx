import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
  VenturoTable,
  useSnackbar,
  useAlertDialog,
} from '@venturo/react-ui';
import type { VenturoTableColumn, VenturoTableAction } from '@venturo/react-ui';
import { IconPlus, IconBolt, IconEdit, IconTrash } from '@tabler/icons-react';
import type { Module } from '@/app/api/core/module/type';
import type { Permission } from '@/app/api/core/permission/type';
// Note: Using Permission type from permission API as it's more complete
import { useGetModulePermissions, useApplyCRUDTemplate } from '@/app/api/core/module/useModuleApi';
import { useDeletePermissions } from '@/app/api/core/permission/usePermissionApi';
import { useBoolean, useDialogState } from '@/shared/hooks';
import { PermissionForm } from './PermissionForm';
import type { ApiError } from '@/shared/types/api/type';
import { APP_CONFIG } from '@/app/constants/app';

interface ModulePermissionsModalProps {
  open: boolean;
  module: Module | null;
  onClose: () => void;
}

export const ModulePermissionsModal: React.FC<ModulePermissionsModalProps> = ({
  open,
  module,
  onClose,
}) => {
  const { success, error: showError } = useSnackbar();
  const { showAlert } = useAlertDialog();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const permissionDialog = useBoolean();
  const { dialogState, openCreate, openEdit, reset: resetDialogState } = useDialogState<Permission>();

  // Fetch permissions for this module
  const { data: permissionsData, isLoading } = useGetModulePermissions(
    module?.id || '',
    {
      page,
      page_size: pageSize,
    },
    { enabled: !!module?.id && open },
  );

  const applyCRUDMutation = useApplyCRUDTemplate();
  const deleteMutation = useDeletePermissions();

  // Cast to permission type as the API returns compatible data
  const permissions = (permissionsData?.data.data || []) as Permission[];
  const paginationMeta = permissionsData?.data.meta?.pagination;

  // Handle CRUD Template with confirmation
  const handleApplyCRUDClick = async () => {
    if (!module) return;

    const resourceName = module.code;
    const confirmed = await showAlert({
      title: 'Apply CRUD Template',
      message: `Are you sure you want to create resource "${resourceName}" with the following actions?\n\n• create\n• read\n• update\n• delete`,
      confirmText: 'Yes, Create',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    try {
      const response = await applyCRUDMutation.mutateAsync({
        moduleId: module.id,
        data: { resource: resourceName },
      });

      const result = response.data.data;
      success(
        `CRUD template applied! Created: ${result.created.length}, Skipped: ${result.skipped.length}`,
      );
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to apply CRUD template';
      showError(errorMessage);
    }
  };

  // Table columns
  const columns: VenturoTableColumn<Permission>[] = [
    {
      id: 'resource',
      header: 'Resource',
      render: (permission) => (
        <Typography variant="body2" fontWeight={600}>
          {permission.resource}
        </Typography>
      ),
    },
    {
      id: 'action',
      header: 'Action',
      render: (permission) => (
        <Chip label={permission.action} color="primary" size="small" sx={{ fontSize: 11 }} />
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
  ];

  // Dialog handlers
  const handleAddPermissionClick = () => {
    openCreate();
    permissionDialog.setTrue();
  };

  const handleEditPermissionClick = (permission: Permission) => {
    openEdit(permission);
    permissionDialog.setTrue();
  };

  const handleDeletePermission = async (permission: Permission) => {
    const confirmed = await showAlert({
      title: 'Delete Permission',
      message: `Are you sure you want to delete permission "${permission.resource}:${permission.action}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(permission.id);
      success('Permission deleted successfully');
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to delete permission';
      showError(errorMessage);
    }
  };

  const handlePermissionDialogClose = () => {
    permissionDialog.setFalse();
    setTimeout(() => {
      resetDialogState();
    }, APP_CONFIG.DIALOG_TRANSITION_DELAY);
  };

  const handlePermissionSuccess = () => {
    // Table will auto-refresh via React Query cache invalidation
    handlePermissionDialogClose();
  };

  // Table actions
  const getActions = (permission: Permission): VenturoTableAction<Permission>[] => [
    {
      icon: <IconEdit size={18} />,
      onClick: () => handleEditPermissionClick(permission),
      color: 'inherit',
    },
    {
      icon: <IconTrash size={18} />,
      onClick: () => handleDeletePermission(permission),
      color: 'inherit',
    },
  ];

  if (!module) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle onClose={onClose}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Manage Permissions - {module.name}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* CRUD Template Section */}
          <Alert
            severity="info"
            sx={{ cursor: 'pointer', marginTop: 2 }}
            onClick={handleApplyCRUDClick}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconBolt size={18} />
              <Typography variant="body2">
                Quick Setup: Apply CRUD Template for "{module.code}" (create, read, update, delete)
              </Typography>
            </Box>
          </Alert>

          {/* Permissions Table */}
          <div className="border border-solid rounded-md mt-4">
            <VenturoTable
              columns={columns}
              data={permissions}
              loading={isLoading}
              pagination={paginationMeta}
              onPageChange={setPage}
              onLimitChange={setPageSize}
              actions={getActions}
              emptyState={{
                title: 'No permissions found',
                description: 'Try adjusting your search or add new permissions',
              }}
              getRowKey={(permission) => permission.id}
            />
          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="solid"
          color="primary"
          onClick={handleAddPermissionClick}
          className="flex items-center gap-2"
        >
          <IconPlus size={16} />
          Add Permission
        </Button>
        <Button variant="outlined" color="grey" onClick={onClose}>
          Close
        </Button>
      </DialogActions>

      {/* Permission Form Dialog (Create/Edit) */}
      <PermissionForm
        open={permissionDialog.value}
        mode={dialogState.mode}
        permission={dialogState.item}
        defaultModuleId={module?.id}
        defaultResource={module?.code}
        lockModule={true}
        onClose={handlePermissionDialogClose}
        onSuccess={handlePermissionSuccess}
      />
    </Dialog>
  );
};
