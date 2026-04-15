import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { StockSeries, TimeRange } from '@/types/stock';
import { getStock, getAllTickers, getPrediction } from '@/services/api';

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
  const { getToken } = useAuth();
  
  const [selectedTicker, setSelectedTicker] = useState<string>('AAPL');
  const [timeRange, setTimeRange] = useState<TimeRange>('All');
  const [showModel, setShowModel] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Background ticker stream (Mock fetcher for the scrolling marquee or fallback)
  const { data: allStocks = [] } = useQuery({
    queryKey: ['allTickers'],
    queryFn: () => getAllTickers(),
    staleTime: 30000,
    refetchInterval: 60000,
  });

  // Query for the currently selected stock OHLCV data
  const { 
    data: stockData = null, 
    isLoading: isStockLoading, 
    isFetching: isStockFetching,
    error: stockError 
  } = useQuery({
    queryKey: ['stock', selectedTicker],
    queryFn: async () => {
      const token = await getToken();
      return getStock(selectedTicker, token);
    },
    staleTime: 30000,
    refetchInterval: 60000,
    meta: {
      errorMessage: 'Failed to fetch stock data'
    }
  });

  // Query specifically for predictions if showModel is true
  const { 
    data: predictionData = null,
    error: predictionError
  } = useQuery({
    queryKey: ['prediction', selectedTicker],
    queryFn: async () => {
      const token = await getToken();
      const res = await getPrediction(selectedTicker, token);
      toast.success(`Prediction ready for ${selectedTicker}`);
      return res;
    },
    enabled: showModel && !!stockData,
    staleTime: 300000, // Predictions cache for 5 minutes
    retry: 0,
    meta: {
      errorMessage: 'Failed to fetch prediction'
    }
  });

  // Handle toast notifications on errors
  useEffect(() => {
    if (stockError) {
      if (stockError.message.includes("not found")) {
        toast.error("Ticker not found. Check the symbol.");
      } else if (stockError.message.includes("delay")) {
        toast.warning("Market data delayed — retrying...");
      } else {
        toast.error("No connection — showing last data");
      }
    }
  }, [stockError]);

  useEffect(() => {
    if (predictionError) {
       toast.warning("Prediction engine momentarily unavailable");
    }
  }, [predictionError]);

  // Map predictors back onto the stock data to keep interface identical
  const selectedStock = React.useMemo(() => {
    if (!stockData) return null;
    
    setLastUpdated(new Date());

    if (showModel && predictionData) {
      // Create lookups
      const predMap = new Map();
      predictionData.predicted_prices?.forEach((p: any) => predMap.set(p.date, p.value));
      
      const sma20Map = new Map();
      predictionData.sma_20?.forEach((s: any) => sma20Map.set(s.date, s.value));

      const ema20Map = new Map();
      predictionData.ema_20?.forEach((e: any) => ema20Map.set(e.date, e.value));

      const enrichedHistory = stockData.history.map(h => ({
        ...h,
        predictedClose: predMap.get(h.date) || undefined,
        sma20: sma20Map.get(h.date) || undefined,
        ema20: ema20Map.get(h.date) || undefined,
      }));

      return {
        ...stockData,
        history: enrichedHistory,
        model: {
          coefficients: [],
          mse: predictionData.mse || 0,
          predictedNext: predictionData.next_day_prediction || 0,
        }
      };
    }
    
    return stockData;
  }, [stockData, predictionData, showModel]);

  const selectTicker = (ticker: string) => {
    setSelectedTicker(ticker.toUpperCase());
  };

  return (
    <StockContext.Provider value={{ 
      selectedStock, 
      allStocks, 
      loading: isStockLoading, 
      timeRange, 
      showModel, 
      lastUpdated, 
      selectTicker, 
      setTimeRange, 
      setShowModel 
    }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error('useStock must be used within StockProvider');
  return ctx;
}
