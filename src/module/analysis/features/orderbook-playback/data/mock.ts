// ----------------------------------------------------------------------
// Dummy session/orderbook/trade/alert generator for the playback UI.
// All times are stored as unix-seconds where the value matches WIB
// wall-clock time read out as UTC (so chart formatters can use getUTC*).
// ----------------------------------------------------------------------

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Trade = {
  time: number;
  price: number;
  lot: number;
  side: 'buy' | 'sell';
  foreign: 'buy' | 'sell' | 'none';
};

export type BookLevel = {
  price: number;
  lot: number;
  freq: number;
  delta: number;
};

export type OrderbookSnapshot = {
  time: number;
  bids: BookLevel[];
  offers: BookLevel[];
};

export type AlertType =
  | 'big-lift-offer'
  | 'big-hit-bid'
  | 'split-order'
  | 'smart-money-distribution'
  | 'smart-money-accumulation'
  | 'iceberg'
  | 'spoofing'
  | 'volume-spike';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export type Alert = {
  id: string;
  time: number;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  detail: string;
  lot?: number;
  price?: number;
  broker?: string;
};

export type SessionSnapshot = {
  code: string;
  name: string;
  date: string;
  sessionStart: number;
  sessionEnd: number;
  breakStart: number;
  breakEnd: number;
  prevClose: number;
  ara: number;
  arb: number;
  candles: Candle[];
  trades: Trade[];
  alerts: Alert[];
  cumLot: number[];
  cumValue: number[];
  cumFBuyVal: number[];
  cumFSellVal: number[];
};

export type StockOption = {
  code: string;
  name: string;
  prevClose: number;
  basePrice: number;
};

export const STOCK_OPTIONS: StockOption[] = [
  { code: 'BUVA', name: 'Bukit Uluwatu Villa', prevClose: 855, basePrice: 815 },
  { code: 'BBRI', name: 'Bank Rakyat Indonesia', prevClose: 4180, basePrice: 4250 },
  { code: 'BBCA', name: 'Bank Central Asia', prevClose: 9800, basePrice: 9875 },
  { code: 'TLKM', name: 'Telkom Indonesia', prevClose: 3070, basePrice: 3060 },
  { code: 'ASII', name: 'Astra International', prevClose: 4720, basePrice: 4680 },
  { code: 'GOTO', name: 'GoTo Gojek Tokopedia', prevClose: 71, basePrice: 70 },
];

const BROKERS = ['AK', 'CC', 'YU', 'RG', 'PD', 'NI', 'BR', 'KZ', 'LG', 'MG', 'OD', 'SS'];

// ----------------------------------------------------------------------

function tickSize(price: number): number {
  if (price < 200) return 1;
  if (price < 500) return 2;
  if (price < 2000) return 5;
  if (price < 5000) return 10;
  return 25;
}

function roundToTick(price: number, tick: number): number {
  return Math.round(price / tick) * tick;
}

