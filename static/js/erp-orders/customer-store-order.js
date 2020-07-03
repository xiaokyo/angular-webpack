(function () {

	var app = angular.module('custom-order-app',['service']);
	app.controller('customer-controller',['$scope','$http','erp',function ($scope,$http,erp) {
		// var bs = new Base64();
		var erpData = {};
		erpData.userId = "{8DA0EC3E-E4A7-4D9B-8876-2A025515EBE0}";
		erpData.token = "6666";
		erpData.data = {};
		erpData.data.status = '1';
		erpData.data.page = 1;
		erpData.data.limit = 10;
		erpData.data = JSON.stringify(erpData.data);
		console.log(erpData)
		var erporderResult = '';//存储订单的所有数据
		$scope.erporderList = '';//存储所有的订单
		var erpordTnum = '';//存储订单的条数
		console.log(JSON.stringify(erpData))
		erp.postFun('app/order/queryShipmentsOrder',JSON.stringify(erpData),function (data) {
			console.log(data) 
			console.log(data.data.result)
			erporderResult = JSON.parse(data.data.result)
			erpordTnum = erporderResult.countNumber;
			$scope.erporderList = erporderResult.orderList;
			console.log($scope.erporderList)
			// alert('xiangyingchengong')
		},function () {
			layer.msg('订单获取列表失败')
			alert(2121)
		})
		// $http({  
		//     method:'post',  
		//     // url:'http://192.168.5.124:8080/erp_server/app/order/queryShipmentsOrder',  
		//     url:'app/order/queryShipmentsOrder',
		//     data:JSON.stringify(erpData)
		// }).success(function(orderData){ 
		// 	console.log(orderData) 
		// 	// console.log(orderData.result)
		// 	erporderResult = JSON.parse(orderData.result)
		// 	erpordTnum = erporderResult.countNumber;
		// 	$scope.erporderList = erporderResult.orderList;
		// 	console.log($scope.erporderList)
		// }) .error(function (err) {
		// 	layer.msg('订单获取列表失败')
		// })
		//获取国家的列表
		erp.getFun('app/account/countrylist',function (data) {
			// alert(1234)
			console.log(data)
			$scope.countryList = JSON.parse(data.data.result)
			console.log($scope.countryList)
		},function () {
			layer.msg('获取国家列表失败')
		})
		//给查看子订单按钮添加搜索
		// url:'http://192.168.5.124:8080/erp_server/app/order/queryOrders',shipmentsOrderNumber
		var zordList = {};
		zordList.userId = "{8DA0EC3E-E4A7-4D9B-8876-2A025515EBE0}";
		zordList.data = {};
		zordList.data.shipmentsOrderNumber = '';
		zordList.data.page = 0;
		zordList.data.limit = 10;
		zordList.data = JSON.stringify(zordList.data);
		console.log(zordList.data);
		$scope.zddordlist = '';//子订单的所有订单列表
		$scope.zddproductlist = '';//子订单中的所有商品列表
		//给查看子订单添加点击事件
		$('#c-mu-ord').on('click','.c-view-childord',function () {
			zordList.data.shipmentsOrderNumber=$(this).parent().siblings('.c-mu-onumtd').children('.c-muorder-id').text();
			// alert(zordList.data.shipmentsOrderNumber)
			// zordList.data = JSON.stringify(zordList.data);
			console.log(zordList.data)
			console.log(zordList)
			// alert(zordList.data.shipmentsOrderNumber)
			$http({
				method:'post',
				url:'app/order/queryOrders',
				data:JSON.stringify(zordList)
			}).success(function (data) {
				console.log(data.result)
				var zddlist = JSON.parse(data.result);
				$scope.zddordlist = zddlist.orderList;
				console.log($scope.zddordlist)
				$scope.zddproductlist = zddlist.productList;
				console.log($scope.zddproductlist) 
			}).error(function () {
				alert(2345)
			});
			// 子订单
			$('.toogle-ord-stu').hide();
			$('#c-zi-ord').show();
		})
		//给母订单里面的复选框添加选中事件
		// $('#c-mu-ord').on('click','.c-mu-allchekbox',function () {
		// 	if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
		// 		$(this).attr('src','static/image/order-img/multiple2.png');
		// 		$('#c-mu-ord .c-mu-chekbox').attr('src','static/image/order-img/multiple2.png');
		// 	} else {
		// 		$(this).attr('src','static/image/order-img/multiple1.png');
		// 		$('#c-mu-ord .c-mu-chekbox').attr('src','static/image/order-img/multiple1.png');
		// 	}
		// })
		//给母订单里面的所有单个订单添加选中非选中状态
		var cmuIndex = 0;
		$('#c-mu-ord').on('click','.c-mu-chekbox',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cmuIndex++;
				if (cmuIndex == $('#close-table .c-mu-chekbox').length) {
					$('#c-mu-ord .c-mu-chekbox').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cmuIndex--;
				if (cmuIndex != $('#c-mu-ord .c-mu-chekbox').length) {
					$('#c-mu-ord .c-mu-chekbox').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#c-mu-ord').on('click','.c-mu-allchekbox',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cmuIndex = $('#close-table .c-mu-chekbox').length;
				$('#c-mu-ord .c-mu-chekbox').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cmuIndex = 0;
				$('#c-mu-ord .c-mu-chekbox').attr('src','static/image/order-img/multiple1.png');
			}
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
		//给等待客户付款里面的订单添加选中非选中状态
		var cddfkIndex = 0;
		$('#wait-cus-money').on('click','.cor-check-box',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cddfkIndex++;
				if (cddfkIndex == $('#wait-cus-money .cor-check-box').length) {
					$('#wait-cus-money .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cddfkIndex--;
				if (cddfkIndex != $('#wait-cus-money .cor-check-box').length) {
					$('#wait-cus-money .c-checkall').attr('src','static/image/order-img/multiple1.png');
				}
			}
		});
		//全选
		$('#wait-cus-money').on('click','.c-checkall',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cddfkIndex = $('#wait-cus-money .cor-check-box').length;
				$('#wait-cus-money .cor-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cddfkIndex = 0;
				$('#wait-cus-money .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
		//给已取消订单 添加选中非选中
		var cyqxIndex = 0;
		$('#have-cancle-ord').on('click','.cor-check-box',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cyqxIndex++;
				if (cyqxIndex == $('#have-cancle-ord .cor-check-box').length) {
					$('#have-cancle-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cyqxIndex--;
				if (cyqxIndex != $('#have-cancle-ord .cor-check-box').length) {
					$('#have-cancle-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#have-cancle-ord').on('click','.c-checkall',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cyqxIndex = $('#have-cancle-ord .cor-check-box').length;
				$('#have-cancle-ord .cor-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cyqxIndex = 0;
				$('#have-cancle-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
		//给已退款订单 添加选中非选中
		var cytkIndex = 0;
		$('#have-refund-ord').on('click','.cor-check-box',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cyqxIndex++;
				if (cyqxIndex == $('#have-refund-ord .cor-check-box').length) {
					$('#have-refund-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cyqxIndex--;
				if (cyqxIndex != $('#have-refund-ord .cor-check-box').length) {
					$('#have-refund-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#have-refund-ord').on('click','.c-checkall',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cyqxIndex = $('#have-refund-ord .cor-check-box').length;
				$('#have-refund-ord .cor-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cyqxIndex = 0;
				$('#have-refund-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
		//等待我们发货
		var cdwmIndex = 0;
		$('#c-waius-shipment').on('click','.cor-check-box',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cdwmIndex++;
				if (cdwmIndex == $('#c-waius-shipment .cor-check-box').length) {
					$('#c-waius-shipment .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cdwmIndex--;
				if (cdwmIndex != $('#c-waius-shipment .cor-check-box').length) {
					$('#c-waius-shipment .c-checkall').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#c-waius-shipment').on('click','.c-checkall',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cdwmIndex = $('#c-waius-shipment .cor-check-box').length;
				$('#c-waius-shipment .cor-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cdwmIndex = 0;
				$('#c-waius-shipment .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
		//客户申请退款订单
		var csqtkIndex = 0;
		$('#cus-apply-refund').on('click','.cor-check-box',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				csqtkIndex++;
				if (csqtkIndex == $('#cus-apply-refund .cor-check-box').length) {
					$('#cus-apply-refund .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				csqtkIndex--;
				if (csqtkIndex != $('#cus-apply-refund .cor-check-box').length) {
					$('#cus-apply-refund .c-checkall').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#cus-apply-refund').on('click','.c-checkall',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				csqtkIndex = $('#cus-apply-refund .cor-check-box').length;
				$('#cus-apply-refund .cor-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				csqtkIndex = 0;
				$('#cus-apply-refund .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
		//已发货订单
		var cyfhIndex = 0;
		$('#have-shipments').on('click','.cor-check-box',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cyfhIndex++;
				if (cyfhIndex == $('#have-shipments .cor-check-box').length) {
					$('#have-shipments .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cyfhIndex--;
				if (cyfhIndex != $('#have-shipments .cor-check-box').length) {
					$('#have-shipments .c-checkall').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#have-shipments').on('click','.c-checkall',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cyfhIndex = $('#have-shipments .cor-check-box').length;
				$('#have-shipments .cor-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cyfhIndex = 0;
				$('#have-shipments .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
		//已完成订单
		var cywcIndex = 0;
		$('#have-finish-ord').on('click','.cor-check-box',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cywcIndex++;
				if (cywcIndex == $('#have-finish-ord .cor-check-box').length) {
					$('#have-finish-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cywcIndex--;
				if (cywcIndex != $('#have-finish-ord .cor-check-box').length) {
					$('#have-finish-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#have-finish-ord').on('click','.c-checkall',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cywcIndex = $('#have-finish-ord .cor-check-box').length;
				$('#have-finish-ord .cor-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cywcIndex = 0;
				$('#have-finish-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
		//已关闭订单
		var cygbIndex = 0;
		$('#have-close-ord').on('click','.cor-check-box',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cygbIndex++;
				if (cygbIndex == $('#have-cancle-ord .cor-check-box').length) {
					$('#have-close-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cygbIndex--;
				if (cygbIndex != $('#have-close-ord .cor-check-box').length) {
					$('#have-close-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#have-close-ord').on('click','.c-checkall',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cygbIndex = $('#have-close-ord .cor-check-box').length;
				$('#have-close-ord .cor-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cygbIndex = 0;
				$('#have-close-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
		// var cytkIndex = 0;
		// $('#have-cancle-table').on('click','.cor-check-box',function () {
		// 	if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
		// 		$(this).attr('src','static/image/order-img/multiple2.png');
		// 		cyqxIndex++;
		// 		if (cyqxIndex == $('#have-cancle-ord .cor-check-box').length) {
		// 			$('#have-cancle-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
		// 		}
		// 	} else {
		// 		$(this).attr('src','static/image/order-img/multiple1.png');
		// 		cyqxIndex--;
		// 		if (cyqxIndex != $('#have-cancle-ord .cor-check-box').length) {
		// 			$('#have-cancle-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
		// 		}
		// 	}
		// })
		// //全选
		// $('#have-cancle-ord').on('click','.c-checkall',function () {
		// 	if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
		// 		$(this).attr('src','static/image/order-img/multiple2.png');
		// 		cyqxIndex = $('#have-cancle-ord .cor-check-box').length;
		// 		$('#have-cancle-ord .cor-check-box').attr('src','static/image/order-img/multiple2.png');
		// 	} else {
		// 		$(this).attr('src','static/image/order-img/multiple1.png');
		// 		cyqxIndex = 0;
		// 		$('#have-cancle-ord .cor-check-box').attr('src','static/image/order-img/multiple1.png');
		// 	}
		// })
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
		})
		//设置导航的高度
		// $(function () {
		// 	$('.left-bar-nav').height() = $('.c-ord-mid').height(); 
		// })
		//先把所有的订单状态全部隐藏
		$('.toogle-ord-stu').hide();
		//让查看母订单显示
		$('#c-mu-ord').show();
		// $('#c-mu-a').css('color','#faa538');
		//给功能按钮里面的导航添加点击事件
		$('.ord-fun-a').click(function () {
			// $('.toogle-ord-stu').hide();
			$('.ord-fun-a').css('color','#000');
			$(this).css('color','#faa538');
		})
		// 母订单
		$('#c-mu-a').click(function () {
			$('.toogle-ord-stu').hide();
			$('#c-mu-ord').show();
		})
		// 子订单
		$('#c-zi-a').click(function () {
			$('.toogle-ord-stu').hide();
			$('#c-zi-ord').show();
		})
		//等待客户付款
		$('#wait-cus-money-a').click(function () {
			$('.toogle-ord-stu').hide();
			$('#wait-cus-money').show();
		})
		//已取消订单
		$('#have-cancle-ord-a').click(function () {
			$('.toogle-ord-stu').hide();
			$('#have-cancle-ord').show();
		})
		//已退款订单
		$('#have-refund-ord-a').click(function () {
			$('.toogle-ord-stu').hide();
			$('#have-refund-ord').show();
		})
		// 等待我们发货
		$('#c-waitus-a').click(function () {
			$('.toogle-ord-stu').hide();
			$('#c-waius-shipment').show();
		})
		//客户申请退款订单
		$('#cus-apply-refund-a').click(function () {
			$('.toogle-ord-stu').hide();
			$('#cus-apply-refund').show();
		})
		//已发货订单
		$('#have-shipments-a').click(function () {
			$('.toogle-ord-stu').hide();
			$('#have-shipments').show();
		})
		//已完成订单
		$('#have-finish-ord-a').click(function () {
			$('.toogle-ord-stu').hide();
			$('#have-finish-ord').show();
		})
		//已关闭订单
		$('#have-close-ord-a').click(function () {
			$('.toogle-ord-stu').hide();
			$('#have-close-ord').show();
		})


		// 按订单筛选条件处理订单
		$('.c-select-ord').change(function () {
			var selectVal = $(this).val();
			// console.log(selectVal);
			switch (selectVal) {
				case '所有订单':
					$('.c-order-allnum').css('visibility','hidden');
					$('.c-print-ord-a').css('visibility','hidden');
					break;
				case '筛选可发货订单':
					$('.c-order-allnum').css('visibility','visible');
					$('.c-print-ord-a').css('visibility','visible');
					$('.c-order-allnum').html('110条订单');
					$('.c-print-ord-a').html('批量打印运单及发货');
					break;
				case '筛选可生成运单状态订单':
					$('.c-order-allnum').css('visibility','visible');
					$('.c-print-ord-a').css('visibility','visible');
					$('.c-order-allnum').html('100条订单');
					$('.c-print-ord-a').html('批量生成运单状态');
					break;
				case '筛选可上传运单状态订单':
					$('.c-order-allnum').css('visibility','visible');
					$('.c-print-ord-a').css('visibility','visible');
					$('.c-order-allnum').html('109条订单');
					$('.c-print-ord-a').html('批量上传运单状态');
					break;
				default:
					// statements_def
					break;
			}
		})
		//处理分页
		$("#c-pages-fun").jqPaginator({
		    totalPages: 2,
		    visiblePages: 6,
		    currentPage: 1,
		    activeClass: 'active',
		    prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
		    next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
		    page: '<a href="javascript:void(0);">{{page}}<\/a>',
		    first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
		    last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
		    onPageChange: function (n) {
		        $("demo3-text").html("当前第" + n + "页");
		    }
		});
		// 日期插件 初始化日期
		$('#c-data-time').dcalendarpicker({format:'yyyy-mm-dd'});
		
	}])
})()