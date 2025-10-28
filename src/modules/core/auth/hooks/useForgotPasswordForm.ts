import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { usePostForgotPassword } from '@/app/api/core/auth/useAuthApi';
import { useSnackbar } from '@venturo/react-ui';
import type { ApiError } from '@/shared/types/api/type';

interface ForgotPasswordFormData {
  email: string;
}

export const useForgotPasswordForm = () => {
  const { success, error } = useSnackbar();

  const form = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = usePostForgotPassword({
    onSuccess: () => {
      success('Password reset instructions have been sent to your email.');
      form.reset();
    },
  });

  const onSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        await forgotPasswordMutation.mutateAsync(data);
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to send reset instructions. Please try again.';
        error(errorMessage);
      }
    },
    [forgotPasswordMutation, success, error],
  );

  const mutationError = forgotPasswordMutation.error as ApiError | null;

  return {
    form,
    errorMessage: mutationError?.response?.data?.message || '',
    successMessage: forgotPasswordMutation.isSuccess
      ? 'Password reset instructions have been sent to your email.'
      : '',
    isLoading: forgotPasswordMutation.isPending,
    onSubmit,
  };
};
