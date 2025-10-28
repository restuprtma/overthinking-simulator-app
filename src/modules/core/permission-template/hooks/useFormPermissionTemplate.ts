import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
  usePostPermissionTemplate,
  usePutPermissionTemplate,
  useGetPermissionActions,
} from '@/app/api/core/permission-template/usePermissionTemplateApi';
import { useSnackbar } from '@venturo/react-ui';
import type {
  CreatePermissionTemplateData,
  UpdatePermissionTemplateData,
} from '@/app/api/core/permission-template/type';
import type { ApiError } from '@/shared/types/api/type';

/**
 * Form data interface for permission template creation/update
 */
interface PermissionTemplateFormData {
  name: string;
  description?: string;
  actions: string[];
}

/**
 * Hook options interface
 */
interface UseFormPermissionTemplateOptions {
  mode: 'create' | 'edit';
  templateId?: string;
  template?: any; // PermissionTemplate data from parent
  onSuccess?: () => void;
}

/**
 * Custom hook for managing permission template form operations
 * Handles form validation, submission, and permission actions fetching
 */
export const useFormPermissionTemplate = ({
  mode,
  templateId,
  template: passedTemplate,
  onSuccess,
}: UseFormPermissionTemplateOptions) => {
  const { success, error } = useSnackbar();

  // Use passed template data directly
  const template = passedTemplate;
  const isLoadingTemplate = false;

  // Fetch all available permission actions
  const { data: actionsData, isLoading: isLoadingActions } = useGetPermissionActions();

  // Form setup with React Hook Form
  const form = useForm<PermissionTemplateFormData>({
    defaultValues: {
      name: '',
      description: '',
      actions: [],
    },
  });

  // Create mutation
  const createMutation = usePostPermissionTemplate();

  // Update mutation
  const updateMutation = usePutPermissionTemplate();

  // Extract data
  const availableActions = actionsData?.data?.data || [];

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && template) {
      form.reset({
        name: template.name,
        description: template.description || '',
        actions: template.actions || [],
      });
    } else if (mode === 'create') {
      form.reset({
        name: '',
        description: '',
        actions: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form.reset causes infinite loop
  }, [template, mode]);

  // Form submission handler
  const onSubmit = useCallback(
    async (data: PermissionTemplateFormData) => {
      try {
        if (mode === 'create') {
          const createData: CreatePermissionTemplateData = {
            name: data.name,
            description: data.description || undefined,
            actions: data.actions,
          };
          await createMutation.mutateAsync(createData);
          form.reset();
          success('Permission template created successfully!');
          onSuccess?.();
        } else if (mode === 'edit' && templateId) {
          // Check if trying to edit system template
          if (template?.is_system) {
            error('System templates cannot be modified');
            return;
          }

          const updateData: UpdatePermissionTemplateData = {
            name: data.name || undefined,
            description: data.description || undefined,
            actions: data.actions.length > 0 ? data.actions : undefined,
          };
          await updateMutation.mutateAsync({ id: templateId, data: updateData });
          success('Permission template updated successfully!');
          onSuccess?.();
        }
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError?.response?.data?.message || apiError?.message || 'An error occurred';
        error(errorMessage);
      }
    },
    [mode, templateId, template, createMutation, updateMutation, onSuccess, success, error, form],
  );

  return {
    // Form instance for Form component
    form,
    onSubmit,

    // Data
    availableActions,

    // Loading states
    isLoadingTemplate,
    isLoadingActions,
    isSubmitting:
      form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending,

    // Error states
    submitError: createMutation.error || updateMutation.error,
  };
};
