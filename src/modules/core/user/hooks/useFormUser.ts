import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { usePostUsers, usePutUsers } from '@/app/api/core/user/useUserApi';
import { useGetListRoles } from '@/app/api/core/role/useRoleApi';
import { useSnackbar } from '@venturo/react-ui';
import type { CreateUserData, UpdateUserData } from '@/app/api/core/user/type';
import type { ApiError } from '@/shared/types/api/type';

/**
 * Form data interface for user creation/update
 */
interface UserFormData {
  full_name: string;
  username: string;
  email: string;
  phone?: string;
  password?: string;
  role_ids: string[];
  is_active: string; // '1' for active, '0' for inactive
}

/**
 * Hook options interface
 */
interface UseFormUserOptions {
  mode: 'create' | 'edit';
  userId?: string;
  user?: any; // User data from parent
  onSuccess?: () => void;
}

/**
 * Custom hook for managing user form operations
 * Handles form validation, submission, and user/role fetching
 */
export const useFormUser = ({ mode, userId, user: passedUser, onSuccess }: UseFormUserOptions) => {
  const { success, error } = useSnackbar();

  // Use passed user data directly (already has roles from list API)
  const user = passedUser;
  const isLoadingUser = false;

  // Fetch all roles for role selection
  const { data: rolesData, isLoading: isLoadingRoles } = useGetListRoles();

  // Form setup with React Hook Form
  const form = useForm<UserFormData>({
    defaultValues: {
      full_name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      role_ids: [],
      is_active: '1',
    },
  });

  // Create mutation
  const createMutation = usePostUsers();

  // Update mutation
  const updateMutation = usePutUsers();

  // Extract data
  const roles = rolesData?.data?.data || [];

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && user) {
      const roleIds = user.roles?.map((role: { id: string }) => role.id) || [];

      form.reset({
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        role_ids: roleIds,
        is_active: user.is_active ? '1' : '0',
        password: '', // Clear password field in edit mode
      });
    } else if (mode === 'create') {
      form.reset({
        full_name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        role_ids: [],
        is_active: '1',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form.reset causes infinite loop
  }, [user, mode]);

  // Form submission handler
  const onSubmit = useCallback(
    async (data: UserFormData) => {
      try {
        if (mode === 'create') {
          const createData: CreateUserData = {
            full_name: data.full_name || undefined,
            username: data.username,
            email: data.email,
            phone: data.phone || undefined,
            password: data.password!,
            role_ids: data.role_ids.length > 0 ? data.role_ids : undefined,
          };
          await createMutation.mutateAsync(createData);
          form.reset();
          success('User created successfully!');
          onSuccess?.();
        } else if (mode === 'edit' && userId) {
          const updateData: UpdateUserData = {
            full_name: data.full_name || undefined,
            username: data.username || undefined,
            email: data.email || undefined,
            phone: data.phone || undefined,
            is_active: data.is_active === '1',
            role_ids: data.role_ids.length > 0 ? data.role_ids : undefined,
          };
          await updateMutation.mutateAsync({ id: userId, data: updateData });
          success('User updated successfully!');
          onSuccess?.();
        }
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError?.response?.data?.message || apiError?.message || 'An error occurred';
        error(errorMessage);
      }
    },
    [mode, userId, createMutation, updateMutation, onSuccess, success, error, form],
  );

  return {
    // Form instance for Form component
    form,
    onSubmit,

    // Data
    roles,

    // Loading states
    isLoadingUser,
    isLoadingRoles,
    isSubmitting:
      form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending,

    // Error states
    submitError: createMutation.error || updateMutation.error,
  };
};
