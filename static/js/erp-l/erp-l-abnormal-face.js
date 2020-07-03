(function() {
    var app = angular.module("erp-l");
    //问题接口
    app.controller("abnormalfaceCtrl", [
      "$scope",
      "erp",
      "$routeParams",
      "utils",
      "$location",
      "$filter",
      function($scope, erp, $routeParams, utils, $location, $filter) {
        console.log("abnormalfaceCtrl");
        

        //按条件搜索
		function seltjFun (data) {
			var optionSel = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());
			data.beginDate = $('#c-data-time').val();
			data.endDate = $('#cdatatime2').val();
			data.status = '10';
			switch (optionSel) {
				case '母订单号':
					data.id = inpVal;
					data.merchantname = '';
					data.accountname = '';
					break;
				// case '客户':
				// 	data.id = '';
				// 	data.merchantname = inpVal;
				// 	data.accountname = '';
				// 	break;
				// case '业务员':
				// 	data.id = '';
				// 	data.merchantname = '';
				// 	data.accountname = ''; //inpVal;
				// 	data.ownerName = inpVal;
				// 	break;
				default:
					break;
			}
		}
        //按下搜索键搜索
        $scope.searchFun = function () {
			erp.load();
			var optionSel = $('.c-seach-country').val();//获取选择框的值
			var inpVal = $.trim($('.tj-search').val());//获取输入框的值
			// alert(optionSel)
			var erpData = {};
			erpData.status = '10';
			erpData.page = 1;
			erpData.limit = $('#page-sel').val()-0;
			erpData.beginDate = $('#c-data-time').val();
			erpData.endDate = $('#cdatatime2').val();

			var mergeEprData = function (json) {
				return Object.assign(erpData, {
					id: '',
					merchantname: '',
					accountname: '',
					ownerName: '',
				}, json);
			};

			switch (optionSel) {
				case '运单号':
					erpData = mergeEprData({ id: inpVal });
					break;
				// case '客户':
				// 	erpData = mergeEprData({ merchantname: inpVal });
				// 	break;
				// case '业务员':
				// 	erpData = mergeEprData({ accountname: inpVal });
				// 	break;
				// case '群主':
				// 	erpData = mergeEprData({ ownerName: inpVal });
				// 	break;
				default:
					erpData = mergeEprData();
					break;
			}
			console.log(JSON.stringify(erpData))
			erp.postFun('app/order/queryERPShipmentsOrder',JSON.stringify(erpData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				console.log(data.data.orderList)
				var erporderResult = data.data;//存储订单的所有数据
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.countNumber;
				$scope.erporderList = erporderResult.orderList;
				console.log($scope.erporderList)
				// alert('xiangyingchengong')
				countMFun ($scope.erporderList);
				dealpage ()
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			})
        }
        //按下Enter键进行搜索（按条件搜索）
        $('.tj-search').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
        })
        
        //是否显示分页
        $scope.erpordTnum = 1


        //分页处理
        //处理分页
		function dealpage () {
			erp.load();
			var showList = $('#page-sel').val()-0;
			$('#c-mu-ord-table .c-mu-allchekbox').attr('src','static/image/order-img/multiple1.png')
			if($scope.erpordTnum<=0){
				layer.msg('未找到订单')
				layer.closeAll("loading")
				return;
			}
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum||1,//设置分页的总条目数
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
			    	// alert(333333333)
			        if(type=='init'){
			        	layer.closeAll("loading")
			        	// alert(444444444444)
			        	return;
			        }
			        erp.load();
			        // alert('分页')
			        var erpData = {};
			        erpData.status = '10';
			        erpData.page = n;
			        erpData.limit = showList;
			        //搜索条件参数的函数
			        seltjFun(erpData);
			        console.log(erpData)
			        console.log(JSON.stringify(erpData))
			        erp.postFun('app/order/queryERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			        	console.log(data)
			        	layer.closeAll("loading")
			        	console.log(data.data.orderList)
			        	var erporderResult = data.data;//存储订单的所有数据
			        	$scope.erpordTnum = erporderResult.countNumber;
			        	$scope.erporderList = erporderResult.orderList;
			        	if ($scope.erpordTnum<1) {
			        		layer.msg('未找到订单')
			        	}
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
			var showList = $(this).val()-0;

			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum||1,//设置分页的总条目数
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
			      	$('#c-mu-ord-table .c-mu-allchekbox').attr('src','static/image/order-img/multiple1.png')
			      	erp.load();
			      	// alert('选择框')
			        var erpData = {};
			        erpData.status = '10';
			        erpData.page = n;
			        erpData.limit = showList;
			        //搜索条件参数的函数
			        seltjFun(erpData);
			        console.log(erpData)
			        console.log(JSON.stringify(erpData))
			        erp.postFun('app/order/queryERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			        	console.log(data)
			        	layer.closeAll("loading")
			        	console.log(data.data.orderList)
			        	var erporderResult = data.data;//存储订单的所有数据
			        	$scope.erpordTnum = erporderResult.countNumber;
			        	$scope.erporderList = erporderResult.orderList;
			        	if ($scope.erpordTnum<1) {
			        		layer.msg('未找到订单')
			        	}
			        	countMFun ($scope.erporderList);
			        },function () {
			        	layer.closeAll("loading")
			        	layer.msg('订单获取列表失败')
			        })
			    }
			});

        })
        // gopageFun()
        // dealpage()
		//跳页的查询
		$scope.gopageFun = function () {
			var showList = $('#page-sel').val()-0;
			var pageNum = $('#inp-num').val()-0;
			// alert(pageNum)
			if (pageNum=='') {
				layer.closeAll("loading")
				layer.msg('The value of the input box cannot be empty!');
				return;
			}
			var countN = Math.ceil($scope.erpordTnum/showList);
			// alert(countN)
			if (pageNum>countN) {
				layer.closeAll("loading")
				layer.msg('Please input number less than page amount.');
				return;
			}
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum||1,//设置分页的总条目数
				pageSize: showList,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: pageNum,
				activeClass: 'active',
			    prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
			    next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
			    page: '<a href="javascript:void(0);">{{page}}<\/a>',
			    first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
			    last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
			    onPageChange: function (n,type) {
			      	$('#c-mu-ord-table .c-mu-allchekbox').attr('src','static/image/order-img/multiple1.png')
			      	erp.load();
			      	// alert('跳页')
			        var erpData = {};
			        erpData.status = '10';
			        erpData.page = n;
			        erpData.limit = showList;
			        //搜索条件参数的函数
			        seltjFun(erpData);
			        console.log(erpData)
			        console.log(JSON.stringify(erpData))
			        erp.postFun('app/order/queryERPShipmentsOrder',JSON.stringify(erpData),function (data) {
			        	console.log(data)
			        	layer.closeAll("loading")
			        	console.log(data.data.orderList)
			        	var erporderResult = data.data;//存储订单的所有数据
			        	$scope.erpordTnum = erporderResult.countNumber;
			        	$scope.erporderList = erporderResult.orderList;
			        	if ($scope.erpordTnum<1) {
			        		layer.msg('未找到订单')
			        	}
			        	countMFun ($scope.erporderList);
			        },function () {
			        	layer.closeAll("loading")
			        	layer.msg('订单获取列表失败')
			        })
			    }
			});
		}

		//上传追踪号
		var scId;
		$scope.hqidFun = function (item,ev) {
			if($(ev.target).hasClass('mu-sczzh')){
				scId = item.ID;
			}
			console.log(item)
			console.log(scId)
		}
		$scope.upLoadExcelFun = function (item) {
			// console.log(item)
			var file = $("#document2").val();
			var index = file.lastIndexOf(".");
			console.log(file)
			var ext = file.substring(index + 1, file.length);
			console.log(ext)
			if(ext != "xlsx" && ext != "xls") {
				layer.msg('请上传excel文件')
				return;
			}
			erp.load();
			var formData = new FormData($("#uploadimg2")[0]);
			console.log(formData)
			formData.append("shipmentsOrderId",scId);
			erp.upLoadImgPost('app/order/upExcelTrackingNumber',formData,function (data) {
				console.log(data)
				layer.closeAll("loading")
				if (data.data.result==true) {
					layer.msg('上传成功')
				} else {
					layer.msg(data.data.result)
				}
			},function (data) {
				console.log(data)
				layer.closeAll("loading")
			})
		}


		// 新增异常面单
		$scope.isAbnormal = false;
		//新增异常面单绑定变量
		$scope.trankingNum = '';
		$scope.shippingNum = '';
		$scope.shippingName = '';
		$scope.goodsName = '';
		$scope.countMoney = '';
		$scope.weightMoney = '';
		$scope.nameOfAddress = '';
		$scope.address1 = '';
		$scope.address2 = '';
		$scope.addressDetail = '';
		$scope.shippingFlow = '';
		$scope.shippingStatus = '';
		


		$scope.addAbnormal = function(){
			$scope.isAbnormal = true;
		}
		//新增异常面单确认
		$scope.AbnormalShippingConfirm = function(){
			//验证表单是否为空
			if($scope.trankingNum == '' || $scope.shippingNum=='' || $scope.shippingName=='' || $scope.goodsName=='' || 
				$scope.countMoney=='' || $scope.weightMoney=='' || $scope.nameOfAddress=='' || $scope.address1=='' || $scope.address2=='' || $scope.addressDetail==''
				|| $scope.shippingFlow=='' || $scope.shippingStatus=='' || $scope.isAbnormal==''){
					layer.msg('以上信息均不能为空')
			}else{
				$scope.isAbnormal = false;
				//向后台发送数据  清空表单数据
				
				$scope.trankingNum = '';
				$scope.shippingNum = '';
				$scope.shippingName = '';
				$scope.goodsName = '';
				$scope.countMoney = '';
				$scope.weightMoney = '';
				$scope.nameOfAddress = '';
				$scope.address1 = '';
				$scope.address2 = '';
				$scope.addressDetail = '';
				$scope.shippingFlow = '';
				$scope.shippingStatus = '';
			}

		}

		//新增异常面单取消
		$scope.Abnormalcancel = function(){
			$scope.trankingNum = '';
			$scope.shippingNum = '';
			$scope.shippingName = '';
			$scope.goodsName = '';
			$scope.countMoney = '';
			$scope.weightMoney = '';
			$scope.nameOfAddress = '';
			$scope.address1 = '';
			$scope.address2 = '';
			$scope.addressDetail = '';
			$scope.shippingFlow = '';
			$scope.shippingStatus = '';
			$scope.isAbnormal = false;
		}

		//countFun函数
		function countMFun (val) {
			var len = val.length;
			var count=0;
			for(var i = 0;i<len;i++){
				count+=val[i].ORDERMONEYReality;
			}
			$scope.countMoney = count.toFixed(2)
			console.log($scope.countMoney);
		}

		//获取列表
		function getList(){
			erp.load();
			var erpData = {};
			erpData.status = '10';
			erpData.page = n;
			erpData.limit = showList;
			//搜索条件参数的函数
			seltjFun(erpData);
			console.log(erpData)
			console.log(JSON.stringify(erpData))
			erp.postFun('app/order/queryERPShipmentsOrder',JSON.stringify(erpData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				console.log(data.data.orderList)
				var erporderResult = data.data;//存储订单的所有数据
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.countNumber;
				$scope.erporderList = erporderResult.orderList;
				console.log($scope.erporderList)
				// alert('xiangyingchengong')
				countMFun ($scope.erporderList);
				dealpage ()
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			})
		}

		// /*查看日志*/
		var that = this;
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
      }
    ]);
  })();