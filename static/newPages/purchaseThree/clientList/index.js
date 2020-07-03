(function () {
  const namespace = MODULE_PURCHASETHREE
  const app = angular.module(namespace.name)

  app.controller('ctrlStockoutClients', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
    console.log('订单缺货处理')
    const APIS = namespace.apis
    const variantId = $routeParams.variantId
    $scope.sku = $routeParams.sku
    $scope.orderType = 0 // 0 待发单  1 直发单

    function getList() {
      const params = {
        variantId
      }
      layer.load(2)
      erp.postFun(APIS.queryClientList, angular.toJson(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
        const obj = res.data.data
        $scope.list = obj.cjOrderList // 默认cj待发订单
        $scope.cjOrderList = obj.cjOrderList // cj订单
        $scope.payOrderList = obj.payOrderList // 直发订单
      })
    }
    $scope.getList = getList
    getList()

    // goBack
    $scope.goBack = function () {
      window.history.go(-1)
    }

    // changeOrderType 待发单和直发单切换
    $scope.changeOrderType = function (type) {
      $scope.orderType = type
      let list = (type == 0) ? $scope.cjOrderList : $scope.payOrderList
      $scope.list = angular.copy(list)
    }

    // goHandleOrderPage
    $scope.goHandleOrderPage = function (item) {
      const { orderIdList, customerName } = item
      sessionStorage.setItem('orderMap' + variantId, angular.toJson(orderIdList))
      location.href = '/manage.html#/erppurchase/handleOrders/' + $routeParams.variantId + '/' + $routeParams.sku + '/' + customerName
    }

  }])
})()