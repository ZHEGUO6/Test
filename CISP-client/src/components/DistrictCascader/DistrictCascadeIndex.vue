<script setup lang="ts">
import { reactive, toRefs, onBeforeMount, ref, computed } from 'vue'
import { GD_WEB_API_DISTRICT } from '@/types/thirty-party'
import { SessionStorageItemName } from '@/types/enum'
import { getDistrict } from '@/api/three-party'
import { last as _last } from 'lodash'
import { NText, NSelect, NSpace } from 'naive-ui'

const props = defineProps<{
  cascadeGet: { [key: string]: string }
  cascadeSet: { [key: string]: string }
}>()

const { cascadeSet, cascadeGet } = toRefs(props)

// 地址级联选择器的选项
const cascadeOptions = reactive({
  province: [],
  city: [],
  district: [],
  street: []
})

// 是否正在加载省市级区数据
const fetchDistricts = reactive({
  province: false,
  city: false,
  district: false,
  street: false
})

const totalDistricts = ref<GD_WEB_API_DISTRICT>([]) // 全部的省市区县数据

/**
 * 解析省市级列表，获取需要的值，生成多级联动
 * @param districts 省市级数据
 * @param beginVal 开始的值
 * @param keys 需要设置的key country city district street
 * @param callBack 完成解析后的回调
 */
const parseDistrictToArraySingle = (
  districts: GD_WEB_API_DISTRICT[] | undefined,
  beginVal: string | undefined,
  keys: string[],
  callBack: (item: GD_WEB_API_DISTRICT | undefined, districts: GD_WEB_API_DISTRICT[]) => void
) => {
  if (!districts || !beginVal || !districts?.length) {
    return
  }
  let findItem = districts.find((i) => i.adcode === beginVal)
  if (findItem) {
    const reduce = keys.reduce(
      ({ districts, values }, cur, currentIndex) => {
        const obj = {
          districts: [...districts],
          values: [...values]
        }
        if (cur !== 'street') {
          // 计算下一个选择框的值
          try {
            obj.values.push(_last(districts)[0].districts[0])
          } finally {
            obj.districts.push(_last(districts)[0].districts)
          }
        }
        if (currentIndex === 0) {
          obj.districts.shift()
        }
        return obj
      },
      { districts: [[findItem]], values: [] }
    )
    reduce.values.forEach((i, ind) => callBack(i, reduce.districts[ind]))
  } else {
    //   该层没有需要的数据跳过
    parseDistrictToArraySingle(
      districts.find((i) => i.adcode.startsWith(beginVal.slice(0, 2)))?.districts,
      beginVal,
      keys,
      callBack
    )
  }
}

/**
 * 解析省市级列表，获取需要的值
 */
const parseDistrictToTotalArray = (
  districts: GD_WEB_API_DISTRICT[] | undefined,
  beginVal: string | undefined,
  key: string,
  callBack: (list: GD_WEB_API_DISTRICT[]) => void
) => {
  if (!districts || !beginVal || !districts?.length) {
    return
  }
  let findItem = districts.find((i) => i.adcode === beginVal)
  if (findItem) {
    callBack(findItem.districts)
  } else {
    //   该层没有需要的数据跳过
    parseDistrictToTotalArray(
      districts.find((i) => i.adcode.startsWith(beginVal.slice(0, 2)))?.districts,
      beginVal,
      key,
      callBack
    )
  }
}

// 远程获取选择器数据
const remote = async () => {
  const districtStr = sessionStorage.getItem(SessionStorageItemName.GdWebApiDistrict)
  if (districtStr) {
    totalDistricts.value = JSON.parse(districtStr) as GD_WEB_API_DISTRICT
  } else {
    const res = await getDistrict()
    if (res.status === '1') {
      const districts = res.districts
      totalDistricts.value = districts
      sessionStorage.setItem(SessionStorageItemName.GdWebApiDistrict, JSON.stringify(districts))
    }
  }
}

// 行政区选择器文本输入事件
const onDistrictInp = (prevValue: string, curLevel: string) => {
  return async (val: string) => {
    // 没有数据，获取全部数据
    // 正在获取数据
    fetchDistricts[curLevel] = true
    if (!cascadeOptions[curLevel].length) {
      parseDistrictToTotalArray(totalDistricts.value, prevValue, curLevel, (list) => {
        cascadeOptions[curLevel] = list
      })
    }
    if (val) {
      // 当前的搜索有值，筛选已经存在的结果
      cascadeOptions[curLevel] = cascadeOptions[curLevel].filter((i: any) => i.name.includes(val))
    } else {
      parseDistrictToTotalArray(totalDistricts.value, prevValue, curLevel, (list) => {
        cascadeOptions[curLevel] = list
      })
    }
    // 数据获取完毕
    fetchDistricts[curLevel] = false
  }
}

