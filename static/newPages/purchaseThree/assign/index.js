(function () {
  const namespace = MODULE_PURCHASETHREE
  const app = angular.module(namespace.name)

  app.controller('ctrlAssignWork', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
    console.log('分配工作')

    const APIS = namespace.apis

    $scope.params = {
      pageNum: 1,
      pageSize: 10
    }
    $scope.data = {
      buyerName: '', // 采购员
      primaryCategories: '',// 类目名称
      secondaryCategoryName: '',
      secondaryCategoryId: '',// 一级类目Id
    }
    $scope.assignWorkList = [] // 分配任务列表
    function getAssignRecord() { // 获取分配记录

      const params = Object.assign({}, $scope.params)
      params.data = $scope.data

      layer.load(2)
      erp.postFun(APIS.getAssignRecord, JSON.stringify(params), function (res) {
        layer.closeAll('loading')
        console.log('res', res)
        if (res.data.code != 200) layer.msg(res.data.message || '服务器错误')
        $scope.assignWorkList = res.data.data.list
        // const totalNum = res.data.totalNum

        $scope.$broadcast('page-data', {
          pageSize: String($scope.params.pageSize),//每页条数
          pageNum: String($scope.params.pageNum),//页码
          totalNum: Math.ceil(Number(res.data.data.total) / Number($scope.params.pageSize)),//总页数
          totalCounts: res.data.data.total,//数据总条数
          pageList: ['10', '20', '50'],//条数选择列表，例：['10','50','100']
          // showGo: false
        })
      })
    }

    // 采购人列表
    $scope.ErpEmployeeList = []
    erp.getPurchasePerson(function (res) {
      $scope.ErpEmployeeList = res
    })

    // search
    function search() {
      $scope.params.pageNum = 1
      getAssignRecord()
    }
    $scope.search = search

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      let obj = erp.deepClone($scope.params)
      obj.pageNum = String(data.pageNum)
      obj.pageSize = String(data.pageSize)
      $scope.params = obj
      getAssignRecord()
    })

    function init() {
      getAssignRecord()
      getClassifications()
    }

    init()

    $scope.currentItem = null // 当前操作行 item

    $scope.assignOperation = false // 分配工作窗口
    $scope.classifications = [] // 分类列表
    function getClassifications() {
      erp.postFun(APIS.getClassifications, JSON.stringify({}), function (res) {
        if (res.data.code != 200) return
        $scope.classifications = res.data.data
        // $scope.assignClassifications = erp.deepClone($scope.classifications)
      })
    }
    
    // 获取人员分配情况列表
    function getClassificationsAndPersonWork() {
      $scope.assignOperation = true
      layer.load(2)
      erp.postFun(APIS.queryAssignAndPersonWork, JSON.stringify({}), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return
        $scope.assignClassifications = erp.deepClone(res.data.data)
        $scope.oldAssignClassifications = erp.deepClone(res.data.data)
      })
    }
    $scope.getClassificationsAndPersonWork = getClassificationsAndPersonWork

    function toggle(item) {// 展开类目
      const list = $scope.assignClassifications
      const obj = list.find((_, i) => {
        const match = _.id == item.id
        if (match) {
          list[i].isExpand = !item.isExpand
        }
        return match
      })
      $scope.assignClassifications = list
    }
    $scope.toggle = toggle


    $scope.reAssign = false // 重新分配工作
    $scope.openReAssign = function (item) {
      $scope.currentItem = item
      $scope.reAssign = true
    }

    $scope.assignRecord = false // 分配记录
    $scope.openAssignRecord = function (item) {
      $scope.assignRecordList = []
      $scope.currentItem = item
      $scope.assignRecord = true
      setAssignRecord(item.secondaryCategoryId)
    }
    // 获取当前行的分配记录
    $scope.assignRecordList = []
    function setAssignRecord(id) {
      layer.load(2)
      erp.postFun(APIS.getAssignHistory, JSON.stringify({ id }), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '服务器错误')
        $scope.assignRecordList = res.data.data
      })
    }

    // 分配任务
    function assignWork({ buyerId, primaryCategories, secondaryCategoryId }) {
      const obj = $scope.ErpEmployeeList.find(_ => _.id == buyerId)
      const params = { buyerId, buyerName: obj.loginName, primaryCategories, secondaryCategoryId }
      layer.load(2)
      erp.postFun(APIS.assignClassification, JSON.stringify(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '服务器出错了')
        layer.msg('操作成功')
        $scope.reAssign = false
        search()
      })
    }
    $scope.assignWork = assignWork

    // 批量分配任务
    function batchAssignWork() {
      const params = []
      $scope.assignClassifications.forEach(({ childList },i) => {
        if (childList) {
          childList.forEach(({ buyerId, pid, id },j) => {
            const oldBuyerId = $scope.oldAssignClassifications[i].childList[j].buyerId
            if (buyerId && buyerId != oldBuyerId) {
              const obj = $scope.ErpEmployeeList.find(_ => _.id == buyerId)
              params.push({ buyerId, buyerName: obj.loginName, primaryCategories: pid, secondaryCategoryId: id })
            }
          })
        }
      })

      if (params.length <= 0) return layer.msg('请分配操作人')

      layer.load(2)
      erp.postFun(APIS.batchAssignClassification, JSON.stringify(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '服务器出错了')
        layer.msg('操作成功')
        $scope.assignOperation = false
        search()
      })
    }
    $scope.batchAssignWork = batchAssignWork

  }]) // 分配任务  
})()