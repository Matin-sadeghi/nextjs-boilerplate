import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/src/lib/utils";
import { DsTypography } from "../Typography";

export interface DsPageHeaderProps extends Omit<
  ComponentProps<"header">,
  "title"
> {
  title: ReactNode;
  description?: ReactNode;
  /** Rendered above the title, typically a <DsBreadcrumb>. */
  breadcrumb?: ReactNode;
  /** Buttons on the end side (wraps under the title on small screens). */
  actions?: ReactNode;
}

/** Standard top-of-page header: breadcrumb, title, description and actions. */
export function DsPageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className,
  ...props
}: DsPageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {breadcrumb}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <DsTypography variant="h2" as="h1" className="truncate">
            {title}
          </DsTypography>
          {description && (
            <DsTypography variant="helperText">{description}</DsTypography>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}
