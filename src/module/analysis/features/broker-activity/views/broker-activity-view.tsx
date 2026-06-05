import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useTranslate } from 'src/locales';

import { FilterBar } from '../components/filter-bar';
import { StockTable } from '../components/stock-table';
import { SectorPanel } from '../components/sector-panel';
import { SummaryStrip } from '../components/summary-strip';
import { useBrokerActivity } from '../hooks/use-broker-activity';
import { ConcentrationChart } from '../components/concentration-chart';

// ----------------------------------------------------------------------

const DEFAULT_CODE = 'AK';
const DEFAULT_DATE = '2026-05-19';

export function BrokerActivityView() {
  const { t } = useTranslate('broker-activity');
  const engine = useBrokerActivity(DEFAULT_CODE, DEFAULT_DATE);

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
            lg: 'minmax(260px, 0.8fr) minmax(0, 1.4fr) minmax(0, 1.4fr) minmax(0, 1.4fr)',
          },
          gridTemplateRows: {
            xs: 'auto',
            md: 'auto minmax(280px, 1fr) minmax(280px, 1fr)',
            lg: 'auto minmax(0, 1fr) minmax(0, 0.7fr)',
          },
        }}
      >
        {/* Row 1, Col 1: Filter */}
        <Box
          sx={{
            gridColumn: { xs: '1', md: '1', lg: '1' },
            gridRow: { xs: 'auto', md: '1', lg: '1' },
          }}
        >
          <FilterBar engine={engine} />
        </Box>

        {/* Row 1, Cols 2-4: Summary */}
        <Box
          sx={{
            gridColumn: { xs: '1', md: '2', lg: '2 / span 3' },
            gridRow: { xs: 'auto', md: '1', lg: '1' },
          }}
        >
          <SummaryStrip engine={engine} />
        </Box>

        {/* Row 2: Top Bought */}
        <Box
          sx={{
            minHeight: { xs: 360, lg: 0 },
            gridColumn: { xs: '1', md: '1', lg: '1 / span 2' },
            gridRow: { xs: 'auto', md: '2', lg: '2 / span 2' },
          }}
        >
          <StockTable side="buy" rows={engine.topBought} maxRows={30} />
        </Box>

        {/* Row 2: Top Sold */}
        <Box
          sx={{
            minHeight: { xs: 360, lg: 0 },
            gridColumn: { xs: '1', md: '2', lg: '3' },
            gridRow: { xs: 'auto', md: '2', lg: '2 / span 2' },
          }}
        >
          <StockTable side="sell" rows={engine.topSold} maxRows={30} />
        </Box>

        {/* Row 2 col 4: Concentration chart (top) + Sector breakdown (bottom) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            minHeight: { xs: 360, lg: 0 },
            gridColumn: { xs: '1', md: '1 / span 2', lg: '4' },
            gridRow: { xs: 'auto', md: '3', lg: '2 / span 2' },
          }}
        >
          <Box sx={{ flex: 1.5, minHeight: 0 }}>
            <ConcentrationChart engine={engine} topN={12} />
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <SectorPanel engine={engine} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
