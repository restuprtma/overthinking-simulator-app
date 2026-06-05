import type { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import type { PlaybackEngine } from '../hooks/use-playback-engine';

import { useRef, useMemo, useState, useEffect } from 'react';
import {
  ColorType,
  LineStyle,
  createChart,
  CrosshairMode,
  HistogramSeries,
  CandlestickSeries,
} from 'lightweight-charts';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/ui/iconify';

import { fmtNumber, fmtCompact } from '../data/mock';

// ----------------------------------------------------------------------

const DEFAULT_BAR_SPACING = 8;
const DEFAULT_RIGHT_OFFSET = 8;

// ----------------------------------------------------------------------

type Props = {
  engine: PlaybackEngine;
};

const TIMEFRAME_MIN = 5;
const TIMEFRAME_SEC = TIMEFRAME_MIN * 60;

type AggCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type TradeBucket = {
  buy: number;
  sell: number;
  value: number;
  lots: number;
};

function aggregate(candles: AggCandle[], frameSec: number): AggCandle[] {
  if (candles.length === 0) return [];
  const out: AggCandle[] = [];
  let bucket: AggCandle | null = null;
  let bucketStart = 0;
  for (const c of candles) {
    const start = Math.floor(c.time / frameSec) * frameSec;
    if (!bucket || start !== bucketStart) {
      if (bucket) out.push(bucket);
      bucket = { time: start, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume };
      bucketStart = start;
    } else {
      bucket.high = Math.max(bucket.high, c.high);
      bucket.low = Math.min(bucket.low, c.low);
      bucket.close = c.close;
      bucket.volume += c.volume;
    }
  }
  if (bucket) out.push(bucket);
  return out;
}

export function PriceChartPanel({ engine }: Props) {
  const { visibleCandles, session, currentTime } = engine;
  const theme = useTheme();
  const aggregatedCandles = useMemo(() => aggregate(visibleCandles, TIMEFRAME_SEC), [visibleCandles]);
  const tradeBuckets = useMemo(() => {
    const map = new Map<number, TradeBucket>();
    for (const tr of session.trades) {
      if (tr.time > currentTime) break;
      const start = Math.floor(tr.time / TIMEFRAME_SEC) * TIMEFRAME_SEC;
      let b = map.get(start);
      if (!b) {
        b = { buy: 0, sell: 0, value: 0, lots: 0 };
        map.set(start, b);
      }
      if (tr.side === 'buy') b.buy += tr.lot;
      else b.sell += tr.lot;
      b.value += tr.price * tr.lot;
      b.lots += tr.lot;
    }
    return map;
  }, [session.trades, currentTime]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number } | null>(null);
  const [hoverArea, setHoverArea] = useState<'candle' | 'volume' | null>(null);

  // Init chart once
  useEffect(() => {
    if (!containerRef.current) return undefined;
    const el = containerRef.current;

    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily,
        fontSize: 11,
      },
      grid: {
        vertLines: { color: theme.palette.divider, style: LineStyle.Dotted },
        horzLines: { color: theme.palette.divider, style: LineStyle.Dotted },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: theme.palette.divider, scaleMargins: { top: 0.05, bottom: 0.28 } },
      timeScale: {
        borderColor: theme.palette.divider,
        timeVisible: true,
        secondsVisible: false,
        barSpacing: DEFAULT_BAR_SPACING,
        minBarSpacing: 1,
        rightOffset: DEFAULT_RIGHT_OFFSET,
        tickMarkFormatter: (time: number) => {
          const d = new Date(time * 1000);
          return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
        },
      },
      localization: {
        timeFormatter: (time: number) => {
          const d = new Date(time * 1000);
          return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
        },
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: theme.palette.success.main,
      downColor: theme.palette.error.main,
      wickUpColor: theme.palette.success.main,
      wickDownColor: theme.palette.error.main,
      borderVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const volSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'vol',
      color: theme.palette.grey[600],
      priceLineVisible: false,
      lastValueVisible: false,
    });
    volSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.78, bottom: 0 },
    });
    chart.priceScale('vol').applyOptions({
      visible: false,
      scaleMargins: { top: 0.78, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volSeriesRef.current = volSeries;

    chart.subscribeCrosshairMove((param) => {
      if (param.time === undefined || !param.point) {
        setHoveredTime(null);
        setHoveredPoint(null);
        setHoverArea(null);
      } else {
        setHoveredTime(param.time as number);
        setHoveredPoint({ x: param.point.x, y: param.point.y });
        const h = el.clientHeight || 1;
        setHoverArea(param.point.y >= h * 0.76 ? 'volume' : 'candle');
      }
    });

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr && chart) {
        chart.applyOptions({ width: cr.width, height: cr.height });
      }
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volSeriesRef.current = null;
    };
  }, [theme]);

  // Update data when candles change
  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volSeries = volSeriesRef.current;
    if (!candleSeries || !volSeries) return;

    candleSeries.setData(
      aggregatedCandles.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }))
    );

    volSeries.setData(
      aggregatedCandles.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color:
          c.close >= c.open ? `${theme.palette.success.main}88` : `${theme.palette.error.main}88`,
      }))
    );
  }, [aggregatedCandles, theme]);

  // Reset prevClose horizontal price line when session changes
  useEffect(() => {
    const series = candleSeriesRef.current;
    if (!series) return undefined;
    const line = series.createPriceLine({
      price: session.prevClose,
      color: theme.palette.text.disabled,
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: 'Prev',
    });
    return () => {
      try {
        series.removePriceLine(line);
      } catch {
        /* series already torn down */
      }
    };
  }, [session.prevClose, theme]);

  // Keep latest bar in view as data appends, but respect configured barSpacing
  useEffect(() => {
    if (aggregatedCandles.length > 0 && chartRef.current) {
      chartRef.current.timeScale().scrollToRealTime();
    }
  }, [aggregatedCandles.length]);

  const handleResetView = () => {
    const chart = chartRef.current;
    if (!chart) return;
    chart
      .timeScale()
      .applyOptions({ barSpacing: DEFAULT_BAR_SPACING, rightOffset: DEFAULT_RIGHT_OFFSET });
    chart.timeScale().scrollToRealTime();
    chart.priceScale('right').applyOptions({ autoScale: true });
  };

  const last = aggregatedCandles[aggregatedCandles.length - 1];
  const hoveredCandle =
    hoveredTime !== null ? aggregatedCandles.find((c) => c.time === hoveredTime) : undefined;
  const hoveredBucket = hoveredCandle ? tradeBuckets.get(hoveredCandle.time) ?? null : null;
  const hoveredVwap =
    hoveredBucket && hoveredBucket.lots > 0 ? hoveredBucket.value / hoveredBucket.lots : 0;
  const hoveredNet = hoveredBucket ? hoveredBucket.buy - hoveredBucket.sell : 0;
  const tooltipVisible = !!hoveredCandle && !!hoveredPoint;
  const containerW = containerRef.current?.clientWidth ?? 0;
  const containerH = containerRef.current?.clientHeight ?? 0;
  const TOOLTIP_W = 180;
  const TOOLTIP_H = 124;
  const flipX = hoveredPoint ? hoveredPoint.x + 12 + TOOLTIP_W > containerW : false;
  const flipY = hoveredPoint ? hoveredPoint.y + 12 + TOOLTIP_H > containerH : false;
  const tooltipLeft = hoveredPoint ? (flipX ? hoveredPoint.x - 12 - TOOLTIP_W : hoveredPoint.x + 12) : 0;
  const tooltipTop = hoveredPoint ? (flipY ? hoveredPoint.y - 12 - TOOLTIP_H : hoveredPoint.y + 12) : 0;

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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' }}
          >
            Price · 5m
          </Typography>
          {last && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.disabled',
                fontFamily: 'monospace',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              O {fmtNumber(last.open)} · H {fmtNumber(last.high)} · L {fmtNumber(last.low)} · C{' '}
              {fmtNumber(last.close)}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
            @ {new Date(currentTime * 1000).toISOString().substring(11, 16)} WIB
          </Typography>
          <Tooltip title="Reset view" arrow>
            <IconButton
              size="small"
              onClick={handleResetView}
              sx={{
                width: 24,
                height: 24,
                color: 'text.disabled',
                '&:hover': { color: 'text.primary' },
              }}
            >
              <Iconify icon="solar:restart-bold" width={14} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Box ref={containerRef} sx={{ width: '100%', height: '100%' }} />
        {tooltipVisible && hoveredCandle && hoverArea && (
          <Box
            sx={{
              position: 'absolute',
              left: tooltipLeft,
              top: tooltipTop,
              width: TOOLTIP_W,
              pointerEvents: 'none',
              zIndex: 5,
              px: 1.25,
              py: 0.85,
              borderRadius: 1,
              border: '1px solid rgba(255, 255, 255, 0.10)',
              bgcolor: 'rgba(13, 17, 28, 0.72)',
              backdropFilter: 'blur(10px) saturate(140%)',
              WebkitBackdropFilter: 'blur(10px) saturate(140%)',
              boxShadow: '0 10px 32px rgba(0, 0, 0, 0.45)',
              color: 'rgba(255, 255, 255, 0.92)',
              fontFamily: 'monospace',
              fontVariantNumeric: 'tabular-nums',
              fontSize: 11,
            }}
          >
            <Stack
              direction="row"
              sx={{
                fontSize: 10,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                mb: 0.5,
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              <Box component="span" sx={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.85)' }}>
                {hoverArea === 'candle' ? 'Price' : 'Volume'}
              </Box>
              <Box component="span">
                {new Date(hoveredCandle.time * 1000).toISOString().substring(11, 16)} WIB
              </Box>
            </Stack>

            {hoverArea === 'candle' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: '36px 1fr', rowGap: 0.25 }}>
                <Box sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>O</Box>
                <Box>{fmtNumber(hoveredCandle.open)}</Box>
                <Box sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>H</Box>
                <Box sx={{ color: 'success.light' }}>{fmtNumber(hoveredCandle.high)}</Box>
                <Box sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>L</Box>
                <Box sx={{ color: 'error.light' }}>{fmtNumber(hoveredCandle.low)}</Box>
                <Box sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>C</Box>
                <Box
                  sx={{
                    color:
                      hoveredCandle.close >= hoveredCandle.open ? 'success.light' : 'error.light',
                    fontWeight: 700,
                  }}
                >
                  {fmtNumber(hoveredCandle.close)}
                </Box>
                <Box sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>V</Box>
                <Box>{fmtCompact(hoveredCandle.volume)}</Box>
              </Box>
            )}

            {hoverArea === 'volume' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: '36px 1fr', rowGap: 0.25 }}>
                <Box sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>VOL</Box>
                <Box sx={{ fontWeight: 700 }}>{fmtCompact(hoveredCandle.volume)}</Box>
                {hoveredBucket && (
                  <>
                    <Box sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>AVG</Box>
                    <Box>{fmtNumber(hoveredVwap, 0)}</Box>
                    <Box sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>BUY</Box>
                    <Box sx={{ color: 'success.light' }}>{fmtCompact(hoveredBucket.buy)}</Box>
                    <Box sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>SELL</Box>
                    <Box sx={{ color: 'error.light' }}>{fmtCompact(hoveredBucket.sell)}</Box>
                    <Box sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>NET</Box>
                    <Box
                      sx={{
                        color:
                          hoveredNet > 0
                            ? 'success.light'
                            : hoveredNet < 0
                              ? 'error.light'
                              : 'rgba(255, 255, 255, 0.5)',
                        fontWeight: 700,
                      }}
                    >
                      {hoveredNet > 0 ? '+' : ''}
                      {fmtCompact(hoveredNet)}
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
}
