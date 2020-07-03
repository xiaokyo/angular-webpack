(function (angular) {

    angular.module('manage')
        .component('purchaseselect', {
            templateUrl: '/static/components/purchasePerson/index.html',
            controller: purchasePersonCtrl,
            controllerAs: 'vm',
            bindings: {
                callback: '<',
                placeholder: '@',
                purchaseList: '<', // 采购员列表
                hasAll: '<', // 是否带有全部选项
                nullValue: '<',// 不默认采购人
                initNoCallback: '<', // 是否初始完进行回调
                noPod: '<',// 不要pod选项
                queryKey: '@', // 地址栏默认的buyerId
            }
        })

    /**{
      erploginName: erploginName,
      erpname: erpname,
      erptoken: getToken(),
      job: job
    } */
    function purchasePersonCtrl($scope, erp, $timeout) {
        let vm = this

        const { erploginName, erpname } = erp.getUserInfo()
        const query = erp.retUrlQuery();
        // console.log('erploginName', erploginName, query)

        // 采购组人员列表
        $scope.purchasePersonList = []

        // 当前指定人info
        $scope.currentPerson = { id: "", loginName: "" }

        // $scope.selected = ''

        // 输入搜索指定采购人
        // $scope.iptPerson = ''
        $scope.searchList = []
        function searchPerson() {
            $scope.searchList = []
            if (!$scope.currentPerson.loginName) {
                $scope.currentPerson.id = ''
                $scope.onchange()
                return
            }
            const list = $scope.purchasePersonList
            for (let i = 0; i < list.length; i += 1) {
                const item = list[i]
                const { loginName, id } = item
                if (loginName.indexOf($scope.currentPerson.loginName.toUpperCase()) != -1) {
                    $scope.searchList.push(item)
                }
            }
            // console.log('searchList', $scope.searchList)
            $timeout(function () {
                $scope.$apply()
            }, 1)
        }
        $scope.searchPerson = erp.deBounce(searchPerson, 500)

        // 自定义下拉触发click
        function selectPurchase({ id, loginName }) {
            const obj = { id, loginName: loginName == '全部' ? '' : loginName }
            $scope.currentPerson = obj
            $scope.onchange()
            $scope.searchList = []
        }
        $scope.selectPurchase = selectPurchase

        // id获取指定名称
        function getLoginName(id) {
            const obj = $scope.purchasePersonList.find(_ => _.id == id)
            if (!obj) return ''
            return obj.loginName
        }

        // 清空当前选择采购人
        function clearCurrentPerson() { $scope.currentPerson = { id: "", loginName: "" } }

        // change 回调
        $scope.onchange = function () {
            if ($scope.purchasePersonList.length <= 0) return
            vm.callback && vm.callback({ ...$scope.currentPerson, purchasePersonList: $scope.purchasePersonList, clearCurrentPerson })
        }

        function initPurchasePerson(list = []) {
            if (!vm.placeholder) vm.placeholder = '请输入采购员查询'
            let arr = [...list]
            if (!vm.noPod) arr = [{ id: 'POD', loginName: 'POD商品' }, ...arr]
            if (vm.hasAll) arr = [{ id: '', loginName: '全部' }, ...arr]

            $scope.purchasePersonList = arr
            const currentObj = arr.find(_ => _.loginName == erploginName)
            $scope.currentPerson = angular.copy(currentObj)

            // 属性设置未初始默认空
            if (vm.nullValue) $scope.currentPerson = { id: "", loginName: "" }

            const queryBuyerId = query[vm.queryKey]
            if (queryBuyerId && queryBuyerId != 'undefined') {
                // 路由上有采购人id的情况
                let obj = { id: queryBuyerId, loginName: getLoginName(queryBuyerId) }
                $scope.currentPerson = obj
            }
        }

        this.$onInit = function () {
            // console.log('init', this)
            if (!vm.purchaseList) {
                erp.getPurchasePerson(function (list) {
                    initPurchasePerson(list)
                    !vm.initNoCallback && $scope.onchange()
                })
                return
            }
        }

        this.$onChanges = function (obj) {
            const { purchaseList } = obj
            if (purchaseList.currentValue !== purchaseList.previousValue) {
                const { currentValue, previousValue } = purchaseList
                if (angular.isArray(currentValue) && angular.isArray(previousValue)) {
                    // console.log('purchaseList', obj.purchaseList, obj.purchaseList.currentValue != obj.purchaseList.previousValue)
                    initPurchasePerson(obj.purchaseList.currentValue)
                    $scope.onchange()
                }
            }
        }

    }
})(angular);