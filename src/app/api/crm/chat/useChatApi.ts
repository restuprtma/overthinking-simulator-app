import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from './chatApi';
import type { CreateChatRequest, ListChatsParams } from './type';

/** React Query hooks for Chat API */

export const CHAT_QUERY_KEY = 'chats';

export const useChatApi = () => {
  const queryClient = useQueryClient();

  // List chats
  const useListChats = (params?: ListChatsParams) =>
    useQuery({
      queryKey: [CHAT_QUERY_KEY, 'list', params],
      queryFn: () => chatApi.listChats(params),
    });

  // Get chat by ID with messages
  const useGetChatById = (id: string, enabled = true) =>
    useQuery({
      queryKey: [CHAT_QUERY_KEY, 'detail', id],
      queryFn: () => chatApi.getChatById(id),
      enabled: enabled && !!id,
    });

  // Create chat
  const useCreateChat = () =>
    useMutation({
      mutationFn: (data: CreateChatRequest) => chatApi.createChat(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [CHAT_QUERY_KEY] });
      },
    });

  return {
    useListChats,
    useGetChatById,
    useCreateChat,
  };
};
