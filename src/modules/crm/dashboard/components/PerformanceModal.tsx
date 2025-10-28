import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@venturo/react-ui';
import { IconAward } from '@tabler/icons-react';

interface PerformanceModalProps {
  open: boolean;
  onClose: () => void;
}

export const PerformanceModal: React.FC<PerformanceModalProps> = ({ open, onClose }) => {
  const performanceLevels = [
    {
      title: 'Top Performance',
      emoji: '⭐',
      scoreRange: 'Score 90 atau lebih',
      color: '#FFE082',
      textColor: '#8D6E00',
      borderColor: '#FFE082',
      criteria: [
        'Konsisten mencapai lebih dari 95% target',
        'Response time kurang dari 5 menit',
        'Revenue tertinggi dalam tim',
        'Mentor untuk sales lain',
      ],
    },
    {
      title: 'Excellent',
      emoji: '⭐',
      scoreRange: 'Score 80-89',
      color: '#AED581',
      textColor: '#2E7D32',
      borderColor: '#AED581',
      criteria: [
        'Mencapai 85-95% target',
        'Response time 5-10 menit',
        'Revenue di atas rata-rata',
        'Proaktif dalam follow-up',
      ],
    },
    {
      title: 'Good',
      emoji: '✓',
      scoreRange: 'Score 70-79',
      color: '#81D4FA',
      textColor: '#01579B',
      borderColor: '#81D4FA',
      criteria: [
        'Mencapai 70-85% target',
        'Response time 10-15 menit',
        'Performance stabil',
        'Perlu coaching berkala',
      ],
    },
    {
      title: 'Developing',
      emoji: '◐',
      scoreRange: 'Score 60-69',
      color: '#B39DDB',
      textColor: '#4A148C',
      borderColor: '#B39DDB',
      criteria: [
        'Mencapai 50-70% target',
        'Response time 15-20 menit',
        'Performa berfluktuasi',
        'Butuh training intensif',
      ],
    },
    {
      title: 'Needs Attention',
      emoji: '⚠',
      scoreRange: 'Score kurang dari 60',
      color: '#f44336',
      textColor: '#ffffff',
      borderColor: '#f44336',
      criteria: [
        'Mencapai kurang dari 50% target',
        'Response time lebih dari 20 menit',
        'Performance di bawah standar',
        'Perlu action plan segera',
      ],
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconAward size={20} color="#E34234" />
          <Typography variant="h6" fontWeight={600}>
            Kriteria Performance Sales
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Panduan lengkap sistem penilaian performance sales berdasarkan KPI dan pencapaian
          target.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {performanceLevels.map((level, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                p: 3,
                borderLeft: 4,
                borderColor: level.borderColor,
                boxShadow: 1,
              }}
            >
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: level.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                  }}
                >
                  {level.emoji}
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ color: level.textColor }}
                  >
                    {level.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: level.textColor, opacity: 0.8, mt: 0.5 }}
                  >
                    {level.scoreRange}
                  </Typography>
                </Box>
              </Box>

              {/* Criteria Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)',
                  },
                  gap: 2,
                }}
              >
                {level.criteria.map((criterion, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: level.borderColor,
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
