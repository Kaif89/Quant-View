import { Link } from 'react-router-dom';

interface MarqueeButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: 'filled' | 'outlined';
  className?: string;
}

export function MarqueeButton({ to, children, variant = 'filled', className = '' }: MarqueeButtonProps) {
  const base =
    variant === 'filled'
      ? 'bg-foreground text-background hover:bg-foreground/90'
      : 'border border-border bg-transparent text-foreground hover:bg-secondary/30';

  return (
    <Link
      to={to}
      className={`group relative inline-flex items-center justify-center overflow-hidden h-12 px-8 text-sm font-medium uppercase tracking-widest transition-colors ${base} ${className}`}
    >
      {/* Default text — slides up & out */}
      <span
        className="flex items-center gap-2 transition-transform duration-500 group-hover:-translate-y-[120%]"
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {children}
      </span>
      {/* Duplicate text — slides up from below */}
      <span
        className="absolute inset-0 flex items-center justify-center gap-2 translate-y-[120%] transition-transform duration-500 group-hover:translate-y-0"
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {children}
      </span>
    </Link>
  );
}
