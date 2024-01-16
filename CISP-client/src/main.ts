import './styles/base.css'
import './styles/minix.less'
import './styles/global.less'
import '/public/font-common/iconfont.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import Message from '@/directives/Message'
import 'hover.css/css/hover-min.css'
import LoadingOptions from '@/directives/Loading'

const app = createApp(App)

const PiNia = createPinia()

// 使用持久化中间件，刷新后维护仓库数据
PiNia.use((context) => {
  if (context.store.$id === 'user') {
    return createPersistedStatePlugin({ storage: sessionStorage })(context)
  }
})

// 全局指令
app.directive('screenLoading', LoadingOptions)

// 全局使用
app.use(PiNia).use(router)

// 全局属性
app.config.globalProperties.$message = Message({ showClose: true, closable: true })
app.config.globalProperties.$messageRaw = Message()

window.$message = Message({ showClose: true, closable: true })

// 所有的导航，包括第一个导航，现在都是异步的，这意味着，如果你使用一个 transition，你可能需要等待路由 ready 好后再挂载程序
router.isReady().then(() => app.mount('#app'))
