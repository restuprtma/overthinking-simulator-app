import { Form, FormTextField, Alert, Button, Box } from '@venturo/react-ui';
import { useLocation } from "react-router";
import { useForgotPasswordForm } from '../../hooks/useForgotPasswordForm';

const AuthForgotPassword = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { form, errorMessage, successMessage, isLoading, onSubmit } = useForgotPasswordForm();

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="mt-6">
        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Email Field */}
        <Box sx={{ mb: 2 }}>
          <FormTextField
            name="email"
            type="email"
            label="Email Address"
            fullWidth
            disabled={isLoading}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            }}
          />
        </Box>

        {/* Submit Button */}
        {pathname == "/auth/auth2/forgot-password" ? (
          <Button
            type="submit"
            variant="solid"
            fullWidth
            className="bg-sky dark:bg-sky hover:bg-dark dark:hover:bg-dark"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Forgot Password'}
          </Button>
        ) : (
          <Button
            type="submit"
            variant="solid"
            color="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Forgot Password'}
          </Button>
        )}
      </Form>
    </>
  );
};

export default AuthForgotPassword;
