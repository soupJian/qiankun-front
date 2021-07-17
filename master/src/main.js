import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import microApps from './mirco-apps'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 导入qiankun内置函数
import { registerMicroApps, start } from "qiankun"; 

// 注册子应用
registerMicroApps(microApps)
 
// 启动微服务
start();