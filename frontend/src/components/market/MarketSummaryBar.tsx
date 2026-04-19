import { useMarketData } from '@/hooks/useMarketData';

export function MarketSummaryBar() {
  const { marketStatus } = useMarketData();

  return (
    <div className="w-full bg-card border border-border rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
       
       <div className="flex flex-col border-r border-border/30 px-2">
         <span className="text-xs text-muted-foreground font-mono tracking-widest mb-1">NYSE</span>
         <div className="flex items-center gap-2">
           <div className={`w-2 h-2 ${marketStatus['NYSE'] ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
           <span className="font-mono text-sm text-foreground">{marketStatus['NYSE'] ? 'OPEN' : 'CLOSED'}</span>
         </div>
       </div>

       <div className="flex flex-col border-r border-border/30 px-2">
         <span className="text-xs text-muted-foreground font-mono tracking-widest mb-1">NASDAQ</span>
         <div className="flex items-center gap-2">
           <div className={`w-2 h-2 ${marketStatus['NYSE'] ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
           <span className="font-mono text-sm text-foreground">{marketStatus['NYSE'] ? 'OPEN' : 'CLOSED'}</span>
         </div>
       </div>

       <div className="flex flex-col border-r border-border/30 px-2">
         <span className="text-xs text-muted-foreground font-mono tracking-widest mb-1">NSE (INDIA)</span>
         <div className="flex items-center gap-2">
           <div className={`w-2 h-2 ${marketStatus['NSE'] ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
           <span className="font-mono text-sm text-foreground">{marketStatus['NSE'] ? 'OPEN' : 'CLOSED'}</span>
         </div>
       </div>

       <div className="flex flex-col px-2">
         <span className="text-xs text-muted-foreground font-mono tracking-widest mb-1">CRYPTO</span>
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 shadow-[0_0_8px_#22c55e]" />
           <span className="font-mono text-sm text-foreground">24/7 OPEN</span>
         </div>
       </div>

    </div>
  );
}
