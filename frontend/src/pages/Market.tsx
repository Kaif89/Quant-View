import React from 'react';
import { LivePriceTicker } from '@/components/market/LivePriceTicker';
import { MarketSummaryBar } from '@/components/market/MarketSummaryBar';
import { SectorHeatmap } from '@/components/market/SectorHeatmap';
import { StockTable } from '@/components/market/StockTable';
import { useMarketStream } from '@/hooks/useMarketStream';

export default function Market() {
  const { getGainers, getLosers } = useMarketStream();
  const gainers = getGainers(5);
  const losers = getLosers(5);

  const MiniCardList = ({ label, items, positive }: { label: string, items: any[], positive: boolean }) => (
    <div className="w-full bg-[#0a0a0a] border border-white/10 flex flex-col p-4">
      <h3 className="text-white/60 text-xs font-mono tracking-widest mb-4 border-b border-white/10 pb-2">{label}</h3>
      {items.length > 0 ? items.map(quote => (
        <div key={quote.symbol} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 font-mono text-sm">
          <div className="font-bold">{quote.symbol}</div>
          <div className={`flex flex-col text-right ${positive ? 'text-green-500' : 'text-red-500'}`}>
            <span>{(quote.currency==="INR" || quote.exchange==="NSE") ? '₹' : '$'}{quote.price.toFixed(2)}</span>
            <span className="text-xs">{positive ? '+' : ''}{quote.changePercent.toFixed(2)}%</span>
          </div>
        </div>
      )) : (
        <div className="py-4 text-xs font-mono text-white/30 text-center">No Data</div>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-black text-white overflow-hidden font-sans relative">
      
      {/* Header Tape */}
      <div className="w-full shrink-0 border-b border-white/10 z-10 bg-black">
        <LivePriceTicker />
      </div>

      <main className="flex-1 overflow-y-auto p-6 max-w-[1600px] w-full mx-auto space-y-6 pb-20">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-mono tracking-tighter mb-2">LIVE MARKETS</h1>
            <p className="text-white/40">Real-time data feeds powered by Finnhub WebSockets.</p>
          </div>

          {/* Core Visuals */}
          <MarketSummaryBar />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-white/60 text-xs font-mono tracking-widest uppercase">US Sector Weight Distribution</h3>
              <SectorHeatmap />
            </div>
            
            <div className="space-y-6">
              <MiniCardList label="TOP GAINERS (LIVE)" items={gainers} positive={true} />
              <MiniCardList label="TOP LOSERS (LIVE)" items={losers} positive={false} />
            </div>
          </div>

          {/* Full Data Tape */}
          <div className="w-full space-y-2 mt-8">
            <h3 className="text-white/60 text-xs font-mono tracking-widest uppercase mb-2">MARKET SCREEENER (LIVE)</h3>
            <StockTable />
          </div>

        </main>
    </div>
  );
}
