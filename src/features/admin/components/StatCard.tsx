import type { ComponentType, ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { DsBox, DsTypography } from "@/src/components";
import { cn } from "@/src/lib/utils";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ComponentType<{ className?: string }>;
  /** Change vs. the previous period, in percent (e.g. 12.5 or -3). */
  change?: number;
  hint?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  change,
  hint,
}: StatCardProps) {
  const positive = (change ?? 0) >= 0;
  const Trend = positive ? TrendingUp : TrendingDown;

  return (
    <DsBox
      variant="card"
      padding="lg"
      shadow="sm"
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-2">
        <DsTypography variant="helperText" as="span">
          {label}
        </DsTypography>
        <span className="flex size-9 items-center justify-center rounded-lg bg-icon-surface text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-semibold tracking-tight text-heading tabular-nums">
          {value}
        </span>
        {(change !== undefined || hint) && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {change !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  positive ? "text-success" : "text-destructive",
                )}
              >
                <Trend className="size-3.5" />
                {positive ? "+" : ""}
                {change}%
              </span>
            )}
            {hint}
          </span>
        )}
      </div>
    </DsBox>
  );
}
