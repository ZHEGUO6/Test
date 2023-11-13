<script setup lang="ts">
import type { Slot } from 'vue'
import { toRefs, ref, onBeforeMount } from 'vue'

interface Slots {
  content: Slot
  empty: Slot
}

const props = defineProps<{
  data: any
}>()

defineSlots<Slots>()

const { data } = toRefs(props)

const isEmpty = ref<boolean>(false) // 数据是否为空

onBeforeMount(() => {
  data.value ?? (isEmpty.value = true)
  Array.isArray(data.value) && !data.value.length && (isEmpty.value = true)
  typeof data.value === 'object' && !Object.keys(data.value).length && (isEmpty.value = true)
  !data.value && (isEmpty.value = true)
})
</script>

<template>
  <slot :name="isEmpty ? 'empty' : 'content'"></slot>
</template>

<style lang="less" scoped></style>
