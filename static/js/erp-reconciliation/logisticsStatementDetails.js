(function(){
	const app = angular.module('erp-reconciliation',);
	app.controller("logisticsStatementDetailsCtrl", ["$scope", "erp", "$routeParams", "utils", "$location", "$filter", function ($scope, erp, $routeParams, utils, $location, $filter) {
		console.log('logisticsStatementDetailsCtrl')
		$scope.pageNum = '1'
		$scope.pageSize = '20'
		$scope.tableData = [] // 表格数据
		$scope.startTime = utils.changeTime(new Date().setTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000));
		$scope.endTime = utils.changeTime(new Date().setTime(new Date().getTime()));
		$scope.isShowModal = false // logisticsCompany
		console.log($routeParams)
		$scope.logisticsCompanyName = $routeParams.logisticsCompany || ''
		$scope.isStatementName = !!$routeParams.statementName
		$scope.statementName = $routeParams.statementName || ''
		$scope.logisticsCompanyArr = []
		$scope.status = $routeParams.status  //1可修改，2不可修改
		$scope.dateFocus = (e, filed) => {
			$scope[filed] = e.target.value
		}
		(function () {
			erp.postFun("erp/logistics/reconciliation/logisticsCompanyNameList", {}, res => {
				if (res.data.code === '200') {
					$scope.logisticsCompanyArr = res.data.data || []
				} else {
					layer.msg(res.data.message)
				}
			}, error => {
				console.log(error)
			})
		})()
		
		//查询
		$scope.hadelSearch = () => {
			$scope.pageNum = '1'
			getList();
		}
		
		//获取列表
		function getList() {
			const parmas = {
				batchNumber: $routeParams.batchNumber,
				logisticsCompanyName: $scope.logisticsCompanyName,
				logisticName: $scope.logisticName,
				createTimeStart: $scope.startTime ? $scope.startTime : undefined,
				createTimeEnd: $scope.endTime ? $scope.endTime : undefined,
				page: $scope.pageNum,
				size: $scope.pageSize,
			}
			layer.load(2)
			erp.postFun("erp/logistics/reconciliationTemp/list", parmas, res => {
				layer.closeAll('loading')
				if (res.data.code === '200') {
					$scope.tableData = res.data.data.list || [] // 列表数据
					$scope.totalNum = res.data.data.total;
					calculation()
					const totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
					$scope.$broadcast('page-data', {
						pageSize: $scope.pageSize.toString(),
						pageNum: $scope.pageNum,
						totalNum: totalNum,
						totalCounts: $scope.totalNum,
						pageList: ['20', '50', '100']
					});
				}
			}, error => {
				console.log(error)
			})
		}
		
		getList()
		
		// 导出
		$scope.hadelExprot = () => {
			const parmas = {
				batchNumber: $routeParams.batchNumber
			}
			layer.load(2)
			erp.postFun("erp/logistics/reconciliationTemp/export", parmas, res => {
				layer.closeAll('loading')
				if (res.data.code === '200') {
					location.href = res.data.data
				}
			}, error => {
				console.log(error)
			},)
		}
		
		// 合计计算
		function calculation() {
			$scope.cjFreightTotal = 0;
			$scope.logisticsFreightTotal = 0;
			$scope.actualFreightTotal = 0;
			$scope.tableData.forEach(o => {
				$scope.cjFreightTotal += Number(o.cjPayFreight)
				$scope.logisticsFreightTotal += Number(o.logisticsPayFreight)
				$scope.actualFreightTotal += Number(o.realPayFreight)
			})
		}
		
		// 实付运费修改
		$scope.inputChange = (ev, item) => {
			item.realPayFreight = utils.floatLength(item.realPayFreight, 2);
			calculation()
		}
		
		// 保存 / 保存并生成打款单
		$scope.handleSave = (type) => {
			let url, targetLink;
			if (type === '1') {
				url = 'erp/logistics/reconciliationTemp/save'
				targetLink = 'manage.html#/Reconciliation/logisticsStatement'
			} else if (type === '2') {
				url = 'erp/logistics/reconciliationTemp/saveAndCreate'
				targetLink = 'manage.html#/reconciliation/codRemit/waybillRemit'
			}
			$scope.handleConfirm = () => {
				const parmas = {
					recordName: !$scope.isStatementName ? $scope.statementName : undefined,
					batchNumber: $routeParams.batchNumber,
					list: $scope.tableData.map(o => (
						{
							id: o.id,
							realPayFreight: o.realPayFreight
						}
					))
				}
				layer.load(2)
				erp.postFun(url, parmas, res => {
					layer.closeAll('loading')
					if (res.data.code === '200') {
						location.href = targetLink
						$scope.statementName = ''
					} else {
						layer.msg(res.data.message)
					}
				}, error => {
					console.log(error)
				},)
			}
			if ($scope.isStatementName) {
				$scope.handleConfirm()
			} else {
				$scope.isShowModal = true
			}
		}
		
		// 确定
		$scope.handleBack = () => {
			window.history.back(-1);
		}
		
		// 分页
		$scope.$on('pagedata-fa', function (d, data) {
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			getList();
		})
	}])
})()
