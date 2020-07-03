(function () {
	const app = angular.module('erp-reconciliation');
	app.controller("logisticsStatementCtrl", ["$scope", "erp", "$routeParams", "utils", "$location", "$filter", function ($scope, erp, $routeParams, utils, $location, $filter) {
		console.log('logisticsStatementCtrl')
		$scope.pageNum = '1'
		$scope.pageSize = '20'
		$scope.tableData = [] // 表格数据
		$scope.startTime = utils.changeTime(new Date().setTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000));
		$scope.endTime = utils.changeTime(new Date().setTime(new Date().getTime()));
		$scope.dateFocus = (e, filed) => {
			$scope[filed] = e.target.value
		}
		//查询
		$scope.hadelSearch = () => {
			$scope.pageNum = '1'
			getList();
		}
		
		//获取列表
		function getList() {
			const parmas = {
				operatorName: $scope.operatorName,
				createTimeStart: $scope.startTime ? $scope.startTime : undefined,
				createTimeEnd: $scope.endTime ? $scope.endTime : undefined,
				page: $scope.pageNum,
				size: $scope.pageSize,
			}
			layer.load(2)
			erp.postFun("erp/logistics/reconciliationRecord/list", parmas, res => {
				layer.closeAll('loading')
				if (res.data.code === '200') {
					$scope.tableData = res.data.data.list || [] // 列表数据
					$scope.totalNum = res.data.data.total;
					const totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
					$scope.$broadcast('page-data', {
						pageSize: $scope.pageSize.toString(),
						pageNum: $scope.pageNum,
						totalNum: totalNum,
						totalCounts: $scope.totalNum,
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
		
		// 操作
		$scope.handleOpt = item => {
			location.href = `manage.html#/Reconciliation/logisticsStatementDetails/${item.batchNumber}//${item.statementAccountName}/${item.status}` //1表示详情可修改
		}
		
		// 分页
		$scope.$on('pagedata-fa', function (d, data) {
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			getList();
		})
	}])
})()
