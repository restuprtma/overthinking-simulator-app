import type { CostBasisPoint } from '../data/mock';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';

import { Iconify } from 'src/shared/ui/iconify';

import { fmtRpFull } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  data: CostBasisPoint[];
  anchorDate: string; // ISO
  subtitle?: string;
};

export function CostBasisChart({ data, anchorDate, subtitle }: Props) {
  const theme = useTheme();

  const xData = useMemo(
    () => data.map((p) => new Date(`${p.date}T00:00:00Z`)),
    [data]
  );
  const priceSeries = useMemo(() => data.map((p) => p.price), [data]);
  const vwapSeries = useMemo(() => data.map((p) => p.vwap), [data]);

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
          pt: 1,
          pb: 0.5,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Stack spacing={0.25}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              Cost Basis
            </Typography>
            <Iconify icon="solar:info-circle-bold" width={14} sx={{ color: 'text.disabled' }} />
          </Stack>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Stack>
        <Chip
          size="small"
          label={`Anchor: ${formatChipDate(anchorDate)}`}
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            color: 'warning.main',
            bgcolor: (t) => `${t.palette.warning.main}14`,
            border: (t) => `1px solid ${t.palette.warning.main}66`,
            height: 22,
          }}
        />
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <LineChart
          margin={{ left: 56, right: 16, top: 12, bottom: 32 }}
          height={undefined}
          xAxis={[
            {
              data: xData,
              scaleType: 'time',
              valueFormatter: (d: Date) =>
                d.toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'UTC',
                }),
              tickLabelStyle: { fontSize: 10, fill: theme.palette.text.secondary },
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: { fontSize: 10, fill: theme.palette.text.secondary },
            },
          ]}
          series={[
            {
              data: priceSeries,
              label: 'Price',
              color: theme.palette.text.primary,
              showMark: true,
              valueFormatter: (v) => (v == null ? '-' : fmtRpFull(v)),
              area: true,
            },
            {
              data: vwapSeries,
              label: 'VWAP',
              color: theme.palette.warning.main,
              showMark: false,
              valueFormatter: (v) => (v == null ? '-' : fmtRpFull(v)),
              curve: 'stepBefore',
            },
          ]}
          sx={{
            width: '100%',
            height: '100%',
            '.MuiLineElement-series-vwap': { strokeDasharray: '4 4' },
            '& .MuiAreaElement-series-price': {
              fill: `${theme.palette.warning.main}22`,
            },
            '& .MuiLineElement-root': { strokeWidth: 1.5 },
          }}
          slotProps={{
            legend: {
              direction: 'horizontal',
              position: { vertical: 'bottom', horizontal: 'center' },
              sx: { fontSize: 11 },
            },
          }}
          grid={{ horizontal: true }}
        />
      </Box>
    </Card>
  );
}

function formatChipDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}
