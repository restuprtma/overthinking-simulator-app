import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import { userApi } from './userApi';
import type {
  CreateUserData,
  ListUsersParams,
  UpdateUserData,
  User,
} from './type';

/** User API React Query hooks */

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: ListUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const usePostUsers = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<User>>, AxiosError, CreateUserData>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => userApi.createUser(data),
    onSuccess: async (response, ...args) => {
      // Invalidate all user lists
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Also invalidate the entire users cache to be safe
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(response, ...args);
    },
    ...options,
  });
};

export const usePutUsers = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<User>>, AxiosError, { id: string; data: UpdateUserData }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => userApi.updateUser(id, data),
    onSuccess: async (response, variables, ...args) => {
      // Invalidate specific user detail
      await queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      // Invalidate all user lists
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Also invalidate the entire users cache to be safe
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(response, variables, ...args);
    },
    ...options,
  });
};

export const useDeleteUsers = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: (response, id, ...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

export const usePostRestoreUsers = (
  options?: UseMutationOptions<AxiosResponse<ResponseApi<void>>, AxiosError, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.restoreUser(id),
    onSuccess: (response, id, ...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      options?.onSuccess?.(response, id, ...args);
    },
    ...options,
  });
};

export const useGetListUsers = (
  params?: ListUsersParams,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApiWithMeta<User[]>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userApi.listUsers(params),
    ...options,
  });
};

export const useGetUsers = (
  id: string,
  options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<User>>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};
