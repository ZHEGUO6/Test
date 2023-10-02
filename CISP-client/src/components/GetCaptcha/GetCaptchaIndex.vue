<script setup lang="ts">
import CountDown from '@/components/CounDown.vue'
import { toRefs, onBeforeMount, ref } from 'vue'

const props = defineProps<{
  storage: boolean
  storageItemName: string
  onChange: () => void
}>()
const { storage, storageItemName, onChange } = toRefs(props)

const countDownTime = ref<number>(0) // 重新获取验证码的倒计时时间
const Storage = storage.value ? localStorage : sessionStorage

// 计时器组件时间改变回调
const onCountDownChange = (time: number) => {
  countDownTime.value = time
}

// 重置验证码验证剩余时间
const resetCountDownTime = () => {
  const val = Date.now() + 1000 * 120
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
  } else {
    // 第一次加载
    resetCountDownTime()
  }
})
</script>

<template>
  <div>
    <el-button v-if="countDownTime" :disabled="true" type="info">
      <count-down :on-change="onCountDownChange" :time="countDownTime" />
      <el-text>&nbsp;秒后重新获取验证码</el-text>
    </el-button>
    <el-button v-else type="primary" @click="btnGetCaptcha">
      <el-text>请重新获取验证码</el-text>
    </el-button>
  </div>
</template>

<style lang="less" scoped></style>
