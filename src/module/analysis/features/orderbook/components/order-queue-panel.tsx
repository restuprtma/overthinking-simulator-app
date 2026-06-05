import type { PlaybackEngine } from 'src/module/analysis/features/orderbook-playback/hooks/use-playback-engine';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/shared/ui/iconify';
import { Scrollbar } from 'src/shared/ui/scrollbar';
import { fmtNumber } from 'src/module/analysis/features/orderbook-playback/data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: PlaybackEngine;
};

type Order = {
  id: number;
  time: string;
  action: 'buy' | 'sell';
  price: number;
  status: 'open' | 'done' | 'cancelled';
  open: number;
  lot: number;
  broker: string;
  board: 'RG' | 'NG';
};

type SortKey = 'time' | 'price' | 'open' | 'lot' | 'id';
type SortDir = 'asc' | 'desc';

const BROKERS = ['AK', 'CC', 'YU', 'PD', 'NI', 'BR', 'KZ', 'LG'];

const GRID =
  '72px 60px minmax(0, 1fr) 72px minmax(0, 1fr) minmax(0, 1fr) 60px 56px minmax(0, 1fr)';

const CELL = {
  px: 0.75,
  py: 0.5,
  fontFamily: 'monospace',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
} as const;

const HEADER = {
  px: 0.75,
  py: 0.5,
  fontSize: 10.5,
  fontWeight: 700,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
} as const;

