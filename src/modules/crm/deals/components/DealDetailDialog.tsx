import React from 'react';
import { Dialog, Card, CardHeader, CardContent, Badge, Avatar, Chip, Box, Typography } from '@venturo/react-ui';
import { IconFileText, IconBuilding, IconUsers, IconMessage, IconPhone, IconMail } from '@tabler/icons-react';
import type { Deal } from '../types';

interface DealDetailDialogProps {
  open: boolean;
  deal: Deal | null;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const DealDetailDialog: React.FC<DealDetailDialogProps> = ({ open, deal, onClose }) => {
  if (!deal) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <IconFileText size={20} />
          <Typography variant="h6">Deal Details - {deal.id}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Complete information about closed deal
        </Typography>

        <Card
          sx={{
            mb: 3,
            borderLeft: 4,
            borderColor: deal.status === 'Won' ? 'success.main' : 'error.main',
            bgcolor: deal.status === 'Won' ? 'success.lighter' : 'error.lighter',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Deal Value
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {formatCurrency(deal.dealValue)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Badge
                  badgeContent={deal.status}
                  color={deal.status === 'Won' ? 'success' : 'error'}
                  sx={{ '& .MuiBadge-badge': { position: 'relative', transform: 'none', mt: 1 } }}
                />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="h6">{deal.duration}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Commission
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(deal.commission)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconBuilding size={20} />
                  <Typography variant="h6">Client Information</Typography>
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Company Name
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {deal.clientName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Contact Person
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {deal.contactPerson}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconPhone size={16} />
                  <Typography variant="body2">{deal.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconMail size={16} />
                  <Typography variant="body2">{deal.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={deal.category} size="small" variant="outlined" />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconUsers size={20} />
                  <Typography variant="h6">Sales Information</Typography>
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={deal.salesAvatar} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {deal.salesPerson}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sales Representative
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Lead Source
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={deal.source} size="small" variant="outlined" />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Closed Date
                  </Typography>
                  <Typography variant="body2">{deal.closeDate}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconMessage size={20} />
                <Typography variant="h6">Deal Notes</Typography>
              </Box>
            }
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {deal.notes}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Dialog>
  );
};
