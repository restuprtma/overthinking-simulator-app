// ----------------------------------------------------------------------
// Stock Activity — broker-by-broker activity for a given stock + date.
// Deterministic dummy data, seeded by (stock, date).
// ----------------------------------------------------------------------

export type BrokerType = 'foreign' | 'domestic' | 'bumn';

export type BrokerOption = {
  code: string;
  name: string;
  type: BrokerType;
};

export type StockOption = {
  code: string;
  name: string;
  prevClose: number;
  sector: string;
};

export type BrokerActivity = {
  broker: string;
  brokerName: string;
  brokerType: BrokerType;
  buyLot: number;
  buyVal: number;
  buyAvg: number;
  sellLot: number;
  sellVal: number;
  sellAvg: number;
  netLot: number;
  netVal: number;
  totalVal: number;
};

export type StockActivityData = {
  stock: StockOption;
  date: string;
  last: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  changeAbs: number;
  changePct: number;
  totalLot: number;
  totalVal: number;
  freq: number;
  foreignNet: number;
  domesticNet: number;
  bumnNet: number;
  brokers: BrokerActivity[];
};

// ----------------------------------------------------------------------

export const BROKERS: BrokerOption[] = [
  { code: 'AK', name: 'UBS Sekuritas Indonesia', type: 'foreign' },
  { code: 'AT', name: 'Phintraco Sekuritas', type: 'domestic' },
  { code: 'AZ', name: 'Sucor Sekuritas', type: 'domestic' },
  { code: 'BB', name: 'Buana Capital Sekuritas', type: 'domestic' },
  { code: 'BK', name: 'JP Morgan Sekuritas Indonesia', type: 'foreign' },
  { code: 'BR', name: 'Trimegah Sekuritas Indonesia', type: 'domestic' },
  { code: 'CC', name: 'Mandiri Sekuritas', type: 'bumn' },
  { code: 'CG', name: 'Citigroup Sekuritas Indonesia', type: 'foreign' },
  { code: 'CP', name: 'Valbury Asia Securities', type: 'domestic' },
  { code: 'DR', name: 'OSO Sekuritas Indonesia', type: 'domestic' },
  { code: 'DX', name: 'Bahana Sekuritas', type: 'bumn' },
  { code: 'EP', name: 'MNC Sekuritas', type: 'domestic' },
  { code: 'FZ', name: 'Waterfront Securities Indonesia', type: 'domestic' },
  { code: 'HD', name: 'HD Capital', type: 'domestic' },
  { code: 'IT', name: 'Inti Fikasa Securindo', type: 'domestic' },
  { code: 'KK', name: 'Phillip Sekuritas Indonesia', type: 'foreign' },
  { code: 'KZ', name: 'CLSA Sekuritas Indonesia', type: 'foreign' },
  { code: 'LG', name: 'Trimegah Sekuritas Indonesia', type: 'domestic' },
  { code: 'LS', name: 'Yuanta Sekuritas Indonesia', type: 'foreign' },
  { code: 'MG', name: 'Semesta Indovest Sekuritas', type: 'domestic' },
  { code: 'ML', name: 'Merrill Lynch Sekuritas Indonesia', type: 'foreign' },
  { code: 'NI', name: 'BNI Sekuritas', type: 'bumn' },
  { code: 'OD', name: 'Mirae Asset Sekuritas Indonesia', type: 'foreign' },
  { code: 'PD', name: 'Indo Premier Sekuritas', type: 'domestic' },
  { code: 'PP', name: 'Mega Capital Sekuritas', type: 'domestic' },
  { code: 'RG', name: 'Macquarie Capital Sekuritas', type: 'foreign' },
  { code: 'RS', name: 'Yulie Sekuritas Indonesia', type: 'domestic' },
  { code: 'RX', name: 'Macquarie Sekuritas Indonesia', type: 'foreign' },
  { code: 'SH', name: 'Artha Sekuritas Indonesia', type: 'domestic' },
  { code: 'SS', name: 'Danareksa Sekuritas', type: 'bumn' },
  { code: 'TF', name: 'Universal Broker Indonesia', type: 'domestic' },
  { code: 'TS', name: 'Pacific 2000 Sekuritas', type: 'domestic' },
  { code: 'XL', name: 'Mahanusa Sekuritas', type: 'domestic' },
  { code: 'YJ', name: 'Lautandhana Securindo', type: 'domestic' },
  { code: 'YO', name: 'Amantara Securities', type: 'domestic' },
  { code: 'YU', name: 'CGS-CIMB Sekuritas Indonesia', type: 'foreign' },
  { code: 'ZP', name: 'Maybank Sekuritas Indonesia', type: 'foreign' },
];

