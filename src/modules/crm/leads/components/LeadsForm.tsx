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
import { useFormLeads } from '../hooks/useFormLeads';
import type { Lead } from '../types';

interface LeadsFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  lead?: Lead | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeadsForm: React.FC<LeadsFormProps> = ({ open, mode, lead, onClose, onSuccess }) => {
  const { form, onSubmit, isLoadingLead, isSubmitting, salesTeam, isLoadingSalesTeam } = useFormLeads({
    mode,
    leadId: lead?.id,
    lead: lead,
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
        {mode === 'create' ? 'Create New Lead' : 'Edit Lead'}
      </DialogTitle>

      <DialogContent>
        <Form form={form} onSubmit={onSubmit}>
          {isLoadingLead && mode === 'edit' ? (
            <div className="flex justify-center py-4 px-3">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-4">
              {/* Company/Lead Name */}
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
                    value: 2,
                    message: 'Company name must be at least 2 characters',
                  },
                }}
              />

              {/* Contact Person */}
              <FormTextField
                name="contact"
                label="Contact Person"
                placeholder="Enter contact person name"
                fullWidth
                required
                disabled={isSubmitting}
                rules={{
                  required: 'Contact person is required',
                  minLength: {
                    value: 2,
                    message: 'Contact person name must be at least 2 characters',
                  },
                }}
              />

              {/* Phone and Email Row */}
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

              {/* Category and Source Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    { value: 'hot', label: '🔥 Hot' },
                    { value: 'warm', label: '🌤 Warm' },
                    { value: 'cold', label: '❄️ Cold' },
                  ]}
                />

                <FormSelect
                  name="source"
                  label="Source"
                  fullWidth
                  required
                  disabled={isSubmitting}
                  rules={{
                    required: 'Source is required',
                  }}
                  options={[
                    { value: 'WhatsApp', label: 'WhatsApp' },
                    { value: 'Website Form', label: 'Website Form' },
                    { value: 'Cold Call', label: 'Cold Call' },
                    { value: 'Referral', label: 'Referral' },
                    { value: 'Social Media', label: 'Social Media' },
                  ]}
                />
              </div>

              {/* Assigned To */}
              <FormSelect
                name="assignedTo"
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

              {/* Deal Value */}
              <FormTextField
                name="deal_value"
                label="Deal Value"
                placeholder="e.g., Rp 50,000,000"
                fullWidth
                disabled={isSubmitting}
              />

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
                  { value: 'new', label: 'New' },
                  { value: 'qualified', label: 'Qualified' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'proposal_sent', label: 'Proposal Sent' },
                  { value: 'follow_up', label: 'Follow Up' },
                  { value: 'won', label: 'Won' },
                  { value: 'lost', label: 'Lost' },
                ]}
              />

              {/* AI Highlights */}
              <FormTextField
                name="aiHighlights"
                label="AI Highlights (comma separated)"
                placeholder="e.g., Minta penawaran, Budget ready, Butuh cepat"
                fullWidth
                disabled={isSubmitting}
                multiline
                rows={2}
              />

              {/* Next Follow Up */}
              <FormTextField
                name="nextFollowUp"
                label="Next Follow Up"
                placeholder="e.g., Besok 14:00"
                fullWidth
                disabled={isSubmitting}
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
            ? 'Create Lead'
            : 'Update Lead'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
