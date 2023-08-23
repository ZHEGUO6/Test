<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="帐号">
      <el-input v-model="form.nickname" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.loginPwd" />
    </el-form-item>
    <el-row>
      <el-col :span="18">
        <el-form-item label="验证码">
          <el-input v-model="form.captcha" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <div>123</div>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">登录</el-button>
      <el-button type="primary" @click="onRegister">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ToRefs, reactive } from 'vue'
import { useUserStore } from '../stores/user'
import { storeToRefs } from 'pinia'
import { validate, login } from '../api/user'
import { useRouter } from 'vue-router'
/**
 * data定义
 */
const form = reactive<object>({ nickname: '', loginPwd: '', captcha: '', saveTime: 500000 })
const userStoreInstance = useUserStore()
const router = useRouter()
const { isLogined, userInfo } = storeToRefs(useUserStore())
/**
 * 属性定义
 */
const props = defineProps({})

/**
 * 方法定义
 */
const onSubmit = async () => {
  const res = await userStoreInstance.login(form)
  if (isLogined) {
    router.push('/')
  }
}
const onRegister = () => {}
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
