<script setup lang="ts">
import CountDown from '@/components/CounDown.vue'
import { watch, onBeforeMount, ref, toRefs } from 'vue'
import { NButton, NText } from 'naive-ui'

const props = defineProps<{
  storage: boolean
  storageItemName: string
  durationTime?: number
  autoRefresh?: boolean
}>()

defineSlots<{
  activeContent(props: { countTime: number; countChange(timer: number): void }): any
  finishContent(props: { clickFunc(): void }): any
}>()

const emits = defineEmits<{ change: () => void }>()

const { storage, storageItemName, durationTime, autoRefresh } = toRefs(props)

const countDownTime = ref<number>(0) // 重新获取验证码的倒计时时间
const Storage = storage.value ? localStorage : sessionStorage

// 计时器组件时间改变回调
const onCountDownChange = (time: number) => {
  countDownTime.value = time
}

// 重置验证码验证剩余时间
const resetCountDownTime = () => {
  const val = Date.now() + (durationTime?.value || 1000 * 120)
  Storage.setItem(storageItemName.value, `${val}`)
  countDownTime.value = Math.floor((val - Date.now()) / 1000)
}

// 按钮更换验证码
const btnGetCaptcha = async () => {
  resetCountDownTime()
  console.log(222)
  emits('change')
}

if (autoRefresh.value) {
  watch(countDownTime, (count) => {
    if (!count) {
      btnGetCaptcha()
    }
  })
}

onBeforeMount(() => {
  if (Storage.getItem(storageItemName.value)) {
    let val = +(Storage.getItem(storageItemName.value) as string) - Date.now()
    if (val < 0) {
      val = 0
    } else {
      val = Math.floor(val / 1000)
    }
    countDownTime.value = val
  }
  if (autoRefresh.value && !countDownTime.value) {
    // 首次进入自动更新
    btnGetCaptcha()
  }
})

defineExpose({
  resetCountDownTime,
  countDownTime
})
</script>

<template>
  <div>
    <div v-show="countDownTime">
      <slot name="activeContent" :countTime="countDownTime" :countChange="onCountDownChange">
        <n-button disabled type="info" v-show="countDownTime">
          <n-text>请</n-text>
          <count-down :on-change="onCountDownChange" :time="countDownTime" />
          <n-text>&nbsp;秒后获取验证码</n-text>
        </n-button>
      </slot>
    </div>
    <div v-show="!countDownTime">
      <slot name="finishContent" :clickFunc="btnGetCaptcha">
        <n-button type="primary" @click="btnGetCaptcha">
          <n-text>获取验证码</n-text>
        </n-button>
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
