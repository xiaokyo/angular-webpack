(function () {
	var app = angular.module('erp-l-order', ['ngSanitize']);
	//订单物流查询
	app.controller('orderLogisicsSearchCtrl', ['$scope', 'erp', '$timeout', function ($scope, erp, $timeout) {
		console.log('orderLogisicsSearchCtrl');

		let countryMap = []
			, wlgsMap = []
			, wlfsMap = []

		//查询参数
		$scope.pageNum = '1';
		$scope.pageSize = '20';
		$scope.statusType = 'all';
		$scope.trackNumbers = [];
		$scope.isDetail = false;
		$scope.startTime = '';
		$scope.endTime = '';
		$scope.idInfo = ''
		$scope.trackNumber = '';
		$scope.searchType = '0';
		$scope.cJTrackNumber = ''
		$scope.parentNumber = '';
		/** 2019-10-08 */
		$scope.allChecked = false      //全选控制
		$scope.checkedLen = 0          //选中条数
		$scope.allModelChecked = false //全选控制 - 弹窗
		$scope.checkedModelLen = 0     //选中条数 - 弹窗
		/** 2019-09-28 */
		// export default EsEnum;
		$scope.ResourceStatusEnum = [
			{ active: true, code: 'all', name: '订单查询' },
			{ active: false, code: 'customerOrSalesman', name: '销售及客户查询' },
			{ active: false, code: '12', name: '验单未出库', count: 0 },
			{ active: false, code: '35', name: "出库无追踪", count: 0 },
			{ active: false, code: '2', name: '运输途中', count: 0 },
			{ active: false, code: '34', name: '到达待取', count: 0 },
			{ active: false, code: '7', name: '投递失败', count: 0 },
			{ active: false, code: '6', name: '成功签收', count: 0 },
			{ active: false, code: '10', name: '可能异常', count: 0 },
			{ active: false, code: '13', name: '运输过久', count: 0 },
			{ active: false, code: '8', name: '纠纷', count: 0 },
			{ active: false, code: '5', name: '退回', count: 0 },
			{ active: false, code: '9', name: '销毁', count: 0 },
			
		]
		$scope.customerName = ''   //搜索 - 客户名称
		$scope.salesmanName = ''   //搜索 - 销售名称
		$scope.showFlag = false    //详情 弹窗
		$scope.showFlag2 = false    //修改状态 弹窗
		$scope.showParentOrderFlag = false //母订单显示弹窗
		$scope.modalPageNum = '1'  //弹窗分页
		$scope.modalPageSize = '5' //弹窗每页条数
		$scope.selectStatus = $scope.ResourceStatusEnum[3].code
		$scope.selectId = ''
		const notHasNoList = ['all', 'customerOrSalesman']
		/**
		 * 2019-09-23 物流查询条件修改
		 */
		$scope.storeObj = { //仓库搜索obj
			value: '',
			dropFlag: false
		}
		$scope.countryObj = { //国家搜索obj
			value: '',
			dropFlag: false
		}
		$scope.wlgsObj = { //物流公司搜索obj
			value: '',
			dropFlag: false
		}
		$scope.wlfsObj = { //物流公司搜索obj
			value: '',
			dropFlag: false
		}
		$scope.keyupFn = (type, value) => {
			switch (type) {
				case 'country':
					// $scope.countryObj.dropFlag = dropFlag
					$scope.countrysList = searchInArr(countryMap, value)
					break
				case 'wlgs':
					$scope.logisticsNamesArr = searchInArr(wlgsMap, value)
					break
				case 'wlfs':
					$scope.logisticsModelsArr = searchInArr(wlfsMap, value)
					break
				default:
					break
			}
		}
		// 获取仓库数据
		// $scope.strogeList = erp
    //   .getStorage()
    //   .map(_ => ({ id: _.dataId, storageName: _.dataName }));

		//搜索
		function searchInArr(list, value) {
			return list.filter(item => item.indexOf(value.toUpperCase()) !== -1 || item.indexOf(value) !== -1)
		}

		//select-input 选择
		$scope.clickItemFn = (obj, value, type) => {
			obj.value = value;
			console.log(obj)

			obj.dropFlag = false
			if (type === 'wlgs') changeWlgs()
		}

		/** tab 点击*/
		$scope.clickTabFn = record => {
			const { code } = record
			$scope.ResourceStatusEnum.forEach(item => {
				item.active = code === item.code
			})
			clearSearch()
			$scope.statusType = code
			$scope.pageNum = '1';
			initFun()
		}

		/** 初始调用 */
		getparameter()
		initFun()
		function initFun() {
			if ($scope.statusType === 'customerOrSalesman') {
				getListUserLogisticsOrder()
			} else {
				getLogisicsOrderList()
			}
		}

		/** 2019-10-08*/
		//点击一行使其选中或者不选中
		$scope.checkedFn = item => {
			const { isChecked } = item
			item.isChecked = !isChecked
			ifAllCheckedFn()
		}

        $scope.toAllOrder = item => {
			window.open('#/zi-all/'+item.id);
		}

		//全选
		$scope.checkAll = () => {
			if ($scope.showFlag) {//弹窗内
				$scope.modalList = $scope.modalList.map(item => {
					item.isChecked = !$scope.allModelChecked
					return item
				})
			} else {
				$scope.orderList = $scope.orderList.map(item => {
					item.isChecked = !$scope.allChecked
					return item
				})
			}

			ifAllCheckedFn()
		}

		//判断是否全选
		function ifAllCheckedFn() {
			let sum = 0
			if ($scope.showFlag) {//弹窗内
				$scope.modalList.forEach(item => {
					item.isChecked && sum++
				})
				$scope.allModelChecked = sum === $scope.modalList.length
				$scope.checkedModelLen = sum
			} else {//页面中
				$scope.orderList.forEach(item => {
					item.isChecked && sum++
				})
				$scope.allChecked = sum === $scope.orderList.length
				$scope.checkedLen = sum
			}
		}

		//批量修改
		$scope.batchUpdate = (type = 'page') => {
			const len = type === 'modal' ? $scope.checkedModelLen : $scope.checkedLen
			const arr = type === 'modal' ? $scope.modalList : $scope.orderList
			if (len === 0) {
				layer.msg('请先选择订单')
			} else {
				let str = ''
				arr.forEach(item => {
					if (item.isChecked) {
						str += `${item.id},`
					}
				})
				console.log(str)
				$scope.selectStatus = ''
				$scope.selectId = str
				$scope.showFlag2 = true
			}
		}

		//修改状态
		$scope.updateFn = function () {
			layer.confirm('确认修改吗？', {
				btn: ['确定', '取消']//按钮
			}, function (index) {
				layer.close(index);
				$scope.selectId.includes(',')
					? updatebatchFn()
					: updateOneFn()
			})
		}

		//批量修改订单
		function updatebatchFn() {
			updateAjax('newlogistics/track/batchUpdateStatus', {
				ids: $scope.selectId,
				status: $scope.selectStatus
			})
		}

		//修改单一订单
		function updateOneFn() {
			updateAjax('newlogistics/track/updateStatus', {
				id: $scope.selectId,
				status: $scope.selectStatus
			})
		}

		//修改订单ajax请求
		function updateAjax(url, sendData) {
			erp.postFun(url, JSON.stringify(sendData), ({ data }) => {
				console.log(data)
				if (data.statusCode == '200') {
					layer.msg('修改成功')
					getparameter()
					if ($scope.statusType === 'customerOrSalesman') {
						getListUserLogisticsOrder()
						getModalList()
					} else {
						getLogisicsOrderList()
					}
					$scope.allChecked = false      //全选控制
					$scope.checkedLen = 0          //选中条数
					$scope.allModelChecked = false //全选控制 - 弹窗
					$scope.checkedModelLen = 0     //选中条数 - 弹窗
					$scope.showFlag2 = false
				}
			}, error => {
				layer.msg('网络错误')
			}, { layer: true })
		}

		/** 2019-09-28 */
		//点击数量 弹出详情弹窗
		$scope.clickDetail = (item, type) => {
			$scope.currentId = item.userId   //根据当前用户id、物流类型查询物流信息
			$scope.currentType = type
			$scope.modalPageNum = '1'
			$scope.parentNumber = '';
			if(type === 'parentOrder'){
				$scope.parentNumber = item.parentNumber;
			}
			if(type == 'parent'){
				getParentModalList();
			} else {
				getModalList()
			}
		}

		//修改 物流状态
		$scope.updateStatus = item => {
			const { id, status } = item
			$scope.selectStatus = status.toString()
			$scope.selectId = id
			$scope.showFlag2 = true
		}
		//确认修改
		$scope.updateStatusFn = () => {
			$scope.selectStatus ? $scope.updateFn() : layer.msg('请选择状态')
		}

		function getModalList() {
			const params = {
				offset: $scope.modalPageNum * 1,
				count: $scope.modalPageSize * 1,
				status: $scope.currentType === 'all' || $scope.currentType === 'parentOrder' ? '' : Number($scope.currentType),
				startTime: $scope.startTime ? `${$scope.startTime} 00:00:00` : "",
				endTime: $scope.endTime ? `${$scope.endTime} 23:59:59` : '',
				userId: $scope.currentId,
				parentOrderNum: $scope.parentNumber
			}
			if($scope.searchType == 2) {
				//母订单
				params.parentOrderNum = $scope.customerName
			} else if($scope.searchType == 3) {
				//订单号
				params.ids = $scope.customerName
			} else if($scope.searchType == 4) {
				//运单号
				params.trackNumber = $scope.customerName
			}
			erp.postFun('newlogistics/track/list', JSON.stringify(params), ({ data }) => {
				const { statusCode, result } = data
				if (statusCode === '200') {
					const { list, total } = result
					$scope.modalList = list.map(item => {
						item.isChecked = false
						return item
					}) || []
					$scope.showFlag = true
					$scope.modalTotalCounts = total || 1
					pageFun2()
				}
			}, error => {
				layer.msg('网路错误')
			}, { layer: true })
		}

		//母订单弹窗
		function getParentModalList() {
			const params = {
				offset: $scope.modalPageNum * 1,
				count: $scope.modalPageSize * 1,	
				// startTime: $scope.startTime ? `${$scope.startTime} 00:00:00` : "",
				// endTime: $scope.endTime ? `${$scope.endTime} 23:59:59` : '',
				userId: $scope.currentId,
			}
			erp.postFun('newlogistics/track/parentOrderList', JSON.stringify(params), ({ data }) => {
				const { statusCode, result } = data
				if (statusCode === '200') {
					const { list, total } = result
					$scope.parentModalList = list
					$scope.showParentOrderFlag = true
					$scope.modalTotalCounts = total || 1
					pageFun2('parent')
				}
			}, error => {
				layer.msg('网路错误')
			}, { layer: true })
		}

		/** 2019-09-28 */
		//点击母订单数量 弹出详情弹窗
		// $scope.clickParentDetail = (item) => {
		// 	$scope.currentId = item.userId 
		// 	$scope.modalPageNum = '1'
		// 	getParentModalList()	
		// }

		//获取select参数信息
		function getparameter() {
			erp.postFun('newlogistics/track/searchInfo', {}, function (data) {
				console.log(data.data);
				var result = data.data.result;
				countryMap = $scope.countrysList = result.countrys;
				wlgsMap = $scope.logisticsNamesArr = result.logisticsNames;
				$scope.storesArr = result.stores.filter(item => item)
				calculate(result.counts);
			}, function () { });
		}
		/** 根据物流公司获取物流方式 */
		function changeWlgs() {
			var sendData = {
				logisticsName: $scope.wlgsObj.value
			}
			erp.postFun('newlogistics/track/getLogisticsModel', JSON.stringify(sendData), function (data) {
				if (data.data.statusCode === '200') {
					console.log(data.data.result)
					wlfsMap = $scope.logisticsModelsArr = data.data.result;
				}
			}, function () { }, { layer: true })
		}
		//计算总数
		function calculate(arr) {
			$scope.ResourceStatusEnum.forEach(item => {
				if (item.count) item.count = 0
			})
			arr.forEach(item => {
				const { status, statusCount } = item
				$scope.ResourceStatusEnum.forEach(item1 => {
					if(Number(item1.code) == status){
						item1.count = statusCount
					}
				})
				
			})
		}
		//条件搜索
		$scope.searchFun = function () {
			if ($scope.searchType == '0') {
				$scope.idInfo = $scope.searchInfo2;
			} else if ($scope.searchType == '1') {
				$scope.trackNumber = $scope.searchInfo2;
			} else if ($scope.searchType === '2') {
				$scope.cJTrackNumber = $scope.searchInfo2
			}
			$scope.pageNum = '1';
			initFun()
		}

		$scope.TrackingNumberArr = [''];


		var pasteEle = document.getElementById('searchOrderUl');
		pasteEle.addEventListener("paste", function (e) {
			var pastedText = undefined;
			if (e.clipboardData && e.clipboardData.getData) { // IE
				pastedText = e.clipboardData.getData('Text');
			} else {
				pastedText = e.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
			}
			copyResult(pastedText);
		});

		function copyResult(str) {
			let arr
				, newArr = $scope.TrackingNumberArr
				, newList = [];
			// console.log($scope.TrackingNumberArr.length === 1 && !$scope.TrackingNumberArr[0])

			str = str.replace(/\r\n/g, "<br/>");
			str = str.replace(/\n/g, "<br/>");
			// console.log(str)
			arr = str.split('<br/>');
			if (arr.length == 1) {
				arr = arr[0].split(',')
			}
			arr.forEach(ev => {
				ev && newArr.push(ev);

			});
			newArr.forEach(ev => {
				ev && newList.push(ev)
			})
			console.log(newList)

			$scope.TrackingNumberArr = newList;
			$scope.$apply();
		}

		$scope.inputEnter = function (ev, idx) {
			if (ev.which == '13') {
				//console.log($scope.TrackingNumberArr);
				//console.log(idx);
				if ($scope.TrackingNumberArr[idx] == '') {
					layer.msg('请输入订单号！')
				} else {
					if (idx == 99) {
						layer.msg('一次最多可以搜索100条');
						return;
					}
					if (idx > -1) {
						$scope.TrackingNumberArr.splice(idx + 1, 0, '');
						$timeout(function () {
							$('.TrackingNumber').each(function (o, i) {
								$('.TrackingNumber')[idx + 1].focus();
							})
						}, 0)
					}
				}
			}
		}
		$scope.remove = function (idx) {
			if ($scope.TrackingNumberArr.length == 1) {
				//layer.msg('不能再删了！')
				$scope.TrackingNumberArr = [''];
			} else {
				$scope.TrackingNumberArr.splice(idx, 1);
			}
			$timeout(function () {
				$('.TrackingNumber').each(function (o, i) {
					$('.TrackingNumber')[$('.TrackingNumber').length - 1].focus();
				})
			}, 0)
		}
		$scope.clearFun = function () {
			$scope.TrackingNumberArr = [''];
		}
		$scope.isDownload = false;
		//批量导出
		$scope.exportFun = function () {
			const len = $scope.checkedLen;
			const arr = $scope.orderList;
			let idList = new Array();
			if (len !== 0) {
				arr.forEach(item => {
					if (item.isChecked) {
						idList.push(item.id);
					}
				})
			}

			var sendData = {
				status: notHasNoList.includes($scope.statusType) ? '' : Number($scope.statusType),
				trackNumbers: $scope.trackNumbers,
				store: $scope.storeObj.value || '',
				destcode: $scope.countryObj.value,
				logisticsName: $scope.wlgsObj.value,
				logisticsMode: $scope.wlfsObj.value,
				startTime: $scope.startTime ? `${$scope.startTime} 00:00:00` : '',
				endTime: $scope.endTime ? `${$scope.endTime} 23:59:59` : '',
				id: $scope.idInfo,
				trackNumber: $scope.trackNumber,
				cJTrackNumber: $scope.cJTrackNumber,
				parentOrderNum: $scope.parentOrderNum,
				idList
			}
			console.log(sendData);
			erp.postFun('newlogistics/track/import', JSON.stringify(sendData), function (data) {
				console.log(data.data);
				if (data.data.statusCode == '200') {
					$scope.isDownload = true;
					$scope.excelUrl = data.data.result;
				}

			}, function () { }, { layer: true })
		}
		$scope.closeDownloadExcel = function () {
			$scope.isDownload = false;
			$scope.excelUrl = '';
		}

		$scope.storageCallback = function({ item }){
			if(!!item) $scope.store = item.dataId
		}

		/** 获取物流信息 */
		function getLogisicsOrderList() {
			var sendData = {
				offset: $scope.pageNum * 1,
				count: $scope.pageSize * 1,
				status: notHasNoList.includes($scope.statusType) ? '' : Number($scope.statusType),
				trackNumbers: $scope.trackNumbers,
				store: $scope.store || '',
				destcode: $scope.countryObj.value,
				logisticsName: $scope.wlgsObj.value,
				logisticsMode: $scope.wlfsObj.value,
				// startTime: $scope.startTime ? `${$scope.startTime} 00:00:00` : "",
				// endTime: $scope.endTime ? `${$scope.endTime} 23:59:59` : '',
				startOutBoundTime: $scope.startTime ? `${$scope.startTime} 00:00:00` : "",
				endOutBoundTime: $scope.endTime ? `${$scope.endTime} 23:59:59` : '',
				id: $scope.idInfo,
				trackNumber: $scope.trackNumber,
				cJTrackNumber: $scope.cJTrackNumber,
				parentOrderNum: $scope.parentOrderNum,
			}
			erp.postFun('newlogistics/track/list', JSON.stringify(sendData), ({ data }) => {
				console.log(data);
				if (data.statusCode == '200') {
					const { total, list } = data.result
					$scope.orderList = list ? list.map(item => {
						item.isChecked = false
						return item
					}) : []
					$scope.totalCount = total || 1
					console.log($scope.orderList)
					pageFun();
				}
			}, error => {
				layer.msg('网络错误')
			}, { layer: true });
		}
		/** 获取物流信息 客户查询，销售查询 */
		function getListUserLogisticsOrder() {
			let params = {
				offset: $scope.pageNum * 1,
				count: $scope.pageSize * 1,
				startOutBoundTime: $scope.startDate ? `${$scope.startDate} 00:00:00` : '',
				endOutBoundTime: $scope.endDate ? `${$scope.endDate} 23:59:59` : ''
			}
			if($scope.searchType == 0){
				//客户名称
				params.userName = $scope.customerName
			} else if($scope.searchType == 1) {
				//销售名称
				params.salesName = $scope.customerName
			} else if($scope.searchType == 2) {
				//母订单
				params.parentNumber = $scope.customerName
			} else if($scope.searchType == 3) {
				//订单号
				params.orderNumber = $scope.customerName
			} else if($scope.searchType == 4) {
				//运单号
				params.trackNumber = $scope.customerName
			}
			erp.postFun('newlogistics/logistics/listUserLogisticsOrder', JSON.stringify(params), ({ data }) => {
				// console.log(data)
				const { statusCode, result } = data
				if (statusCode === '200') {
					const { list, total } = result
					$scope.logisticsList = list || []
					$scope.totalCount = total || 1
					pageFun()
				}
				// $scope.totalCount = data.data.result.total;
			}, error => {
				layer.msg('网路错误')
			}, { layer: true })
		}
		//分页
		function pageFun() {
			$(".pagegroup").jqPaginator({
				totalCounts: $scope.totalCount || 1,
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
					initFun()
				}
			});
		}
		//弹窗分页
		function pageFun2(types) {
			$(".pagegroup2").jqPaginator({
				totalCounts: $scope.modalTotalCounts || 1,
				pageSize: $scope.modalPageSize * 1,
				visiblePages: 5,
				currentPage: $scope.modalPageNum * 1,
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
					$scope.modalPageNum = n;
					if("parent" == types){
						getParentModalList()
					} else {
						getModalList()
					}
				}
			});
		}
		//更换每页多少条数据
		$scope.pagechange = function (pagesize) {
			//console.log(pagesize)
			// $scope.pagesize=pagesize-0;
			$scope.pageNum = '1';
			initFun()
		}
		$scope.pagechange2 = function (pagesize, type) {
			//console.log(pagesize)
			// $scope.pagesize=pagesize-0;
			$scope.modalPageNum = '1';
			if("parent" == type){
				getParentModalList()
			} else {
				getModalList()
			}
		}
		//手动输入页码GO跳转
		$scope.pagenumchange = function () {
			if ($scope.pageNum == '') {
				$scope.pageNum = '1';
			}
			var pagenum = Number($scope.pageNum);
			console.log(pagenum);
			var totalpage = Math.ceil($scope.totalCount / $scope.pageSize);
			if (pagenum > totalpage) {
				layer.msg('错误页码');
				$scope.pageNum = '1';
			} else {
				initFun()
			}
		}
		$scope.pagenumchange2 = (type) => {
			if ($scope.modalPageNum == '') {
				$scope.modalPageNum = '1';
			}
			var pagenum = Number($scope.modalPageNum);
			console.log(pagenum);
			var totalpage = Math.ceil($scope.modalTotalCounts / ($scope.modalPageSize * 1));
			if (pagenum > totalpage) {
				layer.msg('错误页码');
				$scope.modalPageNum = '1';
			} else {
				if("parent" == type){
					getParentModalList()
				} else {
					getModalList()
				}
			}
		}
		//多个订单和追踪号搜索
		$scope.searchFun2 = function () {
			console.log($scope.TrackingNumberArr);
			// $scope.trackNumbers = $scope.TrackingNumberArr;
			$scope.pageNum = '1';
			if ($scope.TrackingNumberArr.length == 1) {
				if ($scope.TrackingNumberArr[0] == '') {
					$scope.trackNumbers = [];
				} else {
					$scope.trackNumbers = $scope.TrackingNumberArr;
				}
			} else {
				$scope.trackNumbers = $scope.TrackingNumberArr;
			}
			initFun()
		}
		$scope.classOrderType = function (status) {
			let statusName = '';
			if(status == 3 || status == 4){
                status = 34
			}
			if(status == 0 || status == 1){
                status = 35
			}
			$scope.ResourceStatusEnum.forEach(item => {
				if(Number(item.code) == status){
                    statusName = item.name;
				}
			});
			return statusName;
		}
		$scope.classStore = function (store) {
			if (store == '0') {
				return '义乌仓'
			} else if (store == '1') {
				return '深圳仓'
			} else if (store == '2') {
				return '美西'
			} else if (store == '3') {
				return '美东'
			} else if (store == '4') {
				return '泰国仓'
			} else {
				return ''
			}
		}
		//查看详情
		$scope.lookDetial = function (item) {
			console.log(item);
			$scope.routeList = [];
			var route = item.route;
			if (route == '' || route == null || route == undefined) {
				layer.msg('该订单暂无物流详情');
			} else {
				route = JSON.parse(route);
				if (route.length < 1) {
					layer.msg('该订单暂无物流详情');
				} else {
					console.log(route);
					$scope.routeList = route;
					$scope.isDetail = true;
				}
			}
		}

		/** 清空搜索数据 */
		function clearSearch() {
			$scope.statusType = '';
			$scope.trackNumbers = [];
			$scope.startTime = '';
			$scope.endTime = '';
			$scope.idInfo = '';
			$scope.trackNumber = '';
			$scope.trackNumbers = [];
			$scope.searchType = '0';
			$scope.cJTrackNumber = '';
			$scope.searchInfo2 = '';
			$scope.customerName = '';   //搜索 - 客户名称
			$scope.salesmanName = '';  //搜索 - 销售名称
			$scope.parentOrderNum = '';  //母订单号
			$scope.countryObj = {
				value: '',
				dropFlag: false
			}
			$scope.storeObj = {
				value: '',
				dropFlag: false
			}
			$scope.wlgsObj = {
				value: '',
				dropFlag: false
			}
			$scope.wlfsObj = {
				value: '',
				dropFlag: false
			}
		}


	}]);
})()