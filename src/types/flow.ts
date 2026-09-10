export interface FlowRecord {
  date: string;
  label: string;
  total: number;
  ibit: number;
  fbtc: number;
  bitb: number;
  arkb: number;
  gbtc: number;
  others: number;
  breakdown?: Record<string, number>;
  marketDriver?: {
    ticker: string;
    name: string;
    amount: number;
    pctOfTotal: number;
    isPositive: boolean;
    badgeText: string;
  };
}

export interface Issuer {
  ticker: string;
  name: string;
  manager: string;
  fee: number;
  totalInflow: number; // in Millions
  latestSession: number;
  highlight?: string;
  isLeader?: boolean;
  isNegative?: boolean;
}

export interface ScrapedFlowJson {
  metadata: {
    source_url: string;
    scraped_at: string;
    total_days: number;
    date_range: { start: string; end: string };
    tickers: string[];
    funds: Record<string, { name: string; issuer: string }>;
  };
  fees: Record<string, string>;
  summary: {
    total?: Record<string, number>;
    average?: Record<string, number>;
    maximum?: Record<string, number>;
    minimum?: Record<string, number>;
  };
  daily_flows: Array<{
    date: string;
    raw_date: string;
    total: number;
    flows: Record<string, number>;
  }>;
}

export type TimeHorizon = "7d" | "30d" | "90d" | "ytd" | "all";
export type ChartMode = "daily" | "cumulative" | "breakdown";
export type FlowDirectionFilter = "all" | "inflow" | "outflow";
export type IssuerSortOption = "inflow" | "fee" | "ticker";
export type ScriptKey = "zscore" | "rotation" | "velocity";

export interface ScriptPreset {
  file: string;
  metric: string;
  value: string;
  signal: string;
  signalColor: string;
  code: string;
}

export interface DashboardStats {
  totalSum: number;
  delta: number;
  deltaPct: string;
  latest: FlowRecord;
  inflowCount: number;
  outflowCount: number;
  ibitSum: number;
  ibitShare: string;
  peakInflow: number;
  peakInflowDate: string;
  peakOutflow: number;
  peakOutflowDate: string;
  positiveCount: number;
  totalDays: number;
  posRate: string;
  avgDaily: string;
  btcPriceEstimate: number;
  periodBtcAbsorbed: number;
  latestBtcAbsorbed: number;
  dailyMinerMultiplier: number;
  currentStreak: {
    type: "inflow" | "outflow";
    days: number;
  };
  longestInflowStreak: number;
}
