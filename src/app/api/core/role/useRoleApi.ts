import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import { roleApi } from './roleApi';
import type {
  CreateRoleData,
  ListRolesParams,
  UpdateRoleData,
  Role,
  RoleWithPermissions,
  AssignPermissionsData,
} from './type';

/** Role API React Query hooks */

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params?: ListRolesParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
  permissions: () => [...roleKeys.all, 'permissions'] as const,
  permission: (id: string) => [...roleKeys.permissions(), id] as const,
};

export const usePostRoles = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<Role>>, AxiosError, CreateRoleData>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleData) => roleApi.createRole(data),
    onSuccess: async (response, ...args) => {
      // Invalidate all role lists
      await queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      // Also invalidate the entire roles cache to be safe
      await queryClient.invalidateQueries({ queryKey: roleKeys.all });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const usePutRoles = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<Role>>, AxiosError, { id: string; data: UpdateRoleData }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleData }) => roleApi.updateRole(id, data),
    onSuccess: async (response, variables, ...args) => {
      // Invalidate specific role detail
      await queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
      // Invalidate all role lists
      await queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      // Also invalidate the entire roles cache to be safe
      await queryClient.invalidateQueries({ queryKey: roleKeys.all });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteRoles = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleApi.deleteRole(id),
    onSuccess: async (response, id, ...args) => {
      await queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

export const usePostRestoreRoles = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<Role>>, AxiosError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleApi.restoreRole(id),
    onSuccess: async (response, id, ...args) => {
      await queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

export const useGetListRoles = (
  params?: ListRolesParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApiWithMeta<Role[]>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => roleApi.listRoles(params),
    ...options,
  });
};

export const useGetRoles = (
  id: string,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<Role>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApi.getRoleById(id),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

// Permission management hooks
export const useGetRolePermissions = (
  id: string,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<RoleWithPermissions>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: roleKeys.permission(id),
    queryFn: () => roleApi.getRolePermissions(id),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

export const usePutRolePermissions = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, { id: string; data: AssignPermissionsData }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignPermissionsData }) => roleApi.assignPermissions(id, data),
    onSuccess: async (response, variables, ...args) => {
      // Invalidate role permissions
      await queryClient.invalidateQueries({ queryKey: roleKeys.permission(variables.id) });
      // Invalidate role detail
      await queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const usePostRolePermission = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, { id: string; permissionId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionId }: { id: string; permissionId: string }) => roleApi.addPermission(id, permissionId),
    onSuccess: async (response, variables, ...args) => {
      await queryClient.invalidateQueries({ queryKey: roleKeys.permission(variables.id) });
      await queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteRolePermission = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, { id: string; permissionId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionId }: { id: string; permissionId: string }) => roleApi.removePermission(id, permissionId),
    onSuccess: async (response, variables, ...args) => {
      await queryClient.invalidateQueries({ queryKey: roleKeys.permission(variables.id) });
      await queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};
