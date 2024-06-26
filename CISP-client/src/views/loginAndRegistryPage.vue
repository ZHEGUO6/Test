<script setup lang="ts">
import loginForm from '@/components/LoginForm/LoginFormIndex.vue'
import registryForm from '@/components/RegistryForm/RegistryFormIndex.vue'
import { ref, onBeforeMount } from 'vue'
import { LocalStorageItemName } from '@/types/enum'
import { NText } from 'naive-ui'

declare type LoginOrRegistry = 'login' | 'registry'

/**
 * data定义
 */
const type = ref<LoginOrRegistry>(
  (localStorage.getItem(LocalStorageItemName.LoginAndRegistryPageType) as LoginOrRegistry) ||
    'login'
) // 当前是登录还是注册

/**
 * 方法定义
 */

// 切换表单类型
const changeType = () => {
  delete history.state.type // 如果不删除，刷新页面会存在问题
  type.value === 'login' ? (type.value = 'registry') : (type.value = 'login')
  localStorage.setItem(LocalStorageItemName.LoginAndRegistryPageType, type.value)
}

onBeforeMount(() => {
  const t = history.state.type
  if (t) {
    type.value = t
    localStorage.setItem(LocalStorageItemName.LoginAndRegistryPageType, t)
  }
})
</script>

<template>
  <div class="pageContainer">
    <div class="title">
      <n-text>Welcome to</n-text>
      <n-text>Campus sharing platform</n-text>
      <n-text>欢迎来到</n-text>
      <n-text>校园共享平台</n-text>
    </div>
    <div class="loginFormContainer">
      <login-form class="form" v-if="type === 'login'" :change-type="changeType" />
      <registry-form class="form" v-else :change-type="changeType" />
    </div>
  </div>
</template>
<style scoped lang="less">
// 背景图片移动动画
@keyframes backgroundMove {
  0% {
    background-position: 1% 1%;
  }
  100% {
    background-position: 100% 100%;
  }
}

//表单背景旋转
@keyframes formBackground {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

//背景图片移动设置
.backgroundMove {
  animation-duration: 6s;
  background-repeat: no-repeat;
  animation-name: backgroundMove;
  animation-direction: alternate;
  animation-iteration-count: infinite;
  animation-timing-function: linear(-0 -2.94%, 1 100%);
}

// 伪类样式
.pseudo-classes {
  top: -84%;
  left: -50%;
  z-index: 1;
  content: '';
  width: 100%;
  height: 130%;
  position: absolute;
}

.pageContainer {
  height: 100vh;
  display: flex;
  .backgroundMove();
  align-items: center;
  background-size: 120% 120%;
  justify-content: space-around;
  background-image: url('/images/background.png');
  & .title {
    & > * {
      display: block;
      font-size: 2.5em;
      font-weight: bold;
      color: transparent;
      .backgroundMove();
      text-align: center;
      background-clip: text;
      animation-duration: 15s;
      background-size: 300% 300%;
      animation-direction: normal;
      -webkit-background-clip: text;
      background-image: url('/images/loginPageTitleBackground.png');
    }
  }
  & .loginFormContainer {
    width: 52%;
    height: 370px;
    overflow: hidden;
    position: relative;
    border-radius: 8px;
    & .form {
      inset: 2px;
      z-index: 5;
      width: 98.3%;
      height: 97%;
      margin-top: 3px;
      margin-left: 5px;
      position: relative;
      border-radius: 8px;
    }
    &::before {
      .pseudo-classes();
      animation-delay: -3s;
      animation-duration: 6s;
      transform-origin: bottom right;
      animation-name: formBackground;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      background: linear-gradient(0deg, transparent, #4d4dff, #4d4dff);
    }
    &::after {
      .pseudo-classes();
      animation-delay: -12s;
      animation-duration: 6s;
      transform-origin: bottom right;
      animation-name: formBackground;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      background: linear-gradient(
        0deg,
        transparent,
        rgba(196, 36, 151, 0.93),
        rgba(196, 36, 151, 0.93)
      );
    }
  }

  & .alignCenter {
    align-items: center;
  }
  & .btnCenter {
    flex-basis: 400px;
    margin-left: calc(50% - 210px);
  }
}
</style>
