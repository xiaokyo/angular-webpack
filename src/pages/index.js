import angular from 'angular'
import uirouter from 'angular-ui-router'
import oclazyload from 'oclazyload'

// style
import './common.less'

export { angular }

// 导出app实例
export const app = angular.module('manage', [uirouter, oclazyload])

/**启动项目 */
export const start = () => {
  app.controller('manage.ctrl', function ($scope, CalcService) {
    $scope.name = CalcService.square(5)
  })
} 