/* eslint-disable no-bitwise */
function hashCode(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* eslint-enable no-bitwise */

const LOT_OPTIONS = [1, 5, 10, 30, 50, 70, 100, 120, 200, 250, 500, 1000];

function generateOrders(seedKey: string, basePrice: number): Order[] {
  const rng = makeRng(hashCode(seedKey));
  const out: Order[] = [];
  const tickSize = basePrice < 200 ? 1 : basePrice < 500 ? 2 : basePrice < 2000 ? 5 : 10;

  for (let i = 0; i < 80; i++) {
    const isBuy = rng() < 0.5;
    const offset = Math.floor((rng() - 0.5) * 30) * tickSize;
    const price = Math.max(tickSize, basePrice + offset);
    const lot = LOT_OPTIONS[Math.floor(rng() * LOT_OPTIONS.length)];
    const broker = rng() < 0.85 ? '-' : BROKERS[Math.floor(rng() * BROKERS.length)];
    const minute = 58;
    const second = Math.floor(rng() * 60);
    out.push({
      id: 50 + Math.floor(rng() * 20000),
      time: `08:${minute}:${String(second).padStart(2, '0')}`,
      action: isBuy ? 'buy' : 'sell',
      price,
      status: 'open',
      open: lot,
      lot,
      broker,
      board: 'RG',
    });
  }
  return out;
}

function compare(a: Order, b: Order, key: SortKey, dir: SortDir): number {
  const av = a[key];
  const bv = b[key];
  let cmp: number;
  if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
  else cmp = String(av).localeCompare(String(bv));
  return dir === 'asc' ? cmp : -cmp;
}

// ----------------------------------------------------------------------

function SortableHeader({
  label,
  sortKey,
  align,
  active,
  dir,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  align?: 'left' | 'right' | 'center';
  active: boolean;
  dir: SortDir;
  onClick: (key: SortKey) => void;
}) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => onClick(sortKey)}
      sx={{
        ...HEADER,
        textAlign: align ?? 'left',
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 0.25,
        justifyContent:
          align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
        color: active ? 'text.primary' : 'text.secondary',
        '&:hover': { color: 'text.primary' },
      }}
    >
      {label}
      <Iconify
        icon={
          active && dir === 'asc'
            ? 'eva:arrow-ios-upward-fill'
            : active && dir === 'desc'
              ? 'eva:arrow-ios-downward-fill'
              : 'eva:arrow-ios-downward-fill'
        }
        width={12}
        sx={{ opacity: active ? 1 : 0.4 }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function OrderQueuePanel({ engine }: Props) {
  const { session } = engine;

  const [orderId, setOrderId] = useState('');
  const [priceQ, setPriceQ] = useState('');
  const [timeQ, setTimeQ] = useState('');
  const [actionF, setActionF] = useState<'all' | 'buy' | 'sell'>('all');
  const [statusF, setStatusF] = useState<'open' | 'done' | 'cancelled'>('open');
  const [boardF, setBoardF] = useState<'RG' | 'NG'>('RG');
  const [sortKey, setSortKey] = useState<SortKey>('time');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [refreshTick, setRefreshTick] = useState(0);

  const allOrders = useMemo(
    () => generateOrders(`${session.code}-${refreshTick}`, session.prevClose),
    [session.code, session.prevClose, refreshTick]
  );

  const filtered = useMemo(() => {
    const idQ = orderId.trim();
    const pQ = priceQ.trim();
    const tQ = timeQ.trim();
    return allOrders
      .filter((o) => {
        if (idQ && !String(o.id).includes(idQ)) return false;
        if (pQ && !String(o.price).includes(pQ)) return false;
        if (tQ && !o.time.includes(tQ)) return false;
        if (actionF !== 'all' && o.action !== actionF) return false;
        if (o.status !== statusF) return false;
        if (o.board !== boardF) return false;
        return true;
      })
      .sort((a, b) => compare(a, b, sortKey, sortDir));
  }, [allOrders, orderId, priceQ, timeQ, actionF, statusF, boardF, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

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
      {/* Filter bar */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          px: 1,
          py: 0.75,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 0.75,
        }}
      >
        <TextField
          size="small"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          sx={{ width: 110 }}
        />
        <TextField
          size="small"
          placeholder="All Price"
          value={priceQ}
          onChange={(e) => setPriceQ(e.target.value)}
          sx={{ width: 110 }}
        />
        <TextField
          size="small"
          placeholder="Time Range"
          value={timeQ}
          onChange={(e) => setTimeQ(e.target.value)}
          sx={{ width: 130 }}
        />
        <Select
          size="small"
          value={actionF}
          onChange={(e) => setActionF(e.target.value as typeof actionF)}
          sx={{ width: 100 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="buy">Buy</MenuItem>
          <MenuItem value="sell">Sell</MenuItem>
        </Select>
        <Select
          size="small"
          value={statusF}
          onChange={(e) => setStatusF(e.target.value as typeof statusF)}
          sx={{ width: 110 }}
        >
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="done">Done</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
        <Select
          size="small"
          value={boardF}
          onChange={(e) => setBoardF(e.target.value as typeof boardF)}
          sx={{ width: 110 }}
        >
          <MenuItem value="RG">Regular</MenuItem>
          <MenuItem value="NG">Negotiated</MenuItem>
        </Select>
        <Box sx={{ flex: 1 }} />
        <IconButton
          size="small"
          onClick={() => setRefreshTick((t) => t + 1)}
          sx={{ width: 28, height: 28, color: 'text.secondary' }}
          aria-label="Refresh orders"
        >
          <Iconify icon="solar:restart-bold" width={14} />
        </IconButton>
      </Stack>

      {/* Column header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: GRID,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: (t) => t.palette.action.hover,
        }}
      >
        <SortableHeader
          label="Time"
          sortKey="time"
          active={sortKey === 'time'}
          dir={sortDir}
          onClick={handleSort}
        />
        <Box sx={HEADER}>Action</Box>
        <SortableHeader
          label="Price"
          sortKey="price"
          align="right"
          active={sortKey === 'price'}
          dir={sortDir}
          onClick={handleSort}
        />
        <Box sx={HEADER}>Status</Box>
        <SortableHeader
          label="Open"
          sortKey="open"
          align="right"
          active={sortKey === 'open'}
          dir={sortDir}
          onClick={handleSort}
        />
        <SortableHeader
          label="Lot"
          sortKey="lot"
          align="right"
          active={sortKey === 'lot'}
          dir={sortDir}
          onClick={handleSort}
        />
        <Box sx={HEADER}>Broker</Box>
        <Box sx={{ ...HEADER, textAlign: 'center' }}>Board</Box>
        <SortableHeader
          label="Order ID"
          sortKey="id"
          align="right"
          active={sortKey === 'id'}
          dir={sortDir}
          onClick={handleSort}
        />
      </Box>

      {/* Body */}
      <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
        {filtered.length === 0 && (
          <Box sx={{ px: 1, py: 2, color: 'text.disabled', fontSize: 12, textAlign: 'center' }}>
            No orders match filters.
          </Box>
        )}
        {filtered.map((o) => {
          const isBuy = o.action === 'buy';
          const sideColor = isBuy ? 'success.main' : 'error.main';
          return (
            <Box
              key={o.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: GRID,
                alignItems: 'center',
                borderBottom: (t) => `1px dashed ${t.palette.divider}`,
              }}
            >
              <Box sx={{ ...CELL, color: 'text.secondary' }}>{o.time}</Box>
              <Box sx={{ ...CELL, color: sideColor, fontWeight: 700 }}>
                {isBuy ? 'Buy' : 'Sell'}
              </Box>
              <Box sx={{ ...CELL, textAlign: 'right', color: sideColor }}>
                {fmtNumber(o.price)}
              </Box>
              <Box sx={{ ...CELL, color: 'success.main' }}>Open</Box>
              <Box sx={{ ...CELL, textAlign: 'right', color: sideColor }}>{fmtNumber(o.open)}</Box>
              <Box sx={{ ...CELL, textAlign: 'right' }}>{fmtNumber(o.lot)}</Box>
              <Box sx={{ ...CELL, color: o.broker === '-' ? 'text.disabled' : 'text.primary' }}>
                {o.broker}
              </Box>
              <Box sx={{ ...CELL, textAlign: 'center', color: 'text.secondary' }}>{o.board}</Box>
              <Box sx={{ ...CELL, textAlign: 'right', color: 'text.secondary' }}>{o.id}</Box>
            </Box>
          );
        })}
      </Scrollbar>
    </Card>
  );
}
