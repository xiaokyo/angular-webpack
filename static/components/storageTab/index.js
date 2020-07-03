(function (angular) {

    angular.module('manage')
        .component('storagetab', {
            templateUrl: '/static/components/storageTab/index.html',
            controller: storageTabCtrl,
            controllerAs: 'vm',
            bindings: {
                callback: "<",// 回调
                hasAll: '<', // 是否需要全部
                isSelect: '<',// 是下拉框还是tab
                handleProduct: '<',// 处理商品
                isId: "<",// 是否纯长ID
                kindId: '<',// 权限类型
            }
        })

    //仓库列表
    const wareList = window.warehouseList


    function storageTabCtrl($scope, erp) {

        let vm = this

        function setDefaultId(list) {// 兼容以前的仓库 传 0 1 2 3 4 的情况
            for (let i = 0; i < list.length; i += 1) {
                for (let j = 0; j < wareList.length; j += 1) {
                    if (list[i].dataId == wareList[j].id) {
                        list[i].dataId = wareList[j].store
                    }
                }
            }
            return list
        }

        $scope.allIdString = ''
        const initStorage = async () => {
            let list = erp.getStorage()
            let kindId = vm.kindId ? vm.kindId : 'cangku'
            if (list.length <= 0 || kindId != 'cangku') {
                list = await erp.setStorageToSession(kindId)
            }
            $scope.storageList = vm.isId ? list : setDefaultId(list)

            // 默认义乌仓
            const condition = item => {
                const defaultLastStoreName = localStorage.getItem('defaultLastStoreName') || ''
                if(defaultLastStoreName) return item.dataName == defaultLastStoreName
                return item.dataId == 0 || item.dataName == 'bc228e33b02a4c03b46b186994eb6eb3';
            }
            const defaultStorage = $scope.storageList.find(_ => condition(_)) || $scope.storageList[0]
            // if(!defaultStorage) return
            $scope.currentStorage = defaultStorage
            $scope.currentId = defaultStorage ? defaultStorage.dataId : ''
            // 获取全部id拼成长字符串逗号隔开
            let allIds = ''
            $scope.storageList.forEach((_, i) => { allIds += (i == 0 ? '' : ',') + _.dataId })
            $scope.allIdString = allIds
        }

        // 修改仓库默认值
        function setStorageId(id) {
            const list = $scope.storageList, len = list.length;
            const currentObj = list.find(_ => _.dataId == id)
            if (!currentObj) return layer.msg('无此仓库')
            $scope.currentId = currentObj.dataId
            callbackFun()
        }

        // 下架商品库存---->已处理商品兼容
        function handleProduct() {
            $scope.storageList.push({
                dataId: '11',
                dataName: '已处理商品'
            })
        }

        // 初始化
        this.$onInit = async () => {
            // console.log('storagetab', this)
            $scope.callback = this.callback // 回调
            $scope.hasAll = this.hasAll // 默认有全部操作
            $scope.isSelect = this.isSelect // 默认tab样式
            // debugger
            await initStorage()
            this.handleProduct && handleProduct()
            callbackFun()
        }

        /**
         * item string 当前选中的仓库对象
         * storageList array 当前用户可操作的所有仓库列表
         * allIdString string 所有仓库的id，以逗号隔开
         */
        const callbackFun = function () {
            const fun = $scope.callback
            if (!fun) return
            const item = $scope.storageList.find(_ => _.dataId == $scope.currentId)
            if(item) localStorage.setItem('defaultLastStoreName', item.dataName) // 设置上次使用仓库
            fun({ item, storageList: $scope.storageList, allIdString: $scope.allIdString, setStorageId })
        }

        $scope.onChange = function (item) {
            // $scope.currentId = ""
            if (item && typeof item === 'object')
                $scope.currentId = item.dataId
            else if (item == 'default')
                $scope.currentId = 'all'

            if (!$scope.currentId && $scope.currentId != 0)
                $scope.currentId = 'all'
            // 触发回调
            callbackFun()
        }
    }

})(angular);