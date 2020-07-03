(function () {

	var app = angular.module('custom-ziord-app', ['service']);
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

	var getStorageList = function(erp,success){// request 仓库
		const list = erp.getStorage()
		let newList = []
		for(let i=0;i<list.length;i++){
			let item = list[i]
			let newItem = {
				storeName:item.dataName,
				store:item.dataId,
				ordNum:'',
				storeFlag:false
			}
			newList.push(newItem)
		}
		success(newList)
	}

	// Deprecated
	app.controller('custom-ziord-controller', ['$scope', '$http', 'erp', '$routeParams', '$compile', '$timeout', function ($scope, $http, erp, $routeParams, $compile, $timeout) {
		var that =this;
		$scope.isAnalysis=false;
		$scope.openAnalysis=function(id,name){
			//$('.khzzc').show();
			console.log(id);
			$scope.isAnalysis=true;
			that.no = {
				id:id,
				name:name
			};
			that.username=name;
		};
		$scope.$on('log-to-father',function (d,flag) {
			// {closeFlag: false}
			if (d && flag) {
				$scope.isAnalysis = false;
				$scope.spMessageflag = false;
			}
		})
		//商品留言
		$scope.spNoteFun = function(pItem,item,pIndex,index,ev){
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
		$(window).scroll(function(){
		    var before = $(window).scrollTop();
		    if(before>60){
		       if($(window).width()>1370){
		       	$('.fiexd-box').css({
		       	    "position": "fixed",
		       	    "top": 0,
		       	    "right":"28px"
		       	})
		       }else{
		       	$('.fiexd-box').css({
		       	    "position": "fixed",
		       	    "top": 0,
		       	    "right":"0px"
		       	})
		       }
		    }else{
		        $('.fiexd-box').css({
		            "position": "static",
		            "top": 0
		        })
		    }
		});
		$scope.$on('repeatFinishCallback', function () {
			// alert(6666666666)
			$('#c-zi-ord .edit-inp').attr('disabled', 'true');
			$('#c-zi-ord .bj-spsku').attr('disabled', 'true');
		});

		getStorageList(erp,function(res){// 缓存仓库
			$scope.storeList = res
			if(res.length > 0) $scope.store = res[0].store
			// getOrderList($scope,erp);
		})

		$scope.curTime = new Date().getTime();
		console.log($scope.curTime)
		$scope.dayFun = function (day1, day2) {
			return Math.ceil((day2 - day1) / 86400000)
		}
		console.log($scope.dayFun(1539562720000, $scope.curTime))
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
		$scope.currtpage = 1;
		$scope.isSelJqcz = '业务员';
		$scope.uspsDiQu = 'EAST';
		$scope.uspsPlusDiQu = 'EAST';
		var bs = new Base64();
		var loginAddress = localStorage.getItem('address') == undefined ? '' : bs.decode(localStorage.getItem('address'));
		console.log(loginAddress)
		var muId = '';
		$scope.selstu = 1;//判断订单状态 隐藏选择框中的操作
		// alert($routeParams.muId)
		if ($routeParams.muId != '' && $routeParams.muId != undefined) {
			muId = $routeParams.muId;
		}
		var muordstu = '';
		if ($routeParams.muordstu != '' && $routeParams.muordstu != undefined) {
			muordstu = $routeParams.muordstu;
		}
		// console.log(muordstu+']]]'+muId)
		var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
		// alert(erpLoginName)
		var loginSpace = localStorage.getItem('space');
		var nowTime = new Date().getTime();
		var setTiem = localStorage.getItem('setCsTime') == undefined ? '' : localStorage.getItem('setCsTime');
		var getCsObj = localStorage.getItem('ziCs') == undefined ? '' : JSON.parse(localStorage.getItem('ziCs'));
		var localuspsTime = localStorage.getItem('uspsTime') == undefined ? '' : localStorage.getItem('uspsTime');
		var localuspsIds = localStorage.getItem('uspsIds') == undefined ? '' : localStorage.getItem('uspsIds');
		var localepackIds = localStorage.getItem('epackIds') == undefined ? '' : localStorage.getItem('epackIds');
		var loStore = localStorage.getItem('store') == undefined ? '' : localStorage.getItem('store');
		var isSetCsFlag = false;//是否携带参数
		if (erpLoginName=='admin'||erpLoginName=='金仙娟'||erpLoginName=='李贞'||erpLoginName=='刘依') {
			$scope.cxclAdminShowFlag = true;
		} else {
			$scope.cxclAdminShowFlag = false;
		}
		if (nowTime - setTiem > 1500) {
			isSetCsFlag = false;
		} else {
			isSetCsFlag = true;
			$("#c-data-time").val(getCsObj.btime);
			$("#cdatatime2").val(getCsObj.etime);
			if (getCsObj.tj != '追踪号') {
				$scope.isSelJqcz = getCsObj.tj;
				$('.c-seach-country').val(getCsObj.tj);
				$('.c-seach-inp').val(getCsObj.val);
			}
			console.log(nowTime - setTiem)
		}
		erp.load();
		//请求物流渠道
		erp.postFun('app/erplogistics/getLogisticschannel', null, function (data) {
			console.log(data)
			$scope.wlqdArr = data.data;
			$scope.allepackArr = [];//存储所有E邮宝
			$scope.ddepackArr = [];//存储带电E邮宝的数组
			$scope.bdepackArr = [];//存储不带电E邮宝
			$scope.uspsArr = [];//存储物流方式为usps的数组
			$scope.ddyzxbArr = [];//存储带电邮政小包
			$scope.bdyzxbArr = [];//存储不带电邮政小包
			$scope.cjNorArr = [];//存储顺丰
			$scope.yanWenArr = [];//燕文
			$scope.postNlArr = [];//欧电宝PG
			$scope.gaoTiArr = [];//epacket膏体
			$scope.dhlHongKongArr = [];//dhl hongkong
			$scope.gaoCiArr = [];//含膏 含磁可走物流
			$scope.cjCodArr = [];//cjcod物流
			for (var i = 0; i < $scope.wlqdArr.length; i++) {
				if ($scope.wlqdArr[i].nameen == "ePacket" && $scope.wlqdArr[i].code != 'JCSZEUB' && $scope.wlqdArr[i].code != 'JCNJEUB') {
					$scope.allepackArr.push($scope.wlqdArr[i])
					if ($scope.wlqdArr[i].mode.indexOf('不带电') >= 0) {
						$scope.bdepackArr.push($scope.wlqdArr[i]);
					}
					else {
						$scope.ddepackArr.push($scope.wlqdArr[i]);
					}
					if($scope.wlqdArr[i].code == 'BJEUB'||$scope.wlqdArr[i].code == 'SEUB'||$scope.wlqdArr[i].code == 'BEUBH'||$scope.wlqdArr[i].code == 'DEIDAKDW604_YW'||$scope.wlqdArr[i].code == 'DEIDAKDW604_SZ'||$scope.wlqdArr[i].code == 'YEUB'){
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
				} else if($scope.wlqdArr[i].nameen == "YanWen"){
					$scope.yanWenArr.push($scope.wlqdArr[i])
				} else if($scope.wlqdArr[i].nameen == "DHL HongKong"){
					$scope.dhlHongKongArr.push($scope.wlqdArr[i])
				} else if($scope.wlqdArr[i].nameen == "PostNL"){
					$scope.postNlArr.push($scope.wlqdArr[i])
				}else if($scope.wlqdArr[i].nameen == "CJCOD"){
					$scope.cjCodArr.push($scope.wlqdArr[i])
				}
				if($scope.wlqdArr[i].code == "SEUB"||$scope.wlqdArr[i].code == "DGEUBA"||$scope.wlqdArr[i].code == 'DEIDAKDW604_YW'||$scope.wlqdArr[i].code == 'DEIDAKDW604_SZ'
				||$scope.wlqdArr[i].code == 'YEUB'){
					$scope.gaoCiArr.push($scope.wlqdArr[i])
				}
			}
			console.log($scope.gaoCiArr)
		}, function (data) {
			console.log(data)
		})
		// //存储的是哪个仓库
		// if (loginSpace) {
		// 	if (loginSpace == '深圳') {
		// 		$scope.store = 1;
		// 		$('.two-ck-btn').eq(1).addClass('two-ck-activebtn');
		// 	} else if (loginSpace == '美国') {
		// 		$scope.store = 2;
		// 		$('.two-ck-btn').eq(2).addClass('two-ck-activebtn');
		// 	} else {
		// 		$scope.store = 0;
		// 		$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
		// 	}
		// } else {
		// 	$scope.store = 0;
		// 	$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
		// }
		$scope.ordType = '';
		var erpData = {};
		if (muId != '') {
			erpData.shipmentsOrderId = muId;
			$scope.shipmentsOrderId = muId;
			$scope.isSelJqcz = '母订单号';
			$('.c-seach-inp').val(muId)
			$scope.storeNumFlag = true;
			getMuNumFun(muId,$scope.store)
			console.log($scope.storeNumFlag )
			//母订单跳转过来的忽略仓库
			$scope.store = '';
			$('.two-ck-btn').removeClass('two-ck-activebtn');
		} else {
			erpData.shipmentsOrderId = '';
			$scope.shipmentsOrderId = '';
		}

		erpData.trackingnumberType = 'all';
		erpData.status = '10';
		erpData.page = 1;
		erpData.store = $scope.store;
		erpData.cjOrderDateBegin = $('#c-data-time').val();
		erpData.cjOrderDateEnd = $('#cdatatime2').val();

		if (isSetCsFlag) {
			seltjFun(erpData);
		}
		if (muordstu == 3) {
			erpData.ydh = 'y';
		}
		// erpData.ydh = 'n';
		$('#page-sel').val('100');
		erpData.limit = $('#page-sel').val() - 0;
		$scope.erpordTnum = erpData.limit;
		$scope.erpordersList = '';//存储所有的订单
		$scope.erpordTnum = 0;//存储订单的条数
        if($scope.isfulfillment){
            erpData.fulfillment = $scope.fulfillment;
        }
		if (nowTime - localuspsTime > 15000) {
			erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
				layer.closeAll("loading")
				var erporderResult = data.data;//存储订单的所有数据
				console.log(data)
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun($scope.erporderList);
				if ($scope.erpordTnum < 1) {
					layer.msg('未找到订单')
				}
				console.log($scope.erporderList)
				getNumFun()
				dealpage()
			}, function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
				// alert(2121)
			})
		} else {
			localStorage.removeItem('uspsIds')
			localStorage.removeItem('epackIds')
			var uspsData = {};
			uspsData.page = 1;
			uspsData.limit = $('#page-sel').val() - 0;
			uspsData.status = "10";
			uspsData.trackingnumberType = "all";
			if (localepackIds) {
				uspsData.orderNumber = localepackIds;
			} else if (localuspsIds) {
				uspsData.orderNumber = localuspsIds;
			}
            if($scope.isfulfillment){
                uspsData.fulfillment = $scope.fulfillment;
            }
			erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(uspsData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				var erporderResult = data.data;//存储订单的所有数据
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				console.log($scope.erporderList)
				if ($scope.erpordTnum < 1) {
					layer.msg('未找到订单')
				}
				countMFun($scope.erporderList);
				getNumFun()
				dealpage()
			}, function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
				// alert(2121)
			})
		}
		function countMFun(val) {
			var len = val.length;
			var count = 0;
			for (var i = 0; i < len; i++) {
				count += val[i].order.AMOUNT;
			}
			$scope.countMoney = count.toFixed(2)
			console.log($scope.countMoney);
		}
		//获取数量
		function getNumFun() {
			erp.postFun('app/order/getOrderCount10', {
				'store': $scope.store
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					var resResult = JSON.parse(data.data.result);
					$scope.dYi = resResult.mei;
					$scope.dEr = resResult.you;
					$scope.dSan = resResult.jiufen;
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.toggleSeaFun = function(){
			$scope.moreSeaFlag = !$scope.moreSeaFlag;
			console.log($scope.moreSeaFlag)
		}
		$scope.searchBtnFun = function(){
			$scope.searchFun();
		}
		$scope.clearBtnFun = function(){
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
			erp.load();
			// $scope.countMoney = 0;
			var showList = $('#page-sel').val() - 0;
			$('#c-zi-ord .c-checkall').attr("src", "static/image/order-img/multiple1.png")
			if ($scope.erpordTnum <= 0) {
				layer.msg('未找到订单')
				layer.closeAll("loading")
				return;
			}
			// alert(44444444444)
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: showList,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.currtpage * 1,
				activeClass: 'active',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
				last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
				onPageChange: function (n, type) {
					// alert($scope.erpordTnum)
					// alert(type)
					if (type == 'init') {
						// alert(22222222222)
						layer.closeAll("loading")
						return;
					}
					$scope.currtpage = n;
					// alert('处理分页函数的分页函数')
					erp.load();
					$('#c-zi-ord .c-checkall').attr("src", "static/image/order-img/multiple1.png")
					var erpData = {};
					erpData.status = '10';
					//判断是否生成追踪号
					if ($scope.selstu == 3) {
						erpData.ydh = 'y';
					} else if ($scope.selstu == 2) {
						erpData.disputeId = 'dispute';
					}
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					var showList = $('#page-sel').val() - 0;
					erpData.page = n;
					erpData.limit = showList;
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						if ($scope.erpordTnum < 1) {
							layer.msg('未找到订单')
						}
						countMFun($scope.erporderList);
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				}
			});
		}
		//分页选择框的切换
		$('#page-sel').change(function () {
			erp.load();
			// $scope.countMoney = 0;
			var showList = $(this).val() - 0;
			if ($scope.erpordTnum < 1) {
				erp.closeLoad();
				return;
			}
			$scope.currtpage = 1;
			// console.log(showList)
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: showList,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.currtpage * 1,
				activeClass: 'active',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
				last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
				onPageChange: function (n) {
					$('#c-zi-ord .c-checkall').attr("src", "static/image/order-img/multiple1.png")
					// alert('选择框的分页')
					$scope.currtpage = n;
					erp.load();
					var erpData = {};
					erpData.status = '10';
					// seltjFun(erpData);
					//判断是否生成追踪号
					// if($scope.selstu==3){
					// 	erpData.ydh = 'y';
					// }
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.page = n;
					erpData.limit = showList;
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						// console.log(data.data.productsList)
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						if ($scope.erpordTnum < 1) {
							layer.msg('未找到订单')
						}
						countMFun($scope.erporderList);
						dealpage()
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				}
			});

		})
		//跳页的查询
		$scope.gopageFun = function () {
			erp.load();
			// $scope.countMoney = 0;
			var showList = $('#page-sel').val() - 0;
			var pageNum = $('#inp-num').val() - 0;
			// alert(pageNum)
			if (pageNum == '') {
				layer.closeAll("loading")
				layer.msg('跳转页数不能为空!');
				return;
			}
			var countN = Math.ceil($scope.erpordTnum / showList);
			// alert(countN)
			if (pageNum > countN) {
				layer.closeAll("loading")
				layer.msg('选择的页数大于总页数.');
				return;
			}
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: showList,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: pageNum,
				activeClass: 'active',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
				last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
				onPageChange: function (n) {
					$('#c-zi-ord .c-checkall').attr("src", "static/image/order-img/multiple1.png")
					// alert('跳页查询函数的分页')
					$scope.currtpage = n;
					erp.load();
					var erpData = {};
					erpData.status = '10';
					//判断是否生成追踪号
					// if($scope.selstu==3){
					// 	erpData.ydh = 'y';
					// }
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.page = n;
					erpData.limit = showList;
					console.log(erpData)
					console.log(JSON.stringify(erpData))
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						console.log(data.data.productsList)
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						if ($scope.erpordTnum < 1) {
							layer.msg('未找到订单')
						}
						countMFun($scope.erporderList);
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				}
			});
		}
		//批量修改仓库
		$scope.bulkChangeCk = function () {
			var cxclNum = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					cxclNum++;
				}
			})
			if (cxclNum<1) {
				layer.msg('请选择订单')
			} else {
				$scope.changeCkFlag = true;
			}
		}
		$scope.curStoreVal = '0';
		$scope.sureChangeCkFun = function () {
			erp.load();
			var cxclids = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					cxclids+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			var cxclData = {};
			cxclData.ids = cxclids;
			cxclData.store = $scope.curStoreVal;
			console.log(JSON.stringify(cxclData))
			erp.postFun('pojo/procurement/changeCjOrderStore',JSON.stringify(cxclData),function (data) {
				console.log(data);
				$scope.changeCkFlag = false;
				if(data.data.statusCode=='200'){
					var erpData = {};
					erpData.status = '10';
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.page = 1;
					erpData.limit = $('#page-sel').val() - 0;
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						console.log(data.data.productsList)
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						if ($scope.erpordTnum < 1) {
							layer.msg('未找到订单')
						}
						countMFun($scope.erporderList);
						if(muId||$scope.storeNumFlag||$scope.isSelJqcz=='母订单号'){
							var inpVal = $.trim($('.c-seach-inp').val())
							if(inpVal){
								getMuNumFun(inpVal,$scope.store)
							} else {
								getMuNumFun(muId,$scope.store)
							}
						}
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				}else{
					layer.closeAll("loading")
					layer.msg('修改仓库失败')
				}
			},function (data) {
				layer.closeAll("loading")
				layer.msg('网络错误')
				console.log(data)
			})
		}
		//按生成追踪号的类型搜索
		$scope.zzhstuFlag = true;
		$scope.checkBoxFun = function (ev) {
			$scope.currtpage = 1;
			erp.load();
			var $evObj = $(ev.target);
			var erpData = {};
			erpData.status = '10';
			//判断是否生成追踪号
			if ($scope.selstu == 3) {
				erpData.ydh = 'y';
			}
			if ($evObj.is(':checked')) {
				erpData.trackingnumberType = 1;
				$scope.zzhstuFlag = true;
			} else {
				erpData.trackingnumberType = 'all';
				$scope.zzhstuFlag = false;
			}
			seltjFun(erpData);
			erpData.cjOrderDateBegin = $('#c-data-time').val();
			erpData.cjOrderDateEnd = $('#cdatatime2').val();
			erpData.page = 1;
			erpData.limit = $('#page-sel').val() - 0;
			console.log(erpData)
			console.log(JSON.stringify(erpData))
            if($scope.isfulfillment){
                erpData.fulfillment = $scope.fulfillment;
            }
			erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				console.log(data.data.productsList)
				var erporderResult = data.data;//存储订单的所有数据
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun($scope.erporderList);
				dealpage();
			}, function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			})
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
		//按条件搜索
		function seltjFun(data) {
			if ($scope.selstu == 1) {
				data.trackingnumberType = 'all';
			} else if($scope.selstu == 5){
				data.auto = 'y';
			} else {
				if ($('.seach-ordnumstu').is(':checked')) {
					data.trackingnumberType = 1;
				} else {
					data.trackingnumberType = 'all';
				}
				if ($scope.selstu == 3) {
					data.disputeId = '';
				} else {
					data.disputeId = 'dispute';
				}
			}
			data.store = $scope.store;
			//判断是否生成追踪号
			if ($scope.selstu == 3 || muordstu == 3) {
				data.ydh = 'y';
			} else if($scope.selstu==2){
				data.ydh = 'all'
			}else {
				data.ydh = '';
			}
			console.log(muId,'-------------------===========')
			if (muId) {
				data.shipmentsOrderId = muId;
			} else {
				data.shipmentsOrderId = '';
			}
			data.serarchPod = $scope.ordType;
			data.cjOrderDateBegin = $('#c-data-time').val();
			data.cjOrderDateEnd = $('#cdatatime2').val();
			var selVal = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());
			console.log(data)
			return AssembleSearchData($scope, data, selVal, inpVal);
		}
		$scope.searchFun = function () {
			$scope.currtpage = 1;
			erp.load();
			var selVal = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());
			if (selVal == '追踪号' && inpVal.length > 22) {
				var subResStr = inpVal.substring(inpVal.length - 22)
				if (subResStr.substring(0, 1) == '9') {
					inpVal = subResStr;
					$('.c-seach-inp').val(inpVal);
				}
			}
			// alert(selVal)
			var erpData = {};
			erpData.status = '10';
			if (muId != '') {
				erpData.shipmentsOrderId = muId;
			} else {
				erpData.shipmentsOrderId = '';
			}

			if ($scope.selstu == 1) {
				erpData.trackingnumberType = 'all';
			} else if($scope.selstu == 5){
				erpData.auto = 'y';
			} else {
				if ($('.seach-ordnumstu').is(':checked')) {
					erpData.trackingnumberType = 1;
				} else {
					erpData.trackingnumberType = 'all';
				}
				//判断是否生成追踪号
				if ($scope.selstu == 3) {
					erpData.ydh = 'y';
				} else if($scope.selstu == 2){
					erpData.disputeId = 'dispute';
					erpData.ydh = 'all';
				}else {
					erpData.ydh = 'all';
				}
			}
			erpData.cjOrderDateBegin = $('#c-data-time').val();
			erpData.cjOrderDateEnd = $('#cdatatime2').val();
			erpData.page = 1;
			erpData.store = $scope.store;
			erpData.limit = $('#page-sel').val() - 0;
			erpData.serarchPod = $scope.ordType;
			$scope.storeNumFlag = false;
			erpData = AssembleSearchData($scope, erpData, selVal, inpVal);
			console.log(erpData)
      if($scope.isfulfillment){
          erpData.fulfillment = $scope.fulfillment;
      }
			erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				var erporderResult = data.data;//存储订单的所有数据
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun($scope.erporderList);
				dealpage();
			}, function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			})
			if($scope.isSelJqcz=='母订单号'&&inpVal){
				getMuNumFun(inpVal,$scope.store)
			}
		}
		function getMuNumFun(sid,store){
			erp.getFun('order/order/getOrderCountBySid?sid='+sid+'&store='+store,function(data){
				console.log(data)
				if(data.data.statusCode==200){
					var numObj = data.data.result;
					$scope.yiWuCount = numObj.yiwu;
					$scope.shenZhenCount = numObj.shenzhen;
					$scope.meiGuoCount = numObj.meixi;
					$scope.meiDongCount = numObj.meidong;
					$scope.meiZzhCount = numObj.mei;
					$scope.youZzhCount = numObj.you;
					$scope.jiuFenCount = numObj.jiufen;
					$scope.taiGuoCount = numObj.taiguo;
					console.log($scope.yiWuCount)
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
		//按时间搜索
		//erp开始日期搜索
		$("#c-data-time").click(function () {
			var erpbeginTime = $("#c-data-time").val();
			var interval = setInterval(function () {
				var endtime2 = $("#c-data-time").val();
				if (endtime2 != erpbeginTime) {
					$scope.currtpage = 1;
					erp.load();
					clearInterval(interval);
					// alert(selVal)
					var erpData = {};
					erpData.status = '10';
					if (muId != '') {
						erpData.id = muId;
					} else {
						erpData.id = '';
					}
					//判断是否生成追踪号
					// if($scope.selstu==3){
					// 	erpData.ydh = 'y';
					// }
					seltjFun(erpData);
					erpData.page = 1;
					erpData.limit = $('#page-sel').val() - 0;
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					console.log(erpData)
					console.log(JSON.stringify(erpData))
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
						dealpage();
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				}
			}, 100)
		})
		//erp结束日期搜索
		$("#cdatatime2").click(function () {
			var erpendTime = $("#cdatatime2").val();
			var interval = setInterval(function () {
				var endtime2 = $("#cdatatime2").val();
				if (endtime2 != erpendTime) {
					$scope.currtpage = 1;
					erp.load();
					clearInterval(interval);
					// alert(selVal)
					var erpData = {};
					erpData.status = '10';
					//判断是否生成追踪号
					// if($scope.selstu==3){
					// 	erpData.ydh = 'y';
					// }
					seltjFun(erpData);
					erpData.page = 1;
					erpData.limit = $('#page-sel').val() - 0;
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					console.log(erpData)
					console.log(JSON.stringify(erpData))
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
						dealpage();
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				}
			}, 100)
		})
		//批量同步至店铺
		$scope.tbdpFlag = false;
		var tbdpShopIds = '';//存储店铺id
		var tbdpExcelIds = '';//存储excel 的id
		$scope.istbdpTc = function () {
			tbdpShopIds = '';
			tbdpExcelIds = '';
			$scope.lxindex = 0;
			$scope.nfEytNum = 0;//南风转单号
			$scope.jceqkptNum = 0;//佳成英国转单号
			$scope.shipmentId0Num = 0;//店铺为Brightpearl 商品图片id为0
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					//console.log($(this).parent().siblings('.created-td').find('.track-nump'))
					//console.log($(this).parent().siblings('.created-td').find('.track-nump').text())
					console.log($.trim($(this).siblings('.store-name-sibling').text()))
					console.log($.trim($(this).siblings('.store-name-sibling').text())=='Brightpearl')
					if ($.trim($(this).siblings('.store-name-sibling').text())=='Brightpearl') {
						var $sptdObj = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
						console.log($sptdObj)
						console.log($sptdObj.length)
						console.log($sptdObj.children('.image-shipmentid').text())
						var shipIs0Flag = false;
						for(var i = 0,len=$sptdObj.length;i<len;i++){
							if($sptdObj.children('.image-shipmentid').eq(i).text()=='0'){
								console.log('为0')
								shipIs0Flag = true;
								break
							}
						}
						if(!shipIs0Flag){
							if ($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EYT') >= 0) {
								$scope.nfEytNum++;
							} else if ($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EQKPT') >= 0) {
								$scope.jceqkptNum++;
							} else {
								$scope.lxindex++;
							}
							if ($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EYT') < 0 && $(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EQKPT') < 0) {
								if ($(this).parent().siblings('.store-name-td').children('.store-name-p').text() == 'Excel Imported') {
									tbdpExcelIds += $(this).siblings('.hide-order-id').text() + ',';
									console.log('excel order')
								} else {
									tbdpShopIds += $(this).siblings('.hide-order-id').text() + ',';
									console.log('dianpu order')
								}
							}
						}else{
							$scope.shipmentId0Num++
						}
					} else {
						console.log('不是Brightpearl店铺')
						if ($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EYT') >= 0) {
							$scope.nfEytNum++;
						} else if ($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EQKPT') >= 0) {
							$scope.jceqkptNum++;
						} else {
							$scope.lxindex++;
						}
						if ($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EYT') < 0 && $(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EQKPT') < 0) {
							if ($(this).parent().siblings('.store-name-td').children('.store-name-p').text() == 'Excel Imported') {
								tbdpExcelIds += $(this).siblings('.hide-order-id').text() + ',';
								console.log('excel order')
							} else {
								tbdpShopIds += $(this).siblings('.hide-order-id').text() + ',';
								console.log('dianpu order')
							}
						}
					}
				}
			})
			if ($scope.lxindex <= 0&&$scope.shipmentId0Num<=0&&$scope.jceqkptNum<=0&&$scope.nfEytNum<=0) {
				layer.msg('请选择订单');
				return;
			} else {
				$scope.tbdpFlag = true;
			}
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
			var upData = {};
			upData.shopId = tbdpShopIds;
			upData.excelId = tbdpExcelIds;
			console.log(JSON.stringify(upData))
			erp.postFun('app/order/fulfilOrder', JSON.stringify(upData), function (data) {
				console.log(data)
				$scope.tbdpTipFlag = false;//关闭同步时间较长的提示框
				if (data.data.result) {
					layer.msg('同步成功')
					$scope.currtpage = 1;
					var erpData = {};
					erpData.status = '10';
					erpData.page = 1;
					erpData.ydh = 'y';
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.limit = $('#page-sel').val() - 0;
					console.log(JSON.stringify(erpData))
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						console.log($scope.erporderList)
						countMFun($scope.erporderList);
						dealpage()
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				} else {
					layer.closeAll("loading")
					layer.msg('同步失败')
				}

			}, function (data) {
				layer.closeAll("loading")
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
			var id = item.ID;
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
			erp.postFun('app/order/updateEnterName', JSON.stringify(upData), function (data) {
				console.log(data)
				// erp.closeLoad();
				if (data.data.result == 1) {
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
			var id = item.ID;
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
			erp.postFun('app/order/updateEnterName', JSON.stringify(upData), function (data) {
				console.log(data)
				// erp.closeLoad();
				if (data.data.result == 1) {
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
			//var id = item.CJOrderId;
			var upData = {};
			upData.id = item.ID;
			upData.sku = bjSkuInpVal;
			console.log(JSON.stringify(upData));
			var senData={
				ids:item.CJOrderId
			}
			// return;
			erp.postFun('app/order/shifangkucun',JSON.stringify(senData),function(data){
				erp.postFun('app/order/updateSku', JSON.stringify(upData), function (data) {
					console.log(data);
					if (data.data.result == 1) {
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
						layer.msg('保存失败')
					}
				}, function (data) {
					erp.closeLoad();
					console.log(data)
				});
			},function(){
				erp.closeLoad();
			});

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
			var id = item.ID;
			var upData = {};
			upData.id = id;
			upData.cjProductId = item.cjProductId;
			upData.entrycode = bjSkuInpVal;
			console.log(JSON.stringify(upData));
			// return;
			erp.postFun('app/order/updateEntryCode', JSON.stringify(upData), function (data) {
				console.log(data)
				if (data.data.result == 1) {
					erp.closeLoad();
					layer.msg('修改成功')
					// $(ev.target).siblings('.spsku-text').text(bjSkuInpVal);
					for(let i = 0,len = $scope.erporderList.length;i<len;i++){
						for(let j = 0,jLen = $scope.erporderList[i].product.length;j<jLen;j++){
							if(item.cjProductId == $scope.erporderList[i].product[j].cjProductId){
								$scope.erporderList[i].product[j].entryCode = bjSkuInpVal;
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
					$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			}, function (data) {
				erp.closeLoad();
				console.log(data)
			})
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
			var id = item.ID;
			var upData = {};
			upData.id = id;
			upData.entryValue = bjSkuInpVal;
			console.log(JSON.stringify(upData));
			// return;
			erp.postFun('app/order/updateEntryValue', JSON.stringify(upData), function (data) {
				console.log(data)
				erp.closeLoad();
				if (data.data.result == 1) {
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
			var hisArr = item.TRACKINGNUMBERHISTORY.replace(item.TRACKINGNUMBER, '');
			hisArr = hisArr.split(',');
			$scope.hisArr = hisArr;
		}
		$scope.lrFun = function (item, ev, index) {
			$scope.lrIndex = index;
			$scope.lrId = item.ID;
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
			erp.postFun('app/order/upLogisticsNumber', JSON.stringify(lrData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.zzhChaFlag = false;
				if (data.data.result > 0) {
					if ($scope.selstu == 1) {
						$scope.erporderList.splice($scope.lrIndex, 1);
						$scope.erpordTnum--;
						countMFun($scope.erporderList);
						layer.msg('添加追踪号成功')
					} else {
						layer.msg('修改追踪号成功')
						$scope.erporderList[$scope.lrIndex].order.TRACKINGNUMBER = $scope.lrzzhNum;
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

			$scope.messageCon = item.NOTE_ATTRIBUTES;
			mesIndex = index;
			messageCon = $('.orders-table .mes-hidetest').eq(index).text();
			$('.custom-mes').val(messageCon);
			mesOrdId = item.ID;
			console.log(messageCon + '----' + mesOrdId)
		}
		$scope.messcloseBtnFun = function () {
			$scope.messageflag = false;
			$scope.messageCon = '';
		}
		$scope.cusmesSurnFun = function () {
			var editTextCon = $('.custom-mes').val();
			var mesData = {};
			mesData.orderNum = mesOrdId;
			mesData.note = editTextCon;
			console.log(JSON.stringify(mesData))
			erp.postFun('app/order/upOrderNote', JSON.stringify(mesData), function (data) {
				console.log(data)
				$scope.messageflag = false;
				if (data.data.result > 0) {
					layer.msg('修改成功')
					$('.orders-table .mes-hidetest').eq(mesIndex).text(editTextCon);
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
			upIds.ids = item.ID;
			erp.postFun2('searchOrderTracknumber.json', JSON.stringify(upIds), function (data) {
				console.log(data)
				if (data.data == 1) {
					layer.msg('获取转单号成功')
					erp.load();
					var erpData = {};
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.status = '10';
					erpData.page = $scope.currtpage;
					// erpData.ydh = 'y';
					erpData.limit = $('#page-sel').val() - 0;
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					console.log(JSON.stringify(erpData))
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
						dealpage()
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
						// alert(2121)
					})
				} else if (data.data == 0) {
					layer.msg('获取转单号失败')
				} else {
					layer.msg('无匹配数据')
				}
			}, function (data) {
				console.log(data)
			})
		}
		//给子订单里面的订单添加选中非选中状态
		var cziIndex = 0;
		$('#c-zi-ord').on('click', '.cor-check-box', function (e) {
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

		//给导航添加点击事件
		$('.ord-stu-cs').click(function () {
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
			localStorage.setItem('setCsTime', setCsTime);
		})
		$scope.selOrdTypeFun = function(){
			$scope.currtpage = 1;
			getListFun()
		}
		//义乌 深圳 美国
		$scope.storeFun = function (id,ev) {
			$scope.store = id;
			if ($(ev.target).hasClass('two-ck-activebtn')) {
				$(ev.target).removeClass('two-ck-activebtn')
				$scope.store = '';
				localStorage.removeItem('store')
			} else {
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$(ev.target).addClass('two-ck-activebtn');
				localStorage.setItem('store', id)
			}
			getNumFun()
			if ($scope.selstu == 1) {
				getListFun(1);
			} else if ($scope.selstu == 2) {
				getListFun(2);
			} else if ($scope.selstu == 3) {
				getListFun(3);
			}
			$scope.storeNumFlag = false;
			if($scope.isSelJqcz=='母订单号'){
				$scope.storeNumFlag = true;
			}
			if(muId||$scope.storeNumFlag){
				var inpVal = $.trim($('.c-seach-inp').val())
				if(inpVal){
					getMuNumFun(inpVal,$scope.store)
				} else {
					getMuNumFun(muId,$scope.store)
				}
			}
		}
		// $scope.storeFun0 = function (ev) {
		// 	$scope.store = 0;
		// 	if ($(ev.target).hasClass('two-ck-activebtn')) {
		// 		$(ev.target).removeClass('two-ck-activebtn')
		// 		$scope.store = '';
		// 		localStorage.removeItem('store')
		// 	} else {
		// 		$('.two-ck-btn').removeClass('two-ck-activebtn')
		// 		$(ev.target).addClass('two-ck-activebtn');
		// 		localStorage.setItem('store', 0)
		// 	}
		// 	getNumFun()
		// 	if ($scope.selstu == 1) {
		// 		getListFun(1);
		// 	} else if ($scope.selstu == 2) {
		// 		getListFun(2);
		// 	} else if ($scope.selstu == 3) {
		// 		getListFun(3);
		// 	}
		// 	$scope.storeNumFlag = false;
		// 	if($scope.isSelJqcz=='母订单号'){
		// 		$scope.storeNumFlag = true;
		// 	}
		// 	if(muId||$scope.storeNumFlag){
		// 		var inpVal = $.trim($('.c-seach-inp').val())
		// 		if(inpVal){
		// 			getMuNumFun(inpVal,$scope.store)
		// 		} else {
		// 			getMuNumFun(muId,$scope.store)
		// 		}
		// 	}
		// }
		// $scope.storeFun1 = function (ev) {
		// 	$scope.store = 1;
		// 	if ($(ev.target).hasClass('two-ck-activebtn')) {
		// 		$(ev.target).removeClass('two-ck-activebtn')
		// 		$scope.store = '';
		// 		localStorage.removeItem('store')
		// 	} else {
		// 		$('.two-ck-btn').removeClass('two-ck-activebtn')
		// 		$(ev.target).addClass('two-ck-activebtn');
		// 		localStorage.setItem('store', 1)
		// 	}
		// 	getNumFun()
		// 	if ($scope.selstu == 1) {
		// 		getListFun(1);
		// 	} else if ($scope.selstu == 2) {
		// 		getListFun(2);
		// 	} else if ($scope.selstu == 3) {
		// 		getListFun(3);
		// 	}
		// 	$scope.storeNumFlag = false;
		// 	if($scope.isSelJqcz=='母订单号'){
		// 		$scope.storeNumFlag = true;
		// 	}
		// 	if(muId||$scope.storeNumFlag){
		// 		var inpVal = $.trim($('.c-seach-inp').val())
		// 		if(inpVal){
		// 			getMuNumFun(inpVal,$scope.store)
		// 		} else {
		// 			getMuNumFun(muId,$scope.store)
		// 		}
		// 	}
		// }
		// $scope.storeFun2 = function (ev) {
		// 	$scope.store = 2;
		// 	if ($(ev.target).hasClass('two-ck-activebtn')) {
		// 		$(ev.target).removeClass('two-ck-activebtn')
		// 		$scope.store = '';
		// 		localStorage.removeItem('store')
		// 	} else {
		// 		$('.two-ck-btn').removeClass('two-ck-activebtn')
		// 		$(ev.target).addClass('two-ck-activebtn');
		// 		localStorage.setItem('store', 2)
		// 	}
		// 	getNumFun()
		// 	if ($scope.selstu == 1) {
		// 		getListFun(1);
		// 	} else if ($scope.selstu == 2) {
		// 		getListFun(2);
		// 	} else if ($scope.selstu == 3) {
		// 		getListFun(3);
		// 	}
		// 	$scope.storeNumFlag = false;
		// 	if($scope.isSelJqcz=='母订单号'){
		// 		$scope.storeNumFlag = true;
		// 	}
		// 	if(muId||$scope.storeNumFlag){
		// 		var inpVal = $.trim($('.c-seach-inp').val())
		// 		if(inpVal){
		// 			getMuNumFun(inpVal,$scope.store)
		// 		} else {
		// 			getMuNumFun(muId,$scope.store)
		// 		}
		// 	}
		// }
		// $scope.storeFun3 = function (ev) {
		// 	$scope.store = 3;
		// 	if ($(ev.target).hasClass('two-ck-activebtn')) {
		// 		$(ev.target).removeClass('two-ck-activebtn')
		// 		$scope.store = '';
		// 		localStorage.removeItem('store')
		// 	} else {
		// 		$('.two-ck-btn').removeClass('two-ck-activebtn')
		// 		$(ev.target).addClass('two-ck-activebtn');
		// 		localStorage.setItem('store', 3)
		// 	}
		// 	getNumFun()
		// 	if ($scope.selstu == 1) {
		// 		getListFun(1);
		// 	} else if ($scope.selstu == 2) {
		// 		getListFun(2);
		// 	} else if ($scope.selstu == 3) {
		// 		getListFun(3);
		// 	}
		// 	$scope.storeNumFlag = false;
		// 	if($scope.isSelJqcz=='母订单号'){
		// 		$scope.storeNumFlag = true;
		// 	}
		// 	if(muId||$scope.storeNumFlag){
		// 		var inpVal = $.trim($('.c-seach-inp').val())
		// 		if(inpVal){
		// 			getMuNumFun(inpVal,$scope.store)
		// 		} else {
		// 			getMuNumFun(muId,$scope.store)
		// 		}
		// 	}
		// }
		// $scope.storeFun4 = function (ev) {
		// 	$scope.store = 4;
		// 	if ($(ev.target).hasClass('two-ck-activebtn')) {
		// 		$(ev.target).removeClass('two-ck-activebtn')
		// 		$scope.store = '';
		// 		localStorage.removeItem('store')
		// 	} else {
		// 		$('.two-ck-btn').removeClass('two-ck-activebtn')
		// 		$(ev.target).addClass('two-ck-activebtn');
		// 		localStorage.setItem('store', 4)
		// 	}
		// 	getNumFun()
		// 	if ($scope.selstu == 1) {
		// 		getListFun(1);
		// 	} else if ($scope.selstu == 2) {
		// 		getListFun(2);
		// 	} else if ($scope.selstu == 3) {
		// 		getListFun(3);
		// 	}
		// 	$scope.storeNumFlag = false;
		// 	if($scope.isSelJqcz=='母订单号'){
		// 		$scope.storeNumFlag = true;
		// 	}
		// 	if(muId||$scope.storeNumFlag){
		// 		var inpVal = $.trim($('.c-seach-inp').val())
		// 		if(inpVal){
		// 			getMuNumFun(inpVal,$scope.store)
		// 		} else {
		// 			getMuNumFun(muId,$scope.store)
		// 		}
		// 	}
		// }
		$scope.selfun1 = function ($event) {//未生成追踪号
            $scope.isfulfillment = false;
            $('.seach-ordnumstu').prop("checked", false);
			$scope.currtpage = 1;
			$scope.selstu = 1;
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')

			erp.load();
			getListFun(1);
			$scope.storeNumFlag = false;
			if($scope.isSelJqcz=='母订单号'){
				$scope.storeNumFlag = true;
			}
			if(muId||$scope.storeNumFlag){
				var inpVal = $.trim($('.c-seach-inp').val())
				if(inpVal){
					getMuNumFun(inpVal,$scope.store)
				} else {
					getMuNumFun(muId,$scope.store)
				}
			}
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
			erp.load();
			getListFun(2);
			$scope.storeNumFlag = false;
			if($scope.isSelJqcz=='母订单号'){
				$scope.storeNumFlag = true;
			}
			if(muId||$scope.storeNumFlag){
				var inpVal = $.trim($('.c-seach-inp').val())
				if(inpVal){
					getMuNumFun(inpVal,$scope.store)
				} else {
					getMuNumFun(muId,$scope.store)
				}
			}
		}
		//履行列表
        $scope.selfun4 = function ($event) {
            $('.seach-ordnumstu').prop("checked", false);
            $scope.currtpage = 1;
            $scope.selstu = 3;
            $('.ord-fun-a').removeClass('ord-active');
            $($event.target).addClass('ord-active')
            $scope.fulfillment = '1';
            $scope.isfulfillment = true;
            getListFun(3);
            $scope.storeNumFlag = false;
            if($scope.isSelJqcz=='母订单号'){
            	$scope.storeNumFlag = true;
            }
            if(muId||$scope.storeNumFlag){
            	var inpVal = $.trim($('.c-seach-inp').val())
            	if(inpVal){
            		getMuNumFun(inpVal,$scope.store)
            	} else {
            		getMuNumFun(muId,$scope.store)
            	}
            }
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
			erp.load();
			getListFun(5);
			$scope.storeNumFlag = false;
			if($scope.isSelJqcz=='母订单号'){
				$scope.storeNumFlag = true;
			}
			if(muId||$scope.storeNumFlag){
				var inpVal = $.trim($('.c-seach-inp').val())
				if(inpVal){
					getMuNumFun(inpVal,$scope.store)
				} else {
					getMuNumFun(muId,$scope.store)
				}
			}
		}
        //批量同步至店铺 -- 履行列表
		$scope.BatchSynchronization = function(){
			var arr = [];
			var isSelect = false;
            $('#c-zi-ord .cor-check-box').each(function () {
                if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
                	console.log($(this).attr('data-id'));
                    var type = $(this).attr('data-type');
                    var id = $(this).attr('data-id');
                    isSelect = true;
                    if(type !== '0'){
                        layer.msg('只有等待履行状态的订单才可操作');
						return false;
					}else {
                    	console.log(123)
                        arr.push(id)
					}
                }
            })
			if(!isSelect){
                layer.msg('请先选择等待履行状态的订单');
				return;
            }
			if(arr.length>0){
                console.log(arr.join(','))
				var data = {
                	ids:arr.join(',')
				};
                erp.postFun('fulfillment/activeFulfillment', data, function (res) {
                    console.log(data);
                    if (res.data.statusCode == 200) {
                        layer.msg('同步成功');
                        $scope.fulfillment = '1';
                        $scope.isfulfillment = true;
                        getListFun(3);
                    }
                }, function (err) {
                    layer.msg('系统异常')
                })
            }
		}
		//同步至店铺 -- 履行列表
		$scope.Synchronization = function(item){
            var data = {
                ids:item.ID
            };
            erp.postFun('pojo/shopify/activeFulfillment', data, function (res) {
                console.log(data);
                if (res.data.statusCode == 200) {
                    layer.msg('同步成功');
                    $scope.fulfillment = '1';
                    $scope.isfulfillment = true;
                    getListFun(3);
                }
            }, function (err) {
                layer.msg('系统异常')
            })
		}
		//已生成追踪号
		$scope.selfun3 = function ($event) {
            $scope.isfulfillment = false;
            $('.seach-ordnumstu').prop("checked", false);
			$scope.currtpage = 1;
			$scope.selstu = 3;
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			getListFun(3);
			$scope.storeNumFlag = false;
			if($scope.isSelJqcz=='母订单号'){
				$scope.storeNumFlag = true;
			}
			if(muId||$scope.storeNumFlag){
				var inpVal = $.trim($('.c-seach-inp').val())
				if(inpVal){
					getMuNumFun(inpVal,$scope.store)
				} else {
					getMuNumFun(muId,$scope.store)
				}
			}
		}
		function getListFun(stu) {
			erp.load();
			var erpData = {};
			seltjFun(erpData);
			erpData.status = '10';
			erpData.page = 1;
			if (stu == 2) {
				erpData.ydh = 'all';
				erpData.disputeId = 'dispute';
				erpData.trackingnumberType = 'all';
			} else if (stu == 3) {
				erpData.ydh = 'y';
			} else if (stu == 1) {
				erpData.ydh = undefined;
			}
			erpData.cjOrderDateBegin = $('#c-data-time').val();
			erpData.cjOrderDateEnd = $('#cdatatime2').val();
			erpData.limit = $('#page-sel').val() - 0;
			if($scope.isfulfillment){
                erpData.fulfillment = $scope.fulfillment;
            }
			console.log(JSON.stringify(erpData))
			erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				var erporderResult = data.data;//存储订单的所有数据
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun($scope.erporderList);
				dealpage()
			}, function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
				// alert(2121)
			})
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
				//$('.orders-table .erporder-detail').removeClass('order-click-active');
			} else {
				//$('.orders-table .erpd-toggle-tr').hide();//隐藏所有的商品
				$(this).next().show();
				//$('.orders-table .erporder-detail').removeClass('order-click-active');
				$(this).addClass('order-click-active');
			}
		})
		$('.orders-table').on('mouseenter', '.ordlist-fir-td', function () {
			// $(this).parent('.erporder-detail').next().hide();
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
			} else {
				$(this).hide();
			}
		})
		$('.orders-table').mouseleave(function () {
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
		})
		//批量提交到拦截
		$scope.oneAddLanJieFun = function(item){
			$scope.itemId = item.ID;
			$scope.oneAddLanJieFlag = true;
		}
		$scope.oneSureLanJieFun = function(){
			erp.load();
			var addyfhData = {};
			addyfhData.ids = $scope.itemId;
			console.log(addyfhData)
			erp.postFun('erp/faHuo/addIntercept', JSON.stringify(addyfhData), function (data) {
				console.log(data)
				$scope.oneAddLanJieFlag = false;
				if (data.data.statusCode == '200') {
					var erpData = {};
					//判断是否生成追踪号
					if ($scope.selstu == 3) {
						erpData.ydh = 'y';
					}
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.status = '10';
					erpData.page = 1;
					erpData.limit = $('#page-sel').val() - 0;
					console.log(erpData)
					console.log(JSON.stringify(erpData))
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						console.log(data.data.productsList)
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
						dealpage();
					}, function () {
						layer.closeAll("loading")
					})
				} else {
					layer.closeAll("loading")
					layer.msg('拦截失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		var checdedIds;
		$scope.addLanJieFun = function(){
			var addyfhCount = 0;
			checdedIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					addyfhCount++;
					checdedIds += $(this).siblings('.hide-order-id').text() + ',';
				}
			})
			if (addyfhCount > 0) {
				$scope.isaddLjzFlag = true;
			} else {
				$scope.isaddLjzFlag = false;
				layer.msg('请选择订单')
			}
		}
		$scope.cancelAddLjzFun = function () {
			$scope.isaddLjzFlag = false;
			checdedIds = '';
		}
		$scope.sureAddLjzFun = function () {
			$scope.currtpage = 1;
			erp.load();
			var addyfhData = {};
			addyfhData.ids = checdedIds;
			erp.postFun('erp/faHuo/addIntercept', JSON.stringify(addyfhData), function (data) {
				console.log(data)
				$scope.isaddLjzFlag = false;
				if (data.data.statusCode == '200') {
					var erpData = {};
					//判断是否生成追踪号
					if ($scope.selstu == 3) {
						erpData.ydh = 'y';
					}
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.status = '10';
					erpData.page = 1;
					erpData.limit = $('#page-sel').val() - 0;
					console.log(erpData)
					console.log(JSON.stringify(erpData))
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						console.log(data.data.productsList)
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
						dealpage();
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				} else {
					layer.msg('批量提交到拦截中失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//批量提交到已发货
		$scope.isaddyfhFlag = false;
		var addyfhIds;
		$scope.bulkAddYfhFun = function () {
			var addyfhCount = 0;
			addyfhIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					addyfhCount++;
					addyfhIds += $(this).siblings('.hide-order-id').text() + ',';
				}
			})
			if (addyfhCount > 0) {
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
			addyfhData.type = 10;
			console.log(JSON.stringify(addyfhData))
			erp.postFun('app/order/nextFlow', JSON.stringify(addyfhData), function (data) {
				console.log(data)
				$scope.isaddyfhFlag = false;
				if (data.data.result == true) {
					var erpData = {};
					//判断是否生成追踪号
					if ($scope.selstu == 3) {
						erpData.ydh = 'y';
					}
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.status = '10';
					erpData.page = 1;
					erpData.limit = $('#page-sel').val() - 0;
					console.log(erpData)
					console.log(JSON.stringify(erpData))
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						console.log(data)
						layer.closeAll("loading")
						console.log(data.data.productsList)
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
						dealpage();
						if(muId||$scope.storeNumFlag||$scope.isSelJqcz=='母订单号'){
							var inpVal = $.trim($('.c-seach-inp').val())
							if(inpVal){
								getMuNumFun(inpVal,$scope.store)
							} else {
								getMuNumFun(muId,$scope.store)
							}
						}
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				} else {
					layer.msg('批量提交到已发货失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//单个提交到已发货
		$scope.singleisaddyfhFlag = false;
		var singleAddYfhId, singleAddYfhIndex;
		$scope.singleAddyfhFun = function (item, index) {
			$scope.singleisaddyfhFlag = true;
			singleAddYfhId = item.ID;
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
			addyfhData.type = 10;
			console.log(JSON.stringify(addyfhData))
			erp.postFun('app/order/nextFlow', JSON.stringify(addyfhData), function (data) {
				console.log(data)
				$scope.singleisaddyfhFlag = false;
				layer.closeAll("loading")
				if (data.data.result == true) {
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
		}
		//编辑弹框
		$scope.editFlag = false;
		$scope.editFun = function (item, $event, index) {
			$scope.itemIndex = index;
			$event.stopPropagation();
			$scope.editFlag = true;
			console.log(item)
			$scope.itemData = item;
			// console.log(item.CITY)
			// console.log(item.city)
			$scope.customerName = item.CUSTOMER_NAME;
			$scope.countryCode = item.COUNTRY_CODE;
			$scope.province = item.PROVINCE;
			$scope.city = item.CITY;
			$scope.shipAddress1 = item.SHIPPING_ADDRESS;
			$scope.shipAddress2 = item.shippingAddress2;
			$scope.zip = item.ZIP;
			$scope.phone = item.PHONE;
			$scope.logisticName = item.LOGISTIC_NAME;
			$scope.eMail = item.email;
		}
		//取消按钮
		$scope.closeFun = function () {
			$scope.editFlag = false;
		}
		//确定按钮
		$scope.confirmEditFun = function () {
			console.log($scope.itemIndex)
			console.log($scope.itemData)
			// erp.load();
			if($scope.countryCode&&$scope.countryCode.length>2){
				layer.msg('请填写二字简码')
				return
			}
			var pushData = {};
			pushData.id = $scope.itemData.ID;
			pushData.salesman = $scope.itemData.salesman;
			pushData.customerName = $scope.customerName;
			pushData.country = $scope.countryName||'';
			pushData.countryCode = $scope.countryCode;
			pushData.province = $scope.province;
			pushData.city = $scope.city;
			pushData.shipAddress1 = $scope.shipAddress1;
			pushData.shipAddress2 = $scope.shipAddress2;
			pushData.zip = $scope.zip;
			pushData.phone = $scope.phone;
			pushData.logisticName = $scope.logisticName;
			pushData.email = $scope.eMail;
			console.log(pushData);
			console.log(JSON.stringify(pushData))
			erp.postFun('app/order/updateERPOrder', JSON.stringify(pushData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.editFlag = false;
				if (data.data.result == 1) {
					layer.msg('修改成功')
					console.log($scope.erporderList[$scope.itemIndex])
					$scope.erporderList[$scope.itemIndex].order.CUSTOMER_NAME = $scope.customerName;
					$scope.erporderList[$scope.itemIndex].order.COUNTRY_CODE = $scope.countryCode;
					$scope.erporderList[$scope.itemIndex].order.PROVINCE = $scope.province;
					$scope.erporderList[$scope.itemIndex].order.CITY = $scope.city;
					$scope.erporderList[$scope.itemIndex].order.SHIPPING_ADDRESS = $scope.shipAddress1;
					$scope.erporderList[$scope.itemIndex].order.shippingAddress2 = $scope.shipAddress2;
					$scope.erporderList[$scope.itemIndex].order.ZIP = $scope.zip;
					$scope.erporderList[$scope.itemIndex].order.PHONE = $scope.phone;
					console.log($scope.erporderList[$scope.itemIndex].order)

				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				layer.msg('修改响应失败')
				console.log(data)
			})
		}
		$scope.oneBzxCjPacketFun = function(){
			$scope.oneIsZCjpacketFlag = false;
			$scope.showindex = 4;//直接归到综合物流去
		}
		$scope.oneZxCjPacketFun = function(){
			$scope.oneIsZCjpacketFlag = false;
			$scope.showindex = 25;//cjpacket 中转
		}
		function creatTrackFun(ids,timer){
			console.log(timer)
			erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
				if(timer){
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
			if(item.MERCHANTN_NUMBER == '0d98c91b3ed64b0a9ced9bdef3bb8c32'){
				layer.msg('该订单为测试账号订单')
				return;
			}

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
			$scope.oneordId = item.ID;
			$scope.postNlCount = 0;
			$scope.sanTaiNum = 0;
			var sTAuIds = '',
				sTCaIds = '',
				sTDeZxIds = '',
				sTDeThIds = '',
				sTMxIds = '',
				sTUsIds = '',
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
			    stGBIds = '';
			var spCountNum = 0;
			$scope.teDingGuoJiaCjpacketCount = 0;
			var $sptdObj = $($event.target).parent().parent().parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
			var itemSpline = $($event.target).parent().parent().parent().parent().siblings('.erpd-toggle-tr').find('.pro-item-sp');
			console.log($sptdObj.children('.sp-sx-span').text())
			var isCjPacketFlag = true;
			if(item.ORDERWEIGHT>285 && item.COUNTRY_CODE == 'US'&&($scope.store==0||$scope.store==1)){

				spCountNum = ordItem.product.length;
				var strSpSxList1 = '';
				if (spCountNum > 0) {
					for (var i = 0; i < spCountNum; i++) {
						strSpSxList1 += ordItem.product[i].PROPERTY + ',';
					}
				}
				var sxArr1 = strSpSxList1.split(',');
				sxArr1.pop();
				var oneIsgjCommonFlag = false;
				for (var j = 0; j < sxArr1.length; j++) {
					if (sxArr1[j] != 'COMMON') {
						oneIsgjCommonFlag = false;
						break;
					} else {
						oneIsgjCommonFlag = true;
					}
				}
				//之前普货的判断
				if ($scope.store==0&&oneIsgjCommonFlag&&(item.LOGISTIC_NAME=='Wedenpost'||item.LOGISTIC_NAME=='ePacket'||item.LOGISTIC_NAME=='Pos Malaysia'||item.LOGISTIC_NAME=='MYSG'||item.LOGISTIC_NAME=='Bpost'||item.LOGISTIC_NAME=='Singpost'||item.LOGISTIC_NAME=='HKpost'||item.LOGISTIC_NAME=='Turkey Post'||item.LOGISTIC_NAME=='Swiss Post'||item.LOGISTIC_NAME=='China Post Registered Air Mail'||item.LOGISTIC_NAME=='La Poste'||item.LOGISTIC_NAME=='DHL Paket'||item.LOGISTIC_NAME=='BPost+'||item.LOGISTIC_NAME=='Korea Post'||item.LOGISTIC_NAME=='CJ Liquid'||item.LOGISTIC_NAME=='CJ Liquid Direct Line'||item.LOGISTIC_NAME=='CJ Liquid Post'||item.LOGISTIC_NAME=='Grand Slam'||item.LOGISTIC_NAME=='YanWen'||item.LOGISTIC_NAME=='S.F China Domestic'||item.LOGISTIC_NAME=='YTO China Domestic'||item.LOGISTIC_NAME=='South Africa Special Line'||item.LOGISTIC_NAME=='Brazil special line'||item.LOGISTIC_NAME=='Electric PostNL'||item.LOGISTIC_NAME=='CJPacket')) {
					$scope.usZhwlNum++;
					// $scope.showindex = 25;
					isCjPacketFlag = false;
					$scope.oneIsZCjpacketFlag = true;
					$scope.cjpacketSxText = '普货';
					$scope.transferCjpacketType = undefined;
				}
				//其它属性 单品的判断
				if(spCountNum==1){
					if(sxArr1.length==1){
						if(sxArr1[0]=='EDGE'){//尖锐
							$scope.usZhwlNum++;
							isCjPacketFlag = false;
							$scope.oneIsZCjpacketFlag = true;
							$scope.transferCjpacketType = 4;
							$scope.cjpacketSxText = '尖锐';
						}else if(sxArr1[0]=='ELECTRONIC'||sxArr1[0]=='BATTERY'||sxArr1[0]=='BATTERY'){//带电
							$scope.usZhwlNum++;
							isCjPacketFlag = false;
							$scope.oneIsZCjpacketFlag = true;
							$scope.transferCjpacketType = 1;
							$scope.cjpacketSxText = '带电';
						}else if(sxArr1[0]=='HAVE_LIQUID'){//含液体
							$scope.usZhwlNum++;
							isCjPacketFlag = false;
							$scope.oneIsZCjpacketFlag = true;
							$scope.cjpacketSxText = '液体';
							$scope.transferCjpacketType = 2;
						}else if(sxArr1[0]=='HAVE_CREAM'){//含膏体
							$scope.usZhwlNum++;
							isCjPacketFlag = false;
							$scope.oneIsZCjpacketFlag = true;
							$scope.cjpacketSxText = '膏体';
							$scope.transferCjpacketType = 3;
						}
					}else if(sxArr1.length>1){
						$scope.usZhwlNum++;
						isCjPacketFlag = false;
						$scope.oneIsZCjpacketFlag = true;
						$scope.cjpacketSxText = '敏感';
						$scope.transferCjpacketType = 5;
					}
				}
			}
			if(isCjPacketFlag){
				if (item.LOGISTIC_NAME == 'ePacket' && item.COUNTRY_CODE == 'US' && item.ORDERWEIGHT <= 1000) {
					// console.log('符合转顺丰国际官方')
					var itemSpNum1 = ordItem.product.length;
					// console.log(itemSpNum1)
					// console.log(ordItem.product)
					var strSpSxList1 = '';
					if (itemSpNum1 > 0) {
						for (var i = 0; i < itemSpNum1; i++) {
							strSpSxList1 += ordItem.product[i].PROPERTY + ',';
						}
					}
					var sxArr1 = strSpSxList1.split(',');
					sxArr1.pop();
					var oneIsgjCommonFlag = false;
					for (var j = 0; j < sxArr1.length; j++) {
						if (sxArr1[j] != 'COMMON' && sxArr1[j] != 'ELECTRONIC' && sxArr1[j] != 'BATTERY') {
							oneIsgjCommonFlag = false;
							break;
						} else {
							oneIsgjCommonFlag = true;
						}
					}
					if (oneIsgjCommonFlag) {
						$scope.toSFGJNum++;
						toSFGJIds = item.ID + ',';
					}
				}
				
				if (item.LOGISTIC_NAME == 'ePacket' && item.COUNTRY_CODE == 'US' && item.ORDERWEIGHT > 1600) {
					// console.log('符合转顺丰特惠')
					var itemSfthSpNum = ordItem.product.length;
					var strSfthSpSxList = '';
					if (itemSfthSpNum > 0) {
						for (var i = 0; i < itemSfthSpNum; i++) {
							strSfthSpSxList += ordItem.product[i].PROPERTY + ',';
						}
					}
					var sfthSxArr = strSfthSpSxList.split(',');
					sfthSxArr.pop();
					var sfthIsCommonFlag = false;
					for (var j = 0; j < sfthSxArr.length; j++) {
						if (sfthSxArr[j] != 'COMMON') {
							sfthIsCommonFlag = false;
							break;
						} else {
							sfthIsCommonFlag = true;
						}
					}
					if (sfthIsCommonFlag) {
						$scope.toSFTHNum++;
						toSFTHIds = item.ID + ',';
					}
				}
				if (item.LOGISTIC_NAME == 'CJPacket' && item.COUNTRY_CODE == 'US' && item.ORDERWEIGHT <= 2000) {
					// console.log('符合转epacket')
					var itemSfthSpNum = ordItem.product.length;
					var strSfthSpSxList = '';
					if (itemSfthSpNum > 0) {
						for (var i = 0; i < itemSfthSpNum; i++) {
							strSfthSpSxList += ordItem.product[i].PROPERTY + ',';
						}
					}
					var sfthSxArr = strSfthSpSxList.split(',');
					sfthSxArr.pop();
					var sfthIsCommonFlag = false;
					for (var j = 0; j < sfthSxArr.length; j++) {
						if (sfthSxArr[j] != 'COMMON') {
							sfthIsCommonFlag = false;
							break;
						} else {
							sfthIsCommonFlag = true;
						}
					}
					if (sfthIsCommonFlag) {
						$scope.cjpacket2epacketNum++;
						toEpacketIds = item.ID + ',';
					}
				}
				if (item.COUNTRY_CODE == 'TH' && item.LOGISTICSMODE != 'COD' && (item.MERCHANTN_NUMBER=='b7234b0c6d6e456cb261bbcd142c6d42'|| item.MERCHANTN_NUMBER == 'abbbda4d662340e1876076ad0accd5fe')){
					$scope.toThCoeNum++;
					toThCoeIds = item.ID + ',';
				}
				if ($scope.store == 4 && item.COUNTRY_CODE == 'TH' && item.LOGISTICSMODE == 'COD' && (item.MERCHANTN_NUMBER=='b7234b0c6d6e456cb261bbcd142c6d42'|| item.MERCHANTN_NUMBER == 'abbbda4d662340e1876076ad0accd5fe')){
					$scope.qtwlordNum++;
					$scope.showindex = 4;
				}else{
					if (item.LOGISTIC_NAME == 'ePacket') {//$(this).parent().parent().siblings('.wl-ord-td').children('.wl-name-p').text()
						if (item.COUNTRY_CODE == 'GB' || item.COUNTRY_CODE == 'DE' || item.COUNTRY_CODE == 'IN' || item.COUNTRY_CODE == 'ES' || item.COUNTRY_CODE == 'BE' || item.COUNTRY_CODE == 'DK') {
							if (0 <= item.ORDERWEIGHT <= 2000) {
								var itemSpNum = ordItem.product.length;
								var strSpSxList = '';
								if (itemSpNum > 0) {
									for (var i = 0; i < itemSpNum; i++) {
										strSpSxList += ordItem.product[i].PROPERTY + ',';
									}
								}
								// console.log(strSpSxList)
								var sxArr = strSpSxList.split(',');
								sxArr.pop();
								// console.log()
								// console.log(sxArr)
								var isCommonFlag = false;
								for (var j = 0; j < sxArr.length; j++) {
									if (sxArr[j] != 'COMMON') {
										isCommonFlag = false;
										break;
									} else {
										isCommonFlag = true;
									}
								}
								if (isCommonFlag) {
									$scope.epack2yanwen++;
									epack2ywIds += item.ID + ',';
								}
							}
						}
						if ($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0) {
							$scope.ddepackNum++;
							$scope.showindex = 1;
							// console.log('判断带电的条件')
						} else if ($sptdObj.children('.sp-sx-span').text().indexOf('膏') >= 0||$sptdObj.children('.sp-sx-span').text().indexOf('液') >= 0) {
							if(isOneSxFun(itemSpline,'HAVE_CREAM')||$sptdObj.children('.sp-sx-span').text().indexOf('液') >= 0){
								$scope.gzepackNum++;
								$scope.showindex = 9;
							}else{
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
					else if (item.LOGISTIC_NAME == 'DHL') {//$(this).parent().parent().siblings('.wl-ord-td').children('.wl-name-p').text()
						
						if ($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0) {
							$scope.onedhlddNum++;
							$scope.showindex = 11;
							// console.log('判断带电dhl的条件')
						} else {
							if(item.ORDERWEIGHT<2000){
								$scope.dhlGfNum++;
								$scope.showindex = 19;
							}else{
								$scope.onedhlnotdNum++;
								$scope.showindex = 12;
							}
						}
					}
					else if (item.LOGISTIC_NAME == 'DHL Official') {
						let itemSpLineLength = ordItem.product.length;
						let isNullHghFlag = false;
						if (itemSpLineLength > 0) {
							for (let i = 0; i < itemSpLineLength; i++) {
								if(!ordItem.product[i].entryCode){
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
					else if (item.LOGISTIC_NAME == 'CJ Normal Express') {
						if (item.ORDERWEIGHT > 1000 && item.ORDERWEIGHT <= 1600) {
							$scope.nfSfNum++;
							$scope.showindex = 15;
						} else if (item.ORDERWEIGHT > 1600 || item.ORDERWEIGHT <= 1000) {
							$scope.ttSfNum++;
							$scope.showindex = 16;
						}
					}
					else if (item.LOGISTIC_NAME == 'USPS') {
						if (item.ORDERWEIGHT <= 170&&$sptdObj.children('.sp-sx-span').text().indexOf('电') == -1&&$sptdObj.children('.sp-sx-span').text().indexOf('液') == -1&&$sptdObj.children('.sp-sx-span').text().indexOf('膏') == -1) {
							$scope.toDhlXiaoBaoNum++
							usps2DhlXiaoBaoIds=item.ID + ',';
						}
						$scope.uspsNum++;
						$scope.showindex = 3;
						usps2uspsPlusIds = item.ID;
						// console.log('判断usps物流的条件')
					}
					else if (item.LOGISTIC_NAME == 'China Post Registered Air Mail') {
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
					else if (item.LOGISTIC_NAME == 'DG Epacket') {
						$scope.dgEpacketNum++;
						$scope.showindex = 37;
					}
					else if (item.LOGISTIC_NAME == 'BJ cosmetics epacket') {
						$scope.bHepacketNum++;
						$scope.showindex = 38;
					}
					else if (item.LOGISTIC_NAME == 'SFC Brazil line') {
						$scope.sfcBrazilLineNum++;
						$scope.showindex = 39;
					}
					else if (item.LOGISTIC_NAME == 'USPS+'&&$sptdObj.children('.sp-sx-span').text().indexOf('电') == -1&&$sptdObj.children('.sp-sx-span').text().indexOf('液') == -1&&$sptdObj.children('.sp-sx-span').text().indexOf('膏') == -1) {
						if (item.ORDERWEIGHT <= 170) {
							$scope.toDhlXiaoBaoNum++
							usps2DhlXiaoBaoIds=item.ID + ',';
						}
						$scope.uspsPlusNum++;
						$scope.showindex = 7;
						// console.log('判断usps+物流的条件')
					}
					else if (item.LOGISTIC_NAME == 'CJPacket SEA Express') {
						$scope.cjpacketSeaExpCount++;
						$scope.showindex = 42;
						// console.log('嘉里空运')
					}
					else if (item.LOGISTIC_NAME.indexOf('YunExpress') >= 0) {
						$scope.ytNum++;
						$scope.showindex = 10;
						// console.log('判断云途物流的条件')
					}
					else if (item.LOGISTIC_NAME == 'DHL eCommerce') {
						$scope.dhlXiaoBaoNum++;
						$scope.showindex = 23;
					}
					else if (item.LOGISTIC_NAME == 'DHL HongKong') {
						$scope.hkDhlNum++;
						$scope.showindex = 34;
					}
					else if(item.LOGISTIC_NAME == 'YanWen'){
						if(item.ORDERWEIGHT <= 2000){
							var itemSfthSpNum = ordItem.product.length;
							var strSfthSpSxList = '';
							if (itemSfthSpNum > 0) {
								for (var i = 0; i < itemSfthSpNum; i++) {
									strSfthSpSxList += ordItem.product[i].PROPERTY + ',';
								}
							}
							var sfthSxArr = strSfthSpSxList.split(',');
							sfthSxArr.pop();
							var sfthIsCommonFlag = false;
							for (var j = 0; j < sfthSxArr.length; j++) {
								if (sfthSxArr[j] != 'COMMON') {
									sfthIsCommonFlag = false;
									break;
								} else {
									sfthIsCommonFlag = true;
								}
							}
							if (sfthIsCommonFlag) {
								$scope.showindex = 26;
								$scope.yanWenNum++;
							}else{
								$scope.qtwlordNum++;
								$scope.showindex = 4;
							}
						}else{
							$scope.qtwlordNum++;
							$scope.showindex = 4;
						}
					}
					else if (item.LOGISTIC_NAME == 'Jewel Shipping') {
						$scope.jewelNum++;
						$scope.showindex = 30;
					}
					else if (item.LOGISTIC_NAME == 'Jewel Shipping+') {
						$scope.jewelPlusNum++;
						$scope.showindex = 31;
					}
					else if (item.LOGISTIC_NAME == 'Jewel Shipping Flat' || item.LOGISTIC_NAME == 'Jewel Shipping Flat+') {
						$scope.jewelFlatNum++;
						$scope.showindex = 35;
					}
					else if (item.LOGISTIC_NAME == 'YL Columbia line') {
						$scope.ylColumbiaNum++;
						$scope.showindex = 40;
					}
					else if (item.LOGISTIC_NAME == 'YL Peru line') {
						$scope.ylPeruNum++;
						$scope.showindex = 41;
					}
					else if(item.LOGISTIC_NAME == 'CJPacket'){
						var itemSfthSpNum = ordItem.product.length;
						var strSfthSpSxList = '';
						if (itemSfthSpNum > 0) {
							for (var i = 0; i < itemSfthSpNum; i++) {
								strSfthSpSxList += ordItem.product[i].PROPERTY + ',';
							}
						}
						var sxArr1 = strSfthSpSxList.split(',');
						sxArr1.pop();
						if(item.COUNTRY_CODE=='AU'){
							$scope.sanTaiNum++;
							sTAuIds = item.ID;
							$scope.showindex = 33;
						}else if(item.COUNTRY_CODE=='CA'){
							$scope.sanTaiNum++;
							sTCaIds = item.ID;
							$scope.showindex = 33;
						}else if(item.COUNTRY_CODE=='DE'){
							// if(sxBooleanFun1(sxArr1,'','BATTERY','ELECTRONIC','','')){
								//德国专线
								$scope.sanTaiNum++;
								sTDeZxIds = item.ID;
								$scope.showindex = 33;
							// }else{
							// 	//德国专线特惠
							// 	$scope.sanTaiNum++;
							// 	sTDeThIds = item.ID;
							// 	$scope.showindex = 33;
							// }
						}else if(item.COUNTRY_CODE=='MX'){
							$scope.sanTaiNum++;
							sTMxIds = item.ID;
							$scope.showindex = 33;
						}else if(item.COUNTRY_CODE=='US'){
							$scope.sanTaiNum++;
							sTUsIds = item.ID;
							$scope.showindex = 33;
						}
						else if(item.COUNTRY_CODE=='AT' || item.COUNTRY_CODE=='CH' || item.COUNTRY_CODE=='SE' || item.COUNTRY_CODE=='FR' || item.COUNTRY_CODE=='NL' || item.COUNTRY_CODE=='BE' || item.COUNTRY_CODE=='LU'){
							$scope.sanTaiNum++;
							// $scope.showindex = 33;
							// yTDdIds += $(this).siblings('.hide-order-id').text() + ',';
							yTDdIds = item.ID + ',';
							// if($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0){
							// 	yTDdIds = item.ID + ',';
							// }else {
							// 	yTBddIds = item.ID + ',';
							// }
						}else if(item.COUNTRY_CODE=='IT' || item.COUNTRY_CODE=='DK'){//不需要判断是否带电 mode按带电传
							$scope.sanTaiNum++;
							$scope.showindex = 33;
							yTDdIds = item.ID + ',';
						}
						else if(item.COUNTRY_CODE=='KR'){
							$scope.sanTaiNum++;
							$scope.showindex = 33;
							yTYdsKrIds = item.ID + ',';
						}
						else if(item.COUNTRY_CODE=='IN'||item.country_code=='FI'){
							$scope.sanTaiNum++;
							$scope.showindex = 33;
							if($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0){
								yTGbDdIds = item.ID + ',';
							}else {
								yTGbBddIds = item.ID + ',';
							}
						}
						else if(item.COUNTRY_CODE=='GB'){
							$scope.sanTaiNum++;
							$scope.showindex = 33;
							stGBIds = item.ID;
						}
						else if(item.COUNTRY_CODE=='BR'){
							$scope.sanTaiNum++;
							yTBrIds = item.ID;
							$scope.showindex = 33;
						}else if(item.COUNTRY_CODE=='ES'){
							$scope.sanTaiNum++;
							yTEsIds = item.ID;
							$scope.showindex = 33;
						}else if(item.COUNTRY_CODE=='TH'||item.COUNTRY_CODE== 'MY'||item.COUNTRY_CODE== "PH"||item.COUNTRY_CODE== 'VN'||item.COUNTRY_CODE== 'SG'||item.COUNTRY_CODE== 'TW'||item.COUNTRY_CODE== 'ID'){
							$scope.teDingGuoJiaCjpacketCount++;
							$scope.showindex = 33;
							$scope.sanTaiNum++;
						}else{
							$scope.qtwlordNum++;
							$scope.showindex = 4;
						}
					}
					else if(item.LOGISTIC_NAME == 'CJPacket-Tha'||item.LOGISTIC_NAME == 'CJPacket-Supplier'){
						if(item.COUNTRY_CODE=='TH'||item.COUNTRY_CODE== 'VN'){
							$scope.teDingGuoJiaCjpacketCount++;
							$scope.showindex = 33;
							$scope.sanTaiNum++;
						}else{
							$scope.qtwlordNum++;
							$scope.showindex = 4;
						}
					}
					else if(item.LOGISTIC_NAME == 'PostNL'){
						$scope.postNlCount++;
						$scope.showindex = 43;
					}
					else if(item.LOGISTIC_NAME == 'CJCOD'){
						$scope.cjCodNum++;
						$scope.showindex = 44;
					}
					else {
						$scope.qtwlordNum++;
						$scope.showindex = 4;
					}
				}
				
			}
			$scope.oneisydFlag = true;//单独操作生成运单号的弹框
			$scope.cjCodFun= function (stu) {
				if ($('.oneqd-sel44').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel44').val();
				updata.enName = 'CJCOD';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.cjpacketSea = function(stu){
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
						ids.loginName = erpLoginName;
						if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
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
						if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
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
						if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
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
						if (stu==1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids,timer)
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
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
						if (stu==1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids,timer)
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
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
						if (stu==1) {
							ids.auto = 'n';
						}
						creatTrackFun(ids,timer)
					// }
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.hkDhlFun = function (stu) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
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
				if(sTAuIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTAuIds,'AUEXPIE','义乌三态物流澳洲专线')):stCsArr.push(stCsFun(sTAuIds,'AUEXPIE','深圳三态物流澳洲专线'))
					cjpacketIds += sTAuIds;
				}
				if(sTCaIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTCaIds,'CAEXPFS','义乌三态物流加拿大专线')):stCsArr.push(stCsFun(sTCaIds,'CAEXPFS','深圳三态物流加拿大专线'))
					cjpacketIds += sTCaIds;
				}
				if(sTUsIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTUsIds,'E3','顺丰小包')):stCsArr.push(stCsFun(sTUsIds,'E3','顺丰小包'))
					cjpacketIds += sTUsIds;
				}
				if(sTDeZxIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTDeZxIds,'SFCQMDER','义乌三态快邮德国小包挂号')):stCsArr.push(stCsFun(sTDeZxIds,'SFCQMDER','深圳三态快邮德国小包挂号'))
					cjpacketIds += sTDeZxIds;
				}
				if(sTDeThIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTDeThIds,'DEEXPLS','义乌三态物流德国专线特惠')):stCsArr.push(stCsFun(sTDeThIds,'DEEXPLS','深圳三态物流德国专线特惠'))
					cjpacketIds += sTDeThIds;
				}
				if(sTMxIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTMxIds,'MXEXP','义乌三态物流墨西哥专线')):stCsArr.push(stCsFun(sTMxIds,'MXEXP','深圳三态物流墨西哥专线'))
					cjpacketIds += sTMxIds;
				}
				if(yTBddIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTBddIds,'YW-THPHR','义乌云途专线全球挂号')):stCsArr.push(stCsFun(yTBddIds,'SZ-THPHR','深圳云途专线全球挂号'))
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
					whereTarget=='YW'?stCsArr.push(stCsFun(stGBIds,'RM2R','义乌三态英国经济专线')):stCsArr.push(stCsFun(stGBIds,'RM2R','深圳三态英国经济专线'))
					cjpacketIds += stGBIds;
				}

				erp.load();
				if($scope.teDingGuoJiaCjpacketCount>0){
					var updata = {};
					updata.ids = $scope.oneordId;
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
							if (stu==1) {
								ids.auto = 'n';
							}
							creatTrackFun(ids,timer)
						}
					}, function (data) {
						layer.closeAll("loading")
					})
				}else{
					var updata = {};
					updata.list = stCsArr;
					updata.enName = 'CJPacket';
					updata.loginName = erpLoginName;
					erp.postFun('app/erplogistics/updateCJPacketOrderLogistic', JSON.stringify(updata), function (data) {
						
						console.log(data)
						if (data.data.result > 0) {
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
							ids.ids = cjpacketIds;
							ids.loginName = erpLoginName;
							ids.shenzhen = diQu;
							if (stu==1) {
								ids.auto = 'n';
							}
							creatTrackFun(ids,timer)
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
							erp.postFun2('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
								console.log(data)
							},function(data){
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
			$scope.cjPacketFun = function(stu){
				erp.load();
				$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
				var ids = {};
				ids.ids = $scope.oneordId;
				ids.loginName = erpLoginName;
				if(stu==1){
					ids.auto = 'n';
				}
				creatTrackFun(ids)
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
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						let diQu;
						if ($scope.whereYanWen == 'shenZhen') {
							diQu = 'y';
						} else {
							diQu = '';
						}
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						ids.shenzhen = diQu;
						creatTrackFun(ids)
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
				if ($('.qd-onesel43').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn43').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-onesel43').val();
				updata.enName = '美国专线';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.nfsfFun = function (stu) {//南风顺丰
				if ($('.qd-onesel15').val() == '请选择') {
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-onesel15').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.ttsfFun = function (stu) {//泰腾顺丰
				if ($('.qd-onesel16').val() == '请选择') {
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.qd-onesel16').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.ddepackFun = function (stu) {//带电E邮宝
				if ($('.oneqd-sel1').val() == '请选择') {
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel1').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.bddepackFun = function (stu) {//不带电E邮宝
				if ($('.oneqd-sel2').val() == '请选择') {
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel2').val();
				updata.enName = 'epacket';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.dhlOfficialFun = function (stu) {//官方dhl
				if(!$scope.oneWhereDhl){
					layer.msg('请选择')
					return
				}else{
					var diQu = '';
					if ($scope.oneWhereDhl=='shenZhen') {
						diQu = 'y';
					} else {
						diQu = '';
					}
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = "DHLGF#DHL不带电";
				updata.enName = 'DHL Official';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.shenzhen = diQu;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.hcepackFun = function (stu) {//含磁E邮宝
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.gzepackFun = function (stu) {//膏状E邮宝+
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				// if ($scope.store==0||$scope.store==1) {
				// 	updata.logisticsName = 'Shipstation#USPS-'+$scope.uspsDiQu;
				// } else {
				// 	updata.logisticsName = 'Shipstation#Shipstation'
				// }
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				// if ($scope.store==0||$scope.store==1) {
				// 	updata.logisticsName = 'Shipstation#USPS-'+$scope.uspsDiQu;
				// } else {
				// 	updata.logisticsName = 'Shipstation#Shipstation'
				// }
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
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
				// if ($('.oneqd-sel4').val() == '请选择') {
				// 	layer.msg('请选择物流渠道')
				// 	return;
				// }
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				// updata.logisticsName = $('.oneqd-sel4').val();
				updata.logisticsName = 'Shipstation#Shipstation';
				// if ($scope.store==0||$scope.store==1) {
				// 	updata.logisticsName = 'Shipstation#USPS-'+$scope.uspsDiQu;
				// } else {
				// 	updata.logisticsName = 'Shipstation#Shipstation'
				// }
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					layer.closeAll("loading")
				})
			}
			$scope.bdyzxbFun = function (stu) {//不带电邮政小包
				if ($('.oneqd-sel6').val() == '请选择') {
					layer.msg('请选择物流渠道')
					return;
				}
				erp.load();
				var updata = {};
				updata.orderNum = $scope.oneordId;
				updata.logisticsName = $('.oneqd-sel6').val();
				updata.enName = 'China Post Registered Air Mail';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				// if ($scope.store==0||$scope.store==1) {
				// 	updata.logisticsName = 'Shipstation#USPSPLUS-'+$scope.uspsPlusDiQu;
				// } else {
				// 	updata.logisticsName = 'Shipstation#Shipstation'
				// }
				updata.enName = 'USPS+';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
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
				// if ($scope.store==0||$scope.store==1) {
				// 	updata.logisticsName = 'Shipstation#USPSPLUS-'+$scope.uspsPlusDiQu;
				// } else {
				// 	updata.logisticsName = 'Shipstation#Shipstation'
				// }
				updata.enName = 'USPS+';
				updata.loginName = erpLoginName;
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {

					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
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
				if(stu==1){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					
					$scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
					if (data.data.result > 0) {
						var ids = {};
						ids.ids = $scope.oneordId;
						ids.loginName = erpLoginName;
						if(stu==1){
							ids.auto = 'n';
						}
						creatTrackFun(ids)
					}
				}, function (data) {
					
					layer.closeAll("loading")
				})
			}
		}

		//单独生成运单号的关闭按钮
		$scope.oneisydCloseFun = function () {
			$scope.oneisydFlag = false;
			$scope.sess = 0;//存储成功的个数
			$scope.error = 0;//存储失败的个数

			erp.load();
			var erpData = {};
			//判断是不是状态1未生成追踪号的订单
			if ($scope.selstu > 1) {
				erpData.ydh = 'y';
			} else {
				erpData.ydh = '';
			}
			//判断是否生成追踪号
			if ($scope.selstu == 3) {
				erpData.ydh = 'y';
			}
			seltjFun(erpData);
			erpData.cjOrderDateBegin = $('#c-data-time').val();
			erpData.cjOrderDateEnd = $('#cdatatime2').val();
			erpData.status = '10';
			erpData.page = $scope.currtpage;
			erpData.limit = $('#page-sel').val() - 0;
            if($scope.isfulfillment){
                erpData.fulfillment = $scope.fulfillment;
            }
			erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
				layer.closeAll("loading")
				var erporderResult = data.data;//存储订单的所有数据
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun($scope.erporderList);
				dealpage()
				if(muId||$scope.storeNumFlag||$scope.isSelJqcz=='母订单号'){
					var inpVal = $.trim($('.c-seach-inp').val())
					if(inpVal){
						getMuNumFun(inpVal,$scope.store)
					} else {
						getMuNumFun(muId,$scope.store)
					}
				}
			}, function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
				// alert(2121)
			})
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
			var upData = {};
			if ($scope.shoptype == "Excel Imported") {
				upData.excelId = $scope.itemId;
			} else {
				upData.shopId = $scope.itemId;
			}
			erp.load();
			erp.postFun('app/order/fulfilOrder', JSON.stringify(upData), function (data) {
				if (data.data.result) {
					layer.msg('同步成功')
					var erpData = {};
					//判断是否生成追踪号
					if ($scope.selstu == 3) {
						erpData.ydh = 'y';
					}
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.status = '10';
					erpData.page = $scope.currtpage;
					erpData.ydh = 'y';
					erpData.limit = $('#page-sel').val() - 0;
                    if($scope.isfulfillment){
                        erpData.fulfillment = $scope.fulfillment;
                    }
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
						dealpage()
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
						// alert(2121)
					})
				} else {
					layer.closeAll("loading")
					layer.msg('同步失败')
				}
			}, function (data) {
				layer.closeAll("loading")
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
			selIds = '';
			var selCount = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					selCount++;
					selIds += $(this).siblings('.hide-order-id').text() + ',';
				}
			})
			if (selCount < 1) {
				layer.msg('请选择订单')
				return;
			} else {
				$scope.chengeWlFlag = true;
			}
		}
		$scope.sureChangeWlFun = function () {
			if ($scope.changeWlName) {
				erp.load(2)
				var chageData = {};
				chageData.ids = selIds;
				chageData.name = $scope.changeWlName;
				erp.postFun('app/order/replaceLogistics', JSON.stringify(chageData), function (data) {
					console.log(data)
					$scope.chengeWlFlag = false;
					if (data.data.code > 0) {
						getListFun(1);
						layer.msg('修改成功')
					} else {
						layer.closeAll("loading");
						layer.msg('修改失败')
					}
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
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

		// $('#wl-change-sel').change(function () {
		// 	alert($(this).val())
		// })
		//关闭弹窗
		$scope.closewltcFun = function () {
			$scope.wlChangeFlag = false;
		}
		//epack转燕文
		$scope.epack2yanwenFun = function () {
			var epaUpIds = {};
			epaUpIds.ids = epack2ywIds;
			console.log(epack2ywIds)
			erp.postFun('app/order/updateLogisticYanWen', JSON.stringify(epaUpIds), function (data) {
				console.log(data)
				$scope.undeclareList = data.data.undeclare;
				console.log($scope.undeclareList)
				$scope.undeclareLength = $scope.undeclareList.length;
				if (data.data.result > 0) {
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
			erp.postFun('erp/logisticName/updateLogisticSFEE', JSON.stringify(sfgjUpIds), function (data) {
				console.log(data)
				if (data.data.result > 0) {
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
			erp.postFun('erp/logisticName/updateLogisticSFEE', JSON.stringify(sfgjUpIds), function (data) {
				console.log(data)
				if (data.data.result > 0) {
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
			erp.postFun('erp/logisticName/updateLogisticSFEE', JSON.stringify(sfgjUpIds), function (data) {
				console.log(data)
				if (data.data.result > 0) {
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
			erp.postFun('erp/logisticName/updateLogisticSFEE', JSON.stringify(sfgjUpIds), function (data) {
				console.log(data)
				if (data.data.result > 0) {
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
			erp.postFun('app/order/updateLogisticDHL', JSON.stringify(dhlUpIds), function (data) {
				console.log(data)
				if (data.data.result > 0) {
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
			erp.postFun('app/order/updateLogisticFedEx', JSON.stringify(dhlUpIds), function (data) {
				console.log(data)
				if (data.data.result > 0) {
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
			erp.postFun('app/order/updateLogistic', JSON.stringify(uspsUpIds), function (data) {
				console.log(data)
				if (data.data.result > 0) {
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
			stCsArr.push(stCsFun(toThCoeIds,'COD','CJCOD'))
			var updata = {};
			updata.list = stCsArr;
			updata.enName = 'CJPacket';
			updata.loginName = erpLoginName;
			erp.postFun('app/erplogistics/updateCJPacketOrderLogistic', JSON.stringify(updata), function (data) {
				console.log(data)
				if (data.data.result > 0) {
					layer.msg('修改成功')
					closeAllTk()
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.usps2DHLXiaoBaoFun = function(){
			var uspsUpIds = {};
			uspsUpIds.ids = usps2DhlXiaoBaoIds;
			uspsUpIds.status = 2;
			erp.postFun('app/order/updateLogistic', JSON.stringify(uspsUpIds), function (data) {
				console.log(data)
				if (data.data.result > 0) {
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
			$scope.cjpacket2epacketNum=0;
			$scope.oneisydFlag = false;//关闭单个生成的弹框
			$scope.isydCloseFun();
		}
		//点击数字查看
		$scope.cjToEpacketNumFun = function(){
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
		$scope.thCodNumFun = function(){
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

		$('.scyd-box').mouseenter(function(event) {
			$(this).children('.scyd-ul-list').show()
		});
		$('.scyd-box').mouseleave(function(event) {
			$('.scyd-ul-list').hide()
		});
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
		//询问运单号的弹框  批量生成运单号
		$scope.isydFlag = false;
		var usps2uspsPlusIds = '';//usps转usps+
		var epack2ywIds = '';//epack转燕文
		var toSFGJIds = '';//转顺丰国际
		var toSFTHIds = '',toEpacketIds = '';//转顺丰特惠
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
		$scope.bzxCjPacketFun = function(sx){
			console.log(sx)
			if(sx=='COMMON'){
				$scope.cjPacketVal = 'n';
				$scope.isZCjpacketFlag = false;
				$scope.usZhwlNum = 0;
			}else if(sx=='dian'){
				$scope.cjPacketDianVal = 'n';
				$scope.isZCjpacketDianFlag = false;
				$scope.zuspsDianNum = 0;
			}else if(sx=='gao'){
				$scope.cjPacketGaoVal = 'n';
				$scope.isZCjpacketGaoFlag = false;
				$scope.zuspsGaoNum = 0;
			}else if(sx=='jian'){
				$scope.cjPacketJianVal = 'n';
				$scope.isZCjpacketJianFlag = false;
				$scope.zuspsJianNum = 0;
			}else if(sx=='ye'){
				$scope.cjPacketYeVal = 'n';
				$scope.isZCjpacketYeFlag = false;
				$scope.zuspsYeNum = 0;
			}else if(sx=='minGan'){
				$scope.cjPacketMinGanVal = 'n';
				$scope.isZCjpacketMinGanFlag = false;
				$scope.zuspsMinGanNum = 0;
			}
			$scope.isydFun()
		}
		$scope.zXcjPacketFun = function(sx){
			if(sx=='COMMON'){
				$scope.cjPacketVal = 'y';
				$scope.isZCjpacketFlag = false;
				$scope.usZhwlNum = 0;
			}else if(sx=='dian'){
				$scope.cjPacketDianVal = 'y';
				$scope.isZCjpacketDianFlag = false;
				$scope.zuspsDianNum = 0;
			}else if(sx=='gao'){
				$scope.cjPacketGaoVal = 'y';
				$scope.isZCjpacketGaoFlag = false;
				$scope.zuspsGaoNum = 0;
			}else if(sx=='jian'){
				$scope.cjPacketJianVal = 'y';
				$scope.isZCjpacketJianFlag = false;
				$scope.zuspsJianNum = 0;
			}else if(sx=='ye'){
				$scope.cjPacketYeVal = 'y';
				$scope.isZCjpacketYeFlag = false;
				$scope.zuspsYeNum = 0;
			}else if(sx=='minGan'){
				$scope.cjPacketMinGanVal = 'y';
				$scope.isZCjpacketMinGanFlag = false;
				$scope.zuspsMinGanNum = 0;
			}
			$scope.isydFun()
		}
		function sxBooleanFun(arr,arr1){
			let shuXingFlag = true;
			let sxLen = arr.length;
			let arr1Len = arr1.length
			outer:
			for (var j = 0; j < sxLen; j++) {
				inter:
				for(let k = 0;k < arr1Len; k++){
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
			var sTAuIds = '',
				sTCaIds = '',
				sTDeZxIds = '',
				sTDeThIds = '',
				sTUsIds = '',
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
				stGBIds = '';
			$scope.teDingGuoJiaCjpacketCount = 0;
			var spCountNum;
			var isTestOrderId = ""; //是否为test测试账号订单
            $('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
				//店铺 
				var storeName = $(this).parent().siblings('.store-name-td').find('.store-name-p').text();
				//用户id
				var userId = $(this).siblings('.user-id-val').text();
				if(userId == '0d98c91b3ed64b0a9ced9bdef3bb8c32'){
					isTestOrderId = $(this).siblings('.hide-order-id').text();
				}
			 }
			});
			if(isTestOrderId){
				layer.msg('所选订单包含测试账号订单，订单号为：'+ isTestOrderId)
				return;
			}



			if($scope.cjPacketVal=='init'
			&&$scope.cjPacketDianVal == 'init'
			&&$scope.cjPacketGaoVal == 'init'
			&&$scope.cjPacketJianVal == 'init'
			&&$scope.cjPacketYeVal == 'init'
			&&$scope.cjPacketMinGanVal == 'init'){
				$('#c-zi-ord .cor-check-box').each(function () {
					if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
						spCountNum = 0;
						var wlName = $(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text();
						var ordCountryCode = $(this).parent().siblings('.info-address-td').children('.address-ccode').text();
						var ordWeight = $(this).parent().siblings('.wei-and-count').find('.oneord-wei').text();
						selectednum++;
						let spbtLen = $(this).siblings('.bt-length-num').text();//有几个变体
						
						var itemSpline = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.pro-item-sp');
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
						for (let iNum = 0; iNum < sxArr1.length; iNum++) {
							if (sxArr1[iNum] == 'HAVE_MAGNETISM') {
								$scope.hanCiCount++;
								break
							}
						}
						if(ordWeight>285 && ordCountryCode == 'US'&&$scope.store==0){
							
							let isCommonFlag1 = false;
							for (var j = 0; j < sxArr1.length; j++) {
								if (sxArr1[j] != 'COMMON') {
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
						console.log(ordWeight>285 && spbtLen == 1 && ordCountryCode == 'US' && ($scope.store==0 || $scope.store==1))
						if(ordWeight>285 && spbtLen == 1 && ordCountryCode == 'US' && ($scope.store==0 || $scope.store==1)){//单品
							if(sxArr1.length == 1){//单属性
								if(sxArr1[0]=='EDGE'){//尖锐
									$scope.zuspsJianNum++;
									return true
								}else if(sxArr1[0]=='ELECTRONIC'||sxArr1[0]=='BATTERY'||sxArr1[0]=='BATTERY'){//带电
									$scope.zuspsDianNum++;
									return true
								}else if(sxArr1[0]=='HAVE_LIQUID'){//含液体
									$scope.zuspsYeNum++;
									return true
								}else if(sxArr1[0]=='HAVE_CREAM'){//含膏体
									$scope.zuspsGaoNum++;
									return true
								}
							}else{//敏感件
								$scope.zuspsMinGanNum++;
								console.log($scope.zuspsMinGanNum)
								return true
							}
						}
					}
				})
			}

			$timeout(function(){
				if($scope.usZhwlNum>0){//普货
					$scope.isZCjpacketFlag = true;
				}
				if($scope.zuspsDianNum>0){//电
					$scope.isZCjpacketDianFlag = true;
				}
				if($scope.zuspsGaoNum>0){//膏
					$scope.isZCjpacketGaoFlag = true;
				}
				if($scope.zuspsJianNum>0){//尖锐
					$scope.isZCjpacketJianFlag = true;
				}
				if($scope.zuspsYeNum>0){//液体
					$scope.isZCjpacketYeFlag = true;
				}
				if($scope.zuspsMinGanNum>0){//敏感
					$scope.isZCjpacketMinGanFlag = true;
				}
				if($scope.hanCiCount>0){
					$scope.hanCiTipFlag = true;
				}else{
					$scope.hanCiTipFlag = false;
				}
				if($scope.usZhwlNum==0&&$scope.zuspsDianNum==0&&$scope.zuspsGaoNum==0&&$scope.zuspsJianNum==0&&$scope.zuspsYeNum==0&&$scope.zuspsMinGanNum==0){
					$('#c-zi-ord .cor-check-box').each(function () {
						if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
							spCountNum = 0;
							var wlName = $(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text();
							var ordCountryCode = $(this).parent().siblings('.info-address-td').children('.address-ccode').text();
							var ordWeight = $(this).parent().siblings('.wei-and-count').find('.oneord-wei').text();
							let cusUserId = $(this).siblings('.user-id-val').text();
							selectednum++;
							var itemSpline = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.pro-item-sp');
							var logisticModeName = $(this).siblings('.logistic-modename').text() || 'notfind';
							// console.log(logisticModeName)
							let spbtLen = $(this).siblings('.bt-length-num').text();//有几个变体

							spCountNum = itemSpline.length;
							var strSpSxList1 = '';
							if (spCountNum > 0) {
								for (var i = 0; i < spCountNum; i++) {
									strSpSxList1 += itemSpline.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text() + ',';
								}
							}
							var sxArr1 = strSpSxList1.split(',');
							sxArr1.pop();
							console.log(ordCountryCode == 'US'&&$scope.store==0&&$scope.cjPacketVal=='y')
							if(ordWeight>285 && ordCountryCode == 'US'&&$scope.store==0&&$scope.cjPacketVal=='y'){
								console.log(usZhwlIds)
								// console.log(sxArr1)
								var isCommonFlag1 = false;
								for (var j = 0; j < sxArr1.length; j++) {
									if (sxArr1[j] != 'COMMON') {
										isCommonFlag1 = false;
										break;
									} else {
										isCommonFlag1 = true;
									}
								}
								if (isCommonFlag1&&(wlName=='Wedenpost'||wlName=='ePacket'||wlName=='Pos Malaysia'||wlName=='MYSG'||wlName=='Bpost'||wlName=='Singpost'||wlName=='HKpost'||wlName=='Turkey Post'||wlName=='Swiss Post'||wlName=='China Post Registered Air Mail'||wlName=='La Poste'||wlName=='DHL Paket'||wlName=='BPost+'||wlName=='Korea Post'||wlName=='CJ Liquid'||wlName=='CJ Liquid Direct Line'||wlName=='CJ Liquid Post'||wlName=='Grand Slam'||wlName=='YanWen'||wlName=='S.F China Domestic'||wlName=='YTO China Domestic'||wlName=='South Africa Special Line'||wlName=='Brazil special line'||wlName=='Electric PostNL'||wlName=='CJPacket')) {
									// console.log('优先级最高',$(this).siblings('.hide-order-id').text())
									$scope.usZhwlNum++;
									usZhwlIds += $(this).siblings('.hide-order-id').text() + ',';
									console.log(usZhwlIds)
									return true
								}
							}
							if(ordWeight>285 &&spbtLen == 1 && ordCountryCode == 'US' && ($scope.store==0 || $scope.store==1)){//单品
								if(sxArr1.length == 1){//单属性
									console.log($scope.cjPacketJianVal)
									if(sxArr1[0]=='EDGE'&&$scope.cjPacketJianVal=='y'){//尖锐
										$scope.zuspsJianNum++;
										zuspsJianIds += $(this).siblings('.hide-order-id').text() + ',';
										console.log($scope.zuspsJianNum)
										return true
									}else if((sxArr1[0]=='ELECTRONIC'||sxArr1[0]=='BATTERY'||sxArr1[0]=='BATTERY')&&$scope.cjPacketDianVal=='y'){//带电
										$scope.zuspsDianNum++;
										zuspsDianIds += $(this).siblings('.hide-order-id').text() + ',';
										console.log($scope.zuspsDianNum)
										return true
									}else if(sxArr1[0]=='HAVE_LIQUID'&&$scope.cjPacketYeVal=='y'){//含液体
										$scope.zuspsYeNum++;
										zuspsYeIds += $(this).siblings('.hide-order-id').text() + ',';
										console.log($scope.zuspsYeNum)
										return true
									}else if(sxArr1[0]=='HAVE_CREAM'&&$scope.cjPacketGaoVal=='y'){//含膏体
										$scope.zuspsGaoNum++;
										zuspsGaoIds += $(this).siblings('.hide-order-id').text() + ',';
										console.log($scope.zuspsGaoNum)
										return true
									}
								}else{//敏感件 混合属性
									if($scope.cjPacketMinGanVal=='y'){
										$scope.zuspsMinGanNum++;
										zuspsMinGanIds += $(this).siblings('.hide-order-id').text() + ',';
										console.log(zuspsMinGanIds)
										return true
									}
								}
							}
							if(ordCountryCode == 'TH'&& logisticModeName != 'COD' && (cusUserId=='b7234b0c6d6e456cb261bbcd142c6d42'||cusUserId=='abbbda4d662340e1876076ad0accd5fe')){
								console.log('符合转coe泰国')
								$scope.toThCoeNum++;
								toThCoeIds += $(this).siblings('.hide-order-id').text() + ',';
							}
							if(logisticModeName == 'COD'&&ordCountryCode == 'TH' && (cusUserId=='b7234b0c6d6e456cb261bbcd142c6d42'||cusUserId=='abbbda4d662340e1876076ad0accd5fe')&&$scope.store==4){
								$scope.qtwlordNum++;
								qtwlIds += $(this).siblings('.hide-order-id').text() + ',';
								return true
							}
							if (wlName == 'ePacket' && ordCountryCode == 'US' && ordWeight <= 1000) {
								// console.log('符合转顺丰国际官方')
								var itemSpNum1 = itemSpline.length;
								var strSpSxList1 = '';
								if (itemSpNum1 > 0) {
									for (var i = 0; i < itemSpNum1; i++) {
										strSpSxList1 += itemSpline.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text() + ',';
									}
								}
								var sxArr1 = strSpSxList1.split(',');
								sxArr1.pop();
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
									toSFGJIds += $(this).siblings('.hide-order-id').text() + ',';
								}
								// console.log($scope.toSFGJNum)
							}
							if (wlName == 'ePacket' && ordCountryCode == 'US' && ordWeight > 1600) {
								// console.log('符合转顺丰特惠')
								var itemSFTHSpLen = itemSpline.length;
								var strSFTHSpSxList = '';
								if (itemSFTHSpLen > 0) {
									for (var i = 0; i < itemSFTHSpLen; i++) {
										strSFTHSpSxList += itemSpline.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text() + ',';
									}
								}
								var sfthSxArr = strSFTHSpSxList.split(',');
								sfthSxArr.pop();
								var issfthCommonFlag = false;
								for (var j = 0; j < sfthSxArr.length; j++) {
									if (sfthSxArr[j] != 'COMMON') {
										issfthCommonFlag = false;
										break;
									} else {
										issfthCommonFlag = true;
									}
								}
								if (issfthCommonFlag) {
									$scope.toSFTHNum++;
									toSFTHIds += $(this).siblings('.hide-order-id').text() + ',';
								}
							}
							if (wlName == 'CJPacket' && ordCountryCode == 'US' && ordWeight <= 2000) {
								var itemSFTHSpLen = itemSpline.length;
								var strSFTHSpSxList = '';
								if (itemSFTHSpLen > 0) {
									for (var i = 0; i < itemSFTHSpLen; i++) {
										strSFTHSpSxList += itemSpline.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text() + ',';
									}
								}
								var sfthSxArr = strSFTHSpSxList.split(',');
								sfthSxArr.pop();
								var issfthCommonFlag = false;
								for (var j = 0; j < sfthSxArr.length; j++) {
									if (sfthSxArr[j] != 'COMMON') {
										issfthCommonFlag = false;
										break;
									} else {
										issfthCommonFlag = true;
									}
								}
								if (issfthCommonFlag) {
									$scope.cjpacket2epacketNum++;
									toEpacketIds += $(this).siblings('.hide-order-id').text() + ',';
								}
							}

							if ($(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text() == 'ePacket') {
								var $sptdObj = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
								if (ordCountryCode == 'GB' || ordCountryCode == 'DE' || ordCountryCode == 'IN' || ordCountryCode == 'ES' || ordCountryCode == 'BE' || ordCountryCode == 'DK') {
									if (0 <= ordWeight <= 2000) {
										var itemSpline = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.pro-item-sp');
										var itemSpNum = itemSpline.length;
										var strSpSxList = '';
										if (itemSpNum > 0) {
											for (var i = 0; i < itemSpNum; i++) {
												strSpSxList += itemSpline.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text() + ',';
											}
										}
										// console.log(strSpSxList)
										var sxArr = strSpSxList.split(',');
										sxArr.pop();
										// console.log(sxArr)
										var isCommonFlag = false;
										for (var j = 0; j < sxArr.length; j++) {
											if (sxArr[j] != 'COMMON') {
												isCommonFlag = false;
												break;
											} else {
												isCommonFlag = true;
											}
										}
										if (isCommonFlag) {
											$scope.epack2yanwen++;
											epack2ywIds += $(this).siblings('.hide-order-id').text() + ',';
										}
									}
								}
								if ($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0) {
									$scope.ddepackNum++;
									ddepackIds += $(this).siblings('.hide-order-id').text() + ',';
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
								} else if ($sptdObj.children('.sp-sx-span').text().indexOf('磁') >= 0) {
									$scope.hcepackNum++;
									hcepackIds += $(this).siblings('.hide-order-id').text() + ',';
									// console.log('判断e邮宝含磁的条件')
								}
								else {
									$scope.bdepackNum++;
									bdepackIds += $(this).siblings('.hide-order-id').text() + ',';
									// console.log('判断e邮宝不带电的条件')
								}
								// console.log($sptdObj.children('.sp-sx-span').text())
							} else if (wlName == 'CJ Normal Express') {
								if (1000 < ordWeight && ordWeight <= 1600) {
									$scope.nfSfNum++;
									nfSfIds += $(this).siblings('.hide-order-id').text() + ',';
								} else if (ordWeight > 1600 || ordWeight <= 1000) {
									$scope.ttSfNum++;
									ttSfIds += $(this).siblings('.hide-order-id').text() + ',';
								}
								// else {
								// 	$scope.nfOrTtNum++;
								// 	nfOrTtIds += $(this).siblings('.hide-order-id').text()+',';
								// }
							} else if (wlName == 'USPS') {
								var $sptdObj = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
								$scope.uspsNum++;
								uspsIds += $(this).siblings('.hide-order-id').text() + ',';
								usps2uspsPlusIds += $(this).siblings('.hide-order-id').text() + ',';
								// console.log($(this).parent().siblings('.wei-and-count').find('.oneord-wei').text())
								if ($(this).parent().siblings('.wei-and-count').find('.oneord-wei').text()<=170&&$sptdObj.children('.sp-sx-span').text().indexOf('电') == -1&&$sptdObj.children('.sp-sx-span').text().indexOf('膏') == -1&&$sptdObj.children('.sp-sx-span').text().indexOf('液') == -1){
									usps2DhlXiaoBaoIds += $(this).siblings('.hide-order-id').text() + ',';
									$scope.toDhlXiaoBaoNum++;
								}
								// console.log($sptdObj.children('.sp-sx-span').text())
								// else{
								// 	$scope.uspsNum++;
								// 	uspsIds += $(this).siblings('.hide-order-id').text() + ',';
								// 	usps2uspsPlusIds += $(this).siblings('.hide-order-id').text() + ',';
								// }


							} else if (wlName == 'China Post Registered Air Mail') {
								var $sptdObj = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
								if ($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0) {
									$scope.ddyzxbNum++;
									ddyzxbIds += $(this).siblings('.hide-order-id').text() + ',';
									// console.log('判断邮政小包带电的条件')
								} else {
									$scope.bdyzxbNum++;
									bdyzxbIds += $(this).siblings('.hide-order-id').text() + ',';
									// console.log('判断邮政小包不带电的条件')
								}
								// console.log('判断邮政小包物流的条件')
							} else if (wlName == 'USPS+') {
								var $sptdObj = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
								$scope.uspsPlusNum++;
								uspsPlusIds += $(this).siblings('.hide-order-id').text() + ',';
								// console.log('判断USPS+物流的条件')
								if ($(this).parent().siblings('.wei-and-count').find('.oneord-wei').text()<=170&&$sptdObj.children('.sp-sx-span').text().indexOf('电') == -1&&$sptdObj.children('.sp-sx-span').text().indexOf('膏') == -1&&$sptdObj.children('.sp-sx-span').text().indexOf('液') == -1){
									usps2DhlXiaoBaoIds += $(this).siblings('.hide-order-id').text() + ',';
									$scope.toDhlXiaoBaoNum++;
								}
								// else{
								// 	$scope.uspsPlusNum++;
								// 	uspsPlusIds += $(this).siblings('.hide-order-id').text() + ',';
								// }
							} else if (wlName == 'CJPacket SEA Express') {
								$scope.cjpacketSeaExpCount++;
								cjpacketSeaExpIds += $(this).siblings('.hide-order-id').text() + ',';
								// console.log('嘉里空运')
							} else if (wlName.indexOf('YunExpress') >= 0) {
								$scope.ytNum++;
								ytIds += $(this).siblings('.hide-order-id').text() + ',';
								// console.log('判断云途物流的条件')
							} else if (wlName == 'DHL') {
								var $sptdObj = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');

								if ($sptdObj.children('.sp-sx-span').text().indexOf('电') >= 0) {
									$scope.dhlddIds++;
									dhlddIds += $(this).siblings('.hide-order-id').text() + ',';
									// console.log('判断dhl带电的条件')
								} else {
									// $scope.dhlnotdIds++;
									// dhlnotdIds += $(this).siblings('.hide-order-id').text() + ',';
									if (ordWeight<2000) {
										$scope.dhlGfNum++;
										dhlGfIds += $(this).siblings('.hide-order-id').text()+',';
									}else{
										$scope.dhlnotdIds++;
										dhlnotdIds += $(this).siblings('.hide-order-id').text()+',';
									}
								}
							} else if(wlName == 'DHL Official'){
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
							} else if(wlName == 'DHL eCommerce' || wlName=='DHL小包'){
								$scope.dhlXiaoBaoNum++;
								dhlXiaoBaoIds += $(this).siblings('.hide-order-id').text()+',';
								console.log('DHL eCommerce')
							}
							 else if(wlName == 'DHL HongKong'){
								$scope.hkDhlNum++;
								hkDhlIds += $(this).siblings('.hide-order-id').text()+',';
							}
							else if(wlName=='YanWen'){
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
									if (sxArr1[j] != 'COMMON') {
										isCommonFlag1 = false;
										break;
									} else {
										isCommonFlag1 = true;
									}
								}
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
							} else if(wlName == 'Jewel Shipping+'){
								$scope.jewelPlusNum++;
								jewelPlusIds += $(this).siblings('.hide-order-id').text()+',';
							} else if(wlName == 'Jewel Shipping Flat'||wlName == 'Jewel Shipping Flat+'){
								$scope.jewelFlatNum++;
								jewelFlatIds += $(this).siblings('.hide-order-id').text()+',';
							}
							else if(wlName == 'DG Epacket'){
								$scope.dgEpacketNum++;
								dgEpacketIds += $(this).siblings('.hide-order-id').text()+',';
							}
							else if(wlName == 'BJ cosmetics epacket'){
								$scope.bHepacketNum++;
								bHeapcketIds += $(this).siblings('.hide-order-id').text()+',';
							}
							else if(wlName == 'SFC Brazil line'){
								$scope.sfcBrazilLineNum++;
								sfcBrazilLineIds += $(this).siblings('.hide-order-id').text()+',';
							}
							else if(wlName == 'YL Columbia line'){
								$scope.ylColumbiaNum++;
								ylColumbiaIds += $(this).siblings('.hide-order-id').text()+',';
							}
							else if(wlName == 'YL Peru line'){
								$scope.ylPeruNum++;
								ylPeruIds += $(this).siblings('.hide-order-id').text()+',';
							}
							else if(wlName == 'CJPacket'){
								var $sptdObj = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.sp-fir-tr').children('.sp-sx-td');
								spCountNum = itemSpline.length;
								var strSpSxList1 = '';
								if (spCountNum > 0) {
									for (var i = 0; i < spCountNum; i++) {
										strSpSxList1 += itemSpline.eq(i).find('.sp-fir-tr').children('.sp-sx-td').children('.sp-sx-list').text() + ',';
									}
								}
								var sxArr1 = strSpSxList1.split(',');
								sxArr1.pop();
								if(ordCountryCode=='AU'){
									//澳洲特惠
									$scope.sanTaiNum++;
									sTAuIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode=='CA'){
									$scope.sanTaiNum++;
									sTCaIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode=='DE'){
									// if(sxBooleanFun1(sxArr1,'','BATTERY','ELECTRONIC','','')){//是否是带电的
										//德国专线
										$scope.sanTaiNum++;
										sTDeZxIds += $(this).siblings('.hide-order-id').text() + ',';
									// }else {
									// 	//德国专线特惠
									// 	$scope.sanTaiNum++;
									// 	sTDeThIds += $(this).siblings('.hide-order-id').text() + ',';
									// }
								}else if(ordCountryCode=='MX'){
									$scope.sanTaiNum++;
									sTMxIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode=='US'){
									$scope.sanTaiNum++;
									sTUsIds += $(this).siblings('.hide-order-id').text() + ',';
								}
								else if(ordCountryCode=='AT' || ordCountryCode=='CH' || ordCountryCode=='SE' || ordCountryCode=='FR' || ordCountryCode=='NL' || ordCountryCode=='BE' || ordCountryCode=='LU'){
									$scope.sanTaiNum++;
									// yTDdIds += $(this).siblings('.hide-order-id').text() + ',';
									yTDdIds += $(this).siblings('.hide-order-id').text() + ',';//暂时都走带电2-17
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
								}
								else if(ordCountryCode=='GB'){
									$scope.sanTaiNum++;
									stGBIds += $(this).siblings('.hide-order-id').text() + ',';
								}
								else if(ordCountryCode=='KR'){
									$scope.sanTaiNum++;
									yTYdsKrIds += $(this).siblings('.hide-order-id').text() + ',';
								}
								else if(ordCountryCode=='BR'){
									$scope.sanTaiNum++;
									yTBrIds += $(this).siblings('.hide-order-id').text() + ',';
								}else if(ordCountryCode=='ES'){
									$scope.sanTaiNum++;
									yTEsIds += $(this).siblings('.hide-order-id').text() + ',';
								}
								else if(ordCountryCode=='TH'||ordCountryCode== 'MY'||ordCountryCode== "PH"||ordCountryCode== 'VN'||ordCountryCode== 'SG'||ordCountryCode== 'TW'||ordCountryCode== 'ID'){
									teDingGuoJiaCjpacketIds += $(this).siblings('.hide-order-id').text() + ',';
									$scope.teDingGuoJiaCjpacketCount++;
									$scope.sanTaiNum++;
								}
								else{
									$scope.qtwlordNum++;
									qtwlIds += $(this).siblings('.hide-order-id').text() + ',';
								}
							}
							else if(wlName == 'CJPacket-Tha'||wlName == 'CJPacket-Supplier'){
								if(ordCountryCode=='TH'||ordCountryCode== 'VN'){
									teDingGuoJiaCjpacketIds += $(this).siblings('.hide-order-id').text() + ',';
									$scope.teDingGuoJiaCjpacketCount++;
									$scope.sanTaiNum++;
								}else{
									$scope.qtwlordNum++;
									qtwlIds += $(this).siblings('.hide-order-id').text() + ',';
								}
							}
							else if(wlName == 'PostNL'){
								postNlIds += $(this).siblings('.hide-order-id').text() + ',';
								$scope.postNlCount++;
							}
							else if(wlName == 'CJCOD'){
								cjCodIds += $(this).siblings('.hide-order-id').text() + ',';
								$scope.cjCodNum++;
							}
							else {
								$scope.qtwlordNum++;
								qtwlIds += $(this).siblings('.hide-order-id').text() + ',';
								// console.log('判断其它物流的条件')
							}
						}
					})
					if (selectednum <= 0) {
						layer.msg('请先选择订单')
						return;
					} else {
						$scope.isydFlag = true;
					}
					if ($scope.hkDhlNum <= 0) {
						$('.scyd-btn34').addClass('btn-active');
					} else {
						$('.scyd-btn34').removeClass('btn-active');
					}
					if ($scope.sanTaiNum <= 0) {
						$('.scyd-btn33').addClass('btn-active');
					} else {
						$('.scyd-btn33').removeClass('btn-active');
					}
					if ($scope.ddepackNum <= 0) {
						$('.scyd-btn1').addClass('btn-active');
					} else {
						$('.scyd-btn1').removeClass('btn-active');
					}
					if ($scope.bdepackNum <= 0) {
						$('.scyd-btn2').addClass('btn-active');
					} else {
						$('.scyd-btn2').removeClass('btn-active');
					}
					if ($scope.epackGzNum <= 0) {
						$('.scyd-btn9').addClass('btn-active');
					} else {
						$('.scyd-btn9').removeClass('btn-active');
					}
					if ($scope.qtwlordNum <= 0) {
						$('.scyd-btn3').addClass('btn-active');
					} else {
						$('.scyd-btn3').removeClass('btn-active');
					}
					if ($scope.uspsNum <= 0) {
						$('.scyd-btn4').addClass('btn-active');
						$('.scyd-btn21').addClass('btn-active');
						$('.scyd-btn22').addClass('btn-active');
					} else {
						$('.scyd-btn4').removeClass('btn-active');
						$('.scyd-btn21').removeClass('btn-active');
						$('.scyd-btn22').removeClass('btn-active');
					}
					if ($scope.ddyzxbNum <= 0) {
						$('.scyd-btn5').addClass('btn-active');
					} else {
						$('.scyd-btn5').removeClass('btn-active');
					}
					if ($scope.bdyzxbNum <= 0) {
						$('.scyd-btn6').addClass('btn-active');
					} else {
						$('.scyd-btn6').removeClass('btn-active');
					}
					if ($scope.uspsPlusNum <= 0) {
						$('.scyd-btn7').addClass('btn-active');
						$('.scyd-btn8').addClass('btn-active');
						$('.scyd-btn14').addClass('btn-active');
					} else {
						$('.scyd-btn7').removeClass('btn-active');
						$('.scyd-btn8').removeClass('btn-active');
						$('.scyd-btn14').removeClass('btn-active');
					}
					if ($scope.ytNum <= 0) {
						$('.scyd-btn10').addClass('btn-active');
					} else {
						$('.scyd-btn10').removeClass('btn-active');
					}
					if ($scope.dhlddIds <= 0) {
						$('.scyd-btn11').addClass('btn-active');
					} else {
						$('.scyd-btn11').removeClass('btn-active');
					}
					if ($scope.dhlnotdIds <= 0) {
						$('.scyd-btn12').addClass('btn-active');
					} else {
						$('.scyd-btn12').removeClass('btn-active');
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
					if ($scope.hcepackNum <= 0) {
						$('.scyd-btn13').addClass('btn-active');
					} else {
						$('.scyd-btn13').removeClass('btn-active');
					}
					if ($scope.hfmepackNum <= 0) {
						$('.scyd-btn18').addClass('btn-active');
					} else {
						$('.scyd-btn18').removeClass('btn-active');
					}
					if ($scope.nfSfNum <= 0) {
						$('.scyd-btn15').addClass('btn-active');
					} else {
						$('.scyd-btn15').removeClass('btn-active');
					}
					if ($scope.ttSfNum <= 0) {
						$('.scyd-btn16').addClass('btn-active');
					} else {
						$('.scyd-btn16').removeClass('btn-active');
					}
					if ($scope.dhlXiaoBaoNum<=0) {
						$('.scyd-btn23').addClass('btn-active');
						$('.zhnf-btn2').addClass('btn-active');
					} else {
						$('.scyd-btn23').removeClass('btn-active');
						$('.zhnf-btn2').removeClass('btn-active');
					}
					if ($scope.usZhwlNum <= 0) {
						$('.scyd-btn25').addClass('btn-active');
						$('.scyd-btn28').addClass('btn-active');
					} else {
						$('.scyd-btn25').removeClass('btn-active');
						$('.scyd-btn28').removeClass('btn-active');
					}
					if ($scope.zuspsDianNum <= 0) {
						$('.scyd-btn25-dian').addClass('btn-active');
						$('.scyd-btn28-dian').addClass('btn-active');
					} else {
						$('.scyd-btn25-dian').removeClass('btn-active');
						$('.scyd-btn28-dian').removeClass('btn-active');
					}
					if ($scope.zuspsJianNum <= 0) {
						$('.scyd-btn25-jian').addClass('btn-active');
						$('.scyd-btn28-jian').addClass('btn-active');
					} else {
						$('.scyd-btn25-jian').removeClass('btn-active');
						$('.scyd-btn28-jian').removeClass('btn-active');
					}
					if ($scope.zuspsGaoNum <= 0) {
						$('.scyd-btn25-gao').addClass('btn-active');
						$('.scyd-btn28-gao').addClass('btn-active');
					} else {
						$('.scyd-btn25-gao').removeClass('btn-active');
						$('.scyd-btn28-gao').removeClass('btn-active');
					}
					if ($scope.zuspsYeNum <= 0) {
						$('.scyd-btn25-ye').addClass('btn-active');
						$('.scyd-btn28-ye').addClass('btn-active');
					} else {
						$('.scyd-btn25-ye').removeClass('btn-active');
						$('.scyd-btn28-ye').removeClass('btn-active');
					}
					if ($scope.zuspsMinGanNum <= 0) {
						$('.scyd-btn25-mingan').addClass('btn-active');
						$('.scyd-btn28-mingan').addClass('btn-active');
					} else {
						$('.scyd-btn25-mingan').removeClass('btn-active');
						$('.scyd-btn28-mingan').removeClass('btn-active');
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

			//确定生成面单的按钮
			$scope.succscydnumflag = false;//生成运单成功多少
			$scope.zhnfDHLFun = function(){
				if($scope.dhlGfNum>0){
					$scope.isReturnDhlFlag = true;
				}else{
					layer.msg('没有可以转回的订单')
				}
			}
			$scope.zhupspFun=function(){
				if($scope.dhlXiaoBaoNum>0){
					$scope.isReturnUspsFlag=true;
				}else{
					layer.msg('没有可以转回的订单');
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
			$scope.zhUspsSureFun=function(){
				var uspsUpIds = {};
				uspsUpIds.ids = dhlXiaoBaoIds;
				console.log(uspsUpIds);
				erp.load();
				//uspsUpIds.status = 2;
				erp.postFun('app/order/updateLogistic', JSON.stringify(uspsUpIds), function (data) {
					console.log(data);
					erp.closeLoad();
					if (data.data.result > 0) {
						layer.msg('修改成功');
						$scope.uspsPlusNum+=$scope.dhlXiaoBaoNum;
						uspsPlusIds+=dhlXiaoBaoIds;
						$scope.dhlXiaoBaoNum=0;
						dhlXiaoBaoIds='';
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
			$scope.enterscmdFun44 = function (stu) {//美国
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
						if (stu==1) {
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
					// }
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
						if (stu==1) {
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
					// }
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
						if (stu==1) {
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
						ids.loginName = erpLoginName;
						if (stu==1) {
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
						ids.loginName = erpLoginName;
						if (stu==1) {
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
						if (stu==1) {
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
					// }
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
						if (stu==1) {
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
					// }
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
						if (stu==1) {
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
					// }
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
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn23').addClass('btn-active1');
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
						if (stu==1) {
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
					// }
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
				if(sTAuIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTAuIds,'AUEXPIE','义乌三态物流澳洲专线')):stCsArr.push(stCsFun(sTAuIds,'AUEXPIE','深圳三态物流澳洲专线'))
					cjpacketIds += sTAuIds;
				}
				if(sTCaIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTCaIds,'CAEXPFS','义乌三态物流加拿大专线')):stCsArr.push(stCsFun(sTCaIds,'CAEXPFS','深圳三态物流加拿大专线'))
					cjpacketIds += sTCaIds;
				}
				if(sTUsIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTUsIds,'E3','顺丰小包')):stCsArr.push(stCsFun(sTUsIds,'E3','顺丰小包'))
					cjpacketIds += sTUsIds;
				}
				if(sTDeZxIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTDeZxIds,'SFCQMDER','义乌三态快邮德国小包挂号')):stCsArr.push(stCsFun(sTDeZxIds,'SFCQMDER','深圳三态快邮德国小包挂号'))
					cjpacketIds += sTDeZxIds;
				}
				if(sTDeThIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTDeThIds,'DEEXPLS','义乌三态物流德国专线特惠')):stCsArr.push(stCsFun(sTDeThIds,'DEEXPLS','深圳三态物流德国专线特惠'))
					cjpacketIds += sTDeThIds;
				}
				if(sTMxIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(sTMxIds,'MXEXP','义乌三态物流墨西哥专线')):stCsArr.push(stCsFun(sTMxIds,'MXEXP','深圳三态物流墨西哥专线'))
					cjpacketIds += sTMxIds;
				}
				if(yTBddIds!=''){
					whereTarget=='YW'?stCsArr.push(stCsFun(yTBddIds,'YW-THPHR','义乌云途专线全球挂号')):stCsArr.push(stCsFun(yTBddIds,'SZ-THPHR','深圳云途专线全球挂号'))
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
					whereTarget=='YW'?stCsArr.push(stCsFun(stGBIds,'RM2R','义乌三态英国经济专线')):stCsArr.push(stCsFun(stGBIds,'RM2R','深圳三态英国经济专线'))
					cjpacketIds += stGBIds;
				}
				erp.load();
				$scope.succscydnumflag = true;
				if(stCsArr.length>0){//有适合的cjpacket订单
					var updata = {};
					updata.list = stCsArr;
					updata.enName = 'CJPacket';
					updata.loginName = erpLoginName;
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
							if (stu==1) {
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
				
				if($scope.teDingGuoJiaCjpacketCount>0){//有特定国家的cjpacekt订单
					var updata = {};
					updata.ids = teDingGuoJiaCjpacketIds;
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
							if (stu==1) {
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
			$scope.enterscmdFun26 = function (stu) {//美国
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
						if (stu==1) {
							ids.auto = 'n';
						}
						ids.shenzhen = diQu;
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
					// }
				}, function (data) {
					console.log(data)
					layer.closeAll("loading")
				})
			}
			$scope.enterscmdFun25 = function (stu,sx) {//美国
				var curIds = '';
				if(sx=='common'){
					if ($scope.usZhwlNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25').hasClass('btn-active1')) {
						return;
					}
					curIds = usZhwlIds;
					$('.scyd-btn25').addClass('btn-active1');
				}else if(sx=='dian'){
					if ($scope.zuspsDianNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25-dian').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsDianIds;
					$('.scyd-btn25-dian').addClass('btn-active1');
				}else if(sx=='jian'){
					if ($scope.zuspsJianNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25-jian').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsJianIds;
					$('.scyd-btn25-jian').addClass('btn-active1');
				}else if(sx=='gao'){
					if ($scope.zuspsGaoNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25-gao').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsGaoIds;
					$('.scyd-btn25-gao').addClass('btn-active1');
				}else if(sx=='ye'){
					if ($scope.zuspsYeNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn25-ye').hasClass('btn-active1')) {
						return;
					}
					curIds = zuspsYeIds;
					$('.scyd-btn25-ye').addClass('btn-active1');
				}else if(sx=='minGan'){
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
				if (stu==1) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn23').addClass('btn-active1');
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
						ids.ids = dhlXiaoBaoIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
					// }
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
						ids.loginName = erpLoginName;
						if (stu==1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn17').addClass('btn-active1');
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
						ids.ids = nfOrTtIds;
						ids.loginName = erpLoginName;
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
			$scope.enterscmdFun15 = function (stu) {//南风顺丰
				console.log($('.qd-sel15').val())
				console.log($('.qd-sel16').val())
				if ($scope.nfSfNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-sel15').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn15').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = nfSfIds;
				updata.logisticsName = $('.qd-sel15').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn15').addClass('btn-active1');
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
						ids.ids = nfSfIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
			$scope.enterscmdFun16 = function (stu) {//泰腾顺丰
				if ($scope.ttSfNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-sel16').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn16').hasClass('btn-active1')) {
					return;
				}
				erp.load();
				$scope.succscydnumflag = true;
				var updata = {};
				updata.orderNum = ttSfIds;
				updata.logisticsName = $('.qd-sel16').val();
				updata.enName = 'CJ Normal Express';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn16').addClass('btn-active1');
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
						ids.ids = ttSfIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn11').addClass('btn-active1');
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
						ids.ids = dhlddIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn12').addClass('btn-active1');
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
						ids.ids = dhlnotdIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn19').addClass('btn-active1');
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
						ids.ids = dhlGfIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
				if(!$scope.whereDhl){
					layer.msg('请选择')
					return
				}else{
					var diQu = '';
					if ($scope.whereDhl=='shenZhen') {
						diQu = 'y';
					} else {
						diQu = '';
					}
				}
				erp.load();
				$scope.succscydnumflag = true;
				// console.log(ddepackIds+'###'+bdepackIds+'==='+qtwlIds)
				var updata = {};
				updata.orderNum = dhlOfficialIds;
				updata.logisticsName = "DHLGF#DHL不带电";
				updata.enName = 'DHL Official';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn20').addClass('btn-active1');
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
						ids.ids = dhlOfficialIds;
						ids.shenzhen = diQu;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
				if ($('.qd-sel1').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn1').hasClass('btn-active1')) {
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
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn1').addClass('btn-active1');
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
						ids.ids = ddepackIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
			$scope.enterscmdFun2 = function (stu) {//带电E邮宝生成运单号函数
				if ($scope.bdepackNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.qd-sel2').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn2').hasClass('btn-active1')) {
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
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn2').addClass('btn-active1');
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
						ids.ids = bdepackIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
				// if ($scope.store==0||$scope.store==1) {
				// 	updata.logisticsName = 'Shipstation#USPS-'+$scope.uspsDiQu;
				// } else {
				// 	updata.logisticsName = 'Shipstation#Shipstation'
				// }
				updata.enName = 'usps';
				updata.loginName = erpLoginName;
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn21').addClass('btn-active1');
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
						ids.ids = uspsIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn22').addClass('btn-active1');
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在获取追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn27').addClass('btn-active1');
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
						if (stu==1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
			$scope.enterscmdFun28 = function (stu,sx) {//usps
				var updata = {};
				var curIds = '';
				if(sx=='common'){
					if ($scope.usZhwlNum <= 0) {
						layer.msg('订单数为零不能生成订单')
						return;
					}
					if ($('.scyd-btn28').hasClass('btn-active1')) {
						return;
					}
					curIds = usZhwlIds;
					$('.scyd-btn28').addClass('btn-active1');
				}else if(sx=='dian'){
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
				}else if(sx=='jian'){
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
				}else if(sx=='gao'){
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
				}else if(sx=='ye'){
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
				}else if(sx=='minGan'){
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					
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
						ids.ids = curIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
							erp.postFun2('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
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
						if (stu==1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
							erp.postFun2('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
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
				if (stu==1) {
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
						if (stu==1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
							erp.postFun2('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
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
				if (stu==1) {
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
						ids.loginName = erpLoginName;
						if (stu==1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
							erp.postFun2('refreshUspsOrderId.json',JSON.stringify(freshJson),function(data){
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
				if (stu==1) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn4').addClass('btn-active1');
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
						ids.ids = uspsIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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

				$scope.succscydnumflag = true;
				var ids = {};
				ids.ids = qtwlIds;
				ids.loginName = erpLoginName;
				if (stu==1) {
					ids.auto = 'n';
				}
				console.log(JSON.stringify(ids))
				erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
					$('.scyd-btn3').addClass('btn-active1');
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
			$scope.enterscmdFun13 = function (stu) {//带电E邮宝生成运单号函数
				if ($scope.hcepackNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.scyd-btn13').hasClass('btn-active1')) {
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
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn13').addClass('btn-active1');
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
						ids.ids = hcepackIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn18').addClass('btn-active1');
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
						ids.ids = hfmepackIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
			$scope.enterscmdFun9 = function (stu) {//带电E邮宝生成运单号函数
				if ($scope.epackGzNum <= 0) {
					layer.msg('订单数为零不能生成订单');
					return;
				}
				if ($('.qd-sel9').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn9').hasClass('btn-active1')) {
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
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn9').addClass('btn-active1');
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
						ids.ids = gzepackIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn10').addClass('btn-active1');
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
						ids.ids = ytIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
			$scope.enterscmdFun6 = function (stu) {//不带电邮政小包
				if ($scope.bdyzxbNum <= 0) {
					layer.msg('订单数为零不能生成订单')
					return;
				}
				if ($('.qd-sel6').val() == '请选择') {
					layer.msg('请选择物流渠道');
					return;
				}
				if ($('.scyd-btn6').hasClass('btn-active1')) {
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
				console.log(JSON.stringify(updata))
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn6').addClass('btn-active1');
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
						ids.ids = bdyzxbIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn7').addClass('btn-active1');
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
							console.log('9787676776788787')
						}, 500)
						var ids = {};
						ids.ids = uspsPlusIds;
						ids.loginName = erpLoginName;
						if (stu==1) {
							ids.auto = 'n';
						}
						console.log(JSON.stringify(ids))
						erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
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
				erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
					$('.scyd-btn8').addClass('btn-active1');
					console.log(data)
					if (data.data.result > 0) {
						var textarr = ['.', '..', '...', '....', '.....', '......'];
						var inputText = '';
						var i = 0;
						var timer = setInterval(function () {
							$('#animat-text').text('正在获取追踪号' + textarr[i]);
							i++;
							if (i > 5) {
								i = 0;
							}
						}, 500)
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
				if (stu==1) {
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
		//usps转usps+的确定取消 点击数字的函数
		// $scope.uspsTFun = function () {
		// 	$scope.uspsTFlag = false;
		// }
		//生成运单号的关闭函数
		$scope.isydCloseFun = function () {
			$scope.currtpage = 1;
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
			$('.scyd-btn28-dian').removeClass('btn-active1');
			$('.scyd-btn28-jian').removeClass('btn-active1');
			$('.scyd-btn28-ye').removeClass('btn-active1');
			$('.scyd-btn28-gao').removeClass('btn-active1');
			$('.scyd-btn28-mingan').removeClass('btn-active1');
			zszgfStuArr = [];
			erp.load();
			var erpData = {};
			//判断是不是状态1未生成追踪号的订单
			if ($scope.selstu > 1) {
				erpData.ydh = 'y';
			} else {
				erpData.ydh = '';
			}
			seltjFun(erpData);
			erpData.cjOrderDateBegin = $('#c-data-time').val();
			erpData.cjOrderDateEnd = $('#cdatatime2').val();
			erpData.status = '10';
			erpData.page = 1;
			erpData.limit = $('#page-sel').val() - 0;
			console.log(JSON.stringify(erpData))
            if($scope.isfulfillment){
                erpData.fulfillment = $scope.fulfillment;
            }
			erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				var erporderResult = data.data;//存储订单的所有数据
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun($scope.erporderList);
				dealpage()
				if(muId||$scope.storeNumFlag||$scope.isSelJqcz=='母订单号'){
					var inpVal = $.trim($('.c-seach-inp').val())
					if(inpVal){
						getMuNumFun(inpVal,$scope.store)
					} else {
						getMuNumFun(muId,$scope.store)
					}
				}
			}, function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
				// alert(2121)
			})
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
			var printIds = '';
			var numindex = 0;
			// ids.ids = [];
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					numindex++;
					printIds += $(this).siblings('.hide-order-id').text() + ',';
				}
			})
			if (numindex < 1) {
				layer.closeAll("loading")
				layer.msg('请选择订单')
				return;
			}
			// console.log(ids.ids)
			// console.log(ids)
			ids.ids = printIds;
			console.log(JSON.stringify(ids))
			// return;
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
		$scope.closeTcFun = function () {
			$scope.mdtcFlag = false;
		}


		//导出函数
		$scope.isdcflag = false;
		$scope.isdcfun = function () {
			var numindex = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					numindex++;
				}
			})
			if (numindex <= 0) {
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
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					printIds += $(this).siblings('.hide-order-id').text() + ',';
				}
			})
			ids.ids = printIds;
			ids.type = 1;
			console.log(JSON.stringify(ids))
			erp.postFun('app/order/exportErpOrder', JSON.stringify(ids), function (data) {
				console.log(data)
				var href = data.data.href;
				console.log(href)
				layer.closeAll("loading")
				if (href.indexOf('https') >= 0) {
					$scope.dcflag = true;
					// window.open(href,'_blank')
					$scope.hrefsrc = href;
					console.log($scope.hrefsrc)
				} else {
					layer.msg('导出失败')
				}
			}, function (data) {
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
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					printIds += $(this).siblings('.hide-order-id').text() + ',';
				}
			})
			ids.ids = printIds;
			ids.type = 0;
			console.log(JSON.stringify(ids))
			erp.postFun('app/order/exportErpOrder', JSON.stringify(ids), function (data) {
				console.log(data)
				var href = data.data.href;
				console.log(href)
				layer.closeAll("loading")
				if (href.indexOf('https') >= 0) {
					$scope.dcflag = true;
					// window.open(href,'_blank')
					$scope.hrefsrc = href;
					console.log($scope.hrefsrc)
				} else {
					layer.msg('导出失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//关闭
		$scope.closeatc = function () {
			$scope.dcflag = false;
		}
		//精确查找
		$scope.jqczSelCs = '子订单号';//精确查询的条件
		$scope.jqczFlag = false;
		$scope.jqczFun = function () {
			// console.log($scope.isSelJqcz)
			// if($scope.isSelJqcz=='精确查找'){
			// 	$scope.jqczFlag = true;
			// }
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
			erp.postFun('app/order/getOrderLocation', JSON.stringify(csData), function (data) {
				console.log(data)
				$scope.jqczFlag = false;
				var resLocation = data.data.location;
				if (!$.isEmptyObject(data.data)) {
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
			$scope.cItemId = item.ORDER_NUMBER;
			console.log($scope.cItemId)
			var mesUpdata = {};
			mesUpdata.ORDERNUMBER = $scope.cItemId;
			erp.postFun('app/dispute/checkDispute', JSON.stringify(mesUpdata), function (data) {
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
		$scope.ckBzFun = function(item,index,e){
			e.stopPropagation()
			$('#ckbz-box .check-box input').each(function(){
				$(this).prop('checked',false)
			})
			$scope.packArr = [];
			$scope.imgArr = [];
			$scope.bzFlag = true;
			$scope.zordItemId = item.ID;
			$scope.zordItemIndex = index;
			if(item.isPack){
				var packKey = item.pack?item.pack:[];
				var bzImgs = item.imgs?item.imgs:[];
				$scope.packArr = JSON.parse(JSON.stringify(packKey));
				$scope.imgArr = JSON.parse(JSON.stringify(bzImgs));
				$('#ckbz-box .check-box input').each(function(){
					for(var i = 0,len=packKey.length;i<len;i++){
						if(packKey[i]==$(this).attr('name')){
							$(this).prop('checked',true)
						}
					}
				})
			}
		}

		$scope.addressError = function(item,index,e){
			e.stopPropagation()
			$('#ckbz-box .check-box input').each(function(){
				$(this).prop('checked',false)
			})
			var upJson = {};
			upJson.id = item.ID;
			upJson.orderNubmer = item.ORDER_NUMBER;
			erp.postFun('order/order/addressError',JSON.stringify(upJson),function (data) {
				console.log(data)
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode==200) {
					console.log($scope.erporderList[data.data]);

				}
			},function (data) {
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
		        console.log($.isArray(currentCheckbox,$scope.packArr))
		        console.log(currentCheckbox)
		        $scope.packArr.splice($.inArray(currentCheckbox.attr('name'),$scope.packArr), 1);
		    }
		    console.log($scope.packArr)
		}
		$scope.closeBzFun = function () {
		    $scope.bzFlag = false;
		    // $scope.imgArr = [];
		    // $scope.packArr = [];
		}
		$scope.deletImgFun = function (index) {
		    $scope.imgArr.splice(index,1)
		}
		$scope.sureZdBzFun = function () {
			if($scope.packArr.length<1){
			    layer.msg('请指定包装');
			    return;
			}
			if($scope.imgArr.length<1){
			    layer.msg('请上传包装图片');
			    return;
			}
			erp.load()
			var upJson = {};
			upJson.cjorderId = $scope.zordItemId;
			upJson.packKey = $scope.packArr;
			upJson.imgs = $scope.imgArr;
			erp.postFun('pojo/accountPack/weiDingDanTianJiaBaoZhuang',JSON.stringify(upJson),function (data) {
				console.log(data)
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode==200) {
					$scope.bzFlag = false;
					$scope.erporderList[$scope.zordItemIndex].order.isPack='1';
					$scope.erporderList[$scope.zordItemIndex].order.imgs=$scope.imgArr;
					$scope.erporderList[$scope.zordItemIndex].order.pack=$scope.packArr;
					$scope.imgArr = [];
					$scope.packArr = [];
					console.log($scope.erporderList[$scope.zordItemIndex].order)
				}
			},function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		var that = this;
		// /*查看日志*/
		$scope.isLookLog = false;
		$scope.LookLog = function (No,ev) {
			console.log(No)
            $scope.isLookLog = true;
            that.no = No;
            ev.stopPropagation()
            // var data = {
            // 	orderId:No
            // };
            // layer.load(2);
            // erp.postFun("erp/orderOperationRecords/queryOrderOperationRecords",data, function (res) {
            //     layer.closeAll("loading");
            //     console.log(res)
            //     if(res.data.statusCode == 200){
            //     	$scope.logList = res.data.result;
            //     }else{
            //     	layer.msg(res.data.message)
            //     }
            // }, function (err) {
            //     layer.msg('服务器错误')
            // });
        }
    $scope.$on('log-to-father',function (d,flag) {
       if (d && flag) {
           $scope.isLookLog = false;
           $scope.gxhOrdFlag = false;
           $scope.gxhProductFlag = false;
       }
    })

    $scope.openZZC2 = function(list,e,type,spArr){
      $scope.gxhOrdFlag = true;
      that.pro = list;
	that.type = type;
	that.sparr = spArr;
      console.log(that.pro)
      console.log(type)
      e.stopPropagation()
    }
    $scope.openZZC = function(list,e,type,plist){
      $scope.gxhProductFlag = true;
      that.pro = list;
	that.type = type;
	that.plist = plist;
      console.log(that.pro)
      console.log(type)
      e.stopPropagation()
    }
    
		// 获取订单下面的商品
		$scope.handleTargetData = (item, $event) => {
			if ($event.target.classList.contains('cor-check-box')) return; // 勾选
			item.clickcontrl = !item.clickcontrl;
			if (!item.clickcontrl) item.mousecontrol = 0; // 保证收起
			// if (item.clickcontrl && !item.clicked) { // 展开并更新product
			// 	const parmas = {
			// 		orderId: item.order.ID,
			// 		status: '10'
			// 	}
			// 	layer.load(2)
			// 	erp.postFun('app/order/getERPShipmentsOrderProduct', parmas, res => {
			// 		layer.closeAll('loading');
			// 		res.data.product.forEach(function (e, i) {
			// 			Object.assign(e, item.product[i])
			// 		})
			// 		item.product = res.data.product;
			// 		item.clicked = 1;
			// 	})
			// }
		}
	}])


	function AssembleSearchData($scope, data, selVal, inpVal) {
		// var mergeData = function (json) {
		// 	return Object.assign(data, {
		// 		orderNumber: '',
		// 		shopName: '',
		// 		sku: '',
		// 		cjProductName: '',
		// 		consumerName: '',
		// 		salesmanName: '',
		// 		shipmentsOrderId: '',
		// 		customerName: '',
		// 		split: '',
		// 		orderobserver: '',
		// 		CJTracknumber: '',
		// 	}, json);
		// };

		// switch (selVal) {
		// 	case '子订单号':
		// 		data = mergeData({ orderNumber: inpVal });
		// 		break;
		// 	case '店铺名称':
		// 		data = mergeData({ shopName: inpVal });
		// 		break;
		// 	case '商品SKU':
		// 		data = mergeData({ sku: inpVal });
		// 		break;
		// 	case '商品名称':
		// 		data = mergeData({ cjProductName: inpVal });
		// 		break;
		// 	case '客户名称':
		// 		data = mergeData({ consumerName: inpVal });
		// 		break;
		// 	case '业务员':
		// 		data = mergeData({ salesmanName: inpVal });
		// 		break;
		// 	case '群主':
		// 		data = mergeData({ ownerName: inpVal });
		// 		break;
		// 	case '母订单号':
		// 		data = mergeData({ shipmentsOrderId: inpVal });
		// 		break;
		// 	case '追踪号':
		// 		if ($scope.selstu == 3) {
		// 			if (inpVal) {
		// 				data = mergeData({ ydh: inpVal });
		// 			} else {
		// 				data = mergeData({ ydh: 'y' });
		// 			}
		// 		} else {
		// 			data = mergeData({ ydh: '' });
		// 		}
		// 		console.log(inpVal)
		// 		break;
		// 	case '历史追踪号':
		// 		if ($scope.selstu == 1) {
		// 			if (inpVal) {
		// 				data = mergeData({ ydh: inpVal });
		// 			} else {
		// 				data = mergeData({ ydh: '' });
		// 			}
		// 		}
		// 		console.log(inpVal)
		// 		break;
		// 	case 'CJ追踪号':
		// 		data = mergeData({ CJTracknumber: inpVal });
		// 		break;
		// 	case '收件人':
		// 		data = mergeData({ customerName: inpVal });
		// 		break;
		// 	case '客户订单号':
		// 		data = mergeData({ orderNumber: inpVal });
		// 		break;
		// 	case '参考号':
		// 		data = mergeData({ split: inpVal });
		// 		break;
		// 	case '僵尸订单':
		// 		data = mergeData({ orderobserver: inpVal ? inpVal : 'all' })
		// 		break;
		// }
		data.orderNumber = $scope.orderNumber;
		data.shopName = $scope.shopName;
		data.sku = $scope.sku;
		data.cjProductName = $scope.cjProductName;
		data.consumerName = $scope.consumerName;
		data.salesmanName = $scope.salesmanName;
		data.ownerName = $scope.ownerName;
		data.shipmentsOrderId = $scope.shipmentsOrderId;
		data.customerName = $scope.customerName;
		data.split = $scope.split;
		data.orderobserver = $scope.orderobserver;
		data.CJTracknumber = $scope.CJTracknumber;
		if ($scope.selstu == 3) {
			if ($scope.ydh) {
				data.ydh = $scope.ydh;
			} else {
				data.ydh = 'y';
			}
		} else if($scope.selstu == 1){
			if ($scope.ydh) {
				data.ydh = $scope.ydh;
			} else {
				data.ydh = '';
			}
		} else {
			data.ydh = '';
		}
		return data;
	}


	//缺货商品统计
	app.controller('StockStatisticscontroller', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
		const api = {
			deductUrl_old: 'app/order/orderdikoukucun',//抵扣库存 {ids: ''}  废弃
			deductUrl: 'processOrder/queryOrder/orderdikoukucun',//抵扣库存 {cjOrderIds: ['', '', ...]}
			listUrl_old: 'erp/order/queryWeiCaiGouBianTiCount',//缺货统计列表 {limit: '', page: '1', consumerName: ''} 废弃
			listUrl: 'processOrder/stockout/queryWeiCaiGouBianTiCount',//缺货统计列表 {pageSize: '', pageNum: '1', data: {search: ''}}
			storageUrl_old: 'erp/order/queryWeiCaiGouBianTiCountOrder',//{ids: '['','',...]'}
			storageUrl: 'processOrder/stockout/queryWeiCaiGouBianTiCountOrder',//{post ids: 'xxx,xxx,xxx...'}
			queryWeiCaigouBiantiCount:'payOrder/queryWeiCaiGouBianTiCount', // 直发单统计未采购订单
		}

		$scope.orderType = '0' // 0 代发单  1 直发单
		//客户页面
		$scope.search = '';
		$scope.pagesize = '100';
		$scope.pagenum = '1';
		$scope.pagenumarr = [10, 20, 30, 50];
		$scope.totalNum = 0;
		$scope.Datalist = [];
		$scope.orderBy = '';
		$scope.UserData = null;

		// -------------------------------------------------------------------------------------- 18-11-19 add 勾选标记
		$scope._Datalist = []
		$scope.tick_all_flag = false
		$scope.deduction_types = [{ val: 0, tag: '全部' }, { val: 1, tag: '已抵扣' }, { val: 2, tag: '未抵扣' }]
		$scope.deduction_type = $scope.deduction_types[0]
		// --------------------------------------------------------------------------------------
 
		$scope.skuorders = '';                     //每一行的订单号
		$scope.extendsList = []
		$scope.caigouList = []
		$scope.productList = []
		$scope.storageList = []


		function getList() {
			const params = {//缺货统计列表 {pageSize: '', pageNum: '1', data: {search: ''}}
				pageSize: $scope.pagesize.toString(),
				pageNum: $scope.pagenum.toString(),
				data: { search: $scope.search }
			}
			const url = $scope.orderType == '0' ? api.listUrl : api.queryWeiCaigouBiantiCount; 
			erp.mypost(url, params).then(res => {
      	const { count: total, list } = res;
				$scope.totalCounts = total * 1;
					if ($scope.totalCounts < 1) return $scope.Datalist = [];
					list.forEach(function (o, i) {
						o.flag = false;
						$scope.ordersL;
						$scope.extendsList = o.skuList;
						if(o.cjImage){
							o.cjImage = 'https://' + o.cjImage.replace('https://', '').replace('http://', '');
						}
						o.proInfo.forEach(function (k, j) {
							if(k.cjImage){
								k.cjImage = 'https://' + k.cjImage.replace('https://', '').replace('http://', '');
							}
						})
					});
					// -------------------------------------------------------------------------- 18-11-19 add 勾选标记
					for (var x = 0; x < list.length; x++) list[x].tick = false
					// --------------------------------------------------------------------------
					$scope.Datalist = $scope._Datalist = list;
					pageFun();
			})
		}
		getList();

		$scope.changeOrderType = function(val){
			$scope.orderType = val
			$scope.search = ''
			getList()
		}

		//批量抵扣
		$scope.pldkFun = function () {
			var str = '';
			var arr = $scope.Datalist;
			$.each(arr, function (i, v) {
				var skuList = v.proInfo;
				$.each(skuList, function (i, v) {
					if (v.kucun > 0) {
						str += v.orders;
					}
				});
			});
			var tbody = $('.ea-list-table').find('tbody');
			var allbutton = tbody.find('tr>td>button');
			layer.confirm('确认要抵扣吗？', {
				btn: ['确定', '取消']//按钮
			}, function (index) {
				layer.close(index);
				
				const params = { cjOrderIds: retFilterArr(str) }//抵扣库存 {cjOrderIds: ['', '', ...]}
				erp.load();
				erp.postFun(api.deductUrl, params, function ({data: { data: isSuccess }}) {
					erp.closeLoad();
					if (isSuccess === true) {
						layer.msg('抵扣成功');
						allbutton.addClass('gray');
					} else {
						layer.msg('抵扣失败');
					}
				}, function (data) {
					console.log(data);
					erp.closeLoad()
				})
			});
		};

		/**
		 * 获取需采购数量
		 * @param {object} item 列表单行对象
		 */
		$scope.getNeedPurchaseNum = function(item){
			const { warehouseResultVOS } = item
			let result = ''
			warehouseResultVOS.forEach(({warehouseName, num})=>{
				result += `${warehouseName}：${+num > 0 ? num : 0} <br/>`;
			})
			return result
		}

		/**
		 * 跳转到提交采购
		 * @param {object} item 子列表单行对象
		 */
		$scope.submitPurchase = function(item){
			const { sku } = item
			window.location.href = '/manage.html#/erppurchase/addpurchase?sku=' + sku
		}

		//点击下拉
		$scope.expendsorders = function (item) { 
			console.log(item)
			item.flag = true;
			$scope.caigouList = []
			$scope.productList = []
			$scope.storageList = []
			// getList();
			item.proInfo.forEach(ele=>{
			// $scope.extendsList.forEach(ele=>{
				console.log(ele);
				console.log(ele.orders)
				$scope.skuorders = ele.orders
			})
			console.log($scope.skuorders)
			// erp.postFun(api.storageUrl, {
			// 	'ids':$scope.skuorders
			// }, function ({data: {code, data}}) {
				
			// 	erp.closeLoad();
				
			// 	if(code === 200){
			// 		// togetStorageCounts(data,item,data.caigou[caigouordersku],caigouordersku)
			// 		if(data.caigou){
			// 			let caigouordersku = Object.getOwnPropertyNames(data.caigou).toString()
			// 			item.proInfo.forEach(ele=>{
			// 				if(caigouordersku == ele.sku){
			// 					console.log(data.caigou[caigouordersku])
			// 					for(i in data.caigou[caigouordersku]){
			// 						// obj[i] = data.caigou[caigouordersku][i]
			// 						$scope.caigouList.push({[i]:data.caigou[caigouordersku][i]})
			// 						ele.caigou1 = $scope.caigouList
			// 						console.log($scope.caigouList)
			// 					}
			// 				}
			// 			})
			// 		}
					
			// 		if(data.product){
			// 			let cangkuordersku = Object.getOwnPropertyNames(data.product).toString()
			// 			item.proInfo.forEach(ele=>{
			// 				if(cangkuordersku == ele.sku){
			// 					console.log(data.product[cangkuordersku])
			// 					for(i in data.product[cangkuordersku]){
			// 						// obj[i] = data.caigou[caigouordersku][i]
			// 						$scope.productList.push({[i]:data.product[cangkuordersku][i]})
			// 						ele.shengchan1 = $scope.productList
			// 						console.log($scope.productList)
			// 					}
			// 				}
			// 			})
			// 		}
			// 		if(data.storage){
			// 			let dingdanordersku = Object.getOwnPropertyNames(data.storage).toString()
			// 			item.proInfo.forEach(ele=>{
			// 				if(dingdanordersku == ele.sku){
			// 					console.log(data.storage[dingdanordersku])
			// 					for(i in data.storage[dingdanordersku]){
			// 						// obj[i] = data.caigou[caigouordersku][i]
			// 						$scope.storageList.push({[i]:data.storage[dingdanordersku][i]})
			// 						ele.kucun1 = $scope.storageList
			// 						console.log($scope.storageList)
			// 					}
			// 				}
			// 			})
			// 		}
			
			// 	}

			// }, err)
		 }


		//点击表格行留下颜色
		$scope.TrClick = function (i) {
			$scope.focus = i;
		}

		// ------------------------------------------- 18-11-19 add 勾选标记
		$scope.verify_pick_all = function () {
			var flag = true
			for (var x = 0; x < $scope.Datalist.length; x++) {
				if (!$scope.Datalist[x].tick) {
					flag = false
					break
				}
			}
			$scope.tick_all_flag = flag
		}
		$scope.pick_order_all = function () {
			for (var x = 0; x < $scope.Datalist.length; x++) $scope.Datalist[x].tick = $scope.tick_all_flag ? false : true
			$scope.verify_pick_all()
		}
		$scope.pick_order_item = function (item) {
			item.tick = !item.tick
			$scope.verify_pick_all()
		}
		$scope.batch_deduction_operate = function () {

		}
		$scope.select_deduction_type = function (ev) {
			var arr = [], item = null
			for (var x = 0; x < $scope._Datalist.length; x++) {
				if (0 === $scope.deduction_type.val) arr.push($scope._Datalist[x])
				if (1 === $scope.deduction_type.val) +$scope._Datalist[x].kucun === 0 && arr.push($scope._Datalist[x])
				if (2 === $scope.deduction_type.val) +$scope._Datalist[x].kucun > 0 && arr.push($scope._Datalist[x])
			}
			$scope.Datalist = arr
			$scope.verify_pick_all()
		}
		// -------------------------------------------

		//分页
		function pageFun() {
			$(".pagegroup").jqPaginator({
				totalCounts: $scope.totalCounts || 1,
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
					$scope.pagenum = n;
					getList();
				}
			});
		}
		//加入黑名单
		$scope.addBlank = function (item) {
			console.log(item);
			layer.confirm(gjh30, {
				title: '操作提示',
				icon: 3,
				btn: [gjh10, gjh55] //按钮
			}, function (ca) {
				layer.close(ca);
			}, function (index) {
				erp.postFun('app/user/updateAffAccountByDistributionState', {
					id: item.id,
					'distributionState': '5'
				}, function (res) {
					if (res.data.code == 200) {
						layer.msg(gjh24);
						layer.close(index);
						getList();
					} else {
						layer.msg(gjh25)
					}
				}, function (res) {
					layer.msg(gjh25)
				})
			}
			);
		}
		$scope.pagesizechange = function (pagesize) {
			console.log(pagesize);
			$scope.pagenum = 1;
			getList();
		};
		$scope.pagenumchange = function () {
			var pagenum = Number($scope.pagenum);
      var totalpage = Math.ceil($scope.totalCounts / $scope.pagesize);
      if(!(/(^[1-9]\d*$)/.test(pagenum)) || pagenum > totalpage) {
        layer.msg('请输入正确页码');
        $scope.pagenum = '1';
        return;
      }
      getList();
			//console.log($scope.pagenum % 1)
			//$scope.pagenum = $(".goyema").val() - 0;
			//if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
			//    layer.msg(gjh29);
			//    $(".goyema").val(1)
			//} else {
			//    getList();
			//}
		}
		//搜索客户
		$scope.searchcustomer = function () {
			console.log('搜索条件', $scope.search);
			$scope.orderBy = '';
			$scope.pagenum = 1;
			getList();
		}
		//按下enter搜索
		$scope.enterSearch = function (event) {
			if (event.keyCode === 13 || event.keyCode === 108) {
				console.log('搜索条件', $scope.search);
				$scope.orderBy = '';
				$scope.pagenum = 1;
				getList();
			}
		}
		function err(n) {
			// erp.closeLoad();
			layer.closeAll('loading');
			console.log(n);
		}
		//根据sku查商品
		$scope.goToPro = function (sku) {
			console.log(sku);
			location.href = '#/merchandise/list/drop/3/' + sku;
		}

		$(window).scroll(function () {
			//console.log($(window).scrollTop());
			var top = $(window).scrollTop();
			var w = $('.thead').css('width');
			//console.log(top);
			if (top > 82) {
				//console.log(w);
				$('.thead').css({
					"position": "fixed",
					"top": 0,
					"width": w
				})
			} else {
				//$('.thead').css("position","static");
				$('.thead').css({
					"position": "static",
					"top": 0,
					"width": ''
				})
			}
		});

		$scope.classNull = function (skuList) {
			var count = 0;
			$.each(skuList, function (i, v) {
				if (v.orders == '') {
					count++;
				}
			});
			if (count == skuList.length) {
				return true;
			} else {
				return false;
			}
		}
		$scope.dikouFun = function (skuList, index) {
			var tbody = $('.ea-list-table').find('tbody').eq(index);
			var tr = tbody.find('tr').eq(0);
			var button = tr.find('td>button');
			console.log(button);
			var allbutton = tbody.find('tr>td>button');
			console.log(allbutton);
			if (button.hasClass('gray')) {

			} else {
				var ids = '';
				$.each(skuList, function (i, v) {
					ids += v.orders;
				});
				
				layer.confirm('确认要抵扣吗？', {
					btn: ['确定', '取消']//按钮
				}, function (index) {
					layer.close(index);
					erp.load();
					const params = { cjOrderIds: retFilterArr(ids) }//抵扣库存 {cjOrderIds: ['', '', ...]}
          
					erp.postFun(api.deductUrl, params, function ({data: { data: isSuccess }}) {
						
						erp.closeLoad();
						if (isSuccess === true) {
							layer.msg('抵扣成功');
							allbutton.addClass('gray');
						} else {
							layer.msg('抵扣失败');
						}
					}, function (data) {
						console.log(data);
						erp.closeLoad()
					})
				});

			}

		};
		$scope.dikouFun2 = function (orders, index, index1) {
			console.log(index, index1 + 1);
			var tbody = $('.ea-list-table').find('tbody').eq(index);
			var tr = tbody.find('tr').eq(index1 + 1);
			var button = tr.find('td>button');
			console.log(button);
			if (button.hasClass('gray')) {
			} else {
				layer.confirm('确认要抵扣吗？', {
					btn: ['确定', '取消']//按钮
				}, function (index) {
					layer.close(index);
					erp.load();
					const params = { cjOrderIds: retFilterArr(orders) }//抵扣库存 {cjOrderIds: ['', '', ...]}
          
					erp.postFun(api.deductUrl, params, function ({data: { data: isSuccess }}) {
						
						erp.closeLoad();
						if (isSuccess === true) {
							layer.msg('抵扣成功');
							button.addClass('gray');
						} else {
							layer.msg('抵扣失败');

						}
					}, function (data) {
						console.log(data);
						erp.closeLoad()
					})
				});
			}
		};
		function dikou(data2) {
			console.log(data2);

		}
		function retFilterArr(str) {
			if (!str) return [];
			return str.split(',').filter(str => str)// 过滤空字符串情况
		}
	}]);

	// ------------------------------------------------------------------------------ 18-11-25 add 滞留订单查询
	app.controller('stranded-order-query-controller', ['$scope', 'erp', function ($scope, erp) {
		console.log('stranded-order-query-controller -> 滞留订单查询');
		$scope.stranded_days = '30' // 滞留天数
		$scope.customer_name = '' // 客户名称
		$scope.salesman = '' // 业务员名称
		$scope.is_vip = true
		$scope.is_show_priority = false
		$scope.orderList = []
		$scope.priorityList = [] // 优先处理列表

		/* 只能输入大于0的数字 */
		$scope.inputStrandedDays = function (oInput) {
			var val = oInput.value.replace(/[^\d+]/g, '')
			$scope.stranded_days = (oInput.value = val.length > 1 ? +val : val).toString()
		}
		$scope.addOrder = function (ev) {
			var tpl1 = `
				<div>
					<span>订单号</span>
					<input id="order-number" type="text" />
				</div>
				<div class="margin-t-10">
					<span>业务员</span>
					<input id="salesman" type="text" />
				</div>
				<div class="margin-t-10">
					<span>备&nbsp;&nbsp;&nbsp;注</span>
					<textarea></textarea>
				</div>
			`

			layer.open({
				title: '添加优先处理的订单',
				btn: ['取消', '确定'],
				content: tpl1,
				btn1: function (id) {
					layer.close(id)
				},
				btn2: function (id) {
					var order = $(`#layui-layer${id} #order-number`).val()
						, salesman = $(`#layui-layer${id} #salesman`).val()
						, remark = $(`#layui-layer${id} textarea`).val()

					if (order.indexOf('CJ') !== 0) return layer.msg('请输入正确的母订单号')
					savePriority({
						userId: '',
						ordername: order,
						yewuyuan: salesman,
						remark: remark
					})
				}
			})
		}
		$scope.togglePriorityPanel = function (ev) {
			if ($scope.is_show_priority = !$scope.is_show_priority) queryPriorityList()
		}
		function savePriority (data) {
			erp.load() // 加载动画
			erp.postFun('erp/order/saveYouXianPaihang', data, function (rs) {
				erp.closeLoad()
				if (rs.data.statusCode != '200') layer.msg(rs.data.message)
				else {
					layer.msg('添加成功')
					$scope.orderList = $scope.orderList.map(ele => {
						if (ele.id === data.userId) ele.checkReplace = 1
						return ele
					})
					queryPriorityList()
				}
			})
		}
		$scope.addRemark = function (item) {
			layer.open({
				title: '请填写备注',
				btn: ['取消', '确定'],
				content: `<textarea></textarea>`,
				btn1: function (id) {
					layer.close(id)
				},
				btn2: function (id) {
					item.remark = $(`#layui-layer${id} textarea`).val()
					savePriority({
						userId: item.id,
						ordername: item.loginName,
						yewuyuan: item.yewuyuan,
						remark: item.remark
					})
				}
			})
		}
		$scope.deletePriorityList = function (item, idx) {
			erp.load() // 加载动画
			erp.postFun('erp/order/deleteYouXianPaihang', {
				id: +item.id
			}, function (rs) {
				erp.closeLoad()
				if (rs.data.statusCode != '200') layer.msg(rs.data.message)
				else {
					layer.msg('删除成功')
					$scope.priorityList = $scope.priorityList.filter(ele => ele.id !== item.id)
					/* 同步列表中的添加按钮功能 */
					$scope.orderList = $scope.orderList.map(ele => {
						if (ele.loginName === item.ordername) ele.checkReplace = null
						return ele
					})
				}
			})
		}
		function queryPriorityList() {
			erp.load() // 加载动画
			erp.postFun('erp/order/queryYouXianPaihang', JSON.stringify({}), function (rs) {
				erp.closeLoad()
				if (rs.data.statusCode != '200') layer.msg(rs.data.message)
				else {
					rs.data.result.forEach(ele => ele._createdate = moment(+ele.createdate.time).format('YYYY-MM-DD HH:mm:ss')) // 格式化创建时间
					if (rs.data.result.length > 0) console.log('优先级列表 ->', $scope.priorityList = rs.data.result)
					else {
						layer.msg('暂无数据')
						$scope.priorityList = []
					}
				}
			})
		}
		function queryStranedOrder() {
			if (+$scope.stranded_days <= 0) return layer.msg('请输入滞留天数')

			var data = { days: $scope.stranded_days, name: $scope.customer_name, yewuyuan: $scope.salesman }
			$scope.is_vip && (data.vip = 'y')
			erp.load() // 加载动画
			erp.postFun('erp/order/getVipOrderYanChiQingKuang', JSON.stringify(data), function (data) {
				erp.closeLoad()
				if (data.data.statusCode != '200') layer.msg('查询失败')
				else {
					if (data.data.result.length > 0) console.log('滞留商品 ->', $scope.orderList = data.data.result)
					else {
						layer.msg('暂无数据')
						$scope.orderList = []
					}
				}
			}, function () {
				erp.closeLoad();
				layer.msg('网络错误')
			})
		}
		queryStranedOrder() // 进入触发一次查询
		$scope.search = queryStranedOrder
	}])
	// ------------------------------------------------------------------------------ 18-11-25 add

})()
