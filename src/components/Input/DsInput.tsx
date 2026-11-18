import type { ComponentProps, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/src/lib/utils';

const dsInputVariants = cva(
  [
    'w-full min-w-0 rounded-lg border border-input bg-card text-foreground transition-colors outline-none',
    'placeholder:text-foreground-muted',
    'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export type DsInputSize = 'sm' | 'md' | 'lg';

export interface DsInputProps extends Omit<ComponentProps<'input'>, 'size'> {
  size?: DsInputSize;
  /** Marks the field invalid (sets aria-invalid, which drives the error styles). */
  invalid?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Class for the wrapper element (only rendered when an icon is present). */
  wrapperClassName?: string;
}

const iconClasses =
  'pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center text-muted-foreground [&_svg]:size-4';

export const DsInput = ({
  size = 'md',
  invalid,
  startIcon,
  endIcon,
  className,
  wrapperClassName,
  'aria-invalid': ariaInvalid,
  ...props
}: DsInputProps) => {
  const input = (
    <input
      data-slot="input"
      aria-invalid={invalid || ariaInvalid || undefined}
      className={cn(dsInputVariants({ size }), startIcon && 'ps-10', endIcon && 'pe-10', className)}
      {...props}
    />
  );

  if (!startIcon && !endIcon) return input;

  return (
    <div className={cn('relative w-full', wrapperClassName)}>
      {startIcon && <span className={cn(iconClasses, 'start-3')}>{startIcon}</span>}
      {input}
      {endIcon && <span className={cn(iconClasses, 'end-3')}>{endIcon}</span>}
    </div>
  );
};

export { dsInputVariants };
