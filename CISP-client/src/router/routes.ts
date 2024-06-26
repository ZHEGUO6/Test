import type { RouteRecordRaw } from 'vue-router'
import { Meta, RoutePath } from '@/types/route'
import {
  Person,
  PersonCircle,
  PaperPlaneSharp,
  NotificationsSharp,
  NewspaperSharp,
  LogoWechat,
  GlobeSharp,
  FlowerSharp
} from '@vicons/ionicons5'

export type RouteRecord = RouteRecordRaw & {
  meta: Meta
}

const routes: readonly RouteRecord[] = [
  {
    path: RoutePath.Home,
    name: 'home',
    component: () => import('@/views/HomePage/homePage.vue'),
    meta: {
      layout: true,
      exact: true,
      label: '首页',
      icon: PaperPlaneSharp
    }
  },
  {
    path: RoutePath.Friend,
    name: 'friend',
    component: () => import('@/views/Friend/friendPage.vue'),
    children: [
      {
        path: RoutePath.Friend_Chat,
        name: 'chat',
        component: () => import('@/views/Friend/chatPage.vue'),
        meta: {
          label: '通讯录',
          icon: PersonCircle,
        }
      }
    ],
    meta: {
      layout: true,
      label: '聊天',
      icon: LogoWechat,
    }
  },
  {
    path: RoutePath.Search,
    name: 'search',
    meta: {
      layout: true,
      label: '搜寻',
      icon: GlobeSharp,
    },
    children: [
      {
        path: RoutePath.SearchList,
        name: 'searchList',
        component: () => import('@/views/Search/searchList.vue'),
        meta: {
          label: '搜寻列表',
          icon: GlobeSharp,
        }
      },
      {
        path: RoutePath.SearchAdd,
        name: 'searchAdd',
        component: () => import('@/views/Search/searchAdd.vue'),
        meta: {
          show:false,
          layout:false
        }
      }
    ],
  },
  {
    path: RoutePath.Bulletin,
    name: 'bulletin',
    component: () => import('@/views/bulletinBoard.vue'),
    meta: {
      layout: true,
      label: '公告栏',
      icon: NotificationsSharp,
    }
  },
  {
    path: RoutePath.News,
    name: 'news',

    component: () => import('@/views/newsPage.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '新闻',
      icon: NewspaperSharp,
    }
  },
  {
    path: RoutePath.PersonalCenter,
    name: 'personalCenter',

    component: () => import('@/views/personalCenter.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '个人中心',
      icon: Person,
    }
  },
  {
    path: RoutePath.Settings,
    name: 'settings',
    component: () => import('@/views/settingPage.vue'),
    meta: {
      auth: true,
      layout: true,
      label: '设置',
      icon: FlowerSharp,
    }
  },
  {
    path: RoutePath.LoginOrRegistry,
    name: 'loginOrRegistry',
    component: () => import('@/views/loginAndRegistryPage.vue'),
    meta: {
      layout: false,
      show: false
    }
  },
  {
    path: RoutePath.ForgetPwd,
    name: 'forgetPwd',
    component: () => import('@/views/forgetPwd.vue'),
    meta: {
      layout: false,
      show: false
    }
  },
  {
    path: RoutePath.NotFound,
    name: '404',
    component: () => import('@/views/NotFound/index.vue'),
    meta: {
      layout: false,
      show: false
    }
  }
]

export default routes
