import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePostRoles, usePutRoles, useGetRolePermissions } from '@/app/api/core/role/useRoleApi';
import { useGetModuleTree } from '@/app/api/core/module/useModuleApi';
import { useGetListPermissionTemplates } from '@/app/api/core/permission-template/usePermissionTemplateApi';
import { useSnackbar } from '@venturo/react-ui';
import type { CreateRoleData, UpdateRoleData, Role } from '@/app/api/core/role/type';
import type { ApiError } from '@/shared/types/api/type';

interface UseFormRoleOptions {
  mode: 'create' | 'edit';
  roleId?: string;
  role?: Role | null;
  onSuccess?: () => void;
}

interface RoleFormData {
  name: string;
  description?: string;
  module_templates: Record<string, string>; // { module_id: template_id }
}

export const useFormRole = ({ mode, roleId, role, onSuccess }: UseFormRoleOptions) => {
  const { success, error } = useSnackbar();

  // Initialize form
  const form = useForm<RoleFormData>({
    defaultValues: {
      name: '',
      description: '',
      module_templates: {},
    },
  });

  // Queries
  const { data: moduleTreeData, isLoading: isLoadingModules } = useGetModuleTree();
  const { data: templatesData, isLoading: isLoadingTemplates } = useGetListPermissionTemplates(
    { page_size: 100 } // Get all templates
  );
  const { data: rolePermissionsData, isLoading: isLoadingRolePermissions } = useGetRolePermissions(
    roleId || '',
    { enabled: mode === 'edit' && !!roleId }
  );

  // Mutations
  const createMutation = usePostRoles();
  const updateMutation = usePutRoles();

  // Extract data
  const moduleGroups = moduleTreeData?.data?.data || [];
  const templates = templatesData?.data?.data || [];
  const isLoadingRole = false; // Role data passed directly from parent
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const submitError = createMutation.error || updateMutation.error;

  // Auto-populate form when role data is available
  useEffect(() => {
    if (mode === 'edit' && role) {
      // Get module templates from role permissions query
      const moduleTemplates = rolePermissionsData?.data?.data?.module_templates || [];

      // Convert array of module templates to Record<string, string>
      const moduleTemplatesMap = moduleTemplates.reduce((acc, mt) => {
        acc[mt.module_id] = mt.permission_template_id;
        return acc;
      }, {} as Record<string, string>);

      form.reset({
        name: role.name,
        description: role.description || '',
        module_templates: moduleTemplatesMap,
      });
    } else if (mode === 'create') {
      form.reset({
        name: '',
        description: '',
        module_templates: {},
      });
    }
  }, [mode, role, rolePermissionsData, form]);

  // Submit handler
  const onSubmit = useCallback(
    async (data: RoleFormData) => {
      try {
        if (mode === 'create') {
          // Create role with module templates
          const createData: CreateRoleData = {
            name: data.name,
            description: data.description || undefined,
            module_templates: Object.keys(data.module_templates).length > 0
              ? data.module_templates
              : undefined,
          };

          await createMutation.mutateAsync(createData);
          success('Role created successfully!');
        } else if (mode === 'edit' && roleId) {
          // Update role with module templates
          const updateData: UpdateRoleData = {
            name: data.name || undefined,
            description: data.description || undefined,
            module_templates: Object.keys(data.module_templates).length > 0
              ? data.module_templates
              : undefined,
          };

          await updateMutation.mutateAsync({ id: roleId, data: updateData });
          success('Role updated successfully!');
        }

        onSuccess?.();
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError?.response?.data?.message || apiError?.message || 'An error occurred';
        error(errorMessage);
      }
    },
    [mode, roleId, createMutation, updateMutation, onSuccess, success, error]
  );

  return {
    form,
    onSubmit,
    moduleGroups,
    templates,
    isLoadingRole,
    isLoadingModules,
    isLoadingTemplates: isLoadingTemplates || isLoadingRolePermissions,
    isSubmitting,
    submitError,
  };
};
