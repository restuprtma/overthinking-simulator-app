import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Form,
  FormTextField,
  FormAutocomplete,
  CircularProgress,
  Switch,
  Typography,
} from '@venturo/react-ui';
import { CompanyUser } from '@/app/api/core/company/type';
import { useFormSalesPerson } from '../hooks/useFormSalesPerson';

interface AddSalesPersonFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  salesPerson?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddSalesPersonForm: React.FC<AddSalesPersonFormProps> = ({
  open,
  mode,
  salesPerson,
  onClose,
  onSuccess,
}) => {
  const { form, onSubmit, isSubmitting, companyUsers, isLoadingUsers, isLoadingSalesPerson } =
    useFormSalesPerson({
      mode,
      salesPersonId: salesPerson?.id,
      salesPerson: salesPerson, // Pass sales person data directly
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
        {mode === 'edit' ? 'Edit Sales Person' : 'Add New Sales Person'}
      </DialogTitle>

      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          {isLoadingUsers || (mode === 'edit' && isLoadingSalesPerson) ? (
            <div className="flex justify-center py-4 px-3">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-4">
              {/* Company User Selection */}
              <FormAutocomplete
                name="company_user_id"
                label="Select User"
                placeholder="Search user by name or email..."
                fullWidth
                required
                disabled={isSubmitting}
                multiple={false}
                showCheckboxes={false}
                rules={{
                  required: 'User selection is required',
                }}
                options={
                  companyUsers?.map((companyUser: CompanyUser) => ({
                    value: companyUser.id,
                    label: `${companyUser.user_full_name || 'Unknown'} (${
                      companyUser.user_email || 'No email'
                    })`,
                  })) || []
                }
              />

              {/* Sales Code and Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  name="sales_code"
                  label="Sales Code"
                  placeholder="e.g., SP001"
                  fullWidth
                  required
                  disabled={isSubmitting}
                  rules={{
                    required: 'Sales code is required',
                    minLength: {
                      value: 2,
                      message: 'Sales code must be at least 2 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Sales code must not exceed 50 characters',
                    },
                  }}
                />

                <FormTextField
                  name="sales_name"
                  label="Sales Name (Optional)"
                  placeholder="e.g., John Sales"
                  fullWidth
                  disabled={isSubmitting}
                  rules={{
                    maxLength: {
                      value: 255,
                      message: 'Sales name must not exceed 255 characters',
                    },
                  }}
                />
              </div>

              {/* Sales Area */}
              <FormTextField
                name="sales_area"
                label="Sales Area (Optional)"
                placeholder="e.g., Jakarta Selatan"
                fullWidth
                disabled={isSubmitting}
                rules={{
                  maxLength: {
                    value: 100,
                    message: 'Sales area must not exceed 100 characters',
                  },
                }}
              />

              {/* Target and Commission Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  name="sales_target"
                  label="Sales Target (Optional)"
                  placeholder="e.g., 50000000"
                  fullWidth
                  type="number"
                  disabled={isSubmitting}
                  rules={{
                    min: {
                      value: 0,
                      message: 'Sales target must be positive',
                    },
                  }}
                />

                <FormTextField
                  name="commission_rate"
                  label="Commission Rate % (Optional)"
                  placeholder="e.g., 5.00"
                  fullWidth
                  type="number"
                  disabled={isSubmitting}
                  rules={{
                    min: {
                      value: 0,
                      message: 'Commission rate must be between 0 and 100',
                    },
                    max: {
                      value: 100,
                      message: 'Commission rate must be between 0 and 100',
                    },
                  }}
                />
              </div>

              {/* WhatsApp */}
              <FormTextField
                name="whatsapp"
                label="WhatsApp Number (Optional)"
                placeholder="e.g., +628123456789"
                fullWidth
                disabled={isSubmitting}
                rules={{
                  maxLength: {
                    value: 20,
                    message: 'WhatsApp number must not exceed 20 characters',
                  },
                  pattern: {
                    value: /^\+?[0-9]{10,20}$/,
                    message: 'Please enter a valid phone number',
                  },
                }}
              />

              {/* Notes */}
              <FormTextField
                name="notes"
                label="Notes (Optional)"
                placeholder="Additional notes about this sales person"
                fullWidth
                multiline
                rows={3}
                disabled={isSubmitting}
              />

              {/* Toggle Switches */}
              <div className="flex flex-col gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {/* WhatsApp Connected - Only show in edit mode, read-only */}
                {mode === 'edit' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" fontWeight={500}>
                        WhatsApp Connected
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Status managed by system (read-only)
                      </Typography>
                    </div>
                    <Switch
                      checked={form.watch('is_whatsapp_connected')}
                      disabled={true}
                    />
                  </div>
                )}

                {/* Active Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" fontWeight={500}>
                      Active Status
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Set sales person as active
                    </Typography>
                  </div>
                  <Switch
                    checked={form.watch('is_active')}
                    onChange={(e) => form.setValue('is_active', e.target.checked)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
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
          disabled={isSubmitting || isLoadingUsers || isLoadingSalesPerson}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting
            ? mode === 'edit'
              ? 'Updating...'
              : 'Creating...'
            : mode === 'edit'
            ? 'Update Sales Person'
            : 'Create Sales Person'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
