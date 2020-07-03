import controller from './index.controller'

// css
import 'erp_otweb/css/erp-ywy-home.css'
import 'erp_otweb/css/erp-wa-KeHu-style.css'

const mod = angular.module('home', [])
mod.controller('home.ctrl', controller)
export default mod