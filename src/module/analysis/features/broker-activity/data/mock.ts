// ----------------------------------------------------------------------
// Broker Activity — stock-by-stock activity for a given broker + date.
// Deterministic dummy data, seeded by (broker, date).
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

export type BrokerStyle = 'accumulator' | 'distributor' | 'rotator' | 'scalper';

export type StockActivity = {
  stock: string;
  stockName: string;
  sector: string;
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

export type BrokerActivityData = {
  broker: BrokerOption;
  date: string;
  totalBuyVal: number;
  totalSellVal: number;
  netVal: number;
  totalVal: number;
  stocksTouched: number;
  topConcentrationPct: number;
  style: BrokerStyle;
  bsRatio: number;
  stocks: StockActivity[];
  sectorTotals: Array<{ sector: string; buyVal: number; sellVal: number; netVal: number }>;
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
  { code: 'BRIS', name: 'Bank Syariah Indonesia', prevClose: 2710, sector: 'Finance' },
  { code: 'TLKM', name: 'Telkom Indonesia', prevClose: 3070, sector: 'Infrastructure' },
  { code: 'ISAT', name: 'Indosat Ooredoo Hutchison', prevClose: 2450, sector: 'Infrastructure' },
  { code: 'EXCL', name: 'XL Axiata', prevClose: 2310, sector: 'Infrastructure' },
  { code: 'JSMR', name: 'Jasa Marga', prevClose: 4560, sector: 'Infrastructure' },
  { code: 'ASII', name: 'Astra International', prevClose: 4720, sector: 'Industrials' },
  { code: 'UNTR', name: 'United Tractors', prevClose: 26450, sector: 'Industrials' },
  { code: 'GOTO', name: 'GoTo Gojek Tokopedia', prevClose: 71, sector: 'Tech' },
  { code: 'EMTK', name: 'Elang Mahkota Teknologi', prevClose: 510, sector: 'Tech' },
  { code: 'BUKA', name: 'Bukalapak.com', prevClose: 132, sector: 'Tech' },
  { code: 'BUVA', name: 'Bukit Uluwatu Villa', prevClose: 855, sector: 'Consumer' },
  { code: 'UNVR', name: 'Unilever Indonesia', prevClose: 2480, sector: 'Consumer' },
  { code: 'ICBP', name: 'Indofood CBP', prevClose: 11125, sector: 'Consumer' },
  { code: 'INDF', name: 'Indofood Sukses Makmur', prevClose: 7375, sector: 'Consumer' },
  { code: 'AMRT', name: 'Sumber Alfaria Trijaya', prevClose: 2790, sector: 'Consumer' },
  { code: 'MAPI', name: 'Mitra Adiperkasa', prevClose: 1845, sector: 'Consumer' },
  { code: 'HMSP', name: 'HM Sampoerna', prevClose: 715, sector: 'Consumer' },
  { code: 'GGRM', name: 'Gudang Garam', prevClose: 21450, sector: 'Consumer' },
  { code: 'ANTM', name: 'Aneka Tambang', prevClose: 1605, sector: 'Basic Materials' },
  { code: 'MDKA', name: 'Merdeka Copper Gold', prevClose: 2380, sector: 'Basic Materials' },
  { code: 'INCO', name: 'Vale Indonesia', prevClose: 3580, sector: 'Basic Materials' },
  { code: 'INTP', name: 'Indocement Tunggal Prakarsa', prevClose: 6720, sector: 'Basic Materials' },
  { code: 'SMGR', name: 'Semen Indonesia', prevClose: 3540, sector: 'Basic Materials' },
  { code: 'PGAS', name: 'Perusahaan Gas Negara', prevClose: 1715, sector: 'Energy' },
  { code: 'PTBA', name: 'Bukit Asam', prevClose: 2840, sector: 'Energy' },
  { code: 'ADRO', name: 'Adaro Energy Indonesia', prevClose: 2270, sector: 'Energy' },
  { code: 'MEDC', name: 'Medco Energi Internasional', prevClose: 1335, sector: 'Energy' },
  { code: 'BREN', name: 'Barito Renewables', prevClose: 7150, sector: 'Energy' },
  { code: 'KLBF', name: 'Kalbe Farma', prevClose: 1470, sector: 'Healthcare' },
  { code: 'SIDO', name: 'Industri Jamu Sido Muncul', prevClose: 670, sector: 'Healthcare' },
  { code: 'MIKA', name: 'Mitra Keluarga Karyasehat', prevClose: 2680, sector: 'Healthcare' },
  { code: 'PWON', name: 'Pakuwon Jati', prevClose: 478, sector: 'Real Estate' },
  { code: 'BSDE', name: 'Bumi Serpong Damai', prevClose: 1030, sector: 'Real Estate' },
];

// ----------------------------------------------------------------------

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

function classifyStyle(
  netVal: number,
  totalVal: number,
  stocksTouched: number,
  concentration: number
): BrokerStyle {
  const netRatio = totalVal > 0 ? netVal / totalVal : 0;
  if (netRatio > 0.18) return 'accumulator';
  if (netRatio < -0.18) return 'distributor';
  if (stocksTouched > 25 && concentration < 35) return 'rotator';
  return 'scalper';
}

// ----------------------------------------------------------------------

export function generateBrokerActivity(brokerCode: string, date: string): BrokerActivityData {
  const broker = BROKERS.find((b) => b.code === brokerCode) ?? BROKERS[0];
  const seed = hashString(`broker-activity|${broker.code}|${date}`);
  const rand = mulberry32(seed);

  // Pick how many stocks this broker is active in today
  const stocksTouched = 14 + Math.floor(rand() * Math.min(STOCKS.length - 14, 24));
  const candidates = [...STOCKS].sort(() => rand() - 0.5).slice(0, stocksTouched);

  // Broker's overall directional bias today: foreign more polar
  const biasRaw = (rand() - 0.5) * 2;
  const overallBias =
    broker.type === 'foreign'
      ? Math.sign(biasRaw) * Math.pow(Math.abs(biasRaw), 1.05)
      : Math.sign(biasRaw) * Math.pow(Math.abs(biasRaw), 1.5);

  // Total notional this broker traded today (scale by type)
  const scale =
    broker.type === 'foreign' ? 1.3 : broker.type === 'bumn' ? 1.1 : 0.8;
  const totalVal = (45e9 + rand() * 380e9) * scale;

  // Generate per-stock activity with weight power-law
  const weightsRaw = candidates.map(() => Math.pow(rand(), 1.6));
  const weightSum = weightsRaw.reduce((a, b) => a + b, 0);
  const weights = weightsRaw.map((w) => w / weightSum);

  const stocks: StockActivity[] = candidates.map((s, i) => {
    const stockTotalVal = totalVal * weights[i];
    const tick = tickSize(s.prevClose);
    const lastPrice = roundToTick(s.prevClose * (1 + (rand() - 0.5) * 0.025), tick);

    // Per-stock bias mostly aligned with overall, with noise
    const localBiasRaw = overallBias + (rand() - 0.5) * 0.7;
    const localBias = Math.max(-0.92, Math.min(0.92, localBiasRaw));
    const buyShare = (1 + localBias) / 2;

    const totalStockLot = Math.round(stockTotalVal / (lastPrice * 100));
    const buyLot = Math.round(totalStockLot * buyShare);
    const sellLot = Math.max(0, totalStockLot - buyLot);

    const buyAvg = buyLot > 0 ? roundToTick(lastPrice * (1 - 0.001 + rand() * 0.004), tick) : 0;
    const sellAvg = sellLot > 0 ? roundToTick(lastPrice * (1 + 0.001 - rand() * 0.004), tick) : 0;

    const buyVal = buyLot * buyAvg * 100;
    const sellVal = sellLot * sellAvg * 100;

    return {
      stock: s.code,
      stockName: s.name,
      sector: s.sector,
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
  });

  const totalBuyVal = stocks.reduce((s, x) => s + x.buyVal, 0);
  const totalSellVal = stocks.reduce((s, x) => s + x.sellVal, 0);
  const realizedTotalVal = totalBuyVal + totalSellVal;
  const netVal = totalBuyVal - totalSellVal;

  const sortedByVal = [...stocks].sort((a, b) => b.totalVal - a.totalVal);
  const top5Sum = sortedByVal.slice(0, 5).reduce((s, x) => s + x.totalVal, 0);
  const topConcentrationPct = realizedTotalVal > 0 ? (top5Sum / realizedTotalVal) * 100 : 0;

  // Sector aggregates
  const sectorMap = new Map<string, { buyVal: number; sellVal: number; netVal: number }>();
  for (const s of stocks) {
    const entry = sectorMap.get(s.sector) ?? { buyVal: 0, sellVal: 0, netVal: 0 };
    entry.buyVal += s.buyVal;
    entry.sellVal += s.sellVal;
    entry.netVal += s.netVal;
    sectorMap.set(s.sector, entry);
  }
  const sectorTotals = Array.from(sectorMap.entries())
    .map(([sector, vals]) => ({ sector, ...vals }))
    .sort((a, b) => b.buyVal + b.sellVal - (a.buyVal + a.sellVal));

  const style = classifyStyle(netVal, realizedTotalVal, stocksTouched, topConcentrationPct);
  const bsRatio = totalSellVal > 0 ? totalBuyVal / totalSellVal : totalBuyVal > 0 ? Infinity : 1;

  return {
    broker,
    date,
    totalBuyVal,
    totalSellVal,
    netVal,
    totalVal: realizedTotalVal,
    stocksTouched,
    topConcentrationPct,
    style,
    bsRatio,
    stocks,
    sectorTotals,
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
