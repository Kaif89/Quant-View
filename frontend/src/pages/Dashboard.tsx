import { useState, useEffect, useMemo } from 'react';
import { useStock } from '@/hooks/useStock';
import { useMarketStream } from '@/hooks/useMarketStream';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/layout/SearchBar';
import { StockChart } from '@/components/charts/StockChart';
import {
  Bell,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
  Plus,
  X,
} from 'lucide-react';

/* ── helpers ── */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function fmt(n: number | undefined | null, decimals = 2): string {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function pctChange(current: number, previous: number): number {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

function signalFromMomentum(delta: number): 'BUY' | 'SELL' | 'HOLD' {
  if (delta > 1.5) return 'BUY';
  if (delta < -1.5) return 'SELL';
  return 'HOLD';
}

/* ── Live Clock ── */

function LiveClock() {
  const [time, setTime] = useState(new Date());
  const { isConnected } = useMarketStream();

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const statusColor = isConnected ? 'hsl(var(--kpi-positive))' : 'hsl(var(--kpi-negative))';

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border shrink-0"
      style={{
        background: isConnected ? 'hsl(var(--kpi-positive) / 0.06)' : 'hsl(var(--kpi-negative) / 0.06)',
        borderColor: isConnected ? 'hsl(var(--kpi-positive) / 0.2)' : 'hsl(var(--kpi-negative) / 0.2)',
      }}>
      <span className="relative flex h-2 w-2">
        <span className={`${isConnected ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full opacity-75`}
          style={{ background: statusColor }} />
        <span className="relative inline-flex rounded-full h-2 w-2"
          style={{ background: statusColor }} />
      </span>
      <span className="text-[11px] font-semibold tracking-wide font-mono"
        style={{ color: statusColor }}>
        {isConnected ? 'LIVE' : 'OFFLINE'}
      </span>
      <span className="text-[11px] font-mono tabular-nums"
        style={{ color: `${statusColor}` }}>
        {formatted}
      </span>
    </div>
  );
}

/* ── KPI Card ── */

interface KPICardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

function KPICard({ label, value, subtitle, icon, trend, delay = 0 }: KPICardProps) {
  const trendColor =
    trend === 'up'
      ? 'hsl(var(--kpi-positive))'
      : trend === 'down'
        ? 'hsl(var(--kpi-negative))'
        : 'hsl(var(--muted-foreground))';

  return (
    <div
      className="kpi-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="section-label">{label}</p>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: 'hsl(var(--secondary))',
            color: 'hsl(var(--muted-foreground))',
          }}
        >
          {icon}
        </div>
      </div>
      <p className="metric-value">{value}</p>
      {subtitle && (
        <p className="text-xs font-medium mt-0.5" style={{ color: trendColor }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ── Signal Row ── */

interface SignalRowProps {
  ticker: string;
  name: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  change: number;
  isLast?: boolean;
}

function SignalRow({ ticker, name, signal, change, isLast }: SignalRowProps) {
  const badgeClass =
    signal === 'BUY' ? 'signal-buy' : signal === 'SELL' ? 'signal-sell' : 'signal-hold';

  return (
    <div
      className={`flex items-center justify-between py-3 ${!isLast ? 'border-b border-border/50' : ''}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{ticker}</p>
        <p className="text-xs text-muted-foreground truncate">{name}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono tabular-nums"
          style={{
            color: change >= 0 ? 'hsl(var(--kpi-positive))' : 'hsl(var(--kpi-negative))',
          }}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
        <span className={badgeClass}>{signal}</span>
      </div>
    </div>
  );
}

/* ── Technical Indicator Row ── */

function IndicatorRow({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-mono font-semibold text-foreground">{value}</span>
        {trend === 'up' && (
          <ArrowUpRight className="w-3.5 h-3.5" style={{ color: 'hsl(var(--kpi-positive))' }} />
        )}
        {trend === 'down' && (
          <ArrowDownRight className="w-3.5 h-3.5" style={{ color: 'hsl(var(--kpi-negative))' }} />
        )}
        {trend === 'neutral' && (
          <Minus className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

/* ── Feature Importance Bar ── */

function FeatureImportanceBar({ name, value, maxValue }: { name: string; value: number; maxValue: number }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-[10px] text-muted-foreground font-mono w-24 truncate text-right">{name}</span>
      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--secondary))' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'hsl(var(--primary))',
          }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{(value * 100).toFixed(1)}%</span>
    </div>
  );
}


import { LiveQuoteCard } from '@/components/market/LiveQuoteCard';
import { useLiveQuote } from '@/hooks/useLiveQuote';
import { LiveQuote } from '@/types/market';
import { useWatchlist } from '@/hooks/useWatchlist';

function LiveQuoteCardWrapper({ symbol }: { symbol: string }) {
  const { quote, isConnected } = useLiveQuote(symbol);
  const { selectedStock } = useStock();
  
  if (!quote && !isConnected) {
    if (selectedStock && selectedStock.meta.ticker === symbol && selectedStock.history.length >= 2) {
      const len = selectedStock.history.length;
      const current = selectedStock.history[len - 1];
      const prev = selectedStock.history[len - 2];
      const fallbackQuote: LiveQuote = {
        symbol,
        companyName: selectedStock.meta.name,
        exchange: "NASDAQ",
        sector: selectedStock.meta.sector,
        price: current.close,
        prevClose: prev.close,
        change: current.close - prev.close,
        changePercent: ((current.close - prev.close) / prev.close) * 100,
        dayHigh: current.high || current.close,
        dayLow: current.low || current.close,
        volume: current.volume || 0,
        timestamp: Date.now(),
        isMarketOpen: false,
        currency: "USD"
      };
      return <LiveQuoteCard quote={fallbackQuote} />;
    }
    return <div className="h-full w-full bg-card border border-border p-5 font-mono text-muted-foreground flex items-center justify-center">Awaiting...</div>;
  }
  return <LiveQuoteCard quote={quote} />;
}

export default function Dashboard() {
  const { selectedStock, allStocks, loading, lastUpdated, selectTicker } = useStock();
  const { watchlist, addTicker, removeTicker, isLoading: watchlistLoading } = useWatchlist();
  const [watchlistInput, setWatchlistInput] = useState('');

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  /* ── Derived Data ── */

  const latestPrice = useMemo(() => {
    if (!selectedStock?.history.length) return null;
    return selectedStock.history[selectedStock.history.length - 1].close;
  }, [selectedStock]);

  const prevPrice = useMemo(() => {
    if (!selectedStock?.history || selectedStock.history.length < 2) return null;
    return selectedStock.history[selectedStock.history.length - 2].close;
  }, [selectedStock]);

  const dailyChange = latestPrice && prevPrice ? pctChange(latestPrice, prevPrice) : null;

  const prediction = selectedStock?.model?.predictedNext ?? null;
  const predDelta = latestPrice && prediction ? pctChange(prediction, latestPrice) : null;

  const mse = selectedStock?.model?.mse ?? null;
  const mae = selectedStock?.model?.mae ?? null;
  const modelUsed = selectedStock?.model?.modelUsed || selectedStock?.modelUsed || null;
  const featureImportances = selectedStock?.model?.featureImportances ?? null;

  // R² from prediction data or compute heuristic
  const r2 = useMemo(() => {
    if (selectedStock?.model?.r2Score != null) return selectedStock.model.r2Score;
    if (!selectedStock?.history.length || mse == null) return null;
    const prices = selectedStock.history.map((p) => p.close);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((a, b) => a + (b - mean) ** 2, 0) / prices.length;
    if (variance === 0) return null;
    const score = 1 - mse / variance;
    return Math.max(0, Math.min(1, score));
  }, [selectedStock, mse]);

  /* ── Market signals from allStocks ── */

  const signals = useMemo(() => {
    return allStocks.map((s) => {
      const h = s.history;
      if (h.length < 2) return { ticker: s.meta.ticker, name: s.meta.name || s.meta.ticker, signal: 'HOLD' as const, change: 0 };
      const last = h[h.length - 1].close;
      const prev = h[h.length - 2].close;
      const change = pctChange(last, prev);
      return {
        ticker: s.meta.ticker,
        name: s.meta.name || s.meta.ticker,
        signal: signalFromMomentum(change),
        change,
      };
    });
  }, [allStocks]);

  /* ── Technical indicators from history ── */

  const technicals = useMemo(() => {
    if (!selectedStock?.history.length) return null;
    const prices = selectedStock.history.map((p) => p.close);
    const len = prices.length;

    const sma = (period: number) => {
      if (len < period) return null;
      const slice = prices.slice(-period);
      return slice.reduce((a, b) => a + b, 0) / period;
    };

    const sma50 = sma(50);
    const sma200 = sma(200);
    const sma20 = sma(20);
    const volume = selectedStock.history[len - 1].volume ?? null;

    return {
      sma20,
      sma50,
      sma200,
      volume,
      currentPrice: prices[len - 1],
    };
  }, [selectedStock]);

  /* ── Feature Importances sorted ── */
  const sortedFeatures = useMemo(() => {
    if (!featureImportances) return [];
    return Object.entries(featureImportances)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8); // top 8
  }, [featureImportances]);

  const maxImportance = sortedFeatures.length > 0 ? sortedFeatures[0][1] : 0;

  /* ── Watchlist handlers ── */
  const handleAddWatchlist = () => {
    const ticker = watchlistInput.trim().toUpperCase();
    if (ticker) {
      addTicker(ticker);
      setWatchlistInput('');
    }
  };

  /* ── Loading State ── */

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'hsl(var(--primary))', borderTopColor: 'transparent' }} />
          <span className="text-sm text-muted-foreground animate-pulse">
            Loading market data…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* ── Top Bar ── */}
      <header
        className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-border shrink-0"
        style={{ background: 'hsl(var(--card))' }}
      >
        {/* Mobile logo */}
        <div
          className="md:hidden w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0"
          style={{
            background: 'hsl(var(--secondary))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--primary))',
          }}
        >
          Q
        </div>

        {/* Search bar */}
        <SearchBar />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Live clock */}
        <LiveClock />

        {/* Actions */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
        <ThemeToggle className="text-muted-foreground hover:text-foreground hover:bg-secondary" />
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
        {/* Greeting */}
        <div className="flex items-end justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
              {getGreeting()}, Trader
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{formattedDate}</p>
          </div>
          {lastUpdated && (
            <p className="text-[11px] text-muted-foreground font-mono tabular-nums">
              Last updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </p>
          )}
        </div>

        {/* ── Row 1: KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            {selectedStock?.meta.ticker ? (
              <LiveQuoteCardWrapper symbol={selectedStock.meta.ticker} />
            ) : (
                <KPICard
                  label="Current Price"
                  value={latestPrice ? `$${fmt(latestPrice)}` : '—'}
                  subtitle={dailyChange != null ? `${dailyChange >= 0 ? '↑' : '↓'} ${Math.abs(dailyChange).toFixed(2)}% today` : undefined}
                  icon={<Activity className="w-4 h-4" />}
                  trend={dailyChange != null ? (dailyChange >= 0 ? 'up' : 'down') : 'neutral'}
                  delay={0}
                />
            )}
          </div>
          <KPICard
            label="T+1 Prediction"
            value={prediction ? `$${fmt(prediction)}` : '—'}
            subtitle={predDelta != null ? `${predDelta >= 0 ? '↑' : '↓'} ${Math.abs(predDelta).toFixed(2)}% projected` : undefined}
            icon={<Target className="w-4 h-4" />}
            trend={predDelta != null ? (predDelta >= 0 ? 'up' : 'down') : 'neutral'}
            delay={120}
          />
          <KPICard
            label="Model Accuracy"
            value={r2 != null ? `R² ${r2.toFixed(3)}` : '—'}
            subtitle={r2 != null ? (r2 > 0.7 ? 'Strong fit' : r2 > 0.4 ? 'Moderate fit' : 'Weak fit') : undefined}
            icon={<BarChart3 className="w-4 h-4" />}
            trend={r2 != null ? (r2 > 0.7 ? 'up' : r2 > 0.4 ? 'neutral' : 'down') : 'neutral'}
            delay={240}
          />
          <KPICard
            label="MSE"
            value={mse != null ? fmt(mse, 2) : '—'}
            subtitle={mse != null ? 'Mean Squared Error' : undefined}
            icon={<TrendingDown className="w-4 h-4" />}
            trend="neutral"
            delay={360}
          />
        </div>

        {/* ── Row 2: Main Chart + Signals ── */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Chart — 2/3 */}
          <div className="lg:col-span-2">
            <StockChart />
          </div>

          {/* Signals — 1/3 */}
          <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-label">Market Signals</h3>
              <span className="neon-badge text-[10px]">
                {signals.length} tracked
              </span>
            </div>
            {signals.length > 0 ? (
              <div className="flex flex-col">
                {signals.map((s, i) => (
                  <SignalRow
                    key={s.ticker}
                    ticker={s.ticker}
                    name={s.name}
                    signal={s.signal}
                    change={s.change}
                    isLast={i === signals.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No market data available
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Connect the backend to see live signals
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Row 3: Technical Indicators + Model Insights ── */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Technical Indicators */}
          <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '350ms' }}>
            <h3 className="section-label mb-4">Technical Indicators</h3>
            {technicals ? (
              <div>
                <IndicatorRow
                  label="SMA 20"
                  value={`$${fmt(technicals.sma20)}`}
                  trend={technicals.sma20 && technicals.currentPrice > technicals.sma20 ? 'up' : 'down'}
                />
                <IndicatorRow
                  label="SMA 50"
                  value={`$${fmt(technicals.sma50)}`}
                  trend={technicals.sma50 && technicals.currentPrice > technicals.sma50 ? 'up' : 'down'}
                />
                <IndicatorRow
                  label="SMA 200"
                  value={`$${fmt(technicals.sma200)}`}
                  trend={technicals.sma200 && technicals.currentPrice > technicals.sma200 ? 'up' : 'down'}
                />
                <IndicatorRow
                  label="Volume"
                  value={technicals.volume ? technicals.volume.toLocaleString() : '—'}
                  trend="neutral"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Activity className="w-6 h-6 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">Select a stock to view indicators</p>
              </div>
            )}
          </div>

          {/* Model Insights */}
          <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <h3 className="section-label mb-4">Model Insights</h3>
            {selectedStock ? (
              <div className="space-y-4">
                {/* Mini stat row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl p-3" style={{ background: 'hsl(var(--secondary) / 0.5)' }}>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">R² Score</p>
                    <p className="font-mono text-lg font-semibold text-foreground">
                      {r2 != null ? r2.toFixed(4) : '—'}
                    </p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'hsl(var(--secondary) / 0.5)' }}>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">MSE</p>
                    <p className="font-mono text-lg font-semibold text-foreground">
                      {mse != null ? fmt(mse, 4) : '—'}
                    </p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'hsl(var(--secondary) / 0.5)' }}>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">MAE</p>
                    <p className="font-mono text-lg font-semibold text-foreground">
                      {mae != null ? fmt(mae, 4) : '—'}
                    </p>
                  </div>
                </div>

                {/* Model type badge — dynamic from prediction data */}
                <div className="flex items-center gap-2">
                  <span className="neon-badge">{modelUsed || 'Awaiting model'}</span>
                  <span className="text-[10px] text-muted-foreground">Active model</span>
                </div>

                {/* Feature Importances */}
                {sortedFeatures.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Feature Importances</p>
                    <div className="space-y-0.5">
                      {sortedFeatures.map(([name, value]) => (
                        <FeatureImportanceBar key={name} name={name} value={value} maxValue={maxImportance} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Prediction summary */}
                {prediction != null && latestPrice != null && (
                  <div className="rounded-xl p-4 border border-border/50" style={{ background: 'hsl(var(--secondary) / 0.3)' }}>
                    <p className="text-xs text-muted-foreground mb-2">Next-day forecast</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold text-foreground">
                        ${fmt(prediction)}
                      </span>
                      <span
                        className="text-sm font-mono font-semibold flex items-center gap-0.5"
                        style={{
                          color: predDelta != null && predDelta >= 0
                            ? 'hsl(var(--kpi-positive))'
                            : 'hsl(var(--kpi-negative))',
                        }}
                      >
                        {predDelta != null && predDelta >= 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {predDelta != null ? `${Math.abs(predDelta).toFixed(2)}%` : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <BarChart3 className="w-6 h-6 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">Select a stock to view model insights</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Row 4: Watchlist ── */}
        <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '650ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-label flex items-center gap-2">
              <Star className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
              Watchlist
            </h3>
            <span className="neon-badge text-[10px]">{watchlist.length} saved</span>
          </div>

          {/* Add ticker input */}
          <div className="flex gap-2 mb-4">
            <input
              value={watchlistInput}
              onChange={(e) => setWatchlistInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleAddWatchlist()}
              placeholder="Add ticker (e.g. AAPL)"
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 font-mono"
            />
            <button
              onClick={handleAddWatchlist}
              disabled={!watchlistInput.trim()}
              className="px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-40"
              style={{
                background: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>

          {/* Watchlist items */}
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {watchlist.map((item: any) => (
                <button
                  key={item.ticker}
                  className="group relative flex items-center justify-between px-3 py-2.5 rounded-xl border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                  style={{ background: 'hsl(var(--secondary) / 0.5)' }}
                  onClick={() => selectTicker(item.ticker)}
                >
                  <span className="font-mono text-sm font-bold text-foreground">{item.ticker}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeTicker(item.ticker); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Star className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No tickers saved yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Add tickers above for quick access</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}