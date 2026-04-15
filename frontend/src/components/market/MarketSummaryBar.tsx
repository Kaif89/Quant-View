import { useMarketData } from '@/hooks/useMarketData';

export function MarketSummaryBar() {
  const { marketStatus } = useMarketData();

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-white/10 p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
       
       <div className="flex flex-col border-r border-white/5 px-2">
         <span className="text-xs text-white/40 font-mono tracking-widest mb-1">NYSE</span>
         <div className="flex items-center gap-2">
           <div className={`w-2 h-2 ${marketStatus['NYSE'] ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
           <span className="font-mono text-sm">{marketStatus['NYSE'] ? 'OPEN' : 'CLOSED'}</span>
         </div>
       </div>

       <div className="flex flex-col border-r border-white/5 px-2">
         <span className="text-xs text-white/40 font-mono tracking-widest mb-1">NASDAQ</span>
         <div className="flex items-center gap-2">
           <div className={`w-2 h-2 ${marketStatus['NYSE'] ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
           <span className="font-mono text-sm">{marketStatus['NYSE'] ? 'OPEN' : 'CLOSED'}</span>
         </div>
       </div>

       <div className="flex flex-col border-r border-white/5 px-2">
         <span className="text-xs text-white/40 font-mono tracking-widest mb-1">NSE (INDIA)</span>
         <div className="flex items-center gap-2">
           <div className={`w-2 h-2 ${marketStatus['NSE'] ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
           <span className="font-mono text-sm">{marketStatus['NSE'] ? 'OPEN' : 'CLOSED'}</span>
         </div>
       </div>

       <div className="flex flex-col px-2">
         <span className="text-xs text-white/40 font-mono tracking-widest mb-1">CRYPTO</span>
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 shadow-[0_0_8px_#22c55e]" />
           <span className="font-mono text-sm">24/7 OPEN</span>
         </div>
       </div>

    </div>
  );
}
