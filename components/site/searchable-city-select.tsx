'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown, MapPin, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { serviceAreas } from '@/lib/data';

const sortedAreas = [...serviceAreas].sort((a, b) => a.name.localeCompare(b.name));

interface SearchableCitySelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  'aria-invalid'?: boolean;
}

export function SearchableCitySelect({ value, onChange, id, ...props }: SearchableCitySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedArea = sortedAreas.find((a) => a.name === value);

  React.useEffect(() => {
    if (open) {
      setSearch('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls="city-listbox"
          aria-haspopup="listbox"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            props['aria-invalid'] && 'border-destructive',
            !value && 'text-muted-foreground'
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            {selectedArea ? selectedArea.name : 'Select your city'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] min-w-[18rem] p-0"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={true} loop>
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              ref={inputRef}
              placeholder="Search city or town..."
              value={search}
              onValueChange={setSearch}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  inputRef.current?.focus();
                }}
                className="ml-1 rounded-sm p-0.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <CommandList id="city-listbox" role="listbox" className="max-h-[280px] overflow-y-auto overscroll-contain">
            <CommandEmpty>No city found. Try a different spelling.</CommandEmpty>
            <CommandGroup>
              {sortedAreas.map((area) => (
                <CommandItem
                  key={area.name}
                  value={area.name}
                  onSelect={() => {
                    onChange(area.name);
                    setOpen(false);
                  }}
                  role="option"
                  aria-selected={value === area.name}
                  className="gap-2"
                >
                  <Check
                    className={cn(
                      'h-4 w-4 shrink-0',
                      value === area.name ? 'opacity-100 text-primary' : 'opacity-0'
                    )}
                  />
                  <span className="truncate">{area.name}</span>
                  {area.zipCodes.length > 0 && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {area.zipCodes[0]}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
