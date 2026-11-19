import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type Column,
  type ColumnDef,
  type ReactTable,
  type RowData,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

export interface DsColumnFilterOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

/**
 * Filter UI shown in the DsDataTable toolbar for this column.
 * - `text`: a small "contains" input.
 * - `select`: a multi-select popover with counts (row value must equal one of the option values).
 */
export type DsColumnFilter =
  | { variant: "text"; placeholder?: string }
  | { variant: "select"; options: DsColumnFilterOption[] };

/** Extra per-column options understood by <DsDataTable>. */
export interface DsColumnMeta {
  /** Human-readable name used in the filter buttons and the "View" menu. Defaults to the column id. */
  label?: string;
  /** Text alignment for header and cells. Default: `start`. */
  align?: "start" | "center" | "end";
  headerClassName?: string;
  cellClassName?: string;
  filter?: DsColumnFilter;
}

/**
 * Features registered for every DsDataTable (TanStack Table v9 is tree-shaken
 * per feature). Features come first, then the row-model slots that need them.
 */
export const dsTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
    arrIncludesSome: filterFn_arrIncludesSome,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
  columnMeta: {} as DsColumnMeta,
});

export type DsTableFeatures = typeof dsTableFeatures;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DsColumnDef<TData extends RowData> = ColumnDef<
  DsTableFeatures,
  TData,
  any
>;

/** The table instance DsDataTable passes to its toolbar, pagination and bulk actions. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DsTableInstance<TData extends RowData> = ReactTable<
  DsTableFeatures,
  TData,
  any
>;

export type DsTableColumn<TData extends RowData> = Column<
  DsTableFeatures,
  TData,
  unknown
>;

/** Display name of a column: `meta.label`, else a string header, else the id. */
export function getDsColumnLabel<TData extends RowData>(
  column: DsTableColumn<TData>,
): string {
  const meta = column.columnDef.meta as DsColumnMeta | undefined;
  const header = column.columnDef.header;
  return meta?.label ?? (typeof header === "string" ? header : column.id);
}

/**
 * Typed column helper for DsDataTable. Define columns at module scope (or in
 * useMemo) so the table doesn't rebuild on every render:
 *
 *   const col = createDsColumnHelper<User>();
 *   const columns = col.columns([
 *     col.accessor('name', { header: 'Name', meta: { filter: { variant: 'text' } } }),
 *     col.accessor('role', {
 *       header: 'Role',
 *       meta: { filter: { variant: 'select', options: [{ value: 'admin', label: 'Admin' }] } },
 *     }),
 *     col.display({ id: 'actions', cell: ({ row }) => <RowActions user={row.original} /> }),
 *   ]);
 */
export const createDsColumnHelper = <TData extends RowData>() =>
  createColumnHelper<DsTableFeatures, TData>();
