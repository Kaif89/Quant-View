import { StockSeries, OHLCVPoint } from '@/types/stock';

const springBootUrl = 'http://localhost:8080';

/** Fetches stock data from the backend */
export async function getStock(ticker: string): Promise<StockSeries | null> {
  try {
    const response = await fetch(`${springBootUrl}/api/stocks/analyze?ticker=${ticker}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data.historical_prices || data.historical_prices.length === 0) {
      return null;
    }
    
    // Create lookups for faster access during mapping
    const predMap = new Map();
    data.predicted_prices?.forEach((p: any) => predMap.set(p.date, p.value));
    
    const sma20Map = new Map();
    data.sma_20?.forEach((s: any) => sma20Map.set(s.date, s.value));

    const ema20Map = new Map();
    data.ema_20?.forEach((e: any) => ema20Map.set(e.date, e.value));

    const history = data.historical_prices.map((h: any) => {
        return {
            date: h.date,
            open: h.open,
            high: h.high,
            low: h.low,
            close: h.close,
            volume: h.volume,
            predictedClose: predMap.get(h.date) || undefined,
            // Keep MAs accessible if the chart component wants to use them in the future
            sma20: sma20Map.get(h.date) || undefined,
            ema20: ema20Map.get(h.date) || undefined,
        } as OHLCVPoint
    });


    // Without local mock data, we provide fallback metadata 
    // Ideally the backend would return company info too, but we just use the ticker for now
    return {
      meta: {
        ticker: data.ticker || ticker.toUpperCase(),
        name: data.ticker || ticker.toUpperCase(), 
        sector: 'Technology', // Default sector fallback
      },
      history,
      model: {
        coefficients: [], // Not returning coefficients yet
        mse: data.mse,
        predictedNext: data.next_day_prediction,
      },
    };
  } catch (error) {
    console.error(`Failed to fetch stock data for ${ticker}:`, error);
    return null; // Strict real-time data only, no mock fallback
  }
}

/** Returns a predefined list of popular tickers */
export async function getAllTickers(): Promise<StockSeries[]> {
    const popularTickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    const stockPromises = popularTickers.map(ticker => getStock(ticker));
  
    const stocks = await Promise.all(stockPromises);
    
    // Filter out any null results from failed API calls
    return stocks.filter((stock): stock is StockSeries => stock !== null);
  }
