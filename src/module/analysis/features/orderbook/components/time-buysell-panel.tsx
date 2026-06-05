import type { PlaybackEngine } from 'src/module/analysis/features/orderbook-playback/hooks/use-playback-engine';

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/ui/iconify';
import { Scrollbar } from 'src/shared/ui/scrollbar';
import { fmtNumber } from 'src/module/analysis/features/orderbook-playback/data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: PlaybackEngine;
};

type TabKey = 'chart' | 'price' | 'time';

type Bucket = {
  time: number;
  buy: number;
  sell: number;
};

const BUCKET_MIN = 10;
const BUCKET_SEC = BUCKET_MIN * 60;

const GRID = '56px minmax(0, 1fr) 44px minmax(72px, 1.2fr) 44px minmax(0, 1fr)';

const CELL = {
  px: 0.75,
  py: 0.45,
  fontFamily: 'monospace',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
} as const;

const HEADER = {
  px: 0.75,
  py: 0.4,
  fontSize: 10.5,
  fontWeight: 700,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
} as const;

// ----------------------------------------------------------------------

function BuySellBar({ pctBuy, height = 6 }: { pctBuy: number; height?: number }) {
  return (
    <Box
      sx={{
        position: 'relative',
        height,
        borderRadius: height / 2,
        overflow: 'hidden',
        background: (t) =>
          `linear-gradient(to right, ${t.palette.error.main} 0%, ${t.palette.error.dark} 38%, ${t.palette.action.disabledBackground} 50%, ${t.palette.success.dark} 62%, ${t.palette.success.main} 100%)`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: `${pctBuy}%`,
          top: -2,
          bottom: -2,
          width: 3,
          borderRadius: 1,
          transform: 'translateX(-50%)',
          bgcolor: '#c084fc',
          boxShadow: '0 0 4px rgba(192, 132, 252, 0.6)',
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function TimeBuySellPanel({ engine }: Props) {
  const { session, currentTime, date } = engine;
  const [tab, setTab] = useState<TabKey>('time');

  const buckets = useMemo<Bucket[]>(() => {
    const map = new Map<number, Bucket>();
    for (const tr of session.trades) {
      if (tr.time > currentTime) break;
      const start = Math.floor(tr.time / BUCKET_SEC) * BUCKET_SEC;
      let b = map.get(start);
      if (!b) {
        b = { time: start, buy: 0, sell: 0 };
        map.set(start, b);
      }
      if (tr.side === 'buy') b.buy += tr.lot;
      else b.sell += tr.lot;
    }
    return Array.from(map.values()).sort((a, b) => a.time - b.time);
  }, [session.trades, currentTime]);

  const totals = useMemo(() => {
    let buy = 0;
    let sell = 0;
    for (const b of buckets) {
      buy += b.buy;
      sell += b.sell;
    }
    const total = buy + sell;
    return {
      buy,
      sell,
      total,
      pctBuy: total > 0 ? (buy / total) * 100 : 50,
      pctSell: total > 0 ? (sell / total) * 100 : 50,
    };
  }, [buckets]);

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
      {/* Header: tabs + date */}
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
        <Stack direction="row" spacing={0.5}>
          {(['chart', 'price', 'time'] as const).map((key) => {
            const active = tab === key;
            return (
              <Box
                key={key}
                role="button"
                tabIndex={0}
                onClick={() => setTab(key)}
                sx={{
                  px: 1.25,
                  py: 0.35,
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  cursor: 'pointer',
                  userSelect: 'none',
                  border: (t) =>
                    `1px solid ${active ? t.palette.primary.main : t.palette.divider}`,
                  color: active ? 'primary.main' : 'text.secondary',
                  transition: (t) =>
                    t.transitions.create(['background-color', 'color', 'border-color']),
                  '&:hover': {
                    color: active ? 'primary.main' : 'text.primary',
                  },
                }}
              >
                {key === 'chart' ? 'Chart' : key === 'price' ? 'Price' : 'Time'}
              </Box>
            );
          })}
        </Stack>
        <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
          <IconButton size="small" sx={{ width: 24, height: 24, color: 'text.secondary' }}>
            <Iconify icon="eva:arrow-ios-back-fill" width={14} />
          </IconButton>
          <Typography
            variant="caption"
            sx={{ fontFamily: 'monospace', minWidth: 80, textAlign: 'center' }}
          >
            {dayjs(date).format('DD MMM YY')}
          </Typography>
          <IconButton size="small" sx={{ width: 24, height: 24, color: 'text.secondary' }}>
            <Iconify icon="solar:calendar-date-bold" width={14} />
          </IconButton>
          <IconButton size="small" sx={{ width: 24, height: 24, color: 'text.secondary' }}>
            <Iconify icon="eva:arrow-ios-forward-fill" width={14} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Overall buy/sell ratio bar */}
      <Box sx={{ px: 1.5, py: 1.25, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
        <BuySellBar pctBuy={totals.pctBuy} height={8} />
      </Box>

      {/* Column header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: GRID,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: (t) => t.palette.action.hover,
        }}
      >
        <Box sx={HEADER}>Time</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>Sell Lot</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>%Sell</Box>
        <Box sx={{ ...HEADER, textAlign: 'center' }}>Chart</Box>
        <Box sx={{ ...HEADER, textAlign: 'left' }}>%Buy</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>Buy Lot</Box>
      </Box>

      {/* Body */}
      <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
        {buckets.length === 0 && (
          <Box sx={{ px: 1, py: 2, color: 'text.disabled', fontSize: 12, textAlign: 'center' }}>
            No data yet.
          </Box>
        )}
        {buckets.map((b) => {
          const total = b.buy + b.sell;
          const pctBuy = total > 0 ? (b.buy / total) * 100 : 0;
          const pctSell = total > 0 ? (b.sell / total) * 100 : 0;
          const buyDominant = pctBuy >= pctSell;
          return (
            <Box
              key={b.time}
              sx={{
                display: 'grid',
                gridTemplateColumns: GRID,
                alignItems: 'center',
                borderBottom: (t) => `1px dashed ${t.palette.divider}`,
              }}
            >
              <Box sx={{ ...CELL, color: 'text.secondary' }}>
                {new Date(b.time * 1000).toISOString().substring(11, 16)}
              </Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'right',
                  color: 'error.main',
                  fontWeight: !buyDominant ? 700 : 500,
                }}
              >
                {b.sell > 0 ? fmtNumber(b.sell) : '-'}
              </Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'right',
                  fontWeight: !buyDominant ? 700 : 500,
                  color: !buyDominant ? 'text.primary' : 'text.secondary',
                }}
              >
                {Math.round(pctSell)}%
              </Box>
              <Box sx={{ px: 1, py: 0.5 }}>
                <BuySellBar pctBuy={pctBuy} />
              </Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'left',
                  fontWeight: buyDominant ? 700 : 500,
                  color: buyDominant ? 'text.primary' : 'text.secondary',
                }}
              >
                {Math.round(pctBuy)}%
              </Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'right',
                  color: 'success.main',
                  fontWeight: buyDominant ? 700 : 500,
                }}
              >
                {b.buy > 0 ? fmtNumber(b.buy) : '-'}
              </Box>
            </Box>
          );
        })}
      </Scrollbar>

      {/* Total */}
      {buckets.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: GRID,
            alignItems: 'center',
            borderTop: (t) => `2px solid ${t.palette.divider}`,
            bgcolor: (t) => t.palette.action.selected,
          }}
        >
          <Box sx={{ ...CELL, fontWeight: 800 }}>Total</Box>
          <Box sx={{ ...CELL, textAlign: 'right', color: 'error.main', fontWeight: 800 }}>
            {fmtNumber(totals.sell)}
          </Box>
          <Box sx={{ ...CELL, textAlign: 'right', fontWeight: 800 }}>
            {Math.round(totals.pctSell)}%
          </Box>
          <Box sx={{ px: 1, py: 0.5 }}>
            <BuySellBar pctBuy={totals.pctBuy} />
          </Box>
          <Box sx={{ ...CELL, textAlign: 'left', fontWeight: 800 }}>
            {Math.round(totals.pctBuy)}%
          </Box>
          <Box sx={{ ...CELL, textAlign: 'right', color: 'success.main', fontWeight: 800 }}>
            {fmtNumber(totals.buy)}
          </Box>
        </Box>
      )}
    </Card>
  );
}
