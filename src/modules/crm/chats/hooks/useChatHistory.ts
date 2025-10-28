import { useState, useMemo } from 'react';
import type { SalesTeamMember } from '../types';
import { useSalesPersonApi } from '@/app/api/crm/sales-person';
import { useChatApi, type ChatCategory } from '@/app/api/crm/chat';

export const useChatHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [activeSales, setActiveSales] = useState('all');
  const [filterStatus, setFilterStatus] = useState<ChatCategory | 'all'>('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // Fetch sales persons from API
  const { useListSalesPersons } = useSalesPersonApi();
  const { data: salesPersonsResponse, isLoading: isLoadingSalesPersons } = useListSalesPersons({
    page_size: 100,
  });

  // Fetch chats from API
  const { useListChats, useGetChatById } = useChatApi();
  const { data: chatsResponse, isLoading: isLoadingChats } = useListChats({
    page,
    page_size: pageSize,
    search: searchTerm || undefined,
    assigned_to_company_user_id: activeSales !== 'all' ? activeSales : undefined,
    category: filterStatus !== 'all' ? filterStatus : undefined,
  });

  // Fetch selected chat detail with messages
  const { data: chatDetailResponse } = useGetChatById(selectedChat || '', !!selectedChat);

  // Transform API data to SalesTeamMember format
  const salesTeamData: SalesTeamMember[] = useMemo(() => {
    const salesPersons = salesPersonsResponse?.data?.data || [];

    return salesPersons.map((sp) => {
      const displayStatus: 'online' | 'offline' =
        sp.is_whatsapp_connected && sp.is_active ? 'online' : 'offline';

      return {
        ...sp,
        id: sp.id,
        name: sp.sales_name || sp.user.full_name,
        fullName: sp.user.full_name,
        position: sp.sales_area || 'Sales Executive',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          sp.user.full_name,
        )}&background=random`,
        status: displayStatus,
        performance: {
          overall_score: 0,
          badge: 'developing' as const,
          follow_ups: { current: 0, target: 30, percentage: 0 },
          deals_closed: { current: 0, target: 15, percentage: 0 },
          response_time: { avg_minutes: 0, percentage: 0 },
          revenue: 0,
        },
      };
    });
  }, [salesPersonsResponse]);

  // Get chats data
  const chatData = chatsResponse?.data?.data || [];
  const chatMeta = chatsResponse?.data?.meta?.pagination;

  // Get chat messages
  const chatMessages = chatDetailResponse?.data?.data?.messages || [];

  // Calculate if has more chats
  const hasMoreChats = chatMeta ? page < chatMeta.total_pages : false;

  const handleLoadMore = () => {
    if (hasMoreChats) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedChat,
    setSelectedChat,
    activeSales,
    setActiveSales,
    filterStatus,
    setFilterStatus,
    salesTeamData,
    isLoadingSalesPersons,
    chatData,
    chatMessages,
    selectedChatDetail: chatDetailResponse?.data?.data?.chat,
    hasMoreChats,
    handleLoadMore,
    isLoadingChats,
  };
};
