(function () {
	//支出
	app.controller('financingExpendiureCtrl', ['$scope', 'erp', '$routeParams', 'utils', '$location', function ($scope, erp, $routeParams, utils, $location) {
		console.log('financingExpendiureCtrl')
		/** model */
		//支出类型
		$scope.expenditureTypeModel = {
			'cost': { val: 1, txt: '销售成本' },
			'dispute': { val: 2, txt: '销售费用提成纠纷' },
			'sellComposite': { val: 3, txt: '销售费用综合' },
			'salary': { val: 4, txt: '管理费用工资' },
			'manageComposite': { val: 5, txt: '管理费用综合' },
			'financialExpense': { val: 6, txt: '财务费用' },
			'other': { val: 7, txt: '其他支出' },
			'statistics': { val: 8, txt: '支出统计' }
		}
		const compositeArr = [3, 5, 7]
		//支出模型
		$scope.expendTypeModel = {
			1: { txt: "关税", val: 1 }, 2: { txt: "广告费", val: 2 }, 3: { txt: "提货费", val: 3 }, 4: { txt: "快递费", val: 4 }, 5: { txt: "车里使用费", val: 5 }, 6: { txt: "差旅费", val: 6 }, 7: { txt: "福利费", val: 7 }, 8: { txt: "办公费", val: 8 }, 9: { txt: "租金", val: 9 }, 10: { txt: "水电费", val: 10 }, 11: { txt: "招聘费", val: 11 }, 12: { txt: "低值易耗", val: 12 }, 13: { txt: "其他税费", val: 13 }, 14: { txt: "退税", val: 14 }, 15: { txt: "其他退税", val: 15 },
		}
		//货币
		const currencyModel = { 'RMB': { val: '1', txt: 'RMB', id: 1 }, 'USD': { val: '2', txt: 'USD', id: 2 } }
		//弹窗参数 模板  注：适用于--销售费用（综合），管理费用（综合），其他支出
		const addModel = {
			expendType: -1,                                       //支出类型
			rateType: currencyModel.RMB.val,                      //币种 
			money: null,                                          //金额
			remark: '',                                           //摘要
			expendDate: '',                                       //支出时间
			id: -1,
		}
		//工资条 模板
		const salaryModel = {
			salaryMonth: '',                                      //月份
			moneyHz: 0,                                           //杭州工资
			moneyHzType: currencyModel.RMB.val,                   //杭州工资类型
			fiveHz: 0,                                            //杭州五险一金
			fiveHzType: currencyModel.RMB.val,                    //杭州五险一金类型
			moneyYw: 0,                                           //义乌工资
			moneyYwType: currencyModel.RMB.val,                   //义务工资类型
			fiveYw: 0,                                            //义乌五险一金
			fiveYwType: currencyModel.RMB.val,                    //义乌五险一金类型
			moneySz: 0,                                           //深圳工资
			moneySzType: currencyModel.RMB.val,                   //深圳工资类型
			fiveSz: 0,                                            //深圳五险一金
			fiveSzType: currencyModel.RMB.val,                    //深圳五险一金类型
			moneyMd: 0,                                           //美东工资
			moneyMdType: currencyModel.USD.val,                   //美东工资类型
			fiveMd: 0,                                            //美东五险一金
			fiveMdType: currencyModel.USD.val,                    //美东五险一金类型
			moneyMx: 0,                                           //美西工资
			moneyMxType: currencyModel.USD.val,                   //美西工资类型
			fiveMx: 0,                                            //美西五险一金
			fiveMxType: currencyModel.USD.val,                    //美西五险一金类型
			moneyTotal: 0,                                        //工资总计
			fiveTotal: 0,                                         //五险一金总计
			total: 0,                                             //总计
		}
		//提成纠纷 模板
		const disputeModel = {
			royaltyMoneyType: currencyModel.RMB.id,               //销售提成类型
			royaltyMoney: 0,                                      //销售提成金额
			reissueMoneyType: currencyModel.USD.id,               //补发类型
			reissueMoney: 0,                                      //补发金额
			refundMoney: 0,                                       //退款金额（USD）
			distributeMoney: 0,                                   //分销提现（USD）
			totalMoney: 0,                                        //总计（USD）
			statisticsDate: '',                                   //月份
		}
		//弹窗参数 模板 注：适用于 -- 财务费用
		const financingModel = {
			cardName: '',                                         //账户类型
			cardNumber: '',                                       //账号
			money: null,                                          //手续费
			rateType: currencyModel.USD.val,                      //币种
			moneyDate: '',                                        //支出日期
			remark: ''                                            //摘要
		}

		/** 参数 */
		$scope.expenditureType = $scope.expenditureTypeModel[$location.path().split('/')[3]].val
		//公用参
		$scope.showFLag = false                                 //新增弹窗 显示 隐藏
		$scope.showFLag2 = false                                //确认弹窗 显示 隐藏
		$scope.windowType = {                                   //新增编辑弹窗 类型
			type: '',                                             //弹窗类型： add-新增 edit-编辑
			txt: '',                                              //弹窗文案
			item: addModel
		}
		$scope.sureExpend = addModel                            //确认删除弹窗 参数
		$scope.canShowPage = false                              //分页器 是否展示

		$scope.pageNum = 1                                      //分页 第几页
		$scope.pageSize = '20'                                  //分页 每页展示几条
		$scope.currentCurrency = currencyModel.USD.val          //币种展示 => 当前选中币种、
		$scope.startDate = ''                                   //搜索 - 开始日期
		$scope.endDate = ''                                     //搜索 - 结束日期
		$scope.searchExpend = ''                                //搜索 - 销售费用综合/管理费用综合/其他支出 - 支出类型
		$scope.currentEdit = null                               //工资 纠纷 编辑时存储当前选择的项
		$scope.isEdit = false                                   //工资 纠纷 编辑时记录是否为编辑状态，如果是，则点击其他编辑按钮无效


		/**  方法 */
		/** 监听页面大小变化 以及 顶部tab元素变化*/
		let topTabEle = document.getElementById('top-tab')
			, tabLeft = topTabEle.offsetLeft
			, observer = new MutationObserver(ev => {
				// 这里写监听代码
				let height

				setTimeout(() => {
					height = topTabEle.offsetHeight
					document.getElementById('content-wrap').style.marginTop = `${height}px`
				}, 500);
			})

		observer.observe(topTabEle, { childList: true, subtree: true });

		window.onresize = function () {
			let height = topTabEle.offsetHeight

			document.getElementById('content-wrap').style.marginTop = `${height}px`
		}

		window.onscroll = function () {
			let scrollTop = document.documentElement.scrollLeft || document.body.scrollLeft;
			// console.log("滚动距离" + scrollTop, '===',topTabEle.offsetLeft , topTabEle.style.left); 
			topTabEle.style.left = `${tabLeft - scrollTop}px`
		}

		//tab页切换
		$scope.changeIncomeType = (type) => {
			$scope.expenditureType = type
			clearSearch()
			getList()
		}

		//获取汇率
		clearSearch()
		getRate()
		// getList()
		function getRate() {
			let url = 'erp/statistics/getRate'

			optAsyn({
				url, sendData: {}, callback: ({ result }) => {
					const { rete_money } = result[0]

					$scope.rate = rete_money ? rete_money : 6.88
					getList()
				}
			})
		}

		//获取列表
		function getList() {
			console.log('111')
			switch ($scope.expenditureType) {
				case $scope.expenditureTypeModel.cost.val:                     //销售成本
					getCostList()
					$scope.exportFlag = 'E14'
					break
				case $scope.expenditureTypeModel.dispute.val:                  //销售费用 -- 提成纠纷
					getDisputeList()
					$scope.exportFlag = 'E12'
					break
				case $scope.expenditureTypeModel.sellComposite.val:            //销售费用 -- 综合
					getCompositeList()
					$scope.exportFlag = 'E16'
					break
				case $scope.expenditureTypeModel.salary.val:                   //管理费用 -- 工资
					getSalaryList()
					$scope.exportFlag = 'E13'
					break
				case $scope.expenditureTypeModel.manageComposite.val:          //管理费用 -- 综合
					getCompositeList()
					$scope.exportFlag = 'E17'
					break
				case $scope.expenditureTypeModel.financialExpense.val:         //财务费用
					getAccountList()
					getFinancingList()
					$scope.exportFlag = 'E15'
					break
				case $scope.expenditureTypeModel.other.val:                    //其他支出
					getCompositeList()
					$scope.exportFlag = 'E18'
					break
				case $scope.expenditureTypeModel.statistics.val:               //支出统计
					getStatisticsExpendByPage()
					$scope.exportFlag = 'E19'
					break
			}
		}
		/**销售成本 */
		function getCostList() {
			let url = 'erp/statistics/operatingIncome'
				, sendData = { pageNo: Number($scope.pageNum), pageSize: Number($scope.pageSize), }

			$scope.searchSendData = JSON.parse(JSON.stringify(sendData))
			optAsyn({
				url, sendData, callback: ({ result }) => {
					const { list, total, costMoney } = result

					$scope.costList = list.map(cost => {
						cost.d_purchase_cost = cost.d_purchase_cost || 0
						cost.d_logistics_cost = cost.d_logistics_cost || 0
						cost.z_purchase_cost = cost.z_purchase_cost || 0
						cost.totalMoney = cost.d_purchase_cost + cost.d_logistics_cost + cost.z_purchase_cost
						cost.purchaseCost = cost.d_purchase_cost + cost.z_purchase_cost
						return cost
					})
					$scope.sumMoneyUSD = costMoney ? parseFloat(costMoney.toFixed(2)) : 0
					$scope.sumMoneyRMB = costMoney ? parseFloat((costMoney * $scope.rate).toFixed(2)) : 0
					$scope.totalCounts = total
					$scope.canShowPage = list.length > 0
					pageFun()
				}
			})
		}

		/**销售费用 -- 提成纠纷 */
		function getDisputeList() {
			let url = 'erp/expend/getExpendDisputeListByPage'
				, sendData = { pageNo: Number($scope.pageNum), pageSize: Number($scope.pageSize), }

			$scope.searchSendData = JSON.parse(JSON.stringify(sendData))
			optAsyn({
				url, sendData, callback: ({ result }) => {
					const { list, total, sumMoney } = result
					let noMonth = checkIndexInList(list, 'statisticsDate')

					if (list.length === 0 || noMonth) {
						getDisputeinfoMoneys({
							callback: res => {
								insertExpendDispute(res)
							}
						})
					} else {
						console.log(noMonth)
						$scope.disputeList = list.map((month) => {
							month.editFlag = false
							return month
						})
						$scope.sumMoneyUSD = sumMoney ? parseFloat(sumMoney.toFixed(2)) : 0
						$scope.sumMoneyRMB = sumMoney ? parseFloat((sumMoney * $scope.rate).toFixed(2)) : 0
						$scope.totalCounts = total
						$scope.canShowPage = $scope.disputeList.length > 0
						pageFun()
					}
				}
			})
		}
		//新增当月的纠纷数据
		function insertExpendDispute({ refundMoney, distributeMoney, statisticsDate }) {
			let url = 'erp/expend/insertExpendDispute'
				, sendData = Object.assign(disputeModel, { refundMoney, distributeMoney, statisticsDate })

			sendData.totalMoney = parseFloat((refundMoney + distributeMoney).toFixed(2))
			optAsyn({
				url, sendData, callback: res => {
					getList()
				}
			})
		}
		//获取当月的退款，分销提现金额
		function getDisputeinfoMoneys({ callback }) {
			let url = 'erp/expend/getDisputeinfoMoneys'
				, now = new Date()
				, resultData = {}
				, statisticsDate = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)}`
				, sendData = {
					startTime: `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)}-01 00:00:00`,
					endTime: `${now.getFullYear()}-${now.getMonth() + 2 < 10 ? '0' + (now.getMonth() + 2) : (now.getMonth() + 2)}-01 00:00:00`
					// startTime: '2019-04-01 00:00:00',
					// endTime: '2019-05-01 00:00:00'
				}

			optAsyn({
				url, sendData, callback: ({ result }) => {
					const { refundMoney, distributeMoney } = result

					resultData = { refundMoney: refundMoney || 0, distributeMoney: distributeMoney || 0, statisticsDate }
					callback(resultData)
				}
			})
		}
		//纠纷编辑 -- 打开
		$scope.openDispute = (item) => {
			const { statisticsDate, distributeMoney, id, refundMoney, reissueMoney, reissueMoneyType, royaltyMoney, royaltyMoneyType } = item

			if ($scope.isEdit) {
				layer.msg('请先完成数据的录入或修改')
			} else {
				$scope.isEdit = true
				item.editFlag = true
				$scope.currentEdit = { statisticsDate, distributeMoney, id, refundMoney, reissueMoney, reissueMoneyType, royaltyMoney, royaltyMoneyType }
				for (k in $scope.currentEdit) {
					if (k.includes('Type')) $scope.currentEdit[k] = String($scope.currentEdit[k])
				}
				getDisputeinfoMoneys({
					callback: res => {
						$scope.currentEdit = Object.assign($scope.currentEdit, res)
					}
				})
			}
		}
		//纠纷编辑 -- 保存
		$scope.saveDisput = () => {
			let totalMoney = 0
				, { distributeMoney, refundMoney, reissueMoney, reissueMoneyType, royaltyMoney, royaltyMoneyType, statisticsDate } = $scope.currentEdit
				, sendData = JSON.parse(JSON.stringify($scope.currentEdit))
				, url = 'erp/expend/updateExpendDispute'

			if (royaltyMoney === undefined || reissueMoney === undefined) {
				layer.msg('金额必须为数字')
			} else {
				royaltyMoney = royaltyMoney || 0
				reissueMoney = reissueMoney || 0
				// console.log(royaltyMoney, reissueMoney)
				totalMoney = $scope.changeCurrency(royaltyMoney, royaltyMoneyType, '2', true).slice(1) * 1 + $scope.changeCurrency(reissueMoney, reissueMoneyType, '2', true).slice(1) * 1 + distributeMoney + refundMoney
				totalMoney = parseFloat(totalMoney.toFixed(2))
				sendData = Object.assign(sendData, { 
					royaltyMoney, 
					reissueMoney, 
					totalMoney, 
					reissueMoneyType: Number(reissueMoneyType), 
					royaltyMoneyType: Number(royaltyMoneyType),
					startTime: `${statisticsDate}-01 00:00:00`,
					endTime: `${statisticsDate.split('-')[0]}-${Number(statisticsDate.split('-')[1]) + 1 < 10 ? '0' + (Number(statisticsDate.split('-')[1]) + 1) : Number(statisticsDate.split('-')[1]) + 1}-01 00:00:00`
				})

				optAsyn({
					url, sendData, callback: res => {
						$scope.disputeList = $scope.disputeList.map(item => { //成功后修改数据
							if (item.id === sendData.id) {
								item = Object.assign(item, sendData, { editFlag: false })
							}
							return item
						})
						$scope.isEdit = false
					}
				})
			}
		}
		//判断获取的列表 月份是否包含当前月
		function checkIndexInList(list, attr) {
			let result = true, now = new Date()

			list.forEach(item => {
				if (item[attr] === `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)}`) {
					result = false
					return
				}
			})
			return result
		}

		/** 管理费用 -- 工资 */
		//获取列表
		function getSalaryList() {
			let url = 'erp/expend/getExpendSalaryListByPage'
				, sendData = { pageNo: Number($scope.pageNum), pageSize: Number($scope.pageSize), }

			$scope.searchSendData = JSON.parse(JSON.stringify(sendData))
			optAsyn({
				url, sendData, callback: ({ result }) => {
					const { list, total, sumMoney } = result
					let noMonth = checkIndexInList(list, 'salaryMonth')

					if (list.length === 0 || noMonth) {//无数据，直接压入一条新数据
						insertExpendSalary()
					} else {
						$scope.salaryList = list.map((month) => {
							month.editFlag = false
							return month
						})
						$scope.sumMoneyUSD = sumMoney ? parseFloat(sumMoney.toFixed(2)) : 0
						$scope.sumMoneyRMB = sumMoney ? parseFloat((sumMoney * $scope.rate).toFixed(2)) : 0
						$scope.totalCounts = total
						$scope.canShowPage = $scope.salaryList.length > 0
						pageFun()
					}
				}
			})
		}
		//新增当月数据
		function insertExpendSalary() {
			let url = 'erp/expend/insertExpendSalary'
				, now = new Date()
				, sendData = salaryModel

			sendData = Object.assign(sendData, { salaryMonth: `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)}` })
			for (const key in sendData) {
				if (key !== 'salaryMonth') {
					sendData[key] = Number(sendData[key])
				}
			}
			optAsyn({
				url, sendData, callback: res => {
					getList()
				}
			})
		}
		//工资编辑 --打开
		$scope.openEdit = (item) => {
			let { moneyHz, moneyHzType, fiveHz, fiveHzType, moneyYw, moneyYwType, fiveYw, fiveYwType, moneySz, moneySzType, fiveSz, fiveSzType, moneyMd, moneyMdType, fiveMd, fiveMdType, moneyMx, moneyMxType, fiveMx, fiveMxType, id, salaryMonth } = item

			if ($scope.isEdit) {
				layer.msg('请先完成数据的录入或修改')
			} else {
				$scope.isEdit = true
				item.editFlag = true
				$scope.currentEdit = { moneyHz, moneyHzType, fiveHz, fiveHzType, moneyYw, moneyYwType, fiveYw, fiveYwType, moneySz, moneySzType, fiveSz, fiveSzType, moneyMd, moneyMdType, fiveMd, fiveMdType, moneyMx, moneyMxType, fiveMx, fiveMxType, id, salaryMonth }
				for (var k in $scope.currentEdit) {
					if (k.includes('Type')) $scope.currentEdit[k] = String($scope.currentEdit[k])
				}
			}
		}
		//工资编辑 --保存
		$scope.saveEdit = () => {
			let feishuzi = false
				, total = 0, moneyTotal = 0, fiveTotal = 0

			for (var key in $scope.currentEdit) {//针对中文输入法输入英文e的判断
				if (key !== 'salaryMonth' && key !== 'id') {
					if ($scope.currentEdit[key] === undefined) {
						feishuzi = true
					} else {
						if (!$scope.currentEdit[key]) {//没有填写的默认为 0
							$scope.currentEdit[key] = 0
						}
						if (!key.includes('Type')) { //判断是否为金额字段，把货币种类字段剔除
							// $scope.currentEdit[key] = Number($scope.currentEdit[key])
							console.log($scope.changeCurrency($scope.currentEdit[key], $scope.currentEdit[`${key}Type`], '2', true).slice(1) * 1)
							total += $scope.changeCurrency($scope.currentEdit[key], $scope.currentEdit[`${key}Type`], '2', true).slice(1) * 1 //总金额
							key.includes('five')
								? fiveTotal += $scope.changeCurrency($scope.currentEdit[key], $scope.currentEdit[`${key}Type`], '2', true).slice(1) * 1  //五险一金总额
								: moneyTotal += $scope.changeCurrency($scope.currentEdit[key], $scope.currentEdit[`${key}Type`], '2', true).slice(1) * 1 //工资总额
						}
					}
				}
			}
			if (feishuzi) {
				layer.msg('金额必须为数字')
			} else {//数据处理
				let sendData = JSON.parse(JSON.stringify($scope.currentEdit))
					, url = 'erp/expend/updateExpendSalary'

				sendData = Object.assign(sendData, { total, fiveTotal, moneyTotal })
				for (var k in sendData) {
					if (k !== 'salaryMonth' && k !== 'id') {
						sendData[k] = Number(sendData[k])
					}
				}
				optAsyn({
					url, sendData, callback: res => {
						$scope.salaryList = $scope.salaryList.map(item => { //成功后修改数据
							if (item.id === sendData.id) {
								item = Object.assign(item, sendData, { editFlag: false })
							}
							return item
						})
						$scope.isEdit = false
					}
				})
			}
		}
		//编辑 --关闭
		$scope.closeEdit = (item) => {
			item.editFlag = false
			$scope.isEdit = false
		}

		/** 综合费用（销售费用综合、管理费用综合、其他支出） */
		//获取列表
		function getCompositeList() {
			let url = 'erp/expend/getExpendListByPage'
				, sendData = {
					pageNo: Number($scope.pageNum),
					pageSize: Number($scope.pageSize),
					startTime: $scope.startDate ? $scope.startDate : '',
					endTime: $scope.endDate ? utils.changeTime(new Date($scope.endDate).getTime() + 24 * 60 * 60 * 1000, false) : '',
					objType: $scope.expenditureType === $scope.expenditureTypeModel.sellComposite.val ? 1
						: $scope.expenditureType === $scope.expenditureTypeModel.manageComposite.val ? 2 : 3,
					expendType: $scope.searchExpend ? Number($scope.searchExpend) : '',
					rateType: currencyModel.RMB.id,
					rateMoney: $scope.rate
				}

			$scope.searchSendData = JSON.parse(JSON.stringify(sendData))
			optAsyn({
				url, sendData, callback: ({ result }) => {
					console.log($scope.pageSize)
					const { list, sumMoney, total } = result

					$scope.compositeList = list.map(item => {
						item.rateType = String(item.rateType)
						item.expendType = String(item.expendType)
						return item
					})
					$scope.sumMoneyRMB = sumMoney ? parseFloat(sumMoney.toFixed(2)) : 0
					$scope.sumMoneyUSD = sumMoney ? parseFloat((sumMoney / $scope.rate).toFixed(2)) : 0
					$scope.totalCounts = total
					$scope.canShowPage = list.length > 0
					pageFun()
				}
			})
		}

		/** 财务费用 */
		//获取账户列表
		function getAccountList() {
			let url = 'erp/statistics/getDspCardList', sendData = { cardType: 1 } // 账户类型为 利息里的账户 所以写死为 1

			optAsyn({
				url, sendData, callback: ({ result }) => {
					console.log(result)
					//startAccountList：启用的账户列表， searchAccountList：搜索用的账户类型列表， addAccountList： 新增手续费用的账户类型列表
					$scope.startAccountList = []
					$scope.searchAccountList = []
					$scope.addAccountList = []
					$scope.startAccountList = result.filter(item => item.cardStatus === 1)
					result.forEach(item => {
						if (!$scope.searchAccountList.includes(item.cardName)) {
							$scope.searchAccountList = [...$scope.searchAccountList, item.cardName]
						}
						if (!$scope.addAccountList.includes(item.cardName) && item.cardStatus === 1) {
							$scope.addAccountList = [...$scope.addAccountList, item.cardName]
						}
					})
				}
			})
		}
		//获取财务费用列表
		function getFinancingList() {
			let url = 'erp/statistics/getIncomeExtendByPage'
				, sendData = {
					pageNo: Number($scope.pageNum),
					pageSize: Number($scope.pageSize),
					moneyStartTime: $scope.startDate ? $scope.startDate : '',
					moneyEndTime: $scope.endDate ? utils.changeTime(new Date($scope.endDate).getTime() + 24 * 60 * 60 * 1000, false) : '',
					objType: 3,
					rateType: 2,
					rateMoney: $scope.rate,
					cardName: $scope.searchCardName || ""
				}

			$scope.searchSendData = JSON.parse(JSON.stringify(sendData))
			optAsyn({
				url, sendData, callback: ({ result }) => {
					const { list, money, total } = result

					$scope.financingList = list.map(item => {
						item.moneyDate = utils.changeTime(item.moneyDate, false)
						return item
					})
					$scope.totalCounts = total
					$scope.sumMoneyUSD = money ? parseFloat(money.toFixed(2)) : 0
					$scope.sumMoneyRMB = money ? parseFloat((money * $scope.rate).toFixed(2)) : 0
					$scope.canShowPage = list.length > 0
					pageFun()
				}
			})
		}
		//选择账户类型联动账号列表
		$scope.changeeCardName = () => {
			$scope.windowType.item.cardNumber = ''
		}

		//财务费用 - 编辑 -- 打开
		$scope.openFinancing = (type, _item) => {
			$scope.windowType = Object.assign($scope.windowType, {
				type,
				txt: type === 'add' ? '新增手续费' : '编辑手续费',
				item: type === 'add' ? JSON.parse(JSON.stringify(financingModel)) : editFinancing(_item)
			})
			$scope.showFLag = true
		}
		//财务费用 - 编辑 -- 保存
		function sureFinancialExpense() {
			const { item, type } = $scope.windowType
				, { cardName, cardNumber, money, moneyDate, rateType } = item
				, { flag, message } = utils.changeNumber({ num: money || 0, limit: 2, type: '手续费' })

			if (!moneyDate) {
				layer.msg('请选择支出日期')
			} else if (!cardName) {
				layer.msg('请选择账户类型')
			} else if (!cardNumber) {
				layer.msg('请选择账号')
			} else if (!money) {
				layer.msg('请填写手续费(必须为数字)')
			} else if (!flag) {
				layer.msg(message)
			} else {
				let url = ''
					, sendData = Object.assign(JSON.parse(JSON.stringify(item)), {
						cardNumber: cardNumber.split('#')[0],
						cardId: Number(cardNumber.split('#')[1]),
						rateType: Number(rateType),
						objType: 3
					})

				if (type === 'add') {
					url = 'erp/statistics/insertIncomeExtend'
					optAsyn({
						url, sendData, callback: res => {
							layer.msg('新增成功')
							$scope.showFLag = false
							getList()
						}
					})
				} else if (type === 'edit') {
					url = 'erp/statistics/updateIncomeExtendById'
					sendData.id = item.id
					optAsyn({
						url, sendData, callback: res => {
							layer.msg('修改成功')
							$scope.showFLag = false
							getList()
						}
					})
				}
			}
		}
		//对编辑状态下 财务费用数据的处理
		function editFinancing(item) {
			const { id, cardId, cardName, cardNumber, money, moneyDate, rateType, remark } = item
			let result = {
				id, cardName, money, moneyDate, remark,
				rateType: String(rateType),
				cardNumber: `${cardNumber}#${cardId}`
			}

			if (!$scope.addAccountList.includes(cardName)) {
				result = Object.assign(result, { cardName: '', cardNumber: '' })
			} else {
				let ishas = false

				console.log($scope.startAccountList)
				$scope.startAccountList.forEach(_item => {
					if (_item.id === cardId) ishas = true
				})
				if (!ishas) result = Object.assign(result, { cardNumber: '' })
			}
			return result
		}

		/**支出统计 */
		function getStatisticsExpendByPage() {
			let url = 'erp/expend/getStatisticsExpendByPage'
				, sendData = { pageNo: Number($scope.pageNum), pageSize: Number($scope.pageSize), rateType: currencyModel.USD.id, rateMoney: $scope.rate }

			$scope.searchSendData = JSON.parse(JSON.stringify(sendData))
			optAsyn({
				url, sendData, callback: ({ result }) => {
					const { list, total, money } = result

					$scope.sellingList = list
					$scope.canShowPage = list.length > 0
					$scope.sumMoneyUSD = money ? parseFloat(money.toFixed(2)) : 0
					$scope.sumMoneyRMB = money ? parseFloat((money * $scope.rate).toFixed(2)) : 0
					$scope.totalCounts = total
					pageFun()
				}
			})
		}

		/** 公用方法*/
		//打开新增/编辑 弹窗
		$scope.openAdd = (type, _item) => {
			let msgObj = {}, model = addModel

			switch ($scope.expenditureType) {
				case $scope.expenditureTypeModel.sellComposite.val:
					msgObj.add = '新增支出'
					msgObj.edit = "编辑支出"
					msgObj.expendType = '1'
					break
				case $scope.expenditureTypeModel.manageComposite.val:
					msgObj.add = '新增'
					msgObj.edit = "编辑"
					msgObj.expendType = '6'
					break
				case $scope.expenditureTypeModel.other.val:
					msgObj.add = '新增'
					msgObj.edit = "编辑"
					msgObj.expendType = '14'
			}
			$scope.windowType = Object.assign($scope.windowType, {
				type,
				txt: type === 'add' ? msgObj.add : msgObj.edit,
				item: type === 'add'
					? Object.assign(model, { expendType: msgObj.expendType })
					: JSON.parse(JSON.stringify(_item))
			})
			$scope.showFLag = true
		}

		//新增/编辑 确认
		$scope.sureAddAccount = () => {
			$scope.expenditureType === $scope.expenditureTypeModel.financialExpense.val
				? sureFinancialExpense()                 //财务支出 新增编辑
				: sureExpendAdd()
		}

		//销售费用综合，管理费用综合， 其他收入 新增/编辑 确认方法
		function sureExpendAdd() {
			const { item, type } = $scope.windowType
				, { expendDate, remark, money, rateType, expendType, id } = item
				, { flag, message } = utils.changeNumber({ num: money || 0, limit: 2, type: '金额' })
			let msg = ''

			if (!expendDate) {
				layer.msg('支出日期不能为空')
			} else if (!money) {
				layer.msg('金额不能为空')
			} else if (!flag) {
				layer.msg(message)
			} else {
				let url
					, sendData = {
						expendDate,
						remark,
						money: Number(money),
						rateType: Number(rateType),
						expendType: Number(expendType),
						objType: $scope.expenditureType === $scope.expenditureTypeModel.sellComposite.val ? 1 : $scope.expenditureType === $scope.expenditureTypeModel.manageComposite.val ? 2 : 3,
						expendTypeName: $scope.expendTypeModel[Number(expendType)].txt
					}

				if (type === 'add') {
					url = 'erp/expend/insertOverallExpend'
					msg = '新增成功'
				} else if (type === 'edit') {
					url = 'erp/expend/updateExpendOverall'
					sendData = Object.assign(sendData, { id })
					msg = '修改成功'
				}

				console.log(sendData)
				optAsyn({
					url, sendData, callback: res => {
						layer.msg(msg)
						$scope.showFLag = false
						getList()
					}
				})
			}
		}

		//删除弹窗
		$scope.sureReceipt = (item) => {
			$scope.showFLag2 = true
			$scope.sureExpend = item
		}
		//确认删除
		$scope.sureConfirm = () => {
			let url
				, sendData = {
					id: $scope.sureExpend.id
				}

			if (compositeArr.includes($scope.expenditureType)) {
				url = 'erp/expend/deleteDrawbackById'
			} else {
				url = 'erp/statistics/deleteIncomeExtendById'
			}
			optAsyn({
				url, sendData, callback: res => {
					$scope.showFLag2 = false
					getList()
				}
			})
		}

		/** 货币转化 */
		$scope.changeCurrency = (money, rateType, currentCurrency = $scope.currentCurrency, NotoFixed) => {
			let result

			rateType = Number(rateType)
			money = Number(money) || 0
			if (!currentCurrency) {
				if (rateType === currencyModel.USD.id) {
					result = `$${money}`
				} else {
					result = `￥${money}`
				}
			} else if (currentCurrency === currencyModel.USD.val) {
				if (rateType === currencyModel.USD.id) {
					result = `$${money}`
				} else {
					result = NotoFixed ? `$${money !== 0 ? (money / $scope.rate) : 0}` : `$${parseFloat(money !== 0 ? (money / $scope.rate).toFixed(2) : 0)}`
				}
			} else if (currentCurrency === currencyModel.RMB.val) {
				if (rateType === currencyModel.RMB.id) {
					result = `￥${money}`
				} else {
					result = NotoFixed ? `￥${money * $scope.rate}` : `￥${parseFloat((money * $scope.rate).toFixed(2))}`
				}
			}
			return result
		}

		//请求接口分装
		function optAsyn({ url, sendData, callback }) {
			erp.postFun(url, JSON.stringify(sendData), ({ data }) => {
				if (data.statusCode === '200') {
					callback(data)
				} else {
					console.log('操作失败')
				}
			}, error => {
				layer.msg('网络错误')
			}, { layer: true })
		}

		//清空
		function clearSearch() {
			$scope.pageNum = 1
			$scope.pageSize = '20'
			$scope.currentCurrency = $scope.expenditureType === $scope.expenditureTypeModel.cost.val
				|| $scope.expenditureType === $scope.expenditureTypeModel.statistics.val ? currencyModel.USD.val : ''
			$scope.startDate = ''
			$scope.endDate = ''
			$scope.searchExpend = ''
			$scope.salaryList = []
			$scope.compositeList = []
			$scope.disputeList = []
		}

		//查询
		$scope.searchFun = () => {
			let { can, message } = judgeSearchTime({ startDate: $scope.startDate, endDate: $scope.endDate })

			if (!can) {
				layer.msg(message)
			} else {
				$scope.pageNum = 1
				getList()
			}
		}

		//导出
		$scope.export = () => {
			let sendData = $scope.searchSendData
				, url = 'erp/excel/importExpendList'
				, params = []
				, link = document.createElement('a')
				, excelIp
				, environment = window.environment

			sendData = Object.assign(sendData, { excelType: $scope.exportFlag })
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
			// link.setAttribute("target","_blank")
			link.click()
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
	}])
})()