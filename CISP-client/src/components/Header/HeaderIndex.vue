<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, getCurrentInstance } from 'vue'
import { Send, MailOpenSharp } from '@vicons/ionicons5'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import AvatarIndex from '@/components/Avatar/AvatarIndex.vue'
import { NSpace, NBreadcrumb, NBreadcrumbItem, NGrid, NGridItem, NIcon, NText } from 'naive-ui'
import type { MessageOptions } from 'naive-ui'

const userStore = useUserStore()
const {
  isLogin: { value: userLogin },
  userInfo
} = storeToRefs(userStore)
const router = useRouter()

const app = getCurrentInstance()?.appContext.config.globalProperties

// 退出登录
const handleOut = async () => {
  await userStore.loginOut()
  app.$message({
    type: 'success',
    message: '退出登录成功'
  } as MessageOptions)
  await router.push({
    name: 'loginOrRegistry',
    state: {
      type: 'login'
    }
  })
}

const route = useRoute()

const routeMath = computed(() => route.matched)
</script>

<template>
  <n-space justify="space-between" class="headerContainer">
    <n-breadcrumb>
      <n-breadcrumb-item v-for="(item, ind) in routeMath" :key="ind">
        <n-space :size="3" class="headerRouteItem"
          ><n-icon :component="item.meta.icon" /><n-text size="large">{{
            item.meta.label
          }}</n-text></n-space
        >
      </n-breadcrumb-item>
    </n-breadcrumb>
    <n-grid class="header-notice">
      <n-grid-item :span="3">
        <i class="iconfont i-tongzhi"></i>
      </n-grid-item>
      <n-grid-item :offset="1" :span="19" class="loopWheelContainer"
        ><n-text class="loopWheel" type="primary" size="large"
          >欢迎来到校园共享平台</n-text
        ></n-grid-item
      >
    </n-grid>
    <n-space class="center">
      <!-- 用户头像 -->
      <div class="center">
        <avatar-index :info="userInfo" />
      </div>
      <!-- 系统消息 -->
      <n-space :size="3" class="headerItemContainer">
        <n-icon class="headerFuncIcon"><mail-open-sharp /></n-icon>
        <span class="curPointer">系统消息</span>
      </n-space>
      <!-- 退出平台 -->
      <n-space :size="3" @click="handleOut" class="headerItemContainer">
        <n-icon class="headerFuncIcon"><Send /></n-icon>
        <span class="curPointer">退出平台</span>
      </n-space>
    </n-space>
  </n-space>
</template>

<style scoped lang="less">
@import 'src/styles/var';
.headerContainer {
  height: 100%;
  align-items: center;
  padding: 0 20px;
  & > :first-child {
    align-self: flex-start;
  }
}

.center {
  flex-basis: 500px;
}

// 功能性图标
.headerFuncIcon {
  cursor: pointer;
  font-size: 1.5em;
}

.headerItemContainer {
  &:hover {
    color: @headerHoverColor;
  }
}

// 面包屑
.header-breadcrumb {
  flex-basis: 400px;
}

// 滚动通知
.header-notice {
  flex-basis: 250px;
  align-items: center;
}

.i-tongzhi {
  font-size: 25px;
}

.loopWheelContainer {
  position: relative;
  overflow: hidden;
  min-height: 31px;
  display: flex;
  align-items: center;
}

@keyframes wheel {
  from {
    transform: translateX(200px);
  }
  to {
    transform: translateX(-160px);
  }
}

// 循环滚动
.loopWheel {
  position: absolute;
  left: 0;
  top: 8%;
  transform: translateY(-50%);
  transition: all 0.5s;
  animation-name: wheel;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-duration: 5s;
}
</style>
