import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { usePostRegister } from '@/app/api/core/auth/useAuthApi';
import { useSnackbar } from '@venturo/react-ui';
import { ROUTES } from '@/app/constants/router';
import type { ApiError } from '@/shared/types/api/type';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { success, error } = useSnackbar();

  const form = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // Register mutation
  const registerMutation = usePostRegister({
    onSuccess: () => {
      success('Registration successful! Please verify your email.');
      navigate(ROUTES.AUTH.TWO_STEPS);
    },
  });

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      try {
        await registerMutation.mutateAsync(data);
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Registration failed. Please try again.';
        error(errorMessage);
      }
    },
    [registerMutation, error],
  );

  const mutationError = registerMutation.error as ApiError | null;

  return {
    form,
    errorMessage: mutationError?.response?.data?.message || '',
    isLoading: registerMutation.isPending,
    onSubmit,
  };
};
