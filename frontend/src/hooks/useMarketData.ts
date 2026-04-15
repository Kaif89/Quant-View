import { useState, useEffect } from 'react';
import { LiveQuote } from '@/types/market';

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

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const [allRes, gainRes, loseRes, volRes, statusRes] = await Promise.all([
        fetch('http://localhost:9090/api/market/quotes'),
        fetch('http://localhost:9090/api/market/gainers?limit=5'),
        fetch('http://localhost:9090/api/market/losers?limit=5'),
        fetch('http://localhost:9090/api/market/volume?limit=5'),
        fetch('http://localhost:9090/api/market/status'),
      ]);

      setQuotes(await allRes.json());
      setGainers(await gainRes.json());
      setLosers(await loseRes.json());
      setVolumeLeaders(await volRes.json());
      setMarketStatus(await statusRes.json());
      
      setError(null);
    } catch (err) {
      setError('Market Data Retrieval Failed.');
      console.error(err);
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
