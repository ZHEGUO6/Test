import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import beforeEach from './beforeEach'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/NewsPage.vue')
    }
  ]
})

// 路由守卫
router.beforeEach(beforeEach)
export default router
