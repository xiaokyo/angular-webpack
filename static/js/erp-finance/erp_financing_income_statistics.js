(function () {
	/** 财务 —— 收入统计 */
	app.controller('financingIcomeStatisticsCtrl', ['$scope', 'erp', '$routeParams', 'utils', function ($scope, erp, $routeParams, utils) {
		/*** Model */
		//统计类型
		$scope.statisticsModel = {
			"market": { val: 1, txt: '销售统计' },
			"particulars": { val: 2, txt: '销售明细' },
			"income": { val: 3, txt: '收入统计' }
		}
		//币种
		$scope.currencyModel = {
			"RMB": { val: '1', txt: '人民币', en: 'RMB', id: 1 },
			"USD": { val: '2', txt: '美元', en: 'USD', id: 2 }
		}

		/** 变量 */
		$scope.statisticsType = $routeParams.statisticsType                                      // 收入统计类型
			? $scope.statisticsModel[$routeParams.statisticsType].val
			: $scope.statisticsModel.market.val

		/** 公用参数 */
		let rate = 6
		$scope.rateMoney = rate                                                                  //利率
		$scope.rateObj = null

		$scope.pageNum = 1                                                                       //分页 第几页
		$scope.pageSize = '50'                                                                   //分页 每页几条
		$scope.currentCurrency = $scope.currencyModel.USD.val                                    //币种切换 当前显示的是什么币种
		$scope.canShowPage = false                                                               //是否展示 分页器
		$scope.startTime = ''                                                                    //查询 开始时间
		$scope.endTime = ''                                                                      //查询 结束时间
		$scope.showFlag = false                                                                  //利率弹框

		//销售明细
		$scope.orderType = ''                                                                    //销售明细 -- 订单类型
		$scope.searchName = ''                                                                   //销售明细 -- 搜索input

		/** 监听页面大小变化 以及 顶部tab元素变化*/
		let topTabEle = document.getElementById('top-tab')
			, observer = new MutationObserver(ev => {
				// 这里写监听代码
				let height

				setTimeout(() => {
					height = topTabEle.offsetHeight
					console.log(height)
					document.getElementById('content-wrap').style.marginTop = `${height}px`
				}, 500);
			})

		observer.observe(topTabEle, { childList: true, subtree: true });

		window.onresize = function () {
			let height = topTabEle.offsetHeight

			document.getElementById('content-wrap').style.marginTop = `${height}px`
		}

		/** 顶部 tab 切换 */
		$scope.changeIncomeType = function (type) {
			$scope.statisticsType = type
			clearSearch()
			getList()
		}

		/** 先获取汇率 */
		getRate()
		function getRate() {
			let url = 'erp/statistics/getRate'

			optAsyn({
				url, sendData: {}, callback: ({ result }) => {
					const { rete_money } = result[0]

					$scope.rateMoney = rate = rete_money ? rete_money : 6.88
					$scope.rateObj = result[0]
					getList()
				}
			})
		}

		//获取列表

		function getList() {
			switch ($scope.statisticsType) {
				case $scope.statisticsModel.market.val:
					getMarketList()
					break
				case $scope.statisticsModel.particulars.val:
					getParticularsList()
					break
				case $scope.statisticsModel.income.val:
					getIncomeList()
					break
				default:
					break
			}
		}
		/** 销售统计 */
		function getMarketList() {
			let url = 'erp/statistics/operatingIncome'
				, sendData = {
					pageNo: $scope.pageNum,
					pageSize: $scope.pageSize * 1
				}

			$scope.curretnSendData = sendData
			optAsyn({
				url, sendData, callback: ({ result }) => {
					console.log(result);
					$scope.marketList = result.list
					$scope.totalCounts = result.total
					// $scope.marketList.length > 0 && ($scope.canShowPage = true)
					$scope.canShowPage = $scope.marketList.length > 0 ? true : false
					$scope.totalMoneyUSD = result.money || 0
					$scope.totalMoneyRMB = result.money ? parseFloat((result.money * rate).toFixed(2)) : 0
					pageFun()
				}
			})
		}

		/**  销售明细*/
		function getParticularsList() {
			let url = 'erp/statistics/getSalesDetails'
				, sendData = {
					pageNo: $scope.pageNum,
					pageSize: $scope.pageSize * 1,
					startTime: $scope.startTime ? $scope.startTime : '',
					endTime: $scope.endTime ? utils.changeTime(new Date($scope.endTime).getTime() + 24 * 60 * 60 * 1000, false) : '',
					orderType: $scope.orderType ? $scope.orderType : '',
					searchName: $scope.searchName ? $scope.searchName : ''
				}

			$scope.curretnSendData = sendData
			optAsyn({
				url, sendData, callback: ({ result }) => {
					const { incomeList, total, money } = result

					$scope.incomeList = incomeList.map(income => {
						income.paymentDate = income.paymentDate ? income.paymentDate.split('.')[0] : '--'
						return income
					})
					$scope.totalCounts = total
					// $scope.incomeList.length > 0 && ($scope.canShowPage = true)
					$scope.canShowPage = $scope.incomeList.length > 0 ? true : false
					$scope.totalMoneyUSD = money || 0
					$scope.totalMoneyRMB = money ? parseFloat((money * rate).toFixed(2)) : 0
					pageFun()
				}
			})

		}

		/** 收入统计 */
		//收入统计列表
		function getIncomeList() {//statisIncomeAll
			let url = 'erp/statistics/statisIncomeAll'
				, sendData = {
					pageNo: $scope.pageNum,
					pageSize: $scope.pageSize * 1,
					rateType: $scope.currencyModel.USD.id,
					rateMoney: rate
				}

			$scope.curretnSendData = sendData
			optAsyn({
				url, sendData, callback: ({ result }) => {
					console.log(result)
					$scope.outsideList = result.list
					$scope.totalCounts = result.total
					// $scope.outsideList.length > 0 && ($scope.canShowPage = true)
					$scope.canShowPage = $scope.outsideList.length > 0 ? true : false
					$scope.totalMoneyUSD = result.money
					$scope.totalMoneyRMB = result.money ? parseFloat((result.money * rate).toFixed(2)) : 0
					pageFun()
				}
			})
		}
		// 打开汇率
		$scope.paritiesFun = () => {
			$scope.showFlag = true
			$scope.rateMoney = rate
		}
		//修改汇率
		$scope.sureRate = () => {
			if (!$scope.rateMoney) {
				layer.msg('汇率不能为空')
			} else {
				let url = 'erp/statistics/updRate'
					, { id, rate_name, rate_type } = $scope.rateObj
					, sendData = {
						id,
						rateName: rate_name,
						rateType: rate_type,
						reteMoney: $scope.rateMoney
					}

				optAsyn({
					url, sendData, callback: res => {
						rate = $scope.rateMoney
						$scope.rateObj = Object.assign($scope.rateObj, { rete_money: $scope.rateMoney })
						$scope.showFlag = false
						location.reload()
					}
				})
			}
		}

		/** 公用 */
		//请求接口
		function optAsyn({ url, sendData, callback }) {
			erp.postFun(url, JSON.stringify(sendData), ({ data }) => {
				data.statusCode === '200' && callback(data)
			}, err => { layer.msg('网络错误') }, { layer: true })
		}
		//导出excel
		$scope.export = () => {
			let sendData = $scope.curretnSendData
				, url = 'erp/excel/importIncomeList'
				, params = []
				, link = document.createElement('a')
				, excelIp
				, environment = window.environment

			// console.log(sendData)
			switch ($scope.statisticsType) {
				case $scope.statisticsModel.market.val:
					sendData = Object.assign(sendData, { excelType: 'I1' })
					break
				case $scope.statisticsModel.particulars.val:
					sendData = Object.assign(sendData, { excelType: 'I2' })
					break
				case $scope.statisticsModel.income.val:
					sendData = Object.assign(sendData, { excelType: 'I3' })
					break
				default:
					break
			}
			for (let k in sendData) {
				params.push(`${k}=${sendData[k]}`)
			}
			url = `${url}?${params.join('&')}`
			if (/development/.test(environment)) {
				excelIp = 'http://192.168.5.190:8080/ROOT/'
			} else if (/test/.test(environment)) {
				excelIp = 'http://erp1.test.com/'
				// excelIp = 'http://192.168.5.190:8080/ROOT/'
			} else if (/production/.test(environment)) {
				excelIp = 'https://erp1.cjdropshipping.com/'
			}

			link.href = excelIp + url
			console.log(link.href)
			// link.setAttribute("target","_blank")
			link.click()
		}
		//查询
		$scope.searchFun = () => {
			let result = judgeSearchTime({ startDate: $scope.startTime, endDate: $scope.endTime })

			if (!result.can) {
				layer.msg(result.message)
			} else {
				$scope.pageNum = 1
				getList()
			}
		}
		//判断搜索条件 时间是否符合
		function judgeSearchTime({ startDate, endDate }) {
			console.log(startDate, endDate)
			let result = {}
				, now = new Date()
				, nowYear = now.getFullYear()
				, nowMonth = now.getMonth() + 1
				, nowDay = now.getDate()
				, tomorrow = new Date(`${nowYear}-${nowMonth}-${nowDay + 1}`).getTime()

			if (new Date(startDate).getTime() >= tomorrow || new Date(endDate).getTime() >= tomorrow) {
				result.can = false
				result.message = '查询日期不能超过今天'
			} else if (startDate && endDate && new Date(startDate).getTime() > new Date(endDate).getTime()) {
				result.can = false
				result.message = '开始日期不能大于结束日期'
			} else {
				result.can = true
			}
			return result
		}
		//根据币种 展示数据
		$scope.showMoneyFun = (money) => {
			let _money

			$scope.currentCurrency === $scope.currencyModel.RMB.val
				? _money = `￥${parseFloat((money * rate).toFixed(2))}`
				: _money = `$${parseFloat(money.toFixed(2))}`

			return _money
		}
		//清空搜索以及列表数据
		function clearSearch() {
			$scope.pageNum = 1
			$scope.pageSize = '50'
			$scope.currentCurrency = $scope.currencyModel.USD.val
			$scope.canShowPage = false
			$scope.startTime = ''
			$scope.endTime = ''
			//销售明细
			$scope.marketList = []
			$scope.orderType = ''
			$scope.searchName = ''
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
					console.log(n)
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
})()