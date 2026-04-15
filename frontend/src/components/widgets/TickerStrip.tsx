import { useStock } from '@/hooks/useStock';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function TickerStrip() {
  const { allStocks, selectTicker } = useStock();

  return (
    <div className="overflow-hidden relative w-full" aria-label="Stock ticker ribbon">
      {/* left/right fade masks */}
      <div className="pointer-events-none absolute left-0 inset-y-0 w-12 z-10"
        style={{ background: 'linear-gradient(to right, hsl(var(--card) / 0.9), transparent)' }} />
      <div className="pointer-events-none absolute right-0 inset-y-0 w-12 z-10"
        style={{ background: 'linear-gradient(to left, hsl(var(--card) / 0.9), transparent)' }} />

      <div className="flex gap-2 animate-ticker whitespace-nowrap">
        {[...allStocks, ...allStocks].map((stock, i) => {
          const last = stock.history[stock.history.length - 1];
          const prev = stock.history[stock.history.length - 2];
          const delta = last && prev ? ((last.close - prev.close) / prev.close) * 100 : 0;
          const positive = delta >= 0;

          return (
            <button
              key={`${stock.meta.ticker}-${i}`}
              onClick={() => selectTicker(stock.meta.ticker)}
              className="ticker-chip shrink-0 cursor-pointer"
            >
              <span className="font-bold text-foreground text-xs">{stock.meta.ticker}</span>
              <span className="font-mono text-xs text-muted-foreground">${last?.close.toFixed(2)}</span>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${positive ? 'stat-positive' : 'stat-negative'}`}>
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {positive ? '+' : ''}{delta.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
