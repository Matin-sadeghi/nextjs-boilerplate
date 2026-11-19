import type { ComponentProps } from "react";

import { cn } from "@/src/lib/utils";

/** Groups several fields under a legend. */
export function DsFieldset({
  className,
  ...props
}: ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={cn(
        "flex flex-col gap-6 disabled:opacity-50 *:data-[slot=description]:-mt-4",
        className,
      )}
      {...props}
    />
  );
}

export function DsLegend({ className, ...props }: ComponentProps<"legend">) {
  return (
    <legend
      data-slot="legend"
      className={cn("mb-2 text-base font-semibold text-heading", className)}
      {...props}
    />
  );
}

export function DsFieldGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  );
}

export interface DsFieldProps extends ComponentProps<"div"> {
  disabled?: boolean;
}

/** One label + control + description/error stack. */
export function DsField({ className, disabled, ...props }: DsFieldProps) {
  return (
    <div
      data-slot="field"
      data-disabled={disabled || undefined}
      className={cn(
        "group flex flex-col gap-2 data-disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export function DsDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DsErrorMessage({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="error"
      role="alert"
      className={cn("text-sm text-destructive", className)}
      {...props}
    />
  );
}
