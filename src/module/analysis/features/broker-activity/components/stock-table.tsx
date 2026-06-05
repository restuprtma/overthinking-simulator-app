import type { StockActivity } from '../data/mock';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';
import { Scrollbar } from 'src/shared/ui/scrollbar';

import { fmtNumber, fmtCompact, fmtSignedCompact } from '../data/mock';

// ----------------------------------------------------------------------

type Side = 'buy' | 'sell';

type Props = {
  side: Side;
  rows: StockActivity[];
  maxRows?: number;
};

const GRID = '28px 1fr 0.9fr 1.1fr 0.9fr 1fr';

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

export function StockTable({ side, rows, maxRows = 20 }: Props) {
  const { t } = useTranslate('broker-activity');
  const isBuy = side === 'buy';
  const limited = rows.slice(0, maxRows);
  const accent = isBuy ? 'success.main' : 'error.main';
  const accentBg = isBuy ? 'success.lighter' : 'error.lighter';
  const icon = isBuy ? 'solar:wad-of-money-bold' : 'solar:archive-down-minimlistic-bold';
  const title = isBuy ? t('table.topBought') : t('table.topSold');

  const maxAbsNet = limited.reduce((m, r) => Math.max(m, Math.abs(r.netVal)), 0) || 1;

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
          {fmtCompact(limited.reduce((s, r) => s + Math.abs(r.netVal), 0))}
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
        <Box sx={HEADER}>{t('table.stock')}</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>{isBuy ? t('table.bLot') : t('table.sLot')}</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>{isBuy ? t('table.bVal') : t('table.sVal')}</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>{isBuy ? t('table.bAvg') : t('table.sAvg')}</Box>
        <Box sx={{ ...HEADER, textAlign: 'right' }}>{t('table.net')}</Box>
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
          const pct = (Math.abs(row.netVal) / maxAbsNet) * 100;
          return (
            <Box
              key={row.stock}
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
                  width: `${Math.min(pct, 100)}%`,
                  bgcolor: accentBg,
                  opacity: 0.3,
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
                spacing={0.5}
                sx={{ ...CELL, alignItems: 'baseline', position: 'relative', minWidth: 0 }}
              >
                <Typography
                  sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 12, color: accent }}
                >
                  {row.stock}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.disabled',
                    fontSize: 10,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.sector}
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
                  fontWeight: 800,
                  position: 'relative',
                }}
              >
                {fmtSignedCompact(row.netVal)}
              </Box>
            </Box>
          );
        })}
      </Scrollbar>
    </Card>
  );
}
