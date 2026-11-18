import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table';

/** Extra per-column options understood by <DsDataTable>. */
export interface DsColumnMeta {
  /** Text alignment for header and cells. Default: `start`. */
  align?: 'start' | 'center' | 'end';
  headerClassName?: string;
  cellClassName?: string;
}

/**
 * Features registered for every DsDataTable (TanStack Table v9 is tree-shaken
 * per feature). To support filtering, selection, etc., add the feature and its
 * row model here and expose the matching props in DsDataTable.
 */
export const dsTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
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
export type DsColumnDef<TData extends RowData> = ColumnDef<DsTableFeatures, TData, any>;

/**
 * Typed column helper for DsDataTable. Define columns at module scope (or in
 * useMemo) so the table doesn't rebuild on every render:
 *
 *   const col = createDsColumnHelper<User>();
 *   const columns = col.columns([
 *     col.accessor('name', { header: 'Name' }),
 *     col.accessor('age', { header: 'Age', meta: { align: 'end' } }),
 *     col.display({ id: 'actions', cell: ({ row }) => <RowActions user={row.original} /> }),
 *   ]);
 */
export const createDsColumnHelper = <TData extends RowData>() => createColumnHelper<DsTableFeatures, TData>();
