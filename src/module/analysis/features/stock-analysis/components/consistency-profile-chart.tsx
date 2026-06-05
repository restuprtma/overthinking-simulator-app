import type { ConsistencyPoint } from '../data/mock';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

import { fmtCompactRp } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  data: ConsistencyPoint[];
  subtitle?: string;
};

export function ConsistencyProfileChart({ data, subtitle }: Props) {
  const theme = useTheme();

  const xLabels = useMemo(() => data.map((p) => p.date), [data]);
  const netFlowSeries = useMemo(() => data.map((p) => p.netFlow), [data]);
  const cumulativeSeries = useMemo(() => data.map((p) => p.cumulative), [data]);
  const barColors = useMemo(
    () =>
      data.map((p) =>
        p.netFlow >= 0 ? theme.palette.success.main : theme.palette.error.main
      ),
    [data, theme]
  );

  const formatDateLabel = (d: string) => {
    const dt = new Date(`${d}T00:00:00Z`);
    return dt.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });
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
      <Stack
        direction="row"
        sx={{
          px: 1.5,
          pt: 1,
          pb: 0.5,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Stack spacing={0.25}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Consistency Profile
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', fontSize: 11 }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{ width: 18, height: 2, bgcolor: 'warning.main', borderRadius: 1 }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Cumulative Net
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 10, height: 10, bgcolor: 'text.primary', borderRadius: 0.25 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Net Flow
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <BarChart
          xAxis={[
            {
              scaleType: 'band',
              data: xLabels,
              valueFormatter: formatDateLabel,
              tickLabelStyle: { fontSize: 10, fill: theme.palette.text.secondary },
            },
          ]}
          yAxis={[
            {
              valueFormatter: (v: number) => fmtCompactRp(v),
              tickLabelStyle: { fontSize: 10, fill: theme.palette.text.secondary },
            },
          ]}
          series={[
            {
              data: netFlowSeries,
              label: 'Net Flow',
              valueFormatter: (v) => (v == null ? '-' : fmtCompactRp(v)),
            },
          ]}
          colors={barColors}
          margin={{ left: 56, right: 16, top: 12, bottom: 32 }}
          grid={{ horizontal: true }}
          slotProps={{ legend: { sx: { display: 'none' } } }}
          sx={{
            width: '100%',
            height: '100%',
            '& .MuiChartsAxis-tickLabel': { fontFamily: 'monospace' },
          }}
        />

        {/* Overlay line chart for cumulative net, transparent bg so bars show through */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            '& svg': { background: 'transparent' },
            '& .MuiChartsAxis-root': { display: 'none' },
            '& .MuiChartsGrid-root': { display: 'none' },
          }}
        >
          <LineChart
            xAxis={[
              {
                scaleType: 'band',
                data: xLabels,
                tickLabelStyle: { fontSize: 0, opacity: 0 },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fontSize: 0, opacity: 0 },
              },
            ]}
            series={[
              {
                data: cumulativeSeries,
                color: theme.palette.warning.main,
                showMark: true,
                valueFormatter: (v) => (v == null ? '-' : fmtCompactRp(v)),
                label: 'Cumulative Net',
              },
            ]}
            margin={{ left: 56, right: 16, top: 12, bottom: 32 }}
            slotProps={{ legend: { sx: { display: 'none' } } }}
            sx={{
              width: '100%',
              height: '100%',
              '& .MuiLineElement-root': { strokeWidth: 1.8 },
              '& .MuiMarkElement-root': { stroke: theme.palette.warning.main, fill: theme.palette.background.paper },
            }}
          />
        </Box>
      </Box>
    </Card>
  );
}
