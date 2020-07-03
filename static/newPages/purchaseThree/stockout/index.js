(function () {
  const namespace = MODULE_PURCHASETHREE
  const app = angular.module(namespace.name)

  app.controller('ctrlPurchaseStockout', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
    console.log('采购缺货')
    $scope.CAIGOU_TYPE = namespace.caigouType
    $scope.ACCEPT_TYPE = namespace.acceptType
    $scope.PAY_TYPE = namespace.payType
    const APIS = namespace.apis

    $scope.handleOssImg = erp.handleOssImg

    // 全选
    $scope.isCheckedAll = false
    $scope.allCheck = function (checked) {
      console.log('allCheck', checked)
      $scope.list = $scope.list.map(_ => ({ ..._, checked, btList: _.btList && _.btList.map(i => ({ ...i, checked })) }))
    }
    // 商品checked
    $scope.proChecked = function (checked, item, index) {
      console.log('proChecked', checked, item)
      $scope.list[index].checked = checked // 将list指定项改状态
      isCheckVariants(checked, item, index)
      isCheckAll()
    }
    // 变体checked
    $scope.variantsChecked = function (checked, parentItem, item, parentIndex, index) {
      console.log('variantsChecked', checked, parentItem, item, parentIndex, index)
      $scope.list[parentIndex].btList[index].checked = checked
      isCheckAllPro(checked, parentIndex, parentIndex, index)
      isCheckAll()
    }
    // 判断是否全选
    function isCheckAll() {
      let checkedCount = 0, checkedAll = false, list = $scope.list, len = list.length;
      list.forEach(_ => { if (_.checked) checkedCount++ })
      if (checkedCount >= len) checkedAll = true
      $scope.isCheckedAll = checkedAll
    }
    // 是否选中变体
    function isCheckVariants(checked, item, index) {
      let btList = item.btList || [], len = btList.length;
      btList = btList.map(_ => ({ ..._, checked }))
      $scope.list[index].btList = btList
    }
    // 判断是否全选当前变体
    function isCheckAllPro(checked, parentItem, parentIndex, index) {
      let checkedCount = 0, checkedAll = false, list = $scope.list[parentIndex].btList, len = list.length;
      list.forEach(_ => { if (_.checked) checkedCount++ })
      if (checkedCount >= len) checkedAll = true
      $scope.list[parentIndex].checked = checkedAll
    }

    // 采购人
    $scope.purchasePersonCallback = function ({ id }) {
      console.log('purchasePersonCallback11111', id)
      $scope.buyerId = undefined
      $scope.personalizedIdentity = 2
      if (id == 'POD') $scope.personalizedIdentity = 1
      if (id != 'POD' && id != '') {
        $scope.buyerId = id
        $scope.personalizedIdentity = 0
      }
      // getList()
    }

    $scope.list = []
    $scope.pageNum = '1'
    $scope.pageSize = '20'
    $scope.params = {
      inputStr: '',
    }
    function getList() {
      const data = {
        ...$scope.params,
        buyerId: $scope.buyerId,
        personalizedIdentity: $scope.personalizedIdentity
      }
      const params = {
        data,
        pageNum: $scope.pageNum,
        pageSize: $scope.pageSize
      }
      layer.load(2)
      erp.postFun(APIS.stockoutList, angular.toJson(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
        const obj = res.data.data
        let list = obj.list || []
        const total = obj.total

        // orderMap
        $scope.list = list

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
    getList()
    $scope.getList = getList

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      $scope.pageNum = String(data.pageNum)
      $scope.pageSize = String(data.pageSize)
      getList()
    })

    // 计算缺货子订单数量
    function getOrderMap(list) {
      return list.map(_ => {
        const orderMapJson = angular.fromJson(_.orderMap) || {}
        const orderMapCount = Object.keys(orderMapJson).length
        return { ..._, orderMapJson, orderMapCount }
      })
    }

    // openSubOrderStockout  变体点击缺货子订单
    function openSubOrderStockout(item) {
      $scope.subOrderStockoutFlag = true
      $scope.orderList = item.orderList || []
    }
    $scope.openSubOrderStockout = openSubOrderStockout

    // 头部浮动
    let lastScroll
    $(window).scroll(function () {
      var before = $(window).scrollTop();
      if (before > 60) {
        $('.tit-box').css({
          "position": "fixed",
          "top": 0
        })
      } else if (before < 10) {
        $('.tit-box').css({
          "position": "static",
          "top": 0
        })
      }
    });

    // 移出
    $scope.confirmMoveout = function (type, item, parentItem) {
      //询问框
      layer.confirm('是否确认将选择的商品移出缺货列表？移出后，客户可继续下单', {
        title: '提示',
        btn: ['确定', '取消'] //按钮
      }, function () {

        let arr = []
        if (type == 'batch') {
          let res = []
          $scope.list.forEach((_, i) => {
            const obj = { pid: _.pid }
            let vids = []
            // let ids = []
            if (_.btList && _.btList.length > 0) {
              vids = _.btList.filter(j => j.checked).map(j => j.vid)
              // ids = _.btList.filter(j => j.checked).map(j => j.id)
            }

            if (vids.length > 0) {
              obj.vids = vids
              // obj.ids = ids
            }

            if (_.checked || vids.length > 0) {
              res.push(obj)
            }
          })
          arr = res
        } else if (type == 'product') {
          arr = [{ pid: item.pid, vids: [] }]
        } else if (type == 'variant') {
          arr = [{ pid: parentItem.pid, vids: [item.vid] }]
        }
        $scope.batchMoveout(arr)
      }, null);
    }

    // 批量移出
    $scope.batchMoveout = function (params) {
      layer.load(0)
      erp.postFun(APIS.moveOutStock, angular.toJson(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || "网络错误")
        layer.msg('操作成功')
        getList()
      })
    }

    // 展示该商品变体
    $scope.showBtFun = function (item, index) {
      item.btList = []
      item.toggle = !item.toggle
      item.toggle && getVariantsById(item)
    }
    // 获取变体by pid
    function getVariantsById(item) {
      const params = {
        // pid: item.pid,
        // isQueHuo: true
      }
      layer.load(2)
      erp.postFun(APIS.queryVariantsOne + '?pid=' + item.pid, angular.toJson(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
        const list = res.data.data
        item.btList = list
      })
    }

    // clear 添加信息
    function clearAddStockoutInfos(){
      $scope.addStockoutFlag = false
      $scope.skuChecked = false
      $scope.searchSku = ''
      $scope.skuList = []
    }

    // 添加缺货商品
    function addStockoutPro() {
      const list = $scope.skuList
      if (!list || list.length <= 0) return layer.msg('请先查询商品')
      const selectVariants = list.filter(_ => _.checked)
      if (selectVariants.length <= 0) return layer.msg('未选择变体')
      const params = selectVariants.map(_ => ({ vid: _.id, pid: _.pid, sku: _.sku }))
      layer.load(2)
      erp.postFun(APIS.addStockPro, angular.toJson(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || "网络错误")
        layer.msg('操作成功')
        // $scope.addStockoutFlag = false
        clearAddStockoutInfos()
        getList()
      })
    }
    $scope.addStockoutPro = addStockoutPro

    // searchSkuChange
    $scope.searchSkuChange = function (value) {
      $scope.searchSku = value
      // console.log('searchSku', $scope.searchSku)
    }

    // 查询商品by sku
    function getVariantsBySku() {
      const params = { sku: $scope.searchSku }
      layer.load(2)
      erp.postFun(APIS.queryProBySku, angular.toJson(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
        $scope.skuList = res.data.data.skus
      })
    }
    $scope.getVariantsBySku = getVariantsBySku

    // skuCheckedChange
    $scope.skuCheckedChange = function (checked) {
      $scope.skuChecked = checked
      $scope.skuList = $scope.skuList.map(_ => ({ ..._, checked }))
    }

    // variantsCheckedChange
    $scope.variantsCheckedChange = function (checked, item, index) {
      $scope.skuList[index].checked = checked
      const list = $scope.skuList || [], len = list.length;
      const selectedVariants = list.filter(_ => _.checked)
      let isCheckAll = false
      if (selectedVariants.length >= len) isCheckAll = true
      $scope.skuChecked = isCheckAll
    }

  }]) // 内部采购单 
})()