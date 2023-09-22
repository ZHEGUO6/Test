import './styles/global.less'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import 'ant-design-vue/dist/reset.css'
import ElementPlus from 'element-plus'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import Message from '@/directives/Message'

const app = createApp(App)

const PiNia = createPinia()

// 使用持久化中间件，刷新后维护仓库数据
PiNia.use((context) => {
  if (context.store.$id === 'user') {
    return createPersistedStatePlugin()(context)
  }
})

// 全局指令

// 全局使用
app.use(ElementPlus).use(Antd).use(PiNia).use(router)

// 全局属性
app.config.globalProperties.$message = Message({ showClose: true })
app.config.globalProperties.$messageRaw = Message()

// 所有的导航，包括第一个导航，现在都是异步的，这意味着，如果你使用一个 transition，你可能需要等待路由 ready 好后再挂载程序
router.isReady().then(() => app.mount('#app'))
