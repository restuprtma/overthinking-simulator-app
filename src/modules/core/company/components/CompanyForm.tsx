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
  CircularProgress,
} from '@venturo/react-ui';
import { useFormCompany } from '../hooks/useFormCompany';
import type { Company } from '@/app/api/core/company/type';

interface CompanyFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  company?: Company | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  open,
  mode,
  company,
  onClose,
  onSuccess,
}) => {
  const { form, onSubmit, isLoadingCompany, isSubmitting } = useFormCompany({
    mode,
    companyId: company?.id,
    company: company,
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>
        {mode === 'create' ? 'Create New Company' : 'Edit Company'}
      </DialogTitle>

      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          {isLoadingCompany && mode === 'edit' ? (
            <div className="flex justify-center py-4 px-3">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  name="name"
                  label="Company Name"
                  placeholder="Enter company name"
                  fullWidth
                  required
                  disabled={isSubmitting}
                  rules={{
                    required: 'Company name is required',
                    minLength: {
                      value: 3,
                      message: 'Company name must be at least 3 characters',
                    },
                    maxLength: {
                      value: 255,
                      message: 'Company name must not exceed 255 characters',
                    },
                  }}
                />

                <FormTextField
                  name="code"
                  label="Company Code"
                  placeholder="Enter company code (alphanumeric only)"
                  fullWidth
                  required
                  disabled={isSubmitting || mode === 'edit'} // Code cannot be changed after creation
                  rules={{
                    required: 'Company code is required',
                    minLength: {
                      value: 2,
                      message: 'Company code must be at least 2 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Company code must not exceed 50 characters',
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message: 'Company code can only contain letters and numbers',
                    },
                  }}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter company email"
                  fullWidth
                  disabled={isSubmitting}
                  rules={{
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                    maxLength: {
                      value: 255,
                      message: 'Email must not exceed 255 characters',
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
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  name="tax_id"
                  label="Tax ID / NPWP"
                  placeholder="Enter tax ID"
                  fullWidth
                  disabled={isSubmitting}
                  rules={{
                    maxLength: {
                      value: 50,
                      message: 'Tax ID must not exceed 50 characters',
                    },
                  }}
                />

                <FormTextField
                  name="website"
                  type="url"
                  label="Website"
                  placeholder="https://example.com"
                  fullWidth
                  disabled={isSubmitting}
                  rules={{
                    maxLength: {
                      value: 255,
                      message: 'Website must not exceed 255 characters',
                    },
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Please enter a valid URL (starting with http:// or https://)',
                    },
                  }}
                />
              </div>

              {/* Address */}
              <FormTextField
                name="address"
                label="Address"
                placeholder="Enter company address"
                fullWidth
                multiline
                rows={3}
                disabled={isSubmitting}
                rules={{
                  maxLength: {
                    value: 1000,
                    message: 'Address must not exceed 1000 characters',
                  },
                }}
              />

              {/* Logo URL */}
              <FormTextField
                name="logo_url"
                type="url"
                label="Logo URL"
                placeholder="https://example.com/logo.png"
                fullWidth
                disabled={isSubmitting}
                rules={{
                  maxLength: {
                    value: 500,
                    message: 'Logo URL must not exceed 500 characters',
                  },
                  pattern: {
                    value: /^https?:\/\/.+/i,
                    message: 'Please enter a valid URL (starting with http:// or https://)',
                  },
                }}
              />

              {/* Limits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  name="max_users"
                  type="number"
                  label="Max Users"
                  placeholder="Enter maximum users"
                  fullWidth
                  disabled={isSubmitting}
                  rules={{
                    min: {
                      value: 1,
                      message: 'Max users must be at least 1',
                    },
                    max: {
                      value: 1000,
                      message: 'Max users must not exceed 1000',
                    },
                  }}
                />

                <FormTextField
                  name="max_branches"
                  type="number"
                  label="Max Branches"
                  placeholder="Enter maximum branches"
                  fullWidth
                  disabled={isSubmitting}
                  rules={{
                    min: {
                      value: 1,
                      message: 'Max branches must be at least 1',
                    },
                    max: {
                      value: 100,
                      message: 'Max branches must not exceed 100',
                    },
                  }}
                />
              </div>

              {/* Status - Only for edit mode */}
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
            ? 'Create Company'
            : 'Update Company'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
