import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import { permissionApi } from './permissionApi';
import type {
  CreatePermissionData,
  ListPermissionsParams,
  Permission,
  UpdatePermissionData,
} from './type';

/** Permission API React Query hooks */

export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: (params?: ListPermissionsParams) =>
    [...permissionKeys.lists(), params] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (id: string) => [...permissionKeys.details(), id] as const,
  actions: () => [...permissionKeys.all, 'actions'] as const,
};

export const usePostPermissions = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<Permission>>,
    AxiosError,
    CreatePermissionData
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePermissionData) =>
      permissionApi.createPermission(data),
    onSuccess: async (response, ...args) => {
      // Invalidate all permission lists
      await queryClient.invalidateQueries({
        queryKey: permissionKeys.lists(),
      });
      // Invalidate the entire permissions cache
      await queryClient.invalidateQueries({ queryKey: permissionKeys.all });
      // Also invalidate module permissions cache since permissions are nested under modules
      await queryClient.invalidateQueries({ queryKey: ['modules'] });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const usePutPermissions = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<Permission>>,
    AxiosError,
    { id: string; data: UpdatePermissionData }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionData }) =>
      permissionApi.updatePermission(id, data),
    onSuccess: async (response, variables, ...args) => {
      // Invalidate specific permission detail
      await queryClient.invalidateQueries({
        queryKey: permissionKeys.detail(variables.id),
      });
      // Invalidate all permission lists
      await queryClient.invalidateQueries({
        queryKey: permissionKeys.lists(),
      });
      // Invalidate the entire permissions cache
      await queryClient.invalidateQueries({ queryKey: permissionKeys.all });
      // Also invalidate module permissions cache since permissions are nested under modules
      await queryClient.invalidateQueries({ queryKey: ['modules'] });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeletePermissions = (
  options?: UseMutationOptions<
    AxiosResponse<ResponseApi<void>>,
    AxiosError,
    string
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => permissionApi.deletePermission(id),
    onSuccess: async (response, id, ...args) => {
      // Invalidate permission detail
      await queryClient.invalidateQueries({
        queryKey: permissionKeys.detail(id),
      });
      // Invalidate permission lists
      await queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
      // Invalidate all permission cache
      await queryClient.invalidateQueries({ queryKey: permissionKeys.all });
      // Also invalidate module permissions cache since permissions are nested under modules
      await queryClient.invalidateQueries({ queryKey: ['modules'] });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

export const useGetListPermissions = (
  params?: ListPermissionsParams,
  options?: Omit<
    UseQueryOptions<AxiosResponse<ResponseApiWithMeta<Permission[]>>, AxiosError>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: permissionKeys.list(params),
    queryFn: () => permissionApi.listPermissions(params),
    ...options,
  });
};

export const useGetPermission = (
  id: string,
  options?: Omit<
    UseQueryOptions<AxiosResponse<ResponseApi<Permission>>, AxiosError>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: permissionKeys.detail(id),
    queryFn: () => permissionApi.getPermissionById(id),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

export const useGetActions = (
  options?: Omit<
    UseQueryOptions<AxiosResponse<ResponseApi<string[]>>, AxiosError>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: permissionKeys.actions(),
    queryFn: () => permissionApi.getActions(),
    staleTime: 5 * 60 * 1000, // 5 minutes - actions don't change often
    ...options,
  });
};
