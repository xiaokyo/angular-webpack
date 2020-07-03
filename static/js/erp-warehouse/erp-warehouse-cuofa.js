(function (angular) {

	const dateTypeModel = {
		seven: { val: 1, type: 'seven', txt: '近七天' },
		one: { val: 2, type: 'one', txt: '一个月' },
		three: { val: 3, type: 'three', txt: '三个月' },
	}

	app.controller('cuofaCtrl', ['$scope', "erp", "$routeParams", 'utils', function ($scope, erp, $routeParams, utils) {
		console.log('cuofaCtrl')

		/**参数 */
		let topTabEle = document.getElementById('top-tab')
			, tabLeft = topTabEle.offsetLeft

		$scope.dateType = dateTypeModel.one.type                         //三个时间筛选选项
		$scope.pageNum = 1
		$scope.pageSize = '20'
		$scope.store = '0'                                               //搜索用 - 仓库
		$scope.startDate = ''                                            //搜索用 - 开始时间 
		$scope.endDate = ''                                              //搜索用 - 结束时间
		$scope.pageFlag = false                                          //分页



		window.onscroll = function () {
			let scrollTop = document.documentElement.scrollLeft || document.body.scrollLeft;
			// console.log("滚动距离" + scrollTop, '===', topTabEle.offsetLeft, topTabEle.style.left);
			topTabEle.style.left = `${tabLeft - scrollTop}px`
		}

		/** 方法 */
		//获取列表
		getList()
		function getList() {
			let url = 'erp/disputeInfo/getErpDisputeTypeList'
				, sendData = {
					pageNum: Number($scope.pageNum),
					pageSize: Number($scope.pageSize),
					store: $scope.store
				}

			if ($scope.dateType) {
				let { startTime, endTime } = getTimeRange($scope.dateType === 'seven' ? 7 : $scope.dateType === 'one' ? 30 : 90)

				sendData = Object.assign(sendData, { beginDate: startTime, endDate: endTime })
			} else {
				sendData = Object.assign(sendData, { beginDate: $scope.startDate, endDate: $scope.endDate })
			}

			erp.postFun(url, JSON.stringify(sendData), ({ data }) => {
				const { statusCode, result } = data
				if (statusCode === '200') {
					const { list, total, columnSum } = result

					$scope.cuofaList = list
					$scope.totalCounts = total
					$scope.columnSum = columnSum
					$scope.pageFlag = list.length > 0
					pageFun()
				}

			}, error => { layer.msg('网络错误') }, { layer: true })
		}


		//切换 时间删选
		$scope.searchByDateType = (type) => {
			$scope.dateType = type
			$scope.startDate = ''
			$scope.endDate = ''
			$scope.pageNum = 1
			getList()
		}

		//搜索按钮
		$scope.search = () => {
			let flag = true

			if (!$scope.startDate && !$scope.endDate) {
				if (!$scope.dateType) {
					$scope.dateType = dateTypeModel.one.type
				}
			} else if (!$scope.startDate && $scope.endDate) {
				layer.msg('请先选择开始日期')
				flag = false
			} else if ($scope.startDate) {
				if (!$scope.endDate) {
					let now = new Date()
					$scope.endDate = utils.changeTime(now.getTime())
				}

				let { can, message } = judgeSearchTime($scope.startDate, $scope.endDate)

				if (!can) {
					layer.msg(message)
					flag = false
				} else {
					$scope.dateType = ''
				}
			}

			if (flag) {
				$scope.pageNum = 1
				getList()
			}
		}

		//获取 从今天开始 往前一段时间的范围   参数 - limit：今天之前多少天
		function getTimeRange(limit) {
			let now = new Date()
				, nowTime = now.getTime()
				, result = {
					endTime: utils.changeTime(nowTime),
					startTime: utils.changeTime(nowTime - (limit - 1) * 24 * 60 * 60 * 1000)
				}

			return result
		}
		//判断搜索条件 时间是否符合
		function judgeSearchTime(startDate, endDate) {
			let now = new Date().getTime()
				, tomorrow
				, result = { can: true, message: '' }

			now = new Date(utils.changeTime(now)).getTime()
			tomorrow = now + 24 * 60 * 60 * 1000
			startDate = new Date(startDate).getTime()
			endDate = new Date(endDate).getTime()

			result = startDate >= tomorrow || endDate >= tomorrow
				? Object.assign(result, { can: false, message: '查询日期不能超过今天' })
				: startDate > endDate
					? Object.assign(result, { can: false, message: '开始日期不能大于结束日期' })
					: result

			return result
		}

		//根据数字 获取百分比
		$scope.showData = (num) => {
			let percent = 0

			num = Number(num)
			percent = parseFloat((num / $scope.columnSum) * 100).toFixed(2)
			return `${num} (${percent}%)`
		}

		//分页
		function pageFun() {
			$(".pagegroup").jqPaginator({
				totalCounts: $scope.totalCounts || 1,
				pageSize: $scope.pageSize * 1,
				visiblePages: 5,
				currentPage: $scope.pageNum * 1,
				activeClass: 'current',
				first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				onPageChange: function (n, type) {
					if (type == 'init') {
						return;
					}
					$scope.pageNum = n;
					getList();
				}
			});
		}
		//切换pagesize
		$scope.pagechange = function () {
			$scope.pageNum = 1
			getList()
		}
		//跳转第几页
		$scope.pagenumchange = function () {
			if (Number($scope.pageNum) <= 0) {
				$scope.pageNum = 1;
			}
			let pagenum = Number($scope.pageNum)
				, totalpage = Math.ceil($scope.totalCounts / $scope.pageSize)

			if (pagenum > totalpage) {
				layer.msg('错误页码');
				$scope.pageNum = 1;
			} else {
				getList();
			}
		}

	}])

})(angular)