import React, { useState, useRef, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Card,
  Tooltip,
  Button,
  Typography,
  useSnackbar,
  useAlertDialog,
} from '@venturo/react-ui';
import { IconSettings, IconPlus } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useChatHistory } from '../hooks/useChatHistory';
import { ChatSessionList } from '../components/ChatSessionList';
import { ChatDetail } from '../components/ChatDetail';
import { SalesPerformanceCard } from '../components/SalesPerformanceCard';
import { AutoReplySettings } from '../components/AutoReplySettings';
import { AddSalesPersonForm } from '../components/AddSalesPersonForm';
import { WhatsAppConnectDialog } from '../components/WhatsAppConnectDialog';
import { SALES_PERSON_QUERY_KEY, useSalesPersonApi } from '@/app/api/crm/sales-person/useSalesPersonApi';
import { useDialogState, useBoolean } from '@/shared/hooks';
import { APP_CONFIG } from '@/app/constants/app';
import type { SalesTeamMember } from '../types';

const ChatHistoryPage: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedChat,
    setSelectedChat,
    activeSales,
    setActiveSales,
    salesTeamData,
    isLoadingSalesPersons,
    chatData,
    chatMessages,
    selectedChatDetail,
    hasMoreChats,
    handleLoadMore,
  } = useChatHistory();

  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  const { showAlert } = useAlertDialog();
  const {
    useDeleteSalesPerson,
    useGetWhatsAppStatus,
    useDisconnectWhatsApp,
    useRestartWhatsApp,
  } = useSalesPersonApi();
  const deleteMutation = useDeleteSalesPerson();
  const disconnectMutation = useDisconnectWhatsApp();
  const restartMutation = useRestartWhatsApp();

  // Dialog states
  const salesPersonDialog = useBoolean();
  const whatsappDialog = useBoolean();
  const { dialogState, openCreate, openEdit, reset: resetDialogState } = useDialogState<SalesTeamMember>();

  const [showAutoReplySettings, setShowAutoReplySettings] = useState(false);
  const [selectedWhatsAppSalesId, setSelectedWhatsAppSalesId] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const stickyTabsRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch WhatsApp status for selected sales person
  // Auto-refetch every 3 seconds when status is STARTING (for restart/connect monitoring)
  const { data: whatsappStatusResponse, refetch: refetchWhatsAppStatus } = useGetWhatsAppStatus(
    activeSales !== 'all' ? activeSales : '',
    activeSales !== 'all'
  );

  // Auto-refetch status when STARTING (after restart)
  useEffect(() => {
    const status = whatsappStatusResponse?.data?.data?.status;

    if (status === 'STARTING') {
      const interval = setInterval(() => {
        refetchWhatsAppStatus();
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(interval);
    }
  }, [whatsappStatusResponse, refetchWhatsAppStatus]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 1, rootMargin: '-1px 0px 0px 0px' },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, []);

  const selectedChatData = selectedChatDetail || null;
  const selectedMessages = chatMessages || [];

  const selectedSalesData = salesTeamData.find((sales) => sales.id === activeSales);
  const salesRanking =
    salesTeamData
      .sort((a, b) => b.performance.overall_score - a.performance.overall_score)
      .findIndex((sales) => sales.id === activeSales) + 1;

  // Handlers
  const handleCreateClick = () => {
    openCreate();
    salesPersonDialog.setTrue();
  };

  const handleEditClick = (salesPersonId: string) => {
    // Find sales person data from salesTeamData
    const salesPerson = salesTeamData.find((s) => s.id === salesPersonId);
    if (salesPerson) {
      openEdit(salesPerson);
      salesPersonDialog.setTrue();
    }
  };

  const handleDialogClose = () => {
    salesPersonDialog.setFalse();
    // Reset state after dialog animation completes
    setTimeout(() => {
      resetDialogState();
    }, APP_CONFIG.DIALOG_TRANSITION_DELAY);
  };

  const handleSuccess = () => {
    // Table will auto-refresh via React Query cache invalidation
    queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY] });
    handleDialogClose();
  };

  // Handle delete sales person
  const handleDeleteSalesPerson = async (salesPersonId: string, salesPersonName: string) => {
    await showAlert({
      title: `Delete "${salesPersonName}"?`,
      message: 'This action cannot be undone. Are you sure you want to delete this sales person?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(salesPersonId);

        // If deleted sales person was selected, switch to "all"
        if (activeSales === salesPersonId) {
          setActiveSales('all');
        }
      },
      onSuccess: () => {
        snackbar.success(`Sales person "${salesPersonName}" has been deleted successfully`);
      },
      onError: (error) => {
        snackbar.error(`Failed to delete sales person: ${error.message}`);
      },
    });
  };

  // WhatsApp Handlers
  const handleConnectWhatsApp = async (salesPersonId: string) => {
    const salesPerson = salesTeamData.find((s) => s.id === salesPersonId);
    const whatsappNumber = salesPerson?.whatsapp || 'N/A';
    const salesName = salesPerson?.fullName || 'this sales person';

    await showAlert({
      title: 'Connect WhatsApp?',
      message: `Are you sure you want to connect WhatsApp for ${salesName}? This will link the WhatsApp number ${whatsappNumber} to this sales person account.`,
      confirmText: 'Yes, Connect',
      cancelText: 'Cancel',
      variant: 'info',
      onConfirm: async () => {
        setSelectedWhatsAppSalesId(salesPersonId);
        whatsappDialog.setTrue();
      },
    });
  };

  const handleDisconnectWhatsApp = async (salesPersonId: string) => {
    await showAlert({
      title: 'Disconnect WhatsApp?',
      message:
        'This will remove the device from WhatsApp linked devices. You will need to reconnect with a new pairing code.',
      confirmText: 'Disconnect',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        await disconnectMutation.mutateAsync(salesPersonId);
      },
      onSuccess: () => {
        snackbar.success('WhatsApp disconnected successfully');
      },
      onError: (error) => {
        snackbar.error(`Failed to disconnect WhatsApp: ${error.message}`);
      },
    });
  };

  const handleRestartWhatsApp = async (salesPersonId: string) => {
    try {
      await restartMutation.mutateAsync(salesPersonId);
      snackbar.success('WhatsApp session restarted successfully');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to restart WhatsApp session';
      snackbar.error(errorMessage);
    }
  };

  const handleWhatsAppConnectSuccess = () => {
    snackbar.success('WhatsApp connected successfully!');
    whatsappDialog.setFalse();
    setSelectedWhatsAppSalesId(null);
    // Refresh WhatsApp status
    queryClient.invalidateQueries({ queryKey: [SALES_PERSON_QUERY_KEY] });
  };

  const handleWhatsAppDialogClose = () => {
    whatsappDialog.setFalse();
    setSelectedWhatsAppSalesId(null);
  };

  return (
    <div className="p-6">
      <Card sx={{ flexShrink: 0 }}>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col">
            <Typography variant="h6">Chat History & Analytics</Typography>
            <Typography
              variant="inherit"
              fontSize={12}
              color="textSecondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Monitor WhatsApp conversations with AI analysis
            </Typography>
          </div>
          <div className="flex flex-row items-center gap-2 flex-wrap">
            <Tooltip title="Auto-Reply Settings">
              <Button
                variant="outlined"
                color="primary"
                size="md"
                className="flex items-center gap-2 !min-w-0 !px-3"
                onClick={() => setShowAutoReplySettings(true)}
              >
                <IconSettings size={16} />
              </Button>
            </Tooltip>

            <Button
              variant="solid"
              color="primary"
              size="md"
              className="flex items-center gap-2"
              onClick={handleCreateClick}
            >
              <IconPlus size={16} />
              <span className="hidden sm:inline">Add Sales</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Sentinel element for detecting sticky state */}
      <div ref={sentinelRef} style={{ height: '1px', marginTop: '16px' }} />

      {/* Sales Tabs */}
      <Card
        ref={stickyTabsRef}
        sx={{
          padding: '0',
          marginTop: '-1px',
          position: 'sticky',
          top: 3,
          zIndex: 10,
          boxShadow: isSticky
            ? '0 6px 12px -2px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.12)'
            : 'none',
          transition: 'box-shadow 0.2s ease-in-out',
        }}
      >
        <Tabs
          variant="scrollable"
          value={activeSales}
          onChange={(_, newValue) => setActiveSales(newValue)}
        >
          <Tab label="All" value="all" />
          {isLoadingSalesPersons ? (
            <Tab label="Loading..." value="loading" disabled />
          ) : (
            salesTeamData.map((sales) => (
              <Tab
                key={sales.id}
                label={
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        sales.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    {sales.name}
                  </div>
                }
                value={sales.id}
              />
            ))
          )}
        </Tabs>
      </Card>

      {/* Sales Performance Leaderboard */}
      {activeSales !== 'all' && selectedSalesData && (
        <Card sx={{ marginTop: 2 }}>
          <SalesPerformanceCard
            salesData={selectedSalesData}
            ranking={salesRanking}
            totalSales={salesTeamData.length}
            onEdit={handleEditClick}
            onDelete={handleDeleteSalesPerson}
            whatsappStatus={whatsappStatusResponse?.data?.data?.status || null}
            whatsappLastSeen={whatsappStatusResponse?.data?.data?.last_seen_at || null}
            onConnectWhatsapp={handleConnectWhatsApp}
            onDisconnectWhatsapp={handleDisconnectWhatsApp}
            onRestartWhatsapp={handleRestartWhatsApp}
          />
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 mt-4">
        <Card
          elevation={2}
          sx={{
            padding: 0,
          }}
        >
          <ChatSessionList
            chats={chatData}
            selectedChat={selectedChat}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onChatSelect={setSelectedChat}
            hasMore={hasMoreChats}
            onLoadMore={handleLoadMore}
          />
        </Card>
        <ChatDetail chat={selectedChatData} messages={selectedMessages} />
      </div>

      {/* Add/Edit Sales Person Form */}
      <AddSalesPersonForm
        open={salesPersonDialog.value}
        mode={dialogState.mode}
        salesPerson={dialogState.item}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />

      {/* Auto-Reply Settings Modal */}
      <AutoReplySettings
        open={showAutoReplySettings}
        onClose={() => setShowAutoReplySettings(false)}
      />

      {/* WhatsApp Connect Dialog */}
      {selectedWhatsAppSalesId && (
        <WhatsAppConnectDialog
          open={whatsappDialog.value}
          salesPersonId={selectedWhatsAppSalesId}
          salesPersonName={
            salesTeamData.find((s) => s.id === selectedWhatsAppSalesId)?.fullName || 'Sales Person'
          }
          onClose={handleWhatsAppDialogClose}
          onSuccess={handleWhatsAppConnectSuccess}
        />
      )}
    </div>
  );
};

export default ChatHistoryPage;
