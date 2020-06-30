import angular from 'angular'

// 导出app实例
export const app = angular.module('manage', ['ui.router'])

/**启动项目 */
export const start = () => {
  app.controller('manage.ctrl', function ($scope, CalcService) {
    $scope.name = CalcService.square(5)
  })
} 