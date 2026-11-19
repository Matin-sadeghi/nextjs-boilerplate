'use client';

import { useState, type FocusEventHandler, type Ref } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import type { Locale, Matcher } from 'react-day-picker';

import { cn } from '@/src/lib/utils';
import { DsButton } from '../Button';
import { DsCalendar } from '../Calendar';
import { DsPopover, DsPopoverContent, DsPopoverTrigger } from '../Popover';

export interface DsDatePickerProps {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  /** Format shown in the trigger. Default: `date.toLocaleDateString(locale?.code)`. */
  formatDate?: (date: Date) => string;
  /** Dates that can't be picked, e.g. `{ before: today }` or `{ dayOfWeek: [0, 6] }`. */
  disabledDates?: Matcher | Matcher[];
  /** `dropdown` shows month/year selects — handy for birthdays. Default: `label`. */
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
  /** First and last month reachable in the calendar (limits the year dropdown). */
  startMonth?: Date;
  endMonth?: Date;
  /** react-day-picker locale, e.g. `import { faIR } from 'react-day-picker/locale'`. */
  locale?: Partial<Locale>;
  /** Show a button to clear the value. Default: true. */
  clearable?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  'aria-describedby'?: string;
}

/** Button that opens a calendar in a popover and closes when a day is picked. */
export function DsDatePicker({
  value,
  onValueChange,
  placeholder = 'Pick a date',
  formatDate,
  disabledDates,
  captionLayout = 'label',
  startMonth,
  endMonth,
  locale,
  clearable = true,
  disabled,
  invalid,
  id,
  className,
  ref,
  onBlur,
  'aria-describedby': ariaDescribedBy,
}: DsDatePickerProps) {
  const [open, setOpen] = useState(false);
  const label = value ? (formatDate ? formatDate(value) : value.toLocaleDateString(locale?.code)) : placeholder;

  return (
    <div className={cn('relative w-full', className)}>
      <DsPopover open={open} onOpenChange={setOpen}>
        <DsPopoverTrigger asChild>
          <DsButton
            ref={ref}
            id={id}
            variant="outline"
            disabled={disabled}
            onBlur={onBlur}
            aria-invalid={invalid || undefined}
            aria-describedby={ariaDescribedBy}
            className={cn('w-full justify-start px-3 font-normal', clearable && value && 'pe-9')}
          >
            <CalendarIcon aria-hidden="true" className="text-muted-foreground" />
            <span className={cn('truncate', !value && 'text-muted-foreground')}>{label}</span>
          </DsButton>
        </DsPopoverTrigger>
        <DsPopoverContent align="start" className="w-auto overflow-hidden p-0">
          <DsCalendar
            mode="single"
            selected={value}
            defaultMonth={value}
            onSelect={(date) => {
              onValueChange?.(date);
              setOpen(false);
            }}
            disabled={disabledDates}
            captionLayout={captionLayout}
            startMonth={startMonth}
            endMonth={endMonth}
            locale={locale}
          />
        </DsPopoverContent>
      </DsPopover>

      {clearable && value && !disabled && (
        <DsButton
          variant="ghost"
          size="icon-xs"
          aria-label="Clear date"
          className="absolute end-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => onValueChange?.(undefined)}
        >
          <X />
        </DsButton>
      )}
    </div>
  );
}
