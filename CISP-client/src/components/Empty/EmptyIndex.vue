<script setup lang="ts">
import type { Slot } from 'vue'
import { onBeforeMount, ref, toRefs, watch } from 'vue'

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

const handleJudgeIsEmpty = () => {
  if (
    !data.value ||
    (Array.isArray(data.value) && !data.value.length) ||
    (typeof data.value === 'object' && !Object.keys(data.value).length)
  ) {
    isEmpty.value = true
    return
  }
  isEmpty.value = false
}
onBeforeMount(handleJudgeIsEmpty)
watch(data, handleJudgeIsEmpty)
</script>

<template>
  <slot :name="isEmpty ? 'empty' : 'content'"></slot>
</template>

<style lang="less" scoped></style>
