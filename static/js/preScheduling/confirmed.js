(function() {
	app.controller('confirmedCtrl', ['$scope', "erp", '$location', '$routeParams', '$timeout', function($scope, erp, $location, $routeParams, $timeout) {
		$scope.pageNum = 1
		$scope.pageSize = 20
		$scope.tableData = [] // 表格数据
		$scope.warehouseEnums = { 0: '义乌', 1: '深圳', 2: '美西仓', 3: '美东仓', 4: '泰国', 5: '印尼仓' }
		
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
				processStore: $scope.processStore,
				demandStore: $scope.demandStore,
			}
			layer.load(2)
			erp.postFun("erp/dispatchTask/querySchedulingAdvanceTaskList", parmas, res => {
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
		
		// 查看
		$scope.handleTodetail = id => {
			location.href = `manage.html#/preScheduling/addOrDetail/detail/${id}`
		}
		
		// 导出
		$scope.handleExprot = (id, num) => {
			layer.load(2)
			erp.getFun(`erp/dispatchTask/exportExcel?id=${id}&num=${num}`, res => {
				layer.closeAll('loading')
				const {data} = res
				cjUtils.exportFile(data, `${num}.csv`)
			}, error => {
				console.log(error)
			}, {
				responseType: 'blob'
			})
		}
		
		// 分页
		$scope.$on('pagedata-fa', function (d, data) {
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			getList();
		})
		
	}]);
})();
