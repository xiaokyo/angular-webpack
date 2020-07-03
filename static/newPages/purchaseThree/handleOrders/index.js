(function () {
  const namespace = MODULE_PURCHASETHREE
  const app = angular.module(namespace.name)

  app.controller('ctrlHandleOrders', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
    console.log('订单缺货处理')
    const APIS = namespace.apis
    const variantId = $routeParams.variantId
    // const status = $routeParams.status || 10

    $scope.warehouseList = window.warehouseList
    $scope.getStoreName = function (store) {// 获取仓库名称
      const obj = $scope.warehouseList.find(_ => _.store == store)
      if (obj) return obj.name
      return '--'
    }

    $scope.sku = $routeParams.sku // 当前sku
    $scope.clientName = $routeParams.clientName // 当前客户

    // 订单数组
    let ids = sessionStorage.getItem('orderMap' + variantId)
    ids = angular.fromJson(ids)

    $scope.params = {
      ids,
      status
    }
    function getList() {
      const params = angular.copy($scope.params)
      layer.load(0)
      erp.postFun(APIS.dropshippingOrders, angular.toJson(params), function (res) {
        if (res.data.code != 200) return layer.msg(res.data.message || '代发单获取失败')
        const list = res.data.data
        // const total = obj.total
        $scope.list = list
        $scope.cjOrderList = list // cj订单

        erp.postFun(APIS.straightHairOrders, angular.toJson(params), function (res) {
          layer.closeAll('loading')
          if (res.data.code != 200) return layer.msg(res.data.message || '直发单获取失败')
          const list1 = res.data.data
          $scope.payOrderList = list1 // 直发订单

          // 待发单无数据跳转到直发单
          if ($scope.cjOrderList.length <= 0) $scope.changeOrderType(1)
          else $scope.changeOrderType(0)
        })
      })
    }
    $scope.getList = getList
    getList()

    // goBack
    $scope.goBack = function () {
      window.history.go(-1)
    }

    // 代发和直发切换
    $scope.orderType = 0 // 0 待发单  1 直发单
    $scope.changeOrderType = function (type) {
      $scope.orderType = type
      let list = type == 0 ? $scope.cjOrderList : $scope.payOrderList
      $scope.list = angular.copy(list)
    }

    // 缺货处理
    $scope.currentHandleOrder = undefined // 当前订单信息
    $scope.openStockout = function (order) {
      $scope.currentHandleOrder = order
      $scope.stockoutHandleFlag = true
      $scope.clearHandleOrderForm()
    }

    // 缺货处理回调
    $scope.handleOrderCallback = function (data, type) {
      // if (type == 1) {// 分开发货  拆单成功
      //   getList()
      //   $scope.stockoutHandleFlag = false
      // }
      getList()
      $scope.stockoutHandleFlag = false
    }

    // 采购缺货sku状态
		$scope.orderStockoutHandleObj = {
			'0':'待退款',
			'1':'已退款',
			'2':'已拒绝'
		}

    // 缺货初始执行的回调
    $scope.initStockorderCallback = function(seeStockoutLog, clearHandleOrderForm){ 
      $scope.outOfStockHandleLog = seeStockoutLog 
      $scope.clearHandleOrderForm = clearHandleOrderForm
    }

  }])
})()