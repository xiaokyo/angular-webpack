(function() {
	app.controller('isConfirmationCtrl', ['$scope', "erp", '$location', '$routeParams', '$timeout', function($scope, erp, $location, $routeParams, $timeout) {
		$scope.pageNum = 1
		$scope.pageSize = 20
		$scope.tableData = [] // 表格数据
		$scope.warehouseEnums = { 0: '义乌', 1: '深圳', 2: '美西仓', 3: '美东仓', 4: '泰国', 5: '印尼仓' }
		$scope.sortActive = 'desc';
		let selectItems = []
		
		// 查询
		$scope.hadelSearch = () => {
			$scope.pageNum = 1
			getList();
		}
		
		// 获取列表
		function getList() {
			const parmas = {
				pageNo: $scope.pageNum,
				pageSize: $scope.pageSize,
				processStatus: 0,
				sku: $scope.sku,
				demandStore: $scope.demandStore,
				sort: $scope.sortActive
			}
			layer.load(2)
			erp.postFun("erp/dispatchTask/getSchedulingAdvanceInfo", parmas, res => {
				layer.closeAll('loading')
				if (res.data.statusCode === '200') {
					$scope.tableData = res.data.result.list || [] // 列表数据
					$scope.$broadcast('page-data', {
						pageSize: $scope.pageSize.toString(),
						pageNum: $scope.pageNum,
						totalNum: Math.ceil(Number(res.data.result.pageTotal) / Number($scope.pageSize)),
						totalCounts: res.data.result.pageTotal,
						pageList: ['20', '50', '100']
					});
				} else {
					layer.msg(res.data.message)
				}
			}, error => {
				console.log(error)
			})
		}
		
		getList()
		
		// 选择
		$scope.handleChecked = item => {
			if (item.checked) {
				item.checked = false
			} else {
				selectItems.some(obj => obj && obj.demandStore !== item.demandStore) ? layer.msg('请选择同一到达仓') : item.checked = true
			}
			selectItems = $scope.tableData.filter(obj => obj.checked)
		}
		
		// 批量调度
		$scope.handleBatchScheduling = () => {
			const selectItem = $scope.tableData.filter(obj => obj.checked)
			if (selectItem.length > 0) {
				location.href = 'manage.html#/preScheduling/addOrDetail/add'
				sessionStorage.setItem('dispatchData', JSON.stringify(selectItem))
			} else {
				layer.msg('请选择')
			}
		}
		
		// 调度
		$scope.handleScheduling = item => {
			sessionStorage.setItem('dispatchData', JSON.stringify([item]))
			location.href = 'manage.html#/preScheduling/addOrDetail/add'
		}
		
		// 排序
		$scope.handleSort = val => {
			$scope.sortActive = val;
			getList()
		}
		
		// 分页
		$scope.$on('pagedata-fa', function (d, data) {
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			getList();
		})
	}]);
})();
