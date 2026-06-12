import { useStock } from '@/hooks/useStock';
import { ChevronDown, ChevronUp, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

export function ModelDetails() {
  const { selectedStock, showModel, setShowModel } = useStock();
  const [expanded, setExpanded] = useState(false);

  if (!selectedStock?.model) return null;

  const { coefficients, mse, predictedNext } = selectedStock.model;
  const confidence = mse < 5 ? 'High' : mse < 15 ? 'Medium' : 'Low';
  const confidenceBg = mse < 5
    ? 'bg-[hsl(152_80%_48%/0.12)] text-[hsl(152_80%_48%)] border-[hsl(152_80%_48%/0.25)]'
    : mse < 15
    ? 'bg-[hsl(45_95%_55%/0.12)] text-[hsl(45_95%_55%)] border-[hsl(45_95%_55%/0.25)]'
    : 'bg-[hsl(0_80%_55%/0.12)] text-[hsl(0_80%_55%)] border-[hsl(0_80%_55%/0.25)]';

  return (
    <div className="glass-card p-5 animate-fade-in">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left group"
        aria-expanded={expanded}
        aria-label="Toggle model details"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-secondary text-muted-foreground flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Model Details</h3>
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${confidenceBg}`}>
              {confidence} Confidence
            </span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground group-hover:bg-secondary transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="mt-5 space-y-3 text-sm">
          <div className="h-px bg-border" />
          {[
            { label: 'Algorithm', value: 'Linear Regression' },
            { label: 'MSE', value: mse.toFixed(4) },
            { label: 'Coefficients', value: `[${coefficients.map(c => c.toFixed(4)).join(', ')}]` },
            { label: 'Formula', value: `ŷ = ${coefficients[0]}·x + ${coefficients[1]}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-mono text-xs text-foreground bg-secondary px-2 py-0.5 rounded-lg">{value}</span>
            </div>
          ))}

          {predictedNext && (
            <div className="flex justify-between items-center p-3 rounded-xl bg-secondary border border-border">
              <span className="text-muted-foreground text-xs">T+1 Prediction</span>
              <span className="font-mono font-bold text-primary text-base">
                ${predictedNext.toFixed(2)}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Show prediction overlay</span>
            <button
              onClick={() => setShowModel(!showModel)}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: showModel ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}
              aria-label="Toggle model overlay"
            >
              {showModel ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              {showModel ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
