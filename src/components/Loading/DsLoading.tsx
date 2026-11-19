import { LoaderCircle } from "lucide-react";

import { cn } from "@/src/lib/utils";

export interface DsLoadingProps {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export const DsLoading = ({
  label = "Loading...",
  fullScreen = false,
  className,
}: DsLoadingProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-foreground-secondary",
        fullScreen ? "min-h-dvh" : "py-10",
        className,
      )}
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-8 animate-spin text-primary"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
};
