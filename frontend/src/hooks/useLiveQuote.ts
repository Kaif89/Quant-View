import { useState, useEffect, useRef } from 'react';
import { LiveQuote } from '@/types/market';
import { API_BASE_URL } from '@/config/apiConfig';

/**
 * Specifically subscribes to a singular ticker via SSE. Ideal for the Dashboard and Analytics view.
 */
export function useLiveQuote(symbol: string) {
  const [quote, setQuote] = useState<LiveQuote | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const retryCount = useRef(0);

  useEffect(() => {
    if (!symbol) return;
    
    const cleanSymbol = symbol.toUpperCase();
    let eventSource: EventSource;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      eventSource = new EventSource(`${API_BASE_URL}/api/market/stream/${cleanSymbol}`);

      eventSource.onopen = () => {
        setIsConnected(true);
        retryCount.current = 0;
      };

      eventSource.addEventListener('quote_update', (event) => {
        try {
          const parsed: LiveQuote = JSON.parse(event.data);
          setQuote(parsed);
        } catch (e) {
          console.error(`[SSE] Failed to parse target quote [${cleanSymbol}]:`, e);
        }
      });

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource.close();
        if (retryCount.current < 5) {
          reconnectTimeout = setTimeout(connect, Math.pow(2, retryCount.current) * 1000);
          retryCount.current += 1;
        }
      };
    };

    connect();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [symbol]);

  return { quote, isConnected };
}
