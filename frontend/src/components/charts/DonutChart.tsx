import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PortfolioAllocation } from '@/types/stock';

const data: PortfolioAllocation[] = [
  { name: 'Technology', value: 42, color: 'hsl(195, 100%, 52%)' },
  { name: 'Healthcare', value: 18, color: 'hsl(152, 80%, 48%)' },
  { name: 'Finance', value: 15, color: 'hsl(260, 80%, 65%)' },
  { name: 'Energy', value: 12, color: 'hsl(45, 95%, 55%)' },
  { name: 'Consumer', value: 13, color: 'hsl(340, 80%, 60%)' },
];

export function DonutChart() {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-foreground mb-5">Portfolio Allocation</h3>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0 w-36 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as PortfolioAllocation;
                  return (
                    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-md text-xs">
                      <span className="font-semibold text-foreground">{d.name}</span>
                      <span className="text-muted-foreground ml-2">{d.value}%</span>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold font-mono text-foreground">{total}%</span>
            <span className="text-xs text-muted-foreground">Alloc.</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 flex-1">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-muted-foreground flex-1 truncate">{d.name}</span>
              <span className="font-mono text-xs font-bold text-foreground">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
