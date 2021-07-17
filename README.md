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

## umi 微应用配置

1. 安装 @umijs/plugin-qiankun

```javascript
yarn add @umijs/plugin-qiankun -D
```

2. 修改 .umirc.ts 文件

```
// fastRefresh: {}, 取消热更新配置，否则会导致断开连接
  qiankun:{
    slave:{}
  },
  base: '/umi'
```

3. src 目录下新增 app.js/app.ts

```javascript
export const qiankun = {
  // 应用加载之前
  async bootstrap(props) {
    console.log('app1 bootstrap', props)
  },
  // 应用 render 之前触发
  async mount(props) {
    console.log('app1 mount', props)
  },
  // 应用卸载之后触发
  async unmount(props) {
    console.log('app1 unmount', props)
  },
}
```

4. 添加 package.json 下的 name 属性

## react 微应用配置

1. 在 `src` 目录新增 `public-path.js`：

```javascript
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
```

2. 修改 index.js

```javascript
import './public-path'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

function render(props) {
  const { container } = props
  ReactDOM.render(
    <App />,
    container
      ? container.querySelector('#root')
      : document.querySelector('#root')
  )
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}

export async function bootstrap() {
  console.log('[react16] react app bootstraped')
}

export async function mount(props) {
  console.log('[react16] props from main framework', props)
  render(props)
}

export async function unmount(props) {
  const { container } = props
  ReactDOM.unmountComponentAtNode(
    container
      ? container.querySelector('#root')
      : document.querySelector('#root')
  )
}
```

3. 安装 react-app-rewired

```javascript
yarn add react-app-rewired -D
```

4. 配置 package.json

```javascript
  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test",
+   "test": "react-app-rewired test",
    "eject": "react-scripts eject"
}
```

5. 配置 webpack

根目录下新增 config-overrieds.js

```javascript
const { name } = require('./package.json')
console.log(name)

module.exports = {
  webpack: function override(config, env) {
    // 取消热更新导致断开连接
    config.entry = config.entry.filter(
      (e) => !e.includes('webpackHotDevClient')
    )

    config.output.library = `${name}-[name]`
    config.output.libraryTarget = 'umd'
    config.output.jsonpFunction = `webpackJsonp_${name}`
    return config
  },
  devServer: (configFunction) => {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost)
      config.open = false
      config.hot = false
      config.headers = {
        'Access-Control-Allow-Origin': '*',
      }
      // Return your customised Webpack Development Server config.
      return config
    }
  },
}
```

### bug

如果控制台报错 config.config.entry.filter is not a function，则可能是版本太高了，我这里修改的版本如下

```javascript
"react": "^16.13.1",
"react-dom": "^16.13.1",
"react-scripts": "3.4.3",
```

同时注意在 App.js 中导入 React

```javascript
import React from 'react'
```
