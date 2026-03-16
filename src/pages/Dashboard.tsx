import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useStock } from '@/hooks/useStock';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bell, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';


const timeframeOptions = ['1D', '1W', '1M', '3M'];
type Timeframe = '1D' | '1W' | '1M' | '3M';

function LiveIndicator() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 shrink-0">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-[11px] font-medium tracking-wide text-emerald-600 dark:text-emerald-400 font-mono">
        LIVE
      </span>
      <span className="text-[11px] font-mono text-emerald-600/70 dark:text-emerald-400/70 tabular-nums">
        {formatted}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { theme } = useTheme();
  const { selectedStock, loading, timeRange, setTimeRange } = useStock();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M');

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isDark = theme === 'dark';

  const cardBaseClasses = `rounded-2xl p-5 transition-colors duration-200 ${
    isDark
      ? 'bg-[#111318] border border-white/6'
      : 'bg-white border border-black/7'
  }`;

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-500' : 'text-gray-500';
  const gridStroke = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
  const axisColor = '#6b7280';

  const signalBadgeClasses = (signal: string) => {
    const base = 'text-xs px-2.5 py-0.5 rounded-full font-medium';
    switch (signal) {
      case 'BUY':
        return `${base} ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`;
      case 'SELL':
        return `${base} ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-100 text-rose-700'}`;
      case 'HOLD':
        return `${base} ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'}`;
      default:
        return base;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`rounded-xl px-3 py-2 text-xs ${
            isDark
              ? 'bg-[#1c1f2e] border border-white/10 text-white'
              : 'bg-white border border-gray-200 text-gray-800'
          }`}
        >
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'} animate-pulse`}>
            Loading market data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-4 md:px-6 py-3 border-b shrink-0 transition-colors duration-200
        bg-white border-gray-200/60
        dark:bg-[#111318] dark:border-white/[0.06]">
        {/* Mobile logo */}
        <div className="md:hidden w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0
          bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
          Q
        </div>

        {/* Live indicator */}
        <LiveIndicator />

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Notifications">
            <Bell className="w-4 h-4" />
          </button>
          <ThemeToggle className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>

        {/* Row 1 — 4 metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Card 1 — Model Accuracy */}
          <div className={cardBaseClasses}>
            <p className="uppercase text-[11px] tracking-widest text-gray-500 mb-2">
              Model accuracy
            </p>
            <p className={`text-3xl font-semibold ${textPrimary}`}>
              —
            </p>
            <p className="text-xs text-emerald-400 mt-1">— this week</p>
          </div>

          {/* Card 2 — Active Predictions */}
          <div className={cardBaseClasses}>
            <p className="uppercase text-[11px] tracking-widest text-gray-500 mb-2">
              Active predictions
            </p>
            <p className={`text-3xl font-semibold ${textPrimary}`}>
              —
            </p>
            <p className="text-xs text-gray-500 mt-1">across — sectors</p>
          </div>

          {/* Card 3 — Avg Confidence */}
          <div className={cardBaseClasses}>
            <p className="uppercase text-[11px] tracking-widest text-gray-500 mb-2">
              Avg confidence
            </p>
            <p className={`text-3xl font-semibold ${textPrimary}`}>
              —
            </p>
            <p className="text-xs text-gray-500 mt-1">— this week</p>
          </div>

          {/* Card 4 — Correct / Total */}
          <div className={cardBaseClasses}>
            <p className="uppercase text-[11px] tracking-widest text-gray-500 mb-2">
              Correct / total
            </p>
            <p className={`text-3xl font-semibold ${textPrimary}`}>
              —/—
            </p>
            <p className="text-xs text-gray-500 mt-1">last 30 days</p>
          </div>
        </div>

        {/* Row 2 — 2 column grid */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {/* Left panel — Prediction vs Actual chart */}
          <div className={`lg:col-span-2 ${cardBaseClasses}`}>
            {/* Title row */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {selectedStock?.meta.ticker || 'AAPL'} Prediction vs Actual
              </h2>
              <div className="flex items-center gap-1">
                {timeframeOptions.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf as Timeframe)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      selectedTimeframe === tf
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : `${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-500 hover:text-gray-700'}`
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend row */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-indigo-500" />
                <span className="text-xs text-gray-500">Predicted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500" />
                <span className="text-xs text-gray-500">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-indigo-500/30" />
                <span className="text-xs text-gray-500">Confidence band</span>
              </div>
            </div>

            {/* Chart */}
            {selectedStock ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={[]} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: axisColor, fontSize: 11 }}
                    axisLine={{ stroke: gridStroke }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: axisColor, fontSize: 11 }}
                    axisLine={{ stroke: gridStroke }}
                    tickLine={false}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="none"
                    fill={isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'}
                    fillOpacity={1}
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stroke="none"
                    fill={isDark ? '#111318' : '#ffffff'}
                    fillOpacity={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="Predicted"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px]">
                <BarChart3 className="w-10 h-10 text-indigo-500/30" />
                <p className="text-sm text-gray-600 mt-2">Select a ticker to view prediction chart</p>
              </div>
            )}
          </div>

          {/* Right panel — Top signals */}
          <div className={cardBaseClasses}>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Top signals today</h3>
            <div className="flex flex-col">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center py-3 ${
                    index < 4
                      ? isDark
                        ? 'border-b border-white/5'
                        : 'border-b border-black/5'
                      : ''
                  }`}
                >
                  <div>
                    <p className={`text-sm font-semibold ${textPrimary}`}>—</p>
                    <p className="text-xs text-gray-500">—</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${isDark ? 'bg-gray-500/10 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>—</span>
                    <p className="text-xs text-gray-500 mt-1">—%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}