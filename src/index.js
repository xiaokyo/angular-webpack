import { app, start } from './pages'
import setServices from './services'
import setDirectives from './directives'
import setRouters from './routers'

import 'static/bootstrap-3.3.7-dist/css/bootstrap.min.css'
import 'static/Font-Awesome-3.2.1/css/font-awesome.min.css'
import 'static/css/swiper-3.4.2.min.css'
import 'static/css/common-boot4-part.css'

// style
import 'static/css/reset.css'
import 'static/css/style.css'
import 'erp_otweb/css/erp-public_style.css'
import 'erp_otweb/css/li_erp.css'
import 'erp_otweb/css/wa-erp.css'
import 'static/css/manage.css'
import 'static/css/manage02.css'
import 'static/css/merchandise.css'
import 'static/css/erp-warehouse.css'
import 'static/css/ruzhucus.css'
import 'static/css/customer-manage.css'

// 提供全局服务
setServices(app)

// 设置自定义指令
setDirectives(app)

// 设置路由
setRouters(app)

start(app)