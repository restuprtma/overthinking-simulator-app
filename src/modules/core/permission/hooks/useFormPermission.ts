import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
  usePostPermissions,
  usePutPermissions,
} from '@/app/api/core/permission/usePermissionApi';
import { useSnackbar } from '@venturo/react-ui';
import type {
  CreatePermissionData,
  UpdatePermissionData,
  Permission,
} from '@/app/api/core/permission/type';
import type { ApiError } from '@/shared/types/api/type';

/**
 * Form data interface for permission creation/update
 */
interface PermissionFormData {
  module_id: string;
  resource: string;
  action: string;
  description?: string;
}

/**
 * Hook options interface
 */
interface UseFormPermissionOptions {
  mode: 'create' | 'edit';
  permissionId?: string;
  permission?: Permission; // Permission data from parent
  defaultModuleId?: string; // Default module ID for create mode
  defaultResource?: string; // Default resource value (from module code)
  onSuccess?: () => void;
}

/**
 * Custom hook for managing permission form operations
 * Handles form validation, submission for permission CRUD
 */
export const useFormPermission = ({
  mode,
  permissionId,
  permission: passedPermission,
  defaultModuleId,
  defaultResource,
  onSuccess,
}: UseFormPermissionOptions) => {
  const { success, error } = useSnackbar();

  // Use passed permission data directly
  const permission = passedPermission;

  // Form setup with React Hook Form
  const form = useForm<PermissionFormData>({
    defaultValues: {
      module_id: '',
      resource: '',
      action: '',
      description: '',
    },
  });

  // Create mutation
  const createMutation = usePostPermissions();

  // Update mutation
  const updateMutation = usePutPermissions();

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && permission) {
      form.reset({
        module_id: permission.module_id,
        resource: permission.resource,
        action: permission.action,
        description: permission.description || '',
      });
    } else if (mode === 'create') {
      form.reset({
        module_id: defaultModuleId || '',
        resource: defaultResource || '',
        action: '',
        description: '',
      });
    }
  }, [permission, mode, defaultModuleId, defaultResource, form]);

  // Form submission handler
  const onSubmit = useCallback(
    async (data: PermissionFormData) => {
      try {
        if (mode === 'create') {
          const createData: CreatePermissionData = {
            module_id: data.module_id,
            resource: data.resource,
            action: data.action,
            description: data.description || undefined,
          };
          await createMutation.mutateAsync(createData);
          form.reset();
          success('Permission created successfully!');
          onSuccess?.();
        } else if (mode === 'edit' && permissionId) {
          const updateData: UpdatePermissionData = {
            module_id: data.module_id || undefined,
            resource: data.resource || undefined,
            action: data.action || undefined,
            description: data.description || undefined,
          };
          await updateMutation.mutateAsync({
            id: permissionId,
            data: updateData,
          });
          success('Permission updated successfully!');
          onSuccess?.();
        }
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError?.response?.data?.message || apiError?.message || 'An error occurred';
        error(errorMessage);
      }
    },
    [
      mode,
      permissionId,
      createMutation,
      updateMutation,
      onSuccess,
      success,
      error,
      form,
    ]
  );

  return {
    // Form instance for Form component
    form,
    onSubmit,

    // Loading states
    isSubmitting:
      form.formState.isSubmitting ||
      createMutation.isPending ||
      updateMutation.isPending,

    // Error states
    submitError: createMutation.error || updateMutation.error,
  };
};
