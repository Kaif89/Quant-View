import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, BarChart2, Shield, Zap, Brain, Layers, Code2, Database, GitBranch, Server, Cpu, Activity, LineChart, Workflow, BarChart3, Timer, Eye } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SmartHeader } from '@/components/SmartHeader';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ScrambleText } from '@/components/ScrambleText';
import { SplitText } from '@/components/SplitText';
import { MarqueeButton } from '@/components/MarqueeButton';

const EASE = [0.16, 1, 0.3, 1] as const;

const PRINCIPLES = [
  {
    icon: Shield,
    title: 'Full Transparency',
    desc: 'Every model metric — MSE, MAE, R², feature importances — is visible. No black boxes, ever.',
  },
  {
    icon: TrendingUp,
    title: 'Research-Grade',
    desc: 'Built for quantitative analysts who need to inspect, validate, and trust the math behind every prediction.',
  },
  {
    icon: Zap,
    title: 'Real-Time Data',
    desc: 'Live market data from Yahoo Finance and Finnhub. Every prediction uses the latest 2 years of OHLCV history.',
  },
  {
    icon: Brain,
    title: 'Dual-Model Ensemble',
    desc: 'XGBoost captures feature correlations. LSTM captures time-series patterns. Combined for superior accuracy.',
  },
];

const STACK = [
  { icon: Code2, name: 'React 18 + TypeScript', desc: 'Type-safe component architecture with Vite' },
  { icon: Layers, name: 'Tailwind + shadcn/ui', desc: 'Design system with dark/light theming' },
  { icon: BarChart2, name: 'Recharts', desc: 'Interactive financial chart visualizations' },
  { icon: Server, name: 'Spring Boot 3.4', desc: 'Java orchestration layer with caching' },
  { icon: Cpu, name: 'Python + Flask', desc: 'XGBoost + LSTM ML microservice' },
  { icon: Database, name: 'H2 / MySQL', desc: 'Prediction cache & watchlist persistence' },
];

const FEATURES_LIST = [
  { name: 'SMA-50', category: 'Trend', desc: '50-day Simple Moving Average — medium-term trend direction' },
  { name: 'SMA-200', category: 'Trend', desc: '200-day Simple Moving Average — long-term trend direction' },
  { name: 'RSI-14', category: 'Momentum', desc: 'Relative Strength Index — detects overbought/oversold conditions' },
  { name: 'MACD', category: 'Momentum', desc: 'Moving Average Convergence Divergence — momentum signal' },
  { name: 'MACD Signal', category: 'Momentum', desc: '9-day EMA of MACD — identifies crossover triggers' },
  { name: 'BB Upper', category: 'Volatility', desc: 'Bollinger Band upper — dynamic price ceiling (SMA₂₀ + 2σ)' },
  { name: 'BB Lower', category: 'Volatility', desc: 'Bollinger Band lower — dynamic price floor (SMA₂₀ − 2σ)' },
  { name: 'Daily Return', category: 'Price Action', desc: 'Percentage change from previous close' },
  { name: 'Volume Change', category: 'Price Action', desc: 'Volume momentum — conviction behind price moves' },
  { name: 'Lag-1', category: 'Memory', desc: 'Previous day closing price — strongest single predictor' },
  { name: 'Lag-2', category: 'Memory', desc: 'Price 2 days ago — short-term context' },
  { name: 'Lag-3', category: 'Memory', desc: 'Price 3 days ago — pattern recognition window' },
  { name: 'Lag-5', category: 'Memory', desc: 'Price 5 days ago — weekly lookback signal' },
];

