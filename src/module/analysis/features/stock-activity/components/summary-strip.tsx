import type { StockActivityEngine } from '../hooks/use-stock-activity';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { fmtNumber, fmtCompact, fmtSignedCompact } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: StockActivityEngine;
};

export function SummaryStrip({ engine }: Props) {
  const { t } = useTranslate('stock-activity');
  const { data } = engine;
  const up = data.changeAbs >= 0;
  const arrow = up ? 'eva:arrow-upward-fill' : 'eva:arrow-downward-fill';

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        py: 1.5,
        px: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        height: '100%',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 200 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.lighter',
            color: 'primary.darker',
            width: 36,
            height: 36,
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {data.stock.code.slice(0, 2)}
        </Avatar>
        <Stack sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {data.stock.code}
            </Typography>
            <Chip
              size="small"
              label={data.stock.sector}
              variant="outlined"
              sx={{ height: 18, fontSize: 10 }}
            />
          </Stack>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: 11,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 200,
            }}
          >
            {data.stock.name}
          </Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))',
          gap: 1.5,
          flex: 1,
        }}
      >
        <Stat label={t('summary.last')}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontWeight: 800,
                fontSize: 16,
                fontVariantNumeric: 'tabular-nums',
                color: up ? 'success.main' : 'error.main',
                lineHeight: 1,
              }}
            >
              {fmtNumber(data.last)}
            </Typography>
            <Stack
              direction="row"
              spacing={0.1}
              sx={{ color: up ? 'success.main' : 'error.main', alignItems: 'center' }}
            >
              <Iconify icon={arrow} width={11} />
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 10.5 }}>
                {data.changePct.toFixed(2)}%
              </Typography>
            </Stack>
          </Stack>
        </Stat>
        <Stat label={t('summary.open')} value={fmtNumber(data.open)} />
        <Stat label={t('summary.high')} value={fmtNumber(data.high)} tone="up" />
        <Stat label={t('summary.low')} value={fmtNumber(data.low)} tone="down" />
        <Stat label={t('summary.prev')} value={fmtNumber(data.prevClose)} />
        <Stat label={t('summary.volume')} value={`${fmtCompact(data.totalLot)} lot`} />
        <Stat label={t('summary.value')} value={fmtCompact(data.totalVal)} />
        <Stat label={t('summary.freq')} value={fmtCompact(data.freq)} />
        <Stat
          label={t('summary.foreignNet')}
          value={fmtSignedCompact(data.foreignNet)}
          tone={data.foreignNet >= 0 ? 'up' : 'down'}
        />
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type StatProps = {
  label: string;
  value?: string;
  tone?: 'up' | 'down' | 'neutral';
  children?: React.ReactNode;
};

function Stat({ label, value, tone = 'neutral', children }: StatProps) {
  const color =
    tone === 'up' ? 'success.main' : tone === 'down' ? 'error.main' : 'text.primary';
  return (
    <Stack spacing={0.2} sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.4 }}
      >
        {label}
      </Typography>
      {children ?? (
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 13,
            fontVariantNumeric: 'tabular-nums',
            color,
            lineHeight: 1.1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </Typography>
      )}
    </Stack>
  );
}
