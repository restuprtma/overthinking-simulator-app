import type { BrokerRow } from '../data/mock';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import { Scrollbar } from 'src/shared/ui/scrollbar';

import { fmtCompactRp, fmtShortDate, fmtCompactPlain } from '../data/mock';

// ----------------------------------------------------------------------

type Props = {
  rows: BrokerRow[];
  dates: string[]; // most recent first
  highlightedCodes?: string[];
  onToggleHighlight?: (code: string) => void;
};

// ----------------------------------------------------------------------

const BROKER_COL = 72;
const NET_COL = 92;
const TURN_COL = 90;
const DAY_COL_MIN = 76;

const CELL = {
  px: 0.75,
  py: 0.65,
  fontFamily: 'monospace',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
} as const;

const HEADER = {
  px: 0.75,
  py: 0.6,
  fontSize: 11,
  fontWeight: 700,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
} as const;

function intensity(value: number, maxAbs: number): number {
  if (maxAbs === 0) return 0;
  const ratio = Math.min(1, Math.abs(value) / maxAbs);
  return 0.18 + ratio * 0.55; // alpha 0.18 .. 0.73
}

// ----------------------------------------------------------------------

export function BrokerHeatmapTable({
  rows,
  dates,
  highlightedCodes = [],
  onToggleHighlight,
}: Props) {
  const maxAbsDaily = Math.max(
    1,
    ...rows.flatMap((r) => Object.values(r.daily).map((v) => (v === null ? 0 : Math.abs(v))))
  );

  const gridTemplate = `${BROKER_COL}px ${NET_COL}px ${TURN_COL}px repeat(${dates.length}, minmax(${DAY_COL_MIN}px, 1fr))`;

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
      <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
        {/* Header row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: gridTemplate,
            position: 'sticky',
            top: 0,
            zIndex: 2,
            bgcolor: 'background.paper',
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Box sx={HEADER}>Broker</Box>
          <Box sx={{ ...HEADER, textAlign: 'right' }}>Net</Box>
          <Box sx={{ ...HEADER, textAlign: 'right' }}>Turnover</Box>
          {dates.map((d) => (
            <Box key={d} sx={{ ...HEADER, textAlign: 'center' }}>
              <Box component="span" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {new Date(`${d}T00:00:00Z`).getUTCDate()}
              </Box>{' '}
              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {fmtShortDate(d).split(' ')[1]}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Body */}
        {rows.map((row) => {
          const netPositive = row.net >= 0;
          const highlighted = highlightedCodes.includes(row.code);
          return (
            <Box
              key={row.code}
              sx={{
                display: 'grid',
                gridTemplateColumns: gridTemplate,
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
                '&:hover': { bgcolor: (t) => t.palette.action.hover },
              }}
            >
              <Box sx={{ ...CELL, py: 0.5, display: 'flex', alignItems: 'center' }}>
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={() => onToggleHighlight?.(row.code)}
                  sx={{
                    px: 0.75,
                    py: 0.25,
                    minWidth: 36,
                    textAlign: 'center',
                    borderRadius: 0.75,
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                    userSelect: 'none',
                    border: (t) =>
                      `1px solid ${highlighted ? t.palette.warning.main : 'transparent'}`,
                    bgcolor: (t) =>
                      highlighted ? `${t.palette.warning.main}22` : t.palette.action.hover,
                    color: highlighted ? 'warning.main' : 'text.primary',
                    transition: (t) =>
                      t.transitions.create(['background-color', 'border-color', 'color']),
                  }}
                >
                  {row.code}
                </Box>
              </Box>
              <Box
                sx={{
                  ...CELL,
                  textAlign: 'right',
                  fontWeight: 700,
                  color: netPositive ? 'success.main' : 'error.main',
                }}
              >
                {fmtCompactRp(row.net)}
              </Box>
              <Box sx={{ ...CELL, textAlign: 'right', color: 'text.secondary' }}>
                {fmtCompactPlain(row.turnover)}
              </Box>
              {dates.map((d) => {
                const v = row.daily[d];
                if (v === null || v === undefined) {
                  return (
                    <Box
                      key={d}
                      sx={{
                        ...CELL,
                        textAlign: 'center',
                        color: 'text.disabled',
                        bgcolor: 'transparent',
                      }}
                    >
                      –
                    </Box>
                  );
                }
                const positive = v >= 0;
                const a = intensity(v, maxAbsDaily);
                return (
                  <Box
                    key={d}
                    sx={{
                      ...CELL,
                      textAlign: 'center',
                      fontWeight: 600,
                      color: positive ? 'success.lighter' : 'error.lighter',
                      bgcolor: (t) =>
                        `rgba(${positive ? '22, 163, 74' : '220, 38, 38'}, ${a})`,
                      borderLeft: (t) => `1px solid ${t.palette.divider}`,
                    }}
                  >
                    {fmtCompactRp(v)}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Scrollbar>
    </Card>
  );
}
