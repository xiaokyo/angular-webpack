;~function () {
	
	var app = angular.module('custom-zitwo-app');
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

	//规则订单
	app.controller('custom-print-controller',['$scope','$http','erp','$routeParams','$compile',function ($scope,$http,erp,$routeParams,$compile) {
		$scope.$on('repeatFinishCallback',function(){
		    $('#c-zi-ord .edit-inp').attr('disabled','true');
		});
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
		$scope.pageNum = '1';
		$scope.currtpage = 1;
		function getListFun() {
			erp.load()
			var printData = {};
			printData.pageNum = $scope.pageNum;
			printData.store = $scope.store;
			erp.postFun('app/order/youXuLieBiao',JSON.stringify(printData),function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.result) {
					var obj = JSON.parse(data.data.result)
					console.log(obj)
		        	$scope.erpordTnum = obj.allNum;
					$scope.erporderList = obj.orders;
					dealpage()
				} else {
					layer.msg('网络错误')
				}
			},function (data) {
				layer.closeAll('loading')
				console.log(data)
			})
		}
		getListFun()
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
			console.log($scope.currtpage)
			$("#c-pages-fun").jqPaginator({
				totalPages: $scope.erpordTnum,
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
			    	console.log(n,type)
			    	// alert(33333333333)
			        if(type=='init'){
			        	layer.closeAll("loading")
			        	return;
			        }
			        layer.load(2)
			        $scope.pageNum = n;
			        getListFun()
			    }
			});
		}
		$scope.gopageFun = function () {
			if($scope.pageNum>$scope.erpordTnum){
				layer.msg('输入的页数不能大于总页数')
				return;
			}
			layer.load(2)
			getListFun()
		}
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
					// if($(this).siblings('.is62').text()=='62'){
					// 	addyfhCount++;
					// 	addyfhIds+=$(this).siblings('.hide-order-id').text()+',';
					// }
					// if ($scope.store==2) {
					// 	if($(this).siblings('.is62').text()=='61'){
					// 		addyfhCount++;
					// 		addyfhIds+=$(this).siblings('.hide-order-id').text()+',';
					// 	}
					// } else {
					// 	addyfhCount++;
					// 	addyfhIds+=$(this).siblings('.hide-order-id').text()+',';
					// }
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
					$scope.currtpage = 1;
			        var erpData = {};

			        erpData.ydh = 'all';
			        if(muId!=''){
			        	erpData.id = muId;
			        }else {
			        	erpData.id = '';
			        }
			        if ($('.seach-ordnumstu').is(':checked')) {
			        	erpData.trackingnumberType = '';
			        	$scope.zzhstuFlag = true;
			        } else {
			        	erpData.trackingnumberType = 1;
			        	$scope.zzhstuFlag = false;
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
						countMFun($scope.erporderList);
						dealpage ();
			        },function () {
			        	layer.closeAll("loading")
			        	layer.msg('订单获取列表失败')
			        })
				} else {
					layer.closeAll("loading")
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
			var hisArr = item.TRACKINGNUMBERHISTORY.replace(item.TRACKINGNUMBER,'');
			hisArr = hisArr.split(',');
			$scope.hisArr = hisArr;
		}
		$scope.mdClickFun = function (item) {
			item.printCount++;
			console.log(item)
		}
		//关闭找货的PDF弹框
		$scope.closeFresh3Fun = function () {
			$scope.seaProFlag = false;
			$scope.pageNum = '1';
			getListFun()
		}
		//搜索
		$('.c-seach-inp').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
		})

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
			layer.load(2)
			$scope.store = 0;
			$('.two-ck-btn').removeClass('two-ck-activebtn')
			$(ev.target).addClass('two-ck-activebtn');
			getListFun()
		}
		$scope.storeFun1 = function (ev) {
			layer.load(2)
			$scope.store = 1;
			$('.two-ck-btn').removeClass('two-ck-activebtn')
			$(ev.target).addClass('two-ck-activebtn');
			getListFun()
		}
		$scope.storeFun2 = function (ev) {
			layer.load(2)
			$scope.store = 2;
			$('.two-ck-btn').removeClass('two-ck-activebtn')
			$(ev.target).addClass('two-ck-activebtn');
			getListFun()
		}

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


		//批量打印运单 筛选物流 商品属性
		$scope.isdymdFlag = false;
		$scope.isdymdFun = function () {
			$scope.isdymdFlag = true;
		}
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
			console.log($scope.erporderList)
			for(var i = 0;i<$scope.erporderList.length;i++){
				console.log($scope.erporderList[i].order)
				printIds+=$scope.erporderList[i].order.ID+',';
			}
			console.log(printIds)
			ids.ids = printIds;
			ids.type = '1';
			ids.loginName = erpLoginName;
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
}()
