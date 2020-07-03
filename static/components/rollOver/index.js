(function (angular) {
	angular.module('manage')
		.component('rollOver', {
			templateUrl: '/static/components/rollOver/index.html',
			controller: rollOverCtrl,
			controllerAs: 'vm',
			bindings: {
				callback: "<",// 回调
				rollData: '<',
			}
		})


	function rollOverCtrl($scope, erp) {

		let vm = this
		$scope.showFlag = false
		const initStorage = async () => {
			$scope.rollOverItem = {
				current: '',
				list: [],
				selectId: ''
			}
		}

		// 初始化
		this.$onInit = async () => {
			console.log('storagetab', this)
			$scope.callback = this.callback // 回调
			await initStorage()
		}
		this.$onChanges = (changes) => {
			console.log(changes)
			if (changes.rollData && changes.rollData.currentValue) {
				let res = changes.rollData.currentValue;
				console.log(res)
				// const { list } = $scope.rollOverItem;
				$scope.rollOverItem = {
					current: res.name,
					list: res.list,
					selectId: '',
					orderId: res.id
				}
				$scope.showFlag = true
			}
		}
		/* $scope.$on('roll-over', (_, res) => {
			// console.log('111111111111111111111')
			const { list } = $scope.rollOverItem
			$scope.rollOverItem = {
				current: res.name,
				list: list.filter(_ => _.dataId !== res.wid),
				selectId: ''
			}
			$scope.showFlag = true
		}) */
		$scope.doSomething = () => {
			const params = {
				id: $scope.rollOverItem.orderId,
				to: $scope.rollOverItem.selectId
			}
			erp.load()
		  erp.postFun('app/buyOrder/zfOrder/swithWarehouse', params, res => {
				console.log(res)
				erp.closeLoad()
				layer.msg(res.data.data ? '转仓成功' : '转仓失败')
				$scope.showFlag = false
				$scope.callback()
			}, _ => layer.msg('系统错误'))
		}
	}
})(angular)