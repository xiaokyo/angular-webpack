import { app, start } from './pages'
import { setServices } from './services'
import { setRouters } from './routers'

// 提供全局服务
setServices(app)

// 设置路由
setRouters(app)

start(app)