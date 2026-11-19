import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { Slot } from "radix-ui";
import type { CSSProperties, ComponentProps } from "react";

import { DS_SEMANTIC_COLORS, dsColorVar, type DsColor } from "@/src/lib/colors";
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
        // Used when building a button from `appearance` / `tone` / `bgColor` / `color`.
        custom: "",
      },
      /**
       * Shape of a custom button. Colors come from CSS variables set inline:
       * --btn-color (main color), --btn-fg (text), --btn-border.
       */
      appearance: {
        solid:
          "bg-(color:--btn-color) text-(color:--btn-fg) border-(color:--btn-border) hover:bg-(color:--btn-color)/90 aria-expanded:bg-(color:--btn-color)/90",
        outline:
          "bg-transparent text-(color:--btn-fg) border-(color:--btn-border) hover:bg-(color:--btn-color)/10 aria-expanded:bg-(color:--btn-color)/10",
        soft: "bg-(color:--btn-color)/15 text-(color:--btn-fg) border-(color:--btn-border) hover:bg-(color:--btn-color)/25 aria-expanded:bg-(color:--btn-color)/25",
        ghost:
          "bg-transparent text-(color:--btn-fg) hover:bg-(color:--btn-color)/10 aria-expanded:bg-(color:--btn-color)/10",
        link: "h-auto! px-0! bg-transparent text-(color:--btn-fg) underline-offset-4 hover:underline",
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
      /** Overrides the corner radius that comes with `size`. */
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    compoundVariants: [
      {
        variant: "custom",
        className:
          "focus-visible:border-(color:--btn-color) focus-visible:ring-(color:--btn-color)/30",
      },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

/** Shortcuts for custom buttons: [main color, readable text on it]. */
const DS_BUTTON_TONES = {
  primary: ["primary", "primary-foreground"],
  neutral: ["foreground", "background"],
  success: ["success", "success-foreground"],
  warning: ["warning", "warning-foreground"],
  info: ["info", "info-foreground"],
  destructive: ["destructive", "destructive-foreground"],
} as const satisfies Record<string, readonly [DsColor, DsColor]>;

const SEMANTIC = new Set<string>(DS_SEMANTIC_COLORS);

/** Readable text color on a solid `bg`: its `-foreground` pair if one exists. */
function solidForeground(bg: DsColor): DsColor {
  const pair = `${bg}-foreground`;
  if (SEMANTIC.has(pair)) return pair as DsColor;
  // Palette shades: dark text on light shades, white on dark ones.
  const step = Number(bg.split("-").pop());
  if (!Number.isNaN(step)) return step <= 300 ? "base-950" : "base-0";
  return "primary-foreground";
}

export type DsButtonVariant = Exclude<
  NonNullable<VariantProps<typeof dsButtonVariants>["variant"]>,
  "custom"
>;
export type DsButtonSize = NonNullable<
  VariantProps<typeof dsButtonVariants>["size"]
>;
export type DsButtonAppearance = NonNullable<
  VariantProps<typeof dsButtonVariants>["appearance"]
>;
export type DsButtonRounded = NonNullable<
  VariantProps<typeof dsButtonVariants>["rounded"]
>;
export type DsButtonTone = keyof typeof DS_BUTTON_TONES;

export interface DsButtonProps extends Omit<ComponentProps<"button">, "color"> {
  /** Ready-made style. Ignored when any of `appearance`, `tone`, `bgColor`, `color` is set. */
  variant?: DsButtonVariant;
  size?: DsButtonSize;

  /** Shape of a custom button. Default: "solid". */
  appearance?: DsButtonAppearance;
  /** Design-system color for a custom button. Default: "primary". */
  tone?: DsButtonTone;
  /**
   * Main color — a token from globals.css ("success", "chart-3", "brand-500", …).
   * Fill for `solid`, tint for `soft`/hover, text and border for `outline`/`ghost`/`link`.
   * Overrides `tone`.
   */
  bgColor?: DsColor;
  /** Text/icon color. Default: the `-foreground` pair for `solid`, otherwise the main color. */
  color?: DsColor;
  /** Border color. Default: the main color for `outline`, none otherwise. */
  borderColor?: DsColor;

  rounded?: DsButtonRounded;
  fullWidth?: boolean;

  /** Render the child element (e.g. <Link>) with button styles instead of a <button>. */
  asChild?: boolean;
  /** Shows a spinner and disables the button. Ignored with `asChild`. */
  loading?: boolean;
}

export const DsButton = ({
  variant = "primary",
  size = "md",
  appearance,
  tone,
  bgColor,
  color,
  borderColor,
  rounded,
  fullWidth,
  type = "button",
  asChild = false,
  loading = false,
  disabled,
  className,
  style,
  children,
  ...props
}: DsButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";

  const isCustom =
    appearance !== undefined ||
    tone !== undefined ||
    bgColor !== undefined ||
    color !== undefined;
  const shape = isCustom ? (appearance ?? "solid") : undefined;

  let customStyle: CSSProperties | undefined;
  if (isCustom) {
    const [toneColor, toneFg] = DS_BUTTON_TONES[tone ?? "primary"];
    const main: DsColor = bgColor ?? toneColor;
    const solidFg = bgColor ? solidForeground(bgColor) : toneFg;
    const fg = color ?? (shape === "solid" ? solidFg : main);
    const border = borderColor ?? (shape === "outline" ? main : undefined);
    customStyle = {
      "--btn-color": dsColorVar(main),
      "--btn-fg": dsColorVar(fg),
      "--btn-border": border ? dsColorVar(border) : "transparent",
    } as CSSProperties;
  }

  return (
    <Comp
      data-slot="button"
      data-variant={isCustom ? "custom" : variant}
      data-appearance={shape}
      data-size={size}
      type={asChild ? undefined : type}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        dsButtonVariants({
          variant: isCustom ? "custom" : variant,
          appearance: shape,
          size,
          rounded,
          fullWidth,
        }),
        className,
      )}
      style={customStyle ? { ...customStyle, ...style } : style}
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
