import React from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from '@venturo/react-ui';
import { useSalesPersonApi } from '@/app/api/crm/sales-person';
import { useGetCompanyUsers } from '@/app/api/core/company/useCompanyApi';
import { useAuth } from '@/app/auth/authContext';

/**
 * Form data interface for sales person creation
 */
interface SalesPersonFormData {
  company_user_id: string;
  sales_code: string;
  sales_name: string;
  sales_area: string;
  sales_target: string;
  commission_rate: string;
  whatsapp: string;
  is_whatsapp_connected: boolean;
  is_active: boolean;
  notes: string;
}

/**
 * Hook options interface
 */
interface UseFormSalesPersonOptions {
  mode: 'create' | 'edit';
  salesPersonId?: string;
  salesPerson?: any; // Sales person data from parent
  onSuccess?: () => void;
}

/**
 * Custom hook for managing sales person form operations
 * Handles form validation, submission, and data population
 */
export const useFormSalesPerson = ({
  mode,
  salesPersonId,
  salesPerson: passedSalesPerson,
  onSuccess,
}: UseFormSalesPersonOptions) => {
  const { success, error } = useSnackbar();
  const { user } = useAuth();
  const { useCreateSalesPerson, useUpdateSalesPerson } = useSalesPersonApi();

  // Fetch company users for dropdown
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetCompanyUsers(
    user?.company_id || '',
    {
      is_active: true,
      page_size: 100,
    }
  );

  const companyUsers = usersResponse?.data?.data || [];

  // Use passed sales person data directly (no need to fetch)
  const salesPerson = passedSalesPerson;
  const isLoadingSalesPerson = false;

  // Create and update mutations
  const createMutation = useCreateSalesPerson();
  const updateMutation = useUpdateSalesPerson();

  // Form setup with React Hook Form
  const form = useForm<SalesPersonFormData>({
    defaultValues: {
      company_user_id: '',
      sales_code: '',
      sales_name: '',
      sales_area: '',
      sales_target: '',
      commission_rate: '',
      whatsapp: '',
      is_whatsapp_connected: false,
      is_active: true,
      notes: '',
    },
  });

  // Initialize form data based on mode
  React.useEffect(() => {
    if (mode === 'edit' && salesPerson) {
      form.reset({
        company_user_id: salesPerson.company_user_id || '',
        sales_code: salesPerson.sales_code || '',
        sales_name: salesPerson.sales_name || '',
        sales_area: salesPerson.sales_area || '',
        sales_target: salesPerson.sales_target?.toString() || '',
        commission_rate: salesPerson.commission_rate?.toString() || '',
        whatsapp: salesPerson.whatsapp || '',
        is_whatsapp_connected: salesPerson.is_whatsapp_connected || false,
        is_active: salesPerson.is_active ?? true,
        notes: salesPerson.notes || '',
      });
    } else if (mode === 'create') {
      form.reset({
        company_user_id: '',
        sales_code: '',
        sales_name: '',
        sales_area: '',
        sales_target: '',
        commission_rate: '',
        whatsapp: '',
        is_whatsapp_connected: false,
        is_active: true,
        notes: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesPerson, mode]);

  // Handle form submission
  const onSubmit = async (data: SalesPersonFormData) => {
    try {
      // Transform form data to API format
      const apiData = {
        company_user_id: data.company_user_id,
        sales_code: data.sales_code,
        sales_name: data.sales_name || null,
        sales_area: data.sales_area || null,
        sales_target: data.sales_target ? parseFloat(data.sales_target) : null,
        commission_rate: data.commission_rate ? parseFloat(data.commission_rate) : null,
        whatsapp: data.whatsapp || null,
        is_whatsapp_connected: data.is_whatsapp_connected,
        is_active: data.is_active,
        notes: data.notes || null,
      };

      if (mode === 'edit' && salesPersonId) {
        await updateMutation.mutateAsync({ id: salesPersonId, data: apiData });
        success('Sales person updated successfully');
        onSuccess?.();
      } else if (mode === 'create') {
        await createMutation.mutateAsync(apiData);
        form.reset();
        success('Sales person created successfully');
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} sales person`;
      error(errorMessage);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    companyUsers,
    isLoadingUsers,
    isLoadingSalesPerson,
  };
};