// 行政区选择器选中值改变事件
const onDistrictSelectChange = async (value: string, curLevel: string, nextLevels: string[]) => {
  // 先清空之前的数据
  nextLevels.forEach((i) => {
    cascadeSet.value[i] = cascadeGet.value[i] = ''
    cascadeOptions[i] = []
  })
  const decode = cascadeOptions[curLevel].find((i: any) => i.center === value)?.adcode
  cascadeGet.value[curLevel] = decode
  parseDistrictToArraySingle(cascadeOptions[curLevel], decode, nextLevels, (item, districts) => {
    cascadeOptions[item.level] = districts
    cascadeSet.value[item.level] = item.center
    cascadeGet.value[item.level] = item.adcode
  })
}

// 行政区选择器下拉框出现/隐藏时触发的事件
const onDistrictSelectVisibleChange = async (
  preValue: string,
  value: boolean,
  curLevel: string,
  clear?: boolean // 是否是调用了onclear函数
) => {
  if (value && (!cascadeOptions[curLevel].length || clear)) {
    // 下拉框显示，并且没有数据，获取数据
    // 开始加载数据
    fetchDistricts[curLevel] = true
    parseDistrictToTotalArray(totalDistricts.value, preValue, curLevel, (list) => {
      cascadeOptions[curLevel] = list
      // 数据加载完毕
      fetchDistricts[curLevel] = false
    })
  }
}

// 处理文字搜索
const handleSearch = computed(() => ({
  province: onDistrictInp('100000', 'province'),
  city: onDistrictInp(cascadeGet.value.province, 'city'),
  district: onDistrictInp(cascadeGet.value.city, 'district'),
  street: onDistrictInp(cascadeGet.value.district, 'street')
}))

onBeforeMount(() => {
  remote().then(() => console.log('获取省市级区列表数据成功'))
})
</script>

<template>
  <n-space class="flexFullBasis gridCenter">
    <n-space>
      <n-select
        v-model:value="cascadeSet.province"
        :remote="true"
        filterable
        :clearable="true"
        :loading="fetchDistricts.province"
        :options="cascadeOptions.province"
        placeholder="请选择省份"
        value-field="center"
        label-field="name"
        @update-show="(value:boolean) =>onDistrictSelectVisibleChange( '100000',value,'province')"
        @search="handleSearch.province"
        @update-value="(value:string) => onDistrictSelectChange(value, 'province', ['city','district','street'])"
        @clear="onDistrictSelectVisibleChange('100000', true, 'province', true)"
      />
      <n-text>省份</n-text>
    </n-space>

    <n-space>
      <n-select
        v-model:value="cascadeSet.city"
        :disabled="!cascadeSet.province"
        :remote="true"
        :filterable="true"
        :clearable="true"
        :loading="fetchDistricts.city"
        :options="cascadeOptions.city"
        placeholder="请选择城市"
        value-field="center"
        label-field="name"
        @update-show="(value:boolean) =>onDistrictSelectVisibleChange(cascadeGet.province, value,'city')"
        @search="handleSearch.city"
        @update-value="(value:string) => onDistrictSelectChange(value, 'city', ['district','street'])"
        @clear="onDistrictSelectVisibleChange(cascadeGet.province, true, 'city', true)"
      />
      <n-text>城市</n-text>
    </n-space>

    <n-space>
      <n-select
        v-model:value="cascadeSet.district"
        :disabled="!cascadeOptions.district.length && !cascadeSet.district"
        :remote="true"
        :filterable="true"
        :clearable="true"
        :placeholder="
          !cascadeOptions.district.length && !cascadeSet.district
            ? '当前区域没有区县这一分类'
            : '请选择区县'
        "
        :loading="fetchDistricts.district"
        :options="cascadeOptions.district"
        value-field="center"
        label-field="name"
        @update-show="(value:boolean) =>onDistrictSelectVisibleChange(cascadeGet.city,value,'district')"
        @search="handleSearch.district"
        @update-value="(value:string) => onDistrictSelectChange(value, 'district', ['street'])"
        @clear="onDistrictSelectVisibleChange(cascadeGet.city, true, 'district', true)"
      />
      <n-text>区县</n-text>
    </n-space>

    <n-space>
      <n-select
        v-model:value="cascadeSet.street"
        :disabled="!cascadeOptions.street.length && !cascadeSet.street"
        :remote="true"
        :filterable="true"
        :clearable="true"
        :placeholder="
          !cascadeOptions.street.length && !cascadeSet.street
            ? '当前区域没有街道这一分类'
            : '请选择街道'
        "
        :loading="fetchDistricts.street"
        :options="cascadeOptions.street"
        value-field="center"
        label-field="name"
        @update-show="(value:boolean) =>onDistrictSelectVisibleChange(cascadeGet.district,value,'street')"
        @search="handleSearch.street"
        @clear="onDistrictSelectVisibleChange(cascadeGet.district, true, 'street', true)"
      />
      <n-text>街道</n-text>
    </n-space>
  </n-space>
</template>

<style lang="less" scoped>
.gridCenter {
  align-items: center;
}
</style>
