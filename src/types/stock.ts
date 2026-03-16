export interface OHLCVPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  predictedClose?: number;
}

export interface StockMeta {
  ticker: string;
  name?: string;
  sector?: string;
}

export interface StockSeries {
  meta: StockMeta;
  history: OHLCVPoint[];
  model?: {
    coefficients: number[];
    mse: number;
    predictedNext?: number;
  };
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
