import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Form,
  FormTextField,
  FormSelect,
  FormAutocomplete,
  CircularProgress,
} from '@venturo/react-ui';
import { useFormUser } from '../hooks/useFormUser';
import type { User } from '@/app/api/core/user/type';

interface UserFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  user?: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ open, mode, user, onClose, onSuccess }) => {
  const { form, onSubmit, isLoadingUser, isSubmitting, roles, isLoadingRoles } = useFormUser({
    mode,
    userId: user?.id,
    user: user, // Pass user data directly
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle onClose={handleClose}>
        {mode === 'create' ? 'Create New User' : 'Edit User'}
      </DialogTitle>

      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          {isLoadingUser && mode === 'edit' ? (
            <div className="flex justify-center py-4 px-3">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-4">
              <FormTextField
                name="full_name"
                label="Full Name"
                placeholder="Enter full name"
                fullWidth
                required
                disabled={isSubmitting}
                rules={{
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters',
                  },
                }}
              />

              <FormTextField
                name="username"
                label="Username"
                placeholder="Enter username"
                fullWidth
                required
                disabled={isSubmitting}
                rules={{
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Username must not exceed 50 characters',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: 'Username can only contain letters and numbers',
                  },
                }}
              />

              <FormTextField
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter email address"
                fullWidth
                required
                disabled={isSubmitting}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                }}
              />

              <FormTextField
                name="phone"
                type="tel"
                label="Phone Number"
                placeholder="Enter phone number"
                fullWidth
                disabled={isSubmitting}
                rules={{
                  minLength: {
                    value: 10,
                    message: 'Phone number must be at least 10 characters',
                  },
                  maxLength: {
                    value: 20,
                    message: 'Phone number must not exceed 20 characters',
                  },
                }}
              />

              {mode === 'create' && (
                <FormTextField
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter password"
                  fullWidth
                  required
                  disabled={isSubmitting}
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    maxLength: {
                      value: 72,
                      message: 'Password must not exceed 72 characters',
                    },
                  }}
                />
              )}

              <FormAutocomplete
                name="role_ids"
                label="Roles"
                placeholder="Select roles"
                multiple
                fullWidth
                disabled={isSubmitting || isLoadingRoles}
                showCheckboxes
                options={
                  roles?.map((role) => ({
                    value: role.id,
                    label: role.name.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                  })) || []
                }
              />

              {mode === 'edit' && (
                <FormSelect
                  name="is_active"
                  label="Status"
                  fullWidth
                  disabled={isSubmitting}
                  options={[
                    { value: '1', label: 'Active' },
                    { value: '0', label: 'Inactive' },
                  ]}
                />
              )}
            </div>
          )}
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="grey" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="solid"
          color="primary"
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
            ? 'Create User'
            : 'Update User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
