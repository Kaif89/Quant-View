import { memo, useMemo, useState } from 'react';
import { useMarketStream } from '@/hooks/useMarketStream';

/**
 * High-performance Market Table with exchange filters.
 */
export const StockTable = memo(function StockTable() {
  const { quotes } = useMarketStream();
  const [filterMode, setFilterMode] = useState<"ALL" | "US" | "NSE" | "CRYPTO">("ALL");

  const data = useMemo(() => {
    let arr = Array.from(quotes.values());
    if (filterMode !== "ALL") {
      arr = arr.filter(q => q.exchange === filterMode);
    }
    return arr.sort((a,b) => a.symbol.localeCompare(b.symbol));
  }, [quotes, filterMode]);

  const Row = ({ index }: { index: number }) => {
    const q = data[index];
    if (!q) return null;
    const isP = q.changePercent >= 0;

    return (
      <div className="flex border-b border-border/30 hover:bg-secondary/50 cursor-pointer transition-colors">
        <div className="w-[15%] p-3 font-bold font-mono flex items-center gap-2 text-foreground">
           {q.symbol}
           <span className="text-[9px] px-1 py-0.5 bg-secondary text-muted-foreground">{q.exchange}</span>
        </div>
        <div className="w-[15%] p-3 font-mono text-foreground">{(q.currency==="INR" || q.exchange==="NSE") ? '₹' : '$'}{q.price.toFixed(2)}</div>
        <div className={`w-[15%] p-3 font-mono ${isP ? 'text-green-500' : 'text-red-500'}`}>
          {isP ? '+' : ''}{q.change.toFixed(2)}
        </div>
        <div className={`w-[15%] p-3 font-mono ${isP ? 'text-green-500' : 'text-red-500'}`}>
          {isP ? '+' : ''}{q.changePercent.toFixed(2)}%
        </div>
        <div className="w-[15%] p-3 font-mono text-muted-foreground">{q.dayHigh.toFixed(2)}</div>
        <div className="w-[15%] p-3 font-mono text-muted-foreground">{q.dayLow.toFixed(2)}</div>
        <div className="w-[10%] p-3 font-mono text-muted-foreground text-xs flex items-center justify-end">{q.volume}</div>
      </div>
    );
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl flex flex-col overflow-hidden">
       <div className="flex border-b border-border">
         {["ALL", "US", "NSE", "CRYPTO"].map(mode => (
            <button 
               key={mode} 
               onClick={() => setFilterMode(mode as any)}
               className={`px-4 py-2 text-xs font-mono tracking-widest transition-colors ${filterMode === mode ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {mode}
            </button>
         ))}
       </div>

       {/* Headers */}
       <div className="flex bg-secondary/50 border-b border-border text-xs font-mono text-muted-foreground tracking-widest">
         <div className="w-[15%] p-3">SYMBOL</div>
         <div className="w-[15%] p-3">PRICE</div>
         <div className="w-[15%] p-3">CHANGE</div>
         <div className="w-[15%] p-3">% CHG</div>
         <div className="w-[15%] p-3">HIGH</div>
         <div className="w-[15%] p-3">LOW</div>
         <div className="w-[10%] p-3 text-right">VOLUME</div>
       </div>

       {/* Data rows */}
       <div className="w-full flex-1 min-h-0">
         {data.length > 0 ? (
           data.map((q, index) => <Row key={q.symbol} index={index} />)
         ) : (
           <div className="w-full h-48 flex flex-col items-center justify-center font-mono text-sm text-muted-foreground">
             <span>Awaiting market data...</span>
           </div>
         )}
       </div>
    </div>
  );
});
