import React from 'react';
import { Card, CardContent, CardHeader, Box, Typography, Chip } from '@venturo/react-ui';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { LeadSourceItem } from '../types';

interface LeadSourceCardProps {
  data: LeadSourceItem[];
}

export const LeadSourceCard: React.FC<LeadSourceCardProps> = ({ data }) => {
  return (
    <Card elevation={2}>
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={700}>
            Sumber Lead
          </Typography>
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
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="leads"
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} leads`, 'Total']} />
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
                  justifyContent: 'space-between',
                  p: 1,
                  minWidth: 160,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: item.color,
                    }}
                  />
                  <Typography variant="body2" fontSize={13}>
                    {item.source}
                  </Typography>
                </Box>
                <Chip
                  label={item.leads}
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
