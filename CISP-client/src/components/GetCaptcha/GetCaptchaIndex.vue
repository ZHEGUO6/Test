<script setup lang="ts">
import CountDown from '@/components/CounDown.vue'
import { Component, onBeforeMount, ref, toRefs } from 'vue'

const props = defineProps<{
  storage: boolean
  storageItemName: string
  onChange: () => void
  finishContent?: string | Component
  activeText?: string | Component
  durationTime?: number
}>()

const { storage, storageItemName, onChange, durationTime } = toRefs(props)

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
  onChange.value()
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
  if (!countDownTime.value) {
    btnGetCaptcha() // 上次的倒计时已结束更换验证码
  }
})

defineExpose({
  resetCountDownTime
})
</script>

<template>
  <div>
    <el-button disabled type="info" v-show="countDownTime">
      <el-text>请</el-text>
      <count-down :on-change="onCountDownChange" :time="countDownTime" />
      <slot name="activeText">
        <el-text>&nbsp;秒后获取验证码</el-text>
      </slot>
    </el-button>
    <div v-show="!countDownTime">
      <slot name="finishContent" :click-func="btnGetCaptcha">
        <el-button type="primary" @click="btnGetCaptcha">
          <el-text>获取验证码</el-text>
        </el-button>
      </slot>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
