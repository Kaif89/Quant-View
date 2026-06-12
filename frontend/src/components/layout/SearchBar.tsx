import { Search } from 'lucide-react';
import { useState, useRef } from 'react';
import { useStock } from '@/hooks/useStock';
import { toast } from 'sonner';

export function SearchBar() {
  const { allStocks, selectTicker } = useStock();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length > 0
    ? allStocks.filter(
        (s) =>
          s.meta.ticker.toLowerCase().includes(query.toLowerCase()) ||
          (s.meta.name?.toLowerCase().includes(query.toLowerCase()) ?? false)
      )
    : [];

  const handleSelect = (ticker: string) => {
    selectTicker(ticker);
    setQuery('');
    setOpen(false);
    toast.info(`Loading ${ticker.toUpperCase()}...`);
  };

  const handleSubmit = () => {
    const ticker = query.trim().toUpperCase();
    if (ticker) {
      handleSelect(ticker);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there's a filtered match, use the first one; otherwise submit the raw query
      if (filtered.length > 0) {
        handleSelect(filtered[0].meta.ticker);
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/70 transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
        style={{ background: 'hsl(var(--secondary) / 0.6)' }}>
        <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search any ticker…"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-mono"
          aria-label="Search stock ticker"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
        )}
      </div>
      {open && query.length > 0 && (
        <div className="absolute top-full mt-1.5 w-full border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
          style={{ background: 'hsl(var(--popover))', backdropFilter: 'blur(16px)' }}>
          {filtered.length > 0 ? (
            <>
              {filtered.map((s) => (
                <button
                  key={s.meta.ticker}
                  onMouseDown={() => handleSelect(s.meta.ticker)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors flex justify-between items-center group"
                >
                  <span className="font-bold text-foreground group-hover:text-primary transition-colors font-mono">{s.meta.ticker}</span>
                  <span className="text-muted-foreground text-xs">{s.meta.name}</span>
                </button>
              ))}
              <div className="border-t border-border">
                <button
                  onMouseDown={handleSubmit}
                  className="w-full text-left px-4 py-2 text-xs text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Press <kbd className="px-1 py-0.5 rounded bg-secondary text-foreground font-mono text-[10px]">Enter</kbd> to search "{query.toUpperCase()}"
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-3.5 text-sm">
              <p className="text-muted-foreground mb-1">No preloaded match for "{query}"</p>
              <button
                onMouseDown={handleSubmit}
                className="text-xs font-medium hover:underline"
                style={{ color: 'hsl(var(--primary))' }}
              >
                Search "{query.toUpperCase()}" anyway →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
