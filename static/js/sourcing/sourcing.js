(function () {
	app.controller('sourcingAllCtrl', ['$scope', 'erp', '$location', '$routeParams', 'utils', function ($scope, erp, $location, $routeParams, utils) {
		console.log('sourcing')
		
		$scope.pageNum = '1'
		$scope.pageSize = '10'
		$scope.type = '1' // 左上角过滤 "1" 全部 "2" 现有相似  "3"搜品超时 默认值"1"
		$scope.isFuFei = '0' // "0" 查询全部  "1" 只查询付费客户 默认值"0"
		$scope.startTime = utils.changeTime(new Date().setTime(new Date().getTime() - 14 * 24 * 60 * 60 * 1000)); // 当前日期前推14天
		$scope.endTime = '';
		$scope.sortType = '0' // "0" 按创建时间排序  "2" 按客户等级排序  默认值"0" 不可以将"2"作为默认值
		$scope.sourceType = '' // "0" 店铺搜品 "1" 个人搜品 "2" 平台搜品 "3"游客搜品
		$scope.ownerName = '' // 用群主名字查询
		$scope.tableData = [] // 列表数据
		
		// 定义根据页面路由参数决定搜品状态
		const sourceStatus = {
			'all': '', // 所有状态
			'waitingExisting': '6', // 等待现有
			'waitingSource': '1', // 等待搜品
			'firstFailed': '7', // 搜品初审失败
			'failed': '2', // 搜品失败
			'success': '3', // 搜品成功
			'in': '8', // 搜品中
			'deleted': '-1', // 已删除
		}
		
		$scope.sourceStatus = $routeParams.sourceStatus || 'all'
		
		// 搜品状态 "-1" 已删除 "1" 等待搜品 "2" 搜品失败 "3" 搜品成功 "5" 搜品超时 "6" 等待现有 "7" 初审失败 "8" 搜品中
		$scope.status = sourceStatus[$routeParams.sourceStatus]
		
		console.log($scope.sourceStatus)
		console.log($scope.status)
		
		// sourceType 搜品的类型
		$scope.sourceTypeArr = {
			'0': '店铺搜品',
			'1': '个人搜品',
			'2': '平台搜品',
			'3': '游客搜品',
		}
		
		// 不同搜品的类型列表展示不同字段
		$scope.similarProductTableCol = ['waitingExisting', 'waitingSource'] // 相似商品
		$scope.causeFailureTableCol = ['firstFailed', 'failed'] // 失败原因
		$scope.similarProductLinkTableCol = ['firstFailed', 'failed'] // 相似商品链接
		$scope.erpUrLTableCol = ['success', 'in'] // ERP URL
		
		// 不同搜品状态拥有不同操作按钮
		$scope.entryBtnAuth = ['-1', '1', '5', '7']// 录入按钮状态权限
		$scope.reEntryBtnAuth = ['0', '2', '3', '8']// 重新录入按钮状态权限
		$scope.failedBtnAuth = ['3', '5', '8', '7'] // 失败按钮状态权限
		$scope.viewProductBtnAuth = ['3'] // 查看商品按钮状态权限
		$scope.existingProductBtnAuth = ['0', '1', '2', '5', '6', '7', '8'] // 现有商品按钮状态权限
		$scope.firstFailedBtnAuth = ['1'] // 初审失败按钮状态权限
		$scope.waitingSourceBtnAuth = ['6'] // 等待搜品按钮状态权限
		$scope.supplierBtnAuth = ['0', '1', '2'] // 转供应商报价按钮状态权限
		
		$scope.dateFocus = (e, filed) => {
			$scope[filed] = e.target.value
		}
		
		// 获取群主/负责人数据
		(function () {
			erp.postFun('app/account_erp/getAllSalesman', {}, res => $scope.ownerList = JSON.parse(res.data.result))
			console.log($scope.ownerList)
			erp.postFun('app/employee/getempbyname', { "data": "{'name':'', 'job': '销售'}" }, res => $scope.salemanList = JSON.parse(res.data.result).list);
			console.log($scope.salemanList)
		})()
		
		// 筛选
		$scope.handleFilter = () => {
			$scope.pageNum = '1'
			getSourcingData()
		}
		
		// 负责人筛选
		$scope.handleSalemanFilter = () => {
			$scope.pageNum = '1'
			$scope.inputStr = $scope.salemanName ? $scope.salemanName.LOGIN_NAME : ''
			getSourcingData()
		}
		
		// 是否付费用户
		$scope.handleIsPay = () => {
			$scope.pageNum = '1'
			$scope.isFuFei = $scope.isFuFei === '0' ? '1' : '0'
			getSourcingData()
		}
		
		// 获取列表数据
		function getSourcingData() {
			const params = {
				"pageSize": $scope.pageSize,
				"pageNum": $scope.pageNum,
				"inputStr": $scope.inputStr || '',
				"status": $scope.status,
				"ownerName": $scope.ownerName.relate_salesman || '',
				"leftDate": $scope.startTime,
				"rightDate": $scope.endTime,
				"isFuFei": $scope.isFuFei,
				"type": $scope.type,
				"sortType": $scope.sortType,
				"sourceType": $scope.sourceType
			}
			layer.load(2)
			erp.postFun('source/sourcing/newSourceListErp', params, ({ data }) => {
				layer.closeAll('loading')
				if (data.statusCode === '200') {
					$scope.checkedAll = false
					$scope.tableData = data.result.list.map(o => ({
						...o,
						statusTxt: sourcingStatus(o.status, o.sourceType),
						// 平台搜品/游客搜品 状态为 2 就是搜品成功
						statusBtn: (o.sourceType === '2' || o.sourceType === '3') && o.status === '2' ? '3' : o.status
					})) || [] // 列表数据
					$scope.totalNum = data.result.total;
					console.log($scope.tableData)
					$scope.$broadcast('page-data', {
						pageSize: $scope.pageSize.toString(),
						pageNum: $scope.pageNum,
						totalNum: Math.ceil(Number($scope.totalNum) / Number($scope.pageSize)),
						totalCounts: $scope.totalNum,
						pageList: ['10', '20', '50', '100']
					});
				}
			}, err => {
				console.log(err)
			})
		}
		
		getSourcingData()
		
		// 分页
		$scope.$on('pagedata-fa', function (d, data) {
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			getSourcingData();
		})
		
		// 后台给的表达式来定义搜品状态
		function sourcingStatus(status, sourceType) {
			return status == "-1" ? "已删除" :
				status == "0" ? (sourceType == "2" || sourceType == "3") ? "搜品失败" : (sourceType == "0" || sourceType == "1") ? "" : "" :
					status == "1" ? "等待录入" :
						status == "2" ? (sourceType == "2" || sourceType == "3") ? "搜品成功" : (sourceType == "0" || sourceType == "1") ? "搜品失败" : "" :
							status == "3" ? (sourceType == "0" || sourceType == "1") ? "搜品成功" : (sourceType == "2" || sourceType == "3") ? "" : "" :
								status == "5" ? "搜品超时" :
									status == "6" ? "等待现有" :
										status == "7" ? "初审失败" :
											status == "8" ? "搜品中" : ""
		}
		
		// 商品名称点击
		$scope.productNameClick = item => {
			if (item.status === '3') {
				window.open(`manage.html#/merchandise/show-detail/${item.pid}/0/3/0`);
			} else {
				layer.open({
					title: '商品名称',
					content: item.productName || '-'
				});
			}
		}
		
		// 全选
		$scope.handleCheckAll = () => {
			$scope.checkedAll = !$scope.checkedAll
			$scope.tableData = $scope.tableData.map(o => ({ ...o, checked: $scope.checkedAll }))
		}
		
		// 单选
		$scope.handleChecked = item => {
			item.checked = !item.checked
			$scope.checkedAll = !$scope.tableData.find(o => !o.checked)
		}
		
		// 录入操作
		$scope.handleEntry = item => {
			const operating = {
				// 店铺搜品
				'0': (item) => {
					sessionStorage.setItem('sourceId', item.id)
					sessionStorage.setItem('sourcecustomerId', item.accountId)
					sessionStorage.setItem('addkey', 2)
					// 0 表示代发商品
					$location.path('/merchandise/addSKU1/source=' + item.id + "&sourcecustomer=" + item.accountId + '//0');
				},
				// 个人搜品
				'1': (item) => {
					sessionStorage.setItem('sourceId', item.id)
					sessionStorage.setItem('sourcecustomerId', item.accountId)
					sessionStorage.setItem('addkey', 2)
					// 0 表示代发商品
					$location.path('/merchandise/addSKU1/source=' + item.id + "&sourcecustomer=" + item.accountId + '//0');
				},
				// 平台搜品
				'2': (item) => {
					if (item.zfOrderId) {
						window.open('manage.html#/merchandise/addSKU1/orderproduct=' + item.zfOrderId + '//0', '_blank', '');
					} else {
						sessionStorage.setItem('sourceId', item.id);
						sessionStorage.setItem('addkey', 1);
						if (item.categorys && item.categorys['id'] !== '') {
							$location.path('/merchandise/addSKU2/cjsource=' + item.id + '/' + item.categorys['id'] + '/0');
						} else {
							$location.path('/merchandise/addSKU1/cjsource=' + item.id + '//0');
						}
					}
				},
				// 游客搜品
				'3': (item) => {
					sessionStorage.setItem('sourceId', item.id);
					sessionStorage.setItem('addkey', 1);
					$location.path('/merchandise/addSKU1/source=' + item.id + "&sourcecustomer=" + 'touristSourceFlag' + '//0');
				},
			}
			layer.load(2);
			erp.postFun("app/externalPurchase/isEntering", { sourceId: item.id }, function (res) {
				layer.closeAll("loading");
				if (res.data.code == 200) {
					operating[item.sourceType](item)
				} else {
					layer.msg(res.data.message)
				}
			}, function (err) {
				layer.msg('服务器错误')
			});
		}
		
		// 失败操作
		$scope.handleFailed = item => {
			$scope.isSetSourceError = true;
			$scope.no = item
		}
		
		// 监听失败组件做操作
		$scope.$on('log-to-father', function (d, flag) {
			if (d && flag) {
				$scope.isSetSourceError = flag.closeFlag;
			}
		})
		
		$scope.$on('sourceErrorSuccess', () => {
			$scope.isSetSourceError = false
			$scope.pageNum = '1'
			getSourcingData()
		})
		
		// 查看商品
		$scope.handleViewProduct = id => {
			var toUrl = window.open();
			erp.getFun('cj/locProduct/rollToken?id=' + id, function (data) {
				var data = data.data;
				if (data.statusCode != 200) {
					return;
				}
				var detailToken = data.result;
				toUrl.location.href = erp.getAppUrl() + '/product-detail.html?id=' + id + '&token=' + detailToken;
			}, function (err) {
				console.log(err);
			});
		}
		
		// 现有商品操作（移植老代码）
		$scope.handleExistingProduct = (item, existingPro = []) => {
			console.log(item)
			$scope.existinginfo = ''
			$scope.existingPro = existingPro;
			$scope.existingProductModal = true
			let selectedExistingPro = null;
			$scope.selectedExisting = function ($event, item2) {
				var existingSrc = $($event.target).attr('src');
				if (existingSrc == 'static/image/public-img/radiobutton1.png') {
					$('.esou-cheked').attr('src', 'static/image/public-img/radiobutton1.png');
					$($event.target).attr('src', 'static/image/public-img/radiobutton2.png');
					selectedExistingPro = item2;
				} else {
					$($event.target).attr('src', 'static/image/public-img/radiobutton1.png');
					selectedExistingPro = null;
				}
				console.log(selectedExistingPro);
			}
			$scope.existingSearch = function (existinginfo) {
				console.log(existinginfo);
				if (existinginfo == '') {
					layer.msg('请输入SKU或商品名称')
				} else if (existinginfo == undefined) {
					layer.msg('请输入SKU或商品名称')
				} else {
					erp.postFun('app/sourcing/sourceGetProduct', JSON.stringify({
						inputStr: existinginfo,
						accountId: item.customerId
					}), function (res) {
						console.log(res.data);
						console.log(JSON.parse(res.data.result))
						if (res.data.statusCode == 200) {
							var searchproducts = JSON.parse(res.data.result).products;
							if (searchproducts.length == 0) {
								$scope.existingPro = [];
								layer.msg('暂无数据。');
							} else {
								for (var i = 0; i < searchproducts.length; i++) {
									searchproducts[i].existingWuliu = [];
								}
								$scope.existingPro = searchproducts;
								console.log($scope.existingPro);
							}
							
						} else {
							layer.msg('暂无数据。');
						}
					}, function (res) {
						console.log(res)
						layer.msg('网络错误');
					})
					
				}
			}
			$scope.choseCurWuliu = function (curPro, curIndex) {
				//物流请求
				erp.postFun2('getWayBy.json', {
						"weight": curPro.packWeight,
						"lcharacter": curPro.propertyKey
					},
					function (res) {
						console.log(res)
						// $scope.existingWuliu = res.data;
						// $scope.mylogistics = '请选择';
						const { data } = res;
						if (data && data instanceof Array && data.length > 0) {
							$scope.existingPro[curIndex].existingWuliu = res.data;
							$scope.existingPro[curIndex].mylogistics = res.data[0].enName;
						} else {
							layer.msg('后台未返回数据')
						}
					},
					function (res) {
						console.log(res)
						layer.msg('网络错误')
						
					})
			}
			$scope.quxiaoFun = function () {
				$scope.existingProductModal = false
				$scope.existingPro = [];
				$scope.existinginfo = '';
			}
			$scope.quedingFun = function () {
				if (selectedExistingPro == null) {
					layer.msg('请选择一个商品')
					return;
				}
				if (!selectedExistingPro.mylogistics) {
					layer.msg('请给选择的商品指定物流方式')
					return;
				}
				console.log(item.sourceType)
				existingConfirmFun[item.sourceType](selectedExistingPro, item)
			}
			$scope.selSkuBtFun = function (item) {
				console.log(item)
				var itemSkuName = item.skuName;
				for (var i = 0, len = $scope.stanProductList.length; i < len; i++) {
					if (itemSkuName == $scope.stanProductList[i].SKU) {
						item['PID'] = $scope.stanProductList[i].PID;
						item['NAMEEN'] = $scope.stanProductList[i].NAMEEN;
						item['NAME'] = $scope.stanProductList[i].NAME;
						item['ENTRYVALUE'] = $scope.stanProductList[i].ENTRYVALUE;
						item['ENTRYCODE'] = $scope.stanProductList[i].ENTRYCODE;
						item['BIGIMG'] = $scope.stanProductList[i].BIGIMG;
						item['ID'] = $scope.stanProductList[i].ID;
					}
				}
				console.log(item)
			}
			$scope.selBtConQuxiaoFun = function () {
				$scope.spBtTkFlag = false;
				$scope.existingPro = [];
			}
			$scope.selBtConfirmFun = function () {
				var upJson = {};
				upJson.stanList = [];
				upJson.ZFOrderId = $scope.isZfOrdId;
				for (var i = 0, len = $scope.spBtList.length; i < len; i++) {
					if (!$scope.spBtList[i].skuName) {
						layer.msg('请选择变体')
						return
					} else {
						console.log($scope.spBtList[i])
						upJson.stanList.push({
							SKU: $scope.spBtList[i].skuName,
							ID: $scope.spBtList[i].ID,
							PID: $scope.spBtList[i].PID,
							NAMEEN: $scope.spBtList[i].NAMEEN,
							NAME: $scope.spBtList[i].NAME,
							ENTRYVALUE: $scope.spBtList[i].ENTRYVALUE,
							ENTRYCODE: $scope.spBtList[i].ENTRYCODE,
							BIGIMG: $scope.spBtList[i].BIGIMG,
							payProductId: $scope.spBtList[i].payProductId
						})
					}
				}
				erp.load()
				console.log(upJson)
				erp.postFun('app/externalPurchase/sysncPayProduct', JSON.stringify(upJson), function (data) {
					console.log(data)
					if (data.data.code == 200) {
						layer.msg('指定成功')
						$scope.spBtTkFlag = false;
						$scope.existingPro = [];
						erp.postFun('app/sourcing/assignSource', {
								"sourceId": item.id,
								"productId": selectedExistingPro.id,
								"logistc": selectedExistingPro.mylogistics
							},
							function (res) {
								console.log(res)
								if (res.data.statusCode == 200) {
									getSourcingData();
								} else {
									erp.closeLoad()
								}
							},
							function (res) {
								console.log(res)
								erp.closeLoad()
							})
					} else {
						layer.msg('指定失败')
						erp.closeLoad()
					}
				}, function (data) {
					console.log(data)
					erp.closeLoad()
				})
			}
		}
		
		// 根据不同搜品类型现有商品操作确定按钮做不同的事
		const existingConfirmFun = {
			// 店铺搜品
			'0': (selectedExistingPro, item) => {
				console.log('店铺搜品')
				const params = {
					"sourceId": item.id,
					"productId": selectedExistingPro.id,
					"logistc": selectedExistingPro.mylogistics
				}
				erp.postFun('app/sourcing/assignSource', params, res => {
					if (res.data.statusCode === '200') {
						$scope.existingProductModal = false
						getSourcingData();
					}
				}, err => {
					console.log(err)
				})
			},
			// 个人搜品
			'1': (selectedExistingPro, item) => {
				const params = {
					"sourceId": item.id,
					"productId": selectedExistingPro.id,
					"logistc": selectedExistingPro.mylogistics
				}
				erp.postFun('app/sourcing/assignSource', params, res => {
					if (res.data.statusCode === '200') {
						$scope.existingProductModal = false
						getSourcingData();
						// 自动指派
						const params = {
							data: JSON.stringify({
								sourceId: item.id,
								productId: selectedExistingPro.id,
								logistc: selectedExistingPro.mylogistics,
								type: '1',
							})
						}
						erp.postFun('app/locProduct/assign', params, function (res) {
							console.log(res)
						}, err => {
							console.log(err)
						})
					}
				}, err => {
					console.log(err)
				})
			},
			// 平台搜品
			'2': (selectedExistingPro, item) => {
				console.log('平台搜品')
				if (item.zfOrderId) {
					erp.postFun('app/externalPurchase/selectZFOrderOfProductList', {
						'ZFOrderId': item.zfOrderId,
						'locProductId': selectedExistingPro.id,
					}, ({ data }) => {
						if (data.code === '200') {
							$scope.existingProductModal = false
							$scope.spBtTkFlag = true;
							$scope.spBtList = data.Result.payproductList;
							$scope.stanProductList = data.Result.stanProductList.map(o => ({ ...o, skuName: '' }))
							$scope.resSkuBtList = data.Result.stanProductList.map(o => o.SKU)
							console.log($scope.stanProductList)
							console.log($scope.resSkuBtList)
						}
					}, err => {
						console.log(err)
					}, { layer: true })
				} else {
					const params = {
						"sourceId": item.id,
						"productId": selectedExistingPro.id,
						"logistc": selectedExistingPro.mylogistics
					}
					erp.postFun('app/sourcing/assignSource', params, res => {
						if (res.data.statusCode === '200') {
							$scope.existingProductModal = false
							getSourcingData();
						}
					}, err => {
						console.log(err)
					})
				}
			},
			// 游客搜品
			'3': (selectedExistingPro, item) => {
				console.log('游客搜品')
				const params = {
					"sourceId": item.id,
					"productId": selectedExistingPro.id,
					"logistc": selectedExistingPro.mylogistics
				}
				erp.postFun('app/sourcing/assignSourceTourise', params, ({ data }) => {
					if (data.statusCode === '200') {
						$scope.existingProductModal = false
						getSourcingData();
					}
				}, err => {
					console.log(err)
				})
			},
		}
		
		// 等待搜品
		$scope.handelWaitingSource = item => {
			itemRequest(item.sourceType, item.status, item.id)
		}
		
		// 批量等待搜品
		$scope.handleBatchWaitingSource = () => {
			const ids = $scope.tableData.filter(o => o.checked).map(o => o.id)
			if (ids.length > 0) {
				itemRequest($scope.sourceType, $scope.status, JSON.stringify(ids))
			} else {
				layer.msg('请选择搜品')
			}
		}
		
		// 等待搜品 / 批量等待搜品
		function itemRequest(sourceType, status, id) {
			const statusJson = {
				'1': '7',
				'6': '1',
			}
			const requestData = {
				'0': {
					url: 'app/sourcing/modify1',
					params: {
						data: JSON.stringify({
							"status": statusJson[status],
							id
						})
					}
				},
				'1': {
					url: 'app/sourcing/modify1',
					params: {
						data: JSON.stringify({
							"status": statusJson[status],
							id
						})
					}
				},
				'2': {
					url: 'app/sourcing/cjModify1',
					params: {
						"status": statusJson[status],
						"sourceId": id
					}
				},
				'3': {
					url: 'pojo/touristSource/sourceFail1',
					params: {
						"status": statusJson[status],
						id
					}
				},
			}
			layer.load(2)
			erp.postFun(requestData[sourceType].url, requestData[sourceType].params, ({ data }) => {
				layer.closeAll('loading')
				if (data.statusCode === '200') {
					layer.msg(data.message);
					getSourcingData();
				} else {
					layer.msg(data.message);
				}
			})
		}
		
		// 初审失败
		$scope.handleFirstFailed = item => {
			$scope.firstFaileModal = true;
			$scope.itemData = item
			$scope.failExplain = ''
			//itemRequest(item.sourceType, item.status, item.id)
		}
		// 初审失败 - 确认
		$scope.handleFirstFailedConfirm = () => {
			if (!$scope.failExplain) {
				layer.msg('请输入失败原因')
				return
			}
			const params = {
				id: $scope.itemData.id,
				sourcetype: $scope.itemData.sourceType,
				failExplain: $scope.failExplain,
				status: '7',
			}
			layer.load(2)
			erp.postFun('source/sourcing/updateSourceStatus', params, ({ data }) => {
				layer.closeAll('loading')
				if (data.statusCode === '200') {
					$scope.firstFaileModal = false;
					getSourcingData();
				} else {
					layer.msg(data.message);
				}
			})
		}
		
		// 查看更多内容
		$scope.handleViewMoreContent = content => {
			if (!content) return
			layer.open({
				content: content || '-'
			});
		}
		
		// 相似商品
		$scope.showSimilarGoods = function (item) {
			const { pids } = item;
			console.log('showSimilarGoods item', item)
			if (!pids) return;
			layer.load(2);
			const url = `app/picture/getsourceProducts?pids=${pids}`;
			erp.getFun(url, function ({ data }) {
				layer.closeAll('loading');
				console.log('showSimilarGoods ---> data ', data)
				
				if (data.statusCode === '200') {
					const { products } = retSaveResult(data.result) || {};
					console.log('showSimilarGoods ---> res ', products)
					products.forEach(item => item.existingWuliu = []);//一开始 选择物流为空 须以空数组 表示
					$scope.existingPro = products;
					console.log($scope.existingPro)
					$scope.handleExistingProduct(item, $scope.existingPro)//调用 原先的功能 保留原先功能不变
				}
			}, function () {
				layer.closeAll('loading');
				layer.msg('网络错误')
			})
		}
		
		/*
		* 转供应商操作
		* 移植老代码
		* */
		// 获取供应商列表
		erp.postFun('supplier/user/userInfo/listAccountPage', JSON.stringify({pageNum:1,pageSize:1000}), res => {
			$scope.supplierList = res.data.data.list
		})
		
		// 单个转供应商报价 (移植代码)
		$scope.handleSupplierQuote = item => {
			console.log(item)
			$scope.dgzspFlag =true
			$scope.chooseSource = item
		}
		
		// 批量转供应商报价 (移植代码)
		$scope.handleBatchSupplierQuote = () => {
			$scope.batchChooseSource = $scope.tableData.filter(o => o.checked)
			if ($scope.batchChooseSource.length > 0) {
				$scope.plzspFlag = true
			} else {
				layer.msg('请选择搜品')
			}
		}
		
		// 单个的转搜品的确认按钮 (移植代码)
		$scope.handleSingleConform = function(){
			if(!$scope.supplierId){
				layer.msg('请选择供应商!')
				return
			}
			let ids = []
			let supplierId =$scope.supplierId
			ids.push($scope.chooseSource.ID||$scope.chooseSource.id)
			$scope.dgzspFlag =false
			assignSupplier(ids,supplierId)
		}
		
		// 批量转搜品的确认按钮 (移植代码)
		$scope.handleBatchConform = function(){
			if(!$scope.supplierId){
				layer.msg('请选择供应商!')
				return
			}
			let ids = []
			let supplierId =$scope.supplierId
			$scope.batchChooseSource.map((item)=>{
				ids.push(item.ID||item.id)
			})
			$scope.plzspFlag =false
			assignSupplier(ids,supplierId)
		}
		
		// 指派供应商报价操作 (移植代码)
		assignSupplier = function(ids,supplierId){
			layer.load(2);
			const data={
				ids,
				type:2,
				supplierId,
			}
			erp.postFun('erpSupplierSourceProduct/updateByIds', JSON.stringify(data), function (res) {
				layer.closeAll("loading");
				if(res.data.code == 200) {
					getSourcingData()
				}else{
					layer.msg(res.data.message)
				}
			})
		}
		
		$scope.closeSingleSearch =function(){
			$scope.dgzspFlag =false
		}
		
		$scope.closeBatchSearch =function(){
			$scope.plzspFlag =false
		}
		
		
		
		/*
		这段转供应商报价可能以后会需要
		// 批量转供应商报价 (移植代码)
		$scope.handleBatchSupplierQuote = () => {
			const ids = $scope.tableData.filter(o => o.checked).map(o => o.id)
			if (ids.length > 0) {
				showCategory()
			} else {
				layer.msg('请选择搜品')
			}
		}
		
		// 转供应商报价 (移植代码)
		$scope.handleSupplierQuote = item => {
			console.log(item)
			if (item.source_category || item.source_category == 0) {
				singleToSupplier(item, '')
			} else {
				showCategory(item)
			}
		}
		
		// 获取类目
		erp.postFun('erpSupplierSourceProduct/list', {}, res => {
			$scope.categoryList = res.data.data
		})
		
		// 选择类目
		$scope.chooseCateGory = function (id) {
			$scope.chooseCateGoryId = id
		}
		
		// 点击取消
		$scope.closeCategory = function () {
			$scope.xzlmFlag = false
			$scope.singleSearchItem = '';
		}
		
		// 点击确定
		$scope.categoryConfirm = function () {
			if ($scope.chooseCateGoryId) {
				if ($scope.isSingleSearch) {
					singleToSupplier($scope.singleSearchItem, $scope.chooseCateGoryId)
				} else {
					batchToSupplier()
				}
			} else {
				layer.msg("请选择类目")
			}
		}
		
		function showCategory(singleItem) {
			$scope.xzlmFlag = true
			$scope.singleSearchItem = singleItem || '';
			$scope.isSingleSearch = singleItem ? true : false;
		}
		
		// 多个搜品转供应商
		function batchToSupplier() {
			const productList = $scope.tableData.filter(o => o.checked).map(o => ({
				categoryId: o.source_category,
				sourceProductId: o.id
			}))
			
			const data = {
				categoryId: $scope.chooseCateGoryId,
				sourceProduct: productList,
				sourceProductType: 0
			}
			console.log(data)
			layer.load(2);
			erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocate', JSON.stringify(data), function (res) {
				layer.closeAll("loading");
				if (res.data.code == 200) {
					$scope.xzlmFlag = false
					getSourcingData()
				} else {
					layer.msg(res.data.error)
				}
			})
		}
		
		// 单个搜品转供应商
		function singleToSupplier(item, id) {
			console.log(item)
			layer.load(2);
			const data = {
				categoryId: id,
				sourceProduct: [{
					categoryId: item.source_category,
					sourceProductId: item.id
				}],
				sourceProductType: 0
			}
			erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocate', JSON.stringify(data), function (res) {
				layer.closeAll("loading");
				if (res.data.code == 200) {
					$scope.xzlmFlag = false
					getSourcingData()
				} else {
					layer.msg(res.data.error)
				}
			})
		}*/
	}])
	
	function retSaveResult(str) {//处理 返回data 为 json 情况
		try {
			str = JSON.parse(str)
		} catch (err) {
			console.log('retSaveResult err', err)
		}
		return str;
	}
})()
