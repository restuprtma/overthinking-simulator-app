import { Form, FormTextField, Alert, Button, Box, Typography } from '@venturo/react-ui';
import { useLocation } from "react-router";
import { useTwoStepsForm } from '../../hooks/useTwoStepsForm';

const AuthTwoSteps = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { form, errorMessage, isLoading, onSubmit } = useTwoStepsForm();

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="mt-6">
        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* 6-Digit Code Fields */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Type your 6 digits security code
          </Typography>
          <div className="flex gap-3.5">
            <FormTextField
              name="code1"
              type="text"
              slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: 'center' } } }}
              disabled={isLoading}
              rules={{ required: true }}
            />
            <FormTextField
              name="code2"
              type="text"
              slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: 'center' } } }}
              disabled={isLoading}
              rules={{ required: true }}
            />
            <FormTextField
              name="code3"
              type="text"
              slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: 'center' } } }}
              disabled={isLoading}
              rules={{ required: true }}
            />
            <FormTextField
              name="code4"
              type="text"
              slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: 'center' } } }}
              disabled={isLoading}
              rules={{ required: true }}
            />
            <FormTextField
              name="code5"
              type="text"
              slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: 'center' } } }}
              disabled={isLoading}
              rules={{ required: true }}
            />
            <FormTextField
              name="code6"
              type="text"
              slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: 'center' } } }}
              disabled={isLoading}
              rules={{ required: true }}
            />
          </div>
        </Box>

        {/* Submit Button */}
        {pathname == "/auth/auth2/two-steps" ? (
          <Button
            type="submit"
            variant="solid"
            fullWidth
            className="bg-sky dark:bg-sky hover:bg-dark dark:hover:bg-dark"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify My Account'}
          </Button>
        ) : (
          <Button
            type="submit"
            variant="solid"
            color="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify My Account'}
          </Button>
        )}
      </Form>
    </>
  );
};

export default AuthTwoSteps;
