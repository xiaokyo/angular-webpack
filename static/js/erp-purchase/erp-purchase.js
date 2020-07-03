/**
 * 2019-12-7  复制老代码 进行修改 ----xiaoy
 */

(function () {
	var app = angular.module('purchase-app', []);

	//erp采购  初级采购
	app.controller('cujicaigouCtrl', ['$scope', "erp", function ($scope, erp) {
		console.log('初级采购')
		function err(a) {
			console.log(a);
			layer.closeAll('loading');
		};
		$scope.data = {
			dindanhao: '', buycount: '', comprice: '', youhuiprice: '', daohuoday: '', wuliufeiyong: '', jine: '', zhuizonghao: '', fahuoshuliang: '', cangku: '', liuyan: ''
		}
		$scope.dindan = false;
		$scope.storages = [];
		$scope.cangku = '';
		$scope.pageSize = '20';
		$scope.pageNum = '1';
		$scope.totalNum = 0;
		$scope.totalPageNum = 0;
		$scope.searchSku = '';
		//erp.postFun("app/storage/orderBuyList", {"data":"{'pageNum':'1','pageSize':'5'}"}, bb, err);

		$scope.messageFlag = false;
		var productId;
		var clickItem;
		$scope.aaa = function (item) {
			productId = item.PRODUCTId;
			$scope.messageArea = item.remark;
			clickItem = item;
			$scope.messageFlag = true;
			$scope.localRemark = item.LOCREMARK;
		}
		$scope.messageCloseFun = function () {
			$scope.messageFlag = false;
		}
		$scope.remarkShowFun = function (ev) {
			$(ev.target).children('.remark-con').show();
			console.log('show')
		}
		$scope.remarkHideFun = function (ev) {
			$(ev.target).children('.remark-con').show();
			console.log('hide')
		}

		$('.table-con-box').on('mouseenter', '.remark-box', function () {
			if ($.trim($(this).find('.cg-remark-text').text()) || $.trim($(this).find('.sp-remark-text').text())) {
				$(this).children('.remark-con').show();
			}
		})
		$('.table-con-box').on('mouseleave', '.remark-box', function () {
			$(this).children('.remark-con').hide();
		})
		$scope.messageSureFun = function () {
			var inputStr = $scope.messageArea;
			console.log(inputStr);
			console.log(productId);
			if (clickItem.remark != inputStr) {
				erp.postFun("pojo/procurement/setMessage", { "productId": productId, "inputStr": inputStr }, function (data) {
					if (JSON.parse(data.data.statusCode) == 200) getList(erp, $scope);
					$scope.messageFlag = false;
					layer.msg('备注成功')
				}, err);
				function err(data) {
					layer.msg("备注失败");
				}
			} else {
				console.log("未修改");
				$scope.messageFlag = false;
			}

		}

		//获取仓库
		erp.getFun('app/storage/getStorage', function (data) {
			console.log(data)
			var obj = JSON.parse(data.data.result);
			console.log(obj)
			$scope.ckArr = obj;
		}, function (data) {
			erp.closeLoad();
			console.log('仓库获取失败')
		})
		$scope.storageId = "{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}";
		// 获取列表
		function getList(erp, $scope) {
			erp.load();
			erp.postFun("caigou/procurement/caiGouLieBiao", {
				'pageNum': $scope.pageNum + '',
				'pageSize': $scope.pageSize + '',
				'storageId': $scope.storageId,
				'inputStr': $scope.searchSku
			}, function (n) {
				erp.closeLoad();
				console.log(n);
				if (n.data.statusCode != 200) {
					layer.msg('网络错误');
					return;
				}
				var obj = n.data.result;
				$scope.totalNum = obj.total;
				console.log($scope.totalNum)
				if (obj.total == 0) {
					$scope.totalpage = 0;
					$scope.customerList = [];
					layer.msg("没有找到数据");
					$scope.chudanliebiao = [];
					$scope.countMoney = 0;
					return;
				}
				for (var i = 0; i < obj.list.length; i++) {
					obj.list[i].checked = false;
				}
				$scope.chudanliebiao = obj.list;
				console.log($scope.chudanliebiao);
				$scope.totalPageNum = Math.ceil($scope.totalNum / ($scope.pagesize * 1));
				// countMFun ($scope.chudanliebiao)
				pageFun(erp, $scope);
			}, err);
		}
		$scope.daoChuFun = function () {
			$scope.isSureDcexcelFlag = true;
		}
		$scope.qxDcexcelFun = function () {
			$scope.isSureDcexcelFlag = false;
		}
		$scope.sureDcexcelFun = function () {
			var pids = '';
			var countNum = 0;
			for (var i = 0, len = $scope.chudanliebiao.length; i < len; i++) {
				if ($scope.chudanliebiao[i].checked) {
					countNum++;
					pids += $scope.chudanliebiao[i].PRODUCTId + ',';
				}
			}
			if (countNum < 1) {
				layer.msg('请选择商品')
				return
			}
			erp.load()
			console.log(pids)
			var dcJson = {};
			dcJson.pids = pids;
			dcJson.storageId = $scope.storageId;
			erp.postFun('caigou/procurement/daoChuExcel', JSON.stringify(dcJson), function (data) {
				console.log(data)
				erp.closeLoad()
				$scope.isSureDcexcelFlag = false;
				if (data.data.statusCode == 200) {
					$scope.spExcelArr = data.data.result;
					if (data.data.result && data.data.result.length > 0) {
						$scope.excelFlag = true;
					} else {
						layer.msg('没有excel链接')
					}
				} else {
					layer.msg('导出失败')
				}
			}, function (data) {
				erp.closeLoad()
				console.log(data)
			})
		}
		$scope.closeTcFun = function () {
			$scope.excelFlag = false;
		}
		$scope.checkAllFlag = false;
		$scope.checkAllFun = function () {
			console.log($scope.checkAllFlag)
			for (var i = 0, len = $scope.chudanliebiao.length; i < len; i++) {
				$scope.chudanliebiao[i].checked = $scope.checkAllFlag;
			}
		}
		$scope.checkFun = function (item, checked) {
			console.log(checked)
			if (checked) {
				var countNum = 0;
				for (var i = 0, len = $scope.chudanliebiao.length; i < len; i++) {
					if ($scope.chudanliebiao[i].checked) {
						countNum++;
					}
				}
				if (countNum == $scope.chudanliebiao.length) {
					$scope.checkAllFlag = true;
				}
				console.log(countNum)
			} else {
				$scope.checkAllFlag = false;
			}
		}
		function countMFun(val) {
			var len = val.length;
			var count = 0;
			for (var i = 0; i < len; i++) {
				count += val[i].costPrice * val[i].COUNT;
			}
			$scope.countMoney = count.toFixed(2)
			console.log($scope.countMoney);
		}
		//分页
		function pageFun(erp, $scope) {
			$("#pagination1").jqPaginator({
				totalCounts: $scope.totalNum,
				pageSize: $scope.pageSize * 1,
				visiblePages: 5,
				currentPage: $scope.pageNum * 1,
				activeClass: 'current',
				first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				onPageChange: function (n, type) {
					if (type == 'init') {
						return;
					};
					erp.load();
					$scope.pageNum = n;
					getList(erp, $scope)
				}
			});
		}
		getList(erp, $scope);
		$scope.changePageSize = function () {
			$scope.pageNum = '1';
			getList(erp, $scope);
		}
		$scope.toSpecifiedPage = function () {
			getList(erp, $scope);
		}
		$scope.selByStorageFun = function () {
			$scope.pageNum = '1';
			getList(erp, $scope);
		}
		//按sku进行搜索
		$('.sku-inp').keypress(function (Event) {
			if (Event.keyCode == 13) {
				$scope.skuSearchFun();
			}
		})
		$scope.skuSearchFun = function () {
			$scope.pageNum = '1';
			getList(erp, $scope);
		}
		$scope.cgDjChangeFun = function () {
			$scope.pageNum = '1';
			getList(erp, $scope);
		}
		erp.getFun('app/storage/getStorage', function (data) {
			console.log(data)
			var obj = JSON.parse(data.data.result);
			console.log(obj)
			$scope.ckArr = obj;
		}, function (data) {
			erp.closeLoad();
			console.log('仓库获取失败')
		})
		//查看供应商
		$scope.ckflag = false;
		$scope.ckFun = function (item) {
			$scope.ckflag = true;
			$scope.ckgysPid = item.PRODUCTId;
			console.log($scope.ckgysPid)
			$scope.gysList = JSON.parse(item.SUPLLIERLINK);
			console.log($scope.gysList)
		}
		$scope.addGysFun = function () {
			// {"name":"https://detail.1688.com",
			// "star":5,"$$hashKey":"object:1115"}
			var gysObj = {};
			gysObj.name = '';
			gysObj.star = 5;
			gysObj.flag = true;
			$scope.gysList.push(gysObj)
			console.log($scope.gysList)
		}
		$scope.bianjiGysFun = function () {
			for (var i = 0, len = $scope.gysList.length; i < len; i++) {
				$scope.gysList[i].flag = true;
			}
		}
		$scope.deletGysFun = function (index) {
			if ($scope.gysList.length == 1) {
				layer.msg('至少要保留一个供应商')
				return
			}
			$scope.gysList.splice(index, 1)
		}
		$scope.gyspxUpFun = function (index) {
			console.log(index)
			if (index != 0) {
				var spliceItem = $scope.gysList.splice(index, 1)[0];
				console.log(spliceItem)
				console.log($scope.gysList)
				$scope.gysList.splice(index - 1, 0, spliceItem)
				console.log($scope.gysList)
			} else {
				layer.msg('当前行在最顶端,不能再上移')
			}
		}
		$scope.gyspxDownFun = function (index) {
			console.log(index)
			if (index + 1 != $scope.gysList.length) {
				var spliceItem = $scope.gysList.splice(index, 1)[0];
				console.log($scope.gysList)
				$scope.gysList.splice(index + 1, 0, spliceItem)
				console.log(spliceItem)
				console.log($scope.gysList)
			} else {
				layer.msg('当前行在最底端,不能再下移')
			}
		}
		$scope.ckGysWcFun = function () {
			console.log($scope.gysList)
			var wcBianjiObj = {};
			wcBianjiObj.supplierLinks = [];
			wcBianjiObj.pid = $scope.ckgysPid
			for (var i = 0, len = $scope.gysList.length; i < len; i++) {
				console.log($scope.gysList[i].name)
				console.log($scope.gysList[i].star)
				console.log($scope.gysList[i].name && $scope.gysList[i].star)
				if ($scope.gysList[i].name && $scope.gysList[i].star) {
					wcBianjiObj.supplierLinks.push({
						name: $scope.gysList[i].name,
						star: $scope.gysList[i].star
					})
				} else {
					// layer.msg('请把供应商信息填写完整')
					// break
				}
			}
			if (wcBianjiObj.supplierLinks.length < 1) {
				layer.msg('请设置采购链接')
				return
			}
			erp.load()
			console.log(wcBianjiObj)
			erp.postFun('caigou/procurement/xiuGaiLianJie', JSON.stringify(wcBianjiObj), function (data) {
				console.log(data)
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.ckflag = false;
					$scope.gysList = '';
					getList(erp, $scope);
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		// $scope.defaultStar = 5;
		$scope.changeSPStar = function (starNum, item) {
			console.log(starNum)
			item.star = starNum;
			console.log(item)
			console.log($scope.gysList)
		}
		$scope.showYStar = function (ev) {
			$(ev.target).addClass('star');
			$(ev.target).prevAll("a").addClass("star").end().nextAll("a").removeClass("star");
		}
		$scope.hideYStar = function (item, ev) {
			$(ev.target).parent('.td-star').children('a').removeClass('star')
			console.log(item.star)
			for (var i = 0, len = item.star; i < len; i++) {
				$(ev.target).parent('.td-star').children('a').eq(i).addClass('star')
			}
		}
		$scope.ckcloseFun = function () {
			$scope.ckflag = false;
			$scope.flag1 = false;
			$scope.cgList = '';
		}

		$scope.flag1 = false;
		//全局变量接收是属于 点击的那一个采购单
		var clickProcurement;
		$scope.caigou = function (item) {
			$scope.flag1 = true;
			var arr = [];
			if (arr.length == 0) {
				arr.push(item.ID + '')
			}
			console.log(arr)
			$scope.btArr = arr;
			var a = JSON.parse(item.SUPLLIERLINK);
			// $scope.cgList = JSON.parse(item.SUPLLIERLINK);
			clickProcurement = item;
			// console.log(clickProcurement)
			console.log(a)
			var cgPrice = item.COSTPRICE;//采购价格
			for (var i = 0; i < a.length; i++) {
				console.log(a[i])
				a[i].price = cgPrice;
				a[i].dingDanZhuangtai = 'zhengChang';
				a[i].ORDERNEEDCOUNT = item.ORDERNEEDCOUNT;
			}
			// console.log(a)
			$scope.cgList = a;
			console.log($scope.cgList);
		}
		$scope.chudancaigou = function (item, index) {
			//采购链接
			var regBol = /^[0-9a-zA-Z]*$/g;
			//采购数量
			var ordNum = $("#ordnum" + index).val();
			if (!regBol.test(ordNum)) {
				layer.msg('请不要输入除了字母跟数字其它的字符串');
				return;
			}
			layer.load(2)
			erp.postFun("caigou/procurement/shengChengCaiGouDingDan", {
				"caiGouLianJie": item.name,
				"chuDanCaiGouIds": $scope.btArr,
				"dingDanHao": ordNum,
				"dingDanZhuangtai": item.dingDanZhuangtai
			}, suc, err);
			function suc(a) {
				$scope.flag1 = false;
				layer.closeAll('loading')
				// layer.msg("添加成功")
				console.log(a)
				layer.msg(a.data.message)
				if (a.data.statusCode == 200) {
					layer.msg("添加成功")
					$scope.cgList = '';
					getList(erp, $scope);
				}
			};
		}
		//    获取仓库
		$scope.getcangku = function (n) {
			$scope.cangku = n;
			console.log($scope.cangku, n)
		}
		//    确定订单
		$scope.quedin = function (item, index) {
			console.log($scope.data.dindanhao, $scope.data.buycount, $scope.data.comprice, $scope.data.youhuiprice, $scope.data.daohuoday, $scope.data.wuliufeiyong, $scope.data.jine, $scope.data.zhuizonghao, $scope.data.fahuoshuliang, $scope.cangku, $scope.data.liuyan)
			erp.postFun("app/storage/buyAdd", { "data": "{'':{'img':'" + item.IMG + "','unit':'','productId':'','buier':'','buierId':'','detail':'" + $scope.data.liuyan + "','variantSku':'" + item.SKU + "','variantId':'" + item.vid + "','supplierName':'','order':'" + $scope.data.dindanhao + "','count':'" + $scope.data.buycount + "','costPrice':'" + $scope.data.jine + "','discount':'" + $scope.data.youhuiprice + "','transDay':'" + $scope.data.daohuoday + "','transFee':'" + $scope.data.wuliufeiyong + "','costAll':'" + $scope.costall + "','storageId':'" + $scope.cangku + "','storage':'','logist':{'" + $scope.waybill + "':{'log':'','count':'" + $scope.waybillcount + "'}}}}}" }, bb, err);

			function bb(a) {
				alert("添加成功")
			};
		}
		//显示大图
		$('#ea-list-table').on('mouseenter', '.s-img', function () {
			$(this).siblings('.hide-bigimg').show();
		})
		$('#ea-list-table').on('mouseenter', '.hide-bigimg', function () {
			$(this).show();
		})
		$('#ea-list-table').on('mouseleave', '.s-img', function () {
			$(this).siblings('.hide-bigimg').hide();
		})
		$('#ea-list-table').on('mouseleave', '.hide-bigimg', function () {
			$(this).hide();
		})
		//
		$scope.ordnumFlag = false;
		$scope.ordNunShowFun = function (item) {
			console.log(item);
			$scope.ordnumFlag = true;
			//$scope.ordList = JSON.parse(item.ORDERMAP);
			$scope.ordList = item.orderList;
			console.log($scope.ordList)
		}
		$scope.closeOrdNumFun = function () {
			$scope.ordnumFlag = false;
		}
		console.log($scope.storageId)
		$scope.showBtFun = function (item, ev, index) {
			btID = [];//变体id数组置为空
			btIdArr = [];//存储商品id的数组置为空
			item.checked = false;
			console.log(item)
			$scope.itemIndex = index;
			$(ev.target).toggleClass('.glyphicon glyphicon-triangle-top');
			console.log($(ev.target).hasClass('glyphicon-triangle-top'))
			if (!$(ev.target).hasClass('glyphicon-triangle-top')) {
				$scope.chudanliebiao[index].btList = [];
				return
			}
			var btUpdata = {};
			btUpdata.pid = item.PRODUCTId;
			if (item.storageId) {
				btUpdata.storageId = item.storageId;
			} else {
				btUpdata.storageId = $scope.storageId;
			}
			console.log(btUpdata)
			erp.postFun('caigou/procurement/caiGouBianTiLieBiao', JSON.stringify(btUpdata), function (data) {
				console.log(data)
				// $scope.showbtFlag = true;
				var obj = data.data.result;
				if ($(ev.target).hasClass('glyphicon-triangle-top')) {
					if (obj.length > 0) {
						for (var i = 0; i < obj.length; i++) {
							obj[i].checked = false;
						}
						$scope.chudanliebiao[index].btList = obj;
						console.log($scope.chudanliebiao[index].btList)
					}
				} else {
					$scope.chudanliebiao[index].btList = [];
				}
			}, err)

		}
		$scope.cjcgFun = function (item, ev, index) {
			if (item.youJiaGe == 1) {
				layer.msg('已移至初级采购,请勿重复操作')
				return
			}
			erp.load()
			$scope.bianjiFlag = true;
			$scope.cgDjStu = 'chuJi';
			var btUpdata = {};
			btUpdata.pid = item.PRODUCTId;
			if (item.storageId) {
				btUpdata.storageId = item.storageId;
			} else {
				btUpdata.storageId = $scope.storageId;
			}
			console.log(btUpdata)
			erp.postFun('caigou/procurement/todaySkuListVariant', JSON.stringify(btUpdata), function (data) {
				console.log(data)
				erp.closeLoad();
				var obj = JSON.parse(data.data.result);
				console.log(obj)
				$scope.spbtList = obj.list;
				console.log($scope.spbtList)
			}, err)
		}
		$scope.cjcgSureFun = function () {
			var upArr = [];
			var isCanAddFlag = true;
			for (var i = 0, len = $scope.spbtList.length; i < len; i++) {
				if (!$scope.spbtList[i].ID || !$scope.spbtList[i].VARIANTID || !$scope.spbtList[i].ORDERNEEDCOUNT || !$scope.spbtList[i].COSTPRICE) {
					isCanAddFlag = false;
					break
				}
				upArr.push({
					"id": $scope.spbtList[i].ID,
					"variantId": $scope.spbtList[i].VARIANTID,
					"shuLiang": $scope.spbtList[i].ORDERNEEDCOUNT,
					"jiaGe": $scope.spbtList[i].COSTPRICE,
					"chuJiLiuYan": $scope.spbtList[i].liuYan
				})
			}
			console.log(upArr)
			if (!isCanAddFlag) {
				layer.msg('请填写所有信息')
				return
			}
			erp.load()
			var upJson = {};
			upJson.bts = upArr;
			console.log(upJson)
			erp.postFun('caigou/procurement/gaiJiaGe', JSON.stringify(upJson), function (data) {
				console.log(data)
				erp.closeLoad()
				if (data.data.statusCode == 200) {
					$scope.bianjiFlag = false;
					$scope.spbtList = null;
					getList(erp, $scope);
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		$scope.gjcgFun = function (item, ev, index) {
			erp.load()
			$scope.bianjiFlag = true;
			$scope.cgDjStu = 'gaoJi';
			var btUpdata = {};
			btUpdata.pid = item.PRODUCTId;
			if (item.storageId) {
				btUpdata.storageId = item.storageId;
			} else {
				btUpdata.storageId = $scope.storageId;
			}
			console.log(btUpdata)
			erp.postFun('caigou/procurement/todaySkuListVariant', JSON.stringify(btUpdata), function (data) {
				console.log(data)
				erp.closeLoad();
				var obj = JSON.parse(data.data.result);
				console.log(obj)
				$scope.spbtList = obj.list;
				console.log($scope.spbtList)
			}, err)
		}
		$scope.gjcgSureFun = function () {
			var upArr = [];
			var isCanAddFlag = true;
			for (var i = 0, len = $scope.spbtList.length; i < len; i++) {
				upArr.push({
					"id": $scope.spbtList[i].ID,
					"variantId": $scope.spbtList[i].VARIANTID
				})
			}
			console.log(upArr)
			erp.load()
			var upJson = {};
			upJson.bts = upArr;
			console.log(upJson)
			erp.postFun('caigou/procurement/gaiJiaGe2', JSON.stringify(upJson), function (data) {
				console.log(data)
				erp.closeLoad()
				if (data.data.statusCode == 200) {
					$scope.bianjiFlag = false;
					$scope.spbtList = null;
					getList(erp, $scope);
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		$scope.btCgLiuYanFun = function (liuYan) {
			$scope.gjcgLiuYan = liuYan;
			$scope.gjcgLiuYanFlag = true;
		}
		//清空所有
		$scope.qkFun = function (ev) {
			erp.load();
			erp.getFun('pojo/procurement/deleteAllOrderProcurement', function (data) {
				console.log(data)
				console.log(data.data[0])
				console.log(data.data[0].statusCode)
				if (data.data[0].statusCode == 200) {
					$(ev.target).hide();
					$scope.chudanliebiao = [];
					getList(erp, $scope);
				} else {
					layer.msg('清空失败')
				}
			}, err)
		}
		$scope.sxFun = function () {
			erp.getFun('pojo/procurement/flush', function (data) {
				console.log(data)
				if (data.data[0].statusCode == 200) {
					getList(erp, $scope);
				} else {
					layer.msg('刷新失败')
				}
			}, err)
		}
		//采购线下完成
		$scope.errFlag = false;
		var orderProcurementId = '';//存储变体id
		var xxwcArr = [];
		$scope.qxXxcgFun = function () {
			$scope.isSureXxcgFlag = false;
		}
		$scope.sureXxcgFun = function () {
			erp.load();
			erp.postFun('caigou/procurement/xianXiaCaiGou', {
				"chuDanCaiGouIds": xxwcArr
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.isSureXxcgFlag = false;
					$scope.dingDanHFlag = true;
					$scope.dingDanHao = data.data.result;
				} else {
					layer.msg('线下采购失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		var zjwcArr = [];
		$scope.zjWcFun = function (item) {
			$scope.cgwcFlag = true;
			zjwcArr = [];
			zjwcArr.push(item.ID + '');
		}
		$scope.qxCgwcFun = function () {
			$scope.cgwcFlag = false;
			$scope.cgwcVal = '';
		}
		$scope.sureCgwcFun = function () {
			if (!$scope.cgwcVal) {
				layer.msg('请输入原因')
				return
			}
			erp.load()
			var cgwcData = {};
			cgwcData.chuDanCaiGouIds = zjwcArr;
			cgwcData.dingDanHao = $scope.cgwcVal;
			erp.postFun('caigou/procurement/zhiJieWanCheng', JSON.stringify(cgwcData), function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.cgwcFlag = false;
					layer.msg('成功')
					getList(erp, $scope);
				} else {
					layer.msg('失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		$scope.gbDdhFun = function () {
			$scope.dingDanHFlag = false;
			getList(erp, $scope);
		}
		//查看业务员
		$scope.viewFlag = false;
		$scope.viewFun = function (item) {
			console.log(item)
			$scope.viewFlag = true;
			$scope.ywyListArr = item.empSet;
			console.log($scope.ywyListArr)
		}
		$scope.viewCloseFun = function () {
			$scope.viewFlag = false;
			$scope.ywyListArr = [];
		}

		//选中 
		var firVid;
		var btIdArr = [];
		var btID = [];
		$scope.isCheckFun = function (item, index, ev, spitem, btlist) {
			console.log(item.checked)
			var checkedNum = 0;
			var btListArr = JSON.parse(spitem.SUPLLIERLINK)
			// var btLen = btListArr.length;//变体数组
			if (item.checked) {
				if (btIdArr.length < 1) {//第一次点击变体
					btIdArr.push(item.PRODUCTID)
					btID.push(item.ID + '')
					for (var i = 0; i < btlist.length; i++) {
						if (btlist[i]['checked'] == true) {
							checkedNum++;
						}
					}
					console.log('diyici')
				} else {
					if (btIdArr[0] == item.PRODUCTID) {//是同一个商品的变体
						btIdArr.push(item.PRODUCTID)
						console.log('666')
						btID.push(item.ID + '')
						for (var i = 0; i < btlist.length; i++) {
							if (btlist[i]['checked'] == true) {
								checkedNum++;
							}
						}
					} else {
						console.log('555')
						item.checked = false;
					}
				}
				// console.log(item)
				console.log('xuanzhong')
			} else {
				// btIdArr.pop()
				// btID.pop()
				btIdArr.pop()
				for (var i = 0, len = btID.length; i < len; i++) {
					if (item.ID == btID[i]) {
						btID.splice(i, 1)
						console.log(btID)
						break
					}
				}
				console.log('quxiao')
			}
			console.log(btID)
			console.log(btIdArr)
			if (checkedNum == btlist.length) {
				spitem.checked = true;
			} else {
				spitem.checked = false;
			}
		}

		// 选中所有商品
		$scope.checkAll = function (item, checkAllMark, e, list) {
			btID = [];//变体id数组置为空
			btIdArr = [];//存储商品id的数组置为空
			console.log(list)
			console.log(item)
			if (!item.btList) {
				layer.msg('请先查询变体');
				item.checked = false;
				return;
			} else {//如果该商品已经查询过变体
				if (item.checked) {
					for (var i = 0; i < list.length; i++) {//所有的商品变体的复选框置为非选中
						list[i].checked = false;
						if (list[i].btList) {
							for (var k = 0; k < list[i].btList.length; k++) {
								list[i].btList[k].checked = false;
							}
						}
					}
					item.checked = true;//本商品置为选中
					for (var i = 0; i < item.btList.length; i++) {//本商品的所有变体置为选中
						item.btList[i].checked = true;
						btID.push(item.btList[i].ID + '')
						btIdArr.push(item.PRODUCTId)
					}
					console.log(btID)
				} else {
					btIdArr = [];//存储商品id的数组置为空
					for (var i = 0; i < item.btList.length; i++) {
						item.btList[i].checked = false;
						btID = [];
					}
					console.log(btID)
				}
				console.log(btIdArr)
			}
		}
		//变体的复选框
		//批量采购
		$scope.bulkCgFlag = false;
		$scope.bulkCgFun = function () {
			if (btID.length < 1) {
				layer.msg('请选择变体')
				return;
			} else {
				$scope.bulkCgFlag = true;
				var isBreakOutFlag = false;
				for (var i = 0; i < $scope.chudanliebiao.length; i++) {
					console.log($scope.chudanliebiao[i]['btList'])
					if ($scope.chudanliebiao[i]['btList'] && $scope.chudanliebiao[i]['btList'].length > 0) {
						for (var j = 0, btLen = $scope.chudanliebiao[i]['btList'].length; j < btLen; j++) {
							if ($scope.chudanliebiao[i]['btList'][j].checked) {
								isBreakOutFlag = true;
								var cgArr = JSON.parse($scope.chudanliebiao[i].SUPLLIERLINK);
								console.log(cgArr)
								for (var k = 0, gysLen = cgArr.length; k < gysLen; k++) {
									cgArr[k]['dingDanZhuangtai'] = 'zhengChang'
								}
								$scope.cgList = cgArr;
								console.log($scope.cgList)
								break
							}
						}
					}
					if (isBreakOutFlag) {
						console.log('跳出外层循环')
						break
					}
				}
			}
		}
		$scope.sureBulkFun = function (item, index) {
			$scope.cgList = [];
			var ordNum = $("#bulkordnum" + index).val();
			var regBol = /^[0-9a-zA-Z]*$/g;
			if (!regBol.test(ordNum)) {
				layer.msg('请不要输入除了字母跟数字其它的字符串');
				return;
			}
			layer.load(2)
			erp.postFun("caigou/procurement/shengChengCaiGouDingDan", {
				"caiGouLianJie": item.name,
				"dingDanHao": ordNum,
				"chuDanCaiGouIds": btID,
				"dingDanZhuangtai": item.dingDanZhuangtai
			}, suc, err);
			function suc(a) {
				layer.closeAll('loading');
				$scope.bulkCgFlag = false;
				// $scope.flag1 = false;
				console.log(a)
				if (a.data.statusCode == 200) {
					layer.msg("添加成功")
					getList(erp, $scope);
					btIdArr = [];
				} else {
					layer.msg("添加失败")
				}
			};
		}
		$scope.bulkCloseFun = function () {
			$scope.bulkCgFlag = false;
			getList(erp, $scope);
			btID = [];//变体id数组置为空
			btIdArr = [];//存储商品id的数组置为空
		}
		$scope.bulkCgWcFun = function () {
			if (btID.length < 1) {
				layer.msg('请选择变体')
				return;
			} else {
				$scope.bulkCgwcFlag = true;
			}
		}
		$scope.bulksureCgwcFun = function () {
			erp.load()
			var cgwcData = {};
			cgwcData.chuDanCaiGouIds = btID;
			cgwcData.dingDanHao = '';
			erp.postFun('caigou/procurement/zhiJieWanCheng', JSON.stringify(cgwcData), function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.bulkCgwcFlag = false;
					layer.msg('成功')
					getList(erp, $scope);
					btID = [];//变体id数组置为空
					btIdArr = [];//存储商品id的数组置为空
				} else {
					layer.msg('失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		//单个线下完成
		$scope.xxcgCkVal = '0';
		$scope.xxwcFun = function (item) {
			$scope.bulkXxcgFlag = true;
			var oneArr = [];
			oneArr.push({
				"ID": item.ID,
				"IMG": item.IMG,
				"PRODUCTID": item.PRODUCTID,
				"shortSku": item.shortSku,
				"SKU": item.SKU,
				"VARIANTID": item.VARIANTID,
				"xxcgNum": item.xxcgNum,
				"nameEn": item.nameEn
			})
			$scope.xxcgList = oneArr;
			console.log($scope.xxcgList)
		}
		//批量线下采购
		$scope.bulkXxcgFun = function () {
			if (btID.length < 1) {
				layer.msg('请选择变体')
				return;
			} else {
				$scope.bulkXxcgFlag = true;
				var cgArr = [];
				for (var i = 0; i < $scope.chudanliebiao.length; i++) {
					cgArr = [];
					if ($scope.chudanliebiao[i]['btList'] && $scope.chudanliebiao[i]['btList'].length > 0) {
						for (var j = 0, btLen = $scope.chudanliebiao[i]['btList'].length; j < btLen; j++) {
							if ($scope.chudanliebiao[i]['btList'][j].checked) {
								console.log($scope.chudanliebiao[i]['btList'][j])
								cgArr.push($scope.chudanliebiao[i]['btList'][j])
								console.log(cgArr)
								$scope.xxcgList = cgArr;
								console.log($scope.cgList)
							}
						}
					}
				}
			}

		}
		$scope.xxcgNumfun = function (item, index) {
			console.log(index)
			console.log($scope.xxcgList)
			$scope.xxcgList['xxcgNum'] = item.xxcgNum;
		}
		$scope.xxcgdanJIafun = function (item, index) {
			console.log(index)
			console.log($scope.xxcgList)
			$scope.xxcgList['danJia'] = item.danJia;
		}
		$scope.bulkXxcgSureFun = function () {
			console.log($scope.xxcgList)
			if (!$scope.cgrMoneyCount) {
				layer.msg('请输入采购金额')
				return
			}
			var isNumFlag = true;
			var jsonArr = [];
			for (var i = 0, len = $scope.xxcgList.length; i < len; i++) {
				if (!$scope.xxcgList[i].xxcgNum || !$scope.xxcgList[i].danJia) {
					isNumFlag = false;
					break
				}
				jsonArr.push({
					"id": $scope.xxcgList[i].ID,
					"cjImg": $scope.xxcgList[i].IMG,
					"cjProductId": $scope.xxcgList[i].PRODUCTID,
					"cjShortSku": $scope.xxcgList[i].shortSku,
					"cjSku": $scope.xxcgList[i].SKU,
					"cjStanproductId": $scope.xxcgList[i].VARIANTID,
					"shuLiang": $scope.xxcgList[i].xxcgNum,
					"danJia": $scope.xxcgList[i].danJia,
					"cjHuoWuBiaoTi": $scope.xxcgList[i].nameEn
				})
			}
			if (!isNumFlag) {
				layer.msg('请为所有SKU填写数量')
				return
			}
			erp.load()
			var xxcgJson = {};
			xxcgJson.gongSiMing = $scope.cgrModel;
			xxcgJson.zhiFu = $scope.cgrMoneyCount;
			xxcgJson.cangKu = $scope.xxcgCkVal;
			xxcgJson.skuNums = jsonArr;
			erp.postFun('caigou/procurement/xianXiaCaiGou', JSON.stringify(xxcgJson), function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.bulkXxcgFlag = false;
					$scope.dingDanHFlag = true;
					$scope.dingDanHao = data.data.result;
					$scope.cgrModel = '';
					$scope.cgrMoneyCount = '';
				} else {
					layer.msg('线下采购失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})

		}
		$(window).scroll(function () {
			var before = $(window).scrollTop();
			if (before > 60) {
				$('.tit-box').css({
					"position": "fixed",
					"top": 0
				})
			} else {
				$('.tit-box').css({
					"position": "static",
					"top": 0
				})
			}
		});

	}])
	
	//erp采购  出单需采购
	app.controller('needbuyCtrl', ['$scope', "erp", function ($scope, erp) {
		console.log('needbuyCtrl')
		// alert(666)
		function err(a) {
			console.log(a);
			layer.closeAll('loading');
		};
		$scope.data = {
			dindanhao: '', buycount: '', comprice: '', youhuiprice: '', daohuoday: '', wuliufeiyong: '', jine: '', zhuizonghao: '', fahuoshuliang: '', cangku: '', liuyan: ''
		}
		$scope.dindan = false;
		$scope.storages = [];
		$scope.cangku = '';
		$scope.pageSize = '30';
		$scope.pageNum = '1';
		$scope.totalNum = 0;
		$scope.totalPageNum = 0;
		$scope.searchSku = '';
		//erp.postFun("app/storage/orderBuyList", {"data":"{'pageNum':'1','pageSize':'5'}"}, bb, err);

		$scope.messageFlag = false;
		var productId;
		var clickItem;
		$scope.aaa = function (item) {
			productId = item.PRODUCTId;
			$scope.messageArea = item.remark;
			clickItem = item;
			$scope.messageFlag = true;
			$scope.localRemark = item.LOCREMARK;
		}
		$scope.messageCloseFun = function () {
			$scope.messageFlag = false;
		}
		$scope.remarkShowFun = function (ev) {
			$(ev.target).children('.remark-con').show();
			console.log('show')
		}
		$scope.remarkHideFun = function (ev) {
			$(ev.target).children('.remark-con').show();
			console.log('hide')
		}

		$('.table-con-box').on('mouseenter', '.remark-box', function () {
			if ($.trim($(this).find('.cg-remark-text').text()) || $.trim($(this).find('.sp-remark-text').text())) {
				$(this).children('.remark-con').show();
			}
		})
		$('.table-con-box').on('mouseleave', '.remark-box', function () {
			$(this).children('.remark-con').hide();
		})
		$scope.messageSureFun = function () {
			var inputStr = $scope.messageArea;
			console.log(inputStr);
			console.log(productId);
			if (clickItem.remark != inputStr) {
				erp.postFun("pojo/procurement/setMessage", { "productId": productId, "inputStr": inputStr }, function (data) {
					if (JSON.parse(data.data.statusCode) == 200) getList(erp, $scope);
					$scope.messageFlag = false;
					layer.msg('备注成功')
				}, err);
				function err(data) {
					layer.msg("备注失败");
				}
			} else {
				console.log("未修改");
				$scope.messageFlag = false;
			}

		}
		//预采购
		$scope.yuCaiGouFun = function (item) {
			console.log(item)
			var storeNum;
			if ($scope.storageId == '201e67f6ba4644c0a36d63bf4989dd70' || $scope.storageId == '738A09F1-2834-43CC-85A8-2FE5610C2599') {
				storeNum = 2
			} else if ($scope.storageId == '{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}') {
				storeNum = 0
			} else if ($scope.storageId == '85742FBC-38D7-4DC4-9496-296186FFEED8') {
				storeNum = 1
			}
			console.log(storeNum)
			var upJson = {};
			upJson.bianTiId = item.VARIANTID;
			upJson.store = storeNum;
			erp.postFun('caigou/procurement/quQitianJiLu', JSON.stringify(upJson), function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					if (JSON.stringify(data.data.result) != '[]') {
						$scope.yuCaiGouFlag = true;
						$scope.caiGouHisList = data.data.result;
					} else {
						layer.msg('暂无信息')
					}
				} else {
					layer.msg('暂无信息')
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		$scope.yiZhiFuOrdFun = function (item, stu) {
			if (stu == 1) {
				$scope.yiZhiFuOrdList = item.yiZhiFuDingDan
				if ($scope.yiZhiFuOrdList && JSON.stringify($scope.yiZhiFuOrdList) != "[]") {
					$scope.zhiFuOrdFlag = true;
				} else {
					layer.msg('无已支付订单详情')
				}
			} else {
				$scope.yiZhiFuOrdList = item.weiZhiFuDingDan
				console.log($scope.yiZhiFuOrdList)
				if ($scope.yiZhiFuOrdList && JSON.stringify($scope.yiZhiFuOrdList) != "[]") {
					$scope.zhiFuOrdFlag = true;
				} else {
					layer.msg('无未支付订单详情')
				}
			}
		}
		//获取仓库
		erp.getFun('app/storage/getStorage', function (data) {
			console.log(data)
			var obj = JSON.parse(data.data.result);
			console.log(obj)
			$scope.ckArr = obj;
			$scope.ckArr.push({
				id: "f87a1c014e6c4bebbe13359467886e99",
				storage: "泰国仓"
			})
			console.log($scope.ckArr)
		}, function (data) {
			erp.closeLoad();
			console.log('仓库获取失败')
		})
		$scope.storageId = "{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}";
		// 获取列表
		function getList(erp, $scope) {
			erp.load();
			var url;
			if ($scope.isQueHuoFlag) {
				url = "caigou/procurement/todaySkuListQueHuo";
			} else {
				url = "caigou/procurement/todaySkuList";
			}
			erp.postFun(url, {
				'pageNum': $scope.pageNum + '',
				'pageSize': $scope.pageSize + '',
				'storageId': $scope.storageId,
				'inputStr': $scope.searchSku,
				'diJi': $scope.cgDjVal
			}, function (n) {
				erp.closeLoad();
				console.log(n);
				if (n.data.statusCode != 200) {
					layer.msg('网络错误');
					return;
				}
				var obj = JSON.parse(n.data.result);
				$scope.totalNum = obj.totle;
				console.log($scope.totalNum)
				if (obj.totle == 0) {
					$scope.totalpage = 0;
					$scope.customerList = [];
					layer.msg("没有找到数据");
					$scope.chudanliebiao = [];
					$scope.countMoney = 0;
					return;
				}
				for (var i = 0; i < obj.list.length; i++) {
					obj.list[i].checked = false;
				}
				$scope.chudanliebiao = obj.list;
				console.log($scope.chudanliebiao);
				$scope.totalPageNum = Math.ceil($scope.totalNum / ($scope.pagesize * 1));
				// countMFun ($scope.chudanliebiao)
				pageFun(erp, $scope);
			}, err);
		}
		$scope.queHuoTab = function (ev) {
			if ($(ev.target).hasClass('que-huo-act')) {
				$scope.isQueHuoFlag = false;
				$(ev.target).removeClass('que-huo-act')
				$scope.pageNum = '1';
				getList(erp, $scope)
			} else {
				$scope.isQueHuoFlag = true;
				$(ev.target).addClass('que-huo-act')
				$scope.pageNum = '1';
				getList(erp, $scope)
			}
		}
		function countMFun(val) {
			var len = val.length;
			var count = 0;
			for (var i = 0; i < len; i++) {
				count += val[i].COSTPRICE * val[i].ORDERNEEDCOUNT;
			}
			$scope.countMoney = count.toFixed(2)
			console.log($scope.countMoney);
		}
		//分页
		function pageFun(erp, $scope) {
			$("#pagination1").jqPaginator({
				totalCounts: $scope.totalNum,
				pageSize: $scope.pageSize * 1,
				visiblePages: 5,
				currentPage: $scope.pageNum * 1,
				activeClass: 'current',
				first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				onPageChange: function (n, type) {
					if (type == 'init') {
						return;
					};
					erp.load();
					$scope.pageNum = n;
					getList(erp, $scope)
				}
			});
		}
		getList(erp, $scope);
		$scope.changePageSize = function () {
			$scope.pageNum = '1';
			getList(erp, $scope);
		}
		$scope.toSpecifiedPage = function () {
			var totalpage = Math.ceil($scope.totalNum / ($scope.pageSize - 0));
			if (!$scope.pageNum || $scope.pageNum > totalpage || $scope.pageNum < 1) {
				layer.msg('页码不存在')
				return
			}
			getList(erp, $scope);
		}
		$scope.selByStorageFun = function () {
			$scope.pageNum = '1';
			getList(erp, $scope);
		}
		//按sku进行搜索
		$('.sku-inp').keypress(function (Event) {
			if (Event.keyCode == 13) {
				$scope.skuSearchFun();
			}
		})
		$scope.skuSearchFun = function () {
			$scope.pageNum = '1';
			getList(erp, $scope);
		}
		$scope.cgDjChangeFun = function () {
			$scope.pageNum = '1';
			getList(erp, $scope);
		}

		//查看供应商
		$scope.ckflag = false;
		$scope.ckFun = function (item) {
			$scope.ckflag = true;
			$scope.ckgysPid = item.PRODUCTId || item.PRODUCTID;
			console.log($scope.ckgysPid)
			$scope.gysList = JSON.parse(item.SUPLLIERLINK);
			console.log($scope.gysList)
		}
		$scope.addGysFun = function () {
			// {"name":"https://detail.1688.com",
			// "star":5,"$$hashKey":"object:1115"}
			var gysObj = {};
			gysObj.name = '';
			gysObj.star = 5;
			gysObj.flag = true;
			$scope.gysList.push(gysObj)
			console.log($scope.gysList)
		}
		$scope.bianjiGysFun = function () {
			for (var i = 0, len = $scope.gysList.length; i < len; i++) {
				$scope.gysList[i].flag = true;
			}
		}
		$scope.deletGysFun = function (index) {
			if ($scope.gysList.length == 1) {
				layer.msg('至少要保留一个供应商')
				return
			}
			$scope.gysList.splice(index, 1)
		}
		$scope.gyspxUpFun = function (index) {
			console.log(index)
			if (index != 0) {
				var spliceItem = $scope.gysList.splice(index, 1)[0];
				console.log(spliceItem)
				console.log($scope.gysList)
				$scope.gysList.splice(index - 1, 0, spliceItem)
				console.log($scope.gysList)
			} else {
				layer.msg('当前行在最顶端,不能再上移')
			}
		}
		$scope.gyspxDownFun = function (index) {
			console.log(index)
			if (index + 1 != $scope.gysList.length) {
				var spliceItem = $scope.gysList.splice(index, 1)[0];
				console.log($scope.gysList)
				$scope.gysList.splice(index + 1, 0, spliceItem)
				console.log(spliceItem)
				console.log($scope.gysList)
			} else {
				layer.msg('当前行在最底端,不能再下移')
			}
		}
		$scope.ckGysWcFun = function () {
			var wcBianjiObj = {};
			wcBianjiObj.supplierLinks = [];
			wcBianjiObj.pid = $scope.ckgysPid
			for (var i = 0, len = $scope.gysList.length; i < len; i++) {
				// console.log($scope.gysList[i].name)
				// console.log($scope.gysList[i].star)
				// console.log($scope.gysList[i].name && $scope.gysList[i].star)
				if ($scope.gysList[i].name && $scope.gysList[i].star) {
					wcBianjiObj.supplierLinks.push({
						name: $scope.gysList[i].name,
						star: $scope.gysList[i].star,
						beiZhu: $scope.gysList[i].beiZhu
					})
				} else {
					// layer.msg('请把供应商信息填写完整')
					// return
				}
			}
			if (wcBianjiObj.supplierLinks.length < 1) {
				layer.msg('请设置采购链接')
				return
			}
			erp.load()
			erp.postFun('caigou/procurement/xiuGaiLianJie', JSON.stringify(wcBianjiObj), function (data) {
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.ckflag = false;
					$scope.gysList = '';
					getList(erp, $scope);
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		// $scope.defaultStar = 5;
		$scope.changeSPStar = function (starNum, item) {
			item.star = starNum;
		}
		$scope.showYStar = function (ev) {
			$(ev.target).addClass('star');
			$(ev.target).prevAll("a").addClass("star").end().nextAll("a").removeClass("star");
		}
		$scope.hideYStar = function (item, ev) {
			$(ev.target).parent('.td-star').children('a').removeClass('star')
			for (var i = 0, len = item.star; i < len; i++) {
				$(ev.target).parent('.td-star').children('a').eq(i).addClass('star')
			}
		}
		$scope.ckcloseFun = function () {
			$scope.ckflag = false;
			$scope.flag1 = false;
			$scope.cgList = '';
		}

		$scope.flag1 = false;
		//全局变量接收是属于 点击的那一个采购单
		var clickProcurement;
		$scope.caigou = function (item, pItem) {// 12-03采购修改 出单采购 --- 2-1 采购 （1688api or 非api） 显示对应的弹窗
			$scope.flag1 = true;
			var arr = [];
			if (arr.length == 0) {
				arr.push(item.ID + '')
			}
			console.log('item --------------->>> ', item)
			$scope.btArr = arr;
			var a = JSON.parse(item.SUPLLIERLINK);
			// $scope.cgList = JSON.parse(item.SUPLLIERLINK);
			$scope.btItemObj = item;
			clickProcurement = item;
			var cgPrice = item.COSTPRICE;//采购价格
			for (var i = 0; i < a.length; i++) {
				console.log(a[i])
				a[i].price = cgPrice;
				a[i].dingDanZhuangtai = 'zhengChang';
				a[i].ORDERNEEDCOUNT = item.ORDERNEEDCOUNT;
			}
			// console.log(a)
			$scope.cgList = a;
			$scope.variantId = item.VARIANTID;
			$scope.itemBtSku = item.SKU;
		}
		$scope.chudancaigou = function (item, index) {// 12-03采购修改 出单采购 --- 2-1-1 1688非api采购  
			//采购链接
			var regBol = /^[0-9a-zA-Z]*$/g;
			//采购数量
			var ordNum = $("#ordnum" + index).val();
			if (!regBol.test(ordNum)) {
				layer.msg('请不要输入除了字母跟数字其它的字符串');
				return;
			}
			layer.load(2)
			erp.postFun("caigou/procurement/shengChengCaiGouDingDan", {
				"caiGouLianJie": item.name,
				"chuDanCaiGouIds": $scope.btArr,
				"dingDanHao": ordNum,
				"dingDanZhuangtai": item.dingDanZhuangtai
			}, suc, err);
			function suc(a) {
				$scope.flag1 = false;
				layer.closeAll('loading')
				layer.msg(a.data.message)
				if (a.data.statusCode == 200) {
					layer.msg("添加成功")
					$scope.cgList = '';
					getList(erp, $scope);
				}
			};
		}

		//    获取仓库
		$scope.getcangku = function (n) {
			$scope.cangku = n;
		}
		//    确定订单
		$scope.quedin = function (item, index) {
			console.log($scope.data.dindanhao, $scope.data.buycount, $scope.data.comprice, $scope.data.youhuiprice, $scope.data.daohuoday, $scope.data.wuliufeiyong, $scope.data.jine, $scope.data.zhuizonghao, $scope.data.fahuoshuliang, $scope.cangku, $scope.data.liuyan)
			erp.postFun("app/storage/buyAdd", { "data": "{'':{'img':'" + item.IMG + "','unit':'','productId':'','buier':'','buierId':'','detail':'" + $scope.data.liuyan + "','variantSku':'" + item.SKU + "','variantId':'" + item.vid + "','supplierName':'','order':'" + $scope.data.dindanhao + "','count':'" + $scope.data.buycount + "','costPrice':'" + $scope.data.jine + "','discount':'" + $scope.data.youhuiprice + "','transDay':'" + $scope.data.daohuoday + "','transFee':'" + $scope.data.wuliufeiyong + "','costAll':'" + $scope.costall + "','storageId':'" + $scope.cangku + "','storage':'','logist':{'" + $scope.waybill + "':{'log':'','count':'" + $scope.waybillcount + "'}}}}}" }, bb, err);

			function bb(a) {
				alert("添加成功")
			};
		}
		//显示大图
		$('#ea-list-table').on('mouseenter', '.s-img', function () {
			$(this).siblings('.hide-bigimg').show();
		})
		$('#ea-list-table').on('mouseenter', '.hide-bigimg', function () {
			$(this).show();
		})
		$('#ea-list-table').on('mouseleave', '.s-img', function () {
			$(this).siblings('.hide-bigimg').hide();
		})
		$('#ea-list-table').on('mouseleave', '.hide-bigimg', function () {
			$(this).hide();
		})
		//
		$scope.ordnumFlag = false;
		$scope.ordNunShowFun = function (item) {
			console.log(item)
			$scope.ordnumFlag = true;
			//$scope.ordList = JSON.parse(item.ORDERMAP);
			$scope.ordList = item.orderList;
		}
		$scope.closeOrdNumFun = function () {
			$scope.ordnumFlag = false;
		}
		//显示变体
		//var arr = [{"DATESTRING":"2018-03-15","PRODUCTId":"A436C596-C0A2-4126-A540-862AE45CEB53","VARIANTId":"{E0B98D00-19C5-448C-BDD2-B1B4A5C062F8}","ORDERNEEDCOUNT":1,"INPROCUREMENTCOUNT":0,"UNIT":"unit(s)","TRANSPORTDAY":"3","SKU":"CJNSXZNZ00003","IMG":"https://cc-west-usa.oss-us-west-1.aliyuncs.com/15127488/3184989782982.jpg","SUPLLIERLINK":"[{\"name\":\"https://trade.1688.com/order/offer_snapshot.htm?spm=a360q.8274423.1130995625.83.MwkiNP&buyer_id=958411486&order_entry_id=63100102555418614\",\"star\":5,\"$$hashKey\":\"object:1366\"}]","COSTPRICE":10.3},{"DATESTRING":"2018-03-16","PRODUCTId":"C13956FA-47C7-47F9-B2B9-313AE696EEF1","VARIANTId":"1A73A445-A82B-4922-94F9-55A93A67B503","ORDERNEEDCOUNT":2,"INPROCUREMENTCOUNT":0,"UNIT":"unit(s)","TRANSPORTDAY":"3","SKU":"CJSJBHIP00011","IMG":"https://cc-west-usa.oss-us-west-1.aliyuncs.com/15158016/4091631159330.jpg","SUPLLIERLINK":"[{\"name\":\"https://detail.1688.com/offer/562312224611.html?spm=b26110380.8880418.csimg003.14.6e2lmO\",\"star\":5,\"$$hashKey\":\"object:1297\"}]","COSTPRICE":14},{"DATESTRING":"2018-03-15","PRODUCTId":"C80E353A-D135-4A68-AC54-2B03CBD6AFA3","VARIANTId":"{103E1B8D-A55A-48E2-A746-DE828ACE0290}","ORDERNEEDCOUNT":8,"INPROCUREMENTCOUNT":0,"UNIT":"unit(s)","TRANSPORTDAY":"3","SKU":"CJNSSYCS00012","IMG":"https://cc-west-usa.oss-us-west-1.aliyuncs.com/15136128/493577025084.jpg","SUPLLIERLINK":"[{\"name\":\"https://detail.1688.com/offer/542944513799.html?spm=a360q.9889319.0.0.pHDCeu\",\"star\":5,\"$$hashKey\":\"object:2753\"}]","COSTPRICE":10.2},{"DATESTRING":"2018-03-15","PRODUCTId":"D80A08D4-BEFD-43EB-8057-10F6D25B8D2F","VARIANTId":"{BE20845C-F44C-4ED3-9DF2-6C86E27CD0E5}","ORDERNEEDCOUNT":1,"INPROCUREMENTCOUNT":0,"UNIT":"unit(s)","TRANSPORTDAY":"3","SKU":"CJNSXZNZ00002","IMG":"https://cc-west-usa.oss-us-west-1.aliyuncs.com/15107616/641208910878.jpg","SUPLLIERLINK":"[{\"name\":\"https://detail.1688.com/offer/521077371422.html?spm=b26110380.8015204.t\",\"star\":5,\"$$hashKey\":\"object:83\"}]","COSTPRICE":7},{"DATESTRING":"2018-03-16","PRODUCTId":"F07CD9FB-7F9A-45EA-A4C5-B7C4F696BEB7","VARIANTId":"6BCF15BF-1AEB-42D5-B3CC-7A6D8AE3E637","ORDERNEEDCOUNT":2,"INPROCUREMENTCOUNT":0,"UNIT":"unit(s)","TRANSPORTDAY":"3","SKU":"CJJJCFCF00092","IMG":"https://cc-west-usa.oss-us-west-1.aliyuncs.com/15156288/1711317742395.jpg","SUPLLIERLINK":"[{\"name\":\"https://detail.1688.com/offer/1074698927.html?spm=b26110380.sw1688.mof001.1.mSfQRH\",\"star\":5,\"$$hashKey\":\"object:83\"}]","COSTPRICE":1.0E-6}]
		// $scope.showbtFlag = false;
		// var listObj = {};//存储所有商品和变体的对象
		$scope.showBtFun = function (item, ev, index) { // 12-03采购修改 出单采购 --- 1 显示商品变体 列表
			btID = [];//变体id数组置为空
			btIdArr = [];//存储商品id的数组置为空
			item.checked = false;
			$scope.itemIndex = index;
			$(ev.target).toggleClass('.glyphicon glyphicon-triangle-top');
			console.log($(ev.target).hasClass('glyphicon-triangle-top'))
			if (!$(ev.target).hasClass('glyphicon-triangle-top')) {
				$scope.chudanliebiao[index].btList = [];
				return
			}
			var btUpdata = {};
			btUpdata.pid = item.PRODUCTId;
			if (item.storageId) {
				btUpdata.storageId = item.storageId;
			} else {
				btUpdata.storageId = $scope.storageId;
			}
			var btUrl;
			if ($scope.isQueHuoFlag) {
				btUrl = "caigou/procurement/todaySkuListVariantQueHuo";
			} else {
				btUrl = "caigou/procurement/todaySkuListVariant";
			}
			erp.postFun(btUrl, JSON.stringify(btUpdata), function (data) {
				var obj = JSON.parse(data.data.result);
				if ($(ev.target).hasClass('glyphicon-triangle-top')) {
					if (obj.list.length > 0) {
						for (var i = 0; i < obj.list.length; i++) {
							obj.list[i].checked = false;
						}
						$scope.chudanliebiao[index].btList = obj.list;
						console.log($scope.chudanliebiao[index].btList)
						// $scope.btListArr = $scope.chudanliebiao[index].btList;
						console.log($scope.chudanliebiao)
					}
				} else {
					$scope.chudanliebiao[index].btList = [];
				}
			}, err)

		}
		$scope.cjcgFun = function (item, ev, index) {
			if (item.youJiaGe == 1) {
				layer.msg('已移至初级采购,请勿重复操作')
				return
			}
			$scope.gysList = JSON.parse(item.SUPLLIERLINK);
			erp.load()
			$scope.bianjiFlag = true;
			$scope.cgDjStu = 'chuJi';
			var btUpdata = {};
			btUpdata.pid = item.PRODUCTId;
			if (item.storageId) {
				btUpdata.storageId = item.storageId;
			} else {
				btUpdata.storageId = $scope.storageId;
			}
			var btUrl;
			if ($scope.isQueHuoFlag) {
				btUrl = "caigou/procurement/todaySkuListVariantQueHuo";
			} else {
				btUrl = "caigou/procurement/todaySkuListVariant";
			}
			erp.postFun(btUrl, JSON.stringify(btUpdata), function (data) {
				console.log(data)
				erp.closeLoad();
				var obj = JSON.parse(data.data.result);
				console.log(obj)
				$scope.spbtList = obj.list;
				console.log($scope.spbtList)
			}, err)
		}

		$scope.radioFun = function (item) {
			$scope.zhiDingLianJie = item.name;
		}
		$scope.cjcgSureFun = function () {
			if (!$scope.zhiDingLianJie) {
				layer.msg('请指定链接')
				return
			}
			var upArr = [];
			var isCanAddFlag = true;
			for (var i = 0, len = $scope.spbtList.length; i < len; i++) {
				if (!$scope.spbtList[i].ID || !$scope.spbtList[i].VARIANTID || !$scope.spbtList[i].ORDERNEEDCOUNT || !$scope.spbtList[i].COSTPRICE) {
					isCanAddFlag = false;
					break
				}
				upArr.push({
					"id": $scope.spbtList[i].ID,
					"variantId": $scope.spbtList[i].VARIANTID,
					"shuLiang": $scope.spbtList[i].ORDERNEEDCOUNT,
					"jiaGe": $scope.spbtList[i].COSTPRICE,
					"chuJiLiuYan": $scope.spbtList[i].liuYan
				})
			}
			console.log(upArr)
			if (!isCanAddFlag) {
				layer.msg('请填写所有信息')
				return
			}
			erp.load()
			var upJson = {};
			upJson.bts = upArr;
			upJson.zhiDingLianJie = $scope.zhiDingLianJie;
			console.log(upJson)
			erp.postFun('caigou/procurement/gaiJiaGe', JSON.stringify(upJson), function (data) {
				console.log(data)
				erp.closeLoad()
				if (data.data.statusCode == 200) {
					$scope.bianjiFlag = false;
					$scope.spbtList = null;
					$scope.zhiDingLianJie = null;
					getList(erp, $scope);
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		$scope.gjcgFun = function (item, ev, index) {
			erp.load()
			$scope.bianjiFlag = true;
			$scope.cgDjStu = 'gaoJi';
			var btUpdata = {};
			btUpdata.pid = item.PRODUCTId;
			if (item.storageId) {
				btUpdata.storageId = item.storageId;
			} else {
				btUpdata.storageId = $scope.storageId;
			}
			console.log(btUpdata)
			if ($scope.isQueHuoFlag) {
				btUrl = "caigou/procurement/todaySkuListVariantQueHuo";
			} else {
				btUrl = "caigou/procurement/todaySkuListVariant";
			}
			erp.postFun(btUrl, JSON.stringify(btUpdata), function (data) {
				console.log(data)
				erp.closeLoad();
				var obj = JSON.parse(data.data.result);
				console.log(obj)
				$scope.spbtList = obj.list;
				console.log($scope.spbtList)
			}, err)
		}
		$scope.gjcgSureFun = function () {
			var upArr = [];
			var isCanAddFlag = true;
			for (var i = 0, len = $scope.spbtList.length; i < len; i++) {
				upArr.push({
					"id": $scope.spbtList[i].ID,
					"variantId": $scope.spbtList[i].VARIANTID
				})
			}
			console.log(upArr)
			erp.load()
			var upJson = {};
			upJson.bts = upArr;
			console.log(upJson)
			erp.postFun('caigou/procurement/gaiJiaGe2', JSON.stringify(upJson), function (data) {
				console.log(data)
				erp.closeLoad()
				if (data.data.statusCode == 200) {
					$scope.bianjiFlag = false;
					$scope.spbtList = null;
					getList(erp, $scope);
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		$scope.btCgLiuYanFun = function (liuYan) {
			$scope.gjcgLiuYan = liuYan;
			$scope.gjcgLiuYanFlag = true;
		}
		//清空所有
		$scope.qkFun = function (ev) {
			erp.load();
			erp.getFun('pojo/procurement/deleteAllOrderProcurement', function (data) {
				console.log(data)
				console.log(data.data[0])
				console.log(data.data[0].statusCode)
				if (data.data[0].statusCode == 200) {
					$(ev.target).hide();
					$scope.chudanliebiao = [];
					getList(erp, $scope);
				} else {
					layer.msg('清空失败')
				}
			}, err)
		}
		$scope.sxFun = function () {
			erp.getFun('pojo/procurement/flush', function (data) {
				console.log(data)
				if (data.data[0].statusCode == 200) {
					getList(erp, $scope);
				} else {
					layer.msg('刷新失败')
				}
			}, err)
		}
		//采购线下完成
		$scope.errFlag = false;
		var orderProcurementId = '';//存储变体id
		var xxwcArr = [];
		// $scope.xxwcFun = function (item) {
		//     xxwcArr = [];
		//     xxwcArr.push(item.ID+'')
		//     $scope.isSureXxcgFlag = true;
		// }
		$scope.qxXxcgFun = function () {
			$scope.isSureXxcgFlag = false;
		}
		$scope.sureXxcgFun = function () {
			erp.load();
			erp.postFun('caigou/procurement/xianXiaCaiGou', {
				"chuDanCaiGouIds": xxwcArr
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.isSureXxcgFlag = false;
					$scope.dingDanHFlag = true;
					$scope.dingDanHao = data.data.result;
				} else {
					layer.msg('线下采购失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		var zjwcArr = [];
		$scope.zjWcFun = function (item) {
			$scope.cgwcFlag = true;
			zjwcArr = [];
			zjwcArr.push(item.ID + '');
		}
		$scope.qxCgwcFun = function () {
			$scope.cgwcFlag = false;
			$scope.cgwcVal = '';
		}
		$scope.sureCgwcFun = function () {
			if (!$scope.cgwcVal) {
				layer.msg('请输入原因')
				return
			}
			erp.load()
			var cgwcData = {};
			cgwcData.chuDanCaiGouIds = zjwcArr;
			cgwcData.dingDanHao = $scope.cgwcVal;
			erp.postFun('caigou/procurement/zhiJieWanCheng', JSON.stringify(cgwcData), function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.cgwcFlag = false;
					layer.msg('成功')
					getList(erp, $scope);
				} else {
					layer.msg('失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		$scope.gbDdhFun = function () {
			$scope.dingDanHFlag = false;
			getList(erp, $scope);
		}
		//查看业务员
		$scope.viewFlag = false;
		$scope.viewFun = function (item) {
			console.log(item)
			$scope.viewFlag = true;
			$scope.ywyListArr = item.empSet;
			console.log($scope.ywyListArr)

		}
		$scope.viewCloseFun = function () {
			$scope.viewFlag = false;
			$scope.ywyListArr = [];
		}

		//选中 
		var firVid;
		var btIdArr = [];
		var btID = [];
		$scope.isCheckFun = function (item, index, ev, spitem, btlist) {
			// console.log(spitem)
			// console.log(btlist.length)
			// // console.log(spitem.PRODUCTId)
			console.log(item.checked)
			var checkedNum = 0;
			var btListArr = JSON.parse(spitem.SUPLLIERLINK)
			// var btLen = btListArr.length;//变体数组
			if (item.checked) {
				if (btIdArr.length < 1) {//第一次点击变体
					btIdArr.push(item.PRODUCTID)
					btID.push(item.ID + '')
					for (var i = 0; i < btlist.length; i++) {
						if (btlist[i]['checked'] == true) {
							checkedNum++;
						}
					}
					console.log('diyici')
				} else {
					if (btIdArr[0] == item.PRODUCTID) {//是同一个商品的变体
						btIdArr.push(item.PRODUCTID)
						console.log('666')
						btID.push(item.ID + '')
						for (var i = 0; i < btlist.length; i++) {
							if (btlist[i]['checked'] == true) {
								checkedNum++;
							}
						}
					} else {
						console.log('555')
						item.checked = false;
					}
				}
				// console.log(item)
				console.log('xuanzhong')
			} else {
				// btIdArr.pop()
				// btID.pop()
				btIdArr.pop()
				for (var i = 0, len = btID.length; i < len; i++) {
					if (item.ID == btID[i]) {
						btID.splice(i, 1)
						console.log(btID)
						break
					}
				}
				console.log('quxiao')
			}
			console.log(btID)
			console.log(btIdArr)
			if (checkedNum == btlist.length) {
				spitem.checked = true;
			} else {
				spitem.checked = false;
			}
		}
		// 选中所有商品
		$scope.checkAll = function (item, checkAllMark, e, list) {
			btID = [];//变体id数组置为空
			btIdArr = [];//存储商品id的数组置为空
			console.log(list)
			console.log(item)
			if (!item.btList) {
				layer.msg('请先查询变体');
				item.checked = false;
				return;
			} else {//如果该商品已经查询过变体
				if (item.checked) {
					for (var i = 0; i < list.length; i++) {//所有的商品变体的复选框置为非选中
						list[i].checked = false;
						if (list[i].btList) {
							for (var k = 0; k < list[i].btList.length; k++) {
								list[i].btList[k].checked = false;
							}
						}
					}
					item.checked = true;//本商品置为选中
					for (var i = 0; i < item.btList.length; i++) {//本商品的所有变体置为选中
						item.btList[i].checked = true;
						btID.push(item.btList[i].ID + '')
						btIdArr.push(item.PRODUCTId)
					}
					console.log(btID)
				} else {
					btIdArr = [];//存储商品id的数组置为空
					for (var i = 0; i < item.btList.length; i++) {
						item.btList[i].checked = false;
						btID = [];
					}
					console.log(btID)
				}
				console.log(btIdArr)
			}
		}
		//变体的复选框
		//批量采购
		$scope.bulkCgFlag = false;
		$scope.bulkCgFun = function () {
			if (btID.length < 1) {
				layer.msg('请选择变体')
				return;
			} else {
				$scope.btCheckedArr = [];
				$scope.bulkCgFlag = true;
				var isBreakOutFlag = false;
				console.log('$scope.chudanliebiao', $scope.chudanliebiao)
				for (var i = 0; i < $scope.chudanliebiao.length; i++) {
					console.log($scope.chudanliebiao[i]['btList'])
					if ($scope.chudanliebiao[i]['btList'] && $scope.chudanliebiao[i]['btList'].length > 0) {
						for (var j = 0, btLen = $scope.chudanliebiao[i]['btList'].length; j < btLen; j++) {
							if ($scope.chudanliebiao[i]['btList'][j].checked) {
								isBreakOutFlag = true;
								var cgArr = JSON.parse($scope.chudanliebiao[i].SUPLLIERLINK);
								console.log(cgArr)
								for (var k = 0, gysLen = cgArr.length; k < gysLen; k++) {
									cgArr[k]['dingDanZhuangtai'] = 'zhengChang'
								}
								$scope.cgList = cgArr;
								console.log($scope.cgList)
								break
							}
						}
						for (var k = 0, kLen = $scope.chudanliebiao[i]['btList'].length; k < kLen; k++) {
							if ($scope.chudanliebiao[i]['btList'][k].checked) {
								$scope.btCheckedArr.push(JSON.parse(JSON.stringify($scope.chudanliebiao[i]['btList'][k])))
							}
						}
					}
					if (isBreakOutFlag) {
						console.log('跳出外层循环')
						break
					}
				}
				console.log('---btCheckedArr->>>>>> cgList',$scope.btCheckedArr, $scope.cgList)
			}
		}
		$scope.sureBulkFun = function (item, index) {
			$scope.cgList = [];
			var ordNum = $("#bulkordnum" + index).val();
			var regBol = /^[0-9a-zA-Z]*$/g;
			if (!regBol.test(ordNum)) {
				layer.msg('请不要输入除了字母跟数字其它的字符串');
				return;
			}
			layer.load(2)
			erp.postFun("caigou/procurement/shengChengCaiGouDingDan", {
				"caiGouLianJie": item.name,
				"dingDanHao": ordNum,
				"chuDanCaiGouIds": btID,
				"dingDanZhuangtai": item.dingDanZhuangtai
			}, suc, err);
			function suc(a) {
				layer.closeAll('loading');
				$scope.bulkCgFlag = false;
				// $scope.flag1 = false;
				console.log(a)
				if (a.data.statusCode == 200) {
					layer.msg("添加成功")
					getList(erp, $scope);
					btIdArr = [];
				} else {
					layer.msg("添加失败")
				}
			};
		}
		$scope.bulkCloseFun = function () {
			$scope.bulkCgFlag = false;
			getList(erp, $scope);
			btID = [];//变体id数组置为空
			btIdArr = [];//存储商品id的数组置为空
		}
		$scope.bulkCgWcFun = function () {
			if (btID.length < 1) {
				layer.msg('请选择变体')
				return;
			} else {
				$scope.bulkCgwcFlag = true;
			}
		}
		$scope.bulksureCgwcFun = function () {
			erp.load()
			var cgwcData = {};
			cgwcData.chuDanCaiGouIds = btID;
			cgwcData.dingDanHao = '';
			erp.postFun('caigou/procurement/zhiJieWanCheng', JSON.stringify(cgwcData), function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.bulkCgwcFlag = false;
					layer.msg('成功')
					getList(erp, $scope);
					btID = [];//变体id数组置为空
					btIdArr = [];//存储商品id的数组置为空
				} else {
					layer.msg('失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		//单个线下完成
		$scope.xxcgCkVal = '0';
		$scope.xxwcFun = function (item) {
			$scope.bulkXxcgFlag = true;
			$scope.dingDanZhuangtai = 'zhengChang';
			var oneArr = [];
			oneArr.push({
				"ID": item.ID,
				"IMG": item.IMG,
				"PRODUCTID": item.PRODUCTID,
				"shortSku": item.shortSku,
				"SKU": item.SKU,
				"VARIANTID": item.VARIANTID,
				"xxcgNum": item.xxcgNum,
				"nameEn": item.nameEn
			})
			$scope.xxcgList = oneArr;
			console.log($scope.xxcgList)
		}
		$scope.importExcelFun = function () {
			$scope.importCgdFlag = true;
		}
		$scope.upLoadExcel = function (files) {
			console.log(files)
			var file = $("#upLoadInp").val();
			var index = file.lastIndexOf(".");
			console.log(file)
			var ext = file.substring(index + 1, file.length);
			console.log(ext)
			if (ext != "xlsx" && ext != "xls") {
				layer.msg('请上传excel')
				return;
			}
			erp.load()
			var formData = new FormData();
			formData.append('file', $("#upLoadInp")[0].files[0]);
			formData.append('type', 2)
			console.log(formData);
			erp.upLoadImgPost('caigou/procurement/importExcel', formData, function (data) {
				console.log(data)
				layer.closeAll('loading')
				$("#upLoadInp").val('')
				$scope.importCgdFlag = false;
				if (data.data.statusCode == 200) {
					layer.msg('上传成功')
					$scope.pageNum = '1';
					getListFun()
				} else if (data.data.statusCode == 505) {
					$scope.importExErrFlag = true;
					let mesStr = JSON.parse(data.data.message)
					for (let key in mesStr) {
						mesStr[key] = JSON.parse(mesStr[key])
					}
					$scope.mesErrObj = mesStr;
				} else (
					layer.msg(data.data.message)
				)
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		$scope.bulkTjcgdFun = function () {
			if (btID.length < 1) {
				layer.msg('请选择变体')
				return;
			} else {
				$scope.bulkTjcgsFlag = true;
			}
		}
		$scope.bulksureTjcgdFun = function () {
			console.log(btID)
			erp.load();
			erp.postFun('caigou/procurement/biaoJiYouhuo', {
				"chuDanCaiGouIds": btID
			}, function (data) {
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.bulkTjcgsFlag = false;
					$scope.pageNum = '1';
					getList(erp, $scope);
				} else {
					layer.msg('失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		//批量缺货
		$scope.bulQueHuoFun = function () {
			if (btID.length < 1) {
				layer.msg('请选择变体')
				return;
			} else {
				$scope.bulkQueHuoFlag = true;
				var cgArr = [];
				for (var i = 0; i < $scope.chudanliebiao.length; i++) {
					cgArr = [];
					if ($scope.chudanliebiao[i]['btList'] && $scope.chudanliebiao[i]['btList'].length > 0) {
						for (var j = 0, btLen = $scope.chudanliebiao[i]['btList'].length; j < btLen; j++) {
							if ($scope.chudanliebiao[i]['btList'][j].checked) {
								console.log($scope.chudanliebiao[i]['btList'][j])
								cgArr.push($scope.chudanliebiao[i]['btList'][j])
								console.log(cgArr)
								$scope.xxcgList = cgArr;
								console.log($scope.xxcgList)
							}
						}
					}
				}
			}
		}
		// 确定批量缺货
		$scope.bulksureQueHuoFun = function () {
			var queHuoIds = [];
			console.log($scope.xxcgList)
			for (var i = 0, len = $scope.xxcgList.length; i < len; i++) {
				console.log($scope.xxcgList[i].ID)
				queHuoIds.push($scope.xxcgList[i].ID)
			}
			erp.load();
			console.log(queHuoIds)
			erp.postFun('caigou/procurement/biaoJiQueHuo', {
				"chuDanCaiGouIds": queHuoIds
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.bulkQueHuoFlag = false;
					$scope.pageNum = '1';
					getList(erp, $scope);
				} else {
					layer.msg('失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})

		}
		//批量线下采购
		$scope.bulkXxcgFun = function () {
			if (btID.length < 1) {
				layer.msg('请选择变体')
				return;
			} else {
				$scope.bulkXxcgFlag = true;
				$scope.dingDanZhuangtai = 'zhengChang';
				var cgArr = [];
				for (var i = 0; i < $scope.chudanliebiao.length; i++) {
					cgArr = [];
					if ($scope.chudanliebiao[i]['btList'] && $scope.chudanliebiao[i]['btList'].length > 0) {
						for (var j = 0, btLen = $scope.chudanliebiao[i]['btList'].length; j < btLen; j++) {
							if ($scope.chudanliebiao[i]['btList'][j].checked) {
								console.log($scope.chudanliebiao[i]['btList'][j])
								cgArr.push($scope.chudanliebiao[i]['btList'][j])
								console.log(cgArr)
								$scope.xxcgList = cgArr;
								console.log($scope.xxcgList)
							}
						}
					}
				}
			}

		}
		$scope.xxcgNumfun = function (item, index) {
			console.log(index)
			console.log($scope.xxcgList)
			$scope.xxcgList['xxcgNum'] = item.xxcgNum;
		}
		$scope.xxcgdanJIafun = function (item, index) {
			console.log(index)
			console.log($scope.xxcgList)
			$scope.xxcgList['danJia'] = item.danJia;
		}
		$scope.bulkXxcgSureFun = function () {
			console.log($scope.xxcgList)
			if (!$scope.cgrMoneyCount) {
				layer.msg('请输入采购金额')
				return
			}
			var isNumFlag = true;
			var jsonArr = [];
			for (var i = 0, len = $scope.xxcgList.length; i < len; i++) {
				if (!$scope.xxcgList[i].xxcgNum || !$scope.xxcgList[i].danJia) {
					isNumFlag = false;
					break
				}
				jsonArr.push({
					"id": $scope.xxcgList[i].ID,
					"cjImg": $scope.xxcgList[i].IMG,
					"cjProductId": $scope.xxcgList[i].PRODUCTID,
					"cjShortSku": $scope.xxcgList[i].shortSku,
					"cjSku": $scope.xxcgList[i].SKU,
					"cjStanproductId": $scope.xxcgList[i].VARIANTID,
					"shuLiang": $scope.xxcgList[i].xxcgNum,
					"danJia": $scope.xxcgList[i].danJia,
					"cjHuoWuBiaoTi": $scope.xxcgList[i].nameEn
				})
			}
			if (!isNumFlag) {
				layer.msg('请为所有SKU填写数量')
				return
			}
			erp.load()
			var xxcgJson = {};
			xxcgJson.dingDanZhuangtai = $scope.dingDanZhuangtai;
			xxcgJson.gongSiMing = $scope.cgrModel;
			xxcgJson.zhiFu = $scope.cgrMoneyCount;
			xxcgJson.cangKu = $scope.xxcgCkVal;
			xxcgJson.skuNums = jsonArr;
			erp.postFun('caigou/procurement/xianXiaCaiGou', JSON.stringify(xxcgJson), function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.bulkXxcgFlag = false;
					$scope.dingDanHFlag = true;
					$scope.dingDanHao = data.data.result;
					$scope.cgrModel = '';
					$scope.cgrMoneyCount = '';
				} else {
					layer.msg('线下采购失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})

		}
		let lastScroll
		$(window).scroll(function () {
			var before = $(window).scrollTop();
			if (before > 60) {
				$('.tit-box').css({
					"position": "fixed",
					"top": 0
				})
			} else if (before < 10) {
				$('.tit-box').css({
					"position": "static",
					"top": 0
				})
			}
		});
		//批量关联
		$scope.plGuanLianFun = function (item) {
			console.log('$scope.cgBtItemObj --->> ', item)
			$scope.cgBtItemObj = item;
			$scope.oneOrMoreFlag = 'more';
			$scope.seletedCgLink = item.name;
			// erp.postFun('caigou/alProduct/getAlProductByUrl', {
			erp.postFun('caigou/alProduct/getAlProduct', {
				"url": item.name,
				"caigoubiaoji": item.dingDanZhuangtai
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.plBianTiFlag = true;
					$scope.glBtList = data.data.result.product;
					$scope.glBtsArr = data.data.result.product[0].stanProducts;
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		$scope.show1688BtFun = function (item, index) {//显示1688变体 跟当前变体关联
			$scope.plGuanLianFlag = true;
			$scope.checkedBtIndex = index;
			console.log($scope.checkedBtIndex)
			for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
				$scope.glBtsArr[i].isDefault = false;
			}
		}
		$scope.plCheckBtFun = function (item) {
			for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
				$scope.glBtsArr[i].isDefault = false;
			}
			item.isDefault = true;
			$scope.gl1688ItemObj = item;
			$scope.isGuanLianFlag = true;//是否有关联
			console.log($scope.btCheckedArr[$scope.checkedBtIndex])
			// $scope.btCheckedArr[$scope.checkedBtIndex].glxzObject = item
			// console.log($scope.btCheckedArr[$scope.checkedBtIndex].glxzObject)
			const obj1 = Object.assign({},
				$scope.btCheckedArr[$scope.checkedBtIndex].glxzObject,
				{ [$scope.seletedCgLink]: item });
			$scope.btCheckedArr[$scope.checkedBtIndex].glxzObject = obj1
			console.log($scope.btCheckedArr[$scope.checkedBtIndex].glxzObject)
			$scope.btCheckedArr[$scope.checkedBtIndex].glxzArr = objToArrFn($scope.btCheckedArr[$scope.checkedBtIndex].glxzObject);
			// glxzObj[$scope.seletedCgLink] = item
			// $scope.glxzArr = objToArrFn(glxzObj);
			$scope.btCheckedArr[$scope.checkedBtIndex].guanLianObj = item;
			console.log($scope.btCheckedArr[$scope.checkedBtIndex])
			$scope.plGuanLianFlag = false;
		}
		$scope.delYglFun = function (glitem, pIndex) {
			let link = glitem.cgLink;
			console.log($scope.btCheckedArr[pIndex].glxzObject[link])
			delete $scope.btCheckedArr[pIndex].glxzObject[link]
			$scope.btCheckedArr[pIndex].glxzArr = objToArrFn($scope.btCheckedArr[pIndex].glxzObject)
			console.log($scope.btCheckedArr[pIndex])
		}
		$scope.plCloseGuanLianFun = function () {
			for (let i = 0, len = $scope.btCheckedArr.length; i < len; i++) {
				if ($scope.btCheckedArr[i].guanLianObj) {
					console.log($scope.btCheckedArr[i])
					delete $scope.btCheckedArr[i].guanLianObj
					console.log($scope.btCheckedArr[i])
				}
			}
			$scope.plBianTiFlag = false;
		}
		$scope.plSureGuanlianFun = function () {//确定建立批量的关联关系
			let caigouCaigouguanlian = {};
			caigouCaigouguanlian.caiGouGuanLianList = [];
			console.log(btID, $scope.cgBtItemObj)
			for (let i = 0, len = $scope.btCheckedArr.length; i < len; i++) {
				if ($scope.btCheckedArr[i].glxzArr) {
					for (let k = 0, kLen = $scope.btCheckedArr[i].glxzArr.length; k < kLen; k++) {
						let upIdArr = [];
						upIdArr.push($scope.btCheckedArr[i].ID)
						let obj = {
							"chuDanCaiGouIds": upIdArr,
							"dingDanZhuangtai": $scope.cgBtItemObj.dingDanZhuangtai,
							"stanId": $scope.btCheckedArr[i].VARIANTID,//变体id
							"locId": $scope.btCheckedArr[i].PRODUCTID,//商品id
							"specId": $scope.btCheckedArr[i].guanLianObj.specId,//1688变体id
							"offerId": $scope.glBtList[0].offerId,//1688商品id
							"minOrderQuantity": $scope.glBtList[0].minOrderQuantity,//1688起批量
							"qualityLevel": $scope.glBtList[0].qualityLevel,//供应商星级
							"supplierLoginId": $scope.glBtList[0].supplierLoginId,//供应商名称
							"quantity": $scope.btCheckedArr[i].ORDERNEEDCOUNT,//变体中退件采购数量
							"supplierUserId": $scope.glBtList[0].supplierUserId,
							"caiGouLianJie": $scope.btCheckedArr[i].glxzArr[k].cgLink,
							"price": $scope.btCheckedArr[i].glxzArr[k].sellPrice,
							"skuCode": $scope.btCheckedArr[i].glxzArr[k].stanSkuZw, //1688变体sku
							"amountOnSale": $scope.btCheckedArr[i].glxzArr[k].amountOnSale //1688库存
						}
						caigouCaigouguanlian.caiGouGuanLianList.push(obj)
					}
					// let upIdArr = [];
					// upIdArr.push($scope.btCheckedArr[i].ID)
					// let obj ={
					//     "caiGouLianJie": $scope.cgBtItemObj.name,
					//     "chuDanCaiGouIds": upIdArr,
					//     "dingDanZhuangtai": $scope.cgBtItemObj.dingDanZhuangtai,
					//     "stanId": $scope.btCheckedArr[i].VARIANTID,//变体id
					//     "locId": $scope.btCheckedArr[i].PRODUCTID,//商品id
					//     "specId": $scope.btCheckedArr[i].guanLianObj.specId,//1688变体id
					//     "offerId": $scope.glBtList[0].offerId,//1688商品id
					//     "quantity": $scope.btCheckedArr[i].ORDERNEEDCOUNT,//变体中退件采购数量
					//     "supplierUserId": $scope.glBtList[0].supplierUserId,
					//     "price": $scope.gl1688ItemObj.sellPrice,
					//     "skuCode": $scope.gl1688ItemObj.stanSkuZw //1688变体sku
					// }
					// caigouCaigouguanlian.caiGouGuanLianList.push(obj)
				} else {
					layer.msg('请为每个变体都建立关联关系')
					return
				}
			}
			caigouCaigouguanlian.dingDanZhuangtai = $scope.cgBtItemObj.dingDanZhuangtai;
			// caigouCaigouguanlian.caiGouLianJie = $scope.cgBtItemObj.name;
			caigouCaigouguanlian.supplierUserId = $scope.glBtList[0].supplierUserId;
			caigouCaigouguanlian = JSON.stringify(caigouCaigouguanlian)
			erp.postFun('caigou/alProduct/jianLiCaiGouGuanLian', caigouCaigouguanlian, function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.plBianTiFlag = false;
					$scope.bulkCgFlag = false;
					$scope.gl1688ItemObj = '';
					getList(erp, $scope);
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		$scope.glxzArr = [];//关联选中的变体集合
		let glxzObj = {};//关联选中的对象
		//关联
		$scope.guanLianFun = function (item) {// 12-03采购修改 出单采购 --- 2-1-2 1688api采购  显示关联弹窗
			$scope.cgBtItemObj = item;
			console.log('guanLianFun ---->> item', item)
			$scope.seletedCgLink = item.name;
			$scope.oneOrMoreFlag = 'one';
			erp.postFun('caigou/alProduct/getAlProduct', {
				"url": item.name,
				"caigoubiaoji": item.dingDanZhuangtai,
				"stanId": $scope.variantId
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.guanLianFlag = true;
					$scope.glBtList = data.data.result.product;
					$scope.glBtsArr = data.data.result.product[0].stanProducts;
					for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
						if ($scope.glBtsArr[i].isDefault) {
							glxzObj[$scope.seletedCgLink] = $scope.glBtsArr[i]
							$scope.glxzArr = objToArrFn(glxzObj);
							console.log($scope.glxzArr)
							$scope.gl1688ItemObj = $scope.glBtsArr[i];
							$scope.isGuanLianFlag = true;
							break
						}
					}
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		$scope.openJxglFun = function (index) {
			$scope.jxglFlag = true;
			$scope.checkedBtIndex = index;
		}
		$scope.checkCgLinkFun = function (item) {//选择采购链接
			console.log(item)
			$scope.seletedCgLink = item.name
		}
		$scope.linkQeryBtFun = function () {//根据链接获取变体
			erp.postFun('caigou/alProduct/getAlProduct', {
				"url": $scope.seletedCgLink
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.jxglFlag = false;
					$scope.glBtList = data.data.result.product;
					$scope.glBtsArr = data.data.result.product[0].stanProducts;
					for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
						if ($scope.glBtsArr[i].isDefault) {
							$scope.gl1688ItemObj = $scope.glBtsArr[i];
							break
						}
					}
					if ($scope.oneOrMoreFlag == 'more') {
						$scope.plGuanLianFlag = true;
					}
				} else {
					layer.msg(data.data.message)
					$scope.glBtList = [];
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		$scope.checkBtFun = function (item) {
			for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
				$scope.glBtsArr[i].isDefault = false;
			};
			glxzObj[$scope.seletedCgLink] = item;
			$scope.glxzArr = objToArrFn(glxzObj);
			console.log($scope.glxzArr)
			item.isDefault = true;
			$scope.gl1688ItemObj = item;
			$scope.isGuanLianFlag = true;//是否有关联
		}
		$scope.delGlgxFun = function (item) {
			let link = item.cgLink;
			delete glxzObj[link]
			$scope.glxzArr = objToArrFn(glxzObj)
		}
		function objToArrFn(obj) {
			let arr = [];
			for (let key in obj) {
				obj[key]['cgLink'] = key;
				arr.push(obj[key])
			}
			return arr
		}
		$scope.sureGuanlianFun = function () {// 12-03采购修改 出单采购 --- 2-1-2-2 1688api采购  关联1688 变体
			if (!$scope.gl1688ItemObj) {
				layer.msg('请选择一个变体')
				return
			}
			let caigouCaigouguanlian = {};
			caigouCaigouguanlian.caiGouGuanLianList = [];
			console.log(btID, $scope.glxzArr)
			for (let i = 0, len = $scope.glxzArr.length; i < len; i++) {
				let obj = {
					"caiGouLianJie": $scope.cgBtItemObj.name,
					"chuDanCaiGouIds": $scope.btArr,
					"dingDanZhuangtai": $scope.cgBtItemObj.dingDanZhuangtai,
					"stanId": $scope.btItemObj.VARIANTID,//变体id
					"locId": $scope.btItemObj.PRODUCTID,//商品id
					"offerId": $scope.glBtList[0].offerId,//1688商品id
					"minOrderQuantity": $scope.glBtList[0].minOrderQuantity,//1688起批量
					"qualityLevel": $scope.glBtList[0].qualityLevel,//供应商星级
					"supplierLoginId": $scope.glBtList[0].supplierLoginId,//供应商名称
					"quantity": $scope.cgBtItemObj.ORDERNEEDCOUNT,//采购数量
					"supplierUserId": $scope.glBtList[0].supplierUserId,
					"price": $scope.glxzArr[i].sellPrice,
					"skuCode": $scope.glxzArr[i].stanSkuZw, //1688变体sku
					"specId": $scope.glxzArr[i].specId,//1688变体id
					"amountOnSale": $scope.glxzArr[i].amountOnSale,//1688库存
				}
				caigouCaigouguanlian.caiGouGuanLianList.push(obj)
			}
			// let obj ={
			//     "caiGouLianJie": $scope.cgBtItemObj.name,
			//     "chuDanCaiGouIds": $scope.btArr,
			//     "dingDanZhuangtai": $scope.cgBtItemObj.dingDanZhuangtai,
			//     "stanId": $scope.btItemObj.VARIANTID,//变体id
			//     "locId": $scope.btItemObj.PRODUCTID,//商品id
			//     "offerId": $scope.glBtList[0].offerId,//1688商品id
			//     "quantity": $scope.cgBtItemObj.ORDERNEEDCOUNT,//采购数量
			//     "supplierUserId":  $scope.glBtList[0].supplierUserId,
			//     "price": $scope.gl1688ItemObj.sellPrice,
			//     "skuCode": $scope.gl1688ItemObj.stanSkuZw //1688变体sku
			//     "specId": $scope.gl1688ItemObj.specId,//1688变体id
			// }
			// caigouCaigouguanlian.caiGouGuanLianList.push(obj)
			caigouCaigouguanlian.dingDanZhuangtai = $scope.cgBtItemObj.dingDanZhuangtai;
			caigouCaigouguanlian.caiGouLianJie = $scope.cgBtItemObj.name;
			caigouCaigouguanlian.supplierUserId = $scope.glBtList[0].supplierUserId
			// console.log(caigouCaigouguanlian)
			// return
			erp.postFun('caigou/alProduct/jianLiCaiGouGuanLian', caigouCaigouguanlian, function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.guanLianFlag = false;
					$scope.flag1 = false;
					$scope.gl1688ItemObj = '';
					$scope.glxzArr = [];
					glxzObj = {};
					getList(erp, $scope);
				}
			}, function (data) {
				console.log(data)
			})
		}

	}])
	//erp采购_区间时间大于一定次数的列表
	app.controller('purchaseHistoryCtrl', ['$scope', "erp", function ($scope, erp) {
		console.log('采购历史')
		$scope.searchKey = 'sku';
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.startTime = '';
		$scope.endTime = '';
		function getListFun() {
			erp.load()
			var printData = {};
			printData.pageNo = $scope.pageNum + '';
			printData.pageSize = $scope.pageSize;
			// printData[$scope.searchKey] = $scope.searchVal;
			// printData.beginDate = $('#c-data-time').val();
			// printData.endDate = $('#cdatatime2').val();
			erp.postFun('caigou/statistics/selectStatisticsSupplierList', JSON.stringify(printData), function (data) {
				console.log(data)
				console.log(data.result)
				var obj = data.data.result;
				layer.msg(data.data.message)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.erpordTnum = obj.totalCount;
					$scope.erporderList = obj.list;
					console.log($scope.erporderList)
					console.log($scope.erpordTnum)
					dealpage()
				} else {
					layer.msg('查询失败')
				}
			}, function (data) {
				layer.closeAll('loading')
				console.log(data)
			})
		}
		getListFun()
		$('.c-seach-inp').keypress(function (ev) {
			if (ev.keyCode == 13) {
				$scope.searchFun()
			}
		})
		$scope.searchFun = function () {
			$scope.pageNum = '1';
			$scope.startTime = $('#c-data-time').val();
			$scope.endTime = $('#cdatatime2').val();
			var val = $('#selectSearch').val();
			getListFun()
		}
		$scope.pageChange = function () {
			$scope.pageNum = '1';
			getListFun()
		}
		$scope.gopageFun = function () {
			if (!(/(^[1-9]\d*$)/.test($scope.pageNum)) || $scope.pageNum > Math.ceil($scope.erpordTnum / $scope.pageSize)) {
				$scope.pageNum = '1';
				layer.msg('请输入正确页码')
				return;
			}
			layer.load(2)
			getListFun()
		}
		$(window).scroll(function () {
			var before = $(window).scrollTop();
			if (before > 60) {
				$('.tit-box').css({
					"position": "fixed",
					"top": 0
				})
			} else {
				$('.tit-box').css({
					"position": "static",
					"top": 0
				})
			}
		});
		$scope.detailFun = function (item) {
			location.href = "#/erppurchase/purhistorydetail/" + item.gongHuoGongSi;
		}
		function dealpage() {
			erp.load();
			console.log($scope.erpordTnum)
			if (!$scope.erpordTnum || $scope.erpordTnum <= 0) {
				layer.msg('未找到数据')
				layer.closeAll("loading")
				return;
			}
			console.log($scope.erpordTnum)
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: $scope.pageSize * 1,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.pageNum * 1,
				activeClass: 'active',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
				last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
				onPageChange: function (n, type) {
					console.log(n)
					console.log(n, type)
					// alert(33333333333)
					if (type == 'init') {
						layer.closeAll("loading")
						return;
					}
					layer.load(2)
					$scope.pageNum = n;
					getListFun()
				}
			});
		}
	}])
	//erp采购_区间时间大于一定次数的列表 详情列表
	app.controller('purchaseHistoryDetailCtrl', ['$scope', "erp", "$routeParams", function ($scope, erp, $routeParams) {
		console.log('采购历史详情')
		$scope.searchKey = 'sku';
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.startTime = '';
		$scope.endTime = '';
		let gongHuoGongSi = $routeParams.ghgsName;
		function getListFun() {
			erp.load()
			var printData = {};
			printData.pageNo = $scope.pageNum + '';
			printData.pageSize = $scope.pageSize;
			printData.gongHuoGongSi = gongHuoGongSi;
			// printData[$scope.searchKey] = $scope.searchVal;
			// printData.beginDate = $('#c-data-time').val();
			// printData.endDate = $('#cdatatime2').val();
			erp.postFun('caigou/statistics/selectStatisticsSupplierProductList', JSON.stringify(printData), function (data) {
				console.log(data)
				console.log(data.result)
				var obj = data.data.result;
				layer.msg(data.data.message)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					$scope.erpordTnum = obj.totalCount;
					$scope.erporderList = obj.list;
					console.log($scope.erporderList)
					console.log($scope.erpordTnum)
					dealpage()
				} else {
					layer.msg('查询失败')
				}
			}, function (data) {
				layer.closeAll('loading')
				console.log(data)
			})
		}
		getListFun()
		$('.c-seach-inp').keypress(function (ev) {
			if (ev.keyCode == 13) {
				$scope.searchFun()
			}
		})
		$scope.searchFun = function () {
			$scope.pageNum = '1';
			$scope.startTime = $('#c-data-time').val();
			$scope.endTime = $('#cdatatime2').val();
			var val = $('#selectSearch').val();
			getListFun()
		}
		$scope.pageChange = function () {
			$scope.pageNum = '1';
			getListFun()
		}
		$scope.gopageFun = function () {
			if (!(/(^[1-9]\d*$)/.test($scope.pageNum)) || $scope.pageNum > Math.ceil($scope.erpordTnum / $scope.pageSize)) {
				$scope.pageNum = '1';
				layer.msg('请输入正确页码')
				return;
			}
			layer.load(2)
			getListFun()
		}
		$(window).scroll(function () {
			var before = $(window).scrollTop();
			if (before > 60) {
				$('.tit-box').css({
					"position": "fixed",
					"top": 0
				})
			} else {
				$('.tit-box').css({
					"position": "static",
					"top": 0
				})
			}
		});
		function dealpage() {
			erp.load();
			console.log($scope.erpordTnum)
			if (!$scope.erpordTnum || $scope.erpordTnum <= 0) {
				layer.msg('未找到数据')
				layer.closeAll("loading")
				return;
			}
			console.log($scope.erpordTnum)
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: $scope.pageSize * 1,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.pageNum * 1,
				activeClass: 'active',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
				last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
				onPageChange: function (n, type) {
					console.log(n)
					console.log(n, type)
					// alert(33333333333)
					if (type == 'init') {
						layer.closeAll("loading")
						return;
					}
					layer.load(2)
					$scope.pageNum = n;
					getListFun()
				}
			});
		}
	}])
	//erp采购_到货异常
	app.controller('arrivalabnormalCtrl', ['$scope', function ($scope) {
		console.log('arrivalabnormalCtrl')
	}])
	//erp采购 采购单列表
	app.controller('cgdlistCtrl', ['$scope', 'erp', function ($scope, erp) {
		// alert('采购单')
		$scope.pageSize = '20';
		$scope.pageNum = '1';
		$scope.totalNum = 0;
		$scope.totalPageNum = 0;

		$scope.messageFlag = false;
		var clickItem;
		$scope.aaa = function (item) {
			//        	console.log(item);
			$scope.messageArea = item.remark;
			clickItem = item;
			//        	console.log(productId);
			$scope.messageFlag = true;

		}
		$scope.messageCloseFun = function () {
			//        	console.log(111);
			$scope.messageFlag = false;
		}


		function cgListFun() {
			erp.load();
			var cgData = {};
			cgData.status = '';
			cgData.inputStr = $scope.searchVal;
			cgData.pageNum = $scope.pageNum + '';
			cgData.pageSize = $scope.pageSize + '';
			console.log(JSON.stringify(cgData))
			erp.postFun("pojo/procurement/procurementBillList", JSON.stringify(cgData), function (data) {
				console.log(data)
				erp.closeLoad();
				// console.log(data.data.result)
				var list = JSON.parse(data.data.result);
				console.log(list)
				if (list.totle == 0) {
					$scope.totalpage = 0;
					layer.msg("没有找到数据");
					$scope.cgList = [];
					$scope.countMoney = 0;
					//   return;
				}
				$scope.totalNum = list.totle;
				$scope.cgList = list.list;
				console.log($scope.cgList)
				countMFun($scope.cgList);
				$scope.totalPageNum = Math.ceil($scope.totalNum / ($scope.pagesize * 1));
				pageFun(erp, $scope);
			}, function (data) {
				console.log(data)
			})
		}
		function countMFun(val) {
			var len = val.length;
			var count = 0;
			for (var i = 0; i < len; i++) {
				count += val[i].costPrice * val[i].COUNT;
			}
			$scope.countMoney = count.toFixed(2)
			console.log($scope.countMoney);
		}
		//分页
		function pageFun(erp, $scope) {
			$("#pagination1").jqPaginator({
				totalCounts: $scope.totalNum || 1,
				pageSize: $scope.pageSize * 1,
				visiblePages: 5,
				currentPage: $scope.pageNum * 1,
				activeClass: 'current',
				first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				onPageChange: function (n, type) {
					if (type == 'init') {
						return;
					};
					erp.load();
					$scope.pageNum = n;
					var cgData = {};
					cgData.status = ''
					cgData.inputStr = $scope.searchVal;
					cgData.pageNum = $scope.pageNum + '';
					cgData.pageSize = $scope.pageSize + '';
					console.log(JSON.stringify(cgData))
					erp.postFun("pojo/procurement/procurementBillList", JSON.stringify(cgData), function (data) {
						erp.closeLoad();
						console.log(data)
						if (data.data.totle == 0) {
							$scope.totalpage = 0;
							layer.msg("没有找到数据");
							return;
						}
						// console.log(data.data.result)
						var list = JSON.parse(data.data.result);
						console.log(list)
						$scope.totalNum = list.totle;
						$scope.cgList = list.list;
						console.log($scope.cgList)
						$scope.totalPageNum = Math.ceil($scope.totalNum / ($scope.pagesize * 1));
					}, function (data) {
						erp.closeLoad();
						console.log(data)
					})
				}
			});
		}
		cgListFun(erp, $scope);
		$scope.changePageSize = function () {
			$scope.pageNum = '1';
			cgListFun(erp, $scope);
		}
		$scope.toSpecifiedPage = function () {
			var totalPage = Math.ceil($scope.totalNum / $scope.pageSize);
			if (!(/(^[1-9]\d*$)/.test($scope.pageNum)) || $scope.pageNum > totalPage) {
				layer.msg("请输入正确页码");
				$scope.pageNum = '1';
				return;
			}
			cgListFun(erp, $scope);
		}
		//搜索
		//按sku进行搜索
		$('.search-inp').keypress(function (Event) {
			if (Event.keyCode == 13) {
				$scope.SearchFun();
			}
		})
		$scope.SearchFun = function () {
			$scope.pageNum = 1;
			cgListFun(erp, $scope);
		}

		erp.getFun('pojo/procurement/getLogistic', function (data) {
			console.log(data)
			var obj = JSON.parse(data.data.result);
			console.log(obj)
			$scope.logistArr = obj.list;
		}, function (data) {
			console.log('物流获取失败')
		})
		erp.getFun('app/storage/getStorage', function (data) {
			console.log(data)
			var obj = JSON.parse(data.data.result);
			console.log(obj)
			$scope.ckArr = obj;
		}, function (data) {
			erp.closeLoad();
			console.log('仓库获取失败')
		})
		//批量填写运单号
		$scope.bulkTxFlag = false;
		var bulkId = '';
		var bulkOrdIds = '';
		$scope.bulkTxFun = function () {
			var bulkCount = 0;
			bulkId = '';
			$('#ea-list-table .cg-checkbox').each(function () {
				if ($(this).attr('src') == "static/image/order-img/multiple2.png") {
					bulkCount++;
					bulkId += $(this).siblings('.cg-list-id').text() + ',';
					bulkOrdIds += $(this).siblings('.cg-ord-id').text() + ',';
				}
			})
			if (bulkCount < 1) {
				layer.msg('请选择')
			} else {
				$scope.bulkTxFlag = true;
			}
			console.log(bulkId)
		}
		$scope.bulkTxSureFun = function () {
			console.log(bulkId)
			console.log(bulkOrdIds)
			var ordIdList = bulkOrdIds.split(',');
			console.log(ordIdList)
			var selCount = ordIdList.length;
			console.log(selCount)
			// var logistObj = $('.sel-wlname').eq(1).val();
			// var ckObj = $('.sel-ckname').eq(1).val();
			// console.log(logistObj)
			// console.log(logistObj+'---'+ckObj)
			if ($scope.ydhNum == undefined || $scope.ydhNum == '') {
				layer.msg('请输入运单号');
				return;
			}
			// if($scope.countNum==undefined||$scope.countNum==''){
			//     layer.msg('请输入数量');
			//     return;
			// }
			if ($scope.addWlSel == undefined || $scope.addWlSel == '') {
				layer.msg('请选择物流');
				return;
			} else {
				console.log($scope.addWlSel)
				var logistName = $scope.addWlSel.split('#')[0];
				var logistId = $scope.addWlSel.split('#')[1];
			}
			for (var i = 0; i < selCount; i++) {
				if ($scope.ydhNum == ordIdList[i]) {
					layer.msg('该运单号与选中的订单号重复,请换一个运单号')
					return;
				}
			}
			// if ($scope.addCkSel==undefined||$scope.addCkSel=='') {
			//     layer.msg('请选择仓库');
			//     return;
			// } else {
			//     console.log($scope.addCkSel)
			//     var ckName = $scope.addCkSel.split('#')[0];
			//     var ckId = $scope.addCkSel.split('#')[1];
			// }
			erp.load();
			var addData = {};
			addData.procurementBillId = bulkId;
			// addData.count = $scope.countNum;
			addData.wayBill = $scope.ydhNum;
			addData.logisticId = logistId;
			addData.logistic = logistName;
			addData.storageName = '1';
			addData.storageId = '1';
			console.log(JSON.stringify(addData))
			erp.postFun('pojo/procurement/addWayBill', JSON.stringify(addData), function (data) {
				erp.closeLoad();
				$scope.countNum = '';
				$scope.ydhNum = '';
				$scope.addCkSel = '';
				$scope.addWlSel = '';
				$scope.bulkTxFlag = false;
				console.log(data)
				if (data.data.statusCode == 200) {
					layer.msg('添加成功')
					cgListFun(erp, $scope);
				} else {
					layer.msg('添加失败')
				}
			}, err)
		}
		$scope.bulkTxQxFun = function () {
			$scope.bulkTxFlag = false;
			$scope.countNum = '';
			$scope.ydhNum = '';
			$scope.addCkSel = '';
			$scope.addWlSel = '';
		}
		//添加运单号
		$scope.isaddFlag = false;
		$scope.addydFun = function (item) {
			$scope.isaddFlag = true;
			console.log(item.ID)
			$scope.listId = item.ID;
			$scope.itemOrderId = item.PROCUREMENTORDERID;
		}
		$scope.sureAddFun = function () {
			if ($scope.ydhNum == undefined || $scope.ydhNum == '') {
				layer.msg('请输入运单号');
				return;
			}
			if ($scope.countNum == undefined || $scope.countNum == '') {
				layer.msg('请输入数量');
				return;
			}
			if ($scope.addWlSel == undefined || $scope.addWlSel == '') {
				layer.msg('请选择物流');
				return;
			} else {
				console.log($scope.addWlSel)
				var logistName = $scope.addWlSel.split('#')[0];
				var logistId = $scope.addWlSel.split('#')[1];
			}
			if ($scope.ydhNum == $scope.itemOrderId) {
				layer.msg('运单号跟订单号不能相同')
				return;
			}
			erp.load();
			var addData = {};
			addData.procurementBillId = $scope.listId;
			addData.count = $scope.countNum;
			addData.wayBill = $scope.ydhNum;
			addData.logisticId = logistId;
			addData.logistic = logistName;
			addData.storageName = '1';
			addData.storageId = '1';
			console.log(JSON.stringify(addData))
			erp.postFun('pojo/procurement/addWayBill', JSON.stringify(addData), function (data) {
				erp.closeLoad();
				$scope.isaddFlag = false;
				$scope.countNum = '';
				$scope.ydhNum = '';
				$scope.addCkSel = '';
				$scope.addWlSel = '';
				console.log(data)
				if (data.data.statusCode == 200) {
					layer.msg('添加成功')
					cgListFun(erp, $scope);
				} else {
					layer.msg('添加失败')
				}
			}, err)
		}
		$scope.closeaddydFun = function () {
			$scope.isaddFlag = false;
			$scope.countNum = '';
			$scope.ydhNum = '';
			$scope.addCkSel = '';
			$scope.addWlSel = '';
		}
		//显示大图
		$('#ea-list-table').on('mouseenter', '.s-img', function () {
			$(this).siblings('.hide-bigimg').show();
		})
		$('#ea-list-table').on('mouseenter', '.hide-bigimg', function () {
			$(this).show();
		})
		$('#ea-list-table').on('mouseleave', '.s-img', function () {
			$(this).siblings('.hide-bigimg').hide();
		})
		$('#ea-list-table').on('mouseleave', '.hide-bigimg', function () {
			$(this).hide();
		})
		//选中
		$('.cg-checkall').click(function () {
			if ($(this).attr('src') == "") {
				// statement
			} else {
				// statement
			}
		})
		var cziIndex = 0;
		$('#ea-list-table').on('click', '.cg-checkbox', function () {
			if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
				$(this).attr('src', 'static/image/order-img/multiple2.png');
				cziIndex++;
				if (cziIndex == $('#ea-list-table .cg-checkbox').length) {
					$('#ea-list-table .cg-checkall').attr('src', 'static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src', 'static/image/order-img/multiple1.png');
				cziIndex--;
				if (cziIndex != $('#ea-list-table .cg-checkbox').length) {
					$('#ea-list-table .cg-checkall').attr('src', 'static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#ea-list-table').on('click', '.cg-checkall', function () {
			if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
				$(this).attr('src', 'static/image/order-img/multiple2.png');
				cziIndex = $('#ea-list-table .cg-checkbox').length;
				$('#ea-list-table .cg-checkbox').attr('src', 'static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src', 'static/image/order-img/multiple1.png');
				cziIndex = 0;
				$('#ea-list-table .cg-checkbox').attr('src', 'static/image/order-img/multiple1.png');
			}
		})
		// $('#ea-list-table .ord-val').attr('disabled',true)
		//复制运单号
		$scope.copyFun = function (ev) {
			// var copyText = $(ev.target).siblings('.ord-val').text();
			var hideInpVal = $(ev.target).siblings('.ord-val')[0];
			hideInpVal.select(); // 选中文本
			var isCopyFlag = document.execCommand("copy"); // 执行浏览器复制命令
			if (isCopyFlag) {
				layer.msg('复制成功')
			}
			console.log(hideInpVal)
		}
		//批量修改运单号
		$scope.xgydhFlag = false;
		$scope.xgydhFun = function () {
			var bulkCount = 0;
			bulkId = '';
			$('#ea-list-table .cg-checkbox').each(function () {
				if ($(this).attr('src') == "static/image/order-img/multiple2.png") {
					bulkCount++;
					bulkId += $(this).siblings('.cg-list-id').text() + ',';
				}
			})
			if (bulkCount < 1) {
				layer.msg('请选择')
			} else {
				$scope.xgydhFlag = true;
			}
			console.log(bulkId)
		}
		$scope.xgydhQxFun = function () {
			$scope.xgydhFlag = false;
			$('.xgydh-inp').val('');
		}
		$scope.xgydhSureFun = function () {
			console.log(bulkId)
			var inpVal = $.trim($('.xgydh-inp').val());
			if (!inpVal) {
				layer.msg('请输入运单号');
				return;
			}
			erp.load();
			var addData = {};
			addData.procurementBillId = bulkId;
			addData.procurementOrderId = inpVal;
			console.log(JSON.stringify(addData))
			erp.postFun('pojo/procurement/addOrderIdtoBills', JSON.stringify(addData), function (data) {
				erp.closeLoad();
				$scope.xgydhFlag = false;
				console.log(data)
				if (data.data.statusCode == 200) {
					layer.msg('添加成功')
					cgListFun(erp, $scope);
				} else {
					layer.msg('添加失败')
				}
			}, err)
		}
		//为指定订单号添加运单号
		$scope.bulkydhTjFlag = false;
		$scope.zdydFun = function () {
			$scope.bulkydhTjFlag = true;
		}
		$scope.bulkydhTjSureFlag = function () {
			// var logistObj = $('.sel-wlname').eq(1).val();
			// var ckObj = $('.sel-ckname').eq(1).val();
			// console.log(logistObj)
			// console.log(logistObj+'---'+ckObj)
			if (!$scope.tjydhOrdNum) {
				layer.msg('请输入订单号');
				console.log($scope.tjydhOrdNum)
				return;
			}
			if (!$scope.tjydhYdhNum) {
				layer.msg('请输入运单号');
				console.log($scope.tjydhYdhNum)
				return;
			}
			if ($scope.tjydhYdhNum == $scope.tjydhOrdNum) {
				layer.msg('运单号跟订单号不能相同')
				return;
			}
			if (!$scope.selWlfsName) {
				layer.msg('请选择物流');
				return;
			} else {
				console.log($scope.selWlfsName)
				var logistName = $scope.selWlfsName.split('#')[0];
				var logistId = $scope.selWlfsName.split('#')[1];
			}
			erp.load();
			var addData = {};
			addData.procurementBillId = $scope.tjydhOrdNum;
			addData.wayBill = $scope.tjydhYdhNum;
			addData.logisticId = logistId;
			addData.logistic = logistName;
			addData.storageName = '1';
			addData.storageId = '1';
			console.log(JSON.stringify(addData))
			// return;
			erp.postFun('pojo/procurement/addWayBillsByOrderId', JSON.stringify(addData), function (data) {
				erp.closeLoad();
				$scope.bulkydhTjFlag = false;
				console.log(data)
				$scope.selckName = '';
				$scope.selWlfsName = '';
				$scope.tjydhYdhNum = '';
				$scope.tjydhOrdNum = '';
				if (data.data.statusCode == 200) {
					layer.msg('添加成功')
					cgListFun(erp, $scope);
				} else {
					layer.msg('添加失败')
				}
			}, err)
		}
		$scope.bulkydhTjQxFlag = function () {
			$scope.bulkydhTjFlag = false;
			$scope.selckName = '';
			$scope.selWlfsName = '';
			$scope.tjydhYdhNum = '';
			$scope.tjydhOrdNum = '';
		}
		function err(a) {
			console.log(a);
			layer.closeAll('loading');
		};
		// $('#zhuanshu-link').on('input', function () {
		//     $('#zhuanshu-link').val($scope.zhuanshuLink);
		// })
		//查看所有的业务员
		$scope.ordnumList = function (item) {
			$scope.ordNumFlag = true;
			console.log(item)
			$scope.ordNumArr = item.empSet;
		}
		//关闭业务员的弹框
		$scope.closeOrdNum = function () {
			$scope.ordNumFlag = false;
		}

	}])
	//erp采购库存   采购单列表展示
	app.controller('purchaseinventoryCtrl', ['$scope', "erp", function ($scope, erp) {
		console.log('purchaseinventoryCtrl')
		erp.postFun("app/storage/buyList", { "data": "{'pageNum':'1','pageSize':'2','status':'0','inputStr':''}" }, bb, err);
		function bb(a) {
			var obj = JSON.parse(a.data.result);
			console.log(obj)
			$scope.caigoudanliebiao = obj;


		};
		function err(a) {
			// alert(a)
		};

	}])
	//erp添加采购单
	app.controller('addpurchaseCtrl', ['$scope', "erp", function ($scope, erp) {
		console.log('addpurchaseCtrl')
		var stan;

		const { sku } = erp.retUrlQuery()

		$scope.navToInside = function(){
			location.href = "/manage.html#/erppurchase/inside"
		}

		function err(err){
			layer.msg(err)
		}

		erp.getFun('app/storage/getStorage', function (data) {
			console.log(data)
			var obj = JSON.parse(data.data.result);
			console.log(obj)
			$scope.ckArr = obj;
		}, function (data) {
			erp.closeLoad();
			console.log('仓库获取失败')
		})


		//获取业务员的列表
		var ywyUpdata = {};
		ywyUpdata.data = {};
		ywyUpdata.data.name = '';
		ywyUpdata.data.job = '销售';
		ywyUpdata.data = JSON.stringify(ywyUpdata.data)
		console.log(ywyUpdata)
		console.log(JSON.stringify(ywyUpdata))
		erp.postFun('app/employee/getempbyname', JSON.stringify(ywyUpdata), function (data) {
			console.log(data)
			if (data.data.statusCode == '200') {
				console.log(JSON.parse(data.data.result))
				var ywyObj = JSON.parse(data.data.result);
				$scope.ywyList = ywyObj.list;
				console.log($scope.ywyList)
			}
		}, function (data) {
			console.log(data)
		})
		//根据输入的sku选择对应的供应商以及图片的展示
		$scope.searchsku = function () {
			//根据sku查询变体信息,供应商信息回显到表单中
			erp.postFun("procurement/order/findByVSku", { "sku": "" + $scope.sku }, bb, err);
			function bb(a) {
				console.log(a)
				if(a.data.code != 200) return layer.msg(a.data.message || '服务器出错了')
				stan = a.data.data;
				var resList = a.data.data;
				$scope.costprice = resList.costprice;
				console.log(resList)
				$("#skuid").attr("src", resList.img);
				var sup = JSON.parse(resList.supplierLink);
				console.log(sup)
				//将供应商信息插入到下拉框中
				$("#checksupplier").empty();
				$("#checksupplier").append("<option value=''>--选择供应商--</option>");
				for (var i = 0; i < sup.length; i++) {
					$("#checksupplier").append("<option value='" + sup[i].name + "'>" + sup[i].name + "</option>");
				}


			};
			function err(a) {
				// alert(a)
			};
		}

		// url中有sku自动搜索sku
		if(sku){
			$scope.sku = sku
			$scope.searchsku()
		}
		// $scope.supplierid = '';
		//提交表单
		$scope.addbuyproduct = function () {
			console.log(stan)
			if (!$.trim($scope.sku)) {
				layer.msg('sku不能为空')
				return;
			}
			if (!$.trim($scope.count)) {
				layer.msg('请输入采购数量')
				return;
			}
			if (!$.trim($scope.addywyName)) {
				layer.msg('请输入业务员名称')
				return;
			}
			// if(!$.trim($scope.costprice)){
			//     layer.msg('请输入单价')
			//     return;
			// }
			if ($scope.selCk == undefined || $scope.selCk == '') {
				layer.msg('请选择仓库')
				return;
			} else {
				var ckName = $scope.selCk.split('#')[0];
				var ckId = $scope.selCk.split('#')[1];
			}
			var csArr = [];
			csArr.push({
				variantId: stan.id,
				productId: stan.pid,
				count: $scope.count
			})
			var addData = {};
			addData.storageId = ckId;
			addData.storageName = ckName;
			addData.stans = csArr;
			addData.yeWuYuan = $.trim($scope.addywyName);
			console.log(JSON.stringify(addData))
			const load = layer.load(0)
			erp.postFun("caigou/procurement/tianJiaChuDanCaiGou", JSON.stringify(addData), bb, err);
			// erp.postFun("pojo/procurement/addProcurementBillInForm",JSON.stringify(addData) , bb, err);

			function bb(a) {
				layer.close(load)
				if (a.data.statusCode == 200) {
					layer.msg("添加成功")
					$scope.sku = '';
					$scope.supplierid = '';
					$scope.costprice = '';
					$scope.count = '';
					$scope.detail = '';
					$scope.order = '';
					$scope.selCk = '';
				}
			};
			function err(a) {
				layer.msg('添加失败')
			};
		}
		//取消
		$scope.qxSubmitFun = function () {
			console.log(stan)
			$scope.sku = '';
			$scope.supplierid = '';
			$scope.costprice = '';
			$scope.count = '';
			$scope.detail = '';
			$scope.order = '';
			$scope.selCk = '';
		}
		//批量添加采购单
		$scope.bulkCgBtnFun = function () {
			$scope.bulkCgFlag = true;
			// debugger;
		}
		$('.bulkcg-inp').keypress(function (Event) {
			if (Event.keyCode == 13) {
				$scope.bulkSeaFun();
			}
		})
		$scope.bulkResArr = [];
		$scope.bulkSeaFun = function () {
			if ($scope.bulkInpVal != undefined && $scope.bulkInpVal != '') {
				erp.load();
				erp.postFun('procurement/order/getVariantsBySku', {
					sku: $scope.bulkInpVal
				}, function (data) {
					console.log(data)
					erp.closeLoad();
					if (data.data.code == '200') {
						var resObj = data.data.data
						resObj.checkedAll = false;
						$scope.bulkResArr.push(resObj)
						$scope.skusArr = resObj.skus;
						$scope.gysArr = JSON.parse(resObj.supplierLink);
						if ($scope.skusArr.length > 0) {
							for (var i = 0; i < $scope.skusArr.length; i++) {
								$scope.skusArr[i].checked = false;
								$scope.skusArr[i].salmanName = '';
								$scope.skusArr[i].count = 0;
							}
						}
					}
					console.log(resObj)
					console.log($scope.skusArr)
					console.log($scope.bulkResArr)
				}, err)
			} else {
				layer.msg('请输入SKU')
				return;
			}
		}
		//插入采购数量
		$scope.keyNumFun = function (item, pIndex, ev, zIndex) {
			console.log(item)
			var count = $(ev.target).val() - 0;
			console.log(count)
			if (count >= 0) {
				$scope.bulkResArr[pIndex].skus[zIndex].count = count;
				console.log($scope.bulkResArr[pIndex].skus[zIndex])
				console.log($scope.bulkResArr)
				console.log($scope.bulkResArr[pIndex])
			} else {
				layer.msg('输入的数量有误')
				return;
			}

		}
		//插入采购价格
		$scope.keyPriceFun = function (item, pIndex, ev, zIndex) {
			// console.log(item)
			var price = $(ev.target).val() - 0;
			console.log(price)
			if (price > 0) {
				$scope.bulkResArr[pIndex].skus[zIndex].costprice = price;
				console.log($scope.bulkResArr[pIndex].skus[zIndex])
			} else {
				layer.msg('输入的采购价格有误')
				return;
			}
		}
		//选择业务员
		$scope.selYwyFun = function (item) {
			console.log(item)
		}
		//批量选择业务员
		$scope.bulkselYwyFun = function (item, index, ev) {
			console.log(item)
			console.log(index)
			console.log($('.ywy-selval').eq(index).val())
			var ywyName = $('.ywy-selval').eq(index).val();
			for (var i = 0; i < $scope.bulkResArr[index].skus.length; i++) {
				if ($scope.bulkResArr[index].skus[i].checked) {
					$scope.bulkResArr[index].skus[i].salmanName = ywyName;
					console.log($scope.bulkResArr[index].skus[i])
				}
			}
		}
		//批量设置仓库
		$scope.outBulkChangeFun = function () {
			console.log($scope.outbSelCk)
			$scope.bSelCk = $scope.outbSelCk;
			console.log($scope.bSelCk)
		}
		//批量的确定采购
		$scope.sureBFun = function (item, index, ev) {
			console.log(index)
			console.log(item)
			// var itemGys = $(ev.target).siblings('.gys-selval').val();//供应商
			// var itemOrd = $(ev.target).siblings('.cg-inp-ordnum').val();//订单号
			var itemCk = $(ev.target).siblings('.cg-selck').val();//仓库
			console.log(itemCk)
			// if(!itemGys){
			//     layer.msg('请选择供应商')
			//     return;
			// }
			// if(!itemOrd){
			//     layer.msg('请输入采购订单号')
			//     return;
			// }
			if (!$.trim($scope.tcAddYwyName)) {
				layer.msg('请输入指定的业务员')
				return
			}
			if (!itemCk) {
				layer.msg('请选择仓库')
				return;
			}
			// var isSelYwyFlag = false;
			// for(var i = 0;i<$scope.bulkResArr[index].skus.length;i++){
			//     if (!$scope.bulkResArr[index].skus[i].salmanName) {
			//         isSelYwyFlag = true;
			//     }
			// }
			// if(isSelYwyFlag){
			//     layer.msg('必须为每个商品都指定业务员')
			//     return;
			// }
			var cgList = item.skus;
			var csArr = [];
			for (var i = 0; i < cgList.length; i++) {
				if (cgList[i].count > 0) {
					csArr.push({
						variantId: cgList[i].id,
						productId: cgList[i].pid,
						count: cgList[i].count
					})
				}
			}
			if (csArr.length < 1) {
				layer.msg('请输入数量')
				return
			}
			var splitCkArr = itemCk.split('#')
			var ckId = splitCkArr[1];
			var ckName = splitCkArr[0];
			console.log($scope.bulkResArr[index].skus)
			// erp.load();
			var bulkData = {};
			// {"storageId":"11","storageName":"222",
			// "stans":[{"variantId":"123","productId":"238","count":8}]}
			bulkData.storageId = ckId;
			bulkData.storageName = ckName;
			bulkData.stans = csArr;
			bulkData.yeWuYuan = $.trim($scope.tcAddYwyName)
			bulkData.skus = JSON.stringify($scope.bulkResArr[index].skus);
			console.log(JSON.stringify(bulkData))
			erp.postFun('caigou/procurement/tianJiaChuDanCaiGou', JSON.stringify(bulkData), function (data) {
				erp.closeLoad();
				if (data.data.statusCode == "200") {
					layer.msg('批量添加成功')
				} else {
					layer.msg('批量添加失败')
				}
				console.log(data)
			}, err)
		}
		//关闭批量的弹框
		$scope.bCloseFun = function () {
			$scope.bulkCgFlag = false;
			$scope.bulkResArr = [];
			$scope.bulkInpVal = '';
			// $scope.bSelGys = '';
			// $scope.bSelCk = '';
			// $scope.bCgOrdNum = '';
			// $scope.bulkDjVal = '';
			// $scope.bulkCountVal = '';
		}
		//选中 
		$scope.isCheckFun = function (item, index, ev) {
			console.log(item.checked)
			console.log(item)
			console.log(index)
			var checkedNum = 0;
			for (var i = 0; i < $scope.bulkResArr[index].skus.length; i++) {
				if ($scope.bulkResArr[index].skus[i]['checked'] == true) {
					checkedNum++;
				}
			}
			console.log(checkedNum);
			console.log($scope.bulkResArr[index].skus.length)
			console.log($scope.bulkResArr[index].checkedAll)
			if (checkedNum == $scope.bulkResArr[index].skus.length) {
				$scope.bulkResArr[index].checkedAll = true;
				$('.cjd-chek-all').eq(index).prop('checked', true)
			} else {
				$scope.bulkResArr[index].checkedAll = false;
				$('.cjd-chek-all').eq(index).prop('checked', false)
			}
			console.log($scope.bulkResArr[index].checkedAll)
			console.log($scope.bulkResArr[index])
			console.log($scope.bulkResArr)
			$scope.$applyAsync();
		}
		// 选中所有商品
		$scope.checkAll = function (checkAllMark, index) {
			console.log(checkAllMark)
			console.log(index)
			console.log($scope.bulkResArr)
			console.log($scope.bulkResArr[index])
			console.log($scope.bulkResArr[index].checkedAll)
			$scope.bulkResArr[index].checkedAll = checkAllMark;
			console.log(index)
			for (var i = 0; i < $scope.bulkResArr[index].skus.length; i++) {
				$scope.bulkResArr[index].skus[i].checked = checkAllMark;
			}
			console.log($scope.bulkResArr[index].skus)
		}
		//批量填写采购数量
		$scope.bulkAddCount = function (item, index, ev) {
			console.log(item)
			console.log(index)
			var cgCount = $(ev.target).siblings('.cg-count-bulk').val() - 0;
			console.log(cgCount)
			if (cgCount) {
				for (var i = 0; i < $scope.bulkResArr[index].skus.length; i++) {
					if ($scope.bulkResArr[index].skus[i].checked) {
						$scope.bulkResArr[index].skus[i].count = cgCount;
						console.log($scope.bulkResArr[index].skus[i])
					}
				}
			} else {
				layer.msg('请输入采购数量')
				return;
			}
			// console.log($scope.bulkCountVal)
			// if ($scope.bulkCountVal>0) {
			//     for(var i = 0;i<$scope.skusArr.length;i++){
			//         if ($scope.skusArr[i].checked) {
			//             $scope.skusArr[i].count = $scope.bulkCountVal;
			//             console.log($scope.skusArr)
			//         }
			//     }
			//     console.log($scope.skusArr)
			// }else{
			//     layer.msg('请输入采购数量')
			//     return;
			// }
		}
		//批量填写采购单价
		$scope.bulkAddPrice = function (item, index, ev) {
			console.log(item)
			console.log(index)
			var cgUnitP = $(ev.target).siblings('.cg-unit-price').val() - 0;
			console.log(cgUnitP)
			if (cgUnitP) {
				for (var i = 0; i < $scope.bulkResArr[index].skus.length; i++) {
					if ($scope.bulkResArr[index].skus[i].checked) {
						$scope.bulkResArr[index].skus[i].costprice = cgUnitP;
						console.log($scope.bulkResArr[index].skus[i])
					}
				}
			} else {
				layer.msg('请输入采购数量')
				return;
			}
			// console.log($scope.bulkDjVal)
			// if ($scope.bulkDjVal>0) {
			//     for(var i = 0;i<$scope.skusArr.length;i++){
			//         if ($scope.skusArr[i].checked) {
			//             $scope.skusArr[i].costprice = $scope.bulkDjVal;
			//         }
			//     }
			//     console.log($scope.skusArr)
			// }else{
			//     layer.msg('请输入采购单价')
			//     return;
			// }
		}
	}])
	//erp采购完成
	app.controller('purchaseoverCtrl', ['$scope', function ($scope) {
		console.log('purchaseoverCtrl')
	}])
	//erp采购失败
	app.controller('backmoneyCtrl', ['$scope', function ($scope) {
		console.log('backmoneyCtrl')
	}])
	//erp退货/退款
	app.controller('purchasebedCtrl', ['$scope', function ($scope) {
		console.log('purchasebedCtrl')
	}])
	//erp财务确认
	app.controller('financialCtrl', ['$scope', "erp", function ($scope, erp) {
		function err(a) {
			console.log(a);
			layer.closeAll('loading');
		};
		$scope.pageSize = '20';
		$scope.pageNum = '1';
		$scope.totalNum = 0;
		$scope.totalPageNum = 0;
		$scope.searchSku = '';
		$scope.ckflag = false;
		$scope.timeIndex = 1;
		$scope.timeStuFun = function (ev) {
			$('.drk-time').removeClass('active');
			$(ev.target).addClass('active');
			var timeStu = $(ev.target).text();
			switch (timeStu) {
				case '今日':
					$scope.timeIndex = 1;
					break;
				case '本周':
					$scope.timeIndex = 3;
					break;
				case '近一个月':
					$scope.timeIndex = 4;
					break;
			}
			console.log($scope.timeIndex)
			getList(erp, $scope);
		}
		// 获取列表
		function getList(erp, $scope) {
			$scope.chudanliebiao = [];
			erp.load();
			erp.postFun("pojo/procurement/getCaiWu", {
				'pageNum': $scope.pageNum + '',
				'pageSize': $scope.pageSize + '',
				'inputStr': $scope.searchSku,
				'dateFlag': $scope.timeIndex
			}, function (n) {
				erp.closeLoad();
				console.log(n);
				if (n.data.statusCode == 200) {
					var obj = JSON.parse(n.data.result);
					if (obj.totle == 0) {
						$scope.totalpage = 0;
						layer.msg("没有找到数据");
						return;
					}
					$scope.totalNum = obj.totle;
					for (var i = 0; i < obj.list.length; i++) {
						obj.list[i].checked = false;
						obj.list[i].isinput = false;
						obj.list[i].isedit = false;
					}
					$scope.chudanliebiao = obj.list;
					console.log($scope.chudanliebiao);
					$scope.totalPageNum = Math.ceil($scope.totalNum / ($scope.pagesize * 1));
					pageFun(erp, $scope);
				} else {
					layer.msg('网络错误');
				}
			}, err);
		}
		//搜索
		$('.sku-inp').keypress(function (Event) {
			if (Event.keyCode == 13) {
				$scope.skuSearchFun();
			}
		})
		$scope.skuSearchFun = function () {
			getList(erp, $scope);
		}
		//修改价格
		$scope.editPrice = function (item) {
			console.log(item)
			item.isinput = !item.isinput;
			console.log(item.isinput)
			if (!item.isinput) {
				console.log(item.price)
				erp.postFun('pojo/procurement/xiuGaiCaiWu', { id: item.id, price: item.price }, function (data) {
					console.log(data)
					if (data.data.statusCode == 200) {
						layer.msg('修改成功')
						getList(erp, $scope);
					} else {
						getList(erp, $scope);
						layer.msg(data.data.message)
					}
				}, function (data) {

				})
			}
		}
		//确认
		$scope.confirmClick = function (item) {
			console.log(item)
			var index = layer.confirm('是否确认？', {
				btn: ['取消', '确认'] //按钮
			}, function () {
				layer.close(index);
			}, function () {
				erp.getFun('pojo/procurement/queRenCaiWu?id=' + item.id, function (data) {
					console.log(data)
					if (data.data.statusCode == 200) {
						layer.msg('确认成功')
						getList(erp, $scope);
					} else {
						layer.msg(data.data.message)
					}
				}, function (data) {

				})
				layer.close(index);
			});
		}
		//查看
		$scope.ckFun = function (item) {
			console.log(item)
			$scope.ckflag = true;
			$scope.gysList = [];
			erp.getFun("pojo/procurement/bianTiShuLiang?wayBill=" + item.wayBill, function (res) {
				if (res.data.statusCode == 200) {
					$scope.gysList = JSON.parse(res.data.result);
					console.log($scope.gysList)
				}
			}, function (res) {

			})
		}
		$scope.ckcloseFun = function () {
			$scope.ckflag = false;
		}


		//    获取仓库
		$scope.getcangku = function (n) {
			$scope.cangku = n;
			console.log($scope.cangku, n)
		}

		//显示大图
		$('#SKUtable').on('mouseenter', '.s-img', function () {
			$(this).siblings('.hide-bigimg').show();
		})
		$('#SKUtable').on('mouseenter', '.hide-bigimg', function () {
			$(this).show();
		})
		$('#SKUtable').on('mouseleave', '.s-img', function () {
			$(this).siblings('.hide-bigimg').hide();
		})
		$('#SKUtable').on('mouseleave', '.hide-bigimg', function () {
			$(this).hide();
		})
		//分页
		function pageFun(erp, $scope) {
			$("#pagination1").jqPaginator({
				totalCounts: $scope.totalNum,
				pageSize: $scope.pageSize * 1,
				visiblePages: 5,
				currentPage: $scope.pageNum * 1,
				activeClass: 'current',
				first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				onPageChange: function (n, type) {
					if (type == 'init') {
						return;
					};
					erp.load();
					$scope.pageNum = n;
					getList(erp, $scope);
				}
			});
		}
		getList(erp, $scope);
		$scope.changePageSize = function () {
			getList(erp, $scope);
		}
		$scope.toSpecifiedPage = function () {
			getList(erp, $scope);
		}
		//
	}])
	
})()

