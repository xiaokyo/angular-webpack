(function () {

	/** 财务--其他收入 */
	app.controller('financingOtherIncomeCtrl', ['$scope', 'erp', '$routeParams', 'utils', function ($scope, erp, $routeParams, utils) {
		/** Model */
		let rate = 6    //先默认显示一个利率 表示 1USD = ？RMB
		//信息提示
		$scope.messageModel = {
			"noDrawbackTime": { txt: '请选择退税时间' },
			"noDrawbackBach": { txt: '请填写退税批次' },
			"noDrawbackMoney": { txt: '请填写退税金额' },
			"tomorrow": { txt: '查询日期不能超过今天' },
			"startDateBig": { txt: '开始日期不能大于结束日期' },
			"noAccountType": { txt: '请填写账户类型' },
			"noAccountBank": { txt: '请填写银行' },
			"noAccount": { txt: '请填写账号' },
			"noIncomeType": { txt: '请选择账户类型' },
			"noIncomeBank": { txt: '请选择银行' },
			"noIncomeAccount": { txt: '请选择账户' },
			'noIncomeMoney': { txt: '请填写金额' },
		}
		//其他收入类型模型
		$scope.otherIncomeTypeModel = {
			"drawback": { val: 1, txt: '退税' },
			"interest": { val: 2, txt: '利息' },
			"cardRebate": { val: 3, txt: '信用卡返点' },
			"camp": { val: 4, txt: '营外收入' }
		}
		//弹窗 操作类型
		$scope.operateModel = {
			"addDrawback": { val: 1, txt: '新增退税记录', tag: 'add' },
			"addInterest": { val: 2, txt: '新增利息', tag: 'add' },
			"addCardRebate": { val: 3, txt: '新增返点记录', tag: 'add' },
			"addCamp": { val: 4, txt: '新增营外收入', tag: 'add' },
			"confirmGathering": { val: 5, txt: '确认已收到退税金额？' },
			"confirmDeleteDrawback": { val: 6, txt: '确认删除吗？' },
			"editDrawBack": { val: 7, txt: '编辑退税记录', tag: 'edit' },
			"editInterest": { val: 8, txt: '编辑利息', tag: 'edit' },
			"editCardRebate": { val: 9, txt: '编辑信用卡返点', tag: 'edit' },
			"editCamp": { val: 10, txt: '编辑营外收入', tag: 'edit' },
			"addAccount": { val: 11, txt: '新增账户' },
			"addCard": { val: 12, txt: '新增账户' },
			"account": { val: 13, txt: '账户管理' },
			"credit": { val: 14, txt: '信用卡管理' }
		}
		//退税状态
		$scope.drawbackStatusModel = {
			"receivable": { val: 0, txt: '应收' },
			"received": { val: 1, txt: '已收' }
		}
		//账户管理 启用禁用
		$scope.accountStatusModel = {
			"forbidden": { val: 0, txt: '禁用' },
			"start": { val: 1, txt: '启用' }
		}
		//账户管理 账户类型
		$scope.accountTypeModel = {
			"interestCard": { val: 1, txt: '利息账户' },
			"cardRebateCard": { val: 2, txt: '信用卡返点银行卡' }
		}
		//币种 模型
		$scope.currencyModel = {
			"RMB": { val: '1', txt: '人民币', en: 'RMB', id: 1 },
			"USD": { val: '2', txt: '美元', en: "USD", id: 2 }
		}
		//营外收入 模型
		$scope.campTypeModel = {
			"feipin": { val: '1', txt: '废品', id: 1 },
			"other": { val: '2', txt: '其他', id: 2 }
		}
		/*****/

		/** 其他收入 变量 */
		$scope.otherIncomeType = $scope.otherIncomeTypeModel.drawback.val         //收入类型
		$scope.operateType = $scope.operateModel.addDrawback                      //操作类型

		/** 公用参数 */
		$scope.startDate = ''                                                     //搜索开始时间    
		$scope.endDate = ''                                                       //搜索结束时间
		$scope.showFLag1 = false                                                  //新增编辑 弹窗 显示隐藏
		$scope.showFLag2 = false                                                  //账户管理 弹窗 显示隐藏
		$scope.showFLag3 = false                                                  //确认弹窗
		$scope.pageNum = 1                                                        //分页 第几页
		$scope.pageSize = '20'                                                    //分页 每页几条
		$scope.totalCounts = 0                                                    //总条数
		$scope.canShowPage = false                                                //可以显示分页器
		$scope.currentItem                                                        //当前选择的 item
		$scope.currentIdx = -1                                                    //当前选择的 索引

		/** 账户管理 参数 */
		$scope.accountType = ''                                                   //账户类型 / 银行
		$scope.accountName = ''                                                   //账号

		/** 退税用的参数 */
		$scope.drawbackDate = ''                                                  //退税时间
		$scope.drawbackBach = null                                                //退税批次
		$scope.drawbackMoney = null                                               //退税金额（RMB）
		$scope.drawbackStatus = null                                              //退税状态 0.应收 1.已收',
		$scope.drawbackList = []                                                  //退税列表
		$scope.drawbackTotalMoney = 0                                             //退税总金额
		$scope.searchDrawbackStatus = ''                                          //退税状态 查询参数

		//利息 信用卡返点 参数
		$scope.incomeAccountType = ''                                             //利息/信用卡返点 新增编辑弹框 关联账号类型
		$scope.incomeCardId = ''                                                  //利息/信用卡返点 新增编辑弹框 关联账号id
		$scope.incomeMoney = null                                                 //利息/信用卡返点 新增编辑弹框 金额
		$scope.rateType = '1'                                                     //利息/信用卡返点 新增编辑弹框 币种 1:RMB(默认)  2:USD
		$scope.rateTypeShow = ''                                                  //币种展示用 
		$scope.interestList = []                                                  //利息/信用卡返点列表
		$scope.searchInterestType = ''                                            //利息/信用卡返点 账户类型查询状态

		//营外收入
		$scope.campType = $scope.campTypeModel.feipin.val                         //营外收入类型 1：废品  2：其他
		$scope.campMoney = null                                                   //营外收入金额
		$scope.campRemark = ''                                                    //营外收入 备注
		$scope.searchCampType = ''                                                //营外收入类型 查询

		/** 监听页面大小变化 以及 顶部tab元素变化*/
		let topTabEle = document.getElementById('top-tab')
			, observer = new MutationObserver(ev => {
				// 这里写监听代码
				let height

				setTimeout(() => {
					height = $scope.otherIncomeType === $scope.otherIncomeTypeModel.drawback.val ? 210 : topTabEle.offsetHeight
					document.getElementById('content-wrap').style.marginTop = `${height}px`
				}, 500);
			})

		observer.observe(topTabEle, { childList: true, subtree: true });
		window.onresize = function () {
			let height = $scope.otherIncomeType === $scope.otherIncomeTypeModel.drawback.val ? 210 : topTabEle.offsetHeight

			document.getElementById('content-wrap').style.marginTop = `${height}px`
		}

		/** 顶部 tab 切换 */
		$scope.changeIncomeType = function (type) {
			$scope.otherIncomeType = type
			clearSearch()
			getList()
		}

		/** 账户管理 tab 切换 */
		$scope.changeOperateType = function (json) {
			$scope.operateType = JSON.parse(JSON.stringify(json))
			clearAccountWin()
		}

		/** 先获取汇率 */
		getRate()
		function getRate() {
			let url = 'erp/statistics/getRate'

			optAsyn({
				url, sendData: {}, callback: ({ result }) => {
					const { rete_money } = result[0]

					rate = rete_money ? rete_money : 6.88
					getList()
				}
			})
		}

		/** 获取列表 */
		// getList()
		function getList() {  //根据tab 选择获取的列表方法
			switch ($scope.otherIncomeType) {
				case $scope.otherIncomeTypeModel.drawback.val:
					getDrawbackList()
					break
				case $scope.otherIncomeTypeModel.interest.val:
					getAccountList()
					getInterestList()
					break
				case $scope.otherIncomeTypeModel.cardRebate.val:
					getAccountList()
					getInterestList()
					break
				case $scope.otherIncomeTypeModel.camp.val:
					getCampList()
					break
				default:
					break
			}
		}

		/** 获取账户列表 */
		function getAccountList() {
			let url = 'erp/statistics/getDspCardList'
				, sendData = {
					cardType: $scope.otherIncomeType === $scope.otherIncomeTypeModel.interest.val ? $scope.accountTypeModel.interestCard.val : $scope.accountTypeModel.cardRebateCard.val
				}

			optAsyn({
				url, sendData, callback: res => {
					console.log(res)
					$scope.accountList = res.result.map(item => {
						item.isEdit = false
						item.editcardName = item.cardName
						item.editcardNumber = item.cardNumber
						return item
					})
					console.log($scope.accountList)
					disposeAccount()
				}
			})
		}

		/** 退税 模块 */
		// 获取退税列表
		function getDrawbackList() {
			let sendData = {
				pageNo: $scope.pageNum,
				pageSize: $scope.pageSize * 1,
				startTime: $scope.startDate ? $scope.startDate : '',
				endTime: $scope.endDate ? utils.changeTime(new Date($scope.endDate).getTime() + 24 * 60 * 60 * 1000, false) : '',
			}
				, url = 'erp/statistics/getDrawbackList'

			$scope.searchDrawbackStatus && (sendData = Object.assign(sendData, { drawbackStatus: $scope.searchDrawbackStatus * 1 }))
			$scope.searchSendData = sendData
			optAsyn({
				url, sendData, callback: data => {
					$scope.drawbackList = data.result.list.map(item => {
						item.drawbackDate = utils.changeTime(item.drawbackDate, false)
						return item
					})
					$scope.totalCounts = data.result.total
					$scope.drawbackTotalMoney = data.result.sumMoney || 0
					console.log($scope.drawbackList)
					$scope.canShowPage = $scope.drawbackList.length > 0 ? true : false
					pageFun()
				}
			})
		}

		//确认新增 编辑 退税
		function sureDrawback() {
			const { flag, message } = utils.changeNumber({ num: $scope.drawbackMoney || 0, limit: 2, type: '退税金额' })

			if (!$scope.drawbackDate) {
				layer.msg($scope.messageModel.noDrawbackTime.txt)
			} else if (!$scope.drawbackBach) {
				layer.msg($scope.messageModel.noDrawbackBach.txt)
			} else if (!$scope.drawbackMoney) {
				layer.msg($scope.messageModel.noDrawbackMoney.txt)
			} else if (!flag) {
				layer.msg(message)
			} else {
				let url
					, sendData = {
						drawbackDate: $scope.drawbackDate,
						drawbackBach: Number($scope.drawbackBach),
						drawbackMoney: Number($scope.drawbackMoney),
					}

				if ($scope.operateType.val === $scope.operateModel.addDrawback.val) {
					url = 'erp/statistics/insertDrawback'
					sendData.drawbackStatus = $scope.drawbackStatusModel.receivable.val
					optAsyn({
						url, sendData, callback: res => {
							layer.msg('新增成功')
							$scope.showFLag1 = false
							getList()
						}
					})
				} else if ($scope.operateType.val === $scope.operateModel.editDrawBack.val) {
					url = 'erp/statistics/updateDrawback'
					sendData.drawbackStatus = $scope.drawbackStatus
					sendData.id = $scope.currentItem.id
					optAsyn({
						url, sendData, callback: res => {
							// console.log(res)
							layer.msg('修改成功')
							$scope.showFLag1 = false
							getList()
						}
					})
				}

			}
		}

		//确认收款 点击确定后调用
		function confrmReceived() {
			let { drawbackDate, drawbackBach, drawbackMoney, id } = $scope.currentItem
				, url = 'erp/statistics/updateDrawback'
				, sendData = {
					drawbackDate,
					drawbackBach,
					drawbackMoney,
					id,
					drawbackStatus: $scope.drawbackStatusModel.received.val
				}

			optAsyn({
				url, sendData, callback: res => {
					layer.msg('收款成功')
					$scope.showFLag3 = false
					$scope.drawbackList = $scope.drawbackList.map((item, idx) => {
						idx === $scope.currentIdx && (item.drawbackStatus = $scope.drawbackStatusModel.received.val)
						return item
					})
				}
			})
		}

		/*** 利息模块 */
		//获取利息列表
		function getInterestList() {
			let url = 'erp/statistics/getIncomeExtendByPage'
				, sendData = {
					pageNo: $scope.pageNum,
					pageSize: $scope.pageSize * 1,
					startTime: $scope.startDate ? $scope.startDate : '',
					endTime: $scope.endDate ? utils.changeTime(new Date($scope.endDate).getTime() + 24 * 60 * 60 * 1000, false) : '',
					objType: $scope.otherIncomeType - 1,
					rateType: 1,
					rateMoney: rate
				}

			$scope.searchInterestType && (sendData = Object.assign(sendData, { cardName: $scope.searchInterestType }))
			$scope.searchSendData = sendData
			optAsyn({
				url, sendData, callback: ({ result }) => {
					// console.log(result)
					$scope.interestList = result.list.map(item => {
						item.createTime = utils.changeTime(item.createTime, false)
						if (item.rateType === $scope.currencyModel.RMB.id) { //原始数据为RMB
							item.RMB = item.money
							item.USD = parseFloat((item.money / rate).toFixed(2))
						} else if (item.rateType === $scope.currencyModel.USD.id) {
							item.USD = item.money
							item.RMB = parseFloat((item.money * rate).toFixed(2))
						}
						return item
					})
					console.log($scope.interestList)
					$scope.showRMB = result.money ? parseFloat(result.money.toFixed(2)) : 0
					$scope.showUSD = result.money ? parseFloat((result.money / rate).toFixed(2)) : 0
					$scope.otherIncomeType === $scope.otherIncomeTypeModel.interest.val ? $scope.showCurrency = 'RMB' : $scope.showCurrency = 'USD'
					$scope.totalCounts = result.total
					// $scope.interestList.length > 0 && ($scope.canShowPage = true)
					$scope.canShowPage = $scope.interestList.length > 0 ? true : false
					pageFun()
				}
			})
		}

		//确认新增编辑 利息 / 信用卡返点
		function sureInterest() {
			const { flag, message } = utils.changeNumber({ num: $scope.incomeMoney || 0, limit: 2, type: '金额' })

			if (!$scope.incomeAccountType) {
				layer.msg($scope.messageModel.noIncomeType.txt)
			} else if (!$scope.incomeCardId) {
				layer.msg($scope.messageModel.noIncomeAccount.txt)
			} else if (!$scope.incomeMoney) {
				layer.msg($scope.messageModel.noIncomeMoney.txt)
			} else if (!flag) {
				layer.msg(message)
			}else {
				let url
					, sendData = {
						cardId: $scope.incomeCardId.split('#')[0],
						cardName: $scope.incomeAccountType,
						cardNumber: $scope.incomeCardId.split("#")[1],
						money: Number($scope.incomeMoney),
						rateType: $scope.rateType,
						objType: $scope.otherIncomeType - 1
					}

				if ($scope.operateType.val === $scope.operateModel.addInterest.val || $scope.operateType.val === $scope.operateModel.addCardRebate.val) {
					url = 'erp/statistics/insertIncomeExtend'
					optAsyn({
						url, sendData, callback: ({ data }) => {
							// console.log(data)
							layer.msg('新增成功')
							$scope.showFLag1 = false
							getList()
						}
					})
				} else if ($scope.operateType.val === $scope.operateModel.editInterest.val || $scope.operateType.val === $scope.operateModel.editCardRebate.val) {
					url = 'erp/statistics/updateIncomeExtendById'
					sendData.id = $scope.currentItem.id
					optAsyn({
						url, sendData, callback: res => {
							layer.msg('操作成功')
							$scope.showFLag1 = false
							getList()
						}
					})
				}
			}
		}

		/*** 营外收入 */
		//获取营外收入列表
		function getCampList() {
			let url = 'erp/statistics/getOutsideByPage'
				, sendData = {
					pageNo: $scope.pageNum,
					pageSize: $scope.pageSize * 1,
					startTime: $scope.startDate ? $scope.startDate : '',
					endTime: $scope.endDate ? utils.changeTime(new Date($scope.endDate).getTime() + 24 * 60 * 60 * 1000, false) : '',
				}

			$scope.searchCampType && (sendData = Object.assign(sendData, { outsideType: $scope.searchCampType * 1 }))
			$scope.searchSendData = sendData
			optAsyn({
				url, sendData, callback: ({ result }) => {
					$scope.campList = result.list.map(item => {
						item.createTime = utils.changeTime(item.createTime, false)
						return item
					})
					$scope.totalCounts = result.total
					$scope.campTotalMoney = result.sumMoney
					// $scope.campList.length > 0 && ($scope.canShowPage = true)
					$scope.canShowPage = $scope.campList.length > 0 ? true : false
					pageFun()
				}
			})
		}

		//确认新增编辑 营外收入
		function sureCamp() {
			const { flag, message } = utils.changeNumber({ num: $scope.campMoney || 0, limit: 2, type: '退税金额' })

			if (!$scope.campMoney) {
				layer.msg($scope.messageModel.noIncomeMoney.txt)
			} else if(!flag) {
				layer.msg(message)
			} else {
				let url
					, sendData = {
						outsideType: $scope.campType * 1,
						outsideMoney: Number($scope.campMoney),
						remark: $scope.campRemark
					}

				if ($scope.operateType.val === $scope.operateModel.addCamp.val) {
					url = 'erp/statistics/insertOutside'
					optAsyn({
						url, sendData, callback: res => {
							layer.msg('新增成功')
							$scope.showFLag1 = false
							getList()
						}
					})
				} else if ($scope.operateType.val === $scope.operateModel.editCamp.val) {
					url = 'erp/statistics/updateOutsideById'
					optAsyn({
						url, sendData: Object.assign(sendData, { id: $scope.currentItem.id }), callback: res => {
							layer.msg('操作成功')
							$scope.showFLag1 = false
							getList()
						}
					})
				}
			}
		}

		/** 公用方法 */
		//查询
		$scope.searchFun = () => {
			//判断日期是否符合
			let result = judgeSearchTime({ startDate: $scope.startDate, endDate: $scope.endDate })

			if (!result.can) {
				layer.msg(result.message)
			} else {
				$scope.pageNum = 1
				getList()
			}
			// getList()
		}
		//打开新增编辑弹窗 根据operateType 进行分类操作
		$scope.openAdd = function ({ item, idx }) {
			console.log(item, $scope.otherIncomeType)
			clearAddWin()
			if ($scope.otherIncomeType === $scope.otherIncomeTypeModel.drawback.val) {
				//退税弹窗
				$scope.operateType = !item ? $scope.operateModel.addDrawback : $scope.operateModel.editDrawBack
				if (item) {
					$scope.currentItem = item
					$scope.currentIdx = idx
					$scope.drawbackDate = item.drawbackDate
					$scope.drawbackBach = item.drawbackBach
					$scope.drawbackMoney = item.drawbackMoney
					$scope.drawbackStatus = item.drawbackStatus
				}
			} else if ($scope.otherIncomeType === $scope.otherIncomeTypeModel.interest.val || $scope.otherIncomeType === $scope.otherIncomeTypeModel.cardRebate.val) {
				// 利息/信用卡返点 弹窗
				$scope.operateType = !item
					? $scope.otherIncomeType === $scope.otherIncomeTypeModel.interest.val
						? $scope.operateModel.addInterest
						: $scope.operateModel.addCardRebate
					: $scope.otherIncomeType === $scope.otherIncomeTypeModel.interest.val
						? $scope.operateModel.editInterest
						: $scope.operateModel.editCardRebate
				if (item) {
					$scope.currentItem = item
					$scope.currentIdx = idx
					if (!$scope.cardTypeList.includes(item.cardName)) {
						$scope.incomeAccountType = ''
						$scope.incomeCardId = ''
					} else {
						let hasFlag = false

						$scope.incomeAccountType = item.cardName
						$scope.startAccountList.forEach(json => {
							json.id === item.cardId && (hasFlag = true)
						})
						console.log($scope.startAccountList)
						console.log(hasFlag)
						if (!hasFlag) {
							$scope.incomeCardId = ''
						} else {
							$scope.incomeCardId = `${item.cardId}#${item.cardNumber}`
						}
					}
					$scope.incomeMoney = item.money
					$scope.rateType = item.rateType + ''
				}
			} else if ($scope.otherIncomeType === $scope.otherIncomeTypeModel.camp.val) {
				// 营外收入 弹窗
				$scope.operateType = !item ? $scope.operateModel.addCamp : $scope.operateModel.editCamp
				if (item) {
					console.log(item)
					$scope.currentItem = item
					$scope.currentIdx = idx
					$scope.campMoney = item.outsideMoney
					$scope.campRemark = item.remark
					$scope.campType = item.outsideType + ''
				}
			}
			$scope.showFLag1 = true
		}
		//确认新增/编辑
		$scope.sureAdd = function () {
			switch ($scope.otherIncomeType) {
				case $scope.otherIncomeTypeModel.drawback.val:
					sureDrawback()
					break
				case $scope.otherIncomeTypeModel.interest.val:
					sureInterest()
					break
				case $scope.otherIncomeTypeModel.cardRebate.val:
					sureInterest()
					break
				case $scope.otherIncomeTypeModel.camp.val:
					sureCamp()
					break
				default:
					break
			}
		}
		//利息 信用卡返点  账户类型 =》 账号 二级联动
		$scope.changeIncomeAccountType = function () {
			// console.log($scope.incomeAccountType)
			$scope.incomeCardId = ''
		}
		//账户管理 -- 打开
		$scope.openAccount = function () {
			clearAccountWin()
			$scope.otherIncomeType === $scope.otherIncomeTypeModel.interest.val
				? $scope.operateType = $scope.operateModel.account
				: $scope.operateType = $scope.operateModel.credit

			$scope.showFLag2 = true
		}
		//账户管理 -- 新增
		$scope.sureAddAccount = function () {
			console.log($scope.accountType, $scope.accountName)
			if (!$scope.accountType) {
				layer.msg($scope.otherIncomeType === $scope.otherIncomeTypeModel.interest.val ? $scope.messageModel.noAccountType.txt : $scope.messageModel.noAccountBank.txt)
			} else if (!$scope.accountName) {
				layer.msg($scope.messageModel.noAccount.txt)
			} else {
				let url = 'erp/statistics/insertCard'
					, sendData = {
						cardName: $scope.accountType,
						cardNumber: $scope.accountName,
						cardType: $scope.otherIncomeType === $scope.otherIncomeTypeModel.interest.val ? $scope.accountTypeModel.interestCard.val : $scope.accountTypeModel.cardRebateCard.val,
						cardStatus: $scope.accountStatusModel.start.val
					}

				console.log(sendData)
				optAsyn({
					url, sendData, callback: res => {
						layer.msg('新增成功')
						$scope.otherIncomeType === $scope.otherIncomeTypeModel.interest.val
							? $scope.operateType = $scope.operateModel.account
							: $scope.operateType = $scope.operateModel.credit

						getAccountList()
					}
				})
			}
		}
		//账户管理 -- 编辑确认
		$scope.sureEditAccount = function (item, idx) {
			// console.log(item)
			let url = 'erp/statistics/updateCardById'
				, { id, editcardName, editcardNumber, cardType, cardStatus } = item
				, sendData = {
					id,
					cardName: editcardName,
					cardNumber: editcardNumber,
					cardType, cardStatus
				}

			optAsyn({
				url, sendData, callback: res => {
					item.cardName = item.editcardName
					item.cardNumber = item.editcardNumber
					item.isEdit = false
					disposeAccount()
				}
			})
		}
		//账户管理 -- 禁用
		$scope.forbiddenFun = function (item, idx, val) {
			let url = 'erp/statistics/updateCardById'
				, { id, cardName, cardNumber, cardType } = item
				, sendData = {
					id, cardName, cardNumber, cardType,
					cardStatus: val
				}

			optAsyn({
				url, sendData, callback: res => {
					item.cardStatus = val
					disposeAccount()
				}
			})
		}
		// 账户管理 处理账户列表
		function disposeAccount() {
			let startList = $scope.accountList.filter(item => item.cardStatus === $scope.accountStatusModel.start.val)  //启用的列表
				, cardTypeList = []
				, searchTypeList = []

			startList.forEach((item, idx) => {
				if (!cardTypeList.includes(item.cardName)) {
					cardTypeList = [...cardTypeList, item.cardName]
				}
			})
			$scope.accountList.forEach(item => {
				if (!searchTypeList.includes(item.cardName)) {
					searchTypeList = [...searchTypeList, item.cardName]
				}
			})

			$scope.startAccountList = startList     //启用账号列表
			$scope.cardTypeList = cardTypeList      //启用账号 账号类型列表
			$scope.searchTypeList = searchTypeList  //搜索用的 账户类型列表
		}
		//调用 操作方法后回调
		function optAsyn({ url, sendData, callback }) {
			console.log(url, sendData)
			erp.postFun(url, JSON.stringify(sendData), ({ data }) => {
				if (data.statusCode === '200') {
					callback(data)
				}
			}, error => { }, { layer: true })
		}
		//确认删除 还是 收款  弹窗打开
		$scope.sureReceipt = function (item, idx, type) {
			$scope.currentItem = item
			$scope.currentIdx = idx
			type === 'delete'
				? $scope.operateType = $scope.operateModel.confirmDeleteDrawback
				: $scope.operateType = $scope.operateModel.confirmGathering
			$scope.showFLag3 = true
		}
		//confirm确认后
		$scope.sureConfirm = function () {
			// console.log($scope.operateType)
			switch ($scope.operateType.val) {
				case $scope.operateModel.confirmGathering.val:
					//确认已收款
					confrmReceived()
					break
				case $scope.operateModel.confirmDeleteDrawback.val:
					//确认删除退税记录
					confirmDeleteDrawback()
					break
				default:
					break
			}
		}
		//确认删除 点击确定后调用  退税 利息 信用卡返点 营外收入 都可以用
		function confirmDeleteDrawback() {
			let url
				, sendData = {
					id: $scope.currentItem.id
				}

			switch ($scope.otherIncomeType) {
				case $scope.otherIncomeTypeModel.drawback.val:
					url = 'erp/statistics/deleteDrawbackById'
					break
				case $scope.otherIncomeTypeModel.interest.val:
					url = 'erp/statistics/deleteIncomeExtendById'
					break
				case $scope.otherIncomeTypeModel.cardRebate.val:
					url = 'erp/statistics/deleteIncomeExtendById'
					break
				case $scope.otherIncomeTypeModel.camp.val:
					url = 'erp/statistics/deleteOutsideById'
				default:
					break
			}
			optAsyn({
				url, sendData, callback: res => {
					layer.msg('删除成功')
					$scope.showFLag3 = false
					getList()
				}
			})
		}
		//导出excel
		$scope.export = () => {
			let sendData = $scope.searchSendData
				, url = 'erp/excel/importIncomeList'
				, params = []
				, link = document.createElement('a')
				, excelIp
				, environment = window.environment

			// console.log(sendData)
			switch ($scope.otherIncomeType) {
				case $scope.otherIncomeTypeModel.drawback.val:
					sendData = Object.assign(sendData, { excelType: 'I11' })
					break
				case $scope.otherIncomeTypeModel.interest.val:
					sendData = Object.assign(sendData, { excelType: 'I12' })
					break
				case $scope.otherIncomeTypeModel.cardRebate.val:
					sendData = Object.assign(sendData, { excelType: 'I13' })
					break
				case $scope.otherIncomeTypeModel.camp.val:
					sendData = Object.assign(sendData, { excelType: 'I14' })
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
			// link.setAttribute("target","_blank")
			link.click()
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
				result.message = $scope.messageModel.tomorrow.txt
			} else if (startDate && endDate && new Date(startDate).getTime() > new Date(endDate).getTime()) {
				result.can = false
				result.message = $scope.messageModel.startDateBig.txt
			} else {
				result.can = true
			}
			return result
		}
		//清空搜索条件
		function clearSearch() {
			$scope.startDate = ''
			$scope.endDate = ''
			$scope.searchDrawbackStatus = ''
			$scope.pageNum = 1
			$scope.pageSize = '20'
			$scope.drawbackList = []
			$scope.interestList = []
			$scope.campList = []
			$scope.canShowPage = false
			$scope.searchInterestType = ''
			$scope.searchCampType = ''
		}
		//清空 新增/编辑 弹窗参数
		function clearAddWin() {
			//退税
			$scope.drawbackDate = ''
			$scope.drawbackBach = null
			$scope.drawbackMoney = null
			//利息 / 信用卡返点
			$scope.incomeAccountType = ''                                             //利息/信用卡返点 关联账号类型
			$scope.incomeCardId = ''                                                  //利息/信用卡返点 关联账号id
			$scope.incomeMoney = null                                                 //利息/信用卡返点 金额
			$scope.rateType = $scope.otherIncomeType === $scope.otherIncomeTypeModel.interest.val ? $scope.currencyModel.RMB.val : $scope.currencyModel.USD.val                                              //利息/信用卡返点 币种
			//营外收入
			$scope.campType = $scope.campTypeModel.feipin.val                         //营外收入类型 1：废品  2：其他
			$scope.campMoney = null                                                   //营外收入金额
			$scope.campRemark = ''                                                    //营外收入 备注
		}
		//清空账户管理 弹窗参数
		function clearAccountWin() {
			//新增
			$scope.accountType = ''
			$scope.accountName = ''
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
})()