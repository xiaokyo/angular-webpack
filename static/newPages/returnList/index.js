(function () {
    var app = angular.module('erppurchaseReturnList', [])

    var APIS = {
        getList: 'caigou/procurementOrder/queryOrderReturnPage',// 获取列表
        // addLossPro: 'storage/lossTable/lossTableAdd',// 添加损耗商品
    }

    var ctrlReturnList = function ($scope, erp, $routeParams, $timeout) {
        console.log('退货列表')

        $scope.storage = {// 仓库
            '0': '义乌仓',
            '1': '深圳仓',
            '2': '美东仓',
            '3': '美西仓',
            '4': '泰国仓'
        }

        $scope.caigouTypeObj = {// 采购类型
            '0':'1688非API',
            // '1':'1688API',
            '2':'淘宝',
            '3':'天猫',
            '4':'线下'
        }

        $scope.productNameOrSKU = 'sku' // 搜索商品名称还是sku
        $scope.searchVal = '' // 搜索名称
        $scope.getParams = {
            pageNo: '1',
            pageSize: '20',
            sku: '',
            begainDate: '',
            endDate: '',
            caigouType: '0',
            store: ''
        }

        $scope.setProductNameOrSKU = function () {// 当下拉框和搜索框更改时设置指定参数
            // init
            $scope.getParams.sku = ''
            $scope.getParams.productName = ''
            $scope.getParams[$scope.productNameOrSKU] = $scope.searchVal
            getList()
        }

        $scope.returnList = [] // 退货列表
        var getList = function () {
            $scope.returnList = []
            layer.load(2)
            console.log('2',$scope.getParams)
            erp.postFun(APIS.getList, JSON.stringify($scope.getParams), function (data) {
                layer.closeAll('loading')
                let res = data.data
                if (res.statusCode != 200) return layer.msg('网络错误')
                let list = res.result.list
                $scope.returnList = list

                $scope.$broadcast('page-data', {
                    pageSize: $scope.getParams.pageSize,//每页条数
                    pageNum: $scope.getParams.pageNo,//页码
                    totalNum: Math.ceil(Number(res.result.totalCount) / Number($scope.getParams.pageSize)),//总页数
                    totalCounts: res.result.totalCount,//数据总条数
                    pageList: ['10', '20', '50'],//条数选择列表，例：['10','50','100']
                    // showGo: false
                })
            })
        }
        getList()
        $scope.getList = getList

        $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
            let obj = erp.deepClone($scope.getParams)
            obj.pageNo = String(data.pageNum)
            obj.pageSize = String(data.pageSize)
            $scope.getParams = obj
            console.log('1',$scope.getParams)
            getList()
            // setTimeout(function(){
            //   $scope.$apply()
            // })
        })
    }
    app.controller('ctrlReturnList', ['$scope', 'erp', '$routeParams', '$timeout', ctrlReturnList]) // 退货列表   
})()
