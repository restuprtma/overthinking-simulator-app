import type { SubTabKey } from '../components/sub-tabs';
import type { TopTabKey } from '../components/stock-header';
import type { PeriodKey, ScopeKey, UnitKey, SortKey } from '../components/filter-bar';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { SubTabs } from '../components/sub-tabs';
import { FilterBar } from '../components/filter-bar';
import { StockHeader } from '../components/stock-header';
import { CostBasisChart } from '../components/cost-basis-chart';
import { BrokerHeatmapTable } from '../components/broker-heatmap-table';
import { ConsistencyProfileChart } from '../components/consistency-profile-chart';
import {
  buildTradingDays,
  generateBrokerRows,
  generateCostBasis,
  generateConsistencyProfile,
} from '../data/mock';

// ----------------------------------------------------------------------

const DEFAULT_STOCK = 'BUVA';
const END_DATE = '2026-05-21';
const TRADING_DAYS_FULL = 22; // ~1 month
const HEATMAP_DAYS = 8;

export function StockAnalysisView() {
  const [topTab, setTopTab] = useState<TopTabKey>('stock-detail');
  const [subTab, setSubTab] = useState<SubTabKey>('broker-tracker');
  const [period, setPeriod] = useState<PeriodKey>('1M');
  const [scope, setScope] = useState<ScopeKey>('all');
  const [unit, setUnit] = useState<UnitKey>('value');
  const [sortKey, setSortKey] = useState<SortKey>('abs-net-high');
  const [highlightedCodes, setHighlightedCodes] = useState<string[]>(['CC', 'ES']);

  const allDates = useMemo(
    () => buildTradingDays(END_DATE, TRADING_DAYS_FULL),
    []
  );
  const heatmapDates = useMemo(() => allDates.slice(0, HEATMAP_DAYS), [allDates]);
  const allDatesAsc = useMemo(() => [...allDates].sort(), [allDates]);

  const rows = useMemo(() => {
    const all = generateBrokerRows(DEFAULT_STOCK, heatmapDates);
    return [...all].sort((a, b) => {
      if (sortKey === 'abs-net-high') return Math.abs(b.net) - Math.abs(a.net);
      if (sortKey === 'abs-net-low') return Math.abs(a.net) - Math.abs(b.net);
      if (sortKey === 'net-buy') return b.net - a.net;
      return a.net - b.net;
    });
  }, [heatmapDates, sortKey]);

  const costBasis = useMemo(
    () => generateCostBasis(DEFAULT_STOCK, allDatesAsc),
    [allDatesAsc]
  );
  const consistency = useMemo(
    () => generateConsistencyProfile(DEFAULT_STOCK, allDatesAsc),
    [allDatesAsc]
  );

  const totals = useMemo(() => {
    let net = 0;
    let turnover = 0;
    for (const r of rows) {
      net += r.net;
      turnover += r.turnover;
    }
    return { net, turnover };
  }, [rows]);

  const highlightedSubtitle =
    highlightedCodes.length > 0 ? highlightedCodes.join(', ') : '—';

  const toggleHighlight = (code: string) => {
    setHighlightedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100dvh)',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <StockHeader stockCode={DEFAULT_STOCK} topTab={topTab} onTopTabChange={setTopTab} />
      <SubTabs value={subTab} onChange={setSubTab} />

      <FilterBar
        startDate={allDatesAsc[0]}
        endDate={allDatesAsc[allDatesAsc.length - 1]}
        period={period}
        onPeriodChange={setPeriod}
        scope={scope}
        onScopeChange={setScope}
        unit={unit}
        onUnitChange={setUnit}
        sortKey={sortKey}
        onSortChange={setSortKey}
        netFlow={totals.net}
        vwap={1000}
        turnover={618_500_000_000}
        rangeDays={39}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gap: 1,
          p: 1,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.6fr) minmax(360px, 1fr)' },
          gridTemplateRows: { xs: 'auto auto auto', lg: '1fr' },
        }}
      >
        <Box sx={{ minHeight: 0, gridColumn: { xs: '1', lg: '1' }, gridRow: { xs: 'auto', lg: '1' } }}>
          <BrokerHeatmapTable
            rows={rows}
            dates={heatmapDates}
            highlightedCodes={highlightedCodes}
            onToggleHighlight={toggleHighlight}
          />
        </Box>
        <Stack
          spacing={1}
          sx={{
            minHeight: 0,
            gridColumn: { xs: '1', lg: '2' },
            gridRow: { xs: 'auto', lg: '1' },
          }}
        >
          <Box sx={{ flex: 1, minHeight: 240 }}>
            <CostBasisChart
              data={costBasis}
              anchorDate={allDatesAsc[0]}
              subtitle={highlightedSubtitle}
            />
          </Box>
          <Box sx={{ flex: 1, minHeight: 240 }}>
            <ConsistencyProfileChart data={consistency} subtitle={highlightedSubtitle} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
