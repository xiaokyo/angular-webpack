(function (angular) {
	angular.module('manage')
		.component('sourceError', {
			templateUrl: 'static/components/source-error/source-error.html',
			controller: sourceErrorCtrl,
			bindings: {
				podarray: '=',
				showdetail: '=',
				no: '=',
				onLog: '&',
				showWorkOrder: '&',
				username: '='
			}
		})

	function sourceErrorCtrl($scope, erp, $http) {
		console.log(this.no)
		$scope.dropFlag = false                                 //失败原因下拉框显示隐藏
		$scope.reason = {}                                      //失败原因
		$scope.productLink = ''                                 //相似商品链接
		let { item, type } = this.no
			, url, sendInfo = {}

		$scope.productLink = item.xiangSiLianJie ? item.xiangSiLianJie : ''
		switch (type) {
			case 'kehu':
				url = 'app/sourcing/modify'
				sendInfo = Object.assign(sendInfo, { status: '2', id: item.ID })
				break
			case 'duyou':
				url = 'app/sourcing/modify'
				sendInfo = Object.assign(sendInfo, { status: '2', id: item.ID })
				break
			case 'pingtai':
				url = 'app/sourcing/cjModify'
				sendInfo = Object.assign(sendInfo, { sourceId: item.ID })
				break
			case 'youke':
				url = 'pojo/touristSource/sourceFail'
				sendInfo = Object.assign(sendInfo, { id: item.id })
				break
			default:
				break
		}

		$http.get('static/components/source-error/source-error.json').then(({ data }) => {
			const { list } = data

			$scope.errorList = list
			$scope.reason = list[0]
		})

		//展开收起失败原因列表
		$scope.openSelect = () => {
			$scope.dropFlag = !$scope.dropFlag
		}
		//点击其他区域关闭原因列表
		$scope.closeSelect = (ev) => {
			if (ev.target.id !== 'error-select') $scope.dropFlag = false
		}
		//选择失败原因
		$scope.clickReason = (reason) => {
			$scope.reason = reason
		}
		//关闭弹窗
		$scope.closeFun = function () {
			$scope.$emit('log-to-father', { closeFlag: false });
		}
		//确认
		$scope.sureError = () => {
			let sendData

			sendInfo = Object.assign(sendInfo, { failExplain: $scope.reason.en, xiangSiLianJie: $scope.productLink })
			sendData = (type === 'kehu' || type === 'duyou')
				? { data: JSON.stringify(sendInfo) }
				: sendInfo
			console.log(sendData)
			erp.postFun(url, sendData, res => {
				// console.log(res)
				location.reload()
			}, error => { }, { layer: true })
		}
	}
})(angular)