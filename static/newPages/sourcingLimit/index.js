(function () {
    var app = angular.module('sourcingLimit', [])

    var APIS = {
        getList: 'cujiaOthers/dspSourceActivity/list',// 获取列表
        addItemOrUpdate: 'cujiaOthers/dspSourceActivity/saveOrUpdate',// 添加和修改
        checkName: 'cujiaOthers/dspSourceActivity/verifyData', // 校验名称是否重复
        updateStatus: 'cujiaOthers/dspSourceActivity/updateStatus', // 修改状态
    }

    var ctrlSourcingLimit = function ($scope, erp, $routeParams, $timeout) {
        console.log('搜品额度列表')
        $scope.list = []
        $scope.pageNum = '1'
        $scope.pageSize = '20'

        // 获取列表
        function getList() {
            const params = {
                pageNum: +$scope.pageNum,
                pageSize: +$scope.pageSize
            }
            const load = layer.load(0);
            erp.postFun(APIS.getList, params, function (res) {
                layer.close(load);
                if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
                const obj = res.data.data
                const list = obj.list
                $scope.list = list || []
                $scope.$broadcast('page-data', {
                    pageSize: $scope.pageSize,//每页条数
                    pageNum: $scope.pageNum,//页码
                    totalNum: Math.ceil(Number(obj.total) / Number($scope.pageSize)),//总页数
                    totalCounts: obj.total,//数据总条数
                    pageList: ['10', '20', '50']//条数选择列表，例：['10','50','100']
                })
            })
        }
        getList()

        $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
            $scope.pageNum = data.pageNum
            $scope.pageSize = data.pageSize
            getList()
        })

        // 启用关闭当前条
        $scope.changeStatus = function (item) {
            const status = item.status == 0 ? 1 : 0
            layer.confirm('你确定要' + (status == 1 ? '启用' : '禁用') + '吗?', { title: '提示' }, function (index) {
                layer.close(index)
                const load = layer.load(0)
                erp.postFun(APIS.updateStatus, { id: item.id }, function (res) {
                    layer.close(load)
                    if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
                    layer.msg('操作成功')
                    item.status = status
                })
            });
        }

        // 新增项
        $scope.newItem = function () {
            $scope.addParams = angular.copy({
                oneSourceNum:0,
                twoSourceNum:0,
                threeSourceNum:0,
                fourSourceNum:0,
                fiveSourceNum:0
            })
            $scope.lastName = ''
            $scope.existsName = null
            $scope.popupFlag = true
        }

        // 修改当前项
        $scope.editItem = function (i) {
            $scope.addParams = angular.copy(i)
            const { name, id } = i
            $scope.lastName = name // 记录修改前的name
            checkName({ id, name })
            $scope.existsName = null
            $scope.popupFlag = true
        }

        // 提交修改或提交新增
        $scope.onSubmit = function () {
            updateOrNew()
        }

        // 校验参数
        function checkVaild(params) {
            if ($scope.existsName != 0) return '请检查模板名称'
            if (!params.startTime || !params.endTime) return '请检查有效期限'
            // if (!params.oneSourceNum || !params.twoSourceNum || !params.threeSourceNum || !params.fourSourceNum || !params.fiveSourceNum) return '请检查对应等级搜品额度'
            return ''
        }

        // 新增或修改
        function updateOrNew() {
            const params = { ...$scope.addParams }
            const err = checkVaild(params)
            if (err) return layer.msg(err)
            const load = layer.load(0)
            erp.postFun(APIS.addItemOrUpdate, params, function (res) {
                layer.close(load)
                if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
                layer.msg(res.data.message || '操作成功')
                $scope.popupFlag = false
                getList()
            })
        }
        $scope.updateOrNew = updateOrNew

        // 检验是否使用的名称
        function checkName({ name = '' }) {
            const { id } = $scope.addParams
            if (!name) return $scope.existsName = undefined
            $scope.existsName = 2 // 校验中
            erp.postFun(APIS.checkName, { name, id }, function (res) {
                if (res.data.code != 800) return $scope.existsName = 0 // 可以使用的名称
                $scope.existsName = 1 // 已经被使用的名称
            })
        }
        const debounceCheckName = erp.deBounce(checkName)
        function checkEventName($event) { debounceCheckName({ name: $event.target.value }) }
        $scope.checkName = checkEventName
    }
    app.controller('ctrlSourcingLimit', ['$scope', 'erp', '$routeParams', '$timeout', ctrlSourcingLimit]);
})()