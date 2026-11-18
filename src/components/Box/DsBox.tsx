import type { ElementType, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/src/lib/utils';

const dsBoxVariants = cva('', {
  variants: {
    variant: {
      plain: '',
      card: 'rounded-2xl border border-card-border bg-card text-card-foreground',
      muted: 'rounded-xl bg-muted',
    },
    padding: {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
    shadow: {
      none: '',
      sm: 'shadow-card-sm',
      md: 'shadow-card',
      lg: 'shadow-card-lg',
    },
  },
  defaultVariants: { variant: 'plain', padding: 'none', shadow: 'none' },
});

export type DsBoxShadow = 'sm' | 'md' | 'lg';

export interface DsBoxProps
  extends HTMLAttributes<HTMLElement>,
    Omit<VariantProps<typeof dsBoxVariants>, 'shadow'> {
  as?: ElementType;
  /** Elevation. `true` is the same as `"md"`; `false` / omitted means no shadow. */
  shadow?: boolean | DsBoxShadow;
}

export const DsBox = ({ as: Component = 'div', variant, padding, shadow, className, ...props }: DsBoxProps) => {
  const shadowLevel = shadow === true ? 'md' : shadow || 'none';

  return (
    <Component className={cn(dsBoxVariants({ variant, padding, shadow: shadowLevel }), className)} {...props} />
  );
};

export { dsBoxVariants };
