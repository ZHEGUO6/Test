<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, getCurrentInstance } from 'vue'
import { DArrowRight, SwitchButton, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import type { MessageOptions } from 'element-plus/lib/components'

const userStore = useUserStore()
const {
  isLogin: { value: userLogin },
  userInfo: {
    value: { nickname, avatar }
  }
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
  <el-row justify="space-between">
    <el-row align="middle" class="header-breadcrumb">
      <el-breadcrumb :separator-icon="DArrowRight">
        <el-breadcrumb-item
          v-for="(item, ind) in routeMath"
          :key="ind"
          :to="item.children ? null : { name: item.name }"
          ><el-text size="large" :type="ind === routeMath.length - 1 ? 'primary' : 'info'">{{
            item.meta.label
          }}</el-text>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row align="middle" class="header-notice">
      <el-col :span="4">
        <i class="iconfont i-tongzhi"></i>
      </el-col>
      <el-col :span="19" class="loopWheelContainer"
        ><el-text class="loopWheel" type="primary" size="large"
          >欢迎来到校园共享平台</el-text
        ></el-col
      >
    </el-row>
    <el-row class="center">
      <el-col :span="5" v-if="userLogin" class="center">
        <el-space>
          <el-avatar :size="35" :src="avatar" />
          <el-text>{{ nickname }}</el-text>
        </el-space>
      </el-col>
      <el-col :span="5" class="center headerItemContainer">
        <el-space :size="3" @click="handleOut">
          <el-icon class="headerFuncIcon"><SwitchButton /></el-icon>
          <span class="curPointer">退出平台</span>
        </el-space>
      </el-col>
      <el-col :span="5" class="center headerItemContainer">
        <el-space :size="3">
          <el-icon class="headerFuncIcon"><Message /></el-icon>
          <span class="curPointer">系统消息</span>
        </el-space>
      </el-col>
    </el-row>
  </el-row>
</template>

<style scoped lang="less">
@import 'src/styles/var';

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
  flex-basis: 220px;
}

.i-tongzhi {
  font-size: 25px;
}

.loopWheelContainer {
  position: relative;
  overflow: hidden;
  min-height: 31px;
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
  top: 0;
  transform: translateY(-50%);
  transition: all 0.5s;
  animation-name: wheel;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-duration: 5s;
}
</style>
