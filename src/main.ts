import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// @ts-ignore
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import './styles/reset.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.mount('#app')
