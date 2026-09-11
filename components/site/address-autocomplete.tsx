'use client';

import * as React from 'react';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { serviceAreas } from '@/lib/data';

const streetTypes = [
  'Road',
  'Lane',
  'Street',
  'Avenue',
  'Sarani',
  'Marg',
  'Para',
  'Bazar',
  'More',
  'Crossing',
];

const commonLocalities = [
  'Salt Lake Sector V',
  'New Town',
  'Rajarhat',
  'Ballygunge',
  'Park Street',
  'Gariahat',
  'Behala',
  'Jadavpur',
  'Tollygunge',
  'Shyambazar',
  'Hatibagan',
  'Esplanade',
  'Sealdah',
  'Howrah Station',
  'Dum Dum',
  'Barrackpore',
  'Kharagpur Town',
  'Asansol City Centre',
  'Durgapur City Centre',
  'Siliguri Hill Cart Road',
  'Midnapore Town',
  'Haldia Port',
  'Contai Town',
  'Tamluk Town',
  'Malda Town',
  'Berhampore Town',
  'Krishnanagar Town',
  'Bolpur Shantiniketan',
  'Purulia Town',
  'Bankura Town',
  'Jhargram Town',
  'Kalimpong Town',
  'Jalpaiguri Town',
  'Cooch Behar Town',
  'Alipurduar Town',
  'Raiganj Town',
  'Balurghat Town',
];

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  city?: string;
  id?: string;
  placeholder?: string;
  'aria-invalid'?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  city,
  id,
  placeholder,
  ...props
}: AddressAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const suggestions = React.useMemo(() => {
    const parts: string[] = [];
    const trimmed = value.trim();

    if (trimmed.length < 2) return [];

    const cityPart = city || 'West Bengal';

    const lowerVal = trimmed.toLowerCase();

    const matchingLocalities = commonLocalities.filter((l) =>
      l.toLowerCase().includes(lowerVal)
    );

    for (const locality of matchingLocalities.slice(0, 5)) {
      parts.push(`${locality}, ${cityPart}`);
    }

    for (const area of serviceAreas) {
      if (area.name.toLowerCase().includes(lowerVal)) {
        parts.push(`${area.name}, West Bengal`);
      }
    }

    const streetMatch = streetTypes.find((s) => s.toLowerCase().includes(lowerVal));
    if (streetMatch && parts.length < 8) {
      parts.push(`[House No], ${streetMatch}, ${cityPart}`);
    }

    if (parts.length === 0 && trimmed.length >= 3) {
      parts.push(`${trimmed}, ${cityPart}`);
    }

    return Array.from(new Set(parts)).slice(0, 8);
  }, [value, city]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      onChange(suggestions[activeIndex]);
      setShowSuggestions(false);
      setActiveIndex(-1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || '123, Salt Lake, Kolkata, West Bengal'}
          autoComplete="street-address"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background py-2 pl-9 pr-9 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            props['aria-invalid'] && 'border-destructive'
          )}
          role="combobox"
          aria-expanded={showSuggestions && suggestions.length > 0}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          aria-invalid={props['aria-invalid']}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setShowSuggestions(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Clear address"
            tabIndex={-1}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md"
        >
          <ul className="max-h-[200px] overflow-y-auto overscroll-contain py-1">
            {suggestions.map((suggestion, idx) => (
              <li
                key={suggestion}
                role="option"
                aria-selected={idx === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(suggestion);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
                  idx === activeIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground'
                )}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
