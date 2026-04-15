import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, TrendingDown, BarChart2, Shield, Zap, Bell, Layers, Search, User } from 'lucide-react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { SmoothScroll } from '@/components/SmoothScroll';
import { MarqueeButton } from '@/components/MarqueeButton';
import { LiveClock } from '@/components/LiveClock';
import { SmartHeader } from '@/components/SmartHeader';
import { SplitText } from '@/components/SplitText';
import { CountUpStat } from '@/components/CountUpStat';
import { ScrambleText } from '@/components/ScrambleText';
import { useState, useEffect, useRef } from 'react';

/* ─── static mock data ─── */
const CHART_POINTS = [82,78,84,80,91,88,95,90,98,94,102,99,108,105,112,109,117,114,120,118,126,122,130,128,136,132,140];
const W = 400, H = 110;
const minP = Math.min(...CHART_POINTS), maxP = Math.max(...CHART_POINTS), range = maxP - minP || 1;
const pts = CHART_POINTS.map((v, i) => [
  (i / (CHART_POINTS.length - 1)) * W,
  H - ((v - minP) / range) * (H - 16) - 8,
] as [number, number]);
const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ');
const areaPath = `M${pts[0][0]},${H} ` + pts.map(([x, y]) => `L${x},${y}`).join(' ') + ` L${pts[pts.length - 1][0]},${H} Z`;

const PEERS = [
  { t: 'AAPL', v: 78 },
  { t: 'MSFT', v: 85 },
  { t: 'NVDA', v: 94 },
  { t: 'TSLA', v: 45 },
];

const STOCKS = [
  { t: 'AAPL', p: '$342.87', d: '+2.14%', up: true },
  { t: 'MSFT', p: '$415.22', d: '+1.87%', up: true },
  { t: 'NVDA', p: '$892.40', d: '+4.32%', up: true },
  { t: 'TSLA', p: '$248.75', d: '-1.23%', up: false },
  { t: 'GOOGL', p: '$178.90', d: '+0.98%', up: true },
  { t: 'AMZN', p: '$198.15', d: '-0.44%', up: false },
];

