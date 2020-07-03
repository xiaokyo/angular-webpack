(function () {
  const namespace = MODULE_PURCHASETHREE
  const app = angular.module(namespace.name)

  app.controller('ctrlPurchaseInside', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
    console.log('内部采购单')
    $scope.CAIGOU_TYPE = namespace.caigouType
    $scope.ACCEPT_TYPE = namespace.acceptType
    $scope.PAY_TYPE = namespace.payType
    const APIS = namespace.apis

    $scope.params = {
      type: '1',
      payType: '1',
      paymentTerm: '1',
      needPayFreight: 0,
    }
    // 订金字段显示的条件
    $scope.depositShow = function () {
      return $scope.params.payType == '3'
    }

    // 银行对应的字段显示的条件
    $scope.bankShow = function () {
      return $scope.params.paymentTerm == '1'
    }

    // 校验必填项
    function validField() {
      const { params, products, logistics, certPic } = $scope
      const { applicantName, pursueReason, shippingAddress, shippingName, shippingPhone, sellerCompany, sellerName, sellerPhone, deposit, totalPay, paymentTerm, payType, bankName, branchAddress, accountName, account, needPayFreight } = params

      if (!applicantName) return '申请人姓名'
      if (!pursueReason) return '申请原因'
      if (!shippingAddress) return '收货地址'
      if (!shippingName) return '收货联系人'
      if (!shippingPhone) return '收货人电话'
      if (!sellerCompany) return '卖家公司'
      if (!sellerName) return '卖家姓名'
      if (!sellerPhone) return '卖家电话'

      if (payType == 3) {
        if (!deposit) return '订金'
        if (!totalPay) return '尾款'
      } else {
        if (!totalPay) return '共需支付'
      }

      if (paymentTerm == 1) {
        if (!bankName) return '收款银行'
        // if (!branchAddress) return '收款银行支行'
        if (!accountName) return '账户名称'
        if (!account) return '银行账号'
      } else {
        if (!accountName) return '支付宝账户名称'
        if (!account) return '支付宝账号'
      }

      let productsDone = 0
      products.forEach(_ => {
        if (!!_.productName && !!_.productPrice && !!_.num) {
          productsDone += 1
        }
      })

      if (productsDone != products.length) return '并完善商品'
      if (certPic.length <= 0) return '采购凭证'
      return ''
    }

    $scope.submitPurchase = function () {
      const params = angular.copy($scope.params)
      // 格式成string
      const getPics = function () {
        const list = $scope.certPic
        if (!list || list.length <= 0) return ''
        let res = ''
        list.forEach(function (item, index) {
          res += (index === 0 ? '' : ',') + item
        })
        return res
      }

      const jsonObj = {
        caigouInternalProcurement: {
          ...params,
          purchasingDocuments: getPics()
        },
        caigouInternalProcurementProducts: $scope.products,
        caigouInternalProcurementLogisticss: $scope.logistics
      }

      console.log('params', jsonObj)
      layer.load(0)
      erp.postFun(APIS.saveInsidePurInfo, JSON.stringify(jsonObj), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
        layer.msg('操作成功')
        $scope.showFlag = false
        history.back(-1)
      })
    }

    $scope.submit = function () {
      const error = validField()
      if (error) return layer.msg('请输入' + error)

      $scope.showFlag = true
    }

    // 添加物流
    $scope.logistics = [{}]
    $scope.addLogistic = function () {
      if ($scope.logistics.length >= 5) return layer.msg('限制5条物流信息')
      $scope.logistics.push({})
    }

    $scope.delLogistic = function (index) {
      $scope.logistics.splice(index, 1)
    }

    // 添加物流
    $scope.products = [{}]
    $scope.addProducts = function () {
      $scope.products.push({})
    }

    $scope.delProducts = function (index) {
      $scope.products.splice(index, 1)
    }

    $scope.certPic = []
    // 上传组件的回调
    $scope.uploadFilesCallback = function ({ pics }) {
      console.log('uploadFilesCallback', pics)
      $scope.certPic = pics
    }

  }]) // 内部采购单 
})()