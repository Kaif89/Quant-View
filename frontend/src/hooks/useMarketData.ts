import { useState, useEffect } from 'react';
import { LiveQuote } from '@/types/market';
import { API_BASE_URL } from '@/config/apiConfig';

/**
 * Standalone REST Market Service wrapper to grab static snapshots of market statuses and quotes.
 * Designed to act as the rigid fallback mechanism when SSE behaves poorly natively.
 */
export function useMarketData() {
  const [quotes, setQuotes] = useState<LiveQuote[]>([]);
  const [gainers, setGainers] = useState<LiveQuote[]>([]);
  const [losers, setLosers] = useState<LiveQuote[]>([]);
  const [volumeLeaders, setVolumeLeaders] = useState<LiveQuote[]>([]);
  const [marketStatus, setMarketStatus] = useState<Record<string, boolean>>({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const safeJson = async (res: Response) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  };

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const [allRes, gainRes, loseRes, volRes, statusRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/market/quotes`),
        fetch(`${API_BASE_URL}/api/market/gainers?limit=5`),
        fetch(`${API_BASE_URL}/api/market/losers?limit=5`),
        fetch(`${API_BASE_URL}/api/market/volume?limit=5`),
        fetch(`${API_BASE_URL}/api/market/status`),
      ]);

      setQuotes(await safeJson(allRes) || []);
      setGainers(await safeJson(gainRes) || []);
      setLosers(await safeJson(loseRes) || []);
      setVolumeLeaders(await safeJson(volRes) || []);
      setMarketStatus(await safeJson(statusRes) || {});
      
      setError(null);
    } catch (err) {
      setError('Market data unavailable — backend may be offline.');
      console.warn('[useMarketData] Backend unreachable:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    
    // Poll backup every 30s as robust fallback to SSE
    const interval = setInterval(fetchOverview, 30000);
    return () => clearInterval(interval);
  }, []);

  return { quotes, gainers, losers, volumeLeaders, marketStatus, loading, error, refresh: fetchOverview };
}