const FEATURES = [
  { icon: TrendingUp, title: 'Regression Overlays', desc: 'Linear regression lines rendered directly on price charts with full coefficient transparency.' },
  { icon: BarChart2, title: 'Real-Time Markets', desc: 'Live price feeds from 50+ tickers across equity, ETF, and crypto markets in one dashboard.' },
  { icon: Shield, title: 'Model Confidence', desc: 'MSE-based scoring tells you exactly when to trust the model prediction — and when not to.' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Trigger notifications on price deviation, prediction divergence, or volatility spikes.' },
  { icon: Zap, title: 'Instant KPIs', desc: 'Every key metric — price, prediction, delta, MSE — rendered in milliseconds.' },
  { icon: Layers, title: 'Peer Benchmarking', desc: 'Benchmark any ticker against sector peers by revenue growth and 7-day return.' },
];

const REVIEWS = [
  { q: 'QuantView replaced three internal tools. The regression overlay saves hours of manual charting every week.', n: 'Sarah Chen', r: 'Quant Analyst, Meridian Capital', av: 'SC' },
  { q: "Finally a dashboard that doesn't hide the math. I trust predictions because I can inspect every coefficient.", n: 'Marcus Webb', r: 'Portfolio Manager', av: 'MW' },
  { q: 'The transparent approach is refreshing. Our whole team switched within a week of the trial.', n: 'Priya Patel', r: 'Data Scientist, FinLab', av: 'PP' },
  { q: 'Easily the most responsive terminal interface I have ever used. Puts legacy software to shame.', n: 'David Kim', r: 'Senior Trader', av: 'DK' },
];

/* ─── animation presets (HG philosophy) ─── */
const EASE = [0.16, 1, 0.3, 1] as const;

const lineReveal = {
  hidden: { y: '100%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 1.2, ease: EASE, delay: i * 0.08 },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: EASE, delay: i * 0.08 },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Line Reveal component ─── */
function RevealLine({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className="block overflow-hidden pb-2">
      <motion.span
        className="block"
        variants={lineReveal}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={index}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ─── Mockup live clock ─── */
function MockupClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const formatted = time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZoneName: 'short',
  });
  return <span className="tabular-nums">{formatted}</span>;
}


export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-foreground selection:text-background">

        {/* ─── SCROLL PROGRESS BAR ─── */}
        <motion.div
          style={{ scaleX }}
          className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left bg-foreground"
        />

        {/* ═══════════════════════════════════════════
            NAV — 3-state scroll-aware header
        ═══════════════════════════════════════════ */}
        <SmartHeader />

        {/* ═══════════════════════════════════════════
            HERO — line-by-line text reveal + dashboard
        ═══════════════════════════════════════════ */}
        <section className="relative z-10 pt-28 pb-0 px-6 lg:px-16 lg:pt-36">
          <div className="w-full flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 text-left w-full lg:w-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE }}
                className="mb-10"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 border border-border text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                  AI-Powered · Real-Time · Transparent
                </div>
              </motion.div>

              {/* Giant headline — line-by-line reveal */}
              <h1 className="text-6xl md:text-8xl lg:text-[110px] tracking-tighter leading-[0.9] mb-8">
                <div className="block font-bold">
                  <ScrambleText text="Quant" delay={0.2} duration={2.0} />
                </div>
                <div className="block font-bold">
                  <ScrambleText text="Finance" delay={0.8} duration={2.0} />
                </div>
                <div className="block font-medium text-muted-foreground">
                  <ScrambleText text="Reimagined" delay={1.4} duration={2.2} />
                </div>
              </h1>

              <SplitText 
                text="Regression overlays. Live price feeds. Portfolio analytics. All in one terminal built for serious traders and quant teams."
                className="text-muted-foreground text-lg max-w-lg mb-10 font-normal leading-relaxed"
                delay={0.3}
              />

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
                className="flex flex-wrap items-center gap-4 mb-0"
              >
                <MarqueeButton to="/signup" variant="filled">
                  Get early access <ArrowRight className="w-4 h-4 ml-2" />
                </MarqueeButton>
                <MarqueeButton to="/dashboard" variant="outlined">
                  Open live dashboard
                </MarqueeButton>
              </motion.div>

              {/* Live Clock */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: EASE }}
              >
                <LiveClock />
              </motion.div>
            </motion.div>

            {/* ─── DASHBOARD MOCKUP ─── */}
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0, ease: EASE }}
              className="flex-[1.4] w-full relative"
            >
              <div className="relative overflow-hidden border border-border bg-card w-full shadow-2xl">

                {/* Window chrome */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(0,80%,56%)]" />
                    <div className="w-3 h-3 rounded-full bg-[hsl(45,95%,55%)]" />
                    <div className="w-3 h-3 rounded-full bg-[hsl(152,80%,48%)]" />
                    <span className="ml-3 text-xs text-muted-foreground font-mono">quantview.app/dashboard</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span className="text-foreground">● LIVE</span>
                    <MockupClock />
                  </div>
                </div>

                {/* Dashboard body */}
                <div className="grid grid-cols-12 gap-0 divide-x divide-border bg-background">

                  {/* Sidebar */}
                  <div className="col-span-1 flex flex-col items-center py-5 gap-5 bg-muted/10">
                    <div className="w-8 h-8 flex items-center justify-center text-sm font-medium tracking-tighter border border-border bg-foreground text-background">Q</div>
                    {[BarChart2, TrendingUp, Shield, Layers].map((Icon, i) => (
                      <div key={i} className={`w-8 h-8 flex items-center justify-center ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    ))}
                  </div>

                  {/* Main area */}
                  <div className="col-span-8 flex flex-col">
                    {/* Ticker strip */}
                    <div className="flex items-center gap-4 px-5 py-3 border-b border-border overflow-hidden bg-muted/10">
                      {STOCKS.map(s => (
                        <div key={s.t} className="flex items-center gap-2 shrink-0 text-xs">
                          <span className="font-medium text-foreground">{s.t}</span>
                          <span className="font-mono text-muted-foreground">{s.p}</span>
                          <span className={s.up ? 'text-foreground' : 'text-muted-foreground'}>{s.d}</span>
                        </div>
                      ))}
                    </div>

                    {/* KPI row */}
                    <div className="grid grid-cols-3 gap-0 border-b border-border divide-x divide-border">
                      {[
                        { label: 'Current Price', value: '$342.87', sub: '+2.14% today' },
                        { label: 'T+1 Prediction', value: '$351.40', sub: 'Linear regression' },
                        { label: 'Model MSE', value: '2.41', sub: 'High confidence' },
                      ].map(k => (
                        <div key={k.label} className="p-5 flex flex-col justify-between bg-background">
                          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-4">{k.label}</div>
                          <div className="text-3xl font-medium tracking-tighter mb-1 text-foreground">{k.value}</div>
                          <div className="h-px w-8 bg-border my-2" />
                          <div className="text-xs text-muted-foreground">{k.sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Chart area */}
                    <div className="p-5 flex-1 bg-background">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <span className="text-xl font-medium tracking-tighter text-foreground">AAPL</span>
                          <span className="text-xs text-muted-foreground ml-3 uppercase tracking-widest">Technology</span>
                        </div>
                        <div className="flex border border-border">
                          {['1D','7D','1M','6M','1Y'].map((r, i) => (
                            <span key={r} className={`text-xs px-3 py-1.5 uppercase font-medium ${i === 2 ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
                        <defs>
                          <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {[0.25,0.5,0.75].map(f => (
                          <line key={f} x1="0" y1={H * f} x2={W} y2={H * f} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3,3" />
                        ))}
                        <path d={areaPath} fill="url(#hg)" />
                        <polyline points={polyline} fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
                        <polyline
                          points={pts.slice(Math.floor(pts.length * 0.6)).map(([x, y]) => `${x},${y - 6}`).join(' ')}
                          fill="none" stroke="hsl(var(--foreground))" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill="hsl(var(--foreground))" />
                      </svg>
                    </div>
                  </div>

                  {/* Right panel */}
                  <div className="col-span-3 flex flex-col gap-0 divide-y divide-border bg-muted/5">
                    <div className="p-5">
                      <div className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">Allocation</div>
                      {[
                        { n: 'Technology', v: 42 },
                        { n: 'Healthcare', v: 18 },
                        { n: 'Finance', v: 15 },
                        { n: 'Energy', v: 12 },
                        { n: 'Consumer', v: 13 },
                      ].map(({ n, v }) => (
                        <div key={n} className="flex items-center gap-3 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                          <span className="text-xs text-muted-foreground flex-1">{n}</span>
                          <span className="text-xs font-mono font-medium text-foreground">{v}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-5">
                      <div className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">Peers</div>
                      {PEERS.map(({ t, v }) => (
                        <div key={t} className="mb-3">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-medium text-foreground">{t}</span>
                            <span className="font-mono text-muted-foreground">{v}%</span>
                          </div>
                          <div className="h-px w-full bg-border overflow-hidden">
                            <div className="h-full bg-foreground" style={{ width: `${v}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-widest">Model</span>
                        <span className="text-[10px] px-2 py-0.5 border border-foreground text-foreground uppercase">High</span>
                      </div>
                      {[['Algorithm','Linear Regression'],['MSE','2.4106'],['T+1','$351.40']].map(([k,v]) => (
                        <div key={k} className="flex justify-between text-xs mb-2">
                          <span className="text-muted-foreground">{k}</span>
                          <span className="font-mono text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            STATS STRIP — staggered number reveals
        ═══════════════════════════════════════════ */}
        <section className="relative z-10 border-t border-b border-border py-16 px-6 lg:px-16 mt-24 bg-background">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <CountUpStat 
              target={50} 
              suffix="+" 
              label="Assets tracked" 
              delay={0}
            />
            <CountUpStat 
              target={5} 
              prefix="<" 
              suffix="ms" 
              label="Data latency" 
              delay={0.2}
            />
            <CountUpStat 
              target={99.9} 
              suffix="%" 
              decimals={1} 
              label="Uptime SLA" 
              delay={0.4}
            />
            <CountUpStat 
              target={3} 
              suffix="×" 
              label="Faster than spreadsheets" 
              delay={0.6}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FEATURES — flat border cards, subtle hover
        ═══════════════════════════════════════════ */}
        <section id="features" className="relative z-10 py-32 px-6 lg:px-16">
          <div className="w-full flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Left header */}
            <div className="lg:w-1/3 text-left">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: EASE }}
              >
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Features</div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95] mb-6">
                  <div className="block font-bold">
                    <ScrambleText text="The full" delay={0.2} duration={2.0} />
                  </div>
                  <div className="block font-bold">
                    <ScrambleText text="arsenal." delay={0.8} duration={2.0} />
                  </div>
                  <div className="block font-medium text-muted-foreground">
                    <ScrambleText text="Nothing held back." delay={1.4} duration={2.2} />
                  </div>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Access institutional-grade tools previously reserved for hedge funds. Built directly into a lightning-fast web interface.
                </p>
              </motion.div>
            </div>

            {/* Cards grid */}
            <div
              className="lg:w-2/3 grid sm:grid-cols-2 gap-px bg-border"
            >
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="p-8 bg-background group cursor-default"
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-6 border border-border text-foreground group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2 text-lg">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TESTIMONIALS — monochrome, typographic
        ═══════════════════════════════════════════ */}
        <section className="relative z-10 py-32 px-6 lg:px-16 border-t border-border">
          <div className="w-full flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            <div className="lg:w-1/3 text-left">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: EASE }}
              >
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Social Proof</div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95]">
                  <div className="block font-bold">
                    <ScrambleText text="Trusted by" delay={0.2} duration={2.0} />
                  </div>
                  <div className="block font-medium text-muted-foreground">
                    <ScrambleText text="quant teams." delay={0.8} duration={2.2} />
                  </div>
                </h2>
              </motion.div>
            </div>

            <div
              className="lg:w-2/3 grid md:grid-cols-2 gap-px bg-border"
            >
              {REVIEWS.map((r, i) => (
                <div
                  key={r.n}
                  className="p-8 bg-background flex flex-col gap-6"
                >
                  {/* Large typographic quote mark */}
                  <span className="text-6xl leading-none text-border font-medium select-none">"</span>
                  <p className="text-sm text-foreground/90 leading-relaxed flex-1">{r.q}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-9 h-9 flex items-center justify-center text-xs font-medium border border-border text-foreground">
                      {r.av}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.n}</p>
                      <p className="text-xs text-muted-foreground">{r.r}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CTA — no glow, marquee buttons
        ═══════════════════════════════════════════ */}
        <section className="relative z-10 py-40 px-6 lg:px-16 border-t border-border">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="w-full flex flex-col lg:flex-row items-center justify-between gap-12"
          >
            <div className="text-left max-w-xl">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Get Started</div>
              <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.95] mb-6">
                <div className="block font-bold">
                  <ScrambleText text="Stop guessing." delay={0.2} duration={2.0} />
                </div>
                <div className="block font-medium text-muted-foreground">
                  <ScrambleText text="Start knowing." delay={0.8} duration={2.2} />
                </div>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">The first financial tool you'll love. And the last one you'll ever need.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:justify-end shrink-0">
              <MarqueeButton to="/signup" variant="filled" className="h-14 px-10 text-sm">
                Join the waitlist <ArrowRight className="w-5 h-5 ml-2" />
              </MarqueeButton>
              <MarqueeButton to="/dashboard" variant="outlined" className="h-14 px-8 text-sm">
                Explore dashboard
              </MarqueeButton>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            FOOTER — clean grid
        ═══════════════════════════════════════════ */}
        <footer className="relative z-10 border-t border-border py-10 px-6 lg:px-16">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="w-5 h-5 flex items-center justify-center text-[10px] font-medium bg-foreground text-background">Q</span>
              © {new Date().getFullYear()} QuantView Financial Technologies Inc.
            </div>
            <div className="flex items-center gap-8 text-xs text-muted-foreground uppercase tracking-widest">
              {[['About','/about'],['Privacy','#'],['Terms','#'],['Sign in','/login']].map(([l,h]) =>
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
