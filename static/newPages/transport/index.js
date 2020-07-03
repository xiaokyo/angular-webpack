(function () {
    var app = angular.module('xiaokTransport', [])

    var APIS = {
        getList: 'supplier/logisticsCompany/getLogisticsManageList',// 获取列表
        updateStatus: 'supplier/logisticsCompany/updateLogisticsManageVerifyById',// 修改物流审核状态
    }

    var ctrlXiaokTransport = function ($scope, erp, $routeParams, $timeout) {
        console.log('物流公司列表')
        var status = Number($routeParams.status) || 0

        $scope.statusObj = {// 审核状态
            '0': '待审核',
            '1': '通过',
            '2': '未通过'
        }

        $scope.faceDownObj = {// 面单方式
            '0': '供应商提供',
            '1': '供应商后台下载'
        }

        $scope.getParams = {
            "countryName": "", // 所属国家
            "logisticsCompanyName": "", // 物流名称
            "pageNum": 1,
            "pageSize": 20,
            "status": status
        }

        $scope.changeTab = function (status) {// 更换tab
            location.href = '#/erpcustomer/xiaokTransport/' + status
        }

        $scope.list = [] // 物流公司列表
        var getList = function () {
            layer.load(2)
            erp.postFun(APIS.getList, JSON.stringify($scope.getParams), function (data) {
                layer.closeAll('loading')
                let res = data.data
                if (res.code != 200) return layer.msg('网络错误')
                console.log(res)
                let list = res.data.list
                $scope.list = list

                $scope.$broadcast('page-data', {
                    pageSize: String($scope.getParams.pageSize),//每页条数
                    pageNum: String($scope.getParams.pageNum),//页码
                    totalNum: Math.ceil(Number(res.data.total) / Number($scope.getParams.pageSize)),//总页数
                    totalCounts: res.data.total,//数据总条数
                    pageList: ['10', '20', '50'],//条数选择列表，例：['10','50','100']
                    // showGo: false
                })
            })
        }
        getList()
        $scope.getList = getList

        $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
            let obj = erp.deepClone($scope.getParams)
            obj.pageNum = data.pageNum
            obj.pageSize = data.pageSize
            $scope.getParams = obj
            console.log('1', $scope.getParams)
            getList()
        })

        $scope.rejectBubble = false // 弹窗--新增损耗商品
        $scope.rejectReason = ''
        let initParams = {
            "id": '',
            "refuseComment": '',
            "status": '',
        }
        $scope.currentItem = undefined // 当前操作的行item
        $scope.openRejectBubble = function (item) {
            $scope.rejectReason = '' // 置空
            $scope.currentItem = item
            $scope.rejectBubble = true
        }

        $scope.updateStatus = function (item, status) { // 更改审核状态
            let params = erp.deepClone(initParams)
            params.status = status
            if (status == 2) {
                if (!$scope.currentItem) return
                if (!$scope.rejectReason) return layer.msg('拒绝理由不能为空')
                params.refuseComment = $scope.rejectReason
                params.id = $scope.currentItem.id
            } else {
                params.id = item.id
                !!params.refuseComment ? delete params.refuseComment : null
            }
            updateStatus(params, function (res) {
                console.log("修改状态", res)
                if (status == 2) $scope.rejectBubble = false
            })
        }

        var updateStatus = function (params, fn) {
            layer.load(2)
            erp.postFun(APIS.updateStatus, JSON.stringify(params), function (data) {
                layer.closeAll('loading')
                if (data.data.code != 200) return layer.msg(data.data.message || '服务器打盹了')
                layer.msg('修改成功')
                getList()
                fn(data.data)
            })
        }
    }
    app.controller('ctrlXiaokTransport', ['$scope', 'erp', '$routeParams', '$timeout', ctrlXiaokTransport]) // 物流公司列表   
})()