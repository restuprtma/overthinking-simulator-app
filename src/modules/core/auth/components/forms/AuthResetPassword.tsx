import { Form, FormTextField, Alert, Button, Box } from '@venturo/react-ui';
import { useResetPasswordForm } from '../../hooks/useResetPasswordForm';

const AuthResetPassword = () => {
  const { form, errorMessage, successMessage, isLoading, onSubmit, token } = useResetPasswordForm();

  if (!token) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Invalid or missing reset token. Please request a new password reset link.
      </Alert>
    );
  }

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="mt-6">
        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* New Password Field */}
        <Box sx={{ mb: 2 }}>
          <FormTextField
            name="new_password"
            type="password"
            label="New Password"
            fullWidth
            disabled={isLoading || !!successMessage}
            rules={{
              required: 'New password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
          />
        </Box>

        {/* Confirm Password Field */}
        <Box sx={{ mb: 3 }}>
          <FormTextField
            name="confirm_password"
            type="password"
            label="Confirm Password"
            fullWidth
            disabled={isLoading || !!successMessage}
            rules={{
              required: 'Please confirm your password',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
          />
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="solid"
          color="primary"
          fullWidth
          disabled={isLoading || !!successMessage}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </Form>
    </>
  );
};

export default AuthResetPassword;
