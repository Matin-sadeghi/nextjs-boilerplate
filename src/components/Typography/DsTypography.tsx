import type { ElementType, HTMLAttributes } from 'react';

type DsTypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'helperText' | 'caption';

export interface DsTypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: DsTypographyVariant;
}

const variantClasses: Record<DsTypographyVariant, string> = {
  h1: 'text-3xl font-bold text-(--color-text-heading)',
  h2: 'text-2xl font-bold text-(--color-text-heading)',
  h3: 'text-xl font-semibold text-(--color-text-heading)',
  h4: 'text-lg font-semibold text-(--color-text-heading)',
  body: 'text-base text-(--color-text-primary)',
  bodySmall: 'text-sm text-(--color-text-primary)',
  helperText: 'text-sm text-(--color-text-secondary)',
  caption: 'text-xs text-(--color-text-muted)',
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

export const DsTypography = ({ as, variant = 'body', className = '', ...props }: DsTypographyProps) => {
  const Component = as ?? defaultTags[variant];

  return <Component className={`${variantClasses[variant]} ${className}`} {...props} />;
};
