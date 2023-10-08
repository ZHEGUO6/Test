import type { RouteRecordRaw } from 'vue-router'
import { Meta } from '@/types/route'
import { Compass, Setting, Document, Bell, Search, Connection, User } from '@element-plus/icons-vue'

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
      icon: Compass,
      exact: true
    }
  },
  {
    path: '/friend',
    name: 'friend',
    component: () => import('@/views/Friend/friendPage.vue'),
    children: [
      {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/Friend/chatPage.vue'),
        meta: {
          label: '聊天'
        }
      }
    ],
    meta: {
      layout: true,
      label: '通讯录',
      icon: Connection
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/searchPage.vue'),
    meta: {
      layout: true,
      label: '搜寻',
      icon: Search
    }
  },
  {
    path: '/bulletin',
    name: 'bulletin',
    component: () => import('@/views/bulletinBoard.vue'),
    meta: {
      layout: true,
      label: '公告栏',
      icon: Bell
    }
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/newsPage.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '新闻',
      icon: Document
    }
  },
  {
    path: '/personalCenter',
    name: 'personalCenter',
    component: () => import('@/views/personalCenter.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '个人中心',
      icon: User
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settingPage.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '设置',
      icon: Setting
    }
  },
  {
    path: '/loginOrRegistry',
    name: 'loginOrRegistry',
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
