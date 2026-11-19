"use client";
import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";
import { DsPagination } from "../Pagination";
import { DsSkeleton } from "../Skeleton";
import {
  DsTable,
  DsTableBody,
  DsTableCell,
  DsTableHead,
  DsTableHeader,
  DsTableRow,
} from "./DsTable";

type Align = "start" | "center" | "end";

export type DsCustomTableColumn<T> = {
  /** Row key to read when there is no `render`; also the React key. */
  name: keyof T | (string & {});
  header: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  align?: Align;
  /** CSS width, e.g. "25%" or "8rem". */
  width?: string;
  headerClassName?: string;
  cellClassName?: string;
};

export type DsCustomTableActionsColumn<T> = {
  header?: ReactNode;
  render: (row: T, index: number) => ReactNode;
  /** Default: "end". */
  align?: Align;
  width?: string;
  headerClassName?: string;
  cellClassName?: string;
};

export type DsCustomTablePagination = {
  /** 1-based. */
  page: number;
  pageSize: number;
  /**
   * Total rows on the server — `data` is then treated as the current page.
   * Omit it to paginate `data` on the client.
   */
  total?: number;
  onPageChange: (page: number) => void;
  entityLabel?: string;
  className?: string;
};

export type DsCustomTableProps<T> = {
  columns: DsCustomTableColumn<T>[];
  data: T[];
  /** Default: `row.id`, else the index. */
  getRowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  actions?: DsCustomTableActionsColumn<T>;
  pagination?: DsCustomTablePagination;
  /** Shows `loadingComponent` (or skeleton rows) when there's no data; dims rows while refetching. */
  isLoading?: boolean;
  loadingComponent?: ReactNode;
  emptyMessage?: ReactNode;
  className?: string;
};

const alignClasses: Record<Align, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

function defaultRowKey<T>(row: T, index: number) {
  return (row as { id?: string | number }).id ?? index;
}

function defaultCell<T>(row: T, column: DsCustomTableColumn<T>) {
  const value = row[column.name as keyof T];
  return value == null ? null : String(value);
}

export function DsCustomTable<T>({
  columns,
  data,
  getRowKey = defaultRowKey,
  onRowClick,
  actions,
  pagination,
  isLoading = false,
  loadingComponent,
  emptyMessage = "No data available.",
  className,
}: DsCustomTableProps<T>) {
  const columnCount = columns.length + (actions ? 1 : 0);
  const widths = [...columns.map((c) => c.width), actions?.width];
  const hasWidths = widths.some(Boolean);

  const clientPaged = pagination && pagination.total === undefined;
  const rows = clientPaged
    ? data.slice(
        (pagination.page - 1) * pagination.pageSize,
        pagination.page * pagination.pageSize,
      )
    : data;
  const rowOffset = clientPaged
    ? (pagination.page - 1) * pagination.pageSize
    : 0;

  const showLoading = isLoading && (rows.length === 0 || loadingComponent);
  const actionsAlign = alignClasses[actions?.align ?? "end"];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <DsTable className={cn(hasWidths && "table-fixed")}>
          {hasWidths && (
            <colgroup>
              {widths.map((width, i) => (
                <col key={i} style={{ width }} />
              ))}
            </colgroup>
          )}

          <DsTableHeader className="bg-muted">
            <DsTableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <DsTableHead
                  key={String(column.name)}
                  className={cn(
                    "h-11 px-4 text-xs font-semibold text-foreground-secondary",
                    alignClasses[column.align ?? "start"],
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </DsTableHead>
              ))}
              {actions && (
                <DsTableHead
                  className={cn(
                    "h-11 px-4 text-xs font-semibold text-foreground-secondary",
                    actionsAlign,
                    actions.headerClassName,
                  )}
                >
                  {actions.header ?? <span className="sr-only">Actions</span>}
                </DsTableHead>
              )}
            </DsTableRow>
          </DsTableHeader>

          <DsTableBody
            className={cn(
              isLoading && !showLoading && "opacity-60 transition-opacity",
            )}
          >
            {showLoading ? (
              loadingComponent ? (
                <DsTableRow className="hover:bg-transparent">
                  <DsTableCell colSpan={columnCount} className="p-0">
                    {loadingComponent}
                  </DsTableCell>
                </DsTableRow>
              ) : (
                Array.from(
                  { length: Math.min(pagination?.pageSize ?? 5, 5) },
                  (_, i) => (
                    <DsTableRow key={i} className="hover:bg-transparent">
                      {Array.from({ length: columnCount }, (_, j) => (
                        <DsTableCell key={j} className="px-4 py-3">
                          <DsSkeleton className="h-4 w-full max-w-40" />
                        </DsTableCell>
                      ))}
                    </DsTableRow>
                  ),
                )
              )
            ) : rows.length === 0 ? (
              <DsTableRow className="hover:bg-transparent">
                <DsTableCell
                  colSpan={columnCount}
                  className="h-28 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </DsTableCell>
              </DsTableRow>
            ) : (
              rows.map((row, i) => {
                const index = rowOffset + i;
                return (
                  <DsTableRow
                    key={getRowKey(row, index)}
                    onClick={
                      onRowClick ? () => onRowClick(row, index) : undefined
                    }
                    className={cn(onRowClick && "cursor-pointer")}
                  >
                    {columns.map((column) => (
                      <DsTableCell
                        key={String(column.name)}
                        className={cn(
                          "px-4 py-3 text-foreground",
                          alignClasses[column.align ?? "start"],
                          column.cellClassName,
                        )}
                      >
                        {column.render
                          ? column.render(row, index)
                          : defaultCell(row, column)}
                      </DsTableCell>
                    ))}
                    {actions && (
                      <DsTableCell
                        // Keep clicks on menus/buttons from triggering onRowClick.
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          "px-4 py-3",
                          actionsAlign,
                          actions.cellClassName,
                        )}
                      >
                        {actions.render(row, index)}
                      </DsTableCell>
                    )}
                  </DsTableRow>
                );
              })
            )}
          </DsTableBody>
        </DsTable>
      </div>

      {pagination && (
        <DsPagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total ?? data.length}
          entityLabel={pagination.entityLabel}
          onPageChange={pagination.onPageChange}
          className={pagination.className}
        />
      )}
    </div>
  );
}
