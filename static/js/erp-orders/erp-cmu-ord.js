(function () {

	var app = angular.module('custom-muord-app',['service']);
	//pod母订单
	app.controller('custom-podmuord-controller',['$scope','$http','erp','$routeParams',function ($scope,$http,erp,$routeParams) {
		var bs = new Base64();
		$scope.getIndividuation=function(id){
			var data={
				"id":id,
				"type":'0'
			};
			erp.load();
			erp.postFun('erp/individuation/getProperties',JSON.stringify(data),function(data){
				erp.closeLoad();
				console.log(data);
				var message = data.data.message;
				var success = data.data.data;
				if(message=='' || message==null || message==undefined){}else{
					var str = '<p style="padding: 5px 15px;word-break: break-all;max-height: 180px;overflow-y: auto">成功的数量为：'+success+' ，失败的订单号：'+message+'</p>';
					layer.open({
						type: 1,
						skin: 'layui-layer-rim', //加上边框
						area: ['420px', '240px'], //宽高
						content: str
					});
				}
				getListFun();
				if(data.data.code=='200'){
					//layer.msg('获取成功');


				}else{
					//layer.msg(data.data.message);
				}

			},function(){
				erp.closeLoad();
				layer.msg('网络错误')
			});
		};
		$scope.isSelJqcz='母订单号';
		var nowTime = new Date().getTime();
		var setTiem = localStorage.getItem('setMuCsTime')==undefined?'':localStorage.getItem('setMuCsTime');
		var getCsObj = localStorage.getItem('muCs')==undefined?'':JSON.parse(localStorage.getItem('muCs'));
		var loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')): '';
		console.log(loginName);
		var podOrdStu = $routeParams.stu||0;
		$scope.isAdminFlag = false;
		if (loginName=='admin'||loginName=='艾云斌'||loginName=='吴根玉'||loginName=='马欢欢') {
			$scope.isAdminFlag = true;
		}
		var isSetCsFlag = false;//是否携带参数
		if(nowTime-setTiem>1500){
			isSetCsFlag = false;
			console.log('时间超过1.5秒')
		}else{
			isSetCsFlag = true;
			$scope.isSelJqcz=getCsObj.tj;
			$("#c-data-time").val(getCsObj.btime);
			$("#cdatatime2").val(getCsObj.etime);
			$('.c-seach-country').val(getCsObj.tj);
			$('.c-seach-inp').val(getCsObj.val);
			console.log(nowTime-setTiem)
		}
		$scope.pageNum = 1;
		$scope.pageSize = '50';
		function getListFun(){
			erp.load();
			var erpData = {};
			seltjFun(erpData)
			erpData.page = $scope.pageNum;
			erpData.limit = $scope.pageSize;
			console.log(erpData)
			$scope.erporderList = [];//存储所有的订单
			$scope.erpordTnum = 0;//存储订单的条数
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
				// countMFun ($scope.erporderList);
				// alert('xiangyingchengong')
				dealpage ()
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
				// alert(2121)
			})
		}
		getListFun()
		$scope.changePageFun = function(){
			$scope.pageNum = 1;
			getListFun()
		}
		//按条件搜索
		function seltjFun (data) {
			var optionSel = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());
			data.beginDate = $('#c-data-time').val();
			data.endDate = $('#cdatatime2').val();
			data.pod = 'pod';
			if (podOrdStu=='0') {
				data.status = '2';
			} else if(podOrdStu=='1') {
				data.status = '10';
			} else if(podOrdStu=='2'){
				data.status = '5';
			}
			switch (optionSel) {
				case '母订单号':
					data.id = inpVal;
					data.merchantname = '';
					data.accountname = '';
					break;
				case '客户':
					data.id = '';
					data.merchantname = inpVal;
					data.accountname = '';
					break;
				case '业务员':
					data.id = '';
					data.merchantname = '';
					data.accountname = ''; //inpVal;
					data.ownerName = inpVal;
					break;
				default:
					break;
			}
		}

		function err (data) {
			console.log(data);
			layer.closeAll("loading")
			layer.msg('网络错误')
		}
		function countMFun (val) {
			var len = val.length;
			var count=0;
			for(var i = 0;i<len;i++){
				count+=val[i].ORDERMONEY;
			}
			$scope.countMoney = count.toFixed(2)
			console.log($scope.countMoney);
		}
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
				pageSize: $scope.pageSize-0,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.pageNum-0,
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
			        getListFun()
			    }
			});
		}
		//跳页的查询
		$scope.gopageFun = function () {
			if (!$scope.pageNum||$scope.pageNum<1) {
				layer.closeAll("loading")
				layer.msg('The value of the input box cannot be empty!');
				return;
			}
			var countN = Math.ceil($scope.erpordTnum/$scope.pageSize);
			// alert(countN)
			if ($scope.pageNum>countN) {
				layer.closeAll("loading")
				layer.msg('Please input number less than page amount.');
				return;
			}
			getListFun()
		}
		//按条件搜索
		$('.tj-search').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
		})

		$scope.searchFun = function () {
			$scope.pageNum = 1;
			getListFun()
		}
		//按时间搜索
		$scope.timeFun = function () {
			$scope.pageNum = 1;
			getListFun()
		}
		//弹框查看子订单
		$scope.viewziFlag = false;
		$scope.viewziFun = function (item) {
			erp.load();
			$scope.viewziFlag = true;
	        var erpData = {};
	        erpData.mostatus = 'erp';
	        erpData.ydh = 'all';
	        erpData.id = item.ID;
	        erpData.page = 1;
	        erpData.limit = 9999;
	        erpData.trackingnumberType = 'all';
	        console.log(erpData)
	        console.log(JSON.stringify(erpData))
	        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
	        	console.log(data)
	        	layer.closeAll("loading")
	        	console.log(data.data.productsList)
	        	var erporderResult = data.data;//存储订单的所有数据
				$scope.ziordtcList = erporderResult.ordersList;
				console.log($scope.ziordtcList)
	        },function () {
	        	layer.closeAll("loading")
	        	layer.msg('订单获取列表失败')
	        })
		}
		//关闭查看子订单的关闭按钮
		$scope.closeZi = function () {
			$scope.viewziFlag = false;
			$scope.ziordtcList = '';
			$scope.isDisputFlag = false;
		}
		$scope.disputFun = function (item) {
			erp.load();
			$scope.isDisputFlag = true;
			$scope.viewziFlag = true;
	        var erpData = {};
	        erpData.mostatus = 'erp';
	        erpData.ydh = 'all';
	        erpData.id = item.ID;
	        erpData.page = 1;
	        erpData.dispute = 'y';
	        erpData.disputeId = 'all';
	        erpData.limit = 9999;
	        erpData.trackingnumberType = 'all';
	        console.log(erpData)
	        console.log(JSON.stringify(erpData))
	        erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
	        	console.log(data)
	        	layer.closeAll("loading")
	        	console.log(data.data.productsList)
	        	var erporderResult = data.data;//存储订单的所有数据
				$scope.ziordtcList = erporderResult.ordersList;
				console.log($scope.ziordtcList)
	        },function () {
	        	layer.closeAll("loading")
	        	layer.msg('订单获取列表失败')
	        })
		}
		//提交到下一步
		$scope.submitNextFun=function(id){
			var data = {
				"shipId":id
			};
			layer.confirm('确认要提交到处理中吗？', {
				btn : [ '确定', '取消' ]//按钮
			}, function(index) {
				layer.close(index);
				console.log(data);
				erp.load();
				erp.postFun('erp/order/jiancedingdan',JSON.stringify(data),function(data){
					console.log(data);
					erp.closeLoad();
					if(data.data.result==1){
						layer.msg('移动成功');
						getListFun();
					}else{
						layer.msg('移动失败');
					}
				},function(){
					erp.closeLoad();
				});
			});
		};

		//补充到采购
		$scope.supplementFun=function(id){
			var data = {
				"shipId":id
			};
			layer.confirm('确认要补充采购吗？', {
				btn : [ '确定', '取消' ]//按钮
			}, function(index) {
				layer.close(index);
				console.log(data);
				erp.load();
				erp.postFun('processOrder/procurement/replenishProcurement',JSON.stringify(data),function(data){
					erp.closeLoad();
					if(data.data.code==200){
						layer.msg('补充成功');
						getListFun();
					}else{
						layer.msg('补充失败');
					}
				},function(){
					erp.closeLoad();
				});
			});
		};
		//未生成订单号的跳转
		$scope.wscydhFun = function (item) {
			var muId = item.ID;
			var muordstu = 1;
			// location.href = '#/erp-czi-ord/'+muId+'/'+muordstu;
			window.open('#/erp-czi-ord/'+muId+'/'+muordstu);
		}
		//已生成运单号的跳转
		$scope.yscydhFun = function (item) {
			var muId = item.ID;
			var muordstu = 3;
			// location.href = '#/erp-czi-ord/'+muId+'/'+muordstu;
			window.open('#/erp-czi-ord/'+muId+'/'+muordstu);
		}
		//待发货的跳转
		$scope.wfhlinkFun = function (item) {
			var muId = item.ID;
			// location.href = '#/zi-two/'+muId;
			window.open('#/zi-two/'+muId);
		}
		//已发货的跳转
		$scope.yfhlinkFun = function (item) {
			var muId = item.ID;
			// location.href = '#/zi-three/'+muId;
			window.open('#/zi-three/'+muId);
		}
		//已完成的跳转
		$scope.ywclinkFun = function (item) {
			var muId = item.ID;
			// location.href = '#/zi-two/'+muId;
			window.open('#/zi-four/'+muId);
		}
		//已结束的跳转
		$scope.yjslinkFun = function (item) {
			var muId = item.ID;
			// location.href = '#/zi-three/'+muId;
			window.open('#/zi-five/'+muId);
		}

		//移动订单状态
		$scope.ydOrdStuFlag = false;
		var bulkIds = '';
		$scope.ydOrdStuFun = function () {
			$scope.selCount = 0;
			bulkIds = '';
			$('#c-mu-ord-table .c-mu-chekbox').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					$scope.selCount++;
					bulkIds+=$(this).siblings('.mu-ord-time').text()+',';
				}
			})
			if ($scope.selCount>0) {
				$scope.ydOrdStuFlag = true;
			} else {
				$scope.ydOrdStuFlag = false;
				layer.msg('请选择订单')
			}
		}
		$scope.ydOrdStuSureFun = function () {
			erp.load();
			var upData = {};
			upData.ids = bulkIds;
			erp.postFun('app/order/processedflow',JSON.stringify(upData),function (data) {
				console.log(data)
				$scope.ydOrdStuFlag = false;
				layer.closeAll("loading")
				if (data.data.result>0) {
					layer.msg('处理订单成功')
					getListFun();
				} else {
					layer.msg('处理订单失败')
				}
			},err)
		}
		$scope.ydOrdStuQxFun = function () {
			$scope.ydOrdStuFlag = false;
		}
		//单个处理订单
		$scope.oneYdFlag =false;
		$scope.oneYdOrdFun = function (item) {
			$scope.oneId = item.ID;
			$scope.oneYdFlag =true;
		}
		$scope.oneYdSureFun = function () {
			erp.load();
			var upData = {};
			upData.ids = $scope.oneId;
			erp.postFun('app/order/processedflow',JSON.stringify(upData),function (data) {
				console.log(data)
				$scope.oneYdFlag = false;
				layer.closeAll("loading")
				if (data.data.result>0) {
					layer.msg('处理订单成功')
					getListFun();
				} else {
					layer.msg('处理订单失败')
				}
			},err)
		}
		$scope.oneYdQxFun = function () {
			$scope.oneYdFlag =false;
		}
		//修改母订单的价格
		$scope.changePriceFun = function (item,index) {
			$scope.changePriFlag = true;
			$scope.ordCountMoney = item.ORDERMONEY;
			console.log($scope.ordCountMoney)
			$scope.itemId = item.ID;
			$scope.itemIndex = index;
		}
		$scope.sureChangePriFun = function () {
			console.log($scope.itemIndex)
			console.log($scope.ordCountMoney)
			if(!$scope.ordCountMoney){
				layer.msg('请输入订单金额')
				return;
			}
			layer.load(2)
			$scope.changePriFlag = false;
			var chaData = {};
			chaData.muId = $scope.itemId;
			chaData.price = $scope.ordCountMoney;
			erp.postFun('app/order/updateOrderMoney',JSON.stringify(chaData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				if (data.data.statusCode==200) {
					$scope.erporderList[$scope.itemIndex].ORDERMONEY = $scope.ordCountMoney;
					$scope.ordCountMoney = '';
					layer.msg('修改成功')
				} else {
					layer.msg('修改失败')
				}
			},function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
		}
		//母订单的导出
		$scope.isdcflag = false;
		$scope.dcflag = false;
		$scope.dcMuOrd = function (item) {
			// var dcOrdNum = 0;
			// var dcMuOrdId = '';
			// $('#c-mu-ord-table .c-mu-chekbox').each(function () {
			// 	if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
			// 		dcOrdNum++;
			// 		dcMuOrdId = $(this).siblings('.mu-ord-time').text();
			// 	}
			// })
			// console.log(dcMuOrdId)
			// if(dcOrdNum>1){
			// 	layer.msg('每次只能导出一个母订单!');
			// 	return;
			// }else if (dcOrdNum<1){
			// 	layer.msg('请选择一条母订单.');
			// }else{
			// 	$scope.isdcflag = true;
			// }
			console.log(item)
			var dcMuOrdId = item.ID;
			$scope.isdcflag = true;
			$scope.sureUspsDc = function () {
				erp.load();
				var dcData = {};
				dcData.id = dcMuOrdId;
				dcData.type = 2;
				erp.postFun('app/order/exportErpMOrder',JSON.stringify(dcData),function (data) {
					console.log(data);
					layer.closeAll("loading")
					$scope.isdcflag = false;
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
					console.log(data);
				})
			}
			$scope.sureHbDc = function () {
				erp.load();
				var dcData = {};
				dcData.id = dcMuOrdId;
				dcData.type = 1;
				erp.postFun('app/order/exportErpMOrder',JSON.stringify(dcData),function (data) {
					console.log(data);
					layer.closeAll("loading")
					$scope.isdcflag = false;
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
					console.log(data);
				})
			}
			$scope.sureFsDc = function () {
				erp.load();
				var dcData = {};
				dcData.id = dcMuOrdId;
				dcData.type = 0;
				erp.postFun('app/order/exportErpMOrder',JSON.stringify(dcData),function (data) {
					console.log(data);
					layer.closeAll("loading")
					$scope.isdcflag = false;
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
					console.log(data);
				})
			}
			$scope.qxDc = function () {
				$scope.isdcflag = false;
			}
			//关闭生成的链接弹框
			$scope.closeatc = function () {
				$scope.dcflag = false;
			}
		}
		// $scope.bb = function (item) {
		// 	console.log(item)
		// }
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
		//留言功能
		$scope.nodeFlag = false;
		var domIndex;
		var noteId;
		$scope.nodeFun = function (item,index,ev) {
			$scope.nodeFlag = true;
			noteId = item.ID;
			domIndex = index;
			var hideNoteText = $('#c-mu-ord-table .hide-notep').eq(domIndex).text();
			$('.editmess-text').val(hideNoteText);
		}
		$scope.nodeCloseFun = function () {
			$scope.nodeFlag = false;
			$('.editmess-text').val('');
		}
		$scope.nodeSureFun = function () {
			var nodeText;
			nodeText = $.trim($('.editmess-text').val());
			console.log(nodeText+'---'+domIndex)
			if(!nodeText){
				layer.msg('请输入留言')
				return
			}
			erp.load()
			var ndData = {};
			ndData.id = noteId;
			ndData.note = nodeText;
			console.log(JSON.stringify(ndData))
			erp.postFun('app/order/upERPOrderNote',JSON.stringify(ndData),function (data) {
				console.log(data)
				erp.closeLoad()
				if (data.data.result>0) {
					layer.msg('修改成功')
					$scope.nodeFlag = false;
					$('#c-mu-ord-table .node-text').eq(domIndex).text(nodeText);
					$('#c-mu-ord-table .hide-notep').eq(domIndex).text(nodeText);
				} else {
					layer.msg('修改失败')
				}
			},function (data) {
				erp.closeLoad()
				console.log(data)
			})
			$('.editmess-text').val('');
		}
		//打单组的留言
		$scope.ddzNodeFun = function (item,index,ev) {
			$scope.ddznodeFlag = true;
			noteId = item.ID;
			domIndex = index;
			$scope.ddzMessVal = item.erpOrderNote;
			console.log($scope.ddzMessVal)
		}
		$scope.ddzNodeCloseFun = function () {
			$scope.ddznodeFlag = false;
		}
		$scope.ddzNodeSureFun = function () {
			console.log(!$scope.ddzMessVal)
			// if(!$scope.ddzMessVal){
			// 	layer.msg('请输入留言')
			// 	return
			// }
			var nodeText;
			$scope.ddznodeFlag = false;
			var ndData = {};
			ndData.id = noteId;
			ndData.note = $scope.ddzMessVal;
			console.log(JSON.stringify(ndData))
			erp.postFun('app/order/upERPOrderMNote',JSON.stringify(ndData),function (data) {
				console.log(data)
				if (data.data.result>0) {
					layer.msg('修改成功')
					$scope.erporderList[domIndex].erpOrderNote=$scope.ddzMessVal;
				} else {
					layer.msg('修改失败')
				}
			},function (data) {
				console.log(data)
			})
		}
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
		$('.orders-table').on('mouseenter','.erporder-detail',function () {
			$(this).next().show();
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
			$(this).addClass('erporder-detail-active');
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


		//给母订单里面的所有单个订单添加选中非选中状态
		var cmuIndex = 0;
		$('#c-mu-ord').on('click','.c-mu-chekbox',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cmuIndex++;
				if (cmuIndex == $('#c-mu-ord .c-mu-chekbox').length) {
					$('#c-mu-ord .c-mu-allchekbox').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cmuIndex--;
				if (cmuIndex != $('#c-mu-ord .c-mu-chekbox').length) {
					$('#c-mu-ord .c-mu-allchekbox').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#c-mu-ord').on('click','.c-mu-allchekbox',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cmuIndex = $('#c-mu-ord .c-mu-chekbox').length;
				$('#c-mu-ord .c-mu-chekbox').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cmuIndex = 0;
				$('#c-mu-ord .c-mu-chekbox').attr('src','static/image/order-img/multiple1.png');
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
			localStorage.setItem('muCs', csDataObj);
			localStorage.setItem('setMuCsTime',setCsTime);
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
		$('.ord-fun-a').eq(0).addClass('ord-active');
		$('.ord-fun-a').click(function () {
			// $('.toogle-ord-stu').hide();
			$('.ord-fun-a').removeClass('ord-active');
			$(this).addClass('ord-active');
			var thisIndex = $('.ord-fun-a').index(this)
			console.log(thisIndex)
			if(thisIndex==2){
				$('#fhzl-btn').show();
			}else {
				$('#fhzl-btn').hide();
			}
		})

		//留言的弹框
		$scope.messageflag = false;
		$scope.messageimgFun = function (item,$event) {
			// $event.stopPropagation();
			$scope.messageflag = true;
			$scope.messageCon = item.NOTE_ATTRIBUTES;
		}
		$scope.messcloseBtnFun = function () {
			$scope.messageflag = false;
			$scope.messageCon = '';
		}
		//鼠标划过事件
		$('#c-mu-ord-table').on('mouseenter','tr',function () {
			$('#c-mu-ord-table tr').removeClass('erporder-detail-active');
			$(this).addClass('erporder-detail-active');
		})
		$('#c-mu-ord-table').mouseleave(function () {
			$('#c-mu-ord-table tr').removeClass('erporder-detail-active');
		})
		//精确查找
		$('.muord-inp').keypress(function (e) {
			if(e.which==13){
				$scope.sureJqczFun();
			}
		})
		$scope.jqczFlag = false;
		$scope.jqczFun = function () {
			$scope.jqczFlag = true;
		}
		$scope.sureJqczFun = function () {
			console.log($scope.jqczSelCs)
			if ($scope.ordOrTnum==undefined||$scope.ordOrTnum=='') {
				layer.msg('请输入母订单号')
				return;
			}
			var csData = {};
			csData.type = 'm';
			csData.id = $scope.ordOrTnum;
			erp.postFun('app/order/getOrderLocation',JSON.stringify(csData),function (data) {
				console.log(data)
				$scope.jqczFlag = false;
				var resLocation = data.data.location;
				if (resLocation=='1') {
					$('.c-seach-country').val('母订单号');
					$('.c-seach-inp').val($scope.ordOrTnum);
					$('#c-data-time').val('');
					$('#cdatatime2').val('');
					$scope.searchFun();
					$scope.ordOrTnum = '';
				} else {
					//获取状态中传的参数
					var csDataObj = {};
					var setCsTime = new Date().getTime();
					csDataObj.tj = '母订单号';
					csDataObj.val = $scope.ordOrTnum;
					// csDataObj.btime = $('#c-data-time').val();
					// csDataObj.etime = $('#cdatatime2').val();
					console.log(csDataObj)
					csDataObj = JSON.stringify(csDataObj)
					localStorage.setItem('muCs', csDataObj);
					localStorage.setItem('setMuCsTime',setCsTime);
					$scope.ordOrTnum = '';
					if (resLocation=='2') {
						sessionStorage.setItem('clickAddr','1,0,0');
						$('.cebian-nav .cebian-content>span').eq(0).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/mu-fone';
					} else if(resLocation=='3'){
						sessionStorage.setItem('clickAddr','1,0,2');
						$('.cebian-nav .cebian-content>span').eq(2).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/mu-one';
					}else if(resLocation=='4'){
						sessionStorage.setItem('clickAddr','1,0,3');
						$('.cebian-nav .cebian-content>span').eq(3).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/mu-two';
					}else if(resLocation=='5'){
						sessionStorage.setItem('clickAddr','1,0,4');
						$('.cebian-nav .cebian-content>span').eq(4).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/mu-three';
					}else if(resLocation=='6'){
						sessionStorage.setItem('clickAddr','1,0,5');
						$('.cebian-nav .cebian-content>span').eq(5).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/mu-four';
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
			$scope.ordOrTnum = '';
		}

		// ------------------------------------------------------------------------ 18-12-19 add
		$scope.$result = [];
		$scope.downloadAct = false;
		$scope.batchDownload = function (ev) {
			var oInput = document.getElementById('input-upload-excel');
			oInput.click();
			oInput.onchange = inputHandle;
		};
		function inputHandle(e) {
			erp.load();
            var files = e.target.files;
            var fileReader = new FileReader();

            fileReader.readAsBinaryString(files[0]); // 以二进制方式打开文件
            fileReader.onload = readerHandle;
		}
		function readerHandle (ev) {
            try {
                var data = ev.target.result,
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    }), // 以二进制流方式读取得到整份excel表格对象
                    fileData = []; // 存储获取到的数据
            } catch (e) {
            	layer.msg('文件类型不正确');
                console.log('文件类型不正确');
                erp.closeLoad();
                return;
            }

            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    console.log(fromTo);
                    fileData = fileData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    break; // 如果只取第一张表，就取消注释这行
                }
            }

            // console.log(fileData);
            for (var x = 0, l = fileData.length; x < l; x++) {
            	try {
                	var imgArr = JSON.parse(fileData[x].Attachment);
            	} catch (e) {
            		layer.msg('文件类型不正确');
	                console.log(e);
	                erp.closeLoad();
	                return;
            	}
                var imgJson = {};
                var idx = 0;
                for (var x1 = 0, l1 = imgArr.length; x1 < l1; x1++)
                    imgJson[imgArr[x1].image] = 1; // 去重
                for (var key in imgJson) {
                    var suffix = key.match(/(\.\w+)$/ig);
                    $scope.$result.push({
                        // name: fileData[x].id + '-' + (++idx),
                        name: fileData[x].OrderNumber + '-' + (++idx),
                        url: key,
                        mime: suffix && suffix.length ? suffix[0] : ''
                    });
                }
            }
            console.log('result ->', $scope.$result);
	        $scope.$count = $scope.$result.length;
	        $scope.$now = 0;
            $scope.downloadAct = true;
            recursionDownload();
            erp.closeLoad();
            layer.msg('开始下载');
        }
        function recursionDownload () {
            downloadIMG($scope.$result[$scope.$now], function() {
                if ($scope.$now < $scope.$count) {
                	console.log(`第${$scope.$now + 1}张，共${$scope.$count}张`);
                	layer.msg(`第${$scope.$now + 1}张，共${$scope.$count}张`);
                    setTimeout(function() {
                    	recursionDownload();
                    	erp.closeLoad();
                    }, 50);
                    $scope.$now = $scope.$now + 1;
                } else {
            		$scope.downloadAct = false;
                    layer.msg('下载完成');
                }
            });
        }
        function downloadIMG(img, fn) {
            var x = new XMLHttpRequest();
            x.open("GET", img.url);
            x.responseType = "blob";
            x.onload = function (e) {
                download(e.target.response, img.name + img.mime, `image/${img.mime.replace('.', '')}`);
                fn && fn();
            };
            x.onerror = function (e) {
            	console.log(e);
            	layer.msg(e);
            };
            x.send();
        }
		// ------------------------------------------------------------------------
	}]);
})()