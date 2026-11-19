"use client";
import {
  useTable,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/src/lib/utils";
import {
  DsSelect,
  DsSelectContent,
  DsSelectItem,
  DsSelectTrigger,
  DsSelectValue,
} from "../Select";
import { DsSkeleton } from "../Skeleton";
import {
  DsTable,
  DsTableBody,
  DsTableCell,
  DsTableHead,
  DsTableHeader,
  DsTableRow,
} from "./DsTable";

import { DsButton } from "../Button";
import {
  dsTableFeatures,
  type DsColumnDef,
  type DsColumnMeta,
} from "./dsTable.config";

export interface DsDataTableLabels {
  empty: ReactNode;
  rowsPerPage: ReactNode;
  pageOf: (page: number, pageCount: number) => ReactNode;
  firstPage: string;
  previousPage: string;
  nextPage: string;
  lastPage: string;
}

const defaultLabels: DsDataTableLabels = {
  empty: "No results.",
  rowsPerPage: "Rows per page",
  pageOf: (page, pageCount) => `Page ${page} of ${pageCount}`,
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
};

export interface DsDataTableProps<TData extends RowData> {
  /** Keep stable (module scope or useMemo). Build with `createDsColumnHelper`. */
  columns: DsColumnDef<TData>[];
  /** Keep stable — don't pass a fresh `[]` fallback every render. */
  data: TData[];
  getRowId?: (row: TData, index: number) => string;

  /** Skeleton rows when there is no data yet; dims existing rows while refetching. */
  loading?: boolean;
  onRowClick?: (row: TData) => void;

  /** Set to false to render all rows without a pager. Default: true. */
  paginated?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;

  /**
   * Server-side mode: `data` is already the current page (sorted on the server)
   * and `rowCount` is the total. Control `pagination`/`sorting` and put them in
   * your query key.
   */
  manual?: boolean;
  rowCount?: number;

  /** Controlled state (optional). */
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;

  labels?: Partial<DsDataTableLabels>;
  className?: string;
}

const alignClasses: Record<NonNullable<DsColumnMeta["align"]>, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

const emptyRows: never[] = [];

export function DsDataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  loading = false,
  onRowClick,
  paginated = true,
  pageSizeOptions = [10, 20, 50],
  initialPageSize = pageSizeOptions[0] ?? 10,
  manual = false,
  rowCount,
  pagination: controlledPagination,
  onPaginationChange,
  sorting: controlledSorting,
  onSortingChange,
  labels: labelOverrides,
  className,
}: DsDataTableProps<TData>) {
  const labels = { ...defaultLabels, ...labelOverrides };

  const [innerPagination, setInnerPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [innerSorting, setInnerSorting] = useState<SortingState>([]);

  const pagination = controlledPagination ?? innerPagination;
  const sorting = controlledSorting ?? innerSorting;

  const table = useTable({
    features: dsTableFeatures,
    columns,
    data: data ?? emptyRows,
    getRowId,
    state: { pagination, sorting },
    onPaginationChange: onPaginationChange ?? setInnerPagination,
    onSortingChange: onSortingChange ?? setInnerSorting,
    // Without a pager we skip client slicing so every row renders.
    manualPagination: manual || !paginated,
    manualSorting: manual,
    rowCount: manual ? rowCount : undefined,
  });

  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;
  const showSkeleton = loading && rows.length === 0;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <DsTable>
          <DsTableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <DsTableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | DsColumnMeta
                    | undefined;
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const SortIcon =
                    sorted === "asc"
                      ? ArrowUp
                      : sorted === "desc"
                        ? ArrowDown
                        : ArrowUpDown;

                  return (
                    <DsTableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                      className={cn(
                        "h-11 px-4 text-xs font-semibold text-foreground-secondary",
                        alignClasses[meta?.align ?? "start"],
                        meta?.headerClassName,
                      )}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "inline-flex cursor-pointer items-center gap-1.5 rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
                            sorted && "text-foreground",
                          )}
                        >
                          <table.FlexRender header={header} />
                          <SortIcon
                            aria-hidden="true"
                            className={cn("size-3.5", !sorted && "opacity-40")}
                          />
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </DsTableHead>
                  );
                })}
              </DsTableRow>
            ))}
          </DsTableHeader>

          <DsTableBody
            className={cn(
              loading && !showSkeleton && "opacity-60 transition-opacity",
            )}
          >
            {showSkeleton ? (
              Array.from(
                { length: Math.min(pagination.pageSize, 5) },
                (_, i) => (
                  <DsTableRow
                    key={`skeleton-${i}`}
                    className="hover:bg-transparent"
                  >
                    {Array.from({ length: columnCount }, (_, j) => (
                      <DsTableCell key={j} className="px-4 py-3">
                        <DsSkeleton className="h-4 w-full max-w-40" />
                      </DsTableCell>
                    ))}
                  </DsTableRow>
                ),
              )
            ) : rows.length === 0 ? (
              <DsTableRow className="hover:bg-transparent">
                <DsTableCell
                  colSpan={columnCount}
                  className="h-28 text-center text-muted-foreground"
                >
                  {labels.empty}
                </DsTableCell>
              </DsTableRow>
            ) : (
              rows.map((row) => (
                <DsTableRow
                  key={row.id}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {row.getAllCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | DsColumnMeta
                      | undefined;
                    return (
                      <DsTableCell
                        key={cell.id}
                        className={cn(
                          "px-4 py-3 text-foreground",
                          alignClasses[meta?.align ?? "start"],
                          meta?.cellClassName,
                        )}
                      >
                        <table.FlexRender cell={cell} />
                      </DsTableCell>
                    );
                  })}
                </DsTableRow>
              ))
            )}
          </DsTableBody>
        </DsTable>
      </div>

      {paginated && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-foreground-secondary">
          <div className="flex items-center gap-2">
            <span>{labels.rowsPerPage}</span>
            <DsSelect
              value={String(pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <DsSelectTrigger size="sm" className="w-18 bg-card">
                <DsSelectValue />
              </DsSelectTrigger>
              <DsSelectContent>
                {pageSizeOptions.map((size) => (
                  <DsSelectItem key={size} value={String(size)}>
                    {size}
                  </DsSelectItem>
                ))}
              </DsSelectContent>
            </DsSelect>
          </div>

          <div className="flex items-center gap-3">
            <span>{labels.pageOf(pagination.pageIndex + 1, pageCount)}</span>
            <div className="flex items-center gap-1">
              <DsButton
                variant="outline"
                size="icon"
                className="size-8"
                aria-label={labels.firstPage}
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.firstPage()}
              >
                <ChevronsLeft className="rtl:rotate-180" />
              </DsButton>
              <DsButton
                variant="outline"
                size="icon"
                className="size-8"
                aria-label={labels.previousPage}
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <ChevronLeft className="rtl:rotate-180" />
              </DsButton>
              <DsButton
                variant="outline"
                size="icon"
                className="size-8"
                aria-label={labels.nextPage}
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <ChevronRight className="rtl:rotate-180" />
              </DsButton>
              <DsButton
                variant="outline"
                size="icon"
                className="size-8"
                aria-label={labels.lastPage}
                disabled={!table.getCanNextPage()}
                onClick={() => table.lastPage()}
              >
                <ChevronsRight className="rtl:rotate-180" />
              </DsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
