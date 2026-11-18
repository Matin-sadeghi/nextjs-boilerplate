import type { ElementType, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/src/lib/utils';

const dsTypographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-3xl font-bold',
      h2: 'text-2xl font-bold',
      h3: 'text-xl font-semibold',
      h4: 'text-lg font-semibold',
      body: 'text-base',
      bodySmall: 'text-sm',
      helperText: 'text-sm',
      caption: 'text-xs',
    },
    color: {
      default: 'text-foreground',
      heading: 'text-heading',
      secondary: 'text-foreground-secondary',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-destructive',
      info: 'text-info',
      inherit: '',
    },
  },
  defaultVariants: { variant: 'body' },
});

type DsTypographyVariant = NonNullable<VariantProps<typeof dsTypographyVariants>['variant']>;
export type DsTypographyColor = NonNullable<VariantProps<typeof dsTypographyVariants>['color']>;

/** Color used when `color` is not passed. */
const defaultColors: Record<DsTypographyVariant, DsTypographyColor> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  body: 'default',
  bodySmall: 'default',
  helperText: 'secondary',
  caption: 'muted',
};

const defaultTags: Record<DsTypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  bodySmall: 'p',
  helperText: 'p',
  caption: 'span',
};

export interface DsTypographyProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  as?: ElementType;
  variant?: DsTypographyVariant;
  color?: DsTypographyColor;
}

export const DsTypography = ({ as, variant = 'body', color, className, ...props }: DsTypographyProps) => {
  const Component = as ?? defaultTags[variant];

  return (
    <Component
      className={cn(dsTypographyVariants({ variant, color: color ?? defaultColors[variant] }), className)}
      {...props}
    />
  );
};

export { dsTypographyVariants };
