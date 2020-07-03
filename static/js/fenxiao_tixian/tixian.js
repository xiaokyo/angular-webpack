(function () {
	var app = angular.module('erp-tixian', []);
	app.controller('tixianCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
		var bs = new Base64();
		var logiName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
		//客户页面
		$scope.search = '';
		$scope.pagesize = '20';
		$scope.pagenum = '1';
		$scope.pagenumarr = [10, 20, 30, 50];
		$scope.totalNum = 0;
		$scope.dataList = [];
		
		$scope.tabFlag = '1';
		$scope.dateTabFlag = '2';
		$scope.startDate = '';
		$scope.endDate = '';
		
		$scope.zhixingFlag = false;
		$scope.jujueFlag = false;
		$scope.tixianDialog = false;
		$scope.imgList = [];
		//
		$scope.tabClick = function (n) {
			$scope.tabFlag = n;
			$scope.pagenum = '1';
			getList();
		};
		//
		$scope.dateTabClick = function (n) {
			$scope.dateTabFlag = n;
			$scope.startDate = '';
			$scope.endDate = '';
			$scope.pagenum = '1';
			getList();
		};
		
		//
		$scope.filterSearch = function () {
			$scope.dateTabFlag = '';
			console.log($scope.startDate)
			console.log($scope.endDate)
			$scope.pagenum = '1';
			getList();
		}
		
		//
		function getList() {
			erp.postFun('erp/afProfitMargin/getErpCwListPage', {
				'recordstatus': $scope.tabFlag,
				'timeType': $scope.dateTabFlag,
				'userName': $scope.search,
				'pageNo': $scope.pagenum,
				'pageSize': $scope.pagesize,
				'startTime': $scope.startDate,
				'endTime': $scope.endDate,
			}, function (n) {
				if (n.data.code == 200) {
					n.data.data.forEach(function (o, i) {
						o.certificate = o.certificate.split(',');
					})
					$scope.dataList = n.data.data;
					console.log($scope.dataList)
					$scope.totalNum = n.data.totle || 0;
					$scope.totalpage = function () {
						return Math.ceil($scope.totalNum / $scope.pagesize)
					}
					pageFun();
				}
			}, function (e) {
			
			}, { layer: true })
		}
		
		getList();
		//点击表格行留下颜色
		$scope.TrClick = function (i) {
			$scope.focus = i;
		}
		//提现金额点击
		$scope.tixianDetail = function (item) {
			console.log(item);
			$scope.itemData = item
			$scope.tixianDialog = true;
			$scope.cjId = '';
			$scope.salesman = '';
			$scope.name = '';
			$scope.tixianList = [];
			$scope.startTime = '';
			$scope.endTime = '';
			$scope.orderamount = '';
			$scope.tixian_pagenum = '1';
			$scope.tixian_pagesize = '8';
			tixianData(item)
		};
		
		function tixianData(item) {
			erp.postFun('erp/afProfitMargin/queryByDetalListPage', {
				customerName: item.userName,
				relateSalesman: item.relateSalesman,
				cjNum: item.cjNum,
				billingamount: item.billingamount,
				fxCustomerId: item.affaccountid,
				rid: item.id,
				'pageNo': $scope.tixian_pagenum,
				'pageSize': $scope.tixian_pagesize,
			}, function (res) {
				if (res.data.code == 200) {
					$scope.cjId = res.data.cjId;
					$scope.salesman = res.data.salesman;
					$scope.name = res.data.name;
					$scope.tixianList = res.data.data;
					$scope.startTime = res.data.startTime;
					$scope.endTime = res.data.endTime;
					$scope.orderamount = res.data.orderamount;
					$scope.tixian_totalNum = res.data.totle || 0;
					tixian_pageFun(item);
				}
			}, function (err) {
			
			}, { layer: true })
		}
		
		//执行
		$scope.passClick = function (item) {
			console.log(item)
			$scope.zhixingFlag = true;
			$scope.itemData = item;
			$scope.imgList = [];
			$scope.zhixingY = function () {
				if ($scope.imgList.length == 0) {
					layer.msg('请上传凭证')
					return false;
				}
				erp.postFun('erp/afProfitMargin/payAndUnPay', {
					certificate: $scope.imgList.join(','),
					id: item.id,
					recordstatus: '2',
					isUpdate: '1'
				}, function (res) {
					if (res.data.code == 200) {
						layer.msg('操作成功');
						$scope.zhixingFlag = false;
						getList();
					} else {
						layer.msg('操作失败')
					}
				}, function (err) {
				
				}, { layer: true })
			};
		};
		
		//
		$scope.uploadClick = function () {
			if ($scope.imgList.length == 3) {
				layer.msg('最多上传3张');
				return false;
			}
			$('#uplod').click();
		}
		//
		$scope.upLoadImg = function (files) {
			if (files.length == 0) return;
			var data = new FormData();
			for (var i = 0; i < files.length; i++) {
				data.append('file', files[i]);
			}
			erp.upLoadImgPost('app/ajax/upload', data, function (res) {
				console.log(res)
				$('#uplod').val('');
				$scope.imgList.push('https://' + JSON.parse(res.data.result)[0]);
				console.log($scope.imgList)
			}, function (err) {
				$('#uplod').val('');
			})
		};
		$scope.removeImg = function (idx, ev) {
			ev.preventDefault();
			$scope.imgList.splice(idx, 1);
		}
		//拒绝
		$scope.nopassClick = function (item) {
			console.log(item)
			$scope.jujueFlag = true;
			$scope.jujueTXt = '';
			$scope.jujueY = function () {
				if (!$scope.jujueTXt) {
					layer.msg('请输入拒绝原因')
					return false;
				}
				erp.postFun('erp/afProfitMargin/payAndUnPay', {
					id: item.id,
					recordstatus: '3',
					isUpdate: '2',
					remark: $scope.jujueTXt
				}, function (res) {
					if (res.data.code == 200) {
						layer.msg('操作成功');
						$scope.jujueFlag = false;
						getList();
					} else {
						layer.msg('操作失败')
					}
				}, function (err) {
				
				}, { layer: true })
			};
		};
		
		//导出体现记录
		$scope.exportExcel = () => {
		
			const url = `https://erp1.cjdropshipping.com/erp/afProfitMargin/exportExcel?
			customerName=${$scope.itemData.userName}&
			fxCustomerId=${$scope.itemData.affaccountid}&
			rid=${$scope.itemData.id}`
			
			window.open(url)
			
			/*
			const parms = {
			 "customerName": $scope.itemData.userName,
			 "fxCustomerId": $scope.itemData.affaccountid,
			 "rid": $scope.itemData.id
			}
			erp.postFun('erp/afProfitMargin/exportExcel', parms, (res) => {
			 console.log(res)
			 layer.closeAll('loading')
			 if(res.data.statusCode === '200'){
			 window.open(res.data.result)
			 }
			 }, (err) => {
			 
			 })*/
		}
		
		//分页
		function pageFun() {
			$(".pagegroup").jqPaginator({
				totalCounts: $scope.totalNum || 1,
				pageSize: $scope.pagesize * 1,
				visiblePages: 5,
				currentPage: $scope.pagenum * 1,
				activeClass: 'current',
				first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				onPageChange: function (n, type) {
					if (type == 'init') {
						return;
					}
					$scope.pagenum = n + '';
					getList();
				}
			});
		}
		
		function tixian_pageFun(item) {
			$(".tixian-page").jqPaginator({
				totalCounts: $scope.tixian_totalNum || 1,
				pageSize: $scope.tixian_pagesize * 1,
				visiblePages: 5,
				currentPage: $scope.tixian_pagenum * 1,
				activeClass: 'current',
				first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				onPageChange: function (n, type) {
					if (type == 'init') {
						return;
					}
					$scope.tixian_pagenum = n + '';
					tixianData(item)
				}
			});
		}
		
		$scope.pagechange = function (pagesize) {
			console.log(pagesize)
			$scope.pagenum = '1';
			getList();
		}
		$scope.pagenumchange = function () {
			console.log($scope.pagenum % 1)
			$scope.pagenum = $(".goyema").val() - 0;
			if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
				layer.msg('错误页码');
				$(".goyema").val(1)
			} else {
				getList();
			}
		}
		//搜索客户
		$scope.searchList = function () {
			$scope.pagenum = '1';
			getList();
		}
		//按下enter搜索
		$scope.enterSearch = function (event) {
			if (event.keyCode === 13 || event.keyCode === 108) {
				$scope.pagenum = '1';
				getList();
			}
		}
	}])
})()
