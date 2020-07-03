(function () {
	var app = angular.module('erp-l');
	//问题接口
	app.controller('problemPackageCtrl', ['$scope', 'erp', '$routeParams', 'utils', '$location', "$filter", function ($scope, erp, $routeParams, utils, $location, $filter) {
		console.log('problemPackageCtrl')


		/** model */
		//问题包裹类型
		$scope.expenditureTypeModel = {
			'cost': { val: 1, txt: '已通知' },
			'dispute': { val: 2, txt: '待重派' },
			'sellComposite': { val: 3, txt: '已重派' },
		}
		const compositeArr = [3, 5, 7]

		//货币
		const currencyModel = { 'RMB': { val: '1', txt: 'RMB', id: 1 }, 'USD': { val: '2', txt: 'USD', id: 2 } }
		//弹窗参数 模板  注：适用于--销售费用（综合），管理费用（综合），其他支出
		const addModel = {
			expendType: -1,                                       //支出类型
			rateType: currencyModel.RMB.val,                      //币种 
			money: null,                                          //金额
			remark: '',                                           //摘要
			expendDate: '',                                       //支出时间
			id: -1,
		}

		//公用参数
		$scope.showFLag = false                                 //新增弹窗 显示 隐藏
		$scope.searchinfo = ''
		$scope.selectsearch = ''
		$scope.chongpaiflow = ''                                  //重派追踪号
		$scope.chongpaifps = ''                                  //重派备注
		$scope.chongdata = ""                                     //重派弹窗数据
		$scope.localTn = ''                                       //追踪号
		$scope.v3 = []                                            //判断上传数据是否正确
		$scope.cjorderNo = ''										//子订单号
		$scope.searchType = ''                                    //按照子订单号或追踪号搜索
		$scope.showFLag2 = false                                //确认弹窗 显示 隐藏
		$scope.showFLag3 = false                                //确认弹窗 显示 隐藏
		$scope.loadList = ''                                    //列表
		$scope.sureExpend = addModel                            //确认删除弹窗 参数
		$scope.canShowPage = false                              //分页器 是否展示

		$scope.pageNum = 1                                      //分页 第几页
		$scope.pageSize = '20'                                  //分页 每页展示几条
		$scope.noteShow = false                                 //出现问题描述
		$scope.showEdit = false; //控制备注编辑状态
		$scope.searchOwnerName = ''                             //搜索 - 群主/业务员


		/**  方法 */
		/** 监听页面大小变化 以及 顶部tab元素变化*/
		let topTabEle = document.getElementById('top-tab')
			, tabLeft = topTabEle.offsetLeft
			, observer = new MutationObserver(ev => {
				// 这里写监听代码
				let height

				setTimeout(() => {
					height = topTabEle.offsetHeight
					document.getElementById('content-wrap').style.marginTop = `${height}px`
				}, 500);
			})

		observer.observe(topTabEle, { childList: true, subtree: true });

		window.onresize = function () {
			let height = topTabEle.offsetHeight
			document.getElementById('content-wrap').style.marginTop = `${height}px`
		}

		window.onscroll = function () {
			let scrollTop = document.documentElement.scrollLeft || document.body.scrollLeft;
			// console.log("滚动距离" + scrollTop, '===',topTabEle.offsetLeft , topTabEle.style.left); 
			topTabEle.style.left = `${tabLeft - scrollTop}px`
		}

		//搜索
		$scope.propackagesearch = function () {
			var type = $('#searchType').val();
			$scope.searchobj = {};

			if (type == '追踪号') {
				$scope.searchobj.localTn = $scope.searchinfo;
				console.log($scope.searchinfo);
			} else if (type == '子订单号') {
				$scope.searchobj.cjorderNo = $scope.searchinfo;
				console.log($scope.searchinfo);
			}
			if ($scope.expenditureType !== $scope.expenditureTypeModel.cost.val) {
				$scope.searchobj = { ...$scope.searchobj, ownerName: $scope.searchOwnerName }
			} 
			console.log($scope.searchobj)
			// getSearchList();
			$scope.pageNum = '1'
			getList()
		};
		//按下enter搜索
		$(function () {
			$(".top-search-inp").keydown(function (event) {
				console.log(event.keyCode);
				if (event.keyCode === 13 || event.keyCode === 108) {
					$scope.propackagesearch();
				}
			});
		});

		//tab页切换
		$scope.expenditureType = 1
		getList()
		$scope.changeIncomeType = (type) => {
			// console.log(type);
			$scope.expenditureType = type
			$scope.searchinfo = ''
			$scope.searchobj = {}
			clearSearch()
			getList()
		}

		//获取列表  （所有）
		function getList() {
			console.log('111')
			switch ($scope.expenditureType) {
				case $scope.expenditureTypeModel.cost.val:                     //销售成本
					getCostList()
					$scope.exportFlag = 'E14'
					break
				case $scope.expenditureTypeModel.dispute.val:                  //销售费用 -- 提成纠纷
					getDisputeList()
					$scope.exportFlag = 'E12'
					break
				case $scope.expenditureTypeModel.sellComposite.val:            //销售费用 -- 综合
					getSellComposite()
					$scope.exportFlag = 'E16'
					break
			}
		}
		/**已通知  */
		function getCostList() {
			// , sendData = { pageNo: Number($scope.pageNum), pageSize: Number($scope.pageSize), cjorderNo: $scope.cjorderNo, localTn:$scope.localTn}
			// , sendData = { pageNum: Number($scope.pageNum), pageSize: Number($scope.pageSize), cjorderNo: $scope.cjorderNo, localTn:$scope.localTn}
			let data = {
				pageNum: Number($scope.pageNum), pageSize: Number($scope.pageSize)
			}
			
			let url = 'erp/orderResend/erp_query_yiTongZhi'
				, sendData = Object.assign(data, $scope.searchobj)
			
			optAsyn({
				url, sendData, callback: (result) => {
					console.log(result)
					const { message } = result;
					const list = result.result.rows;
					let total = result.result.total;
					console.log(list)
					if (list) {
						$scope.costList = list.map(cost => {
							cost.execTime = erp.formatDate(cost.execTime);
							cost.createdTime = erp.formatDate(cost.createdTime);
							cost.deadline = erp.formatDate(cost.deadline);
							return cost
						})
					}
					$scope.totalCounts = total
					if (list) {
						$scope.canShowPage = list.length > 0
					}
					pageFun()
				}
			})
		}

		/** 待重派 */
		function getDisputeList() {
			// , sendData = { pageNo: Number($scope.pageNum), pageSize: Number($scope.pageSize),  execState: 2}
			let url = 'erp/orderResend/erp_query_chongPai'
				, sendData = { pageNum: Number($scope.pageNum), pageSize: Number($scope.pageSize), execState: 2 }
			
			sendData = Object.assign(sendData, $scope.searchobj)
			optAsyn({
				url, sendData, callback: ({ result }) => {
					console.log(result);
					const { total, rows, pageSize } = result;
					// console.log(rows)
					if (rows) {
						$scope.disputeList = rows.map(item => {
							item.moneyDate = utils.changeTime(item.moneyDate, false)
							return item
						})
						console.log($scope.disputeList)
						$scope.disputeList.map(item => {
							item.execTime = erp.formatDate(item.execTime);
							item.deadline = erp.formatDate(item.deadline);
						})
					} else {
						$scope.disputeList = []
					}
					$scope.totalCounts = total
					console.log(total)
					console.log($scope.totalCounts);
					if (result.rows) {
						$scope.canShowPage = rows.length > 0
					}
					pageFun()
				}
			})
		}

		/**已重派列表 */
		function getSellComposite() {
			// let url = 'erp/statistics/getIncomeExtendByPage'
			let url = 'erp/orderResend/erp_query_chongPai'
				, sendData = {
					pageNum: Number($scope.pageNum),
					pageSize: Number($scope.pageSize),
					execState: 3
				}
			
			sendData = Object.assign(sendData, $scope.searchobj)
			optAsyn({
				url, sendData, callback: ({ result }) => {
					console.log(result);
					const { total, rows, pageSize } = result
					if (rows) {
						$scope.sellCompositeList = rows.map(item => {
							item.updatedTime = erp.formatDate(item.updatedTime)
							item.deadline = erp.formatDate(item.deadline)
							item.execTime = erp.formatDate(item.execTime)
							return item
						})
						console.log($scope.sellCompositeList)

					}
					$scope.totalCounts = total
					if (result.rows) {
						$scope.canShowPage = rows.length > 0
					}

					pageFun()

				}
			})
		}
	
		/** 上传Excel */
		//上传Excel表格
		// var scId;

		$scope.upLoadExcelFun = function (item) {
			console.log(item)      //Filelist
			console.log(item[0])      //file
			var file = $("#document2").val();
			console.log(file)     //文件路径
			var index = file.lastIndexOf(".");
			var ext = file.substring(index + 1, file.length);
			console.log(ext)       //后缀名
			if (ext != "xlsx" && ext != "xls") {
				layer.msg('请上传excel文件')
				return;
			}
			erp.load();
			var formData = new FormData($("#uploadimg2")[0]);
			console.log($("#uploadimg2")[0])

			formData.append("file", item[0]);

			console.log(formData)
			erp.upLoadImgPost('erp/orderResend/uploadExcel', formData, function (data) {
				console.log(data)
				layer.closeAll("loading")
				// if (data.data.result==true) {
				if (data.data.statusCode == 200) {
					layer.msg('上传成功');
					$('#document2').val('') // 注意1
					// data.data.result 数据
					//上传Excel解析弹窗

					$scope.loadList = data.data.result

					$scope.loadList.map(item => {
						$scope.v3.push(item.v3);
						item.deadline = erp.formatDate(item.deadline);
						console.log(item.deadline)
						if ($scope.v3.includes('1')) {
							layer.msg('订单号不存在');
							$scope.v3 = [1];
						} else {
							$scope.v3 = [2];
							// item.updatedTime
							// $scope.dt2 = $filter("date")(item.updatedTime , "yyyy/MM/dd");
						}
					})
					console.log($scope.v3)
					$scope.showFLag3 = true
					$scope.sureExpend = item
				} else {
					$scope.showFLag3 = true
					$('#document2').val('') // 注意1
					layer.msg(data.data.message)
				}
			}, function (data) {
				// console.log(data)
				layer.closeAll("loading")
			})
		}

		$scope.upLoadExcelFun1 = function (item) {
			console.log(item)      //Filelist
			var file = $("#document3").val();
			console.log(file)     //文件路径
			var index = file.lastIndexOf(".");
			var ext = file.substring(index + 1, file.length);
			console.log(ext)       //后缀名
			if (ext != "xlsx" && ext != "xls") {
				layer.msg('请上传excel文件')
				return;
			}
			erp.load();
			var formData = new FormData($("#uploadimg3")[0]);

			formData.append("file", item[0]);

			erp.upLoadImgPost('erp/orderResend/uploadExcel', formData, function (data) {
				console.log(data)
				layer.closeAll("loading")
				// if (data.data.result==true) {
				if (data.data.statusCode == 200) {
					layer.msg('上传成功');
					$('#document3').val('') // 注意1
					// data.data.result 数据
					//上传Excel解析弹窗

					// console.log(item)
					$scope.loadList = data.data.result

					$scope.loadList.map(item => {
						$scope.v3 = item.v3;

						if (item.v3 == 2) {
							item.updatedTime = new Date();
							$scope.dt2 = $filter("date")(item.updatedTime, "yyyy/MM/dd");
						} else {
							layer.msg('格式不正确');
						}
					})
					console.log($scope.v3)
					$scope.showFLag3 = true
					$scope.sureExpend = item

				} else {
					layer.msg(data.data.result)
					$('#document3').val('') // 注意1
				}
			}, function (data) {
				// console.log(data)
				layer.closeAll("loading")
			})
		}

		/** 公用方法*/
		//待重派/备注 确认弹窗
		$scope.sureReceipt = (index, data, type) => {
			console.log(index)
			console.log(data)
			console.log(type);
			$scope.type = type;
			// $scope.chongpaiflow=$('#chongpaiflow'+index).val();
			// $scope.chongpaips = $('#chongpaips' + index).val();
			$scope.chongdata = data;
			// console.log(chongdata)
			// console.log($('#chongpaiflow'+index));
			//   console.log($scope.chongpaiflow);    //待重派跟踪号

			if ($scope.type == 'chongpai') {
				$scope.showEdit = false;
				$scope.chongdata.chongpaips = '';
				$scope.showText = '是否确认该重派订单正确？'

			} else if ($scope.type == 'beizhu') {
				if (!$scope.chongdata.chongpaips) return layer.msg('备注未填写')
				$scope.showText = '是否确认该备注正确？'
			}
			$scope.showFLag2 = true
			// $scope.sureExpend = item
		}

		//上传确认(通知顾客)
		$scope.sureConfirm = () => {

			let url = "erp/orderResend/erp_enter_import"
			optAsyn({
				url, callback: res => {
					$scope.showFLag3 = false
					getList()
				}
			})
		}

		//确认重派
		$scope.sureConfirm1 = () => {
			if ($scope.type == 'chongpai' && !$scope.chongdata.chongpaiflow) return layer.msg('重派追踪号不能为空')
			// if ($scope.type == 'beizhu' && !$scope.chongdata.chongpaips) return layer.msg('备注未填写')
			let url, sendData;
			if ($scope.type == 'chongpai') {
				url = "erp/orderResend/erp_update_trackingNumber",
					sendData = {
						id: $scope.chongdata.id,
						trackingNumber: $scope.chongdata.chongpaiflow,
					}
			} else if ($scope.type == 'beizhu') {
				url = "erp/orderResend/erp_update_remark",
					sendData = {
						id: $scope.chongdata.id,
						v2: $scope.chongdata.chongpaips
					}
			}
			optAsyn({
				url, sendData, callback: res => {
					// console.log(212122)
					$scope.showFLag2 = false
					if (res.statusCode == 200) {
						layer.msg(res.message);
						if ($scope.type == 'beizhu') {
							$scope.showEdit = false;
						}
					} else {
						$scope.showFLag2 = false
						layer.msg(res.message)
					}
					$scope.chongpaiflow = '';
					getDisputeList()
				}
			})


		}
		//请求接口分装
		function optAsyn({ url, sendData, callback }) {
			erp.postFun(url, JSON.stringify(sendData), ({ data }) => {

				// console.log(data);
				if (data.statusCode === '200') {
					callback(data)
				} else {
					$scope.canShowPage = false
					console.log('操作失败')
					// callback(data)
					layer.msg(data.message || '操作失败')
				}
			}, error => {
				$scope.canShowPage = false
				layer.msg('网络错误')
			}, { layer: true })
		}

		//清空
		function clearSearch() {
			$scope.pageNum = 1
			$scope.pageSize = '20'
			$scope.disputeList = []
		}

		//分页
		function pageFun() {
			$(".pagegroup").jqPaginator({
				totalCounts: $scope.totalCounts || 1,
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
					}
					$scope.pageNum = n;
					getList();
				}
			});
		}
		//切换pagesize
		$scope.pagechange = function () {
			$scope.pageNum = 1
			getList()
		}
		//跳转第几页
		$scope.pagenumchange = function () {
			if (Number($scope.pageNum) <= 0) {
				$scope.pageNum = 1;
			}
			let pagenum = Number($scope.pageNum)
				, totalpage = Math.ceil($scope.totalCounts / $scope.pageSize)

			if (pagenum > totalpage) {
				layer.msg('错误页码');
				$scope.pageNum = 1;
			} else {
				getList();
			}
		}

		$scope.editPs = (item, index) => {
			console.log(item, index);
			$scope.showEdit = true;
			if (item.v2) {
				item.chongpaips = item.v2;
			}
		}

		$scope.cancleEditPs = (item, index) => {
			console.log(item, index);
			$scope.showEdit = false;
			item.chongpaips = ''
		}
	}])
})()