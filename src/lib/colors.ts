/**
 * Color tokens from `src/app/globals.css`, typed for component props.
 * Keep in sync with globals.css when adding/removing a token.
 */

const scale = <P extends string, S extends readonly string[]>(
  prefix: P,
  steps: S,
) => steps.map((s) => `${prefix}-${s}`) as `${P}-${S[number]}`[];

const STEPS = [
  "50", "100", "200", "300", "400", "500",
  "600", "700", "800", "900", "950",
] as const;

/** Raw palette (`@theme static`) — same in light and dark. */
export const DS_PALETTE_COLORS = [
  ...scale("brand", STEPS),
  ...scale("accent-violet", STEPS),
  ...scale("base", [
    "0", "50", "100", "150", "200", "300", "400", "500",
    "600", "700", "800", "850", "900", "925", "950",
  ] as const),
] as const;

/** Semantic tokens (`@theme inline`) — switch with light/dark. */
export const DS_SEMANTIC_COLORS = [
  "background", "foreground", "foreground-secondary", "foreground-muted", "heading",
  "card", "card-foreground", "card-border",
  "popover", "popover-foreground",
  "muted", "muted-foreground",
  "accent", "accent-foreground",
  "secondary", "secondary-foreground",
  "border", "input", "ring", "overlay", "icon-surface",
  "primary", "primary-foreground", "primary-soft", "primary-soft-foreground", "primary-border",
  "tertiary", "tertiary-foreground", "tertiary-soft", "tertiary-soft-foreground",
  "success", "success-foreground", "success-soft", "success-soft-foreground", "success-border",
  "warning", "warning-foreground", "warning-soft", "warning-soft-foreground", "warning-border",
  "info", "info-foreground", "info-soft", "info-soft-foreground", "info-border",
  "destructive", "destructive-foreground", "destructive-soft", "destructive-soft-foreground", "destructive-border",
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-7", "chart-8",
  "sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground",
  "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring",
] as const;

export type DsPaletteColor = (typeof DS_PALETTE_COLORS)[number];
export type DsSemanticColor = (typeof DS_SEMANTIC_COLORS)[number];
/** Any color token from globals.css, e.g. "primary", "success-soft", "brand-500". */
export type DsColor = DsSemanticColor | DsPaletteColor;

const PALETTE = new Set<string>(DS_PALETTE_COLORS);

/**
 * CSS value for a token. Semantic tokens read the theme variable directly
 * (Tailwind only emits `--color-*` for those when a utility uses them).
 */
export function dsColorVar(token: DsColor): string {
  return PALETTE.has(token) ? `var(--color-${token})` : `var(--${token})`;
}
