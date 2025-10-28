import {
  Form,
  FormTextField,
  FormCheckbox,
  Button,
  Box,
} from '@venturo/react-ui';
import { Link } from 'react-router';
import { useLoginForm } from '../../hooks/useLoginForm';
import { ROUTES } from '@/app/constants/router';

const AuthLogin = () => {
  const { form, isLoading, onSubmit } = useLoginForm();

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="mt-6">
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
        <Box sx={{ mb: 2 }}>
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

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between my-5">
          <FormCheckbox name="rememberMe" label="Remember this Device" />
          <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link>
        </div>

        {/* Submit Button */}
        <Button type="submit" color="primary" fullWidth disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Form>
    </>
  );
};

export default AuthLogin;
