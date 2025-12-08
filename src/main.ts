import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// @ts-ignore
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import './styles/reset.css'
import './styles/element-theme.css'

const app = createApp(App)
const pinia = createPinia()
app.use(ElementPlus)
app.use(pinia)
app.use(router)

// 初始化时从本地存储加载用户状态
const userStore = useUserStore()
userStore.loadFromLocalStorage()

app.mount('#app')
