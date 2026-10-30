import type { ElementType, HTMLAttributes } from 'react';

type DsBoxVariant = 'plain' | 'card';
type DsBoxPadding = 'none' | 'sm' | 'md' | 'lg';

export interface DsBoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: DsBoxVariant;
  padding?: DsBoxPadding;
}

const variantClasses: Record<DsBoxVariant, string> = {
  plain: '',
  card: 'rounded-2xl border border-(--border-card) bg-(--color-card-background) shadow-(--shadow-card)',
};

const paddingClasses: Record<DsBoxPadding, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
};

export const DsBox = ({
  as: Component = 'div',
  variant = 'plain',
  padding = 'none',
  className = '',
  ...props
}: DsBoxProps) => {
  return (
    <Component
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    />
  );
};
