import React from 'react';
import { LivePriceTicker } from '@/components/market/LivePriceTicker';
import { MarketSummaryBar } from '@/components/market/MarketSummaryBar';
import { SectorHeatmap } from '@/components/market/SectorHeatmap';
import { StockTable } from '@/components/market/StockTable';
import { useMarketStream } from '@/hooks/useMarketStream';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Activity } from 'lucide-react';

export default function Market() {
  const { getGainers, getLosers, isConnected } = useMarketStream();
  const gainers = getGainers(5);
  const losers = getLosers(5);

  const MiniCardList = ({ label, items, positive }: { label: string, items: any[], positive: boolean }) => (
    <div className="w-full glass-card flex flex-col p-4">
      <h3 className="text-muted-foreground text-xs font-mono tracking-widest mb-4 border-b border-border pb-2">{label}</h3>
      {items.length > 0 ? items.map(quote => (
        <div key={quote.symbol} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0 font-mono text-sm">
          <div className="font-bold text-foreground">{quote.symbol}</div>
          <div className={`flex flex-col text-right`}
            style={{ color: positive ? 'hsl(var(--kpi-positive))' : 'hsl(var(--kpi-negative))' }}>
            <span>{(quote.currency==="INR" || quote.exchange==="NSE") ? '₹' : '$'}{quote.price.toFixed(2)}</span>
            <span className="text-xs">{positive ? '+' : ''}{quote.changePercent.toFixed(2)}%</span>
          </div>
        </div>
      )) : (
        <div className="py-4 text-xs font-mono text-muted-foreground text-center">No Data</div>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      
      {/* ── Top Header Bar with Theme Toggle ── */}
      <header 
        className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border shrink-0"
        style={{ background: 'hsl(var(--card))' }}
      >
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
          <h2 className="text-lg font-bold text-foreground tracking-tight font-mono">LIVE MARKETS</h2>
          {/* Connection status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
            style={{
              background: isConnected ? 'hsl(var(--kpi-positive) / 0.06)' : 'hsl(var(--kpi-negative) / 0.06)',
              borderColor: isConnected ? 'hsl(var(--kpi-positive) / 0.2)' : 'hsl(var(--kpi-negative) / 0.2)',
            }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className={`${isConnected ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full opacity-75`}
                style={{ background: isConnected ? 'hsl(var(--kpi-positive))' : 'hsl(var(--kpi-negative))' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ background: isConnected ? 'hsl(var(--kpi-positive))' : 'hsl(var(--kpi-negative))' }} />
            </span>
            <span className="text-[10px] font-semibold font-mono"
              style={{ color: isConnected ? 'hsl(var(--kpi-positive))' : 'hsl(var(--kpi-negative))' }}>
              {isConnected ? 'CONNECTED' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Theme toggle — top right */}
        <ThemeToggle className="text-muted-foreground hover:text-foreground hover:bg-secondary" />
      </header>

      {/* Header Tape */}
      <div className="w-full shrink-0 border-b border-border z-10" style={{ background: 'hsl(var(--card))' }}>
        <LivePriceTicker />
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-[1600px] w-full mx-auto space-y-5 pb-20"
        style={{ background: 'hsl(var(--background))' }}>
          
          <div className="mb-4">
            <p className="text-muted-foreground text-sm">Real-time data feeds powered by Finnhub WebSockets.</p>
          </div>

          {/* Core Visuals */}
          <MarketSummaryBar />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-2">
              <h3 className="section-label">US Sector Weight Distribution</h3>
              <SectorHeatmap />
            </div>
            
            <div className="space-y-5">
              <MiniCardList label="TOP GAINERS (LIVE)" items={gainers} positive={true} />
              <MiniCardList label="TOP LOSERS (LIVE)" items={losers} positive={false} />
            </div>
          </div>

          {/* Full Data Tape */}
          <div className="w-full space-y-2 mt-6">
            <h3 className="section-label">MARKET SCREENER (LIVE)</h3>
            <StockTable />
          </div>

        </main>
    </div>
  );
}
