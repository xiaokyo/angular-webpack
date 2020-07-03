(function (angular) {

    angular.module('manage')
        .component('handleStockoutOrder', {
            templateUrl: '/static/components/handleStockoutOrder/index.html',
            controller: stockoutOrderCtrl,
            controllerAs: 'vm',
            bindings: {
                currentOrder: '=',// 当前订单
                orderType: '=',// 0 代发单  1 直发单
                visible: '=',// 是否显示
                orderOld: '<',// 是否是老订单页面
                callback: '&', // callback
                initCallback: '&', // 初始会执行的回调
            }
        })

    function stockoutOrderCtrl($scope, erp, $timeout) {
        let vm = this

        // 缺货处理方式
        $scope.handleWayObj = {
            '1': '分开发货',
            '2': '缺货商品替换',
            '3': '缺货商品退款',
            '4': '全部商品退款'
        }

        // 缺货处理记录
        $scope.visibleRecords = false
        $scope.handleStockoutList = [];
        $scope.computeObj={};
        function seeStockoutLog(order) {
            const orderId = order.id || order.ID
            if (!orderId) return layer.msg('未获取到订单id')
            layer.load(0)
            erp.postFun('processOrder/Stockout/getDspInventoryHandlingRecord?orderId=' + orderId, angular.toJson({ orderId }), function (res) {
                layer.closeAll('loading')
                if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
                $scope.handleStockoutList = res.data.data
                $scope.visibleRecords = true
            })
        }

        // clearHandleOrderForm
        function clearHandleOrderForm() {
            $scope.handleForm.handleStockoutPrice = 0
            $scope.handleForm.handleStockoutWay = ''
            console.log($scope.handleForm.handleStockoutPrice, $scope.handleForm.handleStockoutWay)
        }

        // 初始化组件
        this.$onInit = function () {
            console.log(this, 'handleStockoutOrder')
            this.initCallback && this.initCallback({ seeStockoutLog, clearHandleOrderForm })
        }

        this.$onChanges = function (obj) {
            console.log(obj)
            if($scope.handleStockoutWay==2 || $scope.handleStockoutWay==3) getComputeFee();
        }

        $scope.handleForm = {
            handleStockoutPrice: 0,
            handleStockoutWay: ''
        }
        // 缺货处理确认
        $scope.handleStockout = function () {

            let needApis = [ // 待发单
                'processOrder/Stockout/separateShipping',// 分开发货接口
                'processOrder/Stockout/refundOutStockItems' // 部分商品退款和全部退款接口
            ]
            let { order, product } = vm.currentOrder

            // 当为直发单时
            if (vm.orderType == 1) {
                needApis = [ // 直发单
                    'processOrder/Stockout/splitStockoutPayOrder',// 分开发货接口
                    'processOrder/Stockout/refundOutStockPayProduct' // 部分商品退款和全部退款接口
                ]
                if (vm.orderOld) {// 是否原直发订单页面
                    order = vm.currentOrder
                    product = vm.currentOrder.productList
                }
            }

            let api = needApis[0] // 分开发货接口
            const type = $scope.handleForm.handleStockoutWay // 1 分开发货  2 缺货商品退款  3 全部商品退款
            const price = $scope.handleForm.handleStockoutPrice // 退款金额

            if (!type) return layer.msg('请选择处理方式')

            let params = { orderId: order.id }

            if (order.shortageIdentity == 2) return layer.msg('此订单已处理')
            if (order.shortageIdentity != 1) return layer.msg('此订单不是缺货订单')

            if (type == 2 || type == 3) {
                api = type == 3 ? needApis[1] : needApis[0] // 部分商品退款和全部退款接口
                params.refundAmount = price // 退款的金额
                params.type = type;
                params.suggestRefundAmount = type == 2 ? $scope.computeObj.stockoutSuggest:$scope.computeObj.allSuggest;
                if (!price || price <= 0) return layer.msg('协商后退款金额必填')
            }

            if (type == 2) {
                // 筛选采购缺货的商品
                params.ids = product.filter(_ => _.shortageIdentity == 1).map(_ => _.id)
            }
            if (type == 3) {
                // 筛选采购缺货所有商品
                params.ids = product.map(_ => _.id)
            }

            layer.load(0)
            erp.postFun(api, angular.toJson(params), function (res) {
                layer.closeAll('loading')
                if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
                layer.msg('操作成功')
                clearCurrentOrder()

                order.shortageIdentity = 2 // 缺货订单已处理 标识

                if (type == 1 || type == 2) {// 分开发货  拆单成功
                    layer.alert('操作成功,已流转到待处理页面,订单号为:\n' + res.data.data[1]);
                }

                $scope.handleStockoutPrice = 0 // 清空退款价格
                vm.callback && vm.callback({ data: res.data.data, type })
            })

        }
        // 缺货处理状态改变
        $scope.handleStockoutWayChange = function (type) {
            $scope.handleStockoutWay = type // 1 分开发货  2 缺货商品退款  3 全部商品退款
            if(type==2 || type==3) getComputeFee();
        }
        // 缺货处理退款金额改变
        $scope.handleStockoutPriceChange = function (price) {
            $scope.handleStockoutPrice = price
        }
        // 清空当前处理的订单信息准备下一次缺货处理
        function clearCurrentOrder() {
            vm.currentOrder = undefined
            vm.visible = false
            $scope.handleStockoutPrice = '';
            $scope.computeObj={};
        }
        function getComputeFee(){
            // if($scope.computeObj.orderMoneyReality) return;
            layer.load(2)
            const curOrder = vm.currentOrder;
            let param = {
                orderId: vm.orderType == 1 ? (curOrder.order?curOrder.order.id:curOrder.id):curOrder.order.id,
                sign:vm.orderType == 1 ? 2:1//2-直发单；1-代发单
            }
            erp.postFun('processOrder/Stockout/getComputeFee', param, function (res) {
                layer.closeAll('loading')
                if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
                const {
                    orderMoneyReality,orderMoney,stockoutLogistics,
                    stockoutProduct,stockoutPostage,stockoutSuggest,
                    allLogistics,allPostage,allSuggest,allProduct}= res.data.data;
                $scope.computeObj = {
                    orderMoneyReality,//母订单真实金额
                    orderMoney,//母订单折扣后的金额
                    stockoutLogistics,//去除缺货商品后订单物流费用
                    stockoutProduct,//退款商品折后总价
                    stockoutPostage,//邮费差额
                    stockoutSuggest,//建议退款金额
                    allLogistics,//去除缺货商品后订单物流费用
                    allPostage,//邮费差额
                    allSuggest,//建议退款金额
                    allProduct,//退款商品折后总价
                }
            })
        }

    }
})(angular);