import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { whoAmI } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const validateLogin = async () => {
  const userStore = useUserStore()
  return (
    userStore.isLogin ||
    (await whoAmI().then(
      (res) => {
        if (res?.data) {
          userStore.$patch((state) => (state.userInfo = res.data?.datas as UserInfo))
          return true
        }
        return false
      },
      () => false
    ))
  )
}

export default async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (to.name === 'login') {
    // // 判断是否已经登录
    // // 如果已经登录，就直接跳转到首页
    if (await validateLogin()) {
      next('/')
      ElMessage.success('您已登陆，请勿重复登录')
      return
    }
    next()
    return
  }
  if (to.path !== '/' && to.meta.auth) {
    if (await validateLogin()) {
      next()
      return
    }
    next({ name: 'login' })
    return
  }
  next()
}
