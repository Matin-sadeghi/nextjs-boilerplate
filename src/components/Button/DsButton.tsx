import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/src/lib/utils";

const dsButtonVariants = cva(
  [
    "group/button inline-flex shrink-0 cursor-pointer items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary",
        outline:
          "border-border bg-card text-foreground hover:bg-muted aria-expanded:bg-muted dark:border-input",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent dark:hover:bg-accent/60",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-destructive/40 focus-visible:ring-destructive/30",
        link: "h-auto! px-0! text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10 gap-2 rounded-lg px-4 text-sm",
        lg: "h-12 gap-2 rounded-xl px-6 text-base",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 rounded-lg",
        icon: "size-10 rounded-lg",
        "icon-lg": "size-12 rounded-xl [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type DsButtonVariant = NonNullable<
  VariantProps<typeof dsButtonVariants>["variant"]
>;
export type DsButtonSize = NonNullable<
  VariantProps<typeof dsButtonVariants>["size"]
>;

export interface DsButtonProps
  extends ComponentProps<"button">, VariantProps<typeof dsButtonVariants> {
  /** Render the child element (e.g. <Link>) with button styles instead of a <button>. */
  asChild?: boolean;
  /** Shows a spinner and disables the button. Ignored with `asChild`. */
  loading?: boolean;
}

export const DsButton = ({
  variant = "primary",
  size = "md",
  type = "button",
  asChild = false,
  loading = false,
  disabled,
  className,
  children,
  ...props
}: DsButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={asChild ? undefined : type}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      className={cn(dsButtonVariants({ variant, size }), className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          )}
          {children}
        </>
      )}
    </Comp>
  );
};

export { dsButtonVariants };
