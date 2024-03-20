import { PropType, VNodeChild } from 'vue'
import { PaginationProps } from 'naive-ui/es/pagination'
import { ScrollbarProps } from 'naive-ui/es/scrollbar/src/Scrollbar'
import { BaseLoadingExposedProps } from 'naive-ui/es/_internal'
import { MaybeArray } from 'naive-ui/es/_utils'
import type {
  ColumnKey,
  CreateRowClassName,
  CreateRowKey,
  CreateRowProps,
  CreateSummary,
  DataTableOnLoad,
  OnUpdateCheckedRowKeys,
  OnUpdateExpandedRowKeys,
  OnUpdateFilters,
  OnUpdateSorter,
  RenderExpandIcon,
  RowData,
  RowKey,
  TableBaseColumn,
  TableColumn,
  TableColumns
} from 'naive-ui/es/data-table/src/interface'

export interface NDataTable {
  onUnstableColumnResize: (
    resizedWidth: number,
    limitedWidth: number,
    column: TableBaseColumn,
    getColumnWidth: (key: ColumnKey) => number | undefined
  ) => void
  pagination: false | PaginationProps
  paginateSinglePage: boolean
  minHeight: string | number
  maxHeight: string | number
  columns: TableColumns<any>
  rowClassName: string | CreateRowClassName<any>
  rowProps: CreateRowProps<any>
  rowKey: CreateRowKey<any>
  summary: CreateSummary<any>
  data: RowData[]
  loading: boolean
  bordered: boolean | undefined
  bottomBordered: boolean | undefined
  striped: boolean
  scrollX: string | number
  defaultCheckedRowKeys: RowKey[]
  checkedRowKeys: RowKey[]
  singleLine: boolean
  singleColumn: boolean
  size: 'small' | 'medium' | 'large'
  remote: boolean
  defaultExpandedRowKeys: RowKey[]
  defaultExpandAll: boolean
  expandedRowKeys: RowKey[]
  stickyExpandedRows: boolean
  virtualScroll: boolean
  tableLayout: 'fixed' | 'auto'
  allowCheckingNotLoaded: boolean
  cascade: boolean
  childrenKey: string
  indent: number
  flexHeight: boolean
  summaryPlacement: 'top' | 'bottom'
  paginationBehaviorOnFilter: 'first' | 'current'
  scrollbarProps: PropType<ScrollbarProps>
  renderCell: PropType<(value: any, rowData: object, column: TableBaseColumn) => VNodeChild>
  renderExpandIcon: PropType<RenderExpandIcon>
  spinProps: PropType<BaseLoadingExposedProps>
  onLoad: PropType<DataTableOnLoad>
  'onUpdate:page': PropType<MaybeArray<(page: number) => void> | undefined>
  onUpdatePage: PropType<MaybeArray<(page: number) => void> | undefined>
  'onUpdate:pageSize': PropType<MaybeArray<(pageSize: number) => void> | undefined>
  onUpdatePageSize: PropType<MaybeArray<(pageSize: number) => void> | undefined>
  'onUpdate:sorter': PropType<MaybeArray<OnUpdateSorter>>
  onUpdateSorter: PropType<MaybeArray<OnUpdateSorter>>
  'onUpdate:filters': PropType<MaybeArray<OnUpdateFilters>>
  onUpdateFilters: PropType<MaybeArray<OnUpdateFilters>>
  'onUpdate:checkedRowKeys': PropType<MaybeArray<OnUpdateCheckedRowKeys>>
  onUpdateCheckedRowKeys: PropType<MaybeArray<OnUpdateCheckedRowKeys>>
  'onUpdate:expandedRowKeys': PropType<MaybeArray<OnUpdateExpandedRowKeys>>
  onUpdateExpandedRowKeys: PropType<MaybeArray<OnUpdateExpandedRowKeys>>
  onScroll: PropType<(e: Event) => void>
  onPageChange: PropType<MaybeArray<(page: number) => void> | undefined>
  onPageSizeChange: PropType<MaybeArray<(pageSize: number) => void> | undefined>
  onSorterChange: PropType<MaybeArray<OnUpdateSorter> | undefined>
  onFiltersChange: PropType<MaybeArray<OnUpdateFilters> | undefined>
  onCheckedRowKeysChange: PropType<MaybeArray<OnUpdateCheckedRowKeys> | undefined>
}

export interface DataTable {
  search?: boolean
  exportName?: string
  tableProps: Partial<NDataTable>
}

export const defaultProps = {
  search: true,
  tableProps: {
    size: 'medium',
    tableLayout: 'auto',
    cascade: true,
    childrenKey: 'children',
    indent: 16,
    summaryPlacement: 'bottom',
    paginationBehaviorOnFilter: 'first',
    class: 'data-table-wrapper-container'
  }
}
