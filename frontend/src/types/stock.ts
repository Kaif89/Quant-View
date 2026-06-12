export interface OHLCVPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  predictedClose?: number;
  sma20?: number;
  ema20?: number;
}

export interface StockMeta {
  ticker: string;
  name?: string;
  sector?: string;
}

export interface StockModel {
  coefficients: number[];
  mse: number;
  mae?: number;
  r2Score?: number;
  predictedNext?: number;
  modelUsed?: string;
  featureImportances?: Record<string, number>;
}

export interface StockSeries {
  meta: StockMeta;
  history: OHLCVPoint[];
  model?: StockModel;
  modelUsed?: string;
}

export interface PortfolioAllocation {
  name: string;
  value: number;
  color: string;
}

export interface PeerStock {
  ticker: string;
  name: string;
  revenueGrowth: number;
  delta: number;
}

export type TimeRange = '1D' | '7D' | '1M' | '6M' | '1Y' | 'All';
