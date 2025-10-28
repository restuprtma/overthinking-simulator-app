// Re-export API types for backward compatibility
export type { Chat, ChatMessage } from '@/app/api/crm/chat';

// Legacy types (deprecated - use Chat and ChatMessage from API instead)
export interface ChatSession {
  id: number;
  customer: string;
  phone: string;
  sales: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'hot' | 'warm' | 'cold';
  aiScore: number;
  keyHighlights: string[];
  totalMessages: number;
}

export interface ChatMessageLegacy {
  id: number;
  sender: 'customer' | 'sales';
  message: string;
  timestamp: string;
  aiHighlight: boolean;
  highlightType?: 'budget' | 'urgent' | 'deal';
}

export interface GroupedMessage {
  type: 'message' | 'dateSeparator';
  // For dateSeparator
  date?: string;
  dateText?: string;
  // For message - using ChatMessage fields from API
  id?: string;
  chat_id?: string;
  sender_type?: 'customer' | 'sales' | 'system' | 'auto_reply';
  sender_name?: string | null;
  content?: string;
  message_type?: string;
  sent_at?: string;
  delivery_status?: string | null;
  is_read?: boolean;
}

export interface SalesTeamMember {
  id: string;
  name: string;
  fullName: string;
  position: string;
  avatar: string;
  status: 'online' | 'offline';
  whatsapp?: string | null; // WhatsApp number from SalesPerson API
  performance: {
    overall_score: number;
    badge: 'top_performer' | 'excellent' | 'good' | 'developing';
    follow_ups: {
      current: number;
      target: number;
      percentage: number;
    };
    deals_closed: {
      current: number;
      target: number;
      percentage: number;
    };
    response_time: {
      avg_minutes: number;
      percentage: number;
    };
    revenue: number;
  };
}

export type DateFilterOption = 'all' | 'today' | 'yesterday' | 'week';
export type SalesFilterOption = 'all' | string;

// Auto-Reply Types
export interface AutoReplyRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: AutoReplyTriggerType;
  message: string;
  conditions: {
    keywords?: string[];
    timeRange?: {
      start: string;
      end: string;
    };
    salesAssigned?: string[];
    leadStatus?: string[];
  };
  delay?: number;
  priority: number;
}

export type AutoReplyTriggerType =
  | 'first_message'
  | 'outside_business_hours'
  | 'keyword_match'
  | 'no_sales_available'
  | 'high_priority_lead'
  | 'ai_confidence_low'
  | 'conversation_flow';

export interface AutoReplyStats {
  totalRules: number;
  activeRules: number;
  keywordsDetected: number;
  messagesToday: number;
}
