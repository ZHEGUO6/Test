<script setup lang="ts">
import { onBeforeMount, ref, getCurrentInstance, h } from 'vue'
import { getSearchList } from '@/api/search'
import type { DataTableColumn, MessageOptions } from 'naive-ui'
import usePagination from '@/hooks/usePagination'
import DataTableIndex from '@/components/DataTable/DataTableIndex.vue'
import { DataTable } from '@/types/component/dataTable'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'

type RowData = {
  key: string
  title: string
  intro: string
  commentNumber: number
  scanNumber: number
  ['create-date']: string
  ['update-date']: string
}

const { pageInfo, updatePageInfo } = usePagination()

const searchStore = useSearchStore()

const { hasSearchList, searchList, searchListTotalCount } = storeToRefs(searchStore)

const TableProps = ref<DataTable['tableProps']>({
  columns: <Array<DataTableColumn>>[
    {
      key: 'title',
      title: '标题',
      maxWidth: 100,
      ellipsis: true,
      align: 'center',
      filter: (filterOptionValue: string, row) => (row.title as string).includes(filterOptionValue)
    },
    {
      key: 'intro',
      title: '内容',
      maxWidth: 200,
      ellipsis: true,
      align: 'center',
      filter: (filterOptionValue: string, row) => (row.intro as string).includes(filterOptionValue)
    },
    {
      key: 'commentNumber',
      title: '评论数',
      align: 'center',
      filter: (filterOptionValue, row) => row.commentNumber === ~~filterOptionValue
    },
    {
      key: 'scanNumber',
      title: '浏览数',
      align: 'center',
      filter: (filterOptionValue, row) => row.scanNumber === ~~filterOptionValue
    },
    {
      key: 'create-date',
      title: '创建时间',
      align: 'center',
      filter: (filterOptionValue: string, row) => {
        const [start, end] = filterOptionValue.split(',')
        const curTime = new Date(row['create-date'] as string).getTime()
        return curTime > +start && curTime < +end
      }
    },
    {
      key: 'update-date',
      title: '更新时间',
      align: 'center',
      filter: (filterOptionValue: string, row) => {
        const [start, end] = filterOptionValue.split(',')
        const curTime = new Date(row['update-date'] as string).getTime()
        return curTime > +start && curTime < +end
      }
    }
  ],
  data: <Array<RowData>>[],
  rowProps: (row: RowData) => ({
    style: {
      cursor: 'pointer'
    },
    onClick: () => {}
  }),
  loading: false,
  pagination: {
    'page-size': pageInfo.limit,
    page: pageInfo.page,
    'show-quick-jumper': true,
    'show-size-picker': true,
    'display-order': ['quick-jumper', 'pages', 'size-picker'],
    'page-sizes': [10, 20, 30, 50],
    'item-count': searchListTotalCount.value,
    onChange: (page: number) => {
      updatePageInfo({ page })
    },
    onUpdatePageSize: (size: number) => {
      updatePageInfo({ limit: size })
    }
  }
})

const handleRefreshTableData = async (force: boolean = false) => {
  TableProps.value.loading = true
  let tableData
  if (hasSearchList.value && !force) {
    tableData = searchList.value
  } else {
    tableData = await searchStore.fetchSearchList({
      page: pageInfo.page,
      limit: pageInfo.limit
    })
  }
  TableProps.value.data = tableData.map((i) => {
    const createDate = new Date(i.createdAt)
    const updateDate = new Date(i.updatedAt)
    return {
      key: i.searchId,
      title: i.title,
      intro: i.intro,
      commentNumber: i.commentNumber,
      scanNumber: i.scanNumber,
      'create-date': `${createDate.toLocaleDateString()} ${createDate.toLocaleTimeString()}`,
      'update-date': `${updateDate.toLocaleDateString()} ${updateDate.toLocaleTimeString()}`
    }
  })
  TableProps.value.loading = false
}

onBeforeMount(async () => {
  await handleRefreshTableData()
})
</script>

<template>
  <data-table-index
    @refresh="handleRefreshTableData"
    :table-props="TableProps"
    export-name="搜寻列表表格数据"
  ></data-table-index>
</template>

<style scoped></style>
