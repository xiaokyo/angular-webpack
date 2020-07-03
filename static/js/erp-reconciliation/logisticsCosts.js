(function () {
	const app = angular.module('erp-reconciliation');
	app.controller("logisticsCostsCtrl", ['$scope', "erp", "$routeParams", "utils", "$location", "$filter", function ($scope, erp, $routeParams, utils, $location, $filter) {
		console.log('logisticsCostsCtrl')
		$scope.pageNum = '1'
		$scope.pageSize = '20'
		$scope.tableData = [] // 表格数据
		$scope.status = '1'
		$scope.startTime = utils.changeTime(new Date().setTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000));
		$scope.endTime = utils.changeTime(new Date().setTime(new Date().getTime()));
		$scope.isShowInfo = false
		$scope.logisticsCompanyArr = []
		
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
				logisticName: $scope.logisticName,
				logisticsCompanyName: $scope.logisticsCompanyName,
				logisticsCompanyCode: $scope.logisticsCompanyCode,
				cjorderId: $scope.cjorderId ? $scope.cjorderId : undefined,
				logisticsWaybillNo: $scope.logisticsWaybillNo ? $scope.logisticsWaybillNo : undefined,
				deliveryTimeStart: $scope.startTime ? $scope.startTime : undefined,
				deliveryTimeEnd: $scope.endTime ? $scope.endTime : undefined,
				page: $scope.pageNum,
				size: $scope.pageSize,
				status: $scope.status ? $scope.status : undefined
			}
			layer.load(2)
			erp.postFun("erp/logistics/reconciliation/list", parmas, res => {
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
		
		$scope.handleUpload = () => {
			document.getElementById('upload-file').click();
		};
		
		// 上传Excel
		$scope.upLoadExcel = function (files) {
			const file = files[0];
			const formData = new FormData();
			formData.append('file', file);
			layer.load(2)
			erp.upLoadImgPost('erp/logistics/reconciliationTemp/upload', formData, res => {
        layer.closeAll('loading')
        document.getElementById('upload-file').value = ''
				if (res.data.code === '200') {
					$scope.isShowInfo = true
					$scope.contentInfo = '物流账单导入完成'
					$scope.detailId = res.data.data
				} else if (res.data.code === '401') {
					$scope.isShowInfo = true
					$scope.contentInfo = res.data.data.replace(/[;]/g, '\r\n')
				} else {
					layer.msg(res.data.message)
				}
			}, err => {
				console.log(err);
			});
		};
		
		$scope.handleOpt = () => {
			if ($scope.detailId) {
				location.href = `manage.html#/Reconciliation/logisticsStatementDetails/${$scope.detailId}///1`
			}
			$scope.isShowInfo = false
		}
		
		// 分页
		$scope.$on('pagedata-fa', function (d, data) {
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			getList();
		})
	}])
})()
