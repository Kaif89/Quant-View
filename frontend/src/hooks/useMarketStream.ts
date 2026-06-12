import { useState, useEffect, useRef } from 'react';
import { LiveQuote } from '@/types/market';
import { API_BASE_URL } from '@/config/apiConfig';

/**
 * Connects to the SSE endpoint to continuously ingest all active LiveQuotes.
 * Specifically handles reconnection mapping over EventSources.
 */
export function useMarketStream() {
  const [quotes, setQuotes] = useState<Map<string, LiveQuote>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const retryCount = useRef(0);
  
  const EVENT_STREAM_URL = `${API_BASE_URL}/api/market/stream`;

  useEffect(() => {
    let eventSource: EventSource;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      eventSource = new EventSource(EVENT_STREAM_URL);

      eventSource.onopen = () => {
        setIsConnected(true);
        retryCount.current = 0;
      };

      eventSource.addEventListener('quotes', (event) => {
        try {
          const parsed: LiveQuote[] = JSON.parse(event.data);
          setQuotes(prevMap => {
            const newMap = new Map(prevMap);
            parsed.forEach(q => newMap.set(q.symbol, q));
            return newMap;
          });
          setLastUpdated(Date.now());
        } catch (e) {
          console.error('[SSE] Failed to parse global quotes:', e);
        }
      });

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource.close();
        
        // Exponential backoff reconnect
        if (retryCount.current < 5) {
          const delay = Math.pow(2, retryCount.current) * 1000;
          retryCount.current += 1;
          reconnectTimeout = setTimeout(connect, delay);
        }
      };
    };

    connect();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  const getQuote = (symbol: string) => quotes.get(symbol.toUpperCase());
  
  const getGainers = (limit = 10) => Array.from(quotes.values())
    .filter(q => q.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, limit);

  const getLosers = (limit = 10) => Array.from(quotes.values())
    .filter(q => q.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, limit);

  return { quotes, isConnected, lastUpdated, getQuote, getGainers, getLosers };
}
