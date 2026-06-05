// ----------------------------------------------------------------------
// Mock data for the Stock Analysis (Broker Tracker) view.
// ----------------------------------------------------------------------

export type DailyFlow = {
  date: string; // YYYY-MM-DD
  value: number; // IDR rupiah
};

export type BrokerRow = {
  code: string;
  net: number;
  turnover: number;
  daily: Record<string, number | null>;
};

export type CostBasisPoint = {
  date: string;
  price: number;
  vwap: number;
};

export type ConsistencyPoint = {
  date: string;
  netFlow: number;
  cumulative: number;
};

// ----------------------------------------------------------------------

/* eslint-disable no-bitwise */
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

// ----------------------------------------------------------------------

export const BROKER_CODES = [
  'XL',
  'LG',
  'HP',
  'AZ',
  'CC',
  'YU',
  'BK',
  'AK',
  'MU',
  'ES',
  'MG',
  'CP',
  'KK',
  'YP',
  'XA',
  'DP',
  'AI',
  'XC',
  'RG',
  'NI',
];

// Trading days from 2026-04-21 to 2026-05-21 (weekdays only)
export function buildTradingDays(endDate: string, count: number): string[] {
  const out: string[] = [];
  const d = new Date(`${endDate}T00:00:00Z`);
  while (out.length < count) {
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return out; // most recent first
}

// ----------------------------------------------------------------------

export function generateBrokerRows(stockCode: string, dates: string[]): BrokerRow[] {
  const rows: BrokerRow[] = [];

  for (const code of BROKER_CODES) {
    const rng = mulberry32(hashString(`${stockCode}-${code}`));
    // Direction bias: some brokers are net buyers, some sellers
    const bias = (rng() - 0.5) * 2; // [-1, 1]
    const scale = 0.5 + rng() * 2; // 0.5x .. 2.5x volatility
    const daily: Record<string, number | null> = {};
    let net = 0;
    let turnover = 0;

    for (const date of dates) {
      // ~12% chance of no trading
      const hasData = rng() > 0.12;
      if (!hasData) {
        daily[date] = null;
        continue;
      }
      const direction = rng() < 0.5 + bias * 0.3 ? 1 : -1;
      const magnitude = Math.floor((rng() * rng() * 25 + 0.05) * 1_000_000_000 * scale);
      const val = direction * magnitude;
      daily[date] = val;
      net += val;
      turnover += Math.abs(val);
    }
    rows.push({ code, net, turnover, daily });
  }

  return rows.sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
}

// ----------------------------------------------------------------------

export function generateCostBasis(stockCode: string, dates: string[]): CostBasisPoint[] {
  const rng = mulberry32(hashString(`${stockCode}-cost-basis`));
  const sorted = [...dates].sort();
  const out: CostBasisPoint[] = [];
  let price = 1300 + Math.floor(rng() * 100);
  let vwap = 1300;

  for (let i = 0; i < sorted.length; i++) {
    const drift = (rng() - 0.55) * 80; // slightly downward bias
    price = Math.max(500, price + drift);
    // VWAP decays slowly toward price
    vwap = vwap + (price - vwap) * 0.04;
    out.push({ date: sorted[i], price: Math.round(price), vwap: Math.round(vwap) });
  }
  // Force the last point to dramatic drop to match the screenshot vibe
  if (out.length > 0) {
    out[out.length - 1].price = 695;
    out[out.length - 1].vwap = 1000;
  }
  return out;
}

// ----------------------------------------------------------------------

export function generateConsistencyProfile(
  stockCode: string,
  dates: string[]
): ConsistencyPoint[] {
  const rng = mulberry32(hashString(`${stockCode}-consistency`));
  const sorted = [...dates].sort();
  const out: ConsistencyPoint[] = [];
  let cum = 0;

  for (const date of sorted) {
    const netFlow = Math.round((rng() - 0.35) * 25_000_000_000);
    cum += netFlow;
    out.push({ date, netFlow, cumulative: cum });
  }
  return out;
}

// ----------------------------------------------------------------------

export function fmtCompactRp(n: number): string {
  if (n === 0) return '0';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '+';
  if (abs >= 1_000_000_000_000) return `${sign}${(abs / 1_000_000_000_000).toFixed(1)}T`;
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs.toFixed(0)}`;
}

export function fmtCompactPlain(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

export function fmtRpFull(n: number): string {
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`;
}

export function fmtShortDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  const day = d.getUTCDate();
  const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  return `${day} ${month}`;
}

export function fmtFullDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
