import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Form,
  FormTextField,
  CircularProgress,
} from '@venturo/react-ui';
import { useFormRole } from '../hooks/useFormRole';
import { ModuleTemplateSelector } from './ModuleTemplateSelector';
import type { Role } from '@/app/api/core/role/type';

interface RoleFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  role?: Role | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({ open, mode, role, onClose, onSuccess }) => {
  const {
    form,
    onSubmit,
    isLoadingRole,
    isSubmitting,
    moduleGroups,
    templates,
    isLoadingModules,
    isLoadingTemplates,
  } = useFormRole({
    mode,
    roleId: role?.id,
    role: role,
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Check if editing a system role
  const isSystemRole = mode === 'edit' && role?.is_system;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>
        {mode === 'create' ? 'Create New Role' : 'Edit Role'}
      </DialogTitle>

      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          {isLoadingRole && mode === 'edit' ? (
            <div className="flex justify-center py-4 px-3">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-4">
              {isSystemRole && (
                <div className="bg-warning-50 border border-warning-200 rounded-md p-3 mb-2">
                  <p className="text-warning-800 text-sm font-medium">
                    This is a system role and cannot be modified.
                  </p>
                </div>
              )}

              <FormTextField
                name="name"
                label="Role Name"
                placeholder="Enter role name (e.g., manager, supervisor)"
                fullWidth
                required
                disabled={isSubmitting || isSystemRole}
                rules={{
                  required: 'Role name is required',
                  minLength: {
                    value: 3,
                    message: 'Role name must be at least 3 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Role name must not exceed 100 characters',
                  },
                }}
              />

              {/* <FormTextField
                name="description"
                label="Description"
                placeholder="Enter role description"
                fullWidth
                multiline
                rows={3}
                disabled={isSubmitting || isSystemRole}
                rules={{
                  maxLength: {
                    value: 1000,
                    message: 'Description must not exceed 1000 characters',
                  },
                }}
              /> */}

              <ModuleTemplateSelector
                moduleGroups={moduleGroups}
                templates={templates}
                disabled={isSubmitting || isSystemRole}
                isLoadingModules={isLoadingModules}
                isLoadingTemplates={isLoadingTemplates}
              />
            </div>
          )}
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="grey" disabled={isSubmitting}>
          Cancel
        </Button>
        {!isSystemRole && (
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
              ? 'Create Role'
              : 'Update Role'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
