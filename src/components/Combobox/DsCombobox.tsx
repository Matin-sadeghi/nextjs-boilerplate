'use client';

import { useState, type FocusEventHandler, type ReactNode, type Ref } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/src/lib/utils';
import { DsButton } from '../Button';
import {
  DsCommand,
  DsCommandEmpty,
  DsCommandGroup,
  DsCommandInput,
  DsCommandItem,
  DsCommandList,
} from '../Command';
import { DsPopover, DsPopoverContent, DsPopoverTrigger } from '../Popover';

export interface DsComboboxOption {
  value: string;
  label: string;
  /** Optional element shown before the label (icon, avatar, …). */
  icon?: ReactNode;
  disabled?: boolean;
  /** Extra words that should match the search (e.g. an email for a user). */
  keywords?: string[];
}

export interface DsComboboxProps {
  options: DsComboboxOption[];
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
  /** Allow unselecting by choosing the selected option again. Default: true. */
  clearable?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  /** Class for the dropdown panel. It matches the trigger width by default. */
  contentClassName?: string;
  /** Forwarded to the trigger button (react-hook-form uses it to focus the field on error). */
  ref?: Ref<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  'aria-describedby'?: string;
}

/**
 * A Select with search, for long lists. Built on DsPopover + DsCommand (cmdk),
 * so it gets keyboard navigation, type-to-filter and RTL support.
 */
export function DsCombobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No results.',
  clearable = true,
  disabled,
  invalid,
  id,
  className,
  contentClassName,
  ref,
  onBlur,
  'aria-describedby': ariaDescribedBy,
}: DsComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <DsPopover open={open} onOpenChange={setOpen}>
      <DsPopoverTrigger asChild>
        <DsButton
          ref={ref}
          id={id}
          onBlur={onBlur}
          aria-describedby={ariaDescribedBy}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          className={cn('w-full justify-between px-3 font-normal', className)}
        >
          <span className={cn('flex min-w-0 items-center gap-2 truncate', !selected && 'text-muted-foreground')}>
            {selected?.icon}
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDown aria-hidden="true" className="text-muted-foreground" />
        </DsButton>
      </DsPopoverTrigger>
      <DsPopoverContent
        align="start"
        className={cn('w-(--radix-popover-trigger-width) min-w-48 p-0', contentClassName)}
      >
        <DsCommand>
          <DsCommandInput placeholder={searchPlaceholder} />
          <DsCommandList>
            <DsCommandEmpty>{emptyText}</DsCommandEmpty>
            <DsCommandGroup>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <DsCommandItem
                    key={option.value}
                    // cmdk filters on `value`; include the label and keywords so search matches them.
                    value={option.value}
                    keywords={[option.label, ...(option.keywords ?? [])]}
                    disabled={option.disabled}
                    onSelect={() => {
                      onValueChange?.(isSelected && clearable ? undefined : option.value);
                      setOpen(false);
                    }}
                  >
                    {option.icon}
                    <span className="truncate">{option.label}</span>
                    <Check
                      aria-hidden="true"
                      className={cn('ms-auto', isSelected ? 'opacity-100' : 'opacity-0')}
                    />
                  </DsCommandItem>
                );
              })}
            </DsCommandGroup>
          </DsCommandList>
        </DsCommand>
      </DsPopoverContent>
    </DsPopover>
  );
}
