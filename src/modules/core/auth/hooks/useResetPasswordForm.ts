import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import { usePostResetPassword } from '@/app/api/core/auth/useAuthApi';
import { useSnackbar } from '@venturo/react-ui';
import { ROUTES } from '@/app/constants/router';
import type { ApiError } from '@/shared/types/api/type';

interface ResetPasswordFormData {
  new_password: string;
  confirm_password: string;
}

export const useResetPasswordForm = () => {
  const navigate = useNavigate();
  const { success, error } = useSnackbar();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const form = useForm<ResetPasswordFormData>({
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  // Reset password mutation
  const resetPasswordMutation = usePostResetPassword({
    onSuccess: () => {
      success('Password has been reset successfully! Redirecting to login...');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN);
      }, 2000);
    },
  });

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      // Validate passwords match
      if (data.new_password !== data.confirm_password) {
        error('Passwords do not match');
        return;
      }

      // Validate token exists
      if (!token) {
        error('Invalid or missing reset token');
        return;
      }

      try {
        await resetPasswordMutation.mutateAsync({
          token,
          new_password: data.new_password,
        });
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to reset password. Please try again.';
        error(errorMessage);
      }
    },
    [resetPasswordMutation, token, success, error],
  );

  const mutationError = resetPasswordMutation.error as ApiError | null;

  return {
    form,
    errorMessage: mutationError?.response?.data?.message || '',
    successMessage: resetPasswordMutation.isSuccess
      ? 'Password has been reset successfully! Redirecting to login...'
      : '',
    isLoading: resetPasswordMutation.isPending,
    onSubmit,
    token,
  };
};
