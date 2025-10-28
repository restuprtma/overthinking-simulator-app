import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import { permissionTemplateApi } from './permissionTemplateApi';
import type {
  CreatePermissionTemplateData,
  ListPermissionTemplatesParams,
  UpdatePermissionTemplateData,
  PermissionTemplate,
} from './type';

/** Permission Template API React Query hooks */

export const permissionTemplateKeys = {
  all: ['permission-templates'] as const,
  lists: () => [...permissionTemplateKeys.all, 'list'] as const,
  list: (params?: ListPermissionTemplatesParams) => [...permissionTemplateKeys.lists(), params] as const,
  details: () => [...permissionTemplateKeys.all, 'detail'] as const,
  detail: (id: string) => [...permissionTemplateKeys.details(), id] as const,
  actions: () => [...permissionTemplateKeys.all, 'actions'] as const,
};

// Get Permission Actions
export const useGetPermissionActions = (
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<string[]>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: permissionTemplateKeys.actions(),
    queryFn: () => permissionTemplateApi.getPermissionActions(),
    ...options,
  });
};

// Create Permission Template
export const usePostPermissionTemplate = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<PermissionTemplate>>, AxiosError, CreatePermissionTemplateData>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePermissionTemplateData) => permissionTemplateApi.createPermissionTemplate(data),
    onSuccess: async (response, ...args) => {
      // Invalidate all permission template lists
      await queryClient.invalidateQueries({ queryKey: permissionTemplateKeys.lists() });
      // Also invalidate the entire permission templates cache to be safe
      await queryClient.invalidateQueries({ queryKey: permissionTemplateKeys.all });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

// Update Permission Template
export const usePutPermissionTemplate = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<PermissionTemplate>>, AxiosError, { id: string; data: UpdatePermissionTemplateData }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionTemplateData }) =>
      permissionTemplateApi.updatePermissionTemplate(id, data),
    onSuccess: async (response, variables, ...args) => {
      // Invalidate specific permission template detail
      await queryClient.invalidateQueries({ queryKey: permissionTemplateKeys.detail(variables.id) });
      // Invalidate all permission template lists
      await queryClient.invalidateQueries({ queryKey: permissionTemplateKeys.lists() });
      // Also invalidate the entire permission templates cache to be safe
      await queryClient.invalidateQueries({ queryKey: permissionTemplateKeys.all });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

// Delete Permission Template
export const useDeletePermissionTemplate = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => permissionTemplateApi.deletePermissionTemplate(id),
    onSuccess: (response, id, ...args) => {
      queryClient.invalidateQueries({ queryKey: permissionTemplateKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: permissionTemplateKeys.lists() });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

// Restore Permission Template
export const usePostRestorePermissionTemplate = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => permissionTemplateApi.restorePermissionTemplate(id),
    onSuccess: (response, id, ...args) => {
      queryClient.invalidateQueries({ queryKey: permissionTemplateKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: permissionTemplateKeys.lists() });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

// List Permission Templates
export const useGetListPermissionTemplates = (
  params?: ListPermissionTemplatesParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApiWithMeta<PermissionTemplate[]>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: permissionTemplateKeys.list(params),
    queryFn: () => permissionTemplateApi.listPermissionTemplates(params),
    ...options,
  });
};

// Get Permission Template by ID
export const useGetPermissionTemplate = (
  id: string,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<PermissionTemplate>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: permissionTemplateKeys.detail(id),
    queryFn: () => permissionTemplateApi.getPermissionTemplateById(id),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};
