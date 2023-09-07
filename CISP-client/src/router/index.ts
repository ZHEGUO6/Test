import { createRouter, createWebHistory } from 'vue-router'
import beforeEach from './beforeEach'
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach(beforeEach)
export default router
