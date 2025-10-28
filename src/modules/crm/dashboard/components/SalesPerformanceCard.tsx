import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Chip,
} from '@venturo/react-ui';
import Avatar from '@mui/material/Avatar';
import { IconInfoCircle } from '@tabler/icons-react';
import type { SalesPerformance, PerformanceBadgeConfig } from '../types';

interface SalesPerformanceCardProps {
  data: SalesPerformance[];
  onInfoClick: () => void;
}

export const SalesPerformanceCard: React.FC<SalesPerformanceCardProps> = ({
  data,
  onInfoClick,
}) => {
  const getBadgeConfig = (score: number): PerformanceBadgeConfig => {
    if (score >= 90) {
      return {
        label: 'Top Performer',
        color: 'warning',
        sx: {
          bgcolor: '#FFE082',
          color: '#8D6E00',
          '&:hover': { bgcolor: '#FFE082' },
        },
      };
    } else if (score >= 80) {
      return {
        label: 'Excellent',
        color: 'success',
        sx: {
          bgcolor: '#AED581',
          color: '#2E7D32',
          '&:hover': { bgcolor: '#AED581' },
        },
      };
    } else if (score >= 70) {
      return {
        label: 'Good',
        color: 'info',
        sx: {
          bgcolor: '#81D4FA',
          color: '#01579B',
          '&:hover': { bgcolor: '#81D4FA' },
        },
      };
    } else if (score >= 60) {
      return {
        label: 'Developing',
        color: 'secondary',
        sx: {
          bgcolor: '#B39DDB',
          color: '#4A148C',
          '&:hover': { bgcolor: '#B39DDB' },
        },
      };
    } else {
      return {
        label: 'Needs Attention',
        color: 'error',
      };
    }
  };

  return (
    <Card elevation={2}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={700}>
            Tim Sales Performance
          </Typography>
        }
        action={
          <Box
            onClick={onInfoClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              padding: '6px 12px',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <IconInfoCircle size={16} />
            <Typography variant="body2">Performance</Typography>
          </Box>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          {data.map((sales, index) => {
            const badgeConfig = getBadgeConfig(sales.score);
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={sales.avatar}
                    alt={`${sales.name} profile`}
                    sx={{
                      width: 40,
                      height: 40,
                      border: '2px solid',
                      borderColor: 'background.paper',
                      boxShadow: 1,
                    }}
                  >
                    {sales.name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600} fontSize={13}>
                      {sales.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" fontSize={11}>
                      {sales.followUps} follow-ups • {sales.deals} deals
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {sales.score}
                  </Typography>
                  <Chip
                    label={badgeConfig.label}
                    size="small"
                    color={badgeConfig.color}
                    sx={{
                      fontSize: 10,
                      height: 20,
                      ...badgeConfig.sx,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