const PIPELINE_STEPS = [
  { step: '01', title: 'Data Ingestion', desc: 'Fetch 2 years of daily OHLCV data from Yahoo Finance via yfinance', icon: Database },
  { step: '02', title: 'Feature Engineering', desc: 'Compute 13 technical indicators: SMA, RSI, MACD, Bollinger Bands, lags', icon: Workflow },
  { step: '03', title: 'XGBoost Training', desc: '200 gradient-boosted trees (depth 6, lr 0.05) learn feature correlations', icon: BarChart3 },
  { step: '04', title: 'LSTM Training', desc: '64-unit recurrent network learns 10-day sequential patterns over 150 epochs', icon: Brain },
  { step: '05', title: 'Ensemble Blend', desc: 'Final prediction = 60% XGBoost + 40% LSTM for best-of-both accuracy', icon: Layers },
  { step: '06', title: 'Metrics & Response', desc: 'Compute MSE, MAE, R² on held-out test set. Return prediction + importances', icon: Eye },
];

const TEAM = [
  { initials: 'KK', name: 'Kaif Khan', role: 'Frontend Dev · ML Engineer' },
  { initials: 'PD', name: 'Priyanshu Dubey', role: 'Backend Engineer · Java Spring Boot' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Trend': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Momentum': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Volatility': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Price Action': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'Memory': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 1.2, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-foreground selection:text-background">
        <SmartHeader />

        {/* ═══ HERO ═══ */}
        <section className="relative z-10 pt-28 pb-0 px-6 lg:px-16 lg:pt-40">
          <div className="w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="mb-10"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 border border-border text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                About · QuantView Research Lab
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-[96px] tracking-tighter leading-[0.9] mb-8">
              <div className="block font-bold">
                <ScrambleText text="The math" delay={0.2} duration={2.0} />
              </div>
              <div className="block font-bold">
                <ScrambleText text="behind the" delay={0.8} duration={2.0} />
              </div>
              <div className="block font-medium text-muted-foreground">
                <ScrambleText text="markets." delay={1.4} duration={2.2} />
              </div>
            </h1>

            <SplitText
              text="QuantView is a full-stack financial research platform powered by an XGBoost + LSTM ensemble model. It ingests real market data from Yahoo Finance, engineers 13 technical features, and generates transparent, auditable predictions with full metric visibility."
              className="text-muted-foreground text-lg max-w-2xl mb-12 font-normal leading-relaxed"
              delay={0.3}
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
              className="flex flex-wrap items-center gap-4"
            >
              <MarqueeButton to="/dashboard" variant="filled">
                Open Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </MarqueeButton>
              <MarqueeButton to="/" variant="outlined">
                Back to Home
              </MarqueeButton>
            </motion.div>
          </div>
        </section>

        {/* ═══ PRINCIPLES ═══ */}
        <section className="relative z-10 py-32 px-6 lg:px-16 border-t border-border mt-24">
          <div className="w-full flex flex-col lg:flex-row gap-16 lg:gap-24">
            <div className="lg:w-1/3 text-left">
              <FadeSection>
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Philosophy</div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95] mb-6">
                  <div className="block font-bold">
                    <ScrambleText text="No black" delay={0.2} duration={2.0} />
                  </div>
                  <div className="block font-bold">
                    <ScrambleText text="boxes." delay={0.8} duration={2.0} />
                  </div>
                  <div className="block font-medium text-muted-foreground">
                    <ScrambleText text="Ever." delay={1.4} duration={2.2} />
                  </div>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We believe financial tools should be transparent by default. If you can't inspect the model, you shouldn't trust the prediction.
                </p>
              </FadeSection>
            </div>

            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-px bg-border">
              {PRINCIPLES.map((p) => (
                <FadeSection key={p.title} className="p-8 bg-background group cursor-default">
                  <div className="w-10 h-10 flex items-center justify-center mb-6 border border-border text-foreground group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <p.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2 text-lg">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ ARCHITECTURE ═══ */}
        <section className="relative z-10 py-32 px-6 lg:px-16 border-t border-border">
          <div className="w-full flex flex-col lg:flex-row gap-16 lg:gap-24">
            <div className="lg:w-1/3 text-left">
              <FadeSection>
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Architecture</div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95] mb-6">
                  <div className="block font-bold">
                    <ScrambleText text="Three layers." delay={0.2} duration={2.0} />
                  </div>
                  <div className="block font-medium text-muted-foreground">
                    <ScrambleText text="One pipeline." delay={0.8} duration={2.2} />
                  </div>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  A distributed microservices architecture where React handles visualization, Spring Boot handles orchestration & caching, and Python runs the ML pipeline.
                </p>
              </FadeSection>
            </div>

            <div className="lg:w-2/3">
              <FadeSection>
                <div className="grid grid-cols-1 gap-4">
                  {/* Layer 1: Frontend */}
                  <div className="border border-border p-6 bg-background">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold">1</div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">React 18 + TypeScript</h4>
                        <p className="text-xs text-muted-foreground">Port 5173 · Client Layer</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Interactive dashboard with Recharts, TanStack Query for server state, SSE for live market stream, Clerk auth, dark/light theming.
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-px h-4 bg-border" />
                      <span className="text-[10px] font-mono tracking-wider uppercase">REST + SSE</span>
                      <div className="w-px h-4 bg-border" />
                    </div>
                  </div>

                  {/* Layer 2: Backend */}
                  <div className="border border-border p-6 bg-background">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">2</div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">Spring Boot 3.4 · Java 17</h4>
                        <p className="text-xs text-muted-foreground">Port 8080 · Orchestration Layer</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Input validation, CORS, request routing, DB-backed prediction cache (15-min TTL), watchlist CRUD, Finnhub WebSocket integration, SSE broadcasting.
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-px h-4 bg-border" />
                      <span className="text-[10px] font-mono tracking-wider uppercase">REST</span>
                      <div className="w-px h-4 bg-border" />
                    </div>
                  </div>

                  {/* Layer 3: Python */}
                  <div className="border border-border p-6 bg-background">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">3</div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">Python 3.10+ · Flask</h4>
                        <p className="text-xs text-muted-foreground">Port 5000 · Computation Engine</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      yfinance data ingestion, 13-feature engineering, XGBoost + LSTM ensemble training, prediction generation, metric computation. Fetches real OHLCV from Yahoo Finance.
                    </p>
                  </div>
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* ═══ ML PIPELINE ═══ */}
        <section className="relative z-10 py-32 px-6 lg:px-16 border-t border-border">
          <div className="w-full">
            <FadeSection>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">ML Pipeline</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95] mb-4">
                <div className="block font-bold">
                  <ScrambleText text="How predictions" delay={0.2} duration={2.0} />
                </div>
                <div className="block font-medium text-muted-foreground">
                  <ScrambleText text="are made." delay={0.8} duration={2.2} />
                </div>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-16">
                Every prediction goes through a 6-step pipeline. From raw Yahoo Finance data to a blended ensemble prediction — here's exactly what happens when you search a ticker.
              </p>
            </FadeSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {PIPELINE_STEPS.map((p, i) => (
                <FadeSection key={p.step} className="p-8 bg-background group cursor-default">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center border border-border text-foreground font-mono text-sm font-bold group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                      {p.step}
                    </div>
                    <p.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2 text-lg">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ MODEL DETAILS ═══ */}
        <section className="relative z-10 py-32 px-6 lg:px-16 border-t border-border">
          <div className="w-full flex flex-col lg:flex-row gap-16 lg:gap-24">
            <div className="lg:w-1/3 text-left">
              <FadeSection>
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">The Algorithm</div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95] mb-6">
                  <div className="block font-bold">
                    <ScrambleText text="XGBoost" delay={0.2} duration={2.0} />
                  </div>
                  <div className="block font-bold">
                    <ScrambleText text="+ LSTM" delay={0.6} duration={2.0} />
                  </div>
                  <div className="block font-medium text-muted-foreground">
                    <ScrambleText text="ensemble." delay={1.2} duration={2.2} />
                  </div>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Two models, combined. XGBoost learns which features matter. LSTM learns sequential price patterns. The weighted ensemble captures both.
                </p>
              </FadeSection>
            </div>

            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-px bg-border">
              {/* XGBoost Card */}
              <FadeSection className="p-8 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-500">XGBoost · 60% Weight</span>
                </div>
                <h3 className="font-medium text-foreground mb-4 text-lg">Gradient Boosted Trees</h3>
                <div className="space-y-2">
                  {[
                    ['Estimators', '200 sequential trees'],
                    ['Max Depth', '6 levels per tree'],
                    ['Learning Rate', '0.05 (slow = stable)'],
                    ['Subsample', '80% of data per tree'],
                    ['Strength', 'Feature correlations'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-mono text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </FadeSection>

              {/* LSTM Card */}
              <FadeSection className="p-8 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-500">LSTM · 40% Weight</span>
                </div>
                <h3 className="font-medium text-foreground mb-4 text-lg">Recurrent Neural Network</h3>
                <div className="space-y-2">
                  {[
                    ['Hidden Units', '64 memory cells'],
                    ['Window', '10-day sequences'],
                    ['Epochs', '150 training iterations'],
                    ['Optimizer', 'Adam (lr = 0.01)'],
                    ['Strength', 'Temporal patterns'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-mono text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </FadeSection>

              {/* Metrics Card */}
              <FadeSection className="p-8 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">Metrics</span>
                </div>
                <h3 className="font-medium text-foreground mb-4 text-lg">Evaluation on Held-Out Data</h3>
                <div className="space-y-2">
                  {[
                    ['Test Set', 'Last 30 days (never seen in training)'],
                    ['MSE', 'Mean Squared Error'],
                    ['MAE', 'Mean Absolute Error'],
                    ['R²', 'Coefficient of Determination'],
                    ['Typical R²', '0.90 – 0.99 for liquid stocks'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-mono text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </FadeSection>

              {/* Data Source Card */}
              <FadeSection className="p-8 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">Data Source</span>
                </div>
                <h3 className="font-medium text-foreground mb-4 text-lg">Real Market Data</h3>
                <div className="space-y-2">
                  {[
                    ['Source', 'Yahoo Finance (yfinance)'],
                    ['History', '2 years daily OHLCV'],
                    ['Markets', 'NYSE, NASDAQ, NSE, BSE, LSE'],
                    ['Live Feed', 'Finnhub WebSocket SSE'],
                    ['Cache', '15-min DB-backed TTL'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-mono text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </FadeSection>
            </div>
          </div>
        </section>

        {/* ═══ FEATURE ENGINEERING ═══ */}
        <section className="relative z-10 py-32 px-6 lg:px-16 border-t border-border">
          <div className="w-full">
            <FadeSection>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Feature Engineering</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95] mb-4">
                <div className="block font-bold">
                  <ScrambleText text="13 features" delay={0.2} duration={2.0} />
                </div>
                <div className="block font-medium text-muted-foreground">
                  <ScrambleText text="from raw OHLCV." delay={0.8} duration={2.2} />
                </div>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-16">
                Raw price data alone is insufficient for prediction. We derive 13 technical signals across 5 categories — each one mathematically computed from the open, high, low, close, and volume history.
              </p>
            </FadeSection>

            <FadeSection>
              <div className="border border-border divide-y divide-border">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-4 text-xs font-mono uppercase tracking-wider text-muted-foreground bg-muted/30">
                  <div className="col-span-2">Feature</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-8">Description</div>
                </div>
                {/* Rows */}
                {FEATURES_LIST.map((f) => (
                  <div key={f.name} className="grid grid-cols-12 gap-4 p-4 items-center group hover:bg-muted/20 transition-colors">
                    <div className="col-span-2">
                      <span className="font-mono text-sm font-medium text-foreground">{f.name}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${CATEGORY_COLORS[f.category] || 'text-muted-foreground border-border'}`}>
                        {f.category}
                      </span>
                    </div>
                    <div className="col-span-8">
                      <span className="text-sm text-muted-foreground">{f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ═══ TECH STACK ═══ */}
        <section className="relative z-10 py-32 px-6 lg:px-16 border-t border-border">
          <div className="w-full flex flex-col lg:flex-row gap-16 lg:gap-24">
            <div className="lg:w-1/3 text-left">
              <FadeSection>
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Stack</div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95] mb-6">
                  <div className="block font-bold">
                    <ScrambleText text="Built with" delay={0.2} duration={2.0} />
                  </div>
                  <div className="block font-medium text-muted-foreground">
                    <ScrambleText text="precision." delay={0.8} duration={2.2} />
                  </div>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  A three-tier full-stack architecture spanning React, Java, and Python — unified by REST APIs and designed for real-time financial computation.
                </p>
              </FadeSection>
            </div>

            <div className="lg:w-2/3 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {STACK.map((s) => (
                <FadeSection key={s.name} className="p-6 bg-background group cursor-default">
                  <div className="w-8 h-8 flex items-center justify-center mb-4 border border-border text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <s.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1 text-sm">{s.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ DATA DISCLAIMER ═══ */}
        <section className="relative z-10 border-t border-b border-border py-20 px-6 lg:px-16 bg-background">
          <FadeSection className="w-full max-w-3xl">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Disclaimer</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[0.95] mb-6">
              Research tool, not financial advice.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              All predictions are based on mathematical models applied to historical market data from{' '}
              <code className="font-mono text-xs bg-muted px-2 py-1 border border-border">
                Yahoo Finance
              </code>
              . The XGBoost + LSTM ensemble achieves R² scores of 0.90–0.99 on liquid stocks, but past performance does not guarantee future results.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              Every metric — MSE, MAE, R², and feature importances — is displayed so you can judge model confidence yourself. Always do your own research before making any financial decisions.
            </p>
          </FadeSection>
        </section>

        {/* ═══ TEAM ═══ */}
        <section className="relative z-10 py-32 px-6 lg:px-16">
          <FadeSection className="w-full flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            <div className="lg:w-1/3 text-left">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Team</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95]">
                <div className="block font-bold">
                  <ScrambleText text="The people" delay={0.2} duration={2.0} />
                </div>
                <div className="block font-medium text-muted-foreground">
                  <ScrambleText text="behind it." delay={0.8} duration={2.2} />
                </div>
              </h2>
            </div>

            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-px bg-border">
              {TEAM.map((m) => (
                <div key={m.name} className="p-6 bg-background flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 flex items-center justify-center text-base font-bold border border-border text-foreground">
                    {m.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeSection>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative z-10 py-40 px-6 lg:px-16 border-t border-border">
          <FadeSection className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-left max-w-xl">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Get Started</div>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.95] mb-6">
                <div className="block font-bold">
                  <ScrambleText text="See the math." delay={0.2} duration={2.0} />
                </div>
                <div className="block font-medium text-muted-foreground">
                  <ScrambleText text="Trust the model." delay={0.8} duration={2.2} />
                </div>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Search any ticker. See real predictions powered by XGBoost + LSTM. Inspect every metric.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:justify-end shrink-0">
              <MarqueeButton to="/dashboard" variant="filled" className="h-14 px-10 text-sm">
                Explore Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </MarqueeButton>
              <MarqueeButton to="/" variant="outlined" className="h-14 px-8 text-sm">
                Back to Home
              </MarqueeButton>
            </div>
          </FadeSection>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="relative z-10 border-t border-border py-10 px-6 lg:px-16">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="w-5 h-5 flex items-center justify-center text-[10px] font-medium bg-foreground text-background">Q</span>
              © {new Date().getFullYear()} QuantView Financial Technologies Inc.
            </div>
            <div className="flex items-center gap-8 text-xs text-muted-foreground uppercase tracking-widest">
              {[['About', '/about'], ['Privacy', '#'], ['Terms', '#'], ['Sign in', '/login']].map(([l, h]) =>
                h.startsWith('/') && h !== '#'
                  ? <Link key={l} to={h} className="hover:text-foreground transition-colors">{l}</Link>
                  : <a key={l} href={h} className="hover:text-foreground transition-colors">{l}</a>
              )}
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
