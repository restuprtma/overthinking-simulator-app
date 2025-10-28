import { Form, FormTextField, Alert, Button, Box } from '@venturo/react-ui';
import { useRegisterForm } from '../../hooks/useRegisterForm';

const AuthRegister = () => {
  const { form, errorMessage, isLoading, onSubmit } = useRegisterForm();

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="mt-6">
        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Name Field */}
        <Box sx={{ mb: 2 }}>
          <FormTextField
            name="name"
            type="text"
            label="Name"
            fullWidth
            disabled={isLoading}
            rules={{
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            }}
          />
        </Box>

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

        {/* Password Field */}
        <Box sx={{ mb: 3 }}>
          <FormTextField
            name="password"
            type="password"
            label="Password"
            fullWidth
            disabled={isLoading}
            rules={{
              required: 'Password is required',
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
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </Form>
    </>
  );
};

export default AuthRegister;
