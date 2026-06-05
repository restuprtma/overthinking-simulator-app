import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useTranslate } from 'src/locales';

import { StockDateCard } from '../components/stock-date-card';
import { OrderbookPanel } from '../components/orderbook-panel';
import { PlaybackToolbar } from '../components/playback-toolbar';
import { usePlaybackEngine } from '../hooks/use-playback-engine';
import { PriceChartPanel } from '../components/price-chart-panel';
import { RunningTradePanel } from '../components/running-trade-panel';
import { NotificationsPanel } from '../components/notifications-panel';

// ----------------------------------------------------------------------

const DEFAULT_CODE = 'BUVA';
const DEFAULT_DATE = '2026-05-19';

export function OrderbookPlaybackView() {
  const { t } = useTranslate('orderbook-playback');
  const engine = usePlaybackEngine(DEFAULT_CODE, DEFAULT_DATE);

  return (
    <Box
      sx={{
        p: 1.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: {
          xs: 'calc(100dvh)',
          lg: 'calc(100dvh)',
        },
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
          <Box sx={{ fontWeight: 800, fontSize: 18 }}>{t('title')}</Box>
          <Box sx={{ color: 'text.secondary', fontSize: 12 }}>{t('subtitle')}</Box>
        </Stack>
      </Stack>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gap: 1,
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
            lg: 'minmax(380px, 1.1fr) minmax(320px, 1fr) minmax(0, 1.6fr)',
          },
          gridTemplateRows: {
            xs: 'auto auto auto auto auto',
            md: 'auto minmax(280px, 1.4fr) minmax(220px, 1fr)',
            lg: 'auto 1fr',
          },
        }}
      >
        {/* Row 1, Col 1: Stock + Date */}
        <Box
          sx={{
            gridColumn: { xs: '1', md: '1', lg: '1' },
            gridRow: { xs: 'auto', md: '1', lg: '1' },
          }}
        >
          <StockDateCard engine={engine} />
        </Box>

        {/* Row 1, Cols 2-3: Playback toolbar (same row height as Stock+Date) */}
        <Box
          sx={{
            gridColumn: { xs: '1', md: '2', lg: '2 / span 2' },
            gridRow: { xs: 'auto', md: '1', lg: '1' },
          }}
        >
          <PlaybackToolbar engine={engine} />
        </Box>

        {/* Row 2, Col 1: Orderbook on top, Alerts below */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            minHeight: 0,
            gridColumn: { xs: '1', md: '1 / span 2', lg: '1' },
            gridRow: { xs: 'auto', md: '2', lg: '2' },
          }}
        >
          <Box sx={{ flex: 1.4, minHeight: 240 }}>
            <OrderbookPanel engine={engine} />
          </Box>
          <Box sx={{ flex: 1, minHeight: 180 }}>
            <NotificationsPanel engine={engine} />
          </Box>
        </Box>

        {/* Row 2, col 2: Running trade */}
        <Box
          sx={{
            minHeight: { xs: 240, lg: 0 },
            gridColumn: { xs: '1', md: '1 / span 2', lg: '2' },
            gridRow: { xs: 'auto', md: '3', lg: '2' },
          }}
        >
          <RunningTradePanel engine={engine} />
        </Box>

        {/* Row 2, col 3: Chart */}
        <Box
          sx={{
            minHeight: { xs: 320, lg: 0 },
            gridColumn: { xs: '1', md: '1 / span 2', lg: '3' },
            gridRow: { xs: 'auto', md: '4', lg: '2' },
          }}
        >
          <PriceChartPanel engine={engine} />
        </Box>
      </Box>
    </Box>
  );
}
