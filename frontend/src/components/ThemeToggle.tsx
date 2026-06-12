import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, startTransition, isTransitioning } = useTheme();

  const handleToggle = (e: React.MouseEvent) => {
    if (isTransitioning) return;

    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    startTransition(nextTheme, e.clientX, e.clientY);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={className}
      disabled={isTransitioning}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
}
