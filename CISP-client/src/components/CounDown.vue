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

watch(props, () => {
  if (props.time > 0) {
    startDown() // 开始倒计时
  }
})

// 开始倒计时
const startDown = () => {
  if (!timer.value) {
    timer.value = setInterval(() => {
      const t = props.time - 1
      props.onChange(t)
      if (t <= 0) {
        stopDown() //停止倒计时
      }
    }, 1000) as unknown as number
  }
}

// 停止倒计时
const stopDown = () => {
  clearInterval(timer.value as number)
  timer.value = null
  props.onFinish && props.onFinish() // 倒计时完成
}

onMounted(() => {
  // 预防刷新后检测不到time变化
  if (props.time) {
    startDown()
  }
})
</script>

<style scoped></style>
