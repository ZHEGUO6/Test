<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import EmptyIndex from '@/components/Empty/EmptyIndex.vue'

const userStore = useUserStore()
const { isLogin, userInfo } = storeToRefs(userStore)
const router = useRouter()

const handleOut = async () => {
  await userStore.loginOut()
  await router.push({
    name: 'loginOrRegistry',
    state: {
      type: 'login'
    }
  })
}
</script>

<template>
  <main class="homeContainer">
    <el-space class="originElSpace" direction="vertical" :size="20">
      <el-row></el-row>
      <el-row justify="space-evenly">
        <el-col :span="11">
          <el-card shadow="hover" class="hvr-bounce-to-right hvr-skew-forward">
            <template #header>重要新闻</template>
            <div>123</div>
          </el-card>
        </el-col>
        <el-col :span="11">
          <el-card shadow="hover" class="hvr-bounce-to-right hvr-skew-forward">
            <template #header>重要公告</template>
            <div>123</div>
          </el-card>
        </el-col>
      </el-row>
      <el-row justify="space-evenly">
        <el-col :span="11">
          <el-card shadow="hover" class="hvr-bounce-to-right hvr-skew-forward">
            <template #header>数据统计</template>
            <empty-index :data="0">
              <template #content>
                <div>123</div>
              </template>
              <template #empty> empty </template>
            </empty-index>
          </el-card>
        </el-col>
        <el-col :span="11">
          <el-card shadow="hover" class="hvr-bounce-to-right hvr-skew-forward">
            <template #header>便捷浏览</template>
            <div>123</div>
          </el-card>
        </el-col>
      </el-row>
      <div>欢迎你，{{ userInfo.nickname }}</div>
      <div>
        <el-button @click="handleOut">退出登录</el-button>
      </div>
    </el-space>
  </main>
</template>

<style scoped lang="less">
@import 'src/styles/var';

.hvr-bounce-to-right {
  width: 100%;
  &::before {
    background-color: @baseThemeColor;
  }
}
.hvr-skew-forward {
  &:hover::before {
    background-color: @headerHoverColor;
  }
  &:hover {
    transform: skew(-4deg);
  }
}
</style>
