import type { BrokerType, BrokerActivity } from '../data/mock';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { Scrollbar } from 'src/shared/ui/scrollbar';

import { fmtNumber, fmtCompact } from '../data/mock';

// ----------------------------------------------------------------------

type Side = 'buy' | 'sell';

type Props = {
  side: Side;
  rows: BrokerActivity[];
  totalVal: number;
  maxRows?: number;
};

const GRID = '28px 56px 1.2fr 1.4fr 1fr 56px';

const CELL = {
  px: 0.75,
  py: 0.45,
  fontFamily: 'monospace',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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

const TYPE_COLOR: Record<BrokerType, string> = {
  foreign: 'info.main',
  domestic: 'text.secondary',
  bumn: 'warning.main',
};

const TYPE_LABEL: Record<BrokerType, string> = {
  foreign: 'F',
  domestic: 'L',
  bumn: 'B',
};

export function BrokerTable({ side, rows, totalVal, maxRows = 20 }: Props) {
  const { t } = useTranslate('stock-activity');
  const isBuy = side === 'buy';
  const limited = rows.slice(0, maxRows);
  const accent = isBuy ? 'success.main' : 'error.main';
  const accentBg = isBuy ? 'success.lighter' : 'error.lighter';
  const icon = isBuy ? 'solar:wad-of-money-bold' : 'solar:archive-down-minimlistic-bold';
  const title = isBuy ? t('table.topBuyers') : t('table.topSellers');

  const subtotal = limited.reduce(
    (acc, r) => (isBuy ? acc + r.buyVal : acc + r.sellVal),
    0
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
          <Iconify icon={icon} width={14} sx={{ color: accent }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: accent }}
          >
            {title}
          </Typography>
          <Chip
            size="small"
            label={limited.length}
            sx={{ height: 18, fontSize: 10, fontWeight: 700, ml: 0.25 }}
          />
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
          {fmtCompact(subtotal)}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: GRID,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: (theme) => theme.palette.action.hover,
        }}
      >
        <Box sx={{ ...HEADER, textAlign: 'center' }}>#</Box>
        <Box sx={HEADER}>{t('table.code')}</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>{isBuy ? t('table.bLot') : t('table.sLot')}</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>{isBuy ? t('table.bVal') : t('table.sVal')}</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>{isBuy ? t('table.bAvg') : t('table.sAvg')}</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>%</Box>
      </Box>

      <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
        {limited.length === 0 && (
          <Box sx={{ px: 1, py: 4, color: 'text.disabled', fontSize: 12, textAlign: 'center' }}>
            {t('table.empty')}
          </Box>
        )}
        {limited.map((row, idx) => {
          const lot = isBuy ? row.buyLot : row.sellLot;
          const val = isBuy ? row.buyVal : row.sellVal;
          const avg = isBuy ? row.buyAvg : row.sellAvg;
          const pct = totalVal > 0 ? (val / totalVal) * 100 : 0;
          return (
            <Box
              key={row.broker}
              sx={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: GRID,
                alignItems: 'center',
                borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
                '&:hover': { bgcolor: (theme) => theme.palette.action.hover },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${Math.min(pct * 4, 100)}%`,
                  bgcolor: accentBg,
                  opacity: 0.35,
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'center',
                  color: 'text.disabled',
                  fontWeight: 700,
                  position: 'relative',
                }}
              >
                {idx + 1}
              </Box>
              <Stack
                direction="row"
                spacing={0.4}
                sx={{ ...CELL, alignItems: 'center', position: 'relative' }}
              >
                <Box
                  sx={{
                    px: 0.3,
                    borderRadius: 0.4,
                    fontSize: 9,
                    fontWeight: 800,
                    color: TYPE_COLOR[row.brokerType],
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    lineHeight: 1.4,
                  }}
                >
                  {TYPE_LABEL[row.brokerType]}
                </Box>
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: 12,
                    color: accent,
                  }}
                >
                  {row.broker}
                </Typography>
              </Stack>
              <Box sx={{ ...CELL, textAlign: 'right', position: 'relative' }}>
                {fmtNumber(lot)}
              </Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'right',
                  fontWeight: 700,
                  color: 'text.primary',
                  position: 'relative',
                }}
              >
                {fmtCompact(val)}
              </Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'right',
                  color: 'text.secondary',
                  position: 'relative',
                }}
              >
                {fmtNumber(avg)}
              </Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'right',
                  color: accent,
                  fontWeight: 700,
                  position: 'relative',
                }}
              >
                {pct.toFixed(1)}
              </Box>
            </Box>
          );
        })}
      </Scrollbar>
    </Card>
  );
}
