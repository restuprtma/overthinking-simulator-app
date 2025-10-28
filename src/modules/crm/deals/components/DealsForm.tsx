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
import { useFormDeals } from '../hooks/useFormDeals';
import type { Deal } from '../types';

interface DealsFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  deal?: Deal | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const DealsForm: React.FC<DealsFormProps> = ({ open, mode, deal, onClose, onSuccess }) => {
  const { form, onSubmit, isLoadingDeal, isSubmitting, salesTeam, isLoadingSalesTeam } = useFormDeals({
    mode,
    dealId: deal?.id,
    deal: deal,
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
        {mode === 'create' ? 'Create New Deal' : 'Edit Deal'}
      </DialogTitle>

      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          {isLoadingDeal && mode === 'edit' ? (
            <div className="flex justify-center py-4 px-3">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-4">
              {/* Client Information */}
              <FormTextField
                name="clientName"
                label="Client Name"
                placeholder="Enter client name"
                fullWidth
                required
                disabled={isSubmitting}
                rules={{
                  required: 'Client name is required',
                  minLength: {
                    value: 2,
                    message: 'Client name must be at least 2 characters',
                  },
                }}
              />

              <FormTextField
                name="contactPerson"
                label="Contact Person"
                placeholder="Enter contact person name"
                fullWidth
                required
                disabled={isSubmitting}
                rules={{
                  required: 'Contact person is required',
                }}
              />

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  fullWidth
                  required
                  disabled={isSubmitting}
                  rules={{
                    required: 'Phone number is required',
                    minLength: {
                      value: 10,
                      message: 'Phone number must be at least 10 characters',
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
              </div>

              {/* Deal Value and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  name="dealValue"
                  type="number"
                  label="Deal Value (IDR)"
                  placeholder="Enter deal value"
                  fullWidth
                  required
                  disabled={isSubmitting}
                  rules={{
                    required: 'Deal value is required',
                    min: {
                      value: 1,
                      message: 'Deal value must be greater than 0',
                    },
                  }}
                />

                <FormSelect
                  name="category"
                  label="Category"
                  fullWidth
                  required
                  disabled={isSubmitting}
                  rules={{
                    required: 'Category is required',
                  }}
                  options={[
                    { value: 'Enterprise', label: 'Enterprise' },
                    { value: 'SME', label: 'SME' },
                    { value: 'Startup', label: 'Startup' },
                  ]}
                />
              </div>

              {/* Source and Sales Person */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  name="source"
                  label="Lead Source"
                  fullWidth
                  required
                  disabled={isSubmitting}
                  rules={{
                    required: 'Source is required',
                  }}
                  options={[
                    { value: 'WhatsApp', label: 'WhatsApp' },
                    { value: 'Referral', label: 'Referral' },
                    { value: 'Cold Call', label: 'Cold Call' },
                    { value: 'Website', label: 'Website' },
                    { value: 'Social Media', label: 'Social Media' },
                  ]}
                />

                <FormSelect
                  name="salesPerson"
                  label="Assign to Sales"
                  fullWidth
                  required
                  disabled={isSubmitting || isLoadingSalesTeam}
                  rules={{
                    required: 'Sales assignment is required',
                  }}
                  options={
                    salesTeam?.map((sales) => ({
                      value: sales.name,
                      label: sales.name,
                    })) || []
                  }
                />
              </div>

              {/* Status */}
              <FormSelect
                name="status"
                label="Status"
                fullWidth
                required
                disabled={isSubmitting}
                rules={{
                  required: 'Status is required',
                }}
                options={[
                  { value: 'Won', label: 'Won' },
                  { value: 'Lost', label: 'Lost' },
                ]}
              />

              {/* Notes */}
              <FormTextField
                name="notes"
                label="Deal Notes"
                placeholder="Enter deal notes and details"
                fullWidth
                disabled={isSubmitting}
                multiline
                rows={3}
              />
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
            ? 'Create Deal'
            : 'Update Deal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
