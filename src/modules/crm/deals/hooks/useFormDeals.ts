import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from '@venturo/react-ui';
import type { Deal } from '../types';

interface SalesTeamMember {
  id: string;
  name: string;
  avatar: string;
}

/**
 * Form data interface for deal creation/update
 */
interface DealFormData {
  clientName: string;
  contactPerson: string;
  phone: string;
  email: string;
  dealValue: number;
  category: string;
  source: string;
  salesPerson: string;
  status: 'Won' | 'Lost';
  notes?: string;
}

/**
 * Hook options interface
 */
interface UseFormDealsOptions {
  mode: 'create' | 'edit';
  dealId?: string;
  deal?: Deal | null;
  onSuccess?: () => void;
}

/**
 * Custom hook for managing deal form operations
 * Handles form validation, submission, and data fetching
 *
 * Note: This currently uses mock data. Replace with actual API calls when available.
 */
export const useFormDeals = ({ mode, dealId, deal: passedDeal, onSuccess }: UseFormDealsOptions) => {
  const { success, error } = useSnackbar();

  // Use passed deal data directly
  const deal = passedDeal;
  const isLoadingDeal = false;

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
  const form = useForm<DealFormData>({
    defaultValues: {
      clientName: '',
      contactPerson: '',
      phone: '',
      email: '',
      dealValue: 0,
      category: 'SME',
      source: 'WhatsApp',
      salesPerson: '',
      status: 'Won',
      notes: '',
    },
  });

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && deal) {
      form.reset({
        clientName: deal.clientName,
        contactPerson: deal.contactPerson,
        phone: deal.phone,
        email: deal.email,
        dealValue: deal.dealValue,
        category: deal.category,
        source: deal.source,
        salesPerson: deal.salesPerson,
        status: deal.status,
        notes: deal.notes || '',
      });
    } else if (mode === 'create') {
      form.reset({
        clientName: '',
        contactPerson: '',
        phone: '',
        email: '',
        dealValue: 0,
        category: 'SME',
        source: 'WhatsApp',
        salesPerson: '',
        status: 'Won',
        notes: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal, mode]);

  // Form submission handler
  const onSubmit = useCallback(
    async (data: DealFormData) => {
      try {
        if (mode === 'create') {
          // TODO: Replace with actual API call
          const createData = {
            ...data,
          };

          console.log('Creating deal:', createData);

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          form.reset();
          success('Deal created successfully!');
          onSuccess?.();
        } else if (mode === 'edit' && dealId) {
          // TODO: Replace with actual API call
          const updateData = {
            ...data,
          };

          console.log('Updating deal:', dealId, updateData);

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          success('Deal updated successfully!');
          onSuccess?.();
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 'An error occurred';
        error(errorMessage);
        console.error('Form submission error:', err);
      }
    },
    [mode, dealId, onSuccess, success, error, form],
  );

  return {
    // Form instance for Form component
    form,
    onSubmit,

    // Data
    salesTeam,

    // Loading states
    isLoadingDeal,
    isLoadingSalesTeam,
    isSubmitting: form.formState.isSubmitting,

    // Error states
    submitError: null, // TODO: Replace with actual error from API mutations
  };
};
