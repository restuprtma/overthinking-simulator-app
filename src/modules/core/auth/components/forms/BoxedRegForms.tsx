import { Form, FormTextField, FormCheckbox, Alert, Button, Box } from '@venturo/react-ui';
import { Link } from "react-router";
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { ROUTES } from '@/app/constants/router';

const BoxedAuthRegister = () => {
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
            placeholder="Enter your name"
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
            placeholder="Enter your email"
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
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link className="text-xs text-primary" to={ROUTES.AUTH.FORGOT_PASSWORD}>Forgot Password ?</Link>
          </div>
          <FormTextField
            name="password"
            type="password"
            placeholder="Enter your password"
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

        {/* Keep me logged in */}
        <div className="flex justify-between my-5">
          <FormCheckbox
            name="rememberMe"
            label="Keep me logged in"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="solid"
          fullWidth
          className="bg-sky dark:bg-sky hover:bg-dark dark:hover:bg-dark"
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </Form>
    </>
  );
};

export default BoxedAuthRegister;
