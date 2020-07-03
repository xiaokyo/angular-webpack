(function () {
    var app = angular.module('losslist', [])

    var APIS = {
        getList: 'storage/lossTable/lossTableList',// 获取列表
        addLossPro: 'storage/lossTable/lossTableAdd',// 添加损耗商品
    }

    const getStorageList = function (erp) {
        const list = erp.getStorage()
        const obj = {}
        // let allStorageString = ''
        list.forEach(function (item, i) {
            obj[item.dataId] = item.dataName
            // allStorageString += (i == 0 ? '' : ',') + item.dataId
        })
        // obj[allStorageString] = '全部'
        return obj
    }

    var ctrlLossList = function ($scope, erp, $routeParams, $timeout) {
        console.log('损耗列表')

        // $scope.storage = {// 仓库
        //     '0': '义乌仓',
        //     '1': '深圳仓',
        //     '2': '美东仓',
        //     '3': '美西仓',
        //     '4': '泰国仓'
        // }

        $scope.storage = getStorageList(erp)

        $scope.lossOBJ = {// 损耗原因
            '0': '人为原因',
            '1': '自然原因',
            '2': '其他'
        }

        $scope.productNameOrSKU = 'sku' // 搜索商品名称还是sku
        $scope.searchVal = '' // 搜索名称
        $scope.getParams = {
            page: '1',
            pageSize: '20',
            productName: '',
            sku: '',
            startTime: '',
            endTime: '',
            lossCause: '',
            storageWarehouse: ''
        }

        $scope.setProductNameOrSKU = function () {// 当下拉框和搜索框更改时设置指定参数
            // init
            $scope.getParams.sku = ''
            $scope.getParams.productName = ''
            $scope.getParams[$scope.productNameOrSKU] = $scope.searchVal
        }

        $scope.losslist = [] // 损耗列表
        var getList = function () {
            layer.load(2)
            console.log('2', $scope.getParams)
            erp.postFun(APIS.getList, JSON.stringify($scope.getParams), function (data) {
                layer.closeAll('loading')
                let res = data.data
                if (res.code != 200) return layer.msg('网络错误')
                let list = res.data.list
                $scope.losslist = list

                $scope.$broadcast('page-data', {
                    pageSize: $scope.getParams.pageSize,//每页条数
                    pageNum: $scope.getParams.page,//页码
                    totalNum: Math.ceil(Number(res.data.count) / Number($scope.getParams.pageSize)),//总页数
                    totalCounts: res.data.count,//数据总条数
                    pageList: ['10', '20', '50'],//条数选择列表，例：['10','50','100']
                    // showGo: false
                })
            })
        }
        // getList()
        $scope.getList = getList

        $scope.storageCallback = function ({ item, storageList, allIdString }) {
            $scope.getParams.storageWarehouse = allIdString
            if (!!item) $scope.getParams.storageWarehouse = item.dataId
            $scope.getParams.page = '1'
            getList()
        }

        $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
            let obj = erp.deepClone($scope.getParams)
            obj.page = String(data.pageNum)
            obj.pageSize = String(data.pageSize)
            $scope.getParams = obj
            console.log('1', $scope.getParams)
            getList()
            // setTimeout(function(){
            //   $scope.$apply()
            // })
        })

        $scope.lossBubble = false // 弹窗--新增损耗商品

        var initAddParams = {
            sku: '',// sku
            batchNumber: '',// 数量
            lossCause: '0',// 损耗原因
            remark: '',// 备注
            responsiblePerson: '',// 责任人
            storageWarehouse: '',// 仓库
            handlePerson: erp.myStorage('erpname') || '',// 处理人
            handleManner: '',// 处理方式
        }
        $scope.addParams = erp.deepClone(initAddParams)
        $scope.openLossPro = function () {
            $scope.addParams = erp.deepClone(initAddParams)
            $scope.lossBubble = true
        }
        var checkoutRequired = function () {
            return !$scope.addParams.sku || !$scope.addParams.batchNumber || !$scope.addParams.lossCause
        }
        $scope.addLossPro = function () {// 添加损耗商品  request
            if (checkoutRequired()) return layer.msg('有必填项未填写（注：带*为必填项）')
            layer.load(2)
            erp.postFun(APIS.addLossPro, JSON.stringify($scope.addParams), function (data) {
                layer.closeAll('loading')
                if (data.data.code != 200) return layer.msg(data.data.message || '服务器打盹了')
                $scope.lossBubble = false
                layer.msg('添加成功')
                getList()
            })
        }
    }
    app.controller('ctrlLossList', ['$scope', 'erp', '$routeParams', '$timeout', ctrlLossList]) // 损耗列表   
})()