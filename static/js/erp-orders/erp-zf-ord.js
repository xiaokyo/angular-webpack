(function (angular) {
	// console.log(app);
	var app = angular.module('manage');
	// var app = angular.module('erpZfOrdApp',['erp-service']);
	// console.log(app);
	// var app = angular.module('custom-ziord-app',['service']);

	var getStorageList = function(erp,success){// request 仓库
		const list = erp.getStorage()
		success(list)
	}

	app.directive('repeatFinish',function($timeout){
		return {
		    restrict: 'A',
		    link: function(scope,elem,attr){
		        //当前循环至最后一个
		        // console.log(scope.$index)
		        if (scope.$last === true) {
		            $timeout(function () {
		                //向父控制器传递事件消息
		                scope.$emit('repeatFinishCallback');
		            },100);
		        }
		    }
		}
	});
	function GetDateStr(AddDayCount) {
	    var dd = new Date();
	    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天
	                                         //后的日期
	    var y = dd.getFullYear();
	    var m = dd.getMonth()+1;//获取当前月份的日期
	    var d = dd.getDate();
	    if (m<10) {
	    	m='0'+m
	    }
	    if (d<10) {
	    	d='0'+d
	    }
	    return y+"-"+m+"-"+d;
	}
	function getSendData ($scope) {
		var erpData = {};
		erpData.page = $scope.pageNum;
		erpData.pageNum = $scope.pageSize;
		erpData.status = $scope.orderStatus;
		erpData.orderType = $scope.orderType;
		erpData.buyerId = $scope.buyerId; // 采购人
		erpData.orderId = '';
		erpData.trackingNumber = '';
		erpData.salesman = '';
		erpData.sku = '';
		erpData.likeOrderId = '';
		erpData.productName = '';
		erpData.customerName = '';
		erpData.CUSTOMERNAME = '';
		if($scope.storageName !=null || $scope.storageName!=undefined){
			erpData.storageName = $scope.storageName;
		}
		console.log($scope.orderStatus)
		if($scope.orderStatus == '6'||$scope.orderStatus == '3'||$scope.orderStatus == '5'||$scope.orderStatus == '10'||$scope.orderStatus == '11'||$scope.orderStatus == '12'||$scope.orderStatus == '13'||$scope.orderStatus == '14'){
			erpData.storeType = $scope.isTaiGuoStu;
		}
		if($scope.orderStatus == '3'||$scope.orderStatus == '11'){//未付款 已付款未到账 置空仓库类型 解决没有划分仓库订单查不到的问题
			erpData.storeType = '';
		}
		if($scope.orderStatus == '6'){
			erpData.logisticName = $scope.wlModeName;
			if($scope.checkBoxFlag){
				erpData.trackingNumberType="1";
			}
		}
		if ($scope.searchKey == 'accurate') {
			if ($scope.accurateSearKey == 'order-num') {
				erpData.orderId = $scope.accurateSearVal;
			}
			if ($scope.accurateSearKey == 'track-num') {
				erpData.trackingNumber = $scope.accurateSearVal;
			}
		}
		if ($scope.searchKey == 'sale-man') {
			erpData.salesman = $scope.searchVal;
		}
		if ($scope.searchKey == 'owner-name') {
			erpData.ownerName = $scope.searchVal;
		}
		if ($scope.searchKey == 'order-num') {
			erpData.likeOrderId = $scope.searchVal;
		}
		if ($scope.searchKey == 'sku') {
			erpData.SKU = $scope.searchVal;
		}
		if ($scope.searchKey == 'pro-name') {
			erpData.productName = $scope.searchVal;
		}
		if ($scope.searchKey == 'customer-name') {
			erpData.customerName = $scope.searchVal;
		}
		if ($scope.searchKey == 'track-num') {
			if ($scope.searchVal.length==30) {
				var midStr = $scope.searchVal;
				var subResStr = midStr.substring(midStr.length-22);
				if(subResStr.substring(0,1)=='9'){
					$scope.searchVal = subResStr;
				}
			}
			erpData.LikeTrackingNumber = $scope.searchVal;
		}
		if ($scope.searchKey == 'CJTracknumber') {
			erpData.CJTracknumber = $scope.searchVal;
		}
		if ($scope.searchKey == 'receipint') {
			erpData.CUSTOMERNAME = $scope.searchVal;
		}
		if($scope.searchKey == 'split'){
			erpData.split = $scope.searchVal;
		}

		if ($scope.notPayOrder) {
			erpData.beginCreatedAt = $('#c-data-time').val();
			erpData.endCreatedAt = $('#cdatatime2').val();
		} else {
			erpData.paymentBeginDate = $('#c-data-time').val();
			erpData.paymentEndDate = $('#cdatatime2').val();
		}

		if ($scope.selstu == 1) {
			erpData.trackingNumIsNull = true;
		}
		if ($scope.selstu == 2) {
			erpData.trackingNumNotNull = true;
		}
		if ($scope.selstu == 3) {  //拦截列表
			erpData.subpage = "0";
		}
		if ($scope.selstu == 4) { //纠纷列表
			erpData.disputeId = "all";
		}
		if ($scope.selstu == 5) { //面单过期
			erpData.status = '70';
		}
		if($scope.matchStatus==1){
			erpData.totaltax = $scope.peiqiStu;
		}
		if($scope.selstu == 6){
			erpData.status = '60';
		}
		console.log(erpData);
		return erpData;
	}
	function getOrderList ($scope,erp,msg) {
		erp.load();
		let url = $scope.getListUrl
		let params = getSendData($scope)
		if($scope.selstu == 7){ // 采购缺货条件更换接口url  和新增缺货参数
			url = 'app/buyOrder/selectForStockoutByListZF' // 采购缺货直发订单列表
			params.shortageIdentity = "1" // 缺货标识
		}
		$('.c-ord-list .c-checkall').attr('src','static/image/order-img/multiple1.png')
		erp.postFun(url,JSON.stringify(params),function (data) {
			console.log(data)
			layer.closeAll("loading")
			var erporderResult = data.data;//存储订单的所有数据
			$scope.erpordTnum = erporderResult.totalNum;
			$scope.erporderList = erporderResult.list;
			$scope.totalPageNum = Math.ceil($scope.erpordTnum/($scope.pageSize * 1));
			console.log($scope.erporderList)
			$scope.erporderList.forEach(item=>{
				if(item.interceptType==3){
					item.lanjieType="拦截中"
				}else if(item.interceptType==7){
					item.lanjieType="拦截成功"
				}else if(item.interceptType==8){
					item.lanjieType="拦截失败"
				}else{
					item.lanjieType="纠纷中"
				}
			})
			if(msg){
				layer.msg(msg)
			}
			if ($scope.erpordTnum == 0) return;
			// dealpage ()
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: $scope.pageSize * 1,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.pageNum*1,
				activeClass: 'active',
			    prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
			    next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
			    page: '<a href="javascript:void(0);">{{page}}<\/a>',
			    first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
			    last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
			    onPageChange: function (n,type) {
			        if(type=='init'){
			        	return;
			        }
			        $scope.pageNum = n + '';
			        // alert('处理分页函数的分页函数')
			        erp.load();
			        $('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			        erp.postFun($scope.getListUrl,JSON.stringify(getSendData($scope)),function (data) {
			        	layer.closeAll("loading")
			        	var erporderResult = data.data;//存储订单的所有数据
			        	$scope.erpordTnum = erporderResult.totalNum;
								$scope.erporderList = erporderResult.list;
								console.log($scope.erporderList);
			        },function () {
			        	layer.closeAll("loading")
			        	layer.msg('订单获取列表失败')
			        })
			    }
			});
		},function () {
			layer.closeAll("loading")
			layer.msg('订单获取列表失败')
		})
	}
	function err (error) {
		layer.closeAll('loading');
		console.log(error);
	}
	function setDiscountPost (erp,$scope) {
		erp.load();
		erp.postFun('app/buyOrder/editOrderInfo',JSON.stringify({
			orderId: $scope.operateItem.id,
			amount: $scope.discountMoney
		}), function (data) {
			erp.closeLoad();
			console.log(data);
			if (data.data.code == 200) {
				layer.msg('设置成功')
				$scope.setDiscountFlag=false;
				$scope.operateItem.amount = $scope.discountMoney;
				$scope.discountMoney = '';
			} else {
				layer.msg('设置失败')	;
			}
		},err)
	}
	function clickAndMouse () {
		$('.orders-table').on('click','.erporder-detail',function (event) {
			if($(event.target).hasClass('cor-check-box')||$(event.target).hasClass('qtcz-sel')||$(event.target).hasClass('stop-prop')){
				return;
			}
			if ($(this).hasClass('order-click-active')) {
				$(this).next().hide();
				$(this).removeClass('order-click-active');
			} else {
				$(this).next().show();
				$(this).addClass('order-click-active');
			}
		})
		$('.orders-table').on('mouseenter','.erporder-detail',function () {
			$(this).next().show();
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
			$(this).addClass('erporder-detail-active');
		})
		$('.orders-table').on('mouseleave','.erporder-detail',function () {
			if($(this).hasClass('order-click-active')){
				$(this).next().show();
			}else{
				$(this).next().hide();
			}
		})
		$('.orders-table').on('mouseenter','.erpd-toggle-tr',function () {
			$(this).show();
		})
		$('.orders-table').on('mouseleave','.erpd-toggle-tr',function () {
			if ($(this).prev().hasClass('order-click-active')) {
				$(this).show();
			} else {
				$(this).hide();
			}
		})
		$('.orders-table').mouseleave(function () {
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
		})
	}
	function checkFun () {
		var cziIndex = 0;
		$('#c-zi-ord').on('click','.cor-check-box',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cziIndex++;
				if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
					$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cziIndex--;
				if (cziIndex != $('#c-zi-ord .cor-check-box').length) {
					$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#c-zi-ord').on('click','.c-checkall',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cziIndex = $('#c-zi-ord .cor-check-box').length;
				$('#c-zi-ord .cor-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cziIndex = 0;
				$('#c-zi-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
	}
	function getAllChinaWarehouse($scope, erp) {
		erp.postFun('storehouse/WarehousInfo/getStorehouse', { useStorageType: '1' }, ({data}) => {
			let { data: warehouseList } = data
			erp.postFun('warehouseBuildWeb/management/getCountryByAreaId', {}, ({ data }) => {
				const { data: areaList } = data
				let areaObj = {}
				areaList.forEach(item => {
					areaObj[+item.areaId] = item
				})
				warehouseList = warehouseList.filter(item => areaObj[+item.areaId] && areaObj[+item.areaId].countryCode === 'CN' && !item.storageNo2Name.includes('Zhi Fa'))
				warehouseList = warehouseList.map(item => {  //针对以前的仓库， 匹配字段
					if(item.id === 'bc228e33b02a4c03b46b186994eb6eb3') item.store = '0'
					if(item.id === '08898c4735bf43068d5d677c1d217ab0') item.store = '1'
					if(item.id === '522d3c01c75e4b819ebd31e854841e6c') item.store = '5'
					return item
				})
				$scope.chinaWarehouse = warehouseList
				console.log('中国仓列表 => ', $scope.chinaWarehouse)
			})
		})
	}
	app.controller('zf-order-controller',['$scope','$http','erp','$location','$routeParams','$compile','$timeout',function ($scope,$http,erp,$location,$routeParams,$compile,$timeout) {

		$scope.$on('repeatFinishCallback',function(){
			// alert(6666666666)
		    $('#c-zi-ord .edit-inp').attr('disabled','true');
		    $('#c-zi-ord .bj-spsku').attr('disabled','true');
		});
		var aDate = GetDateStr(-45);
		var enDate = GetDateStr(0);
		$("#c-data-time").val('' );   //关键语句
		// $("#cdatatime2").val(enDate );   //关键语句

		$scope.storeList = window.warehouseList.map(({name, store})=>({ storeName:name, store, ordNum:'', storeFlag:false}))
		// 转仓
		//获取所有中国仓
		getAllChinaWarehouse($scope, erp)

		$scope.rollOverFn = item => { //转仓
			const list = $scope.chinaWarehouse.filter(_ => (_.store === item.store || _.id === item.storageId))
			console.log('12131232131 ->', list)
			if(list.length === 0) {
				layer.msg('只能对中国区的订单进行转仓')
				return
			}
			$scope.rollParam = {
				name: list[0].storageName,
				wid: list[0].id,
				id: item.id,
				list: $scope.chinaWarehouse.filter(_ => (_.store !== item.store && _.id !== item.storageId))
			}
		}
		$scope.rollCallback = () => {
			$scope.pageNum = '1'
			getOrderList($scope,erp)
		}

		// 显示采购员列表
		// 查看采购单操作日志
		$scope.purchaseOrderCallback = function(showPurchases){
			$scope.showPurchases = showPurchases
		}

		// 采购员input改变回调
		// 采购人筛选项
		$scope.purchasePersonCallback = function({id, loginName}){
			$scope.buyerId = id
		} 

		$scope.currtpage = 1;
		$scope.searchKey = 'sale-man';
		var bs = new Base64();
		const job = localStorage.getItem('job') ? bs.decode(localStorage.getItem('job')) : '';
		var nowpath = $location.path();
		// console.log($route);
		var ordStatus = $routeParams.ordStatus || 0;
		$scope.isZfOrder = true;
		// $scope.isTaiGuoStu = '0';
		console.log('直发订单');
		if (ordStatus == 0) {
			$scope.paiedOrder = true;
			$scope.orderStatus = '10';
		}else if (ordStatus == 1) {
			$scope.waitShipOrder = true;
			$scope.orderStatus = '6';
			$('.peiqi-btn').eq(0).addClass('peiqi-btn-act')
			$scope.peiqiStu = '0';
		}else if (ordStatus == 2) {
			$scope.outAccOrder = true;
			$scope.orderStatus = '11';
		} else if (ordStatus == 3) {
			$scope.notPayOrder = true;
			$scope.orderStatus = '3';
			$scope.isTaiGuoStu = '';
			$scope.job=job;
		} else if (ordStatus == 4) {
			$scope.alShipOrder = true;
			$scope.orderStatus = '12';
		} else if (ordStatus == 5) {
			$scope.compleOrder = true;
			$scope.orderStatus = '13';
		}else if(ordStatus == 6){
            $scope.orderStatus = '5';
        }else if(ordStatus == 7){
            $scope.orderStatus = '14';
        }
		if ($scope.paiedOrder) {
			$scope.selstu = 1;//判断订单状态 隐藏选择框中的操作
		}
		if ($scope.waitShipOrder || $scope.alShipOrder) {
			$scope.selstu = 2;
		}
		if ($scope.waitShipOrder) {
			$scope.matchStatus = 1;
		}
		console.log(ordStatus,$scope.orderStatus)
		var erpLoginName = bs.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
    	$scope.loginName = erpLoginName;
		// alert(erpLoginName)
		$scope.loginSpace = localStorage.getItem('space');
		// if($scope.loginSpace == '泰国'){
		// 	$scope.isTaiGuoStu = 2;
		// }else{
		// 	$scope.isTaiGuoStu = 1;
		// }
		var nowTime = new Date().getTime();
		var setTiem = localStorage.getItem('setCsTime')==undefined?'':localStorage.getItem('setCsTime');
		var getCsObj = localStorage.getItem('ziCs')==undefined?'':JSON.parse(localStorage.getItem('ziCs'));
		
		$scope.tbkcAdminFlag = ['管理', '采购'].includes(job) || ['虞雅婷', 'admin', '方淑月', '马文文', '庹章龙', '邹丽容'].includes(erpLoginName)
		var isSetCsFlag = false;//是否携带参数
		if(nowTime-setTiem>1500){
			isSetCsFlag = false;
		}else{
			isSetCsFlag = true;
			$("#c-data-time").val(getCsObj.btime);
			$("#cdatatime2").val(getCsObj.etime);
			if (getCsObj.tj!='追踪号') {
				$scope.searchKey = getCsObj.tj;
				$('.c-seach-country').val(getCsObj.tj);
				$('.c-seach-inp').val(getCsObj.val);
			}
			console.log(nowTime-setTiem)
		}
		// erp.load();
		//请求物流渠道
		erp.postFun('app/erplogistics/getLogisticschannel',null,function (data) {
			console.log(data)
			$scope.wlqdArr = data.data;
			console.log($scope.wlqdArr)
			$scope.allepackArr = [];//存储所有E邮宝
			$scope.ddepackArr = [];//存储带电E邮宝的数组
			$scope.bdepackArr = [];//存储不带电E邮宝
			$scope.uspsArr = [];//存储物流方式为usps的数组
			$scope.ddyzxbArr = [];//存储带电邮政小包
			$scope.bdyzxbArr = [];//存储不带电邮政小包
			$scope.cjNorArr = [];//存储顺丰
			$scope.yanWenArr = [];
			$scope.postNlArr = [];
			$scope.gaoTiArr = [];//epacket膏体
			$scope.dhlHongKongArr = [];
			$scope.gaoCiArr = [];//含膏 含磁可走物流
			$scope.cjCodArr = [];
			$scope.cjpacketSeaArr = [];
			$scope.dhlOfficialArr = [];//dhl物流
			for(var i = 0;i<$scope.wlqdArr.length;i++){
				if($scope.wlqdArr[i].nameen=="ePacket" && $scope.wlqdArr[i].code != 'JCSZEUB' && $scope.wlqdArr[i].code != 'JCNJEUB'){
					$scope.allepackArr.push($scope.wlqdArr[i])
					if ($scope.wlqdArr[i].mode.indexOf('不带电')>=0) {
						$scope.bdepackArr.push($scope.wlqdArr[i]);
					}
					else {
						$scope.ddepackArr.push($scope.wlqdArr[i]);
					}
					if($scope.wlqdArr[i].code == 'BJEUB'||$scope.wlqdArr[i].code == 'SEUB'||$scope.wlqdArr[i].code == 'BEUBH'||$scope.wlqdArr[i].code == 'DEIDAKDW604_YW'||$scope.wlqdArr[i].code == 'DEIDAKDW604_SZ'){
						$scope.gaoTiArr.push($scope.wlqdArr[i])
					}
				}else if($scope.wlqdArr[i].nameen=="USPS"){
					$scope.uspsArr.push($scope.wlqdArr[i])
				}else if($scope.wlqdArr[i].nameen=="China Post Registered Air Mail"){
					if ($scope.wlqdArr[i].mode.indexOf('不带电')>=0) {
						$scope.bdyzxbArr.push($scope.wlqdArr[i]);
					} else {
						$scope.ddyzxbArr.push($scope.wlqdArr[i]);
					}
				}else if($scope.wlqdArr[i].nameen=="CJ Normal Express"){
					$scope.cjNorArr.push($scope.wlqdArr[i])
				}else if($scope.wlqdArr[i].nameen == "YanWen"){
					$scope.yanWenArr.push($scope.wlqdArr[i])
				}else if($scope.wlqdArr[i].nameen == "DHL HongKong"){
					$scope.dhlHongKongArr.push($scope.wlqdArr[i])
				}else if($scope.wlqdArr[i].nameen == 'PostNL'){
					$scope.postNlArr.push($scope.wlqdArr[i])
				}else if($scope.wlqdArr[i].nameen == 'CJCOD'){
					$scope.cjCodArr.push($scope.wlqdArr[i])
				} else if($scope.wlqdArr[i].nameen == 'CJPacket-Sea' || $scope.wlqdArr[i].nameen == 'CJPacket Sea'){
					$scope.cjpacketSeaArr.push($scope.wlqdArr[i])
				} else if($scope.wlqdArr[i].nameen == 'DHL Official'){
					$scope.dhlOfficialArr.push($scope.wlqdArr[i])
				}
				if($scope.wlqdArr[i].code == "SEUB"||$scope.wlqdArr[i].code == "DGEUBA"||$scope.wlqdArr[i].code == 'DEIDAKDW604_YW'||$scope.wlqdArr[i].code == 'DEIDAKDW604_SZ'){
					$scope.gaoCiArr.push($scope.wlqdArr[i])
				}
			}
			console.log($scope.wlqdepackArr)
			console.log($scope.uspsArr)
			console.log($scope.cjNorArr)
		},function (data) {
			console.log(data)
		})

		// $scope.erpordTnum = erpData.limit;
		// console.log(erpData)

		$scope.erpordersList = '';//存储所有的订单
		$scope.erpordTnum = 0;//存储订单的条数
		$scope.pageSize = '20';
		$scope.pageNum = '1';
		$scope.totalPageNum = 0;
		$scope.getListUrl = 'app/buyOrder/selectOrderBySendList';
		$scope.fbaFlag = false //是否展示fba附件弹框
		$scope.ShippingArr = []
		$scope.FNSKUArr = []

		//打开fba
		$scope.openFba = function (json) {
			let arr = JSON.parse(json.amazonFile)

			arr.forEach(json => {
				json.val === 'fileArr'
				  ? $scope.ShippingArr = json.filArr
				  : $scope.FNSKUArr = json.filArr
			})
			console.log('ShippingArr =>', $scope.ShippingArr,'FNSKUArr =>', $scope.FNSKUArr)
			$scope.fbaFlag = true
		}
		$scope.closeFba = function () {
			$scope.fbaFlag = false
			$scope.ShippingArr = []
		    $scope.FNSKUArr = []
		}
		console.log('11111111111 =>', window.warehouseList)

		$scope.storageCallback = function({item, storageList, allIdString}){
			$scope.storageName = $scope.isTaiGuoStu = allIdString
			if($scope.orderStatus != '3' && $scope.orderStatus != '11'){
				if(!!item) $scope.storageName = $scope.isTaiGuoStu = item.dataId
			}
			$scope.pageNum = '1'
			getOrderList($scope,erp)
		}

		// getOrderList($scope,erp);
		$scope.spaceTypeFun = function(stu,ev){
			if($(ev.target).hasClass('strogetyp-btn-act')){
				$scope.isTaiGuoStu = '';
				$(ev.target).removeClass('strogetyp-btn-act')
			}else{
				$scope.isTaiGuoStu = stu+'';
			}
			getOrderList($scope,erp);
		}
		$scope.setDiscount = function (item) {
			$scope.setDiscountFlag=true;
			$scope.operateItem = item;
		}
		$scope.goSetDiscountFlag = function () {
			setDiscountPost (erp,$scope);
		}
		$scope.storeName = '义乌直发仓'
		$scope.tbkcFun = function(item){
			$scope.isTbkcFlag = true;
			$scope.itemId = item.id;
			if (!item.storageId||item.storageId=='4c3ef4dc8a3f44f7be7c90ff538cdf7f') {
				$scope.storeName = '义乌直发仓'
			} else {
				$scope.storeName = '深圳直发仓'
			}
		}
		$scope.sureTbkcFun = function(){
			var upJson = {};
			upJson.orderId = $scope.itemId;
			upJson.orderType = 2;
			erp.postFun('storehouseUsa/payOrder/payOrderMateInventory',JSON.stringify(upJson),function(data){
				console.log(data)
				if (data.data.code==200) {
					layer.msg('同步成功')
					$scope.isTbkcFlag = false;
					getOrderList($scope,erp);
				} else {
					layer.msg('同步失败')
					erp.closeLoad()
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}
		// 添加订单筛选
		$scope.orderType = ''
		$scope.selOrdTypeFun = function() {
			console.log($scope.orderType);
			getOrderList($scope, erp);
		}

		// 缺货处理
		$scope.currentHandleOrder = undefined // 当前订单信息
		$scope.openStockout = function(order){
			$scope.currentHandleOrder = order
			$scope.stockoutHandleFlag = true
			$scope.clearHandleOrderForm()
		}


		// 缺货处理回调
		$scope.handleOrderCallback = function (data, type) {
			// if (type == 1) {// 分开发货  拆单成功
			// 	getOrderList($scope, erp)
			// 	$scope.stockoutHandleFlag = false
			// }
			getOrderList($scope, erp)
			$scope.stockoutHandleFlag = false
		}

		// 采购缺货sku状态
		$scope.orderStockoutHandleObj = {
			'0':'待退款',
			'1':'已退款',
			'2':'已拒绝'
		}

		// 缺货初始执行的回调
		$scope.initStockorderCallback = function(seeStockoutLog, clearHandleOrderForm){ 
			$scope.outOfStockHandleLog = seeStockoutLog
			$scope.clearHandleOrderForm = clearHandleOrderForm
		}
		
		$scope.peiQiStuFun = function(stu){
			$scope.pageNum = '1';
			$('.peiqi-btn').removeClass('peiqi-btn-act')
			$('.peiqi-btn').eq(stu).addClass('peiqi-btn-act')
			$scope.peiqiStu = stu+'';
			$scope.selstu = 2
			//console.log($scope.selstu)
			getOrderList($scope,erp);
		}
		$scope.autoFreshTrack = function(item){
			$scope.itemId = item.id;
			$scope.autoFreshTrackFlag = true;
		}
		$scope.confirmFreshTrack = function(){
			layer.load(2)
			let upJson = {
				ids: $scope.itemId,
				loginName: erpLoginName,
				auto: 'n',
				orderType: "CJPAY"
			}
			if($scope.selstu != 5){
				upJson.orderStatusRecordType = '1'
			}
			erp.zfPostFun('createWaybillNumber.json', JSON.stringify(upJson), function (data) {
				layer.closeAll("loading")
				$scope.autoFreshTrackFlag = false;
				var result = data.data;
				let sess = 0;//存储成功的个数
				let error = 0;//存储失败的个数
				for (var i = 0; i < result.length; i++) {
					sess += result[i].sess;
					error += result[i].error;
				};
				if(sess > 0 ){
					layer.msg('更新成功')
					getOrderList($scope,erp);
				}else{
					layer.msg('更新失败')
				}
			}, function (data) {
				layer.closeAll("loading")
			})
		}
		$scope.updateMdFun = function (item) {
			$scope.lrId = item.id;
			$scope.zzhChaFlag = true;
		}
		$scope.canLrFun = function () {
			$scope.zzhChaFlag = false;
			$scope.lrzzhNum = '';
			$scope.lrHref = '';
		}
		$scope.upLoadImg4 = function (files) {
			erp.ossUploadFile($('#file')[0].files, function (data) {
				console.log(data)
				if (data.code == 0) {
					layer.msg('Upload Failed');
					return;
				}
				if (data.code == 2) {
					layer.msg('Upload Incomplete');
				}
				var result = data.succssLinks;
				var srcList = result[0].split('.');
				var fileName = srcList[srcList.length - 1].toLowerCase();
				console.log(fileName)
				if (fileName == 'pdf') {
					$scope.lrHref = result[0];
					$('#file').val('')
				} else {
					layer.msg('请上传pdf格式')
				}
				console.log(result)
				console.log($scope.lrHref)
				$scope.$apply();
			})
		}
		$scope.sureChaZzhFun = function () {
			erp.load();
			var lrData = {};
			lrData.logisticsNumber = $scope.lrzzhNum;
			lrData.id = $scope.lrId;
			lrData.href = $scope.lrHref;
			lrData.orderStatusRecordType = '1';
			console.log(JSON.stringify(lrData))
			erp.postFun('processOrder/handleOrder/updateOrderTrackingNumber', JSON.stringify(lrData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.zzhChaFlag = false;
				if (data.data.code == 200) {
					if ($scope.selstu == 1) {
						layer.msg('添加追踪号成功')
					} else {
						layer.msg('修改追踪号成功')
					}
					getOrderList($scope,erp);
					$scope.lrzzhNum = '';
					$scope.lrHref = '';
				} else {
					layer.msg('添加追踪号失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
    //更新折扣价
    $scope.updateDiscount = function (item) {
      let parms = {
        CJOrderId:item.id
      };
      erp.postFun('app/buyOrder/updateZfd', parms, res => {
        if (res.data.code == '200') {
          layer.msg('操作成功')
          getOrderList($scope,erp);
        } else {
          layer.msg(res.data.msg || '操作失败')
        }
      }, err => {
        console.log(err)
      }, {layer: true});
    };
		//分页选择框的切换
		$scope.chanPageSize = function () {
			$scope.pageNum = '1';
			getOrderList($scope,erp);
		}
		//跳页的查询
		$scope.gopageFun = function () {
      if(!(/(^[1-9]\d*$)/.test($scope.pageNum)) || $scope.pageNum > $scope.totalPageNum) {
        $scope.pageNum = '1';
        layer.msg('请输入正确页码');
				return;
      }
			getOrderList($scope,erp);
		}
		//搜索
		$('.c-seach-inp').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
		})
		$scope.searchFun = function () {
			$scope.pageNum = '1';
			getOrderList($scope,erp);
		}
		//按时间搜索
		//erp开始日期搜索
		$("#c-data-time").click(function (){
			var erpbeginTime=$("#c-data-time").val();
			var interval=setInterval(function (){
				var endtime2=$("#c-data-time").val();
				if(endtime2!=erpbeginTime){
					clearInterval(interval);
					$scope.pageNum = '1';
					getOrderList($scope,erp);
				}
			},100)
		})
		//erp结束日期搜索
		$("#cdatatime2").click(function (){
			var erpendTime=$("#cdatatime2").val();
			var interval=setInterval(function (){
				var endtime2=$("#cdatatime2").val();
				if(endtime2!=erpendTime){
					clearInterval(interval);
					$scope.pageNum = '1';
					getOrderList($scope,erp);
				}
			},100)
		})
		//获取物流方式
		if(ordStatus == 1){
			erp.postFun('app/erplogistics/queryLogisticMode',{
				"param":"",
				"status":"1"
			},function (data) {
				console.log(data)
				let resArr = data.data.result;
				$scope.wlNameList = [];
				$scope.wlNameList.push(resArr[0])
				for(let i = 1,len = resArr.length;i<len;i++){
					for(let j = 0,jLen = $scope.wlNameList.length;j<jLen;j++){
						if(resArr[i].nameen==$scope.wlNameList[j].nameen){
							break
						}
						if(j==$scope.wlNameList.length-1){
							$scope.wlNameList.push(resArr[i])
						}
					}
				}
			},function(data){
				console.log(data)
			})
		}

		$scope.wlFilterFun = function(){
			$scope.pageNum = '1';
			getOrderList($scope,erp);
		}
		$scope.checkBoxFun = function(){
			console.log($scope.checkBoxFlag)
			$scope.pageNum = '1';
			getOrderList($scope,erp);
		}
		//留言功能
		$scope.nodeFlag = false;
		var domIndex;
		var noteId;
		$scope.nodeFun = function (item,index,ev) {
			ev.stopPropagation()
			$scope.nodeFlag = true;
			noteId = item.id;
			domIndex = index;
			$scope.erpnote = item.erpnote;
		}
		$scope.nodeCloseFun = function () {
			$scope.nodeFlag = false;
		}
		$scope.nodeSureFun = function () {
			var nodeText;
			nodeText = $scope.erpnote;
			if(!nodeText){
				layer.msg('请输入留言内容')
				return
			}
			erp.load()
			var ndData = {};
			ndData.payOrderId = noteId;
			ndData.erpnote = nodeText;
			console.log(JSON.stringify(ndData))
			erp.postFun('app/buyOrder/zhifadingdanbeizhu',JSON.stringify(ndData),function (data) {
				console.log(data)
				erp.closeLoad()
				if (data.data.statusCode==200) {
					layer.msg('修改成功')
					$scope.nodeFlag = false;
					$scope.erporderList[domIndex].erpnote = nodeText;
					// $('#c-mu-ord-table .node-text').eq(domIndex).text(nodeText);
					// $('#c-mu-ord-table .hide-notep').eq(domIndex).text(nodeText);
				} else {
					layer.msg('修改失败')
				}
			},function (data) {
				console.log(data)
				erp.closeLoad()
			})
			// $('.editmess-text').val('');
		}
		$scope.hqNodeFun = function (item,index,ev) {
			ev.stopPropagation()
			console.log(item)
			$scope.hqNodeFlag = true;
			noteId = item.id;
			$scope.hqNoteVal = item.waybillNote;
			domIndex = index;
			console.log($scope.hqNoteVal)
		}
		$scope.hqNodeSureFun = function () {
			if(!$scope.hqNoteVal){
				layer.msg('请输入留言内容')
				return
			}
			erp.load()
			var ndData = {};
			ndData.id = noteId;
			ndData.waybillNote = $scope.hqNoteVal;
			console.log(JSON.stringify(ndData))
			erp.postFun('erp/order/updateWaybillNote',JSON.stringify(ndData),function (data) {
				console.log(data)
				erp.closeLoad()
				if (data.data.statusCode==200) {
					layer.msg('修改成功')
					$scope.hqNodeFlag = false;
					$scope.erporderList[domIndex].waybillNote = $scope.hqNoteVal;
				} else {
					layer.msg('修改失败')
				}
			},function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		//商品留言
		$scope.spNoteFun = function(pItem,item,pIndex,index,ev){
			console.log(pItem)
			$scope.ordId = pItem.id;
			$scope.spId = item.id;
			$scope.parentIndex = pIndex;
			$scope.spIndex = index;
			$scope.spMessageflag = true;
			$scope.spMessVal = item.message;
			ev.stopPropagation()
			console.log($scope.ordId,$scope.spId,$scope.parentIndex,$scope.spIndex )
		}
		$scope.spMesSurnFun = function(){
			erp.load()
			var upJson = {};
			upJson.message = $scope.spMessVal;
			upJson.mixid = $scope.ordId+'_'+$scope.spId;
			console.log(upJson)
			erp.postFun('erp/order/insertLeaveMessage',JSON.stringify(upJson),function(data){
				console.log(data)
				erp.closeLoad()
				if (data.data.statusCode==200) {
					layer.msg('留言成功')
					$scope.erporderList[$scope.parentIndex].productList[$scope.spIndex].message=$scope.spMessVal;
					$scope.spMessVal = '';
				} else {
					layer.msg('留言失败')
				}
				$scope.spMessageflag = false;
			},function(data){
				console.log(data)
				erp.closeLoad()
			})
		}
		// $('.orders-table').on('mouseenter', '.remark-box', function () {
		//     if($.trim($(this).find('.cg-remark-text').text())||$.trim($(this).find('.sp-remark-text').text())){
		//         $(this).children('.remark-con').show();
		//     }
		// })
		// $('.orders-table').on('mouseleave', '.remark-box', function () {
		//     $(this).children('.remark-con').hide();
		// })
		$scope.remarkShowFun = function (ev) {
		    $(ev.target).siblings('.remark-con').show();
		    console.log('show')
		}
		$scope.remarkHideFun = function (ev) {
		    $(ev.target).siblings('.remark-con').hide();
		    console.log('hide')
		}

		//显示大图
		$('.orders-table').on('mouseenter','.sp-smallimg',function () {
			$(this).siblings('.hide-bigimg').show();
		})
		$('.orders-table').on('mouseenter','.hide-bigimg',function () {
			$(this).show();
		})
		$('.orders-table').on('mouseleave','.sp-smallimg',function () {
			$(this).siblings('.hide-bigimg').hide();
		})
		$('.orders-table').on('mouseleave','.hide-bigimg',function () {
			$(this).hide();
		})
		//给报关名字做修改
		$scope.speditFun = function (item,$event) {
			$($event.target).hide();//把自己隐藏掉
			$($event.target).parent().siblings('.edit-inp').removeAttr('disabled');
			// $('#c-zi-ord .edit-inp').removeAttr('disabled');
			$($event.target).siblings('.sp-par-p').show();
		}
		$scope.spcnsaveFun = function (item,$event) {
			erp.load();
			//获取中文报关名称
			var nameCn = $($event.target).parent().siblings('.edit-inp').val();
			var nameEn = item.cjproductnameen;
			var id = item.id;
			// alert(nameCn+'==='+nameEn+'---'+id)
			var upData = {};
			upData.id = id;
			upData.type = 'cn';
			upData.nameen = nameEn;
			upData.namecn = nameCn;
			upData.cjProductId = item.cjProductId;
			// nameen,namecn,id
			console.log(upData)
			console.log(JSON.stringify(upData));
			// return;
			erp.postFun('app/buyOrder/updateEnterName',JSON.stringify(upData),function (data) {
				console.log(data)
				// erp.closeLoad();
				if (data.data.result==1) {
					layer.msg('修改成功')
					$($event.target).parent().siblings('.hideinp-val').text(nameCn)
					erp.closeLoad();
					//显示编辑按钮
					$($event.target).siblings('.sp-cnedit-btn').show();
					//隐藏保存 取消的按钮
					$($event.target).siblings('.sp-par-p').hide();
					$($event.target).hide();
					//给这条商品设置禁止输入
					$($event.target).parent().siblings('.edit-inp').attr('disabled','true');

				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			},function (data) {
				erp.closeLoad();
				console.log(data)
			})
		}
		$scope.spcnqxFun = function (item,$event) {
			//显示编辑按钮
			$($event.target).siblings('.sp-cnedit-btn').show();
			//获取中文报关名称
			var nameCn = $($event.target).parent().siblings('.hideinp-val').text();
			//获取隐藏域中的值填入输入框
			// alert(nameCn+'==='+nameEn)
			$($event.target).parent().siblings('.edit-inp').val(nameCn);
			//给这条商品设置禁止输入
			$($event.target).parent().siblings('.edit-inp').attr('disabled','true');
			//隐藏保存 取消的按钮
			$($event.target).siblings('.sp-par-p').hide();
			$($event.target).hide();
		}
		$scope.spensaveFun = function (item,$event) {
			erp.load();
			//获取中文报关名称
			var nameCn = item.cjproductnamecn;
			//获取英文报关名称
			var nameEn = $($event.target).parent().siblings('.edit-inp').val();
			var id = item.id;
			// alert(nameCn+'==='+nameEn+'---'+id)
			var upData = {};
			upData.id = id;
			upData.type = 'en';
			upData.nameen = nameEn;
			upData.namecn = nameCn;
			upData.cjProductId = item.cjProductId;
			// nameen,namecn,id
			console.log(upData)
			console.log(JSON.stringify(upData));
			// return;
			erp.postFun('app/buyOrder/updateEnterName',JSON.stringify(upData),function (data) {
				console.log(data)
				// erp.closeLoad();
				if (data.data.result==1) {
					erp.closeLoad();
					layer.msg('保存成功')
					$($event.target).parent().siblings('.hideinp-val').text(nameEn)
					//显示编辑按钮
					$($event.target).siblings('.sp-cnedit-btn').show();
					//隐藏保存 取消的按钮
					$($event.target).siblings('.sp-par-p').hide();
					$($event.target).hide();
					//给这条商品设置禁止输入
					$($event.target).parent().siblings('.edit-inp').attr('disabled','true');

				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			},function (data) {
				erp.closeLoad();
				console.log(data)
			})
		}
		$scope.spenqxFun = function (item,$event) {
			//显示编辑按钮
			$($event.target).siblings('.sp-cnedit-btn').show();
			//获取中文报关名称
			//var nameCn = $($event.target).parent().siblings('.hideinp-val').text();
			var nameEn = $($event.target).parent().siblings('.hideinp-val').text();
			//获取隐藏域中的值填入输入框
			// alert(nameCn+'==='+nameEn)
			$($event.target).parent().siblings('.edit-inp').val(nameEn);
			//$($event.target).parent().parent().parent().siblings('.sp-sec-tr').children('.nameen-td').children('.edit-inp').val(nameEn);
			//给这条商品设置禁止输入
			$($event.target).parent().siblings('.edit-inp').attr('disabled','true');
			//隐藏保存 取消的按钮
			$($event.target).siblings('.sp-par-p').hide();
			$($event.target).hide();
		}
		//编辑sku
		$scope.bjSkuFun = function (ev) {
			$(ev.target).hide();//把自己隐藏掉
			$(ev.target).siblings('.bj-spsku').removeAttr('disabled');
			// $('#c-zi-ord .edit-inp').removeAttr('disabled');
			$(ev.target).siblings('.bjsame-btn').show();
		}
		$scope.bjSkuQxFun = function (ev) {
			//隐藏保存 取消的按钮
			$(ev.target).parent().find('.bjsame-btn').hide();
			//显示编辑按钮
			$(ev.target).siblings('.xg-spskubtn').show();
			var skuText = $(ev.target).siblings('.spsku-text').text();
			//获取隐藏域中的值填入输入框
			$(ev.target).siblings('.bj-spsku').val(skuText);
			//给这条商品设置禁止输入
			$(ev.target).siblings('.bj-spsku').attr('disabled','true');
		}
		$scope.bjSkuSureFun = function (ev,item) {
			var bjSkuInpVal = $.trim($(ev.target).siblings('.bj-spsku').val());
			// console.log(bjSkuInpVal)
			console.log(item)
			var id = item.id;
			var upData = {};
			upData.id = id;
			upData.sku = bjSkuInpVal;
			console.log(JSON.stringify(upData));
			// return;
			erp.postFun('app/buyOrder/updateSku',JSON.stringify(upData),function (data) {
				console.log(data)
				if (data.data.result==1) {
					erp.closeLoad();
					layer.msg('修改成功')
					$(ev.target).siblings('.spsku-text').text(bjSkuInpVal);
					//显示编辑按钮
					$(ev.target).siblings('.xg-spskubtn').show();
					//隐藏保存 取消的按钮
					$(ev.target).parent().find('.bjsame-btn').hide();
					//给这条商品设置禁止输入
					$(ev.target).siblings('.bj-spsku').attr('disabled','true');
				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			},function (data) {
				erp.closeLoad();
				console.log(data)
			})
		}
		//编辑海关号
		$scope.bjHghFun = function (ev) {
			$(ev.target).hide();//把自己隐藏掉
			$(ev.target).siblings('.bj-spsku').removeAttr('disabled');
			$(ev.target).siblings('.bjsame-btn').show();
		}
		$scope.bjHghQxFun = function (ev) {
			//隐藏保存 取消的按钮
			$(ev.target).parent().find('.bjsame-btn').hide();
			//显示编辑按钮
			$(ev.target).siblings('.xg-spskubtn').show();
			var skuText = $(ev.target).siblings('.spsku-text').text();
			//获取隐藏域中的值填入输入框
			$(ev.target).siblings('.bj-spsku').val(skuText);
			//给这条商品设置禁止输入
			$(ev.target).siblings('.bj-spsku').attr('disabled','true');
		}
		$scope.bjHghSureFun = function (ev,item) {
			var bjSkuInpVal = $.trim($(ev.target).siblings('.bj-spsku').val());
			// console.log(bjSkuInpVal)
			console.log(item)
			var id = item.id;
			var upData = {};
			upData.id = id;
			upData.cjProductId = item.cjProductId;
			upData.entrycode = bjSkuInpVal;
			console.log(JSON.stringify(upData));
			// return;
			erp.postFun('app/buyOrder/updateEntryCode',JSON.stringify(upData),function (data) {
				console.log(data)
				if (data.data.result==1) {
					erp.closeLoad();
					layer.msg('修改成功')
					// $(ev.target).siblings('.spsku-text').text(bjSkuInpVal);
					for(let i = 0,len = $scope.erporderList.length;i<len;i++){
						for(let j = 0,jLen = $scope.erporderList[i].productList.length;j<jLen;j++){
							if(item.cjProductId == $scope.erporderList[i].productList[j].cjProductId){
								$scope.erporderList[i].productList[j].entryCode = bjSkuInpVal;
							}else{
								console.log('不相同')
							}
						}
					}
					//显示编辑按钮
					$(ev.target).siblings('.xg-spskubtn').show();
					//隐藏保存 取消的按钮
					$(ev.target).parent().find('.bjsame-btn').hide();
					//给这条商品设置禁止输入
					$(ev.target).siblings('.bj-spsku').attr('disabled','true');
				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			},function (data) {
				erp.closeLoad();
				console.log(data)
			})
		}
		//录入追踪号
		$scope.lrFun = function (item,ev,index) {
			console.log(item)
			ev.stopPropagation();
			var $lrbtnObj = $(ev.target);
			$lrbtnObj.hide();
			$lrbtnObj.siblings().show();
		}
		$scope.qxlrFun = function (ev) {
			var $lrbtnObj = $(ev.target);
			$lrbtnObj.siblings('.lr-zzhbtn').siblings().hide();
			$lrbtnObj.siblings('.lr-zzhbtn').show();
			$lrbtnObj.siblings('.zzh-inp').val('');
		}
		$scope.surelrFun = function (item,ev,index) {
			var $lrbtnObj = $(ev.target);
			var lrordId,inpVal;
			lrordId = item.id;
			inpVal = $lrbtnObj.siblings('.zzh-inp').val();
			var lrData = {};
			lrData.logisticsNumber = $.trim(inpVal);
			lrData.id = lrordId;
			console.log(JSON.stringify(lrData))
			erp.load();
			erp.postFun('app/buyOrder/upLogisticsNumber',JSON.stringify(lrData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				if (data.data.result>0) {
					if($scope.selstu == 1){
						$scope.erporderList.splice(index,1);
						$scope.erpordTnum--;
						layer.msg('添加追踪号成功')
					}else{
						if ($('.seach-ordnumstu').is(':checked')) {
							$scope.erporderList.splice(index,1);
							$scope.erpordTnum--;
							layer.msg('添加追踪号成功')
						} else {
							layer.msg('修改追踪号成功')
							$lrbtnObj.siblings('.lr-zzhbtn').siblings().hide();
							$lrbtnObj.siblings('.lr-zzhbtn').show();
							$lrbtnObj.siblings('.zzh-inp').val('');
							$('.orders-table .track-nump').eq(index).text($.trim(inpVal));
						}
					}
				} else {
					layer.msg('添加追踪号失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}

		//CJ客户留言的弹框
		$scope.messageflag = false;
		var mesOrdId;
		var messageCon;
		var mesIndex;
		$scope.messageimgFun = function (item,ev,index) {
			// $event.stopPropagation();
			$scope.messageflag = true;

			$scope.messageCon = item.NOTE_ATTRIBUTES;
			mesIndex = index;
			messageCon = $('.orders-table .mes-hidetest').eq(index).text();
			$('.custom-mes').val(messageCon);
			mesOrdId = item.ID;
			console.log(messageCon+'----'+mesOrdId)
		}
		$scope.messcloseBtnFun = function () {
			$scope.messageflag = false;
			$scope.messageCon = '';
		}
		$scope.cusmesSurnFun = function () {
			var editTextCon=$('.custom-mes').val();
			var mesData = {};
			mesData.orderNum = mesOrdId;
			mesData.note = editTextCon;
			console.log(JSON.stringify(mesData))
			erp.postFun('app/order/upOrderNote',JSON.stringify(mesData),function (data) {
				console.log(data)
				$scope.messageflag = false;
				if(data.data.result>0){
					layer.msg('修改成功')
					$('.orders-table .mes-hidetest').eq(mesIndex).text(editTextCon);
				}else{
					layer.msg('修改失败')
				}
			},function (data) {
				console.log(data)
				layer.msg('网络错误')
			})
		}
		//sale-man留言的弹框
		$scope.ywymesFlag = false;
		$scope.ywymesimgFun = function (item,$event) {
			// $event.stopPropagation();
			$scope.ywymesFlag = true;
			$scope.ywymessageCon = item.erpnote;
		}
		$scope.ywymescloseBtnFun = function () {
			$scope.ywymesFlag = false;
			$scope.ywymessageCon = '';
		}

		//给子订单里面的订单添加选中非选中状态
		checkFun();

		//给导航添加点击事件
		$('.e-customer-ord').click(function () {
			$('.e-customer-ord').css({
				color: '#646464',
				backgroundColor: '#d5d5d5'
			})
			$(this).css({
				color : '#000',
				backgroundColor: '#fff'
			})
			//获取状态中传的参数
			var csDataObj = {};
			var setCsTime = new Date().getTime();
			csDataObj.tj = $('.c-seach-country').val();
			csDataObj.val = $.trim($('.c-seach-inp').val());
			csDataObj.btime = $('#c-data-time').val();
			csDataObj.etime = $('#cdatatime2').val();
			console.log(csDataObj)
			csDataObj = JSON.stringify(csDataObj)
			localStorage.setItem('ziCs', csDataObj);
			localStorage.setItem('setCsTime',setCsTime);
		})

		$scope.selfun1 = function (num) {//未生成追踪号
			$scope.pageNum = '1';
			$scope.selstu = num;
			$('.peiqi-btn').removeClass('peiqi-btn-act')
			getOrderList($scope,erp);
		}
		$scope.addYfhStuFlag = true;
		$scope.selfun2 = function (num) {//未生成追踪号
			$scope.pageNum = '1';
			$scope.matchStatus = num;
			getOrderList($scope,erp);
			if (num==1||num==3) {
				$scope.addYfhStuFlag = true;
			} else {
				$scope.addYfhStuFlag = false;
			}
		}

		$scope.backtolist = function(){
			$scope.selstu = 1
			$scope.pageNum = '1';
			$('.peiqi-btn').removeClass('peiqi-btn-act')
			getOrderList($scope,erp);
		}
		//获取仓库
		erp.getFun('app/storage/getStorage',function (data) {
		    console.log(data)
		    var obj = JSON.parse(data.data.result);
		    console.log(obj)
		    $scope.ckArr = obj;
		    $scope.whichOneCk = $scope.ckArr[0].id;
		},function (data) {
		    erp.closeLoad();
		    console.log('仓库获取失败')
		})
		//待配齐 已配齐切换仓库查找订单
		$scope.ckChangeFun = function () {
			$scope.pageNum = '1';
			getOrderList($scope,erp);
		}

		// 日期插件 初始化日期
		// $('#c-data-time').dcalendarpicker({format:'yyyy-mm-dd'});
		//鼠标划过事件
		//点击事件
		clickAndMouse();
		//批量提交到已发货
		$scope.isaddyfhFlag = false;
		var addyfhIds;
		$scope.bulkAddYfhFun = function () {
			var addyfhCount = 0;
			addyfhIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					addyfhCount++;
					addyfhIds+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			if (addyfhCount>0) {
				$scope.isaddyfhFlag = true;
			} else {
				$scope.isaddyfhFlag = false;
				layer.msg('请选择订单')
			}
		}
		$scope.cancelAddyfhFun = function () {
			$scope.isaddyfhFlag = false;
			addyfhIds = '';
		}
		$scope.sureBulkaddFun = function () {
			$scope.currtpage = 1;
			erp.load();
			var addyfhData = {};
			addyfhData.ids = addyfhIds;
			addyfhData.type = 6;
			console.log(JSON.stringify(addyfhData))
			erp.postFun('app/buyOrder/nextFlow',JSON.stringify(addyfhData),function (data) {
				console.log(data)
				$scope.isaddyfhFlag = false;
				if (data.data.result==true) {
					getOrderList($scope,erp);
				} else {
					layer.msg('批量提交到已发货失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//单个提交到已发货
		$scope.singleisaddyfhFlag = false;
		var singleAddYfhId,singleAddYfhIndex;
		$scope.singleAddyfhFun = function (item,index) {
			$scope.singleisaddyfhFlag = true;
			singleAddYfhId = item.id;
			singleAddYfhIndex = index;
			console.log(singleAddYfhId)
			console.log(singleAddYfhIndex)
		}
		$scope.singleCancelFun = function () {
			$scope.singleisaddyfhFlag = false;
		}
		$scope.singleSureFun = function () {
			erp.load();
			var addyfhData = {};
			addyfhData.ids = singleAddYfhId;
			addyfhData.type = $scope.orderStatus;
			console.log(JSON.stringify(addyfhData))
			erp.postFun('app/buyOrder/nextFlow',JSON.stringify(addyfhData),function (data) {
				console.log(data)
				$scope.singleisaddyfhFlag = false;
				layer.closeAll("loading")
				if (data.data.result==true) {
					$scope.erporderList.splice(singleAddYfhIndex,1);
					$scope.erpordTnum--;
				} else {
					if (paiedOrder) {
						layer.msg('批量提交到待发货失败')
					}
					if (waitShipOrder) {
						layer.msg('批量提交到已发货失败')
					}
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//重新处理
		$scope.cxclFlag = false;
		$scope.iscxclFun = function () {
			var cxclNum = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					cxclNum++;
				}
			})
			if (cxclNum<1) {
				layer.msg('请选择订单')
			} else {
				$scope.cxclFlag = true;
			}
		}
		$scope.iscxclCloseFun = function () {
			$scope.cxclFlag = false;
		}
		$scope.iscxclSureFun = function () {
			erp.load();
			var cxclids = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					cxclids+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			var cxclData = {};
			cxclData.ids = cxclids;
			console.log(JSON.stringify(cxclData))
			erp.postFun('app/order/initERPOrder',JSON.stringify(cxclData),function (data) {
				console.log(data);
				$scope.cxclFlag = false;
				if(data.data.result>0){
					getOrderList($scope,erp);
					// $scope.currtpage = 1;
					// var erpData = {};
					// if(muId!=''){
					// 	erpData.id = muId;
					// }else {
					// 	erpData.id = '';
					// }
					// erpData.cjOrderDateBegin = $('#c-data-time').val();
					// erpData.cjOrderDateEnd = $('#cdatatime2').val();
					// erpData.status = '6';
					// erpData.ydh = 'all';
					// erpData.page = 1;
					// erpData.limit = $('#page-sel').val()-0;
					// seltjFun(erpData);
					// console.log(JSON.stringify(erpData))
					// erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
					// 	console.log(data)
					// 	layer.closeAll("loading")
					// 	var erporderResult = data.data;//存储订单的所有数据
					// 	// erporderResult = JSON.parse(data.data.orderList)
					// 	$scope.erpordTnum = erporderResult.orderCount;
					// 	$scope.erporderList = erporderResult.ordersList;
					// 	console.log($scope.erporderList)
					// 	dealpage ();
					// },function () {
					// 	layer.closeAll("loading")
					// 	layer.msg('订单获取列表失败')
					// 	// alert(2121)
					// })
				}else{
					layer.closeAll("loading")
					layer.msg('重新处理订单失败')
				}
			},function (data) {
				layer.closeAll("loading")
				layer.msg('网络错误')
				console.log(data)
			})
		}
		// erp.postFun('app/storagedo/getStorageDoList',{},function(data){
		// 	console.log(data)
		// 	$scope.storeList = [];
		// 	var stoArr = data.data.list;
		// 	if(stoArr&&JSON.stringify(stoArr)!='[]'){
		// 		for(var i = 0,len=stoArr.length;i<len;i++){
		// 			if(stoArr[i].storageName.indexOf('直发仓')!=-1){
		// 				$scope.storeList.push(stoArr[i])
		// 			}
		// 		}
		// 	}
		// 	console.log($scope.storeList)
		// },function(data){
		// 	console.log(data)
		// })
		//选择仓库
		$scope.oneSelStoreFun = function(item){
			$scope.selCkFlag = true;
			$scope.itemId = item.id;
		}
		$scope.sureSelCkFun = function(){
			if(!$scope.changeStoreName){
				layer.msg('请选择仓库')
				return
			}
			console.log($scope.itemId)
			var upJson = {};
			upJson.id = $scope.itemId;
			upJson.storageId = $scope.changeStoreName;
			erp.postFun('erp/order/updPayOrderId',JSON.stringify(upJson),function(data){
				console.log(data)
				layer.msg(data.data.message)
				if(data.data.statusCode==200){
					$scope.selCkFlag = false;
					getOrderList($scope,erp);
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}
		//单独操作重新处理订单
		$scope.onecxclFlag = false;
		var cxclOrdId, cxclOrdIndex;
		$scope.oneiscxclFun = function (item,index) {
			$scope.onecxclFlag = true;
			cxclOrdId = item.id;
			cxclOrdIndex = index;
		}
		$scope.isonecxclCloseFun = function () {
			$scope.onecxclFlag = false;
		}
		$scope.isonecxclSureFun = function () {
			erp.load();
			var cxclData = {};
			cxclData.ids = cxclOrdId;
			cxclData.orderType = "CJPAY";
			console.log(JSON.stringify(cxclData))
			erp.postFun('app/order/initERPOrder',JSON.stringify(cxclData),function (data) {
				console.log(data);
				$scope.onecxclFlag = false;
				if(data.data.result>0){
					getOrderList($scope,erp);
				}else{
					layer.closeAll("loading")
					layer.msg('重新处理订单失败')
				}
			},function (data) {
				layer.closeAll("loading")
				layer.msg('网络错误')
				console.log(data)
			})
		}

		//编辑弹框
		$scope.editFlag = false;
		$scope.editFun = function (item,$event,index) {
			$scope.itemIndex = index;
			$event.stopPropagation();
			$scope.editFlag = true;
			 console.log(item)
			 $scope.itemData = item;
			 // console.log(item.CITY)
			 // console.log(item.city)
			 $scope.customerName = item.CUSTOMERNAME;
			 $scope.country = item.country;
			 $scope.province=item.province;
			 $scope.city=item.city;
			 $scope.shipAddress1=item.shippingAddress;
			 $scope.shipAddress2=item.shippingAddress2;
			 $scope.zip=item.zip;
			 $scope.phone=item.phone;
			 $scope.logisticName=item.logisticName;
		}
		//取消按钮
		$scope.closeFun = function () {
			$scope.editFlag = false;
		}
		//确定按钮
		$scope.confirmEditFun = function () {
			if(!$scope.customerName){
				layer.msg('请输入收件人')
				return
			}
			if(!$scope.shipAddress1){
				layer.msg('请输入地址1')
				return
			}
			if(!$scope.city){
				layer.msg('请输入城市')
				return
			}
			// if(!$scope.province){
			// 	layer.msg('请输入州')
			// 	return
			// }
			if(!$scope.zip){
				layer.msg('请输入邮编')
				return
			}
			// if(!$scope.phone){
			// 	layer.msg('请输入收件人电话')
			// 	return
			// }
			erp.load();
			var pushData = {};
			pushData.id=$scope.itemData.id;
			// pushData.salesman=$scope.itemData.salesman;
			pushData.customerName = $scope.customerName;
			pushData.country = $scope.country_code;
			pushData.province=$scope.province;
			pushData.city=$scope.city;
			pushData.shipAddress1=$scope.shipAddress1;
			pushData.shipAddress2=$scope.shipAddress2;
			pushData.zip=$scope.zip;
			pushData.phone=$scope.phone;
			// pushData.logisticName=$scope.logisticName;
			console.log(pushData);
			console.log(JSON.stringify(pushData))
			erp.postFun('app/buyOrder/updateERPOrder',JSON.stringify(pushData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.editFlag = false;
				if(data.data.result==1){
					layer.msg('修改成功')
					console.log($scope.erporderList[$scope.itemIndex])
					$scope.erporderList[$scope.itemIndex].CUSTOMERNAME= $scope.customerName;
					// $scope.erporderList[$scope.itemIndex].country_code = $scope.country;
					$scope.erporderList[$scope.itemIndex].province = $scope.province;
					$scope.erporderList[$scope.itemIndex].city = $scope.city;
					$scope.erporderList[$scope.itemIndex].shippingAddress = $scope.shipAddress1;
					$scope.erporderList[$scope.itemIndex].shippingAddress2 = $scope.shipAddress2;
					$scope.erporderList[$scope.itemIndex].zip = $scope.zip;
					$scope.erporderList[$scope.itemIndex].phone = $scope.phone;
					console.log($scope.erporderList[$scope.itemIndex])
				}else{
					layer.msg('修改失败')
				}
			},function (data) {
				layer.closeAll("loading")
				layer.msg('修改响应失败')
				console.log(data)
			})
		}
		//对订单单独操作的下拉框函数
		$scope.oneisydFlag = false;//单独操作生成运单号的弹框
		$scope.onesuccscydnumflag = false;//单独操作生成运单号成功失败的提示框
		$scope.onescydhFunclick = function (item,$event) {
			console.log(item)
			// console.log(ordItem)
			$scope.ddepackNum=0;
			$scope.bdepackNum=0;
			$scope.oneHcepackNum = 0;//含磁epack
			$scope.oneHfmEpackNum = 0;//含粉末
			$scope.uspsNum = 0;
			$scope.ddyzxbNum = 0;//带电邮政小包数量
			$scope.bdyzxbNum = 0;//不带电邮政小包数量
			$scope.qtwlordNum=0;
			$scope.uspsPlusNum = 0;
			$scope.gzepackNum = 0;//膏状E邮宝
			$scope.showindex = 0;//控制哪种状态可以打印运单
			$scope.ytNum = 0;//云途
			$scope.onedhlddNum = 0;//带电dhl
			$scope.onedhlnotdNum = 0;//不带电dhl
			$scope.dhlGfNum = 0;//dhl官方转
			$scope.dhlOfficialNum=0;//dhl官方
			$scope.usps2PlusNum = 0;
			$scope.epack2yanwen = 0;
			$scope.nfSfNum = 0;
			$scope.ttSfNum = 0;
			$scope.nfOrTtNum = 0;
			$scope.usZhwlNum = 0;
			$scope.yanWenNum = 0;
			$scope.jewelNum = 0;
			$scope.jewelPlusNum = 0;
			$scope.dgEpacketNum = 0;
			$scope.bHepacketNum = 0;
			$scope.sfcBrazilLineNum = 0;
			$scope.ylColumbiaNum = 0;
			$scope.ylPeruNum = 0;
			usps2uspsPlusIds = '';
			epack2ywIds = '';
			$scope.hkDhlNum = 0;
			$scope.sanTaiNum = 0;
			$scope.postNlCount = 0;
			$scope.cjCodNum=0;
			$scope.cjpacketSeaNum = 0;
			$scope.euroOrdinarNum = 0;
			var sTAuIds = '',
				sTCaIds = '',
				sTDeZxIds = '',
				sTUsIds = '',
				sTUsDdIds = '',
				sTUsBddIds = '',
				sTDeThIds = '',
				sTMxIds = '',
				yTFrIds = '',
				yTAtIds = '',
				yTSeIds = '',
				yTGbDdIds = '',
				yTGbBddIds = '',
				yTBrIds = '',
				yTEsIds = '',
				yTBddIds = '',
				yTYdsKrIds = '',
				yTDdIds = '',
				cjpacketCazxIds = '',
				euroOrdinarGbIds = '',
				euroOrdinarDeIds = '',
				euroOrdinarFrIds = '',
				euroOrdinarBeIds = '',
				euroOrdinarItIds = '',
				stGBIds = '';
			$scope.oneordId = item.id;
			$scope.cjpacketSeaExpCount = 0;
			$scope.teDingGuoJiaCjpacketCount = 0;
			console.log(item.logisticName)
			var itemSpline = $($event.target).parent().parent().siblings('.erpd-toggle-tr').find('.pro-item-sp');
			var $sptdObj = $($event.target).parent().parent().parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
			console.log($sptdObj.children('.sp-sx-span').text())
			var isCjPacketFlag = true;
			var spCountNum = 0;
			if(item.orderWeight>285 && item.country_code == 'US'){
				spCountNum = item.productList.length;
				var strSpSxList1 = '';
				if (spCountNum > 0) {
					for (var i = 0; i < spCountNum; i++) {
						if(item.productList[i].property.substr(0,1)==','){
							strSpSxList1 += item.productList[i].property.substr(1) + ',';
						}else{
							strSpSxList1 += item.productList[i].property + ',';
						}
					}
				}
				var sxArr1 = strSpSxList1.split(',');
				sxArr1.pop();
				console.log(sxArr1)
				var oneIsgjCommonFlag = false;
				for (var j = 0; j < sxArr1.length; j++) {
					if (sxArr1[j] != '普货') {
						oneIsgjCommonFlag = false;
						break;
					} else {
						oneIsgjCommonFlag = true;
					}
				}
				if (oneIsgjCommonFlag&&(item.logisticName=='Wedenpost'||item.logisticName=='ePacket'||item.logisticName=='Pos Malaysia'||item.logisticName=='MYSG'||item.logisticName=='Bpost'||item.logisticName=='Singpost'||item.logisticName=='HKpost'||item.logisticName=='Turkey Post'||item.logisticName=='Swiss Post'||item.logisticName=='China Post Registered Air Mail'||item.logisticName=='La Poste'||item.logisticName=='DHL Paket'||item.logisticName=='BPost+'||item.logisticName=='Korea Post'||item.logisticName=='CJ Liquid'||item.logisticName=='CJ Liquid Direct Line'||item.logisticName=='CJ Liquid Post'||item.logisticName=='Grand Slam'||item.logisticName=='YanWen'||item.logisticName=='S.F China Domestic'||item.logisticName=='YTO China Domestic'||item.logisticName=='South Africa Special Line'||item.logisticName=='Brazil special line'||item.logisticName=='Electric PostNL'||item.logisticName=='CJPacket')) {
					$scope.usZhwlNum++;
					$scope.showindex = 25;
					isCjPacketFlag = false;
				}
			}
			if(isCjPacketFlag){
				if (item.logisticName=='ePacket') {
					if ($sptdObj.children('.sp-sx-span').text().indexOf('电')>=0) {
						$scope.ddepackNum++;
						$scope.showindex = 1;
						console.log('判断带电的条件')
					} else if ($sptdObj.children('.sp-sx-span').text().indexOf('膏') >= 0||$sptdObj.children('.sp-sx-span').text().indexOf('液') >= 0) {
						if(isOneSxFun(itemSpline,'HAVE_CREAM')||$sptdObj.children('.sp-sx-span').text().indexOf('液') >= 0){
							$scope.gzepackNum++;
							$scope.showindex = 9;
						}else{
							$scope.oneHcepackNum++;
							$scope.showindex = 13;
						}
					} else if($sptdObj.children('.sp-sx-span').text().indexOf('磁')>=0){
						$scope.oneHcepackNum++;
						$scope.showindex = 13;
						console.log('判断含磁E邮宝的条件')
					}
					// else if($sptdObj.children('.sp-sx-span').text().indexOf('粉')>=0){
					// 	$scope.oneHfmEpackNum++;
					// 	$scope.showindex = 18;
					// 	console.log('含粉末')
					// }
					else {
						$scope.bdepackNum++;
						$scope.showindex = 2;
						console.log('判断e邮宝不带电的条件')
					}
				}
				else if (item.logisticName=='CJ Normal Express'){
					if(1000<item.orderWeight&&item.orderWeight<=1600){
						$scope.nfSfNum++;
						$scope.showindex = 15;
					}else if(item.orderWeight>1600||item.orderWeight<=1000){
						$scope.ttSfNum++;
						$scope.showindex = 16;
					}
					// else {
					// 	$scope.nfOrTtNum++;
					// 	$scope.showindex = 17;
					// }
				}
				else if (item.logisticName=='DHL') {//$(this).parent().parent().siblings('.wl-ord-td').children('.wl-name-p').text()
					if ($sptdObj.children('.sp-sx-span').text().indexOf('电')>=0) {
						$scope.onedhlddNum++;
						$scope.showindex = 11;
						console.log('判断带电dhl的条件')
					} else {
						if (item.orderWeight<2000) {
							$scope.dhlGfNum++;
							$scope.showindex = 19;
						} else {
							$scope.onedhlnotdNum++;
							$scope.showindex = 12;
						}
						// $scope.onedhlnotdNum++;
						// $scope.showindex = 12;
						// console.log('判断不带电dhl的条件')
					}
				}
				else if(item.logisticName=='DHL Official'){
					let itemSpLineLength = item.productList.length;
					let isNullHghFlag = false;
					if (itemSpLineLength > 0) {
						for (let i = 0; i < itemSpLineLength; i++) {
							if(!item.productList[i].entryCode){
								isNullHghFlag = true;
								break;
							}
						}
					}
					if(isNullHghFlag){
						layer.msg('请为该订单下的商品填写海关号')
						return
					}else{
						$scope.dhlOfficialNum++;
						$scope.showindex = 20;
					}
				}
				else if(item.logisticName=='USPS'){
					$scope.uspsNum++;
					$scope.showindex = 3;
					usps2uspsPlusIds = item.id;
					// $scope.usps2PlusNum++;
					console.log('判断usps物流的条件')
				}
				else if(item.logisticName=='China Post Registered Air Mail'){
					if ($sptdObj.children('.sp-sx-span').text().indexOf('电')>=0) {
						$scope.ddyzxbNum++;
						$scope.showindex = 5;
						console.log('判断邮政小包带电的条件')
					} else {
						console.log($scope.bdyzxbNum)
						$scope.bdyzxbNum++;
						$scope.showindex = 6;
						console.log('判断邮政小包不带电的条件')
						console.log($scope.bdyzxbNum)
					}
				}
				else if (item.logisticName == 'DG Epacket') {
					$scope.dgEpacketNum++;
					$scope.showindex = 37;
				}
				else if (item.logisticName == 'BJ cosmetics epacket') {
					$scope.bHepacketNum++;
					$scope.showindex = 38;
				}
				else if (item.logisticName == 'SFC Brazil line') {
					$scope.sfcBrazilLineNum++;
					$scope.showindex = 39;
				}
				else if(item.logisticName=='USPS+'){
					$scope.uspsPlusNum++;
					$scope.showindex = 7;
					console.log('判断usps+物流的条件')
				}
				else if(item.logisticName.indexOf('YunExpress')>0){
					$scope.ytNum++;
					$scope.showindex = 10;
					console.log('判断云途物流的条件')
				}
				else if(item.logisticName == 'YanWen'){
					if(item.orderWeight <= 2000){
						var itemSfthSpNum = item.productList.length;
						var strSfthSpSxList = '';
						if (itemSfthSpNum > 0) {
							for (var i = 0; i < itemSfthSpNum; i++) {
								strSfthSpSxList += item.productList[i].property + ',';
							}
						}
						var sfthSxArr = strSfthSpSxList.split(',');
						sfthSxArr.pop();
						console.log(sfthSxArr)
						var sfthIsCommonFlag = false;
						for (var j = 0; j < sfthSxArr.length; j++) {
							if (sfthSxArr[j]&&sfthSxArr[j] != '普货') {
								sfthIsCommonFlag = false;
								break;
							} else {
								sfthIsCommonFlag = true;
							}
							console.log(sfthIsCommonFlag)
						}
						console.log(sfthIsCommonFlag)
						if (sfthIsCommonFlag) {
							$scope.showindex = 26;
							$scope.yanWenNum++;
						}else{
							$scope.showindex = 4;
							$scope.qtwlordNum++;
						}
					}
				}
				else if (item.logisticName == 'Jewel Shipping') {
					$scope.jewelNum++;
					$scope.showindex = 30;
				}
				else if (item.logisticName == 'Jewel Shipping+') {
					$scope.jewelPlusNum++;
					$scope.showindex = 31;
				}
				else if (item.logisticName == 'Jewel Shipping Flat' || item.logisticName == 'Jewel Shipping Flat+') {
					$scope.jewelPlusNum++;
					$scope.showindex = 36;
				}
				else if (item.logisticName == 'YL Columbia line') {
					$scope.ylColumbiaNum++;
					$scope.showindex = 40;
				}
				else if (item.logisticName == 'YL Peru line') {
					$scope.ylPeruNum++;
					$scope.showindex = 41;
				}
				else if (item.logisticName == 'CJPacket SEA Express' || item.logisticName == 'CJPacket JL Express') {
					$scope.cjpacketSeaExpCount++;
					$scope.showindex = 42;
					// console.log('嘉里空运')
				}
				else if (item.logisticName == 'DHL HongKong') {
					$scope.hkDhlNum++;
					$scope.showindex = 34;
				}
				else if(item.logisticName == 'CJPacket Euro Ordinary'){
					if(item.country_code == 'GB' || item.country_code == 'DE' || item.country_code == 'FR' || item.country_code == 'BE' || item.country_code == 'IT'){
						$scope.euroOrdinarNum++;
						$scope.showindex = 51;
					}
					if(item.country_code == 'GB'){
						euroOrdinarGbIds += item.id;
					}else if(item.country_code == 'DE'){
						euroOrdinarDeIds += item.id;
					}else if(item.country_code == 'FR'){
						euroOrdinarFrIds += item.id;
					}else if(item.country_code == 'BE'){
						euroOrdinarBeIds += item.id;
					}else if(item.country_code == 'IT'){
						euroOrdinarItIds += item.id;
					}
				}
				else if(item.logisticName == 'CJPacket'){
					console.log(item.logisticName)
					var itemSfthSpNum = item.productList.length;
					var strSfthSpSxList = '';
					if (itemSfthSpNum > 0) {
						for (var i = 0; i < itemSfthSpNum; i++) {
							strSfthSpSxList += item.productList[i].property + ',';
						}
					}
					var sxArr1 = strSfthSpSxList.split(',');
					sxArr1.pop();
					let isHaveDianOrBatteryFlag = isHaveDianOrBatteryFun(sxArr1)
					if(item.country_code=='AU'){
						$scope.sanTaiNum++;
						sTAuIds = item.id;
						$scope.showindex = 33;
					}else if(item.country_code=='US'){
						$scope.sanTaiNum++;
						$scope.showindex = 33;
						if(isHaveDianOrBatteryFlag){
							sTUsDdIds = item.id;
						}else{
							sTUsBddIds = item.id;
						}
					}else if(item.country_code=='CA'){
						$scope.sanTaiNum++;
						cjpacketCazxIds = item.id;
						$scope.showindex = 33;
					}else if(item.country_code=='DE'){
						// if(sxBooleanFun1(sxArr1,'','BATTERY','ELECTRONIC','','')){
							//德国专线
							$scope.sanTaiNum++;
							sTDeThIds = item.id;
							$scope.showindex = 33;
						// }else{
						// 	//德国专线特惠
						// 	$scope.sanTaiNum++;
						// 	sTDeZxIds = item.id;
						// 	$scope.showindex = 33;
						// }
					}else if(item.country_code=='MX'){
						$scope.sanTaiNum++;
						sTMxIds = item.id;
						$scope.showindex = 33;
					}

					else if(item.country_code=='AT' || item.country_code=='CH' || item.country_code=='SE' || item.country_code=='FR' || item.country_code=='NL' || item.country_code=='BE' || item.country_code=='LU'){
						$scope.sanTaiNum++;
						// $scope.showindex = 33;
						yTDdIds = item.id;
						// if($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0){
						// 	yTDdIds = item.id;
						// }else {
						// 	yTBddIds = item.id;
						// }
					}else if(item.country_code=='IT' || item.country_code=='DK'){//不需要判断是否带电 mode按带电传
						$scope.sanTaiNum++;
						$scope.showindex = 33;
						yTDdIds = item.id;
					}
					else if(item.country_code=='IN'||item.country_code=='FI'){
						$scope.sanTaiNum++;
						$scope.showindex = 33;
						if($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0){
							yTGbDdIds = item.id;
						}else {
							yTGbBddIds = item.id;
						}
					}else if(item.country_code=='GB'){
						$scope.sanTaiNum++;
						$scope.showindex = 33;
						stGBIds = item.id;
					}
					else if(item.country_code=='KR'){
						$scope.sanTaiNum++;
						$scope.showindex = 33;
						yTYdsKrIds = item.id;
					}else if(item.country_code=='BR'){
						$scope.sanTaiNum++;
						yTBrIds = item.id;
						$scope.showindex = 33;
					}else if(item.country_code=='ES'){
						$scope.sanTaiNum++;
						yTEsIds = item.id;
						$scope.showindex = 33;
					}else if(item.country_code=='TH'||item.country_code== 'MY'||item.country_code== "PH"||item.country_code== 'VN'||item.country_code== 'SG'||item.country_code== 'TW'||item.country_code== 'ID'){
						$scope.teDingGuoJiaCjpacketCount++;
						$scope.showindex = 33;
						$scope.sanTaiNum++;
					}else{
						$scope.qtwlordNum++;
						$scope.showindex = 4;
					}
				}
				else if(item.logisticName == 'CJPacket-Tha'||item.logisticName == 'CJPacket-Supplier'){
					if(item.country_code=='TH'||item.country_code== 'VN'){
						$scope.teDingGuoJiaCjpacketCount++;
						$scope.showindex = 33;
						$scope.sanTaiNum++;
					}else{
						$scope.qtwlordNum++;
						$scope.showindex = 4;
					}
				}
				else if(item.logisticName == 'PostNL'){
					$scope.postNlCount++;
					$scope.showindex = 43;
				}
				else if(item.logisticName == 'CJCOD'){
					$scope.cjCodNum++;
					$scope.showindex = 44;
				}
				else if(item.logisticName == 'CJPacket-Sea' || item.logisticName == 'CJPacket Sea'){
					$scope.cjpacketSeaNum++;
					$scope.showindex = 50;
				}
				else {
					$scope.qtwlordNum++;
					$scope.showindex = 4;
					console.log('判断其它物流的条件')
				}
			}
			console.log($scope.showindex)
			// console.log(item.ID)
			$scope.oneisydFlag = true;//单独操作生成运单号的弹框
			$scope.cjCodFun = function () {//泰腾顺丰
				if($('.oneqd-sel44').val()=='请选择'){
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel44').val();
				updata.enName = 'CJCOD';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.postNlFun = function () {//泰腾顺丰
				if($('.qd-onesel43').val()=='请选择'){
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-onesel43').val();
				updata.enName = '美国专线';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.cjpacketSeaFun = function () {//泰腾顺丰
				if($('.oneqd-sel50').val()=='请选择'){
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel50').val();
				updata.enName = 'CJPacket Sea';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.cjpacketSea = function(){
				var whereTarget;
				if ($('.oneqd-sel42').val() == '请选择') {
					layer.msg('请选地区');
					return;
				} else if ($('.oneqd-sel42').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.oneqd-sel42').val() == '义乌') {
					whereTarget = 'YW'
				}
				var updata = {};
				updata.ids = $scope.oneordId;
				updata.orderType="CJPAY";
				erp.postFun('erp/cjorder/initKerryLogisticsModel', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.statusCode == 200) {
						var diQu = '';
						if (whereTarget == 'SZ') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.shenzhen = diQu;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.ylColumbiaFun = function () {//易联哥伦比亚专线
				var whereTarget;
				if ($('.oneqd-sel40').val() == '请选择') {
					layer.msg('请选地区');
					return;
				} else if ($('.oneqd-sel40').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.oneqd-sel40').val() == '义乌') {
					whereTarget = 'YW'
				}
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "QYIWDUF1235#易联哥伦比亚专线";
				updata.enName = 'YL Columbia line';
				updata.orderType="CJPAY";
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var diQu = '';
						if (whereTarget == 'SZ') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.shenzhen = diQu;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.yanWenFun26 = function (stu) {//南风顺丰
				if ($scope.yanWenNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-onesel26').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				if(!$scope.whereYanWen){
					layer.msg('请选择地区')
					return
				}
				if ($('.scyd-btn26').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-onesel26').val();
				updata.enName = 'YanWen';
				updata.orderType="CJPAY";
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						let diQu = '';
						if ($scope.whereYanWen == 'shenZhen') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.shenzhen = diQu;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.ylPeruFun = function () {//易联
				var whereTarget;
				if ($('.oneqd-sel41').val() == '请选择') {
					layer.msg('请选地区');
					return;
				} else if ($('.oneqd-sel41').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.oneqd-sel41').val() == '义乌') {
					whereTarget = 'YW'
				}
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "LXJHPUUI952#易联秘鲁专线";
				updata.enName = 'YL Peru line';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var diQu = '';
						if (whereTarget == 'SZ') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.shenzhen = diQu;
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.dgEpacketFun = function () {
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "DGEUBA#DG Epacket";
				updata.enName = 'DG Epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					console.log(data)
					// if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)

						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.bjEpacketFun = function () {
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "BEUBH#BJ cosmetics epacket";
				updata.enName = 'BJ cosmetics epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					console.log(data)
					// if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)

						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.sfcBrazilLineFun = function () {
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "LAEXP#SFC Brazil line";
				updata.enName = 'SFC Brazil line';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					console.log(data)
					// if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)

						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.hkDhlFun = function () {
				if ($('.oneqd-sel34').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel34').val();
				updata.enName = 'DHL HongKong';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.cjpackeEuroOrdinaryFun = function(stu){
				if ($scope.euroOrdinarNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn51').hasClass('btn-active1')) {
					return;
				}
				let stCsArr = [];
				let cjpacketIds = '';
				if (euroOrdinarGbIds != '') {
					stCsArr.push(stCsFun(euroOrdinarGbIds, 'FU', '联油通挂号TR48标准服务'))
					cjpacketIds += euroOrdinarGbIds;
				}
				if (euroOrdinarDeIds != '') {
					stCsArr.push(stCsFun(euroOrdinarDeIds, 'A6', '4PX联邮通挂号'))
					cjpacketIds += euroOrdinarDeIds;
				}
				if (euroOrdinarFrIds != '') {
					stCsArr.push(stCsFun(euroOrdinarFrIds, 'PX', '4PX联邮通Y优先普货'))
					cjpacketIds += euroOrdinarFrIds;
				}
				if (euroOrdinarBeIds != '') {
					stCsArr.push(stCsFun(euroOrdinarBeIds, 'ED', '泛欧挂号'))
					cjpacketIds += euroOrdinarBeIds;
				}
				if (euroOrdinarItIds != '') {
					stCsArr.push(stCsFun(euroOrdinarItIds, 'IO', '联邮通意大利专线挂号'))
					cjpacketIds += euroOrdinarItIds;
				}
				erp.load();
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'CJPacket Euro Ordinary';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateCJPacketOrderLogistic', JSON.stringify(updata), function (data) {
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}
						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.sTYtFun = function (stu) {//三态
				if ($scope.sanTaiNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn33').hasClass('btn-active1')) {
					return;
				}
				var whereTarget;
				if ($('.oneqd-sel33').val() == '请选择') {
					layer.msg('请选择仓库');
					return;
				} else if ($('.oneqd-sel33').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.oneqd-sel33').val() == '义乌') {
					whereTarget = 'YW'
				}
				let stCsArr = [];
				let cjpacketIds = '';
				if(sTAuIds!=''){
					stCsArr.push(stCsFun(sTAuIds,'STEXPTH','三态物流澳洲专线'))
					cjpacketIds += sTAuIds;
				}
				if(sTCaIds!=''){
					stCsArr.push(stCsFun(sTCaIds,'STEXPTH','三态物流加拿大专线'))
					cjpacketIds += sTCaIds;
				}
				if(sTDeZxIds!=''){
					stCsArr.push(stCsFun(sTDeZxIds,'STEXPTH','三态快邮德国小包挂号'))
					cjpacketIds += sTDeZxIds;
				}
				if(sTDeThIds!=''){
					stCsArr.push(stCsFun(sTDeThIds,'DEEXPLS','三态物流德国专线特惠'))
					cjpacketIds += sTDeThIds;
				}
				if(sTMxIds!=''){
					stCsArr.push(stCsFun(sTMxIds,'MXEXP','三态物流墨西哥专线'))
					cjpacketIds += sTMxIds;
				}
				if (sTUsDdIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTUsDdIds, 'GP', '美国联邮通挂号带电')) : stCsArr.push(stCsFun(sTUsDdIds, 'GP', '美国联邮通挂号带电'))
					cjpacketIds += sTUsDdIds;
				}
				if (sTUsBddIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTUsBddIds, 'QC', '美国联邮通挂号普货')) : stCsArr.push(stCsFun(sTUsBddIds, 'QC', '美国联邮通挂号普货'))
					cjpacketIds += sTUsBddIds;
				}
				if(yTBddIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTBddIds,'YW-THPHR','云途专线全球挂号')):stCsArr.push(stCsFun(yTBddIds,'SZ-THPHR','云途专线全球挂号'))
					cjpacketIds += yTBddIds;
				}
				if(yTDdIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTDdIds,'YW-THZXR','义乌云途专线全球挂号')):stCsArr.push(stCsFun(yTDdIds,'SZ-THZXR','深圳云途专线全球挂号'))
					cjpacketIds += yTDdIds;
				}
				if(yTGbDdIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTGbDdIds,'484','义乌燕文专线追踪小包')):stCsArr.push(stCsFun(yTGbDdIds,'484','深圳燕文专线追踪小包'))
					cjpacketIds += yTGbDdIds;
				}
				if(yTGbBddIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTGbBddIds,'481','义乌燕文专线追踪小包')):stCsArr.push(stCsFun(yTGbBddIds,'481','深圳燕文专线追踪小包'))
					cjpacketIds += yTGbBddIds;
				}
				if(yTBrIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTBrIds,'BRZX','义乌壹电商巴西专线')):stCsArr.push(stCsFun(yTBrIds,'BRZX','深圳壹电商巴西专线'))
					cjpacketIds += yTBrIds;
				}
				if(yTYdsKrIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTYdsKrIds,'KRZX','义乌壹电商韩国专线')):stCsArr.push(stCsFun(yTYdsKrIds,'KRZX','深圳壹电商韩国专线'))
					cjpacketIds += yTYdsKrIds;
				}
				if(yTEsIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTEsIds,'ESZX','义乌壹电商西班牙专线')):stCsArr.push(stCsFun(yTEsIds,'ESZX','深圳壹电商西班牙专线'))
					cjpacketIds += yTEsIds;
				}
				if(stGBIds != ''){
					whereTarget=='YW'?stCsArr.push(stCsFun(stGBIds,'STEXPTH','义乌三态英国经济专线')):stCsArr.push(stCsFun(stGBIds,'STEXPTH','深圳三态英国经济专线'))
					cjpacketIds += stGBIds;
				}
				if (cjpacketCazxIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(cjpacketCazxIds, 'JNDZX', '义乌加拿大专线')) : stCsArr.push(stCsFun(cjpacketCazxIds, 'JNDZX', '深圳加拿大专线'))
					cjpacketIds += cjpacketCazxIds;
				}
				erp.load();
				if($scope.teDingGuoJiaCjpacketCount>0){
					var updata = {};
					updata.ids = $scope.oneordId;
					updata.orderType="CJPAY";
					erp.postFun('erp/cjorder/initKerryLogisticsModel', JSON.stringify(updata), function (data) {
						console.log(data)
						if (data.data.statusCode == 200) {
							$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
							var textarr = ['.', '..', '...', '....', '.....', '......'];
							var inputText = '';
							var i = 0;
							var timer = setInterval(function () {
								$('#animat-text').text('正在生成追踪号' + textarr[i]);
								i++;
								if (i > 5) {
									i = 0;
								}
							}, 500)
							var diQu = '';
							if (whereTarget == 'SZ') {
								diQu = 'y';
							} else {
								diQu = '';
							}
							var ids = {};
							ids.ids = $scope.oneordId;
							ids.loginName = erpLoginName;
							ids.shenzhen = diQu;
							ids.orderType="CJPAY";
							erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
								console.log(data)
								clearInterval(timer);//加载后清除定时器
								$('#animat-text').text('');//提示消息置为空
								$scope.endadmateP = true;//让成功失败条数显示起来

								layer.closeAll("loading")
								var result = data.data;
								$scope.sess = 0;//存储成功的个数
								$scope.error = 0;//存储失败的个数
								for (var i = 0; i < result.length; i++) {
									$scope.sess += result[i].sess;
									$scope.error += result[i].error;
								}

							}, function (data) {
								console.log(data)
								layer.closeAll("loading")
							})
						}
					}, function (data) {
						layer.closeAll("loading")
					})
				}else{
					var updata = {};
					updata.list = stCsArr;
					updata.enName = 'CJPacket';
					updata.loginName = erpLoginName;
					updata.orderType="CJPAY";
					console.log(JSON.stringify(updata))
					erp.postFun('app/erplogistics/updateCJPacketOrderLogistic', JSON.stringify(updata), function (data) {
						console.log(data)
						if (data.data.result > 0) {
							var textarr = ['.', '..', '...', '....', '.....', '......'];
							var inputText = '';
							var i = 0;
							var timer = setInterval(function () {
								$('#animat-text').text('正在生成追踪号' + textarr[i]);
								i++;
								if (i > 5) {
									i = 0;
								}
							}, 500)
							var diQu = '';
							if (whereTarget == 'SZ') {
								diQu = 'y';
							} else {
								diQu = '';
							}
							var ids = {};
							ids.ids = cjpacketIds;
							ids.loginName = erpLoginName;
							ids.shenzhen = diQu;
							ids.orderType="CJPAY";
							console.log(JSON.stringify(ids))
							erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
								console.log(data)
								clearInterval(timer);//加载后清除定时器
								$('#animat-text').text('');//提示消息置为空
								$scope.endadmateP = true;//让成功失败条数显示起来

								layer.closeAll("loading")
								var result = data.data;
								$scope.sess = 0;//存储成功的个数
								$scope.error = 0;//存储失败的个数
								for (var i = 0; i < result.length; i++) {
									$scope.sess += result[i].sess;
									$scope.error += result[i].error;
								}

							}, function (data) {
								console.log(data)
								layer.closeAll("loading")
							})
						}
					}, function (data) {
						console.log(data)
						layer.closeAll("loading")
					})
				}


			}
			$scope.cjPacketCsFun = function (stu) {//usps+ 传送订单
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.upMode = 'y';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}
							var freshJson = {};
							freshJson.ids = $scope.oneordId;
							freshJson.loginName = erpLoginName;
							erp.zfPostFun('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
								console.log(data)
							},function(data){
								console.log(data)
							})
						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.cjPacketFun = function(stu){
				erp.load();
				$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
				var ids = {};
				ids.ids = $scope.oneordId;
				ids.loginName = erpLoginName;
				ids.orderType="CJPAY";
				console.log(JSON.stringify(ids))
				erp.zfPostFun('createTrackNumber.json', JSON.stringify(ids), function (data) {
					console.log(data)
					layer.closeAll("loading")
					var result = data.data;
					$scope.sess = 0;//存储成功的个数
					$scope.error = 0;//存储失败的个数
					$scope.sess = result.sess;//存储成功的个数
					$scope.error = result.error;//存储失败的个数

				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.selNfOrTtFun = function () {//南风顺丰
				if($scope.nfOrTtNum<=0){
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if($('.qd-onesel17').val()=='请选择'){
					layer.msg('请选择物流渠道');
					return;
				}
				if($('.scyd-btn17').hasClass('btn-active1')){
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-sel17').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.nfsfFun = function () {//南风顺丰
				if($('.qd-onesel15').val()=='请选择'){
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-onesel15').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.ttsfFun = function () {//泰腾顺丰
				if($('.qd-onesel16').val()=='请选择'){
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-onesel16').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.ddepackFun = function () {//带电E邮宝
				if($('.oneqd-sel1').val()=='请选择'){
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel1').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							// clearTimeout(timer);//加载后清除定时器
							// $('#animat-text').text('');//提示消息置为空
							// $scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.bddepackFun = function () {//不带电E邮宝
				if($('.oneqd-sel2').val()=='请选择'){
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel2').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}


			$scope.dhlddFun = function () {//带电dhl
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "CT02#DHL带电";
				updata.enName = 'DHL';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.dhlbddFun = function () {//不带电dhl
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "CT01#DHL不带电";
				updata.enName = 'DHL';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.dhlGfBddFun = function () {//官方不带电dhl
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "DHLGF#DHL不带电";
				updata.enName = 'DHL';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.dhlOfficialFun = function () {//官方dhl
				if ($('.oneqd-sel20').val() == '请选择') {
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel20').val();
				updata.enName = 'DHL Official';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						// ids.shenzhen = diQu;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.hfmepackFun = function () {//含粉末E邮宝
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "BEUBH#BJ cosmetics epacket";
				updata.enName = 'BJ cosmetics epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.hcepackFun = function () {//含磁含膏状E邮宝
				if ($('.oneqd-sel13').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel13').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.gzepackFun = function () {//膏状E邮宝
				if ($('.oneqd-sel9').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel9').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.uspsOneCsFun = function () {//usps+ 传送订单
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.uspsPluszzhFun = function () {//usps+ 获取追踪号订单
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('getShipstationWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.uspsFun = function () {//usps
				// if($('.oneqd-sel4').val()=='请选择'){
				// 	layer.msg('请选择物流渠道')
				// 	return;
				// }
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createTrackNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.oneqtfsFun = function () {//其它物流方式

				erp.load();
				$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
				var ids = {};
				ids.ids = $scope.oneordId;
				ids.loginName = erpLoginName;
				ids.orderType="CJPAY";
				console.log(JSON.stringify(ids))
				erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
					console.log(data)
					layer.closeAll("loading")
					var result=data.data;
					$scope.sess=0;//存储成功的个数
					$scope.error=0;//存储失败的个数
					for(var i=0;i<result.length;i++){
						$scope.sess+=result[i].sess;
						$scope.error+=result[i].error;
					}

				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}

			$scope.ddyzxbFun = function () {//带电邮政小包
				if($('.oneqd-sel5').val()=='请选择'){
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel5').val();
				updata.enName = 'China Post Registered Air Mail';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.bdyzxbFun = function () {//不带电邮政小包
				if($('.oneqd-sel6').val()=='请选择'){
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel6').val();
				updata.enName = 'China Post Registered Air Mail';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.uspsPlusFun = function () {//usps+ 传送订单
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'USPS+';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.uspsPluszzhFun = function () {//usps+ 获取追踪号订单
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'USPS+';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('getShipstationWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.uspsPlusscydFun = function () {//usps+生成运单号
				erp.load()
				var ids = {};
				ids.ids = $scope.oneordId;
				ids.orderType="CJPAY";
				console.log(JSON.stringify(ids))
				erp.zfPostFun('createTrackNumber.json',JSON.stringify(ids),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;
					layer.closeAll("loading")
					var result=data.data;
					$scope.sess=result.sess;//存储成功的个数
					$scope.error=result.error;//存储失败的个数

				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.ytFun = function () {//带电E邮宝
				if($('.oneqd-sel10').val()=='请选择'){
					layer.msg('请选择物流渠道')
					return;
				}
				var whereTarget;
				if($('.oneqd-sel10').val()=='请选择'){
					layer.msg('请选择物流渠道');
					return;
				}else if($('.oneqd-sel10').val()=='深圳'){
					whereTarget = 'SZ'
				}else if($('.oneqd-sel10').val()=='义乌'){
					whereTarget = 'YW'
				}
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = whereTarget;
				updata.enName = 'yuntu';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					console.log(data)
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if(data.data.result>0){
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
		}

		var zszgfStuArr = [];
		$scope.zdszgfFun = function(num,stu){
			console.log(num,stu)
			$scope.epackSzGfNum+=num;
			zszgfStuArr.push(stu)
			if(stu==1){
				$scope.ddepackNum = 0;
				$('.scyd-btn1').addClass('btn-active');
			}
			if(stu==2){
				$scope.bdepackNum = 0;
				$('.scyd-btn2').addClass('btn-active');
			}
			if(stu==3){
				$scope.hcepackNum = 0;
				$('.scyd-btn13').addClass('btn-active');
			}
			if(stu==4){
				$scope.hfmepackNum = 0;
				$('.scyd-btn18').addClass('btn-active');
			}
			if(stu==5){
				$scope.epackGzNum = 0;
				$('.scyd-btn9').addClass('btn-active');
			}
			console.log($scope.epackSzGfNum)
			console.log(zszgfStuArr)
			if ($scope.epackSzGfNum <= 0) {
				$('.scyd-btn24').addClass('btn-active');
			} else {
				$('.scyd-btn24').removeClass('btn-active');
			}
		}
		//批量生成运单号的函数
		$scope.cjPacketVal = 'init';
		$scope.bzxCjPacketFun = function(){
			$scope.cjPacketVal = 'n';
			$scope.isZCjpacketFlag = false;
			$scope.isydFun()
		}
		$scope.zXcjPacketFun = function(){
			$scope.cjPacketVal = 'y';
			$scope.isZCjpacketFlag = false;
			$scope.isydFun()
		}
		function sxBooleanFun1(arr,COMMON,BATTERY,ELECTRONIC,OVERSIZE,on){
			// console.log(arr,COMMON,BATTERY,ELECTRONIC,OVERSIZE,on)
			let shuXingFlag = false;
			let sxLen = arr.length;
			for (var j = 0; j < sxLen; j++) {
				if (arr[j] == COMMON||arr[j] == BATTERY||arr[j] == ELECTRONIC||arr[j] == OVERSIZE||arr[j] == on) {
					shuXingFlag = true;
					break;
				} else {
					shuXingFlag = false;
				}
			}
			return shuXingFlag;
		}
		function stCsFun(id,logisticsMode,logisticsModeName){
			let obj = {};
			obj.ids = id;
			obj.logisticsMode = logisticsMode;
			obj.logisticsModeName = logisticsModeName;
			return obj;
		}
		function isOneSxFun (domArr,shuXing){
			var itemSpNum = domArr.length;
			var strSpSxList = '';
			if (itemSpNum > 0) {
				for (var i = 0; i < itemSpNum; i++) {
					strSpSxList += domArr.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text() + ',';
				}
			}
			var sxArr = strSpSxList.split(',');
			sxArr.pop();
			var isCommonFlag = false;
			for (var j = 0; j < sxArr.length; j++) {
				if (sxArr[j] != shuXing) {
					isCommonFlag = false;
					break;
				} else {
					isCommonFlag = true;
				}
			}
			return isCommonFlag;
		}
		$scope.noHghLinkFun = function(){
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('epackIds', $scope.dhlHghNullIds)
			window.open('#/erp-zf-ord')
		}
		function isBatteryOrELECTRONICFun(arr){
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] != 'BATTERY'&&arr[j] != 'ELECTRONIC') {
					return false;
				}
				if (j == arr.length - 1) {
					return true;
				}
			}
		}
		function isHaveDianOrBatteryFun(arr){
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == 'BATTERY'||arr[j] == 'ELECTRONIC') {
					return true;
				}
				if (j == arr.length - 1) {
					return false;
				}
			}
		}
		$scope.isydFun = function () {
			$scope.endadmateP = false;//先让成功失败隐藏起来
			$('.scyd-btn24').addClass('btn-active');
			// console.log($scope.wlqdArr)
			var ddepackIds = '';//带电e邮宝的id
			var bdepackIds = '';//不带电E邮宝的id
			var gzepackIds = '';//膏状的E邮宝的id
			var hcepackIds = '';//含磁的E邮宝id
			var hfmepackIds = '';//含粉末的E邮宝
			var uspsIds = '';//usps的id
			// usps2uspsPlusIds = '';//usps转usps+
			// epack2ywIds = '';
			// toSFGJIds = '';
			// toSFTHIds = '';
			// dhl2BldhlIds = '';//转巴林dhl
			// epack2LiBangIds = '';
			var ddyzxbIds = '';//带电邮政小包的id
			var bdyzxbIds = '';//不带电邮政小包的id
			var qtwlIds = '';//
			var uspsPlusIds = '';//usps+的id
			var ytIds = '';//云途的id
			var dhlddIds = '';//带电dhl
			var dhlnotdIds = '';//不带电dhl
			var dhlGfIds = '';//dhl官方
			var dhlOfficialIds = '';//dhl官方
			var nfSfIds = '';
			var ttSfIds = '';
			var nfOrTtIds = '';
			var usZhwlIds = '';//usps综合物流
			$scope.usZhwlNum = 0;
			var yanWenIds = '';//燕文物流
			$scope.yanWenNum = 0;//
			var jewelIds = '';
			var jewelPlusIds = '';
			var jewelFlatIds = '';
			$scope.jewelNum = 0;
			$scope.jewelPlusNum = 0;
			$scope.jewelFlatNum = 0;
			var dgEpacketIds = '';
			$scope.dgEpacketNum = 0;
			$scope.postNlCount = 0;
			var postNlIds = '';

			var selectednum = 0;
			$scope.dhlHghNullNum = 0;
			$scope.dhlHghNullIds = '';
			$scope.epackSzGfNum = 0;//深圳官方epack
			$scope.ddepackNum = 0;//带电e邮宝数量
			$scope.bdepackNum = 0;//不带电e邮宝
			$scope.hcepackNum = 0;//含磁e邮宝
			$scope.hfmepackNum = 0;//含粉末
			$scope.uspsNum = 0;//usps订单数量
			$scope.usps2PlusNum = 0;//usps转usps+的数量
			$scope.ddyzxbNum = 0;//带电邮政小包数量
			$scope.bdyzxbNum = 0;//不带电邮政小包数量
			$scope.qtwlordNum = 0;//其它除了e邮宝的订单数量
			$scope.uspsPlusNum = 0;//usps+物流
			$scope.epackGzNum = 0;//epack膏状的数量
			$scope.ytNum = 0;//云途的数量
			$scope.dhlddIds = 0;//带电dhl
			$scope.dhlnotdIds = 0;//不带电dhl
			$scope.dhlGfNum = 0;//dhl官方
			$scope.dhlOfficialNum = 0;//dhl官方
			$scope.epack2yanwen = 0;//符合转燕文的epack
			$scope.toSFGJNum = 0;//符合转顺丰国际
			$scope.toSFTHNum = 0;//符合转顺丰国际
			$scope.nfSfNum = 0;
			$scope.ttSfNum = 0;
			$scope.nfOrTtNum = 0;
			$scope.dhl2Bldhl = 0;//转巴林的个数
			$scope.epack2LianbangNum = 0;//转联邦的个数
			$scope.bHepacketNum = 0;
			var bHeapcketIds = '';
			$scope.sfcBrazilLineNum = 0;
			var sfcBrazilLineIds = '';
			$scope.ylColumbiaNum = 0;
			var ylColumbiaIds = '';
			$scope.ylPeruNum = 0;
			var ylPeruIds = '';
			var hkDhlIds = '';
			$scope.hkDhlNum = 0;
			$scope.sanTaiNum = 0;
			var cjCodIds = '';
			$scope.cjCodNum = 0;
			$scope.cjpacketSeaNum = 0;
			$scope.euroOrdinarNum = 0;
			var sTAuIds = '',
				sTCaIds = '',
				sTUsIds = '',
				sTUsDdIds = '',
				sTUsBddIds = '',
				sTDeZxIds = '',
				sTDeThIds = '',
				sTMxIds = '',
				yTFrIds = '',
				yTAtIds = '',
				yTSeIds = '',
				yTGbDdIds = '',
				yTGbBddIds = '',
				yTBrIds = '',
				yTEsIds = '',
				yTBddIds = '',
				yTYdsKrIds = '',
				yTDdIds = '',
				teDingGuoJiaCjpacketIds = '',
				cjpacketCazxIds = '',
				cjpacketSeaIds = '',
				euroOrdinarGbIds = '',
				euroOrdinarDeIds = '',
				euroOrdinarFrIds = '',
				euroOrdinarBeIds = '',
				euroOrdinarItIds = '',
			    stGBIds = '';
			$scope.teDingGuoJiaCjpacketCount = 0;
			var spCountNum;
			$scope.cjpacketSeaExpCount = 0;//嘉里空运
			var cjpacketSeaExpIds = '';
			if($scope.cjPacketVal=='init'){
				$('#c-zi-ord .cor-check-box').each(function () {
					if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
						spCountNum = 0;
						var wlName = $(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text();
						var ordCountryCode = $(this).parent().siblings('.info-address-td').children('.address-ccode').text();
						var ordWeight = $(this).siblings('.oneord-wei').text();
						selectednum++;
						console.log(ordWeight)
						console.log(wlName,ordCountryCode)
						var itemSpline = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.pro-item-sp');
						var itemSpSxVal;
						if(ordWeight>285 && ordCountryCode == 'US'){
							console.log('----------')
							spCountNum = itemSpline.length;
							var strSpSxList1 = '';
							if (spCountNum > 0) {
								for (var i = 0; i < spCountNum; i++) {
									itemSpSxVal = itemSpline.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text();
									if(itemSpSxVal.substr(0,1)==','){
										strSpSxList1 += itemSpSxVal.substr(1) + ',';
									}else{
										strSpSxList1 += itemSpSxVal + ',';
									}
								}
							}
							var sxArr1 = strSpSxList1.split(',');
							sxArr1.pop();
							console.log(sxArr1)
							var isCommonFlag1 = false;
							for (var j = 0; j < sxArr1.length; j++) {
								if (sxArr1[j] != '普货') {
									isCommonFlag1 = false;
									break;
								} else {
									isCommonFlag1 = true;
								}
							}
							if (isCommonFlag1&&(wlName=='Wedenpost'||wlName=='ePacket'||wlName=='Pos Malaysia'||wlName=='MYSG'||wlName=='Bpost'||wlName=='Singpost'||wlName=='HKpost'||wlName=='Turkey Post'||wlName=='Swiss Post'||wlName=='China Post Registered Air Mail'||wlName=='La Poste'||wlName=='DHL Paket'||wlName=='BPost+'||wlName=='Korea Post'||wlName=='CJ Liquid'||wlName=='CJ Liquid Direct Line'||wlName=='CJ Liquid Post'||wlName=='Grand Slam'||wlName=='YanWen'||wlName=='S.F China Domestic'||wlName=='YTO China Domestic'||wlName=='South Africa Special Line'||wlName=='Brazil special line'||wlName=='Electric PostNL'||wlName=='CJPacket')) {
								console.log('优先级最高',$(this).siblings('.hide-order-id').text())
								$scope.usZhwlNum++;
								usZhwlIds += $(this).siblings('.hide-order-id').text() + ',';
								return true
							}
						}
					}
				})
			}

			$timeout(function(){
				console.log($scope.usZhwlNum)
				if($scope.usZhwlNum>0){
					$scope.isZCjpacketFlag = true;
				}else{
					$('#c-zi-ord .cor-check-box').each(function () {
						if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
							var wlName = $(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text();
							var ordCountryCode = $(this).parent().siblings('.info-address-td').children('.address-ccode').text();
							// var ordWeight = $(this).parent().siblings('.wei-and-count').find('.oneord-wei').text();
							var ordWeight = $(this).siblings('.oneord-wei').text();
							selectednum++;
							console.log(ordWeight)
							console.log(wlName)
							var itemSpline = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.pro-item-sp');
							var $sptdObj = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
							console.log($sptdObj.children('.sp-sx-span').text())

							var itemSpSxVal;
							if(ordWeight>285 && ordCountryCode == 'US'&&$scope.cjPacketVal=='y'){
								console.log('----------')
								spCountNum = itemSpline.length;
								var strSpSxList1 = '';
								if (spCountNum > 0) {
									for (var i = 0; i < spCountNum; i++) {
										itemSpSxVal = itemSpline.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text();
										if(itemSpSxVal.substr(0,1)==','){
											strSpSxList1 += itemSpSxVal.substr(1) + ',';
										}else{
											strSpSxList1 += itemSpSxVal + ',';
										}
									}
								}
								var sxArr1 = strSpSxList1.split(',');
								sxArr1.pop();
								console.log(sxArr1)
								var isCommonFlag1 = false;
								for (var j = 0; j < sxArr1.length; j++) {
									if (sxArr1[j] != '普货') {
										isCommonFlag1 = false;
										break;
									} else {
										isCommonFlag1 = true;
									}
								}
								if (isCommonFlag1&&(wlName=='Wedenpost'||wlName=='ePacket'||wlName=='Pos Malaysia'||wlName=='MYSG'||wlName=='Bpost'||wlName=='Singpost'||wlName=='HKpost'||wlName=='Turkey Post'||wlName=='Swiss Post'||wlName=='China Post Registered Air Mail'||wlName=='La Poste'||wlName=='DHL Paket'||wlName=='BPost+'||wlName=='Korea Post'||wlName=='CJ Liquid'||wlName=='CJ Liquid Direct Line'||wlName=='CJ Liquid Post'||wlName=='Grand Slam'||wlName=='YanWen'||wlName=='S.F China Domestic'||wlName=='YTO China Domestic'||wlName=='South Africa Special Line'||wlName=='Brazil special line'||wlName=='Electric PostNL'||wlName=='CJPacket')) {
									console.log('优先级最高',$(this).siblings('.hide-order-id').text())
									$scope.usZhwlNum++;
									usZhwlIds += $(this).siblings('.hide-order-id').text() + ',';
									return true
								}
							}


							if (wlName=='ePacket') {
								if ($sptdObj.children('.sp-sx-span').text().indexOf('电')>=0) {
									$scope.ddepackNum++;
									ddepackIds += $(this).siblings('.hide-order-id').text()+',';
									// console.log('判断带电的条件')
								} else if ($sptdObj.children('.sp-sx-span').text().indexOf('膏') >= 0||$sptdObj.children('.sp-sx-span').text().indexOf('液') >= 0) {
									if (isOneSxFun(itemSpline,'HAVE_CREAM')||$sptdObj.children('.sp-sx-span').text().indexOf('液') >= 0) {
										$scope.epackGzNum++;
										gzepackIds += $(this).siblings('.hide-order-id').text() + ',';
									}else{//跟含磁的走相同
										$scope.hcepackNum++;
										hcepackIds += $(this).siblings('.hide-order-id').text() + ',';
									}
									// console.log('判断e邮宝膏状的条件')
								} else if($sptdObj.children('.sp-sx-span').text().indexOf('磁')>=0) {
									$scope.hcepackNum++;
									hcepackIds += $(this).siblings('.hide-order-id').text()+',';
									// console.log('判断e邮宝含磁的条件')
								}
								//  else if($sptdObj.children('.sp-sx-span').text().indexOf('粉')>=0) {
								// 	$scope.hfmepackNum++;
								// 	hfmepackIds += $(this).siblings('.hide-order-id').text()+',';
								// 	console.log('判断e邮宝含粉末的条件')
								// }
								else {
									$scope.bdepackNum++;
									bdepackIds += $(this).siblings('.hide-order-id').text()+',';
									// console.log('判断e邮宝不带电的条件')
								}
							} else if(wlName=='CJ Normal Express'){
								if(1000<ordWeight&&ordWeight<=1600){
									$scope.nfSfNum++;
									nfSfIds += $(this).siblings('.hide-order-id').text()+',';
								}else if(ordWeight>1600||ordWeight<=1000){
									$scope.ttSfNum++;
									ttSfIds += $(this).siblings('.hide-order-id').text()+',';
								}
								// else {
								// 	$scope.nfOrTtNum++;
								// 	$scope.nfOrTtIds += $(this).siblings('.hide-order-id').text()+',';
								// }
							} else if(wlName == 'DG Epacket'){
								$scope.dgEpacketNum++;
								dgEpacketIds += $(this).siblings('.hide-order-id').text()+',';
							} else if(wlName == 'BJ cosmetics epacket'){
								$scope.bHepacketNum++;
								bHeapcketIds += $(this).siblings('.hide-order-id').text()+',';
							} else if(wlName == 'SFC Brazil line'){
								$scope.sfcBrazilLineNum++;
								sfcBrazilLineIds += $(this).siblings('.hide-order-id').text()+',';
							} else if(wlName=='USPS'){
								$scope.uspsNum++;
								uspsIds += $(this).siblings('.hide-order-id').text()+',';
								console.log('判断usps物流的条件')
								// usps2uspsPlusIds += $(this).siblings('.hide-order-id').text()+',';
								// $scope.usps2PlusNum++;
							}else if(wlName=='China Post Registered Air Mail'){
								var $sptdObj = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
								if ($sptdObj.children('.sp-sx-span').text().indexOf('电')>=0) {
									$scope.ddyzxbNum++;
									ddyzxbIds += $(this).siblings('.hide-order-id').text()+',';
									console.log('判断邮政小包带电的条件')
								} else {
									$scope.bdyzxbNum++;
									bdyzxbIds += $(this).siblings('.hide-order-id').text()+',';
									console.log('判断邮政小包不带电的条件')
								}
							}else if(wlName=='USPS+'){
								$scope.uspsPlusNum++;
								uspsPlusIds += $(this).siblings('.hide-order-id').text()+',';
								console.log('判断USPS+物流的条件')
							} else if (wlName == 'CJPacket SEA Express'||wlName == 'CJPacket JL Express') {
								$scope.cjpacketSeaExpCount++;
								cjpacketSeaExpIds += $(this).siblings('.hide-order-id').text() + ',';
								// console.log('嘉里空运')
							}else if(wlName.indexOf('YunExpress')>=0){
								$scope.ytNum++;
								ytIds += $(this).siblings('.hide-order-id').text()+',';
								console.log('判断云途物流的条件')
							}else if (wlName=='DHL') {
								if ($sptdObj.children('.sp-sx-span').text().indexOf('电')>=0) {
									$scope.dhlddIds++;
									dhlddIds += $(this).siblings('.hide-order-id').text()+',';
									console.log('判断dhl带电的条件')
								}else {
									console.log(ordWeight)
									if (ordWeight<2000) {
										$scope.dhlGfNum++
										dhlGfIds += $(this).siblings('.hide-order-id').text()+',';
									} else {
										$scope.dhlnotdIds++;
										dhlnotdIds += $(this).siblings('.hide-order-id').text()+',';
									}
								}
							}else if(wlName=='DHL Official'){
								let $hghDomList = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr');
								let hghIsNull = false;
								console.log($hghDomList)
								for(let i = 0,len = $hghDomList.length;i<len;i++){
									if(!$hghDomList.eq(i).children('.hgh-td').children('.hgh-text').text()){
										hghIsNull = true;
										break;
									}
								}
								if(hghIsNull){
									$scope.dhlHghNullNum++;
									$scope.dhlHghNullIds += $(this).siblings('.hide-order-id').text()+',';
								}else{
									$scope.dhlOfficialNum++;
									dhlOfficialIds += $(this).siblings('.hide-order-id').text()+',';
								}
								console.log($scope.dhlHghNullNum,$scope.dhlOfficialNum)
							}else if(wlName=='YanWen'){
								spCountNum = itemSpline.length;
								var strSpSxList1 = '';
								if (spCountNum > 0) {
									for (var i = 0; i < spCountNum; i++) {
										strSpSxList1 += itemSpline.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text() + ',';
									}
								}
								var sxArr1 = strSpSxList1.split(',');
								sxArr1.pop();
								console.log(sxArr1)
								var isCommonFlag1 = false;
								for (var j = 0; j < sxArr1.length; j++) {
									if (sxArr1[j]&&sxArr1[j] != '普货') {
										isCommonFlag1 = false;
										break;
									} else {
										isCommonFlag1 = true;
									}
								}
								console.log(ordWeight,isCommonFlag1)
								if (isCommonFlag1&&ordWeight<2000) {
									yanWenIds += $(this).siblings('.hide-order-id').text()+',';
									$scope.yanWenNum++;
								}else {
									$scope.qtwlordNum++;
									qtwlIds += $(this).siblings('.hide-order-id').text() + ',';
								}
							} else if(wlName == 'Jewel Shipping'){
								$scope.jewelNum++;
								jewelIds += $(this).siblings('.hide-order-id').text()+',';
							}  else if(wlName == 'Jewel Shipping Flat' || wlName == 'Jewel Shipping Flat+'){
								$scope.jewelFlatNum++;
								jewelFlatIds += $(this).siblings('.hide-order-id').text()+',';
							}else if(wlName == 'Jewel Shipping+'){
								$scope.jewelPlusNum++;
								jewelPlusIds += $(this).siblings('.hide-order-id').text()+',';
							} else if(wlName == 'DHL HongKong'){
								$scope.hkDhlNum++;
								hkDhlIds += $(this).siblings('.hide-order-id').text()+',';
							} else if(wlName == 'YL Columbia line'){
								$scope.ylColumbiaNum++;
								ylColumbiaIds += $(this).siblings('.hide-order-id').text()+',';
							} else if(wlName == 'YL Peru line'){
								$scope.ylPeruNum++;
								ylPeruIds += $(this).siblings('.hide-order-id').text()+',';
							} else if(wlName == 'CJPacket Euro Ordinary'){
								if(ordCountryCode == 'GB' || ordCountryCode == 'DE' || ordCountryCode == 'FR' || ordCountryCode == 'BE' || ordCountryCode == 'IT'){
									$scope.euroOrdinarNum++;
									$scope.showindex = 51;
								}
								if(ordCountryCode == 'GB'){
									euroOrdinarGbIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode == 'DE'){
									euroOrdinarDeIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode == 'FR'){
									euroOrdinarFrIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode == 'BE'){
									euroOrdinarBeIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode == 'IT'){
									euroOrdinarItIds += $(this).siblings('.hide-order-id').text() + ',';
								}
							}else if(wlName == 'CJPacket'){
								spCountNum = itemSpline.length;
								var strSpSxList1 = '';
								if (spCountNum > 0) {
									for (var i = 0; i < spCountNum; i++) {
										strSpSxList1 += itemSpline.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text() + ',';
									}
								}
								var sxArr1 = strSpSxList1.split(',');
								sxArr1.pop();
								let isHaveDianOrBatteryFlag = isHaveDianOrBatteryFun(sxArr1)
								if(ordCountryCode=='AU'){
									$scope.sanTaiNum++;
									sTAuIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode=='CA'){
									$scope.sanTaiNum++;
									cjpacketCazxIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode=='US'){
									$scope.sanTaiNum++;
									if(isHaveDianOrBatteryFlag){
										sTUsDdIds += $(this).siblings('.hide-order-id').text() + ',';
									}else{
										sTUsBddIds += $(this).siblings('.hide-order-id').text() + ',';
									}
								}else if(ordCountryCode=='DE'){
									// if(sxBooleanFun1(sxArr1,'','BATTERY','ELECTRONIC','','')){//是否是带电的
										//德国专线
										$scope.sanTaiNum++;
										// sTDeZxIds += $(this).siblings('.hide-order-id').text() + ',';
									// }else {
									// 	//德国专线特惠
									// 	$scope.sanTaiNum++;
										sTDeThIds += $(this).siblings('.hide-order-id').text() + ',';
									// }
								}else if(ordCountryCode=='MX'){
									$scope.sanTaiNum++;
									sTMxIds += $(this).siblings('.hide-order-id').text() + ',';
								}
								else if(ordCountryCode=='AT' || ordCountryCode=='CH' || ordCountryCode=='SE' || ordCountryCode=='FR' || ordCountryCode=='NL' || ordCountryCode=='BE' || ordCountryCode=='LU'){
									$scope.sanTaiNum++;
									yTDdIds += $(this).siblings('.hide-order-id').text() + ',';
									// if($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0){
									// 	yTDdIds += $(this).siblings('.hide-order-id').text() + ',';
									// }else {
									// 	yTBddIds += $(this).siblings('.hide-order-id').text() + ',';
									// }
								}else if(ordCountryCode=='IT' || ordCountryCode=='DK'){//不需要判断是否带电 mode按带电传
									$scope.sanTaiNum++;
									yTDdIds += $(this).siblings('.hide-order-id').text() + ',';
								}
								else if(ordCountryCode=='IN'||ordCountryCode=='FI'){
									$scope.sanTaiNum++;
									if($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0){
										yTGbDdIds += $(this).siblings('.hide-order-id').text() + ',';
									}else {
										yTGbBddIds += $(this).siblings('.hide-order-id').text() + ',';
									}
								}else if(ordCountryCode=='GB'){
									$scope.sanTaiNum++;
									stGBIds += $(this).siblings('.hide-order-id').text() + ',';
								}
								else if(ordCountryCode=='KR'){
									$scope.sanTaiNum++;
									yTYdsKrIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode=='BR'){
									$scope.sanTaiNum++;
									yTBrIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode=='ES'){
									$scope.sanTaiNum++;
									yTEsIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode=='TH'||ordCountryCode== 'MY'||ordCountryCode== "PH"||ordCountryCode== 'VN'||ordCountryCode== 'SG'||ordCountryCode== 'TW'||ordCountryCode== 'ID'){
									teDingGuoJiaCjpacketIds += $(this).siblings('.hide-order-id').text() + ',';
									$scope.teDingGuoJiaCjpacketCount++;
									$scope.sanTaiNum++;
								}
								else{
									$scope.qtwlordNum++;
									qtwlIds += $(this).siblings('.hide-order-id').text() + ',';
								}
							}else if(wlName == 'CJPacket-Tha'|| wlName == 'CJPacket-Supplier'){
								if(ordCountryCode=='TH'||ordCountryCode== 'VN'){
									teDingGuoJiaCjpacketIds += $(this).siblings('.hide-order-id').text() + ',';
									$scope.teDingGuoJiaCjpacketCount++;
									$scope.sanTaiNum++;
								}else{
									$scope.qtwlordNum++;
									qtwlIds += $(this).siblings('.hide-order-id').text() + ',';
								}
							}else if(wlName == 'PostNL'){
								postNlIds += $(this).siblings('.hide-order-id').text() + ',';
								$scope.postNlCount++;
							}else if(wlName == 'CJCOD'){
								cjCodIds += $(this).siblings('.hide-order-id').text() + ',';
								$scope.cjCodNum++;
							}else if(wlName == 'CJPacket-Sea' || wlName == 'CJPacket Sea'){
								cjpacketSeaIds += $(this).siblings('.hide-order-id').text() + ',';
								$scope.cjpacketSeaNum++;
							}else {
								$scope.qtwlordNum++;
								qtwlIds += $(this).siblings('.hide-order-id').text()+',';
								console.log('判断其它物流的条件')
							}
						}
					})
					if (selectednum<=0) {
						layer.msg('请先选择订单')
						return;
					} else {
						$scope.isydFlag = true;
					}

					if ($scope.sanTaiNum <= 0) {
						$('.scyd-btn33').addClass('btn-active');
					} else {
						$('.scyd-btn33').removeClass('btn-active');
					}
					if($scope.ddepackNum<=0){
						$('.scyd-btn1').addClass('btn-active');
					}else{
						$('.scyd-btn1').removeClass('btn-active');
					}
					if($scope.bdepackNum<=0){
						$('.scyd-btn2').addClass('btn-active');
					}else{
						$('.scyd-btn2').removeClass('btn-active');
					}
					if($scope.epackGzNum<=0){
						$('.scyd-btn9').addClass('btn-active');
					}else{
						$('.scyd-btn9').removeClass('btn-active');
					}
					if($scope.qtwlordNum<=0){
						$('.scyd-btn3').addClass('btn-active');
					}else{
						$('.scyd-btn3').removeClass('btn-active');
					}
					if($scope.uspsNum<=0){
						$('.scyd-btn4').addClass('btn-active');
						$('.scyd-btn21').addClass('btn-active');
						$('.scyd-btn22').addClass('btn-active');
					}else{
						$('.scyd-btn4').removeClass('btn-active');
						$('.scyd-btn21').removeClass('btn-active');
						$('.scyd-btn22').removeClass('btn-active');
					}
					if($scope.ddyzxbNum<=0){
						$('.scyd-btn5').addClass('btn-active');
					}else{
						$('.scyd-btn5').removeClass('btn-active');
					}
					if($scope.bdyzxbNum<=0){
						$('.scyd-btn6').addClass('btn-active');
					}else{
						$('.scyd-btn6').removeClass('btn-active');
					}
					if($scope.uspsPlusNum<=0){
						$('.scyd-btn7').addClass('btn-active');
						$('.scyd-btn8').addClass('btn-active');
						$('.scyd-btn14').addClass('btn-active');
					}else{
						$('.scyd-btn7').removeClass('btn-active');
						$('.scyd-btn8').removeClass('btn-active');
						$('.scyd-btn14').removeClass('btn-active');
					}
					if($scope.ytNum<=0){
						$('.scyd-btn10').addClass('btn-active');
					}else{
						$('.scyd-btn10').removeClass('btn-active');
					}
					if($scope.dhlddIds<=0){
						$('.scyd-btn11').addClass('btn-active');
					}else{
						$('.scyd-btn11').removeClass('btn-active');
					}
					if($scope.dhlnotdIds<=0){
						$('.scyd-btn12').addClass('btn-active');
					}else{
						$('.scyd-btn12').removeClass('btn-active');
					}
					if($scope.hfmepackNum<=0){
						$('.scyd-btn18').addClass('btn-active');
					}else{
						$('.scyd-btn18').removeClass('btn-active');
					}
					if ($scope.dhlGfNum <= 0) {
						$('.scyd-btn19').addClass('btn-active');
						$('.zhnf-btn').addClass('btn-active');
					} else {
						$('.scyd-btn19').removeClass('btn-active');
						$('.zhnf-btn').removeClass('btn-active');
					}
					if ($scope.dhlOfficialNum <= 0) {
						$('.scyd-btn20').addClass('btn-active');
					} else {
						$('.scyd-btn20').removeClass('btn-active');
					}
					if($scope.hcepackNum<=0){
						$('.scyd-btn13').addClass('btn-active');
					}else{
						$('.scyd-btn13').removeClass('btn-active');
					}
					if($scope.nfSfNum<=0){
						$('.scyd-btn15').addClass('btn-active');
					}else{
						$('.scyd-btn15').removeClass('btn-active');
					}
					if($scope.ttSfNum<=0){
						$('.scyd-btn16').addClass('btn-active');
					}else{
						$('.scyd-btn16').removeClass('btn-active');
					}
					if($scope.nfOrTtNum<=0){
						$('.scyd-btn17').addClass('btn-active');
					}else{
						$('.scyd-btn17').removeClass('btn-active');
					}
					if ($scope.usZhwlNum <= 0) {
						$('.scyd-btn25').addClass('btn-active');
						$('.scyd-btn28').addClass('btn-active');
					} else {
						$('.scyd-btn25').removeClass('btn-active');
						$('.scyd-btn28').removeClass('btn-active');
					}
					if ($scope.yanWenNum <= 0) {
						$('.scyd-btn26').addClass('btn-active');
					} else {
						$('.scyd-btn26').removeClass('btn-active');
					}
					if($scope.jewelNum<=0){
						$('.scyd-btn29').addClass('btn-active');
						$('.scyd-btn30').addClass('btn-active');
					}else{
						$('.scyd-btn29').removeClass('btn-active');
						$('.scyd-btn30').removeClass('btn-active');
					}
					if($scope.jewelPlusNum<=0){
						$('.scyd-btn31').addClass('btn-active');
						$('.scyd-btn32').addClass('btn-active');
					}else{
						$('.scyd-btn31').removeClass('btn-active');
						$('.scyd-btn32').removeClass('btn-active');
					}
					if($scope.jewelFlatNum<=0){
						$('.scyd-btn35').addClass('btn-active');
						$('.scyd-btn36').addClass('btn-active');
					}else{
						$('.scyd-btn35').removeClass('btn-active');
						$('.scyd-btn36').removeClass('btn-active');
					}
					if($scope.hkDhlNum<=0){
						$('.scyd-btn34').addClass('btn-active');
					}else{
						$('.scyd-btn34').removeClass('btn-active');
					}
					if($scope.dgEpacketNum<=0){
						$('.scyd-btn37').addClass('btn-active');
					}else{
						$('.scyd-btn37').removeClass('btn-active');
					}
					if($scope.bHepacketNum<=0){
						$('.scyd-btn38').addClass('btn-active');
					}else{
						$('.scyd-btn38').removeClass('btn-active');
					}
					if($scope.sfcBrazilLineNum<=0){
						$('.scyd-btn39').addClass('btn-active');
					}else{
						$('.scyd-btn39').removeClass('btn-active');
					}
					if($scope.ylColumbiaNum<=0){
						$('.scyd-btn40').addClass('btn-active');
					}else{
						$('.scyd-btn40').removeClass('btn-active');
					}
					if($scope.ylPeruNum<=0){
						$('.scyd-btn41').addClass('btn-active');
					}else{
						$('.scyd-btn41').removeClass('btn-active');
					}
					if($scope.cjpacketSeaExpCount<=0){
						$('.scyd-btn42').addClass('btn-active');
					}else{
						$('.scyd-btn42').removeClass('btn-active');
					}
					if($scope.postNlCount<=0){
						$('.scyd-btn43').addClass('btn-active');
					}else{
						$('.scyd-btn43').removeClass('btn-active');
					}
					if($scope.cjCodNum<=0){
						$('.scyd-btn44').addClass('btn-active');
					}else{
						$('.scyd-btn44').removeClass('btn-active');
					}
				}
			},20)
			//确定生成运单号的按钮
			$scope.succscydnumflag = false;//生成运单成功多少
			$scope.zhnfDHLFun = function(){
				if($scope.dhlGfNum>0){
					$scope.isReturnDhlFlag = true;
				}else{
					layer.msg('没有可以转回的订单')
				}
			}
			$scope.zhnfSureFun = function(){
				$scope.dhlnotdIds+=$scope.dhlGfNum;
				dhlnotdIds+=dhlGfIds;
				$scope.dhlGfNum = 0;
				dhlGfIds = '';
				$scope.isReturnDhlFlag = false;
				$('.zhnf-btn').addClass('btn-active');
				$('.scyd-btn19').addClass('btn-active');
				$('.scyd-btn12').removeClass('btn-active');
			}
			$scope.enterscmdFun44 = function () {//美国
				if ($scope.cjCodNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn44').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel44').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = cjCodIds;
				updata.logisticsName = $('.qd-sel44').val();
				updata.enName = 'CJCOD';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn44').addClass('btn-active1');
					console.log(data)
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)

						var ids = {};
						ids.ids = cjCodIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun43 = function () {//美国
				if ($scope.postNlCount <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn43').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel43').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = postNlIds;
				updata.logisticsName = $('.qd-sel43').val();
				updata.enName = '美国专线';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn43').addClass('btn-active1');
					console.log(data)
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)

						var ids = {};
						ids.ids = postNlIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun42 = function () {//带电E邮宝生成运单号函数
				console.log($scope.cjpacketSeaExpCount)
				if ($scope.cjpacketSeaExpCount <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn42').hasClass('btn-active1')) {
					return;
				}
				var whereTarget;
				if ($('.qd-sel42').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				} else if ($('.qd-sel42').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.qd-sel42').val() == '义乌') {
					whereTarget = 'YW'
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.ids = cjpacketSeaExpIds;
				updata.orderType="CJPAY";
				erp.postFun('erp/cjorder/initKerryLogisticsModel', JSON.stringify(updata), function (data) {
					$('.scyd-btn42').addClass('btn-active1');
					console.log(data)
					if (data.data.statusCode == 200) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						var diQu = '';
						if (whereTarget == 'SZ') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = cjpacketSeaExpIds;
						ids.shenzhen = diQu;
						ids.loginName = erpLoginName;
						updata.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun40 = function () {//带电E邮宝生成运单号函数
				if ($scope.ylColumbiaNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn40').hasClass('btn-active1')) {
					return;
				}
				var whereTarget;
				if ($('.qd-sel40').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				} else if ($('.qd-sel40').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.qd-sel40').val() == '义乌') {
					whereTarget = 'YW'
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = ylColumbiaIds;
				updata.logisticsName = "QYIWDUF1235#易联哥伦比亚专线";
				updata.enName = 'YL Columbia line';
				updata.orderType="CJPAY";
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn40').addClass('btn-active1');
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						var diQu = '';
						if (whereTarget == 'SZ') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = ylColumbiaIds;
						ids.shenzhen = diQu;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun41 = function () {
				if ($scope.ylPeruNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn41').hasClass('btn-active1')) {
					return;
				}
				var whereTarget;
				if ($('.qd-sel41').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				} else if ($('.qd-sel41').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.qd-sel41').val() == '义乌') {
					whereTarget = 'YW'
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = ylPeruIds;
				updata.logisticsName = "LXJHPUUI952#易联秘鲁专线";
				updata.enName = 'YL Peru line';
				updata.orderType="CJPAY";
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn41').addClass('btn-active1');
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						var diQu = '';
						if (whereTarget == 'SZ') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = ylPeruIds;
						ids.shenzhen = diQu;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun35 = function () {//usps
				if ($scope.jewelFlatNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn35').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.scydflag = true;
				var updata = {};
				updata.orderNum = jewelFlatIds;
				updata.upMode = 'y';
				updata.orderType="CJPAY";
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn35').addClass('btn-active1');
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text1').text('正在传送订单' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						var ids = {};
						ids.ids = jewelFlatIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text1').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}
							var freshJson = {};
							freshJson.ids = jewelFlatIds;
							freshJson.loginName = erpLoginName;
							erp.zfPostFun('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
								console.log(data)
							},function(data){
								console.log(data)
							})
						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun36 = function (stu) {//美国
				if ($scope.jewelFlatNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn36').hasClass('btn-active1')) {
					return;
				}
				$scope.succscydnumflag = true;
				$('.scyd-btn36').addClass('btn-active1');
				erp.load();
				var ids = {};
				ids.ids = jewelFlatIds;
				ids.loginName = erpLoginName;
				ids.orderType="CJPAY";
				console.log(JSON.stringify(ids))
				erp.zfPostFun('createTrackNumber.json', JSON.stringify(ids), function (data) {
					console.log(data)
					$scope.endadmateP = true;//让成功失败条数显示起来
					layer.closeAll("loading")
					var result = data.data;
					$scope.sess = 0;//存储成功的个数
					$scope.error = 0;//存储失败的个数
					$scope.sess = result.sess;//存储成功的个数
					$scope.error = result.error;//存储失败的个数
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun37 = function () {//DHL eCommerce
				if ($scope.dgEpacketNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn37').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = dgEpacketIds;
				updata.logisticsName = "DGEUBA#DG Epacket";
				updata.enName = 'DG Epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn37').addClass('btn-active1');
					console.log(data)
					// if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)

						var ids = {};
						ids.ids = dgEpacketIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun38 = function () {//DHL eCommerce
				if ($scope.bHepacketNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn38').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = bHeapcketIds;
				updata.logisticsName = "BEUBH#BJ cosmetics epacket";
				updata.enName = 'BJ cosmetics epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn38').addClass('btn-active1');
					console.log(data)
					// if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)

						var ids = {};
						ids.ids = bHeapcketIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun39 = function () {//DHL eCommerce
				if ($scope.sfcBrazilLineNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn39').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = sfcBrazilLineIds;
				updata.logisticsName = "LAEXP#SFC Brazil line";
				updata.enName = 'SFC Brazil line';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn39').addClass('btn-active1');
					console.log(data)
					// if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)

						var ids = {};
						ids.ids = sfcBrazilLineIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun34 = function () {//DHL eCommerce
				if ($scope.hkDhlNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn34').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel34').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = hkDhlIds;
				updata.logisticsName = $('.qd-sel34').val();
				updata.enName = 'DHL HongKong';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn34').addClass('btn-active1');
					console.log(data)
					// if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)

						var ids = {};
						ids.ids = hkDhlIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun33 = function () {//三态
				if ($scope.sanTaiNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn33').hasClass('btn-active1')) {
					return;
				}
				var whereTarget;
				if ($('.qd-sel33').val() == '请选择') {
					layer.msg('请选择仓库');
					return;
				} else if ($('.qd-sel33').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.qd-sel33').val() == '义乌') {
					whereTarget = 'YW'
				}
				let stCsArr = [];
				let cjpacketIds = '';
				if(sTAuIds!=''){
					stCsArr.push(stCsFun(sTAuIds,'STEXPTH','三态物流澳洲专线'))
					cjpacketIds += sTAuIds;
				}
				if(sTCaIds!=''){
					stCsArr.push(stCsFun(sTCaIds,'STEXPTH','三态物流加拿大专线'))
					cjpacketIds += sTCaIds;
				}
				if(sTDeZxIds!=''){
					stCsArr.push(stCsFun(sTDeZxIds,'STEXPTH','三态快邮德国小包挂号'))
					cjpacketIds += sTDeZxIds;
				}
				if(sTDeThIds!=''){
					stCsArr.push(stCsFun(sTDeThIds,'DEEXPLS','三态物流德国专线特惠'))
					cjpacketIds += sTDeThIds;
				}
				if (sTUsDdIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTUsDdIds, 'GP', '美国联邮通挂号带电')) : stCsArr.push(stCsFun(sTUsDdIds, 'GP', '美国联邮通挂号带电'))
					cjpacketIds += sTUsDdIds;
				}
				if (sTUsBddIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTUsBddIds, 'QC', '美国联邮通挂号普货')) : stCsArr.push(stCsFun(sTUsBddIds, 'QC', '美国联邮通挂号普货'))
					cjpacketIds += sTUsBddIds;
				}
				if(sTMxIds!=''){
					stCsArr.push(stCsFun(sTMxIds,'MXEXP','三态物流墨西哥专线'))
					cjpacketIds += sTMxIds;
				}
				if(yTBddIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTBddIds,'YW-THPHR','云途专线全球挂号')):stCsArr.push(stCsFun(yTBddIds,'SZ-THPHR','云途专线全球挂号'))
					cjpacketIds += yTBddIds;
				}
				if(yTDdIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTDdIds,'YW-THZXR','义乌云途专线全球挂号')):stCsArr.push(stCsFun(yTDdIds,'SZ-THZXR','深圳云途专线全球挂号'))
					cjpacketIds += yTDdIds;
				}
				if(yTGbDdIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTGbDdIds,'484','义乌燕文专线追踪小包')):stCsArr.push(stCsFun(yTGbDdIds,'484','深圳燕文专线追踪小包'))
					cjpacketIds += yTGbDdIds;
				}
				if(yTGbBddIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTGbBddIds,'481','义乌燕文专线追踪小包')):stCsArr.push(stCsFun(yTGbBddIds,'481','深圳燕文专线追踪小包'))
					cjpacketIds += yTGbBddIds;
				}
				if(yTBrIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTBrIds,'BRZX','义乌壹电商巴西专线')):stCsArr.push(stCsFun(yTBrIds,'BRZX','深圳壹电商巴西专线'))
					cjpacketIds += yTBrIds;
				}
				if(yTYdsKrIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTYdsKrIds,'KRZX','义乌壹电商韩国专线')):stCsArr.push(stCsFun(yTYdsKrIds,'KRZX','深圳壹电商韩国专线'))
					cjpacketIds += yTYdsKrIds;
				}
				if(yTEsIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTEsIds,'ESZX','义乌壹电商西班牙专线')):stCsArr.push(stCsFun(yTEsIds,'ESZX','深圳壹电商西班牙专线'))
					cjpacketIds += yTEsIds;
				}
				if(stGBIds != ''){
					whereTarget=='YW'?stCsArr.push(stCsFun(stGBIds,'STEXPTH','义乌三态英国经济专线')):stCsArr.push(stCsFun(stGBIds,'STEXPTH','深圳三态英国经济专线'))
					cjpacketIds += stGBIds;
				}
				if (cjpacketCazxIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(cjpacketCazxIds, 'JNDZX', '义乌加拿大专线')) : stCsArr.push(stCsFun(cjpacketCazxIds, 'JNDZX', '深圳加拿大专线'))
					cjpacketIds += cjpacketCazxIds;
				}
				erp.load();
				$scope.succscydnumflag = true;
				if(stCsArr.length>0){
					var updata = {};
					updata.list = stCsArr;
					updata.enName = 'CJPacket';
					updata.loginName = erpLoginName;
					updata.orderType="CJPAY";
					console.log(JSON.stringify(updata))
					erp.postFun('app/erplogistics/updateCJPacketOrderLogistic', JSON.stringify(updata), function (data) {
						$('.scyd-btn33').addClass('btn-active1');
						console.log(data)
						if (data.data.result > 0) {
							var textarr = ['.', '..', '...', '....', '.....', '......'];
							var inputText = '';
							var i = 0;
							var timer = setInterval(function () {
								$('#animat-text').text('正在生成追踪号' + textarr[i]);
								i++;
								if (i > 5) {
									i = 0;
								}
							}, 500)
							var diQu = '';
							if (whereTarget == 'SZ') {
								diQu = 'y';
							} else {
								diQu = '';
							}
							var ids = {};
							ids.ids = cjpacketIds;
							ids.loginName = erpLoginName;
							ids.shenzhen = diQu;
							ids.orderType="CJPAY";
							console.log(JSON.stringify(ids))
							erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
								console.log(data)
								clearInterval(timer);//加载后清除定时器
								$('#animat-text').text('');//提示消息置为空
								$scope.endadmateP = true;//让成功失败条数显示起来

								layer.closeAll("loading")
								var result = data.data;
								$scope.sess = 0;//存储成功的个数
								$scope.error = 0;//存储失败的个数
								for (var i = 0; i < result.length; i++) {
									$scope.sess += result[i].sess;
									$scope.error += result[i].error;
								}

							}, function (data) {
								console.log(data)
								layer.closeAll("loading")
							})
						}
					}, function (data) {
						console.log(data)
						layer.closeAll("loading")
					})
				}

				if($scope.teDingGuoJiaCjpacketCount>0){//有特定国家的cjpacekt订单
					var updata = {};
					updata.ids = teDingGuoJiaCjpacketIds;
					updata.orderType="CJPAY";
					erp.postFun('erp/cjorder/initKerryLogisticsModel', JSON.stringify(updata), function (data) {
						$('.scyd-btn42').addClass('btn-active1');
						console.log(data)
						if (data.data.statusCode == 200) {
							var textarr = ['.', '..', '...', '....', '.....', '......'];
							var inputText = '';
							var i = 0;
							var timer = setInterval(function () {
								$('#animat-text').text('正在生成追踪号' + textarr[i]);
								i++;
								if (i > 5) {
									i = 0;
								}
							}, 500)
							var diQu = '';
							if (whereTarget == 'SZ') {
								diQu = 'y';
							} else {
								diQu = '';
							}
							var ids = {};
							ids.ids = teDingGuoJiaCjpacketIds;
							ids.loginName = erpLoginName;
							ids.shenzhen = diQu;
							ids.orderType="CJPAY";
							console.log(JSON.stringify(ids))
							erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
								console.log(data)
								clearInterval(timer);//加载后清除定时器
								$('#animat-text').text('');//提示消息置为空
								$scope.endadmateP = true;//让成功失败条数显示起来

								layer.closeAll("loading")
								var result = data.data;
								$scope.sess = 0;//存储成功的个数
								$scope.error = 0;//存储失败的个数
								for (var i = 0; i < result.length; i++) {
									$scope.sess += result[i].sess;
									$scope.error += result[i].error;
								}

							}, function (data) {
								console.log(data)
								layer.closeAll("loading")
							})
						}
					}, function (data) {
						console.log(data)
						layer.closeAll("loading")
					})
				}
			}
			$scope.enterscmdFun28 = function () {//usps
				if ($scope.usZhwlNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn28').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.scydflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = usZhwlIds;
				updata.upMode = 'y';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn28').addClass('btn-active1');
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text1').text('正在传送订单' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						var ids = {};
						ids.ids = usZhwlIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text1').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}
							var freshJson = {};
							freshJson.ids = usZhwlIds;
							freshJson.loginName = erpLoginName;
							erp.zfPostFun('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
								console.log(data)
							},function(data){
								console.log(data)
							})
						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun25 = function () {//美国
				if ($scope.usZhwlNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn25').hasClass('btn-active1')) {
					return;
				}
				$scope.succscydnumflag = true;
				$('.scyd-btn25').addClass('btn-active1');
				erp.load();
				var ids = {};
				ids.ids = usZhwlIds;
				ids.loginName = erpLoginName;
				ids.orderType="CJPAY";
				console.log(JSON.stringify(ids))
				erp.zfPostFun('createTrackNumber.json', JSON.stringify(ids), function (data) {
					console.log(data)
					// clearInterval(timer);//加载后清除定时器
					// $('#animat-text').text('');//提示消息置为空
					$scope.endadmateP = true;//让成功失败条数显示起来

					layer.closeAll("loading")
					var result = data.data;
					$scope.sess = 0;//存储成功的个数
					$scope.error = 0;//存储失败的个数
					$scope.sess = result.sess;//存储成功的个数
					$scope.error = result.error;//存储失败的个数

				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun26 = function () {//美国
				if ($scope.yanWenNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn26').hasClass('btn-active1')) {
					return;
				}
				if(!$scope.whereYanWen){
					layer.msg('请选择地区')
					return
				}
				if ($('.qd-sel26').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = yanWenIds;
				updata.logisticsName = $('.qd-sel26').val();
				updata.enName = 'YanWen';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn26').addClass('btn-active1');
					console.log(data)
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						let diQu;
						if ($scope.whereYanWen == 'shenZhen') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = yanWenIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						ids.shenzhen = diQu;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun28 = function () {//usps
				if ($scope.usZhwlNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn28').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.scydflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = usZhwlIds;
				updata.upMode = 'y';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn28').addClass('btn-active1');
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text1').text('正在传送订单' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						var ids = {};
						ids.ids = usZhwlIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text1').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}
							var freshJson = {};
							freshJson.ids = usZhwlIds;
							freshJson.loginName = erpLoginName;
							erp.zfPostFun('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
								console.log(data)
							},function(data){
								console.log(data)
							})
						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun29 = function () {//usps
				if ($scope.jewelNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn29').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.scydflag = true;
				var updata = {};
				updata.orderNum = jewelIds;
				updata.upMode = 'y';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn29').addClass('btn-active1');
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text1').text('正在传送订单' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						var ids = {};
						ids.ids = jewelIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text1').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}
							var freshJson = {};
							freshJson.ids = jewelIds;
							freshJson.loginName = erpLoginName;
							erp.zfPostFun('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
								console.log(data)
							},function(data){
								console.log(data)
							})
						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun30 = function () {//美国
				if ($scope.jewelNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn30').hasClass('btn-active1')) {
					return;
				}
				$scope.succscydnumflag = true;
				$('.scyd-btn30').addClass('btn-active1');
				erp.load();
				var ids = {};
				ids.ids = jewelIds;
				ids.loginName = erpLoginName;
				ids.orderType="CJPAY";
				console.log(JSON.stringify(ids))
				erp.zfPostFun('createTrackNumber.json', JSON.stringify(ids), function (data) {
					console.log(data)
					$scope.endadmateP = true;//让成功失败条数显示起来
					layer.closeAll("loading")
					var result = data.data;
					$scope.sess = 0;//存储成功的个数
					$scope.error = 0;//存储失败的个数
					$scope.sess = result.sess;//存储成功的个数
					$scope.error = result.error;//存储失败的个数
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun31 = function () {//usps
				if ($scope.jewelPlusNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn31').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.scydflag = true;
				var updata = {};
				updata.orderNum = jewelPlusIds;
				updata.upMode = 'y';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn31').addClass('btn-active1');
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text1').text('正在传送订单' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						var ids = {};
						ids.ids = jewelPlusIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text1').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}
							var freshJson = {};
							freshJson.ids = jewelPlusIds;
							freshJson.loginName = erpLoginName;
							erp.zfPostFun('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
								console.log(data)
							},function(data){
								console.log(data)
							})
						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun32 = function () {//美国
				if ($scope.jewelPlusNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn32').hasClass('btn-active1')) {
					return;
				}
				$scope.succscydnumflag = true;
				$('.scyd-btn32').addClass('btn-active1');
				erp.load();
				var ids = {};
				ids.ids = jewelPlusIds;
				ids.loginName = erpLoginName;
				ids.orderType="CJPAY";
				console.log(JSON.stringify(ids))
				erp.zfPostFun('createTrackNumber.json', JSON.stringify(ids), function (data) {
					console.log(data)
					$scope.endadmateP = true;//让成功失败条数显示起来
					layer.closeAll("loading")
					var result = data.data;
					$scope.sess = 0;//存储成功的个数
					$scope.error = 0;//存储失败的个数
					$scope.sess = result.sess;//存储成功的个数
					$scope.error = result.error;//存储失败的个数
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun24 = function () {//DHL eCommerce
				if ($scope.epackSzGfNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn24').hasClass('btn-active1')) {
					return;
				}
				var szgfepackIds = '';
				var notUniqArr = [];
				for(var j = 0,jLen=zszgfStuArr.length;j<jLen;j++){
					console.log(notUniqArr.indexOf(zszgfStuArr[j]))
					console.log(notUniqArr.indexOf(zszgfStuArr[j])==-1)
					if(notUniqArr.indexOf(zszgfStuArr[j])==-1){
					    notUniqArr.push(zszgfStuArr[j]);
					}
				}
				console.log(notUniqArr)
				for(var i = 0,len = notUniqArr.length;i<len;i++){
					if(notUniqArr[i]==1){
						szgfepackIds+=ddepackIds;
					}
					if(notUniqArr[i]==2){
						szgfepackIds+=bdepackIds;
					}
					if(notUniqArr[i]==3){
						szgfepackIds+=hcepackIds;
					}
					if(notUniqArr[i]==4){
						szgfepackIds+=hfmepackIds;
					}
					if(notUniqArr[i]==5){
						szgfepackIds+=gzepackIds;
					}
				}
				console.log(szgfepackIds)
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = szgfepackIds;
				updata.logisticsName = 'GFEUB#深圳官方E邮宝-E邮宝带电';
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn24').addClass('btn-active1');
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)

						var ids = {};
						ids.ids = szgfepackIds;
						ids.shenzhen = 'y';
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来
							zszgfStuArr = [];
							notUniqArr = [];
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun17 = function () {//南风顺丰
				if($scope.nfOrTtNum<=0){
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if($('.qd-sel17').val()=='请选择'){
					layer.msg('请选择物流渠道');
					return;
				}
				if($('.scyd-btn17').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = nfSfIds;
				updata.logisticsName = $('.qd-sel17').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn17').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)

						var ids = {};
						ids.ids = nfOrTtIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun15 = function () {//南风顺丰
				if($scope.nfSfNum<=0){
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if($('.qd-sel15').val()=='请选择'){
					layer.msg('请选择物流渠道');
					return;
				}
				if($('.scyd-btn15').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = nfSfIds;
				updata.logisticsName = $('.qd-sel15').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn15').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)

						var ids = {};
						ids.ids = nfSfIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun16 = function () {//泰腾顺丰
				if($scope.ttSfNum<=0){
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if($('.qd-sel16').val()=='请选择'){
					layer.msg('请选择物流渠道');
					return;
				}
				if($('.scyd-btn16').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = ttSfIds;
				updata.logisticsName = $('.qd-sel16').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn16').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)

						var ids = {};
						ids.ids = ttSfIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun11 = function () {//带电dhl
				if($scope.dhlddIds<=0){
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if($('.scyd-btn11').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = dhlddIds;
				updata.logisticsName = "CT02#DHL带电";
				updata.enName = 'DHL';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn11').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)

						var ids = {};
						ids.ids = dhlddIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun12 = function () {//不带电dhl
				if($scope.dhlnotdIds<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.scyd-btn12').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = dhlnotdIds;
				updata.logisticsName = "CT01#DHL不带电";
				updata.enName = 'DHL';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn12').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){

						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = dhlnotdIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun19 = function () {//不带电dhl
				if($scope.dhlGfNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.scyd-btn19').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = dhlGfIds;
				updata.logisticsName = "DHLGF#DHL不带电";
				updata.enName = 'DHL';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn19').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){

						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = dhlGfIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun20 = function () {//不带电dhl
				if($scope.dhlOfficialNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.scyd-btn20').hasClass('btn-active1')){
					return;
				}
				if ($('.qd-sel20').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = dhlOfficialIds;
				updata.logisticsName = $('.qd-sel20').val();
				updata.enName = 'DHL Official';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn20').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){

						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = dhlOfficialIds;
						// ids.shenzhen = diQu;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来
							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun1 = function () {//带电E邮宝
				if($scope.ddepackNum<=0){
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if($('.qd-sel1').val()=='请选择'){
					layer.msg('请选择物流渠道');
					return;
				}
				if($('.scyd-btn1').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = ddepackIds;
				updata.logisticsName = $('.qd-sel1').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn1').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)

						var ids = {};
						ids.ids = ddepackIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun2 = function () {//不带电E邮宝
				if($scope.bdepackNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.qd-sel2').val()=='请选择'){
					layer.msg('请选择物流渠道');
					return;
				}
				if($('.scyd-btn2').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = bdepackIds;
				updata.logisticsName = $('.qd-sel2').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn2').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = bdepackIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun21 = function () {//usps+
				if($scope.uspsNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.scyd-btn21').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.scydflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = uspsIds;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn21').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){

						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text1').text('正在传送订单'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = uspsIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text1').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun22 = function () {//usps+
				if($scope.uspsNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.scyd-btn22').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = uspsIds;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn22').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在获取追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = uspsIds;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('getShipstationWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=result.sess;//存储成功的个数
							$scope.error=result.error;//存储失败的个数

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun4 = function () {//usps
				if($scope.uspsNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				// if($('.qd-sel4').val()=='请选择'){
				// 	layer.msg('请选择物流渠道');
				// 	return;
				// }
				if($('.scyd-btn4').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = uspsIds;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn4').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){

						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = uspsIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createTrackNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun3 = function () {//其它物流生成运单号
				if($scope.qtwlordNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.scyd-btn3').hasClass('btn-active1')){
					return;
				}
				// $scope.zzscydFlag = true;
				erp.load();
				var textarr = ['.','..','...','....','.....','......'];
				var inputText = '';
				var i = 0;
				var timer = setInterval(function () {
					$('#animat-text').text('正在生成追踪号'+textarr[i]);
					i++;
					if(i>5){
						i=0;
					}
				},500)

				$scope.succscydnumflag = true;
				var ids = {};
				ids.ids = qtwlIds;
				ids.orderType="CJPAY";
				ids.loginName = erpLoginName;
				console.log(JSON.stringify(ids))
				erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
					$('.scyd-btn3').addClass('btn-active1');
					console.log(data)
					clearInterval(timer);//加载后清除定时器
					$('#animat-text').text('');//提示消息置为空
					$scope.endadmateP = true;//让成功失败条数显示起来
					layer.closeAll("loading")
					var result=data.data;
					$scope.sess=0;//存储成功的个数
					$scope.error=0;//存储失败的个数
					for(var i=0;i<result.length;i++){
						$scope.sess+=result[i].sess;
						$scope.error+=result[i].error;
					}

				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})

			}
			// $scope.enterscmdFun5 = function () {//带电邮政小包生成运单号函数
			// 	if($scope.ddyzxbNum<=0){
			// 		layer.msg('订单数为零不能生成订单');
			// 		return;
			// 	}
			// 	if($('.qd-sel5').val()=='请选择'){
			// 		layer.msg('请选择物流渠道');
			// 		return;
			// 	}
			// 	if($('.scyd-btn5').hasClass('btn-active1')){
			// 		return;
			// 	}
			// 	erp.load();
			// 	$scope.succscydnumflag = true;
			// 	// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
			// 	var updata = {};
			// 	updata.orderNum = ddyzxbIds;
			// 	updata.logisticsName = $('.qd-sel5').val();
			// 	updata.enName = 'China Post Registered Air Mail';
			// 	updata.loginName = erpLoginName;
			// 	console.log(JSON.stringify(updata))
			// 	erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
			// 		$('.scyd-btn1').addClass('btn-active1');
			// 		console.log(data)
			// 		if(data.data.result>0){
			// 			var textarr = ['.','..','...','....','.....','......'];
			// 			var inputText = '';
			// 			var i = 0;
			// 			var timer = setInterval(function () {
			// 				$('#animat-text').text('正在生成追踪号'+textarr[i]);
			// 				i++;
			// 				if(i>5){
			// 					i=0;
			// 				}
			// 			},500)

			// 			var ids = {};
			// 			ids.ids = ddyzxbIds;
			// 			console.log(JSON.stringify(ids))
			// 			erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
			// 				console.log(data)
			// 				clearTimeout(timer);//加载后清除定时器
			// 				$('#animat-text').text('');//提示消息置为空
			// 				$scope.endadmateP = true;//让成功失败条数显示起来

			// 				layer.closeAll("loading")
			// 				var result=data.data;
			// 				$scope.sess=0;//存储成功的个数
			// 				$scope.error=0;//存储失败的个数
			// 				for(var i=0;i<result.length;i++){
			// 					$scope.sess+=result[i].sess;
			// 					$scope.error+=result[i].error;
			// 				}

			// 			},function (data) {
			// 				console.log(data)
			// 				layer.closeAll("loading")
			// 			})
			// 		}
			// 	},function (data) {
			// 		console.log(data)
			// 		layer.closeAll("loading")
			// 	})
			// }
			$scope.enterscmdFun13 = function () {//带电E邮宝生成运单号函数
				if($scope.hcepackNum<=0){
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if($('.scyd-btn13').hasClass('btn-active1')){
					return;
				}
				if ($('.qd-sel13').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = hcepackIds;
				updata.logisticsName = $('.qd-sel13').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn13').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)

						var ids = {};
						ids.ids = hcepackIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun18 = function () {//含粉末E邮宝生成运单号函数
				if($scope.hfmepackNum<=0){
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if($('.scyd-btn18').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = hfmepackIds;
				updata.logisticsName = "BEUBH#BJ cosmetics epacket";
				updata.enName = 'BJ cosmetics epacket';
				updata.orderType="CJPAY";
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn18').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)

						var ids = {};
						ids.ids = hfmepackIds;
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun9 = function () {//膏状E邮宝
				if($scope.epackGzNum<=0){
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if($('.scyd-btn9').hasClass('btn-active1')){
					return;
				}
				if ($('.qd-sel9').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = gzepackIds;
				updata.logisticsName = $('.qd-sel9').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn9').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)

						var ids = {};
						ids.ids = gzepackIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun10 = function () {//云途
				if($scope.ytNum<=0){
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if($('.scyd-btn10').hasClass('btn-active1')){
					return;
				}
				var whereTarget;
				if($('.qd-sel10').val()=='请选择'){
					layer.msg('请选择物流渠道');
					return;
				}else if($('.qd-sel10').val()=='深圳'){
					whereTarget = 'SZ'
				}else if($('.qd-sel10').val()=='义乌'){
					whereTarget = 'YW'
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = ytIds;
				updata.logisticsName = whereTarget;
				updata.enName = 'yuntu';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn10').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)

						var ids = {};
						ids.ids = ytIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun6 = function () {//不带电邮政小包
				if($scope.bdyzxbNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.qd-sel6').val()=='请选择'){
					layer.msg('请选择物流渠道');
					return;
				}
				if($('.scyd-btn6').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = bdyzxbIds;
				updata.logisticsName = $('.qd-sel6').val();
				updata.enName = 'China Post Registered Air Mail';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn6').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){

						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = bdyzxbIds;
						ids.orderType="CJPAY";
						ids.loginName = erpLoginName;
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun7 = function () {//usps+
				if($scope.uspsPlusNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.scyd-btn7').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.scydflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = uspsPlusIds;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'USPS+';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn7').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){

						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text1').text('正在传送订单'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = uspsPlusIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text1').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun8 = function () {//usps+
				if($scope.uspsPlusNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.scyd-btn8').hasClass('btn-active1')){
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = uspsPlusIds;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'USPS+';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn8').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在获取追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = uspsPlusIds;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('getShipstationWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=result.sess;//存储成功的个数
							$scope.error=result.error;//存储失败的个数
							// for(var i=0;i<result.length;i++){
							// 	$scope.sess+=result[i].sess;
							// 	$scope.error+=result[i].error;
							// }

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			//usps+ 生成追踪号
			$scope.enterscmdFun14 = function () {
				if($scope.uspsPlusNum<=0){
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if($('.scyd-btn14').hasClass('btn-active1')){
					return;
				}
				erp.load()
				var ids = {};
				ids.ids = uspsPlusIds;
				ids.orderType="CJPAY";
				console.log(JSON.stringify(ids))
				erp.zfPostFun('createTrackNumber.json',JSON.stringify(ids),function (data) {
					console.log(data)
					$scope.succscydnumflag = true;
					$('.scyd-btn14').addClass('btn-active1');
					$('#animat-text').text('');//提示消息置为空
					$scope.endadmateP = true;//让成功失败条数显示起来

					layer.closeAll("loading")
					var result=data.data;
					$scope.sess=result.sess;//存储成功的个数
					$scope.error=result.error;//存储失败的个数
					// for(var i=0;i<result.length;i++){
					// 	$scope.sess+=result[i].sess;
					// 	$scope.error+=result[i].error;
					// }

				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun50 = function () {//DHL eCommerce
				if ($scope.cjpacketSeaNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn50').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel50').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = cjpacketSeaIds;
				updata.logisticsName = $('.qd-sel50').val();
				updata.enName = 'CJPacket Sea';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				erp.postFun('app/erplogistics/updateOrderLogistic',JSON.stringify(updata),function (data) {
					$('.scyd-btn50').addClass('btn-active1');
					console.log(data)
					if(data.data.result>0){
						var textarr = ['.','..','...','....','.....','......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在获取追踪号'+textarr[i]);
							i++;
							if(i>5){
								i=0;
							}
						},500)
						var ids = {};
						ids.ids = cjpacketSeaIds;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json',JSON.stringify(ids),function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result=data.data;
							$scope.sess=0;//存储成功的个数
							$scope.error=0;//存储失败的个数
							for(var i=0;i<result.length;i++){
								$scope.sess+=result[i].sess;
								$scope.error+=result[i].error;
							}

						},function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				},function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun51 = function () {
				if ($scope.euroOrdinarNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn51').hasClass('btn-active1')) {
					return;
				}
				let stCsArr = [];
				let cjpacketIds = '';
				if (euroOrdinarGbIds != '') {
					stCsArr.push(stCsFun(euroOrdinarGbIds, 'FU', '联油通挂号TR48标准服务'))
					cjpacketIds += euroOrdinarGbIds;
				}
				if (euroOrdinarDeIds != '') {
					stCsArr.push(stCsFun(euroOrdinarDeIds, 'A6', '4PX联邮通挂号'))
					cjpacketIds += euroOrdinarDeIds;
				}
				if (euroOrdinarFrIds != '') {
					stCsArr.push(stCsFun(euroOrdinarFrIds, 'PX', '4PX联邮通Y优先普货'))
					cjpacketIds += euroOrdinarFrIds;
				}
				if (euroOrdinarBeIds != '') {
					stCsArr.push(stCsFun(euroOrdinarBeIds, 'ED', '泛欧挂号'))
					cjpacketIds += euroOrdinarBeIds;
				}
				if (euroOrdinarItIds != '') {
					stCsArr.push(stCsFun(euroOrdinarItIds, 'IO', '联邮通意大利专线挂号'))
					cjpacketIds += euroOrdinarItIds;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'CJPacket Euro Ordinary';
				updata.loginName = erpLoginName;
				updata.orderType="CJPAY";
				erp.postFun('app/erplogistics/updateCJPacketOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn51').addClass('btn-active1');
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在生成追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						ids.orderType="CJPAY";
						console.log(JSON.stringify(ids))
						erp.zfPostFun('createWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}
						}, function (data) {
							console.log(data)
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			//关闭成功 失败生成订单的条数
			$scope.succscydnumcloseFun = function () {
				$scope.succscydnumflag = false;
				$scope.scydflag = false;//关闭传送订单成功失败的弹框
				$scope.sess='';//存储成功的个数
				$scope.error='';//存储失败的个数
			}
		}
		//生成运单号的关闭函数
		$scope.isydCloseFun = function () {
			$scope.currtpage = 1;
			$scope.isydFlag = false;
			$scope.cjPacketVal ='init';
			$('.scyd-btn1').removeClass('btn-active1');
			$('.scyd-btn2').removeClass('btn-active1');
			$('.scyd-btn3').removeClass('btn-active1');
            $('.scyd-btn4').removeClass('btn-active1');
			$('.scyd-btn5').removeClass('btn-active1');
			$('.scyd-btn6').removeClass('btn-active1');
			$('.scyd-btn7').removeClass('btn-active1');
			$('.scyd-btn8').removeClass('btn-active1');
			$('.scyd-btn9').removeClass('btn-active1');
            $('.scyd-btn10').removeClass('btn-active1');
            $('.scyd-btn11').removeClass('btn-active1');
            $('.scyd-btn12').removeClass('btn-active1');
            $('.scyd-btn13').removeClass('btn-active1');
            $('.scyd-btn14').removeClass('btn-active1');
            $('.scyd-btn15').removeClass('btn-active1');
            $('.scyd-btn16').removeClass('btn-active1');
            $('.scyd-btn17').removeClass('btn-active1');
            $('.scyd-btn18').removeClass('btn-active1');
            $('.scyd-btn19').removeClass('btn-active1');
            $('.scyd-btn20').removeClass('btn-active1');
            $('.scyd-btn21').removeClass('btn-active1');
            $('.scyd-btn22').removeClass('btn-active1');
            $('.scyd-btn23').removeClass('btn-active1');
            $('.scyd-btn24').removeClass('btn-active1');
            $('.scyd-btn25').removeClass('btn-active1');
            $('.scyd-btn26').removeClass('btn-active1');
            $('.scyd-btn27').removeClass('btn-active1');
            $('.scyd-btn28').removeClass('btn-active1');
            $('.scyd-btn29').removeClass('btn-active1');
            $('.scyd-btn30').removeClass('btn-active1');
            $('.scyd-btn31').removeClass('btn-active1');
            $('.scyd-btn32').removeClass('btn-active1');
			$('.scyd-btn33').removeClass('btn-active1');
			$('.scyd-btn34').removeClass('btn-active1');
			$('.scyd-btn35').removeClass('btn-active1');
			$('.scyd-btn36').removeClass('btn-active1');
			$('.scyd-btn37').removeClass('btn-active1');
			$('.scyd-btn38').removeClass('btn-active1');
			$('.scyd-btn39').removeClass('btn-active1');
			$('.scyd-btn40').removeClass('btn-active1');
			$('.scyd-btn41').removeClass('btn-active1');
			$('.scyd-btn42').removeClass('btn-active1');
			$('.scyd-btn43').removeClass('btn-active1');
			$('.scyd-btn50').removeClass('btn-active1');
			erp.load();
			zszgfStuArr = [];
			getOrderList($scope,erp);
			// var erpData = {};
			// //判断是不是状态1未生成追踪号的订单
			// if ($scope.selstu>1) {
			// 	erpData.ydh = 'y';
			// } else {
			// 	erpData.ydh = '';
			// }
			// if(muId!=''){
			// 	erpData.id = muId;
			// }else {
			// 	erpData.id = '';
			// }
			// seltjFun(erpData);
			// erpData.cjOrderDateBegin = $('#c-data-time').val();
			// erpData.cjOrderDateEnd = $('#cdatatime2').val();
			// erpData.status = '10';
			// erpData.page = 1;
			// erpData.limit = $('#page-sel').val()-0;
			// console.log(JSON.stringify(erpData))
			// erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			// 	console.log(data)
			// 	layer.closeAll("loading")
			// 	var erporderResult = data.data;//存储订单的所有数据
			// 	// erporderResult = JSON.parse(data.data.orderList)
			// 	$scope.erpordTnum = erporderResult.orderCount;
			// 	$scope.erporderList = erporderResult.ordersList;
			// 	countMFun ($scope.erporderList);
			// 	dealpage ()
			// },function () {
			// 	layer.closeAll("loading")
			// 	layer.msg('订单获取列表失败')
			// 	// alert(2121)
			// })
		}


		//批量打印运单
		//询问是否打印面单弹窗
		$scope.isdymdFlag = false;
		$scope.isdymdFun = function () {
			$scope.isdymdFlag = true;
		}
		//关闭询问弹框
		$scope.isdymdCloseFun = function () {
			$scope.isdymdFlag = false;
		}
		$scope.mdtcFlag = false;
		$scope.closeTcFun = function () {
			$scope.mdtcFlag = false;
		}
		//确定打印面单
		$scope.buckdyydFun = function () {
			$scope.isdymdFlag = false;//关闭询问是否打印订单的提示框
			erp.load();
			var ids = {};
			var printIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					// numindex++;
					printIds+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			ids.ids = printIds;
			ids.type = '1';
			ids.loginName = erpLoginName;
			ids.orderType='CJPAY';
			console.log(JSON.stringify(ids))
			// return;
			erp.zfPostFun('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				console.log(data.data)
				$scope.pdfmdArr = data.data;//生成的面单数组
				layer.closeAll("loading")
				if ($scope.pdfmdArr.length>0) {
					$scope.mdtcFlag = true;
				} else {
					layer.msg('生成面单错误')
				}
			},function (data) {
				console.log(data)
				layer.closeAll("loading")
				layer.msg('网络错误')
			})
		}
		$scope.hbBuckdyydFun = function () {
			$scope.isdymdFlag = false;//关闭询问是否打印订单的提示框
			erp.load();
			var ids = {};
			var printIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					// numindex++;
					printIds+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			ids.ids = printIds;
			ids.type = '1';
			ids.merge = 'y';
			ids.loginName = erpLoginName;
			ids.orderType='CJPAY';
			console.log(JSON.stringify(ids))
			// return;
			erp.zfPostFun('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				console.log(data.data)
				$scope.pdfmdArr = data.data;//生成的面单数组
				layer.closeAll("loading")
				if ($scope.pdfmdArr.length>0) {
					$scope.mdtcFlag = true;
				} else {
					layer.msg('生成面单错误')
				}
			},function (data) {
				console.log(data)
				layer.closeAll("loading")
				layer.msg('网络错误')
			})
		}
		//单个操作一条订单打印面单
		$scope.oneisdymdFlag = false;
		var onemdId = '';//存储一条订单的id
		$scope.oneisdymdFun = function (item) {
			console.log(item);
			onemdId = item.id;
			$scope.oneisdymdFlag = true;
		}
		$scope.onedymdcloseFun = function () {
			$scope.oneisdymdFlag = false;
		}
		$scope.oneSureFun = function () {
			$scope.oneisdymdFlag = false;//关闭询问是否打印订单的提示框
			erp.load();
			var ids = {};
			ids.ids = onemdId;
			ids.type = '1';
			ids.loginName = erpLoginName;
			ids.orderType='CJPAY';
			if($scope.selstu == 6){//修改完地址的
				ids.orderStatusRecordType = '1';
			}
			console.log(JSON.stringify(ids))
			// return;
			erp.zfPostFun('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				layer.closeAll("loading")
				// var href = data.data.href;
				$scope.pdfmdArr = data.data;//生成的面单数组
				if ($scope.pdfmdArr.length>0) {
					$scope.mdtcFlag = true;
				} else {
					layer.msg('生成面单错误')
				}
			},function (data) {
				console.log(data)
				layer.closeAll("loading")
				layer.msg('网络错误')
			})
		}
		//生成面单链接后的关闭按钮函数
		$scope.closeTcFun = function () {
			$scope.mdtcFlag = false;
		}


		//单独生成运单号的关闭按钮
		$scope.oneisydCloseFun = function () {
			$scope.oneisydFlag = false;
			$scope.sess=0;//存储成功的个数
			$scope.error=0;//存储失败的个数
			getOrderList($scope,erp);
		}
		//单独生成运单号成功失败弹框的关闭函数
		$scope.onesuccscydnumcloseFun = function () {
			$scope.onesuccscydnumflag = false;
		}
		//阻止冒泡
		$scope.stopFun = function (e) {
			e.stopPropagation();
		}

		//单独同步至店铺
		$scope.onetbdpFlag = false;
		$scope.onetbdpcloseFun = function () {
			$scope.onetbdpFlag = false;
		}
		$scope.istbzdpFun = function (item) {
			$scope.onetbdpFlag = true;//打开询问框
			$scope.itemId = item.ID;
			$scope.shoptype = item.STORE_NAME;//判断店铺类型
		}
		$scope.onetbdpSureFun = function () {
			$scope.onetbdpFlag = false;//关闭询问框
			// var shopIds = '';//存储店铺id
			// var excelIds = '';//存储excel 的id
			console.log($scope.itemId)
			var upData = {};
			if ($scope.shoptype=="Excel Imported") {
				upData.excelId = $scope.itemId;
			} else {
				upData.shopId = $scope.itemId;
			}
			erp.load();
			console.log(JSON.stringify(upData))
			erp.postFun('app/order/fulfilOrder',JSON.stringify(upData),function (data) {
				console.log(data)
				if (data.data.result) {
					layer.msg('同步成功')
					getOrderList($scope,erp);
				} else {
					layer.closeAll("loading")
					layer.msg('同步失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}

		//批量修改物流的弹窗
		erp.postFun('app/order/getAllLogistics',{},function (data) {
			console.log(data)
			$scope.powerJob = data.data.power;
			$scope.wlListArr = data.data.list;
		},function (data) {
			console.log(data)
		})
		var selIds = '';
		$scope.changeWLFun = function () {
			selIds = '';
			var selCount = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					selCount++;
					selIds+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			if(selCount<1){
				layer.msg('请选择订单')
				return;
			}else{
				$scope.chengeWlFlag = true;
			}
			console.log($scope.changeWlName)
		}
		$scope.sureChangeWlFun = function () {
			// debugger
			console.log($scope.changeWlName)
			if($scope.changeWlName){
				erp.load(2)
				var chageData = {};
				chageData.ids = selIds;
				chageData.name = $scope.changeWlName;
				chageData.orderType = "CJPAY";
				erp.postFun('app/order/replaceLogistics',JSON.stringify(chageData),function (data) {
					console.log(data)
					$scope.chengeWlFlag = false;
					if (data.data.code>0) {
						getOrderList($scope,erp);
						layer.msg('修改成功')
					}else{
						layer.closeAll("loading");
						layer.msg('修改失败')
					}
				},function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
		}
		$scope.changeoneordWLFun = function () {
			erp.postFun('app/order/getWay','',function (data) {
				// alert(66666)
				console.log(data)
				$scope.wlfsList = data.data;
				console.log($scope.wlfsList)
			},function () {
				console.log('物流获取失败')
			})
			$scope.wlChangeFlag = true;
			// $scope.selfun(selfir);
		}

		//批量修改物流的弹窗
		$scope.wlChangeFlag = false;
		// var changeordId = '';//订单id
		// var changeordWL = '';//订单物流

		var isopenFlag = 0;
		$scope.epacketArr = [];
		$scope.epacketFlag = false;
		$scope.zgyzArr = [];
		$scope.zgyzFlag = false;
		var xgwldata='';//存储选中订单的商品属性
		// $scope.changeWLFun = function () {

		// 	erp.postFun('app/order/getWay','',function (data) {
		// 		// alert(66666)
		// 		console.log(data)
		// 		$scope.wlfsList = data.data;
		// 		console.log($scope.wlfsList)
		// 	},function () {
		// 		console.log('物流获取失败')
		// 	})
		// 	$('#c-zi-ord .cor-check-box').each(function () {
		// 		var spsxArr = [];//存储商品属性
		// 		var ordid = '';//存储一个id
		// 		if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
		// 			isopenFlag++;
		// 			ordid=$(this).siblings('.hide-order-id').text()+',';
		// 			//changeordWL+=$(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text()+',';
		// 			var $sptdObj = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
		// 			console.log($sptdObj.children('.sp-sx-span').length)
		// 			console.log($sptdObj.children('.sp-sx-span'))
		// 			for(var i =0;i<$sptdObj.children('.sp-sx-span').length;i++){
		// 				spsxArr.push($sptdObj.children('.sp-sx-span').eq(i).text());
		// 			}
		// 			xgwldata+= ordid+spsxArr+'#';
		// 		}
		// 		console.log(spsxArr)
		// 		console.log(xgwldata)
		// 		console.log(JSON.stringify(xgwldata))
		// 	})
		// 	console.log(xgwldata)
		// 	console.log(JSON.stringify(xgwldata))
		// 	if(isopenFlag<=0){
		// 		layer.msg('请先选择订单')
		// 		return;
		// 	}else {
		// 		$scope.wlChangeFlag = true;
		// 	}
		// }
		// $scope.changeoneordWLFun = function () {
		// 	erp.postFun('app/order/getWay','',function (data) {
		// 		// alert(66666)
		// 		console.log(data)
		// 		$scope.wlfsList = data.data;
		// 		console.log($scope.wlfsList)
		// 	},function () {
		// 		console.log('物流获取失败')
		// 	})
		// 	$scope.wlChangeFlag = true;
		// 	// $scope.selfun(selfir);
		// }
		//第一个选择框的切换
		// $scope.selfir;
		$scope.selfun = function (selfir) {
			if (selfir=="ePacket") {
				for(var i =0;i<$scope.wlfsList.length;i++){
					if($scope.wlfsList[i].name=="ePacket"){
						$scope.epacketArr = $scope.wlfsList[i].value;
						$scope.epacketFlag = true;
					}
				}
				// $scope.selfir = $scope.epacketArr[0].value;
				console.log($scope.epacketArr)
			} else if(selfir=="zgyz") {
				for(var i =0;i<$scope.wlfsList.length;i++){
					if($scope.wlfsList[i].name=="zgyz"){
						$scope.zgyzArr = $scope.wlfsList[i].value;
						$scope.zgyzFlag = true;
					}
				}
				console.log($scope.zgyzArr)
				// $scope.selfir = $scope.zgyzArr[0].value;
			}else{
				$scope.epacketArr = '';
				$scope.zgyzArr = '';
			}
		}

		// $('#wl-change-sel').change(function () {
		// 	alert($(this).val())
		// })
		//关闭弹窗
		$scope.closewltcFun = function () {
			$scope.wlChangeFlag = false;
		}

		//导出函数
		$scope.isdcflag = false;
		$scope.isdcfun = function () {
			var numindex = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					numindex++;
				}
			})
			if (numindex<=0) {
				layer.msg('请选择订单')
				return;
			} else {
				$scope.isdcflag = true;
			}
		}
		$scope.isdcclosefun = function () {
			$scope.isdcflag = false;
		}
		$scope.dcflag = false;//导出生成链接
		$scope.dcHbFun = function () {
			$scope.isdcflag = false;//关闭询问弹框
			erp.load();
			var ids = {};
			var printIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					printIds+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			ids.ids = printIds;
			ids.type = 1;
			console.log(JSON.stringify(ids))
			erp.postFun('app/buyOrder/exportErpOrder',JSON.stringify(ids),function (data) {
				console.log(data)
				var href = data.data.href;
				console.log(href)
				layer.closeAll("loading")
				if (href.indexOf('https')>=0) {
					$scope.dcflag = true;
					// window.open(href,'_blank')
					$scope.hrefsrc = href;
					console.log($scope.hrefsrc)
				} else {
					layer.msg('导出失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		$scope.dcFsFun = function () {
			$scope.isdcflag = false;//关闭询问弹框
			erp.load();
			var ids = {};
			var printIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					printIds+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			ids.ids = printIds;
			ids.type = 0;
			console.log(JSON.stringify(ids))
			erp.postFun('app/buyOrder/exportErpOrder',JSON.stringify(ids),function (data) {
				console.log(data)
				var href = data.data.href;
				console.log(href)
				layer.closeAll("loading")
				if (href.indexOf('https')>=0) {
					$scope.dcflag = true;
					// window.open(href,'_blank')
					$scope.hrefsrc = href;
					console.log($scope.hrefsrc)
				} else {
					layer.msg('导出失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//关闭
		$scope.closeatc = function () {
			$scope.dcflag = false;
		}
		//精确查找
		$scope.accurateSearKey = 'order-num';//精确查询的条件
		$scope.jqczFlag = false;
		$scope.chanSearchKey = function () {
			console.log($scope.searchKey)
			if($scope.searchKey=='accurate'){
				$scope.jqczFlag = true;
			}
		}
		$scope.sureJqczFun = function () {
			getOrderList($scope,erp);
			$scope.jqczFlag = false;
			$scope.accurateSearVal = '';
			$scope.searchKey = 'sale-man';
		}
		$scope.QxJqczFun = function () {
			$scope.jqczFlag = false;
			$scope.accurateSearVal = '';
			$scope.searchKey = 'sale-man';
		}

		var that = this;
		// /*查看日志*/
		$scope.isLookLog = false;
		$scope.LookLog = function (No,ev) {
			console.log(No)
            $scope.isLookLog = true;
            that.no = No;
            ev.stopPropagation()
        }
        $scope.$on('log-to-father',function (d,flag) {
        	 if (d && flag) {
        	     $scope.isLookLog = false;
        	 }
		})
		
		//取消拦截
		$scope.cancelLanjie = function(item){
			console.log(item)
			erp.postFun('erp/zfStateQuery/cancelLanJie', {ids:item.id}, function (data) {
				console.log(data)
				const res = data.data
				if(res.statusCode == 200){
					$scope.pageNum = '1';
					getOrderList($scope,erp,'操作成功');
				}else {
					layer.msg('操作失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		 //添加到拦截成功
		 $scope.addLanJieConfirm = function(item){
			erp.postFun('orderSyn/zFIntercept/confirm', {orderIDs:[item.id]}, function (data) {
			  console.log(data)
			  const res = data.data
			  if(res.code == 200){
				$scope.pageNum = "1";
				getOrderList($scope,erp,'操作成功');
			  }else {
				layer.msg('操作失败')
			  }
			}, function (data) {
			  console.log(data)
			})
		  }
		//添加拦截
		$scope.oneAddLanJieFun = function(item) {
			$scope.itemId = item.id;
			$scope.oneAddLanJieFlag = true;
		  }
		$scope.oneSureLanJieFun = function() {
			var addyfhData = {};
			addyfhData.ids = $scope.itemId;
			erp.postFun('erp/zfStateQuery/addLanJie', JSON.stringify(addyfhData), function(data) {
				$scope.oneAddLanJieFlag = false;
				if (data.data.statusCode==200) {
					$scope.pageNum = '1';
					getOrderList($scope,erp,'拦截成功');
				} else {
					layer.msg('拦截失败')
				}
			}, function(data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
	}])

	app.controller('stock-order-controller',['$scope','$http','erp','$location','$routeParams','$compile','$timeout',function ($scope,$http,erp,$location,$routeParams,$compile,$timeout) {
		var base64 = new Base64();
		var job = base64.decode(localStorage.getItem('job') == undefined ? "" : localStorage.getItem('job'));
		var erpLoginName = base64.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
		if (erpLoginName=='admin') {
			$scope.adminShowFlag = true;
		} else {
			$scope.adminShowFlag = false;
		}
		var aDate = GetDateStr(-45);
		var enDate = GetDateStr(0);
		$("#c-data-time").val('' );   //关键语句
		// $("#cdatatime2").val(enDate );   //关键语句
		$scope.isStockOrder = true;
		var ordStatus = $routeParams.ordStatus || 0;
		console.log('私有库存订单');
		$scope.searchKey = 'sale-man';
		if (ordStatus == 0) {
			$scope.paiedOrder = true;
			$scope.orderStatus = '10';
		}else if (ordStatus == 2) {
			$scope.outAccOrder = true;
			$scope.orderStatus = '11';
		} else if (ordStatus == 3) {
			$scope.notPayOrder = true;
			$scope.orderStatus = '3';
			$scope.job=job;
		} else if (ordStatus == 4) {
			$scope.alShipOrder = true;
			$scope.orderStatus = '7';
		} else if (ordStatus == 5) {
            $scope.orderStatus = '5';
				}

		// 转仓
		//获取所有中国仓
		getAllChinaWarehouse($scope, erp)
		$scope.rollOverFn = item => { //转仓
			const list = $scope.chinaWarehouse.filter(_ => _.id === item.storageId)
			console.log('12131232131 ->', list)
			if(list.length === 0) {
				layer.msg('只能对中国区的订单进行转仓')
				return
			}
			$scope.rollParam = {
				name: list[0].storageName,
				wid: list[0].id,
				id: item.id,
				list: $scope.chinaWarehouse.filter(_ => _.id !== item.storageId)
			}
		}
		$scope.rollCallback = () => {
			$scope.pageNum = '1'
			getOrderList($scope,erp)
		}

		$scope.erpordersList = '';//存储所有的订单
		$scope.erpordTnum = 0;//存储订单的条数
		$scope.pageSize = '30';
		$scope.pageNum = '1';
		$scope.trackNum = 0;
		$scope.getListUrl = 'app/buyOrder/selectOrderByImpList';
		$scope.storageName='';
		// getOrderList($scope,erp);
		const warehouseList = angular.copy(window.warehouseList).map(_=>_.store)
		// console.log(warehouseList,'warehouseList')
		$scope.storageCallback = function({ item, storageList, allIdString}){
				$scope.storageName = ''
				if(!!item) $scope.storageName = warehouseList.includes(item.dataId)?window.warehouseList.find(_=>_.store==item.dataId).id:item.dataId
				$scope.pageNum = '1'
				getOrderList($scope,erp)
		}

		// 显示采购员列表
		// 查看采购单操作日志
		$scope.purchaseOrderCallback = function(showPurchases){
			$scope.showPurchases = showPurchases
		}

		// 采购员input改变回调
		// 采购人筛选项
		$scope.purchasePersonCallback = function({id, loginName}){
			$scope.buyerId = id
		} 

		//分页选择框的切换
		$scope.chanPageSize = function () {
			$scope.pageNum = '1';
			getOrderList($scope,erp);
		}
		//跳页的查询
		$scope.gopageFun = function () {
			if ($scope.pageNum==''||$scope.pageNum<1) {
				layer.msg('跳转页数不能为空!');
				return;
			}
			if ($scope.pageNum>$scope.totalPageNum) {
				layer.closeAll("loading")
				layer.msg('选择的页数大于总页数.');
				return;
			}
			getOrderList($scope,erp);
		}
		//搜索
		$('.c-seach-inp').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
		})
		$scope.searchFun = function () {
			$scope.pageNum = '1';
			getOrderList($scope,erp);
		}
		//按时间搜索
		//erp开始日期搜索
		$("#c-data-time").click(function (){
			var erpbeginTime=$("#c-data-time").val();
			var interval=setInterval(function (){
				var endtime2=$("#c-data-time").val();
				if(endtime2!=erpbeginTime){
					clearInterval(interval);
					$scope.pageNum = '1';
					getOrderList($scope,erp);
				}
			},100)
		})
		//erp结束日期搜索
		$("#cdatatime2").click(function (){
			var erpendTime=$("#cdatatime2").val();
			var interval=setInterval(function (){
				var endtime2=$("#cdatatime2").val();
				if(endtime2!=erpendTime){
					clearInterval(interval);
					$scope.pageNum = '1';
					getOrderList($scope,erp);
				}
			},100)
		})
		//同步库存
		$scope.tbkcFun = function(item){
			$scope.tbkcFlag = true;
			$scope.tbkcId = item.id;
		}
		$scope.tbkcCancelFun = function(){
			$scope.tbkcFlag = false;
		}
		$scope.tbkcSureFun = function() {
		  if ($scope.storageName == "522d3c01c75e4b819ebd31e854841e6c") { //金华仓同步走这个接口
		    erp.load();
		    erp.postFun('storehouseOutgoingWarehousing/deduction/privateOrder', {
		      orderIdList: [$scope.tbkcId],
		      storageId: $scope.storageName
		    }, res => {
		      // console.log(res);
		      erp.closeLoad();
		      const {
		        data
		      } = res;
		      if (data.code !== 200) {
		        return layer.msg('同步失败');
		      }
		      layer.msg('同步成功');
		      $scope.tbkcFlag = false;
		      getOrderList($scope, erp);
		    })
		  } else {
		    erp.load()
		    erp.postFun('storehouseUsa/payOrder/payOrderMateInventory', {
		      orderId: $scope.tbkcId,
		      orderType: 1
		    }, function(data) {
		      console.log(data)
		      if (data.data.code == 200) {
		        layer.msg('同步成功')
		        $scope.tbkcFlag = false;
		        getOrderList($scope, erp);
		      } else {
		        layer.msg('同步失败')
		        erp.closeLoad()
		      }
		    }, function(data) {
		      console.log(data)
		      erp.closeLoad()
		    })
		  }
		}
		$scope.setDiscount = function (item) {
			$scope.setDiscountFlag=true;
			$scope.operateItem = item;
		}
		$scope.goSetDiscountFlag = function () {
			setDiscountPost (erp,$scope);
		}
		var opeOrder;
		$scope.inStock = function (item,index) {
			console.log(item,index);
			$scope.goToInstockFlag = true;
			opeOrder = item;
			opeOrder.index = index;
		}

		$scope.goToInstock = function () {
			erp.postFun('app/buyOrder/upGoodsOrder', {"orderId": opeOrder.id}, function (data) {
				console.log(data.data);
				if (data.data.code==200) {
					layer.msg('操作成功');
					$scope.erporderList.splice(opeOrder.index,1);
					$scope.goToInstockFlag=false;
				} else {
					layer.msg(data.data.message);
				}
			});
		}

		//精确查找
		$scope.accurateSearKey = 'order-num';//精确查询的条件
		$scope.jqczFlag = false;
		$scope.chanSearchKey = function () {
			console.log($scope.searchKey)
			if($scope.searchKey=='accurate'){
				$scope.jqczFlag = true;
			}
		}
		$scope.sureJqczFun = function () {
			getOrderList($scope,erp);
			$scope.jqczFlag = false;
			$scope.accurateSearVal = '';
			$scope.searchKey = 'sale-man';
		}
		$scope.QxJqczFun = function () {
			$scope.jqczFlag = false;
			$scope.accurateSearVal = '';
			$scope.searchKey = 'sale-man';
		}
		// 点击下载导图包
		$scope.isSameMuIdFun = function(pList){
			$scope.isDaoTextFlag = true;
			$scope.currentZipData = pList.customeDesign
			// $scope.podTextIds = sku;
		}
		$scope.copyPotIdsFun = function(){
			var hideInpVal = $('.pod-ziids');
            hideInpVal.select(); // 选中文本
            var isCopyFlag = document.execCommand("copy"); // 执行浏览器复制命令
            if (isCopyFlag) {
				layer.msg('复制成功')
				$scope.isDaoTextFlag = false;
            }
            console.log(hideInpVal)
		}

		// 确定下载图包
		$scope.createZip = function(){
			// 转义用户输入的回车符
			$scope.currentZipData = JSON.parse(($scope.currentZipData).replace(/\n/g,"\\n").replace(/\r/g,"\\r"));
			if($scope.currentZipData && $scope.currentZipData.length > 0){
				erp.load()
				CJ_createZip($scope.currentZipData,()=>{
					erp.closeLoad()
					$scope.isDaoTextFlag = false;
				})
			}else{
				layer.msg('图包数据错误，请重试！')
			}
		}

		clickAndMouse();
		checkFun();

	}])

    /*重量待确认*/
    app.controller('WeightCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        //分页相关
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.searchinfo = '';
        $scope.sort = "desc";
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.isAct1 = true;
        $scope.isAct2 = false;
        $scope.status = '111';
        $scope.type = '0'
        $scope.tabClick = function (n) {
        	if(n == '1'){
                $scope.isAct1 = true;
                $scope.isAct2 = false;
                $scope.tabFlag = '1';
            }else if(n == '2'){
                $scope.isAct1 = false;
                $scope.isAct2 = true;
                $scope.tabFlag = '2';
            }
            getList(erp, $scope);
        }
        function getList(erp, $scope) {
            erp.load();
            var data = {
                page: $scope.pagenum.toString(),
                pageNum: $scope.pagesize,
                searchParam: $scope.searchinfo,
                status:$scope.status,
	              type: $scope.type
            }
            erp.postFun("app/externalPurchase/selectPayOrderListOfErp",JSON.stringify(data), function (res) {
                erp.closeLoad();
                if(res.data.code == 200){
                    $scope.datalist = res.data.orderList;
                    $scope.totalNum = res.data.totalNum;
                    $scope.datalist.forEach(function (o,i) {
                        o.productList.forEach(function (o,i) {
                            o.isover = false;
                            o.img = o.img.split(',')[0];
                        })
                    })
                    if ($scope.totalNum == 0) {
                        $scope.totalpage = 0;
                        $scope.datalist = [];
                        layer.msg('暂无数据');
                        return;
                    }
                    console.log($scope.datalist);
                    $scope.totalpage = Math.ceil(($scope.totalNum) / ($scope.pagesize));
                    pageFun(erp, $scope);
                }
            }, err);
        }
        getList(erp, $scope);
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pagenum = 1;
            getList(erp, $scope);
        }

        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val();
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage) {
                layer.msg('错误页码');
            } else {
                getList(erp, $scope);
            }
        }
        //搜索客户
        $scope.searchcustomer = function () {
            console.log('搜索条件', $scope.searchinfo);
            $scope.pagenum = '1';
            getList(erp, $scope);
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                $scope.pagenum = 1;
                getList(erp, $scope);
            }
        };
        $scope.attrlist = [
            {name:'普货',flag:false,attr:'COMMON'},
            {name:'电子',flag:false,attr:'ELECTRONIC'},
            {name:'内置电池',flag:false,attr:'BATTERY'},
            {name:'纯电池',flag:false,attr:'IS_ELECTRICITY'},
            {name:'含液体',flag:false,attr:'HAVE_LIQUID'},
            {name:'含粉末',flag:false,attr:'HAVE_STIVE'},
            {name:'含膏状',flag:false,attr:'HAVE_CREAM'},
            {name:'含磁',flag:false,attr:'HAVE_MAGNETISM'},
            {name:'尖锐',flag:false,attr:'EDGE'},
            {name:'海关禁售',flag:false,attr:'NO_ENTRY'},
            {name:'仿牌',flag:false,attr:'CLONE'},
            {name:'其他',flag:false,attr:'PROOERTY'},
        ];
        $scope.checkbg = function(item){
            item.flag = !item.flag;
        }
        $scope.upset = function (item,id) {
            console.log(item);
            $scope.GRAMS = Number(item.GRAMS);
            $scope.weight = Number(item.weight);
            $scope.length = Number(item.length);
            $scope.width = Number(item.width);
            $scope.height = Number(item.height);
            $scope.price = Number(item.price);
            $scope.upSet = true;
            if(item.PROPERTY){
                var attrArr = item.PROPERTY.split(',');
                $scope.attrlist.forEach(function (o,i) {
                    o.flag = false;
                    attrArr.forEach(function (k,j) {
                        if(o.attr == k){
                            o.flag = true;
                        }
                    })
                })
            }else {
                $scope.attrlist.forEach(function (o,i) {
                    o.flag = false;
                })
            }
            $scope.upSetclick = function () {
                var arr = [];
                $scope.attrlist.forEach(function (o,i) {
                    if(o.flag){
                        arr.push(o.attr)
                    }
                })
				if(!$scope.weight || !$scope.GRAMS || !$scope.price || arr.length == 0){
                	layer.msg('带 * 号为必填项或必选项,值不可设置为0');
					return;
				}
                var data = {
                    orderId:id,
                    ID:item.ID,
                    PROPERTY:arr.join(','),
                    GRAMS:$scope.GRAMS,
                    weight:$scope.weight,
                    length:$scope.length,
                    width:$scope.width,
                    height:$scope.height,
                    price:$scope.price
                };
                erp.postFun("app/externalPurchase/updatePayProductWeightAndPropertyById",data, function (res) {
                    if(res.data.code == 200){
                        layer.msg('设置成功');
                        $scope.upSet = false;
                        getList(erp, $scope);
                    }else {
                        layer.msg('设置失败');
                    }
                }, err);
            }
        }
        /**/
        $scope.writeInOpe = function (item) {
            console.log(item)
            //$scope.freshListAfterOpe(item.id, item.id);
            //window.open('manage.html#/merchandise/addSKU1/orderproduct=' + item.id+'//0', '_blank', '');
            // location.href = '#/merchandise/addSKU2/inquiry=' + id;
            var data = {
                zFOrderId:item.id
            }
            erp.postFun("app/externalPurchase/createsourceProduct",data, function (res) {
                if(res.data.statusCode == 200){
                    layer.msg('操作成功');
                    getList(erp, $scope);
                }else if(res.data.statusCode == 888){
                    layer.msg('搜品中，待处理');
                }else if(res.data.statusCode == 999){
                    layer.msg('该source已存在，已生成采购单');
                }else {
                    layer.msg('操作失败');
                }
            }, err);
        }
        /*  $scope.freshListAfterOpe = function (opeIds, id) {
              if (id == 'deleteall') {
                  $('.merchan-list-con-wrap').each(function () {
                      $(this).remove();
                  });
                  $scope.merchList = [];
                  return;
              }
              if ($.isArray(opeIds)) {
                  for (var i = 0; i < opeIds.length; i++) {
                      var changeIndex = erp.findIndexByKey($scope.merchList, 'id', opeIds[i]);
                      $('.merchan-list-con-wrap').eq(changeIndex).remove();
                      $scope.merchList.splice(changeIndex, 1);
                  }
              } else {
                  var changeIndex = erp.findIndexByKey($scope.merchList, 'id', id);
                  $('.merchan-list-con-wrap').eq(changeIndex).remove();
                  $scope.merchList.splice(changeIndex, 1);
              }
          }*/
        //分页
        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalNum || 1,
                pageSize: $scope.pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum * 1,
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
                    $scope.pagenum = n.toString();
                    getList(erp, $scope);
                }
            });
        }
        $scope.rowfun = function (item) {
            if (item == 1) {
                return 0;
            } else {
                return item;
            }
        }

        // 状态查询
	      $scope.handleChangeSearch = () =>{
		      $scope.pagenum = '1';
		      getList(erp, $scope);
	      }

        // 拒绝操作
	      $scope.handleRefuse = item =>{
		      console.log(item)
		      $scope.isRefuseFlag = true
		      $scope.refusReason = item.refuseReason
		      // 拒绝确认
		      $scope.handleRefuseConfirm = () =>{
			      const reg = /[\u4e00-\u9fa5]/g
			      if (!$scope.refusReason || reg.test($scope.refusReason))  {
				      layer.msg('请输入英文')
				      return
			      }
			      if($scope.refusReason.length > 256){
				      layer.msg('字符限制256')
				      return
			      }
			      const parmas = {
				      payOrderId: item.id,
				      refuseReason: $scope.refusReason,
			      }
			      layer.load(2);
			      erp.postFun("order/payRefuseOrder/refusePayOrder",parmas, ({data}) =>{
				      erp.closeLoad();
				      if(data.statusCode === '200'){
					      $scope.isRefuseFlag = false
					      layer.msg('操作成功')
					      getList(erp, $scope);
				      }
			      }, err =>{
				      console.log(err)
			      });
		      }
	      }


    }])
    /*chrome订单*/
    app.controller('chromeOrderCtrl', ['$scope', 'erp', '$location','$routeParams', function ($scope, erp, $location,$routeParams) {
    	console.log('chromeOrderCtrl');
        $scope.ordStatus = $routeParams.orderStatus;
        console.log($scope.ordStatus)
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.searchinfo = '';
        if($scope.ordStatus == '3'){//未付款
            $scope.status = '3';
		}else if($scope.ordStatus == '10'){
            $scope.status = '10';
		}
        function getList(erp, $scope) {
            erp.load();
            var data = {
                page: $scope.pagenum.toString(),
                pageNum: $scope.pagesize,
                searchParam: $scope.searchinfo,
                status:$scope.status
            }
            erp.postFun("app/externalPurchase/selectPayOrderListOfErp",JSON.stringify(data), function (res) {
                erp.closeLoad();
                if(res.data.code == 200){
                    $scope.datalist = res.data.orderList;
                    $scope.totalNum = res.data.totalNum;
                    $scope.datalist.forEach(function (o,i) {
                        o.productList.forEach(function (o,i) {
                            o.isover = false;
                            o.img = o.img.split(',')[0];
                        })
                    })
                    if ($scope.totalNum == 0) {
                        $scope.totalpage = 0;
                        $scope.datalist = [];
                        layer.msg('暂无数据');
                        return;
                    }
                    console.log($scope.datalist);
                    $scope.totalpage = Math.ceil(($scope.totalNum) / ($scope.pagesize));
                    pageFun(erp, $scope);
                }
            }, err);
        }
        getList(erp, $scope);
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pagenum = 1;
            getList(erp, $scope);
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val();
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage) {
                layer.msg('错误页码');
            } else {
                getList(erp, $scope);
            }
        }
        //搜索客户
        $scope.searchcustomer = function () {
            console.log('搜索条件', $scope.searchinfo);
            $scope.pagenum = '1';
            getList(erp, $scope);
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                $scope.pagenum = 1;
                getList(erp, $scope);
            }
        };
        /**/
        $scope.writeInOpe = function (item) {
            console.log(item)
            //$scope.freshListAfterOpe(item.id, item.id);
            //window.open('manage.html#/merchandise/addSKU1/orderproduct=' + item.id+'//0', '_blank', '');
            // location.href = '#/merchandise/addSKU2/inquiry=' + id;
            var data = {
                zFOrderId:item.id
            }
            erp.postFun("app/externalPurchase/createsourceProduct",data, function (res) {
                if(res.data.statusCode == 200){
                    layer.msg('操作成功');
                    getList(erp, $scope);
                }else if(res.data.statusCode == 888){
                    layer.msg('搜品中，待处理');
                }else if(res.data.statusCode == 999){
                    layer.msg('该source已存在，已生成采购单');
                }else {
                    layer.msg('操作失败');
                }
            }, err);
        }
        //分页
        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalNum || 1,
                pageSize: $scope.pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum * 1,
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
                    $scope.pagenum = n.toString();
                    getList(erp, $scope);
                }
            });
        }
    }])
    /*状态查询*/
	app.controller('StatusQueryCtrl', ['$scope', 'erp', '$location','$routeParams', function ($scope, erp, $location,$routeParams) {
        console.log('StatusQueryCtrl');
        $scope.pagenum = '1';
        $scope.pagesize = '20';
        $scope.dataList = [];
        $scope.yewuyuan = [];
		$scope.salesmanId = '';
		const base64 = new Base64()
		$scope.erpLoginName = base64.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'))
		// $scope.erpLoginName = '楼晓超'

		//鼠标移入展示订单商品详情
		$scope.mouserEnterFn = (type, id) => {
			$scope.dataList = $scope.dataList.map(item => {
				if (item.id === id) item.isShowProduct = type === 'enter'
				return item
			})
		}

		// 显示采购员列表
		// 查看采购单操作日志
		$scope.purchaseOrderCallback = function(showPurchases){
			$scope.showPurchases = showPurchases
		}

    //全选
    $('#c-zi-ord').on('click', '.c-checkall', function () {
      if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
        $(this).attr('src', 'static/image/order-img/multiple2.png');
        cziIndex = $('#c-zi-ord .cor-check-box').length;
        $('#c-zi-ord .cor-check-box').attr('src', 'static/image/order-img/multiple2.png');
      } else {
        $(this).attr('src', 'static/image/order-img/multiple1.png');
        cziIndex = 0;
        $('#c-zi-ord .cor-check-box').attr('src', 'static/image/order-img/multiple1.png');
      }
    })

    //给子订单里面的订单添加选中非选中状态
    var cziIndex = 0;
    $('#c-zi-ord').on('click', '.cor-check-box', function () {
      if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
        $(this).attr('src', 'static/image/order-img/multiple2.png');
        cziIndex++;
        if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
          $('#c-zi-ord .c-checkall').attr('src', 'static/image/order-img/multiple2.png');
        }
      } else {
        $(this).attr('src', 'static/image/order-img/multiple1.png');
        cziIndex--;
        if (cziIndex != $('#c-zi-ord .cor-check-box').length) {
          $('#c-zi-ord .c-checkall').attr('src', 'static/image/order-img/multiple1.png');
        }
      }
    })


    //批量添加拦截
    var checdedIds;
    $scope.batchAddLanJie = function(){
      var addyfhCount = 0;
      checdedIds = '';
      $('#c-zi-ord .cor-check-box').each(function () {
        if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
          addyfhCount++;
          checdedIds += $(this).siblings('.hide-order-id').text() + ',';
        }
      })
      if (addyfhCount > 0) {
		$scope.batchAddLanJiePopup = true;
      } else {
        $scope.batchAddLanJiePopup = false;
        layer.msg('请选择订单')
      }
    }

    //确定拦截
    $scope.batchAddLanJiePopupConfirm = function () {
      $scope.currtpage = 1;
      var addyfhData = {};
      addyfhData.ids = checdedIds;
      erp.postFun('erp/zfStateQuery/addLanJie', JSON.stringify(addyfhData), function (data) {
        console.log(data)
        $scope.batchAddLanJiePopup = false;
        var erpData = {
          inputStr:$scope.inputTxt,
          salesmanId:$scope.salesmanId,
          status:$scope.status,
          page:$scope.pagenum,
          pageNum:$scope.pagesize,
          searchType: $scope.condition // 2019.8.26新增查询条件
				};
        console.log(erpData)
        console.log(JSON.stringify(erpData))

        erp.postFun('app/buyOrder/selectZFOrderByEmpList', JSON.stringify(erpData), function (res) {
          layer.closeAll("loading")
          if(res.data.code == 200){
            $scope.dataList = res.data.list;
            $scope.totalNum = res.data.totalNum;
            pageFun()
          }
        }, function () {
          layer.closeAll("loading")
          layer.msg('订单获取列表失败')
          // alert(2121)
        })
        if (data.data.result != null&&data.data.result != "") {
          $scope.lrzzhNum = data.data.result;
        //  $scope.resultIntercept = true;
          layer.msg('批量添加拦截成功')
        } else {
          layer.msg('批量添加拦截失败')
        }
      }, function (data) {
        layer.closeAll("loading")
        console.log(data)
        $('#table').bootstrapTable('refresh');  // 刷新列表
      })
    }

    //添加单个拦截
    $scope.oneAddLanJie = function(item){
      $scope.itemId = item.id;
      $scope.oneAddLanJiePage = true;
    }

    //单个拦截确定
    $scope.oneAddLanJieConfirm = function(){
      var addyfhData = {};
      addyfhData.ids = $scope.itemId;
      erp.postFun('erp/zfStateQuery/addLanJie', JSON.stringify(addyfhData), function (data) {
        console.log(data)
        $scope.oneAddLanJiePage = false;

        var erpData = {
          inputStr:$scope.inputTxt,
          salesmanId:$scope.salesmanId,
          status:$scope.status,
          page:$scope.pagenum,
          pageNum:$scope.pagesize,
          searchType: $scope.condition // 2019.8.26新增查询条件
        };
        console.log(erpData)
        console.log(JSON.stringify(erpData))

        erp.postFun('app/buyOrder/selectZFOrderByEmpList', JSON.stringify(erpData), function (res) {
          layer.closeAll("loading")
          if(res.data.code == 200){
            $scope.dataList = res.data.list;
            $scope.totalNum = res.data.totalNum;
            pageFun()
          }
        }, function () {
          layer.closeAll("loading")
          layer.msg('订单获取列表失败')
          // alert(2121)
        })

        if (data.data.result != null&&data.data.result != "") {
          $scope.lrzzhNum = data.data.result;
         // $scope.resultIntercept = true;
          layer.msg('添加拦截成功')
        } else {
          layer.msg('添加拦截失败')
        }
      }, function (data) {
        layer.closeAll("loading")
        console.log(data)
      })
    }


//
    //批量取消拦截
    var checdedIds1;
    $scope.batchCancelLanJie = function(){
      var addyfhCount1 = 0;
      checdedIds1 = '';
      $('#c-zi-ord .cor-check-box').each(function () {
        if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
          addyfhCount1++;
          checdedIds1 += $(this).siblings('.hide-order-id').text() + ',';
        }
      })
      if (addyfhCount1 > 0) {
        $scope.batchCancelLanJiePopup = true;
      } else {
        $scope.batchCancelLanJiePopup = false;
        layer.msg('请选择订单')
      }
    }

    //确定取消拦截
    $scope.batchCancelLanJiePopupConfirm = function () {
      $scope.currtpage = 1;
      var addyfhData = {};
      addyfhData.ids = checdedIds1;
      erp.postFun('erp/zfStateQuery/cancelLanJie', JSON.stringify(addyfhData), function (data) {
        console.log(data)
        $scope.batchCancelLanJiePopup = false;
        var erpData = {
          inputStr:$scope.inputTxt,
          salesmanId:$scope.salesmanId,
          status:$scope.status,
          page:$scope.pagenum,
          pageNum:$scope.pagesize,
          searchType: $scope.condition //
        };
        console.log(erpData)
        console.log(JSON.stringify(erpData))

        erp.postFun('app/buyOrder/selectZFOrderByEmpList', JSON.stringify(erpData), function (res) {
          layer.closeAll("loading")
          if(res.data.code == 200){
            $scope.dataList = res.data.list;
            $scope.totalNum = res.data.totalNum;
            pageFun()
          }
        }, function () {
          layer.closeAll("loading")
          layer.msg('订单获取列表失败')
          // alert(2121)
        })
        if (data.data.result != null&&data.data.result != "") {
          $scope.lrzzhNum = data.data.result;
          $scope.resultCancelIntercept = true;
          layer.msg('批量取消拦截成功')
        } else {
          layer.msg('批量取消拦截失败')
        }
      }, function (data) {
        layer.closeAll("loading")
        console.log(data)
        $('#table').bootstrapTable('refresh');  // 刷新列表
      })
    }


    //单个取消拦截
    $scope.oneCancelLanJie = function(item){
      $scope.itemId1 = item.id;
      $scope.oneCancelLanJiePage = true;
    }

    //单个取消拦截确定
    $scope.oneCancelLanJieConfirm = function(){
      var addyfhData = {};
      addyfhData.ids = $scope.itemId1;
      erp.postFun('erp/zfStateQuery/cancelLanJie', JSON.stringify(addyfhData), function (data) {
        console.log(data)
        $scope.oneCancelLanJiePage = false;

        var erpData = {
          inputStr:$scope.inputTxt,
          salesmanId:$scope.salesmanId,
          status:$scope.status,
          page:$scope.pagenum,
          pageNum:$scope.pagesize,
          searchType: $scope.condition //
        };
        console.log(erpData)
        console.log(JSON.stringify(erpData))

        erp.postFun('app/buyOrder/selectZFOrderByEmpList', JSON.stringify(erpData), function (res) {
          layer.closeAll("loading")
          if(res.data.code == 200){
            $scope.dataList = res.data.list;
            $scope.totalNum = res.data.totalNum;
            pageFun()
          }
        }, function () {
          layer.closeAll("loading")
          layer.msg('订单获取列表失败')
        })

        if (data.data.result != null&&data.data.result != "") {
          $scope.lrzzhNum = data.data.result;
          $scope.resultCancelIntercept = true;
          layer.msg('取消拦截成功')
        } else {
          layer.msg('取消拦截失败')
        }
      }, function (data) {
        layer.closeAll("loading")
        console.log(data)
      })
    }





		function getyewuyuan (){
            erp.postFun("app/buyOrder/huoQuYeWuYuan", {}, function (res) {
                if(res.data.code == 200){
                    $scope.yewuyuan = res.data.list;
                    console.log($scope.yewuyuan)
                }
            }, function (data) {
            })
		}

    getyewuyuan ();
		/*查询*/
		$scope.condition = "1"
		$scope.searchInput = function () {
            $scope.pagenum = '1';
            getData();
		}
		$scope.inputTxt = $routeParams.muId;
		if($routeParams.muId){
			getData()
		}
        function getData() {
			var data = {
                inputStr:$scope.inputTxt,
                salesmanId:$scope.salesmanId,
                status:$scope.status,
                page:$scope.pagenum,
								pageNum:$scope.pagesize,
								searchType: $scope.condition // 2019.8.26新增查询条件
			};
            erp.load();
            erp.postFun("app/buyOrder/selectZFOrderByEmpList", data, function (res) {
                layer.closeAll('loading')
                if(res.data.code == 200){
                    $scope.dataList = res.data.list.map(item => {
						item.isShowProduct = false
						item.canShow = item.salesmanName === $scope.erpLoginName || $scope.erpLoginName === 'admin'
						return item
					});
                    $scope.totalNum = res.data.totalNum;
                    pageFun()
				}
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }

        //分页
        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalNum || 1,
                pageSize: $scope.pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum * 1,
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
                    $scope.pagenum = n.toString();
                    getData();
                }
            });
        }

		// 查看日志
		var that = this;
		$scope.isLookLog = false;
		$scope.handleLookLog = function (No,ev) {
			console.log(No)
			$scope.isLookLog = true;
			that.no = No;
			ev.stopPropagation()
		}
		$scope.$on('log-to-father',function (d,flag) {
			if (d && flag) {
				$scope.isLookLog = false;
			}
		})
	}])
})(angular)
