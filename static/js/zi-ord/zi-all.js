(function () {

	var app = angular.module('custom-ziall-app',['service']);
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
	app.controller('custom-ziall-controller',['$scope','$http','erp','$routeParams','$compile',function ($scope,$http,erp,$routeParams,$compile) {
		$scope.showStoreName = erp.showStoreName // 展示仓库
		$scope.isPurStockout = function(item){ return item.order.shortageIdentity == 1} // 是否是采购缺货
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
		$scope.handleGong = function(vid){
      erp.postFun('erp/account/getSupplieInfoByVid', JSON.stringify({vid:vid}), function (req) {
				if(req.status==200&&req.data.statusCode=="200"){
          const list = req.data.result
          $scope.supplierInfoList = list
          $scope.showSupplierInfo = true 
          return
        }
        layer.msg('请求失败')
			})
    } 
		$scope.$on('log-to-father',function (d,flag) {
			 if (d && flag) {
				 console.log(d,flag)
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
        	console.log(that.sparr,spArr)
        	e.stopPropagation()
        }
        $scope.openZZC = function(list,e,type,plist){
        	$scope.gxhProductFlag = true;
        	that.pro = list;
			that.type = type;
			that.plist = plist;
        	console.log(that.pro)
        	console.log($scope.gxhProductFlag)
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
		$scope.copyMdFun = function(){
		    var Url2=document.getElementById("pdf-link-json");
		    Url2.select(); // 选择对象
		    document.execCommand("Copy"); // 执行浏览器复制命令
		    console.log(Url2)
		    layer.msg("复制成功,有问题交给IT");
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
		var bs = new Base64();
		var muId = '';
		var erpLoginName = bs.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
		const job = localStorage.getItem('job') ? bs.decode(localStorage.getItem('job')) : '';
		var nowTime = new Date().getTime();
		var setTiem = localStorage.getItem('setCsTime')==undefined?'':localStorage.getItem('setCsTime');
		var getCsObj = localStorage.getItem('ziCs')==undefined?'':JSON.parse(localStorage.getItem('ziCs'));
		const cxclAdminShowFlagArr = ['admin', '金仙娟', '李贞', '李正月', '王波', '陈真', '邹丽容', '刘思梦', '刘依', '虞雅婷', '石晶', '赵炜', '余珍珍', '张俊佩', '赵珍珍', '叶璐云', '杨梦琴', '陆昌兰', '李铭辉', '张文靖', '王月', '金晓霞', '徐群群', '郑跃飞', '朱燕', '赵炜', '吴梦茹', '王青', '方丁丁', '杨艳芬', '洪颖锐', '盛超', '陈小琴', '打单1', '唐贵花', '周春' ]
		if (cxclAdminShowFlagArr.includes(erpLoginName) || ['打单'].includes(job)) {
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
			$scope.orderNumber = muId;
		}
		var piCiHao = $routeParams.pici||'';
		$scope.erpordTnum = 0;//存储订单的条数
		
		$scope.pageNum = 1;
		$scope.pageSize = "100";
		if(muId!=''||piCiHao!=''){
			$scope.orderNumber = muId;
			getList()
		}
		function PrintCode(url) {
			console.log(url)
			$.ajax({
				url: 'http://127.0.0.1:9999/marking?url=' + url,
				async: true,
				cache: false,
				dataType: 'text',
				error: function (xhr) {
					$scope.downLoadFlag = true;
					$scope.ydh = '';
					$scope.$apply()
					console.log($scope.downLoadFlag)
				},
				success: function (data) {
					$scope.ydh = '';
					$scope.$apply()
				}
			})
		}
		function getSheet(id) {
			console.log(id)
			erp.load();
			var ids = {};
			ids.ids = id;
			ids.type = '1';
			ids.loginName = erpLoginName;
			ids.uspsType = 0;
			console.log(JSON.stringify(ids))
			erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
				console.log(data)
				layer.closeAll("loading")
				var resMdArr = data.data;
				if (resMdArr.length>0) {
					PrintCode(resMdArr[0])
				} else if(resMdArr.length===0){
					erp.postFun3('getExpressSheet.json',JSON.stringify(ids),function (data) {//走美国库
						console.log(data)
						layer.closeAll("loading")
						var resMdArr = data.data;
						if (resMdArr.length>0) {
							PrintCode(resMdArr[0])
						}
					},function (data) {
						console.log(data)
						layer.closeAll("loading")
						layer.msg('网络错误')
					})
				}else {
					layer.msg('生成面单错误')
				}
			},function (data) {
				console.log(data)
				layer.closeAll("loading")
				layer.msg('网络错误')
			})
		}
		function getList(){
			erp.load();
			$('#c-zi-ord .c-checkall').attr("src","static/image/order-img/multiple1.png")
			var erpData = {};
      erpData.historyTracking = $scope.historyTracking;
			erpData.orderNumber = $scope.orderNumber;
			erpData.peiHuoPiCi = piCiHao;
			erpData.mostatus = 'all';
			erpData.disputeId = 'all';
			erpData.ydh = 'all';
			erpData.page = $scope.pageNum;
			erpData.limit = $scope.pageSize-0;
			erpData.cjOrderDateBegin = $('#c-data-time').val();
			erpData.cjOrderDateEnd = $('#cdatatime2').val();
			erpData.trackingnumberType = "all";
			seltjFun(erpData);
			if(piCiHao){
				erp.postFun("processOrder/pici/getColumnData", {id:piCiHao}, function (res) {
					layer.closeAll('loading');
					if(res.data.data){
						let ids = res.data.data[0].daDan;
						erpData.orderNumber = $scope.orderNumber || ids;
						
						erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
							console.log(data)
							layer.closeAll("loading")
							var erporderResult = data.data;//存储订单的所有数据
							$scope.erpordTnum = erporderResult.orderCount || 0;
							let ordList = erporderResult.ordersList;
							let idsArr = getIdsFun(ordList)
							erp.postFun('processOrder/queryOrder/getOrderStatus',{
								ids: idsArr
							},function(data){
								console.log(data)
								if(data.data.code==200){
									let list = data.data.data;
									for(let i =0,len = ordList.length;i<len;i++){
										for(let k = 0,kLen = list.length;k<kLen;k++){
											if(ordList[i].order.ID == list[k].id){
												ordList[i].order.STATUS = list[k].status;
												if(list[k].store){
													ordList[i].order.store = list[k].store;
												}
												if(list[k].trackingnumber){
													ordList[i].order.TRACKINGNUMBER = list[k].trackingnumber;
												}
												break
											}
										}
									}
									$scope.erporderList = erporderResult.ordersList;
									countMFun ($scope.erporderList);
								}else{
									$scope.erporderList = erporderResult.ordersList;
									countMFun ($scope.erporderList);
								}
							},function(data){
								$scope.erporderList = erporderResult.ordersList;
								countMFun ($scope.erporderList);
								console.log(data)
							},{layer:true})
							dealpage ()
						},function () {
							layer.closeAll("loading")
							layer.msg('订单获取列表失败')
						})
					}else{
						layer.msg('没有详情信息')
					}
				}, function (data) {
					console.log(data)
					layer.closeAll('loading')
				})
			}else{
				seltjFun(erpData);
				erp.postFun('app/order/getERPShipmentsOrder',JSON.stringify(erpData),function (data) {
					console.log(data)
					layer.closeAll("loading")
					var erporderResult = data.data;//存储订单的所有数据
					$scope.erpordTnum = erporderResult.orderCount || 0;
					let ordList = erporderResult.ordersList;
					if(ordList&&ordList.length == 1&&$scope.ydh&&$scope.printFlag){
						getSheet(ordList[0].order.ID)
					}
					let idsArr = getIdsFun(ordList)
					erp.postFun('processOrder/queryOrder/getOrderStatus',{
						ids: idsArr
					},function(data){
						console.log(data)
						if(data.data.code==200){
							let list = data.data.data;
							for(let i =0,len = ordList.length;i<len;i++){
								for(let k = 0,kLen = list.length;k<kLen;k++){
									if(ordList[i].order.ID == list[k].id){
										ordList[i].order.STATUS = list[k].status;
										if(list[k].store){
											ordList[i].order.store = list[k].store;
										}
										if(list[k].trackingnumber){
											ordList[i].order.TRACKINGNUMBER = list[k].trackingnumber;
										}
										break
									}
								}
							}
							$scope.erporderList = erporderResult.ordersList;
							countMFun ($scope.erporderList);
						}else{
							$scope.erporderList = erporderResult.ordersList;
							countMFun ($scope.erporderList);
						}
					},function(data){
						$scope.erporderList = erporderResult.ordersList;
						countMFun ($scope.erporderList);
						console.log(data)
					},{layer:true})
					dealpage ()
				},function () {
					layer.closeAll("loading")
					layer.msg('订单获取列表失败')
				})
			}
			
			
		}
		function getIdsFun(arr){
			if(!arr)return
			let len = arr.length;
			let ids = [];
			for(let i = 0;i<len;i++){
				ids.push(arr[i].order.ID)
			}
			return ids;
		}
		function countMFun (val) {
			if(!val)return
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
			if($scope.erpordTnum<1){
				layer.msg('未找到订单')
				layer.closeAll("loading")
				return;
			}
			// alert(44444444444)
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: $scope.pageSize - 0,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.pageNum - 0,
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
		$scope.pageChangeFun = function(){
			$scope.pageNum = 1;
			getList()
		}
		//跳页的查询
		$scope.gopageFun = function () {
			erp.load();
			// $scope.countMoney = 0;
			var showList = $scope.pageSize-0;
			var pageNum = $scope.pageNum;
			if (pageNum=='') {
				layer.closeAll("loading")
				layer.msg('跳转页数不能为空!');
				return;
			}
			var countN = Math.ceil($scope.erpordTnum/showList);
			if (pageNum>countN) {
				layer.closeAll("loading")
				layer.msg('选择的页数大于总页数.');
				return;
			}
			getList()
		}
		$scope.enterSerch = function(ev){
			if(ev.keyCode==13){
			  $scope.searchFun();
			}
		}

		// 显示采购员列表
		// 查看采购单操作日志
		$scope.purchaseOrderCallback = function(showPurchases){
			$scope.showPurchases = showPurchases
		}

		// 追踪号enter 搜索
		// $('#input-tracknumber').keypress(function(Event){
		//     if(Event.keyCode==13){
		//         $scope.searchFun();
		//     }
		// })
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
		$scope.toggleSeaFun = function(){
			$scope.moreSeaFlag = !$scope.moreSeaFlag;
			console.log($scope.moreSeaFlag)
		}
		$scope.clearBtnFun = function(){
			$scope.orderNumber = undefined;
			$scope.shopName = undefined;
			$scope.sku = undefined;
			$scope.cjProductName = undefined;
			$scope.consumerName = undefined;
			$scope.salesmanName = undefined;
			$scope.ownerName = undefined;
			$scope.shipmentsOrderId = undefined;
			$scope.customerName = undefined;
			$scope.split = undefined;
			$scope.orderobserver = undefined;
			$scope.CJTracknumber = undefined;
			$scope.ydh = undefined;
		}
		//按条件搜索
		function seltjFun (data) {
			data.mostatus = 'all';
			data.ydh = 'all';
			data.disputeId = 'all';
			data.trackingnumberType = "all";
			data.cjOrderDateBegin = $('#c-data-time').val();
			data.cjOrderDateEnd = $('#cdatatime2').val();
			var selVal = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());

			return AssembleSearchData(data, selVal, inpVal);
		}
		function AssembleSearchData(data, selVal, inpVal) {
			data.orderNumber = $scope.orderNumber;
			data.shopName = $scope.shopName;
			data.sku = $scope.sku;
			data.cjProductName = $scope.cjProductName;
			data.consumerName = $scope.consumerName;
			data.salesmanName = $scope.salesmanName;
			data.ownerName = $scope.ownerName;
			data.shipmentsOrderId = $scope.shipmentsOrderId;
			data.customerName = $scope.customerName;
			data.split = $scope.split;
			data.orderobserver = $scope.orderobserver;
			data.CJTracknumber = $scope.CJTracknumber;
			if ($scope.ydh) {
				// if($scope.ydh.indexOf(',')==-1){
				// 	var midStr = $scope.ydh;
				// 	var subResStr = midStr.substring(midStr.length-22);
				// 	if(subResStr.substring(0,1)=='9'){
				// 		$scope.ydh = subResStr;
				// 	}
				// }
				data.ydh = $scope.ydh;
			} else {
				data.ydh = 'all';
			}

			return data;
		}
		$scope.searchFun = function () {
			$scope.pageNum = 1;

			getList()
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
			$scope.pageNum = 1;
			getList()
		}
		//erp开始日期搜索
		$("#c-data-time").click(function (){
			var erpbeginTime=$("#c-data-time").val();
			var interval=setInterval(function (){
				var endtime2=$("#c-data-time").val();
				if(endtime2!=erpbeginTime){
					erp.load();
					clearInterval(interval);
					$scope.pageNum = 1;
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
					erp.load();
					clearInterval(interval);
					$scope.pageNum = 1;
					getList()
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
		//CJ客户留言的弹框
		$scope.messageflag = false;
		var mesOrdId;
		var mesIndex;
		$scope.messageimgFun = function (item,index) {
			// $event.stopPropagation();
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
						location.href = '#/erp-czi-ord';
					} else if(resLocation=='3'){
						location.href = '#/zi-three';
					}else if(resLocation=='4'){
						location.href = '#/zi-four';
					}else if(resLocation=='2'){
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

    //批量添加到拦截
    $scope.isaddLjzFlag = false;
    $scope.batchAddIntercept = function () {
      var cxclNum = 0;
      $('#c-zi-ord .cor-check-box').each(function () {
        if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
          cxclNum++;
        }
      })
      if (cxclNum<1) {
        layer.msg('请选择订单')
      } else {
        $scope.isaddLjzFlag = true;
      }
    }

		// 采购缺货sku状态
		$scope.orderStockoutHandleObj = {
			'0':'待退款',
			'1':'已退款',
			'2':'已拒绝'
		}

		// 缺货初始执行的回调
    $scope.initStockorderCallback = function(seeStockoutLog){ $scope.outOfStockHandleLog = seeStockoutLog }

		$scope.iscxclCloseFun = function () {
			$scope.cxclFlag = false;
		}
		$scope.iscxclSureFun = function () {
			erp.load();
			var cxclids = [];
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					cxclids.push($(this).siblings('.hide-order-id').text());
				}
			})
			var cxclData = {};
			cxclData.ids = cxclids.join(',');
			erp.getFun(`orderSyn/cjOrder/SynCjOrderByOrderIds?orderIds=${cxclData.ids}`,function (data) {})
			erp.postFun('processOrder/handleOrder/initERPOrder',JSON.stringify({ids:cxclids}),function (data) {})
			console.log(JSON.stringify(cxclData))
			erp.postFun('app/order/initERPOrder',JSON.stringify(cxclData),function (data) {
				console.log(data);
				$scope.cxclFlag = false;
				if(data.data.message&&(data.data.message!=null||data.data.message!='null')){
					$scope.cxclResFlag = true;
					$scope.initMessage = data.data.message;
				}
				if(data.data.result>0){
					$scope.pageNum = 1;
					getList()
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

		// 发票
		$scope.isHref = false
		$scope.goActexportOrder = function(item) {
			console.log(item)
            var orData = {};
			orData.trackNumber = item.TRACKINGNUMBER;
            layer.load(2);
            erp.getFun('https://logistics.cjdropshipping.com/lc/getDhlInvoice.json'+'?trackNumber='+item.TRACKINGNUMBER,function(data) {
                layer.closeAll('loading');
                console.log(data);
                if (data.data.code == 200) {
					$scope.isHref = true
					$scope.excelHref = data.data.invoiceUrl;
                } else {
                    layer.msg('失败')
                }
            },function(){})
        }

    $scope.cancelAddLjzFun = function () {
      $scope.isaddLjzFlag = false;
    }
//批量添加拦截       确定
    $scope.sureAddLjzFun = function () {
      erp.load();
      var cxclids = [];
      $('#c-zi-ord .cor-check-box').each(function () {
        if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
          cxclids.push($(this).siblings('.hide-order-id').text());
        }
      })
      var cxclData = {};
      cxclData.ids = cxclids.join(',');
	  console.log(JSON.stringify(cxclData))
	  erp.getFun(`orderSyn/cjOrder/SynCjOrderByOrderIds?orderIds=${cxclData.ids}`,function (data) {})
	  erp.postFun('processOrder/handleOrder/updateOrderProcessInterception', JSON.stringify(cxclData), function(data) {
		$scope.isaddLjzFlagOne = false;
		if(data.data.code=='200'&&data.data.data){
			layer.msg('拦截成功')
			$scope.pageNum = 1;
			getList()
		}else{
			layer.closeAll("loading")
			layer.msg('拦截失败')
		}
	  })
    //   erp.postFun('erp/faHuo/addIntercept',JSON.stringify(cxclData),function (data) {
    //     console.log(data);
    //     $scope.isaddLjzFlag = false;

    //     if(data.data.statusCode=='200'){
    //       layer.msg('添加拦截成功')
    //       $scope.pageNum = 1;
	// 	  getList()
    //     }else{
    //       layer.closeAll("loading")
    //       layer.msg('批量提交到拦截中失败')
    //     }
    //   },function (data) {
    //     layer.closeAll("loading")
    //     layer.msg('网络错误')
    //     console.log(data)
    //   })
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
			erp.getFun(`orderSyn/cjOrder/SynCjOrderByOrderIds?orderIds=${cxclData.ids}`,function (data) {})
			erp.postFun('processOrder/handleOrder/initERPOrder',JSON.stringify(cxclData),function (data) {})
			erp.postFun('app/order/initERPOrder',JSON.stringify(cxclData),function (data) {
				console.log(data);
				$scope.onecxclFlag = false;
				if(data.data.message&&(data.data.message!=null||data.data.message!='null')){
					$scope.cxclResFlag = true;
					$scope.initMessage = data.data.message;
				}
				if(data.data.result>0){
					$scope.pageNum = 1;
					getList()
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

		//单独添加到拦截
    $scope.isaddLjzFlagOne = false;
		var ordId ='';
    $scope.oneAddIntercept = function (item) {
      $scope.isaddLjzFlagOne = true;
      ordId = item.ID;
    }
    $scope.cancelAddLjzFunOne = function () {
      $scope.isaddLjzFlagOne = false;
    }
    $scope.sureAddLjzFunOne = function () {
      erp.load();
      var cxclData = {};
      cxclData.ids = ordId;
	  console.log(JSON.stringify(cxclData))
	  erp.getFun(`orderSyn/cjOrder/SynCjOrderByOrderIds?orderIds=${cxclData.ids}`,function (data) {})
	  erp.postFun('processOrder/handleOrder/updateOrderProcessInterception', JSON.stringify(cxclData), function(data) {
		$scope.isaddLjzFlagOne = false;
		if(data.data.code=='200'&&data.data.data){
			layer.msg('拦截成功')
			$scope.pageNum = 1;
			getList()
		}else{
			layer.closeAll("loading")
			layer.msg('拦截失败')
		}
	  })
    //   erp.postFun('erp/faHuo/addIntercept',JSON.stringify(cxclData),function (data) {
    //     console.log(data);
    //     $scope.isaddLjzFlagOne = false;

    //     if(data.data.statusCode=='200'){
	// 		layer.msg('添加拦截成功')
	// 		$scope.pageNum = 1;
	// 		getList()
    //     }else{
    //       layer.closeAll("loading")
    //       layer.msg('添加拦截失败')
    //     }
    //   },function (data) {
    //     layer.closeAll("loading")
    //     layer.msg('网络错误')
    //     console.log(data)
    //   })
    }


		//批量打印运单
		//询问是否打印面单弹窗
		$scope.isdymdFlag = false;
		$scope.isdymdFun = function () {
			$scope.isdymdFlag = true;
		}
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
		//关闭询问弹框
		$scope.isdymdCloseFun = function () {
			$scope.isdymdFlag = false;
		}
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
		$scope.mdtcFlag = false;
		$scope.buckdyydFun = function () {
			$scope.isdymdFlag = false;//关闭询问是否生成面单的弹框
			erp.load();
			var ids = {};
			var printIds = '';
			var numindex = 0;
			// ids.ids = [];
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					numindex++;
					printIds+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			if(numindex<1){
				layer.closeAll("loading")
				layer.msg('请选择订单')
				return;
			}
			// console.log(ids.ids)
			// console.log(ids)
			ids.ids = printIds;
			ids.type = '1';
			ids.loginName = erpLoginName;
			ids.uspsType = $scope.uspsType;
			console.log(JSON.stringify(ids))
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
		$scope.closeTcFun = function () {
			$scope.mdtcFlag = false;
		}
		//单个操作一条订单打印面单
		$scope.oneisdymdFlag = false;
		var onemdId = '';//存储一条订单的id
		$scope.oneisdymdFun = function (item) {
			onemdId = item.ID;
			$scope.oneisdymdFlag = true;
		}
		$scope.onedymdcloseFun = function () {
			$scope.oneisdymdFlag = false;
		}
		$scope.oneSureFun = function () {
			$scope.oneisdymdFlag = false;//关闭询问是否打印订单的提示框
			erp.load();
			var ids = {};
			ids.ids = onemdId;
			ids.type = '1';
			ids.loginName = erpLoginName;
			console.log(JSON.stringify(ids))
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
		//展示历史追踪号
		$scope.hisTraNumFun = function (item) {
			$scope.hisTrackNumFlag = true;
			var hisArr = item.TRACKINGNUMBERHISTORY.replace(item.TRACKINGNUMBER,'');
			hisArr = hisArr.split(',');
			$scope.hisArr = hisArr;
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
		
		//导出pod图包 文字
		let podMuOrdId,podSaleManName;
		$scope.isSameMuIdFun = function(stu){
			var addyfhCount = 0;
			addyfhIds = '';
			podMuOrdId = '';
			podSaleManName = '';
			let muOrdIdArr = [];
			let itemMuOrdId,itemZiOrdId;
			$('#c-zi-ord .cor-check-box').each(function(){
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					itemMuOrdId = $(this).siblings('.hide-muorder-id').text()
					muOrdIdArr.push(itemMuOrdId)
					itemZiOrdId = $(this).siblings('.hide-order-id').text();
					if(itemZiOrdId.indexOf('GX')!=-1){
						addyfhIds+= itemZiOrdId + ',';
						addyfhCount++;
					}
					podSaleManName = $(this).siblings('.saleman-name').text();
				}
			})
			console.log(addyfhIds)
			if (addyfhCount>0) {
				let muIdIsEqual = true;
				for(let i = 1,len = muOrdIdArr.length;i<len;i++){
					if(muOrdIdArr[i]!=muOrdIdArr[0]){
						muIdIsEqual = false;
						break
					}
				}
				if(muIdIsEqual){
					if(stu == 2){
						$scope.isDaoBaoFlag = true;
						podMuOrdId = muOrdIdArr[0];
					}else if(stu == 1){
						$scope.isDaoTextFlag = true;
					}
					$scope.podTextIds = addyfhIds.substring(0,addyfhIds.length-1);
				}else{
					layer.msg('请选择相同的母订单')
				}
			} else {
				$scope.isaddyfhFlag = false;
				layer.msg('请选择个性化订单')
			}
		}
		$scope.sureDaoChuFun = function(){
			console.log($scope.podTextIds)
			$scope.isDaoBaoFlag = false;
			window.open('https://erp1.cjdropshipping.com/erp/podProduct/exportPodOrderText?id='+$scope.podTextIds+'&cjId='+podMuOrdId+'&salesmanId='+podSaleManName)
		
		}
		$scope.copyPotIdsFun = function(){
			var hideInpVal = $('.pod-ziids');
            hideInpVal.select(); // 选中文本
            var isCopyFlag = document.execCommand("copy"); // 执行浏览器复制命令
            if (isCopyFlag) {
				layer.msg('复制成功')
				$scope.isDaoTextFlag = false;
            }
            console.log(hideInpVal)
		}

		//面单域名转换
        $scope.isCn = false;
        $scope.cnChangeFun = ()=>{
            $scope.pdfmdArr=$scope.pdfmdArr.map(item=>{
                if($scope.isCn){
                    item.printPdf = (item.printPdf).replace('miandan.cjdropshipping.cn', 'miandan.cjdropshipping.com');
                    layer.msg('国际域名转换成功');
                }else{
                    item.printPdf = (item.printPdf).replace('miandan.cjdropshipping.com', 'miandan.cjdropshipping.cn');
                    layer.msg('国内域名转换成功');
                }
                return item;
			})
            $scope.isCn = !$scope.isCn;
			console.log($scope.pdfmdArr)
		}
		
		//编辑弹框
		$scope.editFlag = false;
		$scope.editFun = function (item, $event, index) {
			$scope.itemIndex = index;
			$event.stopPropagation();
			$scope.editFlag = true;
			console.log(item)
			$scope.itemData = item;
			$scope.customerName = item.CUSTOMER_NAME=='null'?'':item.CUSTOMER_NAME;
			$scope.province = item.PROVINCE=='null'?'':item.PROVINCE;
			$scope.city = item.CITY=='null'?'':item.CITY;
			$scope.shipAddress1 = item.SHIPPING_ADDRESS=='null'?'':item.SHIPPING_ADDRESS;
			$scope.shipAddress2 = item.shippingAddress2=='null'?'':item.shippingAddress2;
			$scope.zip = item.ZIP=='null'?'':item.ZIP;
			$scope.phone = item.PHONE=='null'?'':item.PHONE;
			$scope.eMail = item.email=='null'?'':item.email;
		}
		//取消按钮
		$scope.closeFun = function () {
			$scope.editFlag = false;
		}
		//确定按钮
		$scope.confirmEditFun = function () {
			if(!$scope.customerName){
				layer.msg('请输入收件人')
				return
			}
			if(!$scope.shipAddress1){
				layer.msg('请输入地址1')
				return
			}
			if(!$scope.city){
				layer.msg('请输入城市')
				return
			}
			// if(!$scope.province){
			// 	layer.msg('请输入州')
			// 	return
			// }
			if(!$scope.zip){
				layer.msg('请输入邮编')
				return
			}
			// if(!$scope.phone){
			// 	layer.msg('请输入收件人电话')
			// 	return
			// }
			var pushData = {};
			pushData.id = $scope.itemData.ID;
			// pushData.salesman = $scope.itemData.salesman;
			pushData.customerName = $scope.customerName;
			// pushData.country = $scope.countryName || '';
			// pushData.countryCode = $scope.countryCode;
			pushData.province = $scope.province;
			pushData.city = $scope.city;
			pushData.shippingAddress = $scope.shipAddress1;
			pushData.shippingAddress2 = $scope.shipAddress2;
			pushData.zip = $scope.zip;
			pushData.phone = $scope.phone;
			pushData.email = $scope.eMail;
			erp.postFun('processOrder/queryOrder/editOrderAddress', JSON.stringify(pushData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.editFlag = false;
				if (data.data.code == 200) {
					layer.msg(data.data.data)
					$scope.searchFun()
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				layer.closeAll("loading")
				layer.msg('修改响应失败')
			},{layer:true})
		}
	}])
})()
