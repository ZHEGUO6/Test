import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { whoamI } from '@/api/user'
import { useUserStore } from '@/stores/user'

const vaildateLogin = async () => {
  const userStore = useUserStore()
  return !!(
    userStore.isLogined ||
    (await whoamI().then((res) => {
      if (res?.data?.datas) {
        userStore.$patch((state) => (state.userInfo = res.data.datas))
        return true
      }
      return false
    }))
  )
}

export default async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (to.path === '/login') {
    // // 判断是否已经登录
    // // 如果已经登录，就直接跳转到首页
    if (await vaildateLogin()) {
      next('/')
      return
    }
    next()
    return
  }
  if (to.path !== '/') {
    if (await vaildateLogin()) {
      next()
      return
    }
    next('/login')
    return
  }
  next()
}
