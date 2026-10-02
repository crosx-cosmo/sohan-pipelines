'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card overflow-hidden',
        'hover:border-primary/40 hover:bg-accent/5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        'transition-colors duration-200',
        className
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center transition-opacity duration-200',
          isDark ? 'opacity-0' : 'opacity-100'
        )}
      >
        <Sun className="h-[18px] w-[18px] text-amber-500" />
      </span>
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
          isDark ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Moon className="h-[18px] w-[18px] text-blue-400" />
      </span>
      {!mounted && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Sun className="h-[18px] w-[18px] opacity-30" />
        </span>
      )}
    </button>
  );
}
