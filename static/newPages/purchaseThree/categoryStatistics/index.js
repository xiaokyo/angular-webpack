(function () {
  const namespace = MODULE_PURCHASETHREE
  const app = angular.module(namespace.name)

  app.controller('ctrlCategoryStatistics', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
    console.log('出单采购统计')
    const APIS = namespace.apis

    // 获取昨天日期
    function getUpDate() {
      let today = new Date()
      today = +today - 1000 * 60 * 60 * 24 // 前一天时间戳
      const yestoday = new Date(today)
      return yestoday.getFullYear() + '-' + (yestoday.getMonth() + 1) + '-' + yestoday.getDate()
    }
    $scope.begainDate = $scope.endDate = getUpDate()

    $scope.pageNum = '1'
    $scope.pageSize = '20'
    function getList() {
      const params = {
        pageNum: $scope.pageNum,
        pageSize: $scope.pageSize,
        begainDate: $scope.begainDate,
        endDate: $scope.endDate,
        data: $scope.data || {}
      }
      layer.load(2)
      erp.postFun(APIS.categoryStatisticsList, angular.toJson(params), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
        const obj = res.data.data
        const total = obj.total
        $scope.list = obj.list

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
    getList()

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      $scope.pageNum = String(data.pageNum)
      $scope.pageSize = String(data.pageSize)
      getList()
    })

    // 获取类目
    $scope.categorySubTree = [] // 二级类目列表
    $scope.categoryThreeTree = [] // 三级类目列表
    function getClassifications() {
      erp.postFun(APIS.getClassifications, JSON.stringify({}), function (res) {
        if (res.data.code != 200) return
        $scope.categoryTree = res.data.data
      })
    }
    getClassifications()

    $scope.currentPrimaryCategoryItem = undefined
    // changeSubCategory
    $scope.changeSubCategory = function () {
      // 清空二级和三级
      $scope.categorySubTree = []
      $scope.data.secondaryCategoryId = ""
      $scope.categoryThreeTree = []
      $scope.data.threeCategoryId = ""

      const obj = $scope.categoryTree.find(_ => _.id == $scope.data.primaryCategoryId)
      if (obj && obj.childList && obj.childList.length > 0) {
        $scope.currentPrimaryCategoryItem = angular.copy(obj)
        $scope.categorySubTree = obj.childList
      }
      getList()
    }

    // changeThreeCategory
    $scope.changeThreeCategory = function () {
      // 清空三级
      $scope.categoryThreeTree = []
      $scope.data.threeCategoryId = ""

      const obj = $scope.currentPrimaryCategoryItem.childList.find(_ => _.id == $scope.data.secondaryCategoryId)
      if (obj && obj.childList && obj.childList.length > 0) {
        $scope.categoryThreeTree = obj.childList
      }
      getList()
    }

    $scope.threeCategoryChange = function () {
      getList()
    }

  }])
})()