import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { StockSeries, TimeRange } from '@/types/stock';
import { getStock, getAllTickers } from '@/services/api';

const POLL_INTERVAL_MS = 15_000; // Re-fetch every 15 seconds

interface StockContextValue {
  selectedStock: StockSeries | null;
  allStocks: StockSeries[];
  loading: boolean;
  timeRange: TimeRange;
  showModel: boolean;
  lastUpdated: Date | null;
  selectTicker: (ticker: string) => void;
  setTimeRange: (range: TimeRange) => void;
  setShowModel: (show: boolean) => void;
}

const StockContext = createContext<StockContextValue | undefined>(undefined);

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [selectedStock, setSelectedStock] = useState<StockSeries | null>(null);
  const [allStocks, setAllStocks] = useState<StockSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('All');
  const [showModel, setShowModel] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const selectedTickerRef = useRef<string | null>(null);

  // Initial load
  useEffect(() => {
    getAllTickers().then((stocks) => {
      setAllStocks(stocks);
      if (stocks.length > 0) {
        setSelectedStock(stocks[0]);
        selectedTickerRef.current = stocks[0].meta.ticker;
        setLastUpdated(new Date());
      }
    });
  }, []);

  // Auto-poll: silently re-fetch the selected ticker every POLL_INTERVAL_MS
  useEffect(() => {
    const interval = setInterval(async () => {
      const ticker = selectedTickerRef.current;
      if (!ticker) return;

      try {
        // Silently refresh selected stock (no loading spinner)
        const stock = await getStock(ticker);
        if (stock) {
          setSelectedStock(stock);
          setLastUpdated(new Date());
        }

        // Also refresh the ticker strip data
        const refreshed = await getAllTickers();
        if (refreshed.length > 0) {
          setAllStocks(refreshed);
        }
      } catch {
        // Silently fail on polling errors — data stays stale
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const selectTicker = useCallback(async (ticker: string) => {
    setLoading(true);
    selectedTickerRef.current = ticker;
    const stock = await getStock(ticker);
    if (stock) {
      setSelectedStock(stock);
      setLastUpdated(new Date());
    }
    setLoading(false);
  }, []);

  return (
    <StockContext.Provider value={{ selectedStock, allStocks, loading, timeRange, showModel, lastUpdated, selectTicker, setTimeRange, setShowModel }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error('useStock must be used within StockProvider');
  return ctx;
}
