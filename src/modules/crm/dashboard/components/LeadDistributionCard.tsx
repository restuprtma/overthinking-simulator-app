import React from 'react';
import { Card, CardContent, CardHeader, Box, Typography, Chip } from '@venturo/react-ui';
import { IconFlame, IconCloud, IconSnowflake, IconInfoCircle } from '@tabler/icons-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { LeadDistributionItem } from '../types';

interface LeadDistributionCardProps {
  data: LeadDistributionItem[];
  onInfoClick: () => void;
}

export const LeadDistributionCard: React.FC<LeadDistributionCardProps> = ({
  data,
  onInfoClick,
}) => {
  const getLeadIcon = (name: string) => {
    switch (name) {
      case 'Hot':
        return <IconFlame size={16} className="text-red-600" />;
      case 'Warm':
        return <IconCloud size={16} className="text-yellow-500" />;
      case 'Cold':
        return <IconSnowflake size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card elevation={2}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={700}>
            Distribusi Leads
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
            <Typography variant="body2">Tipe</Typography>
          </Box>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          {/* Pie Chart */}
          <Box sx={{ width: 200, height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getLeadIcon(item.name)}
                  <Typography variant="body2" fontSize={13}>
                    {item.name}
                  </Typography>
                </Box>
                <Chip
                  label={item.value}
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 45, fontWeight: 600 }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
