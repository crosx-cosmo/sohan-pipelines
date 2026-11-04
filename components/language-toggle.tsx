'use client';

import * as React from 'react';
import { Languages } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
}

export function LanguageToggle({
  className,
  compact = false,
}: LanguageToggleProps) {
  const { lang, setLang } = useLanguage();

  const handleSelect = (target: 'en' | 'bn') => {
    if (target === lang) return;
    setLang(target);
    if (target === 'bn') {
      toast.success('ভাষা বাংলা-তে পরিবর্তন করা হয়েছে (Bengali Active)', {
        description: 'এখন আপনি বাংলা ও ইংরেজি উভয় ভাষায় কোটাশন ও পরিষেবা দেখতে পাবেন।',
        duration: 2400,
      });
    } else {
      toast.success('Language switched to English', {
        description: 'All navigation, services, and WhatsApp quotes are now in English.',
        duration: 2200,
      });
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => handleSelect(lang === 'en' ? 'bn' : 'en')}
        aria-label={
          lang === 'en' ? 'Switch language to Bengali (বাংলা)' : 'Switch language to English'
        }
        title={
          lang === 'en' ? 'বাংলা ভাষায় দেখুন (Switch to Bengali)' : 'Switch to English'
        }
        className={cn(
          'inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/80 bg-card px-2.5 text-xs font-semibold text-foreground hover:border-primary/50 hover:bg-muted/60 active:scale-95 transition-all cursor-pointer select-none whitespace-nowrap shrink-0',
          className
        )}
      >
        <Languages className="h-3.5 w-3.5 text-[#003E9E] dark:text-[#60A5FA] shrink-0" />
        <span className="font-mono text-[11px] font-bold">
          {lang === 'en' ? 'বাংলা' : 'EN'}
        </span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language Switcher"
      className={cn(
        'inline-flex items-center rounded-xl border border-border/80 bg-muted/50 p-0.5 text-xs select-none shrink-0',
        className
      )}
    >
      <button
        type="button"
        onClick={() => handleSelect('en')}
        aria-pressed={lang === 'en'}
        className={cn(
          'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap',
          lang === 'en'
            ? 'bg-[#003E9E] text-white shadow-2xs'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleSelect('bn')}
        aria-pressed={lang === 'bn'}
        className={cn(
          'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap',
          lang === 'bn'
            ? 'bg-[#003E9E] text-white shadow-2xs'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        বাংলা
      </button>
    </div>
  );
}
