(function () {
	var app = angular.module('custom-zidiaodu-app',['service']);
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
	app.controller('custom-zidiaodu-controller',['$scope','$http','erp','$routeParams','$compile',function ($scope,$http,erp,$routeParams,$compile) {
		const api = {
			deductUrl_old: 'app/order/orderdikoukucun',//抵扣库存 {ids: ''}  废弃
			deductUrl: 'processOrder/queryOrder/orderdikoukucun',//抵扣库存 {cjOrderIds: ['', '', ...]}
		}
		function retFilterArr(str) {
			if (!str) return [];
			return str.split(',').filter(str => str)// 过滤空字符串情况
		}
		
		var that =this;
		$scope.isAnalysis=false;
		$scope.openAnalysis=function(id,name){
			//$('.khzzc').show();
			console.log(name);
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
			 }
		})

		$scope.openZZC2 = function(list,e,type){
			$scope.gxhOrdFlag = true;
			that.pro = list;
			that.type = type;
			console.log(that.pro)
			console.log(type)
			e.stopPropagation()
		}
		$scope.openZZC = function(list,e,type){
			$scope.gxhProductFlag = true;
			that.pro = list;
			that.type = type;
			console.log(that.pro)
			console.log(type)
			e.stopPropagation()
		}
		$scope.$on('repeatFinishCallback',function(){
		    $('#c-zi-ord .edit-inp').attr('disabled','true');
		});
		$scope.curTime = new Date().getTime();
		$scope.dayFun = function (day1,day2) {
			let date = new Date(day1)
			let creatTime = date.getTime();
			return Math.ceil((day2-creatTime)/86400000)
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

		if ($routeParams.muId!=''&&$routeParams.muId!=undefined) {
			muId = $routeParams.muId;
		}
		$scope.seaType = '母订单号';
		$scope.storeType = '0';
		$scope.isKucunFlag = true;
		$scope.erpordTnum = 0;//存储订单的条数
		$scope.pageSize = '50';
		$scope.pageNum = '1';
		$scope.totalPageNum = 0;

		console.log($scope.storeType)
		function getList() {
			erp.load()
			var erpData = {};
			erpData.data = {};
			erpData.pageNum = $scope.pageNum;
			erpData.pageSize = $scope.pageSize;
			erpData.beginDate = $('#c-data-time').val();
			erpData.endDate = $('#cdatatime2').val();
			if(muId!=''){
				erpData.data.id = muId;
			}else {
				erpData.data.id = '';
			}
			switch ($scope.seaType) {
				case '子订单号':
					erpData.data.orderNumber = $scope.seaInpVal;
					erpData.data.shipmentsOrderId = '';
					erpData.data.salesmanName = '';
					erpData.data.consumerName = '';
					erpData.data.ydh = 'all';
					break;
				case '客户名称':
					erpData.data.consumerName = $scope.seaInpVal;
					erpData.data.shipmentsOrderId = '';
					erpData.data.orderNumber = '';
					erpData.data.salesmanName = '';
					break;
				case '业务员':
					erpData.data.salesmanName = ''; //$scope.seaInpVal;
					erpData.data.ownerName = $scope.seaInpVal;
					erpData.data.shipmentsOrderId = '';
					erpData.data.orderNumber = '';
					erpData.data.consumerName = '';
					erpData.data.ydh = 'all';
					break;
				case '母订单号':
					erpData.data.shipmentsOrderId = $scope.seaInpVal;
					erpData.data.orderNumber = '';
					erpData.data.salesmanName = '';
					erpData.data.consumerName = '';
					erpData.data.ydh = 'all';
					break;
			}
			if($('.is-has-inv').attr('src')=='static/image/order-img/multiple2.png'){
				erpData.data.location = 'y';
				console.log('有库存')
			}else{
				erpData.data.location = 'n';
				console.log('无库存')
			}

			erpData.data.sku = $scope.sku;
			erpData.data.execute = 'y';
			erpData.data.ydh = 'all';
			erpData.data.trackingnumberType = 'all';
			console.log(JSON.stringify(erpData))
			erp.postFun('processOrder/queryOrder/queryPendingOrderPageByParam',JSON.stringify(erpData),function (data) {
				console.log(data)
				var erporderResult = data.data.data;//存储订单的所有数据
				console.log(erporderResult)
				$scope.erpordTnum = erporderResult.total;
				$scope.erporderList = erporderResult.list;
				console.log($scope.erporderList)
				dealpage ()
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			},{layer:true})
		}
		// getList()
		//处理分页
		function dealpage () {
			$('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			if($scope.erpordTnum<1){
				layer.msg('未找到订单')
				return;
			}
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
			        if(type=='init'){
			        	layer.closeAll("loading")
			        	return;
			        }
			        $scope.pageNum = n;
			        getList()
			    }
			});
		}
		//分页选择框的切换
		$scope.pageFun = function () {
			$scope.pageNum = '1';
			getList()
		}
		//跳页的查询
		$scope.gopageFun = function () {
			if(!$scope.pageNum||$scope.pageNum<1){
				layer.msg('请输入页码')
				return
			}
			var countN = Math.ceil($scope.erpordTnum/$scope.pageSize);
			if ($scope.pageNum>countN) {
				layer.closeAll("loading")
				layer.msg('选择的页数大于总页数.');
				return;
			}
			getList()
		}
		$('.is-has-inv').click(function () {
			if($(this).attr('src')=='static/image/order-img/multiple2.png'){
				$(this).attr('src','static/image/order-img/multiple1.png')
				console.log('查无库存')
				$scope.isKucunFlag = false;
				getList()
			}else{
				$(this).attr('src','static/image/order-img/multiple2.png')
				console.log('查有库存')
				$scope.isKucunFlag = true;
				getList()
			}
		})
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
			let idsArr = selIds.split(',')
			idsArr.pop()
			upData.ids = idsArr;
			erp.postFun('processOrder/handleOrder/orderReleaseRepertory',JSON.stringify(upData),function (data) {
				console.log(data)
				if (data.data.code==200) {
					layer.msg('释放成功')
					$scope.storeTypeFlag = false;
					getList()
				} else {
					layer.msg('释放失败')
				}
			},function (data) {
				console.log(data)
			},{layer:true})
		}
		//抵扣库存
		$scope.piPeiKcFun = function () {
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
				$scope.piPeiFlag = true;
			}
		}
		$scope.canpiPeiKcFun = function () {
			$scope.piPeiFlag = false;
		}
		$scope.surepiPeiKcFun = function () {
			erp.load()
			const params = { cjOrderIds: retFilterArr(selIds) }//抵扣库存 {cjOrderIds: ['', '', ...]}
			erp.postFun(api.deductUrl, params, function ({data:{data: result}}) {
				if (result === true) {
					layer.msg('抵扣成功')
					$scope.piPeiFlag = false;
					getList()
				} else {
					layer.msg('抵扣失败')
					erp.closeLoad()
				}
			},function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		//统计
		//更多操作阻止冒泡
		$('.morefun-div').click(function (e) {
			e.stopPropagation()
		})
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
			console.log(JSON.stringify(lrData))
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

		//搜索
		$('.c-seach-inp').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
		})
		$scope.searchFun = function () {
			$scope.pageNum = '1';
			getList()
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
					getList()
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
					getList()
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

		//阻止冒泡
		$scope.stopFun = function (e) {
			e.stopPropagation();
		}
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