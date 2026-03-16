import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isTransitioning: boolean;
  transitionTarget: Theme | null;
  transitionPoint: { x: number; y: number };
  startTransition: (target: Theme, x: number, y: number) => void;
  endTransition: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'system', 
  setTheme: () => {}, 
  toggleTheme: () => {},
  isTransitioning: false,
  transitionTarget: null,
  transitionPoint: { x: 0, y: 0 },
  startTransition: () => {},
  endTransition: () => {}
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('quantview-theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [transitionState, setTransitionState] = useState<{
    isTransitioning: boolean;
    target: Theme | null;
    point: { x: number; y: number };
  }>({
    isTransitioning: false,
    target: null,
    point: { x: 0, y: 0 }
  });

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (t: Theme) => {
      let effectiveTheme = t;
      if (t === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      root.classList.remove('light', 'dark');
      root.classList.add(effectiveTheme);
    };

    // Only apply to root when NOT transitioning (the manager handles it during)
    // This is the "Neutral Root" strategy to prevent specificity overrides
    if (!transitionState.isTransitioning) {
      applyTheme(theme);
      localStorage.setItem('quantview-theme', theme);
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme, transitionState.isTransitioning]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const startTransition = (target: Theme, x: number, y: number) => {
    setTransitionState({ isTransitioning: true, target, point: { x, y } });
  };

  const endTransition = () => {
    if (transitionState.target) {
      setTheme(transitionState.target);
    }
    setTransitionState({ isTransitioning: false, target: null, point: { x: 0, y: 0 } });
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme,
      isTransitioning: transitionState.isTransitioning,
      transitionTarget: transitionState.target,
      transitionPoint: transitionState.point,
      startTransition,
      endTransition
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
