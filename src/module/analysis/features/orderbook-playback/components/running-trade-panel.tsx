import type { PlaybackEngine } from '../hooks/use-playback-engine';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/shared/ui/scrollbar';

import { fmtHms, fmtNumber } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: PlaybackEngine;
  empty?: boolean;
};

const CELL = {
  px: 0.75,
  py: 0.3,
  fontFamily: 'monospace',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
} as const;

const HEADER = {
  px: 0.75,
  py: 0.35,
  fontSize: 11,
  fontWeight: 700,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
} as const;

export function RunningTradePanel({ engine, empty = false }: Props) {
  const { runningTrades: engineTrades, summary } = engine;
  const runningTrades = empty ? [] : engineTrades;

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
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' }}
        >
          Running Trade
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
          {runningTrades.length} ticks · avg {fmtNumber(summary.avg, 0)}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '64px 1fr 1fr 1fr 64px',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: (t) => t.palette.action.hover,
        }}
      >
        <Box sx={HEADER}>Time</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>Price</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>Lot</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>Value</Box>
        <Box sx={{ ...HEADER, textAlign: 'center' }}>Side</Box>
      </Box>

      <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
        {runningTrades.length === 0 && (
          <Box sx={{ px: 1, py: 2, color: 'text.disabled', fontSize: 12, textAlign: 'center' }}>
            No trades yet.
          </Box>
        )}
        {runningTrades.map((tr, i) => {
          const isBuy = tr.side === 'buy';
          const isBig = tr.lot >= 500;
          return (
            <Box
              key={`${tr.time}-${i}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: '64px 1fr 1fr 1fr 64px',
                borderBottom: (t) => `1px dashed ${t.palette.divider}`,
                bgcolor: isBig
                  ? (t) => (isBuy ? `${t.palette.success.main}10` : `${t.palette.error.main}10`)
                  : 'transparent',
              }}
            >
              <Box sx={{ ...CELL, color: 'text.disabled' }}>{fmtHms(tr.time)}</Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'right',
                  color: isBuy ? 'success.main' : 'error.main',
                  fontWeight: isBig ? 700 : 500,
                }}
              >
                {fmtNumber(tr.price)}
              </Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'right',
                  fontWeight: isBig ? 700 : 500,
                  color: isBig ? 'text.primary' : 'text.secondary',
                }}
              >
                {fmtNumber(tr.lot)}
              </Box>
              <Box sx={{ ...CELL, textAlign: 'right', color: 'text.secondary' }}>
                {fmtNumber(tr.price * tr.lot * 100)}
              </Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'center',
                  color: isBuy ? 'success.main' : 'error.main',
                  fontWeight: 800,
                  letterSpacing: 0.5,
                }}
              >
                {isBuy ? 'B' : 'S'}
                {tr.foreign !== 'none' && (
                  <Typography
                    component="span"
                    sx={{
                      ml: 0.3,
                      fontSize: 10,
                      color: tr.foreign === 'buy' ? 'info.main' : 'warning.main',
                    }}
                  >
                    F
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Scrollbar>
    </Card>
  );
}
