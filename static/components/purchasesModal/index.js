(function (angular) {

    angular.module('manage')
        .component('purchasesModal', {
            templateUrl: '/static/components/purchasesModal/index.html',
            controller: purchasesModalCtrl,
            controllerAs: 'vm',
            bindings: {
                initCallback: '&',// 初始回调
            }
        })

    function purchasesModalCtrl($scope, erp, $timeout) {

        // 显示采购员列表
        $scope.isPurchaseFlag = false
        $scope.currentPurList = [] // 当前采购员列表
        const showPurchases = function (orderId, stanProductId, islog = false) {
            if(islog == true) return showPurchaseOperationLog(orderId, stanProductId)
            erp.getPurchasesBySku({
                orderId,
                stanProductId,
                callback: function ({ purchases }) {
                    $scope.currentPurList = purchases
                    if (!islog) $scope.isPurchaseFlag = true
                    if (islog && purchases.length > 0) {
                        showPurchaseOperationLog(purchases[0].procurementOrderId)
                    }
                }
            })
        }

        // 查看采购单操作日志
        $scope.popPurchaseOrderLog = false
        const showPurchaseOperationLog = function (cjorderId, vids) {
            if (!cjorderId) return layer.msg('无cj订单')
            if (!vids) return layer.msg('无变体id')
            const url = 'warehousereceipt/caigouShangpintiansku/getOperatorLogList';
            const params = { cjorderId, vids }
            const index = layer.load(0)
            erp.postFun(url, params, function (res) {
                layer.close(index)
                if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
                const list = res.data.data
                $scope.purchaseOrderOperationLog = list
                $scope.popPurchaseOrderLog = true
            })
        }

        // 初始化组件
        this.$onInit = function () {
            this.initCallback && this.initCallback({ showPurchases })
        }

        this.$onChanges = function (obj) {

        }

    }
})(angular);