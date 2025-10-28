import React from 'react';
import { CardContent, Badge, Button, Chip, IconButton, Tooltip, Avatar, LinearProgress, Box, Typography } from '@venturo/react-ui';
import {
  IconCalendar,
  IconTarget,
  IconClock,
  IconCurrencyDollar,
  IconEdit,
  IconTrash,
  IconBrandWhatsapp,
  IconPlugConnected,
  IconAlertCircle,
  IconRefresh,
  IconPlugOff,
  IconLoader,
} from '@tabler/icons-react';
import { usePermission } from '@/shared/hooks';
import { PERMISSIONS } from '@/app/constants/permission';
import type { SalesTeamMember } from '../types';
import type { WhatsAppSessionStatus } from '@/app/api/crm/sales-person/type';
import moment from 'moment';

interface SalesPerformanceCardProps {
  salesData: SalesTeamMember;
  ranking: number;
  totalSales: number;
  onEdit?: (salesPersonId: string) => void;
  onDelete?: (salesPersonId: string, salesPersonName: string) => void;
  whatsappStatus?: WhatsAppSessionStatus | null;
  whatsappLastSeen?: string | null;
  onConnectWhatsapp?: (salesPersonId: string) => void;
  onDisconnectWhatsapp?: (salesPersonId: string) => void;
  onRestartWhatsapp?: (salesPersonId: string) => void;
}

