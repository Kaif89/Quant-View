import { useState, useEffect } from 'react';

export function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });

  return (
    <div className="flex items-center gap-6 text-xs text-muted-foreground uppercase tracking-widest mt-16 border-t border-border pt-6">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
        <span>Now, {formatted}</span>
      </div>
      <span className="hidden sm:inline">19.0760° N, 72.8777° E</span>
    </div>
  );
}
