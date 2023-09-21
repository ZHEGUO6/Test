<template>
  <el-text>
    {{ time }}
  </el-text>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
const props = defineProps<{
  time: number
  onChange: (time: number) => void
  onFinish?: () => void
}>()
const timer = ref<number | null>(null) // 计时器id

onMounted(() => {
  startDown() // 开始倒计时
})

watch(props, () => {
  if (props.time > 0 && !timer.value) {
    startDown()
  } else if (props.time <= 0) {
    stopDown() //停止倒计时
  }
})

// 开始倒计时
const startDown = () => {
  if (!timer.value) {
    timer.value = setInterval(() => {
      props.onChange(props.time - 1)
    }, 1000)
  }
}

// 停止倒计时
const stopDown = () => {
  clearInterval(timer.value as number)
  timer.value = null
  props.onFinish && props.onFinish() // 倒计时完成
}
</script>

<style scoped></style>
