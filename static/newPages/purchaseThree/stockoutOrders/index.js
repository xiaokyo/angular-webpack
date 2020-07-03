(function () {
  const namespace = MODULE_PURCHASETHREE
  const app = angular.module(namespace.name)

  app.controller('ctrlPurchaseStockoutOrders', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
    console.log('采购缺货订单列表')
    const APIS = namespace.apis
    $scope.handleOssImg = erp.handleOssImg
    $scope.warehouseList = []
    $scope.storageId = ""

    $scope.pageNum = '1'
    $scope.pageSize = '20'

    // handleEnterSearch
    $scope.handleEnterSearch = function () {
      getList()
    }

    // 获取列表
    function getList() {
      const params = {
        data: {
          storageId: $scope.storageId,
          inputStr: $scope.inputStr
        },
        pageNum: $scope.pageNum,
        pageSize: $scope.pageSize
      }

      layer.load(0)
      erp.postFun(APIS.queryStockoutOrders, angular.toJson(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || "网络错误")
        const obj = res.data.data
        const list = obj.list
        const total = obj.total

        $scope.list = getOrderMap(list)
        console.log('$scope.list', $scope.list)

        $scope.$broadcast('page-data', {
          pageSize: $scope.pageSize,//每页条数
          pageNum: $scope.pageNum,//页码
          totalNum: Math.ceil(Number(total) / Number($scope.pageSize)),//总页数
          totalCounts: total,//数据总条数
          pageList: ['10', '20', '50'],//条数选择列表，例：['10','50','100']
          // showGo: false
        })

      })
    }
    $scope.getList = getList

    // 获取虚拟仓库列表
    $scope.totalOrderNum = 0
    function queryVirtualStorage() {
      erp.postFun(APIS.queryVirtualStorage, null, function (res) {
        if (res.data.code != 200) return layer.msg(res.data.message || '仓库获取失败')
        $scope.warehouseList = res.data.data || []
        $scope.warehouseList.forEach(_ => {
          $scope.totalOrderNum += +_.num
        })
        getList()
      })
    }
    queryVirtualStorage()

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      $scope.pageNum = String(data.pageNum)
      $scope.pageSize = String(data.pageSize)
      getList()
    })

    $scope.storageChange = function (id) {
      $scope.storageId = id
      getList()
    }

    // 跳转到处理缺货订单页面
    $scope.goHandleOrderPage = function (item) {
      const { variantId, orderMapJson, sku } = item
      let ids = []
      for (let key in orderMapJson) {
        ids.push(key)
      }
      sessionStorage.setItem('orderMap' + variantId, angular.toJson(ids))
      location.href = '/manage.html#/erppurchase/handleOrders/' + variantId + '/' + sku
    }

    // 跳转到客户列表页面
    $scope.openSubOrderStockout = function (item) {
      const { id, variantId, sku } = item
      location.href = '/manage.html#/erppurchase/customerStockList/' + variantId + '/' + sku
    }

    // 计算缺货子订单数量
    function getOrderMap(list) {
      return list.map(_ => {
        const orderMapJson = angular.fromJson(_.orderMap)
        const orderMapCount = Object.keys(orderMapJson).length
        return { ..._, orderMapJson, orderMapCount }
      })
    }

    // toggle
    $scope.showBtFun = function (item, index) {
      if (item.toggle) return item.toggle = false
      const params = {
        pid: item.productId,
        isQueHuo: true
      }
      layer.load(0)
      erp.postFun(APIS.queryVariants, angular.toJson(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || "网络错误")
        item.btList = getOrderMap(res.data.data)
        item.toggle = !item.toggle
      })
    }

  }]) // 内部采购单 
})()