/* eslint-disable no-bitwise -- seeded PRNG + FNV-1a hash use bit ops by design */
function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function next() {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* eslint-enable no-bitwise */

function utcSec(date: string, hour: number, min: number): number {
  return Math.floor(
    new Date(
      `${date}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00Z`
    ).getTime() / 1000
  );
}

function pickBroker(rand: () => number): string {
  return BROKERS[Math.floor(rand() * BROKERS.length)];
}

// ----------------------------------------------------------------------

export function generateSession(code: string, date: string): SessionSnapshot {
  const opt = STOCK_OPTIONS.find((o) => o.code === code) ?? STOCK_OPTIONS[0];
  const seed = hashString(`${code}|${date}`);
  const rand = mulberry32(seed);

  const sessionStart = utcSec(date, 9, 0);
  const breakStart = utcSec(date, 12, 0);
  const breakEnd = utcSec(date, 13, 30);
  const sessionEnd = utcSec(date, 15, 0);

  const prevClose = opt.prevClose;
  const tickAtPrev = tickSize(prevClose);
  const ara = roundToTick(prevClose * 1.2, tickAtPrev);
  const arb = roundToTick(prevClose * 0.8, tickAtPrev);

  let price = opt.basePrice;
  // eslint-disable-next-line no-bitwise -- derive deterministic small int from seed
  const trendBias = (((seed >> 3) % 7) - 3) * 0.015;

  const candles: Candle[] = [];
  const trades: Trade[] = [];
  const alerts: Alert[] = [];
  let alertCounter = 0;

  const pushAlert = (a: Omit<Alert, 'id'>) => {
    alerts.push({ ...a, id: `a-${alertCounter++}` });
  };

  for (let t = sessionStart; t < sessionEnd; t += 60) {
    if (t >= breakStart && t < breakEnd) continue;

    const localTick = tickSize(price);
    const open = price;
    const session = t < breakStart ? 1 : 2;
    const volBase = session === 1 ? 1.2 : 0.9;

    const drift = (rand() - 0.5 + trendBias) * localTick * 3 * volBase;
    const candleRange = (1 + rand() * 4) * localTick * volBase;

    const highRaw = open + rand() * candleRange;
    const lowRaw = open - rand() * candleRange;
    let closeRaw = open + drift;
    closeRaw = Math.max(lowRaw, Math.min(highRaw, closeRaw));

    const o = roundToTick(open, localTick);
    const h = roundToTick(highRaw, localTick);
    const l = roundToTick(lowRaw, localTick);
    const c = roundToTick(closeRaw, localTick);
    price = c;

    const lotVolume = Math.round(800 + rand() * 6000 + Math.abs(drift) * 200);
    candles.push({ time: t, open: o, high: h, low: l, close: c, volume: lotVolume });

    const numTrades = 8 + Math.floor(rand() * 40);
    for (let i = 0; i < numTrades; i++) {
      const tt = t + Math.floor(rand() * 60);
      const range = Math.max(h - l, localTick);
      const tp = roundToTick(l + rand() * range, localTick);
      const r = rand();
      const lot = 1 + Math.floor(r * r * 250);
      const side: 'buy' | 'sell' = rand() > 0.5 ? 'buy' : 'sell';
      const foreignR = rand();
      const foreign: 'buy' | 'sell' | 'none' =
        foreignR < 0.18 ? 'buy' : foreignR < 0.32 ? 'sell' : 'none';
      trades.push({ time: tt, price: tp, lot, side, foreign });
    }

    if (rand() < 0.06) {
      const lot = 500 + Math.floor(rand() * 2500);
      const isLift = rand() > 0.4;
      pushAlert({
        time: t + Math.floor(rand() * 60),
        type: isLift ? 'big-lift-offer' : 'big-hit-bid',
        severity: lot > 1500 ? 'critical' : 'warning',
        title: isLift ? 'Big lift on offer' : 'Big hit on bid',
        detail: `${lot.toLocaleString('id-ID')} lot single fill @ ${c.toLocaleString('id-ID')}`,
        lot,
        price: c,
        broker: pickBroker(rand),
      });
    }
    if (rand() < 0.03) {
      const childCount = 6 + Math.floor(rand() * 8);
      const lot = 80 + Math.floor(rand() * 220);
      pushAlert({
        time: t + Math.floor(rand() * 60),
        type: 'split-order',
        severity: 'warning',
        title: 'Split order detected',
        detail: `${childCount}× child orders ~${lot} lot each within 30s`,
        broker: pickBroker(rand),
      });
    }
    if (rand() < 0.018) {
      const isDistrib = rand() > 0.45;
      const broker = pickBroker(rand);
      pushAlert({
        time: t + Math.floor(rand() * 60),
        type: isDistrib ? 'smart-money-distribution' : 'smart-money-accumulation',
        severity: 'info',
        title: isDistrib ? 'Smart-money distribution' : 'Smart-money accumulation',
        detail: isDistrib
          ? `${broker} selling steadily to retail (NI, BR, LG)`
          : `${broker} accumulating from retail (LG, RG, PD)`,
        broker,
      });
    }
    if (rand() < 0.012) {
      const lot = 3000 + Math.floor(rand() * 8000);
      pushAlert({
        time: t + Math.floor(rand() * 60),
        type: 'iceberg',
        severity: 'warning',
        title: 'Iceberg order detected',
        detail: `Hidden refill on bid @ ${c.toLocaleString('id-ID')}, total ${lot.toLocaleString('id-ID')} lot consumed`,
        lot,
        price: c,
        broker: pickBroker(rand),
      });
    }
    if (rand() < 0.008) {
      pushAlert({
        time: t + Math.floor(rand() * 60),
        type: 'spoofing',
        severity: 'critical',
        title: 'Possible spoofing',
        detail: `Large bid pulled within ${(2 + rand() * 4).toFixed(1)}s of placement`,
        broker: pickBroker(rand),
      });
    }
    if (rand() < 0.02 && lotVolume > 4000) {
      pushAlert({
        time: t + Math.floor(rand() * 60),
        type: 'volume-spike',
        severity: 'info',
        title: 'Volume spike',
        detail: `1-min volume ${lotVolume.toLocaleString('id-ID')} lot (~3× 5-min avg)`,
      });
    }
  }

  trades.sort((a, b) => a.time - b.time);
  alerts.sort((a, b) => a.time - b.time);

  const cumLot: number[] = new Array(trades.length);
  const cumValue: number[] = new Array(trades.length);
  const cumFBuyVal: number[] = new Array(trades.length);
  const cumFSellVal: number[] = new Array(trades.length);
  let lotSum = 0;
  let valSum = 0;
  let fBuySum = 0;
  let fSellSum = 0;
  for (let i = 0; i < trades.length; i++) {
    const tr = trades[i];
    const v = tr.lot * tr.price * 100;
    lotSum += tr.lot;
    valSum += v;
    if (tr.foreign === 'buy') fBuySum += v;
    if (tr.foreign === 'sell') fSellSum += v;
    cumLot[i] = lotSum;
    cumValue[i] = valSum;
    cumFBuyVal[i] = fBuySum;
    cumFSellVal[i] = fSellSum;
  }

  return {
    code,
    name: opt.name,
    date,
    sessionStart,
    sessionEnd,
    breakStart,
    breakEnd,
    prevClose,
    ara,
    arb,
    candles,
    trades,
    alerts,
    cumLot,
    cumValue,
    cumFBuyVal,
    cumFSellVal,
  };
}

// ----------------------------------------------------------------------

export function buildOrderbookAt(
  session: SessionSnapshot,
  time: number,
  currentPrice: number
): OrderbookSnapshot {
  const bucket = Math.floor(time / 6);
  const seed = hashString(`${session.code}|${session.date}|${bucket}`);
  const rand = mulberry32(seed);

  const tick = tickSize(currentPrice);
  const bestBid = currentPrice - tick;
  const bestOffer = currentPrice;

  const bids: BookLevel[] = [];
  const offers: BookLevel[] = [];

  for (let i = 0; i < 8; i++) {
    const depthMult = 0.7 + i * 0.18;
    const bidLot = Math.floor((300 + rand() * 4500) * depthMult);
    const offerLot = Math.floor((300 + rand() * 4500) * depthMult);
    const bidDeltaR = rand();
    const offerDeltaR = rand();
    const bidDelta =
      bidDeltaR < 0.3 ? 0 : Math.floor((rand() - 0.5) * 2 * Math.min(bidLot * 0.4, 800));
    const offerDelta =
      offerDeltaR < 0.3 ? 0 : Math.floor((rand() - 0.5) * 2 * Math.min(offerLot * 0.4, 800));
    bids.push({
      price: Math.max(session.arb, bestBid - i * tick),
      lot: bidLot,
      freq: Math.floor(3 + rand() * 70),
      delta: bidDelta,
    });
    offers.push({
      price: Math.min(session.ara, bestOffer + i * tick),
      lot: offerLot,
      freq: Math.floor(3 + rand() * 70),
      delta: offerDelta,
    });
  }

  return { time, bids, offers };
}

// ----------------------------------------------------------------------

export function upperBoundByTime<T extends { time: number }>(arr: T[], target: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    // eslint-disable-next-line no-bitwise -- fast integer midpoint
    const mid = (lo + hi) >>> 1;
    if (arr[mid].time <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

export type SessionSummary = {
  open: number;
  high: number;
  low: number;
  last: number;
  changeAbs: number;
  changePct: number;
  volumeLot: number;
  valueRp: number;
  freq: number;
  avg: number;
  fBuyVal: number;
  fSellVal: number;
};

export function computeSummary(session: SessionSnapshot, currentTime: number): SessionSummary {
  const candlesUpTo = session.candles.filter((c) => c.time <= currentTime);
  const open = session.candles[0]?.open ?? session.prevClose;
  const last = candlesUpTo[candlesUpTo.length - 1]?.close ?? open;
  let high = open;
  let low = open;
  for (const c of candlesUpTo) {
    if (c.high > high) high = c.high;
    if (c.low < low) low = c.low;
  }

  const idx = upperBoundByTime(session.trades, currentTime) - 1;
  const volumeLot = idx >= 0 ? session.cumLot[idx] : 0;
  const valueRp = idx >= 0 ? session.cumValue[idx] : 0;
  const fBuyVal = idx >= 0 ? session.cumFBuyVal[idx] : 0;
  const fSellVal = idx >= 0 ? session.cumFSellVal[idx] : 0;
  const freq = idx >= 0 ? idx + 1 : 0;
  const avg = volumeLot ? valueRp / (volumeLot * 100) : open;

  return {
    open,
    high,
    low,
    last,
    changeAbs: last - session.prevClose,
    changePct: ((last - session.prevClose) / session.prevClose) * 100,
    volumeLot,
    valueRp,
    freq,
    avg,
    fBuyVal,
    fSellVal,
  };
}

// ----------------------------------------------------------------------

export function fmtHms(unixSec: number): string {
  const d = new Date(unixSec * 1000);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}`;
}

export function fmtHm(unixSec: number): string {
  const d = new Date(unixSec * 1000);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

export function fmtNumber(n: number, digits = 0): string {
  return n.toLocaleString('id-ID', { maximumFractionDigits: digits });
}

export function fmtCompact(n: number): string {
  if (!isFinite(n)) return '0';
  if (Math.abs(n) >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(0);
}
