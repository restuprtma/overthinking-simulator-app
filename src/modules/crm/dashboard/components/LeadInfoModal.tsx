import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@venturo/react-ui';
import { IconTarget, IconFlame, IconCloud, IconSnowflake } from '@tabler/icons-react';

interface LeadInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export const LeadInfoModal: React.FC<LeadInfoModalProps> = ({ open, onClose }) => {
  const leadCategories = [
    {
      name: 'Hot Lead',
      icon: IconFlame,
      color: '#E34234',
      criteria: [
        'Menunjukkan minat tinggi dan siap beli dalam 1-2 minggu',
        'Aktif bertanya detail produk dan harga',
        'Sudah memiliki budget yang jelas',
        'Decision maker terlibat dalam diskusi',
      ],
    },
    {
      name: 'Warm Lead',
      icon: IconCloud,
      color: '#f59e0b',
      criteria: [
        'Menunjukkan minat tapi belum urgent (1-3 bulan)',
        'Merespon komunikasi dengan positif',
        'Masih dalam tahap evaluasi dan perbandingan',
        'Perlu nurturing dan follow-up berkala',
      ],
    },
    {
      name: 'Cold Lead',
      icon: IconSnowflake,
      color: '#3b82f6',
      criteria: [
        'Minat rendah atau timing tidak tepat (3+ bulan)',
        'Jarang merespon atau komunikasi minimal',
        'Belum memiliki budget atau kebutuhan urgent',
        'Perlu pendekatan jangka panjang',
      ],
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconTarget size={20} color="#E34234" />
          <Typography variant="h6" fontWeight={600}>
            Kriteria Kategorisasi Lead
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Panduan lengkap untuk mengkategorikan lead berdasarkan tingkat minat dan timing
          pembelian.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {leadCategories.map((category, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <category.icon size={20} color={category.color} />
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ color: category.color }}
                >
                  {category.name}
                </Typography>
              </Box>

              {/* Criteria List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {category.criteria.map((criterion, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: category.color,
                        mt: 0.75,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" fontSize={13} lineHeight={1.6}>
                      {criterion}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
