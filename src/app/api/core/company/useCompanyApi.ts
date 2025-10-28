import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import { companyApi } from './companyApi';
import type {
  AddUserToCompanyData,
  Company,
  CompanyUser,
  CreateCompanyData,
  ListCompaniesParams,
  ListCompanyUsersParams,
  UpdateCompanyData,
  UpdateCompanyUserData,
} from './type';

/** Company API React Query hooks */

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (params?: ListCompaniesParams) => [...companyKeys.lists(), params] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
  users: (companyId: string) => [...companyKeys.detail(companyId), 'users'] as const,
  usersList: (companyId: string, params?: ListCompanyUsersParams) =>
    [...companyKeys.users(companyId), 'list', params] as const,
};

// Company CRUD Hooks

export const usePostCompanies = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<Company>>, AxiosError, CreateCompanyData>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompanyData) => companyApi.createCompany(data),
    onSuccess: async (response, ...args) => {
      await queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: companyKeys.all });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const usePutCompanies = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<Company>>, AxiosError, { id: string; data: UpdateCompanyData }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyData }) =>
      companyApi.updateCompany(id, data),
    onSuccess: async (response, variables, ...args) => {
      await queryClient.invalidateQueries({ queryKey: companyKeys.detail(variables.id) });
      await queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: companyKeys.all });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteCompanies = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companyApi.deleteCompany(id),
    onSuccess: (response, id, ...args) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

export const useGetListCompanies = (
  params?: ListCompaniesParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApiWithMeta<Company[]>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: companyKeys.list(params),
    queryFn: () => companyApi.listCompanies(params),
    ...options,
  });
};

export const useGetCompany = (
  id: string,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<Company>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => companyApi.getCompanyById(id),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

// Company Users Management Hooks

export const useGetCompanyUsers = (
  companyId: string,
  params?: ListCompanyUsersParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApiWithMeta<CompanyUser[]>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: companyKeys.usersList(companyId, params),
    queryFn: () => companyApi.listCompanyUsers(companyId, params),
    enabled: !!companyId && (options?.enabled ?? true),
    ...options,
  });
};

export const useAddUserToCompany = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<CompanyUser>>,
    AxiosError,
    { companyId: string; data: AddUserToCompanyData }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, data }: { companyId: string; data: AddUserToCompanyData }) =>
      companyApi.addUserToCompany(companyId, data),
    onSuccess: async (response, variables, ...args) => {
      await queryClient.invalidateQueries({ queryKey: companyKeys.users(variables.companyId) });
      await queryClient.invalidateQueries({ queryKey: companyKeys.detail(variables.companyId) });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useUpdateCompanyUser = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<CompanyUser>>,
    AxiosError,
    { companyId: string; userId: string; data: UpdateCompanyUserData }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, userId, data }: { companyId: string; userId: string; data: UpdateCompanyUserData }) =>
      companyApi.updateCompanyUser(companyId, userId, data),
    onSuccess: async (response, variables, ...args) => {
      await queryClient.invalidateQueries({ queryKey: companyKeys.users(variables.companyId) });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useRemoveUserFromCompany = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<void>>,
    AxiosError,
    { companyId: string; userId: string }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, userId }: { companyId: string; userId: string }) =>
      companyApi.removeUserFromCompany(companyId, userId),
    onSuccess: async (response, variables, ...args) => {
      await queryClient.invalidateQueries({ queryKey: companyKeys.users(variables.companyId) });
      await queryClient.invalidateQueries({ queryKey: companyKeys.detail(variables.companyId) });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};
