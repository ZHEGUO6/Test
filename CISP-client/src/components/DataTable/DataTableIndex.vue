<script setup lang="ts">
import {
  NDataTable,
  NSpace,
  NInput,
  NForm,
  NFlex,
  NIcon,
  NFormItem,
  NButton,
  NDatePicker,
  NModal,
  FormInst,
  DataTableInst,
  DataTableColumn,
  DataTableColumns,
  NTooltip
} from 'naive-ui'
import type { DataTable, NDataTable as NDataTableInter } from '@/types/component/dataTable'
import type { ModalProps } from 'naive-ui'
import { onBeforeMount, reactive, ref, toRefs, watch } from 'vue'
import { defaultProps } from '@/types/component/dataTable'
import SlidingWindow from '@/components/SlidingWindow/SlidingWindow.vue'
import { RefreshCircleOutline, SearchCircleOutline, DownloadOutline } from '@vicons/ionicons5'
import useThemeStyleVars from '@/hooks/useThemeStyleVars'

const emits = defineEmits<{
  refresh: []
}>()

const p = withDefaults(defineProps<DataTable>(), defaultProps)
const { search, exportName, tableProps } = toRefs<DataTable>(p)

const searchList = ref<NDataTableInter['columns']>(
  tableProps.value.columns.filter((i: DataTableColumn) => i.filter)
) // 搜索列表

// const waitSearchList = ref<NDataTableInter['columns']>([]) // 待选择的搜索项列表
//
// const configSearch = ref(false) // 开启配置选项

const themeStyle = useThemeStyleVars(['primaryColor', 'primaryColorHover', 'borderRadius'])

const tableRef = ref<DataTableInst>()

const resetFormModel = (value: DataTableColumns) => {
  const result = {}
  value.forEach((i) => {
    if (i.key.includes('date')) {
      result[i.key] = null
      return
    }
    result[i.key] = ''
  })
  return result
}

const formModel = ref(resetFormModel(searchList.value))

const formRef = ref<FormInst>()

// // 模态框配置
// const modelOption = ref<ModalProps>({
//   show: configSearch.value
// })

// 处理搜索
const handleSearch = async () => {
  const filter = Object.fromEntries(
    Object.entries(formModel.value)
      .filter((i) => i[1])
      .map((i) => [i[0], [i[1]]])
  )
  tableProps.value.columns = tableProps.value.columns.map((i: any) => {
    const needFilter = filter[i.key]
    const value = needFilter
      ? i.key.includes('date')
        ? needFilter[0].join(',')
        : needFilter[0]
      : null
    return {
      ...i,
      filterOptions: needFilter ? [{ label: needFilter[0], value }] : undefined,
      filterOptionValue: value
    }
  })
}

// 处理重置
const handleReset = () => {
  tableProps.value.columns = tableProps.value.columns.map((i: DataTableColumn) => ({
    ...i,
    filterOptionValue: null
  }))
  for (const formModelKey in formModel.value) {
    if (formModelKey.includes('date')) {
      formModel.value[formModelKey] = null
    } else {
      formModel.value[formModelKey] = ''
    }
  }
}

// 配置搜索选项
const configSearchOption = () => {
  configSearch.value = true
}

const handleSearchOptionClose = (it: any) => {
  searchList.value = searchList.value.filter((i) => i.key !== it.key)
  waitSearchList.value.push(it)
}

// 刷新表格数据
const refreshTableData = () => {
  emits('refresh')
}

// 导出表格数据
const exportTableData = () => {
  tableRef.value?.downloadCsv({
    keepOriginalData: false,
    fileName: exportName?.value ?? '当前表格数据'
  })
}

watch(searchList, (value) => {
  formModel.value = resetFormModel(value)
})

onBeforeMount(() => {
  // 处理默认的column配置
  tableProps.value.columns = tableProps.value.columns.map((i: DataTableColumn) => ({
    ...i,
    filterMultiple: false,
    renderFilter: () => null
  }))
  tableProps.value.maxHeight = `calc(100vh - ${!search?.value ? 270 : 330}px)`
})
</script>

<template>
  <div :style="themeStyle">
    <!--  搜索区域  -->
    <n-flex v-if="search" :wrap="false" :vertical="false">
      <sliding-window max-width="calc(100vw - 413px)" initial-width="100vw">
        <n-form ref="formRef" label-placement="left" :model="formModel" :show-feedback="false">
          <n-flex :wrap="false" :vertical="false">
            <n-form-item
              v-for="item in searchList"
              :key="item.key"
              :path="item.key"
              :label="item.title"
            >
              <n-input
                v-if="!item.key.includes('date')"
                clearable
                v-model:value="formModel[item.key]"
                :placeholder="`请输入${item.title}`"
                size="small"
              />
              <n-date-picker
                v-else
                v-model:value="formModel[item.key]"
                type="datetimerange"
                :placeholder="`请选择${item.title}`"
                clearable
                size="small"
              />
            </n-form-item>
          </n-flex>
        </n-form>
      </sliding-window>
      <!--   操作按钮   -->
      <n-space :size="5" class="operationContainer">
        <n-button size="small" @click="handleSearch">搜索</n-button>
        <n-button size="small" @click="handleReset">重置</n-button>
      </n-space>
    </n-flex>
    <!--  表格顶部操作区域  -->
    <n-flex justify="right" class="operation-menu-container" align="center">
      <!--      <n-tooltip>-->
      <!--        <template #trigger>-->
      <!--          <n-icon :size="27" class="operation-menu-item" @click="configSearchOption">-->
      <!--            <search-circle-outline />-->
      <!--          </n-icon>-->
      <!--        </template>-->
      <!--        <span>配置搜索选项</span>-->
      <!--      </n-tooltip>-->
      <n-tooltip>
        <template #trigger>
          <n-icon :size="25" class="operation-menu-item" @click="refreshTableData">
            <refresh-circle-outline />
          </n-icon>
        </template>
        <span>刷新表格数据</span>
      </n-tooltip>
      <n-tooltip>
        <template #trigger>
          <n-icon :size="23" class="operation-menu-item" @click="exportTableData">
            <download-outline />
          </n-icon>
        </template>
        <span>导出</span>
      </n-tooltip>
    </n-flex>
    <!--  表格区域  -->
    <n-data-table v-bind="tableProps" ref="tableRef"> </n-data-table>
  </div>
</template>

<style scoped>
.flex {
  & > * {
    display: inline-block;
    white-space: nowrap;
    margin-right: 10px;
  }
  & > :last-child {
    margin-right: 0;
  }
}

.operationContainer {
  margin-top: 3px;
}

.operation-menu-container {
  padding: 10px 5px 10px 0;
  background-color: var(--primaryColor);
  border-top-left-radius: var(--borderRadius);
  border-top-right-radius: var(--borderRadius);
  & .operation-menu-item {
    cursor: pointer;
    &:hover {
      color: var(--primaryColorHover);
    }
  }
}

.data-table-wrapper-container-search-config > span {
  font-size: 16px;
  font-weight: 550;
  color: #228ee3;
  &.data-table-wrapper-container-search-config-title-unselect {
    color: #7e7878;
  }
}
</style>

<style>
.data-table-wrapper-container {
  & .n-data-table-wrapper {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
