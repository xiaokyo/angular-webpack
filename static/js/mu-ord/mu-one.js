(function () {

	var app = angular.module('custom-muone-app',['service']);
	app.controller('custom-muone-controller',['$scope','$http','erp',function ($scope,$http,erp) {
		var that =this;
    $scope.isAnalysis=false;
    $scope.moreSeaFlag = false; // 高级筛选显示
    $scope.muOrderSn = ''; // 母订单号
    $scope.merchantname = ''; // 客户
    $scope.accountname = ''; // 业务员
    $scope.ownerName = ''; // 群主

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
			// {closeFlag: false}
			if (d && flag) {
				$scope.isAnalysis = false;
			}
		})
		$(window).scroll(function(){
		    var before = $(window).scrollTop();
		    if(before>60){
		       if($(window).width()>1140){
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
		function getListFun(){
			erp.load();
			var erpData = {};
			if(isSetCsFlag){
				seltjFun(erpData);
			}
			erpData.status = '3';
			$('#page-sel').val('100');
			erpData.page = 1;
			erpData.limit = $('#page-sel').val()-0;
			$scope.erpordTnum = erpData.limit;
			console.log(erpData)

			$scope.erporderList = '';//存储所有的订单
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
				countMFun ($scope.erporderList);
				dealpage ()
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
				// alert(2121)
			})
		}

		function GetDateStr(AddDayCount) {
		    var dd = new Date();
		    console.log(dd)
		    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
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
		// $scope.isSelJqcz='母订单号';
		var nowTime = new Date().getTime();
		var setTiem = localStorage.getItem('setMuCsTime')==undefined?'':localStorage.getItem('setMuCsTime');
    var getCsObj = localStorage.getItem('muCs')==undefined?'':JSON.parse(localStorage.getItem('muCs'));
    console.log("getCsObj",getCsObj)
		var isSetCsFlag = false;//是否携带参数
		var bs = new Base64();
		var loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')): '';
		console.log(loginName);
		$scope.isAdminFlag = false;
		if (loginName=='admin'||loginName=='艾云斌'||loginName=='吴根玉'||loginName=='马欢欢') {
			$scope.isAdminFlag = true;
		}
		if(nowTime-setTiem>1500){
			isSetCsFlag = false;
			console.log('时间超过1.5秒')
		}else{
			isSetCsFlag = true;
			// $scope.isSelJqcz=getCsObj.tj;
      $("#c-data-time").val(getCsObj.btime);
			$("#cdatatime2").val(getCsObj.etime);
			// $('.c-seach-country').val(getCsObj.tj);
			// $('.c-seach-inp').val(getCsObj.val);
			console.log(nowTime-setTiem)
		}

		erp.load();
		var erpData = {};
		if(isSetCsFlag){
			seltjFun(erpData);
		}
		erpData.status = '3';
		$('#page-sel').val('100');
		erpData.page = 1;
		erpData.limit = $('#page-sel').val()-0;
		erpData.beginDate = $('#c-data-time').val();
		erpData.endDate = $('#cdatatime2').val();
		$scope.erpordTnum = erpData.limit;
		console.log(erpData)

		$scope.erporderList = '';//存储所有的订单
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
			countMFun ($scope.erporderList);
			dealpage ()
		},function () {
			layer.closeAll("loading")
			layer.msg('订单获取列表失败')
			// alert(2121)
		})
		function countMFun (val) {
			var len = val.length;
			var count=0;
			for(var i = 0;i<len;i++){
				count+=val[i].ORDERMONEYReality;
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
			// alert(33333333)
			erp.load();
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
			    	// alert(333333333)
			        if(type=='init'){
			        	layer.closeAll("loading")
			        	// alert(444444444444)
			        	return;
			        }
			        erp.load();
			        // alert('分页')
			        var erpData = {};
			        erpData.status = '3';
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
			        erpData.status = '3';
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
			        	if($scope.erpordTnum<1){
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
			    onPageChange: function (n,type) {
			      	$('#c-mu-ord-table .c-mu-allchekbox').attr('src','static/image/order-img/multiple1.png')
			      	erp.load();
			      	// alert('跳页')
			        var erpData = {};
			        erpData.status = '3';
			        erpData.page = pageNum;
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
			        	if($scope.erpordTnum<1){
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
		//按条件搜索
		$('.tj-search').keypress(function(Event){
		    if(Event.keyCode==13){
		        $scope.searchFun();
		    }
		})
		//按条件搜索
		function seltjFun (data) {
      data.beginDate = $('#c-data-time').val();
			data.endDate = $('#cdatatime2').val();
      data.id = $scope.muOrderSn;
      data.merchantname = $scope.merchantname;
      data.accountname = $scope.accountname;
      data.ownerName = $scope.ownerName;
		}
		$scope.searchFun = function () {
			erp.load();
	
			var erpData = {};
			erpData.status = '3';
			erpData.page = 1;
			erpData.limit = $('#page-sel').val()-0;
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
				countMFun ($scope.erporderList);
				dealpage ()
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			})
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
			var dcMuOrdId = item.ID;
			$scope.isdcflag = true;
			function downLoadOrdFun(stu){
				let downLoadUrl = 'https://erp.cjdropshipping.com/app/order/exportOrder?id='+dcMuOrdId+'&type='+stu
				window.open(downLoadUrl)
				$scope.isdcflag = false;
			}
			$scope.sureUspsDc = function () {
				// erp.load();
				var dcData = {};
				dcData.id = dcMuOrdId;
				dcData.type = 2;
				downLoadOrdFun(2)
				// erp.postFun('app/order/exportErpMOrder',JSON.stringify(dcData),function (data) {
				// 	console.log(data);
				// 	layer.closeAll("loading")
				// 	$scope.isdcflag = false;
				// 	var href = data.data.href;
				// 	console.log(href)
				// 	layer.closeAll("loading")
				// 	if (href.indexOf('https')>=0) {
				// 		$scope.dcflag = true;
				// 		// window.open(href,'_blank')
				// 		$scope.hrefsrc = href;
				// 		console.log($scope.hrefsrc)
				// 	} else {
				// 		layer.msg('导出失败')
				// 	}
				// },function (data) {
				// 	layer.closeAll("loading")
				// 	console.log(data);
				// })
			}
			$scope.sureHbDc = function () {
				// erp.load();
				var dcData = {};
				dcData.id = dcMuOrdId;
				dcData.type = 1;
				downLoadOrdFun(1)
				// erp.postFun('app/order/exportErpMOrder',JSON.stringify(dcData),function (data) {
				// 	console.log(data);
				// 	layer.closeAll("loading")
				// 	$scope.isdcflag = false;
				// 	var href = data.data.href;
				// 	console.log(href)
				// 	layer.closeAll("loading")
				// 	if (href.indexOf('https')>=0) {
				// 		$scope.dcflag = true;
				// 		// window.open(href,'_blank')
				// 		$scope.hrefsrc = href;
				// 		console.log($scope.hrefsrc)
				// 	} else {
				// 		layer.msg('导出失败')
				// 	}
				// },function (data) {
				// 	layer.closeAll("loading")
				// 	console.log(data);
				// })
			}
			$scope.sureFsDc = function () {
				// erp.load();
				var dcData = {};
				dcData.id = dcMuOrdId;
				dcData.type = 0;
				downLoadOrdFun(0)
				// erp.postFun('app/order/exportErpMOrder',JSON.stringify(dcData),function (data) {
				// 	console.log(data);
				// 	layer.closeAll("loading")
				// 	$scope.isdcflag = false;
				// 	var href = data.data.href;
				// 	console.log(href)
				// 	layer.closeAll("loading")
				// 	if (href.indexOf('https')>=0) {
				// 		$scope.dcflag = true;
				// 		// window.open(href,'_blank')
				// 		$scope.hrefsrc = href;
				// 		console.log($scope.hrefsrc)
				// 	} else {
				// 		layer.msg('导出失败')
				// 	}
				// },function (data) {
				// 	layer.closeAll("loading")
				// 	console.log(data);
				// })
			}
			$scope.qxDc = function () {
				$scope.isdcflag = false;
			}
			//关闭生成的链接弹框
			$scope.closeatc = function () {
				$scope.dcflag = false;
			}
		}

		//按时间搜索
		$scope.timeFun = function () {
			// var biginTime = $('#c-data-time').val();
			// var endTime = $('#cdatatime2').val();
			// console.log(biginTime+'==='+endTime)
			erp.load();
			var erpData = {};
			erpData.status = '3';
			erpData.page = 1;
			erpData.limit = $('#page-sel').val()-0;
			//搜索条件参数的函数
			seltjFun(erpData);
			// erpData.beginDate = biginTime;
			// erpData.endDate = endTime;
			erp.postFun('app/order/queryERPShipmentsOrder',JSON.stringify(erpData),function (data) {
				console.log(data)
				layer.closeAll("loading")
				console.log(data.data.orderList)
				var erporderResult = data.data;//存储订单的所有数据
				// erporderResult = JSON.parse(data.data.orderList)
				$scope.erpordTnum = erporderResult.countNumber;
				$scope.erporderList = erporderResult.orderList;
				console.log($scope.erporderList)
				countMFun ($scope.erporderList);
				dealpage ()
			},function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
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
				console.log(data)
				erp.closeLoad()
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
			if(!$scope.ddzMessVal){
				layer.msg('请输入留言')
				return
			}
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
		//根据母订单精确查找对应的子订单
		// $scope.detailZiFun = function (item) {
		// 	var muId = bs.encode(item.ID);
		// 	// alert(id)
		// 	location.href = '#/erp-czi-ord/'+muId;
		// }
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

		//给查看子订单添加点击事件

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
			// csDataObj.tj = $('.c-seach-country').val();
			// csDataObj.val = $.trim($('.c-seach-inp').val());
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
				if (resLocation=='3') {
					$scope.muOrderSn = $scope.ordOrTnum;
					$('#c-data-time').val('');
					$('#cdatatime2').val('');
					$scope.searchFun();
					$scope.ordOrTnum = '';
				} else {
					//获取状态中传的参数
					var csDataObj = {};
					var setCsTime = new Date().getTime();
					// csDataObj.tj = '母订单号';
					// csDataObj.val = $scope.ordOrTnum;
					csDataObj.btime = $('#c-data-time').val();
					csDataObj.etime = $('#cdatatime2').val();
					console.log(csDataObj)
					csDataObj = JSON.stringify(csDataObj)
					localStorage.setItem('muCs', csDataObj);
					localStorage.setItem('setMuCsTime',setCsTime);
					$scope.ordOrTnum = '';
					if (resLocation=='2') {
						sessionStorage.setItem('clickAddr','1,0,1');
						$('.cebian-nav .cebian-content>span').eq(1).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/mu-fone';
					} else if(resLocation=='1'){
						sessionStorage.setItem('clickAddr','1,0,0');
						$('.cebian-nav .cebian-content>span').eq(0).addClass('act').siblings('.act').removeClass('act');
						location.href = '#/custom-ord';
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

		$scope.zdbzFun = function (item,index) {
			$scope.bzFlag = true;
			$scope.muOrdItemId = item.ID;
			$scope.muOrdIndex = index;
		}
		$scope.imgArr = [];
		$scope.upLoadImg4 = function (files) {
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
		$scope.packArr = [];
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
		    $scope.imgArr = [];
		    $scope.packArr = [];
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
			upJson.shipmentsOrderId = $scope.muOrdItemId;
			upJson.packKey = $scope.packArr;
			upJson.imgs = $scope.imgArr;
			erp.postFun('pojo/accountPack/weiDingDanTianJiaBaoZhuang',JSON.stringify(upJson),function (data) {
				console.log(data)
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode==200) {
					$scope.bzFlag = false;
					$scope.erporderList[$scope.muOrdIndex].isPack = '1';
					$scope.imgArr = [];
					$scope.packArr = [];
				}
			},function (data) {
				console.log(data)
				erp.closeLoad()
			})
    }
    
    $scope.toggleSeaFun = function(){
			$scope.moreSeaFlag = !$scope.moreSeaFlag;
		}
	}])
})()