export const STOCKS: StockOption[] = [
  { code: 'BBRI', name: 'Bank Rakyat Indonesia', prevClose: 4180, sector: 'Finance' },
  { code: 'BBCA', name: 'Bank Central Asia', prevClose: 9800, sector: 'Finance' },
  { code: 'BMRI', name: 'Bank Mandiri', prevClose: 6125, sector: 'Finance' },
  { code: 'BBNI', name: 'Bank Negara Indonesia', prevClose: 4980, sector: 'Finance' },
  { code: 'TLKM', name: 'Telkom Indonesia', prevClose: 3070, sector: 'Infrastructure' },
  { code: 'ASII', name: 'Astra International', prevClose: 4720, sector: 'Industrials' },
  { code: 'GOTO', name: 'GoTo Gojek Tokopedia', prevClose: 71, sector: 'Tech' },
  { code: 'BUVA', name: 'Bukit Uluwatu Villa', prevClose: 855, sector: 'Consumer' },
  { code: 'UNVR', name: 'Unilever Indonesia', prevClose: 2480, sector: 'Consumer' },
  { code: 'ICBP', name: 'Indofood CBP', prevClose: 11125, sector: 'Consumer' },
  { code: 'INDF', name: 'Indofood Sukses Makmur', prevClose: 7375, sector: 'Consumer' },
  { code: 'ANTM', name: 'Aneka Tambang', prevClose: 1605, sector: 'Basic Materials' },
  { code: 'MDKA', name: 'Merdeka Copper Gold', prevClose: 2380, sector: 'Basic Materials' },
  { code: 'PGAS', name: 'Perusahaan Gas Negara', prevClose: 1715, sector: 'Energy' },
  { code: 'PTBA', name: 'Bukit Asam', prevClose: 2840, sector: 'Energy' },
  { code: 'ADRO', name: 'Adaro Energy Indonesia', prevClose: 2270, sector: 'Energy' },
  { code: 'AMRT', name: 'Sumber Alfaria Trijaya', prevClose: 2790, sector: 'Consumer' },
  { code: 'MAPI', name: 'Mitra Adiperkasa', prevClose: 1845, sector: 'Consumer' },
  { code: 'EMTK', name: 'Elang Mahkota Teknologi', prevClose: 510, sector: 'Tech' },
  { code: 'BREN', name: 'Barito Renewables', prevClose: 7150, sector: 'Energy' },
];

// ----------------------------------------------------------------------
// Seeded PRNG + hash (matches orderbook-playback convention)

/* eslint-disable no-bitwise -- FNV-1a hash + mulberry32 PRNG */
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

// ----------------------------------------------------------------------

