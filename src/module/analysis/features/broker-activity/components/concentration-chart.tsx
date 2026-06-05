import type { BrokerActivityEngine } from '../hooks/use-broker-activity';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { fmtCompact } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: BrokerActivityEngine;
  topN?: number;
};

export function ConcentrationChart({ engine, topN = 12 }: Props) {
  const { t } = useTranslate('broker-activity');
  const theme = useTheme();
  const { data } = engine;

  const ordered = useMemo(
    () =>
      [...data.stocks]
        .sort((a, b) => Math.abs(b.netVal) - Math.abs(a.netVal))
        .slice(0, topN)
        .sort((a, b) => b.netVal - a.netVal),
    [data.stocks, topN]
  );

  const labels = ordered.map((s) => s.stock);
  const values = ordered.map((s) => s.netVal);
  const colors = ordered.map((s) =>
    s.netVal >= 0 ? theme.palette.success.main : theme.palette.error.main
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
          borderBottom: (th) => `1px solid ${th.palette.divider}`,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <Iconify icon="solar:chart-square-outline" width={14} sx={{ color: 'primary.main' }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' }}
          >
            {t('chart.netFlow')}
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
          {t('chart.top', { n: topN })}
        </Typography>
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, p: 0.5 }}>
        {ordered.length === 0 ? (
          <Box sx={{ p: 4, color: 'text.disabled', fontSize: 12, textAlign: 'center' }}>
            {t('table.empty')}
          </Box>
        ) : (
          <BarChart
            yAxis={[{ scaleType: 'band', data: labels }]}
            xAxis={[{ valueFormatter: (v: number) => fmtCompact(v) }]}
            series={[
              {
                data: values,
                label: t('chart.netVal'),
                valueFormatter: (v) => (v == null ? '' : fmtCompact(v)),
              },
            ]}
            layout="horizontal"
            colors={colors}
            margin={{ left: 16, right: 12, top: 8, bottom: 28 }}
            slotProps={{ legend: { sx: { display: 'none' } } }}
            sx={{
              '& .MuiChartsAxis-tickLabel': { fontSize: 10, fontFamily: 'monospace' },
            }}
            grid={{ vertical: true }}
          />
        )}
      </Box>
    </Card>
  );
}
