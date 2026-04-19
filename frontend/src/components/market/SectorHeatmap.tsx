import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMarketStream } from '@/hooks/useMarketStream';
import { LiveQuote } from '@/types/market';

/**
 * A Finviz-style sector heatmap representing structural views of tracking lists.
 */
export const SectorHeatmap = memo(function SectorHeatmap() {
  const { quotes, isConnected } = useMarketStream();
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  if (!isConnected && quotes.size === 0) {
    return <div className="h-48 flex items-center justify-center border border-border rounded-xl text-muted-foreground">Waiting for Data...</div>;
  }

  // Segment US symbols only
  const usQuotes = Array.from(quotes.values()).filter(q => q.exchange === 'US');

  const getColor = (pct: number) => {
    if (pct > 3) return '#166534';
    if (pct > 0) return '#22c55e';
    if (pct === 0) return '#525252';
    if (pct > -3) return '#ef4444';
    return '#991b1b';
  };

  const getSimulatedWeight = (quote: LiveQuote) => {
     let weight = 1;
     if (['AAPL', 'MSFT', 'NVDA'].includes(quote.symbol)) weight = 4;
     if (['GOOGL', 'AMZN', 'META'].includes(quote.symbol)) weight = 3;
     if (['TSLA', 'BRK.B', 'LLY'].includes(quote.symbol)) weight = 2;
     return weight;
  };

  return (
    <div className="w-full flex flex-wrap bg-card border border-border rounded-xl overflow-hidden" 
         style={{ height: '400px', alignContent: 'flex-start' }}>
      
      {usQuotes.sort((a,b) => getSimulatedWeight(b) - getSimulatedWeight(a)).map(quote => (
        <motion.div
           key={quote.symbol}
           onMouseEnter={() => setHoveredSymbol(quote.symbol)}
           onMouseLeave={() => setHoveredSymbol(null)}
           whileHover={{ zIndex: 10, scale: 1.05 }}
           className="relative flex items-center justify-center border border-background/50 transition-colors"
           style={{
             flexBasis: `${getSimulatedWeight(quote) * 10}%`,
             height: `${getSimulatedWeight(quote) * 20}%`,
             flexGrow: getSimulatedWeight(quote),
             backgroundColor: getColor(quote.changePercent)
           }}
        >
          <div className="text-center">
            <div className="font-bold font-mono tracking-tighter text-white drop-shadow-md">
              {quote.symbol}
            </div>
            <div className="text-xs font-mono text-white/80">
               {quote.changePercent > 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
            </div>
          </div>

          {hoveredSymbol === quote.symbol && (
            <div className="absolute top-0 left-full ml-2 w-32 bg-popover border border-border p-2 z-50 text-xs shadow-2xl pointer-events-none rounded-lg">
               <div className="font-bold text-foreground mb-1">{quote.symbol}</div>
               <div className="text-muted-foreground flex justify-between">Price: <span className="text-foreground">${quote.price.toFixed(2)}</span></div>
               <div className="text-muted-foreground flex justify-between">Vol: <span className="text-foreground">{quote.volume}</span></div>
            </div>
          )}
        </motion.div>
      ))}

      {usQuotes.length === 0 && (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
          Awaiting market data...
        </div>
      )}
    </div>
  );
});
