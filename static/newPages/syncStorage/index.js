(function () {
  var app = angular.module('syncStorage', [])

  var APIS = {
      getStatus:'cj/homePage/getKaiQiXuNiKuCun',// 获取状态
      changeStatus:'cj/homePage/kaiQiXuNiKuCun',// 更改状态
  }

  var ctrlSyncStorage = function ($scope, erp, $routeParams) {
      console.log('更改虚拟仓状态')

      $scope.storageStatus = true // 商品虚拟库存状态

      var getStatus = function(){// 获取仓库状态  request
          layer.load(2)
          erp.postFun(APIS.getStatus,JSON.stringify($scope.addParams),function(data){
              layer.closeAll('loading')
              if(data.data.statusCode != 200) return layer.msg(data.data.message || '服务器打盹了')
              $scope.storageStatus = data.data.result
          })
      }
      getStatus()

      $scope.changeStatus = function(status){
        layer.load(2)
        erp.postFun(APIS.changeStatus,JSON.stringify({
          kaiQiXuNiKuCun:status
        }),function(data){
          layer.closeAll('loading')
          if(data.data.statusCode != 200) return layer.msg(data.data.message || '服务器打盹了')
          $scope.storageStatus = status
          layer.msg('操作成功')
        })
      }
  }
  app.controller('ctrlSyncStorage', ['$scope', 'erp', '$routeParams', ctrlSyncStorage]) // 虚拟库存状态   
})()