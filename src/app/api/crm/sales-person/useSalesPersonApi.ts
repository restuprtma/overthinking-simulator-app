import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salesPersonApi } from './salesPersonApi';
import type { CreateSalesPersonData, ListSalesPersonsParams, UpdateSalesPersonData } from './type';

/** React Query hooks for Sales Person API */

export const SALES_PERSON_QUERY_KEY = 'sales-persons';

export const useSalesPersonApi = () => {
  const queryClient = useQueryClient();

  // List sales persons
  const useListSalesPersons = (params?: ListSalesPersonsParams) =>
    useQuery({
      queryKey: [SALES_PERSON_QUERY_KEY, 'list', params],
      queryFn: () => salesPersonApi.listSalesPersons(params),
    });

  // Get sales person by ID
  const useGetSalesPersonById = (id: string, enabled = true) =>
    useQuery({
      queryKey: [SALES_PERSON_QUERY_KEY, 'detail', id],
      queryFn: () => salesPersonApi.getSalesPersonById(id),
      enabled: enabled && !!id,
    });

  // Create sales person
  const useCreateSalesPerson = () =>
    useMutation({
      mutationFn: (data: CreateSalesPersonData) => salesPersonApi.createSalesPerson(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY] });
      },
    });

  // Update sales person
  const useUpdateSalesPerson = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateSalesPersonData }) =>
        salesPersonApi.updateSalesPerson(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY] });
      },
    });

  // Delete sales person
  const useDeleteSalesPerson = () =>
    useMutation({
      mutationFn: (id: string) => salesPersonApi.deleteSalesPerson(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY] });
      },
    });

  // Restore sales person
  const useRestoreSalesPerson = () =>
    useMutation({
      mutationFn: (id: string) => salesPersonApi.restoreSalesPerson(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY] });
      },
    });

  /** WhatsApp Integration Hooks */

  // Get WhatsApp status
  const useGetWhatsAppStatus = (id: string, enabled = true) =>
    useQuery({
      queryKey: [SALES_PERSON_QUERY_KEY, 'whatsapp-status', id],
      queryFn: () => salesPersonApi.getWhatsAppStatus(id),
      enabled: enabled && !!id,
      refetchInterval: false, // Controlled by polling hook
      staleTime: 2000, // Consider data fresh for 2 seconds
    });

  // Connect WhatsApp
  const useConnectWhatsApp = () =>
    useMutation({
      mutationFn: (id: string) => salesPersonApi.connectWhatsApp(id),
      onSuccess: (_, id) => {
        // Invalidate status to trigger refetch
        queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY, 'whatsapp-status', id] });
        queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY] });
      },
    });

  // Disconnect WhatsApp
  const useDisconnectWhatsApp = () =>
    useMutation({
      mutationFn: (id: string) => salesPersonApi.disconnectWhatsApp(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY, 'whatsapp-status', id] });
        queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY] });
      },
    });

  // Restart WhatsApp
  const useRestartWhatsApp = () =>
    useMutation({
      mutationFn: (id: string) => salesPersonApi.restartWhatsApp(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY, 'whatsapp-status', id] });
        queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY] });
      },
    });

  return {
    useListSalesPersons,
    useGetSalesPersonById,
    useCreateSalesPerson,
    useUpdateSalesPerson,
    useDeleteSalesPerson,
    useRestoreSalesPerson,
    // WhatsApp hooks
    useGetWhatsAppStatus,
    useConnectWhatsApp,
    useDisconnectWhatsApp,
    useRestartWhatsApp,
  };
};
