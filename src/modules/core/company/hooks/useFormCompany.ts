import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { usePostCompanies, usePutCompanies } from '@/app/api/core/company/useCompanyApi';
import { useSnackbar } from '@venturo/react-ui';
import type { CreateCompanyData, UpdateCompanyData } from '@/app/api/core/company/type';
import type { ApiError } from '@/shared/types/api/type';

/**
 * Form data interface for company creation/update
 */
interface CompanyFormData {
  name: string;
  code: string;
  tax_id?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  address?: string;
  village_id?: string;
  max_users?: number;
  max_branches?: number;
  is_active: string; // '1' for active, '0' for inactive
}

/**
 * Hook options interface
 */
interface UseFormCompanyOptions {
  mode: 'create' | 'edit';
  companyId?: string;
  company?: any; // Company data from parent
  onSuccess?: () => void;
}

/**
 * Custom hook for managing company form operations
 * Handles form validation, submission, and company fetching
 */
export const useFormCompany = ({
  mode,
  companyId,
  company: passedCompany,
  onSuccess,
}: UseFormCompanyOptions) => {
  const { success, error } = useSnackbar();

  // Use passed company data directly
  const company = passedCompany;
  const isLoadingCompany = false;

  // Form setup with React Hook Form
  const form = useForm<CompanyFormData>({
    defaultValues: {
      name: '',
      code: '',
      tax_id: '',
      phone: '',
      email: '',
      website: '',
      logo_url: '',
      address: '',
      village_id: '',
      max_users: undefined,
      max_branches: undefined,
      is_active: '1',
    },
  });

  // Create mutation
  const createMutation = usePostCompanies();

  // Update mutation
  const updateMutation = usePutCompanies();

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && company) {
      form.reset({
        name: company.name,
        code: company.code,
        tax_id: company.tax_id || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        logo_url: company.logo_url || '',
        address: company.address || '',
        village_id: company.village_id || '',
        max_users: company.max_users,
        max_branches: company.max_branches,
        is_active: company.is_active ? '1' : '0',
      });
    } else if (mode === 'create') {
      form.reset({
        name: '',
        code: '',
        tax_id: '',
        phone: '',
        email: '',
        website: '',
        logo_url: '',
        address: '',
        village_id: '',
        max_users: undefined,
        max_branches: undefined,
        is_active: '1',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form.reset causes infinite loop
  }, [company, mode]);

  // Form submission handler
  const onSubmit = useCallback(
    async (data: CompanyFormData) => {
      try {
        if (mode === 'create') {
          const createData: CreateCompanyData = {
            name: data.name,
            code: data.code,
            tax_id: data.tax_id || undefined,
            phone: data.phone || undefined,
            email: data.email || undefined,
            website: data.website || undefined,
            logo_url: data.logo_url || undefined,
            address: data.address || undefined,
            village_id: data.village_id || undefined,
            max_users: data.max_users || undefined,
            max_branches: data.max_branches || undefined,
          };
          await createMutation.mutateAsync(createData);
          form.reset();
          success('Company created successfully!');
          onSuccess?.();
        } else if (mode === 'edit' && companyId) {
          const updateData: UpdateCompanyData = {
            name: data.name || undefined,
            tax_id: data.tax_id || undefined,
            phone: data.phone || undefined,
            email: data.email || undefined,
            website: data.website || undefined,
            logo_url: data.logo_url || undefined,
            address: data.address || undefined,
            village_id: data.village_id || undefined,
            max_users: data.max_users || undefined,
            max_branches: data.max_branches || undefined,
            is_active: data.is_active === '1',
          };
          await updateMutation.mutateAsync({ id: companyId, data: updateData });
          success('Company updated successfully!');
          onSuccess?.();
        }
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage = apiError?.response?.data?.message || apiError?.message || 'An error occurred';
        error(errorMessage);
      }
    },
    [mode, companyId, createMutation, updateMutation, onSuccess, success, error, form]
  );

  return {
    // Form instance for Form component
    form,
    onSubmit,

    // Loading states
    isLoadingCompany,
    isSubmitting:
      form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending,

    // Error states
    submitError: createMutation.error || updateMutation.error,
  };
};
