(function () {
	var app = angular.module('erp-service')
	app.controller('cuteChatListCtrl', ['$scope', 'erp', 'utils', function ($scope, erp, utils) {
		console.log('cuteChatListCtrl')
		/** model */
		const custmoerTypeModel = [
			{ key: 1, name: '注册客户' },
			{ key: 2, name: '分销客户' },
			{ key: 3, name: '临时客户' },
		]


		/** 参数 */
		$scope.canShowPage = false      //是否展示分页器
		$scope.pageNum = '1'            //分页参数 - 当前页
		$scope.pageSize = '20'          //分页参数 - 每页展示多少条
		$scope.customerList = []        //客户列表
		$scope.totalCounts = 0          //总条数
		$scope.startTime = ''           //搜索 - 开始时间
		$scope.endTime = ''             //搜索 - 结束时间
		$scope.isChange = ''            //搜索 - 查询无果
		$scope.isUnmatch = ''           //搜索 - 转人工
		$scope.searchName = ''          //搜索 - input
		$scope.showFlag = false         //聊天记录详情弹窗
		$scope.chatPageNum = '1'        //聊天记录 - 分页参数 - 当前页
		$scope.chatPageSize = '20'      //聊天记录 - 分页参数 - 每页展示多少条
		$scope.currentName = ''         //聊天记录 - 当前客户
		$scope.chatList = []            //聊天记录 - 列表
		$scope.canShowPage2 = false     //聊天记录 - 分页是否展示
		$scope.chatTotalCounts = 0      //聊天记录 -  聊天记录总条数

		/** 功能 */
		init()
		function init() {
			const now = new Date().getTime()
			const thirthDay = now - 30 * 24 * 60 * 60 * 1000
			$scope.startTime = utils.changeTime(thirthDay, false)
			$scope.endTime = utils.changeTime(now, false)
			getList()
		}
		//获取聊天记录客户列表
		function getList() {
			const params = {
				pageNum: Number($scope.pageNum),
				pageSize: Number($scope.pageSize),
				startTime: $scope.startTime ? `${$scope.startTime} 00:00:00` : '',
				endTime: $scope.endTime ? `${$scope.endTime} 23:59:59` : '',
				isChange: $scope.isChange ? Number($scope.isChange) : '',
				isUnmatch: $scope.isUnmatch ? Number($scope.isUnmatch) : '',
				name: $scope.searchName
			}
			ajaxFn({
				url: 'robot/statisticsLsUserMsg', params, callback: ({ data }) => {
					const { resultCode, data: result } = data
					if (resultCode === 200) {
						// console.log(result)
						const { list, count } = result
						$scope.customerList = list.map(item => {
							const { startChatTime, customerType } = item
							item.startChatTime = startChatTime ? utils.changeTime(startChatTime, true) : '-'
							item.customerType = custmoerTypeModel[Number(customerType) - 1].name
							item.changeMsg = decodeURIComponent(item.changeMsg || '-')
							return item
						})
						$scope.totalCounts = count
						$scope.canShowPage = count > 0
						pageFun({
							ele: 'pagegroup',
							pageNum: $scope.pageNum,
							pageSize: $scope.pageSize,
							totalCounts: $scope.totalCounts,
							callback: n => {
								$scope.pageNum = n;
								getList();
							}
						})
					}
				}
			})
		}
		//查询
		$scope.search = () => {
			const res = disposeParams()
			if (res) {
				$scope.pageNum = '1'
				getList()
			}
		}
		//导出
		$scope.exportFn = () => {
			const res = disposeParams()
			if (res) {
				const params = {
					startTime: $scope.startTime ? `${$scope.startTime} 00:00:00` : '',
					endTime: $scope.endTime ? `${$scope.endTime} 23:59:59` : '',
					isChange: $scope.isChange ? Number($scope.isChange) : '',
					isUnmatch: $scope.isUnmatch ? Number($scope.isUnmatch) : '',
					name: $scope.searchName
				}
				const environment = window.environment
				let excelIp = ''
					, list = []
				if (/development/.test(environment)) {
					excelIp = 'http://192.168.5.55:8080/ROOT/'
				} else if (/test/.test(environment)) {
					excelIp = 'http://chat.test.com/ROOT/'
				} else if (/production##$/.test(environment)) {
					excelIp = 'https://chat.cjdropshipping.com/'
				} else if (/production-cn##$/.test(environment)) {
					excelIp = 'https://chat.cjdropshipping.cn/'
				}
				for (let k in params) {
					list.push(`${k}=${params[k]}`)
				}
				console.log(list)
				const url = `${excelIp}message/erp/exportLsMessageList?${list.join('&')}`
				const a = document.createElement('a')
				a.href = url

				a.click()
			}
		}

		//处理搜索/导出结果 
		function disposeParams() {
			let result = false
			if (!$scope.startTime && $scope.endTime) {
				layer.msg('请选择开始时间')
			} else {
				if ($scope.startTime && !$scope.endTime) {
					$scope.endTime = utils.changeTime(new Date().getTime())
				}
				const { can, message } = utils.judgeSearchTime($scope.startTime, $scope.endTime)
				if (!can) {
					layer.msg(message)
				} else {
					result = true
				}
			}
			return result
		}

		//查看聊天记录
		$scope.look = ({ userName }) => {
			$scope.currentName = userName
			$scope.showFlag = true
			getChatList()
		}
		//获取聊天记录列表
		function getChatList() {
			const params = {
				fromProductId: $scope.currentName,
				tempUserName: $scope.currentName,
				pageNum: Number($scope.chatPageNum),
				pageSize: Number($scope.chatPageSize),
				type: 'All'
			}
			ajaxFn({
				url: 'message/getBaseMessageByPage', params, callback: ({ data }) => {
					const { resultCode, data: { list, count } } = data
					if (resultCode === 200) {
						$scope.chatList = list.reverse().map(item => {
							item.createDate = utils.changeTime(item.createDate)
							item.msgContent = decodeURIComponent(item.msgContent)
							try{
								const msgItem = JSON.parse(item.msgContent)
								if (msgItem instanceof Array) {
									item.msgList = msgItem
								}
							}catch(err) {
							}
							return item
						})
						console.log($scope.chatList)
						$scope.canShowPage2 = count > 0
						$scope.chatTotalCounts = count
						pageFun({
							ele: 'chatPagegroup',
							pageNum: $scope.chatPageNum,
							pageSize: $scope.chatPageSize,
							totalCounts: $scope.chatTotalCounts,
							callback: n => {
								$scope.chatPageNum = n;
								getChatList();
							}
						})
					}
				}
			})
		}

		//更换每页多少条数据
		$scope.pagechange = function (pagesize) {
			$scope.pageNum = '1';
			getList();
		}
		//手动输入页码GO跳转
		$scope.pagenumchange = function () {
			var pagenum = Number($scope.pageNum)
			var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
			if (pagenum > totalpage) {
				layer.msg('错误页码')
				$scope.pageNum = '1';
			} else {
				getList();
			}
		}
		$scope.chatPagenumchange = () => {
			var pagenum = Number($scope.chatPageNum)
			var totalpage = Math.ceil($scope.chatTotalCounts / $scope.chatPageSize);
			if (pagenum > totalpage) {
				layer.msg('错误页码')
				$scope.chatPageNum = '1';
			} else {
				getChatList();
			}
		}

		//ajax分装
		function ajaxFn({ url, params, callback }) {
			erp.postFun(url, JSON.stringify(params), res => callback(res), _ => layer.msg('网络错误'), { layer: true })
		}

	}])

	function pageFun({ ele, pageNum, pageSize, totalCounts, callback }) {
		$(`.${ele}`).jqPaginator({
			totalCounts: totalCounts || 1,
			pageSize: pageSize * 1,
			visiblePages: 5,
			currentPage: pageNum * 1,
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
				callback(n)
			}
		});
	}
})()