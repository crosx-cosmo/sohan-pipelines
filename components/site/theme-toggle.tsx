'use client';

import { useTheme } from '@/components/site/theme-provider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="flex h-9 w-16 items-center rounded-full border border-border bg-muted" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex h-9 w-16 shrink-0 items-center rounded-full border border-border bg-muted p-1 transition-colors duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
        <Sun
          className={`h-3.5 w-3.5 transition-colors duration-150 ${
            isDark ? 'text-muted-foreground/40' : 'text-warning'
          }`}
        />
        <Moon
          className={`h-3.5 w-3.5 transition-colors duration-150 ${
            isDark ? 'text-accent' : 'text-muted-foreground/40'
          }`}
        />
      </span>

      <span
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-[margin,background-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isDark
            ? 'ml-auto bg-gradient-to-br from-foreground to-foreground/80'
            : 'ml-0 bg-gradient-to-br from-primary to-accent'
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-background" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-primary-foreground" />
        )}
      </span>
    </button>
  );
}
