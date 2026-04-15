import { memo, useMemo, useState } from 'react';
import { useMarketStream } from '@/hooks/useMarketStream';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * High-performance virtualized Market Table.
 */
export const StockTable = memo(function StockTable() {
  const { quotes } = useMarketStream();
  const [filterMode, setFilterMode] = useState<"ALL" | "US" | "NSE" | "CRYPTO">("ALL");

  const data = useMemo(() => {
    let arr = Array.from(quotes.values());
    if (filterMode !== "ALL") {
      arr = arr.filter(q => q.exchange === filterMode);
    }
    // Default Sort alphabetically
    return arr.sort((a,b) => a.symbol.localeCompare(b.symbol));
  }, [quotes, filterMode]);

  const Row = ({ index }: { index: number }) => {
    const q = data[index];
    if (!q) return null;
    const isP = q.changePercent >= 0;

    return (
      <div className="flex border-b border-white/5 hover:bg-white/5 cursor-pointer">
        <div className="w-[15%] p-3 font-bold font-mono flex items-center gap-2">
           {q.symbol}
           <span className="text-[9px] px-1 py-0.5 bg-white/10 text-white/40">{q.exchange}</span>
        </div>
        <div className="w-[15%] p-3 font-mono">{(q.currency==="INR" || q.exchange==="NSE") ? '₹' : '$'}{q.price.toFixed(2)}</div>
        <div className={`w-[15%] p-3 font-mono ${isP ? 'text-green-500' : 'text-red-500'}`}>
          {isP ? '+' : ''}{q.change.toFixed(2)}
        </div>
        <div className={`w-[15%] p-3 font-mono ${isP ? 'text-green-500' : 'text-red-500'}`}>
          {isP ? '+' : ''}{q.changePercent.toFixed(2)}%
        </div>
        <div className="w-[15%] p-3 font-mono text-white/50">{q.dayHigh.toFixed(2)}</div>
        <div className="w-[15%] p-3 font-mono text-white/50">{q.dayLow.toFixed(2)}</div>
        <div className="w-[10%] p-3 font-mono text-white/40 text-xs flex items-center justify-end">{q.volume}</div>
      </div>
    );
  };

  return (
    <div className="w-full bg-black border border-white/10 flex flex-col">
       <div className="flex border-b border-white/10">
         {["ALL", "US", "NSE", "CRYPTO"].map(mode => (
            <button 
               key={mode} 
               onClick={() => setFilterMode(mode as any)}
               className={`px-4 py-2 text-xs font-mono tracking-widest ${filterMode === mode ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
            >
              {mode}
            </button>
         ))}
       </div>

       {/* Headers */}
       <div className="flex bg-[#0a0a0a] border-b border-white/10 text-xs font-mono text-white/50 tracking-widest">
         <div className="w-[15%] p-3">SYMBOL</div>
         <div className="w-[15%] p-3">PRICE</div>
         <div className="w-[15%] p-3">CHANGE</div>
         <div className="w-[15%] p-3">% CHG</div>
         <div className="w-[15%] p-3">HIGH</div>
         <div className="w-[15%] p-3">LOW</div>
         <div className="w-[10%] p-3 text-right">VOLUME</div>
       </div>

       {/* Native Map (Removed nested virtual scroll) */}
       <div className="w-full flex-1 min-h-0">
         {data.length > 0 ? (
           data.map((q, index) => <Row key={q.symbol} index={index} />)
         ) : (
           <div className="w-full h-48 flex flex-col items-center justify-center font-mono text-sm text-white/30">
             <span>Awaiting SSE Connection...</span>
           </div>
         )}
       </div>
    </div>
  );
});
