<script setup lang="ts">
import { RouteLocationRaw, useRouter } from 'vue-router'
import { NText } from 'naive-ui'
import { toRefs } from 'vue'

const props = defineProps<{ to: RouteLocationRaw }>()
const router = useRouter()

const { to, ...options } = toRefs(props)

const linkTo = () => {
  router.push(props.to)
}
</script>

<template>
  <n-text v-bind="options" @click.once="linkTo">
    <slot name="default">忘记密码？点击此处找回</slot>
  </n-text>
</template>

<style lang="less" scoped></style>
