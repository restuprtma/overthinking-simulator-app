import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { usePostLogin } from '@/app/api/core/auth/useAuthApi';
import { useSnackbar } from '@venturo/react-ui';
import { authService } from '@/app/services/authService';
import type { ApiError } from '@/shared/types/api/type';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLoginForm = () => {
  const { success, error } = useSnackbar();

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Login mutation
  const loginMutation = usePostLogin({
    onSuccess: async (response) => {
      try {
        // Extract auth data from response
        const { access_token } = response.data.data;

        // Store auth token - will trigger AuthProvider update
        // User data will be extracted from JWT token
        await authService.setAuthData(access_token);

        // Show success message
        success('Login successful!');

        // Note: No manual navigation needed
        // GuestGuard will automatically redirect when it detects isAuthenticated = true
      } catch (err) {
        error('Login failed. Please try again.');
      }
    },
  });

  const onSubmit = useCallback(
    async (data: LoginFormData, event?: React.BaseSyntheticEvent): Promise<void> => {
      try {
        // Explicit prevent default to ensure SPA behavior
        event?.preventDefault();
        event?.stopPropagation();

        await loginMutation.mutateAsync({
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Login failed. Please check your credentials.';
        error(errorMessage);
      }
    },
    [loginMutation, success, error],
  );

  return {
    form,
    isLoading: loginMutation.isPending,
    onSubmit,
  };
};
