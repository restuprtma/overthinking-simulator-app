import type { BrokerType, BrokerStyle } from '../data/mock';
import type { IconifyName } from 'src/shared/ui/iconify/register-icons';
import type { BrokerActivityEngine } from '../hooks/use-broker-activity';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { fmtCompact, fmtSignedCompact } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: BrokerActivityEngine;
};

const TYPE_COLOR: Record<BrokerType, string> = {
  foreign: 'info.main',
  domestic: 'text.secondary',
  bumn: 'warning.main',
};

const STYLE_ICON: Record<BrokerStyle, IconifyName> = {
  accumulator: 'solar:wad-of-money-bold',
  distributor: 'solar:archive-down-minimlistic-bold',
  rotator: 'solar:transfer-horizontal-bold-duotone',
  scalper: 'eva:activity-fill',
};

const STYLE_COLOR: Record<BrokerStyle, string> = {
  accumulator: 'success.main',
  distributor: 'error.main',
  rotator: 'info.main',
  scalper: 'warning.main',
};

export function SummaryStrip({ engine }: Props) {
  const { t } = useTranslate('broker-activity');
  const { data } = engine;
  const netUp = data.netVal >= 0;
  const styleColor = STYLE_COLOR[data.style];

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
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 220 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.lighter',
            color: 'primary.darker',
            width: 36,
            height: 36,
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          {data.broker.code}
        </Avatar>
        <Stack sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {data.broker.code}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: 10,
                textTransform: 'uppercase',
                color: TYPE_COLOR[data.broker.type],
              }}
            >
              {t(`type.${data.broker.type}`)}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: 11,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 220,
            }}
          >
            {data.broker.name}
          </Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(108px, 1fr))',
          gap: 1.5,
          flex: 1,
        }}
      >
        <Stat label={t('summary.totalVal')} value={fmtCompact(data.totalVal)} />
        <Stat label={t('summary.buyVal')} value={fmtCompact(data.totalBuyVal)} tone="up" />
        <Stat label={t('summary.sellVal')} value={fmtCompact(data.totalSellVal)} tone="down" />
        <Stat
          label={t('summary.netVal')}
          value={fmtSignedCompact(data.netVal)}
          tone={netUp ? 'up' : 'down'}
        />
        <Stat label={t('summary.bsRatio')} value={isFinite(data.bsRatio) ? data.bsRatio.toFixed(2) : '∞'} />
        <Stat
          label={t('summary.stocks')}
          value={`${data.stocksTouched}`}
        />
        <Stat
          label={t('summary.concentration')}
          value={`${data.topConcentrationPct.toFixed(1)}%`}
        />
        <Stack spacing={0.2} sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: 10.5,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
            }}
          >
            {t('summary.style')}
          </Typography>
          <Chip
            size="small"
            label={t(`style.${data.style}`)}
            icon={<Iconify icon={STYLE_ICON[data.style]} width={12} />}
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 700,
              color: styleColor,
              bgcolor: 'action.hover',
              '& .MuiChip-icon': { color: styleColor, ml: 0.5 },
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type StatProps = {
  label: string;
  value: string;
  tone?: 'up' | 'down' | 'neutral';
};

function Stat({ label, value, tone = 'neutral' }: StatProps) {
  const color =
    tone === 'up' ? 'success.main' : tone === 'down' ? 'error.main' : 'text.primary';
  return (
    <Stack spacing={0.2} sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: 10.5,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        {label}
      </Typography>
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
    </Stack>
  );
}
