import { Logo } from '@/components/ui/Logo';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { UserDropdown } from '@/components/UserDropdown';

/* ─── Marquee CTA button ─── */
function MarqueeCTA({ to, children, className = '', style }: { to: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <Link
      to={to}
      style={style}
      className={`group relative inline-flex items-center justify-center overflow-hidden bg-foreground text-background text-xs font-medium uppercase tracking-widest transition-colors hover:bg-foreground/90 ${className}`}
    >
      <span
        className="flex items-center gap-2 transition-transform duration-500 group-hover:-translate-y-[120%]"
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {children}
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center gap-2 translate-y-[120%] transition-transform duration-500 group-hover:translate-y-0"
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {children}
      </span>
    </Link>
  );
}

/*
 * 2-State Floating Header
 * ────────────────────────
 * TOP:      Full-width, transparent bg, spacious padding, no border
 * SCROLLED: Floating pill with side margins, frosted glass, compact, rounded, subtle border
 * NEVER hides — always sticky visible
 */

export function SmartHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /*
   * Color inversion logic:
   * Light mode + scrolled → dark pill (dark bg, light text)
   * Dark mode  + scrolled → light pill (light bg, dark text)
   * At top → transparent, normal theme colors
   */
  const pillBg = scrolled
    ? isDark ? 'rgba(250, 250, 250, 0.92)' : 'rgba(10, 10, 10, 0.92)'
    : 'transparent';
  const pillText = scrolled
    ? isDark ? '#0a0a0a' : '#fafafa'
    : undefined; // inherit
  const pillBorder = scrolled
    ? isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'
    : 'transparent';
  const pillDivider = scrolled
    ? isDark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)'
    : undefined;
  const pillMuted = scrolled
    ? isDark ? 'rgba(10,10,10,0.5)' : 'rgba(250,250,250,0.5)'
    : undefined;
  // CTA button inverts: in scrolled pill, bg becomes the pill text color
  const ctaBg = scrolled
    ? isDark ? '#0a0a0a' : '#fafafa'
    : undefined;
  const ctaText = scrolled
    ? isDark ? '#fafafa' : '#0a0a0a'
    : undefined;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50"
      style={{
        padding: scrolled ? '8px 24px' : '0px 0px',
        transition: 'padding 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          backgroundColor: pillBg,
          backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
          borderRadius: scrolled ? '12px' : '0px',
          border: `1px solid ${pillBorder}`,
          boxShadow: scrolled ? '0 4px 30px hsl(0 0% 0% / 0.08)' : 'none',
          color: pillText,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="w-full flex items-center justify-between px-6 lg:px-8"
          style={{
            height: scrolled ? '52px' : '72px',
            transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* ─── LEFT: Logo + Nav ─── */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="flex items-center gap-2 font-medium tracking-tighter"
              style={{
                fontSize: scrolled ? '18px' : '22px',
                transition: 'font-size 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                className={`flex items-center justify-center ${scrolled ? '' : 'bg-foreground text-background'}`}
                style={{
                  width: scrolled ? '26px' : '30px',
                  height: scrolled ? '26px' : '30px',
                  borderRadius: scrolled ? '6px' : '0px',
                  backgroundColor: scrolled ? (pillText || '') : '',
                  color: scrolled ? (pillBg === 'transparent' ? '' : pillBg) : '',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                  <Logo style={{ 
                      width: scrolled ? '16px' : '20px',
                      height: scrolled ? '16px' : '20px',
                      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}/>
              </div>
              QuantView
            </Link>

            {/* Nav links with subtle dividers */}
            <div className="hidden md:flex items-center gap-0">
              {[
                ['About', '/about'],
                ['Dashboard', '/dashboard'],
                ['Features', '#features'],
              ].map(([label, href], i) => (
                <div key={label} className="flex items-center">
                  {i > 0 && <span className="w-px h-4 mx-4" style={{ backgroundColor: pillDivider || 'hsl(var(--border))' }} />}
                  {href.startsWith('#') ? (
                    <a
                      href={href}
                      className="text-[13px] font-medium transition-colors"
                      style={{ color: pillMuted, opacity: 0.7 }}
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      to={href}
                      className="text-[13px] font-medium transition-colors"
                      style={{ color: pillMuted, opacity: 0.7 }}
                    >
                      {label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── RIGHT: CTA + Actions ─── */}
          <div className="flex items-center gap-3">
            <ThemeToggle className={scrolled ? '' : 'text-muted-foreground hover:text-foreground'} />
            <MarqueeCTA
              to="/signup"
              className="hidden sm:inline-flex h-8 px-5 rounded-sm"
              style={scrolled ? { backgroundColor: ctaBg, color: ctaText } : undefined}
            >
              → Let's Work Together
            </MarqueeCTA>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
