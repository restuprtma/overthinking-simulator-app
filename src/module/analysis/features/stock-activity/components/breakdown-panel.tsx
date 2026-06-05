import type { StockActivityEngine } from '../hooks/use-stock-activity';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useTranslate } from 'src/locales';
import { Iconify } from 'src/shared/ui/iconify';

import { fmtCompact, fmtSignedCompact } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  engine: StockActivityEngine;
};

export function BreakdownPanel({ engine }: Props) {
  const { t } = useTranslate('stock-activity');
  const { data } = engine;

  const grouped = useMemo(() => {
    const totals = { foreign: 0, domestic: 0, bumn: 0 };
    const buys = { foreign: 0, domestic: 0, bumn: 0 };
    const sells = { foreign: 0, domestic: 0, bumn: 0 };
    for (const b of data.brokers) {
      totals[b.brokerType] += b.totalVal;
      buys[b.brokerType] += b.buyVal;
      sells[b.brokerType] += b.sellVal;
    }
    const grand = totals.foreign + totals.domestic + totals.bumn;
    return { totals, buys, sells, grand };
  }, [data.brokers]);

  const isDistribution = data.foreignNet < 0;
  const verdict = isDistribution ? t('action.distribution') : t('action.accumulation');

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
          <Iconify
            icon={isDistribution ? 'solar:archive-down-minimlistic-bold' : 'solar:wad-of-money-bold'}
            width={14}
            sx={{ color: isDistribution ? 'error.main' : 'success.main' }}
          />
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' }}
          >
            {t('breakdown.title')}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: isDistribution ? 'error.main' : 'success.main',
          }}
        >
          {verdict}
        </Typography>
      </Stack>

      <Box sx={{ p: 1.5, flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Stack spacing={1.25}>
          <Row
            label={t('breakdown.foreign')}
            buy={grouped.buys.foreign}
            sell={grouped.sells.foreign}
            net={data.foreignNet}
            total={grouped.grand}
            tone="info"
          />
          <Row
            label={t('breakdown.domestic')}
            buy={grouped.buys.domestic}
            sell={grouped.sells.domestic}
            net={data.domesticNet}
            total={grouped.grand}
            tone="neutral"
          />
          <Row
            label={t('breakdown.bumn')}
            buy={grouped.buys.bumn}
            sell={grouped.sells.bumn}
            net={data.bumnNet}
            total={grouped.grand}
            tone="warning"
          />
        </Stack>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

function Row({
  label,
  buy,
  sell,
  net,
  total,
  tone,
}: {
  label: string;
  buy: number;
  sell: number;
  net: number;
  total: number;
  tone: 'info' | 'neutral' | 'warning';
}) {
  const share = total > 0 ? ((buy + sell) / total) * 100 : 0;
  const netUp = net >= 0;
  const accent = tone === 'info' ? 'info.main' : tone === 'warning' ? 'warning.main' : 'text.primary';
  return (
    <Stack spacing={0.4}>
      <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'baseline' }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: accent }} />
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11.5 }}>
            {label}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', fontFamily: 'monospace', fontSize: 10.5 }}
          >
            {share.toFixed(1)}%
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontWeight: 800,
            fontSize: 12,
            color: netUp ? 'success.main' : 'error.main',
          }}
        >
          {fmtSignedCompact(net)}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={Math.min(share, 100)}
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': { bgcolor: accent },
        }}
      />
      <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 0.1 }}>
        <Typography
          variant="caption"
          sx={{ color: 'success.main', fontFamily: 'monospace', fontSize: 10 }}
        >
          B {fmtCompact(buy)}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'error.main', fontFamily: 'monospace', fontSize: 10 }}
        >
          S {fmtCompact(sell)}
        </Typography>
      </Stack>
    </Stack>
  );
}
