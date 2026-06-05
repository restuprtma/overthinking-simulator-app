import type { BrokerActivityEngine } from '../hooks/use-broker-activity';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { Scrollbar } from 'src/shared/ui/scrollbar';

import { fmtCompact, fmtSignedCompact } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: BrokerActivityEngine;
};

export function SectorPanel({ engine }: Props) {
  const { t } = useTranslate('broker-activity');
  const { data } = engine;
  const total = data.totalVal;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 1,
      }}
    >
      <Stack
        direction="row"
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <Iconify icon="solar:list-bold" width={14} sx={{ color: 'primary.main' }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' }}
          >
            {t('sector.title')}
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
          {data.sectorTotals.length}
        </Typography>
      </Stack>

      <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
        <Stack spacing={1.25} sx={{ p: 1.5 }}>
          {data.sectorTotals.map((s) => {
            const share = total > 0 ? ((s.buyVal + s.sellVal) / total) * 100 : 0;
            const netUp = s.netVal >= 0;
            return (
              <Stack key={s.sector} spacing={0.4}>
                <Stack
                  direction="row"
                  sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}
                >
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'baseline' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11.5 }}>
                      {s.sector}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.disabled',
                        fontFamily: 'monospace',
                        fontSize: 10.5,
                      }}
                    >
                      {share.toFixed(1)}%
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: 12,
                      color: netUp ? 'success.main' : 'error.main',
                    }}
                  >
                    {fmtSignedCompact(s.netVal)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(share, 100)}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: netUp ? 'success.main' : 'error.main',
                    },
                  }}
                />
                <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 0.1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'success.main', fontFamily: 'monospace', fontSize: 10 }}
                  >
                    B {fmtCompact(s.buyVal)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'error.main', fontFamily: 'monospace', fontSize: 10 }}
                  >
                    S {fmtCompact(s.sellVal)}
                  </Typography>
                </Stack>
              </Stack>
            );
          })}
          {data.sectorTotals.length === 0 && (
            <Box sx={{ py: 4, color: 'text.disabled', fontSize: 12, textAlign: 'center' }}>
              {t('table.empty')}
            </Box>
          )}
        </Stack>
      </Scrollbar>
    </Card>
  );
}
