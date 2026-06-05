import type { StockOption } from '../data/mock';
import type { PlaybackEngine } from '../hooks/use-playback-engine';

import { useRef, useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/shared/ui/iconify';
import { Scrollbar } from 'src/shared/ui/scrollbar';

import { fmtNumber, fmtCompact } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: PlaybackEngine;
  stockOptions?: StockOption[];
  onCodeChange?: (code: string) => void;
};

// 8 columns: Freq | +/- | Lot | Bid | Offer | Lot | +/- | Freq
const GRID =
  'minmax(0, 0.7fr) minmax(0, 0.6fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.6fr) minmax(0, 0.7fr)';

const CELL = {
  px: 0.5,
  py: 0.4,
  fontFamily: 'monospace',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center',
} as const;

const HEADER = {
  px: 0.5,
  py: 0.35,
  fontSize: 10.5,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  textAlign: 'center',
  color: 'text.secondary',
} as const;

const ROW_BORDERS = {
  '& > *': { borderRight: (t: any) => `1px solid ${t.palette.divider}` },
  '& > :last-child': { borderRight: 'none' },
} as const;

function formatDelta(d: number): string {
  if (d === 0) return '–';
  return d > 0 ? `+${fmtNumber(d)}` : fmtNumber(d);
}

export function OrderbookPanel({ engine, stockOptions, onCodeChange }: Props) {
  const { orderbook, summary, session } = engine;
  const up = summary.changeAbs >= 0;
  const arrow = up ? 'eva:arrow-upward-fill' : 'eva:arrow-downward-fill';
  const pickable = !!stockOptions && !!onCodeChange;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const filteredStocks = useMemo(() => {
    if (!stockOptions) return [];
    const q = search.trim().toUpperCase();
    if (!q) return stockOptions;
    return stockOptions.filter((o) => o.code.includes(q) || o.name.toUpperCase().includes(q));
  }, [stockOptions, search]);

  useEffect(() => {
    setActiveIndex(0);
  }, [search, pickerOpen]);

  useEffect(() => {
    if (!pickerOpen) return;
    itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, pickerOpen]);

  const openPicker = () => {
    setSearch('');
    setPickerOpen(true);
  };
  const closePicker = () => setPickerOpen(false);
  const pickStock = (code: string) => {
    onCodeChange?.(code);
    setPickerOpen(false);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredStocks.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filteredStocks.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filteredStocks.length) % filteredStocks.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const q = search.trim().toUpperCase();
      const exact = q ? filteredStocks.find((o) => o.code === q) : undefined;
      const target = exact ?? filteredStocks[activeIndex];
      if (target) pickStock(target.code);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePicker();
    }
  };

  const bidLotTotal = orderbook.bids.reduce((s, b) => s + b.lot, 0);
  const offerLotTotal = orderbook.offers.reduce((s, o) => s + o.lot, 0);
  const bidFreqTotal = orderbook.bids.reduce((s, b) => s + b.freq, 0);
  const offerFreqTotal = orderbook.offers.reduce((s, o) => s + o.freq, 0);
  const maxLot = Math.max(
    ...orderbook.bids.map((b) => b.lot),
    ...orderbook.offers.map((o) => o.lot)
  );

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
      {/* --- Header: code + last + change --- */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          alignItems: 'center',
        }}
      >
        {pickable ? (
          <>
            <ButtonBase
              ref={triggerRef}
              onClick={openPicker}
              focusRipple
              aria-label="Change stock"
              sx={{
                gap: 0.75,
                px: 0.5,
                py: 0.25,
                ml: -0.5,
                borderRadius: 0.75,
                display: 'inline-flex',
                alignItems: 'center',
                transition: (t) => t.transitions.create(['background-color']),
                '&:hover': { bgcolor: (t) => t.palette.action.hover },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.lighter',
                  color: 'primary.darker',
                  width: 28,
                  height: 28,
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {session.code.slice(0, 2)}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {session.code}
              </Typography>
              <Iconify
                icon="eva:chevron-down-fill"
                width={14}
                sx={{ color: 'text.disabled', ml: -0.25 }}
              />
            </ButtonBase>
            <Popover
              open={pickerOpen}
              anchorEl={triggerRef.current}
              onClose={closePicker}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              slotProps={{ paper: { sx: { mt: 0.5, width: 320 } } }}
              TransitionProps={{ onEntered: () => searchInputRef.current?.focus() }}
            >
              <Box sx={{ p: 1, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
                <TextField
                  size="small"
                  fullWidth
                  inputRef={searchInputRef}
                  placeholder="Search stock…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify
                            icon="eva:search-fill"
                            width={16}
                            sx={{ color: 'text.disabled' }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
              <Scrollbar sx={{ maxHeight: 280 }}>
                <MenuList dense sx={{ py: 0.5 }}>
                  {filteredStocks.length === 0 && (
                    <Box
                      sx={{ px: 2, py: 1.5, color: 'text.disabled', fontSize: 12, textAlign: 'center' }}
                    >
                      No matches.
                    </Box>
                  )}
                  {filteredStocks.map((opt, i) => {
                    const isCurrent = opt.code === session.code;
                    const isActive = i === activeIndex;
                    return (
                      <MenuItem
                        key={opt.code}
                        ref={(el) => {
                          itemRefs.current[i] = el;
                        }}
                        selected={isActive}
                        onClick={() => pickStock(opt.code)}
                        onMouseEnter={() => setActiveIndex(i)}
                        sx={{
                          ...(isCurrent && { fontWeight: 800 }),
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: 'baseline', minWidth: 0, flex: 1 }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 48 }}>
                            {opt.code}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {opt.name}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Scrollbar>
            </Popover>
          </>
        ) : (
          <>
            <Avatar
              sx={{
                bgcolor: 'primary.lighter',
                color: 'primary.darker',
                width: 28,
                height: 28,
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {session.code.slice(0, 2)}
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {session.code}
            </Typography>
          </>
        )}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            color: up ? 'success.main' : 'error.main',
            lineHeight: 1,
          }}
        >
          {fmtNumber(summary.last)}
        </Typography>
        <Stack
          direction="row"
          spacing={0.25}
          sx={{ alignItems: 'center', color: up ? 'success.main' : 'error.main' }}
        >
          <Iconify icon={arrow} width={12} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 11 }}
          >
            {fmtNumber(Math.abs(summary.changeAbs))} ({summary.changePct.toFixed(2)}%)
          </Typography>
        </Stack>
      </Stack>

      {/* --- Stats grid: 3 cols x 4 rows (Open/Prev/Lot, High/ARA/Val, Low/ARB/Avg, F Buy/F Sell/Freq) --- */}
      <Box
        sx={{
          px: 1,
          py: 0.5,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          rowGap: 0.25,
          columnGap: 1,
        }}
      >
        <StatPair label="Open" value={fmtNumber(summary.open)} tone="up" />
        <StatPair label="Prev" value={fmtNumber(session.prevClose)} tone="neutral" />
        <StatPair label="Lot" value={fmtCompact(summary.volumeLot)} tone="neutral" />

        <StatPair label="High" value={fmtNumber(summary.high)} tone="up" />
        <StatPair label="ARA" value={fmtNumber(session.ara)} tone="up" hasCaret />
        <StatPair label="Val" value={fmtCompact(summary.valueRp)} tone="neutral" />

        <StatPair label="Low" value={fmtNumber(summary.low)} tone="down" />
        <StatPair label="ARB" value={fmtNumber(session.arb)} tone="down" hasCaret />
        <StatPair label="Avg" value={fmtNumber(summary.avg, 0)} tone="neutral" />

        <StatPair label="F Buy" value={fmtCompact(summary.fBuyVal)} tone="up" />
        <StatPair label="F Sell" value={fmtCompact(summary.fSellVal)} tone="down" />
        <StatPair label="Freq" value={fmtCompact(summary.freq)} tone="neutral" />
      </Box>

      {/* --- Column header --- */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: GRID,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          ...ROW_BORDERS,
        }}
      >
        <Box sx={HEADER}>Freq</Box>
        <Box sx={HEADER}>+/−</Box>
        <Box sx={HEADER}>Lot</Box>
        <Box sx={HEADER}>Bid</Box>
        <Box sx={HEADER}>Offer</Box>
        <Box sx={HEADER}>Lot</Box>
        <Box sx={HEADER}>+/−</Box>
        <Box sx={HEADER}>Freq</Box>
      </Box>

      {/* --- Ladder --- */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {orderbook.bids.map((bid, i) => {
          const offer = orderbook.offers[i];
          const bidPct = (bid.lot / maxLot) * 100;
          const offerPct = (offer.lot / maxLot) * 100;
          const isBest = i === 0;
          return (
            <Box
              key={i}
              sx={{
                display: 'grid',
                gridTemplateColumns: GRID,
                alignItems: 'center',
                position: 'relative',
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
                bgcolor: isBest ? (t) => t.palette.action.hover : 'transparent',
                ...ROW_BORDERS,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: '50%',
                  width: `${bidPct * 0.5}%`,
                  bgcolor: 'success.main',
                  opacity: 0.08,
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '50%',
                  width: `${offerPct * 0.5}%`,
                  bgcolor: 'error.main',
                  opacity: 0.08,
                  pointerEvents: 'none',
                }}
              />

              <Box sx={{ ...CELL, color: 'text.secondary', position: 'relative' }}>
                {fmtNumber(bid.freq)}
              </Box>
              <Box
                sx={{
                  ...CELL,
                  position: 'relative',
                  color:
                    bid.delta > 0 ? 'success.main' : bid.delta < 0 ? 'error.main' : 'text.disabled',
                  fontSize: 11,
                }}
              >
                {formatDelta(bid.delta)}
              </Box>
              <Box sx={{ ...CELL, position: 'relative' }}>{fmtNumber(bid.lot)}</Box>
              <Box
                sx={{
                  ...CELL,
                  color: 'success.main',
                  fontWeight: isBest ? 800 : 700,
                  position: 'relative',
                }}
              >
                {fmtNumber(bid.price)}
              </Box>

              <Box
                sx={{
                  ...CELL,
                  color: 'error.main',
                  fontWeight: isBest ? 800 : 700,
                  position: 'relative',
                }}
              >
                {fmtNumber(offer.price)}
              </Box>
              <Box sx={{ ...CELL, position: 'relative' }}>{fmtNumber(offer.lot)}</Box>
              <Box
                sx={{
                  ...CELL,
                  position: 'relative',
                  color:
                    offer.delta > 0
                      ? 'success.main'
                      : offer.delta < 0
                        ? 'error.main'
                        : 'text.disabled',
                  fontSize: 11,
                }}
              >
                {formatDelta(offer.delta)}
              </Box>
              <Box sx={{ ...CELL, color: 'text.secondary', position: 'relative' }}>
                {fmtNumber(offer.freq)}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* --- Footer total --- */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: GRID,
          borderTop: (t) => `2px solid ${t.palette.divider}`,
          bgcolor: (t) => t.palette.action.selected,
          ...ROW_BORDERS,
        }}
      >
        <Box sx={{ ...CELL, fontWeight: 800 }}>{fmtNumber(bidFreqTotal)}</Box>
        <Box sx={{ ...CELL, color: 'text.disabled' }}>·</Box>
        <Box sx={{ ...CELL, fontWeight: 800 }}>{fmtNumber(bidLotTotal)}</Box>
        <Box
          sx={{
            ...CELL,
            gridColumn: '4 / span 2',
            fontWeight: 800,
            letterSpacing: 0.5,
            color: 'text.secondary',
          }}
        >
          TOTAL
        </Box>
        <Box sx={{ ...CELL, fontWeight: 800 }}>{fmtNumber(offerLotTotal)}</Box>
        <Box sx={{ ...CELL, color: 'text.disabled' }}>·</Box>
        <Box sx={{ ...CELL, fontWeight: 800 }}>{fmtNumber(offerFreqTotal)}</Box>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type Tone = 'up' | 'down' | 'neutral';

function StatPair({
  label,
  value,
  tone = 'neutral',
  hasCaret = false,
}: {
  label: string;
  value: string;
  tone?: Tone;
  hasCaret?: boolean;
}) {
  const color = tone === 'up' ? 'success.main' : tone === 'down' ? 'error.main' : 'text.primary';
  return (
    <Stack
      direction="row"
      sx={{ justifyContent: 'space-between', alignItems: 'baseline', minWidth: 0, gap: 0.5 }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11.5 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center', minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color,
            fontWeight: 700,
            fontSize: 12,
            fontFamily: 'monospace',
            fontVariantNumeric: 'tabular-nums',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </Typography>
        {hasCaret && (
          <Iconify icon="eva:chevron-down-fill" width={12} sx={{ color: 'text.disabled' }} />
        )}
      </Stack>
    </Stack>
  );
}
