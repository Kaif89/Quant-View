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
    <div className="w-full bg-black border-b border-white/10 h-10 flex items-center overflow-hidden whitespace-nowrap z-50">
      <div className="px-4 bg-black h-full flex items-center font-bold text-xs border-r border-white/10 z-10 shrink-0">
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
      <div className="inline-flex animate-[slide_60s_linear_infinite] hover:[animation-play-state:paused]">
        {/* Double render to fake infinite loop scroll */}
        {[...quoteList, ...quoteList].map((quote, idx) => (
          <div key={`${quote.symbol}-${idx}`} className="inline-flex items-center gap-2 px-6 border-r border-white/5 font-mono text-sm">
            <span className="font-semibold">{quote.symbol}</span>
            <span className="text-white/80">{quote.price.toFixed(2)}</span>
            <span className={`text-xs flex items-center ${quote.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {quote.changePercent >= 0 ? '▲' : '▼'} {Math.abs(quote.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
        {quoteList.length === 0 && (
          <div className="px-6 text-white/40 font-mono text-sm">Waiting for Finnhub ticks...</div>
        )}
      </div>
{/* 
  Tailwind requires this custom keyframe defined in global.css if not native, but JIT parses it if done globally! 
  @keyframes slide {
     0% { transform: translateX(0); }
     100% { transform: translateX(-50%); } 
  }
*/}
    </div>
  );
});
