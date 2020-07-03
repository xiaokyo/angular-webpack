(function() {
	app.controller('addOrDetailCtrl', ['$scope', "erp", '$location', '$routeParams', '$timeout', 'utils', function ($scope, erp, $location, $routeParams, $timeout, utils) {
		const { type, id } = $routeParams || {}
		$scope.type = type
		$scope.warehouseEnums = { 0: '义乌', 1: '深圳', 2: '美西仓', 3: '美东仓', 4: '泰国', 5: '印尼仓' }
		$scope.isShowModail = false
		$scope.forwarderData = [
			'义乌UPS红单', '官方DHL美国账号', '官方DHL中国账号', '顺丰官方账号', '联邦', 'DHL', 'UPS', '海运', '圆通', '顺丰',
			'百世快运', '中通', '宝来空派', '南风空派', 'Hecny Transportion', '双清全包海运', '优速', 'Kerryexpress', '泰国其他'
		] // 货代公司
		$scope.tableData = []
		
		if (type === 'add') {
			$scope.tableData = JSON.parse(sessionStorage.getItem('dispatchData')) || []
		} else if (type === 'detail') {
			getData()
		}
		
		function getData() {
			layer.load(2)
			erp.postFun("erp/dispatchTask/queryTaskGoodsList", { id }, res => {
				layer.closeAll('loading')
				if (res.data.statusCode === '200') {
					$scope.tableData = res.data.result.list || []
					$scope.processStore = res.data.result.taskResultVo.processStore.toString();
					$scope.forwarderName = res.data.result.taskResultVo.forwarderName;
					$scope.trackingNumber = res.data.result.taskResultVo.trackingNumber;
					$scope.transferNumber = res.data.result.taskResultVo.transferNumber;
					$scope.remark = res.data.result.taskResultVo.remark;
				} else {
					layer.msg(res.data.message)
				}
			}, error => {
				console.log(error)
			})
		}
		
		// 返回
		$scope.handleBack = () => {
			history.go(-1);
			sessionStorage.removeItem('dispatchData')
		}
		
		$scope.handleShowModal = () => {
			if (!$scope.processStore) {
				layer.msg('请选择始发仓')
				return
			}
			if (!$scope.forwarderName) {
				layer.msg('请选择货代名称')
				return
			}
			$scope.isShowModail = true
		}
		
		// 确定
		$scope.handleConfirm = () => {
			const parmas = {
				processStore: Number($scope.processStore),
				forwarderName: $scope.forwarderName,
				trackingNumber: $scope.trackingNumber,
				transferNumber: $scope.transferNumber,
				remark: $scope.remark,
				goodsVoList: $scope.tableData
			}
			layer.load(2)
			erp.postFun("erp/dispatchTask/saveDispatcherTask", parmas, res => {
				layer.closeAll('loading')
				if (res.data.statusCode === '200') {
					sessionStorage.removeItem('dispatchData')
					history.go(-1);
					layer.msg('操作成功')
				} else {
					layer.msg(res.data.message)
				}
			}, error => {
				console.log(error)
			})
		}
		
	}]);
})();
