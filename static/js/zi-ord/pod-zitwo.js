;~function () {
	
	var app = angular.module('custom-zitwo-app');
	function AssembleSearchData($scope,data, selVal, inpVal) {
		// var mergeData = function (json) {
		// 	return Object.assign(data, {
		// 		orderNumber: '',
		// 		shopName: '',
		// 		sku: '',
		// 		cjProductName: '',
		// 		consumerName: '',
		// 		salesmanName: '',
		// 		ownerName: '',
		// 		shipmentsOrderId: '',
		// 		ydh: 'all',
		// 		customerName: '',
		// 		split: '',
		// 		orderobserver: '',
		// 		CJTracknumber: '',
		// 	}, json);
		// };
    //
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
		// 		if (inpVal) {
		// 			data = mergeData({ ydh: inpVal });
		// 		} else {
		// 			data = mergeData({ ydh: 'all' });
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
    if ($scope.ydh) {
      data.ydh =$scope.ydh;
    }


		const temp = angular.copy(data)
		data.data = temp
		return data;
	}
	// pod订单
	app.controller('pod-zitwo-controller',['$scope','$http','erp','$routeParams','$compile','$timeout',function ($scope,$http,erp,$routeParams,$compile,$timeout) {
		
		$scope.$on('repeatFinishCallback',function(){
			// alert(6666666666)
		    $('#c-zi-ord .edit-inp').attr('disabled','true');
		});
		$scope.curTime = new Date().getTime();
		$scope.dayFun = function (day1,day2) {
			let oday1 = new Date(day1).getTime();
			// console.log(oday1)
			return Math.ceil((day2 - oday1) / 86400000)
		}

    $scope.toggleSeaFun = function(){
      $scope.moreSeaFlag = !$scope.moreSeaFlag;
      console.log($scope.moreSeaFlag)
    }

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
		var aDate = GetDateStr(-45);
		var enDate = GetDateStr(0);
		// $("#c-data-time").val(aDate );   //关键语句
		// $("#cdatatime2").val(enDate );   //关键语句
		$scope.isSelJqcz = '业务员';
		var bs = new Base64();
		var loginSpace = localStorage.getItem('space');
		var erpLoginName = bs.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
		var muId = '';
		var erpuserId = localStorage.getItem('userId')==undefined?'':bs.decode(localStorage.getItem('userId'));
		console.log(erpuserId)
		var loginAddress = localStorage.getItem('address')==undefined?'':bs.decode(localStorage.getItem('address'));
		console.log(loginAddress)
		var loStore = localStorage.getItem('store')==undefined?'':localStorage.getItem('store');
		var nowTime = new Date().getTime();
		var setTiem = localStorage.getItem('setCsTime')==undefined?'':localStorage.getItem('setCsTime');
		var getCsObj = localStorage.getItem('ziCs')==undefined?'':JSON.parse(localStorage.getItem('ziCs'));
		var isSetCsFlag = false;//是否携带参数
		if (erpLoginName=='admin'||erpLoginName=='邹丽容'||erpLoginName=='金仙娟'||erpLoginName=='李贞'||erpLoginName=='虞雅婷'||erpLoginName=='杨玉磊'||erpLoginName=='陈真') {
			$scope.isShowFlag = true;
		} else {
			$scope.isShowFlag = false;
		}
		if (erpLoginName=='admin'||erpLoginName=='金仙娟'||erpLoginName=='李贞'||erpLoginName=='李正月'||erpLoginName=='王波' || erpLoginName == '赵炜') {
			$scope.cxclAdminShowFlag = true;
		} else {
			$scope.cxclAdminShowFlag = false;
		}
		if(nowTime-setTiem>1500){
			isSetCsFlag = false;
		}else{
			isSetCsFlag = true;
			$scope.isSelJqcz = getCsObj.tj;
			$("#c-data-time").val(getCsObj.btime);
			$("#cdatatime2").val(getCsObj.etime);
			$('.c-seach-country').val(getCsObj.tj);
			$('.c-seach-inp').val(getCsObj.val);
			console.log(nowTime-setTiem)
		}
		// alert($routeParams.muId)
		if ($routeParams.muId!=''&&$routeParams.muId!=undefined) {
			muId = $routeParams.muId;
		}
		if(muId!=''){
			$scope.isSelJqcz = '母订单号';
			$('.c-seach-inp').val(muId);
			$scope.muIdFlag = true;
			getMuNumFun(muId,$scope.store)
		}else{
			$scope.muIdFlag = false;
		}
		// $('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
		console.log(loStore)
		console.log(loginSpace)
		if(loginSpace){
			if(loginSpace=='深圳'){
				$scope.store = 1;
				$('.two-ck-btn').eq(1).addClass('two-ck-activebtn');
				$scope.whichOneCk = '08898c4735bf43068d5d677c1d217ab0';
			}else if(loginSpace=='美国'){
				$scope.store = 2;
				$('.two-ck-btn').eq(2).addClass('two-ck-activebtn');
				$scope.whichOneCk = 'd3749885b80444baadf8a55277de1c09';
			}else{
				$scope.store = 0;
				$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
				$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			}
		}else{
			$scope.store = 0;
			$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
			$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
		}
		function getMuNumFun(sid,store){
			erp.getFun('order/order/getOrderStateCountBySid?sid='+sid+'&store='+store,function(data){
				console.log(data)
				if(data.data.statusCode==200){
					var numObj = data.data.result;
					$scope.podWeiChuanSong = numObj.podWeiChuanSong;
					$scope.podYiChuanSong = numObj.podYiChuanSong;
					$scope.podDaiShouHuo = numObj.podDaiShouHuo;
					$scope.podYiDaoHuo = numObj.podYiDaoHuo;
					$scope.podQueHuo = numObj.podQueHuo;
					$scope.podCiPin = numObj.podCiPin;
					$scope.podYanHuoWanCheng = numObj.podYanHuoWanCheng;
					$scope.podTuPianQueShi = numObj.podTuPianQueShi;
				}else if(data.data.statusCode==401){
					$scope.muIdFlag = false;
				}else{
					layer.msg(data.data.message)
					$scope.muIdFlag = false;
				}
			},function(data){
				console.log(data)
			})
		}
		function getNumFun() {
			erp.postFun('processOrder/queryOrder/getOrderCount10', {
				'store': $scope.store,
				'pod': 'pod'
			}, function (data) {
				console.log(data)
				if (data.data.code == 200) {
					var numObj = data.data.data;
					console.log(numObj)
					$scope.dYi = numObj.weichuansong;
					$scope.dEr = numObj.yichuansong;
					$scope.dSan = numObj.daishouhuo;
					$scope.yidaohuo = numObj.yidaohuo;
					$scope.quehuo = numObj.quehuo;
					$scope.cipin = numObj.cipin;
					$scope.complete = numObj.complete;
					$scope.pictureMissing = numObj.pictureMissing;
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.pageSize = '100';
		$scope.pageNum = 1;
		$scope.oneOrMuch = 1;//单品 多品
		$scope.selstu = 2;//前端订单状态
		$scope.jieDanStu = 4;//接单状态
		function getOrdListFun() {
	        erp.load();
	        var erpData = {};
	        erpData.storageId = $scope.whichOneCk;
	        erpData.store = $scope.store;
	        erpData.status = '31';
	        erpData.ydh = 'all';
	        erpData.trackingnumberType = 'all';
	        erpData.pageSize = $scope.pageSize;
	        erpData.pageNum = $scope.pageNum;
	        seltjFun(erpData)
	        erp.postFun('processOrder/queryOrder/queryPendingOrderPageByParam', JSON.stringify(erpData), function (data) {
	        	console.log(data)
	        	layer.closeAll("loading")
	        	var erporderResult = data.data.data;//存储订单的所有数据
	        	$scope.erpordTnum = erporderResult.total;
	        	$scope.podSkuSortList = erporderResult.podSkuSortList;
	        	$scope.selSpSku = erporderResult.maxSku;
	        	if(erporderResult.maxSku){
	        		var productArr;
	        		for(var i = 0,len=erporderResult.ordersList.length;i<len;i++){
	        			productArr = erporderResult.ordersList[i].product;
	        			console.log(productArr)
	        			if(productArr&&JSON.stringify(productArr)!='[]'){
	        				console.log(erporderResult.maxSku)
	        				for(var k = 0,kLen=productArr.length;k<kLen;k++){
	        					if(productArr[k].SKU.indexOf(erporderResult.maxSku)!=-1){
	        						erporderResult.ordersList[i].product[k].dang = 1;
	        					}
	        				}
	        			}
	        		}
	        	}
				$scope.erporderList = erporderResult.list;
	        	console.log($scope.erporderList)
	        	countMFun($scope.erporderList);
	        	dealpage ()
				getNumFun()
	        }, function () {
	        	layer.closeAll("loading")
	        	layer.msg('订单获取列表失败')
			})
			var inpVal = $.trim($('.c-seach-inp').val())
			if($scope.isSelJqcz=='母订单号'&&inpVal){
				$scope.muIdFlag = true;
				getMuNumFun(muId,$scope.store)
			}else{
				$scope.muIdFlag = false;
			}
		}
		// getOrdListFun()

		$scope.storageCallback = function({item, storageList, allIdString}){
			$scope.store = $scope.whichOneCk = allIdString
			if(!!item){
				$scope.store = $scope.whichOneCk = item.dataId
			}
			$scope.pageNum = '1'
			getOrdListFun()
		}

		// 显示采购员列表
		// 查看采购单操作日志
		$scope.purchaseOrderCallback = function(showPurchases){
			$scope.showPurchases = showPurchases
		}
		
		function countMFun (val) {
			var len = val.length;
			var count=0;
			for(var i = 0;i<len;i++){
				count+=val[i].order.amount;
			}
			$scope.countMoney = count.toFixed(2)
			console.log($scope.countMoney);
		}
		//处理分页
		function dealpage () {
			erp.load();
			$('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			if(!$scope.erpordTnum||$scope.erpordTnum<=0){
				layer.msg('未找到订单')
				layer.closeAll("loading")
				return;
			}
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: $scope.pageSize-0,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.pageNum*1,
				activeClass: 'active',
			    prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
			    next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
			    page: '<a href="javascript:void(0);">{{page}}<\/a>',
			    first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
			    last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
			    onPageChange: function (n,type) {
			    	console.log(n)
			        if(type=='init'){
			        	layer.closeAll("loading")
			        	return;
			        }
			        $scope.pageNum = n;
			        getOrdListFun()
			    }
			});
		}
		//分页选择框的切换
		$scope.changePageFun = function(){
			$scope.pageNum = 1;
			getOrdListFun()
		}
		//供应商接单状态查询
		$scope.jieDanFun = function(stu){
			$scope.jieDanStu = stu;
			console.log($scope.jieDanStu)
			$('.jiedan-stu').removeClass('jiedan-stuact')
			if ($scope.jieDanStu==4) {
				$('.jiedan-stu').eq(0).addClass('jiedan-stuact')
			} else if($scope.jieDanStu==0){
				$('.jiedan-stu').eq(1).addClass('jiedan-stuact')
			} else if($scope.jieDanStu==1){
				$('.jiedan-stu').eq(2).addClass('jiedan-stuact')
			} else if($scope.jieDanStu==3){
				$('.jiedan-stu').eq(3).addClass('jiedan-stuact')
			}
			$scope.pageNum = 1;
			getOrdListFun()
		}
		// 供应商 商品名称
		erp.postFun('caigou/dzgongyingshangpin/getAllGysName',{},function(data){
			console.log(data)
			$scope.gysList = data.data.result;
		},function(data){
			console.log(data)
		})
		erp.postFun('caigou/dzgongyingshangpin/getAllSkuByGys',{},function(data){
			console.log(data)
			$scope.skuSpList = data.data.result;
		},function(data){
			console.log(data)
		})
		function gysGlSkuFun(){
			erp.postFun('caigou/dzgongyingshangpin/getAllSkuByGys',{
				"gysid":$scope.gysId
			},function(data){
				console.log(data)
				$scope.skuSpList = data.data.result;
			},function(data){
				console.log(data)
			})
		}
		$scope.filGysFun = function(){
			gysGlSkuFun()
			$scope.pageNum = 1;
			getOrdListFun()
		}
		$scope.filSpFun = function(item){
			$scope.filSpId = item.sku;
			$scope.pageNum = 1;
			getOrdListFun()
		}
		$scope.filSpSkuFun = function(){
			$scope.pageNum = 1;
			getOrdListFun()
		}
		$('.fil-sp-box').mouseenter(function() {
			$('.fil-spul-box').show();
		});
		$('.fil-sp-box').mouseleave(function() {
			$('.fil-spul-box').hide();
		});
		//获取物流方式
		erp.postFun('app/erplogistics/queryLogisticMode',{
			"param":"",
			"status":"1"
		},function (data) {
			console.log(data)
			$scope.wlNameList = data.data.result;
		},function(data){
			console.log(data)
		})
		$scope.wlFilterFun = function () {
			console.log($scope.wlModeName)
			$scope.pageNum = 1;
			getOrdListFun()
		}

		//传送供应商
		var plcsIds = '';
		var prventMoreFlag = true;
		$scope.plcsgysFun = function(){
			var plcsCount = 0;
			plcsIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					plcsCount++;
					plcsIds+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			if (plcsCount>0) {
				erp.postFun('caigou/dzgongyingshangpin/getAllGysName',{
					sku: $scope.selSpSku
				},function(data){
					console.log(data)
					$scope.gulianGysList = data.data.result;
					if(data.data.result&&JSON.stringify(data.data.result)!='[]'){
						$scope.gulianGysList = data.data.result;
						$scope.csGysFlag = true;
					}else{
						layer.msg('该商品没有供应商')
					}
				},function(){
					console.log(data)
				})
			} else {
				$scope.csGysFlag = false;
				layer.msg('请选择订单')
			}
		}
		$scope.sureBulkCsGysFun = function(){
			// console.log(prventMoreFlag)
			if(!prventMoreFlag){
				layer.msg('请勿重复点击')
				return
			}
			if(!$scope.csGysId){
				layer.msg('请选择供应商')
				return
			}
			prventMoreFlag = false;
			var upJson = {};
			upJson.gysid = $scope.csGysId;
			upJson.orderids = plcsIds;
			upJson.sku = $scope.selSpSku;
			erp.postFun('caigou/dzgongyingshangpin/csgys',JSON.stringify(upJson),function(data){
				console.log(data)
				$scope.csGysFlag = false;
				prventMoreFlag = true;
				if (data.data.statusCode==200) {
					layer.msg('传送成功')
					$scope.selSpSku = '';
					$scope.pageNum = 1;
					getOrdListFun()
				} else {
					layer.msg(data.data.message)
				}
			},function(data){
				console.log(data)
				prventMoreFlag = true;
			})
		}
		$scope.plZhGysFun = function(){
			var plcsCount = 0;
			plcsIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					plcsCount++;
					plcsIds+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			if (plcsCount>0) {
				erp.postFun('caigou/dzgongyingshangpin/getAllGysName',{
					sku: $scope.selSpSku
				},function(data){
					console.log(data)
					$scope.gulianGysList = data.data.result;
					if(data.data.result&&JSON.stringify(data.data.result)!='[]'){
						$scope.gulianGysList = data.data.result;
						$scope.zhGysFlag = true;
					}else{
						layer.msg('该商品没有供应商')
					}
				},function(){
					console.log(data)
				})
			} else {
				$scope.zhGysFlag = false;
				layer.msg('请选择订单')
			}
		}
		$scope.sureBulkZhGysFun = function(){
			if(!prventMoreFlag){
				layer.msg('请勿重复点击')
				return
			}
			if(!$scope.zhGysId){
				layer.msg('请选择供应商')
				return
			}
			prventMoreFlag = false;
			var upJson = {};
			upJson.gysid = $scope.zhGysId.split('#')[0];
			upJson.gysname = $scope.zhGysId.split('#')[1];
			upJson.orderids = plcsIds;
			upJson.sku = $scope.selSpSku;
			console.log($scope.zhGysId)
			erp.postFun('caigou/dzgongyingshangpin/changeGys',JSON.stringify(upJson),function(data){
				console.log(data)
				$scope.zhGysFlag = false;
				prventMoreFlag = true;
				if (data.data.statusCode==200) {
					layer.msg('转换成功')
					$scope.pageNum = 1;
					getOrdListFun()
				} else {
					layer.msg(data.data.message)
				}
			},function(data){
				console.log(data)
				prventMoreFlag = true;
			})
		}
		
		//跳页的查询
		$scope.gopageFun = function () {
			if (!$scope.pageNum||$scope.pageNum<1) {
				layer.closeAll("loading")
				layer.msg('跳转页数不能为空!');
				return;
			}
			var countN = Math.ceil($scope.erpordTnum/$scope.pageSize);
			// alert(countN)
			if ($scope.pageNum>countN) {
				layer.closeAll("loading")
				layer.msg('选择的页数大于总页数.');
				return;
			}
			$scope.pageNum = 1;
			getOrdListFun()
		}
		//按生成追踪号的类型搜索
		$scope.zzhstuFlag = true;
		$scope.checkBoxFun = function (ev) {
			$scope.pageNum = 1;
			erp.load();
			var $evObj = $(ev.target);
	        var erpData = {};
	        erpData.ydh = 'all';
	        if(muId!=''){
	        	erpData.id = muId;
	        }else {
	        	erpData.id = '';
	        }
	        if ($evObj.is(':checked')) {
	        	erpData.trackingnumberType = 1;
	        	$scope.zzhstuFlag = true;
	        } else {
	        	erpData.trackingnumberType = 'all';
	        	$scope.zzhstuFlag = false;
	        }
	        erpData.cjOrderDateBegin = $('#c-data-time').val();
	        erpData.cjOrderDateEnd = $('#cdatatime2').val();
	        var showList = $('#page-sel').val()-0;
			seltjFun(erpData);
			erpData.pageSize = showList ;
			erpData.pageNum = 1;
	        console.log(erpData)
	        console.log(JSON.stringify(erpData))
	        erp.postFun('processOrder/queryOrder/queryPendingOrderPageByParam',JSON.stringify(erpData),function (data) {
	        	console.log(data)
	        	layer.closeAll("loading")
	        	console.log(data.data.productsList)
	        	var erporderResult = data.data;//存储订单的所有数据
	        	$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				$scope.podSkuSortList = erporderResult.podSkuSortList;
				$scope.selSpSku = erporderResult.maxSku;
				if(erporderResult.maxSku){
					var productArr;
					for(var i = 0,len=erporderResult.ordersList.length;i<len;i++){
						productArr = erporderResult.ordersList[i].product;
						console.log(productArr)
						if(productArr&&JSON.stringify(productArr)!='[]'){
							console.log(erporderResult.maxSku)
							for(var k = 0,kLen=productArr.length;k<kLen;k++){
								if(productArr[k].SKU.indexOf(erporderResult.maxSku)!=-1){
									erporderResult.ordersList[i].product[k].dang = 1;
								}
							}
						}
					}
					$scope.erporderList = erporderResult.ordersList;
				}else{
					$scope.erporderList = erporderResult.ordersList;
				}
				countMFun($scope.erporderList);
				dealpage ();
				getNumFun()
	        },function () {
	        	layer.closeAll("loading")
	        	layer.msg('订单获取列表失败')
	        })
		}

		//获取仓库
		erp.postFun('app/storagedo/getStorageDoList','{}',function (data) {
		    console.log(data)
		    $scope.ckArr = data.data.list;
		    console.log($scope.ckArr)
		},function (data) {
		    erp.closeLoad();
		    console.log('仓库获取失败')
		})
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
			erp.load();
			var addyfhData = {};
			addyfhData.ids = addyfhIds;
			addyfhData.type = '62';
			console.log(JSON.stringify(addyfhData))
			erp.postFun('app/order/nextFlow',JSON.stringify(addyfhData),function (data) {
				console.log(data)
				$scope.isaddyfhFlag = false;
				if (data.data.result==true) {
					layer.msg('提交成功')
					$scope.pageNum = 1;
					getOrdListFun()
				} else {
					layer.closeAll("loading")
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
			singleAddYfhId = item.ID;
			singleAddYfhIndex = index;
			console.log(singleAddYfhId)
			console.log(singleAddYfhIndex)
			// $scope.stopFun();
		}
		$scope.singleCancelFun = function () {
			$scope.singleisaddyfhFlag = false;
		}
		$scope.singleSureFun = function () {
			erp.load();
			var addyfhData = {};
			addyfhData.ids = singleAddYfhId;
			addyfhData.type = '62';
			console.log(JSON.stringify(addyfhData))
			erp.postFun('app/order/nextFlow',JSON.stringify(addyfhData),function (data) {
				console.log(data)
				$scope.singleisaddyfhFlag = false;
				layer.closeAll("loading")
				if (data.data.result==true) {
					$scope.erporderList.splice(singleAddYfhIndex,1);
					$scope.erpordTnum--;
					countMFun($scope.erporderList);
				} else {
					layer.msg('批量提交到已发货失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//展示历史追踪号
		$scope.hisTraNumFun = function (item) {
			$scope.hisTrackNumFlag = true;
			// console.log(item.TRACKINGNUMBERHISTORY)
			// console.log(item.TRACKINGNUMBERHISTORY.replace(item.TRACKINGNUMBERHISTORY.split(',').pop(),''))
			// console.log(item.TRACKINGNUMBERHISTORY.split(',').pop().join(','))
			var hisArr = item.TRACKINGNUMBERHISTORY.replace(item.TRACKINGNUMBER,'');
			hisArr = hisArr.split(',');
			$scope.hisArr = hisArr;
		}
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
		$scope.lrFun = function (item,ev,index) {
			// ev.stopPropagation();
			// var $lrbtnObj = $(ev.target);
			// $lrbtnObj.hide();
			// $lrbtnObj.siblings().show();
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
			// var $lrbtnObj = $(ev.target);
			// var lrordId,inpVal;
			// lrordId = item.ID;
			// inpVal = $lrbtnObj.siblings('.zzh-inp').val();
			var lrData = {};
			lrData.logisticsNumber = $scope.lrzzhNum;
			lrData.id = $scope.lrId;
			lrData.href = $scope.lrHref;
			console.log(JSON.stringify(lrData))
			erp.postFun('app/order/upLogisticsNumber',JSON.stringify(lrData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.zzhChaFlag = false;
				if (data.data.result>0) {
					if($scope.selstu == 1){
						$scope.erporderList.splice(index,1);
						$scope.erpordTnum--;
						countMFun ($scope.erporderList);
						layer.msg('添加追踪号成功')
					}else{
						layer.msg('修改追踪号成功')
						// $lrbtnObj.siblings('.lr-zzhbtn').siblings().hide();
						// $lrbtnObj.siblings('.lr-zzhbtn').show();
						// $lrbtnObj.siblings('.zzh-inp').val('');
						$scope.erporderList[$scope.lrIndex].order.TRACKINGNUMBER = $scope.lrzzhNum;
						$scope.erporderList[$scope.lrIndex].order.TRACKINGNUMBERHISTORY = $scope.lrzzhNum+','+$scope.erporderList[$scope.lrIndex].order.TRACKINGNUMBERHISTORY;
					}
					$scope.lrzzhNum = '';
					$scope.lrHref = '';
				} else {
					layer.msg('添加追踪号失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//搜索
		$('.c-seach-inp').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
		})

		$('.c-seach-enter').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
		})

		$scope.searchFun = function () {
			$scope.pageNum = 1;
			getOrdListFun()
		}
		//按时间搜索
		//erp开始日期搜索
		$("#c-data-time").click(function (){
			var erpbeginTime=$("#c-data-time").val();
			var interval=setInterval(function (){
				var endtime2=$("#c-data-time").val();
				if(endtime2!=erpbeginTime){
					clearInterval(interval);
					$scope.pageNum = 1;
					getOrdListFun()
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
					$scope.pageNum = 1;
					getOrdListFun()
				}
			},100)
		})

		//按条件搜索
		function seltjFun (data) {
			if ($('.seach-ordnumstu').is(':checked')) {
				data.trackingnumberType = 1;
			} else {
				data.trackingnumberType = 'all';
			}
			data.store = $scope.store;
			data.pod = 'pod'
			//判断状态
			if ($scope.selstu==2) {//未传送
				data.status = '31';
				data.flag = 0;
				data.gys_id = $scope.gysId;
				// data.gys_sku = $scope.filSpId;
				data.gys_sku = $scope.selSpSku;
				data.oneOrMuch = $scope.oneOrMuch;
				data.storageId = $scope.whichOneCk;
				if ($scope.wlModeName) {
					data.logisticNameen = $scope.wlModeName.split('-')[1]
					if($scope.wlModeName.split('-')[0]=='深圳E邮宝'){
						data.logisticMode = '深圳壹电商深圳E邮宝'
					}else{
						data.logisticMode = $scope.wlModeName.split('-')[0]
					}
				}
			} else if($scope.selstu==3) {
				data.status = '32';
				data.flag = 0;
				data.gys_id = $scope.gysId;
				// data.gys_sku = $scope.filSpId;
				// data.gys_sku = $scope.selSpSku;
				data.storageId = $scope.whichOneCk;
				data.oneOrMuch = $scope.oneOrMuch;
				if ($scope.jieDanStu==4) {
					data.pod_status = '';
				} else if($scope.jieDanStu==0){
					data.pod_status = 0;
				} else if($scope.jieDanStu==1){
					data.pod_status = 1;
				} else if($scope.jieDanStu==3){
					data.pod_status = 3;
				}
				if ($scope.wlModeName) {
					data.logisticNameen = $scope.wlModeName.split('-')[1]
					if($scope.wlModeName.split('-')[0]=='深圳E邮宝'){
						data.logisticMode = '深圳壹电商深圳E邮宝'
					}else{
						data.logisticMode = $scope.wlModeName.split('-')[0]
					}
				}
			}else if($scope.selstu==4){
				data.status = '34';
			}else if($scope.selstu==1){
				data.status = '33';
				data.storageId = $scope.whichOneCk;
				// if($scope.store == '2'){
				// 	data.status = '64';
				// }else{
				// 	data.status = '61';
				// }
			}else if($scope.selstu==5){
				data.storageId = $scope.whichOneCk;
				data.status = '35';
			}else if($scope.selstu==6){
				data.status = '36';
			}else if($scope.selstu==7){
				data.status = '37';
			}else if($scope.selstu==8){
				data.storageId = $scope.whichOneCk;
				data.status = '38';
			}else if($scope.selstu==9){
				data.storageId = $scope.whichOneCk;
				data.status = '69';
			}
			var selVal = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());

			return AssembleSearchData($scope,data, selVal, inpVal);
		}

		//留言的弹框
		//CJ客户留言的弹框
		$scope.messageflag = false;
		var mesOrdId;
		var messageCon;
		var mesIndex;
		$scope.messageimgFun = function (item,index) {
			$scope.messageflag = true;
			$scope.messageCon = item.NOTE_ATTRIBUTES;
			mesIndex = index;
			mesOrdId = item.ID;
		}
		$scope.messcloseBtnFun = function () {
			$scope.messageflag = false;
			$scope.messageCon = '';
		}
		$scope.cusmesSurnFun = function () {
			var editTextCon=$('.custom-mes').val();
			var mesData = {};
			mesData.orderNum = mesOrdId;
			mesData.note = $scope.messageCon;
			console.log($scope.messageCon)
			console.log(JSON.stringify(mesData))
			erp.postFun('app/order/upOrderNote',JSON.stringify(mesData),function (data) {
				console.log(data)
				$scope.messageflag = false;
				if(data.data.result>0){
					layer.msg('修改成功')
					console.log($scope.erporderList)
					console.log($scope.erporderList[mesIndex])
					// $('.orders-table .mes-hidetest').eq(mesIndex).text(editTextCon);
					$scope.erporderList[mesIndex].order.NOTE_ATTRIBUTES = $scope.messageCon;
				}else{
					layer.msg('修改失败')
				}
			},function (data) {
				console.log(data)
				layer.msg('网络错误')
			})
		}

		//业务员留言的弹框
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
		var cziIndex = 0;
		var md10Count = 0;
		var md15Count = 0;
		var thisWlName = '';
		$('#c-zi-ord').on('click','.cor-check-box',function () {
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
		$('#c-zi-ord').on('click','.c-checkall',function () {
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
		//选择28条10x10
		$scope.check10Fun = function () {
			cziIndex = 0;
			md10Count = 0;
			md15Count = 0;
			$('#c-zi-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			$('#c-zi-ord .cor-check-box').each(function () {
				thisWlName = $(this).siblings('.item-wlname').text();
				if(thisWlName=='顺丰国际'){
					console.log(md10Count)
					md10Count++;
					cziIndex++;
					$(this).attr('src','static/image/order-img/multiple2.png')
					if (md10Count>27) {
						return false;
					}
				}
			})
			if(md10Count<1){
				layer.msg('当前没有规格为10x10的订单')
				$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
			}else{
				layer.msg('选中了'+md10Count+'条面单为10x10的订单')
				if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
					$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			}
		}
		//选择28条15x15
		$scope.check15Fun = function () {
			cziIndex = 0;
			md10Count = 0;
			md15Count = 0;
			$('#c-zi-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			$('#c-zi-ord .cor-check-box').each(function () {
				thisWlName = $(this).siblings('.item-wlname').text();
				if(thisWlName!='顺丰国际'){
					console.log(md15Count)
					md15Count++;
					cziIndex++;
					$(this).attr('src','static/image/order-img/multiple2.png')
					if (md15Count>27) {
						return false;
					}
				}
			})
			if(md15Count<1){
				layer.msg('当前没有规格为15x15的订单')
				$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
			}else{
				layer.msg('选中了'+md15Count+'条面单为15x15的订单')
				if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
					$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			}
		}
		//关闭找货的PDF弹框
		$scope.closeFresh3Fun = function () {
			$scope.seaProFlag = false;
			getListFun(1);
		}
		//给功能按钮里面的导航添加点击事件
		$('.ord-fun-a').eq(0).addClass('ord-active')//让第一个默认选中

		$('.buck-dyyd').show();//批量打印面单
		$('.buck-qxpq').hide();//批量强行配齐
		$('.ggclass').show();//输入框
		//单品 多品

		$('.one-ormore').eq(0).addClass('one-ormore-active');
		$scope.duopinFun = function () {
			$scope.oneOrMuch = 1;
			$scope.wlModeName = '';
			$scope.selSpSku = '';
			$('.one-ormore').eq(1).removeClass('one-ormore-active');
			$('.one-ormore').eq(0).addClass('one-ormore-active');
			getListFun(1);//getListFun 此参数是订单是否配齐
		}
		$scope.danpinFun = function () {
			$scope.oneOrMuch = 0;
			$scope.wlModeName = '';
			$scope.selSpSku = '';
			$('.one-ormore').eq(0).removeClass('one-ormore-active');
			$('.one-ormore').eq(1).addClass('one-ormore-active');
			getListFun(1);
		}

		$scope.lxyhFun = function(pItem,item,pIndex,index,ev){
			ev.stopPropagation()
			$scope.isLiXianYhFlag = true;
			$scope.itemSpId = item.ID;
			$scope.parentIndex = pIndex;
			$scope.itemIndex = index;
		}
		$scope.cancelLiXianYhFun = function(){
			$scope.isLiXianYhFlag = false;
		}
		$scope.sureLiXianYhFun = function(){
			erp.postFun('caigou/procurement/podExamineGoodsOffline',{
				id: $scope.itemSpId
			},function(data){
				console.log(data)
				if (data.data.statusCode==200) {
					$scope.isLiXianYhFlag = false;
					if(data.data.result){
						$scope.isLocationFlag = true;
						$scope.locationVal = data.data.result.location;
						$scope.erporderList[$scope.parentIndex].product[$scope.itemIndex].location = data.data.result.location;
					}else{
						layer.msg(data.data.message)
					}
				} else {
					layer.msg(data.data.message)
				}
			},function(data){
				console.log(data)
			})
		}
		$scope.closeLocationFun = function(){
			$scope.isLocationFlag = false;
		}
		//确认发货
		$scope.qrfhFun = function (item) {
			erp.load();
			var addyfhData = {};
			addyfhData.ids = item.ID;
			addyfhData.type = '62';
			console.log(JSON.stringify(addyfhData))
			erp.postFun('app/order/nextFlow',JSON.stringify(addyfhData),function (data) {
				console.log(data)
				if (data.data.result==true) {
					getListFun();
				} else {
					layer.msg('确认发货失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//义乌 深圳 美国
		$scope.storeFun0 = function (ev) {
			$scope.store = 0;
			$scope.selSpSku = '';
			if ($scope.selstu == 4||$scope.selstu == 5) {
				$scope.whichOneCk = '';
				if ($(ev.target).hasClass('two-ck-activebtn')) {
					$(ev.target).removeClass('two-ck-activebtn')
					$scope.store = '';
					localStorage.removeItem('store')
				} else {
					$('.two-ck-btn').removeClass('two-ck-activebtn')
					$(ev.target).addClass('two-ck-activebtn');
					localStorage.setItem('store',0)
				}
			} else if($scope.selstu == 6){
				$('.ord-fun-a').removeClass('ord-active');
				$('.ord-fun-a').eq(2).addClass('ord-active')
				console.log('61')
				$scope.selstu = 1;
				$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
				localStorage.setItem('store',0)
			} else {
				$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
				localStorage.setItem('store',0)
			}
			if ($scope.selstu == 4||$scope.selstu == 1||$scope.selstu == 5||$scope.selstu == 6||$scope.selstu == 7) {
				getListFun();
			} else if($scope.selstu == 2){
				getListFun(0);
			} else if($scope.selstu == 3){
				getListFun(1);
			}
		}
		$scope.storeFun1 = function (ev) {
			$scope.store = 1;
			$scope.selSpSku = '';
			if ($scope.selstu == 4||$scope.selstu == 5) {
				$scope.whichOneCk = '';
				if ($(ev.target).hasClass('two-ck-activebtn')) {
					$(ev.target).removeClass('two-ck-activebtn')
					$scope.store = '';
					localStorage.removeItem('store')
				} else {
					$('.two-ck-btn').removeClass('two-ck-activebtn')
					$(ev.target).addClass('two-ck-activebtn');
					localStorage.setItem('store',1)
				}
			} else if($scope.selstu == 6){
				$('.ord-fun-a').removeClass('ord-active');
				$('.ord-fun-a').eq(2).addClass('ord-active')
				console.log('61')
				$scope.selstu = 1;
				$scope.whichOneCk = '08898c4735bf43068d5d677c1d217ab0';
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$('.two-ck-btn').eq(1).addClass('two-ck-activebtn');
				localStorage.setItem('store',1)
			} else {
				$scope.whichOneCk = '08898c4735bf43068d5d677c1d217ab0';
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$('.two-ck-btn').eq(1).addClass('two-ck-activebtn');
				localStorage.setItem('store',1)
			}
			if ($scope.selstu == 4||$scope.selstu == 1||$scope.selstu == 5||$scope.selstu == 6||$scope.selstu == 7) {
				getListFun();
			} else if($scope.selstu == 2){
				getListFun(0);
			} else if($scope.selstu == 3){
				getListFun(1);
			}
		}
		$scope.storeFun2 = function (ev) {
			$scope.store = 2;
			$scope.selSpSku = '';
			if ($scope.selstu == 4||$scope.selstu == 5) {
				$scope.whichOneCk = '';
				if ($(ev.target).hasClass('two-ck-activebtn')) {
					$(ev.target).removeClass('two-ck-activebtn')
					$scope.store = '';
					localStorage.removeItem('store')
				} else {
					$('.two-ck-btn').removeClass('two-ck-activebtn')
					$(ev.target).addClass('two-ck-activebtn');
					localStorage.setItem('store',2)
				}
			} else if($scope.selstu == 1){
				$('.ord-fun-a').removeClass('ord-active');
				$('.ord-fun-a').eq(3).addClass('ord-active')
				$scope.selstu = 6;
				$scope.whichOneCk = 'd3749885b80444baadf8a55277de1c09';
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$('.two-ck-btn').eq(2).addClass('two-ck-activebtn');
				localStorage.setItem('store',2)
			} else {
				$scope.whichOneCk = 'd3749885b80444baadf8a55277de1c09';
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$('.two-ck-btn').eq(2).addClass('two-ck-activebtn');
				localStorage.setItem('store',2)
			}
			if ($scope.selstu == 4||$scope.selstu == 1||$scope.selstu == 5||$scope.selstu == 6||$scope.selstu == 7) {
				getListFun();
			} else if($scope.selstu == 2){
				getListFun(0);
			} else if($scope.selstu == 3){
				getListFun(1);
			}
		}

		$scope.selfun1 = function ($event) {
			$('.seach-ordnumstu').prop("checked",false);
			$scope.selstu = 1;
			$scope.selSpSku = '';
			if (!$.trim($('.c-seach-inp').val())) {
				$scope.isSelJqcz='追踪号';
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
	        $scope.pageNum = 1;
	        getOrdListFun()
		}
		$scope.selfun2 = function ($event) {
			$('.seach-ordnumstu').prop("checked",false);
			$scope.wlModeName = '';
			$scope.selSpSku = '';
			$scope.selstu = 2;
			if($scope.isSelJqcz=='配货批次'){
				$scope.isSelJqcz='业务员';
				$('.c-seach-inp').val('');
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active');
			//默认展示义乌仓
			console.log($scope.store)
			if ($scope.store) {
				if ($scope.store == 0) {
					$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
				} else if($scope.store == 1) {
					$scope.whichOneCk = '08898c4735bf43068d5d677c1d217ab0';
				} else if($scope.store == 2) {
					$scope.whichOneCk = 'd3749885b80444baadf8a55277de1c09';
				}
			} else {
				$scope.store = 0;
				console.log($scope.store)
				localStorage.setItem('store',0)
				$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
				$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			}
			getListFun(0);
		}
		$scope.selfun3 = function ($event) {
			$scope.jieDanStu = 4;
			$scope.selSpSku = '';
			$('.jiedan-stu').removeClass('jiedan-stuact')
			setTimeout(function(){
				$('.jiedan-stu').eq(0).addClass('jiedan-stuact')
			},50)


			$('.seach-ordnumstu').prop("checked",false);
			$scope.wlModeName = '';
			$scope.selstu = 3;
			if($scope.isSelJqcz=='配货批次'){
				$scope.isSelJqcz='业务员';
				$('.c-seach-inp').val('');
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			$scope.erporderList = [];
			$scope.erpordTnum = 0;
			//默认展示义乌仓
			// $scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			if ($scope.store) {
				if ($scope.store == 0) {
					$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
				} else if($scope.store == 1) {
					$scope.whichOneCk = '08898c4735bf43068d5d677c1d217ab0';
				} else if($scope.store == 2) {
					$scope.whichOneCk = 'd3749885b80444baadf8a55277de1c09';
				}
			} else {
				$scope.store = 0;
				console.log($scope.store)
				localStorage.setItem('store',0)
				$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
				$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			}
			getListFun(1);
		}
		$scope.selfun4 = function ($event) {
			$('.seach-ordnumstu').prop("checked",false);
			$scope.selstu = 4;
			$scope.selSpSku = '';
			if($scope.isSelJqcz=='配货批次'){
				$scope.isSelJqcz='业务员';
				$('.c-seach-inp').val('');
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
	        $scope.pageNum = 1;
	        getOrdListFun()
		}
		$scope.selfun5 = function ($event) {
			$('.seach-ordnumstu').prop("checked",false);
			$scope.selstu = 5;
			$scope.selSpSku = '';
			if($scope.isSelJqcz=='配货批次'){
				$scope.isSelJqcz='业务员';
				$('.c-seach-inp').val('');
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			$scope.erporderList = [];
			$scope.erpordTnum = 0;
			//默认展示义乌仓
			// $scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			if ($scope.store) {
				if ($scope.store == 0) {
					$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
				} else if($scope.store == 1) {
					$scope.whichOneCk = '08898c4735bf43068d5d677c1d217ab0';
				} else if($scope.store == 2) {
					$scope.whichOneCk = 'd3749885b80444baadf8a55277de1c09';
				}
			} else {
				$scope.store = 0;
				console.log($scope.store)
				localStorage.setItem('store',0)
				$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
				$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			}
			getListFun();
		}
		$scope.selfun6 = function($event){
			$('.seach-ordnumstu').prop("checked",false);
			$scope.selstu = 6;
			$scope.selSpSku = '';
			if($scope.isSelJqcz=='配货批次'){
				$scope.isSelJqcz='业务员';
				$('.c-seach-inp').val('');
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			$scope.erporderList = [];
			$scope.erpordTnum = 0;
			//只有美国仓有缺货
			$scope.whichOneCk = 'd3749885b80444baadf8a55277de1c09';
			getListFun();
		}
		$scope.selfun7 = function($event){
			$('.seach-ordnumstu').prop("checked",false);
			$scope.selstu = 7;
			$scope.selSpSku = '';
			if($scope.isSelJqcz=='配货批次'){
				$scope.isSelJqcz='业务员';
				$('.c-seach-inp').val('');
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			$scope.erporderList = [];
			$scope.erpordTnum = 0;
			//默认展示义乌仓
			// $scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			if ($scope.store) {
				if ($scope.store == 0) {
					$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
				} else if($scope.store == 1) {
					$scope.whichOneCk = '08898c4735bf43068d5d677c1d217ab0';
				} else if($scope.store == 2) {
					$scope.whichOneCk = 'd3749885b80444baadf8a55277de1c09';
				}
			} else {
				$scope.store = 0;
				console.log($scope.store)
				localStorage.setItem('store',0)
				$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
				$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			}
			getListFun();
		}
		$scope.selfun8 = function($event){
			$('.seach-ordnumstu').prop("checked",false);
			$scope.selstu = 8;
			$scope.selSpSku = '';
			if($scope.isSelJqcz=='配货批次'){
				$scope.isSelJqcz='业务员';
				$('.c-seach-inp').val('');
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			$scope.erporderList = [];
			$scope.erpordTnum = 0;
			//默认展示义乌仓
			// $scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			if ($scope.store) {
				if ($scope.store == 0) {
					$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
				} else if($scope.store == 1) {
					$scope.whichOneCk = '08898c4735bf43068d5d677c1d217ab0';
				} else if($scope.store == 2) {
					$scope.whichOneCk = 'd3749885b80444baadf8a55277de1c09';
				}
			} else {
				$scope.store = 0;
				console.log($scope.store)
				localStorage.setItem('store',0)
				$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
				$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			}
			getListFun();
		}
		$scope.selfun9 = function($event){
			$('.seach-ordnumstu').prop("checked",false);
			$scope.selstu = 9;
			$scope.selSpSku = '';
			if($scope.isSelJqcz=='配货批次'){
				$scope.isSelJqcz='业务员';
				$('.c-seach-inp').val('');
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
			$scope.erporderList = [];
			$scope.erpordTnum = 0;
			//默认展示义乌仓
			// $scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			if ($scope.store) {
				if ($scope.store == 0) {
					$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
				} else if($scope.store == 1) {
					$scope.whichOneCk = '08898c4735bf43068d5d677c1d217ab0';
				} else if($scope.store == 2) {
					$scope.whichOneCk = 'd3749885b80444baadf8a55277de1c09';
				}
			} else {
				$scope.store = 0;
				console.log($scope.store)
				localStorage.setItem('store',0)
				$('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
				$scope.whichOneCk = 'bc228e33b02a4c03b46b186994eb6eb3';
			}
			getListFun();
		}
		function getListFun(flag) {
	        erp.load();
	        var erpData = {};
	        erpData.ydh = 'all';
	        if(muId!=''){
	        	erpData.id = muId;
	        }else {
	        	erpData.id = '';
	        }

	        erpData.cjOrderDateBegin = $('#c-data-time').val();
	        erpData.cjOrderDateEnd = $('#cdatatime2').val();
	        var showList = $('#page-sel').val()-0;
	        erpData.store = $scope.store;
	        erpData.storageId = $scope.whichOneCk;
			seltjFun(erpData);
			erpData.pageSize = showList;
			erpData.pageNum = 1;
	        console.log(erpData)
	        console.log(JSON.stringify(erpData))
	        erp.postFun('processOrder/queryOrder/queryPendingOrderPageByParam',JSON.stringify(erpData),function (data) {
	        	console.log(data)
	        	layer.closeAll("loading")
	        	var erporderResult = data.data.data;//存储订单的所有数据
	        	$scope.erpordTnum = erporderResult.total;
				$scope.podSkuSortList = erporderResult.podSkuSortList;
				$scope.selSpSku = erporderResult.maxSku;
				if(erporderResult.maxSku){
					var productArr;
					for(var i = 0,len=erporderResult.ordersList.length;i<len;i++){
						productArr = erporderResult.ordersList[i].product;
						console.log(productArr)
						if(productArr&&JSON.stringify(productArr)!='[]'){
							console.log(erporderResult.maxSku)
							for(var k = 0,kLen=productArr.length;k<kLen;k++){
								if(productArr[k].SKU.indexOf(erporderResult.maxSku)!=-1&&productArr[k].properties!=false){
									erporderResult.ordersList[i].product[k].dang = 1;
								}
							}
						}
					}
				}
				$scope.erporderList = erporderResult.list;
				countMFun($scope.erporderList);
				dealpage ();
				getNumFun()
	        },function () {
	        	layer.closeAll("loading")
	        	layer.msg('订单获取列表失败')
			})
			var inpVal = $.trim($('.c-seach-inp').val())
			if($scope.isSelJqcz=='母订单号'&&inpVal){
				$scope.muIdFlag = true;
				getMuNumFun(muId,$scope.store)
			}else{
				$scope.muIdFlag = false;
			}
		}
		//待配齐 已配齐切换仓库查找订单
		$scope.ckChangeFun = function () {
			if ($scope.selstu==2) {
				getListFun(0);
			} else {
				getListFun(1);
			}
		}
		//释放库存
		var selIds = '';
		$scope.sfKcFun = function () {
			var count = 0;
			selIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					count++;
					selIds += $(this).siblings('.hide-order-id').text()+',';
				}
			})
			if (count<=0) {
				layer.msg('请选择订单');
				return;
			}else{
				$scope.storeTypeFlag = true;
			}
		}
		$scope.canSfkcFun = function () {
			$scope.storeTypeFlag = false;
		}
		$scope.sureSfkcFun = function () {
			var upData = {};
			upData.ids = selIds;
			erp.load()
			erp.postFun('app/order/shifangkucun',JSON.stringify(upData),function (data) {
				console.log(data)
				if (data.data.result==true) {
					layer.msg('释放成功')
					$scope.storeTypeFlag = false;
					$scope.currtpage = 1;
					getListFun(1)
				} else {
					erp.closeLoad()
					layer.msg('释放失败')
				}
			},function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
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
			// var shopIds = '';//存储店铺id
			// var excelIds = '';//存储excel 的id
			// var lxCount = 0;
			// $('#c-zi-ord .cor-check-box').each(function () {
			// 	if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
			// 		// lxindex++;
			// 		if($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EYT')<0&&$(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EQKPT')<0){
			// 			lxCount++;
			// 			if ($(this).parent().siblings('.store-name-td').children('.store-name-p').text()=='Excel Imported') {
			// 				excelIds+=$(this).siblings('.hide-order-id').text()+',';
			// 				console.log('excel order')
			// 			} else {
			// 				shopIds+=$(this).siblings('.hide-order-id').text()+',';
			// 				console.log('dianpu order')
			// 			}
			// 		}
			// 	}
			// })
			console.log(tbdpExcelIds)
			console.log(tbdpShopIds)
			if(lxCount>10){
				$scope.tbdpTipFlag = true;//打开提示时间较长框
			}
			erp.load();
			var upData = {};
			upData.shopId = tbdpShopIds;
			upData.excelId = tbdpExcelIds;
			console.log(JSON.stringify(upData))
			erp.postFun('app/order/fulfilOrder',JSON.stringify(upData),function (data) {
				console.log(data)
				$scope.tbdpTipFlag = false;//关闭提示框
				if (data.data.result) {
					layer.msg('同步成功')
					$scope.pageNum = 1;
					getOrdListFun()
				} else {
					layer.closeAll("loading")
					layer.msg('同步失败')
				}

			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
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
				layer.closeAll("loading")
				if (data.data.result) {
					layer.msg('同步成功')
					$scope.pageNum = 1;
					getOrdListFun()
				} else {
					layer.closeAll("loading")
					layer.msg('同步失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//鼠标划过事件
		//点击事件
		$('.orders-table').on('click','.erporder-detail',function (event) {
			if($(event.target).hasClass('cor-check-box')||$(event.target).hasClass('qtcz-sel')||$(event.target).hasClass('stop-prop')||$(event.target).hasClass('ordlist-fir-td')){
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

		$('.orders-table').on('mouseenter','.ordlist-fir-td',function () {
			$(this).parent('.erporder-detail').next().hide();
		})
		$('.orders-table').on('mouseenter','.moshow-sp-td',function () {
			$(this).parent('.erporder-detail').next().show();
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
			$(this).parent('.erporder-detail').addClass('erporder-detail-active');
		})

		$('.orders-table').on('mouseleave','.erporder-detail',function () {
			$(this).next().hide();
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

		//批量修改物流的弹窗
		$scope.wlChangeFlag = false;
		var changeordId = '';//订单id
		// var changeordWL = '';//订单物流

		var isopenFlag = 0;
		$scope.epacketArr = [];
		$scope.epacketFlag = false;
		$scope.zgyzArr = [];
		$scope.zgyzFlag = false;
		$scope.changeWLFun = function () {

			erp.postFun('app/order/getWay','',function (data) {
				// alert(66666)
				console.log(data)
				$scope.wlfsList = data.data;
				console.log($scope.wlfsList)
				// for(var i =0;i<$scope.wlfsList.length;i++){
				// 	if($scope.wlfsList[i].name=="ePacket"){
				// 		$scope.epacketArr = $scope.wlfsList[i].value;
				// 	}else if($scope.wlfsList[i].name=="zgyz"){
				// 		$scope.zgyzArr = $scope.wlfsList[i].value;
				// 	}
				// }
			},function () {
				console.log('物流获取失败')
			})
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					isopenFlag++;
					changeordId+=$(this).siblings('.hide-order-id').text()+',';
					//changeordWL+=$(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text()+',';
				}
			})
			if(isopenFlag==0){
				layer.msg('请先选择订单')
				return;
			}else {
				$scope.wlChangeFlag = true;
			}
		}
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


		//批量打印运单 筛选物流 商品属性
		$scope.isdymdFlag = false;
		$scope.isdymdFlag2 = false;//筛选后有多少条符合打印面单
		$scope.uspsType = '0';
		$scope.isdymdFun = function () {
			var dymdindex = 0;
			$scope.uspsPlusNum = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					dymdindex++;
					console.log($(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text())
					if($(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text()=='USPS+'){
						console.log('物流方式为usps+')
						$scope.uspsPlusNum++;
					}
					if($(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text()=='USPS'){
						console.log('物流方式为usps')
						$scope.uspsPlusNum++;
					}
				}
			})
			console.log($scope.uspsDdCount)
			if (dymdindex<=0) {
				layer.msg('请选择订单')
				return;
			} else {
				// var isdyzdata = {};//检测是否有正在打印的进程
				// isdyzdata.userId = erpuserId;
				// erp.postFun2('checkLastExp.json',JSON.stringify(isdyzdata),function (data) {
				// 	console.log(data)
				// 	if (data.data.result=='go') {
				// 		layer.msg('正在打印面单')
				// 		setTimeout(function () {
				// 			$scope.yxdyBtnFun($scope.dymdId);
				// 		},2000)
				// 	}else{
				// 		if ($scope.uspsPlusNum<1) {
				// 			$scope.isdymdFlag = true;
				// 		}
				// 	}
				// },function (data) {
				// 	console.log(data)
				// })
				if ($scope.uspsPlusNum<1) {
					$scope.isdymdFlag = true;
				}
			}
		}
		//打印面单关闭的弹框
		$scope.isdymdCloseFun = function () {
			$scope.isdymdFlag = false;
		}
		// 取消usps+的打印类型
		$scope.gbSelUSType = function () {
			console.log($scope.uspsType)
			$scope.uspsType = '0';
			$scope.uspsPlusNum = 0;
			$scope.isdymdFlag = true;
		}
		// 确定usps+的打印类型
		$scope.sureSelUSType = function () {
			console.log($scope.uspsType)
			$scope.uspsPlusNum = 0;
			$scope.isdymdFlag = true;
		}
		//确定打印面单
		$scope.mdtcFlag = false;
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
			ids.uspsType = $scope.uspsType;
			console.log(JSON.stringify(ids))
			erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				console.log(data.data)
				// $scope.pdfmdArr = data.data;//生成的面单数组
				var resMdArr = data.data;
				layer.closeAll("loading")
				var resPdfArr = [];
				if (resMdArr.length>0) {
					$scope.mdtcFlag = true;
					for(var i =0,len=resMdArr.length;i<len;i++){
						resPdfArr.push({
							printCount:0,
							printPdf:resMdArr[i]
						})
					}
					$scope.pdfmdArr = resPdfArr;
					console.log(resPdfArr)
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
			ids.uspsType = $scope.uspsType;
			console.log(JSON.stringify(ids))
			erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				console.log(data.data)
				// $scope.pdfmdArr = data.data;//生成的面单数组
				var resMdArr = data.data;
				layer.closeAll("loading")
				var resPdfArr = [];
				if (resMdArr.length>0) {
					$scope.mdtcFlag = true;
					for(var i =0,len=resMdArr.length;i<len;i++){
						resPdfArr.push({
							printCount:0,
							printPdf:resMdArr[i]
						})
					}
					$scope.pdfmdArr = resPdfArr;
					console.log(resPdfArr)
				} else {
					layer.msg('生成面单错误')
				}
			},function (data) {
				console.log(data)
				layer.closeAll("loading")
				layer.msg('网络错误')
			})
		}
		$scope.mdClickFun = function (item) {
			item.printCount++;
			console.log(item)
		}
		//有序打印面单
		$scope.isyxdyFun = function () {
			if (localStorage.getItem('yxdyObj')) {
				$scope.yxdymdFlag = true;
				$scope.yxdyList = JSON.parse(localStorage.getItem('yxdyObj'))
				console.log($scope.yxdyList)
			}else{
				// var isdyzdata = {};//检测是否有正在打印的进程
				// isdyzdata.userId = erpuserId;
				// erp.postFun2('checkLastExp.json',JSON.stringify(isdyzdata),function (data) {
				// 	console.log(data)
				// 	if (data.data.result=='go') {
				// 		layer.msg('正在打印面单')
				// 		setTimeout(function () {
				// 			$scope.yxdyBtnFun($scope.dymdId);
				// 		},2000)
				// 	}else{
				// 		$scope.isyxdymdFlag = true;
				// 	}
				// },function (data) {
				// 	console.log(data)
				// })
				$scope.isyxdymdFlag = true;
			}
		}
		//询问是否有序打单确定按钮
		$scope.yxdymdFun = function () {
			var selCount = 0;
			var yxdymdIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					selCount++;
					yxdymdIds+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			if(selCount<1){
				layer.msg('请选择订单')
				$scope.isyxdymdFlag = false;//关闭询问按钮
				return;
			}
			layer.load(2);
			var getskuData = {};
			getskuData.ids = yxdymdIds;
			getskuData.store = $scope.store;
			erp.postFun('app/order/printSku',JSON.stringify(getskuData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.isyxdymdFlag = false;
				$scope.isdyAllmdFlag = false;
				if (data.status==200) {
					if($.isEmptyObject(data.data.result)){
						layer.msg('这些订单不能有序打印面单')
					}else {
						$scope.yxdymdFlag = true;
						$scope.yxdyList = data.data.result;
						localStorage.setItem('yxdyObj',JSON.stringify($scope.yxdyList))
						console.log($scope.yxdyList)
					}
				}
			},function (data) {
				console.log(data)
				layer.closeAll("loading")
			})
		}
		//有序打印面单的打印函数
		var printResObj;
		$scope.yxdyBtnFun = function (item,ev) {
			$scope.isSkuPrintFlag = true;
			$(ev.target).addClass('has-print-actbtn');
			layer.load(2)
			console.log(item)
			$scope.dymdId = item;
			var ids = {};
			ids.ids = item;
			ids.type = '2';
			ids.news = '1';
			ids.userId = erpuserId;
			ids.loginName = erpLoginName;
			console.log(JSON.stringify(ids))
			// return;
			erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				console.log(data.data)
				printResObj = data.data[0];
				console.log(printResObj)
				if(printResObj.result=='go'){
					setTimeout(function () {
						$scope.yxdyBtnFun($scope.dymdId);
					},2000)
				}else{
					layer.closeAll("loading")
					var resMdArr = data.data;
					var resPdfArr = [];
					if (resMdArr.length>0) {
						$scope.mdtcFlag = true;
						for(var i =0,len=resMdArr.length;i<len;i++){
							resPdfArr.push({
								printCount:0,
								printPdf:resMdArr[i]
							})
						}
						$scope.pdfmdArr = resPdfArr;
						console.log(resPdfArr)
					} else {
						layer.msg('生成面单错误')
					}
					// $scope.pdfmdArr = data.data;//生成的面单数组
					// console.log($scope.pdfmdArr)
					// $scope.mdtcFlag = true;
				}
			},function (data) {
				console.log(data)
				layer.closeAll("loading")
				layer.msg('网络错误')
			})
		}
		//询问是否移动到处理中
		$scope.yddyclFun = function (item,ev,key) {
			$scope.isyddClzFlag = true;
			$scope.printYdIds = item;
			$scope.printKey = key;
		}
		$scope.sureYdClzFun = function () {
			console.log($scope.printKey)
			var printKey = $scope.printKey;
			layer.load(2)
			var to62Data = {};
			to62Data.ids = $scope.printYdIds;
			erp.postFun('app/order/subTo62',JSON.stringify(to62Data),function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					layer.msg('移动成功')
					$scope.isyddClzFlag = false;
					delete $scope.yxdyList[printKey];
					localStorage.setItem('yxdyObj',JSON.stringify($scope.yxdyList));
				} else {
					layer.msg('移动失败')
				}
			},function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		//打印所有面单
		$scope.isdyAllFun = function () {
			if (localStorage.getItem('yxdyObj')) {
				$scope.yxdymdFlag = true;
				$scope.yxdyList = JSON.parse(localStorage.getItem('yxdyObj'))
			}else{
				// var isdyzdata = {};//检测是否有正在打印的进程
				// isdyzdata.userId = erpuserId;
				// erp.postFun2('checkLastExp.json',JSON.stringify(isdyzdata),function (data) {
				// 	console.log(data)
				// 	if (data.data.result=='go') {
				// 		layer.msg('正在打印面单')
				// 		setTimeout(function () {
				// 			$scope.yxdyBtnFun($scope.dymdId);
				// 		},2000)
				// 	}else{
				// 		$scope.isdyAllmdFlag = true;
				// 	}
				// },function (data) {
				// 	console.log(data)
				// })
				$scope.isdyAllmdFlag = true;
			}
		}
		$scope.dyAllMdFun = function () {
			$scope.isSkuPrintFlag = true;
			// isdyzdata.storeId = $scope.whichOneCk;
			var dyAllData = {};
			dyAllData.store = $scope.store;
			erp.postFun('app/order/printSku',JSON.stringify(dyAllData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.isyxdymdFlag = false;
				$scope.isdyAllmdFlag = false;
				if (data.status==200) {
					if($.isEmptyObject(data.data.result)){
						layer.msg('没有可以打印的面单')
					}else {
						$scope.yxdymdFlag = true;
						$scope.yxdyList = data.data.result;
						localStorage.setItem('yxdyObj',JSON.stringify($scope.yxdyList))
						console.log($scope.yxdyList)
					}
				}
			},function (data) {
				console.log(data)
				layer.closeAll("loading")
			})
		}
		//打印拣货单 (测试 等待打印所有面单传仓库参数)
		$scope.printjhdFun = function () {
			console.log($scope.yxdyList)
			var pjhdData = {};
			pjhdData.skuList = [];
			for(var key in $scope.yxdyList){
				// "skuList":[{"sku":"CJSJBHIP00102-1-IphoneX","optNum":"4",
				// "imgUrl":"https://cc-west-usa.oss-us-west-1.aliyuncs.com/15259968/5001104960475.png"}],
				var oneObj = {};
				oneObj.sku = key;
				oneObj.optNum = $scope.yxdyList[key].num;
				oneObj.imgUrl = $scope.yxdyList[key].image;
				pjhdData.skuList.push(oneObj)
			}
			console.log(pjhdData.skuList)
			if ($scope.store == 0) {
				pjhdData.storageId = 'bc228e33b02a4c03b46b186994eb6eb3';
			} else if($scope.store == 1) {
				pjhdData.storageId = '08898c4735bf43068d5d677c1d217ab0';
			} else if($scope.store == 2) {
				pjhdData.storageId = 'd3749885b80444baadf8a55277de1c09';
			}
			console.log(pjhdData)
			erp.postFun('app/pdfOpt/createPickingList',JSON.stringify(pjhdData),function (data) {
				console.log(data)
			},function (data) {
				console.log(data)
			})
		}
		//sku打单弹框的关闭按钮
		$scope.closeSkuPrintFun = function () {
			$scope.yxdymdFlag=false;
			$scope.isdyAllmdFlag=false;
			localStorage.removeItem('yxdyObj');
			$scope.pageNum = 1;
			getOrdListFun()
		}
		//单个操作一条订单打印面单
		$scope.oneisdymdFlag = false;
		var onemdId = '';//存储一条订单的id
		$scope.oneisdymdFun = function (item) {//单个打印面单
			onemdId = item.ID;
			$scope.oneisdymdFlag = true;
		}
		//分配的单独打印面单
		$scope.seaProDymdFun = function (item) {
			onemdId = item;
			$scope.oneisdymdFlag = true;
			console.log(item)
		}
		$scope.onedymdcloseFun = function () {
			$scope.oneisdymdFlag = false;
		}
		$scope.oneSureFun = function () {
			$scope.isSkuPrintFlag = false;
			console.log(onemdId)
			$scope.oneisdymdFlag = false;//关闭询问是否打印订单的提示框
			erp.load();
			var ids = {};
			ids.ids = onemdId;
			ids.type = '1';
			ids.loginName = erpLoginName;
			console.log(JSON.stringify(ids))
			// return;
			erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				layer.closeAll("loading")
				var resMdArr = data.data;
				var resPdfArr = [];
				if (resMdArr.length>0) {
					$scope.mdtcFlag = true;
					for(var i =0,len=resMdArr.length;i<len;i++){
						resPdfArr.push({
							printCount:0,
							printPdf:resMdArr[i]
						})
					}
					$scope.pdfmdArr = resPdfArr;
					console.log(resPdfArr)
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
		//生成sku面单链接后的关闭按钮函数
		$scope.closeSkuPrintTk = function () {
			$scope.mdtcFlag = false;
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
			cxclData.store = $('.sel-ck-num').val();
			console.log(JSON.stringify(cxclData))
			erp.postFun('pojo/procurement/changeCjOrderStore',JSON.stringify(cxclData),function (data) {
				console.log(data);
				$scope.changeCkFlag = false;
				if(data.data.statusCode=='200'){
					$scope.pageNum = 1;
					getOrdListFun()
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
				if(data.data.message&&(data.data.message!=null||data.data.message!='null')){
					$scope.cxclResFlag = true;
					$scope.initMessage = data.data.message;
				}
				if(data.data.result>0){
					$scope.pageNum = 1;
					getOrdListFun()
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
		//单独操作重新处理订单
		$scope.onecxclFlag = false;
		var cxclOrdId = '';
		$scope.oneiscxclFun = function (item) {
			$scope.onecxclFlag = true;
			cxclOrdId = item.ID;
			// $scope.stopFun();
		}
		$scope.isonecxclCloseFun = function () {
			$scope.onecxclFlag = false;
		}
		$scope.isonecxclSureFun = function () {
			erp.load();
			var cxclData = {};
			cxclData.ids = cxclOrdId;
			console.log(JSON.stringify(cxclData))
			erp.postFun('app/order/initERPOrder',JSON.stringify(cxclData),function (data) {
				console.log(data);
				$scope.onecxclFlag = false;
				if(data.data.message&&(data.data.message!=null||data.data.message!='null')){
					$scope.cxclResFlag = true;
					$scope.initMessage = data.data.message;
				}
				if(data.data.result>0){
					$scope.pageNum = 1;
					getOrdListFun()
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
		//会释放库存的提交到已发货
		var newYfhIds = [];
		$scope.newPLTJFun = function () {
			var countNum = 0;
			newYfhIds = [];
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					countNum++;
					newYfhIds.push($(this).siblings('.hide-order-id').text());
				}
			})
			if (countNum<1) {
				layer.msg('请选择订单')
			}else{
				$scope.newTJYFHFlag=true;
			}
		}
		$scope.sureNewYFHFun = function () {
			erp.load()
			$scope.newTJYFHFlag=false;
			erp.postFun('processOrder/handleOrder/updateOrderProcessShipped',{"ids":newYfhIds},function (data) {
				console.log(data)
				if (data.data.data) {
					$scope.pageNum = 1;
					getOrdListFun()
				} else {
					layer.msg('提交失败')
					layer.closeAll("loading")
				}
			},function (data) {
				layer.msg('网络错误')
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//转换订单状态
		var tansOrdIds;
		$scope.transPodStuFun = function(stu,compFlag){
			var addyfhCount = 0;
			tansOrdIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					addyfhCount++;
					tansOrdIds += $(this).siblings('.hide-order-id').text() + ',';
				}
			})
			if (addyfhCount > 0) {
				$scope.transStu = stu;
				$scope.completeFlag = compFlag;
				$scope.transOrdStuFlag = true;
			} else {
				$scope.transOrdStuFlag = false;
				layer.msg('请选择订单')
			}
		}
		$scope.cancelTransOrdFun = function(){
			$scope.transOrdStuFlag = false;
		}
		$scope.sureTransOrdFun = function(){
			console.log($scope.transStu,$scope.completeFlag)
			erp.postFun('processOrder/handleOrder/transPodOrder',{
				transStatus: $scope.transStu,
				orderids: tansOrdIds,
				completeFlag : $scope.completeFlag
			},function(data){
				console.log(data)
				if(data.data.code==200){
					$scope.transOrdStuFlag = false;
					layer.msg('成功')
					$scope.selSpSku = '';
					$scope.pageNum = 1;
					getOrdListFun()
				}else{
					layer.msg(data.data.message)
				}
			},function(data){
				console.log(data)
			})
		}
		//批量提交到拦截
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
				if (data.data.result > 0) {
					$scope.currtpage = 1;
					if ($scope.selstu==2) {
						getListFun(0)
					} else if($scope.selstu==3){
						getListFun(1)
					} else{
						getListFun()
					}
				} else {
					layer.msg('批量提交到拦截中失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//查找商品
		var searchSpIds;
		$scope.isseachPFun = function () {
			var cxclNum = 0;
			var cxclids = '';
			searchSpIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					if ($(this).siblings('.hide-order-id').text().indexOf('D')!=-1) {
						cxclNum++;
						cxclids+=$(this).siblings('.hide-order-id').text()+',';
						searchSpIds+=$(this).siblings('.hide-order-id').text()+',';
					}
				}
			})
			if (cxclNum<1) {
				layer.msg('选中的订单中没有补发订单')
			} else {
				layer.load(2)
				var cxclData = {};
				cxclData.ids = cxclids;
				cxclData.system = 'y';
				cxclData.storageId = $scope.whichOneCk;
				cxclData.store = $scope.store;
				if ($scope.oneOrMuch==0) {
					cxclData.dingDanLeiXing = '单品';
				}else if ($scope.oneOrMuch==1) {
					cxclData.dingDanLeiXing = '多品';
				}
				console.log(JSON.stringify(cxclData))
				erp.postFun('pojo/procurement/piLiangZhaoHuo',JSON.stringify(cxclData),function (data) {
					console.log(data);
					// layer.closeAll("loading")
					console.log(data.data.result)
					if(data.data.statusCode == '200'){
						// $scope.seaProFlag = true;
						// $scope.proTxmLink = data.data.result;
						layer.msg('生成批次号成功')
						getListFun(1);
						var resPData = {};
						resPData.ids = searchSpIds;
						resPData.pici = data.data.result;
						console.log(resPData)
						erp.postFun2('getExpressSheet.json',JSON.stringify(resPData),function (data) {
							console.log(data)
						},function (data) {
							console.log(data)
						})
					}else{
						layer.closeAll("loading")
						layer.msg(data.data.message)
					}
				},function (data) {
					layer.closeAll("loading")
					layer.msg('网络错误')
					console.log(data)
				})
			}
		}
		//查找商品单品
		$scope.danpIsseachPFun = function () {
			layer.load(2)
			var cxclData = {};
			cxclData.store = $scope.store+'';
			console.log(JSON.stringify(cxclData))
			erp.postFun('pojo/procurement/danPin',JSON.stringify(cxclData),function (data) {
				console.log(data);
				layer.closeAll("loading")
				layer.msg(data.data.message)
			},function (data) {
				layer.closeAll("loading")
				layer.msg('网络错误')
				console.log(data)
			})
		}
		//查找商品多品
		$scope.duopIsseachPFun = function () {
			layer.load(2)
			var cxclData = {};
			cxclData.store = $scope.store+'';
			console.log(JSON.stringify(cxclData))
			erp.postFun('pojo/procurement/duoPin',JSON.stringify(cxclData),function (data) {
				console.log(data);
				layer.closeAll("loading")
				layer.msg(data.data.message)
			},function (data) {
				layer.closeAll("loading")
				layer.msg('网络错误')
				console.log(data)
			})
		}
		//剩余批次
		$scope.sypcFun = function () {
			layer.load(2)
			var cxclData = {};
			cxclData.flag = $scope.oneOrMuch+'';
			cxclData.store = $scope.store+'';
			console.log(JSON.stringify(cxclData))
			erp.postFun('pojo/procurement/shengYu',JSON.stringify(cxclData),function (data) {
				console.log(data);
				layer.closeAll("loading")
				layer.msg(data.data.message)
			},function (data) {
				layer.closeAll("loading")
				layer.msg('网络错误')
				console.log(data)
			})
		}
		//选中
		$scope.isCheckFun = function (item,index,ev) {
		    console.log(item.checked)
		    console.log(item)
		    console.log(index)
		    var checkedNum = 0;
		    for (var i = 0; i < $scope.bulkResArr[index].skus.length; i++) {
		        if ($scope.bulkResArr[index].skus[i]['checked'] == true) {
		            checkedNum ++;
		        }
		    }
		    console.log(checkedNum);
		    console.log($scope.bulkResArr[index].skus.length)
		    console.log($scope.bulkResArr[index].checkedAll)
		    if (checkedNum == $scope.bulkResArr[index].skus.length) {
		        $scope.bulkResArr[index].checkedAll = true;
		        $('.cjd-chek-all').eq(index).prop('checked',true)
		    } else {
		        $scope.bulkResArr[index].checkedAll = false;
		        $('.cjd-chek-all').eq(index).prop('checked',false)
		    }
		    console.log($scope.bulkResArr[index].checkedAll)
		    console.log($scope.bulkResArr[index])
		    console.log($scope.bulkResArr)
		    $scope.$applyAsync();
		}
		// 选中所有商品
		$scope.checkAll = function (checkAllMark,index) {
		    console.log(checkAllMark)
		    console.log(index)
		    console.log($scope.bulkResArr)
		    console.log($scope.bulkResArr[index])
		    console.log($scope.bulkResArr[index].checkedAll)
		    $scope.bulkResArr[index].checkedAll = checkAllMark;
		    console.log(index)
		    for (var i = 0; i < $scope.bulkResArr[index].skus.length; i++) {
		        $scope.bulkResArr[index].skus[i].checked = checkAllMark;
		    }
		    console.log($scope.bulkResArr[index].skus)
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
			erp.postFun('app/order/exportErpPodOrder',JSON.stringify(ids),function (data) {
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
			erp.postFun('app/order/exportErpOrder',JSON.stringify(ids),function (data) {
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
		//阻止冒泡
		$scope.stopFun = function (e) {
			e.stopPropagation();
		}
		//精确查找
		$scope.jqczSelCs = '子订单号';//精确查询的条件
		$scope.jqczFlag = false;
		$scope.jqczFun = function () {
			// console.log($scope.isSelJqcz)
			// if($scope.isSelJqcz=='精确查找'){

			// }
			$scope.jqczFlag = true;
		}
		$scope.sureJqczFun = function () {
			console.log($scope.jqczSelCs)
			var csData = {};
			csData.type = 'z';
			if ($scope.jqczSelCs=='子订单号') {
				csData.id = $scope.ordOrTnum;
			} else {
				if ($scope.ordOrTnum.length==30) {
					var midStr = $scope.ordOrTnum;
					var subResStr = midStr.substring(midStr.length-22);
					if(subResStr.substring(0,1)=='9'){
						$scope.ordOrTnum = subResStr;
						csData.track = $scope.ordOrTnum;
						$('.c-seach-inp').val(subResStr);
					}
				}else{
					csData.track = $scope.ordOrTnum;
				}
			}
			erp.postFun('app/order/getOrderLocation',JSON.stringify(csData),function (data) {
				console.log(data)
				$scope.jqczFlag = false;
				var resLocation = data.data.location;
				if(!$.isEmptyObject(data.data)){
					localStorage.removeItem('store')
				}
				if (resLocation=='2') {
					console.log('不用跳转直接搜就行了')
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
					localStorage.setItem('setCsTime',setCsTime);
					if (resLocation=='1') {
						sessionStorage.setItem('clickAddr','1,1,0');
						$('.cebian-nav .cebian-content>span').eq(0).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/erp-czi-ord';
					} else if(resLocation=='3'){
						sessionStorage.setItem('clickAddr','1,1,2');
						$('.cebian-nav .cebian-content>span').eq(2).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/zi-three';
					}else if(resLocation=='4'){
						sessionStorage.setItem('clickAddr','1,1,3');
						$('.cebian-nav .cebian-content>span').eq(3).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/zi-four';
					}else if(resLocation=='5'){
						sessionStorage.setItem('clickAddr','1,1,4');
						$('.cebian-nav .cebian-content>span').eq(4).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/zi-five';
					}else{
						layer.msg('未找到订单')
					}
				}
			},function (data) {
				console.log(data)
			})
		}
		$scope.QxJqczFun = function () {
			$scope.jqczFlag = false;
		}
		//获取转单号
		$scope.quaryZdhFun = function (item) {
			var upIds = {};
			upIds.ids = item.ID;
			erp.postFun2('searchOrderTracknumber.json',JSON.stringify(upIds),function (data) {
				console.log(data)
				if (data.data==1) {
					$scope.pageNum = 1;
					getOrdListFun()
				} else {
					layer.msg('获取转单号失败')
				}
			},function (data) {
				console.log(data)
			})
		}
		$scope.upLoadImg4=function (files) {
			erp.ossUploadFile($('#file')[0].files,function (data) {
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
			    var fileName = srcList[srcList.length-1].toLowerCase();
			    console.log(fileName)
			    if(fileName=='pdf'){
			        $scope.lrHref = result[0];
			    }else{
			    	layer.msg('请上传pdf格式')
			    }
			    console.log(result)
			    console.log($scope.lrHref)
			    $scope.$apply();
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
        }
        $scope.$on('log-to-father',function (d,flag) {
        	 if (d && flag) {
        	     $scope.isLookLog = false;
        	     $scope.gxhOrdFlag = false;
				 $scope.gxhProductFlag = false;
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
			console.log(pItem,item,pIndex,index)
			that.csObj = obj;
			
			console.log(that.csObj)
			ev.stopPropagation()
		}
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
		//导出pod图包 文字
		let podMuOrdId,podSaleManName;
		$scope.isSameMuIdFun = function(stu){
			var addyfhCount = 0;
			addyfhIds = '';
			podMuOrdId = '';
			podSaleManName = '';
			let muOrdIdArr = [];
			let itemMuOrdId,itemZiOrdId;
			$('#c-zi-ord .cor-check-box').each(function(){
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					itemMuOrdId = $(this).siblings('.hide-muorder-id').text()
					muOrdIdArr.push(itemMuOrdId)
					itemZiOrdId = $(this).siblings('.hide-order-id').text();
					if(itemZiOrdId.indexOf('GX')!=-1){
						addyfhIds+= itemZiOrdId + ',';
						addyfhCount++;
					}
					podSaleManName = $(this).siblings('.saleman-name').text();
				}
			})
			console.log(addyfhIds)
			if (addyfhCount>0) {
				let muIdIsEqual = true;
				for(let i = 1,len = muOrdIdArr.length;i<len;i++){
					if(muOrdIdArr[i]!=muOrdIdArr[0]){
						muIdIsEqual = false;
						break
					}
				}
				if(muIdIsEqual){
					if(stu == 2){
						$scope.isDaoBaoFlag = true;
						podMuOrdId = muOrdIdArr[0];
					}else if(stu == 1){
						$scope.isDaoTextFlag = true;
					}
					$scope.podTextIds = addyfhIds.substring(0,addyfhIds.length-1);
				}else{
					layer.msg('请选择相同的母订单')
				}
			} else {
				$scope.isaddyfhFlag = false;
				layer.msg('请选择个性化订单')
			}
		}
		$scope.sureDaoChuFun = function(){
			console.log($scope.podTextIds)
			$scope.isDaoBaoFlag = false;
			window.open('https://erp1.cjdropshipping.com/erp/podProduct/exportPodOrderText?id='+$scope.podTextIds+'&cjId='+podMuOrdId+'&salesmanId='+podSaleManName)

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
		$scope.handleCopySku = function (event,item) {
			event.stopPropagation()
			const clipboard = new window.cjUtils.Clipboard();
			clipboard.set(item.trackingnumber).then((res) => {
				console.log(res)
				layer.msg('复制成功');
			}).catch(err => {
				console.log('copy fialed -->> ', err)
			})
		}
		$scope.autoPrint = function(item){
			getSheet(item.id)
		}
		function PrintCode(url) {
			console.log(url)
			$.ajax({
				url: 'http://127.0.0.1:9999/marking?url=' + url,
				async: true,
				cache: false,
				dataType: 'text',
				error: function (xhr) {
					$scope.downLoadFlag = true;
					$scope.ydh = '';
					$scope.$apply()
					console.log($scope.downLoadFlag)
				},
				success: function (data) {
					$scope.ydh = '';
					$scope.$apply()
				}
			})
		}
		function getSheet(id) {
			console.log(id)
			erp.load();
			var ids = {};
			ids.ids = id;
			ids.type = '1';
			ids.loginName = erpLoginName;
			ids.uspsType = 0;
			console.log(JSON.stringify(ids))
			erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				layer.closeAll("loading")
				var resMdArr = data.data;
				if (resMdArr.length>0) {
					PrintCode(resMdArr[0])
				} else if(resMdArr.length===0){
					erp.postFun3('getExpressSheet.json',JSON.stringify(ids),function (data) {//走美国库
						console.log(data)
						layer.closeAll("loading")
						var resMdArr = data.data;
						if (resMdArr.length>0) {
							PrintCode(resMdArr[0])
						}
					},function (data) {
						console.log(data)
						layer.closeAll("loading")
						layer.msg('网络错误')
					})
				}else {
					layer.msg('生成面单错误')
				}
			},function (data) {
				console.log(data)
				layer.closeAll("loading")
				layer.msg('网络错误')
			})
		}
	}])
}()
