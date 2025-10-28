import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useGetVerifyEmail } from '@/app/api/core/auth/useAuthApi';
import { useSnackbar } from '@venturo/react-ui';
import { ROUTES } from '@/app/constants/router';

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const { success, error } = useSnackbar();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const hasShownToast = useRef(false);
  const hasNavigated = useRef(false);

  // Auto-verify when page loads with token
  const verifyMutation = useGetVerifyEmail(token, {
    enabled: !!token,
  });

  // Handle successful verification
  useEffect(() => {
    if (verifyMutation.data && !hasNavigated.current) {
      if (!hasShownToast.current) {
        success('Email verified successfully!');
        hasShownToast.current = true;
      }
      hasNavigated.current = true;
      const timer = setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN, { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [verifyMutation.data]);

  // Handle error
  useEffect(() => {
    if (verifyMutation.error && !hasShownToast.current) {
      const errorMessage =
        (verifyMutation.error as any)?.response?.data?.message || 'Verification failed.';
      error(errorMessage);
      hasShownToast.current = true;
    }
  }, [verifyMutation.error]);

  // Handle missing token
  useEffect(() => {
    if (!token && !hasNavigated.current) {
      if (!hasShownToast.current) {
        error('Invalid verification link');
        hasShownToast.current = true;
      }
      hasNavigated.current = true;
      const timer = setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN, { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [token]);

  return {
    isLoading: verifyMutation.isLoading,
    isSuccess: !!verifyMutation.data,
    isError: !!verifyMutation.error,
    errorMessage: (verifyMutation.error as any)?.response?.data?.message || '',
    hasToken: !!token,
  };
};
