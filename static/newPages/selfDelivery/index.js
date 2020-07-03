(function () {
    var app = angular.module('selfDelivery', [])

    var APIS = {
        getList: 'supplier/supplierOrder/queryDeliverPage',// 获取列表
        exportOrder: 'supplier/supplierOrder/exportOrderByIds',// 导出选中订单
        updateStatusToOne: 'supplier/supplierOrder/updateStatusToOne',// 更改订单状态到待处理
    }
    app.filter('orderType', function() {
        return function(deliverType,cjOrderType) {
            if(deliverType === 1) {
                return '自发货订单'
            } else if (deliverType === 0) {
                if(cjOrderType === 1) {
                    return '直发订单'
                } else if (cjOrderType === 2) {
                    return '代发订单'
                } else {
                    return '--'
                }
            } else {
                return '--'
            }
        }
    })

    var ctrlSelfDelivery = function ($scope, erp, $routeParams, $timeout) {
        console.log('自发货列表')
        var status = $routeParams.status || 1
        $scope.status = status

        $scope.orderTypeObj = { // 1 佣金 2 运费
            '1': '直发订单',
            '2': '代发订单'
        }

        $scope.checkAll = false // 是否全选
        $scope.selectAll = function () {// 全选和反选
            let list = erp.deepClone($scope.list)
            list.forEach(function (_, i) {
                list[i].checked = $scope.checkAll
            })
            $scope.list = list
        }

        var isCheckAll = function () {// 判断是否全选
            let list = erp.deepClone($scope.list)
            let len = list.length
            let checkAll = true
            for (let i = 0; i < len; i++) {
                if (!list[i].checked) {
                    checkAll = false
                    break
                }
            }
            $scope.checkAll = checkAll
        }
        $scope.refreshItemChecked = isCheckAll

        $scope.isHighSearch = false // 是否是高级筛选
        $scope.getParams = {
            "deliverStatus": status,
            "orderNumber": "",
            "parentOrderId": "",
            "freightId": "",
            "orderSequenceId": "",
            "pageNum": 1,
            "pageSize": 20,
            "reveiver": "",
        }

        $scope.list = [] // 自发货列表
        var getList = function () {
            layer.load(2)
            console.log('2', $scope.getParams)
            erp.postFun(APIS.getList, JSON.stringify($scope.getParams), function (data) {
                layer.closeAll('loading')
                let res = data.data
                if (res.code != 200) return layer.msg('网络错误')
                let list = res.data.list
                if (!list || list.length <= 0) return layer.msg('未查询到订单')
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
            $scope.getParams = Object.assign($scope.getParams, obj)
            console.log('1', $scope.getParams)
            getList()
        })

        // 获取列表选择id
        var getSelectIds = function () {
            let list = erp.deepClone($scope.list)
            let ids = []
            list.forEach(function (item, index) {
                if (item.checked) ids.push(item.id)
            })
            return ids
        }

        var base64 = new Base64();
        var token = base64.decode(localStorage.getItem('erptoken') == undefined ? "" : localStorage.getItem('erptoken'));

        function loadDown(url, params, callback) {
            // 下载excel
            // const url = 'procurement/order/exportCaigouInfo'
            const xhr = new XMLHttpRequest()
            xhr.open('POST', getDomainByUrl(url), true) // 也可以使用POST方式，根据接口
            xhr.setRequestHeader('token', token || '')
            xhr.setRequestHeader('content-type', 'application/json')
            xhr.responseType = 'blob'
            xhr.onload = function () {
                if (this.status === 200) {
                    const content = this.response
                    const aTag = document.createElement('a')
                    const blob = new Blob([content])
                    // const headerName = xhr.getResponseHeader('Content-disposition')
                    // const fileName = decodeURIComponent(headerName).substring(20)
                    aTag.download = new Date().getTime() + '.xlsx'
                    // eslint-disable-next-line compat/compat
                    aTag.href = URL.createObjectURL(blob)
                    aTag.click()
                    // eslint-disable-next-line compat/compat
                    URL.revokeObjectURL(blob)
                    callback()
                }
            }
            xhr.send(JSON.stringify(params))
        }

        function getDomainByUrl(url) {
            if (typeof url === 'string' && url.indexOf('http') === 0) return url; // http 开头全路径
            // console.log(url);
            var urlStart = url.split('/')[0];
            if (urlStart == 'pojo' || urlStart == 'app') {
                urlStart = 'cj-erp';
            }

            for (var k in window.httpsJson) {
                if (k == urlStart) {
                    return window.httpsJson[k] + url;
                }
            }
        }

        // 导出订单列表
        var exportOrder = function () {
            let ids = getSelectIds()
            if (ids.length <= 0) return layer.msg('未选择要导出的订单')
            let params = {
                "exportType": 1,// 1 只导出订单  2 只导出商品
                "list": ids
            }
            loadDown(APIS.exportOrder, params, function () {
                layer.msg('导出成功')
            })
        }
        $scope.exportOrder = exportOrder

        // 批量返回至待处理
        $scope.batchResolve = function () {
            let ids = getSelectIds()
            updateStatusOne(ids)
        }
        $scope.itemResolve = function (item) {
            let ids = [item.id]
            updateStatusOne(ids)
        }

        var updateStatusOne = function (ids) {
            if (ids.length <= 0) return layer.msg('未选择订单')
            let params = {
                list: ids,
                deliverStatus: 1
            }
            erp.postFun(APIS.updateStatusToOne, JSON.stringify(params), function (data) {
                if (data.data.code != 200) return layer.msg('网络错误')
                layer.msg('处理成功')
            })
        }

        // status 2 的查看物流信息
        $scope.logisticsBubble = false
        $scope.currentItem = null
        $scope.openLogisticsBubble = function (item) {
            $scope.currentItem = item
            $scope.logisticsBubble = true
        }

    }
    app.controller('ctrlSelfDelivery', ['$scope', 'erp', '$routeParams', '$timeout', ctrlSelfDelivery]) // 自发货列表   
})()