(function () {
	var app = angular.module('erp-service')

	app.controller('nightShiftCtrl', ['$scope', 'erp', function ($scope, erp) {
		console.log("nightShiftCtrl")

		/**参数 */
		$scope.pageNum = 1
		$scope.pageSize = 20
		$scope.showFlag = false
		$scope.showFlag2 = false
		$scope.currentNameen = ''
		$scope.currentId = ''
		$scope.ownerList = []
		$scope.hourList = []
		$scope.minuteList = []
		$scope.recordList = []
		$scope.record = {
			id: '',
			startHour: '21',
			startMinute: '00',
			endHour: '03',
			endMinute: '30',
			type: '',
			canEidt: true
		}
		getHourList()
		getMinuteList()
		getAllSalesman()
		getList()

		/** 接口方法 */
		/** 获取列表 */
		function getList() {
			ajaxFn({
				url: 'app/message/getNightShiftList',
				params: {},
				callback: ({ data }) => {
					if (data.statusCode === '200') {
						$scope.recordList = data.data
					} else {
						layer.msg('获取列表错误')
					}
				}
			})
		}

		/**获取小时数组 */
		function getHourList() {
			const limit = 24
			for (let i = 0; i < limit; i++) {
				const item = i < 10 ? `0${i}` : i
				$scope.hourList.push(item.toString())
			}
		}

		/**获取分钟数组 */
		function getMinuteList() {
			const limit = 59
			for (let i = 0; i <= limit; i++) {
				const item = i < 10 ? `0${i}` : i
				$scope.minuteList.push(item.toString())
			}
		}

		/** 获取业务员列表 */
		function getAllSalesman() {
			erp.postFun("app/account_erp/getAllSalesman", { ownerName: '' }, function (data) {
				var data = JSON.parse(data.data.result);
				console.log(data);
				$scope.ownerList = data;
			}, function (err) { })
		}

		/**打开新增弹窗 */
		$scope.openAdd = (type, record) => {
			clearRecord()
			if (type === 'edit') {
				const { id, emp_id, night_shift_end, night_shift_start } = record
				$scope.record = {
					id: emp_id,
					type,
					startHour: night_shift_start.split(':')[0],
					startMinute: night_shift_start.split(':')[1],
					endHour: night_shift_end.split(':')[0],
					endMinute: night_shift_end.split(':')[1],
					canEidt: false
				}
				$scope.currentId = id
			} else if (type === 'add') {
				$scope.record.type = type
			}
			$scope.showFlag = true
		}

		/**新增晚班记录 */
		$scope.addNigthFn = () => {
			const { id, startHour, startMinute, endHour, endMinute, type } = $scope.record
			if (!id) {
				layer.msg('请选择业务员')
			} else if (type === 'add') {
				const params = {
					id,
					nightShiftStart: `${startHour}:${startMinute}`,
					nightShiftEnd: `${endHour}:${endMinute}`
				}
				ajaxFn({
					url: 'app/message/addNightShift',
					params,
					callback: ({ data }) => {
						const { statusCode } = data
						if (statusCode === '200') {
							layer.msg('新增成功')
							$scope.showFlag = false
							getList()
						} else {
							layer.msg('新增失败')
						}
					}
				})
			} else if (type === 'edit') {
				const params = {
					id: $scope.currentId,
					nightShiftStart: `${startHour}:${startMinute}`,
					nightShiftEnd: `${endHour}:${endMinute}`,
				}
				ajaxFn({
					url: 'app/message/updateNightShiftById',
					params,
					callback: ({ data }) => {
						const { statusCode } = data
						if (statusCode === '200') {
							layer.msg('修改成功')
							$scope.showFlag = false
							getList()
						} else {
							layer.msg('修改失败')
						}
					}
				})
			}
		}
		/**删除 -- 确认弹窗 */
		$scope.deleteRecord = ({ nameen }) => {
			$scope.currentNameen = nameen
			$scope.showFlag2 = true
		}
		/**删除 -- 确认删除 */
		$scope.confirmDelete = () => {
			ajaxFn({
				url: 'app/message/deleteNightShift',
				params: { nameen: $scope.currentNameen },
				callback: ({ data }) => {
					const { statusCode } = data
					if (statusCode === '200') {
						layer.msg('删除成功')
						$scope.showFlag2 = false
						getList()
					} else {
						layer.msg('删除失败')
					}
				}
			})
		}

		/**封装 ajax */
		function ajaxFn({ url, params, callback }) {
			erp.postFun(url, JSON.stringify(params), res => {
				callback(res)
			}, error => {
				layer.msg('网络错误')
			}, { layer: true })
		}


		/**清空弹窗数据 */
		function clearRecord() {
			$scope.record = {
				id: '',
				startHour: '21',
				startMinute: '00',
				endHour: '03',
				endMinute: '30',
				type: '',
				canEidt: true
			}
		}

	}])
})()