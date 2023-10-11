import { defineStore } from 'pinia'
import { login, loginOut, registry, whoAmI } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => {
    const userInfo: UserInfo = {
      loginId: '',
      loginPwd: '',
      age: 0,
      avatar: '',
      nickname: '',
      mail: '',
      qq: '',
      wechat: '',
      intro: '',
      lastLoginDate: ''
    }
    return {
      userInfo
    }
  },
  getters: {
    isLogin: (state) => {
      return !!state.userInfo.loginId
    }
  },
  actions: {
    async registry(info: API.User.Add) {
      const res = await registry(info)
      if (res.data?.datas) {
        // 注册成功
        this.$patch((state) => (state.userInfo = res.data?.datas as UserInfo))
      }
      return res
    },
    async login(info: API.User.Login) {
      const res = await login(info)
      if (res.data?.datas) {
        // 登录成功
        this.$patch((state) => (state.userInfo = res.data?.datas as UserInfo))
      }
      return res
    },
    async loginOut() {
      const res = await loginOut()
      this.$reset()
      return res
    },
    async whoAmI() {
      const res = await whoAmI()
      if (res.data?.datas) {
        // 恢复登录成功
        this.$patch((state) => (state.userInfo = res.data?.datas as UserInfo))
      }
      return res
    }
  }
})
