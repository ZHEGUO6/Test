import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

const pinia = createPinia()

// 使用持久化中间件，刷新后维护仓库数据
pinia.use((context) => {
  if (context.store.$id === 'user') {
    return createPersistedStatePlugin()(context)
  }
})

app.use(ElementPlus)
app.use(pinia)
app.use(router)

app.mount('#app')
