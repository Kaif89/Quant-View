import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveQuote } from '@/types/market';
import { usePriceFlash } from '@/lib/priceAnimation';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface LiveQuoteCardProps {
  quote: LiveQuote | null;
  historicalPoints?: { value: number }[]; // Injected for the sparkline
}

export const LiveQuoteCard = memo(function LiveQuoteCard({ quote, historicalPoints = [] }: LiveQuoteCardProps) {
  const { flashProps, key } = usePriceFlash(quote?.price);

  if (!quote) return (
    <div className="w-full h-32 border border-border bg-card flex items-center justify-center text-muted-foreground font-mono animate-pulse">
      Loading Data...
    </div>
  );

  const isPositive = quote.changePercent >= 0;
  const colorClass = isPositive ? 'text-green-500' : 'text-red-500';

  // Format volume K/M
  const fmtVol = (v: number) => {
    if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
    if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K';
    return v.toString();
  };

  return (
    <motion.div 
      initial={{ backgroundColor: 'transparent' }}
      animate={flashProps}
      transition={{ duration: 0.3 }}
      className="relative w-full h-full border border-border bg-card p-4 flex flex-col justify-between text-foreground"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold font-mono tracking-tight">{quote.symbol}</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-1 py-0.5">{quote.exchange}</span>
        </div>
        
        {quote.isMarketOpen && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-none bg-green-500 animate-ping"></span> Live
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-4">
        {/* Price Box */}
        <div className="flex flex-col">
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={key} 
              initial={{ opacity: 0.5, y: -4 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-3xl font-mono font-bold"
            >
              {(quote.currency === "INR" || quote.exchange === "NSE") ? '₹' : '$'}
              {quote.price.toFixed(2)}
            </motion.div>
          </AnimatePresence>
          <div className={`font-mono text-sm flex items-center gap-1 ${colorClass}`}>
            <span>{isPositive ? '+' : ''}{quote.change.toFixed(2)}</span>
            <span>({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)</span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="flex-1 h-12 ml-2 opacity-80">
          {historicalPoints.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalPoints}>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isPositive ? '#22c55e' : '#ef4444'} 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false} // Native recharts animation causes lag with SSE
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full border-b border-dashed border-border flex items-end justify-center pb-1">
               <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Awaiting Chart</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border/50 pt-2 text-xs font-mono text-muted-foreground">
        <div className="flex justify-between">
          <span>HIGH</span> <span className="text-foreground">{quote.dayHigh.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>LOW</span> <span className="text-foreground">{quote.dayLow.toFixed(2)}</span>
        </div>
        <div className="flex justify-between col-span-2">
          <span>VOLUME</span> <span className="text-foreground">{fmtVol(quote.volume)}</span>
        </div>
      </div>
    </motion.div>
  );
});
