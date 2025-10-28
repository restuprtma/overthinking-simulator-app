import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Form,
  FormTextField,
  FormAutocomplete,
} from '@venturo/react-ui';
import { useFormPermission } from '../hooks/useFormPermission';
import { useGetListModules } from '@/app/api/core/module/useModuleApi';
import type { Permission } from '@/app/api/core/permission/type';

interface PermissionFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  permission?: Permission | null;
  defaultModuleId?: string;
  defaultResource?: string;
  lockModule?: boolean; // If true, module_id and resource fields are disabled
  onClose: () => void;
  onSuccess: () => void;
}

export const PermissionForm: React.FC<PermissionFormProps> = ({
  open,
  mode,
  permission,
  defaultModuleId,
  defaultResource,
  lockModule = false,
  onClose,
  onSuccess,
}) => {
  const { form, onSubmit, isSubmitting } = useFormPermission({
    mode,
    permissionId: permission?.id,
    permission: permission || undefined,
    defaultModuleId,
    defaultResource,
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  // Fetch active modules for dropdown
  const { data: modulesData, isLoading: isLoadingModules } = useGetListModules({
    is_active: true,
  });

  const modules = modulesData?.data?.data || [];

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle onClose={handleClose}>
        {mode === 'create' ? 'Create New Permission' : 'Edit Permission'}
      </DialogTitle>

      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          <div className="flex flex-col gap-4 pt-4">
            <FormAutocomplete
              name="module_id"
              label="Module"
              placeholder="Select module"
              fullWidth
              required
              disabled={isSubmitting || isLoadingModules || lockModule}
              options={modules.map((module) => ({
                value: module.id,
                label: `${module.name} (${module.code})`,
              }))}
              rules={{
                required: 'Module is required',
              }}
              helperText={lockModule ? 'Module is locked for this permission' : undefined}
            />

            <FormTextField
              name="resource"
              label="Resource"
              placeholder="e.g., users, roles, companies"
              fullWidth
              required
              disabled={isSubmitting || lockModule}
              rules={{
                required: 'Resource is required',
                minLength: {
                  value: 2,
                  message: 'Resource must be at least 2 characters',
                },
                maxLength: {
                  value: 100,
                  message: 'Resource must not exceed 100 characters',
                },
              }}
              helperText={
                lockModule
                  ? 'Resource is auto-filled from module code'
                  : 'The resource/entity this permission controls (e.g., users, roles, companies)'
              }
            />

            <FormTextField
              name="action"
              label="Action"
              placeholder="e.g., create, read, update, delete"
              fullWidth
              required
              disabled={isSubmitting}
              rules={{
                required: 'Action is required',
                minLength: {
                  value: 2,
                  message: 'Action must be at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Action must not exceed 50 characters',
                },
              }}
              helperText="The action that can be performed (e.g., create, read, update, delete)"
            />

            <FormTextField
              name="description"
              label="Description"
              placeholder="Enter permission description"
              fullWidth
              multiline
              rows={3}
              disabled={isSubmitting}
              rules={{
                maxLength: {
                  value: 500,
                  message: 'Description must not exceed 500 characters',
                },
              }}
              helperText="Optional: Describe what this permission allows users to do"
            />
          </div>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="grey" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
            ? 'Create Permission'
            : 'Update Permission'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
