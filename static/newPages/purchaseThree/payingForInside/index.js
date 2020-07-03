(function () {
  const namespace = MODULE_PURCHASETHREE
  const app = angular.module(namespace.name)

  const APIS = namespace.apis

  app.controller('ctrlPayingForInside', ['$scope', 'erp', '$routeParams', '$timeout', 'merchan', function ($scope, erp, $routeParams, $timeout, merchan) {
    console.log('内部采购单待付款')

    $scope.CAIGOU_TYPE = namespace.caigouType
    $scope.PAY_TYPE = namespace.payType
    $scope.ACCEPT_TYPE = namespace.acceptType
    $scope.PAYFOR_TYPE = namespace.payforType
    $scope.status = $routeParams.status || '0' // 0 未付款  1 已付款

    $scope.params = {
      status: $scope.status,
    }
    $scope.pageNum = '1'
    $scope.pageSize = '20'
    function getList() {
      const params = angular.fromJson($scope.params)
      const jsonS = {
        data: params,
        pageNum: $scope.pageNum,
        pageSize: $scope.pageSize
      }
      layer.load(2)
      erp.postFun(APIS.payingInsideList, angular.toJson(jsonS), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
        const { list, total } = res.data.data
        $scope.list = list

        $scope.$broadcast('page-data', {
          pageSize: $scope.pageSize,//每页条数
          pageNum: $scope.pageNum,//页码
          totalNum: Math.ceil(Number(total) / Number($scope.pageSize)),//总页数
          totalCounts: total,//数据总条数
          pageList: ['10', '20', '50']//条数选择列表，例：['10','50','100']
        })

      })
    }
    getList()
    $scope.getList = getList

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      $scope.pageNum = data.pageNum;
      $scope.pageSize = data.pageSize;
      getList();
    })

    // 采购员回调
    $scope.purchasePersonCallback = function ({ id, loginName }) {
      $scope.params.buyer = loginName
    }

    // 采购tab点击
    $scope.changeCaigouType = function (type) {
      const status = $scope.status
      let url = '/manage.html#/erppurchase/paying/' + type
      if (status == 1) url = '/manage.html#/erppurchase/payed/' + type
      location.href = url
    }

    // 格式化运单号
    $scope.formatZhuiZongHao = function (item) {
      let res = ''
      item.caigouInternalProcurementLogisticss.forEach((item, index) => {
        res += (item.logisticsName || '未填写') + "：" + (item.logisticsNum || '未填写') + '\n'
      })
      if (res.indexOf('未填写') != -1) res = ''
      return res
    }

    // 展示详情
    $scope.showDetail = false // 弹窗
    $scope.currentDetail = {} // 当前item 的详情
    $scope.showThisDetial = function (item) {
      layer.load(2)
      erp.postFun(APIS.getInsideDetail + '?orderId=' + item.orderId, {}, function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '获取详情失败')
        $scope.showDetail = true
        $scope.currentDetail = res.data.data
        $scope.certPic = res.data.data.caigouInternalProcurement.purchasingDocuments.split(',') || []
      })
    }

    // 查看凭证
    $scope.previewPic = function (item) {// 预览凭证
      const { paymentDocument } = item
      if (!paymentDocument) return layer.msg('未上传凭证')
      merchan.previewPicTwo(paymentDocument.split(',')[0]);
    }

    // 退款提交
    $scope.refundParams = {
      // refundAmount: '',// 退款金额
      // refundProof: '',// 退款凭证
      // refundRemark: '',// 退款备注
    }
    $scope.refundProofs = []
    function setRefundProofs() {
      const list = $scope.refundProofs
      if (!list || list.length <= 0) return ''
      let res = ''
      list.forEach(function (_, i) {
        res += (i == 0 ? '' : ',') + _
      })
      return res
    }
    $scope.refundProofscallback = function ({ pics }) {
      $scope.refundProofs = pics
      $scope.refundParams.refundProof = setRefundProofs()
    }
    $scope.openRefund = function () {
      const { refundAmount, refundProof, refundRemark } = $scope.refundParams

      const checkParams = () => {
        if (!refundAmount) return '请输入退款金额'
        if (!refundProof) return '请输入退款凭证'
        if (!refundRemark) return '请输入退款原因'
        return ''
      }

      const error = checkParams()
      if (error) return layer.msg(error)

      const layerId = layer.confirm('你确定退款吗？', {
        title: '确认信息',
        btn: ['取消', '确定'] //按钮
      }, null, function () {
        submitRefund()
      });
    }

    // 提交退款
    function submitRefund() {
      const { id, orderId } = $scope.currentDetail.caigouInternalProcurement
      const params = angular.copy($scope.refundParams)
      params.orderId = orderId
      params.id = id
      layer.load(2)
      erp.postFun(APIS.submitRefund, angular.toJson(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
        layer.msg('操作成功')

        getList()
        $scope.showDetail = false

        // 清空
        $scope.refundParam = {}
      })
    }

    $scope.updateItem = undefined // 要修改的项
    $scope.logisticsFlag = false // 填写物流信息弹窗
    $scope.logisticsList = [{}] // 填写了的物流列表
    $scope.saveLogistics = function () {
      const list = $scope.logisticsList
      const len = list.length
      const item = $scope.updateItem
      if (!item) return layer.msg('无操作项')

      let url = 'procurement/internal/saveLogistics'
      const { orderId } = $scope.updateItem
      $scope.logisticsList = $scope.logisticsList.map(_ => ({ ..._, orderId }))
      const params = {
        caigouInternalProcurementLogisticss: $scope.logisticsList
      }

      layer.load(2)
      erp.postFun(url, params, function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '服务器出错')
        layer.msg('保存成功')
        $scope.logisticsFlag = false
        getList()
      })
    }
    $scope.openLogisticsBubble = function (item) {
      $scope.logisticsList = [{}]
      $scope.updateItem = item
      $scope.logisticsFlag = true
    }

    $scope.addLogistics = function () {
      const list = $scope.logisticsList
      if (list.length >= 5) return layer.msg('超出可添加限制')
      list.push({})
      $scope.logisticsList = list
    }

  }]) // 内部采购单待付款 
})()