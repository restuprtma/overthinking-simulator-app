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
  CircularProgress,
  Alert,
} from '@venturo/react-ui';
import { useFormPermissionTemplate } from '../hooks/useFormPermissionTemplate';
import type { PermissionTemplate } from '@/app/api/core/permission-template/type';

interface PermissionTemplateFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  template?: PermissionTemplate | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PermissionTemplateForm: React.FC<PermissionTemplateFormProps> = ({
  open,
  mode,
  template,
  onClose,
  onSuccess,
}) => {
  const {
    form,
    onSubmit,
    isLoadingTemplate,
    isSubmitting,
    availableActions,
    isLoadingActions,
  } = useFormPermissionTemplate({
    mode,
    templateId: template?.id,
    template: template, // Pass template data directly
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Check if editing system template
  const isSystemTemplate = mode === 'edit' && template?.is_system;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>
        {mode === 'create' ? 'Create New Permission Template' : 'Edit Permission Template'}
      </DialogTitle>

      <DialogContent>
        {isSystemTemplate && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            System templates cannot be modified. This form is read-only.
          </Alert>
        )}

        <Form form={form} onSubmit={onSubmit}>
          {isLoadingTemplate && mode === 'edit' ? (
            <div className="flex justify-center py-4 px-3">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-4">
              <FormTextField
                name="name"
                label="Template Name"
                placeholder="Enter template name (e.g., Viewer, Editor, Admin)"
                fullWidth
                required
                disabled={isSubmitting || isSystemTemplate}
                rules={{
                  required: 'Template name is required',
                  minLength: {
                    value: 3,
                    message: 'Template name must be at least 3 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Template name must not exceed 100 characters',
                  },
                }}
              />

              <FormTextField
                name="description"
                label="Description"
                placeholder="Enter template description"
                fullWidth
                multiline
                rows={3}
                disabled={isSubmitting || isSystemTemplate}
                rules={{
                  maxLength: {
                    value: 1000,
                    message: 'Description must not exceed 1000 characters',
                  },
                }}
              />

              <FormAutocomplete
                name="actions"
                label="Actions"
                placeholder="Select actions"
                multiple
                fullWidth
                required
                disabled={isSubmitting || isLoadingActions || isSystemTemplate}
                showCheckboxes
                options={
                  availableActions?.map((action) => ({
                    value: action,
                    label: action.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                  })) || []
                }
                rules={{
                  required: 'At least one action is required',
                  validate: (value: unknown) =>
                    (Array.isArray(value) && value.length > 0) || 'At least one action is required',
                }}
              />

              {mode === 'edit' && template?.is_system && (
                <Alert severity="info">
                  <strong>Common Actions:</strong>
                  <ul className="mt-2 ml-4 text-sm">
                    <li><strong>create</strong> - Create new resources</li>
                    <li><strong>read</strong> - View/read resources</li>
                    <li><strong>update</strong> - Update existing resources</li>
                    <li><strong>delete</strong> - Soft delete resources</li>
                    <li><strong>restore</strong> - Restore soft-deleted resources</li>
                    <li><strong>export</strong> - Export data/reports</li>
                    <li><strong>manage_users</strong> - Manage users within resources</li>
                    <li><strong>assign</strong> - Assign resources to users</li>
                    <li><strong>convert</strong> - Convert resources (e.g., leads to deals)</li>
                    <li><strong>close</strong> - Close deals or resources</li>
                  </ul>
                </Alert>
              )}
            </div>
          )}
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="grey" disabled={isSubmitting}>
          Cancel
        </Button>
        {!isSystemTemplate && (
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
              ? 'Create Template'
              : 'Update Template'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
