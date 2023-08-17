import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
// 导入我的路由
import router from "./router/index"
// 导入ElementPlus
import ElementPlus from 'element-plus'
// 引用element的css
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'  // 引入Element Plus icon 所需

// import axios from './utils/ajax.js'
// import './utils/ajax.js'

const app = createApp(App)
// 引入Element Plus icon 所需
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.mount('#app')

// app.config.globalProperties.$axios=axios;  //配置axios的全局引用
