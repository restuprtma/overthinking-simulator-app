import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from '@venturo/react-ui';
import type { Lead, SalesTeamMember } from '../types';

/**
 * Form data interface for lead creation/update
 */
interface LeadFormData {
  name: string;
  contact: string;
  phone: string;
  email: string;
  category: 'hot' | 'warm' | 'cold';
  source: string;
  assignedTo: string;
  deal_value?: string;
  status: string;
  aiHighlights?: string;
  nextFollowUp?: string;
}

/**
 * Hook options interface
 */
interface UseFormLeadsOptions {
  mode: 'create' | 'edit';
  leadId?: number;
  lead?: Lead | null;
  onSuccess?: () => void;
}

/**
 * Custom hook for managing lead form operations
 * Handles form validation, submission, and data fetching
 *
 * Note: This currently uses mock data. Replace with actual API calls when available.
 */
export const useFormLeads = ({ mode, leadId, lead: passedLead, onSuccess }: UseFormLeadsOptions) => {
  const { success, error } = useSnackbar();

  // Use passed lead data directly
  const lead = passedLead;
  const isLoadingLead = false;

  // Mock sales team data - TODO: Replace with actual API call
  const salesTeam: SalesTeamMember[] = [
    {
      id: 'ahmad',
      name: 'Ahmad',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 'sari',
      name: 'Sari',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 'budi',
      name: 'Budi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 'linda',
      name: 'Linda',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 'eko',
      name: 'Eko',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
  ];

  const isLoadingSalesTeam = false;

  // Form setup with React Hook Form
  const form = useForm<LeadFormData>({
    defaultValues: {
      name: '',
      contact: '',
      phone: '',
      email: '',
      category: 'warm',
      source: 'WhatsApp',
      assignedTo: '',
      deal_value: '',
      status: 'new',
      aiHighlights: '',
      nextFollowUp: '',
    },
  });

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && lead) {
      form.reset({
        name: lead.name,
        contact: lead.contact,
        phone: lead.phone,
        email: lead.email,
        category: lead.category,
        source: lead.source,
        assignedTo: lead.assignedTo,
        deal_value: lead.deal_value || '',
        status: lead.status,
        aiHighlights: lead.aiHighlights?.join(', ') || '',
        nextFollowUp: lead.nextFollowUp || '',
      });
    } else if (mode === 'create') {
      form.reset({
        name: '',
        contact: '',
        phone: '',
        email: '',
        category: 'warm',
        source: 'WhatsApp',
        assignedTo: '',
        deal_value: '',
        status: 'new',
        aiHighlights: '',
        nextFollowUp: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead, mode]);

  // Form submission handler
  const onSubmit = useCallback(
    async (data: LeadFormData) => {
      try {
        // Convert aiHighlights string to array
        const aiHighlightsArray = data.aiHighlights
          ? data.aiHighlights.split(',').map((item) => item.trim()).filter(Boolean)
          : [];

        if (mode === 'create') {
          // TODO: Replace with actual API call
          const createData = {
            ...data,
            aiHighlights: aiHighlightsArray,
          };

          console.log('Creating lead:', createData);

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          form.reset();
          success('Lead created successfully!');
          onSuccess?.();
        } else if (mode === 'edit' && leadId) {
          // TODO: Replace with actual API call
          const updateData = {
            ...data,
            aiHighlights: aiHighlightsArray,
          };

          console.log('Updating lead:', leadId, updateData);

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          success('Lead updated successfully!');
          onSuccess?.();
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 'An error occurred';
        error(errorMessage);
        console.error('Form submission error:', err);
      }
    },
    [mode, leadId, onSuccess, success, error, form],
  );

  return {
    // Form instance for Form component
    form,
    onSubmit,

    // Data
    salesTeam,

    // Loading states
    isLoadingLead,
    isLoadingSalesTeam,
    isSubmitting: form.formState.isSubmitting,

    // Error states
    submitError: null, // TODO: Replace with actual error from API mutations
  };
};
