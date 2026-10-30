import type { ComponentProps, ReactNode } from 'react';

type DsInputSize = 'sm' | 'md' | 'lg';

export interface DsInputProps extends Omit<ComponentProps<'input'>, 'size'> {
  size?: DsInputSize;
  invalid?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const sizeClasses: Record<DsInputSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
};

const iconClasses =
  'pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center text-(--color-text-muted) [&_svg]:size-4';

export const DsInput = ({
  size = 'md',
  invalid = false,
  startIcon,
  endIcon,
  className = '',
  ...props
}: DsInputProps) => {
  const stateClasses = invalid
    ? 'border-(--color-danger) focus:ring-(--color-danger)'
    : 'border-(--color-border) focus:border-(--color-primary) focus:ring-(--color-primary)';

  return (
    <span className="relative block w-full">
      {startIcon && <span className={`${iconClasses} start-3`}>{startIcon}</span>}
      <input
        aria-invalid={invalid || undefined}
        className={`block w-full rounded-lg border bg-(--color-card-background) text-(--color-text-primary) transition outline-none placeholder:text-(--color-text-muted) focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]} ${stateClasses} ${startIcon ? 'ps-10' : ''} ${endIcon ? 'pe-10' : ''} ${className}`}
        {...props}
      />
      {endIcon && <span className={`${iconClasses} end-3`}>{endIcon}</span>}
    </span>
  );
};
