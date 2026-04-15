import { useMemo, memo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useStock } from '@/hooks/useStock';
import { TimeRange } from '@/types/stock';

const timeRanges: TimeRange[] = ['1D', '7D', '1M', '6M', '1Y', 'All'];

function getRangeDays(range: TimeRange): number {
  switch (range) {
    case '1D': return 1;
    case '7D': return 7;
    case '1M': return 30;
    case '6M': return 180;
    case '1Y': return 365;
    default: return 9999;
  }
}

interface TooltipPayload {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipPayload) {
  if (!active || !payload?.length) return null;
  const actual = payload.find((p) => p.dataKey === 'close');
  const predicted = payload.find((p) => p.dataKey === 'predictedClose');

  return (
    <div className="rounded-2xl border border-border/80 px-4 py-3 shadow-2xl text-xs space-y-2"
      style={{ background: 'hsl(var(--card))', backdropFilter: 'blur(12px)' }}>
      <div className="font-semibold text-foreground border-b border-border pb-2 mb-2">{label}</div>
      {actual && (
        <div className="flex justify-between gap-8 items-center">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[hsl(195_100%_52%)]" />
            Actual Close
          </span>
          <span className="font-mono font-bold text-foreground">${actual.value.toFixed(2)}</span>
        </div>
      )}
      {predicted && predicted.value != null && (
        <div className="flex justify-between gap-8 items-center">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[hsl(160_90%_45%)]" />
            Predicted
          </span>
          <span className="font-mono font-bold" style={{ color: 'hsl(160 90% 45%)' }}>${predicted.value.toFixed(2)}</span>
        </div>
      )}
      {actual && predicted && predicted.value != null && (
        <div className="flex justify-between gap-8 items-center border-t border-border pt-1.5">
          <span className="text-muted-foreground">Delta</span>
          <span className={`font-mono font-bold ${predicted.value >= actual.value ? 'stat-positive' : 'stat-negative'}`}>
            {((predicted.value - actual.value) / actual.value * 100).toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
}

export const StockChart = memo(function StockChart() {
  const { selectedStock, timeRange, setTimeRange, showModel } = useStock();

  const data = useMemo(() => {
    if (!selectedStock) return [];
    const days = getRangeDays(timeRange);
    return selectedStock.history.slice(-days);
  }, [selectedStock, timeRange]);

  if (!selectedStock) {
    return (
      <div className="chart-container flex items-center justify-center h-[420px]">
        <div className="text-center space-y-2">
          <div className="text-2xl">📈</div>
          <span className="text-muted-foreground text-sm">Select a stock to view chart</span>
        </div>
      </div>
    );
  }

  const prices = data.map((d) => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.12 || 5;

  return (
    <div className="chart-container animate-fade-in">
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground tracking-tight">{selectedStock.meta.ticker}</h2>
            <span className="neon-badge">LIVE</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{selectedStock.meta.name} · {selectedStock.meta.sector}</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-secondary/60">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`time-toggle ${r === timeRange ? 'time-toggle-active' : ''}`}
              aria-label={`Show ${r} range`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data} margin={{ top: 8, right: 4, bottom: 20, left: 4 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            height={24}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis
            domain={[minPrice - padding, maxPrice + padding]}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
            width={52}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} 
          />
          <Line
            type="stepAfter"
            dataKey="close"
            stroke={prices[prices.length - 1] >= prices[0] ? "#22c55e" : "#ef4444"}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
            activeDot={{ r: 4, fill: '#fff' }}
          />
          {showModel && (
            <Line
              type="stepAfter"
              dataKey="predictedClose"
              stroke="#fbbf24" // yellow/orange for prediction
              strokeDasharray="4 4"
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});
