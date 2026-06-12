import { memo } from 'react';
import { LiveQuote } from '@/types/market';
import { useMarketStream } from '@/hooks/useMarketStream';

/**
 * Animated Infinite Ticker Tape running across the absolute top of the app.
 */
export const LivePriceTicker = memo(function LivePriceTicker() {
  const { quotes, isConnected } = useMarketStream();
  const quoteList = Array.from(quotes.values());

  if (!isConnected && quoteList.length === 0) return null;

  return (
    <div className="w-full bg-card border-b border-border h-10 flex items-center overflow-hidden whitespace-nowrap z-50">
      <div className="px-4 bg-card h-full flex items-center font-bold text-xs border-r border-border z-10 shrink-0 text-foreground">
        <span className="flex items-center gap-2">
          {isConnected ? (
            <span className="w-2 h-2 rounded-none bg-green-500 animate-pulse" />
          ) : (
            <span className="w-2 h-2 rounded-none bg-yellow-500" />
          )}
          MARKET {isConnected ? 'LIVE' : 'DELAYED'}
        </span>
      </div>

      {/* Wrapping continuous container */}
      <div className="inline-flex animate-ticker hover:[animation-play-state:paused]">
        {/* Double render to fake infinite loop scroll */}
        {[...quoteList, ...quoteList].map((quote, idx) => (
          <div key={`${quote.symbol}-${idx}`} className="inline-flex items-center gap-2 px-6 border-r border-border/30 font-mono text-sm text-foreground">
            <span className="font-semibold">{quote.symbol}</span>
            <span className="text-foreground/80">{quote.price.toFixed(2)}</span>
            <span className={`text-xs flex items-center ${quote.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {quote.changePercent >= 0 ? '▲' : '▼'} {Math.abs(quote.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
        {quoteList.length === 0 && (
          <div className="px-6 text-muted-foreground font-mono text-sm">Waiting for market data...</div>
        )}
      </div>
    </div>
  );
});
