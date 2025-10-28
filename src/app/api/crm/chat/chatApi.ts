import { apiService } from '@/app/services/apiService';
import { ResponseApi, ResponseApiWithMeta } from '@/shared/types/api/type';
import type { Chat, ChatDetail, CreateChatRequest, ListChatsParams } from './type';

/** Chat API endpoints */

export const chatApi = {
  createChat: (data: CreateChatRequest) =>
    apiService.post<ResponseApi<Chat>>('/crm/v1/chats', data),

  listChats: (params?: ListChatsParams) =>
    apiService.get<ResponseApiWithMeta<Chat[]>>('/crm/v1/chats', params || {}),

  getChatById: (id: string) =>
    apiService.get<ResponseApi<ChatDetail>>(`/crm/v1/chats/${id}`),
};
