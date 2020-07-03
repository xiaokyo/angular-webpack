(function (angular) {
	angular.module('manage')
		.component('timeSelect', {
			templateUrl: '/static/components/time-select/time-select.html',
			controller: timeSelectCtrl,
			bindings: {
				list: '=',
				id: '@',
				// custom: '=',
				current: '='
			}
		})
	
		function timeSelectCtrl($scope, erp){
			console.log('timeSelectCtrl =>', this.current)
			$scope.selectProps = {
				list: this.list,
				id: this.id,
				// custom: this.custom,
			}
			$scope.selectProps.list.forEach(item => {
				if(item.type === this.current) $scope.selectProps.current = JSON.parse(JSON.stringify(item))
			})
			
			$scope.selectTimeFn = item => {
				$scope.selectProps.current = JSON.parse(JSON.stringify(item))
				if(item.type !== 'custom') { //选择的不是自定义时间，需要向父组件发送通知进行查询
					$scope.$emit('search-by-turnover', {
						id: $scope.selectProps.id,
						item
					})

				}
			}
			$scope.customSearch = () => {
				console.log($scope.startTime, $scope.endTime)
				$scope.$emit('search-by-turnover', {
					id: $scope.selectProps.id,
					item: {
						type: 'custom',
						startTime: $scope.startTime,
						endTime: $scope.endTime
					}
				})
			}
		}
})(angular)