import { StockSeries, OHLCVPoint } from '@/types/stock';
import { API_BASE_URL } from '@/config/apiConfig';

/** Fetches stock OHLCV data from the backend */
export async function getStock(ticker: string, token: string | null = null): Promise<StockSeries | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(
    `${API_BASE_URL}/api/stock/${ticker}`,
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

  const data = responseData.data;
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
  const timeout = setTimeout(() => controller.abort(), 15000);

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(
    `${API_BASE_URL}/api/predict/${ticker}`,
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

    await fetch(`${API_BASE_URL}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const stockPromises = popularTickers.map(ticker => getStock(ticker).catch(() => null));
    const stocks = await Promise.all(stockPromises);
    return stocks.filter((stock): stock is StockSeries => stock !== null);
}

/** Watchlist API calls */
export async function getWatchlist(userId: string): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/watchlist`, {
    headers: { 'X-User-Id': userId },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch watchlist');
  return data.data || [];
}

export async function addToWatchlist(userId: string, ticker: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/watchlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
    body: JSON.stringify({ ticker: ticker.toUpperCase() }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to add to watchlist');
  return data.data;
}

export async function removeFromWatchlist(userId: string, ticker: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/watchlist/${ticker.toUpperCase()}`, {
    method: 'DELETE',
    headers: { 'X-User-Id': userId },
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to remove from watchlist');
}
