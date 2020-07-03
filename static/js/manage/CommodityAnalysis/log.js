(function () {
  var app = angular.module('analysis1', ['service']);
  app.controller('analysisLog', ['$scope', '$http', 'erp', 'merchan', function ($scope, $http, erp, merchan) {
    $scope.logShow = true;
    $scope.model = false;
    $scope.title = '咨询详情';
    // 操作-咨询切换
    $scope.tabShow = function (curr) {
      curr == 1 ? $scope.logShow = true : $scope.logShow = false
    }
    $scope.modelShow = function () {
      $scope.model = true;
    }
    // 关闭
    $scope.cancel = function () {
      $scope.model = false;
    };
  }])
})()