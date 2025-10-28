import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ResponseApi } from '@/shared/types/api/type';
import { storageService } from '@/app/services/storageService';
import { authApi } from './authApi';
import type {
  RegisterData,
  LoginCredentials,
  LoginData,
  ResendVerificationData,
  UpdateAccountData,
  User,
  ForgotPasswordData,
  ResetPasswordData,
  SwitchCompanyRequest,
  SwitchCompanyResponse,
  GetUserCompaniesResponse,
} from './type';

/** Auth API React Query hooks */

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  verifyEmail: (token: string) => [...authKeys.all, 'verify-email', token] as const,
  companies: () => [...authKeys.all, 'companies'] as const,
};

export const usePostRegister = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, RegisterData>
) => {
  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    ...options,
  });
};

export const usePostLogin = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<LoginData>>, AxiosError, LoginCredentials>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response, ...args) => {
      const { user } = response.data.data;

      // Set user data in React Query cache immediately for instant access
      queryClient.setQueryData(authKeys.profile(), {
        data: { data: user }
      });

      // Invalidate to trigger background refetch
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });

      // Call parent onSuccess (component level handles storage & navigation)
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const useGetVerifyEmail = (
  token: string,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<void>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: authKeys.verifyEmail(token),
    queryFn: () => authApi.verifyEmail(token),
    enabled: !!token && (options?.enabled ?? true),
    ...options,
  });
};

export const usePostResendVerification = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, ResendVerificationData>
) => {
  return useMutation({
    mutationFn: (data: ResendVerificationData) => authApi.resendVerification(data),
    ...options,
  });
};

export const useGetProfile = (
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<User>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  const token = storageService.get<string>('token');

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authApi.getProfile(),
    enabled: !!token && (options?.enabled ?? true),
    ...options,
  });
};

export const usePutAccount = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<User>>, AxiosError, UpdateAccountData>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAccountData) => authApi.updateAccount(data),
    onSuccess: (response, ...args) => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const usePostForgotPassword = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, ForgotPasswordData>
) => {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.forgotPassword(data),
    ...options,
  });
};

export const usePostResetPassword = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, ResetPasswordData>
) => {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
    ...options,
  });
};

// Company Management Hooks

export const useGetUserCompanies = (
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<GetUserCompaniesResponse>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  const token = storageService.get<string>('access_token');

  return useQuery({
    queryKey: authKeys.companies(),
    queryFn: async () => {
      try {
        return await authApi.getUserCompanies();
      } catch (error: any) {
        // If endpoint not found (404), return empty companies
        if (error.response?.status === 404) {
          console.warn('GET /auth/companies endpoint not found');
          return {
            data: {
              data: {
                companies: []
              },
              message: 'Endpoint not implemented yet'
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any,
          } as AxiosResponse<ResponseApi<GetUserCompaniesResponse>>;
        }

        // For other errors (including 401), just throw
        throw error;
      }
    },
    enabled: !!token && (options?.enabled ?? true),
    retry: false,
    ...options,
  });
};

export const useSwitchCompany = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<SwitchCompanyResponse>>, AxiosError, SwitchCompanyRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SwitchCompanyRequest) => authApi.switchCompany(data),
    onSuccess: async (response, ...args) => {
      // Invalidate all queries to force refetch with new company context
      await queryClient.invalidateQueries({ queryKey: authKeys.all });
      await queryClient.invalidateQueries();

      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};
