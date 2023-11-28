<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const backHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <a-flex vertical class="not-found-container" align="center" gap="middle">
    <img src="/svg/404.svg" alt="404页面" />
    <el-text type="warning">Boom！当前页面被外星人劫持了</el-text>
    <el-button @click="backHome">返回首页</el-button>
  </a-flex>
</template>

<style lang="less" scoped>
.not-found-container {
  height: 100vh;
  background-color: #228ee3;

  & img {
    width: 100%;
    height: 520px;
    object-fit: contain;
  }

  & button {
    width: fit-content;
  }

  & span {
    font-size: 1.5rem;
  }
}
</style>
