(function () {

	var app = angular.module('custom-zifive-app',['service']);
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
	app.controller('custom-zifive-controller',['$scope','$http','erp','$routeParams','$compile','$timeout',function ($scope,$http,erp,$routeParams,$compile,$timeout) {
		$scope.showStoreName = erp.showStoreName
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
        	$scope.gxhProductFlag = true;
        	that.pro = list;
			that.type = type;
			that.plist = plist;
        	console.log(that.pro)
        	console.log(type)
        	e.stopPropagation()
        }
		$(window).scroll(function(){
		    var before = $(window).scrollTop();
		    if(before>60){
		       if($(window).width()>1230){
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
		var bs = new Base64();
		var muId = '';
		var nowTime = new Date().getTime();
		var erpLoginName = bs.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
		var setTiem = localStorage.getItem('setCsTime')==undefined?'':localStorage.getItem('setCsTime');
		var getCsObj = localStorage.getItem('ziCs')==undefined?'':JSON.parse(localStorage.getItem('ziCs'));
		if (erpLoginName=='admin'||erpLoginName=='金仙娟'||erpLoginName=='李贞'||erpLoginName=='李正月'||erpLoginName=='王波' || erpLoginName=='陈真' || erpLoginName=='邹丽容' || erpLoginName=='刘思梦'||erpLoginName=='刘依'||erpLoginName=='虞雅婷'||erpLoginName=='石晶' || erpLoginName == '赵炜') {
			$scope.cxclAdminShowFlag = true;
		} else {
			$scope.cxclAdminShowFlag = false;
		}
		var isSetCsFlag = false;//是否携带参数
		if(nowTime-setTiem>1500){
			isSetCsFlag = false;
			console.log('时间大于1秒')
		}else{
			isSetCsFlag = true;
			$scope.isSelJqcz = getCsObj.tj;
			// $("#c-data-time").val(getCsObj.btime);
			// $("#cdatatime2").val(getCsObj.etime);
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
		erpData.status = '13';
		erpData.disputeId = 'all';
		// alert(erpData.status)
		erpData.ydh = 'all';
		erpData.page = 1;
		$('#page-sel').val('100');
		erpData.limit = $('#page-sel').val()-0;
		erpData.cjOrderDateBegin = $('#c-data-time').val();
		erpData.cjOrderDateEnd = $('#cdatatime2').val();
		erpData.trackingnumberType = "all";
		console.log(erpData)
		$scope.erpordersList = '';//存储所有的订单
		$scope.erpordTnum = 0;//存储订单的条数
		if(isSetCsFlag){
			seltjFun(erpData);
		}
		// console.log(JSON.stringify(erpData))
		// erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
		// 	console.log(data)
		// 	layer.closeAll("loading")
		// 	var erporderResult = data.data;//存储订单的所有数据
		// 	// erporderResult = JSON.parse(data.data.orderList)
		// 	$scope.erpordTnum = erporderResult.orderCount;
		// 	$scope.erporderList = erporderResult.ordersList;
		// 	console.log($scope.erporderList)
		// 	countMFun($scope.erporderList);
		// 	dealpage ()
		// },function () {
		// 	layer.closeAll("loading")
		// 	layer.msg('订单获取列表失败')
		// 	// alert(2121)
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
				currentPage: 1,
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
			        erp.load();
			        // alert(555555555555)
			        $('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			        var erpData = {};
			        seltjFun(erpData);
			        erpData.page = n;
			        console.log(JSON.stringify(erpData))
			        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			        	console.log(data)
			        	layer.closeAll("loading")
			        	console.log(data.data.productsList)
			        	var erporderResult = data.data;//存储订单的所有数据
			        	// erporderResult = JSON.parse(data.data.orderList)
			        	$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
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
			// console.log(showList)
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
			    	erp.load();
			        $('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			        var erpData = {};
			        seltjFun(erpData);
			        erpData.page = n;
			        console.log(JSON.stringify(erpData))
			        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			        	console.log(data)
			        	layer.closeAll("loading")
			        	console.log(data.data.productsList)
			        	var erporderResult = data.data;//存储订单的所有数据
			        	// erporderResult = JSON.parse(data.data.orderList)
			        	$scope.erpordTnum = erporderResult.orderCount;
			        	$scope.erporderList = erporderResult.ordersList;
			        	if($scope.erpordTnum<1){
			        		layer.msg('未找到订单')
			        	}
			        	countMFun($scope.erporderList);
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
			    	erp.load();
			        $('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			        var erpData = {};

			        seltjFun(erpData);
			        erpData.page = n;
			        console.log(JSON.stringify(erpData))
			        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			        	console.log(data)
			        	layer.closeAll("loading")
			        	console.log(data.data.productsList)
			        	var erporderResult = data.data;//存储订单的所有数据
			        	// erporderResult = JSON.parse(data.data.orderList)
			        	$scope.erpordTnum = erporderResult.orderCount;
			        	$scope.erporderList = erporderResult.ordersList;
			        	if($scope.erpordTnum<1){
			        		layer.msg('未找到订单')
			        	}
			        	countMFun($scope.erporderList);
			        },function () {
			        	layer.closeAll("loading")
			        	layer.msg('订单获取列表失败')
			        })
			    }
			});
		}
		//搜索
		$('.c-seach-inp').keypress(function(Event){
		    if(Event.keyCode==13){
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
		function seltjFun (data) {
			// if ($('.seach-ordnumstu').is(':checked')) {
			// 	data.trackingnumberType = '';
			// } else {
			// 	data.trackingnumberType = 1;
			// }
			var showList = $('#page-sel').val()-0;
			data.status = '13';
			data.disputeId = 'all';
			data.ydh = 'all';
			if(muId!=''){
				data.id = muId;
			}else {
				data.id = '';
			}
			data.page = 1;
			data.trackingnumberType = "all";
			data.limit = showList;
			data.cjOrderDateBegin = $('#c-data-time').val();
			data.cjOrderDateEnd = $('#cdatatime2').val();
			var selVal = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());

			return AssembleSearchData(data, selVal, inpVal);
		}
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
					split: '',
					orderobserver: '',
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
				case '参考号':
					data = mergeData({ split: inpVal });
					break;
				case '僵尸订单':
				    data = mergeData({ orderobserver: inpVal ? inpVal : 'all' })
				    break;
			}

			return data;
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
			erpData.status = '13';
			erpData.ydh = 'all';
			erpData.disputeId = 'all';
			if(muId!=''){
				erpData.id = muId;
			}else {
				erpData.id = '';
			}
			// if ($('.seach-ordnumstu').is(':checked')) {
			// 	erpData.trackingnumberType = '';
			// } else {
			// 	erpData.trackingnumberType = 1;
			// }
			erpData.cjOrderDateBegin = $('#c-data-time').val();
			erpData.cjOrderDateEnd = $('#cdatatime2').val();
			erpData.page = 1;
			erpData.limit = $('#page-sel').val()-0;
			erpData.trackingnumberType = "all";
			erpData.store = $scope.store
			erpData = AssembleSearchData(erpData, selVal, inpVal);
			console.log(erpData)
			console.log(JSON.stringify(erpData))
			erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				var erporderResult = data.data;//存储订单的所有数据
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun($scope.erporderList);
				dealpage ();
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			})
		}
		//查询纠纷订单
		$scope.selfun1 = function (ev) {
			if ($(ev.target).hasClass('search-jf-act')) {
				$(ev.target).removeClass('search-jf-act');
				$scope.selstu = 2;
			} else {
				$(ev.target).addClass('search-jf-act');
				$scope.selstu = 1;
			}
			console.log($scope.selstu)
			erp.load();
		    $('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
		    var erpData = {};
		    seltjFun(erpData);
		    erpData.page = 1;
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
		    	dealpage ()
		    },function () {
		    	layer.closeAll("loading")
		    	layer.msg('订单获取列表失败')
		    })
		}
		//erp开始日期搜索
		$("#c-data-time").click(function (){
			var erpbeginTime=$("#c-data-time").val();
			var interval=setInterval(function (){
				var endtime2=$("#c-data-time").val();
				if(endtime2!=erpbeginTime){
					erp.load();
					clearInterval(interval);
					var erpData = {};
					//查询的条件
					seltjFun (erpData);
					console.log(JSON.stringify(erpData))
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
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
					erp.load();
					clearInterval(interval);
					// alert(selVal)
					var erpData = {};
					//查询的条件
					seltjFun (erpData);
					console.log(JSON.stringify(erpData))
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
						dealpage ();
					},function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				}
			},100)
		})

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
			if ($('#c-data-time').val()) {
				csDataObj.btime = $('#c-data-time').val();
			} else {
				csDataObj.btime = aDate;
			}
			csDataObj.etime = $('#cdatatime2').val();
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

		// 日期插件 初始化日期
		// $('#c-data-time').dcalendarpicker({format:'yyyy-mm-dd'});
		//鼠标划过事件
		//点击事件
		$('.orders-table').on('click','.erporder-detail',function (event) {
			if($(event.target).hasClass('cor-check-box')||$(event.target).hasClass('qtcz-sel')){
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
		//批量打印运单 筛选物流 商品属性
		$scope.isdymdFlag = false;
		$scope.uspsType = '0';
		$scope.isdymdFun = function () {
			var dymdindex = 0;
			$scope.uspsPlusNum = 0;
			$scope.uspsDdCount = 0;
			var isUspsWlName,wlModeAttr;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					dymdindex++;
					wlModeAttr = $(this).parent().siblings('.wl-ord-td').children('.wl-mode-p').text();
					isUspsWlName = $(this).parent().siblings('.wl-ord-td').children('.wl-name-p').text();
					console.log(wlModeAttr,isUspsWlName)
					if(isUspsWlName=='USPS+'||isUspsWlName=='USPS'||wlModeAttr=='Shipstation'){
						console.log('物流方式为usps+')
						$scope.uspsPlusNum++;
					}
				}
			})
			console.log($scope.uspsDdCount)
			if (dymdindex<=0) {
				layer.msg('请选择订单')
				return;
			} else {
				if ($scope.uspsPlusNum<1) {
					$scope.isdymdFlag = true;
				}
			}
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
		//打印面单
		// $scope.isdymdFun = function () {
		// 	var dymdindex = 0;
		// 	$('#c-zi-ord .cor-check-box').each(function () {
		// 		if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
		// 			dymdindex++;
		// 		}
		// 	})
		// 	if (dymdindex<=0) {
		// 		layer.msg('请选择订单')
		// 		return;
		// 	} else {
		// 		$scope.isdymdFlag = true;
		// 	}
		// }
		//打印面单关闭的弹框
		$scope.isdymdCloseFun = function () {
			$scope.isdymdFlag = false;
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
			console.log(JSON.stringify(ids))
			// return;
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
		//生成面单链接后的关闭按钮函数
		$scope.closeTcFun = function () {
			$scope.mdtcFlag = false;
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
					$scope.currtpage = 1;
					var erpData = {};
					if(muId!=''){
						erpData.id = muId;
					}else {
						erpData.id = '';
					}
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.status = '13';
					erpData.disputeId = 'all';
					erpData.ydh = 'all';
					erpData.page = 1;
					erpData.limit = $('#page-sel').val()-0;
					seltjFun(erpData);
					console.log(JSON.stringify(erpData))
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						console.log($scope.erporderList)
						countMFun($scope.erporderList);
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
			console.log(JSON.stringify(cxclData))
			erp.postFun('app/order/initERPOrder',JSON.stringify(cxclData),function (data) {
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
					erpData.status = '13';
					erpData.ydh = 'all';
					erpData.disputeId = 'all';
					erpData.page = $scope.currtpage;
					erpData.limit = $('#page-sel').val()-0;
					seltjFun(erpData);
					console.log(JSON.stringify(erpData))
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						console.log($scope.erporderList)
						countMFun($scope.erporderList);
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
		//阻止冒泡
		$scope.stopFun = function (e) {
			e.stopPropagation();
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
		//批量同步至店铺
		$scope.tbdpFlag = false;
		$scope.istbdpTc = function () {
			$scope.lxindex = 0;
			$scope.nfEytNum = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					if ($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EYT')>=0) {
						$scope.nfEytNum++;
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
			var shopIds = '';//存储店铺id
			var excelIds = '';//存储excel 的id
			var lxCount = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					// lxindex++;
					if($(this).parent().siblings('.created-td').find('.track-nump').text().indexOf('EYT')<0){
						lxCount++;
						if ($(this).parent().siblings('.store-name-td').children('.store-name-p').text()=='Excel Imported') {
							excelIds+=$(this).siblings('.hide-order-id').text()+',';
							console.log('excel order')
						} else {
							shopIds+=$(this).siblings('.hide-order-id').text()+',';
							console.log('dianpu order')
						}
					}
				}
			})
			console.log(excelIds)
			console.log(shopIds)
			if(lxCount>10){
				$scope.tbdpTipFlag = true;//打开提示时间较长框
			}
			erp.load();
			var upData = {};
			upData.shopId = shopIds;
			upData.excelId = excelIds;
			console.log(JSON.stringify(upData))
			erp.postFun('app/order/fulfilOrder',JSON.stringify(upData),function (data) {
				console.log(data)
				$scope.tbdpTipFlag = false;//关闭提示框
				if (data.data.result) {
					layer.msg('同步成功')
					var erpData = {};
					erpData.status = '13';
					erpData.disputeId = 'all';
					erpData.ydh = 'all';
					if(muId!=''){
						erpData.id = muId;
					}else {
						erpData.id = '';
					}
					seltjFun(erpData);
					erpData.page = 1;
					erpData.limit = $('#page-sel').val()-0;
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					console.log(erpData)
					console.log(JSON.stringify(erpData))
					erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
						console.log(data)
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						countMFun($scope.erporderList);
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
		}
		//展示历史追踪号
		$scope.hisTraNumFun = function (item) {
			$scope.hisTrackNumFlag = true;
			var hisArr = item.TRACKINGNUMBERHISTORY.replace(item.TRACKINGNUMBER,'');
			hisArr = hisArr.split(',');
			$scope.hisArr = hisArr;
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
				if (resLocation=='5') {
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
					// if ($('#c-data-time').val()) {
					// 	csDataObj.btime = $('#c-data-time').val();
					// } else {
					// 	csDataObj.btime = aDate;
					// }
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
					}else if(resLocation=='2'){
						sessionStorage.setItem('clickAddr','1,1,1');
						$('.cebian-nav .cebian-content>span').eq(1).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/zi-two';
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