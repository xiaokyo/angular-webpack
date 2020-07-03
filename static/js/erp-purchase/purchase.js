/**
 * 2019-12-7  复制老代码 进行修改 ----xiaoy
 */

(function app() {
  var app = angular.module('purchase-12-15', []);
  const warehouseList = window.warehousePurList
  const markList = [// 统一采购标记
    { value: 'zhengChang', label: '正常' },
    { value: 'jiaJi', label: '加急' },
    { value: 'vip', label: 'Vip' },
    { value: 'zhiFa', label: '直发' },
    { value: 'zuZhuang', label: '组装' },
    { value: 'buRuKu', label: '不入库' },
    { value: 'usaZhiFa', label: '美国仓直发' },
    { value: 'xianXiaZu', label: '线下组' },
    { value: 'gaiBiao', label: '改标' },
	];
	const CAIGOU_PAYMENT_TYPE = { // 付款状态
		'1':'待打款',
		'2':'已打款', 
		'3':'已拒绝', 
		// '4':'已拒绝废弃'
	}
	const PAY_TYPE = { // 付款类型
		'1':'预付订金',
		'2':'先付款后发货',
		'3':'先发货后付款'
	}
	const api = {
		goodsList: 'procurement/order/queryProcurementOrderList',//商品 list {post inputStr: '搜索内容', pageNum: '1', pageSize: '30', storageId: '仓库id' }
		needGoodsList: 'procurement/order/todaySkuListQueHuo',//缺货商品 list {post data: {storageId: '', inputStr: '搜索内容' }, pageSize: '', pageNum: ''}
		goodsVariantList: 'procurement/order/todaySkuListVariant',//变体 list {post pid: '商品id', storageId: '仓库id'} // 商品id -->> productId
		relate_old: 'caigou/alProduct/jianLiCaiGouGuanLian',// 
		relate:'procurement/order/establishPurchasingRelationship ',//
		submit_old: 'caigou/procurementTwo/belowPurchase',//
		submit: 'procurement/order/belowPurchase',
		onlineSubmit_old: 'caigou/procurementTwo/onlinePurchaseNotAPI',//tmall taobao 线上采购 
		onlineSubmit: 'procurement/order/onlinePurchaseNotAPI',//tmall taobao 线上采购 
		checkOnlineOrder: 'procurement/order/checkUn1688Order', // 检测线上提交orderId是否存在
		purchaseRelevanceQuery:'procurement/aliProduct/getProductRelevanceInfo', // 采购关联查询
	}
  // 2019-12-6 修改采购 模块 --->>> 
	//erp 出单采购
	app.controller('purchaseOrderCtrl', ['$scope', 'erp', function ($scope, erp) {
		console.log('代码已转移新的文件 purchase_new.js')
	}])
	//  线上采购
	app.controller('newOnlineCtrl', ['$scope', 'erp', function($scope, erp) {
		
		// `http://127.0.0.1:5500/manage.html#/erppurchase/tmall?pid=E9213989-37B9-4670-9A2D-2D38FE2CAB3A&hasStockout=0&which=2`;//非1688API :0 淘宝：2 天猫：3
		let query = erp.retUrlQuery();//caigoubiaoji
		let orderNameObj = { 0: '1688', 2: '淘宝', 3: '天猫', };
		$scope.name = orderNameObj[query.which];
		$scope.warehouseList = warehouseList;//仓库列表
		$scope.markList = markList;
		$scope.list = [];//列表数据
		$scope.params = {
			gongHuoGongSi: '',//供货公司
			caiGouLianJie: '',//供货类型 采购url 
			cangKu: '0',//仓库 前台写死 默认义乌仓库
			chuDanCaiGouIds: [],//{传入变体列表 id: '',//变体id danjia: '',// 单价number: 0,//数量}
			dingDanHao: '',//订单号
			caigouleixing: query.which || '',//非1688API :0 淘宝：2 天猫：3
			yuanZongJia: '',//总价格
			biaoji: query.caigoubiaoji || 'zhengChang',//标记
			employeeId: '',//
			employeeName: '',//昵称
			job: ''//职位
		}
		const storageObj = warehouseList.find(item => item.id.includes(query.storageId)) ;
		$scope.params.cangKu = storageObj ? storageObj.value : '0';//默认通过传参 得到 对应的 仓库
		console.log('---->> ', $scope.params.cangKu)
		$scope.wareName = '';//仓库 显示中文
		$scope.markName = '';//标记 显示中文
		$scope.confirmBoxShow = false;//是否显示确认弹框
		const batchingSetting = {//批量设置数量
			batchingSettingBoxShow: false,
			value: 0,
			batchingNumberUpdate() {
				let val = batchingSetting.value;
				val = +val; 
				$scope.list.map(item => {
					item.count = val || 0;
					return item;
				})
				batchingSetting.batchingSettingBoxShow = false;
			},
			show() {
				batchingSetting.value = 0;
				batchingSetting.batchingSettingBoxShow = true;
			}
		}
		$scope.batchingSetting = batchingSetting;//是否显示批量设置
		$scope.handleBack = handleBack;
		$scope.handleConfirm = function () {//确认并显示 确认弹框
			let pass = allowSubmit();
			if (pass !== 'ok') return layer.msg(pass)
			const { cangKu, biaoji } = $scope.params;
			$scope.warehouseList.find(({value, label}) => {
				if (value !== cangKu) return false;
				$scope.wareName = label;
				return true;
			})
			$scope.markList.find(({label, value}) => {
				if (value !== biaoji) return false;
				$scope.markName = label;
				return true;
			})
			$scope.confirmBoxShow = true;
		}

		// 判断预采购师傅在处理中且在路上
		$scope.isHandleAdvancePuchaseNum = function(item){
			const { useStatus, trueQuantity } = item
			let res = ''
			if(useStatus == "1" && trueQuantity){
				res = "(" + trueQuantity + "在路上)"
			}
			return res
		}

		function allowSubmit() {//提交前是否参数备齐
			const { gongHuoGongSi, caiGouLianJie, dingDanHao, caigouleixing, yuanZongJia, chuDanCaiGouIds } = $scope.params;
			console.log('allowSubmit', $scope.params)
			if ($scope.list.length === 0) return '没有可提交的数据';
			if (!gongHuoGongSi) return '供货公司不能为空';
			if (!dingDanHao) return '订单号不能为空';
			if (!yuanZongJia) return '总价格不能为空';
			if ($scope.list.some(({count}) => count === 0 )) return '采购数量不能为空';
			if (!caigouleixing) return '采购类型异常';
			if (!caiGouLianJie) return '采购链接异常';
			if (!chuDanCaiGouIds) return '参数chuDanCaiGouIds异常';
			$scope.list = calcPrice($scope.list, yuanZongJia);//每条变体的总价比 对应输入 实际总价的  计算 商品对的价格
			$scope.params.chuDanCaiGouIds = $scope.list.map(item => {
				const { id, costPrice: danjia, count: number, calcPrice, sku, procurementCount, returnDays } = item;
				return { id, calcPrice, number, danjia, storage:$scope.params.cangKu, sku, procurementCount, returnDays }
			});
			return 'ok';
		}
		function calcPrice(list, cost) {//每条变体的总价比 对应输入 实际总价的  计算 商品对的价格
			const total = list.reduce((prev, next) => {
				const nextTotal = next.costPrice * next.count;
				return prev + nextTotal;
			}, 0)
			let clacList = list.map((item) => {
				const { costPrice, count } = item
				const ratio = costPrice * count / total;
				item.calcPrice = Math.round(cost * ratio / count * 100) / 100;
				return item;
			})
			return clacList;
		}
		$scope.handleSubmit = function() {
			$scope.params.job = erp.myStorage('job');
			$scope.params.employeeId = erp.myStorage('erpuserId');
			$scope.params.employeeName = erp.myStorage('erpname');
			// return console.log(' handleSubmit $scope.params', $scope.params)
			submit($scope.params)
		}
		function submit(params, checkOrderId = true) {//http线上非1688api采购 提交
			let url = api.onlineSubmit;
			if(checkOrderId) url = api.checkOnlineOrder // 如果时校验orderId则改为校验OrderId接口
			erp.load();
			erp.mypost(url, params).then((res) => {
				if(!checkOrderId){ // 不是校验orderId接口时提示成功并返回上级页面
					layer.msg('提交成功')
					handleBack()
					return
				}

				// 订单号存在
				if(!res){
					submit(params, false) // 不检验订单号提交
				}else{
					layer.confirm('该订单已存在，是否合并此次提交？', {
						title:'订单重复提示',
						btn: ['取消','确定'] //按钮
					}, null, function(){
						submit(params, false)
					});
				}
			})
		}
		$scope.selectWarehouse = function() {
			console.log('selectWarehouse')
		}
		
		function getList() {//http  获取当前列表
			let query = erp.retUrlQuery();
			let { hasStockout, pid, which, storageId, index, supplierUrl } = query;
			console.log(query)
			if (hasStockout === undefined || pid === undefined || which === undefined || storageId === undefined) return console.log('缺少必传参数');
			const url = api.goodsVariantList;
			const isQueHuo = hasStockout === '1';
			erp.mypost(url, {pid, storageId, isQueHuo}).then(list => {
      console.log("TCL: getList -> list", list)
				
				$scope.params.caiGouLianJie = supplierUrl;
				$scope.params.caigouleixing = which;
				$scope.list = [];
				if (index === undefined) {//多个 or 单个采购
					$scope.list = list.map(item => {
						const recommentCount = calcRecommendCount(item);
						return ({...item, count: recommentCount, recommentCount})
					})
				} else {// 单个采购
					const item = list[index];
					const recommentCount = calcRecommendCount(item);
					$scope.list = [{...item, count: recommentCount, recommentCount}]
				}
			})
		}
		function getListFromSession() {// 批量线下采购 操作 二次 需求  需整体思考后 整理
			let query = erp.retUrlQuery();
			let { which, supplierUrl } = query;
			$scope.params.caiGouLianJie = supplierUrl;
			$scope.params.caigouleixing = which;
			const { list } = erp.mySession('purchase');
			console.log('session purchase list --->> ',list)
			$scope.list = list.map(item => {
				const recommentCount = calcRecommendCount(item);
				return ({...item, count: recommentCount, recommentCount})
			})
		}
		function init() {
			let { pid } = erp.retUrlQuery(); // 1 单个采购 2 商品下 全部变体采购  3 批量线下采购 操作
			pid ? getList() : getListFromSession();// 若传递 商品id 则 走 1、2流程  若 未传 则 走 批量流程
		}
		init()
		function handleBack() {//处理返回
			const value = $scope.params.cangKu;
      const { id } = warehouseList.find(item => item.value === value);
			let storageId = id[0];
			const { pageNum = '1', buyerId = '', assignBuyerId = '' } = erp.retUrlQuery()
			navBack(erp, {storageId, pageNum, buyerId, assignBuyerId})
		}
		//计算推荐采购的数量 orderNeedCount 订单需求数量  inprocurementCount-> 采购中数量 kuCun -> 库存数量
		function calcRecommendCount({orderNeedCount, inprocurementCount, kuCun}) {
			let calcCount = orderNeedCount - inprocurementCount - kuCun;
			return calcCount > 0 ? calcCount : 0;
		}

		$scope.keyUpNum = function(index,key){$scope.list[index][key] = numRegReturn($scope.list[index][key])}
		function numRegReturn(str){return str.replace(/[^\d]/g,'')}
	}])
	//   1688api
	app.controller('new1688ApiCtrl', ['$scope', 'erp', function ($scope, erp){
		const query = erp.retUrlQuery();
		$scope.markList = markList; //全局标记 列表
		$scope.mark = 'zhengChang';
		$scope.signRemark = '' // 标记备注
		let { url: purchaseUrl, caigoubiaoji = 'zhengChang', index } = query;

		$scope.handleBack = function () {
			const { storageId, pageNum, buyerId, assignBuyerId } = query
			navBack(erp, { storageId, pageNum, buyerId, assignBuyerId })
		};

		$scope.seletedCgLink = purchaseUrl;//批量选择 默认 此链接 url
		$scope.mark = caigoubiaoji;
		$scope.isSingle = index !== undefined; //若传了 index  则为 单个 关联 若 未传 全部关联
		function getVarientItems() {
			let query = erp.retUrlQuery();
			let { url, caigoubiaoji, index, pid, storageId, stanId, hasStockout } = query;

			$scope.cgBtItemObj = { dingDanZhuangtai: caigoubiaoji, name: url }

			const params = { caigoubiaoji, url }
			stanId && Object.assign(params, { stanId })
			console.log(query, erp.decodeUrl(url))
			const isQueHuo = hasStockout === '1';
			erp.mypost(api.goodsVariantList, { pid, storageId, isQueHuo }).then(list => {
				if (list.length === 0) return;//没有对应的变体
				let cgList = list[0].supplierLink;

				$scope.cgList = cgList.map(item => ({ ...item, dingDanZhuangtai: 'zhengChang' }))
				if (index) {//公司单个变体 关联
					$scope.sigleParams = list[index];
				} else {//公司多个变体列表 // 多个 变体列表下  的 供应商地址相同
					$scope.btCheckedArr = list;
				}

				get1688GoodsList(params)
			})
		}
		function get1688GoodsList(params) {//获取 1688变体 {caigoubiaoji, url }
			const url = 'caigou/alProduct/getAlProduct';
			erp.mypost(url, params).then(res => {//获取变体列表
				$scope.glBtList = res.product;//变体列表上一级
				$scope.glBtsArr = res.product[0].stanProducts;//变体列表
				getRelevanceForVariants()
			}).catch(() => {
				$scope.btCheckedArr = [];
			})
		}
		function getListFromSession() { // 从session拿出单采购保存过来的变体列表
			let query = erp.retUrlQuery();
			let { url } = query;
			const { list } = erp.mySession('purchase');
			$scope.btCheckedArr = list;
			let cgList = list[0].supplierLink;
			$scope.cgList = cgList.map(item => ({ ...item, dingDanZhuangtai: 'zhengChang' }))
			get1688GoodsList({ url, caigoubiaoji: $scope.mark })
		}
		/**
		 * 获取该变体是否有关联状态的信息
		 */
		function getRelevanceForVariants(){
			const params = {
				href:purchaseUrl,
				stanIdList: index ? [$scope.sigleParams.variantId] : $scope.btCheckedArr.map(_ => _.variantId)
			}

			if(!params.href) throw new Error('无供应商链接')
			if(!params.stanIdList || params.stanIdList.length <= 0) throw new Error('无变体信息')

			const load = layer.load(0)
			erp.postFun(api.purchaseRelevanceQuery, params, function(res){
				layer.close(load)
				if(res.data.code != 200) return layer.msg(res.data.message || '网络错误')
				const relevanceList = res.data.data || []

				const list = $scope.btCheckedArr
				list.forEach((variantItem, pIndex) => {
					relevanceList.forEach((alibabaItem, index) => {
						const { stanId, aliStanProductVOList } = alibabaItem
						if(stanId === variantItem.variantId){
							if(aliStanProductVOList && aliStanProductVOList.length > 0){
								aliStanProductVOList.forEach(o => {
									const obj1 = Object.assign({}, list[pIndex].glxzObject, { [o.productId]: { ...o, cgLink:o.productId } });
									list[pIndex].glxzObject = obj1
									list[pIndex].glxzArr = objToArrFn(list[pIndex].glxzObject);
								})
							}
						}
					})
				})
				$scope.btCheckedArr = [...list]
			})
		}
		/**
		 * https://detail.1688.com/offer/547651983678.html?spm=b26110380.8880418.csimg003.12.5549adcciyJGrv
		 * 截取链接中的产品数字id
		 */
		function getPidByPurchaseLink(link, reverse = false){
			if(!link) return ''
			if(reverse) {
				const obj = $scope.cgList.find(_ => _.name.indexOf(link) != -1)
				return (obj && obj.name) || `https://detail.1688.com/offer/${link}.html`
			}
			return link.split('offer/')[1].split('.html')[0]
		}

		//选中 
		$scope.btCheckedArr = [];//变体列表
		$scope.cgList = [];
		$scope.glBtsArr = [];
		$scope.cgBtItemObj = {};
		var btID = [];
		
		//变体的复选框
		//批量采购
		$scope.bulkCgFlag = false;

		
		//单个线下完成
		$scope.xxcgCkVal = '0';
		$scope.show1688BtFun = function (item, index) {//显示1688变体 跟当前变体关联
			$scope.plGuanLianFlag = true;
			$scope.checkedBtIndex = index;
			$scope.glBtsArr = $scope.glBtsArr.map((_)=>({ ..._, isDefault:false }))
		}
		$scope.plCheckBtFun = function (item) {//选择选项
			const [fristItem] = $scope.glBtList
			const { minOrderQuantity, qualityLevel, supplierUserId, supplierLoginId } = fristItem

			const checkedIndex = $scope.checkedBtIndex;
			$scope.glBtsArr = $scope.glBtsArr.map((_)=>({ ..._, isDefault:false }))
			item.isDefault = true;
			$scope.gl1688ItemObj = item;
			$scope.isGuanLianFlag = true;//是否有关联
			const list = $scope.btCheckedArr

			const obj1 = Object.assign({},
				list[checkedIndex].glxzObject,
				{ [getPidByPurchaseLink($scope.seletedCgLink)]: item });
			list[checkedIndex].glxzObject = obj1
			list[checkedIndex].glxzArr = objToArrFn(list[checkedIndex].glxzObject);
			list[checkedIndex].guanLianObj = item;
			list[checkedIndex].glxzArr = list[checkedIndex].glxzArr.map(_ => ({..._, minOrderQuantity, qualityLevel, supplierUserId, supplierLoginId }))
			$scope.btCheckedArr = list
			$scope.plGuanLianFlag = false;
		}
		$scope.delYglFun = function (glitem, pIndex) {
			let link = glitem.cgLink;
			if(link){
				delete $scope.btCheckedArr[pIndex].glxzObject[link]
				$scope.btCheckedArr[pIndex].glxzArr = objToArrFn($scope.btCheckedArr[pIndex].glxzObject)
			}
		}
		$scope.plSureGuanlianFun = function () {// --------->>>> 确定建立批量的关联关系
			let caigouCaigouguanlian = {};
			caigouCaigouguanlian.caiGouGuanLianList = [];
			let { storageId, storagename } = query;
			if (!$scope.btCheckedArr || $scope.btCheckedArr.length <= 0) return layer.msg('此商品无变体')
			for (let i = 0, len = $scope.btCheckedArr.length; i < len; i++) {
				const item = $scope.btCheckedArr[i];
				const relevanceArr = item.glxzArr
				if (relevanceArr && relevanceArr.length > 0) {
					for (let k = 0, kLen = relevanceArr.length; k < kLen; k++) {
						const releteItem = relevanceArr[k]
						const upIdArr = [];
						upIdArr.push(item.id)
						const obj = {
							"chuDanCaiGouIds": upIdArr,
							"dingDanZhuangtai": $scope.mark,
							"signRemark": $scope.signRemark,
							"stanId": $scope.btCheckedArr[i].variantId,//变体id
							"locId": $scope.btCheckedArr[i].productId,//商品id
							"specId": releteItem.specId,//1688变体id
							"quantity": $scope.btCheckedArr[i].orderNeedCount,//变体中退件采购数量
							"caiGouLianJie": getPidByPurchaseLink(releteItem.cgLink, true),
							"price": releteItem.sellPrice,
							"skuCode": releteItem.stanSkuZw, //1688变体sku
							"amountOnSale": releteItem.amountOnSale, //1688
							"offerId": releteItem.productId || releteItem.offerId || releteItem.cgLink,//1688商品id
							"minOrderQuantity": releteItem.minOrderQuantity,//1688起批量
							"qualityLevel": releteItem.qualityLevel,//供应商星级
							"supplierLoginId": releteItem.supplierLoginId,//供应商名称
							"supplierUserId": releteItem.supplierUserId,
							"storageid": storageId,
							"storagename": storagename
						}
						caigouCaigouguanlian.caiGouGuanLianList.push(obj)
					}
				} else {
					layer.msg('请为每个变体都建立关联关系')
					return
				}
			}
			caigouCaigouguanlian.dingDanZhuangtai = $scope.mark;
			caigouCaigouguanlian = JSON.stringify(caigouCaigouguanlian)
			erp.postFun(api.relate, caigouCaigouguanlian, function ({ data }) {
				layer.msg(data.message || '关联成功')
				if (data.code == 200) {
					$scope.plBianTiFlag = false;
					$scope.bulkCgFlag = false;
					$scope.gl1688ItemObj = '';
					$scope.handleBack()
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}

		// 移除当条变体
		$scope.removeVariant = function (index) {
			layer.confirm('你确定移出该条变体?', { title: '提示' }, function (i) {
				$scope.btCheckedArr.splice(index, 1)
				layer.close(i)
				$scope.$apply()
			})
		}

		$scope.glxzArr = [];//关联选中的变体集合
		let glxzObj = {};//关联选中的对象
		$scope.openJxglFun = function (index) {// 继续关联
			$scope.jxglFlag = true;
			$scope.checkedBtIndex = index;
		}
		$scope.checkCgLinkFun = function (item) {//选择采购链接
			// console.log(item)
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
		$scope.checkBtFun = function (item) {//单个公司变体情况下 选择1688变体
			for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
				$scope.glBtsArr[i].isDefault = false;
			};
			glxzObj[getPidByPurchaseLink($scope.seletedCgLink)] = item;
			// console.log('glxzObj----------->>', glxzObj)
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
			let { storageId, storagename } = query;
			const { variantId, productId, orderNeedCount, id } = $scope.sigleParams;
			caigouCaigouguanlian.caiGouGuanLianList = [];
			console.log(btID, $scope.glxzArr)
			for (let i = 0, len = $scope.glxzArr.length; i < len; i++) {
				let obj = {
					"caiGouLianJie": $scope.glxzArr[i].cgLink,
					"dingDanZhuangtai": $scope.mark,
					"quantity": orderNeedCount,//采购数量  公司变体
					"chuDanCaiGouIds": [id],  // [id...]
					"stanId": variantId,//变体id  公司变体
					"locId": productId,//商品id 公司变体
					"offerId": $scope.glBtList[0].offerId,//1688商品id
					"minOrderQuantity": $scope.glBtList[0].minOrderQuantity,//1688起批量
					"qualityLevel": $scope.glBtList[0].qualityLevel,//供应商星级
					"supplierLoginId": $scope.glBtList[0].supplierLoginId,//供应商名称
					"signRemark": $scope.signRemark,
					"supplierUserId": $scope.glBtList[0].supplierUserId, 
					"price": $scope.glxzArr[i].sellPrice,
					"skuCode": $scope.glxzArr[i].stanSkuZw, //1688变体sku
					"specId": $scope.glxzArr[i].specId,//1688变体id
					"amountOnSale": $scope.glxzArr[i].amountOnSale,//1688库存
					"storageid": storageId,
					"storagename": storagename
				}
				caigouCaigouguanlian.caiGouGuanLianList.push(obj)
			}
			caigouCaigouguanlian.dingDanZhuangtai = $scope.mark;
			caigouCaigouguanlian.supplierUserId = $scope.glBtList[0].supplierUserId
			// return console.log(caigouCaigouguanlian, 'caigouCaigouguanlian')
			erp.postFun(api.relate, caigouCaigouguanlian, function ({ data }) {
				console.log("TCL: $scope.sureGuanlianFun -> data", data)
				layer.msg(data.message || '关联成功')
				if (data.code == 200) {
					$scope.guanLianFlag = false;
					$scope.flag1 = false;
					$scope.gl1688ItemObj = '';
					$scope.glxzArr = [];
					glxzObj = {};
					navBack(erp, { storageId, pageNum: erp.retUrlQuery().pageNum || '1' })
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}

		function setDrag() {
			// drag  拖拽关联弹窗
			const dragBox = document.getElementById('dragBox')
			console.log(dragBox, 'dragBox')
			const dragEv = dragBox.getElementsByClassName('title')[0]
			let x = 0, y = 0, l = 0, t = 0, isDown = 0;

			//鼠标按下事件
			dragEv.onmousedown = function (e) {
				//获取x坐标和y坐标
				x = e.clientX;
				y = e.clientY;

				//获取左部和顶部的偏移量
				l = dragBox.offsetLeft;
				t = dragBox.offsetTop;
				//开关打开
				isDown = true;
				//设置样式  
				// dragEv.style.cursor = 'move';
			}
			//鼠标移动
			window.onmousemove = function (e) {
				if (isDown == false) {
					return;
				}
				//获取x和y
				var nx = e.clientX;
				var ny = e.clientY;
				//计算移动后的左偏移量和顶部的偏移量
				var nl = nx - (x - l);
				var nt = ny - (y - t);

				dragBox.style.left = nl + 'px';
				dragBox.style.top = nt + 'px';
			}
			//鼠标抬起事件
			dragEv.onmouseup = function () {
				//开关关闭
				isDown = false;
				// dragEv.style.cursor = 'default';
			}
		}
		setDrag()

		function init() {
			let { pid } = erp.retUrlQuery(); // 1 单个采购 2 商品下 全部变体采购  3 批量线下采购 操作
			pid ? getVarientItems() : getListFromSession();
		}
		init()
	}])
	
	//  线下采购
	app.controller('newOfflineCtrl', ['$scope', 'erp', function ($scope, erp){
		const query = erp.retUrlQuery()
		console.log('newOfflineCtrl page', query)
		const modifyApi = {
			submit_old: 'caigou/procurementTwo/belowPurchase',//
			submit: 'procurement/order/belowPurchase',//
		}
		// 采购 仓库 传参  1 义乌仓  2 深圳仓  3 美东仓  4 美西仓  5 泰国仓 6 印尼仓
		$scope.warehouseList = warehouseList;//文件全局变量 仓库列表
		$scope.markList = markList;//文件全局变量 标记列表
		$scope.list = [];//列表数据
		$scope.addressList = [];//地址 list 
		$scope.params = {
			dingDanZhuangtai: 'zhengChang',//订单状态
			gongSiMing: '',//供货公司
			addressId: '',// 地址 value
			address: '',// 地址 label
			cangKu: '0',//仓库 前台写死 默认义乌仓库
			skuNums: [],//传入变体列表[{id: '变体id', cjImg: '', cjProductId: '商品id', cjShortSku: '短SKU', cjSku: 'sku', cjStanproductId: '变体id', shuLiang: '数量', danJia: '单价', cjHuoWuBiaoTi: '货物标题'}] --> 变体列表
			//提交时 以下字段 不需传参
			employeeId: '',//
			employeeName: '',//昵称
			job: '',//职位
			zhifu: 0,// 新街口 默认 为 0 需求已将该字段除去  2-28
		}
		const storageObj = warehouseList.find(item => item.id.includes(query.storageId));
		$scope.params.cangKu = storageObj ? storageObj.value : '0';
		$scope.wareName = '';//显示中文
		$scope.markName = '';//显示中文
		$scope.confirmBoxShow = false;//是否显示确认弹框
		const batchingSetting = {//批量设置数量
			batchingSettingBoxShow: false,
			value: 0,
			batchingNumberUpdate() {
				let val = batchingSetting.value;
				val = +val; 
				$scope.list.map(item => {
					item.count = val || 0;
					return item;
				})
				batchingSetting.batchingSettingBoxShow = false;
			},
			show() {
				batchingSetting.value = 0;
				batchingSetting.batchingSettingBoxShow = true;
			}
		}
		$scope.batchingSetting = batchingSetting;//是否显示批量设置
		$scope.handleBack = handleBack;
		$scope.handleConfirm = function () {
			let pass = allowSubmit();
			if (pass !== 'ok') return layer.msg(pass)
			const { dingDanZhuangtai } = $scope.params;
			$scope.wareName = retSelectedWarehouse();
			$scope.markList.find(({label, value}) => {
				if (value !== dingDanZhuangtai) return false;
				$scope.markName = label;
				return true;
			})
			$scope.confirmBoxShow = true;
		}
		function allowSubmit() {//提交前是否参数备齐
			const { gongSiMing } = $scope.params;
			console.log('allowSubmit', $scope.params)
			if ($scope.list.length === 0) return '没有可提交的数据';
			if (!gongSiMing) return '供货公司不能为空';
			if ($scope.list.some(({count}) => count === 0 )) return '采购数量不能为空';
			$scope.params.skuNums = $scope.list.map(item => {
				const { id: id, img: cjImg, costPrice: danJia, count: shuLiang, shortSku: cjShortSku, sku: cjSku, productId: cjProductId, nameEn: cjHuoWuBiaoTi, variantId: cjStanproductId, calcPrice, procurementCount, returnDays } = item;
				return { id, cjImg, cjProductId, cjShortSku, cjSku, cjStanproductId, shuLiang, danJia, cjHuoWuBiaoTi, calcPrice, storage:$scope.params.cangKu, sku:cjSku, procurementCount, returnDays }
			});
			return 'ok';
		}

		// 判断预采购师傅在处理中且在路上
		$scope.isHandleAdvancePuchaseNum = function(item){
			const { useStatus, trueQuantity } = item
			let res = ''
			if(useStatus == "1" && trueQuantity){
				res = "(" + trueQuantity + "在路上)"
			}
			return res
		}
		
		$scope.handleSubmit = function() {
			$scope.params.job = erp.myStorage('job');
			$scope.params.employeeId = erp.myStorage('erpuserId');
			$scope.params.employeeName = erp.myStorage('erpname');
			// return console.log('handleSubmit', $scope.params)
			submit($scope.params)
		}
		function submit(params) {
			const url = modifyApi.submit;
			erp.load();
			erp.mypost(url, params).then(() => {
				layer.msg('提交成功')
				handleBack()
			})
		}
		
		
		function handleBack() {//处理返回
			const value = $scope.params.cangKu;
      const { id } = warehouseList.find(item => item.value === value);
			let storageId = id[0]
			const {pageNum = '1', buyerId = '', assignBuyerId = '' } = erp.retUrlQuery()
			navBack(erp, {storageId, pageNum, buyerId, assignBuyerId})
		}
		$scope.selectWarehouse = function() {
			$scope.wareName = retSelectedWarehouse()
		}
		function retSelectedWarehouse() {//返回当前已选择的 仓库名称
			let warehouse = warehouseList.find(item => item.value === $scope.params.cangKu)
			return warehouse ? warehouse.label: '';
		}
		$scope.exportExcel = exportExcel;
		function exportExcel() {
			if ($scope.list.length === 0) return layer.msg('没有可导出的数据内容');
			erp.load()
			const url = 'caigou/procurementTwo/belowPurchaseExcel';
			let params = {data: $scope.list.map(item => ({img: item.IMG, sku: item.SKU, number: item.count}))};
			erp.mypost(url, params).then(res => {
				let url = JSON.parse(res).href;
				console.log('exportExcel -->> ', url)
				navTo(url)
			})
		}
		function getList() {
			let query = erp.retUrlQuery();
			let { hasStockout, pid, index, storageId } = query;//index
			console.log(query)
			if (hasStockout === undefined || pid === undefined) return console.log('缺少必传参数');
			const url = api.goodsVariantList;
			const isQueHuo = hasStockout === '1';
			erp.mypost(url, {pid, storageId, isQueHuo}).then(list => {
      
      	console.log("TCL: getList -> list", list)
				$scope.params.caiGouLianJie = list[0] && list[0].supplierLink;
				$scope.list = [];
				if (index === undefined) {//多个 or 单个采购
					$scope.list = list.map(item => {
						const recommentCount = calcRecommendCount(item);
						return ({...item, count: recommentCount, recommentCount})
					})
				} else {
					const item = list[index];
					const recommentCount = calcRecommendCount(item);
					$scope.list = [{...item, count: recommentCount, recommentCount}]
				}
			})
		}
		function getListFromSession() {// 批量线下采购 操作
			const { list = [] } = erp.mySession('purchase') || {};
			console.log('session purchase list --->> ',list)
			$scope.list = list.map(item => {
				const recommentCount = calcRecommendCount(item);
				return ({...item, count: recommentCount, recommentCount})
			})
		}
		function init() {//异步 等 当前 控制器 执行栈 执行完成再执行
			let { pid } = erp.retUrlQuery(); // 1 单个采购 2 商品下 全部变体采购  3 批量线下采购 操作
			pid ? getList() : getListFromSession()
		}
		init()
		
		
		function getAddressList() {
			const url = 'procurement/caigouAliaddress/list';
			const params = {
				pageNum: 1,
				pageSize: 1000
			}
			erp.mypost(url, params).then(({list}) => {
				console.log("TCL: getAddressList -> list", list)
				if (list && list.length > 0) {
					const newList = list.map(item => {
						const {addressCodeText, townText, address, fullName, mobile, addressId} = item;
						const label = `${addressCodeText} ${townText} ${address} ${fullName}, ${mobile}`;
						const value = addressId + '';
						return {label, value};
					});
					$scope.addressList = newList;
					$scope.params.addressId = newList[0].value;
					syncAddressLabel()
					$scope.syncAddressLabel = syncAddressLabel;
				}
				init()
			})
		}
		getAddressList()
		function syncAddressLabel() {
			const value = $scope.params.addressId;
      console.log("TCL: syncAddressLabel -> value", value)
			$scope.params.address = $scope.addressList.find(item => item.value == value).label;
      console.log("TCL: syncAddressLabel -> $scope.addressList", $scope.addressList)
		}
		//计算推荐采购的数量 orderNeedCount 订单需求数量  inprocurementCount-> 采购中数量 kuCun -> 库存数量
		function calcRecommendCount({orderNeedCount, inprocurementCount, kuCun}) {
			let calcCount = orderNeedCount - inprocurementCount - kuCun;
			return calcCount > 0 ? calcCount : 0;
		}
		$scope.keyUpNum = function(index,key){$scope.list[index][key] = numRegReturn($scope.list[index][key])}
		function numRegReturn(str){return str.replace(/[^\d]/g,'')}
	}])
	// 待确认
	app.controller('newToBeConfirmCtrl', ['$scope', 'erp', '$routeParams', function ($scope, erp, $routeParams) {
		console.log('newToBeConfirmCtrl page ------------------ ')
		$scope.status = $routeParams.stu;
		$scope.storageId = '{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}'
		const currentApi = {
			storageList: 'app/storage/getStorage',// 仓库列表接口  {get}
			caigouGuanlian_old: 'caigou/alProduct/chaXunCaiGouGuanLian',//
			caigouGuanlian: 'procurement/dealWith/getPurchaseRelatedInformation',//
		}
		// $('.time-click').eq(2).addClass('time-act')
		console.log($scope.status)
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.startTime = '';
		$scope.endTime = '';
		var online = 0;
		$scope.sta = true;
		if ($scope.status != '2' && $scope.status != '3' && $scope.status != '4' && $scope.status != '11' && $scope.status != '12') {
			$('#searchInfo').attr('placeholder', '请输入1688订单号/创建人')
		} else if ($scope.status == '11' || $scope.status == '12') {
			$('#searchInfo').attr('placeholder', '采购人')
		}
		else {
			console.log('1111');
			$('#searchInfo').attr('placeholder', '')
		}
		$('.pur-chuli').eq(0).addClass('pur-chuli-act');
		$scope.yiChangStu = 0;
		$scope.wuLiuVal = 'y';
		$scope.btnVal = "有物流"
		$scope.wuLiuBtnFlag = true;
		$scope.payStatus = "0"
		$scope.is1688 = "0"
		$scope.nbcgPayStu = '0';
		function getListFun() {
			if ($scope.status != 10 && $scope.status != 11 && $scope.status != 12) {
				getOrdListFun()
			}
			else if ($scope.status == 11) {
				expenditureListFun()
			}
			else if ($scope.status == 12) {
				refundListFun()
			}
			else {
				glGetListFun()
			}
		}
		$scope.tabList = function (i) {
			$scope.payStatus = i
			$scope.is1688 = i
			if ($scope.status == 8 || $scope.status == 0) {
				getOrdListFun()
			} else if ($scope.status == 11) {
				expenditureListFun()
			}
			if (i == 0) {
				$scope.sta = true
			} else if (i == 1) {
				$scope.sta = false
			}
		}
		function getOrdListFun() {
			console.log('此处为复制黏贴多余代码该页面不使用  采购迁移时 新老接口 替换 为此 删除 此函数代码 作为标记')
		}
		/**
		 * quantity change 改外成quantity
		 * @param {*} pItem 
		 * @param {*} item 
		 */
		function quantityChange(pItem, item){
			const list = pItem.recordList;
			let count = 0
			list.forEach(_ => {
				count += +_.quantity
			})
			pItem.quantity = count
		}
		$scope.quantityChange = erp.deBounce(quantityChange, 500)

		// 判断预采购师傅在处理中且在路上
		$scope.isHandleAdvancePuchaseNum = function(item){
			const { useStatus, trueQuantity } = item
			let res = ''
			if(useStatus == "1" && trueQuantity){
				res = "(" + trueQuantity + "在路上)"
			}
			return res
		}

		/**
		 * 当为数字拼出一条链接
		 * @param {string} url 链接或者数字
		 */
		$scope.get1688href = function(url){
			console.log(url, /^[0-9]+$/.test(url))
			if(!url) return ''
			if(/^[0-9]+$/.test(url)) return `https://detail.1688.com/offer/${url}.html`
			return url 
		}

		$scope.seachKey = 'stanSku';
		function glGetListFun() {
			var printData = {};
			printData.pageNum = $scope.pageNum + '';
			printData.pageSize = $scope.pageSize;
			printData[$scope.seachKey] = $scope.searchVal || '';
			printData.createUserName = $scope.loginName
			if($scope.seachKey == "createUserName") printData.createUserName = $scope.searchVal || $scope.loginName
			printData.personalizedIdentity = $scope.personalizedIdentity
			printData.storageid = $scope.storageId
			console.log("glGetListFun -> printData", printData)
			const url = currentApi.caigouGuanlian;
			erp.mypost(url, printData).then(({list, total}) => {
				$scope.erpordTnum = total;
				$scope.erporderList = list;
				dealpage()
			})
		}

		$scope.purchasePersonCallback = function({id, loginName}){
			console.log('purchasePersonCallback', id)
			$scope.personalizedIdentity = 2
			$scope.loginName = undefined
			if(id == 'POD') $scope.personalizedIdentity = 1
			if(loginName && id != 'POD') {
				$scope.personalizedIdentity = 0
				$scope.loginName = loginName
			}
			glGetListFun()
		}

		//获取仓库列表
		function getStorageList() {
			$scope.storageList = [];
			erp.getFun(currentApi.storageList, function ({ data }) {
				let { result, statusCode } = data;
				if (statusCode !== '200') return;
				result = JSON.parse(result);
				result.push({ id: "f87a1c014e6c4bebbe13359467886e99", storage: "泰国仓" })//处于某某原因 前端手动添加 泰国项
				$scope.storageList = result;
			})
		}
		getStorageList()

		//split img
		function splitImgs(payVoucher) {
			let arr = payVoucher.split(","); //字符分割
			console.log("2arr", arr)
			return arr
		}

		//支出列表
		function expenditureListFun() {
			var printData = {};
			printData.pageNo = $scope.pageNum + '';
			printData.pageSize = $scope.pageSize;
			printData[$scope.seachKey] = $scope.searchVal;
			printData.caigouRen = $scope.caigouRen
			printData.begainDate = $scope.begainDate
			printData.payStatus = $scope.payStatus
			erp.postFun('erp/finance/queryErpFinancePage', JSON.stringify(printData), function (data) {
				console.log("DIN:", data)
				var obj = data.data;
				console.log("DINs:", obj)
				if (obj) {
					$scope.erpordTnum = obj.totle;
					$scope.erporderList = obj.data;
					for (let i = 0, iLen = $scope.erporderList.length; i < iLen; i++) {
						let arr = $scope.erporderList[i].payVoucher
						$scope.erporderList[i].payVouchers = splitImgs(arr)
						console.log("sss", $scope.erporderList[i].payVouchers)
					}
					dealpage()
				} else {
					layer.msg('网络错误')
				}
			}, function (data) {
				console.log(data)
			})
		}

		$scope.fuKuanAdd = function (item, index, ev) {
			$scope.fKid = item.id;//处理数据id
			$scope.fKpayAmount = item.payAmount;//预付金额
			$scope.fKpayTotoleAmount = item.payTotoleAmount; //总付款金额
			$scope.fKresidualPaymentAmount = $scope.fKpayTotoleAmount - $scope.fKpayAmount; //剩余付款金额
			$scope.orderId = item.orderId
			$scope.fuKuan = true;
			$scope.payAccount = "6230********6837"
			$scope.payObject = "周理志"
			$scope.payType = "4"
			console.log("sheng", $scope.fKresidualPaymentAmount)
			$('#timelist').val(GetDateStr(0))
		}

		$scope.certificate = function (item, index, ev) {
			$scope.cerid = item.id;//处理数据id
			$scope.orderId = item.orderId1688
			$scope.cer = true;
			$scope.payAccount = "6230********6837"
			$scope.payObject = "周理志"
			$scope.payType = "4"
			$scope.type = "1";
			console.log("type", $scope.type)
			$('#timelist').val(GetDateStr(0))
		}
		function GetDateStr(AddDayCount) {
			var dd = new Date();
			dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天
			//后的日期
			var y = dd.getFullYear();
			var m = dd.getMonth() + 1;//获取当前月份的日期
			var d = dd.getDate();
			var h = dd.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = dd.getMinutes();
			minute = minute < 10 ? ('0' + minute) : minute;
			var second = dd.getSeconds();
			second = second < 10 ? ('0' + second) : second;
			if (m < 10) {
				m = '0' + m
			}
			if (d < 10) {
				d = '0' + d
			}
			return y + "-" + m + "-" + d + ' ' + h + ':' + minute + ':' + second;
		}
		$scope.disputes = function (item, index, ev) {
			$scope.orderId = item.orderId1688;//处理数据id
			$scope.caigouRen = item.caigouRen
			$scope.dispute = true;

		}
		$scope.disputeAdd = function () {
			let payVoucher = $scope.imgArr.join(",");
			var Data = {};
			Data.orderId = $scope.orderId;
			Data.refundVoucher = payVoucher;
			Data.refundAmount = $scope.refundAmount;
			Data.refundRemark = $scope.refundRemark;
			Data.refundRen = $scope.refundRen;
			Data.caigouRen = $scope.caigouRen
			if ($scope.status == 8) {
				Data.caigouType = "2";
			} else if ($scope.status == 13) {
				Data.caigouType = "1";
			}
			erp.postFun('caigou/procurement/saveCaigouRefundRecord', Data, function (data) {
				if (data.data.statusCode == 200) {
					layer.msg(data.data.message)
					$scope.dispute = false
					getOrdListFun()
					Empty()
				} else {
					layer.msg(data.data.message)
				}
			})
		}
		$scope.selected = function () {
			console.log("支付宝")
			if ($scope.payType == "0") {
				$scope.payAccount = "15000616778"
				$scope.payObject = "涂宏名"
			} else if ($scope.payType == "1") {
				$scope.payAccount = "zlzshadow@outlook.com"
				$scope.payObject = "周理志"
			} else if ($scope.payType == "2") {
				$scope.payAccount = ""
				$scope.payObject = ""
			} else if ($scope.payType == "3") {
				$scope.payAccount = "622908********5417"
				$scope.payObject = "周理志"
			} else if ($scope.payType == "4") {
				$scope.payAccount = "6230********6837"
				$scope.payObject = "周理志"
			} else if ($scope.payType == "5") {
				$scope.payAccount = "6217********5395"
				$scope.payObject = "涂宏名"
			}
		}

		$scope.cerAdd = function () {
			let payVoucher = $scope.imgArr.join(",");
			$scope.timelist = $('#timelist').val()
			console.log("付款时间", $('#timelist').val())
			var Data = {};
			Data.id = $scope.cerid;//处理数据id
			Data.payVoucher = payVoucher;//付款凭证，
			Data.payTime = $scope.timelist;//付款时间

			if ($scope.payType == "0") {
				$scope.payType = "1"
				Data.payType = $scope.payType;//支付方式
			} else if ($scope.payType == "4" || $scope.payType == "5") {
				$scope.payType = "3"
				Data.payType = $scope.payType;//支付方式
			}
			Data.payAccount = $scope.payAccount;//支付账号
			Data.payObject = $scope.payObject;//支付对象
			Data.payAmount = $scope.cerpayAmount;//预付金额
			Data.type = $scope.type;//1-全部付款,2-部分付款
			Data.payTotoleAmount = $scope.cta;//总付款金额
			Data.residualPaymentAmount = $scope.rpa;//剩余付款金额
			Data.collectionRen = $scope.collectionRen;//收款人s
			Data.orderId = $scope.orderId;
			Data.remark = $scope.remark;//备注
			Data.caigouType = '2';//采购类型
			if ($scope.status == 0) {
				console.log("进入")
				Data.orderType = '1';
				console.log("进入2", Data.orderType)
			} else {
				Data.orderType = '2';
			}
			erp.postFun('caigou/procurement/updateCaiGouXianXia', Data, function (data) {
				if (data.data.statusCode == 200) {
					layer.msg(data.data.message)
					$scope.cer = false
					getOrdListFun()
					Empty()
				} else {
					layer.msg(data.data.message)
				}
			})
		}
		//清空
		function Empty() {
			console.log("进入")
			$scope.imgArr = [];
			$scope.payTime = '';
			$scope.payType = '';
			$scope.payAccount = '';
			$scope.payObject = '';
			$scope.cerpayAmount = '';
			$scope.cerpayTotoleAmount = '';
			$scope.residualPaymentAmount = '';
			$scope.collectionRen = '';
			$scope.remark = '';
			$scope.caigouType = '';
			$scope.fKpayAmount = '';
			$scope.fKpayTotoleAmount = '';
			$scope.fKresidualPaymentAmount = '';
			$scope.payId = '';
			$scope.refundRen = '';
			$scope.refundRemark = '';
			$scope.refundAmount = '';
		}

		// 提交到已付款
		$scope.submitAdd = function () {
			console.log("1047", $scope.fKid)
			var payVoucher = $scope.imgArr.join(",");
			$scope.timelist = $('#timelist').val()
			var printData = {};
			printData.id = $scope.fKid;
			printData.payVoucher = payVoucher;
			printData.payTime = $scope.timelist;
			printData.payType = $scope.payType;
			printData.payAccount = $scope.payAccount;
			printData.payObject = $scope.payObject;
			printData.payAmount = $scope.fKpayAmount;
			printData.type = "2";
			printData.payTotoleAmount = $scope.fKpayTotoleAmount;
			printData.residualPaymentAmount = $scope.fKresidualPaymentAmount;
			printData.collectionRen = $scope.collectionRen;
			printData.orderId = $scope.orderId;
			printData.remark = $scope.remark;
			printData.caigouType = "2";
			printData.payId = $scope.payId;
			erp.postFun('erp/finance/financialTransaction', printData, function (data) {
				if (data.data.statusCode == 200) {
					layer.msg(data.data.message)
					$scope.fuKuan = false
					expenditureListFun()
				} else {
					layer.msg(data.data.message)
				}
			})
		}

		//退款列表
		function refundListFun() {
			var printData = {};
			printData.pageNo = $scope.pageNum + '';
			printData.pageSize = $scope.pageSize;
			printData[$scope.seachKey] = $scope.searchVal;
			printData.caigouRen = $scope.caigouRen
			printData.caigouRen = $scope.begainDate
			erp.postFun('erp/finance/queryErpRefundPage', JSON.stringify(printData), function (data) {
				console.log("DIN:", data)
				var obj = data.data;
				console.log("DINs:", obj)
				if (obj) {
					$scope.erpordTnum = obj.totle;
					$scope.erporderList = obj.data;
					for (let i = 0, iLen = $scope.erporderList.length; i < iLen; i++) {
						try {
							let arr = $scope.erporderList[i].refundVoucher
							var strs = new Array(); //定义一数组
							strs = arr.split(","); //字符分割
							$scope.imgs = strs
						} catch (error) {
							console.log(error)
						}
					}
					dealpage()
				} else {
					layer.msg('网络错误')
				}
			}, function (data) {
				console.log(data)
			})
		}
		// getListFun();
		$scope.nbcgActFun = function (stu) {
			$scope.nbcgPayStu = stu;
			$scope.pageNum = 1;
			getOrdListFun()
		}
		$scope.nbcgImportFun = function () {
			$scope.nbcgImportFlag = true;
		}
		$scope.nbcgExcelFun = function () {
			var file = $("#nbcgUpLoadInp").val();
			var index = file.lastIndexOf(".");
			var ext = file.substring(index + 1, file.length);
			if (ext != "xlsx" && ext != "xls") {
				layer.msg('请上传excel')
				return;
			}
			erp.load()
			var formData = new FormData();
			formData.append('file', $("#nbcgUpLoadInp")[0].files[0]);
			formData.append('type', 1)
			erp.upLoadImgPost('caigou/procurement/importExcel', formData, function (data) {
				layer.closeAll('loading')
				$("#nbcgUpLoadInp").val('')
				$scope.nbcgImportFlag = false;
				if (data.data.statusCode == 200) {
					layer.msg('上传成功')
					$scope.pageNum = '1';
					getOrdListFun()
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
				layer.closeAll('loading')
			})
		}
		$scope.chuLiStuFun = function (stu, ev) {
			$('.pur-chuli').removeClass('pur-chuli-act');
			$(ev.target).addClass('pur-chuli-act')
			$scope.yiChangStu = stu;
			$scope.pageNum = '1';
			getListFun();
		}
		$scope.ycyyChangeFun = function () {
			$scope.pageNum = '1';
			getListFun();
		}
		$scope.zhChangeFun = function () {
			$scope.pageNum = '1';
			getListFun();
		}
		function dealpage() {
			erp.load();
			$('#c-zi-ord .c-checkall').attr("src", "static/image/order-img/multiple1.png")
			console.log($scope.erpordTnum)
			if (!$scope.erpordTnum || $scope.erpordTnum <= 0) {
				layer.msg('未找到订单')
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
		//查看大图
		$scope.showBigImgFun = function (img) {
			$scope.bigImgLink = img;
			$scope.bigImgFlag = true;
		}
		$scope.modfyOrdNumFun = function (item, index, ev) {
			ev.stopPropagation()
			$scope.modefyOrdNumFlag = true;
			$scope.orderId = item.orderId1688;
			$scope.outIndex = index;
			$scope.new1688OrdNum = item.orderId1688;
		}
		$scope.sureModOrdFun = function () {
			if (!$scope.new1688OrdNum) {
				layer.msg('请输入新的订单号')
				return
			}
			var upJson = {};
			upJson.xinDingDanHao = $scope.new1688OrdNum;
			upJson.jiuDingDanHao = $scope.orderId;
			erp.postFun('caigou/procurement/xiuGaiDingDanHao', JSON.stringify(upJson), function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.erporderList[$scope.outIndex].orderId1688 = $scope.new1688OrdNum;
					$scope.new1688OrdNum = '';
					$scope.modefyOrdNumFlag = false;
				}
			}, function (data) {
				console.log(dataa)
			})
		}
		$scope.spBtCountNum = 0;
		$scope.addSkuFun = function (item, index, ev) {
			event.stopPropagation()
			console.log(item)
			$scope.spBtCountNum = 0;
			$scope.cgspList = item.cgsps;
			for (var i = 0, len = $scope.cgspList.length; i < len; i++) {
				$scope.spBtCountNum += $scope.cgspList[i].shuLiang - 0;
				if (!$scope.cgspList[i].cjSku) {
					layer.msg('请给所有变体添加SKU')
					return;
				}
			}
			$scope.orderId = item.orderId1688;
			$scope.skuListFlag = true;
			console.log($scope.spBtCountNum)
		}
		$scope.addCountFun = function (item, index) {
			console.log(item.shuLiang)
			$scope.cgspList[index]['shuLiang'] = item.shuLiang;
			console.log($scope.cgspList[index])
		}
		$scope.sureAddSku = function () {
			erp.load()
			var addCountNum = 0;
			var jsonObj = {}
			jsonObj.skuNums = [];
			for (var i = 0, len = $scope.cgspList.length; i < len; i++) {
				var btObj = {};
				btObj.id = $scope.cgspList[i].id || '';
				btObj.cjImg = $scope.cgspList[i].cjImg;
				btObj.cjProductId = $scope.cgspList[i].cjProductId;
				btObj.cjShortSku = $scope.cgspList[i].cjShortSku;
				btObj.cjSku = $scope.cgspList[i].cjSku;
				btObj.cjStanproductId = $scope.cgspList[i].cjStanproductId;
				if ($scope.cgspList[i]['shuLiang'] > 0) {
					addCountNum += $scope.cgspList[i]['shuLiang'] - 0
				} else {
					layer.msg('请为所有变体添加数量')
					return
				}
				btObj.shuLiang = $scope.cgspList[i].shuLiang;
				btObj.cjHuoWuBiaoTi = $scope.cgspList[i].cjHuoWuBiaoTi;
				jsonObj.skuNums.push(btObj)
			}
			console.log($scope.spBtCountNum, addCountNum)
			if ($scope.spBtCountNum != addCountNum) {
				layer.msg('拆分后跟之前的总数量不一致,请检查')
				return
			}

			jsonObj.orderId = $scope.orderId;
			console.log(jsonObj)
			// jsonObj.shuLiang = $scope.addCountVal;
			// jsonObj.zhiFu = $scope.addSjzfVal;
			// jsonObj.cjsku = $scope.addSkuVal;
			// jsonObj.danJia = $scope.addDjVal;
			erp.postFun('caigou/procurement/jiaSku2', JSON.stringify(jsonObj), function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.skuListFlag = false;
					$scope.pageNum = '1';
					getListFun()
				} else {
					erp.closeLoad();
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad();
			})
		}
		//匹配sku
		$scope.piPeiSkuFun = function (item, pIndex, index, ev) {
			ev.stopPropagation()
			$scope.outIndex = pIndex;
			$scope.cgspIndex = index;
			$scope.piPeiSkuFlag = true;
			$scope.orderId = item.orderId1688;
		}
		$scope.surePiPeiSku = function () {
			// orderId 当前订单的orderid1688  测试:283635714967418614
			// sku 填写的商品sku  测试:CJBHNSNS03334
			if (!$scope.piPeiSkuVal) {
				layer.msg('请填写sku')
				return
			}
			erp.load()
			var piPeiJson = {};
			piPeiJson.orderId = $scope.orderId;
			piPeiJson.sku = $scope.piPeiSkuVal;
			erp.postFun('caigou/procurement/ziDongPiPei', JSON.stringify(piPeiJson), function (data) {
				console.log(data)
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.piPeiSkuFlag = false;
					$scope.piPeiSkuVal = '';
					$scope.erporderList[$scope.outIndex].cgsps = JSON.parse(data.data.result)
					console.log($scope.erporderList[$scope.outIndex].cgsps)
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		$scope.addOneFun = function () {
			console.log($scope.newAddSku)
			for (var i = 0, len = $scope.cgspList.length; i < len; i++) {
				if ($scope.newAddSku == $scope.cgspList[i].cjSku) {
					layer.msg("该SKU重复")
					return
				}
			}
			$scope.addOneSkuFlag = true;
		}
		$scope.closeOneAddFun = function () {
			$scope.addOneSkuFlag = false;
			$scope.newAddSku = '';
		}
		$scope.sureOneAddSkuFun = function () {
			erp.postFun('caigou/procurement/jiaoYanSku', {
				sku: $scope.newAddSku
			}, function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.addOneSkuFlag = false;
					$scope.newAddSku = '';
					$scope.addOneSkuArr = JSON.parse(data.data.result);
					$scope.cgspList.push($scope.addOneSkuArr)
					console.log($scope.addOneSkuArr)
					console.log($scope.cgspList)
				}
			}, function (data) {
				console.log(data)
			})
		}
		//录入追踪号
		$scope.addZzhList = [{ 'wlgsName': '', 'zzhVal': '' }];
		$scope.addLabelFun = function () {
			$scope.addZzhList.push({ 'wlgsName': '', 'zzhVal': '' });
			console.log($scope.addZzhList)
		}
		$scope.delLabelFun = function (index) {
			$scope.addZzhList.splice(index, 1)
			console.log($scope.addZzhList)
		}
		$scope.addZzhFun = function (item, index, ev) {
			$scope.luruZzhFlag = true;
			$scope.itemId = item.id;
		}
		// $scope.wlgsFun = function(index){
		//     $scope.addZzhList[index].wlgsName = 
		// }
		$scope.sureLrZzhFun = function () {
			console.log($scope.addZzhList)
			// var zhuiZongHao = [];
			var zhuiZongHao = {};
			for (var i = 0, len = $scope.addZzhList.length; i < len; i++) {
				var objJson = {};
				if ($scope.addZzhList[i].wlgsName && $scope.addZzhList[i].zzhVal) {
					var key1 = $scope.addZzhList[i]['wlgsName'];
					var val = $scope.addZzhList[i]['zzhVal']
					zhuiZongHao[val] = key1;
					console.log(zhuiZongHao)
				} else if ($scope.addZzhList[i].wlgsName || $scope.addZzhList[i].zzhVal) {
					layer.msg('物流公司跟追踪号必须同时存在')
					return
				}
			}
			if (JSON.stringify(zhuiZongHao) == "{}") {
				layer.msg('请输入物流公司和运单号')
				return
			}
			erp.load()
			var upJson = {};
			upJson.id = $scope.itemId;
			upJson.zhuiZongHao = zhuiZongHao;
			// console.log(upJson)
			erp.postFun('caigou/procurement/tianZhuiZongHao', JSON.stringify(upJson), function (data) {
				erp.closeLoad()
				if (data.data.statusCode == 200) {
					$scope.luruZzhFlag = false;
					$scope.addZzhList = [{ 'wlgsName': '', 'zzhVal': '' }];
					getListFun()
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		//线下采购 填写完追踪号 提交到待签收
		$scope.addDqsFun = function (item, index, ev) {
			var idsArr = [];
			idsArr.push(item.id)
			$scope.tjdqsArr = idsArr;
			console.log(item.zhuiZongHao)
			if (JSON.stringify(item.zhuiZongHao) == "{}") {
				layer.msg('请录入追踪号')
			} else {
				$scope.addDqsFlag = true;
			}
		}
		$scope.zzhBulkAddDqsFun = function () {
			var countNum = 0;
			tjDqsArr = [];
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					var zzhTextVal = $(this).siblings('.zzh-text').text()
					if (zzhTextVal != "{}") {
						tjDqsArr.push($(this).siblings('.cg-id').text())
						countNum++;
					}
				}
			})
			console.log(tjDqsArr)
			if (countNum < 1) {
				layer.msg('请选择订单')
			} else {
				$scope.addDqsFlag = true;
				$scope.tjdqsArr = tjDqsArr;
			}
		}
		$scope.sureaddDqsFun = function () {
			erp.load()
			var upJson = {};
			upJson.chuDanCaiGouIds = $scope.tjdqsArr
			erp.postFun('caigou/procurement/tianWanZhuiZongHaoTiJiao', JSON.stringify(upJson), function (data) {
				console.log(data)
				erp.closeLoad()
				if (data.data.statusCode == 200) {
					$scope.addDqsFlag = false;
					$scope.tjdqsArr = [];
					getListFun()
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		// 时间查询
		$scope.timeClickFun = function (ev, stu) {
			$('#c-data-time').val('');
			$('#cdatatime2').val('');
			$('.time-click').removeClass('time-act');
			$(ev.target).addClass('time-act');
			$scope.startTime = '';
			$scope.endTime = '';
			$scope.pageNum = '1';
			$scope.biantiSku = '';
			$scope.orderId = '';
			$scope.caigouren = '';
			$scope.fuKuanRen = '';
			$scope.gongHuoGongSi = '';
			$scope.zhuiZongHao = '';
			$scope.ri = stu;
			$scope.searchVal = '';
			getListFun()
		}
		$('.c-seach-inp').keypress(function (ev) {
			if (ev.keyCode == 13) {
				$scope.searchFun()
			}
		})
		$scope.searchFun = function () {
			$('.time-click').removeClass('time-act')
			$scope.ri = undefined;
			$scope.pageNum = '1';
			$scope.startTime = $('#c-data-time').val();
			$scope.endTime = $('#cdatatime2').val();
			var val = $('#selectSearch').val();
			if ($scope.status == '2' || $scope.status == '3' || $scope.status == '4') {
				if (val == '0') {
					$scope.biantiSku = '';
					$scope.orderId = $scope.searchVal;
					$scope.caigouren = '';
					$scope.fuKuanRen = '';
					$scope.gongHuoGongSi = '';
					$scope.zhuiZongHao = '';
				} else if (val == '1') {
					$scope.biantiSku = '';
					$scope.orderId = '';
					$scope.caigouren = $scope.searchVal;
					$scope.fuKuanRen = '';
					$scope.gongHuoGongSi = '';
					$scope.zhuiZongHao = '';
				} else if (val == '2') {
					$scope.biantiSku = '';
					$scope.orderId = '';
					$scope.caigouren = '';
					$scope.fuKuanRen = $scope.searchVal;
					$scope.gongHuoGongSi = '';
					$scope.zhuiZongHao = '';
				} else if (val == '3') {
					$scope.biantiSku = '';
					$scope.orderId = '';
					$scope.caigouren = '';
					$scope.fuKuanRen = '';
					$scope.gongHuoGongSi = $scope.searchVal;
					$scope.zhuiZongHao = '';
				} else if (val == '4') {
					$scope.biantiSku = '';
					$scope.orderId = '';
					$scope.caigouren = '';
					$scope.fuKuanRen = '';
					$scope.gongHuoGongSi = '';
					$scope.zhuiZongHao = $scope.searchVal;
				} else if (val == '5') {
					$scope.biantiSku = $scope.searchVal;
					$scope.orderId = '';
					$scope.caigouren = '';
					$scope.fuKuanRen = '';
					$scope.gongHuoGongSi = '';
					$scope.zhuiZongHao = '';
				}
			} else {
				$scope.biantiSku = '';
				$scope.orderId = '';
				$scope.caigouren = '';
				$scope.fuKuanRen = '';
				$scope.gongHuoGongSi = '';
				$scope.zhuiZongHao = '';
			}

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
		$scope.yfkFun = function () {
			var countNum = 0;
			ids = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					countNum++;
					ids += $(this).siblings('.cg-id').text() + ',';
				}
			})
			if (countNum < 1) {
				layer.msg('请选择订单')
			} else {
				$scope.tjddfkFlag = true;
			}
		}
		$scope.sureYfkFun = function () {
			$scope.tjddfkFlag = false;
			erp.load()
			erp.postFun('caigou/procurement/gaiChengDaiFuKuan', {
				ids: ids
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.pageNum = '1';
					getListFun()
				} else {
					layer.msg('提交失败')
					layer.closeAll('loading')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		var ids = '';
		$scope.piLiangTJFun = function () {
			var countNum = 0;
			ids = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					countNum++;
					ids += $(this).siblings('.cg-id').text() + ',';
				}
			})
			if (countNum < 1) {
				layer.msg('请选择订单')
			} else {
				$scope.pltjFlag = true;
			}
		}
		$scope.surePltjFun = function () {
			$scope.pltjFlag = false;
			erp.load()
			erp.postFun('caigou/procurement/gaiChengYiFuKuan', {
				ids: ids
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.pageNum = '1';
					getListFun()
				} else {
					layer.msg('提交失败')
					layer.closeAll('loading')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		$scope.piLiangDelFun = function () {
			var countNum = 0;
			ids = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					countNum++;
					ids += $(this).siblings('.id1688').text() + ',';
				}
			})
			if (countNum < 1) {
				layer.msg('请选择订单')
			} else {
				$scope.plDelFlag = true;
			}
		}
		$scope.surePlDelFun = function () {
			$scope.plDelFlag = false;
			erp.load()
			erp.postFun('caigou/procurement/shanChuDingDan', {
				orderIds: ids,
				status: $scope.status
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.pageNum = '1';
					getListFun()
				} else {
					layer.msg('删除失败')
					layer.closeAll('loading')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		var tjDqsArr = [];
		$scope.tjdDqsFun = function () {
			var countNum = 0;
			tjDqsArr = [];
			var skuFlag = false;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					var $skuDom = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.hide-sku')
					console.log($skuDom)
					console.log($skuDom.length)
					for (var i = 0; i < $skuDom.length; i++) {
						console.log($skuDom.eq(i).text())
						if (!$skuDom.eq(i).text()) {
							skuFlag = true;
							break;
						}
					}
					if (skuFlag) {
						layer.msg('请输入SKU')
						return false;
					}
					countNum++;
					tjDqsArr.push($(this).siblings('.id1688').text())
				}
			})
			if (skuFlag) {
				layer.msg('请输入SKU并确认提交', { time: 2000 })
				return
			}
			console.log(tjDqsArr)
			if (countNum < 1) {
				layer.msg('请选择订单')
			} else {
				$scope.tjdDqsFlag = true;
			}
		}
		$scope.sureTjDqsFun = function () {
			erp.load()
			var tjData = {};
			tjData.chuDanCaiGouIds = tjDqsArr;
			erp.postFun('caigou/procurement/tianWanSkuTiJiao', JSON.stringify(tjData), function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					layer.msg('提交成功')
					$scope.tjdDqsFlag = false;
					$scope.pageNum = '1';
					getListFun()
				} else {
					layer.msg('提交失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		$scope.imgArr = [];       // 读取本地地址----速度快
		let loadList = {
			img: ['png', 'jpg', 'jpeg', 'gif', "PNG", "JPG", "JPEG", "GIF"]
		};
		// 上传图片
		$scope.upLoadImg5 = function (files) {
			let file = files[0];
			console.log(files)
			let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
			console.log(fileName)
			if (!loadList.img.includes(fileName)) {
				layer.msg('图片格式错误');
				return;
			}
			// let validFileArr = [];
			// if(files){
			//     let fileType,fileName;
			//     for(let i = 0,len = files.length;i<len;i++){
			//         fileName = files[i].name;
			//         fileType = fileName.substring(fileName.lastIndexOf('.')+1,fileName.length)
			//         console.log(fileName,fileType)
			//         if(loadList.img.includes(fileType)){
			//             validFileArr.push(files[i])
			//         }
			//     }
			//     console.log(validFileArr)
			// }
			// if(validFileArr.length<1&&files.length>0){
			//     layer.msg('图片格式不正确')
			//     return
			// }
			erp.ossUploadFile(files, function (data) {
				console.log(data)
				if (data.code == 0) {
					layer.msg('图片上传失败');
					return;
				}
				let result = data.succssLinks;
				$scope.imgArr = [];
				// for(let i = 0,len = result.length;i<len;i++){
				//     $scope.imgArr.push(result[i])
				// }
				$scope.imgArr.push(result[0]);
				$('.upload_file').val('')
				$scope.$apply();
				console.log($scope.imgArr)
			})
		};
		// 删除上传的图片
		$scope.delImg = (index, event) => {
			event.stopPropagation();
			$scope.imgArr.splice(index, 1);
		};
		$scope.upLoadImg4 = function (files) {
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
			console.log(formData);
			erp.upLoadImgPost('caigou/procurement/shangChuanExcel2', formData, function (data) {
				console.log(data)
				layer.closeAll('loading')
				$("#upLoadInp").val('')
				if (data.data.statusCode == 200) {
					layer.msg('上传成功')
					// $scope.pageNum = '1';
					// getListFun()
				} else if (data.data.statusCode == 201 || data.data.statusCode == 202) {
					$scope.excelLink = data.data.result;
					console.log($scope.excelLink)
					$scope.excelFlag = true;
					layer.msg(data.data.message)
				} else (
					layer.msg(data.data.message)
				)
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		$('#upLoadInp').hover(function () {
			$('#up-btn').css({
				backgroundColor: '#5dbdf2',
				color: '#fff'
			})
		}, function () {
			$('#up-btn').css({
				backgroundColor: '#fff',
				color: '#5dbdf2'
			})
		});
		$('.orders-table').on('click', '.erporder-detail', function (event) {
			if ($(event.target).hasClass('cor-check-box') || $(event.target).hasClass('qtcz-sel') || $(event.target).hasClass('stop-prop') || $(event.target).hasClass('ordlist-fir-td')) {
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

		$scope.wuLiuStuFun = function () {
			$scope.wuLiuBtnFlag = !$scope.wuLiuBtnFlag;
			if ($scope.wuLiuBtnFlag) {
				$scope.wuLiuVal = 'y';
				$scope.btnVal = '有物流';
			} else {
				$scope.wuLiuVal = 'n';
				$scope.btnVal = '无物流';
			}
			getListFun()
		}
		$scope.downLoadFun = function () {
			location.href = "https://cc-west-usa.oss-us-west-1.aliyuncs.com/caigou/aaa.xls"
		}
		var itemSku = '';
		var putSkuArr = [];
		var gpIndex, itemIndex;
		$scope.putSkuFun = function (item, ev, pIndex, index) {
			console.log(pIndex, index)
			console.log($(ev.target).siblings('.sku-val').val())
			putSkuArr = [];
			putSkuArr.push(item.id)
			gpIndex = pIndex;
			console.log(gpIndex)
			itemIndex = index;
			itemSku = $.trim($(ev.target).siblings('.sku-val').val());
			console.log(itemSku)
			// $scope.putSkuFlag = true;
			if (!itemSku) {
				layer.msg('请输入sku')
				return
			} else {
				if (!itemSku) {
					layer.msg('请输入sku')
					return
				} else {
					erp.load()
					var csData = {};
					csData.chuDanCaiGouIds = putSkuArr;
					csData.dingDanHao = itemSku;
					erp.postFun('caigou/procurement/gaiSku', JSON.stringify(csData), function (data) {
						console.log(data)
						erp.closeLoad()
						layer.msg(data.data.message)
						if (data.data.statusCode == 200) {
							// getListFun()
							item.isupSucFlag = true;
							$scope.putSkuFlag = false;
							$scope.erporderList[gpIndex].cgsps[itemIndex].cjSku = itemSku;
							console.log($scope.erporderList[gpIndex].cgsps[itemIndex])
						}
					}, function (data) {
						console.log(data)
						erp.closeLoad()
					})
				}
			}
		}
		var delItemId = '';
		$scope.delSkuFun = function (item, ev, pIndex, index) {
			delItemId = item.id;
			gpIndex = pIndex;
			itemIndex = index;
			$scope.delSkuFlag = true;
		}
		$scope.sureDelSkuFun = function () {
			erp.postFun('caigou/procurement/shanSku', {
				cjsku: delItemId
			}, function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					console.log($scope.erporderList[gpIndex].cgsps)
					$scope.delSkuFlag = false;
					$scope.erporderList[gpIndex].cgsps.splice(itemIndex, 1);
					console.log($scope.erporderList[gpIndex].cgsps)
				}
			}, function (data) {
				console.log(data)
			})
		}
		//异常
		if ($scope.status == 2) {
			$scope.ycYyVal = '1';
		} else if ($scope.status == 3) {
			$scope.ycYyVal = '3';
		}
		var itemYcId;
		$scope.yiChangFun = function (item, ev, pIndex, index) {
			itemYcId = '';
			$scope.ycCount = 0;
			console.log(item)
			$scope.ycYyFlag = true;
			$scope.ycCount = item.shuLiang - 0;
			itemYcId = item.id;
		}
		$scope.sureYcFun = function () {//异常提交
			return // 此处接口已经修改 功能未使用(复制老代码) 不再维护 
		}
		//更多操作人
		$scope.showMoreCzrFun = function (czrList) {
			$scope.moreCzrFlag = true;
			$scope.carList = czrList;
		}
		$scope.go1688Fun = function () {
			window.open('https://trade.1688.com/order/buyer_order_list.htm?spm=a360q.8274423.1130995625.1.49c84c9aRvNusT&scene_type=&source=')
		}
		//处理异常
		$scope.chuLiFs = '0';
		$scope.wlGsList = [
			{ name: '顺丰速运', code: 'SF' },
			{ name: '圆通速递', code: 'YTO' },
			{ name: '中通快递', code: 'ZTO' },
			{ name: '申通快递', code: 'STO' },
			{ name: '韵达速递', code: 'YD' },
			{ name: '天天快递', code: 'HHTT' },
			{ name: '百世快递', code: 'HTKY' },
			{ name: '速尔快递', code: 'SURE' },
			{ name: '邮政快递包裹', code: 'YZPY' },
			{ name: 'EMS', code: 'EMS' },
			{ name: '京东快递', code: 'JD' },
			{ name: '优速快递', code: 'UC' },
			{ name: '德邦快递', code: 'DBL' }
		]
		$scope.selNFun = function () {
			console.log($scope.wlGsInfo)
		}
		$scope.chuLiYcFun = function (item, pIndex, index, ev) {
			ev.stopPropagation()
			$scope.itemId = item.id;
			$scope.chuliYcFlag = true;
			$scope.pIndex = pIndex;
			$scope.index = index;
			console.log("1欧尼:", $scope.itemId)
			console.log(pIndex, index)
			$scope.chuLiFs = '0';
		}
		$scope.jiLuFun = function (item, index, ev, pItem) {
			$scope.jiLuList = [];
			$scope.itemId = item.id;
			console.log("2欧尼:", $scope.itemId)
			erp.postFun('caigou/procurement/selectRecord', {
				id: $scope.itemId
			}, function (data) {
				if (data.data.statusCode == 200) {
					$scope.jiLu = true;
					let result = data.data.result;
					$scope.jiLuList = result;
					console.log($scope.jiLuList)
				} else {
					layer.msg(data.data.message)
				}
			})
		}

		$scope.chuLiChaFun = function () {
			if ($scope.chuLiFs == 1 || $scope.chuLiFs == 2) {
				$scope.imgArr = [];//上传的图片置为空
			}
		}
		$scope.feiyongchengdanfang = '卖家';
		$scope.yufeishengqingfangshi = '线上申请';
		$scope.youjizhongliang = '首重';
		$scope.sureChuLiFun = function () {
			console.log($scope.chuLiFs, $scope.wlGsInfo)
			if ($scope.chuLiFs == 0) {
				$scope.chuLiReson = $scope.chuLiReson0;
			} else if ($scope.chuLiFs == 1) {
				$scope.chuLiReson = $scope.chuLiReson1;
			} else if ($scope.chuLiFs == 2) {
				$scope.chuLiReson = $scope.chuLiReson2;
			} else if ($scope.chuLiFs == 3) {
				$scope.chuLiReson = $scope.chuLiReson3;
			}
			if ($scope.chuLiFs == 0 || $scope.chuLiFs == 2) {
				if (!$scope.wlGsInfo) {
					layer.msg('补发退货必须选择物流公司')
					return
				}
			}
			console.log($scope.chuLiReson)
			if (!$scope.chuLiReson) {
				layer.msg('输入框不能为空')
				return
			}
			var upJson = {};
			upJson.id = $scope.itemId;
			upJson.chuLiFangShi = $scope.chuLiFs;
			upJson.zhuiZongHao = $scope.chuLiReson;
			if ($scope.chuLiFs == 1) {
				upJson.tuikuanpingzheng = $scope.imgArr[0];
			} else if ($scope.chuLiFs == 2) {
				upJson.zhuangzhangpingzheng = $scope.imgArr[0];
				upJson.tuihuodizhi = $scope.tuihuodizhi;
				upJson.feiyongchengdanfang = $scope.feiyongchengdanfang;
				upJson.yunfeijine = $scope.yunfeijine;
				upJson.yufeishengqingfangshi = $scope.yufeishengqingfangshi;
				upJson.youjizhongliang = $scope.youjizhongliang;
			}

			if ($scope.chuLiFs == 0 || $scope.chuLiFs == 2) {
				upJson.wuliugongsi = $scope.wlGsInfo.split('#')[0];
				upJson.wuliugongsiBianma = $scope.wlGsInfo.split('#')[1]
			}
			erp.postFun('caigou/procurement/yiChangChuLi', JSON.stringify(upJson), function (data) {
				console.log("name", data)
				if (data.data.statusCode == 200) {
					$scope.chuliYcFlag = false;
					var chuLifangShi;
					if ($scope.chuLiFs == 0) {
						chuLifangShi = '补发'
					} else if ($scope.chuLiFs == 1) {
						chuLifangShi = '退款'
					} else if ($scope.chuLiFs == 2) {
						chuLifangShi = '退件'
					} else if ($scope.chuLiFs == 3) {
						chuLifangShi = $scope.chuLiReson;
					}
					// $scope.erporderList[$scope.pIndex].cgsps[$scope.index].chuLiFangShi = chuLifangShi;
					// $scope.erporderList[$scope.pIndex].cgsps[$scope.index].yiChangZhuangtai = $scope.erporderList[$scope.pIndex].cgsps[$scope.index].yiChangZhuangtai-0+1;
					$scope.chuLiReson0 = undefined;
					$scope.chuLiReson1 = undefined;
					$scope.chuLiReson2 = undefined;
					$scope.chuLiReson3 = undefined;
					getListFun()
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.chuLiYcWcFun = function (item, pIndex, index, ev) {
			erp.load()
			erp.postFun('caigou/procurement/yiChangWanCheng', {
				id: item.id
			}, function (data) {
				console.log(data)
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					// getListFun()
					$scope.erporderList[$scope.pIndex].cgsps[$scope.index].yiChangZhuangtai = 2;
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		//物流信息
		$scope.hqwlMesFun = function (item, pIndex, index, ev) {
			$scope.wlMsgList = [];
			let csJson = {};
			if (item.chuLiFangShi == '补发') {
				csJson.orderNum = item.orderId;
				csJson.expCode = item.bufakuaidigongsibm;
				csJson.expNo = item.buFaZhuiZongHao;
				csJson.zhuizhongType = item.chuLiFangShiType;
				csJson.wuliugongsi = item.bufakuaidigongsi;
			} else {
				csJson.orderNum = item.orderId;
				csJson.expCode = item.tuijiankuaidigongsibm;
				csJson.expNo = item.tuiJianZhuiZongHao;
				csJson.zhuizhongType = item.chuLiFangShiType;
				csJson.wuliugongsi = item.tuijiankuaidigongsi;
			}

			console.log(csJson)
			console.log(item)
			erp.postFun('caigou/dispute/getWuLiu', csJson, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.wlMesFlag = true;
					let result = data.data.result;
					$scope.wlMsgList = result.Traces;
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
			})
		}
		//待签收获取物流信息
		$scope.dqsHqwlXxFun = function (item, index, ev) {
			$scope.wlMsgList = [];
			erp.postFun('caigou/dispute/getWuLiu', {
				"orderNum": item.orderId1688,
				"zhuizhongType": "3"
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					let result = data.data.result;
					if (result.success) {
						if (result.errorMessage) {
							layer.msg(result.errorMessage)
						} else {
							$scope.qsWlMesFlag = true;
							$scope.wlMsgList = result.logisticsTrace[0].logisticsSteps;
						}
					} else {
						layer.msg(result.errorMessage)
					}
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
			})
		}
		//提交订单
		$scope.submitOrdFun = function (zddlist, index, ev) {
			$scope.itemCgOrdId = zddlist.ID;
			$scope.ordSpBtList = zddlist.caiGouGuanLianList;
			erp.postFun('procurement/order/getCaiGouAdressAndInvoiceBill', { "cargoParamList": $scope.ordSpBtList }, function (data) {
				console.log(data)
				if(data.data.code != 200) return layer.msg(data.data.message)
				const obj = data.data.data
				if(!obj) return layer.msg(data.data.message)
				$scope.addressList = obj.adresses;
				$scope.invoiceBills = obj.invoiceBills;
				$scope.ordMesBtList = obj.cargoParamList;
				if ($scope.ordMesBtList && $scope.ordMesBtList.length > 0) {
					for (let i = 0, len = $scope.ordMesBtList.length; i < len; i++) {//先赋给一个不传参的变量 点击保存成功后再赋值
						const item = $scope.ordMesBtList[i]
						for(let j = 0, len = item.recordList.length; j < len; j++){
							const subItem = item.recordList[j]
							subItem['ruKuNum'] = subItem.quantity
						}
					}
				}
				qplNum()
				
				// 获取默认地址
				const default1688PurchaseAddress = localStorage.getItem('default1688PurchaseAddress')
				if(default1688PurchaseAddress){
					$scope.defaultAddObj = JSON.parse(default1688PurchaseAddress)
				}else{
					for (let i = 0, len = $scope.addressList.length; i < len; i++) {
						if ($scope.addressList[i].isDefault) {
							$scope.defaultAddObj = $scope.addressList[i];
							break;
						}
					}
				}
				// 获取默认地址

				$scope.invoiceObj = $scope.invoiceBills[0];
				$scope.ordDelFlag = true;
				$scope.isFxFlag = obj.isFenXiao;
				$scope.ordType = $scope.isFxFlag ? 'saleproxy' : 'general';
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}

		// 焦点于默认地址
		$scope.focusAddress = function(item){
			const default1688PurchaseAddress = localStorage.getItem('default1688PurchaseAddress')
			if(default1688PurchaseAddress){
				const defaultAddObj = JSON.parse(default1688PurchaseAddress)
				const defaultId = defaultAddObj.addressId
				const itemId = item.addressId
				return defaultId == itemId
			}
			return item.isDefault
		}

		$scope.checkAddressFun = function (item) {
			for (let i = 0, len = $scope.addressList.length; i < len; i++) {
				$scope.addressList[i].isDefault = false;
			}
			item.isDefault = true;
			console.log(item)
			$scope.defaultAddObj = item;
			localStorage.setItem('default1688PurchaseAddress', JSON.stringify(item))
			$scope.addressFlag = false // 选择完地址直接收起
		}
		$scope.checkYouHuiFun = function (item) {
			for (let i = 0, len = $scope.resJson.cargoList[0].cargoPromotionList.length; i < len; i++) {
				$scope.resJson.cargoList[0].cargoPromotionList.selected = false;
			}
			item.selected = true;
		}
		$scope.isNumFun = function (item, key, val) {
			console.log(key, val)
			val = val.replace(/[^\d]/g, '');
			if (val < 0) {
				val = 0;
			}
			// if(val<parseInt(item.minOrderQuantity)){
			// 	val = parseInt(item.minOrderQuantity)
			// }
			item[key] = val;
		}
		$scope.delItemSpFun = function (item, index) {
			$scope.ordMesBtList.splice(index, 1)
		}
		$scope.baoCunNumFun = function (parentItem, item) {
			const quantity = +item.ruKuNum >= 0 ? +item.ruKuNum : 0
			item.ruKuNum = parseInt(quantity)
			erp.postFun('caigou/alProduct/updateCaiGouGuanLian', {
				"id": item.id,
				quantity
			}, function (data) {
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					// 保存成功后将外层记录数量计算一遍
					// let quantityCount = 0
					// parentItem.recordList.forEach(_=>{ quantityCount += +_.ruKuNum })
					// parentItem.quantity = quantityCount

				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		$scope.ordType = 'general';
		function qplNum() {
			let obj = {}
			for (let i = 0, len = $scope.ordMesBtList.length; i < len; i++) {
				if (obj[$scope.ordMesBtList[i].offerId]) {
					obj[$scope.ordMesBtList[i].offerId] = $scope.ordMesBtList[i].quantity + obj[$scope.ordMesBtList[i].offerId]
				} else {
					obj[$scope.ordMesBtList[i].offerId] = $scope.ordMesBtList[i].quantity
				}
			}
			console.log(obj)
			for (key in obj) {
				console.log(key)
				for (let i = 0, len = $scope.ordMesBtList.length; i < len; i++) {
					if ($scope.ordMesBtList[i].offerId == key) {
						$scope.ordMesBtList[i].btCgCountNum = obj[key]
					}
				}
			}
			console.log($scope.ordMesBtList)
		}

		// 订单预览确认
		$scope.ordYuLanPre = function(){
			if (!$scope.ordSpBtList) return layer.msg('该商品没有变体')
			if($scope.ordSpBtList.length > 50){
				layer.confirm('此订单将被拆分成多个订单,付款成功后,请联系卖家修改运费!', {
					title:'提示',
					btn: ['确认','取消'] //按钮
				}, function(index){
					// layer.msg('的确很重要', {icon: 1});
					$scope.ordYuLan()
					layer.close(index)
				}, function(index){
					layer.close(index)
				})
				return
			}
			
			$scope.ordYuLan()
		}

		//订单预览
		$scope.ordYuLan = function () {
			// for(let i = 0,len = $scope.ordMesBtList.length;i<len;i++){
			//     if($scope.ordMesBtList[i].minOrderQuantity!=0 && $scope.ordMesBtList[i].quantity > $scope.ordMesBtList[i].amountOnSale){
			//         layer.msg('购买数量大于库存,无法下单')
			//         return
			//     }
			//     if($scope.ordMesBtList[i].minOrderQuantity!=0 && $scope.ordMesBtList[i].quantity < $scope.ordMesBtList[i].minOrderQuantity){
			//         layer.msg('购买数量小于起批量,无法下单')
			//         return
			//     }
			// }

			// var sum = 0
			// for(var i=0;i<$scope.ordMesBtList.length;i++){
			// 	var item = $scope.ordMesBtList[i]
			// 	sum+=parseInt(item.spNum)
			// }
			// if(sum<$scope.ordMesBtList[0].minOrderQuantity) return layer.msg('购买数量小于起批量,无法下单')
			// if (!$scope.defaultAddObj) {
			//     for (let i = 0, len = $scope.addressList.length; i < len; i++) {
			//         if ($scope.addressList[i].isDefault) {
			//             $scope.defaultAddObj = $scope.addressList[i];
			//             break;
			//         }
			//     }
			// }
			$scope.defaultAddObj['addressId'] = $scope.defaultAddObj.addressId;
			$scope.defaultAddObj['phone'] = $scope.defaultAddObj.mobile;
			erp.postFun('caigou/alProduct/createOrderPreview', {
				"addressParam": $scope.defaultAddObj,
				"cargoParamList": $scope.ordMesBtList,
				"invoiceParam": $scope.invoiceObj,
				"flow": $scope.ordType
			}, function (data) {
				console.log(data)
				let resResult = data.data.result;
				if (data.data.statusCode == 200) {//请求接口成功
					if (resResult.success) {//请求1688成功
						$scope.resJson = resResult.orderPreviewResuslt[0];
						let cargoList = $scope.resJson.cargoList;
						$scope.ordSpBtList = piPeiFun($scope.ordMesBtList, cargoList);
						$scope.xiaDanFlag = true;
					} else {
						try {
							layer.msg(resResult.errorMsg, { time: 6000 })
						} catch (error) {
							layer.msg(resResult.errorMsg.errorMessage, { time: 6000 })
						}

					}
				} else {
					layer.msg(data.data.message)
				}

			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		//创建订单
		$scope.chuangJianOrdFun = function () {
			console.log($scope.mesTo1688)
			// $scope.defaultAddObj['addressId'] = $scope.defaultAddObj.id;
			$scope.defaultAddObj['phone'] = $scope.defaultAddObj.phone;
			$scope.defaultAddObj['mobile'] = $scope.defaultAddObj.mobile;
			$scope.defaultAddObj['postCode'] = $scope.defaultAddObj.addressCode;
			$scope.defaultAddObj['districtCode'] = $scope.defaultAddObj.addressCode;
			$scope.defaultAddObj['provinceText'] = $scope.defaultAddObj.addressCodeText.split(' ')[0];
			$scope.defaultAddObj['cityText'] = $scope.defaultAddObj.addressCodeText.split(' ')[1];
			$scope.defaultAddObj['areaText'] = $scope.defaultAddObj.addressCodeText.split(' ')[2];

			layer.load(2)
			// 'caigou/alProduct/createCrossOrder' {addressParam: '', cargoParamList: '', flow: '', message: ''}  ---> 'procurement/order/createCrossOrder'  
			erp.postFun('procurement/order/createCrossOrder', {
				"addressParam": $scope.defaultAddObj,
				"cargoParamList": $scope.ordMesBtList,
				"flow": $scope.ordType,
				"message": $scope.mesTo1688
			}, function ({data}) {
     	  console.log("TCL: $scope.chuangJianOrdFun -> data", data)
				layer.closeAll('loading')
				
				if (data.code == 200 && data.data) {
					$scope.payUrlLink = data.data;
					$scope.xiaDanFlag = false;
					$scope.ordDelFlag = false;
					$scope.payUrlFlag = true;
					$scope.mesTo1688 = '';
					getListFun()
				} else {
					layer.msg(data.message || '生成1688订单失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.fuKuanStuFun = function (stu) {
			$scope.fuKuanStuVal = stu;
			$scope.payResultFlag = true;
		}
		$scope.fuKuanResFun = function (stu) {
			if (stu == 1) {//付款成功按钮
				erp.postFun('caigou/alProduct/updateCaiGouDingDan', {
					"id": $scope.itemCgOrdId,
					"payStatus": "1",
					"status": "1"
				}, function (data) {
					console.log(data)
					layer.msg(data.data.message)
					if (data.data.statusCode == 200) {
						$scope.payResultFlag = false;
						$scope.payUrlFlag = false;
						getListFun()
					}
				}, function (data) {
					console.log(data)
				})
			} else {//付款失败
				erp.postFun('caigou/alProduct/updateCaiGouDingDan', {
					"id": $scope.itemCgOrdId,
					"payStatus": "2",
					"status": "0"
				}, function (data) {
					layer.msg(data.data.message)
					if (data.data.statusCode == 200) {
						$scope.payResultFlag = false;
						$scope.payUrlFlag = false;
					}
				}, function (data) {
					console.log(data)
				})
			}
		}
		$scope.fuKuanFun = function (item, index, ev) {
			$scope.itemCgOrdId = item.id;
			erp.postFun('caigou/alProduct/getAlibabaAlipayUrl', {
				"orderid": item.orderId1688,
				"id": item.id
			}, function (data) {
				if (data.data.statusCode == 200) {
					let resResult = data.data.result;
					// window.open(resResult.payUrl)
					$scope.payUrlFlag = true;
					$scope.payUrlLink = resResult.payUrl;
				} else {
					layer.msg(data.data.message)
				}
			}, { layer: true })
		}
		$scope.tongBuDiZhiFun = function () {
			erp.postFun('caigou/alProduct/shuaXinShouHuoDiZhi', {}, function (data) {
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.tongBuDiZhiFlag = false;
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		function piPeiFun(arr1, arr2) {
			if (arr1 && arr1.length > 0 && arr2 && arr2.length > 0) {
				for (let i = 0, len = arr1.length; i < len; i++) {
					for (let j = 0, jlen = arr2.length; j < jlen; j++) {
						console.log(arr2[j].specId, arr2[j].specId == null)
						if ((arr1[i].offerId == arr2[j].offerId && arr1[i].specId == arr2[j].specId) || (arr1[i].offerId == arr2[j].offerId && arr2[j].specId == undefined)) {
							console.log(i)
							arr1[i]['bt1688Price'] = arr2[j].finalUnitPrice;
							arr1[i]['bt1688Amount'] = arr2[j].amount;
							console.log(arr2[j])
							console.log(arr1[i])
							break;
						} else {
							console.log(arr1[i].offerId, arr2[j].skuId, arr1[i].offerId == arr2[j].skuId)
						}
					}
				}
				return arr1;
			} else {
				return false
			}
		}
		//财务页面的退款
		$scope.tuiKuanFun = function (item, pIndex, index, ev) {
			ev.stopPropagation()
			console.log(item)
			$scope.tuiKuanCount = item.tuiKuanJinE;
			$scope.itemId = item.id;
			$scope.cwTuiKuanFlag = true;
		}
		$scope.sureTuiKuanFun = function () {
			erp.postFun('caigou/procurement/yiChangWanCheng', { "id": $scope.itemId }, function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.cwTuiKuanFlag = false;
					getListFun()
				}
			}, function (data) {
				console.log(data)
			})
		}
		//给子订单里面的订单添加选中非选中状态
		var cziIndex = 0;
		$('#c-zi-ord').on('click', '.cor-check-box', function () {
			if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
				$(this).attr('src', 'static/image/order-img/multiple2.png');
				cziIndex++;
				if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
					$('#purch-box .c-checkall').attr('src', 'static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src', 'static/image/order-img/multiple1.png');
				cziIndex--;
				if (cziIndex != $('#c-zi-ord .cor-check-box').length) {
					$('#purch-box .c-checkall').attr('src', 'static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#purch-box').on('click', '.c-checkall', function () {
			if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
				$(this).attr('src', 'static/image/order-img/multiple2.png');
				cziIndex = $('#c-zi-ord .cor-check-box').length;
				$('#c-zi-ord .cor-check-box').attr('src', 'static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src', 'static/image/order-img/multiple1.png');
				cziIndex = 0;
				$('#c-zi-ord .cor-check-box').attr('src', 'static/image/order-img/multiple1.png');
			}
		})
		$scope.checkAllFun = function (checkFlag) {
			console.log($scope.checkAllMark)
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				$scope.erporderList[i].checked = checkFlag;
			}
		}
		$scope.checkFun = function (item, checked, e) {
			e.stopPropagation();
			if (item.checked) {
				let checkCount = 0;
				for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
					if ($scope.erporderList[i].checked) {
						checkCount++
					}
				}
				if (checkCount == $scope.erporderList.length) {
					$scope.checkAllMark = true;
				} else {
					$scope.checkAllMark = false;
				}
			} else {
				$scope.checkAllMark = false;
			}
		}
		$scope.bulkTjFun = function () {
			let checkCount = 0;
			let orginArr = [];
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].checked) {
					checkCount++
					orginArr.push($scope.erporderList[i].caiGouGuanLianList)
					console.log($scope.erporderList[i].caiGouGuanLianList)
				}
			}
			if (checkCount > 0) {
				console.log(orginArr)
				$scope.ordSpBtList = orginArr.flat();
				console.log($scope.ordMesBtList)
				// $scope.ordDelFlag = true;
				erp.postFun('caigou/alProduct/getCaiGouAdressAndInvoiceBill', { "cargoParamList": JSON.stringify($scope.ordSpBtList) }, function (data) {
					console.log(data)
					if (data.data.statusCode == 200) {
						if (data.data.result) {
							$scope.addressList = data.data.result.adresses;
							$scope.invoiceBills = data.data.result.invoiceBills;
							$scope.ordMesBtList = data.data.result.cargoParamList;
							if ($scope.ordMesBtList && $scope.ordMesBtList.length > 0) {
								for (let i = 0, len = $scope.ordMesBtList.length; i < len; i++) {//先赋给一个不传参的变量 点击保存成功后再赋值
									$scope.ordMesBtList[i]['spNum'] = $scope.ordMesBtList[i].quantity;
								}
							}
							$scope.invoiceObj = $scope.invoiceBills[0];
							$scope.ordDelFlag = true;
						} else {
							layer.msg(data.data.message)
						}
					} else {
						layer.msg(data.data.message)
					}
				}, function (data) {
					console.log(data)
				}, { layer: true })
			} else {
				layer.msg('请选择商品')
			}
		}

		let delArr = [];
		$scope.bulkDelFun = function () {
			delArr = [];
			let checkCount = 0;
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].checked) {
					checkCount++
					if ($scope.erporderList[i].caiGouGuanLianList) {
						for (let k = 0, kLen = $scope.erporderList[i].caiGouGuanLianList.length; k < kLen; k++) {
							let obj = {
								"ID": $scope.erporderList[i].caiGouGuanLianList[k].ID || $scope.erporderList[i].caiGouGuanLianList[k].id
							};
							console.log(obj)
							delArr.push(obj)
						}
					}
				}
			}
			if (checkCount > 0) {
				$scope.isDelFlag = true;
			} else {
				layer.msg('请选择商品')
			}
		}
		$scope.spDelFun = function (item, e) {
			e.stopPropagation()
			delArr = [];
			$scope.isDelFlag = true;
			for (let k = 0, kLen = item.caiGouGuanLianList.length; k < kLen; k++) {
				let obj = {
					"ID": item.caiGouGuanLianList[k].ID || item.caiGouGuanLianList[k].id
				};
				delArr.push(obj)
			}
		}
		$scope.sureDelFun = function () {
			console.log({ 'caiGouGuanLianList': delArr })
			erp.postFun('caigou/alProduct/deleteCaiGouGuanLian', { 'caiGouGuanLianList': delArr }, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.isDelFlag = false;
					layer.msg('删除成功')
					getListFun()
				} else {
					layer.msg('删除失败')
				}
			}, function (data) {
				console.log(data)
			})
		}

		$scope.isRejectFlag = false // 驳回弹窗状态
		let rejectIds = []
		$scope.bulkRejectFun = function(){
			rejectIds = [];
			let checkCount = 0;
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].checked) {
					checkCount++
					if ($scope.erporderList[i].caiGouGuanLianList) {
						for (let k = 0, kLen = $scope.erporderList[i].caiGouGuanLianList.length; k < kLen; k++) {
							let obj = {
								"ID": $scope.erporderList[i].caiGouGuanLianList[k].ID || $scope.erporderList[i].caiGouGuanLianList[k].id
							};
							console.log(obj)
							rejectIds.push(obj)
						}
					}
				}
			}
			if (checkCount > 0) {
				$scope.isRejectFlag = true;
			} else {
				layer.msg('请选择商品')
			}
		}
		$scope.spRejectFun = function (item, e) {// 驳回单个
			e.stopPropagation()
			rejectIds = [];
			$scope.isRejectFlag = true;
			for (let k = 0, kLen = item.caiGouGuanLianList.length; k < kLen; k++) {
				let obj = {
					"ID": item.caiGouGuanLianList[k].id || item.caiGouGuanLianList[k].ID
				};
				rejectIds.push(obj)
			}
		}
		$scope.sureRejectFun = function () {// 驳回接口
			console.log({ 'caiGouGuanLianList': rejectIds })
			erp.postFun('caigou/procurementTwo/rejectAPI', { 'caiGouGuanLianList': rejectIds }, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.isRejectFlag = false;
					layer.msg('驳回成功')
					getListFun()
				} else {
					layer.msg('服务器打盹了，请重新尝试')
				}
			}, function (data) {
				console.log(data)
			})
		}


		// $('.orders-table').on('mouseenter','.ordlist-fir-td',function () {
		//     $(this).parent('.erporder-detail').next().hide();
		// })
		$('.orders-table').on('mouseenter', '.erporder-detail>td', function () {
			if ($(this).hasClass('ordlist-fir-td')) {
				return
			}
			$(this).parent('.erporder-detail').next().show();
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
			$(this).parent('.erporder-detail').addClass('erporder-detail-active');
		})

		$('.orders-table').on('mouseleave', '.erporder-detail', function () {
			$(this).next().hide();
			if ($(this).hasClass('order-click-active')) {
				$(this).next().show();
			} else {
				$(this).next().hide();
			}
		})
		$('.orders-table').on('mouseenter', '.erpd-toggle-tr', function () {
			$(this).show();
		})
		$('.orders-table').on('mouseleave', '.erpd-toggle-tr', function () {
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
	}])
	// 待付款
	app.controller('newPayingCtrl', ['$scope', "erp","$routeParams", function ($scope, erp,$routeParams){
		console.log('newPayingCtrl page',$routeParams.type)
		
		$scope.payTypeObj = PAY_TYPE
		$scope.caigouPaymentTypeObj = CAIGOU_PAYMENT_TYPE

		// 计算订金的总价和线上总价
		$scope.calcuTotalPrice = function(item){
			const frontTotal = parseFloat(item.frontMoney) + parseFloat(item.restMoney)
			const res = item.payType=='1'?frontTotal:parseFloat(item.huoWuZongJia)
			if(typeof res == 'number' && window.isNaN(res)) return '--'
			return res.toFixed(2)
		}

		$scope.formatCaigouType = function(type){// 格式化采购类型
			switch(type){
				case '1':
					return '1688API'
				case '2':
					return '淘宝' 
				case '3':
					return '天猫' 
				case '4':
					return '线下'
				default:
					return '1688非API'
			}
		}
		$scope.formatChuDanCaiGouIds = function(text){// 格式化订单号
			if(!text) return ''
			return text.replace(/"/g,'').replace('[','').replace(']','')
		}
		$scope.formatZhuiZongHao = function(item){return formatZhuiZongHao(item.zhuiZongHao)} // 格式化追踪号

		$scope.caigouTypeChange = function(){// 采购类型更换
			getPageList()
		}

		$scope.list = []
		$scope.pageSize = '10';
		$scope.pageNum = '1';
		$scope.totalNum = 0;
		$scope.totalPageNum = 0;
		$scope.begainDate = '' // 开始时间
		$scope.endDate = '' // 结束时间
		$scope.caigouType = $routeParams.type || '2' // 采购类型
		$scope.chuDanCaiGouIds = '' // 采购单号
		$scope.orderId = '' // 订单号
		$scope.caigouRen = '' // 采购人
		$scope.payType = '' // 所属类型

		function getPageList(){// 获取非API待付款列表
			var params = {
				status:0,
				pageNo:String($scope.pageNum) || '1',
				pageSize:String($scope.pageSize) || '10',
				chuDanCaiGouIds:$scope.chuDanCaiGouIds,
				orderId:$scope.orderId,
				caigouRen:$scope.loginName,
				personalizedIdentity:$scope.personalizedIdentity,
				caigouType:$scope.caigouType,
				begainDate:$scope.begainDate,
				endDate:$scope.endDate
			}

			var url = "caigou/procurementOrder/queryOrderNotApiPage" // 非1688API url
			if($scope.caigouType==1) url = "caigou/procurementOrder/queryOrderApiPage" // 1688API url
			if($scope.caigouType == 4){
				params.payType = $scope.payType
			}

			layer.load(2)
			$scope.checkAll = false
			erp.postFun(url, params, function (data) {
				$scope.list = []
				layer.closeAll('loading')
				console.log(data)
				if(data.data.statusCode=='200'){
					var result = data.data.result
					result.list.forEach(function(item,index){
						result.list[index].checked = false // 初始化选中false
					})
					$scope.list = result.list
					$scope.totalNum = result.totalCount;
					var totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
					$scope.$broadcast('page-data', {
						pageSize: $scope.pageSize || '10',//每页条数
						pageNum: $scope.pageNum || '1',//页码
						totalNum: totalNum,//总页数
						totalCounts: result.totalCount,//数据总条数
						pageList:['10','20']//条数选择列表，例：['10','50','100']
					})
				}

			})
		}
		// getPageList()

		$scope.purchasePersonCallback = function({id, loginName}){
			console.log('purchasePersonCallback', id)
			$scope.personalizedIdentity = 2
			$scope.loginName = undefined
			if(id == 'POD') $scope.personalizedIdentity = 1
			if(loginName && id != 'POD') {
				$scope.personalizedIdentity = 0
				$scope.loginName = loginName
			}
			getPageList()
		}

		$scope.keyupRefresh = function(e){ // 回车刷新列表
			var keycode = window.event ? e.keyCode : e.which // 按键编码
			if(keycode == 13){
				getPageList()
			}
		}
		$scope.getPayingList = function(){
			$scope.pageNum = '1'
			getPageList()
		}
		$scope.$on('pagedata-fa', function (d, data) {// 分页onchange
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			getPageList();
		})

		var initParams = function(){// 初始值
			$scope.pageNum = '1'
			$scope.begainDate = ''
			$scope.endDate = ''
			$scope.chuDanCaiGouIds = ''
			$scope.orderId = ''
			$scope.caigouRen = ''
		}
		// $scope.$watch('caigouType',function(){
		// 	initParams()
		// 	getPageList()
		// })
		$scope.changeCaigouType = function(type){
			navTo('/manage.html#/erppurchase/paying/'+type)
		}

		// 实现全选
		$scope.checkAll = false
		$scope.selectedList = []
		// 全选方法
    $scope.selectAll = function () {
			let list = $scope.list
			for(var i=0;i<list.length;i++){list[i].checked = $scope.checkAll}
			$scope.list = list
		}
		$scope.refreshItemChecked = function(checked,i){// 子checkbox事件
			$scope.list[i].checked = checked
			isCheckAll()
		}
		function isCheckAll(){// 是否是全选
			let list = $scope.list
			let checkAll = true
			for(let i=0;i<list.length;i++){
				if(list[i].checked == false){
					checkAll = false
					break;
				}
			}
			console.log(checkAll)
			$scope.checkAll = checkAll
		}

		function getSelectListId(){// 获取选中行数组
			var result = [],list = $scope.list
			for(var i=0;i<list.length;i++){
				if(list[i].checked){
					result.push(list[i])
				}
			}
			return result
		}
		$scope.openPopup = function(type){// 打开type弹窗
			var selectRows = getSelectListId()
			if(selectRows.length<=0) return layer.msg('未勾选')
			if(type=='del'){
				$scope.delConfirm = true
			}else if(type='reject'){
				$scope.rejectConfirm = true
				$scope.reject1688Mark = ''
			}
		}
		$scope.batchDel = function(){// 批量删除
			var selectRows = getSelectListId()
			if(selectRows.length<=0) return layer.msg('未勾选')
		
			var params = {},list=[]
			var url = 'caigou/procurementOrder/batchDelete'

			for(var i=0;i<selectRows.length;i++){
				list.push({"orderId":selectRows[i].orderId,"type":selectRows[i].onlineType})
			}
			params.list = list
			erp.postFun(url, params, function (data) {
				if(data.data.statusCode=='200'){
					getPageList()
					$scope.delConfirm = false
					return layer.msg('删除成功')
				}
				layer.msg('服务器打盹了，请重试')
			})
		}
		$scope.rejectConfirm = false
		$scope.rejectAPI = function(){// 批量驳回
			var selectRows = getSelectListId()
			if(selectRows.length<=0) return layer.msg('未勾选')
			var params = {},list=[]
			var url = 'caigou/procurementOrder/offlineReject'
			if($scope.caigouType != '1'){ // 非1688API 驳回
				for(var i=0;i<selectRows.length;i++){
					list.push({"orderId":selectRows[i].orderId,"type":selectRows[i].onlineType})
				}
				params.list = list
			}else if($scope.caigouType=='1'){ // 1688API 驳回
				url = 'caigou/procurementOrder/apiOfflineReject'
				params.remark = $scope.reject1688Mark || ''
				if(!params.remark) return layer.msg('请填写拒绝备注')
				for(var i=0;i<selectRows.length;i++){
					list.push({"orderId":selectRows[i].orderId})
				}
				params.list = list
			}
			const load = layer.load(0)
			erp.postFun(url,params,function(data){
				layer.close(load)
				if(data.data.statusCode=='200' && $scope.caigouType != '1'){
					getPageList()
					$scope.rejectConfirm = false
					return layer.msg('驳回至采购出单成功')
				}
				if(data.data.statusCode == '200' && $scope.caigouType == '1'){
					getPageList()
					$scope.rejectConfirm = false
					const obj = data.data.result
					let tips = ''
					for(let key in obj){
						tips += key + ' : '+ obj[key] + '<br/>'
					}
					if(tips) return layer.open({ content:`<div style="padding:10px;">${tips}</div>`, type:1, area: ['420px', 'auto'] })
					return layer.msg('驳回至采购出单成功')
				}

				layer.msg('服务器打盹了，请重试')
			})
		}
		$scope.delConfirm = false// 删除确认
	}])
	// 待付款-提交至待签收
	app.controller('newPayingSubmitCtrl',['$scope','erp','merchan','$routeParams','$timeout',function($scope,erp,merchan,$routeParams,$timeout){
		console.log('待付款-提交')
		console.log($routeParams)
		const api = {
			outlineProduct_old: 'caigou/procurementOrder/queryOutlineProduct',//
			outlineProduct: 'procurement/order/queryOutlineProduct',//
			onlineProduct_old: 'caigou/procurementOrder/queryOnlineProduct',//
			onlineProduct: 'procurement/order/queryOnlineProduct',//
		}
		$scope.orderId = $routeParams.orderId // 订单ID
		$scope.onlineType = $routeParams.onlineType // 1 线上 2线下
		$scope.warehouseList = warehouseList // 取全局仓库对应列表
		$("#payTime").val(getCurrentDateString()) // 设置支付时间为当前时间
		$scope.showFlag = false;// 批量弹窗显示隐藏
		$scope.showConfirm = false// 出单确认确认弹窗
		$scope.dataInfo = {// 线上采购单
			id:'',
			chuDanCaiGouIds:'', // 采购单号
			caigouRen:'', // 创建人
			caigouType:'0',// 采购类型 0 
			orderId:$routeParams.orderId,// 订单号
			gongHuoGongSi:'',// 供货公司
			warehouse:'1',// 仓库
			caiGouLiuYan:'zhengChang',// 标记
			huoWuZongJia:'',// 原总价
			zhiFu:'',// 实际支付价格 or 需支付

			// 线下字段
			bank:'',// 收款银行
			branchBank:'',// 收款银行支行
			accountName:'',// 账户名称
			bankAccount:'',// 银行账号
			certPic:[],// 凭证图片
			// 线下字段	

			logistics:[// 物流公司数组
				{
					company:'',
					orderNo:''
				}
			],
			skuList:[],// 商品sku列表
			newSkuList:[],// 修改后的商品sku列表
		}
		$scope.payTypeSelected = '0' // 选中的支付方式
		$scope.payTypeArr=[// select 支付方式
			{
				payType:'1',
				payName:'支付宝',
				payObject:'涂宏名',
				payBank:'',
				payAccount:'15000616778'
			},
			{
				payType:'1',
				payName:'支付宝',
				payObject:'周理志',
				payBank:'',
				payAccount:'zlzshadow@outlook.com'
			},
			{
				payType:'2',
				payName:'微信',
				payObject:'',
				payBank:'',
				payAccount:''
			},
			{
				payType:'3',
				payName:'银联',
				payObject:'周理志',
				payBank:'兴业',
				payAccount:'622908********5417'
			},
			{
				payType:'3',
				payName:'银联',
				payObject:'周理志',
				payBank:'华夏',
				payAccount:'6230********6837'
			},
			{
				payType:'3',
				payName:'银联',
				payObject:'涂宏名',
				payBank:'浦发',
				payAccount:'6217********5395'
			}
		]
		
		function getSkuList(){// 获取列表
			var params = {
				store:$scope.dataInfo.warehouse,
				storageId:$scope.formatWarehouse($scope.dataInfo.warehouse),
				orderId:$routeParams.orderId
			}
			var url = api.onlineProduct;
			if($routeParams.onlineType=='2') url = api.outlineProduct;//2-27 采购迁移

			erp.mypost(url, params).then((list) => {
				$scope.dataInfo.skuList = list;
				$scope.dataInfo.newSkuList = list;
			})
			
		}
		function getProInfo(){// 获取单条采购信息
			var params = {
				onlineType:$routeParams.onlineType,
				orderId:$routeParams.orderId
			}
			var url = 'caigou/procurementOrder/queryOrderInfo'
			layer.load(2)
			erp.postFun(url,params,function(data){
				layer.closeAll('loading')
				console.log(data)
				if(data.data.statusCode=='200'){
					var res = data.data.result.list
					var _data = $scope.dataInfo	
					_data.id = res.id
					_data.caigouRen = res.caigouRen	
					_data.gongHuoGongSi = res.gongHuoGongSi
					_data.huoWuZongJia = +res.huoWuZongJia
					_data.chuDanCaiGouIds = res.chuDanCaiGouIds
					_data.signRemark = res.signRemark
					_data.zhiFu = res.zhiFu
					if($routeParams.onlineType=='1') _data.zhiFu = +res.realPayPrice// 显示用实际支付字段
					_data.warehouse = res.store==''?'1':res.store
					if(res.caigouType && res.caigouType!='') _data.caigouType = res.caigouType
					if(res.caiGouLiuYan && res.caiGouLiuYan!='') _data.caiGouLiuYan = res.caiGouLiuYan

					// 线下字段
					_data.bank = res.bank
					_data.bankAccount = res.bankAccount
					_data.branchBank = res.branchBank
					_data.accountName = res.accountName

					$scope.dataInfo = _data

					getSkuList()
				}
			})
		}
		getProInfo()

		function getSkuListParams(){// 获取skulist传参
			var res = []
			var list = $scope.dataInfo.skuList
			var newList = $scope.dataInfo.newSkuList
			for(var i=0;i<list.length;i++){
				res.push({
					id:String(list[i].id),
					procurementOrderId:list[i].chuDanCaiGouId,
					productUnitPrice:getUnitPrice(list[i],newList[i],list.length),
					oldNumber:parseInt(list[i].shuLiang),
					newNumber:parseInt(newList[i].shuLiang)
				})
			}
			return res
		}
		function getCertPicsParams(){// 获取凭证图片参数
			var pics = $scope.dataInfo.certPic
			var res = ''
			for(var i=0;i<pics.length;i++){
				var fh = i==0?'':","
				res+=fh+pics[i]
			}
			return res
		}
		function getLogisticsParams(){// 获取物流参数
			var res = {},logistics = $scope.dataInfo.logistics
			if(logistics.length <=0) return '{}'
			for(var i=0;i<logistics.length;i++){
				if(logistics[i].company != ''){
					res[logistics[i].orderNo] = logistics[i].company
				}		
			}
			return JSON.stringify(res)
		}
		function getTimeTamp(str){// 获取时间戳
			return new Date(str).getTime()
		}
		function notEmpty(){// 不能为空的一些字段
			if($routeParams.onlineType=='1'){
				if(!$scope.dataInfo.zhiFu) return '实际价格'
				if(!$scope.dataInfo.huoWuZongJia) return '原总价'
			}
			if($scope.dataInfo.gongHuoGongSi=='') return '供货公司'
			return ''
		}
		$scope.openConfirmPop = function(){ // 打开采购单确认弹窗
			var notEmptyVal = notEmpty()
			if(notEmptyVal!='') return layer.msg("请检查" + notEmptyVal + '字段')
			$scope.showConfirm = true
		}
		$scope.saveCaigouInfo = function(){ // 确认保存采购单信息
			var params = {
				id:String($scope.dataInfo.id),
				orderId:$scope.dataInfo.orderId,
				type:$routeParams.onlineType,
				waybillNo:getLogisticsParams(),
				company:$scope.dataInfo.gongHuoGongSi,
				warehouse:$scope.dataInfo.warehouse,
				tag:$scope.dataInfo.caiGouLiuYan,
				signRemark: $scope.dataInfo.signRemark,
				originalPrice:$scope.dataInfo.huoWuZongJia==''?'0':'' + $scope.dataInfo.huoWuZongJia,
				actualPayAmount:'' + $scope.dataInfo.zhiFu,
				payVoucher:getCertPicsParams(),
				payType:$scope.payTypeArr[parseInt($scope.payTypeSelected)].payType,
				payObject:$scope.payTypeArr[parseInt($scope.payTypeSelected)].payObject,
				payAccount:$scope.payTypeArr[parseInt($scope.payTypeSelected)].payAccount,
				payTime:getTimeTamp($('#payTime').val()),
				detail:getSkuListParams(),
			}
			console.log(params)
			var url = 'caigou/procurementOrder/save'
			layer.load(2)
			erp.postFun(url,params,function(data){
				layer.closeAll('loading')
				if(data.data.statusCode=='200'){
					$scope.showConfirm = false
					layer.msg('确认成功')
					return navTo('#/erppurchase/paying')
				}
				layer.msg('服务器异常')
			})
		}
		$scope.warehouseChange = function(){
			getSkuList()
		}
		$scope.batchShuLiang = ''
		$scope.batchChangeShuLiang = function(){// 批量设置采购数量
			if($scope.batchShuLiang=='') return layer.msg('请填写采购数量')
			var _data = $scope.dataInfo
			var skuList = _data.newSkuList
			for(var i=0;i<skuList.length;i++){
				skuList[i].shuLiang = $scope.batchShuLiang
			}
			_data.newSkuList = skuList
			$scope.dataInfo = _data
			$scope.showFlag = false
		}
		$scope.formatWarehouseText = function(val){// 仓库格式转换文本
			return getWarehouseByVal(val)
		}
		$scope.handleEmpty = function(val){// 处理空字符串字段 
			if(!val || val=='') return '未填写'
			return val
		}
		$scope.formatBiaoJiText = function(val){// 标记格式转换文本
			switch(val){
				case 'jiaJi':
					return '加急'
				case 'zhiFa':
					return '直发'
				case 'zuZhuang':
					return '组装'
				case 'buRuKu':
					return '不入库'
				case 'xianXiaZu':
					return '线下组'
				case 'gaiBiao':
					return '改标'
				default:
					return '正常'
			}
		}
		$scope.formatWarehouse = function(val){// 仓库格式转换
			return getWarehouseByVal(val,'id')[0]
		}
		$scope.formatCaigouType = function(type){// 格式化采购类型
			switch(type){
				case '1':
					return '1688API'
				case '2':
					return '淘宝' 
				case '3':
					return '天猫' 
				case '4':
					return '线下'
				default:
					return '1688非API'
			}
		}
		$scope.addLogistics = function(){// 添加物流行
			var logistics = $scope.dataInfo.logistics
			if(logistics.length>=5) return layer.msg('限制最多5条物流信息')
			logistics.push({
				company:'',
				orderNo:''
			})
			$scope.dataInfo.logistics = logistics
		}
		$scope.delLogistics = function(index){// 删除物流行
			var logistics = $scope.dataInfo.logistics
			logistics.splice(index,1)
			$scope.dataInfo.logistics = logistics
		}
		$scope.upLoadImg = function () {// 上传凭证
			var files = $('#upload-img1')[0].files
			if($scope.dataInfo.certPic.length+files.length>5) return layer.msg('限制5张凭证图片')
			erp.ossUploadFile(files, function (data) {
					$('#upload-img1').val('');
					console.log(data);
					if (data.code == 0) {
						layer.msg('上传失败');
						return;
					}
					if (data.code == 2) {
						layer.msg('部分图片上传失败，请等待图片加载。');
					}
					if (data.code == 1) {
						layer.msg('上传成功，请等待图片加载。');
					}
					var result = data.succssLinks;
					for(var i=0;i<result.length;i++){
						$scope.dataInfo.certPic.push(result[i])
					}
					$scope.$apply()
			});
		}
		$scope.previewPic = function (src) {// 预览凭证
			merchan.previewPicTwo(src);
		}
		$scope.deletePic = function(index){// 删除上传凭证
			$scope.dataInfo.certPic.splice(index,1);
		}
		var getUnitPrice = function(oldItem,newItem,len){// 获取最新单价
			var oldPrice = Number($scope.dataInfo.huoWuZongJia + ''.replace(/,/g,'')) // 原总价
			if($routeParams.onlineType == '2') oldPrice = Number($scope.dataInfo.zhiFu)
			var rate = Number(oldItem.shuLiang)*Number(oldItem.costprice)
			rate = rate / oldPrice
			var newPrice = Number($scope.dataInfo.zhiFu) // 实际支付价格
			if(len==1){
				return (newPrice / Number(newItem.shuLiang)).toFixed(2)
			}
			var result = newPrice*rate // 新单品总价
			result = result / Number(newItem.shuLiang) // 新单价
			return result.toFixed(2)
		}
	
	}])
	// 已付款
	app.controller('newPayedCtrl', ['$scope', 'erp',"$routeParams", function($scope, erp,$routeParams) {
		console.log('newPaymentCtrl -----------------', )

		$scope.payTypeObj = PAY_TYPE
		$scope.caigouPaymentTypeObj = CAIGOU_PAYMENT_TYPE
		// $scope.waybill = false // false 未获取运单号 true 以获取运单号
		
		$scope.updateItem = undefined // 要修改的项
		$scope.logisticsFlag = false // 填写物流信息弹窗
		$scope.logisticsList = [{}] // 填写了的物流列表
		$scope.saveLogistics = function(){
			const list = $scope.logisticsList
			const len = list.length
			const item = $scope.updateItem
			if(!item) return layer.msg('无操作项')
			const getLogisticsParams = function(){
				const res = {}
				if(len <= 0) res = {}
				list.forEach(function(_,index){
					if(!!_.company) res[_.orderNo] = _.company
				})
				return JSON.stringify(res)
			}

			let url = 'caigou/procurementOrder/updateProcurementTrackingNo'
			const params = {
				id:item.id,
				zhuiZongHao:getLogisticsParams()
			}

			layer.load(2)
			erp.postFun(url,params,function(res){
				layer.closeAll('loading')
				if(res.data.statusCode != 200) return layer.msg(res.data.message || '服务器出错')
				layer.msg('保存成功')
				$scope.logisticsFlag = false
				getPageList()
			})
		}
		$scope.openLogisticsBubble = function(item){
			$scope.logisticsList = [{}]
			$scope.updateItem = item
			$scope.logisticsFlag = true
		}

		$scope.addLogistics = function(){
			const list = $scope.logisticsList
			if(list.length >= 5) return layer.msg('超出可添加限制')
			list.push({})
			$scope.logisticsList = list
		}

		// 获取支付证明
		$scope.payProvePic = ''
		$scope.getPayProve = function(item){
			const orderId = item.orderId
			const url = 'caigou/procurementOrder/findPingZheng'
			layer.load(2)
			erp.postFun(url,{ orderId },function(res){
				layer.closeAll('loading')
				if(res.data.statusCode != 200) return layer.msg('获取凭证失败')
				$scope.payProvePic = res.data.result
			})
		}

		// 线下采购的情况 计算  needPay 需支付  payed 已支付 paying 待支付的值
		// $scope.getOfflineMoney = function(item,key = 'needPay'){
		// 	let obj = {
		// 		needPay :'0.00',
		// 		payed :'0.00',
		// 		paying :'0.00'
		// 	}
		// 	if(item.payType == 1){
		// 		obj.needPay = (parseFloat(item.frontMoney) + parseFloat(item.restMoney)).toFixed(2)
		// 		obj.payed = parseFloat(item.frontMoney).toFixed(2)
		// 		obj.paying = parseFloat(item.restMoney).toFixed(2)
		// 		return obj[key]
		// 	}else if(item.payType == 2){
		// 		obj.needPay = obj.payed = parseFloat(item.huoWuZongJia).toFixed(2)
		// 		return obj[key]
		// 	}else if(item.payType == 3){
		// 		obj.needPay = obj.payed = parseFloat(item.huoWuZongJia).toFixed(2)
		// 		return obj[key]
		// 	}
		// }

		$scope.changeCaigouType = function(type){
			navTo('/manage.html#/erppurchase/payed/'+type)
		}
		$scope.caigouTypeChange = function(){// 采购类型更换
			getPageList()
		}
		$scope.keyupRefresh = function(e){ // 回车刷新列表
			var keycode = window.event ? e.keyCode : e.which // 按键编码
			if(keycode == 13){
				getPageList()
			}
		}
		$scope.formatCaigouType = function(type){// 格式化采购类型
			switch(type){
				case '1':
					return '1688API'
				case '2':
					return '淘宝' 
				case '3':
					return '天猫' 
				case '4':
					return '线下'
				default:
					return '1688非API'
			}
		}
		$scope.formatZhuiZongHao = function(text){// 格式化运单号
			if(text=='{}' || text=='') return ''
			var res = JSON.parse(text)
			var result = ''
			for(var key in res){
				var suffix = $scope.caigouType != '1'?' : '+res[key]:'' // 1688API以获取运单号的运单号去掉：和：后面信息
				result+=key+suffix+'\n'
			}
			return result
		}
		$scope.formatChuDanCaiGouIds = function(text){// 格式化订单号
			if(!text) return ''
			return text.replace(/"/g,'').replace('[','').replace(']','')
		}

		$scope.list = []
		$scope.pageSize = '10';
		$scope.pageNum = '1';
		$scope.totalNum = 0;
		$scope.totalPageNum = 0;
		$scope.begainDate = '' // 开始时间
		$scope.endDate = '' // 结束时间
		$scope.caigouType = $routeParams.type || '2' // 采购类型
		$scope.chuDanCaiGouIds = '' // 采购单号
		$scope.orderId = '' // 订单号
		$scope.caigouRen = '' // 采购人
		$scope.payType = '' // 所属类型

		$scope.payStatus = '' // 付款状态
		$scope.payStatusObj = {
			'1':'部分付清',
			'2':'全部付清'
		}

		function getPageList(){// 获取非API待付款列表
			var params = {
				status:$scope.caigouType=='1'? 6 : 1,
				pageNo:String($scope.pageNum),
				pageSize:String($scope.pageSize),
				chuDanCaiGouIds:$scope.chuDanCaiGouIds,
				orderId:$scope.orderId,
				caigouRen:$scope.loginName,
				personalizedIdentity:$scope.personalizedIdentity,
				caigouType:$scope.caigouType,
				begainDate:$scope.begainDate,
				endDate:$scope.endDate
			}

			// if($scope.caigouType=='1') params.zhuiZongHao = $scope.wayBill?'1':'0'

			var url = "caigou/procurementOrder/queryOrderNotApiPage" // 非1688API url
			if($scope.caigouType=='1') url = "caigou/procurementOrder/queryOrderApiPage" // 1688API url
			if($scope.caigouType == '4'){
				params.payType = $scope.payType
				params.payResultType = $scope.payStatus
			}

			layer.load(2)
			$scope.checkAll = false
			erp.postFun(url, params, function (data) {
				$scope.list = []
				layer.closeAll('loading')
				console.log(data)
				if(data.data.statusCode=='200'){
					var result = data.data.result
					result.list.forEach(function(item,index){
						result.list[index].checked = false // 初始化选中false
					})
					$scope.list = result.list
					$scope.totalNum = result.totalCount;
					var totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
					$scope.$broadcast('page-data', {
						pageSize: $scope.pageSize,//每页条数
						pageNum: $scope.pageNum,//页码
						totalNum: totalNum,//总页数
						totalCounts: result.totalCount,//数据总条数
						pageList:['10','20']//条数选择列表，例：['10','50','100']
					})
				}

			},function(err){
				layer.closeAll('loading')
				console.log(err)
			});
		}
		// getPageList()

		$scope.purchasePersonCallback = function({id, loginName}){
			console.log('purchasePersonCallback', id)
			$scope.personalizedIdentity = 2
			$scope.loginName = undefined
			if(id == 'POD') $scope.personalizedIdentity = 1
			if(loginName && id != 'POD') {
				$scope.personalizedIdentity = 0
				$scope.loginName = loginName
			}
			getPageList()
		}
		
		$scope.getPayingList = function(){
			$scope.pageNum = '1'
			getPageList()
		}
		$scope.$on('pagedata-fa', function (d, data) {// 分页onchange
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			getPageList();
		})

		// 查看订单操作日志
		$scope.LookLog = function (item,type, ev) {
			console.log(item)
			$scope.isLookLog = true;
			$scope.currentItem = item;
			$scope.operationLogType = type;
			ev.stopPropagation()
		}
		$scope.$on('log-to-father', function (d, flag) {
			if (d && flag) {
				$scope.isLookLog = false;
			}
		})
		
	}])
	//erp 全部
	app.controller('allPurchaseCtrl', ['$scope', "erp", "$timeout", function ($scope, erp, $timeout) {
		console.log('allPurchaseCtrl')
		const api = {
			outlineProduct_old: 'caigou/procurementOrder/queryOutlineProduct',//
			outlineProduct: 'procurement/order/queryOutlineProduct',//
			onlineProduct_old: 'caigou/procurementOrder/queryOnlineProduct',//
			onlineProduct: 'procurement/order/queryOnlineProduct',//
		}
		$scope.list = [] // 列表
		$scope.dataInfo = {
			gongHuoGongSi:'',// 供货公司
			caigouType:'0',// 采购类型
			chuDanCaiGouIds:'',// 采购单号
			zhuiZongHao:'',// 运单号
			orderId:'',// 淘宝/1688订单号
			caigouRen:'',// 创建人
			type:'',// 状态
		}
		
		$scope.pageSize = '10'
		$scope.pageNum = '1'
		$scope.totalNum = 0
		function getList(){// 获取列表
			var params = $scope.dataInfo
			var url = 'caigou/procurementOrder/queryOrderAllPage'
			params.pageNo = String($scope.pageNum)
			params.pageSize = String($scope.pageSize)
			params.personalizedIdentity = $scope.personalizedIdentity
			params.caigouRen = $scope.loginName
			layer.load(2)
			erp.postFun(url,params,function(data){
				layer.closeAll('loading')
				console.log(data)
				if(data.data.statusCode == '200'){
					var result = data.data.result
					$scope.list = result.list
					$scope.totalNum = result.totalCount;
					var totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
					console.log(totalNum,'totalNum')
					$scope.$broadcast('page-data', {
						pageSize: $scope.pageSize,// 每页条数
						pageNum: $scope.pageNum,// 页码
						totalNum: totalNum,// 总页数
						totalCounts: result.totalCount,// 数据总条数
						pageList:['10','20']// 条数选择列表，例：['10','50','100']
					})
				}
			})
		}

		$scope.purchasePersonCallback = function({id, loginName}){
			console.log('purchasePersonCallback', id)
			$scope.personalizedIdentity = 2
			$scope.loginName = undefined
			if(id == 'POD') $scope.personalizedIdentity = 1
			if(loginName && id != 'POD') {
				$scope.personalizedIdentity = 0
				$scope.loginName = loginName
			}
			getList()
		}

		$scope.caigouTypeChange = function(){// 采购类型更换
			getList()
		}
		$scope.keyupRefresh = function(e){ // 回车刷新列表
			var keycode = window.event ? e.keyCode : e.which // 按键编码
			if(keycode == 13){
				getList()
			}
		}
		$scope.$on('pagedata-fa', function (d, data) {// 分页onchange
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			getList();
		})
		// getList()
		
		$scope.getList = function(){getList()}
		$scope.formatDatetimeStamp = function(time){// 格式化时间
			return erp.handleTimestampToString(time)
		}
		$scope.formatCaigouType = function(type){// 格式化采购类型
			switch(type){
				case '1':
					return '1688API'
				case '2':
					return '淘宝' 
				case '3':
					return '天猫' 
				case '4':
					return '线下'
				default:
					return '1688非API'
			}
		}
		$scope.formatChuDanCaiGouIds = function(text){// 格式化订单号
			if(!text) return ''
			return text.replace(/"/g,'').replace('[','').replace(']','')
		}
		$scope.formatZhuiZongHao = function(text){// 格式化运单号
			if(text=='{}' || text=='') return '空'
			var res = JSON.parse(text)
			var result = ''
			for(var key in res){
				result+=key+' : '+res[key]+'\n'
			}
			return result
		}
		$scope.formatWarehouse = function(val){// 仓库格式转换
			return getWarehouseByVal(val)
			// switch(val){
			// 	case '0':
			// 			return '{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}'// 义乌仓
			// 	case '1':
			// 		return '85742FBC-38D7-4DC4-9496-296186FFEED8' // 深圳仓
			// 	case '2':
			// 			return '201e67f6ba4644c0a36d63bf4989dd70' // 美国东
			// 	case '3':
			// 			return '738A09F1-2834-43CC-85A8-2FE5610C2599' // 美国西
			// 	case '4':
			// 			return '7779ff66a0474bbdadcf1bf4924f228b' // 泰国仓
			// 	default:
			// 		return '{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}'// 义乌仓
			// }
		}
		$scope.formatBiaoJiText = function(val){// 标记格式转换文本
			switch(val){
				case 'jiaJi':
					return '加急'
				case 'zhiFa':
					return '直发'
				case 'zuZhuang':
					return '组装'
				case 'buRuKu':
					return '不入库'
				case 'xianXiaZu':
					return '线下组'
				case 'gaiBiao':
					return '改标'
				default:
					return '正常'
			}
		}
		$scope.formatWarehouseText = function(val){// 仓库格式转换文本
			return getWarehouseByVal(val)
			// switch(val){
			// 	case '0':
			// 		return '义乌仓'// 义乌仓
			// 	case '1':
			// 		return '深圳仓' // 深圳仓
			// 	case '2':
			// 		return '美国东' // 美国东
			// 	case '3':
			// 		return '美国西' // 美国西
			// 	case '4':
			// 		return '泰国仓' // 泰国仓
			// 	default:
			// 		return '义乌仓'// 义乌仓
			// }
		}
		$scope.handleEmpty = function(val){// 处理空字符串字段 
			if(!val || val=='') return '未填写'
			return val
		}
		$scope.recordStatus = function(item){// 状态判断
			if(item.caigouType == 1){
				if(item.status == 9) return '已关闭'
			}
			if(item.status=='0') return '待付款'
			if(item.status=='1') return '已付款'
			if(item.status=='5') return '待确认'
			if(item.skuStatus=='2') return '待签收'
			if(item.skuStatus=='3') return '已签收'
			if(item.skuStatus=='-1' || item.skuStatus=='4' || item.skuStatus=='6') return "签收异常"
		}

		$scope.showConfirm = false// 采购单详情窗口
		$scope.caigouXQ = {}// 上半部详情
		$scope.certPic = []// 凭证图片列表
		$scope.logisticsObj = {}// 物流对象
		$scope.skuList = []// sku列表
		$scope.onlineType = ''// 1 线上 2 线下
		function getSkuList(item){// 获取列表
			var params = {
				store:item.store,
				storageId:$scope.formatWarehouse(item.store),
				orderId:item.orderId
			}
			var url = api.onlineProduct;
			if(item.onlineType=='2') url = api.outlineProduct;//2-27 采购迁移

			erp.mypost(url, params).then((list) => {
				$scope.skuList = list;
			})
		}
		$scope.getProInfo = function(item){// 获取单条采购信息
			$scope.showConfirm = true
			$scope.caigouXQ = {}
			$scope.certPic = []
			$scope.logisticsObj = {}
			$scope.skuList = []

			$scope.onlineType = item.onlineType
			var params = {
				onlineType:item.onlineType,
				orderId:item.orderId
			}
			var url = 'caigou/procurementOrder/queryOrderInfo'
			layer.load(2)
			erp.postFun(url,params,function(data){
				layer.closeAll('loading')
				console.log(data)
				if(data.data.statusCode=='200'){
					$scope.caigouXQ = data.data.result.list
					getCertPicArr(data.data.result.list.certPic)
					logistics2arr(data.data.result.list.zhuiZongHao)
					getSkuList(item)
				}
			})
		}
		function getCertPicArr(picStr){// 图片格式转Array  imgUrl,imgUrl
			if(!picStr || picStr=='') return ''
			var arr = picStr.split(',')
			$scope.certPic = arr
		}
		function logistics2arr(zhuiZongHao){// str json格式转换
			let obj = JSON.parse(zhuiZongHao)
			if(!zhuiZongHao || zhuiZongHao == '{}') obj = {'未填写':'未填写'}
			$scope.logisticsObj = obj
		}
		$scope.showRecord = false // 操作记录弹窗
		$scope.operateRecord = [] // 操作记录
		$scope.getRecords = function(item){// 获取操作记录列表
			$scope.showRecord = true
			$scope.operateRecord = []
			var params = {
				orderId:item.orderId
			}
			var url = 'caigou/procurementOrder/queryOrderLogs'
			erp.postFun(url,params,function(data){
				console.log(data)
				if(data.data.statusCode=='200'){
					$scope.operateRecord = data.data.result.list
				}	
			})
		}

	}])
	function navTo(url, type) {
		type = type || '_self';
		if (!url) return;
		let a = document.createElement('a')
		a.href = url;
		a.setAttribute('target', type)
		a.click()
		a = null;
	}
	function deepClone(obj){
		var _obj = JSON.stringify(obj),
		objClone = JSON.parse(_obj)
		return objClone
	}
	function deepCloneArr(arr){
		var _arrClone = []
		for(var i=0;i<arr.length;i++){
			_arrClone.push(deepClone(arr[i]))
		}
		return _arrClone
	}
	function formatZhuiZongHao(text){// 格式化运单号
		if(text=='{}' || text=='') return '空'
		var res = JSON.parse(text)
		var result = ''
		for(var key in res){
			var suffix = ' : '+res[key] // 1688API以获取运单号的运单号去掉：和：后面信息
			result+=key+suffix+'\n'
		}
		return result
	}
	function getCurrentDateString(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second
	}
	function navBack(erp, query) {
		let url = '/manage.html#/erppurchase/purchase_order';
		query && (url = erp.setQueryToUrl(url, query))
		navTo(url)
	}
	function getWarehouseByVal(val,key='label'){// value匹对 默认返回对应label 
		var result = ''
		for(var i=0;i<warehouseList.length;i++){
			var item = warehouseList[i]
			if(item.value==val){
				result = item[key]
				break
			}
		}
		return result
	}
})()

