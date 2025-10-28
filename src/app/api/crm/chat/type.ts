/** Chat API types based on backend OpenAPI spec */

export type ChatPlatform = 'whatsapp' | 'telegram' | 'email' | 'phone';
export type ChatStatus = 'active' | 'archived' | 'closed';
export type ChatCategory = 'hot' | 'warm' | 'cold';
export type MessageSenderType = 'customer' | 'sales' | 'system' | 'auto_reply';
export type MessageType = 'text' | 'image' | 'video' | 'file' | 'voice' | 'location';
export type DeliveryStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface LeadInfo {
  id: string;
  name: string;
  lead_number: string;
}

export interface AssignedUserInfo {
  company_user_id: string;
  user_id: string;
  full_name: string;
  email: string;
}

export interface Chat {
  id: string;
  company_id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  platform: ChatPlatform;
  status: ChatStatus;
  category: ChatCategory | null;
  last_message_at: string | null;
  last_message_preview: string | null;
  last_message_sender: MessageSenderType | null;
  unread_count: number;
  message_count: number;
  avg_response_time_minutes: number | null;
  first_response_time_minutes: number | null;
  sentiment_score: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  lead?: LeadInfo;
  assigned_to?: AssignedUserInfo;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_type: MessageSenderType;
  sender_id: string | null;
  sender_name: string | null;
  content: string;
  message_type: MessageType;
  media_url: string | null;
  media_mime_type: string | null;
  media_size_bytes: number | null;
  is_read: boolean;
  read_at: string | null;
  is_sent: boolean;
  sent_at: string;
  delivery_status: DeliveryStatus | null;
  created_at: string;
}

export interface ChatDetail {
  chat: Chat;
  messages: ChatMessage[];
}

export interface CreateChatMessageRequest {
  sender_type: MessageSenderType;
  sender_id?: string;
  sender_name?: string;
  content: string;
  message_type: MessageType;
  media_url?: string;
  media_mime_type?: string;
  media_size_bytes?: number;
  delivery_status?: DeliveryStatus;
  metadata?: string;
}

export interface CreateChatRequest {
  customer_name: string;
  phone: string;
  email?: string;
  lead_id?: string;
  platform: ChatPlatform;
  assigned_to_company_user_id?: string;
  category?: ChatCategory;
  first_message?: CreateChatMessageRequest;
}

export interface ListChatsParams {
  page?: number;
  page_size?: number;
  search?: string;
  platform?: ChatPlatform;
  status?: ChatStatus;
  category?: ChatCategory;
  assigned_to_company_user_id?: string;
}
