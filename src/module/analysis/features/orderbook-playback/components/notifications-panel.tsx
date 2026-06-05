import type { IconifyProps } from 'src/shared/ui/iconify';
import type { PlaybackEngine } from '../hooks/use-playback-engine';
import type { Alert, AlertType, AlertSeverity } from '../data/mock';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/ui/iconify';
import { Scrollbar } from 'src/shared/ui/scrollbar';

import { fmtHms } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: PlaybackEngine;
};

const ICONS: Record<AlertType, IconifyProps['icon']> = {
  'big-lift-offer': 'eva:trending-up-fill',
  'big-hit-bid': 'eva:trending-down-fill',
  'split-order': 'solar:box-minimalistic-bold',
  'smart-money-distribution': 'solar:archive-down-minimlistic-bold',
  'smart-money-accumulation': 'solar:wad-of-money-bold',
  iceberg: 'solar:eye-closed-bold',
  spoofing: 'solar:danger-triangle-bold',
  'volume-spike': 'solar:double-alt-arrow-up-bold-duotone',
};

const SEVERITY_COLOR: Record<AlertSeverity, 'info' | 'warning' | 'error'> = {
  info: 'info',
  warning: 'warning',
  critical: 'error',
};

const FILTERS: { value: 'all' | AlertSeverity; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
];

export function NotificationsPanel({ engine }: Props) {
  const { visibleAlerts } = engine;
  const [filter, setFilter] = useState<'all' | AlertSeverity>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? visibleAlerts : visibleAlerts.filter((a) => a.severity === filter)),
    [visibleAlerts, filter]
  );

  const counts = useMemo(() => {
    const c = { critical: 0, warning: 0, info: 0 };
    for (const a of visibleAlerts) c[a.severity] += 1;
    return c;
  }, [visibleAlerts]);

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
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <Iconify icon="solar:bell-bing-bold" width={14} sx={{ color: 'warning.main' }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' }}
          >
            Alerts
          </Typography>
          <Chip
            size="small"
            label={visibleAlerts.length}
            sx={{ height: 18, fontSize: 10, fontWeight: 700, ml: 0.5 }}
          />
        </Stack>
        <Stack direction="row" spacing={0.4}>
          <Counter label="C" value={counts.critical} color="error.main" />
          <Counter label="W" value={counts.warning} color="warning.main" />
          <Counter label="I" value={counts.info} color="info.main" />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ px: 1, py: 0.5, borderBottom: (t) => `1px solid ${t.palette.divider}` }}
      >
        {FILTERS.map((f) => (
          <Chip
            key={f.value}
            size="small"
            label={f.label}
            variant={filter === f.value ? 'filled' : 'outlined'}
            color={
              filter === f.value && f.value !== 'all'
                ? SEVERITY_COLOR[f.value as AlertSeverity]
                : 'default'
            }
            onClick={() => setFilter(f.value)}
            sx={{ height: 20, fontSize: 11, cursor: 'pointer' }}
          />
        ))}
      </Stack>

      <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
        {filtered.length === 0 && (
          <Box sx={{ px: 1.5, py: 4, color: 'text.disabled', fontSize: 12, textAlign: 'center' }}>
            No alerts yet.
          </Box>
        )}
        {filtered.map((a) => (
          <AlertRow key={a.id} alert={a} />
        ))}
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

function Counter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Stack
      direction="row"
      spacing={0.25}
      sx={{
        px: 0.5,
        py: 0.1,
        borderRadius: 0.75,
        bgcolor: (t) => t.palette.action.hover,
        alignItems: 'center',
        fontSize: 10,
        fontFamily: 'monospace',
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
      <Typography variant="caption" sx={{ fontWeight: 700, color, lineHeight: 1 }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1 }}>
        {value}
      </Typography>
    </Stack>
  );
}

function AlertRow({ alert }: { alert: Alert }) {
  const sev = SEVERITY_COLOR[alert.severity];
  const stripeColor =
    sev === 'error' ? 'error.main' : sev === 'warning' ? 'warning.main' : 'info.main';

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{
        px: 1,
        py: 0.6,
        position: 'relative',
        borderBottom: (t) => `1px dashed ${t.palette.divider}`,
        '&:hover': { bgcolor: (t) => t.palette.action.hover },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          bgcolor: stripeColor,
          opacity: 0.7,
        }}
      />
      <Box sx={{ pt: 0.2, pl: 0.4 }}>
        <Iconify icon={ICONS[alert.type]} width={14} sx={{ color: stripeColor }} />
      </Box>
      <Stack sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'baseline' }}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              color: 'text.disabled',
              fontSize: 10,
              lineHeight: 1.4,
            }}
          >
            {fmtHms(alert.time)}
          </Typography>
          {alert.broker && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                px: 0.35,
                py: 0,
                borderRadius: 0.5,
                bgcolor: (t) => t.palette.action.selected,
                fontSize: 10,
                lineHeight: 1.4,
              }}
            >
              {alert.broker}
            </Typography>
          )}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: 11.5,
              lineHeight: 1.3,
              color: stripeColor,
            }}
          >
            {alert.title}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: 11,
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {alert.detail}
        </Typography>
      </Stack>
    </Stack>
  );
}
