(function () {
	var app = angular.module('fuwu-sp',['service', 'utils']);
	function getList($scope,erp){
		var upJson = {};
		upJson.pageNo = $scope.pageNum;
		upJson.pageSize = $scope.pageSize;
		upJson.status = $scope.status;
		upJson.searchKey = $scope.searchVal;
		erp.postFun('erp/serveProduct/serveProductList',JSON.stringify(upJson),function(data){
			console.log(data)
			if (data.data.statusCode==200) {
				var result = data.data.result;
				$scope.totalNum = result.total
				$scope.listArr = result.rows;
				if($scope.status==0){
					for(let i = 0,len = $scope.listArr.length;i<len;i++){
						try {
							$scope.listArr[i].customerImage = JSON.parse($scope.listArr[i].customerImage)
						} catch (error) {
							console.log(error)
						}
					}
				}
				console.log($scope.listArr)
				if($scope.totalNum < 1){return}
				$(".pagegroup1").jqPaginator({
					totalCounts: $scope.totalNum||1,//设置分页的总条目数
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
				        getList($scope,erp)
				    }
				});
			} else {
				layer.msg(data.data.message)
			}
		},function(data){
			console.log(data)
		},{layer:true})
	}
	function getQsList($scope,erp,cb){
		var upJson = {};
		upJson.pageNo = $scope.pageNum;
		upJson.pageSize = $scope.pageSize;
		upJson.status = $scope.status;
		upJson.searchKey = $scope.searchVal;
		erp.postFun('erp/serveProduct/serveOrderList',JSON.stringify(upJson),function(data){
			console.log(data)
			if (data.data.statusCode==200) {
				var result = data.data.result;
				$scope.totalNum = result.total
				$scope.listArr = result.rows;
				console.log($scope.listArr)
				cb && cb();
				if($scope.totalNum < 1){return}
				$(".pagegroup1").jqPaginator({
					totalCounts: $scope.totalNum||1,//设置分页的总条目数
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
				        getList($scope,erp)
				    }
				});
			} else {
				layer.msg(data.data.message)
			}
		},function(data){
			console.log(data)
		},{layer:true})
	}
	app.controller('pendfuwuCtrl',['$scope','erp', 'utils',function($scope,erp, utils){
		console.log('待处理服务')
		utils.fixedTop({ el: '#table-header', offsetTop: 58 });
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.status = '0';
		
		getList($scope,erp)
		$('.search-inp').keyup(function(e){
			if(e.keyCode == 13){
				$scope.searchFun();
			}
		})
		$scope.searchFun = function(){
			$scope.pageNum = '1';
			getList($scope,erp)
		}
		$scope.chanPageSize = function(){
			$scope.pageNum = '1';
			getList($scope,erp)
		}
		$scope.gopageFun = function(){
			var pageCount = Math.ceil($scope.totalNum/($scope.pageSize-0))
			if(!$scope.pageNum||$scope.pageNum<1||pageCount<$scope.pageNum){
				layer.msg('当前页面不存在')
				return
			}
			getList($scope,erp)
		}

		$scope.jujueFun = function(item){
			$scope.jujueFlag = true;
			$scope.itemId = item.id;
			$scope.itemSku = item.dbSku;
		}
		$scope.conJuJueFun = function(){
			if(!$scope.jujueResVal){
				layer.msg('请填写拒绝原因')
				return
			}
			let upJson = {};
			upJson.id = $scope.itemId;
			upJson.reason = $scope.jujueResVal
			upJson.status = '80';
			erp.postFun('erp/serveProduct/addReason',JSON.stringify(upJson),function(data){
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode==200) {
					$scope.jujueFlag = false;
					$scope.jujueResVal = '';
					getList($scope,erp)
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}
		$scope.showMoreImg = function(imgs){
			$scope.moreImgFlag = true;
			$scope.imgsList = imgs;
		}
		// $scope.spDetail = function(item){
		// 	window.open('manage.html#/merchandise/show-detail/' + item.dbProductId + '/0/3/0/' + item.id + '/1/' + item.dbSku+'/'+item.createUserId, '_blank', '');
		// }merchandise/addSKU1///1
		$scope.spDetail = function(item){
			window.open('manage.html#/merchandise/addSKU1/' + '//1' + '/fw' + '/'+item.createUserId+'/'+item.id, '_blank', '');
		}
	}])
	app.controller('shenHeZhongCtrl',['$scope','erp', 'utils',function($scope,erp, utils){
		console.log('审核中')
		utils.fixedTop({ el: '#table-header', offsetTop: 58 });
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.status = '1';
		getList($scope,erp)
		$('.search-inp').keyup(function(e){
			if(e.keyCode == 13){
				$scope.searchFun();
			}
		})
		$scope.searchFun = function(){
			$scope.pageNum = '1';
			getList($scope,erp)
		}
		$scope.chanPageSize = function(){
			$scope.pageNum = '1';
			getList($scope,erp)
		}
		$scope.gopageFun = function(){
			var pageCount = Math.ceil($scope.totalNum/($scope.pageSize-0))
			if(!$scope.pageNum||$scope.pageNum<1||pageCount<$scope.pageNum){
				layer.msg('当前页面不存在')
				return
			}
			getList($scope,erp)
		}

		$scope.jujueFun = function(item){
			$scope.jujueFlag = true;
			$scope.itemId = item.id;
			$scope.itemSku = item.dbSku;
		}
		$scope.conJuJueFun = function(){
			if(!$scope.jujueResVal){
				layer.msg('请填写拒绝原因')
				return
			}
			let upJson = {};
			upJson.dbSku = $scope.itemSku;
			upJson.reason = $scope.jujueResVal
			upJson.id = $scope.itemId;
			upJson.status = '80';
			erp.postFun('erp/serveProduct/updateServeStatus',JSON.stringify(upJson),function(data){
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode==200) {
					$scope.jujueFlag = false;
					$scope.jujueResVal = '';
					getList($scope,erp)
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}
		$scope.spDetail = function(item){
			window.open('manage.html#/merchandise/show-detail/' + item.dbProductId + '/0/3/1/' + item.id + '/2/' + item.dbSku+'/'+item.createUserId, '_blank', '');
		}
	}])
	app.controller('shenHeJuJueCtrl',['$scope','erp', 'utils',function($scope,erp, utils){
		console.log('审核拒绝')
		utils.fixedTop({ el: '#table-header', offsetTop: 58 });
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.status = '80';
		getList($scope,erp)
		$('.search-inp').keyup(function(e){
			if(e.keyCode == 13){
				$scope.searchFun();
			}
		})
		$scope.searchFun = function(){
			$scope.pageNum = '1';
			getList($scope,erp)
		}
		$scope.chanPageSize = function(){
			$scope.pageNum = '1';
			getList($scope,erp)
		}
		$scope.gopageFun = function(){
			var pageCount = Math.ceil($scope.totalNum/($scope.pageSize-0))
			if(!$scope.pageNum||$scope.pageNum<1||pageCount<$scope.pageNum){
				layer.msg('当前页面不存在')
				return
			}
			getList($scope,erp)
		}

		$scope.jujueFun = function(item){
			$scope.jujueFlag = true;
			$scope.itemId = item.id;
		}
		$scope.conJuJueFun = function(){
			if(!$scope.jujueResVal){
				layer.msg('请填写拒绝原因')
				return
			}
			let upJson = {};
			upJson.id = $scope.itemId;
			upJson.reason = $scope.jujueResVal
			upJson.status = '80';
			erp.postFun('erp/serveProduct/moneyTypeList',JSON.stringify(upJson),function(data){
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode==200) {
					getList($scope,erp)
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}
	}])
	app.controller('shenHeChengGongCtrl',['$scope','erp', 'utils',function($scope,erp, utils){
		console.log('审核成功')
		utils.fixedTop({ el: '#table-header', offsetTop: 58 });
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.status = '2';
		getList($scope,erp)
		$('.search-inp').keyup(function(e){
			if(e.keyCode == 13){
				$scope.searchFun();
			}
		})
		$scope.searchFun = function(){
			$scope.pageNum = '1';
			getList($scope,erp)
		}
		$scope.chanPageSize = function(){
			$scope.pageNum = '1';
			getList($scope,erp)
		}
		$scope.gopageFun = function(){
			var pageCount = Math.ceil($scope.totalNum/($scope.pageSize-0))
			if(!$scope.pageNum||$scope.pageNum<1||pageCount<$scope.pageNum){
				layer.msg('当前页面不存在')
				return
			}
			getList($scope,erp)
		}
		$scope.editFun = function(item){
			erp.postFun('erp/serveProduct/getDaysByProductId',{'dbProductId':item.dbProductId},function(data){
				console.log(data)
				if(data.data.statusCode==200){
					$scope.mfzlDayList = data.data.result;
					$scope.editDaysFlag = true;
				}else{
					layer.msg(data.data.message)
				}
			},function(data){
				console.log(data)
			})
		}
		$scope.sureEditFun = function(item){
			erp.postFun('erp/serveProduct/updateDaysByProductId',$scope.mfzlDayList,function(data){
				console.log(data)
				layer.msg(data.data.message)
				if(data.data.statusCode==200){
					$scope.editDaysFlag = false;
				}
			},function(data){
				console.log(data)
			})
		}
		$scope.isNumFun = function(item,key,val){
			console.log(key,val)
			val = val.replace(/[^\d.]/g,'');
            val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
            item[key] = val;
		}
		// $scope.spDetail = function(item){
		// 	window.open('manage.html#/merchandise/show-detail/' + item.dbProductId + '/0/3/1/' + item.id + '/2/' + item.dbSku+'/'+item.createUserId, '_blank', '');
		// }
		$scope.spDetail = function(item){
			window.open('manage.html#/merchandise/edit-detail/' + item.dbProductId + '/1/3/1/'+item.createUserId, '_blank', '');
		}
	}])

	app.controller('qianShoudqxCtrl',['$scope','erp', 'utils',function($scope,erp, utils){
		console.log('待签收')
		utils.fixedTop({ el: '#table-header', offsetTop: 58 });
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.status = '1';
		getQsList($scope,erp)
		$('.search-inp').keyup(function(e){
			if(e.keyCode == 13){
				$scope.searchFun();
			}
		})
		$scope.searchFun = function(){
			$scope.pageNum = '1';
			getQsList($scope,erp)
		}
		$scope.chanPageSize = function(){
			$scope.pageNum = '1';
			getQsList($scope,erp)
		}
		$scope.gopageFun = function(){
			var pageCount = Math.ceil($scope.totalNum/($scope.pageSize-0))
			if(!$scope.pageNum||$scope.pageNum<1||pageCount<$scope.pageNum){
				layer.msg('当前页面不存在')
				return
			}
			getQsList($scope,erp)
		}
		var operateItem;
		$scope.qianshou = function (item) {
			console.log(item)
			operateItem = item;
			$scope.bianTiFlag = true;
			erp.postFun('procurement/order/qianShou', { 
				"search": item.batchNumber 
			}, function (data) {
				console.log(data)
				$scope.btList = data.data.data.serveOrderList[0].productStanList;
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		$scope.tongYiQsFun = function () {
			var qianshouData = [];
			$scope.btList.forEach(item => {
				qianshouData.push({
					dbProductId: operateItem.dbProductId, // 产品id
					serverOrderId: operateItem.id, // 运单id
					trackingNumber: operateItem.trackingNumber,  // 运单号
					batchNumber: operateItem.batchNumber, // 批次号
					stanId: item.id, // 变体id
					stanImg: item.img, // 变体图片
					stanSku: item.sku, // 变体sku
					actualNum: item.actualNum, // 实收数量
					customerId: operateItem.createUserId, // 客户id
					customerName: operateItem.createName, // 客户名称

				})
			})
			layer.load(2);
			erp.postFun('erp/serveProduct/updateServeOrderStan', {
				list: qianshouData
			}, function (data) {
				layer.closeAll('loading');
				console.log(data);
				if (data.data.statusCode == 200) {
					layer.msg('操作成功')
					$scope.bianTiFlag = false;
					$scope.isQianShouFlag = false;
					$scope.listArr = [];
					getQsList($scope,erp)
				} else {
					layer.msg('操作失败')
					$scope.isQianShouFlag = false;
				}
			})
		}
	}])
	app.controller('qianShouyqxCtrl',['$scope','erp', 'utils' ,'$timeout',function($scope,erp, utils,$timeout){
		console.log('已签收')
		utils.fixedTop({ el: '#table-header', offsetTop: 58 });
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.status = '2';
		getQsList($scope, erp, getServerLocStock)
		function getServerLocStock() {
			let ids = $scope.listArr.map(item => item.dbProductId);
			// console.log(ids);
			erp.postFun('storehouse/WarehousInfo/getServerLocStock', {ids}, res => {
				const {data, code} = res.data;
				console.log(data, code);
				if (code !== 200) return layer.msg('获取可使用库存失败');
				$scope.listArr.map(item => {
					// if (Object.keys(data.data).includes(item.dbProductId)) {
					// 	item.usableStock = data.data[item.dbProductId]
					// }
					item.usableStock = data[item.dbProductId];
				})
				console.log($scope.listArr);
			})
		}
		$('.search-inp').keyup(function(e){
			if(e.keyCode == 13){
				$scope.searchFun();
			}
		})
		$scope.searchFun = function(){
			$scope.pageNum = '1';
			getQsList($scope, erp, getServerLocStock)
		}
		$scope.chanPageSize = function(){
			$scope.pageNum = '1';
			getQsList($scope, erp, getServerLocStock)
		}
		$scope.gopageFun = function(){
			var pageCount = Math.ceil($scope.totalNum/($scope.pageSize-0))
			if(!$scope.pageNum||$scope.pageNum<1||pageCount<$scope.pageNum){
				layer.msg('当前页面不存在')
				return
			}
			getQsList($scope, erp, getServerLocStock)
		}
		$scope.bianTiFun = function(item){
			$scope.itemInfo = item;
			$scope.bianTiFlag = true;
			erp.postFun('erp/serveProduct/getDbServeOrderStanMoney',{"dbServeOrderId":item.id},function(data){
				$scope.btList = data.data.result;
				// console.log($scope.btList);
				getBianTiStock();
			},function(data){
				console.log(data)
			},{layer:true})
		}
		// 获取变体库存接口
		function getBianTiStock() {
			let ids = $scope.btList.map(item => item.stan_id);
			// console.log(ids);
			erp.postFun('storehouse/WarehousInfo/getServerStanStock', {ids}, res => {
				// console.log(res);
				const {data, code} = res.data;
				console.log(data, code);
				if (code !== 200) return layer.msg('获取变体可使用库存失败');
				$scope.btList.map(item => {
					item.usableStock = data[item.stan_id];
				})
			})
		}
		$scope.fenPeiKuCun = () => {
			erp.postFun('storehouseOutgoingWarehousing/deduction/serverOrder',{
				orderIdList: [$scope.itemInfo.id.toString()],
				storageId: $scope.itemInfo.storagedoId
			}, res => {
				console.log(res);
				const {data, code} = res.data;
				if (code !== 200) return layer.msg('操作失败');
				layer.msg('操作成功');
			},function(data){
				console.log(data)
			},{layer:true})
		}
	}])
	app.controller('qianShouyjjCtrl',['$scope','erp', 'utils',function($scope,erp, utils){
		console.log('已拒签')
		utils.fixedTop({ el: '#table-header', offsetTop: 58 });
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.status = '3';
		getQsList($scope,erp)
		$('.search-inp').keyup(function(e){
			if(e.keyCode == 13){
				$scope.searchFun();
			}
		})
		$scope.searchFun = function(){
			$scope.pageNum = '1';
			getQsList($scope,erp)
		}
		$scope.chanPageSize = function(){
			$scope.pageNum = '1';
			getQsList($scope,erp)
		}
		$scope.gopageFun = function(){
			var pageCount = Math.ceil($scope.totalNum/($scope.pageSize-0))
			if(!$scope.pageNum||$scope.pageNum<1||pageCount<$scope.pageNum){
				layer.msg('当前页面不存在')
				return
			}
			getQsList($scope,erp)
		}

		$scope.jujueFun = function(item){
			$scope.jujueFlag = true;
			$scope.itemId = item.id;
		}
		$scope.conJuJueFun = function(){
			if(!$scope.jujueResVal){
				layer.msg('请填写拒绝原因')
				return
			}
			let upJson = {};
			upJson.id = $scope.itemId;
			upJson.reason = $scope.jujueResVal
			upJson.status = '80';
			erp.postFun('erp/serveProduct/moneyTypeList',JSON.stringify(upJson),function(data){
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode==200) {
					getQsList($scope,erp)
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}
		$scope.bianTiFun = function(item){
			$scope.bianTiFlag = true;
			erp.postFun('erp/serveProduct/getDbServeOrderStanMoney',{"dbServeOrderId":item.id},function(data){
				$scope.btList = data.data.result;
			},function(data){
				console.log(data)
			},{layer:true})
		}
		$scope.bianJiFlag = false;
		// $scope.bianJiFun = function(item){
		// 	if(!item.batchNumber){
		// 		layer.msg('该订单批次号不存在')
		// 		return
		// 	}
		// 	$scope.proList = [];
		// 	let upJson = {};
		// 	upJson.searchKey = item.batchNumber;
		// 	erp.postFun('erp/serveProduct/getServeOrder',upJson,function(data){
		// 		if(data.data.statusCode == 200){
		// 			$scope.bianJiFlag = true;
		// 			$scope.proList = data.data.result;
		// 		}else{
		// 			layer.msg(data.data.message)
		// 		}
		// 	},function(data){
		// 		console.log(data)
		// 	})
		// }
		$scope.bianJiFun = function(item){
			if(!item.batchNumber){
				layer.msg('该订单批次号不存在')
				return
			}
			$scope.proList = [];
			let upJson = {};
			upJson.batchNumber = item.batchNumber;
			erp.postFun('erp/serveProduct/productStanAndNum',upJson,function(data){
				console.log(data)
				if(data.data.statusCode == 200){
					$scope.bianJiFlag = true;
					$scope.proList = data.data.result;
				}else{
					layer.msg(data.data.message)
				}
			},function(data){
				console.log(data)
			})
		}
		$scope.baoCunEditFun = function(){
			let csArr = [];
			for(let i = 0,len = $scope.proList[0].productStanList.length;i<len;i++){
				let obj = {};
				obj.customerId = $scope.proList[0].createUserId;
				obj.customerName = $scope.proList[0].createName;
				obj.dbProductId = $scope.proList[0].dbProductId;
				obj.serverOrderId =  $scope.proList[0].id;
				obj.trackingNumber = $scope.proList[0].trackingNumber;
				obj.batchNumber = $scope.proList[0].batchNumber;
				obj.stanId = $scope.proList[0].productStanList[i].ID;
				obj.stanSku = $scope.proList[0].productStanList[i].SKU;
				obj.stanImg = $scope.proList[0].productStanList[i].IMG;
				obj.actualNum = $scope.proList[0].productStanList[i].actualNum;
				obj.damageNum = $scope.proList[0].productStanList[i].damageNum;
				obj.putNum = $scope.proList[0].productStanList[i].actualNum-$scope.proList[0].productStanList[i].damageNum;
				obj.id = $scope.proList[0].productStanList[i].orderStanId;
				csArr.push(obj)
			}
			erp.postFun('erp/serveProduct/updateStanAndNum',csArr,function(data){
				console.log(data)
				layer.msg(data.data.message)
				// if(data.data.statusCode==200){
				// 	$scope.bianJiFlag = false;
				// 	$scope.isQianShouFlag = false;
				// 	$scope.listArr = [];
				// 	getQsList($scope,erp)
				// }
			},function(data){
				console.log(data)
			},{layer:true})
			// console.log(ruKuCountFun($scope.proList))
			// erp.postFun('erp/serveProduct/updateCount',ruKuCountFun($scope.proList),function(data){
			// 	console.log(data)
			// 	layer.msg(data.data.message)
			// 	if (data.data.statusCode==200) {
			// 		$scope.bianJiFlag = false;
			// 	}
			// },function(data){
			// 	console.log(data)
			// },{layer:true})
		}
		$scope.isTongYiQsFun = function(){
			$scope.isQianShouFlag = true;
		}
		function ruKuCountFun(arr) {
			let len = arr.length;
			for(let i = 0;i < len;i++){
				if(!arr[i].actualNum){
				    arr[i].actualNum = 0;
				}
				if(!arr[i].damageNum){
				    arr[i].damageNum = 0;
				}
				arr[i].validNum = arr[i].actualNum - arr[i].damageNum;
			}
			return arr;
		}
		$scope.tongYiQsFun = function(){
			let csArr = [];
			for(let i = 0,len = $scope.proList[0].productStanList.length;i<len;i++){
				let obj = {};
				obj.customerId = $scope.proList[0].createUserId;
				obj.customerName = $scope.proList[0].createName;
				obj.dbProductId = $scope.proList[0].dbProductId;
				obj.serverOrderId =  $scope.proList[0].id;
				obj.trackingNumber = $scope.proList[0].trackingNumber;
				obj.batchNumber = $scope.proList[0].batchNumber;
				obj.stanId = $scope.proList[0].productStanList[i].ID;
				obj.stanSku = $scope.proList[0].productStanList[i].SKU;
				obj.stanImg = $scope.proList[0].productStanList[i].IMG;
				obj.actualNum = $scope.proList[0].productStanList[i].actualNum;
				obj.damageNum = $scope.proList[0].productStanList[i].damageNum;
				obj.putNum = $scope.proList[0].productStanList[i].actualNum-$scope.proList[0].productStanList[i].damageNum;
				obj.id = $scope.proList[0].productStanList[i].orderStanId;
				csArr.push(obj)
			}
			erp.postFun('erp/serveProduct/signforStanAndNum',csArr,function(data){
				console.log(data)
				layer.msg(data.data.message)
				if(data.data.statusCode==200){
					$scope.bianJiFlag = false;
					$scope.isQianShouFlag = false;
					$scope.listArr = [];
					getQsList($scope,erp)
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}
		$scope.closeFun = function(){
			$scope.bianJiFlag = false;
		}
		$scope.isNumFun = function(item,key,shiShouCount){
			console.log(item.damageNum , shiShouCount , item.damageNum > shiShouCount)
			item[key] = item[key].replace(/[^\d]/g,'')
			if((item.damageNum - 0) > (shiShouCount - 0)){
				layer.msg('损坏数量不能大于实收')
				item.damageNum = 0;
				return
			}
		}
		// var valArr = [];
		// $scope.isNumFun1 = function(item,key,shiShouCount){
		// 	console.log(item.damageNum , shiShouCount , item.damageNum > shiShouCount)
		// 	valArr.push(shiShouCount)
		// 	if((item.damageNum - 0) > (shiShouCount - 0)){
		// 		layer.msg('损坏数量不能大于实收')
		// 		return
		// 	}
		// 	item[key] = item[key].replace(/[^\d]/g,'')
		// }
	}])
	app.controller('qianShouqxCtrl',['$scope','erp', 'utils',function($scope,erp, utils){
		console.log('客户拒签')
		utils.fixedTop({ el: '#table-header', offsetTop: 58 });
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.status = '5';
		getQsList($scope,erp)
		$('.search-inp').keyup(function(e){
			if(e.keyCode == 13){
				$scope.searchFun();
			}
		})
		$scope.searchFun = function(){
			$scope.pageNum = '1';
			getQsList($scope,erp)
		}
		$scope.chanPageSize = function(){
			$scope.pageNum = '1';
			getQsList($scope,erp)
		}
		$scope.gopageFun = function(){
			var pageCount = Math.ceil($scope.totalNum/($scope.pageSize-0))
			if(!$scope.pageNum||$scope.pageNum<1||pageCount<$scope.pageNum){
				layer.msg('当前页面不存在')
				return
			}
			getQsList($scope,erp)
		}
		$scope.bianTiFun = function(item){
			$scope.bianTiFlag = true;
			erp.postFun('erp/serveProduct/getDbServeOrderStanMoney',{"dbServeOrderId":item.id},function(data){
				$scope.btList = data.data.result;
			},function(data){
				console.log(data)
			},{layer:true})
		}
		$scope.jujueFun = function(item){
			$scope.jujueFlag = true;
			$scope.itemId = item.id;
		}
		$scope.conJuJueFun = function(){
			if(!$scope.jujueResVal){
				layer.msg('请填写拒绝原因')
				return
			}
			let upJson = {};
			upJson.id = $scope.itemId;
			upJson.reason = $scope.jujueResVal
			upJson.status = '5';
			erp.postFun('erp/serveProduct/moneyTypeList',JSON.stringify(upJson),function(data){
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode==200) {
					getQsList($scope,erp)
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}

		$scope.bianJiFlag = false;
		$scope.bianJiFun = function(item){
			if(!item.batchNumber){
				layer.msg('该订单批次号不存在')
				return
			}
			$scope.proList = [];
			let upJson = {};
			upJson.batchNumber = item.batchNumber;
			erp.postFun('erp/serveProduct/productStanAndNum',upJson,function(data){
				console.log(data)
				if(data.data.statusCode == 200){
					$scope.bianJiFlag = true;
					$scope.proList = data.data.result;
				}else{
					layer.msg(data.data.message)
				}
			},function(data){
				console.log(data)
			})
		}
		$scope.baoCunEditFun = function(){
			let csArr = [];
			for(let i = 0,len = $scope.proList[0].productStanList.length;i<len;i++){
				let obj = {};
				obj.customerId = $scope.proList[0].createUserId;
				obj.customerName = $scope.proList[0].createName;
				obj.dbProductId = $scope.proList[0].dbProductId;
				obj.serverOrderId =  $scope.proList[0].id;
				obj.trackingNumber = $scope.proList[0].trackingNumber;
				obj.batchNumber = $scope.proList[0].batchNumber;
				obj.stanId = $scope.proList[0].productStanList[i].ID;
				obj.stanSku = $scope.proList[0].productStanList[i].SKU;
				obj.stanImg = $scope.proList[0].productStanList[i].IMG;
				obj.actualNum = $scope.proList[0].productStanList[i].actualNum;
				obj.damageNum = $scope.proList[0].productStanList[i].damageNum;
				obj.putNum = $scope.proList[0].productStanList[i].actualNum-$scope.proList[0].productStanList[i].damageNum;
				obj.id = $scope.proList[0].productStanList[i].orderStanId;
				csArr.push(obj)
			}
			erp.postFun('erp/serveProduct/updateStanAndNum',csArr,function(data){
				console.log(data)
				layer.msg(data.data.message)
			},function(data){
				console.log(data)
			},{layer:true})
		}
		$scope.isTongYiQsFun = function(){
			$scope.isQianShouFlag = true;
		}
		function ruKuCountFun(arr) {
			let len = arr.length;
			for(let i = 0;i < len;i++){
				if(!arr[i].actualNum){
				    arr[i].actualNum = 0;
				}
				if(!arr[i].damageNum){
				    arr[i].damageNum = 0;
				}
				arr[i].validNum = arr[i].actualNum - arr[i].damageNum;
			}
			return arr;
		}
		$scope.tongYiQsFun = function(){
			let csArr = [];
			for(let i = 0,len = $scope.proList[0].productStanList.length;i<len;i++){
				let obj = {};
				obj.customerId = $scope.proList[0].createUserId;
				obj.customerName = $scope.proList[0].createName;
				obj.dbProductId = $scope.proList[0].dbProductId;
				obj.serverOrderId =  $scope.proList[0].id;
				obj.trackingNumber = $scope.proList[0].trackingNumber;
				obj.batchNumber = $scope.proList[0].batchNumber;
				obj.stanId = $scope.proList[0].productStanList[i].ID;
				obj.stanSku = $scope.proList[0].productStanList[i].SKU;
				obj.stanImg = $scope.proList[0].productStanList[i].IMG;
				obj.actualNum = $scope.proList[0].productStanList[i].actualNum;
				obj.damageNum = $scope.proList[0].productStanList[i].damageNum;
				obj.putNum = $scope.proList[0].productStanList[i].actualNum-$scope.proList[0].productStanList[i].damageNum;
				obj.id = $scope.proList[0].productStanList[i].orderStanId;
				csArr.push(obj)
			}
			erp.postFun('erp/serveProduct/signforStanAndNum',csArr,function(data){
				console.log(data)
				layer.msg(data.data.message)
				if(data.data.statusCode==200){
					$scope.bianJiFlag = false;
					$scope.isQianShouFlag = false;
					$scope.listArr = [];
					getQsList($scope,erp)
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}
		$scope.closeFun = function(){
			$scope.bianJiFlag = false;
		}
		$scope.isNumFun = function(item,key,shiShouCount){
			console.log(item.damageNum , shiShouCount , item.damageNum > shiShouCount)
			item[key] = item[key].replace(/[^\d]/g,'')
			if((item.damageNum - 0) > (shiShouCount - 0)){
				layer.msg('损坏数量不能大于实收')
				item.damageNum = 0;
				return
			}
		}
	}])
})()