(function (angular) {
	// console.log(app);
	var app = angular.module('manage');

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
		erpData.orderId = $scope.orderId;
		erpData.salesman = $scope.salesman;  
		erpData.CUSTOMERNAME = $scope.CUSTOMERNAME;
    erpData.storeType = $scope.storeType;
		erpData.beginCreatedAt = $('#c-data-time').val();
		erpData.endCreatedAt = $('#cdatatime2').val();
    erpData.orderSource=$scope.orderType
    erpData.operator = $scope.operator
		return erpData;
	}
  

	function getOrderList ($scope,erp) {
		erp.load();
		$('.c-ord-list .c-checkall').attr('src','static/image/order-img/multiple1.png')
		erp.postFun($scope.getListUrl,JSON.stringify(getSendData($scope)),function (data) {
			console.log(data)
			layer.closeAll("loading")
			var erporderResult = data.data;//存储订单的所有数据
			$scope.erpordTnum = erporderResult.totalNum;
			$scope.erporderList = erporderResult.list;
      // 操作人员列表获取
      if($scope.operaterList.length<=0){
        $scope.operaterList = erporderResult.operatorList
      }
			$scope.totalPageNum = Math.ceil($scope.erpordTnum/($scope.pageSize * 1));
			console.log($scope.erporderList)
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
                if($scope.operaterList.length<=0){
                  $scope.operaterList = erporderResult.operatorList
                }
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


	app.controller('dispute-order-contollor',['$scope','$http','erp','$location','$routeParams','$compile','$timeout',function ($scope,$http,erp,$location,$routeParams,$compile,$timeout) {
    $scope.currtpage = 1;
		$scope.erpordersList = '';//存储所有的订单
		$scope.erpordTnum = 0;//存储订单的条数
		$scope.pageSize = '20';
		$scope.pageNum = '1';
		$scope.totalPageNum = 0;
		$scope.getListUrl = 'app/dispute/getDisputeList';
    $scope.orderType = '2'
    $scope.salesman = ""
    $scope.orderId = ""
    $scope.CUSTOMERNAME = ""
    $scope.storeType=""

    $scope.operaterList = []
    $scope.operator=""

    

		$scope.$on('repeatFinishCallback',function(){
			// alert(6666666666)
		    $('#c-zi-ord .edit-inp').attr('disabled','true');
		    $('#c-zi-ord .bj-spsku').attr('disabled','true');
		});

		$("#c-data-time").val('' );   //关键语句

		

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

		clickAndMouse();
    getOrderList($scope,erp);
  }]);

})(angular)
