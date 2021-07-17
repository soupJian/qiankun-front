# qiankun-front

#### 介绍

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
