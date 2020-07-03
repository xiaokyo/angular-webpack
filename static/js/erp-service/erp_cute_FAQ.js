(function () {
	var app = angular.module('erp-service')
	app.controller('cuteFAQCtrl', ['$scope', 'erp', 'utils', function ($scope, erp, utils) {
		console.log('cuteFAQCtrl')
		var base64 = new Base64();
		const loginName = localStorage.getItem('erploginName') ? base64.decode(localStorage.getItem('erploginName')) : '';
		/** model */
		//CJ 展示类型图片
		$scope.industryFromType = [
			{ key: 1, name: '猜你想问' },
			{ key: 2, name: '服务' },
			{ key: 3, name: '合作' },
		]
		//行业类型
		$scope.industryTypeList = [
			{ key: 1, name: 'POD' },
			{ key: 2, name: '产品' },
			{ key: 3, name: '店铺关联' },
			{ key: 4, name: '概念' },
			{ key: 5, name: '售后' },
			{ key: 6, name: '物流' },
			{ key: 7, name: '下单' },
			{ key: 20, name: '其他' },
		]
		//确认弹窗语句model 
		const confrimModel = {
			delete: { key: 1, txt: '是否确定删除该项?' },
			open: { key: 2, txt: '是否确定启用该项?' },
			close: { key: 3, txt: '是否确定禁用该项?' }
		}
		$scope.orderTypeModel = {
			browseDesc: 't.browse_count desc',   //浏览量 从大到小
			browseAsc: 't.browse_count asc',     //浏览量 从小到大
			isSolveDesc: 't.isSolveCount desc',  //已解决 从大到小
			isSolveAsc: 't.isSolveCount asc',    //已解决 从小到大
			noSolveDesc: 't.notSolveCount desc', //未解决 从大到小
			noSolveAsc: 't.notSolveCount asc',   //未解决 从小到大
			showDesc: 't.sort desc',             //展示顺序 从大到小
			showAsc: 't.sort asc',               //展示顺序 从小到大
		}
		/** 参数 */
		$scope.searchStatus = ''                 //搜索 - 状态 1：启用 / 0：禁用
		$scope.searchInput = ''                  //搜索 - input
		$scope.searchzslx = ''                   //搜索 - 展示类型
		$scope.searchhylx = ''                   //搜索 - 行业类型
		$scope.searchzssx = ''                   //搜索 - 展示顺序
		$scope.pageNum = '1'                     //分页 - 当前页
		$scope.pageSize = '20'                   //分页 - 每页显示几条
		$scope.questionList = []                 //问题列表
		$scope.showFlag = false                  //新增/编辑弹窗
		$scope.canShowPage = false               //是否展示分页
		$scope.totalCounts = 0                   //总条数
		$scope.modelItem = {
			type: 'add',                           //弹窗类型 add：新增 / edit：编辑
			industryQuestion: '',                  //问题
			industryAnswer: "",                    //答案
			industryType: '',                      //行业类型
			industryFrom: '',                      //cj展示类型
			industryKeyword: '',                   //关键字
			id: ''
		}
		$scope.confrimItem = {
			confirmFlag: false,                     //确认弹窗 是否展示 
			type: '',                              //确认弹窗类型 delete：删除 / open：启用 / close：禁用
			text: '',                              //确认弹窗提示语句,
			currentItem: {}                        //确认弹窗 - 当前选中项
		}
		$scope.orderType = ''                    //排序字段 
		$scope.searchQuestion = ''               //关联问题 - 搜索问题文案
		$scope.searchRelevanceList = []          //关联问题 - 搜索返回列表
		const BIG_RELEVANCE = 4                  //关联问题 - 最大关联数量

		/** 富文本 */
		var E = window.wangEditor;
		var editor = new E('#wang');
		editor.customConfig.menus = [
			'head',  // 标题
			'bold',  // 粗体
			'fontSize',  // 字号
			'fontName',  // 字体
			'italic',  // 斜体
			'underline',  // 下划线
			'strikeThrough',  // 删除线
			'foreColor',  // 文字颜色
			'backColor',  // 背景颜色
			'link',  // 插入链接
			'image',  // 插入图片
		]
		editor.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
		editor.customConfig.uploadFileName = 'file';
		// 将 timeout 时间改为 30s
		editor.customConfig.uploadImgTimeout = 30000;
		editor.customConfig.uploadImgHooks = {
			customInsert: function (insertImg, result, editor) {
				var imgList = JSON.parse(result.result);
				for (var i = 0; i < imgList.length; i++) {
					imgList[i] = 'https://' + imgList[i];
				}
				if (imgList.length > 0) {
					insertImg(imgList);
				}
			}
		}
		editor.create();

		/** 功能 */
		//获取faq列表
		getList()
		function getList() {
			let params = {
				pageNum: Number($scope.pageNum),
				pageSize: Number($scope.pageSize),
				industryStatus: $scope.searchStatus ? Number($scope.searchStatus) : '',
				industryKeyword: $scope.searchInput,
				orderBy: $scope.orderType,
			}
			if ($scope.searchzslx) params.industryFrom = +$scope.searchzslx
			if ($scope.searchhylx) params.industryType = +$scope.searchhylx
			if ($scope.searchzssx) params.sort = +$scope.searchzssx
			ajaxFn({
				url: 'message/getIndustryMsgList', params,
				callback: ({ data }) => {
					const { resultCode, data: result } = data
					if (resultCode === 200) {
						// console.log(result)
						const { page: list, count } = result
						$scope.questionList = list.map(item => {
							item.createTime = utils.changeTime(item.createTime, true)
							item.industryFrom = item.industryFrom ? item.industryFrom.toString().split(',') : []
							return item
						})
						console.log($scope.questionList)
						$scope.canShowPage = count > 0
						$scope.totalCounts = count
						pageFun()
					}
				}
			})
		}
		//排序
		$scope.sortFn = type => {
			// if (type === 'browse')
			$scope.orderType = type
			$scope.pageNum = '1'
			getList()
		}
		//搜索
		$scope.search = () => {
			$scope.pageNum = '1'
			getList()
		}

		//打开新增 / 编辑
		$scope.addFn = (type, item) => {
			console.log(item)
			$scope.modelItem = {
				type,
				industryQuestion: type === 'edit' ? item.industryQuestion : '',
				industryType: type === 'edit' ? item.industryType ? item.industryType.toString() : '' : '',
				// industryFrom: type === 'edit' ? item.industryFrom ? item.industryFrom.toString() : '' : '',
				industryFromList: $scope.industryFromType.map(_item => {
					if(type === 'edit') {
						_item.checked = item.industryFrom.includes(_item.key.toString())
					} else {
						_item.checked = false
					}
					return _item
				}),
				industryKeyword: type === 'edit' ? item.industryKeyword : '',
				id: type === 'edit' ? item.id : '',
				sort: type === 'edit' ? item.sort : '',
				isDrop: false,
				// relevanceList: []
			}
			$scope.searchQuestion = ''               //关联问题 - 搜索问题文案
			$scope.searchRelevanceList = []          //关联问题 - 搜索返回列表
			editor.txt.html(type === 'edit' ? item.industryAnswer : '')
			if (item && item.relevanceIds) { //获取问题答案
				ajaxFn({
					url: 'robot/getIndMsgList', params: { ids: item.relevanceIds, pageNum: 0, pageSize: 5 },
					callback: ({ data }) => {
						const { resultCode, data: result } = data
						if (resultCode === 200) {
							const list = result.map(_ => ({ id: _.id, industryQuestion: _.industryQuestion }))
							openModalFn(list)
						}
					}
				})
			} else {
				openModalFn()
			}

		}
		function openModalFn(list) {
			$scope.modelItem.relevanceList = list || []
			$scope.showFlag = true
		}
		//确认新增 / 编辑
		$scope.sureAdd = () => {
			const { industryQuestion, industryType, industryFromList, industryKeyword, type, id, sort, relevanceList } = $scope.modelItem
			const industryAnswer = editor.txt.html()
			const checkedList = industryFromList.filter(_ => _.checked)
			if (checkedList.length === 0) {
				layer.msg('请选择CJ展示类型')
			} else if (!industryType) {
				layer.msg('请选择行业类型')
			} else if (!editor.txt.text()) {
				layer.msg('请输入问题')
			} else if (!industryAnswer) {
				layer.msg('请输入答案')
			} else if (!industryKeyword) {
				layer.msg('请输入关键字')
			} else if (!sort) {
				layer.msg('请输入展示顺序')
			} else if (+sort < 1 || +sort > 100) {
				layer.msg("请输入大于0且小于100的展示顺序")
			} else {
				let industryFromStr = ''
				checkedList.forEach((_, idx) => {
					industryFromStr += `${_.key}${idx === checkedList.length - 1 ? '' : ','}`
				})
				const params = {
					industryQuestion, industryAnswer, industryKeyword,
					industryType: Number(industryType),
					industryFrom: industryFromStr,
					sort: +sort,
					relevanceIds: relevanceList.length > 0 ? disposeRelevanceFn(relevanceList) : ''
				}
				console.log(params)
				ajaxFn({
					url: type === 'add' ? 'message/insertIndustryMsg' : 'message/updateIndustryMsgById',
					params: type === 'add' ? Object.assign(params, { createLoginName: loginName }) : Object.assign(params, { id }),
					callback: ({ data }) => {
						const { resultCode, data: result } = data
						if (resultCode === 200 && result > 0) {
							layer.msg(`${type === 'add' ? '新增' : '修改'}成功`)
							$scope.showFlag = false
							getList()
						} else {
							layer.msg(`${type === 'add' ? '新增' : '修改'}失败`)
						}

					}
				})
			}
		}
		function disposeRelevanceFn(list) {
			let ids = ''
			list.forEach((_, idx) => {
				ids += `${_.id}${idx === list.length - 1 ? '' : ','}`
			})
			return ids
		}

		//打开确认弹窗
		$scope.confirmFn = (type, item) => {
			$scope.confrimItem = {
				confirmFlag: true,
				type,
				text: confrimModel[type].txt,
				currentItem: item
			}
		}
		//弹窗 确认
		$scope.sureConfirm = () => {
			const { type } = $scope.confrimItem
			type === 'delete'
				? deleteFn()
				: updateStatus()
		}
		//删除
		function deleteFn() {
			ajaxFn({
				url: 'message/delIndustryMsgById', params: { id: $scope.confrimItem.currentItem.id },
				callback: ({ data }) => {
					const { resultCode, data: result } = data
					if (resultCode === 200 && result > 0) {
						layer.msg('删除成功')
						$scope.confrimItem.confirmFlag = false
						getList()
					} else {
						layer.msg('删除失败')
					}
				}
			})
		}
		//启用/禁用
		function updateStatus() {
			let { currentItem, type } = $scope.confrimItem
			const params = {
				industryStatus: type === 'open' ? 1 : 0,
				id: currentItem.id
			}
			ajaxFn({
				url: 'message/updateIndustryMsgById', params,
				callback: ({ data }) => {
					const { resultCode, data: result } = data
					if (resultCode === 200 && result > 0) {
						layer.msg(`${type === 'open' ? '启用' : '禁用'}成功`)
						$scope.questionList = $scope.questionList.map(item => {
							if (item.id === currentItem.id) item.industryStatus = params.industryStatus
							return item
						})
						$scope.confrimItem.confirmFlag = false
					} else {
						layer.msg(`${type === 'open' ? '启用' : '禁用'}失败`)
					}
				}
			})
		}
		$scope.openDrop = () => $scope.modelItem.isDrop = true
		$scope.closeDrop = () => {
			setTimeout(() => {
				$scope.$apply(() => {
					$scope.modelItem.isDrop = false
				})
			}, 300)
		}
		$scope.searchQuestionFn = () => { //关联问题 - 搜索相关问题
			if (!$scope.searchQuestion) {
				$scope.searchRelevanceList = []
				return
			}
			const params = { industryQuestion: $scope.searchQuestion, pageNum: 0, pagesize: 10 }
			ajaxFn({
				url: 'robot/getIndMsgList', params,
				callback: ({ data }) => {
					const { resultCode, data: result } = data
					if (resultCode === 200) $scope.searchRelevanceList = result
				}
			})
		}
		$scope.choseFn = item => {//关联问题 - 选择关联问题
			if ($scope.modelItem.relevanceList.length >= 4) {
				layer.msg('已关联4个问题，无法再添加')
				return
			}
			if($scope.modelItem.relevanceList.findIndex(_ => _.id === item.id) > -1){
				layer.msg('你已经添加过此问题')
				return
			} 
			$scope.modelItem.relevanceList = [...$scope.modelItem.relevanceList, { id: item.id, industryQuestion: item.industryQuestion }]
			console.log($scope.modelItem)
		}
		$scope.deleteRelevance = index => {
			$scope.modelItem.relevanceList.splice(index, 1)
		}
		$scope.checkIndustryFrom = key => { //选择cj展示类型
			const { industryFromList } = $scope.modelItem
			$scope.modelItem.industryFromList = industryFromList.map(item => {
				if(+item.key === +key) item.checked = !item.checked
				return item
			})
		}

		//封装ajax
		function ajaxFn({ url, params, callback }) {
			erp.postFun(url, params, res => callback(res), _ => layer.msg('网络错误'), { layer: true })
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

		function pageFun() {
			$(`.pagegroup`).jqPaginator({
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
					$scope.pageNum = n
					getList()
				}
			});
		}

		//对状态进行处理
		$scope.changeType = (type, status) => {
			let str = ''
			if (type === 'CJ') { //处理cj展示类型
				str = status ? $scope.industryFromType[Number(status) - 1].name : '--'
			} else if (type === 'business') { //处理行业类型
				if (status === 20) {
					str = $scope.industryTypeList[7].name
				} else {
					str = status ? $scope.industryTypeList[Number(status) - 1].name : '--'
				}
			}
			return str
		}

	}])
})()