import type { RouteRecordRaw } from 'vue-router'
import { Meta } from '@/types/route'
import { HomeFilled } from '@element-plus/icons-vue'

export type RouteRecord = RouteRecordRaw & {
  meta: Meta
}

const routes: readonly RouteRecord[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/homePage.vue'),
    meta: {
      layout: true,
      label: '首页',
      icon: HomeFilled
    }
  },
  {
    path: '/friend',
    name: 'friend',
    component: () => import('@/views/Friend/friendPage.vue'),
    // children:[
    //     {
    //         path:'/',
    //         name:'',
    //         component:()=>import('@/views/Friend/'),
    //     }
    // ],
    meta: {
      layout: true,
      label: '通讯录',
      icon: HomeFilled
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/searchPage.vue'),
    meta: {
      layout: true,
      label: '搜寻'
    }
  },
  {
    path: '/bulletin',
    name: 'bulletin',
    component: () => import('@/views/bulletinBoard.vue'),
    meta: {
      layout: true,
      label: '公告栏'
    }
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/newsPage.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '新闻'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settingPage.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '设置'
    }
  },
  {
    path: '/loginOrRegistry',
    name: 'login',
    component: () => import('@/views/loginAndRegistryPage.vue'),
    meta: {
      layout: false,
      hideInMenu: true
    }
  },
  {
    path: '/forgetPwd',
    name: 'forgetPwd',
    component: () => import('@/views/forgetPwd.vue'),
    meta: {
      layout: false,
      hideInMenu: true
    }
  }
]

export default routes
