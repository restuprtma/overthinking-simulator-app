import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import { useGetVerifyEmail, usePostResendVerification } from '@/app/api/core/auth/useAuthApi';
import { useSnackbar } from '@venturo/react-ui';
import type { ApiError } from '@/shared/types/api/type';

interface TwoStepsFormData {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
}

export const useTwoStepsForm = () => {
  const navigate = useNavigate();
  const { success, error, warning } = useSnackbar();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const form = useForm<TwoStepsFormData>({
    defaultValues: {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: '',
    },
  });

  // Verify email with token from URL (if available)
  const {
    isLoading: isVerifying,
    data: verifyData,
    error: verifyError,
  } = useGetVerifyEmail(tokenFromUrl, {
    enabled: !!tokenFromUrl,
  });

  // Handle verification success/error
  useEffect(() => {
    if (verifyData) {
      success('Email verified successfully!');
      navigate('/');
    }
  }, [verifyData, success, error, navigate]);

  useEffect(() => {
    if (verifyError) {
      const apiError = verifyError as ApiError;
      const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Email verification failed.';
      error(errorMessage);
    }
  }, [verifyError, error]);

  // Resend verification email
  const resendMutation = usePostResendVerification({
    onSuccess: () => {
      success('Verification email has been resent!');
    },
  });

  const onSubmit = useCallback(
    async (_data: TwoStepsFormData) => {
      // TODO: Implement verification with manual code input
      // Currently, the API only supports verification via token from email link
      // This requires a new API endpoint: POST /verify-email-with-code
      warning(
        'Manual code verification not yet implemented. Please check your email for verification link.',
      );
    },
    [warning],
  );

  const handleResendCode = useCallback(
    async (email: string) => {
      try {
        await resendMutation.mutateAsync({ email });
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to resend verification email.';
        error(errorMessage);
      }
    },
    [resendMutation, error],
  );

  return {
    form,
    errorMessage: '',
    isLoading: isVerifying || resendMutation.isPending,
    onSubmit,
    handleResendCode,
  };
};
