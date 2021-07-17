# qiankun-front

## 介绍

微前端探索，vue.2.x 作为基座，微应用分别为 vue2.x、umi、ant-design-pro、react

## 主应用配置

1. 安装 qiankun 插件

```
yarn add qiankun
```

2. 配置 main.js,注册子应用

```javascript
// 导入qiankun内置函数
import { registerMicroApps, start } from 'qiankun'

const microApps = [
  {
    name: 'user',
    entry:
      process.env.NODE_ENV === 'production'
        ? 'http://192.168.164.129:8081'
        : '//localhost:8081',
    container: '#container',
    activeRule: genActiveRule('/user'),
  },
]

// 路由匹配函数
function genActiveRule(routerPrefix) {
  return (location) => location.pathname.startsWith(routerPrefix)
}

// 注册子应用
registerMicroApps(microApps)

// 启动微服务
start()
```

## vue 微应用配置

1. src 目录下新增 `public-path`文件,并在`main.js`中引入

```javascript
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
```

2. 修改 src/router/index.js，导出 routes

```javascript
+ export default routes
- export default router
```

3. main.js 中配置

```javascript
import './public-path'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './router'
import store from './store'

Vue.config.productionTip = false

let router = null
let instance = null
function render(props = {}) {
  const { container } = props
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/vue/' : '/',
    mode: 'history',
    routes,
  })

  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app')
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped')
}
export async function mount(props) {
  console.log('[vue] props from main framework', props)
  render(props)
}
export async function unmount() {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}
```

4. 新增`vue.config.js`文件，配置如下

```javascript
const { name } = require('./package')
module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
}
```
