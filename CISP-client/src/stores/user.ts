import { defineStore } from 'pinia'
import { login, loginOut } from '@/api/user'

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
    isLogined: (state) => {
      return !!state.userInfo.loginId
    }
  },
  actions: {
    async validate(info: API.User.validateLogin) {},
    async login(info: API.User.login) {
      const res = await login(info)

      if (res.data?.datas) {
        // 登录成功
        this.$patch((state) => (state.userInfo = res.data?.datas))
      }
      return res
    },
    async loginOut() {
      const res = await loginOut()
      this.$reset()
      return res
    }
  }
})
