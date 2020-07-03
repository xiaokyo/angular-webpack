(function () {
	var app = angular.module('app-video', ['service', 'utils'])
	//视频商品类型
	const appVideoTypeModel = {
		"platform": { val: 1, txt: '平台视频', type: 'platform' },
		"user": { val: 2, txt: '用户上传', type: 'user' },
		"audit": { val: 3, txt: '视频待审核', type: 'audit' },
		"passed": { val: 4, txt: '视频已通过', type: 'passed' },
		"rejected": { val: 5, txt: '视频已驳回', type: 'rejected' },
		"delete": { val: 6, txt: '视频已删除', type: 'delete' }
	}
	//搜索input 搜索类型
	const searchInputTypeModel = {
		"productName": { txt: "请输入商品名称", type: 'productName' },
		"uploading": { txt: "请输入上传人", type: 'uploading' },
		"SKU": { txt: '请输入SKU', type: 'SKU' }
	}
	app.directive('videoFinish', function ($timeout) {
		return {
			link: function (scope, element, attr) {
				console.log(scope.$index)
				if (scope.$last == true) {
					console.log('ng-repeat执行完毕')
					$timeout(() => {
						scope.$emit('to-app-video')
					})
				}
			}
		}
	})
	//app视频统计
	app.controller('appVideoListCtrl', ['$scope', '$routeParams', 'erp', 'utils', function ($scope, $routeParams, erp, utils) {
		console.log('appVideoListCtrl', cjUtils)

		$scope.appVideoType = appVideoTypeModel.user.type

		$scope.pageNum = 1
		$scope.pageSize = '20'
		$scope.startDate = ''                                                             //查询开始时间
		$scope.endDate = ''                                                               //查询结束时间
		$scope.canShowPage = false                                                        //分页器 
		$scope.searchStatus = ''                                                          //状态查询条件
		$scope.inputType = searchInputTypeModel.productName.type                          //input 搜索 0: 商品名称， 1：上传人
		$scope.inputPlaceholder = searchInputTypeModel.productName.txt                    //搜索input的 Placeholder
		$scope.searchInfo = ''                                                            //搜索 input 内容

		monitor()

		//获取；列表
		getList()
		function getList() {
			let url = $scope.appVideoType === 'platform' ? 'erp/dspVideo/selectPingTaiMaiDianList' : 'erp/dspVideo/selectUserUploadMaiDianStatisticsList'
				, sendData = {
					pageNo: Number($scope.pageNum),
					pageSize: Number($scope.pageSize)
				}

			if ($scope.searchStatus) sendData = Object.assign(sendData, { status: $scope.searchStatus })

			if ($scope.startDate) sendData = Object.assign(sendData, { begainDate: $scope.startDate })
			if ($scope.endDate) sendData = Object.assign(sendData, { endDate: $scope.endDate })

			if ($scope.searchInfo) {
				sendData = $scope.inputType === searchInputTypeModel.productName.type
					? Object.assign(sendData, { productName: $scope.searchInfo })
					: $scope.inputType === searchInputTypeModel.SKU.type
						? Object.assign(sendData, { sku: $scope.searchInfo })
						: Object.assign(sendData, { accName: $scope.searchInfo })
			}

			ajaxPostFn({
				url, sendData, callback: ({ result }) => {
					const { list, totalCount } = result

					$scope.videoList = list.map(video => {
						if ($scope.appVideoType === 'user') video.createDate = utils.changeTime(video.createDate.time)
						return video
					})
					$scope.totalCounts = totalCount
					$scope.canShowPage = list.length > 0
					pageFun($scope, () => getList())

				}
			}, erp)
		}
		//列表循环生成后
		$scope.$on('to-app-video', () => {
			getVideo($scope)
		})


		//查询
		$scope.search = () => {
			$scope.pageNum = 1
			getList()
		}
		//切换input搜索条件
		$scope.changeSelectSearch = () => {
			$scope.inputPlaceholder = searchInputTypeModel[$scope.inputType].txt
		}

		/**公用方法 */
		//切换tab
		$scope.changeIncomeType = (type) => {
			changeIncomeType($scope, type)
			clearParams()
			getList()
		}
		//清空搜索条件
		function clearParams() {
			$scope.pageNum = 1
			$scope.startDate = ''
			$scope.endDate = ''
			$scope.searchStatus = ''
			$scope.inputType = searchInputTypeModel.productName.type
			$scope.inputPlaceholder = searchInputTypeModel.productName.txt
			$scope.searchInfo = ''
			$scope.videoList = []
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

	//app视频审核
	app.controller('appVideoAuditCtrl', ['$scope', '$routeParams', 'erp', 'utils', function ($scope, $routeParams, erp, utils) {
		console.log('appVideoAuditCtrl')
		/** 初始参数 */
		$scope.appVideoType = appVideoTypeModel.audit.type                                //tab展示的类型 （待审核，已通过， 已驳回， 已删除）
		$scope.showFlag = false                                                           //通过弹窗 显示隐藏
		$scope.showFlag2 = false                                                          //驳回弹窗 显示隐藏
		$scope.pageNum = 1
		$scope.pageSize = '20'
		$scope.sourceSupply = ''                                                          //搜索用货源地
		$scope.caoZuoRenId = ''                                                           //处理人id
		$scope.startDate = ''                                                             //查询开始时间
		$scope.endDate = ''                                                               //查询结束时间
		$scope.canShowPage = false                                                        //分页器 
		$scope.currentVideo                                                               //当前操作项
		$scope.causeFailure = ''                                                          //驳回原因
		$scope.inputType = searchInputTypeModel.productName.type                          //input 搜索 0: 商品名称， 1：上传人
		$scope.inputPlaceholder = searchInputTypeModel.productName.txt                    //搜索input的 Placeholder
		$scope.searchInfo = ''                                                            //搜索 input 内容

		let paramsStatus = ''

		monitor()
		getParams()

		//列表循环生成后
		$scope.$on('to-app-video', () => {
			getVideo($scope)
		})

		//获取列表
		function getList() {
			let url = 'erp/dspVideo/selectUserUploadVideoList'
				, sendData = {
					pageNo: Number($scope.pageNum),
					pageSize: Number($scope.pageSize),
					sourceSupply: $scope.sourceSupply,
					begainDate: $scope.startDate,
					endDate: $scope.endDate,
					status: paramsStatus,
					type: '1'
				}

			if ($scope.appVideoType !== 'audit') sendData = Object.assign(sendData, { caoZuoRenId: $scope.caoZuoRenId })

			if ($scope.searchInfo) {
				$scope.inputType === searchInputTypeModel.productName.type
					? sendData = Object.assign(sendData, { productName: $scope.searchInfo })
					: sendData = Object.assign(sendData, { createUserName: $scope.searchInfo })
			}

			ajaxPostFn({
				url, sendData, callback: ({ result }) => {
					const { list, totalCount } = result

					$scope.videoList = list.map(video => {
						video.createDate = utils.changeTime(video.createDate.time, true)
						if (video.caoZuoDate) video.caoZuoDate = utils.changeTime(video.caoZuoDate.time, true)
						return video
					})
					$scope.canShowPage = list.length > 0
					$scope.totalCounts = totalCount
					pageFun($scope, () => getList())

				}
			}, erp)

		}
		//获取货源地
		function getHyd() {
			let url = 'erp/dspVideo/selectUserUploadMaiDianHuoYuanDiList'

			ajaxPostFn({
				url, sendData: { status: paramsStatus }, callback: ({ result }) => {
					$scope.hydList = result
				}
			}, erp)
		}
		//获取处理人
		function getClr() {
			let url = 'erp/dspVideo/selectUserUploadChuLiRenList'

			ajaxPostFn({
				url, sendData: { status: paramsStatus }, callback: ({ result }) => {
					$scope.clrList = result
				}
			}, erp)
		}

		//根据appVideoType 取得 接口需要的参数
		function getParams() {
			switch ($scope.appVideoType) {
				case 'audit':
					paramsStatus = '2'
					break
				case 'passed':
					paramsStatus = '1'
					break
				case 'rejected':
					paramsStatus = '3'
					break
				case 'delete':
					paramsStatus = '0'
					break
				default:
					break
			}

			getList()
			getHyd()
			getClr()
		}

		//审核通过
		$scope.audit = (item) => {
			$scope.showFlag = true
			$scope.currentVideo = item
		}
		//驳回
		$scope.rejected = (item) => {
			$scope.showFlag2 = true
			$scope.currentVideo = item
		}
		//审核通过 / 驳回 确定
		$scope.sureAduit = (type) => {
			let url = 'erp/dspVideo/updateUserUploadVideo'
				, { id, status } = $scope.currentVideo
				, sendData = {
					id,
					status: type === 'audit' ? '1' : '3',
					oStatus: status
				}

			if (type === 'rejected' && !$scope.causeFailure) {
				layer.msg('驳回原因不能为空')
				return
			}

			if (type === 'rejected') sendData = Object.assign(sendData, { causeFailure: $scope.causeFailure })
			console.log(sendData)
			ajaxPostFn({
				url, sendData, callback: res => {
					console.log(res)
					layer.msg('操作成功')
					type === 'audit'
						? $scope.showFlag = false
						: $scope.showFlag2 = false
					getList()
				}
			}, erp)
		}

		//搜索
		$scope.search = () => {
			$scope.pageNum = 1
			getList()
		}

		//切换input搜索条件
		$scope.changeSelectSearch = () => {
			$scope.inputPlaceholder = searchInputTypeModel[$scope.inputType].txt
		}

		/**公用方法 */
		//切换tab
		$scope.changeIncomeType = (type) => {
			changeIncomeType($scope, type)
			clearParams()
			getParams()
		}
		//清空搜索条件
		function clearParams() {
			$scope.pageNum = 1
			$scope.sourceSupply = ''
			$scope.caoZuoRenId = ''
			$scope.startDate = ''
			$scope.endDate = ''
			$scope.inputType = searchInputTypeModel.productName.type
			$scope.inputPlaceholder = searchInputTypeModel.productName.txt
			$scope.searchInfo = ''
		  $scope.videoList = []
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


	//循环列表播放视频
	function getVideo($scope) {
		console.log($scope.videoList)
		$scope.videoList.forEach((video, idx) => {
			// const { videoUrl } = video
			let videoPlayer
			  , videoUrl = video.videoUrl ? video.videoUrl : video.videoId ? video.videoId : ''
				, videoObj = {
					eleId: `J_prismPlayer${idx + 1}`,
					configuration: {
						width: '100%',      //视频宽度
						height: '100%',     //视频高度
						autoplay: false,     //是否自动播放
						isLive: false,       //是否允许直播
						rePlay: false,       //播放器自动循环播放
						playsinline: true,   //H5是否内置播放，有的Android浏览器不起作用。
						preload: true,       //播放器自动加载，目前仅h5可用
						cover: ' '           //封面
					},
					callback: player => {
						player.on('ready', () => {
							//视频加载完成后回调
						});
						player.on('ended', () => {
							//视频播放完成后回调
						});
					}
				}

			videoObj = videoUrl.includes('.aliyuncs.com')
				? Object.assign(videoObj, { sourceUrl: videoUrl.includes('http') ? videoUrl.replace('http://', 'https://') : `https://${videoUrl}` })
				: Object.assign(videoObj, { videoId: videoUrl, getPlayAuthUrl: 'https://tools.cjdropshipping.com/tool/downLoad/getVideoPlayAuth' })

			// console.log(videoObj)
			// console.log(document.getElementById(`J_prismPlayer1`))
			videoPlayer = cjUtils.AccessVideo(videoObj)
		})
	}

	//测试平台视频
	function changeIncomeType($scope, type) {
		$scope.appVideoType = type
	}

	//ajax封装
	function ajaxPostFn({ url, sendData, callback }, erp) {
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

	/** 监听页面大小变化 以及 顶部tab元素变化*/
	function monitor() {
		let topTabEle = document.getElementById('top-tab')
			, tabLeft = topTabEle.offsetLeft
			, observer = new MutationObserver(ev => {
				let height

				setTimeout(() => {
					height = topTabEle.offsetHeight
					console.log(height)
					document.getElementById('content-wrap').style.marginTop = `${height}px`
				}, 500);
			})

		observer.observe(topTabEle, { childList: true, subtree: true })
		window.onscroll = function () {
			let scrollTop = document.documentElement.scrollLeft || document.body.scrollLeft;
			// console.log("滚动距离" + scrollTop, '===',topTabEle.offsetLeft , topTabEle.style.left); 
			topTabEle.style.left = `${tabLeft - scrollTop}px`
		}
	}

	//分页
	function pageFun($scope, callback) {
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
				callback()
			}
		});
	}
})()