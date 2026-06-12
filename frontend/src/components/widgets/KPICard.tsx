import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function KPICard({ label, value, subtitle, icon, trend }: KPICardProps) {
  const trendColor =
    trend === 'up' ? 'stat-positive' :
    trend === 'down' ? 'stat-negative' :
    'text-muted-foreground';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="kpi-card animate-fade-in">
      <div className="flex items-start justify-between">
        <span className="section-label">{label}</span>
        {icon && (
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-secondary text-muted-foreground">
            {icon}
          </span>
        )}
      </div>

      <div className="mt-1">
        <span className={`text-3xl font-bold font-mono tracking-tight ${trend === 'neutral' ? 'text-foreground' : trendColor}`}>
          {value}
        </span>
      </div>

      {subtitle && (
        <div className={`flex items-center gap-1.5 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}
