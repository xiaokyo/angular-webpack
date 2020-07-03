(function () {

	var app = angular.module('custom-newzione-app', ['service']);
	app.directive('repeatFinish', function ($timeout) {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				//当前循环至最后一个
				// console.log(scope.$index)
				if (scope.$last === true) {
					$timeout(function () {
						//向父控制器传递事件消息
						scope.$emit('repeatFinishCallback');
					}, 100);
				}
			}
		}
	});
	app.controller('custom-zione-controller', ['$scope', '$http', 'erp', '$routeParams', '$compile', '$timeout', function ($scope, $http, erp, $routeParams, $compile, $timeout) {
		$scope.showStoreName = erp.showStoreName // 展示仓库
		$scope.isPurStockout = function(){ return $scope.shortageIdentity == 1 } // 是否是采购缺货
		var that = this;
		$scope.isAnalysis = false;
		$scope.openAnalysis = function (id, name) {
			$scope.isAnalysis = true;
			that.no = {
				id: id,
				name: name
			};
			that.username = name;
		};
		$scope.$on('log-to-father', function (d, flag) {
			if (d && flag) {
				$scope.isAnalysis = false;
				$scope.spMessageflag = false;
			}
		})
		//商品留言
		$scope.spNoteFun = function (pItem, item, pIndex, index, ev) {
			$scope.spMessageflag = true;
			let obj = {
				"pItem": pItem,
				"item": item,
				"pIndex": pIndex,
				"index": index,
				"list": $scope.erporderList
			};

			that.pItem = pItem;
			that.item = item;
			that.pIndex = pIndex;
			that.index = index;
			that.list = $scope.erporderList;
			console.log(obj)
			ev.stopPropagation()
		}
		$(window).scroll(function () {
			var before = $(window).scrollTop();
			if (before > 60) {
				if ($(window).width() > 1370) {
					$('.fiexd-box').css({
						"position": "fixed",
						"top": 0,
						"right": "28px"
					})
				} else {
					$('.fiexd-box').css({
						"position": "fixed",
						"top": 0,
						"right": "0px"
					})
				}
			} else {
				$('.fiexd-box').css({
					"position": "static",
					"top": 0
				})
			}
		});
		$scope.$on('repeatFinishCallback', function () {
			$('#c-zi-ord .edit-inp').attr('disabled', 'true');
			$('#c-zi-ord .bj-spsku').attr('disabled', 'true');
		});
		$scope.curTime = new Date().getTime();
		// console.log($scope.curTime)
		$scope.dayFun = function (day1, day2) {
			let date = new Date(day1)
			let creatTime = date.getTime();
			return Math.ceil((day2 - creatTime) / 86400000)
		}
		function GetDateStr(AddDayCount) {
			var dd = new Date();
			dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天
			//后的日期
			var y = dd.getFullYear();
			var m = dd.getMonth() + 1;//获取当前月份的日期
			var d = dd.getDate();
			if (m < 10) {
				m = '0' + m
			}
			if (d < 10) {
				d = '0' + d
			}
			return y + "-" + m + "-" + d;
		}
		var aDate = GetDateStr(-45);
		var enDate = GetDateStr(0);
		// $("#c-data-time").val(aDate );   //关键语句
		// $("#cdatatime2").val(enDate );   //关键语句
		$scope.uspsDiQu = 'EAST';
		$scope.uspsPlusDiQu = 'EAST';
		var bs = new Base64();
		var loginAddress = localStorage.getItem('address') == undefined ? '' : bs.decode(localStorage.getItem('address'));
		// console.log(loginAddress)
		var muId = '';
		$scope.selstu = 1;//判断订单状态 隐藏选择框中的操作
		if ($routeParams.muId != '' && $routeParams.muId != undefined) {
			muId = $routeParams.muId;
			$scope.shipmentsOrderId = muId;
		}
		var muordstu = '';
		if ($routeParams.muordstu != '' && $routeParams.muordstu != undefined) {
			muordstu = $routeParams.muordstu;
		}
		var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
		var loginSpace = localStorage.getItem('space');
		var loStore = localStorage.getItem('store') == undefined ? '' : localStorage.getItem('store');
		if (erpLoginName == 'admin' || erpLoginName == '金仙娟' || erpLoginName == '李贞' || erpLoginName == '刘依') {
			$scope.cxclAdminShowFlag = true;
		} else {
			$scope.cxclAdminShowFlag = false;
		}
		let commonCjpacketLogArr = ['CJPacket YDS US','CJPacket-MYSensitive','CJPacket MYSensitive','Yanwen Sensitive','Yanwen Ordinary','Yanwen Airline' ,'YanWen' ,'CJPacket-Sea Sensitive' ,'FedEx official' ,'CJ Liquid Direct Line' ,'CJ Special Line' ,'PostNL' ,'Pos Malaysia' ,'Turkey Post' ,'China Post Registered Air Mail' ,'E-EMS' ,'YunExpress US Direct Economy Line' ,'Jewel Shipping' ,'Jewel Shipping+' ,'Jewel Shipping Flat' ,'USPS' ,'USPS+' ,'DHL' ,'DHL Official','CJPacket-Sea','CJPacket Sea','CJPacket YT US','CJPacket YW Airline Ordinary','CJPacket Liquid','CJPacket YW Ordinary','CJPacket Liquid US']
		let electronicCjpacketLogArr = ['CJPacket-MYSensitive','CJPacket MYSensitive','Yanwen Sensitive','Yanwen Ordinary','Yanwen Airline','FedEx official','CJPacket-Sea Sensitive','CJ Liquid Direct Line','CJ Special Line','PostNL','Pos Malaysia','Turkey Post','YanWen','CJPacket-Sea','CJPacket Sea','DHL','UPS','YunExpress US Direct Economy Line','DHL Official','CJPacket YT US','CJPacket YW Airline Ordinary','CJPacket Liquid','CJPacket YW Ordinary','CJPacket Liquid US']
		//请求物流渠道
		erp.postFun('app/erplogistics/getLogisticschannel', null, function (data) {
			// console.log(data)
			$scope.wlqdArr = data.data;
			$scope.allepackArr = [];//存储所有E邮宝
			$scope.ddepackArr = [];//存储带电E邮宝的数组
			$scope.bdepackArr = [];//存储不带电E邮宝
			$scope.uspsArr = [];//存储物流方式为usps的数组
			$scope.ddyzxbArr = [];//存储带电邮政小包
			$scope.bdyzxbArr = [];//存储不带电邮政小包
			$scope.cjNorArr = [];//存储顺丰
			$scope.cjpacketThaArr = [];//存储cjpacket-tha
			$scope.cjpacketSeaArr = [];//存储cjpacket-sea
			$scope.yanWenArr = [];//燕文
			$scope.postNlArr = [];//欧电宝PG
			$scope.gaoTiArr = [];//epacket膏体
			$scope.dhlHongKongArr = [];//dhl hongkong
			$scope.gaoCiArr = [];//含膏 含磁可走物流
			$scope.cjCodArr = [];//cjcod物流
			$scope.dhlOfficialArr = [];//dhl物流
			for (var i = 0; i < $scope.wlqdArr.length; i++) {
				if ($scope.wlqdArr[i].nameen == "ePacket" && $scope.wlqdArr[i].code != 'JCSZEUB' && $scope.wlqdArr[i].code != 'JCNJEUB') {
					$scope.allepackArr.push($scope.wlqdArr[i])
					if ($scope.wlqdArr[i].mode.indexOf('不带电') >= 0) {
						$scope.bdepackArr.push($scope.wlqdArr[i]);
					}
					else {
						$scope.ddepackArr.push($scope.wlqdArr[i]);
					}
					if ($scope.wlqdArr[i].code == 'BJEUB' || $scope.wlqdArr[i].code == 'SEUB' || $scope.wlqdArr[i].code == 'BEUBH' || $scope.wlqdArr[i].code == 'DEIDAKDW604_YW' || $scope.wlqdArr[i].code == 'DEIDAKDW604_SZ' || $scope.wlqdArr[i].code == 'YEUB') {
						$scope.gaoTiArr.push($scope.wlqdArr[i])
					}
				} else if ($scope.wlqdArr[i].nameen == "USPS") {
					$scope.uspsArr.push($scope.wlqdArr[i])
				} else if ($scope.wlqdArr[i].nameen == "China Post Registered Air Mail") {
					if ($scope.wlqdArr[i].mode.indexOf('不带电') >= 0) {
						$scope.bdyzxbArr.push($scope.wlqdArr[i]);
					} else {
						$scope.ddyzxbArr.push($scope.wlqdArr[i]);
					}
				} else if ($scope.wlqdArr[i].nameen == "CJ Normal Express") {
					$scope.cjNorArr.push($scope.wlqdArr[i])
				} else if ($scope.wlqdArr[i].nameen == "YanWen") {
					$scope.yanWenArr.push($scope.wlqdArr[i])
				} else if ($scope.wlqdArr[i].nameen == "DHL HongKong") {
					$scope.dhlHongKongArr.push($scope.wlqdArr[i])
				} else if ($scope.wlqdArr[i].nameen == "PostNL") {
					$scope.postNlArr.push($scope.wlqdArr[i])
				} else if ($scope.wlqdArr[i].nameen == "CJCOD") {
					$scope.cjCodArr.push($scope.wlqdArr[i])
				} else if($scope.wlqdArr[i].nameen == 'CJPacket-Tha'){
					$scope.cjpacketThaArr.push($scope.wlqdArr[i])
				} else if($scope.wlqdArr[i].nameen == 'CJPacket-Sea' || $scope.wlqdArr[i].nameen == 'CJPacket Sea'){
					$scope.cjpacketSeaArr.push($scope.wlqdArr[i])
				} else if($scope.wlqdArr[i].nameen == 'DHL Official'){
					$scope.dhlOfficialArr.push($scope.wlqdArr[i])
				}
				if ($scope.wlqdArr[i].code == "SEUB" || $scope.wlqdArr[i].code == "DGEUBA" || $scope.wlqdArr[i].code == 'DEIDAKDW604_YW' || $scope.wlqdArr[i].code == 'DEIDAKDW604_SZ'
					|| $scope.wlqdArr[i].code == 'YEUB') {
					$scope.gaoCiArr.push($scope.wlqdArr[i])
				}
			}
		}, function (data) {
			console.log(data)
		})

		$scope.storeList = window.warehouseList.map(({name,store})=>({ storeName:name, store, ordNum:'', storeFlag:false}))

		//存储的是哪个仓库
		if (loginSpace) {
			if (loginSpace == '深圳') {
				$scope.store = 1;
				// $('.two-ck-btn').eq(1).addClass('two-ck-activebtn');
				$scope.storeList[1].storeFlag = true;
			} else if (loginSpace == '美国') {
				$scope.store = 2;
				// $('.two-ck-btn').eq(2).addClass('two-ck-activebtn');
				$scope.storeList[2].storeFlag = true;
			} else {
				$scope.store = 0;
				// $('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
				$scope.storeList[0].storeFlag = true;
			}
		} else {
			$scope.store = 0;
			// $('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
			$scope.storeList[0].storeFlag = true;
		}
		
		$scope.storeFun = function(ev,item){
			if(item.storeFlag){
				item.storeFlag = false;
				$scope.store = '';
				localStorage.removeItem('store')
			}else{
				for(let i = 0,len = $scope.storeList.length;i<len;i++){
					$scope.storeList[i].storeFlag = false;
				}
				item.storeFlag = true;
				$scope.store = item.store;
				localStorage.setItem('store', item.store)
			}
			$scope.pageNum = 1;
			getOrdList()
		}
		$scope.ordType = '';
		$scope.pageNum = '1';
		$scope.pageSize = '100';
		function getOrdList(msg) {
			$scope.checkAllFlag = false;
			erp.load();
			if ($scope.ydh && $scope.ydh.length > 22) {
				var subResStr = $scope.ydh.substring(inpVal.length - 22)
				if (subResStr.substring(0, 1) == '9') {
					$scope.ydh = subResStr;
				}
			}
			var erpData = {};
			erpData.data = {};

			erpData.pageNum = $scope.pageNum;
			erpData.pageSize = $scope.pageSize;
			erpData.beginDate = $('#c-data-time').val();
			erpData.endDate = $('#cdatatime2').val();

			let url = 'processOrder/queryOrder/queryPendingOrderPageByParam' // 原订单接口

			erpData.data.buyerId = $scope.buyerId // 采购人ID
			erpData.data.shortageIdentity = $scope.shortageIdentity // 采购缺货状态
			if($scope.shortageIdentity == 1) url = 'processOrder/queryOrder/queryOrderStockoutPage' // 采购缺货订单接口

			erpData.data.status = '10';
			erpData.data.store = $scope.store;
			erpData.data.shipmentsOrderId = $scope.shipmentsOrderId;

			erpData.data.orderNumber = $scope.orderNumber;
			erpData.data.shopName = $scope.shopName;
			erpData.data.sku = $scope.sku;
			erpData.data.cjProductName = $scope.cjProductName;
			erpData.data.consumerName = $scope.consumerName;
			erpData.data.salesmanName = $scope.salesmanName;
			erpData.data.ownerName = $scope.ownerName;
			erpData.data.shipmentsOrderId = $scope.shipmentsOrderId;
			erpData.data.customerName = $scope.customerName;
			erpData.data.split = $scope.split;
			erpData.data.orderobserver = $scope.orderobserver;
			erpData.data.CJTracknumber = $scope.CJTracknumber;
			erpData.data.oneOrMuch = $scope.danOrDuoType;
			erpData.data.serarchPod = $scope.ordType;
			$scope.storeNumFlag = false;
			if ($scope.selstu == 1) {
				erpData.data.trackingnumberType = 'all';
			} else if ($scope.selstu == 5) {
				erpData.data.auto = 'y';
			} else {
				if ($('.seach-ordnumstu').is(':checked')) {
					erpData.data.trackingnumberType = 1;
				} else {
					erpData.data.trackingnumberType = 'all';
				}
				//判断是否生成追踪号
				if ($scope.selstu == 3) {
					erpData.data.ydh = 'y';
				} else if ($scope.selstu == 2) {
					erpData.data.disputeId = 'dispute';
					erpData.data.ydh = 'all';
				} else {
					erpData.data.ydh = 'all';
				}
			}
			if($scope.selstu == 7){
				erpData.data.subpage = '0';
			}
			if($scope.ydh){
				erpData.data.ydh = $scope.ydh;
			}
			// console.log(erpData)
			if ($scope.isfulfillment) {
				erpData.fulfillment = $scope.fulfillment;
			}
			if($scope.selstu == 6){
				erpData.data.status = '60';
			}
			erp.postFun(url, erpData, function (data) {
				// console.log(data)
				layer.closeAll("loading")
				var erporderResult = data.data.data;//存储订单的所有数据
				$scope.erpordTnum = erporderResult.total;
				$scope.erporderList = erporderResult.list;
				if(msg){
					layer.msg(msg)
				}
				$scope.erporderList.forEach(it=>{
					if(it.intercept&&it.intercept.type==0){
						it.intercept.lanjieType="拦截中"
					}else if(it.intercept&&it.intercept.type==5){
						it.intercept.lanjieType="拦截失败"
					}else if(it.intercept&&it.intercept.type==6){
						it.intercept.lanjieType="拦截成功"
					}else if(it.intercept&&it.intercept.type==2){
						it.intercept.lanjieType="纠纷中"
					}
				})
				countMFun($scope.erporderList);
				dealpage();
			}, function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			})
			if (muId && $scope.shipmentsOrderId) {
				$scope.storeNumFlag = true;
				getMuNumFun($scope.shipmentsOrderId, $scope.store)
			}
			getNumFun()
		}
		// getOrdList()

		$scope.storageCallback = function({ item, storageList, allIdString}){
					$scope.store = allIdString
					if(!!item) $scope.store = item.dataId
					$scope.pageNum = '1'
					getOrdList()
		}

		$scope.purchasePersonCallback = function({id, loginName}){
			console.log('purchasePersonCallback', id)
			$scope.buyerId = id
			// getOrdList()
		}
		
		function getMuNumFun(sid,store){
			erp.getFun('order/order/getOrderCountBySid?sid='+sid+'&store='+store,function(data){
				console.log(data)
				if(data.data.statusCode==200){
					var numObj = data.data.result;
					$scope.storeList[0].ordNum = numObj.yiwu;
					$scope.storeList[1].ordNum = numObj.shenzhen;
					$scope.storeList[2].ordNum = numObj.meixi;
					$scope.storeList[3].ordNum = numObj.meidong;
					$scope.storeList[4].ordNum = numObj.taiguo;
					// $scope.yiWuCount = numObj.yiwu;
					// $scope.shenZhenCount = numObj.shenzhen;
					// $scope.meiGuoCount = numObj.meixi;
					// $scope.meiDongCount = numObj.meidong;
					$scope.meiZzhCount = numObj.mei;
					$scope.youZzhCount = numObj.you;
					$scope.jiuFenCount = numObj.jiufen;
					// $scope.taiGuoCount = numObj.taiguo;
					console.log(numObj)
				}else if(data.data.statusCode==401){
					$scope.storeNumFlag = false;
				}else{
					layer.msg(data.data.message)
					$scope.storeNumFlag = false;
				}
			},function(data){
				console.log(data)
			})
		}
		function countMFun(val) {
			var len = val.length;
			var count = 0;
			for (var i = 0; i < len; i++) {
				count += val[i].order.amount;
			}
			$scope.countMoney = count.toFixed(2)
			// console.log($scope.countMoney);
		}
		//获取数量
		function getNumFun() {
			erp.postFun('processOrder/queryOrder/getOrderCount10', {
				'store': $scope.store
			}, function (data) {
				// console.log(data)
				if (data.data.code == 200) {
					var resResult = data.data.data;
					// console.log(resResult)
					$scope.dYi = resResult.mei;
					$scope.dEr = resResult.you;
					$scope.dSan = resResult.jiufen;
					$scope.purchaseQuantityStock = resResult.purchaseQuantityStock // 获取采购缺货数量
					$scope.interceptNum = resResult.interceptNum;
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.toggleSeaFun = function () {
			$scope.moreSeaFlag = !$scope.moreSeaFlag;
			console.log($scope.moreSeaFlag)
		}
		$scope.enterSerch = function(ev){
			if(ev.keyCode==13){
				$scope.searchFun();
			}
		}
		$scope.searchBtnFun = function () {
			$scope.searchFun();
		}
		$scope.clearBtnFun = function () {
			$scope.orderNumber = undefined;
			$scope.shopName = undefined;
			$scope.sku = undefined;
			$scope.cjProductName = undefined;
			$scope.consumerName = undefined;
			$scope.salesmanName = undefined;
			$scope.ownerName = undefined;
			$scope.shipmentsOrderId = undefined;
			$scope.customerName = undefined;
			$scope.split = undefined;
			$scope.orderobserver = undefined;
			$scope.CJTracknumber = undefined;
			$scope.ydh = undefined;
		}
		//处理分页
		function dealpage() {
			if ($scope.erpordTnum <= 0) {
				layer.msg('未找到订单')
				return;
			}
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: $scope.pageSize * 1,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.pageNum * 1,
				activeClass: 'active',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
				last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
				onPageChange: function (n, type) {
					if (type == 'init') {
						layer.closeAll("loading")
						return;
					}
					$scope.pageNum = n;
					getOrdList()
				}
			});
		}
		//分页选择框的切换
		$scope.pageChangeFun = function () {
			$scope.pageNum = 1;
			getOrdList()
		}
		//跳页的查询
		$scope.gopageFun = function () {
			var countN = Math.ceil($scope.erpordTnum / ($scope.pageSize - 0));
			if ($scope.pageNum > countN || $scope.pageNum < 1) {
				layer.msg('没有此页.');
				return;
			}
			getOrdList()
		}
		//选中一个
		$scope.checkItemFun = function (checkFlag, item, ev) {
			ev.stopPropagation()
			if (checkFlag) {
				for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
					if (!$scope.erporderList[i].order.checkFlag) {
						break
					}
					if (i == len - 1) {
						$scope.checkAllFlag = true;
					}
				}
			} else {
				$scope.checkAllFlag = false;
			}
		}
		$scope.checkAllFun = function () {
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				$scope.erporderList[i].order.checkFlag = $scope.checkAllFlag;
			}
		}
		function checkOrdIds() {
			let checkIds = '';
			if(!$scope.erporderList){
				return
			}
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].order.checkFlag) {
					checkIds += $scope.erporderList[i].order.id + ',';
				}
			}
			return checkIds;
		}
		//批量修改仓库
		$scope.bulkChangeCk = function () {
			var cxclNum = 0;
			let checkIds = checkOrdIds()
			if (!checkIds) {
				layer.msg('请选择订单')
			} else {
				$scope.changeCkFlag = true;
			}
		}
		$scope.changeStoreVal = '0';
		$scope.sureChangeCkFun = function () {
			var cxclids = checkOrdIds();
			cxclids = cxclids.split(',')
			cxclids.pop()
			var cxclData = {};
			cxclData.ids = cxclids;
			cxclData.store = $scope.changeStoreVal;
			console.log(JSON.stringify(cxclData))
			erp.postFun('processOrder/handleOrder/updateOrderWarehouseInfo', JSON.stringify(cxclData), function (data) {
				console.log(data);
				$scope.changeCkFlag = false;
				if (data.data.code == '200') {
					getOrdList()
				} else {
					layer.closeAll("loading")
					layer.msg('修改仓库失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				layer.msg('网络错误')
				console.log(data)
			},{layer:true})
		}
		//按生成追踪号的类型搜索
		$scope.zzhstuFlag = true;
		$scope.checkBoxFun = function (ev) {
			console.log($scope.sdCheckFlag)
			$scope.zzhstuFlag = $scope.sdCheckFlag;
			// if ($evObj.is(':checked')) {
			// } else {
			// 	$scope.zzhstuFlag = false;
			// }
			$scope.pageNum = 1;
			getOrdList()
		}
		//搜索
		$('.c-seach-inp').keypress(function (Event) {
			if (Event.keyCode == 13) {
				$scope.searchFun();
			}
		})
		//复制参考号
		$scope.fzckhFun = function (ev) {
			var fzVal = $(ev.target).siblings('.ckh-val')[0];
			console.log(fzVal)
			fzVal.select(); // 选中文本
			document.execCommand("copy"); // 执行浏览器复制命令
			layer.msg('复制成功')
		}
		$scope.fzZdhFun = function (ev) {
			var fzVal = $(ev.target).siblings('.zdh-val')[0];
			console.log(fzVal)
			fzVal.select(); // 选中文本
			document.execCommand("copy"); // 执行浏览器复制命令
			layer.msg('复制成功')
		}
		$scope.searchFun = function () {
			$scope.pageNum = 1;
			getOrdList();
		}
		//按时间搜索
		//erp开始日期搜索
		$("#c-data-time").click(function () {
			var erpbeginTime = $("#c-data-time").val();
			var interval = setInterval(function () {
				var endtime2 = $("#c-data-time").val();
				if (endtime2 != erpbeginTime) {
					erp.load();
					clearInterval(interval);

					$scope.pageNum = 1;
					getOrdList()
				}
			}, 100)
		})
		//erp结束日期搜索
		$("#cdatatime2").click(function () {
			var erpendTime = $("#cdatatime2").val();
			var interval = setInterval(function () {
				var endtime2 = $("#cdatatime2").val();
				if (endtime2 != erpendTime) {
					erp.load();
					clearInterval(interval);
					$scope.pageNum = 1;
					getOrdList()
				}
			}, 100)
		})
		//批量同步至店铺
		$scope.tbdpFlag = false;
		var tbdpShopIds = '';//存储店铺id
		var tbdpExcelIds = '';//存储excel 的id
		let idsAndTrack = '';//id+追踪号
		let selIdsArr = [];
		$scope.istbdpTc = function () {
			tbdpShopIds = '';
			tbdpExcelIds = '';
			idsAndTrack = '';
			selIdsArr = [];
			$scope.lxindex = 0;
			$scope.nfEytNum = 0;//南风转单号
			$scope.jceqkptNum = 0;//佳成英国转单号
			$scope.shipmentId0Num = 0;//店铺为Brightpearl 商品图片id为0
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].order.checkFlag) {
					let itemStrogeName = $scope.erporderList[i].order.storeName;
					let itemTrackNum = $scope.erporderList[i].order.trackingnumber;
					let letItemOrdId = $scope.erporderList[i].order.id;
					idsAndTrack += letItemOrdId + ',' + itemTrackNum + '|';
					selIdsArr.push(letItemOrdId)
					if (itemStrogeName == 'Brightpearl') {
						let shipIs0Flag = false;
						if ($scope.erporderList[i].product) {
							for (let k = 0, klen = $scope.erporderList[i].product.length; k < klen; k++) {
								if ($scope.erporderList[i].product.image.shippingMethodId == '0') {
									console.log('为0')
									shipIs0Flag = true;
									break
								}
							}
						}
						if (!shipIs0Flag) {
							if (itemTrackNum&&itemTrackNum.indexOf('EYT') >= 0) {
								$scope.nfEytNum++;
							} else if (itemTrackNum&&itemTrackNum.indexOf('EQKPT') >= 0) {
								$scope.jceqkptNum++;
							} else {
								$scope.lxindex++;
							}
							if (itemTrackNum&&itemTrackNum.indexOf('EYT') < 0 && itemTrackNum.indexOf('EQKPT') < 0) {
								if ($(this).parent().siblings('.store-name-td').children('.store-name-p').text() == 'Excel Imported') {
									tbdpExcelIds += letItemOrdId + ',';
									console.log('excel order')
								} else {
									tbdpShopIds += letItemOrdId + ',';
									console.log('dianpu order')
								}
							}
						} else {
							$scope.shipmentId0Num++
						}
					} else {
						console.log('不是Brightpearl店铺')
						if (itemTrackNum&&itemTrackNum.indexOf('EYT') >= 0) {
							$scope.nfEytNum++;
						} else if (itemTrackNum&&itemTrackNum.indexOf('EQKPT') >= 0) {
							$scope.jceqkptNum++;
						} else {
							$scope.lxindex++;
						}
						if (itemTrackNum&&itemTrackNum.indexOf('EYT') < 0 && itemTrackNum.indexOf('EQKPT') < 0) {
							if ($(this).parent().siblings('.store-name-td').children('.store-name-p').text() == 'Excel Imported') {
								tbdpExcelIds += letItemOrdId + ',';
								console.log('excel order')
							} else {
								tbdpShopIds += letItemOrdId + ',';
								console.log('dianpu order')
							}
						}
					}
				}
			}
			if ($scope.lxindex <= 0 && $scope.shipmentId0Num <= 0 && $scope.jceqkptNum <= 0 && $scope.nfEytNum <= 0) {
				layer.msg('请选择订单');
				return;
			} else {
				$scope.tbdpFlag = true;
			}
			console.log(idsAndTrack)
		}
		$scope.istbdpcloseFun = function () {
			$scope.tbdpFlag = false;
		}
		$scope.lvxingFun = function () {
			$scope.tbdpFlag = false;//关闭询问框
			console.log(tbdpExcelIds)
			console.log(tbdpShopIds)
			if ($scope.lxindex > 10) {
				$scope.tbdpTipFlag = true;//打开提示时间较长框
			}
			// erp.load();
			// if(tbdpShopIds){
			// 	tbdpShopIds = tbdpShopIds.split(',')
			// 	tbdpShopIds.pop()
			// }else{
			// 	tbdpShopIds = []
			// }
			// if(tbdpExcelIds){
			// 	tbdpExcelIds = tbdpExcelIds.split(',')
			// 	tbdpExcelIds.pop()
			// }else{
			// 	tbdpExcelIds = [];
			// }
			var upData = {};
			upData.shopId = tbdpShopIds;
			upData.excelId = tbdpExcelIds;
			// console.log(JSON.stringify(upData))
			upData.orderTrackingNumber = idsAndTrack;
			erp.postFun('app/order/fulfilOrder', JSON.stringify(upData), function (data) {
				console.log(data)
				$scope.tbdpTipFlag = false;//关闭同步时间较长的提示框
				if (data.data.result) {
					layer.msg('同步成功')
					$scope.pageNum = 1;
					getOrdList()
				} else {
					layer.closeAll("loading")
					layer.msg('同步失败')
				}

			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
			let newJson = {};
			newJson.ids = selIdsArr;
			erp.postFun('processOrder/queryOrder/batchUpdateOrder', JSON.stringify(newJson), function (data) {
				// console.log(data)
				// $scope.tbdpTipFlag = false;//关闭同步时间较长的提示框
				// if (data.data.code == 200) {
				// 	$scope.pageNum = 1;
				// 	getOrdList()
				// } else {
				// 	layer.closeAll("loading")
				// 	layer.msg('同步失败')
				// }
			}, function (data) {
				console.log(data)
			})
		}
		//更多操作阻止冒泡
		$('.morefun-div').click(function (e) {
			e.stopPropagation()
		})
		//显示大图
		$('.orders-table').on('mouseenter', '.sp-smallimg', function () {
			$(this).siblings('.hide-bigimg').show();
		})
		$('.orders-table').on('mouseenter', '.hide-bigimg', function () {
			$(this).show();
		})
		$('.orders-table').on('mouseleave', '.sp-smallimg', function () {
			$(this).siblings('.hide-bigimg').hide();
		})
		$('.orders-table').on('mouseleave', '.hide-bigimg', function () {
			$(this).hide();
		})
		//给报关名字做修改
		$scope.speditFun = function (item, $event) {
			$($event.target).hide();//把自己隐藏掉
			$($event.target).parent().siblings('.edit-inp').removeAttr('disabled');
			// $('#c-zi-ord .edit-inp').removeAttr('disabled');
			$($event.target).siblings('.sp-par-p').show();
		}
		$scope.spcnsaveFun = function (item, $event) {
			erp.load();
			//获取中文报关名称
			var nameCn = $($event.target).parent().siblings('.edit-inp').val();
			// $scope.bgnameen = item.cjproductnameen;
			//获取英文报关名称
			//var nameEn = $($event.target).parent().parent().parent().siblings('.sp-sec-tr').children('.nameen-td').children('.edit-inp').val();
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
			erp.postFun('processOrder/handleOrder/updateOrderProductCustomName', JSON.stringify(upData), function (data) {
				console.log(data)
				// erp.closeLoad();
				if (data.data.code == 200) {
					layer.msg('修改成功')
					$($event.target).parent().siblings('.hideinp-val').text(nameCn)
					erp.closeLoad();
					//显示编辑按钮
					$($event.target).siblings('.sp-cnedit-btn').show();
					//隐藏保存 取消的按钮
					$($event.target).siblings('.sp-par-p').hide();
					$($event.target).hide();
					//给这条商品设置禁止输入
					$($event.target).parent().siblings('.edit-inp').attr('disabled', 'true');

				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			}, function (data) {
				erp.closeLoad();
				console.log(data)
			})
		}
		$scope.spcnqxFun = function (item, $event) {
			//显示编辑按钮
			$($event.target).siblings('.sp-cnedit-btn').show();
			//获取中文报关名称
			var nameCn = $($event.target).parent().siblings('.hideinp-val').text();
			$($event.target).parent().siblings('.edit-inp').val(nameCn);
			//给这条商品设置禁止输入
			$($event.target).parent().siblings('.edit-inp').attr('disabled', 'true');
			//隐藏保存 取消的按钮
			$($event.target).siblings('.sp-par-p').hide();
			$($event.target).hide();
		}
		$scope.spensaveFun = function (item, $event) {
			erp.load();
			//获取中文报关名称
			var nameCn = item.cjproductnamecn;
			//获取英文报关名称
			var nameEn = $($event.target).parent().siblings('.edit-inp').val();
			var id = item.id;
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
			erp.postFun('processOrder/handleOrder/updateOrderProductCustomName', JSON.stringify(upData), function (data) {
				console.log(data)
				// erp.closeLoad();
				if (data.data.code == 200) {
					erp.closeLoad();
					layer.msg('保存成功')
					$($event.target).parent().siblings('.hideinp-val').text(nameEn)
					//显示编辑按钮
					$($event.target).siblings('.sp-cnedit-btn').show();
					//隐藏保存 取消的按钮
					$($event.target).siblings('.sp-par-p').hide();
					$($event.target).hide();
					//给这条商品设置禁止输入
					$($event.target).parent().siblings('.edit-inp').attr('disabled', 'true');

				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			}, function (data) {
				erp.closeLoad();
				console.log(data)
			})
		}
		$scope.spenqxFun = function (item, $event) {
			//显示编辑按钮
			$($event.target).siblings('.sp-cnedit-btn').show();
			//获取中文报关名称
			var nameEn = $($event.target).parent().siblings('.hideinp-val').text();
			//获取隐藏域中的值填入输入框
			$($event.target).parent().siblings('.edit-inp').val(nameEn);
			//给这条商品设置禁止输入
			$($event.target).parent().siblings('.edit-inp').attr('disabled', 'true');
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
			$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
		}
		$scope.bjSkuSureFun = function (ev, item) {
			var bjSkuInpVal = $.trim($(ev.target).siblings('.bj-spsku').val());
			// console.log(bjSkuInpVal)
			console.log(item)
			var upData = {};
			upData.id = item.id;
			upData.sku = bjSkuInpVal;
			console.log(JSON.stringify(upData));
			var senData = {
				ids: [item.id]
			}
			// return;
			erp.postFun('processOrder/handleOrder/orderReleaseRepertory', JSON.stringify(senData), function (data) {
				erp.postFun('processOrder/handleOrder/updateOrderProductSku', JSON.stringify(upData), function (data) {
					console.log(data);
					if (data.data.code == 200) {
						erp.closeLoad();
						layer.msg('修改成功')
						$(ev.target).siblings('.spsku-text').text(bjSkuInpVal);
						//显示编辑按钮
						$(ev.target).siblings('.xg-spskubtn').show();
						//隐藏保存 取消的按钮
						$(ev.target).parent().find('.bjsame-btn').hide();
						//给这条商品设置禁止输入
						$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
					} else {
						erp.closeLoad();
						layer.msg(data.data.message)
					}
				}, function (data) {
					erp.closeLoad();
					console.log(data)
				},{layer:true});
				erp.postFun('app/order/updateSku', JSON.stringify(upData), function (data) {//同步美国库
					
				});
			}, function () {
				erp.closeLoad();
			},{layer:true});

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
			$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
		}
		$scope.bjHghSureFun = function (ev, item) {
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
			erp.postFun('processOrder/handleOrder/updateOrderProductCustomNumber', JSON.stringify(upData), function (data) {
				console.log(data)
				if (data.data.code == 200) {
					layer.msg('修改成功')
					// $(ev.target).siblings('.spsku-text').text(bjSkuInpVal);
					for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
						for (let j = 0, jLen = $scope.erporderList[i].product.length; j < jLen; j++) {
							if (item.cjProductId == $scope.erporderList[i].product[j].cjProductId) {
								$scope.erporderList[i].product[j].entryCode = bjSkuInpVal;
							} else {
								console.log('不相同')
							}
						}
					}
					//显示编辑按钮
					$(ev.target).siblings('.xg-spskubtn').show();
					//隐藏保存 取消的按钮
					$(ev.target).parent().find('.bjsame-btn').hide();
					//给这条商品设置禁止输入
					$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			}, function (data) {
				console.log(data)
			},{layer:true})
		}
		//编辑申报价值
		$scope.bjSbjzFun = function (ev) {
			$(ev.target).hide();//把自己隐藏掉
			$(ev.target).siblings('.bj-spsku').removeAttr('disabled');
			$(ev.target).siblings('.bjsame-btn').show();
		}
		$scope.bjSbjzQxFun = function (ev) {
			//隐藏保存 取消的按钮
			$(ev.target).parent().find('.bjsame-btn').hide();
			//显示编辑按钮
			$(ev.target).siblings('.xg-spskubtn').show();
			var skuText = $(ev.target).siblings('.spsku-text').text();
			//获取隐藏域中的值填入输入框
			$(ev.target).siblings('.bj-spsku').val(skuText);
			//给这条商品设置禁止输入
			$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
		}
		$scope.bjSbjzSureFun = function (ev, item) {
			var bjSkuInpVal = $.trim($(ev.target).siblings('.bj-spsku').val());
			// console.log(bjSkuInpVal)
			console.log(item)
			var id = item.id;
			var upData = {};
			upData.id = id;
			upData.entryValue = bjSkuInpVal;
			console.log(JSON.stringify(upData));
			// return;
			erp.postFun('processOrder/handleOrder/updateOrderProductCustomPrice', JSON.stringify(upData), function (data) {
				console.log(data)
				erp.closeLoad();
				if (data.data.code == 200) {
					layer.msg('修改成功')
					$(ev.target).siblings('.spsku-text').text(bjSkuInpVal);
					//显示编辑按钮
					$(ev.target).siblings('.xg-spskubtn').show();
					//隐藏保存 取消的按钮
					$(ev.target).parent().find('.bjsame-btn').hide();
					//给这条商品设置禁止输入
					$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
				} else {
					layer.msg('保存失败')
				}
			}, function (data) {
				erp.closeLoad();
				console.log(data)
			})
		}
		//展示历史追踪号
		$scope.hisTraNumFun = function (item) {
			$scope.hisTrackNumFlag = true;
			var hisArr = item.TRACKINGNUMBERHISTORY.replace(item.trackingnumber, '');
			hisArr = hisArr.split(',');
			$scope.hisArr = hisArr;
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
				orderStatusRecordType: '1'
			}
			erp.postFun2('createWaybillNumber.json', JSON.stringify(upJson), function (data) {
				layer.closeAll("loading")
				$scope.autoFreshTrackFlag = false;
				var result = data.data;
				let sess = 0;//存储成功的个数
				let error = 0;//存储失败的个数
				for (var i = 0; i < result.length; i++) {
					sess += result[i].sess;
					error += result[i].error;
				}
				if(sess > 0 ){
					layer.msg('更新成功')
					getOrdList()
				}else{
					layer.msg('更新失败')
				}
			}, function (data) {
				layer.closeAll("loading")
			})
		}
		$scope.lrFun = function (item, ev, index) {
			$scope.lrIndex = index;
			$scope.lrId = item.id;
			$scope.zzhChaFlag = true;
		}
		$scope.canLrFun = function () {
			$scope.zzhChaFlag = false;
			$scope.lrzzhNum = '';
			$scope.lrHref = '';
		}
		$scope.sureChaZzhFun = function () {
			erp.load();
			var lrData = {};
			lrData.logisticsNumber = $scope.lrzzhNum;
			lrData.id = $scope.lrId;
			lrData.href = $scope.lrHref;
			console.log(JSON.stringify(lrData))
			erp.postFun('processOrder/handleOrder/updateOrderTrackingNumber', JSON.stringify(lrData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.zzhChaFlag = false;
				if (data.data.code == 200) {
					if ($scope.selstu == 1) {
						$scope.erporderList.splice($scope.lrIndex, 1);
						$scope.erpordTnum--;
						countMFun($scope.erporderList);
						layer.msg('添加追踪号成功')
					} else {
						layer.msg('修改追踪号成功')
						$scope.erporderList[$scope.lrIndex].order.trackingnumber = $scope.lrzzhNum;
						$scope.erporderList[$scope.lrIndex].order.TRACKINGNUMBERHISTORY = $scope.lrzzhNum + ',' + $scope.erporderList[$scope.lrIndex].order.TRACKINGNUMBERHISTORY;
					}
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

		//CJ客户留言的弹框
		$scope.messageflag = false;
		var mesOrdId;
		var messageCon;
		var mesIndex;
		$scope.messageimgFun = function (item, ev, index) {
			// $event.stopPropagation();
			$scope.messageflag = true;
			$scope.messageCon = item.noteAttributes;
			mesIndex = index;
			messageCon = $('.orders-table .mes-hidetest').eq(index).text();
			$('.custom-mes').val(messageCon);
			mesOrdId = item.id;
			console.log(messageCon + '----' + mesOrdId)
		}
		$scope.messcloseBtnFun = function () {
			$scope.messageflag = false;
			$scope.messageCon = '';
		}
		$scope.cusmesSurnFun = function () {
			var editTextCon = $('.custom-mes').val();
			var mesData = {};
			mesData.id = mesOrdId;
			mesData.noteAttributes = editTextCon;
			console.log(JSON.stringify(mesData))
			erp.postFun('processOrder/handleOrder/upOrderNote', JSON.stringify(mesData), function (data) {
				console.log(data)
				$scope.messageflag = false;
				if (data.data.code == 200) {
					layer.msg('修改成功')
					$scope.erporderList[mesIndex].order.noteAttributes = editTextCon;
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
				layer.msg('网络错误')
			})
		}
		//业务员留言的弹框
		$scope.ywymesFlag = false;
		$scope.ywymesimgFun = function (item, $event) {
			// $event.stopPropagation();
			$scope.ywymesFlag = true;
			$scope.ywymessageCon = item.erpnote;
		}
		$scope.ywymescloseBtnFun = function () {
			$scope.ywymesFlag = false;
			$scope.ywymessageCon = '';
		}

		$scope.quaryZdhFun = function (item) {
			var upIds = {};
			upIds.ids = item.id;
			erp.postFun2('searchOrderTracknumber.json', JSON.stringify(upIds), function (data) {
				console.log(data)
				if (data.data == 1) {
					layer.msg('获取转单号成功')
					$scope.pageNum = 1;
					getOrdList()
				} else if (data.data == 0) {
					layer.msg('获取转单号失败')
				} else {
					layer.msg('无匹配数据')
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.selOrdTypeFun = function () {
			$scope.pageNum = 1;
			getOrdList()
		}
		//义乌 深圳 美国
		$scope.storeFun0 = function (ev) {
			$scope.store = 0;
			if ($(ev.target).hasClass('two-ck-activebtn')) {
				$(ev.target).removeClass('two-ck-activebtn')
				$scope.store = '';
				localStorage.removeItem('store')
			} else {
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$(ev.target).addClass('two-ck-activebtn');
				localStorage.setItem('store', 0)
			}
			$scope.pageNum = 1;
			getOrdList()
		}
		$scope.storeFun1 = function (ev) {
			$scope.store = 1;
			if ($(ev.target).hasClass('two-ck-activebtn')) {
				$(ev.target).removeClass('two-ck-activebtn')
				$scope.store = '';
				localStorage.removeItem('store')
			} else {
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$(ev.target).addClass('two-ck-activebtn');
				localStorage.setItem('store', 1)
			}
			$scope.pageNum = 1;
			getOrdList()
		}
		$scope.storeFun2 = function (ev) {
			$scope.store = 2;
			if ($(ev.target).hasClass('two-ck-activebtn')) {
				$(ev.target).removeClass('two-ck-activebtn')
				$scope.store = '';
				localStorage.removeItem('store')
			} else {
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$(ev.target).addClass('two-ck-activebtn');
				localStorage.setItem('store', 2)
			}
			$scope.pageNum = 1;
			getOrdList()
		}
		$scope.storeFun3 = function (ev) {
			$scope.store = 3;
			if ($(ev.target).hasClass('two-ck-activebtn')) {
				$(ev.target).removeClass('two-ck-activebtn')
				$scope.store = '';
				localStorage.removeItem('store')
			} else {
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$(ev.target).addClass('two-ck-activebtn');
				localStorage.setItem('store', 3)
			}
			$scope.pageNum = 1;
			getOrdList()
		}
		$scope.storeFun4 = function (ev) {
			$scope.store = 4;
			if ($(ev.target).hasClass('two-ck-activebtn')) {
				$(ev.target).removeClass('two-ck-activebtn')
				$scope.store = '';
				localStorage.removeItem('store')
			} else {
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$(ev.target).addClass('two-ck-activebtn');
				localStorage.setItem('store', 4)
			}
			$scope.pageNum = 1;
			getOrdList()
		}
		$scope.selfun1 = function ($event) {//未生成追踪号
			$scope.isfulfillment = false;
			$('.seach-ordnumstu').prop("checked", false);
			$scope.selstu = 1;
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')

			$scope.pageNum = 1;
			clearStockoutOrderStatus()
			getOrdList()
		}
		//客户申请退款
		$scope.selfun2 = function ($event) {
			$scope.isfulfillment = false;
			$('.seach-ordnumstu').prop("checked", false);
			$scope.selstu = 2;
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			//清空列表
			$scope.erporderList = '';
			$scope.erpordTnum = 0;
			$scope.pageNum = 1;
			clearStockoutOrderStatus()
			getOrdList()
		}
		//履行列表
		$scope.selfun4 = function ($event) {
			$('.seach-ordnumstu').prop("checked", false);
			$scope.selstu = 3;
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			$scope.fulfillment = '1';
			$scope.isfulfillment = true;
			$scope.storeNumFlag = false;
			$scope.pageNum = 1;
			clearStockoutOrderStatus()
			getOrdList()
		}
		$scope.selfun5 = function ($event) {
			$scope.isfulfillment = false;
			$('.seach-ordnumstu').prop("checked", false);
			$scope.selstu = 5;
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			//清空列表
			$scope.erporderList = '';
			$scope.erpordTnum = 0;
			$scope.pageNum = 1;
			clearStockoutOrderStatus()
			getOrdList()
		}

		function clearStockoutOrderStatus(){ $scope.shortageIdentity = undefined }
		$scope.purchaseStockout = function ($event) {
			// $scope.isfulfillment = false;
			$('.seach-ordnumstu').prop("checked", false);
			// $scope.selstu = 5;
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			$scope.shortageIdentity = '1'
			//清空列表
			$scope.erporderList = '';
			$scope.erpordTnum = 0;
			$scope.pageNum = 1;
			getOrdList()
		}

		$scope.selfun7 = function ($event) {
			$scope.isfulfillment = false;
			$('.seach-ordnumstu').prop("checked", false);
			$scope.selstu = 7;
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			//清空列表
			$scope.erporderList = '';
			$scope.erpordTnum = 0;
			$scope.pageNum = 1;
			clearStockoutOrderStatus()
			getOrdList()
		}
		$scope.selfun6 = function($event){
			$scope.isfulfillment = false;
			$('.seach-ordnumstu').prop("checked", false);
			$scope.selstu = 6;
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			//清空列表
			$scope.erporderList = '';
			$scope.erpordTnum = 0;
			$scope.pageNum = 1;
			clearStockoutOrderStatus()
			getOrdList()
		}
		//批量同步至店铺 -- 履行列表
		$scope.BatchSynchronization = function () {
			var arr = [];
			var isSelect = false;
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].order.checkFlag) {
					var type = $scope.erporderList[i].order.fulfillmentStatus;
					var id = $scope.erporderList[i].order.id;
					isSelect = true;
					if (type !== '0') {
						layer.msg('只有等待履行状态的订单才可操作');
						continue
					} else {
						console.log(123)
						arr.push(id)
					}
				}
			}
			if (!isSelect) {
				layer.msg('请先选择等待履行状态的订单');
				return;
			}
			if (arr.length > 0) {
				console.log(arr.join(','))
				var data = {
					ids: arr.join(',')
				};
				erp.postFun('fulfillment/activeFulfillment', data, function (res) {
					console.log(data);
					if (res.data.statusCode == 200) {
						layer.msg('同步成功');
						$scope.fulfillment = '1';
						$scope.isfulfillment = true;
						getOrdList()
					}
				}, function (err) {
					layer.msg('系统异常')
				})
			}
		}
		//同步至店铺 -- 履行列表
		$scope.Synchronization = function (item) {
			var data = {
				ids: item.id
			};
			erp.postFun('pojo/shopify/activeFulfillment', data, function (res) {
				console.log(data);
				if (res.data.statusCode == 200) {
					layer.msg('同步成功');
					$scope.fulfillment = '1';
					$scope.isfulfillment = true;
					getOrdList()
				}
			}, function (err) {
				layer.msg('系统异常')
			})
		}
		//已生成追踪号
		$scope.selfun3 = function ($event) {
			$scope.isfulfillment = false;
			$('.seach-ordnumstu').prop("checked", false);
			$scope.selstu = 3;
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			$scope.storeNumFlag = false;
			$scope.pageNum = 1;
			clearStockoutOrderStatus()
			getOrdList()
		}
		//给功能按钮里面的导航添加点击事件
		// alert(muordstu)
		if (muordstu == '' || muordstu == 1) {
			$('.ord-fun-a').eq(0).addClass('ord-active')//让第一个默认选中
			$('.buck-sc-yd').show();//批量生成运单
			$('.buck-change-wl').show();//批量修改物流
			$('.buck-jujue').hide();//批量拒绝
			$('.buck-ty').hide();//批量同意
			$('.buck-cx-wl').hide();//批量重新修改物流
			$('.buck-cx-zzh').hide();//批量重新生成追踪号
			$('.buck-tb').hide();//批量同步至店铺
		}
		else if (muordstu == 3) {
			$scope.selstu = 3;
			$('.ord-fun-a').eq(1).addClass('ord-active');
		} else if (muordstu == 2) {
			// alert(666)
			$scope.selstu = 2;
			$('.ord-fun-a').eq(2).addClass('ord-active');
		}
		$('.orders-table').on('click', '.erporder-detail', function (event) {
			if ($(event.target).hasClass('cor-check-box') || $(event.target).hasClass('qtcz-sel') || $(event.target).hasClass('stop-prop')) {
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
		$('.orders-table').on('mouseenter', '.ordlist-fir-td', function () {
			if ($(this).parent('.erporder-detail').next().hasClass('erporder-detail-active')) {
				$(this).parent('.erporder-detail').next().show()
			} else {
				$(this).parent('.erporder-detail').next().hide()
			}
		})
		$('.orders-table').on('mouseenter', '.moshow-sp-td', function () {
			$(this).parent('.erporder-detail').next().show();
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
			$(this).parent('.erporder-detail').addClass('erporder-detail-active');
		})
		$('.orders-table').on('mouseleave', '.erporder-detail', function () {
			// $(this).next().hide();
			if ($(this).hasClass('order-click-active')) {
				$(this).next().show();
			} else {
				$(this).next().hide();
			}
		})
		$('.orders-table').on('mouseenter', '.erpd-toggle-tr', function () {
			$(this).show();
		})
		$('.orders-table').on('mouseleave', '.erpd-toggle-tr', function () {
			// $(this).hide();
			
			if ($(this).prev().hasClass('order-click-active')) {
				$(this).show();
				console.log($(this).prev().hasClass('order-click-active'))
			} else {
				$(this).hide();
			}
		})
		$('.orders-table').mouseleave(function () {
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
		})
		$scope.handleTargetData = (item, $event) => {
			if ($event.target.classList.contains('cor-check-box')) return; // 勾选
			item.clickcontrl = !item.clickcontrl;
			if (!item.clickcontrl) item.mousecontrol = 0; // 保证收起
		}
		//批量提交到拦截
		$scope.oneAddLanJieFun = function (item) {
			$scope.itemId = item.id;
			$scope.oneAddLanJieFlag = true;
		}
		//添加到拦截成功
		$scope.addLanJieConfirm = function(item){
			erp.postFun('processOrder/intercept/confirm', {cjOrder:item.id}, function (data) {
			  console.log(data)
			  const res = data.data
			  if(res.code == 200){
				$scope.pageNum = 1;
				getOrdList('操作成功')
			  }else {
				layer.msg('操作失败')
			  }
			}, function (data) {
			  console.log(data)
			})
		  }
		$scope.oneSureLanJieFun = function () {
			erp.postFun('processOrder/handleOrder/updateOrderProcessInterception', {ids:$scope.itemId}, function (data) {
				console.log(data)
				$scope.oneAddLanJieFlag = false;
				const res = data.data
				if(res.code == 200){
					$scope.pageNum = 1;
					getOrdList('拦截成功')
				}else {
					layer.msg('拦截失败')
				}
			}, function (data) {
				console.log(data)
			},{layer:true})
		}
		var checdedIds;
		$scope.addLanJieFun = function () {
			checdedIds = checkOrdIds();
			idsAndTrack = '';
			selIdsArr = [];
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].order.checkFlag) {
					let itemTrackNum = $scope.erporderList[i].order.trackingnumber;
					let letItemOrdId = $scope.erporderList[i].order.id;
					idsAndTrack += letItemOrdId + ',' + itemTrackNum + '|';
					selIdsArr.push(letItemOrdId)
				}
			}
			if (checdedIds) {
				$scope.isaddLjzFlag = true;
			} else {
				$scope.isaddLjzFlag = false;
				layer.msg('请选择订单')
			}
		}
		//取消拦截订单
		$scope.cancelLanjie = function(item){
			erp.load();
			erp.postFun('processOrder/handleOrder/updateInterceptList', {ids:item.id}, function (data) {
				console.log(data)
				erp.closeLoad()
				const res = data.data
				if(res.code == 200){
					$scope.pageNum = 1;
					getOrdList('取消拦截成功')
				}else {
					layer.msg('取消拦截失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.cancelAddLjzFun = function () {
			$scope.isaddLjzFlag = false;
			checdedIds = '';
		}
		$scope.sureAddLjzFun = function () {
			let newJson = {};
			let idsArr = checdedIds.split(',')
			idsArr.pop()
			newJson.ids = idsArr.join(",")
			erp.postFun('processOrder/handleOrder/updateOrderProcessInterception', JSON.stringify(newJson), function (data) {
				console.log(data)
				$scope.isaddLjzFlag = false;
				const res = data.data
				if(res.code == 200){
					$scope.pageNum = 1;
					getOrdList('拦截成功')
				}else {
					layer.msg('拦截失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		//批量提交到已发货
		$scope.isaddyfhFlag = false;
		var addyfhIds;
		$scope.bulkAddYfhFun = function () {
			addyfhIds = checkOrdIds();
			idsAndTrack = '';
			selIdsArr = [];
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].order.checkFlag) {
					let itemTrackNum = $scope.erporderList[i].order.trackingnumber;
					let letItemOrdId = $scope.erporderList[i].order.id;
					idsAndTrack += letItemOrdId + ',' + itemTrackNum + '|';
					selIdsArr.push(letItemOrdId)
				}
			}
			if (addyfhIds) {
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
			var addyfhData = {};
			addyfhData.ids = addyfhIds;
			addyfhData.type = '10';
			addyfhData.orderTrackingNumber = idsAndTrack;
			console.log(JSON.stringify(addyfhData))
			erp.postFun('app/order/nextFlow', JSON.stringify(addyfhData), function (data) {
				console.log(data)
				$scope.isaddyfhFlag = false;
				if (data.data.result) {
					$scope.pageNum = 1;
					getOrdList();
				} else {
					layer.msg('批量提交到已发货失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			},{layer:true})
			let newJson = {};
			newJson.ids = selIdsArr;
			erp.postFun('processOrder/queryOrder/batchUpdateOrder', JSON.stringify(newJson), function (data) {
				// console.log(data)
			}, function (data) {
				console.log(data)
			})
		}
		//单个提交到已发货
		$scope.singleisaddyfhFlag = false;
		var singleAddYfhId, singleAddYfhIndex;
		$scope.singleAddyfhFun = function (item, index) {
			idsAndTrack = '';
			$scope.singleisaddyfhFlag = true;
			singleAddYfhId = item.id;
			singleAddYfhIndex = index;
			idsAndTrack = item.id + ',' + item.trackingnumber + '|';
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
			addyfhData.type = '10';
			addyfhData.orderTrackingNumber = idsAndTrack;
			console.log(JSON.stringify(addyfhData))
			erp.postFun('app/order/nextFlow', JSON.stringify(addyfhData), function (data) {
				console.log(data)
				$scope.singleisaddyfhFlag = false;
				layer.closeAll("loading")
				if (data.data.result) {
					$scope.erporderList.splice(singleAddYfhIndex, 1);
					$scope.erpordTnum--;
					countMFun($scope.erporderList);
				} else {
					layer.msg('批量提交到已发货失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
			let newJson = {};
			newJson.ids = [singleAddYfhId];
			erp.postFun('processOrder/queryOrder/batchUpdateOrder', JSON.stringify(newJson), function (data) {
				// console.log(data)
			}, function (data) {
				console.log(data)
			})
		}
		//编辑弹框
		$scope.editFlag = false;
		$scope.editFun = function (item, $event, index) {
			$scope.itemIndex = index;
			$event.stopPropagation();
			$scope.editFlag = true;
			console.log(item)
			$scope.itemData = item;
			$scope.customerName = item.customerName=='null'?'':item.customerName;
			$scope.countryCode = item.countryCode=='null'?'':item.countryCode;
			$scope.countryName = item.country=='null'?'':item.country;
			$scope.province = item.province=='null'?'':item.province;
			$scope.city = item.city=='null'?'':item.city;
			$scope.shipAddress1 = item.shippingAddress=='null'?'':item.shippingAddress;
			$scope.shipAddress2 = item.shippingAddress2=='null'?'':item.shippingAddress2;
			$scope.zip = item.zip=='null'?'':item.zip;
			$scope.phone = item.phone=='null'?'':item.phone;
			$scope.logisticName = item.logisticName=='null'?'':item.logisticName;
			$scope.eMail = item.email=='null'?'':item.email;
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
			var pushData = {};
			pushData.id = $scope.itemData.id;
			// pushData.salesman = $scope.itemData.salesman;
			pushData.customerName = $scope.customerName;
			pushData.country = $scope.countryName || '';
			pushData.countryCode = $scope.countryCode;
			pushData.province = $scope.province;
			pushData.city = $scope.city;
			pushData.shipAddress1 = $scope.shipAddress1;
			pushData.shipAddress2 = $scope.shipAddress2;
			pushData.zip = $scope.zip;
			pushData.phone = $scope.phone;
			// pushData.logisticName = $scope.logisticName;
			pushData.email = $scope.eMail;
			erp.postFun('processOrder/handleOrder/updateOrderShipInfo', JSON.stringify(pushData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.editFlag = false;
				if (data.data.code == 200) {
					layer.msg('修改成功')
					$scope.erporderList[$scope.itemIndex].order.customerName = $scope.customerName;
					// $scope.erporderList[$scope.itemIndex].order.countryCode = $scope.countryCode;
					$scope.erporderList[$scope.itemIndex].order.province = $scope.province;
					$scope.erporderList[$scope.itemIndex].order.city = $scope.city;
					$scope.erporderList[$scope.itemIndex].order.shippingAddress = $scope.shipAddress1;
					$scope.erporderList[$scope.itemIndex].order.shippingAddress2 = $scope.shipAddress2;
					$scope.erporderList[$scope.itemIndex].order.zip = $scope.zip;
					$scope.erporderList[$scope.itemIndex].order.phone = $scope.phone;
					$scope.erporderList[$scope.itemIndex].order.email = $scope.eMail;
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				layer.msg('修改响应失败')
			},{layer:true})
			erp.postFun('app/order/updateERPOrder',pushData,function(data){
				
			})
		}
		$scope.oneBzxCjPacketFun = function () {
			$scope.oneIsZCjpacketFlag = false;
			$scope.showindex = 4;//直接归到综合物流去
		}
		$scope.oneZxCjPacketFun = function () {
			$scope.oneIsZCjpacketFlag = false;
			$scope.showindex = 25;//cjpacket 中转
		}
		function creatTrackFun(ids, timer) {
			console.log(timer)
			erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
				if (timer) {
					clearInterval(timer);//加载后清除定时器
					$('#animat-text').text('');//提示消息置为空
					$scope.endadmateP = true;//让成功失败条数显示起来
				}
				layer.closeAll("loading")
				var result = data.data;
				$scope.sess = 0;//存储成功的个数
				$scope.error = 0;//存储失败的个数
				for (var i = 0; i < result.length; i++) {
					$scope.sess += result[i].sess;
					$scope.error += result[i].error;
				}
			}, function (data) {
				layer.closeAll("loading")
			})
		}
		//对订单单独操作的下拉框函数
		$scope.oneisydFlag = false;//单独操作生成运单号的弹框
		$scope.onesuccscydnumflag = false;//单独操作生成运单号成功失败的提示框
		$scope.onescydhFunclick = function (item, $event, ordItem) {

			//判断will的测试账号，目前只能写死
			if (item.merchantnNumber == '0d98c91b3ed64b0a9ced9bdef3bb8c32') {
				layer.msg('该订单为测试账号订单')
				return;
			}
			$scope.companyCode = "";
			$scope.companyValue = "";
			$scope.choseAcount = "";
			$scope.acountList = "";
			$scope.ddepackNum = 0;
			$scope.bdepackNum = 0;
			$scope.oneHcepackNum = 0;//含磁epack
			$scope.oneHfmEpackNum = 0;//含粉末
			$scope.uspsNum = 0;
			$scope.ddyzxbNum = 0;//带电邮政小包数量
			$scope.bdyzxbNum = 0;//不带电邮政小包数量
			$scope.qtwlordNum = 0;
			$scope.uspsPlusNum = 0;
			$scope.gzepackNum = 0;//膏状E邮宝
			$scope.showindex = 0;//控制哪种状态可以打印运单
			$scope.ytNum = 0;//云途
			$scope.onedhlddNum = 0;//带电dhl
			$scope.onedhlnotdNum = 0;//不带电dhl
			$scope.dhlGfNum = 0;//dhl官方转
			$scope.dhlOfficialNum = 0;//dhl官方
			$scope.usps2PlusNum = 0;
			$scope.epack2yanwen = 0;
			$scope.toSFGJNum = 0;//符合转顺丰国际
			$scope.toSFTHNum = 0;//符合转顺丰特惠
			$scope.cjpacket2epacketNum = 0;
			$scope.nfSfNum = 0;//南风顺丰的个数
			$scope.ttSfNum = 0;//泰腾顺丰的个数
			$scope.nfOrTtNum = 0;
			$scope.dhl2Bldhl = 0;//转巴林的个数
			$scope.epack2LianbangNum = 0;
			$scope.dhlXiaoBaoNum = 0;
			$scope.toDhlXiaoBaoNum = 0;//符合转DHL eCommerce
			$scope.usZhwlNum = 0;//cjpacket 转
			$scope.yanWenNum = 0;//燕文
			$scope.jewelNum = 0;
			$scope.jewelFlatNum = 0;
			$scope.jewelPlusNum = 0;
			$scope.hkDhlNum = 0;
			$scope.dgEpacketNum = 0;
			$scope.bHepacketNum = 0;
			$scope.sfcBrazilLineNum = 0;
			$scope.ylColumbiaNum = 0;
			$scope.ylPeruNum = 0;
			$scope.toThCoeNum = 0;
			$scope.cjpacketSxText = '';
			$scope.cjCodNum = 0;
			toThCoeIds = '';
			var usZhwlIds = '';
			usps2uspsPlusIds = '';
			epack2ywIds = '';
			toSFGJIds = '';
			toSFTHIds = '';
			toEpacketIds = '';
			dhl2BldhlIds = '';//转巴林dhl
			usps2DhlXiaoBaoIds = '';
			$scope.oneordId = item.id;
			$scope.postNlCount = 0;
			$scope.sanTaiNum = 0;
			$scope.haiJinCjpacketNum = 0;
			$scope.dhlDeNum = 0;
			$scope.deutschePostNum = 0;
			$scope.cjpacketSeaSenNum = 0;
			$scope.cjpacketThaNum = 0;
			$scope.cjpacketSeaNum = 0;
			$scope.euroOrdinarNum = 0;
			var sTAuIds = '',
				sTCaIds = '',
				sTDeZxIds = '',
				sTDeThIds = '',
				sTMxIds = '',
				sTUsIds = '',
				sTUsDdIds = '',
				sTUsBddIds = '',
				yTFrIds = '',
				yTAtIds = '',
				yTSeIds = '',
				yTGbDdIds = '',
				yTGbBddIds = '',
				yTBrIds = '',
				yTEsIds = '',
				yTBddIds = '',
				yTDdIds = '',
				yTYdsKrIds = '',
				haiJinCjpacketIds = '',
				haiJinBatteryIds = '',
				sTItIds = '',
				yanWenCommonIds = '',
				yanWenBrttryIds = '',
				dhlDeIds = '',
				dhlOtherIds = '',
				deutschePostDeIds = '',
				deutschePostOtherIds = '',
				cjpacketSeaLightIds = '',
				cjpacketSeaHeavyIds = '',
				cjpacketCazxIds = '',
				cjpacketFrPhIds = '',
				cjpacketFrThIds = '',
				cjpacketAeIds = '',
				euroOrdinarGbIds = '',
				euroOrdinarDeIds = '',
				euroOrdinarFrIds = '',
				euroOrdinarBeIds = '',
				euroOrdinarItIds = '',
				stGBIds = '';
			var spCountNum = 0;
			$scope.teDingGuoJiaCjpacketCount = 0;
			var $sptdObj = $($event.target).parent().parent().parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
			var itemSpline = $($event.target).parent().parent().parent().parent().siblings('.erpd-toggle-tr').find('.pro-item-sp');
			console.log($sptdObj.children('.sp-sx-span').text())
			var isCjPacketFlag = true;
			spCountNum = ordItem.product.length;
			var strSpSxList1 = '';
			if (spCountNum > 0) {
				for (var i = 0; i < spCountNum; i++) {
					strSpSxList1 += ordItem.product[i].property + ',';
				}
			}
			var sxArr1 = strSpSxList1.split(',');
			sxArr1.pop();
			let commonSpFlag = isCommonFlagFun(sxArr1);
			let commonAndThinFlag =  isCommonAndThinFlagFun(sxArr1)
			let batteryOrElectoronicFlag = isBatteryOrELECTRONICFun(sxArr1)
			let isDianOrCommonFlag = isDianOrCommonFun(sxArr1)
			let isHaveDianOrBatteryFlag = isHaveDianOrBatteryFun(sxArr1)
			let isCommonAndElectronicFlag = isCommonAndElectronicFun(sxArr1)
			let isAllPuhuoFlag = isAllPuhuoFun(sxArr1);
			let isHanCiAndElectronicFlag = isHanCiAndElectronicFun(sxArr1);
			// item.orderweight > 285 && 取消重量限制
			if (item.countryCode == 'US') {
				//之前普货的判断
				if (($scope.store == 0 || $scope.store == 1 || $scope.store == 5) && commonAndThinFlag && !~commonCjpacketLogArr.indexOf(item.logisticName)) {
					$scope.usZhwlNum++;
					// $scope.showindex = 25;
					isCjPacketFlag = false;
					$scope.oneIsZCjpacketFlag = true;
					$scope.cjpacketSxText = '普货';
					$scope.transferCjpacketType = undefined;
				}
				if (($scope.store == 0) && item.merchantnNumber == '82ff8b76491a4c1a8328342f2c34a19b' && !~electronicCjpacketLogArr.indexOf(item.logisticName)) {
					if((itemSpline == 1 && batteryOrElectoronicFlag) || (itemSpline>1&&isDianOrCommonFlag)){
						$scope.usZhwlNum++;
						$scope.oneIsZCjpacketFlag = true;
						isCjPacketFlag = false;
						$scope.transferCjpacketType = 1;
						$scope.cjpacketSxText = '带电';
					}
				}
				//其它属性 单品的判断
				// if (spCountNum == 1) {
				// 	if (sxArr1.length == 1) {
				// 		// if (sxArr1[0] == 'EDGE') {//尖锐
				// 		// 	$scope.usZhwlNum++;
				// 		// 	isCjPacketFlag = false;
				// 		// 	$scope.oneIsZCjpacketFlag = true;
				// 		// 	$scope.transferCjpacketType = 4;
				// 		// 	$scope.cjpacketSxText = '尖锐';
				// 		// } else if (sxArr1[0] == 'ELECTRONIC' || sxArr1[0] == 'BATTERY' || sxArr1[0] == 'BATTERY') {//带电
				// 		// 	$scope.usZhwlNum++;
				// 		// 	isCjPacketFlag = false;
				// 		// 	$scope.oneIsZCjpacketFlag = true;
				// 		// 	$scope.transferCjpacketType = 1;
				// 		// 	$scope.cjpacketSxText = '带电';
				// 		// } else 
				// 		if (sxArr1[0] == 'HAVE_LIQUID') {//含液体
				// 			$scope.usZhwlNum++;
				// 			isCjPacketFlag = false;
				// 			$scope.oneIsZCjpacketFlag = true;
				// 			$scope.cjpacketSxText = '液体';
				// 			$scope.transferCjpacketType = 2;
				// 		} else if (sxArr1[0] == 'HAVE_CREAM') {//含膏体
				// 			$scope.usZhwlNum++;
				// 			isCjPacketFlag = false;
				// 			$scope.oneIsZCjpacketFlag = true;
				// 			$scope.cjpacketSxText = '膏体';
				// 			$scope.transferCjpacketType = 3;
				// 		}
				// 	} else if (sxArr1.length > 1) {
				// 		$scope.usZhwlNum++;
				// 		isCjPacketFlag = false;
				// 		$scope.oneIsZCjpacketFlag = true;
				// 		$scope.cjpacketSxText = '敏感';
				// 		$scope.transferCjpacketType = 5;
				// 	}
				// }
			}
			if (isCjPacketFlag) {
				if (item.logisticName == 'ePacket' && item.countryCode == 'US' && item.orderweight <= 1000) {
					// console.log('符合转顺丰国际官方')
					if (commonSpFlag) {
						$scope.toSFGJNum++;
						toSFGJIds = item.id + ',';
					}
				}

				if (item.logisticName == 'ePacket' && item.countryCode == 'US' && item.orderweight > 1600) {
					// console.log('符合转顺丰特惠')
					if (commonSpFlag) {
						$scope.toSFTHNum++;
						toSFTHIds = item.id + ',';
					}
				}
				// if (item.logisticName == 'CJPacket' && item.countryCode == 'US' && item.orderweight <= 2000) {
				// 	// console.log('符合转epacket')
				// 	if (commonSpFlag) {
				// 		$scope.cjpacket2epacketNum++;
				// 		toEpacketIds = item.id + ',';
				// 	}
				// }
				if (item.countryCode == 'TH' && item.logisticsmode != 'COD' && (item.merchantnNumber == 'b7234b0c6d6e456cb261bbcd142c6d42' || item.merchantnNumber == 'abbbda4d662340e1876076ad0accd5fe')) {
					$scope.toThCoeNum++;
					toThCoeIds = item.id + ',';
				}
				if ($scope.store == 4 && item.countryCode == 'TH' && item.logisticsmode == 'COD' && (item.merchantnNumber == 'b7234b0c6d6e456cb261bbcd142c6d42' || item.merchantnNumber == 'abbbda4d662340e1876076ad0accd5fe')) {
					$scope.qtwlordNum++;
					$scope.showindex = 4;
				} else {
					if (item.logisticName == 'ePacket') {//$(this).parent().parent().siblings('.wl-ord-td').children('.wl-name-p').text()
						if (item.countryCode == 'GB' || item.countryCode == 'DE' || item.countryCode == 'IN' || item.countryCode == 'ES' || item.countryCode == 'BE' || item.countryCode == 'DK') {
							if (0 <= item.orderweight <= 2000) {
								if (commonSpFlag) {
									$scope.epack2yanwen++;
									epack2ywIds += item.id + ',';
								}
							}
						}
						if ($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0) {
							$scope.ddepackNum++;
							$scope.showindex = 1;
							// console.log('判断带电的条件')
						} else if ($sptdObj.children('.sp-sx-span').text().indexOf('膏') >= 0 || $sptdObj.children('.sp-sx-span').text().indexOf('液') >= 0) {
							if (isOneSxFun(item.product, 'HAVE_CREAM') || $sptdObj.children('.sp-sx-span').text().indexOf('液') >= 0) {
								$scope.gzepackNum++;
								$scope.showindex = 9;
							} else {
								$scope.oneHcepackNum++;
								$scope.showindex = 13;
							}
						} else if ($sptdObj.children('.sp-sx-span').text().indexOf('磁') >= 0) {
							$scope.oneHcepackNum++;
							$scope.showindex = 13;
							// console.log('判断含磁E邮宝的条件')
						}
						// else if($sptdObj.children('.sp-sx-span').text().indexOf('粉')>=0){
						// 	$scope.oneHfmEpackNum++;
						// 	$scope.showindex = 18;
						// 	console.log('含粉末')
						// }
						else {
							$scope.bdepackNum++;
							$scope.showindex = 2;
							// console.log('判断e邮宝不带电的条件')
						}
					}
					else if(item.logisticName == 'ePacket-Yiwu' || item.logisticName == 'ePacket Yiwu'){
						$scope.bdepackNum++;
						$scope.showindex = 2;
					}
					else if (item.logisticName == 'DHL') {//$(this).parent().parent().siblings('.wl-ord-td').children('.wl-name-p').text()

						if ($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0) {
							$scope.onedhlddNum++;
							$scope.showindex = 11;
							// console.log('判断带电dhl的条件')
						} else {
							if (item.orderweight < 2000) {
								$scope.dhlGfNum++;
								$scope.showindex = 19;
							} else {
								$scope.onedhlnotdNum++;
								$scope.showindex = 12;
							}
						}
					}
					else if (item.logisticName == 'DHL DE') {
						$scope.dhlDeNum++;
						$scope.showindex = 46;
						if(item.countryCode == 'DE'){
							dhlDeIds += item.id + ',';
						}else{
							dhlOtherIds += item.id + ',';
						}
					}
					else if (item.logisticName == 'Deutsche Post') {
						$scope.deutschePostNum++;
						$scope.showindex = 47;
						if(item.countryCode == 'DE'){
							deutschePostDeIds += item.id + ',';
						}else{
							deutschePostOtherIds += item.id + ',';
						}
					}
					else if (item.logisticName == 'DHL Official') {
						let itemSpLineLength = ordItem.product.length;
						let isNullHghFlag = false;
						if (itemSpLineLength > 0) {
							for (let i = 0; i < itemSpLineLength; i++) {
								if (!ordItem.product[i].entryCode) {
									isNullHghFlag = true;
									break;
								}
							}
						}
						if (isNullHghFlag) {
							layer.msg('请为该订单下的商品填写海关号')
							return
						} else {
							$scope.dhlOfficialNum++;
							$scope.showindex = 20;
						}

					}
					else if (item.logisticName == 'CJ Normal Express') {
						if (item.orderweight > 1000 && item.orderweight <= 1600) {
							$scope.nfSfNum++;
							$scope.showindex = 15;
						} else if (item.orderweight > 1600 || item.orderweight <= 1000) {
							$scope.ttSfNum++;
							$scope.showindex = 16;
						}
					}
					else if (item.logisticName == 'USPS') {
						if (item.orderweight <= 170 && $sptdObj.children('.sp-sx-span').text().indexOf('电') == -1 && $sptdObj.children('.sp-sx-span').text().indexOf('液') == -1 && $sptdObj.children('.sp-sx-span').text().indexOf('膏') == -1) {
							$scope.toDhlXiaoBaoNum++
							usps2DhlXiaoBaoIds = item.id + ',';
						}
						$scope.uspsNum++;
						$scope.showindex = 3;
						usps2uspsPlusIds = item.id;
						// console.log('判断usps物流的条件')
					}
					else if (item.logisticName == 'China Post Registered Air Mail') {
						if ($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0) {
							$scope.ddyzxbNum++;
							$scope.showindex = 5;
							// console.log('判断邮政小包带电的条件')
						} else {
							$scope.bdyzxbNum++;
							$scope.showindex = 6;
							// console.log('判断邮政小包不带电的条件')
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
					else if (item.logisticName == 'USPS+' && $sptdObj.children('.sp-sx-span').text().indexOf('电') == -1 && $sptdObj.children('.sp-sx-span').text().indexOf('液') == -1 && $sptdObj.children('.sp-sx-span').text().indexOf('膏') == -1) {
						if (item.orderweight <= 170) {
							$scope.toDhlXiaoBaoNum++
							usps2DhlXiaoBaoIds = item.id + ',';
						}
						$scope.uspsPlusNum++;
						$scope.showindex = 7;
						// console.log('判断usps+物流的条件')
					}
					else if (item.logisticName == 'CJPacket SEA Express' || item.logisticName == 'CJPacket JL Express') {
						$scope.cjpacketSeaExpCount++;
						$scope.showindex = 42;
						// console.log('嘉里空运')
					}
					else if (item.logisticName.indexOf('YunExpress') >= 0) {
						$scope.ytNum++;
						$scope.showindex = 10;
						// console.log('判断云途物流的条件')
					}
					else if (item.logisticName == 'DHL eCommerce') {
						$scope.dhlXiaoBaoNum++;
						$scope.showindex = 23;
					}
					else if (item.logisticName == 'DHL HongKong') {
						$scope.hkDhlNum++;
						$scope.showindex = 34;
					}
					else if (item.logisticName == 'YanWen') {
						if (item.orderweight <= 2000) {
							var itemSfthSpNum = ordItem.product.length;
							var strSfthSpSxList = '';
							if (itemSfthSpNum > 0) {
								for (var i = 0; i < itemSfthSpNum; i++) {
									strSfthSpSxList += ordItem.product[i].property + ',';
								}
							}
							var sfthSxArr = strSfthSpSxList.split(',');
							sfthSxArr.pop();
							var sfthIsCommonFlag = false;
							for (var j = 0; j < sfthSxArr.length; j++) {
								if (sfthSxArr[j] != 'COMMON'&&sfthSxArr[j] != 'ELECTRONIC') {
									sfthIsCommonFlag = false;
									break;
								} else {
									sfthIsCommonFlag = true;
								}
							}
							let isHaveBatteryFlag = isHaveBatteryFun(sfthSxArr)
							let isHanDianFlag = isHanDianFun(sfthSxArr)
							let isHanGaoSpFlag = isHanGaoSpFun(sfthSxArr)
							let isHaiJinFlag = isNoEntry(sfthSxArr)
							if (sfthIsCommonFlag || isHaiJinFlag) {
								$scope.showindex = 26;
								$scope.yanWenNum++;
								yanWenCommonIds = item.id;
							}else if(isHanDianFlag || isHanGaoSpFlag){
								$scope.showindex = 26;
								$scope.yanWenNum++;
								yanWenBrttryIds = item.id;
							}else {
								$scope.qtwlordNum++;
								$scope.showindex = 4;
							}
						} else {
							$scope.qtwlordNum++;
							$scope.showindex = 4;
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
						$scope.jewelFlatNum++;
						$scope.showindex = 35;
					}
					else if (item.logisticName == 'YL Columbia line') {
						$scope.ylColumbiaNum++;
						$scope.showindex = 40;
					}
					else if (item.logisticName == 'YL Peru line') {
						$scope.ylPeruNum++;
						$scope.showindex = 41;
					}
					else if(item.logisticName == 'CJPacket Euro Ordinary'){
						if(item.countryCode == 'GB' || item.countryCode == 'DE' || item.countryCode == 'FR' || item.countryCode == 'BE' || item.countryCode == 'IT'){
							$scope.euroOrdinarNum++;
							$scope.showindex = 51;
						}
						if(item.countryCode == 'GB'){
							euroOrdinarGbIds += item.id;
						}else if(item.countryCode == 'DE'){
							euroOrdinarDeIds += item.id;
						}else if(item.countryCode == 'FR'){
							euroOrdinarFrIds += item.id;
						}else if(item.countryCode == 'BE'){
							euroOrdinarBeIds += item.id;
						}else if(item.countryCode == 'IT'){
							euroOrdinarItIds += item.id;
						}
					}
					else if (item.logisticName == 'CJPacket') {
						var itemSfthSpNum = ordItem.product.length;
						var strSfthSpSxList = '';
						if (itemSfthSpNum > 0) {
							for (var i = 0; i < itemSfthSpNum; i++) {
								strSfthSpSxList += ordItem.product[i].property + ',';
							}
						}
						var sxArr1 = strSfthSpSxList.split(',');
						sxArr1.pop();
						var noEntryFlag = false;
						for (var j = 0; j < sxArr1.length; j++) {
							if (sxArr1[j] == 'NO_ENTRY') {
								noEntryFlag = true;
								break;
							} else {
								noEntryFlag = false;
							}
						}
						let isHaveBatteryFlag = isHaveBatteryFun(sxArr1)
						let cjpacketAeFlag = cjpacketAeFun(sxArr1);
						if(item.countryCode == 'GB'&&item.orderweight < 2000){
							$scope.haiJinCjpacketNum++;
							if(isHaveBatteryFlag){//是不是电池 燕文484
								haiJinBatteryIds = item.id;
							}else{//燕文481
								haiJinCjpacketIds = item.id;
							}
						}else{
							if(noEntryFlag && item.countryCode != 'CA'){
								$scope.haiJinCjpacketNum++;
								// if(item.countryCode=='IT'){
								// 	sTItIds = item.id;
								// }else{
								// 	if(isHaveBatteryFlag){//是不是电池
								// 		haiJinBatteryIds = item.id;
								// 	}else{
								// 		haiJinCjpacketIds = item.id;
								// 	}
								// }
								if(isHaveBatteryFlag){//是不是电池
									haiJinBatteryIds = item.id;
								}else{
									haiJinCjpacketIds = item.id;
								}
								$scope.showindex = 45;
							}else{
								if (item.countryCode == 'AU') {
									$scope.sanTaiNum++;
									// sTAuIds = item.id;
									$scope.showindex = 33;
									if(item.orderweight < 2000){
										yTGbDdIds = item.id;//燕文特货
									}else{
										// yTDdIds = item.id + ',';
										if(commonSpFlag){
											yTBddIds = item.id + ',';
										}else{
											yTDdIds = item.id + ',';
										}
									}
								} else if (item.countryCode == 'CA') {
									$scope.sanTaiNum++;
									$scope.showindex = 33;
									cjpacketCazxIds = item.id + ',';
								} 
								// else if (item.countryCode == 'CA'&&item.orderweight < 2000) {
								// 	$scope.sanTaiNum++;
								// 	$scope.showindex = 33;
								// 	if(isHaveBatteryFlag){//是不是电池 燕文484
								// 		yTGbDdIds = item.id;
								// 	}else{//燕文481
								// 		yTGbBddIds = item.id;
								// 	}
								// } 
								else if (item.countryCode == 'DE'&&item.orderweight >= 2000) {
									//德国特惠
									$scope.sanTaiNum++;
									if(commonSpFlag){
										yTBddIds = item.id + ',';
									}else{
										yTDdIds = item.id + ',';
									}
									$scope.showindex = 33;
								} 
								else if (item.countryCode == 'DE'&&item.orderweight < 2000) {
									//德国特惠
									$scope.sanTaiNum++;
									$scope.showindex = 33;
									if(batteryOrElectoronicFlag){//是不是电池 电子 燕文484
										yTGbDdIds = item.id;
									}else{//燕文481
										yTGbBddIds = item.id;
									}
								} 
								else if (item.countryCode == 'MX') {
									$scope.sanTaiNum++;
									sTMxIds = item.id;
									$scope.showindex = 33;
								} else if (item.countryCode == 'US') {
									$scope.sanTaiNum++;
									if(isHaveDianOrBatteryFlag){
										sTUsDdIds = item.id;
									}else{
										sTUsBddIds = item.id;
									}
									$scope.showindex = 33;
								}
								else if (item.countryCode == 'CH' || item.countryCode == 'LU') {
									$scope.sanTaiNum++;
									// yTDdIds = item.id + ',';
									$scope.showindex = 33;
									if ($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0) {
										yTDdIds = item.id + ',';
									} else {
										yTBddIds = item.id + ',';
									}
								} else if (item.countryCode == 'DK') {//不需要判断是否带电 mode按带电传
									$scope.sanTaiNum++;
									$scope.showindex = 33;
									yTDdIds = item.id + ',';
									// if(commonSpFlag){
									// 	yTBddIds = item.id + ',';
									// }else{
									// 	yTDdIds = item.id + ',';
									// }
								}
								else if (item.countryCode == 'IT' || item.countryCode == 'SE' || item.countryCode == 'BE' || item.countryCode == 'NL' || item.countryCode == 'AT') {
									$scope.sanTaiNum++;
									$scope.showindex = 33;
									if(noEntryFlag){
										yTGbDdIds = item.id + ',';
									}else if(commonSpFlag){
										yTBddIds = item.id + ',';
									}else{
										yTDdIds = item.id + ',';
									}
								}
								else if (item.countryCode == 'KR') {
									$scope.sanTaiNum++;
									$scope.showindex = 33;
									yTYdsKrIds = item.id + ',';
								}
								else if (item.countryCode == 'IN' || item.country_code == 'FI' || item.country_code == 'DE') {
									$scope.sanTaiNum++;
									$scope.showindex = 33;
									if ($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0) {
										yTGbDdIds = item.id + ',';
									} else {
										yTGbBddIds = item.id + ',';
									}
								}
								else if (item.countryCode == 'GB') {
									$scope.sanTaiNum++;
									$scope.showindex = 33;
									stGBIds = item.id;
								}
								// else if (item.countryCode == 'GB' && item.orderweight < 2000) {
								// 	$scope.sanTaiNum++;
								// 	$scope.showindex = 33;
								// 	if(batteryOrElectoronicFlag){//是不是电池 电子 燕文484
								// 		yTGbDdIds = item.id;
								// 	}else{//燕文481
								// 		yTGbBddIds = item.id;
								// 	}
								// }
								else if (item.countryCode == 'BR') {
									$scope.sanTaiNum++;
									yTBrIds = item.id;
									$scope.showindex = 33;
								} else if (item.countryCode == 'ES') {
									$scope.sanTaiNum++;
									yTEsIds = item.id;
									$scope.showindex = 33;
								} else if (item.countryCode == 'TH' || item.countryCode == 'MY' || item.countryCode == "PH" || item.countryCode == 'VN' || item.countryCode == 'SG' || item.countryCode == 'TW' || item.countryCode == 'ID') {
									$scope.teDingGuoJiaCjpacketCount++;
									$scope.showindex = 33;
									$scope.sanTaiNum++;
								} else if (item.countryCode == 'ZA' && item.orderweight < 2000) {
									$scope.sanTaiNum++;
									if(isAllPuhuoFlag){
										$scope.showindex = 33;
										yTBddIds = item.id;
									}else if(isHanCiAndElectronicFlag){
										$scope.showindex = 33;
										yTDdIds = item.id;
									}else{
										$scope.qtwlordNum++;
										$scope.showindex = 4;
									}
								} else if (item.countryCode == 'FR') {
									$scope.sanTaiNum++;
									if(isAllPuhuoFlag){
										cjpacketFrPhIds = item.id;
										$scope.showindex = 33;
									}else if(isHaveDianOrBatteryFlag){
										cjpacketFrThIds = item.id;
										$scope.showindex = 33;
									}else{
										yTDdIds = item.id;
										$scope.showindex = 4;
									}
								} else if (item.countryCode == 'AE' && item.orderweight < 3000) {
									if(cjpacketAeFlag){
										$scope.sanTaiNum++;
										$scope.showindex = 33;
										cjpacketAeIds = item.id;
									}else{
										$scope.qtwlordNum++;
										$scope.showindex = 4;
									}
								} else {
									$scope.qtwlordNum++;
									$scope.showindex = 4;
								}
							}
						}
					}
					else if (item.logisticName == 'CJPacket-Supplier') {
						if (item.countryCode == 'TH' || item.countryCode == 'VN') {
							$scope.teDingGuoJiaCjpacketCount++;
							$scope.showindex = 33;
							$scope.sanTaiNum++;
						} else {
							$scope.qtwlordNum++;
							$scope.showindex = 4;
						}
					}
					else if (item.logisticName == 'PostNL') {
						$scope.postNlCount++;
						$scope.showindex = 43;
					}
					else if (item.logisticName == 'CJCOD') {
						$scope.cjCodNum++;
						$scope.showindex = 44;
					}
					else if (item.logisticName == 'CJPacket-Sea Sensitive') {
						$scope.cjpacketSeaSenNum++;
						$scope.showindex = 49;
						if(item.orderweight < 453){
							cjpacketSeaLightIds = item.id;
						}else{
							cjpacketSeaHeavyIds = item.id;
						}
					}
					else if (item.logisticName == 'CJPacket-Tha') {
						$scope.cjpacketThaNum++;
						$scope.showindex = 48;
					}
					else if (item.logisticName == 'CJPacket-Sea' || item.logisticName == 'CJPacket Sea') {
						$scope.cjpacketSeaNum++;
						$scope.showindex = 50;
					}
					else {
						$scope.qtwlordNum++;
						$scope.showindex = 4;
					}
				}

			}


			$scope.getCompanyCode = function(){
				$scope.companyCode=$scope.companyValue?$scope.companyValue.split("#")[0]:""
				//console.log($scope.companyCode)
				if($scope.companyCode){
					erp.getFun2("oldLogistics/LcCompanyAccount/list?channelCode="+$scope.companyCode,function(data){						
						const res = data.data
						if(res.code==200){
							if(Array.isArray(res.data)){
								$scope.acountList=res.data
							}
						}
					})
				}
			}
			function checkAccout(){
				// if($scope.acountList && !$scope.choseAcount){
				// 	layer.msg('您还未选择账号，请您选择账号后重试');
				// 	return false;
				// }
				if($scope.choseAcount){
					const updata={
						logisticsModeName:item.logisticName,
						logisticsChannelName:$scope.companyCode,
						companyAccountId:$scope.choseAcount,
						orderIds:$scope.oneordId,
					}
					console.log(updata)
					erp.postFun2('oldLogistics/LcCompanyOrderRecord/save', updata, function (data) {
						console.log(data)
					})
				}
				return true;
			}


			$scope.oneisydFlag = true;//单独操作生成运单号的弹框
			$scope.cjCodFun = function (stu) {
				if ($('.oneqd-sel44').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel44').val();
				updata.enName = 'CJCOD';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.cjpacketSea = function (stu) {
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
				erp.postFun('processOrder/handleOrder/initKerryLogisticsModel', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
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
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.ylColumbiaFun = function (stu) {//易联哥伦比亚专线
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
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
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
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.ylPeruFun = function (stu) {//易联
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
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
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
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.bjEpacketFun = function (stu) {
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "BEUBH#BJ cosmetics epacket";
				updata.enName = 'BJ cosmetics epacket';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					// if (data.data.result > 0) {
					let timer = scydAnimationFun()
					var ids = {};
					ids.ids = $scope.oneordId;
					ids.loginName = erpLoginName;
					if (stu == 1) {
						ids.auto = 'n';
					}
					creatTrackFun(ids, timer)
					// }
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.sfcBrazilLineFun = function (stu) {
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "LAEXP#SFC Brazil line";
				updata.enName = 'SFC Brazil line';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					let timer = scydAnimationFun()
					var ids = {};
					ids.ids = $scope.oneordId;
					ids.loginName = erpLoginName;
					if (stu == 1) {
						ids.auto = 'n';
					}
					creatTrackFun(ids, timer)
					// }
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.dgEpacketFun = function (stu) {
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "DGEUBA#DG Epacket";
				updata.enName = 'DG Epacket';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					let timer = scydAnimationFun()
					var ids = {};
					ids.ids = $scope.oneordId;
					ids.loginName = erpLoginName;
					if (stu == 1) {
						ids.auto = 'n';
					}
					creatTrackFun(ids, timer)
					// }
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.cjpacketThaFun = function (stu) {
				if ($('.oneqd-sel48').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel48').val();
				updata.enName = 'CJPacket-Tha';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.cjpacketSeaFun = function (stu) {
				if ($('.oneqd-sel50').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel50').val();
				updata.enName = 'CJPacket Sea';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
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
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {
					if (data.data.code == 200) {
						$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids, timer)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.hkDhlFun = function (stu) {
				if ($('.oneqd-sel34').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel34').val();
				updata.enName = 'DHL HongKong';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.dhlDeFun = function(stu){
				if ($scope.dhlDeNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn46').hasClass('btn-active1')) {
					return;
				}
				let stCsArr = [];
				let cjpacketIds = '';
				if (dhlDeIds != '') {
					stCsArr.push(stCsFun(dhlDeIds, 'DHLDE', '德国dhl国内'))
					cjpacketIds += dhlDeIds;
				}
				if (dhlOtherIds != '') {
					stCsArr.push(stCsFun(dhlOtherIds, 'DHLIN', '德国dhl国际'))
					cjpacketIds += dhlOtherIds;
				}
				erp.load();
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'DHL DE';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {

					console.log(data)
					if (data.data.code == 200) {
						$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids, timer)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.deutschePostFun = function(stu){
				if ($scope.deutschePostNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn47').hasClass('btn-active1')) {
					return;
				}
				let stCsArr = [];
				let cjpacketIds = '';
				if (deutschePostDeIds != '') {
					stCsArr.push(stCsFun(deutschePostDeIds, 'DEPOST', '德国邮政国内'))
					cjpacketIds += deutschePostDeIds;
				}
				if (deutschePostOtherIds != '') {
					stCsArr.push(stCsFun(deutschePostOtherIds, 'DEPOSTIN', '德国邮政国际'))
					cjpacketIds += deutschePostOtherIds;
				}
				erp.load();
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'Deutsche Post';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {

					console.log(data)
					if (data.data.code == 200) {
						$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids, timer)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.haiJinSTYtFun = function(stu){
				if ($scope.haiJinCjpacketNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn45').hasClass('btn-active1')) {
					return;
				}
				var whereTarget;
				if ($('.oneqd-sel45').val() == '请选择') {
					layer.msg('请选择仓库');
					return;
				} else if ($('.oneqd-sel45').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.oneqd-sel45').val() == '义乌') {
					whereTarget = 'YW'
				}
				let stCsArr = [];
				let cjpacketIds = '';
				if (haiJinCjpacketIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(haiJinCjpacketIds, '481', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(haiJinCjpacketIds, '481', '深圳燕文专线追踪小包'))
					cjpacketIds += haiJinCjpacketIds;
				}
				if (haiJinBatteryIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(haiJinBatteryIds, '484', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(haiJinBatteryIds, '484', '深圳燕文专线追踪小包'))
					cjpacketIds += haiJinBatteryIds;
				}
				if(sTItIds!=''){
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTItIds, 'ITEXP', '义乌三态意大利专线')) : stCsArr.push(stCsFun(sTItIds, 'ITEXP', '深圳三态意大利专线'))
					cjpacketIds += sTItIds;
				}
				erp.load();
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'CJPacket';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {

					console.log(data)
					if (data.data.code == 200) {
						$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
						let timer = scydAnimationFun()
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
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids, timer)
					}
				}, function (data) {
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
				if (sTAuIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTAuIds, 'STEXPTH', '义乌三态物流澳洲专线')) : stCsArr.push(stCsFun(sTAuIds, 'STEXPTH', '深圳三态物流澳洲专线'))
					cjpacketIds += sTAuIds;
				}
				if (sTCaIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTCaIds, 'STEXPTH', '义乌三态物流加拿大专线')) : stCsArr.push(stCsFun(sTCaIds, 'STEXPTH', '深圳三态物流加拿大专线'))
					cjpacketIds += sTCaIds;
				}
				if (sTUsDdIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTUsDdIds, 'GP', '美国联邮通挂号带电')) : stCsArr.push(stCsFun(sTUsDdIds, 'GP', '美国联邮通挂号带电'))
					cjpacketIds += sTUsDdIds;
				}
				if (sTUsBddIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTUsBddIds, 'QC', '美国联邮通挂号普货')) : stCsArr.push(stCsFun(sTUsBddIds, 'QC', '美国联邮通挂号普货'))
					cjpacketIds += sTUsBddIds;
				}
				if (sTDeZxIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTDeZxIds, 'STEXPTH', '义乌三态快邮德国小包挂号')) : stCsArr.push(stCsFun(sTDeZxIds, 'STEXPTH', '深圳三态快邮德国小包挂号'))
					cjpacketIds += sTDeZxIds;
				}
				if (sTDeThIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTDeThIds, 'DEEXPLS', '义乌三态物流德国专线特惠')) : stCsArr.push(stCsFun(sTDeThIds, 'DEEXPLS', '深圳三态物流德国专线特惠'))
					cjpacketIds += sTDeThIds;
				}
				if (sTMxIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTMxIds, 'MXEXP', '义乌三态物流墨西哥专线')) : stCsArr.push(stCsFun(sTMxIds, 'MXEXP', '深圳三态物流墨西哥专线'))
					cjpacketIds += sTMxIds;
				}
				if (yTBddIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTBddIds, 'YW-THPHR', '义乌云途专线全球挂号')) : stCsArr.push(stCsFun(yTBddIds, 'SZ-THPHR', '深圳云途专线全球挂号'))
					cjpacketIds += yTBddIds;
				}
				if (yTDdIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTDdIds, 'YW-THZXR', '义乌云途专线全球挂号')) : stCsArr.push(stCsFun(yTDdIds, 'SZ-THZXR', '深圳云途专线全球挂号'))
					cjpacketIds += yTDdIds;
				}
				if (yTGbDdIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTGbDdIds, '484', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(yTGbDdIds, '484', '深圳燕文专线追踪小包'))
					cjpacketIds += yTGbDdIds;
				}
				if (yTGbBddIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTGbBddIds, '481', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(yTGbBddIds, '481', '深圳燕文专线追踪小包'))
					cjpacketIds += yTGbBddIds;
				}
				if (yTBrIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTBrIds, 'BRZX', '义乌壹电商巴西专线')) : stCsArr.push(stCsFun(yTBrIds, 'BRZX', '深圳壹电商巴西专线'))
					cjpacketIds += yTBrIds;
				}
				if (yTYdsKrIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTYdsKrIds, 'KRZX', '义乌壹电商韩国专线')) : stCsArr.push(stCsFun(yTYdsKrIds, 'KRZX', '深圳壹电商韩国专线'))
					cjpacketIds += yTYdsKrIds;
				}
				if (yTEsIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTEsIds, 'ESZX', '义乌壹电商西班牙专线')) : stCsArr.push(stCsFun(yTEsIds, 'ESZX', '深圳壹电商西班牙专线'))
					cjpacketIds += yTEsIds;
				}
				if (stGBIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(stGBIds, 'STEXPTH', '义乌三态英国经济专线')) : stCsArr.push(stCsFun(stGBIds, 'STEXPTH', '深圳三态英国经济专线'))
					cjpacketIds += stGBIds;
				}
				if (cjpacketCazxIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(cjpacketCazxIds, 'JNDZX', '义乌加拿大专线')) : stCsArr.push(stCsFun(cjpacketCazxIds, 'JNDZX', '深圳加拿大专线'))
					cjpacketIds += cjpacketCazxIds;
				}
				if (cjpacketFrPhIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(cjpacketFrPhIds, 'PX', '义乌4PX联邮通Y优先普货')) : stCsArr.push(stCsFun(cjpacketFrPhIds, 'PX', '深圳4PX联邮通Y优先普货'))
					cjpacketIds += cjpacketFrPhIds;
				}
				if (cjpacketFrThIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(cjpacketFrThIds, 'PY', '义乌4PX联邮通优先带电')) : stCsArr.push(stCsFun(cjpacketFrThIds, 'PY', '深圳4PX联邮通优先带电'))
					cjpacketIds += cjpacketFrThIds;
				}
				if (cjpacketAeIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(cjpacketAeIds, 'BLKRCJNL836', '义乌阿联酋专线')) : stCsArr.push(stCsFun(cjpacketAeIds, 'BLKRCJNL836', '深圳阿联酋专线'))
					cjpacketIds += cjpacketAeIds;
				}
				erp.load();
				if ($scope.teDingGuoJiaCjpacketCount > 0) {
					var updata = {};
					updata.ids = $scope.oneordId;
					erp.postFun('processOrder/handleOrder/initKerryLogisticsModel', JSON.stringify(updata), function (data) {
						console.log(data)
						if (data.data.code == 200) {
							$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
							let timer = scydAnimationFun()
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
							if (stu == 1) {
								ids.auto = 'n';
							}
							creatTrackFun(ids, timer)
						}
					}, function (data) {
						layer.closeAll("loading")
					})
				} else {
					var updata = {};
					updata.list = stCsArr;
					updata.enName = 'CJPacket';
					updata.loginName = erpLoginName;
					erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {

						console.log(data)
						if (data.data.code == 200) {
							$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
							let timer = scydAnimationFun()
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
							if (stu == 1) {
								ids.auto = 'n';
							}
							creatTrackFun(ids, timer)
						}
					}, function (data) {
						layer.closeAll("loading")
					})
				}
			}
			$scope.cjPacketCsFun = function (stu) {//usps+ 传送订单
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.upMode = 'y';
				updata.transferType = $scope.transferCjpacketType;
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
							erp.postFun2('refreshUspsOrderId.json', JSON.stringify(freshJson), function (data) {
								console.log(data)
							}, function (data) {
								console.log(data)
							})
						}, function (data) {
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.cjPacketFun = function (stu) {
				erp.load();
				$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
				var ids = {};
				ids.ids = $scope.oneordId;
				ids.loginName = erpLoginName;
				if (stu == 1) {
					ids.auto = 'n';
				}
				creatTrackFun(ids)
			}
			$scope.yanWenFun26 = function (stu) {//南风顺丰
				if ($scope.yanWenNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				// if ($('.qd-onesel26').val() == '请选择') {
				// 	layer.msg('请选择物流渠道');
				// 	return;
				// }
				if (!$scope.whereYanWen) {
					layer.msg('请选择地区')
					return
				}
				if ($('.scyd-btn26').hasClass('btn-active1')) {
					return;
				}

				let stCsArr = [];
				let cjpacketIds = '';
				if (yanWenCommonIds != '') {
					$scope.whereYanWen == 'yiWu' ? stCsArr.push(stCsFun(yanWenCommonIds, '481', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(yanWenCommonIds, '481', '深圳燕文专线追踪小包'))
					cjpacketIds += yanWenCommonIds;
				}
				if (yanWenBrttryIds != '') {
					$scope.whereYanWen == 'yiWu' ? stCsArr.push(stCsFun(yanWenBrttryIds, '484', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(yanWenBrttryIds, '484', '深圳燕文专线追踪小包'))
					cjpacketIds += yanWenBrttryIds;
				}
				erp.load();
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'YanWen';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {

					console.log(data)
					if (data.data.code == 200) {
						$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
						let timer = scydAnimationFun()
						var diQu = '';
						if ($scope.whereYanWen == 'shenZhen') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						ids.shenzhen = diQu;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids, timer)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.cjpacketSeaSenFun = function (stu) {//南风顺丰
				if ($scope.cjpacketSeaSenNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn49').hasClass('btn-active1')) {
					return;
				}

				let stCsArr = [];
				let cjpacketIds = '';
				if (cjpacketSeaLightIds != '') {
					stCsArr.push(stCsFun(cjpacketSeaLightIds, 'HHOLYIF1100', '美国海运经济专线'))
					cjpacketIds += cjpacketSeaLightIds;
				}
				if (cjpacketSeaHeavyIds != '') {
					stCsArr.push(stCsFun(cjpacketSeaHeavyIds, 'MIXXINB1346', '美国海运经济专线'))
					cjpacketIds += cjpacketSeaHeavyIds;
				}
				erp.load();
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'CJPacket-Sea Sensitive';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {
					if (data.data.code == 200) {
						$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids, timer)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.postNlFun = function (stu) {//南风顺丰
				if ($scope.postNlCount <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-onesel43').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}				
				if ($('.scyd-btn43').hasClass('btn-active1')) {
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-onesel43').val();
				updata.enName = '美国专线';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.selNfOrTtFun = function (stu) {//南风顺丰
				if ($scope.nfOrTtNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-onesel17').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn17').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-sel17').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.nfsfFun = function (stu) {//南风顺丰
				if ($('.qd-onesel15').val() == '') {
					layer.msg('请选择物流渠道')
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-onesel15').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.ttsfFun = function (stu) {//泰腾顺丰
				if ($('.qd-onesel16').val() == '') {
					layer.msg('请选择物流渠道')
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-onesel16').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.ddepackFun = function (stu) {//带电E邮宝
				if ($('.oneqd-sel1').val() == '') {
					layer.msg('请选择物流渠道')
					return;
				}
        		if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel1').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.bddepackFun = function (stu) {//不带电E邮宝
				if ($('.oneqd-sel2').val() == '') {
					layer.msg('请选择物流渠道')
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel2').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun23 = function (stu) {//带电dhl
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "DHLXB#DHL eCommerce";
				updata.enName = 'DHL eCommerce';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.dhlddFun = function (stu) {//带电dhl
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "CT02#DHL带电";
				updata.enName = 'DHL';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.dhlbddFun = function (stu) {//不带电dhl
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "CT01#DHL不带电";
				updata.enName = 'DHL';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.dhlGfBddFun = function (stu) {//官方不带电dhl
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "DHLGF#DHL不带电";
				updata.enName = 'DHL';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.dhlOfficialFun = function (stu) {//官方dhl
				if ($('.oneqd-sel20').val() == '') {
					layer.msg('请选择物流渠道')
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel20').val();
				updata.enName = 'DHL Official';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						// ids.shenzhen = diQu;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.hfmepackFun = function (stu) {//含粉末E邮宝
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "BEUBH#BJ cosmetics epacket";
				updata.enName = 'BJ cosmetics epacket';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.hcepackFun = function (stu) {//含磁E邮宝
				if ($('.oneqd-sel13').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel13').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.gzepackFun = function (stu) {//膏状E邮宝+
				if ($('.oneqd-sel9').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel9').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.uspsOneCsFun = function (stu) {//usps+ 传送订单
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.uspsOnezzhFun = function () {//usps+ 获取追踪号订单
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						erp.postFun2('getShipstationWaybillNumber.json', JSON.stringify(ids), function (data) {
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}

						}, function (data) {
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.uspsFun = function (stu) {//usps
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				// updata.logisticsName = $('.oneqd-sel4').val();
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						erp.postFun2('createTrackNumber.json', JSON.stringify(ids), function (data) {
							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = result.sess;//存储成功的个数
							$scope.error = result.error;//存储失败的个数

						}, function (data) {
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.oneqtfsFun = function (stu) {//其它物流方式

				erp.load();
				$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
				var ids = {};
				ids.ids = $scope.oneordId;
				ids.loginName = erpLoginName;
				if (stu == 1) {
					ids.auto = 'n';
				}
				creatTrackFun(ids)
			}

			$scope.ddyzxbFun = function (stu) {//带电邮政小包
				if ($('.oneqd-sel5').val() == '请选择') {
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel5').val();
				updata.enName = 'China Post Registered Air Mail';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.bdyzxbFun = function (stu) {//不带电邮政小包
				if ($('.oneqd-sel6').val() == '') {
					layer.msg('请选择物流渠道')
					return;
				}
				if(!checkAccout()) return //检查是否有多账号
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel6').val();
				updata.enName = 'China Post Registered Air Mail';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.uspsPlusFun = function (stu) {//usps+ 传送订单
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'USPS+';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
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
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {

					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						erp.postFun2('getShipstationWaybillNumber.json', JSON.stringify(ids), function (data) {

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = 0;//存储成功的个数
							$scope.error = 0;//存储失败的个数
							for (var i = 0; i < result.length; i++) {
								$scope.sess += result[i].sess;
								$scope.error += result[i].error;
							}
						}, function (data) {
							layer.closeAll("loading")
						})
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.uspsPlusscydFun = function (stu) {//usps+生成运单号
				erp.load()
				var ids = {};
				ids.ids = $scope.oneordId;
				if (stu == 1) {
					ids.auto = 'n';
				}
				erp.postFun2('createTrackNumber.json', JSON.stringify(ids), function (data) {
					$scope.onesuccscydnumflag = true;
					layer.closeAll("loading")
					var result = data.data;
					$scope.sess = result.sess;//存储成功的个数
					$scope.error = result.error;//存储失败的个数

				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.ytFun = function (stu) {//带电E邮宝
				if ($('.oneqd-sel10').val() == '请选择') {
					layer.msg('请选择物流渠道')
					return;
				}
				var whereTarget;
				if ($('.oneqd-sel10').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				} else if ($('.oneqd-sel10').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.oneqd-sel10').val() == '义乌') {
					whereTarget = 'YW'
				}
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = whereTarget;
				updata.enName = 'yuntu';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {

					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.code == 200) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {

					layer.closeAll("loading")
				})
			}
		}
		function scydAnimationFun(){
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
			return timer
		}
		//单独生成运单号的关闭按钮
		$scope.oneisydCloseFun = function () {
			$scope.oneisydFlag = false;
			$scope.sess = 0;//存储成功的个数
			$scope.error = 0;//存储失败的个数

			getOrdList();
		}
		//单独生成运单号成功失败弹框的关闭函数
		$scope.onesuccscydnumcloseFun = function () {
			$scope.onesuccscydnumflag = false;
		}
		//阻止冒泡
		$scope.stopFun = function (e) {
			e.stopPropagation();
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
      //   getOrdList()
      //   $scope.stockoutHandleFlag = false
			// }
			getOrdList()
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

		//单独同步至店铺
		$scope.onetbdpFlag = false;
		$scope.onetbdpcloseFun = function () {
			$scope.onetbdpFlag = false;
		}
		$scope.istbzdpFun = function (item) {
			$scope.onetbdpFlag = true;//打开询问框
			$scope.itemId = item.id;
			$scope.shoptype = item.storeName;//判断店铺类型
			idsAndTrack = item.id + ',' + item.trackingnumber + '|';
		}
		$scope.onetbdpSureFun = function () {
			$scope.onetbdpFlag = false;//关闭询问框
			// var shopIds = '';//存储店铺id
			// var excelIds = '';//存储excel 的id
			var upData = {};
			if ($scope.shoptype == "Excel Imported") {
				upData.excelId = $scope.itemId;
			} else {
				upData.shopId = $scope.itemId;
			}
			upData.orderTrackingNumber = idsAndTrack;
			erp.postFun('app/order/fulfilOrder', JSON.stringify(upData), function (data) {
				console.log(data)
				$scope.tbdpTipFlag = false;//关闭同步时间较长的提示框
				if (data.data.result) {
					layer.msg('同步成功')
					getOrdList()
				} else {
					layer.closeAll("loading")
					layer.msg('同步失败')
				}

			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			},{layer:true})
			let newJson = {};
			newJson.ids = [$scope.itemId];
			erp.postFun('processOrder/queryOrder/batchUpdateOrder', JSON.stringify(newJson), function (data) {
				// console.log(data)
			}, function (data) {
				console.log(data)
			})
		}
		//批量修改物流的弹窗
		erp.postFun('app/order/getAllLogistics', {}, function (data) {
			$scope.powerJob = data.data.power;
			$scope.wlListArr = data.data.list;
		}, function (data) {
			console.log(data)
		})
		var selIds = '';
		$scope.changeWLFun = function () {
			selIds = checkOrdIds();
			if (!selIds) {
				layer.msg('请选择订单')
				return;
			} else {
				$scope.chengeWlFlag = true;
			}
		}
		$scope.sureChangeWlFun = function () {
			if ($scope.changeWlName) {
				selIds = selIds.split(',')
				selIds.pop()
				var chageData = {};
				chageData.ids = selIds;
				chageData.name = $scope.changeWlName;
				erp.postFun('processOrder/handleOrder/updateOrderLogisticInfo', JSON.stringify(chageData), function (data) {
					console.log(data)
					$scope.chengeWlFlag = false;
					if (data.data.code == 200) {
						getOrdList()
						layer.msg('修改成功')
					} else {
						layer.msg('修改失败')
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				},{layer:true})
			}
		}
		$scope.changeoneordWLFun = function () {
			erp.postFun('app/order/getWay', '', function (data) {
				// alert(66666)
				console.log(data)
				$scope.wlfsList = data.data;
				console.log($scope.wlfsList)
			}, function () {
				console.log('物流获取失败')
			})
			$scope.wlChangeFlag = true;
			// $scope.selfun(selfir);
		}

		//第一个选择框的切换
		$scope.wlChangeFlag = false;
		var isopenFlag = 0;
		$scope.epacketArr = [];
		$scope.epacketFlag = false;
		$scope.zgyzArr = [];
		$scope.zgyzFlag = false;
		var xgwldata = '';//存储选中订单的商品属性
		$scope.selfun = function (selfir) {
			if (selfir == "ePacket") {
				for (var i = 0; i < $scope.wlfsList.length; i++) {
					if ($scope.wlfsList[i].name == "ePacket") {
						$scope.epacketArr = $scope.wlfsList[i].value;
						$scope.epacketFlag = true;
					}
				}
				// $scope.selfir = $scope.epacketArr[0].value;
				console.log($scope.epacketArr)
			} else if (selfir == "zgyz") {
				for (var i = 0; i < $scope.wlfsList.length; i++) {
					if ($scope.wlfsList[i].name == "zgyz") {
						$scope.zgyzArr = $scope.wlfsList[i].value;
						$scope.zgyzFlag = true;
					}
				}
				console.log($scope.zgyzArr)
				// $scope.selfir = $scope.zgyzArr[0].value;
			} else {
				$scope.epacketArr = '';
				$scope.zgyzArr = '';
			}
		}

		//关闭弹窗
		$scope.closewltcFun = function () {
			$scope.wlChangeFlag = false;
		}
		//epack转燕文
		$scope.epack2yanwenFun = function () {
			var epaUpIds = {};
			epaUpIds.ids = epack2ywIds;
			console.log(epack2ywIds)
			erp.postFun('processOrder/handleOrder/updateLogisticYanWen', JSON.stringify(epaUpIds), function (data) {
				console.log(data)
				$scope.undeclareList = data.data.undeclare;
				console.log($scope.undeclareList)
				$scope.undeclareLength = $scope.undeclareList.length;
				if (data.data.code == 200) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		//转顺丰国际
		$scope.toSFGJFun = function () {
			var sfgjUpIds = {};
			sfgjUpIds.ids = toSFGJIds;
			sfgjUpIds.type = 'sfe+';
			console.log(toSFGJIds)
			// return;
			erp.postFun('processOrder/handleOrder/updateLogisticSFEE', JSON.stringify(sfgjUpIds), function (data) {
				console.log(data)
				if (data.data.code == 200) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.toEpacketFun = function () {
			var sfgjUpIds = {};
			sfgjUpIds.ids = toEpacketIds;
			sfgjUpIds.type = 'cjpacket';
			console.log(toEpacketIds)
			erp.postFun('processOrder/handleOrder/updateLogisticSFEE', JSON.stringify(sfgjUpIds), function (data) {
				console.log(data)
				if (data.data.code == 200) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		//转顺丰特惠 宝来顺丰
		$scope.toSFTHFun = function () {
			var sfgjUpIds = {};
			sfgjUpIds.ids = toSFTHIds;
			sfgjUpIds.type = 'sfee';
			console.log(toSFTHIds)
			erp.postFun('processOrder/handleOrder/updateLogisticSFEE', JSON.stringify(sfgjUpIds), function (data) {
				console.log(data)
				if (data.data.code == 200) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		//转南风顺丰
		$scope.toSFNFFun = function () {
			var sfgjUpIds = {};
			sfgjUpIds.ids = toSFNFIds;
			sfgjUpIds.type = 'sfe';
			erp.postFun('processOrder/handleOrder/updateLogisticSFEE', JSON.stringify(sfgjUpIds), function (data) {
				console.log(data)
				if (data.data.code == 200) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		//dhl转巴林dhl
		$scope.dhl2Blfun = function () {
			var dhlUpIds = {};
			dhlUpIds.ids = dhl2BldhlIds;
			console.log(dhl2BldhlIds)
			// return;
			erp.postFun('processOrder/handleOrder/updateLogisticDHL', JSON.stringify(dhlUpIds), function (data) {
				console.log(data)
				if (data.data.code == 200) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.epack2LiBangFun = function () {
			var dhlUpIds = {};
			dhlUpIds.ids = epack2LiBangIds;
			erp.postFun('processOrder/handleOrder/updateLogisticFedEx', JSON.stringify(dhlUpIds), function (data) {
				console.log(data)
				if (data.data.code == 200) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		//usps转usps+
		$scope.usps2Fun = function () {
			var uspsUpIds = {};
			uspsUpIds.ids = usps2uspsPlusIds;
			console.log(usps2uspsPlusIds)
			// return;
			erp.postFun('processOrder/handleOrder/updateLogistic', JSON.stringify(uspsUpIds), function (data) {
				console.log(data)
				if (data.data.code == 200) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.toThCodFun = function () {//转cjcod
			let stCsArr = [];
			stCsArr.push(stCsFun(toThCoeIds, 'COD', 'CJCOD'))
			var updata = {};
			updata.list = stCsArr;
			updata.enName = 'CJPacket';
			updata.loginName = erpLoginName;
			erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {
				console.log(data)
				if (data.data.code == 200) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.usps2DHLXiaoBaoFun = function () {
			var uspsUpIds = {};
			uspsUpIds.ids = usps2DhlXiaoBaoIds;
			uspsUpIds.status = 2;
			erp.postFun('processOrder/handleOrder/updateLogistic', JSON.stringify(uspsUpIds), function (data) {
				console.log(data)
				if (data.data.code == 200) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		//关闭弹框的函数
		function closeAllTk() {
			$scope.usps2PlusNum = 0;
			$scope.epack2yanwen = 0;
			$scope.toSFGJNum = 0;
			$scope.toSFTHNum = 0;
			$scope.toSFNFNum = 0;
			$scope.dhl2Bldhl = 0;
			$scope.epack2LianbangNum = 0;
			$scope.toDhlXiaoBaoNum = 0;
			$scope.toThCoeNum = 0;
			$scope.cjpacket2epacketNum = 0;
			$scope.oneisydFlag = false;//关闭单个生成的弹框
			$scope.isydCloseFun();
		}
		//点击数字查看
		$scope.cjToEpacketNumFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('uspsIds', toEpacketIds)
			window.open('#/erp-czi-ord')
			closeAllTk()
		}
		$scope.uspsNumFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('uspsIds', usps2uspsPlusIds)
			window.open('#/erp-czi-ord')
			closeAllTk()
		}
		$scope.epackNumFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('epackIds', epack2ywIds)
			window.open('#/erp-czi-ord')
			closeAllTk()
		}
		$scope.thCodNumFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('epackIds', toThCoeIds)
			window.open('#/erp-czi-ord')
			closeAllTk()
		}
		$scope.dhl2BlNumFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('epackIds', dhl2BldhlIds)
			window.open('#/erp-czi-ord')
			closeAllTk()
		}
		$scope.epack2LianbangNumFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('epackIds', epack2LiBangIds)
			window.open('#/erp-czi-ord')
			closeAllTk()
		}
		$scope.sfgjNumFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('epackIds', toSFGJIds)
			window.open('#/erp-czi-ord')
			closeAllTk()
		}
		$scope.sfthNumFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('epackIds', toSFTHIds)
			window.open('#/erp-czi-ord')
			closeAllTk()
		}
		$scope.sfnfNumFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('epackIds', toSFNFIds)
			window.open('#/erp-czi-ord')
			closeAllTk()
		}
		$scope.dhlXiaoBaoNumFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('epackIds', usps2DhlXiaoBaoIds)
			window.open('#/erp-czi-ord')
			closeAllTk()
		}

		$('.scyd-box').mouseenter(function (event) {
			$(this).children('.scyd-ul-list').show()
		});
		$('.scyd-box').mouseleave(function (event) {
			$('.scyd-ul-list').hide()
		});
		var zszgfStuArr = [];
		$scope.zdszgfFun = function (num, stu) {
			console.log(num, stu)
			$scope.epackSzGfNum += num;
			zszgfStuArr.push(stu)
			if (stu == 1) {
				$scope.ddepackNum = 0;
				$('.scyd-btn1').addClass('btn-active');
			}
			if (stu == 2) {
				$scope.bdepackNum = 0;
				$('.scyd-btn2').addClass('btn-active');
			}
			if (stu == 3) {
				$scope.hcepackNum = 0;
				$('.scyd-btn13').addClass('btn-active');
			}
			if (stu == 4) {
				$scope.hfmepackNum = 0;
				$('.scyd-btn18').addClass('btn-active');
			}
			if (stu == 5) {
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
		//询问运单号的弹框  批量生成运单号
		$scope.isydFlag = false;
		var usps2uspsPlusIds = '';//usps转usps+
		var epack2ywIds = '';//epack转燕文
		var toSFGJIds = '';//转顺丰国际
		var toSFTHIds = '', toEpacketIds = '';//转顺丰特惠
		var toSFNFIds = '';//转顺丰南风
		var dhl2BldhlIds = '';//转巴林dhl
		var epack2LiBangIds = '';//转联邦
		var usps2DhlXiaoBaoIds = '';//转DHL eCommerce
		var toThCoeIds = '';
		var zuspsDianIds = '';//转usps带电
		var zuspsGaoIds = '';//转usps膏体
		var zuspsYeIds = '';//转usps液体
		var zuspsJianIds = '';//转usps尖锐液体
		var zuspsMinGanIds = '';//转usps敏感 多属性
		//批量生成运单号的函数
		$scope.cjPacketVal = 'init';
		$scope.cjPacketDianVal = 'init';
		$scope.cjPacketGaoVal = 'init';
		$scope.cjPacketJianVal = 'init';
		$scope.cjPacketYeVal = 'init';
		$scope.cjPacketMinGanVal = 'init';
		$scope.bzxCjPacketFun = function (sx) {
			console.log(sx)
			if (sx == 'COMMON') {
				$scope.cjPacketVal = 'n';
				$scope.isZCjpacketFlag = false;
				$scope.usZhwlNum = 0;
			} else if (sx == 'dian') {
				$scope.cjPacketDianVal = 'n';
				$scope.isZCjpacketDianFlag = false;
				$scope.zuspsDianNum = 0;
			} else if (sx == 'gao') {
				$scope.cjPacketGaoVal = 'n';
				$scope.isZCjpacketGaoFlag = false;
				$scope.zuspsGaoNum = 0;
			} else if (sx == 'jian') {
				$scope.cjPacketJianVal = 'n';
				$scope.isZCjpacketJianFlag = false;
				$scope.zuspsJianNum = 0;
			} else if (sx == 'ye') {
				$scope.cjPacketYeVal = 'n';
				$scope.isZCjpacketYeFlag = false;
				$scope.zuspsYeNum = 0;
			} else if (sx == 'minGan') {
				$scope.cjPacketMinGanVal = 'n';
				$scope.isZCjpacketMinGanFlag = false;
				$scope.zuspsMinGanNum = 0;
			}
			$scope.isydFun()
		}
		$scope.zXcjPacketFun = function (sx) {
			if (sx == 'COMMON') {
				$scope.cjPacketVal = 'y';
				$scope.isZCjpacketFlag = false;
				$scope.usZhwlNum = 0;
			} else if (sx == 'dian') {
				$scope.cjPacketDianVal = 'y';
				$scope.isZCjpacketDianFlag = false;
				$scope.zuspsDianNum = 0;
			} else if (sx == 'gao') {
				$scope.cjPacketGaoVal = 'y';
				$scope.isZCjpacketGaoFlag = false;
				$scope.zuspsGaoNum = 0;
			} else if (sx == 'jian') {
				$scope.cjPacketJianVal = 'y';
				$scope.isZCjpacketJianFlag = false;
				$scope.zuspsJianNum = 0;
			} else if (sx == 'ye') {
				$scope.cjPacketYeVal = 'y';
				$scope.isZCjpacketYeFlag = false;
				$scope.zuspsYeNum = 0;
			} else if (sx == 'minGan') {
				$scope.cjPacketMinGanVal = 'y';
				$scope.isZCjpacketMinGanFlag = false;
				$scope.zuspsMinGanNum = 0;
			}
			$scope.isydFun()
		}
		function sxBooleanFun(arr, arr1) {
			let shuXingFlag = true;
			let sxLen = arr.length;
			let arr1Len = arr1.length
			outer:
			for (var j = 0; j < sxLen; j++) {
				inter:
				for (let k = 0; k < arr1Len; k++) {
					if (arr[j] == arr1[k]) {
						shuXingFlag = false;
						break outer;
					} else {
						shuXingFlag = true;
					}
				}
			}
			return shuXingFlag;
		}
		function isCommonFlagFun(arr) {
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] != 'COMMON') {
					return false;
				}
				if (j == arr.length - 1) {
					return true;
				}
			}
		}
		function isCommonAndThinFlagFun(arr) {
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] != 'COMMON'&&arr[j] != 'THIN') {
					return false;
				}
				if (j == arr.length - 1) {
					return true;
				}
			}
		}
		function isHanGaoSpFun(arr) {
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == 'HAVE_CREAM') {
					return true;
				}
				if (j == arr.length - 1) {
					return false;
				}
			}
		}
		function isHanDianFun(arr) {
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == 'HAVE_ELECTRICITY' || arr[j] == 'ELECTRONIC' || arr[j] == 'BATTERY' || arr[j] == 'IS_ELECTRICITY') {
					return true;
				}
				if (j == arr.length - 1) {
					return false;
				}
			}
		}
		function isCommonAndElectronicFun(arr){
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] != 'COMMON' && arr[j] != 'THIN' && arr[j] != 'ELECTRONIC') {
					return false;
				}
				if (j == arr.length - 1) {
					return true;
				}
			}
		}
		function isNoEntry(arr) {//海关禁售
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == 'NO_ENTRY') {
					return true;
				}
				if (j == arr.length - 1) {
					return false;
				}
			}
		}
		function isHaveBatteryFun(arr){
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == 'BATTERY') {
					return true;
				}
				if (j == arr.length - 1) {
					return false;
				}
			}
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
		function isDianOrCommonFun(arr){
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == 'BATTERY'||arr[j] == 'ELECTRONIC') {
					return true;
				}
				if (j == arr.length - 1) {
					return false;
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
		function isHanYeSpFun(arr) {
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == 'HAVE_LIQUID') {
					return true;
				}
				if (j == arr.length - 1) {
					return false;
				}
			}
		}
		function isHanCiSpFun(arr) {
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == 'HAVE_MAGNETISM') {
					return true;
				}
				if (j == arr.length - 1) {
					return false;
				}
			}
		}
		function isHanCiAndElectronicFun(arr) {
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] == 'HAVE_MAGNETISM'||arr[j] == 'BATTERY'||arr[j] == 'ELECTRONIC') {
					return true;
				}
				if (j == arr.length - 1) {
					return false;
				}
			}
		}
		function cjpacketAeFun(arr){
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] != 'COMMON' && arr[j] != 'THIN' && arr[j] != 'FLAT' && arr[j] != 'OVERSIZE' && arr[j] != 'ELECTRONIC' && arr[j] != 'BATTERY' && arr[j] != 'HAVE_CREAM' && arr[j] != 'HAVE_LIQUID' && arr[j] != 'NO_ENTRY') {
					return false;
				}
				if (j == arr.length - 1) {
					return true;
				}
			}
		}
		function isAllPuhuoFun(arr) {
			for (var j = 0; j < arr.length; j++) {
				if (arr[j] != 'COMMON' && arr[j] != 'THIN' && arr[j] != 'FLAT' && arr[j] != 'OVERSIZE') {
					return false;
				}
				if (j == arr.length - 1) {
					return true;
				}
			}
		}
		function sxBooleanFun1(arr, COMMON, BATTERY, ELECTRONIC, OVERSIZE, on) {
			// console.log(arr,COMMON,BATTERY,ELECTRONIC,OVERSIZE,on)
			let shuXingFlag = false;
			let sxLen = arr.length;
			for (var j = 0; j < sxLen; j++) {
				if (arr[j] == COMMON || arr[j] == BATTERY || arr[j] == ELECTRONIC || arr[j] == OVERSIZE || arr[j] == on) {
					shuXingFlag = true;
					break;
				} else {
					shuXingFlag = false;
				}
			}
			return shuXingFlag;
		}
		function stCsFun(id, logisticsmode, logisticsModeName) {
			let obj = {};
			obj.ids = id;
			obj.logisticsMode = logisticsmode;
			obj.logisticsModeName = logisticsModeName;
			return obj;
		}
		function isOneSxFun(domArr, shuXing) {
			var strSpSxList = '';
			if (domArr) {
				for (var i = 0, len = domArr.length; i < len; i++) {
					strSpSxList += domArr[i].property + ',';
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
		$scope.noHghLinkFun = function () {
			var uspsTime = new Date().getTime();
			localStorage.setItem('uspsTime', uspsTime)
			localStorage.setItem('epackIds', $scope.dhlHghNullIds)
			window.open('#/erp-czi-ord')
		}
		$scope.usZhwlNum = 0;
		$scope.zuspsJianNum = 0;
		$scope.zuspsDianNum = 0;
		$scope.zuspsYeNum = 0;
		$scope.zuspsGaoNum = 0;
		$scope.zuspsMinGanNum = 0;
		
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
			usps2uspsPlusIds = '';//usps转usps+
			epack2ywIds = '';
			toSFGJIds = '';
			toSFTHIds = '';
			toSFNFIds = '';
			toEpacketIds = ''
			dhl2BldhlIds = '';//转巴林dhl
			epack2LiBangIds = '';
			usps2DhlXiaoBaoIds = '';
			var ddyzxbIds = '';//带电邮政小包的id
			var bdyzxbIds = '';//不带电邮政小包的id
			var qtwlIds = '';//
			var uspsPlusIds = '';//usps+的id
			var ytIds = '';//云途的id
			var dhlddIds = '';//带电dhl
			var dhlnotdIds = '';//不带电dhl
			var dhlGfIds = '';//dhl官方转
			var dhlOfficialIds = '';//dhl官方
			var dhlXiaoBaoIds = '';//DHL eCommerce
			var nfSfIds = '';
			var ttSfIds = '';
			var nfOrTtIds = '';
			var usZhwlIds = '';//usps综合物流
			var yanWenIds = '';//燕文物流
			$scope.yanWenNum = 0;//
			var jewelIds = '';
			var jewelPlusIds = '';
			var jewelFlatIds = '';
			$scope.jewelNum = 0;
			$scope.jewelPlusNum = 0;
			$scope.jewelFlatNum = 0;
			var hkDhlIds = '';
			$scope.hkDhlNum = 0;
			var dgEpacketIds = '';
			$scope.dgEpacketNum = 0;
			var selectednum = 0;
			$scope.bHepacketNum = 0;
			var bHeapcketIds = '';
			$scope.sfcBrazilLineNum = 0;
			var sfcBrazilLineIds = '';
			$scope.ylColumbiaNum = 0;
			var ylColumbiaIds = '';
			$scope.ylPeruNum = 0;
			var ylPeruIds = '';
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
			$scope.dhlGfNum = 0;//dhl官方数量转
			$scope.dhlOfficialNum = 0;//dhl官方
			$scope.toDhlXiaoBaoNum = 0;//符合转DHL eCommerce
			$scope.dhlXiaoBaoNum = 0;//DHL eCommerce的数量
			$scope.epack2yanwen = 0;//符合转燕文的epack
			$scope.toSFGJNum = 0;//符合转顺丰国际
			$scope.toSFTHNum = 0;//符合转顺丰特惠
			$scope.toSFNFNum = 0;//符合转南风顺丰
			$scope.cjpacket2epacketNum = 0;//转epacket
			$scope.toThCoeNum = 0;//
			$scope.postNlCount = 0;
			var cjCodIds = '';
			$scope.cjCodNum = 0;
			var postNlIds = '';
			toThCoeIds = '';
			zuspsJianIds = '';
			zuspsDianIds = '';
			zuspsYeIds = '';
			zuspsGaoIds = '';
			zuspsMinGanIds = '';
			$scope.hanCiCount = 0;//含磁订单数量
			$scope.nfOrTtNum = 0;
			$scope.nfSfNum = 0;//南风物流个数
			$scope.ttSfNum = 0;//泰腾物流个数
			$scope.dhl2Bldhl = 0;//转巴林的个数
			$scope.epack2LianbangNum = 0;//转联邦的个数
			$scope.cjpacketSeaExpCount = 0;//嘉里空运
			var cjpacketSeaExpIds = '';
			$scope.sanTaiArr = [];
			$scope.sanTaiNum = 0;
			$scope.haiJinCjpacketNum = 0;
			$scope.dhlDeNum = 0;//德国dhl
			$scope.deutschePostNum = 0;//德国邮政
			$scope.cjpacketSeaSenNum = 0;//美国海运经济专线
			$scope.cjpacketThaNum = 0;
			$scope.cjpacketSeaNum = 0;
			$scope.euroOrdinarNum = 0;//cjpacket欧洲物流
			var sTAuIds = '',
				sTCaIds = '',
				sTDeZxIds = '',
				sTDeThIds = '',
				sTUsIds = '',
				sTUsDdIds = '',
				sTUsBddIds = '',
				sTMxIds = '',
				yTFrIds = '',
				yTAtIds = '',
				yTSeIds = '',
				yTGbDdIds = '',
				yTGbBddIds = '',
				yTBrIds = '',
				yTEsIds = '',
				yTBddIds = '',
				yTDdIds = '',
				yTYdsKrIds = '',
				teDingGuoJiaCjpacketIds = '',
				haiJinCjpacketIds = '',
				sTItIds = '',
				haiJinBatteryIds = '',
				yanWenBattryIds = '',
				dhlDeIds = '',
				dhlOtherIds = '',
				deutschePostDeIds = '',
				deutschePostOtherIds = '',
				cjpacketSeaHeavyIds = '',
				cjpacketSeaLightIds = '',
				cjpacketThaIds = '',
				cjpacketSeaIds = '',
				cjpacketCazxIds = '',
				cjpacketFrThIds = '',
				cjpacketFrPhIds = '',
				cjpacketAeIds = '',
				euroOrdinarGbIds = '',
				euroOrdinarDeIds = '',
				euroOrdinarFrIds = '',
				euroOrdinarFrDdIds = '',
				euroOrdinarBeIds = '',
				euroOrdinarItIds = '',
				stGBIds = '';
			$scope.teDingGuoJiaCjpacketCount = 0;
			var spCountNum;
			var isTestOrderId = ""; //是否为test测试账号订单
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].order.checkFlag) {
					if ($scope.erporderList[i].order.merchantnNumber == '0d98c91b3ed64b0a9ced9bdef3bb8c32') {
						isTestOrderId = $scope.erporderList[i].order[i].id;
					}
				}
			}
			if (isTestOrderId) {
				layer.msg('所选订单包含测试账号订单，订单号为：' + isTestOrderId)
				return;
			}

			console.log($scope.cjPacketVal,$scope.cjPacketDianVal,$scope.cjPacketGaoVal,$scope.cjPacketVal == 'init'
			&& $scope.cjPacketDianVal == 'init'
			&& $scope.cjPacketGaoVal == 'init'
			&& $scope.cjPacketJianVal == 'init'
			&& $scope.cjPacketYeVal == 'init'
			&& $scope.cjPacketMinGanVal == 'init')

			if ($scope.cjPacketVal == 'init'
				&& $scope.cjPacketDianVal == 'init'
				&& $scope.cjPacketGaoVal == 'init'
				&& $scope.cjPacketJianVal == 'init'
				&& $scope.cjPacketYeVal == 'init'
				&& $scope.cjPacketMinGanVal == 'init') {
				for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
					console.log($scope.erporderList[i].order.checkFlag,len,i)
					if ($scope.erporderList[i].order.checkFlag) {
						spCountNum = 0;
						var wlName = $scope.erporderList[i].order.logisticName;
						var ordCountryCode = $scope.erporderList[i].order.countryCode;
						var ordWeight = $scope.erporderList[i].order.orderweight;
						selectednum++;
						let spbtLen = $scope.erporderList[i].product.length;//有几个变体
						let itemOrdId = $scope.erporderList[i].order.id;
						var strSpSxList1 = '';
						let itemCustomerId = $scope.erporderList[i].order.merchantnNumber;//客户id
						if ($scope.erporderList[i].product) {
							for (let k = 0, klen = $scope.erporderList[i].product.length; k < klen; k++) {
								strSpSxList1 += $scope.erporderList[i].product[k].property + ',';
							}
						}
						var sxArr1 = strSpSxList1.split(',');
						sxArr1.pop();
						console.log(sxArr1)
						let batteryOrElectoronicFlag = isBatteryOrELECTRONICFun(sxArr1)
						let isDianOrCommonFlag = isDianOrCommonFun(sxArr1)
						let commonSpFlag = isCommonFlagFun(sxArr1);
						let commonAndThinFlag = isCommonAndThinFlagFun(sxArr1)
						for (let iNum = 0; iNum < sxArr1.length; iNum++) {
							if (sxArr1[iNum] == 'HAVE_MAGNETISM') {
								$scope.hanCiCount++;
								break
							}
						}
						console.log(ordWeight, ':ordWeight', ordCountryCode, 'ordCountryCode', commonSpFlag, "commonSpFlag", wlName, "wlName",commonAndThinFlag,'commonAndThinFlag')
						// ordWeight > 285 && 
						if (ordCountryCode == 'US' && ($scope.store == 0 || $scope.store == 1 || $scope.store == 5)) {
							if (commonAndThinFlag && !~commonCjpacketLogArr.indexOf(wlName)) {
								$scope.usZhwlNum++;
								usZhwlIds += itemOrdId + ',';
								continue
							}
						}
						// 取消转属性的提示
						if (ordCountryCode == 'US' && itemCustomerId == '82ff8b76491a4c1a8328342f2c34a19b' && ($scope.store == 0) && !~electronicCjpacketLogArr.indexOf(wlName)){
							if((batteryOrElectoronicFlag && spbtLen == 1) || (isDianOrCommonFlag &&  spbtLen > 1)){
								$scope.zuspsDianNum++;
								continue
							}
						}
						// 	// if (sxArr1.length == 1) {//单属性
						// 		// if (sxArr1[0] == 'EDGE') {//尖锐
						// 		// 	$scope.zuspsJianNum++;
						// 		// 	continue
						// 		// } 
								
						// 		// else if (sxArr1[0] == 'HAVE_LIQUID') {//含液体
						// 		// 	$scope.zuspsYeNum++;
						// 		// 	continue
						// 		// } else if (sxArr1[0] == 'HAVE_CREAM') {//含膏体
						// 		// 	$scope.zuspsGaoNum++;
						// 		// 	continue
						// 		// }
						// 	// } else {//敏感件
						// 	// 	$scope.zuspsMinGanNum++;
						// 	// 	console.log($scope.zuspsMinGanNum)
						// 	// 	continue
						// 	// }
						// }
					}
				}
			}

			$timeout(function () {
				if ($scope.usZhwlNum > 0) {//普货
					$scope.isZCjpacketFlag = true;
				}
				if ($scope.zuspsDianNum > 0) {//电
					$scope.isZCjpacketDianFlag = true;
				}
				if ($scope.zuspsGaoNum > 0) {//膏
					$scope.isZCjpacketGaoFlag = true;
				}
				if ($scope.zuspsJianNum > 0) {//尖锐
					$scope.isZCjpacketJianFlag = true;
				}
				if ($scope.zuspsYeNum > 0) {//液体
					$scope.isZCjpacketYeFlag = true;
				}
				if ($scope.zuspsMinGanNum > 0) {//敏感
					$scope.isZCjpacketMinGanFlag = true;
				}
				if ($scope.hanCiCount > 0) {
					$scope.hanCiTipFlag = true;
				} else {
					$scope.hanCiTipFlag = false;
				}
				if ($scope.usZhwlNum == 0 && $scope.zuspsDianNum == 0 && $scope.zuspsGaoNum == 0 && $scope.zuspsJianNum == 0 && $scope.zuspsYeNum == 0 && $scope.zuspsMinGanNum == 0) {
					for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
						if ($scope.erporderList[i].order.checkFlag) {
							spCountNum = 0;
							var wlName = $scope.erporderList[i].order.logisticName;
							var ordCountryCode = $scope.erporderList[i].order.countryCode;
							var ordWeight = $scope.erporderList[i].order.orderweight;
							let cusUserId = $scope.erporderList[i].order.merchantnNumber;
							var logisticModeName = $scope.erporderList[i].order.logisticsmode || 'notfind';
							selectednum++;
							let spbtLen = $scope.erporderList[i].product.length;//有几个变体
							let itemOrdId = $scope.erporderList[i].order.id;
							let itemCustomerId = $scope.erporderList[i].order.merchantnNumber;//客户id
							var strSpSxList1 = '';
							if ($scope.erporderList[i].product) {
								for (let k = 0, klen = $scope.erporderList[i].product.length; k < klen; k++) {
									strSpSxList1 += $scope.erporderList[i].product[k].property + ',';
								}
							}
							// console.log(itemOrdId)
							var sxArr1 = strSpSxList1.split(',');
							sxArr1.pop();
							let commonSpFlag = isCommonFlagFun(sxArr1);
							let isHanGaoSpFlag = isHanGaoSpFun(sxArr1)
							let isHanYeSpFlag = isHanYeSpFun(sxArr1)
							let isNoEntryFlag = isNoEntry(sxArr1)
							let isHanCiSpFlag = isHanCiSpFun(sxArr1)
							let isHanDianFlag = isHanDianFun(sxArr1)
							let commonAndThinFlag = isCommonAndThinFlagFun(sxArr1)
							let isHaveBatteryFlag = isHaveBatteryFun(sxArr1)
							let isCommonAndElectronicFlag = isCommonAndElectronicFun(sxArr1)
							let batteryOrElectoronicFlag = isBatteryOrELECTRONICFun(sxArr1)
							let isHaveDianOrBatteryFlag = isHaveDianOrBatteryFun(sxArr1)
							let isDianOrCommonFlag = isDianOrCommonFun(sxArr1);
							let isAllPuhuoFlag = isAllPuhuoFun(sxArr1);
							let isHanCiAndElectronicFlag = isHanCiAndElectronicFun(sxArr1);
							let cjpacketAeFlag = cjpacketAeFun(sxArr1);
							//ordWeight > 285 &&  取消重量限制
							if (ordCountryCode == 'US' && ($scope.store == 0 || $scope.store == 1 || $scope.store == 5) && $scope.cjPacketVal == 'y') {
								console.log(usZhwlIds)
								if (commonAndThinFlag && !~commonCjpacketLogArr.indexOf(wlName)) {
									// console.log('优先级最高')
									$scope.usZhwlNum++;
									usZhwlIds += itemOrdId + ',';
									console.log(usZhwlIds)
									continue
								}
							}
							if ($scope.cjPacketDianVal == 'y' && itemCustomerId == '82ff8b76491a4c1a8328342f2c34a19b' && ordCountryCode == 'US' && ($scope.store == 0) && !~electronicCjpacketLogArr.indexOf(wlName)) {
								if((batteryOrElectoronicFlag && spbtLen == 1) || (isDianOrCommonFlag &&  spbtLen > 1)){
									$scope.zuspsDianNum++;
									zuspsDianIds += itemOrdId + ',';
									continue
								}
							}
							// if (ordWeight > 285 && spbtLen == 1 && ordCountryCode == 'US' && ($scope.store == 0 || $scope.store == 1)) {//单品
							// 	if (sxArr1.length == 1) {//单属性
							// 		console.log($scope.cjPacketJianVal)
							// 		if (sxArr1[0] == 'EDGE' && $scope.cjPacketJianVal == 'y') {//尖锐
							// 			$scope.zuspsJianNum++;
							// 			zuspsJianIds += itemOrdId + ',';
							// 			console.log($scope.zuspsJianNum)
							// 			continue
							// 		} else if ((sxArr1[0] == 'ELECTRONIC' || sxArr1[0] == 'BATTERY' || sxArr1[0] == 'BATTERY') && $scope.cjPacketDianVal == 'y') {//带电
							// 			$scope.zuspsDianNum++;
							// 			zuspsDianIds += itemOrdId + ',';
							// 			console.log($scope.zuspsDianNum)
							// 			continue
							// 		} else if (sxArr1[0] == 'HAVE_LIQUID' && $scope.cjPacketYeVal == 'y') {//含液体
							// 			$scope.zuspsYeNum++;
							// 			zuspsYeIds += itemOrdId + ',';
							// 			console.log($scope.zuspsYeNum)
							// 			continue
							// 		} else if (sxArr1[0] == 'HAVE_CREAM' && $scope.cjPacketGaoVal == 'y') {//含膏体
							// 			$scope.zuspsGaoNum++;
							// 			zuspsGaoIds += itemOrdId + ',';
							// 			console.log($scope.zuspsGaoNum)
							// 			continue
							// 		}
							// 	} else {//敏感件 混合属性
							// 		if ($scope.cjPacketMinGanVal == 'y') {
							// 			$scope.zuspsMinGanNum++;
							// 			zuspsMinGanIds += itemOrdId + ',';
							// 			console.log(zuspsMinGanIds)
							// 			continue
							// 		}
							// 	}
							// }
							if (ordCountryCode == 'TH' && logisticModeName != 'COD' && (cusUserId == 'b7234b0c6d6e456cb261bbcd142c6d42' || cusUserId == 'abbbda4d662340e1876076ad0accd5fe')) {
								console.log('符合转coe泰国')
								$scope.toThCoeNum++;
								toThCoeIds += itemOrdId + ',';
							}
							if (logisticModeName == 'COD' && ordCountryCode == 'TH' && (cusUserId == 'b7234b0c6d6e456cb261bbcd142c6d42' || cusUserId == 'abbbda4d662340e1876076ad0accd5fe') && $scope.store == 4) {
								$scope.qtwlordNum++;
								qtwlIds += itemOrdId + ',';
								continue
							}
							if (wlName == 'ePacket' && ordCountryCode == 'US' && ordWeight <= 1000) {
								var isCommonFlag1 = false;
								for (var j = 0; j < sxArr1.length; j++) {
									if (sxArr1[j] != 'COMMON' && sxArr1[j] != 'ELECTRONIC' && sxArr1[j] != 'BATTERY') {
										isCommonFlag1 = false;
										break;
									} else {
										isCommonFlag1 = true;
									}
								}
								if (isCommonFlag1) {
									$scope.toSFGJNum++;
									toSFGJIds += itemOrdId + ',';
								}
							}
							if (wlName == 'ePacket' && ordCountryCode == 'US' && ordWeight > 1600) {
								// console.log('符合转顺丰特惠')
								if (commonSpFlag) {
									$scope.toSFTHNum++;
									toSFTHIds += itemOrdId + ',';
								}
							}
							//关闭转Epacket
							// if (wlName == 'CJPacket' && ordCountryCode == 'US' && ordWeight <= 2000) {
							// 	if (commonSpFlag) {
							// 		$scope.cjpacket2epacketNum++;
							// 		toEpacketIds += itemOrdId + ',';
							// 	}
							// }

							if (wlName == 'ePacket') {
								if (ordCountryCode == 'GB' || ordCountryCode == 'DE' || ordCountryCode == 'IN' || ordCountryCode == 'ES' || ordCountryCode == 'BE' || ordCountryCode == 'DK') {
									if (0 <= ordWeight <= 2000) {
										if (commonSpFlag) {
											$scope.epack2yanwen++;
											epack2ywIds += itemOrdId + ',';
										}
									}
								}
								let itemSpFlag;
								for (let j = 0, jlen = sxArr1.length; j < jlen; j++) {
									if (sxArr1[j] == 'HAVE_ELECTRICITY' || sxArr1[j] == 'ELECTRONIC' || sxArr1[j] == 'BATTERY' || sxArr1[j] == 'IS_ELECTRICITY') {
										itemSpFlag = true;
									} else {
										itemSpFlag = false;
										break
									}
								}
								if (itemSpFlag) {
									$scope.ddepackNum++;
									ddepackIds += itemOrdId + ',';
									// console.log('判断带电的条件')
								} else if (isHanGaoSpFlag || isHanYeSpFlag) {
									if (isOneSxFun($scope.erporderList[i].product, 'HAVE_CREAM') || isHanYeSpFlag) {
										$scope.epackGzNum++;
										gzepackIds += itemOrdId + ',';
									} else {//跟含磁的走相同
										$scope.hcepackNum++;
										hcepackIds += itemOrdId + ',';
									}
									// console.log('判断e邮宝膏状的条件')
								} else if (isHanCiSpFlag) {
									$scope.hcepackNum++;
									hcepackIds += itemOrdId + ',';
									// console.log('判断e邮宝含磁的条件')
								}
								else {
									$scope.bdepackNum++;
									bdepackIds += itemOrdId + ',';
									// console.log('判断e邮宝不带电的条件')
								}
								// console.log($sptdObj.children('.sp-sx-span').text())
							} else if(wlName == 'ePacket-Yiwu' || wlName == 'ePacket Yiwu'){
								$scope.bdepackNum++;
								bdepackIds += itemOrdId + ',';
							} else if (wlName == 'CJ Normal Express') {
								if (1000 < ordWeight && ordWeight <= 1600) {
									$scope.nfSfNum++;
									nfSfIds += itemOrdId + ',';
								} else if (ordWeight > 1600 || ordWeight <= 1000) {
									$scope.ttSfNum++;
									ttSfIds += itemOrdId + ',';
								}
							} else if (wlName == 'USPS') {
								$scope.uspsNum++;
								uspsIds += itemOrdId + ',';
								usps2uspsPlusIds += itemOrdId + ',';
								//关闭转DHL eCommerce
								// let itemSpFlag;
								// for (let j = 0, jlen = sxArr1.length; j < jlen; j++) {
								// 	if (sxArr1[j] != 'HAVE_ELECTRICITY' && sxArr1[j] != 'ELECTRONIC' && sxArr1[j] != 'BATTERY' && sxArr1[j] != 'IS_ELECTRICITY' && sxArr1[j] != 'HAVE_CREAM' && sxArr1[j] != 'HAVE_LIQUID') {
								// 		itemSpFlag = true;
								// 	} else {
								// 		itemSpFlag = false;
								// 		break
								// 	}
								// }
								// if (ordWeight <= 170 && itemSpFlag) {
								// 	usps2DhlXiaoBaoIds += itemOrdId + ',';
								// 	$scope.toDhlXiaoBaoNum++;
								// }
							} else if (wlName == 'China Post Registered Air Mail') {
								if (isHanDianFlag) {
									$scope.ddyzxbNum++;
									ddyzxbIds += itemOrdId + ',';
									// console.log('判断邮政小包带电的条件')
								} else {
									$scope.bdyzxbNum++;
									bdyzxbIds += itemOrdId + ',';
									// console.log('判断邮政小包不带电的条件')
								}
								// console.log('判断邮政小包物流的条件')
							} else if (wlName == 'USPS+') {
								$scope.uspsPlusNum++;
								uspsPlusIds += itemOrdId + ',';
								// console.log('判断USPS+物流的条件')
								// if (ordWeight <= 170 && !isHanDianFlag && !isHanGaoSpFlag && !isHanYeSpFlag) {
								// 	usps2DhlXiaoBaoIds += itemOrdId + ',';
								// 	$scope.toDhlXiaoBaoNum++;
								// }
							} else if (wlName == 'CJPacket SEA Express' || wlName == 'CJPacket JL Express') {
								$scope.cjpacketSeaExpCount++;
								cjpacketSeaExpIds += itemOrdId + ',';
								// console.log('嘉里空运')
							} else if (wlName.indexOf('YunExpress') >= 0) {
								$scope.ytNum++;
								ytIds += itemOrdId + ',';
								// console.log('判断云途物流的条件')
							} else if (wlName == 'DHL') {
								if (isHanDianFlag) {
									$scope.dhlddIds++;
									dhlddIds += itemOrdId + ',';
									// console.log('判断dhl带电的条件')
								} else {
									// $scope.dhlnotdIds++;
									// dhlnotdIds += itemOrdId + ',';
									if (ordWeight < 2000) {
										$scope.dhlGfNum++;
										dhlGfIds += itemOrdId + ',';
									} else {
										$scope.dhlnotdIds++;
										dhlnotdIds += itemOrdId + ',';
									}
								}
							} else if (wlName == 'DHL Official') {
								let hghIsNull = false;
								for (let k = 0, klen = $scope.erporderList[i].product.length; k < klen; k++) {
									if (!$scope.erporderList[i].product[k].entryCode) {
										hghIsNull = true;
										break;
									}
								}
								if (hghIsNull) {
									$scope.dhlHghNullNum++;
									$scope.dhlHghNullIds += itemOrdId + ',';
								} else {
									$scope.dhlOfficialNum++;
									dhlOfficialIds += itemOrdId + ',';
								}
								console.log($scope.dhlHghNullNum, $scope.dhlOfficialNum)
							} else if (wlName == 'DHL eCommerce' || wlName == 'DHL小包') {
								$scope.dhlXiaoBaoNum++;
								dhlXiaoBaoIds += itemOrdId + ',';
								console.log('DHL eCommerce')
							}
							else if (wlName == 'DHL HongKong') {
								$scope.hkDhlNum++;
								hkDhlIds += itemOrdId + ',';
							}
							else if (wlName == 'DHL DE') {
								$scope.dhlDeNum++;
								if(ordCountryCode == 'DE'){
									dhlDeIds += itemOrdId + ',';
								}else{
									dhlOtherIds += itemOrdId + ',';
								}
							}
							else if (wlName == 'Deutsche Post') {
								$scope.deutschePostNum++;
								if(ordCountryCode == 'DE'){
									deutschePostDeIds += itemOrdId + ',';
								}else{
									deutschePostOtherIds += itemOrdId + ',';
								}
							}
							else if (wlName == 'YanWen') {
								if ((commonSpFlag||isNoEntryFlag) && ordWeight < 2000) {//普货 海禁都走普货渠道
									yanWenIds += itemOrdId + ',';
									$scope.yanWenNum++;
								}else if((isHanDianFlag || isHanGaoSpFlag) && ordWeight < 2000){
									$scope.yanWenNum++;
									yanWenBattryIds += itemOrdId + ',';
								}else {
									$scope.qtwlordNum++;
									qtwlIds += itemOrdId + ',';
								}
							} else if (wlName == 'Jewel Shipping') {
								$scope.jewelNum++;
								jewelIds += itemOrdId + ',';
							} else if (wlName == 'Jewel Shipping+') {
								$scope.jewelPlusNum++;
								jewelPlusIds += itemOrdId + ',';
							} else if (wlName == 'Jewel Shipping Flat' || wlName == 'Jewel Shipping Flat+') {
								$scope.jewelFlatNum++;
								jewelFlatIds += itemOrdId + ',';
							}
							else if (wlName == 'DG Epacket') {
								$scope.dgEpacketNum++;
								dgEpacketIds += itemOrdId + ',';
							}
							else if (wlName == 'BJ cosmetics epacket') {
								$scope.bHepacketNum++;
								bHeapcketIds += itemOrdId + ',';
							}
							else if (wlName == 'SFC Brazil line') {
								$scope.sfcBrazilLineNum++;
								sfcBrazilLineIds += itemOrdId + ',';
							}
							else if (wlName == 'YL Columbia line') {
								$scope.ylColumbiaNum++;
								ylColumbiaIds += itemOrdId + ',';
							}
							else if (wlName == 'YL Peru line') {
								$scope.ylPeruNum++;
								ylPeruIds += itemOrdId + ',';
							}
							else if(wlName == 'CJPacket Euro Ordinary'){
								if(ordCountryCode == 'GB' || ordCountryCode == 'DE' || ordCountryCode == 'FR' || ordCountryCode == 'BE' || ordCountryCode == 'IT'){
									$scope.euroOrdinarNum++;
								}
								if(ordCountryCode == 'GB'){
									euroOrdinarGbIds += itemOrdId + ',';
								}else if(ordCountryCode == 'DE'){
									euroOrdinarDeIds += itemOrdId + ',';
								}else if(ordCountryCode == 'FR'){
									euroOrdinarFrIds += itemOrdId + ',';
								}else if(ordCountryCode == 'BE'){
									euroOrdinarBeIds += itemOrdId + ',';
								}else if(ordCountryCode == 'IT'){
									euroOrdinarItIds += itemOrdId + ',';
								}
							}
							else if (wlName == 'CJPacket') {
								if(isNoEntryFlag && ordCountryCode != 'CA'){
									console.log(isNoEntryFlag)
									$scope.haiJinCjpacketNum++;
									// if(ordCountryCode == 'IT'){
									// 	sTItIds += itemOrdId + ',';
									// }else{
									// 	if(isHaveBatteryFlag){//是不是电池
									// 		haiJinBatteryIds += itemOrdId + ',';
									// 	}else{
									// 		haiJinCjpacketIds += itemOrdId + ',';
									// 	}
									// }
									if(isHaveBatteryFlag){//是不是电池
										haiJinBatteryIds += itemOrdId + ',';
									}else{
										haiJinCjpacketIds += itemOrdId + ',';
									}
									continue
								}else{
									if(ordCountryCode == 'DE' && ordWeight >= 2000){
										$scope.sanTaiNum++;
										if(commonSpFlag){
											yTBddIds += itemOrdId + ',';//云途普货
										}else{
											yTDdIds += itemOrdId + ',';//云途带电
										}
										continue
									}else if(ordCountryCode == 'DE' && ordWeight < 2000){
										$scope.sanTaiNum++;
										if(commonSpFlag){
											yTGbBddIds += itemOrdId + ',';//燕文普货
										}else{
											yTGbDdIds += itemOrdId + ',';//燕文特货
										}
										continue
									}
								}
								// if(ordCountryCode == 'CA' && ordWeight < 2000){
								// 	$scope.haiJinCjpacketNum++;
								// 	if(isHaveBatteryFlag){//是不是电池 燕文484
								// 		haiJinBatteryIds += itemOrdId + ',';
								// 	}else{//燕文481
								// 		haiJinCjpacketIds += itemOrdId + ',';
								// 	}
								// 	continue
								// }
								if (ordCountryCode == 'AU') {
									//澳洲特惠
									$scope.sanTaiNum++;
									if(ordWeight < 2000){
										if(isHanCiSpFlag){
											yTDdIds += itemOrdId + ',';//云途带电
										}else{
											yTGbDdIds += itemOrdId + ',';//燕文特货
										}
									}else{
										// yTDdIds += itemOrdId + ',';//云途带电
										if(commonSpFlag){
											yTBddIds += itemOrdId + ',';//云途普货
										}else{
											yTDdIds += itemOrdId + ',';//云途带电
										}
									}
									// sTAuIds += itemOrdId + ',';
								} else if (ordCountryCode == 'CA') {
									$scope.sanTaiNum++;
									cjpacketCazxIds += itemOrdId + ',';//加拿大专线
								} 
								// else if (ordCountryCode == 'DE') {
								// 	// if(sxBooleanFun1(sxArr1,'','BATTERY','ELECTRONIC','','')){//是否是带电的
								// 	//德国专线
								// 	$scope.sanTaiNum++;
								// 	sTDeZxIds += itemOrdId + ',';
								// 	// }else {
								// 	// 	//德国专线特惠
								// 	// 	$scope.sanTaiNum++;
								// 	// 	sTDeThIds += itemOrdId + ',';
								// 	// }
								// } 
								else if (ordCountryCode == 'MX') {
									$scope.sanTaiNum++;
									sTMxIds += itemOrdId + ',';
								} else if (ordCountryCode == 'US') {
									$scope.sanTaiNum++;
									if(isHaveDianOrBatteryFlag){
										sTUsDdIds += itemOrdId + ',';
									}else{
										sTUsBddIds += itemOrdId + ',';
									}
								}
								else if (ordCountryCode == 'CH' || ordCountryCode == 'LU') {
									$scope.sanTaiNum++;
									// yTDdIds += itemOrdId + ',';
									if (isHanDianFlag) {
										yTDdIds += itemOrdId + ',';
									} else {
										yTBddIds += itemOrdId + ',';
									}
								} else if (ordCountryCode == 'DK') {//不需要判断是否带电 mode按带电传
									$scope.sanTaiNum++;
									yTDdIds += itemOrdId + ',';
									// if(commonSpFlag){
									// 	yTBddIds += itemOrdId + ',';
									// }else{
									// 	yTDdIds += itemOrdId + ',';
									// }
								}
								//NL 荷兰  SE 瑞典  AT 奥地利  BE 比利时
								else if(ordCountryCode == 'IT' || ordCountryCode == 'SE' || ordCountryCode == 'BE' || ordCountryCode == 'NL' || ordCountryCode == 'AT'){
									$scope.sanTaiNum++;
									if(isNoEntryFlag){
										yTGbDdIds += itemOrdId + ',';
									} else if(commonSpFlag){
										yTBddIds += itemOrdId + ',';
									}else{
										yTDdIds += itemOrdId + ',';
									}
								}
								else if (ordCountryCode == 'IN' || ordCountryCode == 'FI') {
									$scope.sanTaiNum++;
									if (isHanDianFlag&&!isCommonAndElectronicFlag) {
										yTGbDdIds += itemOrdId + ',';
									} else {
										yTGbBddIds += itemOrdId + ',';
									}
								}
								else if (ordCountryCode == 'GB') {
									$scope.sanTaiNum++;
									stGBIds += itemOrdId + ',';
								}
								else if (ordCountryCode == 'KR') {
									$scope.sanTaiNum++;
									yTYdsKrIds += itemOrdId + ',';
								}
								else if (ordCountryCode == 'BR') {
									$scope.sanTaiNum++;
									yTBrIds += itemOrdId + ',';
								} else if (ordCountryCode == 'ES') {
									$scope.sanTaiNum++;
									yTEsIds += itemOrdId + ',';
								}
								else if (ordCountryCode == 'TH' || ordCountryCode == 'MY' || ordCountryCode == "PH" || ordCountryCode == 'VN' || ordCountryCode == 'SG' || ordCountryCode == 'TW' || ordCountryCode == 'ID') {
									teDingGuoJiaCjpacketIds += itemOrdId + ',';
									$scope.teDingGuoJiaCjpacketCount++;
									$scope.sanTaiNum++;
								} else if (ordCountryCode == 'ZA' && ordWeight < 2000) {
									if(isAllPuhuoFlag){
										$scope.sanTaiNum++;
										yTBddIds += itemOrdId + ',';
									}else if(isHanCiAndElectronicFlag){
										yTDdIds += itemOrdId + ',';
										$scope.sanTaiNum++;
									}else{
										$scope.qtwlordNum++;
										qtwlIds += itemOrdId + ',';
									}
								} else if (ordCountryCode == 'FR') {
									$scope.sanTaiNum++;
									if(isAllPuhuoFlag){
										cjpacketFrPhIds += itemOrdId + ',';
									}else if(isHaveDianOrBatteryFlag){
										cjpacketFrThIds += itemOrdId + ',';
									}else{
										yTDdIds += itemOrdId + ',';
									}
								} else if (ordCountryCode == 'AE' && ordWeight < 3000) {
									if(cjpacketAeFlag){
										$scope.sanTaiNum++;
										cjpacketAeIds += itemOrdId + ',';
									}else{
										$scope.qtwlordNum++;
										qtwlIds += itemOrdId + ',';
									}
								} else {
									$scope.qtwlordNum++;
									qtwlIds += itemOrdId + ',';
								}
							}
							else if (wlName == 'CJPacket-Supplier') {
								if (ordCountryCode == 'TH' || ordCountryCode == 'VN') {
									teDingGuoJiaCjpacketIds += itemOrdId + ',';
									$scope.teDingGuoJiaCjpacketCount++;
									$scope.sanTaiNum++;
								} else {
									$scope.qtwlordNum++;
									qtwlIds += itemOrdId + ',';
								}
							}
							else if (wlName == 'PostNL') {
								postNlIds += itemOrdId + ',';
								$scope.postNlCount++;
							}
							else if (wlName == 'CJCOD') {
								cjCodIds += itemOrdId + ',';
								$scope.cjCodNum++;
							}
							else if (wlName == 'CJPacket-Sea Sensitive') {
								$scope.cjpacketSeaSenNum++;
								if(ordWeight < 453){
									cjpacketSeaLightIds += itemOrdId + ',';
								}else{
									cjpacketSeaHeavyIds += itemOrdId + ',';
								}
							}
							else if (wlName == 'CJPacket-Tha') {
								cjpacketThaIds += itemOrdId + ',';
								$scope.cjpacketThaNum++;
							}
							else if (wlName == 'CJPacket-Sea' || wlName == 'CJPacket Sea') {
								cjpacketSeaIds += itemOrdId + ',';
								$scope.cjpacketSeaNum++;
							}
							else {
								$scope.qtwlordNum++;
								qtwlIds += itemOrdId + ',';
								// console.log('判断其它物流的条件')
							}
						}
						// })
					}

					if (selectednum <= 0) {
						layer.msg('请先选择订单')
						return;
					} else {
						$scope.isydFlag = true;
					}
				}
			}, 20)

			//确定生成面单的按钮
			$scope.succscydnumflag = false;//生成运单成功多少
			$scope.zhnfDHLFun = function () {
				if ($scope.dhlGfNum > 0) {
					$scope.isReturnDhlFlag = true;
				} else {
					layer.msg('没有可以转回的订单')
				}
			}
			$scope.zhupspFun = function () {
				if ($scope.dhlXiaoBaoNum > 0) {
					$scope.isReturnUspsFlag = true;
				} else {
					layer.msg('没有可以转回的订单');
				}
			}
			$scope.zhnfSureFun = function () {
				$scope.dhlnotdIds += $scope.dhlGfNum;
				dhlnotdIds += dhlGfIds;
				$scope.dhlGfNum = 0;
				dhlGfIds = '';
				$scope.isReturnDhlFlag = false;
				$('.zhnf-btn').addClass('btn-active');
				$('.scyd-btn19').addClass('btn-active');
				$('.scyd-btn12').removeClass('btn-active');
			}
			$scope.zhUspsSureFun = function () {
				var uspsUpIds = {};
				uspsUpIds.ids = dhlXiaoBaoIds;
				console.log(uspsUpIds);
				erp.load();
				//uspsUpIds.status = 2;
				erp.postFun('processOrder/handleOrder/updateLogistic', JSON.stringify(uspsUpIds), function (data) {
					console.log(data);
					erp.closeLoad();
					if (data.data.code == 200) {
						layer.msg('修改成功');
						$scope.uspsPlusNum += $scope.dhlXiaoBaoNum;
						uspsPlusIds += dhlXiaoBaoIds;
						$scope.dhlXiaoBaoNum = 0;
						dhlXiaoBaoIds = '';
						$scope.isReturnUspsFlag = false;
						$('.zhnf-btn2').addClass('btn-active');
						$('.scyd-btn23').addClass('btn-active');
						$('.scyd-btn7').removeClass('btn-active');
						$('.scyd-btn14').removeClass('btn-active');
						$('.scyd-btn8').removeClass('btn-active');
					} else {
						layer.msg('修改失败')
					}
				}, function (data) {
					console.log(data);
					erp.closeLoad();
				})

			}		
			
			$scope.allCom = {}
			$scope.bulkAcount = {}
			$scope.bulkChoseAcount = {}

			$scope.allChangeCom = function(idx){
				const comCode=$scope.allCom[idx]?$scope.allCom[idx].split("#")[0]:"";
				if(comCode){
					erp.getFun2("oldLogistics/LcCompanyAccount/list?channelCode="+comCode,function(data){						
						const res = data.data
						if(res.code==200){
							if(Array.isArray(res.data)){
								$scope.bulkAcount[idx]=res.data
							}
						}
					})
				}
				console.log(comCode)
				console.log($scope.allCom)
				console.log($scope.bulkChoseAcount)
			}

			function bulkCheckAccout(idx,orderIds,name){
				console.log(name)
				// if($scope.bulkAcount[idx] && !$scope.bulkChoseAcount[idx]){
				// 	layer.msg('您还未选择账号，请您选择账号后重试');
				// 	return false;
				// }
				if($scope.bulkChoseAcount[idx]){
					const comCode=$scope.allCom[idx]?$scope.allCom[idx].split("#")[0]:"";
					const updata={
						logisticsModeName:name,
						logisticsChannelName:comCode,
						companyAccountId:$scope.bulkChoseAcount[idx],
						orderIds,
					}
					console.log(updata)
					erp.postFun2('oldLogistics/LcCompanyOrderRecord/save', updata, function (data) {
						console.log(data)
					})
				}
				return true;
			}


			$scope.enterscmdFun48 = function (stu) {//DHL eCommerce
				if ($scope.cjpacketThaNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn48').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel48').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
        if(!bulkCheckAccout(48,cjpacketThaIds,'CJPacket-Tha')) return
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = cjpacketThaIds;
				updata.logisticsName = $('.qd-sel48').val();
				updata.enName = 'CJPacket-Tha';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn48').addClass('btn-active1');
					let timer = scydAnimationFun()
					createWaybillNumberFun(cjpacketThaIds,stu,timer)
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun50 = function (stu) {//DHL eCommerce
				if ($scope.cjpacketSeaNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn50').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel50').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
        if(!bulkCheckAccout(50,cjpacketSeaIds,'CJPacket-Sea')) return
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = cjpacketSeaIds;
				updata.logisticsName = $('.qd-sel50').val();
				updata.enName = 'CJPacket Sea';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn50').addClass('btn-active1');
					let timer = scydAnimationFun()
					createWaybillNumberFun(cjpacketSeaIds,stu,timer)
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun44 = function (stu) {//美国
				if ($scope.cjCodNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn44').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel44').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
        if(!bulkCheckAccout(44,cjCodIds,'CJCOD')) return
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = cjCodIds;
				updata.logisticsName = $('.qd-sel44').val();
				updata.enName = 'CJCOD';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn44').addClass('btn-active1');
					let timer = scydAnimationFun()
					createWaybillNumberFun(cjCodIds,stu,timer)
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun43 = function (stu) {//美国
				if ($scope.postNlCount <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn43').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel43').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
        if(!bulkCheckAccout(43,postNlIds,'美国专线')) return
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = postNlIds;
				updata.logisticsName = $('.qd-sel43').val();
				updata.enName = '美国专线';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn43').addClass('btn-active1');
					console.log(data)
					let timer = scydAnimationFun()
					createWaybillNumberFun(postNlIds,stu,timer)
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun42 = function (stu) {//带电E邮宝生成运单号函数
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
				erp.postFun('processOrder/handleOrder/initKerryLogisticsModel', JSON.stringify(updata), function (data) {
					$('.scyd-btn42').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
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
						if (stu == 1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun40 = function (stu) {//带电E邮宝生成运单号函数
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
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn40').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						var diQu = '';
						if (whereTarget == 'SZ') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = ylColumbiaIds;
						ids.shenzhen = diQu;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun41 = function (stu) {
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
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn41').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						var diQu = '';
						if (whereTarget == 'SZ') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = ylPeruIds;
						ids.shenzhen = diQu;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun37 = function (stu) {//DHL eCommerce
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
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn37').addClass('btn-active1');
					let timer = scydAnimationFun()
					createWaybillNumberFun(dgEpacketIds,stu,timer)
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun38 = function (stu) {//DHL eCommerce
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
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn38').addClass('btn-active1');
					console.log(data)
					// if (data.data.code == 200) {
					let timer = scydAnimationFun()
					createWaybillNumberFun(bHeapcketIds,stu,timer)
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun39 = function (stu) {//DHL eCommerce
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
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn39').addClass('btn-active1');
					console.log(data)
					let timer = scydAnimationFun()
					createWaybillNumberFun(sfcBrazilLineIds,stu,timer)
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun34 = function (stu) {//DHL eCommerce
				if ($scope.hkDhlNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn34').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel34').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
        if(!bulkCheckAccout(34,hkDhlIds,'DHL HongKong')) return
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = hkDhlIds;
				updata.logisticsName = $('.qd-sel34').val();
				updata.enName = 'DHL HongKong';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn23').addClass('btn-active1');
					console.log(data)
					let timer = scydAnimationFun()
					createWaybillNumberFun(hkDhlIds,stu,timer)
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun33 = function (stu) {//三态
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
				if (sTAuIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTAuIds, 'STEXPTH', '义乌三态物流澳洲专线')) : stCsArr.push(stCsFun(sTAuIds, 'STEXPTH', '深圳三态物流澳洲专线'))
					cjpacketIds += sTAuIds;
				}
				if (sTCaIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTCaIds, 'STEXPTH', '义乌三态物流加拿大专线')) : stCsArr.push(stCsFun(sTCaIds, 'STEXPTH', '深圳三态物流加拿大专线'))
					cjpacketIds += sTCaIds;
				}
				if (sTUsDdIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTUsDdIds, 'GP', '美国联邮通挂号带电')) : stCsArr.push(stCsFun(sTUsDdIds, 'GP', '美国联邮通挂号带电'))
					cjpacketIds += sTUsDdIds;
				}
				if (sTUsBddIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTUsBddIds, 'QC', '美国联邮通挂号普货')) : stCsArr.push(stCsFun(sTUsBddIds, 'QC', '美国联邮通挂号普货'))
					cjpacketIds += sTUsBddIds;
				}
				if (sTDeZxIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTDeZxIds, 'STEXPTH', '义乌三态快邮德国小包挂号')) : stCsArr.push(stCsFun(sTDeZxIds, 'STEXPTH', '深圳三态快邮德国小包挂号'))
					cjpacketIds += sTDeZxIds;
				}
				if (sTDeThIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTDeThIds, 'DEEXPLS', '义乌三态物流德国专线特惠')) : stCsArr.push(stCsFun(sTDeThIds, 'DEEXPLS', '深圳三态物流德国专线特惠'))
					cjpacketIds += sTDeThIds;
				}
				if (sTMxIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTMxIds, 'MXEXP', '义乌三态物流墨西哥专线')) : stCsArr.push(stCsFun(sTMxIds, 'MXEXP', '深圳三态物流墨西哥专线'))
					cjpacketIds += sTMxIds;
				}
				if (yTBddIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTBddIds, 'YW-THPHR', '义乌云途专线全球挂号')) : stCsArr.push(stCsFun(yTBddIds, 'SZ-THPHR', '深圳云途专线全球挂号'))
					cjpacketIds += yTBddIds;
				}
				if (yTDdIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTDdIds, 'YW-THZXR', '义乌云途专线全球挂号')) : stCsArr.push(stCsFun(yTDdIds, 'SZ-THZXR', '深圳云途专线全球挂号'))
					cjpacketIds += yTDdIds;
				}
				if (yTGbDdIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTGbDdIds, '484', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(yTGbDdIds, '484', '深圳燕文专线追踪小包'))
					cjpacketIds += yTGbDdIds;
				}
				if (yTGbBddIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTGbBddIds, '481', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(yTGbBddIds, '481', '深圳燕文专线追踪小包'))
					cjpacketIds += yTGbBddIds;
				}
				if (yTBrIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTBrIds, 'BRZX', '义乌壹电商巴西专线')) : stCsArr.push(stCsFun(yTBrIds, 'BRZX', '深圳壹电商巴西专线'))
					cjpacketIds += yTBrIds;
				}
				if (yTYdsKrIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTYdsKrIds, 'KRZX', '义乌壹电商韩国专线')) : stCsArr.push(stCsFun(yTYdsKrIds, 'KRZX', '深圳壹电商韩国专线'))
					cjpacketIds += yTYdsKrIds;
				}
				if (yTEsIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(yTEsIds, 'ESZX', '义乌壹电商西班牙专线')) : stCsArr.push(stCsFun(yTEsIds, 'ESZX', '深圳壹电商西班牙专线'))
					cjpacketIds += yTEsIds;
				}
				if (stGBIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(stGBIds, 'STEXPTH', '义乌三态英国经济专线')) : stCsArr.push(stCsFun(stGBIds, 'STEXPTH', '深圳三态英国经济专线'))
					cjpacketIds += stGBIds;
				}
				if (cjpacketCazxIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(cjpacketCazxIds, 'JNDZX', '义乌加拿大专线')) : stCsArr.push(stCsFun(cjpacketCazxIds, 'JNDZX', '深圳加拿大专线'))
					cjpacketIds += cjpacketCazxIds;
				}
				if (cjpacketFrPhIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(cjpacketFrPhIds, 'PX', '义乌4PX联邮通Y优先普货')) : stCsArr.push(stCsFun(cjpacketFrPhIds, 'PX', '深圳4PX联邮通Y优先普货'))
					cjpacketIds += cjpacketFrPhIds;
				}
				if (cjpacketFrThIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(cjpacketFrThIds, 'PY', '义乌4PX联邮通优先带电')) : stCsArr.push(stCsFun(cjpacketFrThIds, 'PY', '深圳4PX联邮通优先带电'))
					cjpacketIds += cjpacketFrThIds;
				}
				if (cjpacketAeIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(cjpacketAeIds, 'BLKRCJNL836', '义乌阿联酋专线')) : stCsArr.push(stCsFun(cjpacketAeIds, 'BLKRCJNL836', '深圳阿联酋专线'))
					cjpacketIds += cjpacketAeIds;
				}
				erp.load();
				$scope.succscydnumflag = true;
				if (stCsArr.length > 0) {//有适合的cjpacket订单
					var updata = {};
					updata.list = stCsArr;
					updata.enName = 'CJPacket';
					updata.loginName = erpLoginName;
					console.log(JSON.stringify(updata))
					erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {
						$('.scyd-btn33').addClass('btn-active1');
						console.log(data)
						if (data.data.code == 200) {
							let timer = scydAnimationFun()
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
							if (stu == 1) {
								ids.auto = 'n';
							}
							console.log(JSON.stringify(ids))
							erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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

				if ($scope.teDingGuoJiaCjpacketCount > 0) {//有特定国家的cjpacekt订单
					var updata = {};
					updata.ids = teDingGuoJiaCjpacketIds;
					erp.postFun('processOrder/handleOrder/initKerryLogisticsModel', JSON.stringify(updata), function (data) {
						$('.scyd-btn42').addClass('btn-active1');
						console.log(data)
						if (data.data.code == 200) {
							let timer = scydAnimationFun()
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
							if (stu == 1) {
								ids.auto = 'n';
							}
							console.log(JSON.stringify(ids))
							erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun45 = function (stu) {//三态海禁
				if ($scope.haiJinCjpacketNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn45').hasClass('btn-active1')) {
					return;
				}
				var whereTarget;
				if ($('.qd-sel45').val() == '请选择') {
					layer.msg('请选择仓库');
					return;
				} else if ($('.qd-sel45').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.qd-sel45').val() == '义乌') {
					whereTarget = 'YW'
				}
				let stCsArr = [];
				let cjpacketIds = '';
				if (haiJinCjpacketIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(haiJinCjpacketIds, '481', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(haiJinCjpacketIds, '481', '深圳燕文专线追踪小包'))
					cjpacketIds += haiJinCjpacketIds;
				}
				if (haiJinBatteryIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(haiJinBatteryIds, '484', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(haiJinBatteryIds, '484', '深圳燕文专线追踪小包'))
					cjpacketIds += haiJinBatteryIds;
				}
				if (sTItIds != '') {
					whereTarget == 'YW' ? stCsArr.push(stCsFun(sTItIds, 'ITEXP', '义乌三态意大利专线')) : stCsArr.push(stCsFun(sTItIds, 'ITEXP', '深圳三态意大利专线'))
					cjpacketIds += sTItIds;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'CJPacket';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn45').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
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
						if (stu == 1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun46 = function (stu) {//德国DHL
				if ($scope.dhlDeNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn46').hasClass('btn-active1')) {
					return;
				}
				let stCsArr = [];
				let cjpacketIds = '';
				if (dhlDeIds != '') {
					stCsArr.push(stCsFun(dhlDeIds, 'DHLDE', '德国dhl国内'))
					cjpacketIds += dhlDeIds;
				}
				if (dhlOtherIds != '') {
					stCsArr.push(stCsFun(dhlOtherIds, 'DHLIN', '德国dhl国际'))
					cjpacketIds += dhlOtherIds;
				}
				
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'DHL DE';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn46').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun47 = function (stu) {//三态海禁
				if ($scope.deutschePostNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn47').hasClass('btn-active1')) {
					return;
				}
				let stCsArr = [];
				let cjpacketIds = '';
				if (deutschePostDeIds != '') {
					stCsArr.push(stCsFun(deutschePostDeIds, 'DEPOST', '德国邮政国内'))
					cjpacketIds += deutschePostDeIds;
				}
				if (deutschePostOtherIds != '') {
					stCsArr.push(stCsFun(deutschePostOtherIds, 'DEPOSTIN', '德国邮政国际'))
					cjpacketIds += deutschePostOtherIds;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'Deutsche Post';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn47').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun49 = function (stu) {//美国
				if ($scope.cjpacketSeaSenNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn49').hasClass('btn-active1')) {
					return;
				}

				let stCsArr = [];
				let cjpacketIds = '';
				if (cjpacketSeaLightIds != '') {
					stCsArr.push(stCsFun(cjpacketSeaLightIds, 'HHOLYIF1100', '美国海运经济专线'))
					cjpacketIds += cjpacketSeaLightIds;
				}
				if (cjpacketSeaHeavyIds != '') {
					stCsArr.push(stCsFun(cjpacketSeaHeavyIds, 'MIXXINB1346', '美国海运经济专线'))
					cjpacketIds += cjpacketSeaHeavyIds;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'CJPacket-Sea Sensitive';
				updata.loginName = erpLoginName;
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn49').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun51 = function (stu) {//三态海禁
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
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn51').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun26 = function (stu) {//美国
				if ($scope.yanWenNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn26').hasClass('btn-active1')) {
					return;
				}
				if (!$scope.whereYanWen) {
					layer.msg('请选择地区')
					return
				}
				// if ($('.qd-sel26').val() == '请选择') {
				// 	layer.msg('请选择物流渠道');
				// 	return;
				// }

				let stCsArr = [];
				let cjpacketIds = '';
				if (yanWenIds != '') {
					$scope.whereYanWen == 'yiWu' ? stCsArr.push(stCsFun(yanWenIds, '481', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(yanWenIds, '481', '深圳燕文专线追踪小包'))
					cjpacketIds += yanWenIds;
				}
				if (yanWenBattryIds != '') {
					$scope.whereYanWen == 'yiWu' ? stCsArr.push(stCsFun(yanWenBattryIds, '484', '义乌燕文专线追踪小包')) : stCsArr.push(stCsFun(yanWenBattryIds, '484', '深圳燕文专线追踪小包'))
					cjpacketIds += yanWenBattryIds;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.list = stCsArr;
				updata.enName = 'YanWen';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateCJPcketOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn26').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						var diQu = '';
						if ($scope.whereYanWen == 'shenZhen') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = cjpacketIds;
						ids.loginName = erpLoginName;
						ids.shenzhen = diQu;
						if (stu == 1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun25 = function (stu, sx) {//美国
				var curIds = '';
				if (sx == 'common') {
					if ($scope.usZhwlNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25').hasClass('btn-active1')) {
						return;
					}
					curIds = usZhwlIds;
					$('.scyd-btn25').addClass('btn-active1');
				} else if (sx == 'dian') {
					if ($scope.zuspsDianNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25-dian').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsDianIds;
					$('.scyd-btn25-dian').addClass('btn-active1');
				} else if (sx == 'jian') {
					if ($scope.zuspsJianNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25-jian').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsJianIds;
					$('.scyd-btn25-jian').addClass('btn-active1');
				} else if (sx == 'gao') {
					if ($scope.zuspsGaoNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25-gao').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsGaoIds;
					$('.scyd-btn25-gao').addClass('btn-active1');
				} else if (sx == 'ye') {
					if ($scope.zuspsYeNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25-ye').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsYeIds;
					$('.scyd-btn25-ye').addClass('btn-active1');
				} else if (sx == 'minGan') {
					if ($scope.zuspsMinGanNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25-mingan').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsMinGanIds;
					$('.scyd-btn25-mingan').addClass('btn-active1');
				}


				$scope.succscydnumflag = true;
				erp.load();
				var ids = {};
				ids.ids = curIds;
				ids.loginName = erpLoginName;
				if (stu == 1) {
					ids.auto = 'n';
				}
				console.log(JSON.stringify(ids))
				erp.postFun2('createTrackNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun23 = function (stu) {//DHL eCommerce
				if ($scope.dhlXiaoBaoNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn23').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = dhlXiaoBaoIds;
				updata.logisticsName = "DHLXB#DHL eCommerce";
				updata.enName = 'DHL eCommerce';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn23').addClass('btn-active1');
					console.log(data)
					let timer = scydAnimationFun()
					createWaybillNumberFun(dhlXiaoBaoIds,stu,timer)
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun24 = function (stu) {//DHL eCommerce
				if ($scope.epackSzGfNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn24').hasClass('btn-active1')) {
					return;
				}
				var szgfepackIds = '';
				var notUniqArr = [];
				for (var j = 0, jLen = zszgfStuArr.length; j < jLen; j++) {
					console.log(notUniqArr.indexOf(zszgfStuArr[j]))
					console.log(notUniqArr.indexOf(zszgfStuArr[j]) == -1)
					if (notUniqArr.indexOf(zszgfStuArr[j]) == -1) {
						notUniqArr.push(zszgfStuArr[j]);
					}
				}
				console.log(notUniqArr)
				for (var i = 0, len = notUniqArr.length; i < len; i++) {
					if (notUniqArr[i] == 1) {
						szgfepackIds += ddepackIds;
					}
					if (notUniqArr[i] == 2) {
						szgfepackIds += bdepackIds;
					}
					if (notUniqArr[i] == 3) {
						szgfepackIds += hcepackIds;
					}
					if (notUniqArr[i] == 4) {
						szgfepackIds += hfmepackIds;
					}
					if (notUniqArr[i] == 5) {
						szgfepackIds += gzepackIds;
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
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn24').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(szgfepackIds,stu,timer)
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun17 = function () {//南风顺丰
				if ($scope.nfOrTtNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-sel17').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn17').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = nfSfIds;
				updata.logisticsName = $('.qd-sel17').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn17').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(nfOrTtIds,stu,timer)
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun15 = function (stu) {//南风顺丰
				console.log($('.qd-sel15').val())
				console.log($('.qd-sel16').val())
				if ($scope.nfSfNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-sel15').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn15').hasClass('btn-active1')) {
					return;
				}
        if(!bulkCheckAccout(15,nfSfIds,'CJ Normal Express')) return
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = nfSfIds;
				updata.logisticsName = $('.qd-sel15').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn15').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(nfSfIds,stu,timer)
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun16 = function (stu) {//泰腾顺丰
				if ($scope.ttSfNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-sel16').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn16').hasClass('btn-active1')) {
					return;
				}
        if(!bulkCheckAccout(16,ttSfIds,'CJ Normal Express')) return
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = ttSfIds;
				updata.logisticsName = $('.qd-sel16').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn16').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(ttSfIds,stu,timer)
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun11 = function (stu) {//带电E邮宝生成运单号函数
				if ($scope.dhlddIds <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn11').hasClass('btn-active1')) {
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
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn11').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(dhlddIds,stu,timer)
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun12 = function (stu) {//dhl生成运单号函数
				if ($scope.dhlnotdIds <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn12').hasClass('btn-active1')) {
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
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn12').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {

						let timer = scydAnimationFun()
						createWaybillNumberFun(dhlnotdIds,stu,timer)
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun19 = function (stu) {//dhl转官方生成运单号函数
				if ($scope.dhlGfNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn19').hasClass('btn-active1')) {
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
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn19').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(dhlGfIds,stu,timer)
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun20 = function (stu) {//dhl官方生成运单号函数
				if ($scope.dhlOfficialNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn20').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel20').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if(!bulkCheckAccout(20,dhlOfficialIds,'DHL Official')) return
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = dhlOfficialIds;
				updata.logisticsName = $('.qd-sel20').val();
				updata.enName = 'DHL Official';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn20').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(dhlOfficialIds,stu,timer)
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			
			
			$scope.enterscmdFun1 = function (stu) {//带电E邮宝生成运单号函数
				console.log(stu)
				if ($scope.ddepackNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-sel1').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn1').hasClass('btn-active1')) {
					return;
				}
				if(!bulkCheckAccout(1,ddepackIds,'epacket')) return
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = ddepackIds;
				updata.logisticsName = $('.qd-sel1').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn1').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(ddepackIds,stu,timer)
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun2 = function (stu) {//带电E邮宝生成运单号函数
				if ($scope.bdepackNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.qd-sel2').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn2').hasClass('btn-active1')) {
					return;
				}        
				if(!bulkCheckAccout(2,bdepackIds,'epacket')) return
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = bdepackIds;
				updata.logisticsName = $('.qd-sel2').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn2').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(bdepackIds,stu,timer)
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun21 = function (stu) {//usps
				if ($scope.uspsNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn21').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.scydflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = uspsIds;
				updata.logisticsName = 'Shipstation#Shipstation'
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn21').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(uspsIds,stu,timer)
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun22 = function () {//带电E邮宝生成运单号函数
				if ($scope.uspsNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn22').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = uspsIds;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn22').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = uspsIds;
						console.log(JSON.stringify(ids))
						erp.postFun2('getShipstationWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = result.sess;//存储成功的个数
							$scope.error = result.error;//存储失败的个数

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
			$scope.enterscmdFun27 = function (stu) {
				if ($scope.usZhwlNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn27').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.scydflag = true;
				var updata = {};
				updata.orderNum = usZhwlIds;
				updata.upMode = 'y';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn27').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(usZhwlIds,stu,timer)
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun28 = function (stu, sx) {//usps
				var updata = {};
				var curIds = '';
				if (sx == 'common') {
					if ($scope.usZhwlNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn28').hasClass('btn-active1')) {
						return;
					}
					curIds = usZhwlIds;
					$('.scyd-btn28').addClass('btn-active1');
				} else if (sx == 'dian') {
					if ($scope.zuspsDianNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn28-dian').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsDianIds;
					updata.transferType = 1;
					$('.scyd-btn28-dian').addClass('btn-active1');
				} else if (sx == 'jian') {
					if ($scope.zuspsJianNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn28-jian').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsJianIds;
					updata.transferType = 4;
					$('.scyd-btn28-jian').addClass('btn-active1');
				} else if (sx == 'gao') {
					if ($scope.zuspsGaoNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn28-gao').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsGaoIds;
					updata.transferType = 3;
					$('.scyd-btn28-gao').addClass('btn-active1');
				} else if (sx == 'ye') {
					if ($scope.zuspsYeNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn28-ye').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsYeIds;
					updata.transferType = 2;
					$('.scyd-btn28-ye').addClass('btn-active1');
				} else if (sx == 'minGan') {
					if ($scope.zuspsMinGanNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn28-mingan').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsMinGanIds;
					updata.transferType = 5;
					$('.scyd-btn28-mingan').addClass('btn-active1');
				}

				erp.load();
				$scope.scydflag = true;
				updata.upMode = 'y';
				updata.orderNum = curIds;
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {

					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(curIds,stu,timer)
						refreshUspsOrderIdFun(curIds)
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun29 = function (stu) {//usps
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
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn29').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(jewelIds,stu,timer)
						refreshUspsOrderIdFun(jewelIds)
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun30 = function (stu) {//美国
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
				if (stu == 1) {
					ids.auto = 'n';
				}
				console.log(JSON.stringify(ids))
				erp.postFun2('createTrackNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun31 = function (stu) {//usps
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
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn31').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(jewelPlusIds,stu,timer)
						refreshUspsOrderIdFun(jewelPlusIds)
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun32 = function (stu) {//美国
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
				if (stu == 1) {
					ids.auto = 'n';
				}
				console.log(JSON.stringify(ids))
				erp.postFun2('createTrackNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun35 = function (stu) {//usps
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
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn35').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(jewelFlatIds,stu,timer)
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
				if (stu == 1) {
					ids.auto = 'n';
				}
				console.log(JSON.stringify(ids))
				erp.postFun2('createTrackNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun4 = function (stu) {//usps
				if ($scope.uspsNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				// if ($('.qd-sel4').val() == '请选择') {
				// 	layer.msg('请选择物流渠道');
				// 	return;
				// }
				if ($('.scyd-btn4').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = uspsIds;
				updata.logisticsName = 'Shipstation#Shipstation';
				// if ($scope.store==0||$scope.store==1) {
				// 	updata.logisticsName = 'Shipstation#USPS-'+$scope.uspsDiQu;
				// } else {
				// 	updata.logisticsName = 'Shipstation#Shipstation'
				// }
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn4').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {

						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = uspsIds;
						ids.loginName = erpLoginName;
						if (stu == 1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createTrackNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = result.sess;//存储成功的个数
							$scope.error = result.error;//存储失败的个数
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
			$scope.enterscmdFun3 = function (stu) {//其它物流生成运单号
				if ($scope.qtwlordNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn3').hasClass('btn-active1')) {
					return;
				}
				// $scope.zzscydFlag = true;
				erp.load();
				let timer = scydAnimationFun()

				$scope.succscydnumflag = true;
				createWaybillNumberFun(qtwlIds,stu,timer)

			}
			$scope.enterscmdFun13 = function (stu) {//带电E邮宝生成运单号函数
				if ($scope.hcepackNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn13').hasClass('btn-active1')) {
					return;
				}
				if ($('.qd-sel13').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if(!bulkCheckAccout(13,hcepackIds,'epacket')) return
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = hcepackIds;
				updata.logisticsName = $('.qd-sel13').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn13').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(hcepackIds,stu,timer)
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun18 = function (stu) {//带电E邮宝生成运单号函数
				if ($scope.hfmepackNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn18').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = hfmepackIds;
				updata.logisticsName = "BEUBH#BJ cosmetics epacket";
				updata.enName = 'BJ cosmetics epacket';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn18').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(hfmepackIds,stu,timer)
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun9 = function (stu) {//带电E邮宝生成运单号函数
				if ($scope.epackGzNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-sel9').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn9').hasClass('btn-active1')) {
					return;
				}
        if(!bulkCheckAccout(9,gzepackIds,'epacket')) return
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = gzepackIds;
				updata.logisticsName = $('.qd-sel9').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn9').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
					$('.scyd-btn10').addClass('btn-active1');
						createWaybillNumberFun(gzepackIds,stu,timer,'.scyd-btn9')
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun10 = function (stu) {
				if ($scope.ytNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn10').hasClass('btn-active1')) {
					return;
				}
				var whereTarget;
				if ($('.qd-sel10').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				} else if ($('.qd-sel10').val() == '深圳') {
					whereTarget = 'SZ'
				} else if ($('.qd-sel10').val() == '义乌') {
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
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						createWaybillNumberFun(ytIds,stu,timer,'.scyd-btn10')
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun6 = function (stu) {//不带电邮政小包
				if ($scope.bdyzxbNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.qd-sel6').val() == '') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn6').hasClass('btn-active1')) {
					return;
				}
        if(!bulkCheckAccout(6,bdyzxbIds,'China Post Registered Air Mail')) return
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = bdyzxbIds;
				updata.logisticsName = $('.qd-sel6').val();
				updata.enName = 'China Post Registered Air Mail';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn6').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {

						let timer = scydAnimationFun()
						createWaybillNumberFun(bdyzxbIds,stu,timer,'.scyd-btn6')
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}

			$scope.enterscmdFun7 = function (stu) {//带电E邮宝生成运单号函数
				if ($scope.uspsPlusNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn7').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.scydflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = uspsPlusIds;
				updata.logisticsName = 'Shipstation#Shipstation';
				// if ($scope.store==0||$scope.store==1) {
				// 	updata.logisticsName = 'Shipstation#USPSPLUS-'+$scope.uspsPlusDiQu;
				// } else {
				// 	updata.logisticsName = 'Shipstation#Shipstation'
				// }
				updata.enName = 'USPS+';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn7').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {

						let timer = scydAnimationFun()
						createWaybillNumberFun(uspsPlusIds,stu,timer,'.scyd-btn7')
					}
				}, function (data) {
					layer.closeAll("loading")
					console.log(data)
				})
			}
			$scope.enterscmdFun8 = function () {//带电E邮宝生成运单号函数
				if ($scope.uspsPlusNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn8').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = uspsPlusIds;
				updata.logisticsName = 'Shipstation#Shipstation';
				updata.enName = 'USPS+';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('processOrder/handleOrder/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn8').addClass('btn-active1');
					console.log(data)
					if (data.data.code == 200) {
						let timer = scydAnimationFun()
						var ids = {};
						ids.ids = uspsPlusIds;
						console.log(JSON.stringify(ids))
						erp.postFun2('getShipstationWaybillNumber.json', JSON.stringify(ids), function (data) {
							console.log(data)
							clearInterval(timer);//加载后清除定时器
							$('#animat-text').text('');//提示消息置为空
							$scope.endadmateP = true;//让成功失败条数显示起来

							layer.closeAll("loading")
							var result = data.data;
							$scope.sess = result.sess;//存储成功的个数
							$scope.error = result.error;//存储失败的个数
							// for(var i=0;i<result.length;i++){
							// 	$scope.sess+=result[i].sess;
							// 	$scope.error+=result[i].error;
							// }

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
			//usps+ 生成追踪号
			$scope.enterscmdFun14 = function (stu) {
				if ($scope.uspsPlusNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.scyd-btn14').hasClass('btn-active1')) {
					return;
				}
				erp.load()
				var ids = {};
				ids.ids = uspsPlusIds;
				if (stu == 1) {
					ids.auto = 'n';
				}
				console.log(JSON.stringify(ids));
				erp.postFun2('createTrackNumber.json', JSON.stringify(ids), function (data) {
					console.log(data)
					$scope.succscydnumflag = true;
					$('.scyd-btn14').addClass('btn-active1');
					$('#animat-text').text('');//提示消息置为空
					$scope.endadmateP = true;//让成功失败条数显示起来

					layer.closeAll("loading")
					var result = data.data;
					$scope.sess = result.sess;//存储成功的个数
					$scope.error = result.error;//存储失败的个数
					// for(var i=0;i<result.length;i++){
					// 	$scope.sess+=result[i].sess;
					// 	$scope.error+=result[i].error;
					// }

				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			//关闭成功 失败生成订单的条数
			$scope.succscydnumcloseFun = function () {
				$scope.succscydnumflag = false;
				$scope.scydflag = false;//关闭传送订单成功失败的弹框
				$scope.sess = '';//存储成功的个数
				$scope.error = '';//存储失败的个数
			}
		}
		function createWaybillNumberFun(argIds,argStu,timer,curBtn){
			var ids = {};
			ids.ids = argIds;
			ids.loginName = erpLoginName;
			if (argStu == 1) {
				ids.auto = 'n';
			}
			console.log(JSON.stringify(ids))
			erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
				console.log(data)
				$(curBtn).addClass('btn-active1')
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
		function refreshUspsOrderIdFun(argIds){
			var freshJson = {};
			freshJson.ids = argIds;
			freshJson.loginName = erpLoginName;
			erp.postFun2('refreshUspsOrderId.json', JSON.stringify(freshJson), function (data) {
				console.log(data)
			}, function (data) {
				console.log(data)
			})
		}
		//usps转usps+的确定取消 点击数字的函数
		// $scope.uspsTFun = function () {
		// 	$scope.uspsTFlag = false;
		// }
		//生成运单号的关闭函数
		$scope.isydCloseFun = function () {
			$scope.isydFlag = false;
			$scope.usZhwlNum = 0;
			$scope.zuspsJianNum = 0;
			$scope.zuspsDianNum = 0;
			$scope.zuspsYeNum = 0;
			$scope.zuspsGaoNum = 0;
			$scope.zuspsMinGanNum = 0;
			$scope.cjPacketVal = 'init';
			$scope.cjPacketDianVal = 'init';
			$scope.cjPacketGaoVal = 'init';
			$scope.cjPacketJianVal = 'init';
			$scope.cjPacketYeVal = 'init';
			$scope.cjPacketMinGanVal = 'init';
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
			$('.scyd-btn25-dian').removeClass('btn-active1');
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
			$('.scyd-btn44').removeClass('btn-active1');
			$('.scyd-btn45').removeClass('btn-active1');
			$('.scyd-btn46').removeClass('btn-active1');
			$('.scyd-btn47').removeClass('btn-active1');
			$('.scyd-btn49').removeClass('btn-active1');
			$('.scyd-btn48').removeClass('btn-active1');
			$('.scyd-btn50').removeClass('btn-active1');
			$('.scyd-btn51').removeClass('btn-active1');
			$('.scyd-btn28-dian').removeClass('btn-active1');
			$('.scyd-btn28-jian').removeClass('btn-active1');
			$('.scyd-btn28-ye').removeClass('btn-active1');
			$('.scyd-btn28-gao').removeClass('btn-active1');
			$('.scyd-btn28-mingan').removeClass('btn-active1');
			zszgfStuArr = [];
			$scope.pageNum = 1;
			getOrdList()
		}
		$scope.oneisdymdFun = function(item) { //单个打印面单
			$scope.itemId = item.id;
			$scope.oneisdymdFlag = true;
		}
		$scope.onedymdcloseFun = function() {
			$scope.oneisdymdFlag = false;
		}
		$scope.oneSureFun = function() {
			$scope.oneisdymdFlag = false; //关闭询问是否打印订单的提示框
			var ids = {};
			ids.ids = $scope.itemId;
			ids.type = '1';
			ids.loginName = erpLoginName;
			if($scope.selstu == 6){
				ids.orderStatusRecordType = '1';
			}
			erp.postFun2('getExpressSheet.json', JSON.stringify(ids), function(data) {
				console.log(data)
				var resMdArr = data.data;
				var resPdfArr = [];
				if (resMdArr.length > 0) {
					$scope.mdtcFlag = true;
					for (var i = 0, len = resMdArr.length; i < len; i++) {
						resPdfArr.push({
						printCount: 0,
						printPdf: resMdArr[i]
						})
					}
					$scope.pdfmdArr = resPdfArr;
					getOrdList()
				} else {
				layer.msg('生成面单错误')
				}
			}, function(data) {
				console.log(data)
				layer.msg('网络错误')
			},{layer:true})
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
		$scope.buckdyydFun = function () {
			$scope.isdymdFlag = false;//关闭询问是否生成面单的弹框
			erp.load();
			var ids = {};
			var printIds = checkOrdIds();
			if (!printIds) {
				layer.closeAll("loading")
				layer.msg('请选择订单')
				return;
			}
			ids.ids = printIds;
			console.log(JSON.stringify(ids))
			erp.postFun2('getExpressSheet.json', JSON.stringify(ids), function (data) {
				console.log(data)
				layer.closeAll("loading")
				// var href = data.data.href;
				$scope.kxt = data.data.kxt;
				$scope.zgyz = data.data.zgyz;
				if ($scope.kxt != '' || $scope.zgyz != '') {
					$scope.mdtcFlag = true;
				} else {
					layer.msg('生成面单错误')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll("loading")
				layer.msg('网络错误')
			})
		}
		//导出函数
		$scope.isdcflag = false;
		$scope.isdcfun = function () {
			if (!checkOrdIds()) {
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
			var ids = {};
			var printIds = checkOrdIds();
			printIds = printIds.split(',');
			printIds.pop();
			ids.ids = printIds;
			ids.type = '1';
			console.log(JSON.stringify(ids))
			erp.postFun('processOrder/queryOrder/erpExport', JSON.stringify(ids), function (data) {
				console.log(data)
				cjUtils.exportFile(data.data, `orders.xls`)
				// if(data.data.code==200){
				// 	var href = data.data.data;
				// 	if (href.indexOf('https') >= 0) {
				// 		$scope.dcflag = true;
				// 		$scope.hrefsrc = href;
				// 		console.log($scope.hrefsrc)
				// 	} else {
				// 		layer.msg('导出失败')
				// 	}
				// }else{
				// 	layer.msg('导出失败')
				// }
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			},{responseType:'blob',layer:true})
		}
		$scope.dcFsFun = function () {
			$scope.isdcflag = false;//关闭询问弹框
			erp.load();
			var ids = {};
			var printIds = checkOrdIds();
			printIds = printIds.split(',');
			printIds.pop();
			ids.ids = printIds;
			ids.type = '0';
			console.log(JSON.stringify(ids))
			erp.postFun('processOrder/queryOrder/erpExport', JSON.stringify(ids), function (data) {
				console.log(data)
				cjUtils.exportFile(data.data, `orders.xls`)
				// if(data.data.code==200){
				// 	var href = data.data.data;
				// 	if (href.indexOf('https') >= 0) {
				// 		$scope.dcflag = true;
				// 		$scope.hrefsrc = href;
				// 		console.log($scope.hrefsrc)
				// 	} else {
				// 		layer.msg('导出失败')
				// 	}
				// }else{
				// 	layer.msg('导出失败')
				// }
				
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			},{responseType:'blob',layer:true})
		}
		//关闭
		$scope.closeatc = function () {
			$scope.dcflag = false;
		}
		//精确查找
		$scope.jqczSelCs = '子订单号';//精确查询的条件
		$scope.jqczFlag = false;
		$scope.jqczFun = function () {
			$scope.jqczFlag = true;
		}
		$scope.sureJqczFun = function () {
			console.log($scope.jqczSelCs)
			var csData = {};
			csData.type = 'z';
			if ($scope.jqczSelCs == '子订单号') {
				csData.id = $scope.ordOrTnum;
			} else {
				if ($scope.ordOrTnum.length > 22) {
					var midStr = $scope.ordOrTnum;
					var subResStr = midStr.substring(midStr.length - 22);
					if (subResStr.substring(0, 1) == '9') {
						$scope.ordOrTnum = subResStr;
						csData.track = $scope.ordOrTnum;
						$('.c-seach-inp').val(subResStr);
					}
				} else {
					csData.track = $scope.ordOrTnum;
				}
			}
			erp.postFun('processOrder/queryOrder/getOrderLocation', JSON.stringify(csData), function (data) {
				console.log(data)
				$scope.jqczFlag = false;
				var resLocation = data.data.data.location;
				if (!$.isEmptyObject(data.data.data)) {
					localStorage.removeItem('store')
				}
				if (resLocation == '1') {
					$scope.store = '';
					$('.c-seach-country').val($scope.jqczSelCs);
					$('.c-seach-inp').val($scope.ordOrTnum);
					$('#c-data-time').val('');
					$('#cdatatime2').val('');
					$scope.searchFun();

				} else {
					var csDataObj = {};
					var setCsTime = new Date().getTime();
					csDataObj.tj = $scope.jqczSelCs;
					csDataObj.val = $scope.ordOrTnum;
					// csDataObj.btime = $('#c-data-time').val();
					// csDataObj.etime = $('#cdatatime2').val();
					console.log(csDataObj)
					csDataObj = JSON.stringify(csDataObj)
					localStorage.setItem('ziCs', csDataObj);
					localStorage.setItem('setCsTime', setCsTime);
					if (resLocation == '2') {
						sessionStorage.setItem('clickAddr', '1,1,1');
						$('.cebian-nav .cebian-content>span').eq(1).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/zi-two';
					} else if (resLocation == '3') {
						sessionStorage.setItem('clickAddr', '1,1,2');
						$('.cebian-nav .cebian-content>span').eq(2).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/zi-three';
					} else if (resLocation == '4') {
						sessionStorage.setItem('clickAddr', '1,1,3');
						$('.cebian-nav .cebian-content>span').eq(3).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/zi-four';
					} else if (resLocation == '5') {
						sessionStorage.setItem('clickAddr', '1,1,4');
						$('.cebian-nav .cebian-content>span').eq(4).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/zi-five';
					} else {
						layer.msg('未找到订单')
					}
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.QxJqczFun = function () {
			$scope.jqczFlag = false;
		}
		//查看纠纷
		//点击消息记录
		$scope.responseMsgFun = function (item, index) {
			$scope.replayFlag = true;
			$(".recordMsg").css("display", "block");
			$scope.cItemId = item.orderNumber;
			console.log($scope.cItemId)
			var mesUpdata = {};
			mesUpdata.ORDERNUMBER = $scope.cItemId;
			erp.postFun('processOrder/handleOrder/checkDispute', JSON.stringify(mesUpdata), function (data) {
				console.log(data)
				$scope.messageListArr = data.data.result;
				$scope.nowType = $scope.messageListArr[0].type;
				$scope.tdetailDate = $scope.messageListArr[0].createDate;
				$scope.detailData = JSON.parse($scope.messageListArr[0].message);//纠纷对话列表
				$scope.userName = $scope.messageListArr[0].userName;
				$scope.serverName = $scope.messageListArr[0].salesmanName;
				console.log($scope.messageListArr[0])
				console.log($scope.nowType)
				//获取客户名字的第一个字母
				$scope.cusNameFir = $scope.userName.slice(0, 1).toUpperCase();
				$scope.salseNameFir = $scope.serverName.slice(0, 1).toUpperCase();
				console.log($scope.salseNameFir, $scope.cusNameFir)
			}, function (data) {
				console.log(data)
			})
		}
		//关闭消息记录
		$scope.closRrecordMsgFun = function () {
			$(".recordMsg").css("display", "none");
			$scope.replyText = '';
			$scope.imgArr = [];
		}
		//点击上传的图片显示大图
		$scope.viewBigImg = function (item) {
			$scope.viewImgFlag = true;
			$scope.bigImgSrc = item;
			console.log(item)
		}
		$scope.closePreImg = function () {
			$scope.viewImgFlag = false;
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
		// $scope.stopProgFun = function(ev){
		// 	ev.stopPropagation()
		// }
		// 查看包装
		$scope.imgArr = [];
		$scope.packArr = [];
		$scope.ckBzFun = function (item, index, e) {
			e.stopPropagation()
			$('#ckbz-box .check-box input').each(function () {
				$(this).prop('checked', false)
			})
			$scope.packArr = [];
			$scope.imgArr = [];
			$scope.bzFlag = true;
			$scope.zordItemId = item.id;
			$scope.zordItemIndex = index;
			if (item.isPack) {
				var packKey = item.pack ? item.pack : [];
				var bzImgs = item.imgs ? item.imgs : [];
				$scope.packArr = JSON.parse(JSON.stringify(packKey));
				$scope.imgArr = JSON.parse(JSON.stringify(bzImgs));
				$('#ckbz-box .check-box input').each(function () {
					for (var i = 0, len = packKey.length; i < len; i++) {
						if (packKey[i] == $(this).attr('name')) {
							$(this).prop('checked', true)
						}
					}
				})
			}
		}

		$scope.addressError = function (item, index, e) {
			e.stopPropagation()
			$('#ckbz-box .check-box input').each(function () {
				$(this).prop('checked', false)
			})
			var upJson = {};
			upJson.id = item.id;
			upJson.orderNubmer = item.orderNumber;
			erp.postFun('order/order/addressError', JSON.stringify(upJson), function (data) {
				console.log(data)
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					console.log($scope.erporderList[data.data]);

				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}

		$scope.upLoadImg5 = function (files) {
			erp.ossUploadFile($('#uploadInp')[0].files, function (data) {
				console.log(data)
				if (data.code == 0) {
					layer.msg('上传失败');
					return;
				}
				if (data.code == 2) {
					layer.msg('部分图片上传失败');
				}
				var result = data.succssLinks;
				console.log(result)
				var filArr = [];
				for (var j = 0; j < result.length; j++) {
					var srcList = result[j].split('.');
					var fileName = srcList[srcList.length - 1].toLowerCase();
					console.log(fileName)
					if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
						$scope.imgArr.push(result[j]);
						$('#uploadInp').val('');
					}
				}
				console.log($scope.imgArr)
				$scope.$apply();
			})
		}

		$scope.getPackingInfo = function ($event) {
			var currentCheckbox = $($event.target);
			// console.log(currentCheckbox.prop('checked'))
			if (currentCheckbox.prop('checked')) {
				$scope.packArr.push(currentCheckbox.attr('name'));
			} else {
				console.log($.isArray(currentCheckbox, $scope.packArr))
				console.log(currentCheckbox)
				$scope.packArr.splice($.inArray(currentCheckbox.attr('name'), $scope.packArr), 1);
			}
			console.log($scope.packArr)
		}
		$scope.closeBzFun = function () {
			$scope.bzFlag = false;
			// $scope.imgArr = [];
			// $scope.packArr = [];
		}
		$scope.deletImgFun = function (index) {
			$scope.imgArr.splice(index, 1)
		}
		$scope.sureZdBzFun = function () {
			if ($scope.packArr.length < 1) {
				layer.msg('请指定包装');
				return;
			}
			if ($scope.imgArr.length < 1) {
				layer.msg('请上传包装图片');
				return;
			}
			erp.load()
			var upJson = {};
			upJson.cjorderId = $scope.zordItemId;
			upJson.packKey = $scope.packArr;
			upJson.imgs = $scope.imgArr;
			erp.postFun('processOrder/handleOrder/updateOrderPackInfo', JSON.stringify(upJson), function (data) {
				console.log(data)
				erp.closeLoad()
				if (data.data.code == 200) {
					layer.msg('指定成功')
					$scope.bzFlag = false;
					$scope.erporderList[$scope.zordItemIndex].order.isPack = '1';
					$scope.erporderList[$scope.zordItemIndex].order.imgs = $scope.imgArr;
					$scope.erporderList[$scope.zordItemIndex].order.pack = $scope.packArr;
					$scope.imgArr = [];
					$scope.packArr = [];
					console.log($scope.erporderList[$scope.zordItemIndex].order)
				}else{
					layer.msg('指定失败')
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		var that = this;
		// /*查看日志*/
		$scope.isLookLog = false;
		$scope.LookLog = function (No, ev) {
			console.log(No)
			$scope.isLookLog = true;
			that.no = No;
			ev.stopPropagation()
		}
		$scope.$on('log-to-father', function (d, flag) {
			if (d && flag) {
				$scope.isLookLog = false;
				$scope.gxhOrdFlag = false;
				$scope.gxhProductFlag = false;
			}
		})

		// 显示采购员列表
		// 查看采购单操作日志
		$scope.purchaseOrderCallback = function(showPurchases){
			$scope.showPurchases = showPurchases
		}

		$scope.openZZC2 = function (list, e, type, spArr) {
			$scope.gxhOrdFlag = true;
			that.pro = list;
			that.type = type;
			that.sparr = spArr;
			console.log(that.pro)
			console.log(type)
			e.stopPropagation()
		}
		$scope.openZZC = function (list, e, type, plist) {
			$scope.gxhProductFlag = true;
			that.pro = list;
			that.type = type;
			that.plist = plist;
			console.log(that.pro)
			console.log(type)
			e.stopPropagation()
		}
		//取消自动生成追踪号-start
		$scope.isAutoFlag = false;
		$scope.cancelAuto = function () {
			if (!checkOrdIds()) {
				layer.msg('请选择订单')
				return;
			} else {
				$scope.isAutoFlag = true;
			}
		}
		$scope.confirmCancelAuto = function(){
			$scope.isAutoFlag = false;//关闭询问弹框
			erp.load();
			var ids = {};
			var printIds = checkOrdIds();
			printIds = printIds.split(',')
			printIds.pop()
			ids.ids = printIds;
			ids.type = 0;
			console.log(JSON.stringify(ids))
			erp.postFun2('deleteAutoOrder.json', JSON.stringify(ids), function (data) {
				console.log(data)
				var flag = data.data;
				layer.closeAll("loading")
				if (flag) {
					$scope.searchFun();
				} else {
					layer.msg('取消自动生成失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//取消自动生成追踪号-end


    // 点击供展示供应商
    $scope.showSupplierInfo = false 
    $scope.supplierInfoList =[]
    $scope.handleGong = function(vid){
      erp.postFun('erp/account/getSupplieInfoByVid', JSON.stringify({vid:vid}), function (req) {
				if(req.status==200&&req.data.statusCode=="200"){
          const list = req.data.result
          $scope.supplierInfoList = list
          $scope.showSupplierInfo = true 
          return
        }
        layer.msg('请求失败')
			})
    } 

	}])

})()
