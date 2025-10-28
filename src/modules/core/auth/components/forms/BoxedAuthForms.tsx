import { Form, FormTextField, FormCheckbox, Button } from '@venturo/react-ui';
import { Link } from 'react-router';
import { useLoginForm } from '../../hooks/useLoginForm';
import { ROUTES } from '@/app/constants/router';

const BoxedAuthLogin = () => {
  const { form, isLoading, onSubmit } = useLoginForm();

  return (
    <>
      <div className="pt-6">
        <Form form={form} onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            {/* Email Field */}
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

            {/* Password Field */}
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
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between my-5 pl-1.5">
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
      </div>
    </>
  );
};

export default BoxedAuthLogin;
