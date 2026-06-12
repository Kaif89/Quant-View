import { PeerStock } from '@/types/stock';
import { TrendingUp, TrendingDown } from 'lucide-react';

const mockPeers: PeerStock[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', revenueGrowth: 78, delta: 4.2 },
  { ticker: 'MSFT', name: 'Microsoft', revenueGrowth: 85, delta: 6.1 },
  { ticker: 'GOOGL', name: 'Alphabet', revenueGrowth: 62, delta: -1.3 },
  { ticker: 'NVDA', name: 'NVIDIA', revenueGrowth: 94, delta: 12.5 },
  { ticker: 'TSLA', name: 'Tesla', revenueGrowth: 45, delta: -3.8 },
];

const COLORS = [
  'hsl(195 100% 52%)',
  'hsl(152 80% 48%)',
  'hsl(260 80% 65%)',
  'hsl(45 95% 55%)',
  'hsl(0 80% 58%)',
];

export function PeerList() {
  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-foreground">Peer Analysis</h3>
        <span className="section-label">Revenue Growth</span>
      </div>
      <div className="flex flex-col gap-4">
        {mockPeers.map((peer, idx) => {
          const color = COLORS[idx % COLORS.length];
          const positive = peer.delta >= 0;
          return (
            <div key={peer.ticker} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }} />
                  <span className="text-sm font-semibold text-foreground">{peer.ticker}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">{peer.name}</span>
                </div>
                <span className={`flex items-center gap-1 text-xs font-mono font-semibold ${positive ? 'stat-positive' : 'stat-negative'}`}>
                  {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {positive ? '+' : ''}{peer.delta}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${peer.revenueGrowth}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
