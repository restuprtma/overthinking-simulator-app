import { useNavigate } from 'react-router';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { ROUTES } from '@/app/constants/router';
import Logo from '@/shared/components/layouts/full/shared/logo/Logo';
import { CircularProgress, Alert, Button } from '@mui/material';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, errorMessage, hasToken } = useVerifyEmail();

  return (
    <div className="relative overflow-hidden h-screen">
      <div className="flex items-center justify-center h-full bg-white dark:bg-darkgray">
        <div className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <Logo />
          </div>

          <h2 className="text-2xl font-bold my-6 text-dark dark:text-white">
            Email Verification
          </h2>

          {isLoading && (
            <div className="flex flex-col items-center gap-4">
              <CircularProgress size={50} />
              <p className="text-base text-gray-600 dark:text-gray-400">
                Verifying your email address...
              </p>
            </div>
          )}

          {isSuccess && (
            <Alert severity="success" className="mt-4">
              <div className="text-left">
                <strong>✅ Email verified successfully!</strong>
                <p className="mt-2">Redirecting to login page...</p>
              </div>
            </Alert>
          )}

          {isError && !isLoading && (
            <div className="mt-4">
              <Alert severity="error" className="mb-4">
                <div className="text-left">
                  <strong>❌ Verification failed</strong>
                  <p className="mt-2">
                    {errorMessage || 'Invalid or expired token.'}
                  </p>
                </div>
              </Alert>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate(ROUTES.AUTH.REGISTER)}
                className="mt-4"
              >
                Back to Register
              </Button>
            </div>
          )}

          {!hasToken && !isLoading && (
            <Alert severity="warning" className="mt-4">
              <div className="text-left">
                <strong>⚠️ No verification token found</strong>
                <p className="mt-2">Redirecting to login page...</p>
              </div>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
