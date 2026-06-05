import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useTranslate } from 'src/locales';
import { STOCK_OPTIONS } from 'src/module/analysis/features/orderbook-playback/data/mock';
import { OrderbookPanel } from 'src/module/analysis/features/orderbook-playback/components/orderbook-panel';
import { PriceChartPanel } from 'src/module/analysis/features/orderbook-playback/components/price-chart-panel';
import { RunningTradePanel } from 'src/module/analysis/features/orderbook-playback/components/running-trade-panel';
import { NotificationsPanel } from 'src/module/analysis/features/orderbook-playback/components/notifications-panel';

import { VerticalSplit } from '../components/vertical-split';
import { OrderQueuePanel } from '../components/order-queue-panel';
import { useOrderbookEngine } from '../hooks/use-orderbook-engine';
import { TimeBuySellPanel } from '../components/time-buysell-panel';

// ----------------------------------------------------------------------

const DEFAULT_CODE = 'BUVA';

export function OrderbookView() {
  const { t } = useTranslate('orderbook');
  const engine = useOrderbookEngine(DEFAULT_CODE);

  return (
    <Box
      sx={{
        p: 1.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: { xs: 'calc(100dvh)', lg: 'calc(100dvh)' },
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
            xs: 'auto auto auto auto',
            md: 'minmax(280px, 1.4fr) minmax(220px, 1fr)',
            lg: '1fr',
          },
        }}
      >
        {/* Col 1: Orderbook (top) + Alerts (bottom), user-resizable */}
        <Box
          sx={{
            minHeight: { xs: 560, lg: 0 },
            gridColumn: { xs: '1', md: '1 / span 2', lg: '1' },
            gridRow: { xs: 'auto', md: '1', lg: '1' },
          }}
        >
          <VerticalSplit
            storageKey="orderbook-view:col1-split"
            initialRatio={0.6}
            top={
              <OrderbookPanel
                engine={engine}
                stockOptions={STOCK_OPTIONS}
                onCodeChange={engine.setCode}
              />
            }
            bottom={<NotificationsPanel engine={engine} />}
          />
        </Box>

        {/* Col 2: Running trade (top) + Time buy/sell (bottom), user-resizable */}
        <Box
          sx={{
            minHeight: { xs: 560, lg: 0 },
            gridColumn: { xs: '1', md: '1 / span 2', lg: '2' },
            gridRow: { xs: 'auto', md: '2', lg: '1' },
          }}
        >
          <VerticalSplit
            storageKey="orderbook-view:col2-split"
            initialRatio={0.4}
            top={<RunningTradePanel engine={engine} empty />}
            bottom={<TimeBuySellPanel engine={engine} />}
          />
        </Box>

        {/* Col 3: Chart (top) + Order Queue (bottom), user-resizable */}
        <Box
          sx={{
            minHeight: { xs: 640, lg: 0 },
            gridColumn: { xs: '1', md: '1 / span 2', lg: '3' },
            gridRow: { xs: 'auto', md: '3', lg: '1' },
          }}
        >
          <VerticalSplit
            storageKey="orderbook-view:col3-split"
            initialRatio={0.55}
            top={<PriceChartPanel engine={engine} />}
            bottom={<OrderQueuePanel engine={engine} />}
          />
        </Box>
      </Box>
    </Box>
  );
}
