
var MODULE_PURCHASETHREE = {
	name: 'purchaseThree',
	apis: {
		getAssignRecord: 'procurement/caigouJobAssignment/list', // 分配记录
		getAssignHistory: 'procurement/caigouJobAssignment/getJobAssignmentRecordList',// 历史记录
		getClassifications: 'procurement/caigouJobAssignment/getCategoryInfo',// 获取类目列表
		assignClassification: 'procurement/caigouJobAssignment/add',// 给业务员分配类目
		batchAssignClassification: 'procurement/caigouJobAssignment/assignBuyerList',// 批量分配
		queryAssignAndPersonWork: 'procurement/caigouJobAssignment/getAssignCategoryList',// 查询分配情况

		// 内部采购
		saveInsidePurInfo: 'procurement/internal/saveInternalProcurement',// 保存内部采购单
		payingInsideList: 'procurement/internal/getInternalProcurementNonPayment',// 内部采购未付款列表
		getInsideDetail: 'procurement/internal/getInternalProcurementDetails',// 内部采购详情获取
		submitRefund: 'procurement/internal/refund',// 内部采购退款

		// 缺货管理
		stockoutList: 'processOrder/procurement/queryStockoutPageListPage',// 缺货列表
		queryProBySku: 'procurement/order/getVariantsBySku',// 查询商品 by sku
		addStockPro: 'processOrder/Stockout/addDbStockoutGoods',// 添加缺货商品
		queryVariants: 'procurement/order/todaySkuListVariantQue',// 查询变体
		queryVariantsOne: 'processOrder/procurement/queryStockoutPageList',// 查询变体-采购缺货
		moveOutStock: 'processOrder/Stockout/removeStockoutOrder',// 移出缺货列表

		// 采购工作统计
		categoryStatisticsList: 'procurement/cost/getStatisticalProcurementWorkList',// 采购工作统计

		// 缺货订单列表
		queryStockoutOrders: 'procurement/order/outStockOrderStatistics', // 缺货变体列表
		queryVirtualStorage: 'procurement/order/getStoragCountVO',// 获取虚拟仓库
		dropshippingOrders: 'processOrder/Stockout/queryStockoutForList', // 采购缺货待发单
		straightHairOrders: 'payOrder/getDspPayOrderForList',// 采购缺货直发单

		// 缺货的客户列表
		queryClientList: 'processOrder/Stockout/getCustomerStockList', // 缺货客户列表
	},
	caigouType: {// 采购类型
		'1': '1688采购',
		'2': '天猫采购',
		'3': '淘宝采购',
		'4': '线下采购',
	},
	payType: {// 付款方式
		'1': '先付款后发货',
		'2': '先发货后付款',
		'3': '预付定金'
	},
	acceptType: { // 支付方式
		'1': '银行',
		'2': '支付宝'
	},
	payforType: { // 打款状态
		'1': '待打款',
		'2': '已打款',
		'3': '已拒绝'
	}
}

	; (function () {
		const module = angular.module(MODULE_PURCHASETHREE.name, [])
		const rootPath = 'purchaseThree/'
		const vDateTemp = !!window.BUILD_VERSION ? '?v=' + window.BUILD_VERSION : ''
		const suffix = '/index.js' + vDateTemp
		const controllers = [
			'assign', // 分配任务
			'inside', // 内部采购提交
			'payingForInside',// 内部采购待付款
			'stockout',// 采购缺货
			'categoryStatistics',// 采购工作统计
			'stockoutOrders', // 缺货商品变体列表
			'handleOrders', // 缺货订单处理列表
			'clientList',// 客户列表
		]

		controllers.forEach(_ => window.importModule(rootPath + _ + suffix))
	})()