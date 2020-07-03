window.xiaokyo_routerList = [ // 路由列表
  {
    route: '/advancePurchase/list/:sku?',// 预采购列表
    templateUrl: './static/newPages/advancePurchase/list/index.html',
    controller: 'advancePurchaseList'
  },
  {
    route: '/advancePurchase/apply/:sku?',// 预采购申请列表
    templateUrl: './static/newPages/advancePurchase/apply/index.html',
    controller: 'advancePurchaseApplyList'
  },
  {
    route: '/advancePurchase/cycle/:sku?',// 预采购周期设置
    templateUrl: './static/newPages/advancePurchase/cycle/index.html',
    controller: 'advancePurchaseCycleSetting'
  },
  {
    route: '/advancePurchase/warning/:sku?',// 预采预警管理
    templateUrl: './static/newPages/advancePurchase/warning/index.html',
    controller: 'advancePurchaseWarning'
  },
  {
    route: '/advancePurchase/stockout/:sku?',// 断货预警管理
    templateUrl: './static/newPages/advancePurchase/stockout/index.html',
    controller: 'advancePurchaseStockOutWarning'
  },
  {
    route: '/losslist',// 损耗列表
    templateUrl: './static/newPages/losslist/index.html',
    controller: 'ctrlLossList'
  },
  {
    route: '/settingSyncStorage',// 是否开启虚拟仓库
    templateUrl: './static/newPages/syncStorage/index.html',
    controller: 'ctrlSyncStorage'
  },
  {
    route: '/erpcustomer/selfDelivery/:status?',// 自发货列表
    templateUrl: './static/newPages/selfDelivery/index.html',
    controller: 'ctrlSelfDelivery'
  },
  {
    route: '/erpcustomer/xiaokTransport/:status?',// 物流管理列表
    templateUrl: './static/newPages/transport/index.html',
    controller: 'ctrlXiaokTransport'
  },
  {
    route: '/erppurchase/returnList',// 退货列表
    templateUrl: './static/newPages/returnList/index.html',
    controller: 'ctrlReturnList'
  },
  {
    route: '/newStorageCreate/blockList',// 仓库区列表
    templateUrl: './static/newPages/createStorageAll/stockblock/index.html',
    controller: 'ctrlStorageBlock'
  },
  {
    route: '/erppurchase/offlinePurchase',// 线下采购--待确认
    templateUrl: './static/newPages/offlinePurchase/confirm/index.html',
    controller: 'purchaseOfflineConfirm'
  },
  {
    route: '/erppurchase/offlinePurchase/submit/:id/:type',// 线下采购--提交
    templateUrl: './static/newPages/offlinePurchase/confirm/submit.html',
    controller: 'purchaseOfflineConfirmSubmit'
  },
  {
    route: '/erppurchase/offlinePurchase/detail/:id/:type',// 线下采购--详情查看
    templateUrl: './static/newPages/offlinePurchase/detail/index.html',
    controller: 'offilinePurchaseDetailController'
  },
  {
    route: '/erppurchase/offlinePurchase/refund/:id/:type',// 线下采购--退款处理
    templateUrl: './static/newPages/offlinePurchase/refund/index.html',
    controller: 'offlinePurchaseRefundController'
  },
  {
    route: '/erppurchase/abnormal-list/:status?',// 签收异常
    templateUrl: './static/newPages/offlinePurchase/abnormal/index.html',
    controller: 'ctrlAbnormal as ctrl'
  },
  {
    route: '/erppurchase/assignWork',// 分配任务
    templateUrl: './static/newPages/purchaseThree/assign/index.html',
    controller: 'ctrlAssignWork as ctrl'
  },
  {
    route: '/erppurchase/inside',// 添加内部采购单
    templateUrl: './static/newPages/purchaseThree/inside/index.html',
    controller: 'ctrlPurchaseInside as ctrl'
  },
  {
    route: '/erppurchase/insideList',// 添加内部采购单
    templateUrl: './static/newPages/purchaseThree/insideList/index.html',
    controller: 'ctrlPurchaseInsideList as ctrl'
  },
  {
    route: '/erppurchase/updateSupplierLink/:id/:flag/:status/:type',// 修改对手链接和供应商链接
    templateUrl: './static/newPages/updatePurLink/index.html',
    controller: 'ctrlUpdatePurLink as ctrl'
  },
  {
    route: '/erppurchase/payingForInside/:status?',// 待付款内部采购
    templateUrl: './static/newPages/purchaseThree/payingForInside/index.html',
    controller: 'ctrlPayingForInside as ctrl'
  },
  {
    route: '/erppurchase/stockoutThree',// 采购缺货
    templateUrl: './static/newPages/purchaseThree/stockout/index.html',
    controller: 'ctrlPurchaseStockout as ctrl'
  },
  {
    route: '/erppurchase/categoryStatistics',// 工作统计
    templateUrl: './static/newPages/purchaseThree/categoryStatistics/index.html',
    controller: 'ctrlCategoryStatistics as ctrl'
  },
  {
    route: '/erppurchase/stockoutOrders',// 采购缺货商品变体列表
    templateUrl: './static/newPages/purchaseThree/stockoutOrders/index.html',
    controller: 'ctrlPurchaseStockoutOrders as ctrl'
  },
  {
    route: '/erppurchase/handleOrders/:variantId/:sku/:clientName?',// 采购缺货商品变体列表
    templateUrl: './static/newPages/purchaseThree/handleOrders/index.html',
    controller: 'ctrlHandleOrders as ctrl'
  },
  {
    route: '/erppurchase/customerStockList/:variantId/:sku',// 采购缺货商品变体列表
    templateUrl: './static/newPages/purchaseThree/clientList/index.html',
    controller: 'ctrlStockoutClients as ctrl'
  },
  {
    route: '/erppurchase/assignPersonToPurchase',// 组长分配任务给组员去采购商品
    templateUrl: './static/newPages/assignPersonToPurchase/index.html',
    controller: 'assignPersonToPurchaseCtrl as ctrl'
  },
  {
    route: '/erpsource/limitSetting',// 搜品额度
    templateUrl: './static/newPages/sourcingLimit/index.html',
    controller: 'ctrlSourcingLimit as ctrl'
  }
]