export function generateStockActivity(stockCode: string, date: string): StockActivityData {
  const stock = STOCKS.find((s) => s.code === stockCode) ?? STOCKS[0];
  const seed = hashString(`stock-activity|${stock.code}|${date}`);
  const rand = mulberry32(seed);

  const tick = tickSize(stock.prevClose);
  // eslint-disable-next-line no-bitwise -- deterministic small int from seed
  const trend = (((seed >> 3) % 9) - 4) * 0.012;
  const last = roundToTick(stock.prevClose * (1 + trend + (rand() - 0.5) * 0.01), tick);
  const high = roundToTick(Math.max(last, stock.prevClose) * (1 + rand() * 0.012), tick);
  const low = roundToTick(Math.min(last, stock.prevClose) * (1 - rand() * 0.012), tick);
  const open = roundToTick(stock.prevClose * (1 + (rand() - 0.5) * 0.008), tick);

  const avgPrice = (open + last + high + low) / 4;
  const totalLot = Math.floor(40000 + rand() * 240000);
  const totalVal = totalLot * avgPrice * 100;
  const freq = Math.floor(800 + rand() * 18000);

  // Distribute volume across brokers with a power-law tilt
  const weightsRaw = BROKERS.map((b) => {
    let weight = Math.pow(rand(), 1.8);
    if (b.type === 'foreign') weight *= 1.05 + rand() * 0.3;
    if (b.type === 'bumn') weight *= 0.9 + rand() * 0.4;
    return weight;
  });
  const weightSum = weightsRaw.reduce((a, b) => a + b, 0);
  const weights = weightsRaw.map((w) => w / weightSum);

  // For each broker, split into buy & sell sides with a per-broker bias.
  // Some brokers strongly net-buy, some strongly net-sell, most balanced.
  const brokers: BrokerActivity[] = BROKERS.map((b, i) => {
    const totalLotShare = Math.round(totalLot * 2 * weights[i]); // multiplied by 2 (each lot has buy + sell counter-party)
    // Bias: -1 = all-sell, +1 = all-buy. Power-law to make extremes rare.
    const biasRaw = (rand() - 0.5) * 2;
    const bias = Math.sign(biasRaw) * Math.pow(Math.abs(biasRaw), 1.3);

    // Foreign brokers in this session lean with overall trend
    const foreignTilt = b.type === 'foreign' ? Math.sign(trend) * 0.25 : 0;
    const finalBias = Math.max(-0.92, Math.min(0.92, bias + foreignTilt));

    const buyShare = (1 + finalBias) / 2;
    const buyLot = Math.round(totalLotShare * buyShare);
    const sellLot = totalLotShare - buyLot;

    // Per-broker avg slightly skewed; buyers slightly above market avg when bullish
    const buyAvg = buyLot > 0 ? roundToTick(avgPrice * (1 + (rand() - 0.4) * 0.004), tick) : 0;
    const sellAvg = sellLot > 0 ? roundToTick(avgPrice * (1 + (rand() - 0.6) * 0.004), tick) : 0;

    const buyVal = buyLot * buyAvg * 100;
    const sellVal = sellLot * sellAvg * 100;

    return {
      broker: b.code,
      brokerName: b.name,
      brokerType: b.type,
      buyLot,
      buyVal,
      buyAvg,
      sellLot,
      sellVal,
      sellAvg,
      netLot: buyLot - sellLot,
      netVal: buyVal - sellVal,
      totalVal: buyVal + sellVal,
    };
  }).filter((b) => b.buyLot > 0 || b.sellLot > 0);

  const foreignNet = brokers
    .filter((b) => b.brokerType === 'foreign')
    .reduce((s, b) => s + b.netVal, 0);
  const domesticNet = brokers
    .filter((b) => b.brokerType === 'domestic')
    .reduce((s, b) => s + b.netVal, 0);
  const bumnNet = brokers.filter((b) => b.brokerType === 'bumn').reduce((s, b) => s + b.netVal, 0);

  return {
    stock,
    date,
    last,
    open,
    high,
    low,
    prevClose: stock.prevClose,
    changeAbs: last - stock.prevClose,
    changePct: ((last - stock.prevClose) / stock.prevClose) * 100,
    totalLot,
    totalVal,
    freq,
    foreignNet,
    domesticNet,
    bumnNet,
    brokers,
  };
}

// ----------------------------------------------------------------------
// Formatters

export function fmtNumber(n: number, digits = 0): string {
  return n.toLocaleString('id-ID', { maximumFractionDigits: digits });
}

export function fmtCompact(n: number): string {
  if (!isFinite(n)) return '0';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${abs.toFixed(0)}`;
}

export function fmtSignedCompact(n: number): string {
  if (n > 0) return `+${fmtCompact(n)}`;
  return fmtCompact(n);
}
