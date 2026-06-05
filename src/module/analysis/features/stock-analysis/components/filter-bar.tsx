import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/ui/iconify';

import { fmtFullDate } from '../data/mock';

// ----------------------------------------------------------------------

export type PeriodKey = '1W' | '1M' | '3M' | '6M' | 'YTD';
export type ScopeKey = 'all' | 'foreign' | 'domestic';
export type UnitKey = 'value' | 'lot';
export type SortKey = 'abs-net-high' | 'abs-net-low' | 'net-buy' | 'net-sell';

const PERIODS: PeriodKey[] = ['1W', '1M', '3M', '6M', 'YTD'];

type Props = {
  startDate: string;
  endDate: string;
  period: PeriodKey;
  onPeriodChange: (p: PeriodKey) => void;
  scope: ScopeKey;
  onScopeChange: (s: ScopeKey) => void;
  unit: UnitKey;
  onUnitChange: (u: UnitKey) => void;
  sortKey: SortKey;
  onSortChange: (s: SortKey) => void;
  netFlow: number;
  vwap: number;
  turnover: number;
  rangeDays: number;
};

// ----------------------------------------------------------------------

function Pill({
  active,
  onClick,
  children,
  tone = 'default',
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  tone?: 'default' | 'warning';
}) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      sx={{
        px: 1.25,
        py: 0.45,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        borderRadius: 99,
        cursor: 'pointer',
        userSelect: 'none',
        border: (t) =>
          `1px solid ${
            active
              ? tone === 'warning'
                ? t.palette.warning.main
                : t.palette.primary.main
              : t.palette.divider
          }`,
        color: active
          ? tone === 'warning'
            ? 'warning.main'
            : 'primary.main'
          : 'text.secondary',
        bgcolor: (t) =>
          active
            ? tone === 'warning'
              ? `${t.palette.warning.main}14`
              : `${t.palette.primary.main}10`
            : 'transparent',
        transition: (t) =>
          t.transitions.create(['color', 'background-color', 'border-color']),
        '&:hover': { color: 'text.primary' },
      }}
    >
      {children}
    </Box>
  );
}

function Stat({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Stack spacing={0.25} sx={{ alignItems: 'flex-end' }}>
      <Typography
        variant="caption"
        sx={{ color: 'text.disabled', letterSpacing: 0.4, textTransform: 'uppercase', fontSize: 10 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 800,
          color: valueColor ?? 'text.primary',
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function FilterBar({
  startDate,
  endDate,
  period,
  onPeriodChange,
  scope,
  onScopeChange,
  unit,
  onUnitChange,
  sortKey,
  onSortChange,
  netFlow,
  vwap,
  turnover,
  rangeDays,
}: Props) {
  return (
    <Stack spacing={0.75} sx={{ px: 1, py: 0.75 }}>
      {/* Row 1: date range + period chips + summary metrics */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.75 }}
      >
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: 1,
            border: (t) => `1px solid ${t.palette.divider}`,
            alignItems: 'center',
          }}
        >
          <Iconify icon="solar:calendar-date-bold" width={14} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
            {fmtFullDate(startDate)} – {fmtFullDate(endDate)}
          </Typography>
        </Stack>

        <Pill tone="warning" active>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Iconify icon="solar:double-alt-arrow-up-bold-duotone" width={12} />
            <Box component="span">Smart Select</Box>
          </Stack>
        </Pill>

        <Stack direction="row" spacing={0.5}>
          {PERIODS.map((p) => (
            <Pill key={p} active={p === period} onClick={() => onPeriodChange(p)}>
              {p}
            </Pill>
          ))}
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={3}>
          <Stat
            label={`Net Flow (${rangeDays}D)`}
            value={fmtIDR(netFlow)}
            valueColor={netFlow >= 0 ? 'success.main' : 'error.main'}
          />
          <Stat label="Period VWAP" value={fmtIDR(vwap, true)} />
          <Stat label="Turnover" value={fmtCompactIDR(turnover)} />
        </Stack>
      </Stack>

      {/* Row 2: scope + unit toggles + sort dropdown */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 0.75 }}
      >
        <Stack direction="row" spacing={0.5}>
          <Pill tone="warning" active={scope === 'all'} onClick={() => onScopeChange('all')}>
            All
          </Pill>
          <Pill active={scope === 'foreign'} onClick={() => onScopeChange('foreign')}>
            Foreign
          </Pill>
          <Pill active={scope === 'domestic'} onClick={() => onScopeChange('domestic')}>
            Domestic
          </Pill>
        </Stack>

        <Box sx={{ width: 12 }} />

        <Stack direction="row" spacing={0.5}>
          <Pill tone="warning" active={unit === 'value'} onClick={() => onUnitChange('value')}>
            Value
          </Pill>
          <Pill active={unit === 'lot'} onClick={() => onUnitChange('lot')}>
            Lot
          </Pill>
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Select
          size="small"
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          sx={{ minWidth: 200, fontSize: 12 }}
        >
          <MenuItem value="abs-net-high">Abs Net Value (High-Low)</MenuItem>
          <MenuItem value="abs-net-low">Abs Net Value (Low-High)</MenuItem>
          <MenuItem value="net-buy">Net Buy (High-Low)</MenuItem>
          <MenuItem value="net-sell">Net Sell (High-Low)</MenuItem>
        </Select>
      </Stack>
    </Stack>
  );
}

function fmtIDR(n: number, includeFullPrice = false): string {
  if (includeFullPrice) return `Rp ${Math.round(n).toLocaleString('id-ID')}`;
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`;
}

function fmtCompactIDR(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}
