import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";

const dsBadgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "border-destructive-border bg-destructive-soft text-destructive-soft-foreground focus-visible:ring-destructive/20 [a]:hover:bg-destructive-soft/70",
        success:
          "border-success-border bg-success-soft text-success-soft-foreground [a]:hover:bg-success-soft/70",
        warning:
          "border-warning-border bg-warning-soft text-warning-soft-foreground [a]:hover:bg-warning-soft/70",
        info: "border-info-border bg-info-soft text-info-soft-foreground [a]:hover:bg-info-soft/70",
        brand:
          "border-primary-border bg-primary-soft text-primary-soft-foreground [a]:hover:bg-primary-soft/70",
        tertiary:
          "border-transparent bg-tertiary-soft text-tertiary-soft-foreground [a]:hover:bg-tertiary-soft/70",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function DsBadge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof dsBadgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(dsBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { DsBadge, dsBadgeVariants };
