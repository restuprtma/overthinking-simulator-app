import React from 'react';
import { Card, CardContent, CardHeader, Box, Typography } from '@venturo/react-ui';
import {
  IconUsers,
  IconClock,
  IconCircleCheck,
  IconTarget,
  IconCurrencyDollar,
  IconTrendingUp,
} from '@tabler/icons-react';
import type { DashboardStats } from '../types';

interface StatsCardsProps {
  data: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  const statsConfig = [
    {
      title: 'Total Leads',
      value: data.totalLeads,
      icon: IconUsers,
      iconColor: 'primary.main',
      trend: '+12% dari kemarin',
      trendColor: 'success.main',
      showTrendIcon: true,
    },
    {
      title: 'Follow-up Today',
      value: data.followUps,
      icon: IconClock,
      iconColor: 'warning.main',
      trend: '3 overdue',
      trendColor: 'warning.main',
      showTrendIcon: false,
    },
    {
      title: 'Deals Closed',
      value: data.dealsClosedToday,
      icon: IconCircleCheck,
      iconColor: 'success.main',
      trend: 'Target: 5/hari',
      trendColor: 'success.main',
      showTrendIcon: true,
    },
    {
      title: 'Conversion Rate',
      value: `${data.conversionRate}%`,
      icon: IconTarget,
      iconColor: 'secondary.main',
      trend: '+2.3% bulan ini',
      trendColor: 'success.main',
      showTrendIcon: true,
    },
    {
      title: 'Revenue',
      value: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(data.revenue),
      icon: IconCurrencyDollar,
      iconColor: 'success.main',
      trend: '+15% target',
      trendColor: 'success.main',
      showTrendIcon: true,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
        gap: 3,
      }}
    >
      {statsConfig.map((stat, index) => (
        <Card key={index} elevation={2}>
          <CardHeader
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 1,
            }}
            title={
              <Typography variant="body2" color="textSecondary" fontSize={14}>
                {stat.title}
              </Typography>
            }
            action={<stat.icon size={24} color={stat.iconColor} />}
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {stat.value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              {stat.showTrendIcon && <IconTrendingUp size={16} color={stat.trendColor} />}
              <Typography variant="caption" sx={{ color: stat.trendColor, fontSize: 12 }}>
                {stat.trend}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
