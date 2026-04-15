import { StockSeries, OHLCVPoint } from '@/types/stock';

const springBootUrl = 'http://localhost:8080'; // Explicitly point to SpringBoot instead of 9090 which was probably a typo in the original file. Wait, wait, let me check the previous api.ts. It had 9090! The application.properties has server.port=8080! So changing it to 8080 is also a mandatory fix!

/** Fetches stock OHLCV data from the backend */
export async function getStock(ticker: string, token: string | null = null): Promise<StockSeries | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(
    `${springBootUrl}/api/stock/${ticker}`,
    { headers, signal: controller.signal }
  );
  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  const responseData = await response.json();
  
  if (!responseData.success || !responseData.data) {
      throw new Error(responseData.error || 'Unknown API error');
  }

  const data = responseData.data; // Now expects pure OHLCV mapped array
  if (!data || data.length === 0) return null;

  const history = data.map((h: any) => ({
    date: h.date,
    open: h.open,
    high: h.high,
    low: h.low,
    close: h.close,
    volume: h.volume,
  })) as OHLCVPoint[];

  return {
    meta: {
      ticker: ticker.toUpperCase(),
      name: ticker.toUpperCase(), 
      sector: 'Technology',
    },
    history,
    model: { coefficients: [], mse: 0, predictedNext: 0 },
  };
}

/** Fetches ML prediction data from the backend */
export async function getPrediction(ticker: string, token: string | null = null) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // ML pipeline takes longer

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(
    `${springBootUrl}/api/predict/${ticker}`,
    { headers, signal: controller.signal }
  );
  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.statusText}`);
  }
  const responseData = await response.json();
  
  if (!responseData.success || !responseData.data) {
      throw new Error(responseData.error || 'Unknown prediction error');
  }

  return responseData.data;
}

/** Returns stock data for popular tickers (backend only) */
export async function getAllTickers(): Promise<StockSeries[]> {
    const popularTickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    // Quick health check — if backend is down, error properly
    await fetch(`${springBootUrl}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const stockPromises = popularTickers.map(ticker => getStock(ticker).catch(() => null));
    const stocks = await Promise.all(stockPromises);
    return stocks.filter((stock): stock is StockSeries => stock !== null);
}
