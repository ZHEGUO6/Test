<script setup lang="ts">
import { NGrid, NGi, NText } from 'naive-ui'
</script>

<template>
  <n-grid>
    <n-gi class="center" :span="24">
      <n-text size="small" type="info">欢迎来到校园共享平台</n-text>
    </n-gi>
    <n-gi class="center" :span="24">
      <n-text size="small" type="info">Powered by Vue3</n-text>
    </n-gi>
  </n-grid>
</template>

<style lang="less">
.n-layout-footer{
  background: #e5ecfa;
  padding:8px 0;
}
</style>
