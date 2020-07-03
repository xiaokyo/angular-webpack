(function () {
	var app = angular.module('excel-all-app',['service']);
	app.controller('excel-all-ctroller',['$scope','erp',function ($scope,erp) {
		//给客户店铺订单  excel订单的导航按钮添加鼠标点击事件
		// $('.e-customer-ord').click(function () {
		// 	$('.e-customer-ord').css({
		// 		color: '#646464',
		// 		backgroundColor: '#d5d5d5'
		// 	})
		// 	$(this).css({
		// 		color : '#000',
		// 		backgroundColor: '#fff'
		// 	})
		// })
		//给导航添加点击事件
		// $('.order-view').eq(0).css({
		// 	color: '#000',
		// 	backgroundColor: '#fff'
		// })
		//控制显示隐藏
		// $('.toggle-delord-div').eq(0).show();
		// $('.order-view').click(function () {
		// 	$('.order-view').css({
		// 		color: '#646464',
		// 		backgroundColor: '#d5d5d5'
		// 	})
		// 	$(this).css({
		// 		color : '#000',
		// 		backgroundColor: '#fff'
		// 	})
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
		// 按订单筛选条件处理订单
		$('.e-select-ord').change(function () {
			var selectVal = $(this).val();
			// console.log(selectVal);
			switch (selectVal) {
				case '所有订单':
					$('.e-order-allnum').css('visibility','hidden');
					$('.print-ord-a').css('visibility','hidden');
					break;
				case '筛选可发货订单':
					$('.e-order-allnum').css('visibility','visible');
					$('.print-ord-a').css('visibility','visible');
					$('.e-order-allnum').html('110条订单');
					$('.print-ord-a').html('批量打印运单及发货');
					break;
				case '筛选可生成运单状态订单':
					$('.e-order-allnum').css('visibility','visible');
					$('.print-ord-a').css('visibility','visible');
					$('.e-order-allnum').html('100条订单');
					$('.print-ord-a').html('批量生成运单状态');
					break;
				case '筛选可上传运单状态订单':
					$('.e-order-allnum').css('visibility','visible');
					$('.print-ord-a').css('visibility','visible');
					$('.e-order-allnum').html('109条订单');
					$('.print-ord-a').html('批量上传运单状态');
					break;
				default:
					// statements_def
					break;
			}
		})
		// 分页
		$("#pages-fun").jqPaginator({
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
		// $('#all-time-data').dcalendarpicker({format:'yyyy-mm-dd'});
		// $('#e-ord-time').dcalendarpicker({format:'yyyy-mm-dd'});
		// 创建excel订单
		$('.upload-ord').click(function () {
			layer.open({
				type:1,
				content:'<div class="excelalert-wrap">'
    					+	'<div class="excel-mtop">'
    					+		'<div class="excel-mtl">'
    					+			'<p class="excel-mtp1">选择客户:</p>'
    					+			'<p class="excel-mtp2">Excel订单文件:</p>'
    					+		'</div>'
    					+		'<div class="excel-mtr">'
    					+			'<p class="search-cusname">'
                    	+				'<input placeholder="nike"></input>'
                    	+				'<a class="search-cus-btn" href="javascript:void(0)">搜索</a>'
                		+			'</p>'
    					+			'<select class="excel-mts">'
    					+				'<option>aaaaaaaaaaaa</option>'
    					+			'</select>'
    					+			'<p><a class="upload-btn" href="javascript:void(0)">上传</a></p>'
    					+		'</div>'
    					+	'</div>'
    					+	'<div class="excel-mbottom">'
    					+		'<div class="excel-mbl">'
    					+			'<p>总订单:</p>'
    					+			'<p>上传订单:</p>'
    					+			'<p>上传失败:</p>'
    					+			'<p class="excel-mblp">失败原因:</p>'
    					+		'</div>'
    					+		'<div class="excel-mbr">'
    					+			'<p>120</p>'
    					+			'<p>100</p>'
    					+			'<p>20</p>'
    					+			'<p class="excel-mblp">'
    					+				'<span>啊啊啊啊啊啊啊啊啊啊</span>'
    					+				'<a class="excel-download" href="javascript:void(0)">下载</a>'
    					+			'</p>'
    					+		'</div>'
    					+	'</div>'
    					+'</div>',
				area: ['554px', '489px'],
				closeBtn: 0,
				shadeClose: true,
				title:"Import Excel Orders",
				// skin:"invalid-orders",
				skin:"excel-layer",
				btn:['确定'],
				yes: function(index, layero){
				    //按钮【按钮一】的回调
				    layer.close(index);
				    layer.open({
			      		area:['472px','275px'],
			      		// time:1000,
			      		title:null,
			      		closeBtn:0,
			      		btn:['确定','取消'],
			      		// time:1000,
			      		shadeClose: true,
			      		skin:'excelsec-layer',
			      		content:'<p class="excel-conp excel-conimg"><img src="static/image/order-img/iconwarn.png"></p><p class="excel-conp">您还没有下载失败原因文件，关闭后将无法下载</p>',
			      		yes: function(index, layero){
			      		    //按钮【按钮一】的回调
			      		    return false //开启该代码可禁止点击该按钮关闭
			      		},
			      		btn2: function(index, layero){
			      		    //按钮【按钮二】的回调
			      		    layer.close(index);
			      		},
			      	})
				}
			});
		})
		//给订单总览添加选中非选中
		var eaoIndex = 0;
		$('#e-allo-table .eo-check-box').click(function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png')
				eaoIndex++;
				if (eaoIndex == $('#e-allo-table .eo-check-box').length) {
					$('#e-allo-table .e-check-all').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png')
				eaoIndex--;
				if (eaoIndex != $('#e-allo-table .eo-check-box').length) {
					$('#e-allo-table .e-check-all').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#e-allo-table .e-check-all').click(function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				eaoIndex = $('#e-allo-table .eo-check-box').length;
				$('#e-allo-table .eo-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				eaoIndex = 0;
				$('#e-allo-table .eo-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
		//给订单总览添加选中非选中
		var dealoIndex = 0;
		$('#e-deal-table .eo-check-box').click(function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png')
				dealoIndex++;
				if (dealoIndex == $('#e-deal-table .eo-check-box').length) {
					$('#e-deal-table .e-check-all').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png')
				dealoIndex--;
				if (dealoIndex != $('#e-deal-table .eo-check-box').length) {
					$('#e-deal-table .e-check-all').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#e-deal-table .e-check-all').click(function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				dealoIndex = $('#e-deal-table .eo-check-box').length;
				$('#e-deal-table .eo-check-box').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				dealoIndex = 0;
				$('#e-deal-table .eo-check-box').attr('src','static/image/order-img/multiple1.png');
			}
		})
		// $('#c-zi-ord').on('click','.c-checkall',function () {
		// 	if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
		// 		$(this).attr('src','static/image/order-img/multiple2.png');
		// 		cziIndex = $('#c-zi-ord .c-checkall').length;
		// 		$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple2.png');
		// 	} else {
		// 		$(this).attr('src','static/image/order-img/multiple1.png');
		// 		cziIndex = 0;
		// 		$('#c-zi-ord .c-checkall').attr('src','static/image/order-img/multiple1.png');
		// 	}
		// })
		// $('#e-allo-table').on('click','eo-check-box',function () {
		// 	alert(3)
		// 	if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
		// 		alert(1)
		// 		$(this).attr('src','static/image/order-img/multiple2.png')
		// 	} else {
		// 		alert(2)
		// 		$(this).attr('src','static/image/order-img/multiple1.png')
		// 	}
		// })
		$(function() {
		    $(document).ready(function() {
		        var aDate = GetDateStr(-7);
		        var enDate = GetDateStr(0);            
		        $("#c-data-time").val(aDate );   //关键语句
		        $("#cdatatime2").val(enDate );   //关键语句
		        showPCPicture(aDate,enDate);
		    });

		});

		function GetDateStr(AddDayCount) { 
		    var dd = new Date(); 
		    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天
		                                         //后的日期 
		    var y = dd.getFullYear(); 
		    var m = dd.getMonth()+1;//获取当前月份的日期 
		    var d = dd.getDate(); 
		    return y+"-"+m+"-"+d; 
		} 
	}])
})()