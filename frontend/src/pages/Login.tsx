import { useLocation, Link, useNavigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CLERK_PUBLISHABLE_KEY } from '@/config/clerk';
import { Button } from '@/components/ui/button';
import { SplitText } from '@/components/SplitText';
import { ScrambleText } from '@/components/ScrambleText';

function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/* ─── animation presets ─── */
const EASE = [0.16, 1, 0.3, 1] as const;

const lineReveal = {
  hidden: { y: '100%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 1.2, ease: EASE, delay: i * 0.08 },
  }),
};

function RevealLine({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <span ref={ref} className="block overflow-hidden pb-2">
      <motion.span
        className="block"
        variants={lineReveal}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        custom={index}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Custom Clerk styling to match the Home page theme
const clerkAppearance = {
  variables: {
    colorPrimary: 'hsl(var(--foreground))',
    colorBackground: 'hsl(var(--card))',
    colorText: 'hsl(var(--foreground))',
    colorDanger: 'hsl(0 80% 56%)',
    colorInputBackground: 'hsl(var(--background))',
    colorInputText: 'hsl(var(--foreground))',
    colorTextSecondary: 'hsl(var(--muted-foreground))',
    fontFamily: 'inherit',
    borderRadius: '0px',
  },
  elements: {
    card: 'shadow-none rounded-none w-full max-w-lg',
    headerTitle: 'text-3xl font-medium tracking-tighter text-[hsl(var(--foreground))] mb-2',
    headerSubtitle: 'text-sm text-[hsl(var(--muted-foreground))]',
    socialButtonsBlockButton: 'bg-[hsl(var(--muted))]/10 hover:bg-[hsl(var(--muted))] transition-colors rounded-none h-12 text-sm font-medium',
    socialButtonsBlockButtonText: 'font-medium text-[hsl(var(--foreground))]',
    socialButtonsProviderIcon: 'opacity-70',
    dividerLine: 'bg-[hsl(var(--border))]',
    dividerText: 'text-xs text-[hsl(var(--muted-foreground))] font-medium tracking-widest uppercase',
    formFieldLabel: 'text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-semibold mb-2',
    formFieldInput: 'bg-[hsl(var(--muted))]/10 focus:bg-[hsl(var(--muted))]/20 transition-colors rounded-none h-14 px-4 text-sm text-[hsl(var(--foreground))]',
    formButtonPrimary: 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] hover:opacity-90 font-medium rounded-none h-14 text-sm',
    footerActionText: 'text-sm text-[hsl(var(--muted-foreground))]',
    footerActionLink: 'text-sm text-[hsl(var(--foreground))] hover:underline font-medium',
    identityPreviewText: 'text-sm text-[hsl(var(--foreground))]',
    identityPreviewEditButton: 'text-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))]/80',
    formFieldWarningText: 'text-xs text-[hsl(var(--muted-foreground))]',
    formFieldErrorText: 'text-xs',
    otpCodeFieldInput: 'bg-[hsl(var(--muted))]/10 focus:bg-[hsl(var(--muted))]/20 rounded-none',
  }
};

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname.startsWith('/signup');
  const inIframe = isInIframe();

  return (
    <div className="h-screen overflow-hidden flex bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-8 lg:p-12 border-r border-border relative overflow-hidden bg-background">
        
        {/* Top — Logo and Back button */}
        <div className="relative z-10 flex flex-col items-start gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center justify-center w-10 h-10 border border-border text-foreground hover:bg-foreground hover:text-background transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <Link to="/" className="inline-flex items-center gap-3 text-xl font-medium tracking-tighter hover:opacity-80 transition-opacity">
            <span className="w-6 h-6 flex items-center justify-center text-[10px] font-medium bg-foreground text-background">Q</span>
            QuantView
          </Link>
        </div>

        {/* Center — Pitch */}
        <div className="relative z-10 py-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-border text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
              Secure Authentication
            </div>
          </motion.div>

          <h1 className="text-4xl lg:text-6xl tracking-tighter leading-[0.9] mb-6">
            <div className="block font-bold">
              <ScrambleText text="Access the" delay={0.2} duration={2.0} />
            </div>
            <div className="block font-bold">
              <ScrambleText text="platform" delay={0.8} duration={2.0} />
            </div>
            <div className="block font-medium text-muted-foreground">
              <ScrambleText text="you deserve." delay={1.4} duration={2.0} />
            </div>
          </h1>
          
          <SplitText 
            text="Gain immediate access to AI-driven analytics, regression overlays, and real-time portfolio tools in one unified dashboard."
            className="text-muted-foreground text-base max-w-md mb-8 font-normal leading-relaxed"
            delay={0.3}
          />
        </div>

        {/* Bottom — Review/Social Proof */}
        <div className="relative z-10 mt-auto pt-6 border-t border-border">
          <p className="text-xs text-foreground/90 leading-relaxed max-w-md mb-4 relative">
            <span className="text-2xl absolute -top-3 -left-2 text-border font-serif select-none">"</span>
            QuantView replaced three internal tools. The regression overlay saves hours of manual charting every week.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-[10px] font-medium border border-border text-foreground">
              SC
            </div>
            <div>
              <p className="text-xs font-medium text-foreground tracking-tight">Sarah Chen</p>
              <p className="text-[10px] text-muted-foreground">Quant Analyst, Meridian Capital</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — auth form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative bg-muted/5">
        
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link to="/" className="inline-flex items-center gap-3 text-xl font-medium tracking-tighter hover:opacity-80 transition-opacity">
            <span className="w-6 h-6 flex items-center justify-center text-[10px] font-medium bg-foreground text-background">Q</span>
            QuantView
          </Link>
        </div>

        {!CLERK_PUBLISHABLE_KEY ? (
          <div className="border border-border bg-background p-10 max-w-sm w-full text-left space-y-4 shadow-2xl">
            <div className="w-10 h-10 flex items-center justify-center border border-border text-foreground mb-6">
              !
            </div>
            <h2 className="text-2xl font-medium tracking-tighter text-foreground">Auth Key Missing</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Please set your Clerk publishable key in the environment variables to enable authentication.</p>
            <div className="bg-muted/10 border border-border p-4 mt-6 overflow-hidden">
              <p className="font-mono text-xs text-muted-foreground truncate">VITE_CLERK_PUBLISHABLE_KEY=pk_...</p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            className="w-full flex justify-center"
          >
            <div className="w-full max-w-[400px]">
              {inIframe && (
                <div className="mb-6 p-4 border border-foreground text-foreground bg-background text-sm flex flex-col gap-3 shadow-xl">
                  <p>OAuth sign-in methods may be restricted inside this preview iframe.</p>
                  <Button
                    variant="outline"
                    className="gap-2 h-10 rounded-none border-foreground hover:bg-foreground hover:text-background transition-colors"
                    onClick={() => window.open(window.location.href, '_blank')}
                  >
                    Open in new tab <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="[&_.cl-card]:p-10 [&_.cl-card]:bg-background">
                {isSignup ? (
                  <SignUp
                    routing="path"
                    path="/signup"
                    signInUrl="/login"
                    afterSignUpUrl="/dashboard"
                    appearance={clerkAppearance}
                  />
                ) : (
                  <SignIn
                    routing="path"
                    path="/login"
                    signUpUrl="/signup"
                    afterSignInUrl="/dashboard"
                    appearance={clerkAppearance}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
