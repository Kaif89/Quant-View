import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useTheme, ThemeContext } from '@/hooks/useTheme';

/**
 * ThemeTransitionManager
 * 
 * Implements the "Neutral Root" Snapshot strategy:
 * 1. Captures a visual snapshot of the current theme.
 * 2. Neutralizes the root (html/body) theme classes to prevent specificity overrides.
 * 3. Scopes themes locally to two layers:
 *    - Bottom: The "Snapshot" layer with the OLD theme.
 *    - Top: The "Live" layer with the NEW theme, revealed via clip-path.
 * 4. Animates via direct DOM manipulation for 60fps performance.
 */
export function ThemeTransitionManager({ children }: { children: React.ReactNode }) {
  const { 
    isTransitioning, 
    transitionTarget, 
    transitionPoint, 
    endTransition, 
    theme,
    setTheme,
    toggleTheme,
    startTransition
  } = useTheme();
  
  const [snapshot, setSnapshot] = useState<{ html: string; theme: string } | null>(null);
  const liveAppRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Capture snapshot and neutralize root
  useLayoutEffect(() => {
    if (isTransitioning && !snapshot && liveAppRef.current) {
      console.log(`[QV-Debug] Neutralizing Root for transition to: ${transitionTarget}`);
      
      // Capture
      setSnapshot({
        html: liveAppRef.current.innerHTML,
        theme: theme
      });

      // Neutralize Root immediately to allow local scoping
      document.documentElement.classList.remove('light', 'dark');
    }
  }, [isTransitioning, theme, snapshot, transitionTarget]);

  // High-performance animation loop
  useEffect(() => {
    if (isTransitioning && transitionTarget && snapshot && liveAppRef.current) {
      const startTime = performance.now();
      const duration = 700;
      const { x, y } = transitionPoint;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const maxRadius = Math.hypot(Math.max(x, W - x), Math.max(y, H - y));
      const el = liveAppRef.current;

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const radius = ease * maxRadius;
        
        // DIRECT DOM UPDATES
        el.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`;

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          console.log('[QV-Debug] Transition Complete. Restoring Root.');
          el.style.clipPath = '';
          setSnapshot(null);
          endTransition(); 
          // Note: endTransition() updates state which triggers useTheme's 
          // effect to re-apply the theme to the root.
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isTransitioning, transitionTarget, transitionPoint, endTransition, snapshot]);

  // Current logical theme for the LIVE layer
  const activeTheme = isTransitioning ? (transitionTarget || theme) : theme;

  // Context isolation for children in the live layer
  const themeContextValue = {
    theme: activeTheme,
    setTheme,
    toggleTheme,
    isTransitioning,
    transitionTarget,
    transitionPoint,
    startTransition,
    endTransition
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 
        Bottom Layer: Static Snapshot (Old Theme)
        We apply the old theme class HERE, not on root.
      */}
      {snapshot && (
        <div 
          className={`${snapshot.theme} fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background text-foreground`}
          dangerouslySetInnerHTML={{ __html: snapshot.html }}
        />
      )}

      {/* 
        Top Layer: Live React App (New Theme)
        We apply the new theme class HERE.
      */}
      <div 
        ref={liveAppRef}
        className={`${activeTheme} w-full h-full relative z-10 bg-background text-foreground`}
        style={isTransitioning ? {
          clipPath: `circle(0px at ${transitionPoint.x}px ${transitionPoint.y}px)`,
          willChange: 'clip-path'
        } : {}}
      >
        <ThemeContext.Provider value={themeContextValue}>
          {children}
        </ThemeContext.Provider>
      </div>
    </div>
  );
}
