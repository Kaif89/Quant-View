import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, BarChart2, Shield, Zap, Bell, Layers, Code2, Database, GitBranch } from 'lucide-react';
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
    desc: 'Every model coefficient, MSE score, and prediction formula is visible and auditable. No black boxes.',
  },
  {
    icon: TrendingUp,
    title: 'Research-Grade',
    desc: 'Built for quantitative analysts who need to inspect, validate, and trust the math behind every prediction.',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    desc: 'Every key metric — price, prediction, delta, MSE — rendered in milliseconds with zero lag.',
  },
  {
    icon: BarChart2,
    title: 'Visual Precision',
    desc: 'Regression overlays rendered directly on live price charts with full coefficient transparency.',
  },
];

const STACK = [
  { icon: Code2, name: 'React 18 + TypeScript', desc: 'Type-safe component architecture' },
  { icon: Layers, name: 'Tailwind CSS', desc: 'Design token system with dark mode' },
  { icon: BarChart2, name: 'Recharts', desc: 'Performant data visualization' },
  { icon: Bell, name: 'shadcn/ui', desc: 'Accessible component primitives' },
  { icon: Database, name: 'Mock Runtime Data', desc: 'No backend required' },
  { icon: GitBranch, name: 'Framer Motion', desc: 'Spring-based animations' },
];

const TEAM = [
  { initials: 'KK', name: 'Kaif Khan', role: 'Frontend Dev · ML Engineer' },
  { initials: 'PD', name: 'Priyanshu Dubey', role: 'Backend Engineer · Java Spring Boot' },
];

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
              text="QuantView is a transparent financial research dashboard that exposes the math behind market predictions. Unlike black-box trading platforms, every model coefficient, MSE score, and prediction formula is visible and auditable."
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
                  A modern, type-safe frontend stack designed for speed, accessibility, and visual fidelity. All data is mock — this is a pure frontend demonstration.
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

        {/* ═══ MOCK DATA NOTE ═══ */}
        <section className="relative z-10 border-t border-b border-border py-20 px-6 lg:px-16 bg-background">
          <FadeSection className="w-full max-w-3xl">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">Data Source</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[0.95] mb-6">
              Runtime-generated mock data
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              All stock data is generated at runtime from{' '}
              <code className="font-mono text-xs bg-muted px-2 py-1 border border-border">
                src/mocks/sample-stocks.ts
              </code>
              . Edit model coefficients and MSE values there to test different prediction scenarios.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              No backend, no API keys, no external dependencies. Clone the repo and run{' '}
              <code className="font-mono text-xs bg-muted px-2 py-1 border border-border">
                npm run dev
              </code>{' '}
              to start.
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
                The first financial tool where every prediction is fully transparent and auditable.
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
