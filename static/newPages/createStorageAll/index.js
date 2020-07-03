(function () {
  var app = angular.module('createStorageAll', [])

  var APIS = {
    getList: 'warehouse/block/list',// 获取仓库区列表
    getCountryList: 'warehouse/management/getCountryByAreaId',// 获取国家列表

    newBlock: 'warehouse/block/add',// 新增区
    updateBlock: 'warehouse/block/edit',// 修改区
    delBlock: 'warehouse/block/delete',// 删除区
  }

  var ctrlStorageBlock = function ($scope, erp, $routeParams) {
    console.log('')


    $scope.sendParams = {// 所有参数
      pageNum: '1',
      pageSize: '20',
      // beginDate: '',
      // endDate: '',
      data: {
        areaId: '',
        blockName: '',
        creator: ''
      }
    }

    $scope.list = [] // 获取仓库区列表
    var getList = function () {
      layer.load(2)
      erp.postFun(APIS.getList, JSON.stringify($scope.sendParams), function (res) {
        layer.closeAll('loading')
        if (res.data.code != 200) return layer.msg('服务器出错')
        let result = res.data.data
        $scope.list = result.list

        $scope.$broadcast('page-data', {
          pageSize: String($scope.sendParams.pageSize),//每页条数
          pageNum: String($scope.sendParams.pageNum),//页码
          totalNum: Math.ceil(Number(result.total) / Number($scope.sendParams.pageSize)),//总页数
          totalCounts: result.total,//数据总条数
          pageList: ['10', '20', '50']//条数选择列表，例：['10','50','100']
        })

      })
    }

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      $scope.sendParams.pageNum = Number(data.pageNum)
      $scope.sendParams.pageSize = Number(data.pageSize)
      getList()
    })

    $scope.countryByareaIdArr = [] // areaId对应国家
    var getCountryByAreaId = function () {
      layer.load(2)
      erp.postFun(APIS.getCountryList, null, function (res) {
        layer.close('loading')
        if (res.data.code != 200) return layer.msg('服务器错误')
        $scope.countryByareaIdArr = res.data.data
        if ($scope.countryByareaIdArr.length > 0) getList()
      })
    }
    getCountryByAreaId()
    $scope.formatAreaId = function (areaId) {
      let list = $scope.countryByareaIdArr
      let res = '空'
      for (let i = 0; i < list.length; i++) {
        if (list[i].areaId == areaId) {
          res = list[i].areaCn
          break
        }
      }
      return res
    }

    var initEditParms = {
      areaId: '',// 国家id
      blockName: '',// 区名称
      description: '',// 描述
    }
    $scope.currentEditParams = undefined // 当前操作的那一项
    $scope.editParams = erp.deepClone(initEditParms) // 编辑的每一项
    $scope.operatorName = ''// 弹窗标题
    $scope.openAddUpdatePupop = function (item) {
      let params = erp.deepClone(initEditParms) // 编辑的每一项
      let title = '新增区位'
      if (item) {
        params = erp.deepClone(item)
        params.areaId = String(params.areaId)
        title = '编辑区位'
      }
      $scope.operatorName = title
      $scope.editParams = params
      // editOrNewBlock(item)
      $scope.addBlockFlag = true
    }
    var checkValidField = function (params) {
      if (!params.areaId) return '所属国家'
      if (!params.areaId) return '所属国家'
      return ''
    }
    $scope.editOrNewBlock = function () {
      let params = erp.deepClone($scope.editParams)
      let errors = checkValidField(params)
      if (errors != '') return layer.msg(errors + '不能为空')
      let url = APIS.newBlock
      if (params.id) url = APIS.updateBlock
      erp.postFun(url, JSON.stringify(params), function (res) {
        if (res.data.code != 200) return layer.msg('服务器错误')
        layer.msg('操作成功')
        getList()
        $scope.addBlockFlag = false
      })
    }

    // del
    $scope.currentDelItem = undefined
    $scope.openComfrimDelBlock = function(item){
      $scope.currentDelItem = erp.deepClone(item)
      $scope.deleteWareFlag = true
    }
    $scope.delBlock = function () {
      erp.postFun(APIS.delBlock, JSON.stringify({ id: $scope.currentDelItem.id }), function (res) {
        if (res.data.code != 200) return layer.msg('服务器错误')
        layer.msg('操作成功')
        getList()
        $scope.deleteWareFlag = false
      })
    }


  }
  app.controller('ctrlStorageBlock', ['$scope', 'erp', '$routeParams', ctrlStorageBlock]) //    
})()