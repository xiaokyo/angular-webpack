(function () {

	var app = angular.module('custom-zithree-app',['service']);
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


	function AssembleSearchData(data, selVal, inpVal) {
		var mergeData = function (json) {
			return Object.assign(data, {
				orderNumber: '',
				shopName: '',
				sku: '',
				cjProductName: '',
				consumerName: '',
				salesmanName: '',
				ownerName: '',
				shipmentsOrderId: '',
				ydh: 'all',
				customerName: '',
				peiHuoPiCi: '',
				split: '',
				CJTracknumber: '',
			}, json);
		};

		switch (selVal) {
			case '子订单号':
				data = mergeData({ orderNumber: inpVal });
				break;
			case '店铺名称':
				data = mergeData({ shopName: inpVal });
				break;
			case '商品SKU':
				data = mergeData({ sku: inpVal });
				break;
			case '商品名称':
				data = mergeData({ cjProductName: inpVal });
				break;
			case '客户名称':
				data = mergeData({ consumerName: inpVal });
				break;
			case '业务员':
				data = mergeData({ salesmanName: inpVal });
				break;
			case '群主':
				data = mergeData({ ownerName: inpVal });
				break;
			case '母订单号':
				data = mergeData({ shipmentsOrderId: inpVal });
				break;
			case '追踪号':
				if (inpVal) {
					data = mergeData({ ydh: inpVal });
				} else {
					data = mergeData({ ydh: 'all' });
				}
				console.log(inpVal)
				break;
			case 'CJ追踪号':
				data = mergeData({ CJTracknumber: inpVal });
				break;
			case '收件人':
				data = mergeData({ customerName: inpVal });
				break;
			case '客户订单号':
				data = mergeData({ orderNumber: inpVal });
				break;
		}

		return data;
	}


	app.controller('custom-zithree-controller',['$scope','$http','erp','$routeParams','$compile','$timeout',function ($scope,$http,erp,$routeParams,$compile,$timeout) {
		var that =this;
		$scope.isAnalysis=false;
		$scope.showStoreName = erp.showStoreName
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
		$(window).scroll(function(){
		    var before = $(window).scrollTop();
		    if(before>60){
		       if($(window).width()>1500){
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
		getDisputeCount();
		function getDisputeCount(){
			var sendData ={"status":"12","ydh":"all","disputeId":"dispute","id":"","page":1,"limit":100,"trackingnumberType":"all","cjOrderDateBegin":"","cjOrderDateEnd":"","orderNumber":"","shopName":"","sku":"","cjProductName":"","consumerName":"","salesmanName":"","shipmentsOrderId":"","customerName":"","split":""};
			erp.postFun('app/order/jiufenzongshu',JSON.stringify(sendData),function(data){
				console.log(data.data);
				if(data.data.orderCount){
					$scope.disputeCount = data.data.orderCount;
				}else{
					$scope.disputeCount=0;
				}
			},function(){});

		}
		$scope.$on('log-to-father',function (d,flag) {
			 if (d && flag) {
			 	$scope.isAnalysis = false;
			    $scope.isLookLog = false;
			    $scope.gxhOrdFlag = false;
				$scope.gxhProductFlag = false;
				$scope.spMessageflag = false;
			 }
		})
		$scope.spNoteFun = function(pItem,item,pIndex,index,ev){
			$scope.spMessageflag = true;
			that.pItem = pItem;
			that.item = item;
			that.pIndex = pIndex;
			that.index = index;
			that.list = $scope.erporderList;
			console.log(pItem,item,pIndex,index)
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
			console.log(list)
			if(list){
				$scope.gxhProductFlag = true;
				that.pro = list;
				that.type = type;
				that.plist = plist;
				console.log(that.pro)
				console.log(type)
			}else{
				layer.msg('沒有个性化信息')
			}
        	
        	e.stopPropagation()
        }
		$scope.$on('repeatFinishCallback',function(){
		    $('#c-zi-ord .edit-inp').attr('disabled','true');
		});
		$scope.curTime = new Date().getTime();
		$scope.dayFun = function (day1,day2) {
			return Math.ceil((day2-day1)/86400000)
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
		$scope.currtpage = 1;
		$scope.isSelJqcz = '业务员';
		var bs = new Base64();
		var muId = '';
		var nowTime = new Date().getTime();
		var setTiem = localStorage.getItem('setCsTime')==undefined?'':localStorage.getItem('setCsTime');
		var getCsObj = localStorage.getItem('ziCs')==undefined?'':JSON.parse(localStorage.getItem('ziCs'));
		var erpLoginName = bs.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
		
		$scope.cxclAdminShowFlag = ['admin', '金仙娟', '李贞', '李正月', '王波', '陈真', '邹丽容', '刘思梦', '刘依', '虞雅婷', '石晶', '陈小琴'].includes(erpLoginName)
		var isSetCsFlag = false;//是否携带参数
		if(nowTime-setTiem>1500){
			isSetCsFlag = false;
			console.log('时间大于1秒')
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

		// erp.load();
		var erpData = {};
		if(muId!=''){
			erpData.id = muId;
			$scope.isSelJqcz = '母订单号';
			$('.c-seach-inp').val(muId)
		}else {
			erpData.id = '';
		}
		erpData.cjOrderDateBegin = $('#c-data-time').val();
		erpData.cjOrderDateEnd = $('#cdatatime2').val();
		erpData.status = '12';
		erpData.ydh = 'all';
		erpData.page = 1;
		erpData.trackingnumberType = 'all';
		$('#page-sel').val('100');
		erpData.limit = $('#page-sel').val()-0;
		$scope.erpordTnum = erpData.limit;
		$scope.erpordersList = '';//存储所有的订单
		$scope.erpordTnum = 0;//存储订单的条数
		if(isSetCsFlag){
			seltjFun(erpData);
		}
        if($scope.isfulfillment){
            erpData.fulfillment = '1';
        }
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
		// })
		function countMFun (val) {
			var len = val.length;
			var count=0;
			for(var i = 0;i<len;i++){
				count+=val[i].order.AMOUNT;
			}
			$scope.countMoney = count.toFixed(2)
			console.log($scope.countMoney);
		}
		//处理分页
		function dealpage () {
			erp.load();
			// $scope.countMoney = 0;
			var showList = $('#page-sel').val()-0;
			$('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			if($scope.erpordTnum<1){
				layer.msg('未找到订单')
				layer.closeAll("loading")
				return;
			}
			// alert(44444444444)
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: showList,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.currtpage*1,
				activeClass: 'active',
			    prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
			    next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
			    page: '<a href="javascript:void(0);">{{page}}<\/a>',
			    first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
			    last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
			    onPageChange: function (n,type) {
			    	// alert(33333333333)
			        if(type=='init'){
			        	// alert(22222222222)
			        	layer.closeAll("loading")
			        	return;
			        }
			        $scope.currtpage = n;
			        // alert(555555555555)
			        erp.load();
			        $('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			        var erpData = {};
			        erpData.status = '12';
			        erpData.ydh = 'all';
			        if(muId!=''){
			        	erpData.id = muId;
			        }else {
			        	erpData.id = '';
			        }
			        //查询的条件
			        seltjFun (erpData);
			        var showList = $('#page-sel').val()-0;
			        erpData.page = n;
			        erpData.limit = showList;
                    if($scope.isfulfillment){
                        erpData.fulfillment = '1';
                    }
			        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			        	console.log(data)
			        	layer.closeAll("loading")
			        	console.log(data.data.productsList)
			        	var erporderResult = data.data;//存储订单的所有数据
			        	// erporderResult = JSON.parse(data.data.orderList)
			        	$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun ($scope.erporderList);
			        },function () {
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
			var showList = $(this).val()-0;
			if ($scope.erpordTnum<1) {
				erp.closeLoad();
				return;
			}
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: showList,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: 1,
				activeClass: 'active',
			    prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
			    next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
			    page: '<a href="javascript:void(0);">{{page}}<\/a>',
			    first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
			    last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
			    onPageChange: function (n) {
			        $('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			        erp.load();
			        var erpData = {};
			        erpData.status = '12';
			        erpData.ydh = 'all';
			        if(muId!=''){
			        	erpData.id = muId;
			        }else {
			        	erpData.id = '';
			        }
			        //查询的条件
			        seltjFun (erpData);
			        erpData.page = n;
			        erpData.limit = showList;
                    if($scope.isfulfillment){
                        erpData.fulfillment = '1';
                    }
			        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			        	console.log(data)
			        	layer.closeAll("loading")
			        	console.log(data.data.productsList)
			        	var erporderResult = data.data;//存储订单的所有数据
			        	// erporderResult = JSON.parse(data.data.orderList)
			        	$scope.erpordTnum = erporderResult.orderCount;
			        	$scope.erporderList = erporderResult.ordersList;
			        	countMFun ($scope.erporderList);
			        	if($scope.erpordTnum<1){
			        		layer.msg('未找到订单')
			        	}
			        },function () {
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
			var showList = $('#page-sel').val()-0;
			var pageNum = $('#inp-num').val()-0;
			// alert(pageNum)
			if (pageNum=='') {
				layer.closeAll("loading")
				layer.msg('跳转页数不能为空!');
				return;
			}
			var countN = Math.ceil($scope.erpordTnum/showList);
			// alert(countN)
			if (pageNum>countN) {
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
			        $('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			        erp.load();
			        var erpData = {};
			        erpData.status = '12';
			        erpData.ydh = 'all';
			        if(muId!=''){
			        	erpData.id = muId;
			        }else {
			        	erpData.id = '';
			        }
			        //查询的条件
			        seltjFun (erpData);
			        erpData.page = n;
			        erpData.limit = showList;
                    if($scope.isfulfillment){
                        erpData.fulfillment = '1';
                    }
			        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			        	console.log(data)
			        	layer.closeAll("loading")
			        	console.log(data.data.productsList)
			        	var erporderResult = data.data;//存储订单的所有数据
			        	// erporderResult = JSON.parse(data.data.orderList)
			        	$scope.erpordTnum = erporderResult.orderCount;
			        	$scope.erporderList = erporderResult.ordersList;
			        	countMFun ($scope.erporderList);
			        	if($scope.erpordTnum<1){
			        		layer.msg('未找到订单')
			        	}
			        },function () {
			        	layer.closeAll("loading")
			        	layer.msg('订单获取列表失败')
			        })
			    }
			});
		}
		//更多操作阻止冒泡
		$('.morefun-div').click(function (e) {
			e.stopPropagation()
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
		//展示历史追踪号
		$scope.hisTraNumFun = function (item) {
			$scope.hisTrackNumFlag = true;
			console.log(item.TRACKINGNUMBERHISTORY)
			var hisArr = item.TRACKINGNUMBERHISTORY.replace(item.TRACKINGNUMBER,'');
			console.log(hisArr)
			hisArr = hisArr.split(',');
			$scope.hisArr = hisArr;
		}
		//录入追踪号
		$scope.lrFun = function (item,ev,index) {
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
			erp.load();
			var $lrbtnObj = $(ev.target);
			var lrordId,inpVal;
			lrordId = item.ID;
			inpVal = $lrbtnObj.siblings('.zzh-inp').val();
			var lrData = {};
			lrData.logisticsNumber = $.trim(inpVal);
			lrData.id = lrordId;
			erp.postFun('app/order/upLogisticsNumber',JSON.stringify(lrData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				if (data.data.result>0) {
					// if ($('.seach-ordnumstu').is(':checked')) {
					// 	$scope.erporderList.splice(index,1);
					// 	$scope.erpordTnum--;
					// 	layer.msg('修改追踪号成功')
					// } else {
					// 	layer.msg('修改追踪号成功')
					// 	$lrbtnObj.siblings('.lr-zzhbtn').siblings().hide();
					// 	$lrbtnObj.siblings('.lr-zzhbtn').show();
					// 	$lrbtnObj.siblings('.zzh-inp').val('');
					// 	$('.orders-table .track-nump').eq(index).text($.trim(inpVal));
					// }
					layer.msg('修改追踪号成功')
					$lrbtnObj.siblings('.lr-zzhbtn').siblings().hide();
					$lrbtnObj.siblings('.lr-zzhbtn').show();
					$lrbtnObj.siblings('.zzh-inp').val('');
					$scope.erporderList[index].order.TRACKINGNUMBER = $.trim(inpVal);
					$scope.erporderList[index].order.TRACKINGNUMBERHISTORY = $.trim(inpVal)+','+$scope.erporderList[index].order.TRACKINGNUMBERHISTORY;
					console.log($scope.erporderList[index])
				} else {
					layer.msg('添加追踪号失败')
				}
			},function (data) {
				layer.closeAll("loading")
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
	        erpData.status = '12';
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
	        //查询的条件
	        seltjFun (erpData);
	        erpData.page = 1;
	        erpData.limit = $('#page-sel').val()-0;
            if($scope.isfulfillment){
                erpData.fulfillment = '1';
            }
	        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
	        	console.log(data)
	        	layer.closeAll("loading")
	        	console.log(data.data.productsList)
	        	var erporderResult = data.data;//存储订单的所有数据
	        	// erporderResult = JSON.parse(data.data.orderList)
	        	$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun ($scope.erporderList);
				dealpage ();
	        },function () {
	        	layer.closeAll("loading")
	        	layer.msg('订单获取列表失败')
	        })
		}

		//搜索
		$('.c-seach-inp').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
		})
		//按条件搜索
		function seltjFun (data) {
			if ($('.seach-ordnumstu').is(':checked')) {
				data.trackingnumberType = 1;
			} else {
				data.trackingnumberType = 'all';
			}
			if ($scope.selstu==1) {
				data.disputeId = 'dispute';
			} else {
				data.disputeId = '';
			}
			data.cjOrderDateBegin = $('#c-data-time').val();
			data.cjOrderDateEnd = $('#cdatatime2').val();
			var selVal = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());

			return AssembleSearchData(data, selVal, inpVal);
		}

		// storageTab components async message
		$scope.fristRequest = true
		$scope.storageCallback = function({item, storageList, allString}){
			let store = allString
			if(!!item) store = item.dataId
			$scope.store = store
			!$scope.fristRequest && $scope.searchFun()
			$scope.fristRequest = false
		}

		$scope.searchFun = function () {
			$scope.currtpage = 1;
			erp.load();
			var selVal = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());
			if (selVal=='追踪号'&&inpVal.length==30&&inpVal.indexOf(',')==-1) {
				var subResStr = inpVal.substring(inpVal.length-22)
				if(subResStr.substring(0,1)=='9'){
					inpVal = subResStr;
					$('.c-seach-inp').val(inpVal);
				}
			}
			// alert(selVal)
			var erpData = {};
			erpData.status = '12';
			erpData.ydh = 'all';
			if ($scope.selstu==1) {
				erpData.disputeId = 'dispute';
			} else {
				erpData.disputeId = '';
			}
			if(muId!=''){
				erpData.id = muId;
			}else {
				erpData.id = '';
			}
			if ($('.seach-ordnumstu').is(':checked')) {
				erpData.trackingnumberType = 1;
			} else {
				erpData.trackingnumberType = 'all';
			}
			erpData.cjOrderDateBegin = $('#c-data-time').val();
			erpData.cjOrderDateEnd = $('#cdatatime2').val();
			erpData.page = 1;
			erpData.limit = $('#page-sel').val()-0;
			erpData.store = $scope.store
			erpData = AssembleSearchData(erpData, selVal, inpVal);
			console.log(erpData)
      if($scope.isfulfillment){
          erpData.fulfillment = '1';
      }
			erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				var erporderResult = data.data;//存储订单的所有数据
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				dealpage ();
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			})
		}
		//查询纠纷订单
		$scope.selfun1 = function (ev) {
            $('.fulfillment').removeClass('search-jf-act');
            $scope.isfulfillment = false;
            if ($(ev.target).hasClass('search-jf-act')) {
				$(ev.target).removeClass('search-jf-act');
				$scope.selstu = 2;
			} else {
				$(ev.target).addClass('search-jf-act');
				$scope.selstu = 1;
			}
			erp.load();
			var erpData = {};
			erpData.status = '12';
			erpData.ydh = 'all';
			if(muId!=''){
				erpData.id = muId;
			}else {
				erpData.id = '';
			}
			//查询的条件
			seltjFun (erpData);
			erpData.page = 1;
			erpData.limit = $('#page-sel').val()-0;
            if($scope.isfulfillment){
                erpData.fulfillment = '1';
            }
			erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				console.log(data.data.productsList)
				var erporderResult = data.data;//存储订单的所有数据
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun ($scope.erporderList);
				dealpage ();
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			})
		}
		//履行列表
		$scope.selfun2 = function(ev){
            $('.first').removeClass('search-jf-act');
            $('.seach-ordnumstu').prop("checked",false);
            if ($(ev.target).hasClass('search-jf-act')) {
                $(ev.target).removeClass('search-jf-act');
                $scope.isfulfillment = false;
            } else {
                $scope.isfulfillment = true;
                $(ev.target).addClass('search-jf-act');
            }
            getListFun();
        }
		function getListFun(){
            var erpData = {};
            if(muId!=''){
                erpData.id = muId;
                $scope.isSelJqcz = '母订单号';
                $('.c-seach-inp').val(muId)
            }else {
                erpData.id = '';
            }
            erpData.cjOrderDateBegin = $('#c-data-time').val();
            erpData.cjOrderDateEnd = $('#cdatatime2').val();
            erpData.status = '12';
            erpData.ydh = 'all';
            erpData.page = 1;
            erpData.trackingnumberType = 'all';
            $('#page-sel').val('100');
            erpData.limit = $('#page-sel').val()-0;
            $scope.erpordTnum = erpData.limit;
            console.log(erpData)
            $scope.erpordersList = '';//存储所有的订单
            $scope.erpordTnum = 0;//存储订单的条数
            if(isSetCsFlag){
                seltjFun(erpData);
            }
            if($scope.isfulfillment){
                erpData.fulfillment = '1';
            }
            erp.load();
            erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
                console.log(data)
                layer.closeAll("loading")
                var erporderResult = data.data;//存储订单的所有数据
                // erporderResult = JSON.parse(data.data.orderList)
                $scope.erpordTnum = erporderResult.orderCount;
                $scope.erporderList = erporderResult.ordersList;
                countMFun ($scope.erporderList);
                dealpage ()
            },function () {
                layer.closeAll("loading")
                layer.msg('订单获取列表失败')
                // alert(2121)
            })
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
                erp.postFun('pojo/shopify/activeFulfillment', data, function (res) {
                    console.log(data);
                    if (res.data.statusCode == 200) {
                        layer.msg('同步成功');
                        $scope.isfulfillment = true;
                        getListFun();
                    }
                }, function (err) {
                    layer.msg('系统异常')
                })
            }
        }
        $scope.Synchronization = function(id){
            var data = {
                ids:id
            };
            erp.postFun('pojo/shopify/activeFulfillment', data, function (res) {
                console.log(data);
                if (res.data.statusCode == 200) {
                    layer.msg('同步成功');
                    $scope.isfulfillment = true;
                    getListFun();
                }
            }, function (err) {
                layer.msg('系统异常')
            })
        }

		//按时间搜索
		//erp开始日期搜索
		$("#c-data-time").click(function (){
			var erpbeginTime=$("#c-data-time").val();
			var interval=setInterval(function (){
				var endtime2=$("#c-data-time").val();
				if(endtime2!=erpbeginTime){
					$scope.currtpage = 1;
					erp.load();
					clearInterval(interval);
					var erpData = {};
					erpData.status = '12';
					erpData.ydh = 'all';
					if(muId!=''){
						erpData.id = muId;
					}else {
						erpData.id = '';
					}
					//查询的条件
					seltjFun (erpData);
					erpData.page = 1;
					erpData.limit = $('#page-sel').val()-0;
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
                    if($scope.isfulfillment){
                        erpData.fulfillment = '1';
                    }
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun ($scope.erporderList);
						dealpage ();
					},function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				}
			},100)
		})
		//erp结束日期搜索
		$("#cdatatime2").click(function (){
			var erpendTime=$("#cdatatime2").val();
			var interval=setInterval(function (){
				var endtime2=$("#cdatatime2").val();
				if(endtime2!=erpendTime){
					$scope.currtpage = 1;
					erp.load();
					clearInterval(interval);
					// alert(selVal)
					var erpData = {};
					erpData.status = '12';
					erpData.ydh = 'all';
					if(muId!=''){
						erpData.id = muId;
					}else {
						erpData.id = '';
					}
					//查询的条件
					seltjFun (erpData);
					erpData.page = 1;
					erpData.limit = $('#page-sel').val()-0;
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
                    if($scope.isfulfillment){
                        erpData.fulfillment = '1';
                    }
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun ($scope.erporderList);
						dealpage ();
					},function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				}
			},100)
		})
		//留言的弹框
		$scope.messageflag = false;
		$scope.messageimgFun = function (item) {
			$scope.messageflag = true;
			$scope.messageCon = item.NOTE_ATTRIBUTES;
		}
		$scope.messcloseBtnFun = function () {
			$scope.messageflag = false;
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



		//给导航添加点击事件
		$('.ord-stu-cs').click(function () {
			// $('.e-customer-ord').css({
			// 	color: '#646464',
			// 	backgroundColor: '#d5d5d5'
			// })
			// $(this).css({
			// 	color : '#000',
			// 	backgroundColor: '#fff'
			// })
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
		//设置导航的高度
		// $(function () {
		// 	$('.left-bar-nav').height() = $('.c-ord-mid').height();
		// })
		//先把所有的订单状态全部隐藏
		$('.toogle-ord-stu').hide();
		//让查看母订单显示
		$('#c-zi-ord').show();
		// $('#c-mu-a').css('color','#faa538');
		//给功能按钮里面的导航添加点击事件
		$('.ord-fun-a').click(function () {
			$('.ord-fun-a').removeClass('ord-active');
			$(this).addClass('ord-active');
		})
		// $('.ord-fun-a').hover(function () {
		// 	// $('.toogle-ord-stu').hide();
		// 	$('.ord-fun-a').css('color','#000');
		// 	$(this).css('color','#faa538');
		// })
		// 按订单筛选条件处理订单
		// $('.c-select-ord').change(function () {
		// 	var selectVal = $(this).val();
		// 	// console.log(selectVal);
		// 	switch (selectVal) {
		// 		case '所有订单':
		// 			$('.c-order-allnum').css('visibility','hidden');
		// 			$('.c-print-ord-a').css('visibility','hidden');
		// 			break;
		// 		case '筛选可发货订单':
		// 			$('.c-order-allnum').css('visibility','visible');
		// 			$('.c-print-ord-a').css('visibility','visible');
		// 			$('.c-order-allnum').html('110条订单');
		// 			$('.c-print-ord-a').html('批量打印运单及发货');
		// 			break;
		// 		case '筛选可生成运单状态订单':
		// 			$('.c-order-allnum').css('visibility','visible');
		// 			$('.c-print-ord-a').css('visibility','visible');
		// 			$('.c-order-allnum').html('100条订单');
		// 			$('.c-print-ord-a').html('批量生成运单状态');
		// 			break;
		// 		case '筛选可上传运单状态订单':
		// 			$('.c-order-allnum').css('visibility','visible');
		// 			$('.c-print-ord-a').css('visibility','visible');
		// 			$('.c-order-allnum').html('109条订单');
		// 			$('.c-print-ord-a').html('批量上传运单状态');
		// 			break;
		// 		default:
		// 			// statements_def
		// 			break;
		// 	}
		// })
		//选择框的切换

		// var listIndex = 0;
		// $scope.selChangeFun = function (item,czfsName,$index) {
		// 	listIndex = $index;
		// 	switch (czfsName) {
		// 		case '打印面单':
		// 			$scope.oneisdymdFlag = true;
		// 			onemdId = item.ID;
		// 			break;
		// 		default:
		// 			// statements_def
		// 			break;
		// 	}
		// }
		//批量打印运单 筛选物流 商品属性
		$scope.isdymdFlag = false;
		$scope.isdymdFlag2 = false;//筛选后有多少条符合打印面单
		$scope.uspsType = '0';
		$scope.isdymdFun = function () {//是否打印面单的询问框
			var dymdindex = 0;
			$scope.uspsPlusNum = 0;
			var isUspsWlName,wlModeAttr;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					dymdindex++;
					isUspsWlName = $(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text();
					wlModeAttr = $(this).parent().siblings('.wl-ord-td').children('.wl-mode-p').text();
					if(isUspsWlName=='USPS+'||isUspsWlName=='USPS'||wlModeAttr=='Shipstation'){
						console.log('物流方式为usps+')
						$scope.uspsPlusNum++;
					}
				}
			})
			if (dymdindex<=0) {
				layer.msg('请选择订单')
				return;
			} else {
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
			ids.type = '2';
			ids.uspsType = $scope.uspsType;
			erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				console.log(data.data)
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
			ids.type = '2';
			ids.merge = 'y';
			ids.uspsType = $scope.uspsType;
			erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				console.log(data.data)
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
		$scope.mdClickFun = function (item) {
			item.printCount++;
			console.log(item)
		}
		//阻止冒泡
		$scope.stopFun = function (e) {
			e.stopPropagation();
		}
		//单个操作一条订单打印面单
		$scope.oneisdymdFlag = false;
		var onemdId = '';//存储一条订单的id
		$scope.oneisdymdFun = function (item) {
			$scope.oneisdymdFlag = true;
			onemdId = item.ID;
		}
		$scope.onedymdcloseFun = function () {
			$scope.oneisdymdFlag = false;
		}
		$scope.oneSureFun = function () {
			$scope.oneisdymdFlag = false;//关闭询问是否打印订单的提示框
			erp.load();
			var ids = {};
			ids.ids = onemdId;
			ids.type = '2';
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
		function freshFun() {
			//刷新数据
			erp.load();
			var erpData = {};
			if(muId!=''){
				erpData.id = muId;
			}else {
				erpData.id = '';
			}
			erpData.cjOrderDateBegin = $('#c-data-time').val();
			erpData.cjOrderDateEnd = $('#cdatatime2').val();
			erpData.status = '12';
			erpData.ydh = 'all';
			erpData.page = $scope.currtpage;
			erpData.limit = $('#page-sel').val()-0;
			seltjFun(erpData);
            if($scope.isfulfillment){
                erpData.fulfillment = '1';
            }
			erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				var erporderResult = data.data;//存储订单的所有数据
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				console.log($scope.erporderList)
				countMFun ($scope.erporderList);
				dealpage ();
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
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
			erp.postFun('processOrder/handleOrder/initERPOrder',JSON.stringify(cxclData),function (data) {
				console.log(data);
				$scope.cxclFlag = false;
				if(data.data.message&&(data.data.message!=null||data.data.message!='null')){
					$scope.cxclResFlag = true;
					$scope.initMessage = data.data.message;
				}
				if(data.data.result>0){
					$scope.currtpage = 1;
					var erpData = {};
					if(muId!=''){
						erpData.id = muId;
					}else {
						erpData.id = '';
					}
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.status = '12';
					erpData.ydh = 'all';
					erpData.page = 1;
					erpData.limit = $('#page-sel').val()-0;
					seltjFun(erpData);
                    if($scope.isfulfillment){
                        erpData.fulfillment = '1';
                    }
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun ($scope.erporderList);
						dealpage ();
					},function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
						// alert(2121)
					})
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
		}
		$scope.isonecxclCloseFun = function () {
			$scope.onecxclFlag = false;
		}
		$scope.isonecxclSureFun = function () {
			erp.load();
			var cxclData = {};
			cxclData.ids = cxclOrdId;
			erp.postFun('processOrder/handleOrder/initERPOrder',JSON.stringify(cxclData),function (data) {
				console.log(data);
				$scope.onecxclFlag = false;
				if(data.data.message&&(data.data.message!=null||data.data.message!='null')){
					$scope.cxclResFlag = true;
					$scope.initMessage = data.data.message;
				}
				if(data.data.result>0){
					var erpData = {};
					if(muId!=''){
						erpData.id = muId;
					}else {
						erpData.id = '';
					}
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.status = '12';
					erpData.ydh = 'all';
					erpData.page = $scope.currtpage;
					erpData.limit = $('#page-sel').val()-0;
					seltjFun(erpData);
                    if($scope.isfulfillment){
                        erpData.fulfillment = '1';
                    }
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						console.log($scope.erporderList)
						countMFun ($scope.erporderList);
						dealpage ();
					},function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
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
		// 日期插件 初始化日期
		// $('#c-data-time').dcalendarpicker({format:'yyyy-mm-dd'});
		//鼠标划过事件
		//点击事件
		$('.orders-table').on('click','.erporder-detail',function (event) {
			if($(event.target).hasClass('cor-check-box')||$(event.target).hasClass('qtcz-sel')||$(event.target).hasClass('stop-prop')){
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
			// $(this).next().hide();
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
		//编辑弹框
		$scope.editFlag = false;
		$scope.editFun = function (item) {
			$scope.editFlag = true;
			 console.log(item)
			 $scope.itemData = item;
			 // console.log(item.CITY)
			 // console.log(item.city)
			 $scope.customerName = item.CUSTOMER_NAME;
			 $scope.country = item.COUNTRY_CODE;
			 $scope.province=item.PROVINCE;
			 $scope.city=item.CITY;
			 $scope.shipAddress1=item.SHIPPING_ADDRESS;
			 $scope.shipAddress2=item.shippingAddress2;
			 $scope.zip=item.ZIP;
			 $scope.phone=item.PHONE;
			 $scope.logisticName=item.LOGISTIC_NAME;
		}
		//取消按钮
		$scope.closeFun = function () {
			$scope.editFlag = false;
		}

		//批量同步至店铺
		$scope.tbdpFlag = false;
		$scope.istbdpTc = function () {
			$scope.lxindex = 0;
			$scope.nfEytNum = 0;//南风转单号
			$scope.jceqkptNum = 0;//佳成英国转单号
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					if ($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EYT')>=0) {
						$scope.nfEytNum++;
					}else if($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EQKPT')>=0){
						$scope.jceqkptNum++;
					}else{
						$scope.lxindex++;
					}
				}
			})
			if ($scope.lxindex<=0) {
				layer.msg('请选择订单');
				return;
			}else{
				$scope.tbdpFlag = true;
			}
		}
		$scope.istbdpcloseFun = function () {
			$scope.tbdpFlag = false;
		}
		$scope.lvxingFun = function () {
			$scope.tbdpFlag = false;//关闭询问框
			var shopIds = [];//存储店铺id
			var excelIds = [];//存储excel 的id
			var lxCount = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					// lxindex++;
					if($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EYT')<0&&$(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EQKPT')<0){
						lxCount++;
						if ($(this).parent().siblings('.store-name-td').children('.store-name-p').text()=='Excel Imported') {
							excelIds.push($(this).siblings('.hide-order-id').text());
							console.log('excel order')
						} else {
							shopIds.push($(this).siblings('.hide-order-id').text());
							console.log('dianpu order')
						}
					}
				}
			})
			if(lxCount>10){
				$scope.tbdpTipFlag = true;//打开提示时间较长框
			}
			erp.load();
			var upData = {};
			upData.shopId = shopIds.join(',');
			upData.excelId = excelIds.join(',');
			upData.type = 'n';
			erp.postFun('processOrder/handleOrder/updateOrderProcessBeShipped',JSON.stringify(upData),function (data) {
				console.log(data)
				$scope.tbdpTipFlag = false;//关闭提示框

				if (data.data.success) {
					layer.msg('同步成功')

			        $('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			        var erpData = {};
			        erpData.status = '12';
			        if(muId!=''){
			        	erpData.id = muId;
			        }else {
			        	erpData.id = '';
			        }
			        //查询的条件
			        seltjFun (erpData);
			        erpData.page = 1;
			        erpData.limit = $('#page-sel').val()-0;
                    if($scope.isfulfillment){
                        erpData.fulfillment = '1';
                    }
			        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			        	console.log(data)
			        	layer.closeAll("loading")
			        	console.log(data.data.productsList)
			        	var erporderResult = data.data;//存储订单的所有数据
			        	// erporderResult = JSON.parse(data.data.orderList)
			        	$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun ($scope.erporderList);
						dealpage ();
			        },function () {
			        	layer.closeAll("loading")
			        	layer.msg('订单获取列表失败')
			        })

				} else {
					layer.closeAll("loading")
					layer.msg('同步失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
			erp.postFun('app/order/fulfilOrder',JSON.stringify(upData),function (data) {
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
			upData.type = 'n';
			if ($scope.shoptype=="Excel Imported") {
				upData.excelId = $scope.itemId;
			} else {
				upData.shopId = $scope.itemId;
			}

			console.log(JSON.stringify(upData))
			
			erp.postFun('processOrder/handleOrder/updateOrderProcessBeShipped',JSON.stringify(upData),function (data) {
				console.log(data)
				if (data.data.success) {
					layer.msg('同步成功')
				} else {
					layer.msg('同步失败')
				}
			},function (data) {
				console.log(data)
			})
			erp.postFun('app/order/fulfilOrder',JSON.stringify(upData),function (data) {
				
			},function (data) {
				console.log(data)
			})
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
				if (resLocation=='3') {
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
					} else if(resLocation=='2'){
						sessionStorage.setItem('clickAddr','1,1,1');
						$('.cebian-nav .cebian-content>span').eq(1).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/zi-two';
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
					layer.msg('获取转单号成功')
					erp.load();
					var erpData = {};
					if(muId!=''){
						erpData.id = muId;
					}else {
						erpData.id = '';
					}
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.status = '12';
					erpData.page = $scope.currtpage;
					// erpData.ydh = 'y';
					erpData.limit = $('#page-sel').val()-0;
					console.log(JSON.stringify(erpData))
                    if($scope.isfulfillment){
                        erpData.fulfillment = '1';
                    }
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						console.log($scope.erporderList)
						countMFun ($scope.erporderList);
						dealpage ()
					},function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
						// alert(2121)
					})
				} else {
					layer.msg('获取转单号失败')
				}
			},function (data) {
				console.log(data)
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
        	 }
		})
		
		$scope.showDispatchFun = (e,item)=>{
			e.stopPropagation();
			$scope.showDispatch=true;
			$scope.dispatchObj = {
				val:item.order.taskTrackingNumber
			}
		}
	}])




	app.controller('custom-lanjie-controller',['$scope','$http','erp','$routeParams','$compile',function ($scope,$http,erp,$routeParams,$compile) {
		$scope.cangkuList = [
			{ name: '义乌仓', key: 0 },
			{ name: '深圳仓', key: 1 },
			{ name: '美国奇诺仓', key: 2 },
			{ name: '美国新泽西仓', key: 3 },
			{ name: '泰国仓', key: 4 },
		]
		$scope.searchCangku = ''
		$scope.openZZC2=function(list){
			$scope.dzList=list;
			$('.zzc').show();
		}
		$scope.openZZC=function(properties){
			console.log(properties);

			//var data= JSON.parse(properties);
			var arr=[];
			arr.push(properties);
			$scope.dzList=arr;
			console.log($scope.dzList);
			//$scope.$apply();
			$('.zzc').show();
		}
		$scope.closeZZC=function(){
			$('.zzc').hide();
		}
		$scope.$on('repeatFinishCallback',function(){
			// alert(6666666666)
		    $('#c-zi-ord .edit-inp').attr('disabled','true');
		});
		$scope.curTime = new Date().getTime();
		$scope.dayFun = function (day1,day2) {
			return Math.ceil((day2-day1)/86400000)
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
		$scope.currtpage =1;
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
		if (erpLoginName=='admin'||erpLoginName=='邹丽容'||erpLoginName=='金仙娟'||erpLoginName=='李贞'||erpLoginName=='虞雅婷'||erpLoginName=='杨玉磊') {
			$scope.isShowFlag = true;
		} else {
			$scope.isShowFlag = false;
		}
		if (erpLoginName=='admin'||erpLoginName=='金仙娟'||erpLoginName=='李贞' || erpLoginName=='陈真' || erpLoginName=='邹丽容' || erpLoginName == '刘依' || erpLoginName == '钟家荣' || erpLoginName == '陈映红' || erpLoginName == '李超' || erpLoginName == '赵炜') {
			$scope.cxclAdminShowFlag = true;
		} else {
			$scope.cxclAdminShowFlag = false;
		}
		if(nowTime-setTiem>1500){
			isSetCsFlag = false;
		}else{
			isSetCsFlag = true;
			$scope.isSelJqcz = getCsObj.tj;
			// $("#c-data-time").val(getCsObj.btime);
			// $("#cdatatime2").val(getCsObj.etime);
			$('.c-seach-country').val(getCsObj.tj);
			$('.c-seach-inp').val(getCsObj.val);
			console.log(nowTime-setTiem)
		}
		var lanJieStu = $routeParams.stu || 0;
		//给功能按钮里面的导航添加点击事件
		console.log(lanJieStu-0)
		$('.ord-fun-a').eq(lanJieStu-0).addClass('ord-active')//让第一个默认选中
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

		erp.load();
		$scope.pageSize = '100';
		$scope.pageNum = 1;
		function getListFun() {
	        erp.load();
	        var erpData = {};
	        erpData.ydh = 'all';
	        seltjFun(erpData);
	        erpData.cjOrderDateBegin = $('#c-data-time').val();
	        erpData.cjOrderDateEnd = $('#cdatatime2').val();
	        erpData.page = $scope.pageNum;
			erpData.limit = $scope.pageSize;
			if ($scope.isSelJqcz === '仓库') {
				erpData.store = $scope.searchCangku
			}
	        console.log(erpData)
	        console.log(JSON.stringify(erpData))
	        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
	        	console.log(data)
	        	layer.closeAll("loading")
	        	console.log(data.data.productsList)
	        	var erporderResult = data.data;//存储订单的所有数据
	        	// erporderResult = JSON.parse(data.data.orderList)
	        	$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				if(erporderResult.counts){
					$scope.dYi = erporderResult.counts.daipeiqi;
					$scope.dEr = erporderResult.counts.yipeiqi;
				}
				countMFun($scope.erporderList);
				getNumFun()
				dealpage ();
	        },function () {
	        	layer.closeAll("loading")
	        	layer.msg('订单获取列表失败')
	        })
		}
		getListFun()

		function countMFun (val) {
			var len = val.length;
			var count=0;
			for(var i = 0;i<len;i++){
				count+=val[i].order.AMOUNT;
			}
			$scope.countMoney = count.toFixed(2)
			console.log($scope.countMoney);
		}
		//处理分页
		function dealpage () {
			erp.load();
			$('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")

			console.log($scope.erpordTnum)
			if(!$scope.erpordTnum||$scope.erpordTnum<=0){
				layer.msg('未找到订单')
				layer.closeAll("loading")
				return;
			}
			// alert(44444444444)
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: $scope.pageSize*1,//设置每一页的条目数
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
			        $('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			        getListFun()
			    }
			});
		}
		//分页选择框的切换
		$scope.chaPageFun = function () {
			$scope.pageNum = 1;
			getListFun()
		}
		//跳页的查询
		$scope.gopageFun = function () {
			var countN = Math.ceil($scope.erpordTnum/$scope.pageSize);
			if ($scope.pageNum<1||$scope.pageNum>countN) {
				layer.msg('请注意输入的页码!');
				return;
			}
			getListFun()
		}
		//获取数量
		function getNumFun() {
			erp.postFun('app/order/getOrderCount6',{
				'store':$scope.store
			},function (data) {
				console.log(data)
				if(data.data.statusCode==200){
					var resResult = JSON.parse(data.data.result);
					$scope.dSan = resResult.zhong;
					$scope.dSi = resResult.jiufen;
					$scope.queHuo = resResult.queHuo;
					$scope.daiChuKu = resResult.daiChuKu;
					$scope.lanJieZhong = resResult.lanJieZhong;
					$scope.yiLanJie = resResult.yiLanJie;
				}
			},function (data) {
				console.log(data)
			})
		}
		//获取物流方式
		// erp.postFun('app/erplogistics/queryLogisticMode',{
		// 	"param":""
		// },function (data) {
		// 	console.log(data)
		// 	$scope.wlNameList = data.data.result;
		// },function(data){
		// 	console.log(data)
		// })

		// erp.postFun('app/storagedo/getStorageDoList','{}',function (data) {
		//     console.log(data)
		//     // var obj = JSON.parse(data.data.result);
		//     // console.log(obj)
		//     $scope.ckArr = data.data.list;
		//     console.log($scope.ckArr)
		// },function (data) {
		//     erp.closeLoad();
		//     console.log('仓库获取失败')
		// })
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
		//搜索
		$('.c-seach-inp').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
		})
		//按条件搜索
		function seltjFun (data) {
			if (lanJieStu==0) {
				data.status = '68';
			} else if(lanJieStu==1) {
				data.status = '69';
			}
			data.trackingnumberType = 'all';
			var inpVal = $.trim($('.c-seach-inp').val());


			return AssembleSearchData(data, $scope.isSelJqcz, inpVal);
		}
		$scope.searchFun = function () {
			$scope.pageNum = 1;
			getListFun();
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
					getListFun()
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
					getListFun()
				}
			},100)
		})

		//留言的弹框
		//CJ客户留言的弹框
		$scope.messageflag = false;
		var mesOrdId;
		var messageCon;
		var mesIndex;
		$scope.messageimgFun = function (item,index) {
			// $event.stopPropagation();
			$scope.messageflag = true;
			$scope.messageCon = item.NOTE_ATTRIBUTES;
			mesIndex = index;
			// messageCon = $('.orders-table .mes-hidetest').eq(index).text();
			// $('.custom-mes').val(messageCon);
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
			thisWlName = $(this).siblings('.item-wlname').text();
			if($scope.selstu==3){
				if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
					if (cziIndex==0) {//没有选中项
						console.log('没有选中项',cziIndex)
						cziIndex++;
						if (thisWlName=='顺丰国际') {
							md10Count++;
						}
						$(this).attr('src','static/image/order-img/multiple2.png');
					} else {//有选中项
						console.log('有选中项',cziIndex)
						if (md10Count==0) {//选择15
							if (thisWlName=='顺丰国际') {
								layer.msg('已经选中15x15,只能选择规格相同的')
							} else {
								$(this).attr('src','static/image/order-img/multiple2.png');
								cziIndex++;
							}
						} else {//选择10
							if (thisWlName=='顺丰国际') {
								$(this).attr('src','static/image/order-img/multiple2.png');
								cziIndex++;
								md10Count++;
							} else {
								layer.msg('已经选中10x10,只能选择规格相同的')
							}
						}
					}
					if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
						$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
					}
				}else{
					$(this).attr('src','static/image/order-img/multiple1.png');
					cziIndex--;
					if(thisWlName=='顺丰国际'){
						md10Count--;
					}
					if (cziIndex != $('#c-zi-ord .cor-check-box').length) {
						$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
					}
				}
			}else{
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
			}
			// if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
			// 	$(this).attr('src','static/image/order-img/multiple2.png');
			// 	cziIndex++;
			// 	if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
			// 		$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
			// 	}
			// } else {
			// 	$(this).attr('src','static/image/order-img/multiple1.png');
			// 	cziIndex--;
			// 	if (cziIndex != $('#c-zi-ord .cor-check-box').length) {
			// 		$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
			// 	}
			// }
		})
		//全选
		$('#c-zi-ord').on('click','.c-checkall',function () {
			if($scope.selstu==3){
				if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
					$(this).attr('src','static/image/order-img/multiple2.png');
					cziIndex = 0;
					$('#c-zi-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
					md10Count = 0;
					$('#c-zi-ord .cor-check-box').each(function () {
						thisWlName = $(this).siblings('.item-wlname').text();
						if(thisWlName=='顺丰国际'){
							console.log(md10Count)
							md10Count++;
							cziIndex++;
							$(this).attr('src','static/image/order-img/multiple2.png')
							// if (md10Count>27) {
							// 	return false;
							// }
						}

					})
					if(md10Count<1){
						layer.msg('没有10x10,选中所有规格为15x15')
						cziIndex = $('#c-zi-ord .cor-check-box').length;
						$('#c-zi-ord .cor-check-box').attr('src','static/image/order-img/multiple2.png')
					}else{
						layer.msg('选中了'+md10Count+'条面单为10x10的订单')
					}
				}else {
					$(this).attr('src','static/image/order-img/multiple1.png');
					cziIndex = 0;
					md10Count = 0;
					md15Count = 0;
					$('#c-zi-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
				}
			}else{
				if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
					$(this).attr('src','static/image/order-img/multiple2.png');
					cziIndex = $('#c-zi-ord .cor-check-box').length;
					$('#c-zi-ord .cor-check-box').attr('src','static/image/order-img/multiple2.png');
				} else {
					$(this).attr('src','static/image/order-img/multiple1.png');
					cziIndex = 0;
					$('#c-zi-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
				}
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
			localStorage.setItem('setCsTime',setCsTime);
		})
		//关闭找货的PDF弹框
		$scope.closeFresh3Fun = function () {
			$scope.seaProFlag = false;
			getListFun(1);
		}


		$('.buck-dyyd').show();//批量打印面单
		$('.buck-qxpq').hide();//批量强行配齐
		$('.ggclass').show();//输入框
		//单品 多品
		$scope.oneOrMuch = 1;
		$('.one-ormore').eq(0).addClass('one-ormore-active');
		$scope.duopinFun = function () {
			$scope.oneOrMuch = 1;
			$scope.wlModeName = '';
			$('.one-ormore').eq(1).removeClass('one-ormore-active');
			$('.one-ormore').eq(0).addClass('one-ormore-active');
			getListFun(1);//getListFun 此参数是订单是否配齐
		}
		$scope.danpinFun = function () {
			$scope.oneOrMuch = 0;
			$scope.wlModeName = '';
			$('.one-ormore').eq(0).removeClass('one-ormore-active');
			$('.one-ormore').eq(1).addClass('one-ormore-active');
			getListFun(1);
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
		$scope.selstu = 2;//判断订单状态 隐藏选择框中的操作
		$scope.selfun1 = function ($event) {
			$('.seach-ordnumstu').prop("checked",false);
			$scope.selstu = 1;
			console.log($.trim($('.c-seach-inp').val()))
			console.log(!$.trim($('.c-seach-inp').val()))
			if (!$.trim($('.c-seach-inp').val())) {
				$scope.isSelJqcz='追踪号';
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
	        $scope.currtpage = 1;
	        erp.load();
	        var erpData = {};
	        erpData.ydh = 'all';
	        if(muId!=''){
	        	erpData.id = muId;
	        }else {
	        	erpData.id = '';
	        }
	        seltjFun(erpData);
	        erpData.cjOrderDateBegin = $('#c-data-time').val();
	        erpData.cjOrderDateEnd = $('#cdatatime2').val();
	        var showList = $('#page-sel').val()-0;
	        erpData.page = 1;
	        erpData.store = $scope.store;
	        erpData.limit = showList;
	        console.log(erpData)
	        console.log(JSON.stringify(erpData))
	        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
	        	console.log(data)
	        	layer.closeAll("loading")
	        	console.log(data.data.productsList)
	        	var erporderResult = data.data;//存储订单的所有数据
	        	// erporderResult = JSON.parse(data.data.orderList)
	        	$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun($scope.erporderList);
				dealpage ();
	        },function () {
	        	layer.closeAll("loading")
	        	layer.msg('订单获取列表失败')
	        })
		}
		$scope.selfun2 = function ($event) {
			$('.seach-ordnumstu').prop("checked",false);
			$scope.wlModeName = '';
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
			if($scope.isSelJqcz=='配货批次'){
				$scope.isSelJqcz='业务员';
				$('.c-seach-inp').val('');
			}
			$('.ord-fun-a').removeClass('ord-active');
			$($event.target).addClass('ord-active')
	        $scope.currtpage = 1;
	        erp.load();
	        var erpData = {};
	        erpData.ydh = 'all';
	        if(muId!=''){
	        	erpData.id = muId;
	        }else {
	        	erpData.id = '';
	        }
	        seltjFun(erpData);
	        erpData.cjOrderDateBegin = $('#c-data-time').val();
	        erpData.cjOrderDateEnd = $('#cdatatime2').val();
	        var showList = $('#page-sel').val()-0;
	        erpData.page = 1;
	        erpData.limit = showList;
	        console.log(erpData)
	        console.log(JSON.stringify(erpData))
	        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
	        	console.log(data)
	        	layer.closeAll("loading")
	        	console.log(data.data.productsList)
	        	var erporderResult = data.data;//存储订单的所有数据
	        	// erporderResult = JSON.parse(data.data.orderList)
	        	$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				dealpage ();
	        },function () {
	        	layer.closeAll("loading")
	        	layer.msg('订单获取列表失败')
	        })
		}
		$scope.selfun5 = function ($event) {
			$('.seach-ordnumstu').prop("checked",false);
			$scope.selstu = 5;
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
		// $scope.istbdpTc = function () {
		// 	$scope.lxindex = 0;
		// 	$scope.nfEytNum = 0;//南风转单号
		// 	$scope.jceqkptNum = 0;//佳成英国转单号
		// 	$('#c-zi-ord .cor-check-box').each(function () {
		// 		if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
		// 			if ($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EYT')>=0) {
		// 				$scope.nfEytNum++;
		// 			}else if($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EQKPT')>=0){
		// 				$scope.jceqkptNum++;
		// 			}else{
		// 				$scope.lxindex++;
		// 			}
		// 		}
		// 	})
		// 	if ($scope.lxindex<=0) {
		// 		layer.msg('请选择订单');
		// 		return;
		// 	}else{
		// 		$scope.tbdpFlag = true;
		// 	}
		// }
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
				}
			})
			if (dymdindex<=0) {
				layer.msg('请选择订单')
				return;
			} else {
				var isdyzdata = {};//检测是否有正在打印的进程
				isdyzdata.userId = erpuserId;
				erp.postFun2('checkLastExp.json',JSON.stringify(isdyzdata),function (data) {
					console.log(data)
					if (data.data.result=='go') {
						layer.msg('正在打印面单')
						setTimeout(function () {
							$scope.yxdyBtnFun($scope.dymdId);
						},2000)
					}else{
						if ($scope.uspsPlusNum<1) {
							$scope.isdymdFlag = true;
						}
					}
				},function (data) {
					console.log(data)
				})
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
				var isdyzdata = {};//检测是否有正在打印的进程
				isdyzdata.userId = erpuserId;
				erp.postFun2('checkLastExp.json',JSON.stringify(isdyzdata),function (data) {
					console.log(data)
					if (data.data.result=='go') {
						layer.msg('正在打印面单')
						setTimeout(function () {
							$scope.yxdyBtnFun($scope.dymdId);
						},2000)
					}else{
						$scope.isyxdymdFlag = true;
					}
				},function (data) {
					console.log(data)
				})
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
					layer.msg('获取转单号成功')
					erp.load();
					var erpData = {};
					if(muId!=''){
						erpData.id = muId;
					}else {
						erpData.id = '';
					}

					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.status = '6';
					seltjFun(erpData);
					erpData.page = $scope.currtpage;
					// erpData.ydh = 'y';
					erpData.limit = $('#page-sel').val()-0;
					console.log(JSON.stringify(erpData))
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
						dealpage ()
					},function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
						// alert(2121)
					})
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
	    	 }
	    })
	}])
	
})()