const getBadgeConfig = (badge: string) => {
  switch (badge) {
    case 'top_performer':
      return { label: 'Top Performer', color: '#FFE082', textColor: '#8D6E00' };
    case 'excellent':
      return { label: 'Excellent', color: '#AED581', textColor: '#2E7D32' };
    case 'good':
      return { label: 'Good', color: '#81D4FA', textColor: '#01579B' };
    case 'developing':
      return { label: 'Developing', color: '#B39DDB', textColor: '#4A148C' };
    default:
      return { label: 'Average', color: '#FDD835', textColor: '#F57F17' };
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return '#8D6E00';
  if (score >= 80) return '#2E7D32';
  if (score >= 70) return '#01579B';
  if (score >= 60) return '#4A148C';
  return '#F57F17';
};

export const SalesPerformanceCard: React.FC<SalesPerformanceCardProps> = ({
  salesData,
  ranking,
  totalSales,
  onEdit,
  onDelete,
  whatsappStatus,
  whatsappLastSeen,
  onConnectWhatsapp,
  onDisconnectWhatsapp,
  onRestartWhatsapp,
}) => {
  const { hasPermission } = usePermission();
  const badgeConfig = getBadgeConfig(salesData.performance.badge);

  const canEdit = hasPermission(PERMISSIONS.SALES_PERSON_EDIT);
  const canDelete = hasPermission(PERMISSIONS.SALES_PERSON_DELETE);
  const canManageWhatsApp = hasPermission(PERMISSIONS.SALES_PERSON_WHATSAPP_MANAGE);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(salesData.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(salesData.id, salesData.fullName);
    }
  };

  const handleConnectWhatsapp = () => {
    if (onConnectWhatsapp) {
      onConnectWhatsapp(salesData.id);
    }
  };

  const handleDisconnectWhatsapp = () => {
    if (onDisconnectWhatsapp) {
      onDisconnectWhatsapp(salesData.id);
    }
  };

  const handleRestartWhatsapp = () => {
    if (onRestartWhatsapp) {
      onRestartWhatsapp(salesData.id);
    }
  };

  // Get WhatsApp status config
  const getWhatsAppStatusConfig = () => {
    switch (whatsappStatus) {
      case 'WORKING':
        return {
          color: 'success',
          icon: IconBrandWhatsapp,
          title: 'WhatsApp Connected',
          subtitle: whatsappLastSeen
            ? `Last seen: ${moment(whatsappLastSeen).fromNow()}`
            : 'Ready to receive messages',
          badge: 'Active',
          showActions: true,
        };
      case 'STARTING':
        return {
          color: 'info',
          icon: IconLoader,
          title: 'Connecting...',
          subtitle: 'WhatsApp is being connected',
          badge: 'Connecting',
          showActions: false,
        };
      case 'FAILED':
        return {
          color: 'error',
          icon: IconAlertCircle,
          title: 'Connection Failed',
          subtitle: 'Failed to connect WhatsApp',
          badge: 'Failed',
          showActions: true,
        };
      case 'STOPPED':
        return {
          color: 'warning',
          icon: IconAlertCircle,
          title: 'WhatsApp Disconnected',
          subtitle: 'Session has been stopped',
          badge: 'Stopped',
          showActions: true,
        };
      default:
        return {
          color: 'warning',
          icon: IconAlertCircle,
          title: 'WhatsApp Not Connected',
          subtitle: 'Connect to start receiving messages',
          badge: 'Not Connected',
          showActions: true,
        };
    }
  };

  const statusConfig = getWhatsAppStatusConfig();
  const isConnected = whatsappStatus === 'WORKING';
  const isConnecting = whatsappStatus === 'STARTING';

  return (
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={salesData.avatar}
              alt={salesData.fullName}
              sx={{ width: 48, height: 48 }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                bgcolor: 'background.paper',
                borderRadius: '50%',
                p: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor:
                    ranking === 1
                      ? '#facc15'
                      : ranking === 2
                      ? '#d1d5db'
                      : ranking === 3
                      ? '#fb923c'
                      : '#e5e7eb',
                  color: ranking <= 3 ? 'text.primary' : 'text.secondary',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {ranking}
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={600}>
              {salesData.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {salesData.position}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ranking #{ranking} dari {totalSales} sales
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {canEdit && (
              <Tooltip title="Edit Sales Person">
                <IconButton
                  size="small"
                  onClick={handleEdit}
                  sx={{
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.lighter' },
                  }}
                >
                  <IconEdit size={18} />
                </IconButton>
              </Tooltip>
            )}
            {canDelete && (
              <Tooltip title="Delete Sales Person">
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  sx={{
                    color: 'error.main',
                    '&:hover': { bgcolor: 'error.lighter' },
                  }}
                >
                  <IconTrash size={18} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ color: getScoreColor(salesData.performance.overall_score) }}
          >
            {salesData.performance.overall_score}
          </Typography>
          <Badge
            badgeContent={badgeConfig.label}
            sx={{
              '& .MuiBadge-badge': {
                position: 'relative',
                transform: 'none',
                bgcolor: badgeConfig.color,
                color: badgeConfig.textColor,
              },
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <IconCalendar size={16} />
            <Typography variant="caption" color="text.secondary">
              Follow-ups
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={salesData.performance.follow_ups.percentage}
              sx={{
                flex: 1,
                height: 12,
                borderRadius: 1,
                bgcolor: '#E0E0E0',
                '& .MuiLinearProgress-bar': { bgcolor: '#FF8A65' },
              }}
            />
            <Typography variant="caption" fontWeight={600}>
              {salesData.performance.follow_ups.percentage}%
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {salesData.performance.follow_ups.current}/{salesData.performance.follow_ups.target}{' '}
            target
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <IconTarget size={16} />
            <Typography variant="caption" color="text.secondary">
              Deals Closed
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={salesData.performance.deals_closed.percentage}
              sx={{
                flex: 1,
                height: 12,
                borderRadius: 1,
                bgcolor: '#E0E0E0',
                '& .MuiLinearProgress-bar': { bgcolor: '#FF8A65' },
              }}
            />
            <Typography variant="caption" fontWeight={600}>
              {salesData.performance.deals_closed.percentage}%
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {salesData.performance.deals_closed.current}/{salesData.performance.deals_closed.target}{' '}
            deals
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <IconClock size={16} />
            <Typography variant="caption" color="text.secondary">
              Response Time
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={salesData.performance.response_time.percentage}
              sx={{
                flex: 1,
                height: 12,
                borderRadius: 1,
                bgcolor: '#E0E0E0',
                '& .MuiLinearProgress-bar': { bgcolor: '#FF8A65' },
              }}
            />
            <Typography variant="caption" fontWeight={600}>
              {salesData.performance.response_time.avg_minutes}m
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Average response
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <IconCurrencyDollar size={16} />
            <Typography variant="caption" color="text.secondary">
              Revenue
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={700} color="success.main">
            Rp {(salesData.performance.revenue / 1000000).toFixed(0)}M
          </Typography>
          <Typography variant="caption" color="text.secondary">
            This month
          </Typography>
        </Box>
      </Box>

      {/* WhatsApp Connection Status */}
      <Box
        sx={{
          mt: 3,
          pt: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderRadius: 2,
            bgcolor: `${statusConfig.color}.lighter`,
            border: '1px solid',
            borderColor: `${statusConfig.color}.light`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: `${statusConfig.color}.main`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isConnecting ? (
                <IconLoader size={24} color="white" className="animate-spin" />
              ) : (
                <statusConfig.icon size={24} color="white" />
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={600} color={`${statusConfig.color}.dark`}>
                {statusConfig.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {statusConfig.subtitle}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={statusConfig.badge}
              size="small"
              sx={{
                bgcolor: `${statusConfig.color}.main`,
                color: 'white',
                fontWeight: 600,
              }}
            />

            {/* Action Buttons */}
            {statusConfig.showActions && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {isConnected ? (
                  <>
                    {/* Restart & Disconnect require permission */}
                    {canManageWhatsApp && (
                      <>
                        <Tooltip title="Restart WhatsApp Session">
                          <IconButton
                            size="small"
                            onClick={handleRestartWhatsapp}
                            sx={{
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.lighter' },
                            }}
                          >
                            <IconRefresh size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Disconnect WhatsApp">
                          <IconButton
                            size="small"
                            onClick={handleDisconnectWhatsapp}
                            sx={{
                              color: 'error.main',
                              '&:hover': { bgcolor: 'error.lighter' },
                            }}
                          >
                            <IconPlugOff size={18} />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </>
                ) : (
                  <Tooltip title={!canManageWhatsApp ? "You don't have permission to manage WhatsApp" : "Connect WhatsApp Account"}>
                    <span>
                      <Button
                        variant="solid"
                        color="success"
                        size="sm"
                        startIcon={<IconPlugConnected size={16} />}
                        onClick={handleConnectWhatsapp}
                        disabled={isConnecting}
                      >
                        {isConnecting ? 'Connecting...' : 'Connect'}
                      </Button>
                    </span>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </CardContent>
  );
};
