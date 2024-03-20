<script setup lang="ts">
import DataTableIndex from '@/components/DataTable/DataTableIndex.vue'
import { onBeforeMount, reactive } from 'vue'
import usePagination from '@/hooks/usePagination'
import { getNewsList } from '@/api/new'
import type { NDataTable, DataTable } from '@/types/component/dataTable'
import { useRouter } from 'vue-router'
type RowData = {
  key: number
  title: string
  content: string
  important: string
  scanNumber: number
  updatedAt: string
}

const { pageInfo, updatePageInfo } = usePagination()

const router = useRouter()

const columns: NDataTable['columns'] = [
  {
    key: 'title',
    title: '标题',
    ellipsis: true
  },
  {
    key: 'content',
    title: '内容',
    ellipsis: true
  },
  {
    key: 'important',
    title: '重要性',
    ellipsis: true
  },
  {
    key: 'scanNumber',
    title: '浏览量',
    ellipsis: true
  },
  {
    key: 'updatedAt',
    title: '更新时间',
    ellipsis: true
  }
]

const searchConf: DataTable['search'] = columns.map((i) => ({
  key: i.key,
  searchType: i.key === 'updatedAt' ? 'date' : 'string'
}))

const dataTableProps = reactive({
  remote: true,
  columns: columns,
  data: [] as Array<RowData>,
  rowProps: (row, index) => ({
    style: 'cursor:pointer',
    onClick: () => {
      // router.push({ name: '' })
      console.log(row)
    }
  })
} as unknown as Partial<NDataTable>)

onBeforeMount(async () => {
  const res = await getNewsList({ limit: pageInfo.limit, page: pageInfo.page })
  dataTableProps.data = res.data.datas.map(
    (i) =>
      ({
        key: i.newId,
        title: i.title,
        content: i.content,
        important: i.important ? '重要' : '普通',
        scanNumber: i.scanNumber,
        updatedAt: i.updatedAt
      } as RowData)
  )
})
</script>

<template>
  <div>
    <data-table-index :search="searchConf" :data-table-props="dataTableProps"></data-table-index>
  </div>
</template>

<style scoped></style>
