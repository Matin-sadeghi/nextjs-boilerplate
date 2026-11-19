"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/src/lib/utils";

export type PaginationRangeItem = number | "gap";

/** Page numbers to show, with "gap" for collapsed ranges. Always at most 7 items. */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
): PaginationRangeItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "gap", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "gap",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "gap",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "gap",
    totalPages,
  ];
}

export interface DsPaginationProps {
  /** 1-based current page. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Noun used in the summary: "Showing 1 to 10 of 37 {entityLabel}". */
  entityLabel?: string;
  className?: string;
}

const segmentClass =
  "inline-flex h-9 min-w-9 cursor-pointer items-center justify-center border-s border-border px-3 text-sm font-medium transition-colors first:border-s-0 disabled:cursor-not-allowed disabled:opacity-50";

export function DsPagination({
  page,
  pageSize,
  total,
  onPageChange,
  entityLabel = "items",
  className,
}: DsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        Showing {start} to {end} of {total} {entityLabel}
      </p>

      <nav
        aria-label="Pagination"
        className="inline-flex overflow-hidden rounded-lg border border-border bg-card"
      >
        <button
          type="button"
          aria-label="Previous page"
          className={cn(segmentClass, "hover:bg-muted")}
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </button>

        {getPaginationRange(safePage, totalPages).map((item, index) =>
          item === "gap" ? (
            <span
              key={`gap-${index}`}
              aria-hidden="true"
              className={cn(segmentClass, "cursor-default select-none")}
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === safePage ? "page" : undefined}
              className={cn(
                segmentClass,
                item === safePage
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          className={cn(segmentClass, "hover:bg-muted")}
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </button>
      </nav>
    </div>
  );
}
