<template>
  <main>
    <div>欢迎你，{{ nickname }}</div>
    <div>
      <el-button @click="handleOut">退出登录</el-button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const {
  isLogin: { value: userLogin },
  userInfo: {
    value: { nickname }
  }
} = storeToRefs(userStore)
const router = useRouter()

const handleOut = async () => {
  await userStore.loginOut()
  await router.push({
    name: 'login',
    state: {
      type: 'login'
    }
  })
}
</script>

<style scoped></style>
