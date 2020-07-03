(function () {
	var app = angular.module('analysis2', ['service']);
	app.controller('activityStatisticsCtrl', ['$scope', '$http', 'erp', 'merchan', 'utils', function ($scope, $http, erp, merchan, utils) {
		$scope.tableHeader = [
			{ name: '点击量', ascKey: '点击量 asc', descKey: '点击量 desc' },
			{ name: '收藏量', ascKey: '收藏量 asc', descKey: '收藏量 desc' },
			{ name: '刊登量', ascKey: '刊登量 asc', descKey: '刊登量 desc' },
			{ name: '关联', ascKey: '关联 asc', descKey: '关联 desc' },
			{ name: '添加SKU', ascKey: '添加SKU asc', descKey: '添加SKU desc' },
			{ name: '添加购物车', ascKey: '添加购物车 asc', descKey: '添加购物车 desc' },
			{ name: '购买', ascKey: '购买 asc', descKey: '购买 desc' },
			{ name: '纠纷', ascKey: '纠纷 asc', descKey: '纠纷 desc' },
		] // table 部分表头 升降序
		$scope.sortActive = ''; // 选中排序
		
		$scope.productData = [] // 列表数据
		$scope.activityData = '' // 活动数据
		$scope.activityId = '' // 活动id
		$scope.tabActive = '1' // 日期tab当前选中
		$scope.productName = '' // 商品名称
		$scope.productSku = '' // 商品SKU
		$scope.pageNum = 1 // 当前页
		$scope.pageSize = 20 // 每页多少条
		$scope.startTime = utils.changeTime(new Date().setTime(new Date().getTime() - 24 * 60 * 60 * 1000));
		$scope.endTime = utils.changeTime(new Date().setTime(new Date().getTime()));
		
		// 获取活动数据
		function getActivityData() {
			erp.postFun("cj/activity/getActivityList", {}, res => {
					const { data: { result, statusCode } } = res
					if (statusCode === '200') {
						$scope.activityData = result.map(o => {
							o.title = `${o.category}  ${o.title}`
							return o
						})
					}
				}, error => {
					layer.msg(error)
				}
			)
		}
		
		getActivityData()
		
		// 获取列表数据
		function getList() {
			const parmas = {
				beginDate: $scope.startTime,
				endDate: $scope.endTime,
				pageNum: Number($scope.pageNum),
				pageSize: Number($scope.pageSize),
				activityId: $scope.activityId,
				sku: $scope.productSku,
				productNameEn: $scope.productName,
				orderBy: $scope.sortActive
			}
			erp.postFun("cj/activity/reportActivityProductSum", parmas, res => {
					if (res.data.statusCode === '200') {
						$scope.productData = res.data.result.rows || [] // 列表数据
						$scope.totalNum = res.data.result.total;
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
					layer.msg(error)
				}, { layer: true }
			)
		}
		
		getList()
		
		// 查询
		$scope.hadelSearch = () => {
			$scope.pageNum = 1
			$scope.startTime = $('#date1').val()
			$scope.endTime = $('#date2').val()
			getList()
		}
		
		// 排序
		$scope.handleSort = (key) => {
			$scope.sortActive = key;
			$scope.pageNum = 1
			getList()
		}
		
		// 导出数据
		$scope.hadelExprot = () => {
			const parmas = {
				beginDate: $scope.startTime,
				endDate: $scope.endTime,
				activityId: $scope.activityId,
				sku: $scope.productSku,
				productNameEn: $scope.productName,
				orderBy: $scope.sortActive
			}
			erp.postFun("cj/activity/reportActivityProductSumExport", parmas, res => {
					console.log(res)
					if (res.data.statusCode === '200') {
						window.open(res.data.result)
					}
				}, error => {
					layer.msg(error)
				}, { layer: true }
			)
		}
		
		// tab筛选
		$scope.handleTabActive = (key) => {
			$scope.tabActive = key
			if (key === '1') {
				$scope.startTime = utils.changeTime(new Date().setTime(new Date().getTime() - 24 * 60 * 60 * 1000));
				$scope.endTime = utils.changeTime(new Date().setTime(new Date().getTime()));
			} else if (key === '2') {
				$scope.startTime = utils.changeTime(new Date().setTime(new Date().getTime() - 7 * 24 * 60 * 60 * 1000));
				$scope.endTime = utils.changeTime(new Date().setTime(new Date().getTime()));
			} else if (key === '3') {
				$scope.startTime = utils.changeTime(new Date().setTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000));
				$scope.endTime = utils.changeTime(new Date().setTime(new Date().getTime()));
			} else if (key === '4') {
				$scope.startTime = ''
				$scope.endTime = ''
			}
			$scope.pageNum = 1
			getList()
		}
		
		// 分页
		$scope.$on('pagedata-fa', function (d, data) {
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			getList();
		})
	}])
})()
