import type { ButtonHTMLAttributes } from 'react';

type DsButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type DsButtonSize = 'sm' | 'md' | 'lg';

export interface DsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DsButtonVariant;
  size?: DsButtonSize;
}

const variantClasses: Record<DsButtonVariant, string> = {
  primary: 'bg-(--color-primary) text-(--color-text-inverse) hover:opacity-90',
  secondary:
    'border border-(--color-border) bg-(--color-card-background) text-(--color-text-primary) hover:bg-(--color-background)',
  ghost: 'bg-transparent text-(--color-text-primary) hover:bg-(--color-primary-50)',
  danger: 'bg-(--color-danger) text-white hover:opacity-90',
};

const sizeClasses: Record<DsButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const DsButton = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  ...props
}: DsButtonProps) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
};
