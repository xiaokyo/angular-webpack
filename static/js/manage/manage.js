(function (angular, Base64) {
  var app = angular.module('manage', [
    'ngRoute',
    'merchandise',
    // 'excel-order-app',
    'supplier-manage-app',
    // 'customer-app',
    // 'custom-order-app',
    'erp-sourcing-app',
    'erp-seachd-app',
    'purchase-app',
    'purchase-stockout-app', //采购-盘点缺货记录
    'purchase-12-15', //12-15新采购
    'purchase-12-26', //12-26新采购
    // 'losslist', // 损耗列表
    // 'syncStorage',// 开启虚拟仓库设置
    'error-1-16', //1-14 采购异常 拒绝打款
    'error-1-14', //1-14 采购异常  已退款
    'offline_payment-1-31', //1-31 财务打款 线下采购
    'warehouse_management', // 2-3 入库管理-分标管理-质检管理
    'weight-change-log',
    // 'advancePurchase',
    'purchase-cgd-app',
    'warehouse-app',
    'erp-customer',
    'erp-resident',
    'erp-reconciliation',
    'erp-resident-new',
    'erp-finance',
    'erp-service',
    'erp-l',
    'erp-staff',
    'new-store-staff',
    'sptree-staff',
    'login-app',
    'staffpersoncenter-app',
    'custom-ziord-app',
    'custom-muord-app',
    'excel-all-app',
    'excel-cl-app',
    'erp-mycjapp',
    'custom-mufone-app',
    'custom-muone-app',
    'custom-muclz-app',
    'custom-mutwo-app',
    'custom-muthree-app',
    'custom-mufour-app',
    'custom-newzione-app',
    'custom-newzitwo-app',
    'custom-zitwo-app',
    'custom-zidiaodu-app',
    'custom-zithree-app',
    'custom-zifour-app',
    'custom-intercept-list-app',
    'custom-zifive-app',
    'custom-ziall-app',
    'ruzhu-cus-app',
    'zxd-app',
    // 'logistics-showresults',
    'pascalprecht.translate',
    'VideoORder-app',
    'gxhgys-app',
    'analysis',
    'analysis1',
    'analysis2',
    'erp-bank',
    'SalesmanManagement',
    'zombie-order',
    'retention-order',
    'wui.date',
    'custom-filter',
    'custom-fulfil-app',
    'erp-l-order',
    'erp-subscriber',
    'erp-tixian',
    'fuwu-sp',
    'erp-joke',
    'erp-cjhot',
    'app-video',
    'erp-analysis',
    // 'salesCommission'
    'erp-receipt',
    'shortage-refund',  //erp-财务-缺货退款
    'internal-procurement', //erp-财务-内部采购
    'out-of-stock', // 缺货订单相关
    //'erp-ccc'
    //'erp-analysis'
    //'systemSettings-app'
    //'erp-luntan'
    // 'custom-Affiliate-app'
    // 'erpZfOrdApp'
    // 'product-app'
    'activites-data-view', // 20200302添加新的活动统计数据展示
  ].concat(window.xiaokyo_moduleList));

  app.config(['$routeProvider', '$translateProvider', function ($routeProvider, $translateProvider) {
    $routeProvider
    .when('/merchandise/list/:type/:status/:sku?', {
      // templateUrl:'./home.html'
      templateUrl: './static/html/manage/merchandise/merchandise-drop.html',
      controller: 'merchandiseCtrlHome'
    })
    .when('/merchandise/soldOut/:type', {
      // templateUrl:'./home.html'D:\git-project\erp-web\static\html\manage\merchandise\merchandise-soldOutSKU.html
      templateUrl: './static/html/manage/merchandise/merchandise-soldOutSKU.html',
      controller: 'merchandiseSoldOutCtrl'
    })
    .when('/merchandise/pendfuwu', {//服务商品-待审核
      templateUrl: './static/html/manage/fuwupro/pend-shenhe.html',
      controller: 'pendfuwuCtrl'
    })
    .when('/merchandise/fuwuShenHeZhong', {//服务商品-审核中
      templateUrl: './static/html/manage/fuwupro/shenhezhong.html',
      controller: 'shenHeZhongCtrl'
    })
    .when('/merchandise/fuwuShenHeJujue', {//服务商品-审核拒绝
      templateUrl: './static/html/manage/fuwupro/juJueShenHe.html',
      controller: 'shenHeJuJueCtrl'
    })
    .when('/merchandise/fuwuShenHeChengGong', {//服务商品-审核成功
      templateUrl: './static/html/manage/fuwupro/chengGongShenHe.html',
      controller: 'shenHeChengGongCtrl'
    })
    .when('/merchandise/fuwuDqs', {//服务商品-待签收
      templateUrl: './static/html/manage/fuwupro/daiqianshou.html',
      controller: 'qianShoudqxCtrl'
    })
    .when('/merchandise/fuwuYiQianShou', {//服务商品-已签收
      templateUrl: './static/html/manage/fuwupro/yiqianshou.html',
      controller: 'qianShouyqxCtrl'
    })
    .when('/merchandise/fuwuYiJujue', {//服务商品-已拒绝
      templateUrl: './static/html/manage/fuwupro/yijujue.html',
      controller: 'qianShouyjjCtrl'
    })
    .when('/merchandise/fuwuYiQuXiao', {//服务商品-已取消
      templateUrl: './static/html/manage/fuwupro/yiquxiao.html',
      controller: 'qianShouqxCtrl'
    })
    .when('/mycj', {//我的cj
      templateUrl: './erp_otweb/mycj/mycj-home.html',
      controller: 'erp-mycjcontrol'
    })
    .when('/mycj/commonHome', {//公共首页
      templateUrl: './erp_otweb/mycj/common-home.html',
      controller: 'erpcomhomeCtrl'
    })
    .when('/mycj/ywyHome', {//业务员首页
      templateUrl: './erp_otweb/mycj/ywy-home.html',
      controller: 'erpywyhomeCtrl'
    })
    // .when('/mycj/mycjperformance', {
    //     templateUrl: './erp_otweb/mycj/mycj-performance.html',
    //     controller: 'erp-performance'
    // })Catching goods
    .when('/erpfinance/OrderProfit', {  //erp我的绩效
      templateUrl: './erp_otweb/mycj/mycj-performance.html',
      controller: 'OrderProfitCtrl'
    })
    .when('/mycj/CatchingGoods', {  //erp我的绩效 -- 抓货记录
      templateUrl: './erp_otweb/mycj/mycj-CatchingGoods.html',
      controller: 'CatchingGoodsCtrl'
    })
    .when('/mycj/InspectionForm', {  //erp我的绩效 -- 验单记录
      templateUrl: './erp_otweb/mycj/mycj-InspectionForm.html',
      controller: 'InspectionFormCtrl'
    })
    .when('/mycj/rkjxtj', {  //erp入库统计
      templateUrl: './erp_otweb/mycj/mycj-rktj.html',
      controller: 'rkjxTjCtrl'
    })
    .when('/mycj/mycjLuntan', {
      templateUrl: './erp_otweb/mycj/mycj-luntan.html',
      controller: 'erp-luntan'
    })
    .when('/mycj/CJhot', { //cj-热点问题配置
      templateUrl: './erp_otweb/mycj/CJ_Hot_Issues.html',
      controller: 'CJhotCtrl'
    })
    .when('/merchandise/ProductSettings', {
      templateUrl: './static/html/manage/merchandise/ProductSettings.html',
      controller: 'ProductSettingsCtrl'
    })
    .when('/merchandise/bannerSettings', {
      templateUrl: './static/html/manage/merchandise/bannerSetting.html',
      controller: 'bannerSettingCtrl'
    })
    .when('/merchandise/activityConfig', { //活动配置列表
      templateUrl: './static/html/manage/merchandise/activityConfig.html',
      controller: 'activityConfigCtrl'
    })
    .when('/merchandise/activityEdit/:id?', { //活动配置-新增、编辑
      templateUrl: './static/html/manage/merchandise/activityEdit.html',
      controller: 'activityEditCtrl'
    })
    .when('/merchandise/activityGoodsManage', { //活动配置-商品管理
      templateUrl: './static/html/manage/merchandise/activityGoodsManage.html',
      controller: 'activityGoodsManageCtrl'
    })
    .when('/merchandise/VideoProductShelf', {
      templateUrl: './static/html/manage/merchandise/VideoProductShelf.html',
      controller: 'VideoProductShelfCtrl'
    })
    .when('/merchandise/VideoProductObtained', {
      templateUrl: './static/html/manage/merchandise/VideoProductObtained.html',
      controller: 'VideoProductObtainedCtrl'
    })
    .when('/merchandise/VideoDemand', {
      templateUrl: './static/html/manage/merchandise/VideoDemand.html',
      controller: 'VideoDemandCtrl'
    })
    .when('/merchandise/service', {
      // templateUrl:'./home.html'
      templateUrl: './static/html/manage/merchandise/merchandise-drop.html',
      controller: 'merchandiseCtrlHome'
    })
    .when('/merchandise/inquiry', {
      templateUrl: './static/html/manage/merchandise/merchandise-inquiry.html',
      controller: 'merchandiseCtrlInquiry'
    })
    .when('/merchandise/inquiry/recycle-bin', {
      templateUrl: './static/html/manage/merchandise/merchandise-inquiry.html',
      controller: 'merchandiseCtrlInquiry'
    })
    .when('/merchandise/inquiry/off-shlves', {
      templateUrl: './static/html/manage/merchandise/merchandise-inquiry.html',
      controller: 'merchandiseCtrlInquiry'
    })
    .when('/merchandise/inquiry/off-Category', {
      templateUrl: './static/html/manage/merchandise/merchandise-inquiry.html',
      controller: 'merchandiseCtrlInquiry'
    })
    .when('/merchandise/personalizeinquiry', {
      templateUrl: './static/html/manage/merchandise/merchandise-personalizeinquiry.html',
      controller: 'merchandiseCtrlPersonalizeinquiry'
    })
    .when('/merchandise/addSKU1/:id?/:cateId?/:mType/:fwType?/:userId?/:itemId?', {
      templateUrl: './static/html/manage/merchandise/merchandise-add-sku-chose-cate.html',
      controller: 'merchandiseCtrlAddSKU1'
    })
    .when('/merchandise/addSKU2/:id?/:cateId/:mType/:fwType?/:userId?/:itemId?', {
      templateUrl: './static/html/manage/merchandise/merchandise-add-sku.html',
      controller: 'merchandiseCtrlAddSKU2 as ctrl'
    })
    .when('/merchandise/show-detail/:id/:flag/:status/:type/:fuspId?/:fuspStu?/:sku?/:userId?', {
      templateUrl: './static/html/manage/merchandise/merchandise-detail-show.html',
      controller: 'merchandiseCtrlDetailShow as ctrl'
    })
    .when('/merchandise/show-detail-new/:id/:flag/:status/:type/:fuspId?/:fuspStu?/:sku?/:userId?', {// 包含商品信息分析
      templateUrl: './static/html/manage/merchandise/merchandise-detail-show-new.html',
      controller: 'merchandiseCtrlDetailShowNew as ctrl'
    })
    .when('/merchandise/show-detail-variant/:pid/:vid/:flag/:status/:type', {// 变体信息分析
      templateUrl: './static/html/manage/merchandise/merchandise-detail-show-variant.html',
      controller: 'merchandiseCtrlDetailShowVariantNew as ctrl'
    })
    .when('/merchandise/edit-detail/:id/:flag/:status/:type/:fwUserId?', {
      templateUrl: './static/html/manage/merchandise/merchandise-detail-edit.html',
      controller: 'merchandiseCtrlDetailEdit as ctrl'
    })
    .when('/merchandise/module-list/:id/:sku', {// 多语言模板列表
      templateUrl: './static/html/manage/merchandise/merchandise-module-list.html',
      controller: 'merchandiseCtrlModuleList as ctrl'
    })
    .when('/merchandise/package/:status?', { // 包装商品列表
      // templateUrl:'./home.html'
      templateUrl: './static/html/manage/merchandise/merchandise-package.html',
      controller: 'merchandisePackageCtrl'
    })
    .when('/merchandise/supplier/:status?', { // 供应商商品列表
      // templateUrl:'./home.html'
      templateUrl: './static/html/manage/merchandise/merchandise-supplier.html',
      controller: 'merchandiseSupplierCtrl'
    })
    .when('/merchandise/transInventoryRecord', { // 供应商商品列表
      // templateUrl:'./home.html'
      templateUrl: './static/html/manage/merchandise/merchandise-inventory-transfer.html',
      controller: 'merchandiseTransRecordCtrl'
    })
    .when('/merchandise/detail/:id?', { // 供应商商品列表
      // templateUrl:'./home.html'
      templateUrl: './static/html/manage/merchandise/merchandise-detail.html',
      controller: 'merchandiseDetailCtrl'
    })
    .when('/merchandise/trademark/:brand?', {
      templateUrl: './static/html/manage/merchandise/trademark.html',
      controller: 'trademarkProductsCtrl'
    })
    .when('/merchandise/customsName', { // 报关品名
	    templateUrl: './static/html/manage/merchandise/customsName.html',
	    controller: 'customsNameCtrl'
    })
    .when('/merchandise/description', {  //商品描述评分
      templateUrl: './static/html/manage/merchandise/description.html',
      controller: 'merchandiseDescriptionCtrl'
    })
    .when('/merchandise/description/detail/:commentId', {  //商品描述评分详情
      templateUrl: './static/html/manage/merchandise/descriptionDetail.html',
      controller: 'merchandiseDescriptionCtrl'
    })
    //商品分析--纠纷
    .when('/CommodityAnalysis/dispute', {
      templateUrl: './static/html/manage/CommodityAnalysis/dispute.html',
      controller: 'disputeCtrl'
    })
    //商品分析--访客
    .when('/CommodityAnalysis/Visitor', {
      templateUrl: './static/html/manage/CommodityAnalysis/Visitor.html',
      controller: 'VisitorCtrl'
    })
    //商品分析--成交额
    .when('/CommodityAnalysis/Turnover', {
      templateUrl: './static/html/manage/CommodityAnalysis/Turnover.html',
      controller: 'TurnoverCtrl'
    })
    //商品分析--关联与刊登
    .when('/CommodityAnalysis/LinkageAndPublication', {
      templateUrl: './static/html/manage/CommodityAnalysis/LinkageAndPublication.html',
      controller: 'LinkageAndPublicationCtrl'
    })
    //商品分析--活动统计
    .when('/CommodityAnalysis/activityStatistics', {
	    templateUrl: './static/html/manage/CommodityAnalysis/activityStatistics.html',
	    controller: 'activityStatisticsCtrl'
    })
    //商品分析--活动统计-2020.02.29 新增
    .when('/CommodityAnalysis/activityStatistics-new', {
	    templateUrl: './static/html/manage/CommodityAnalysis/activityStatistics-new.html',
	    controller: 'activityStatisticsNewCtrl'
    })
    //商品分析--采购
    .when('/CommodityAnalysis/Purchase', {
      templateUrl: './static/html/manage/CommodityAnalysis/Purchase.html',
      controller: 'PurchaseCtrl'
    })
    //商品分析--新品
    .when('/CommodityAnalysis/NewProduct', {
      templateUrl: './static/html/manage/CommodityAnalysis/NewProduct.html',
      controller: 'NewProductCtrl'
    })
    //商品分析--店铺
    .when('/CommodityAnalysis/cusStore', {
      templateUrl: './static/html/manage/CommodityAnalysis/store.html',
      controller: 'storeCtrl'
    })
    //商品分析--操作统计
    .when('/CommodityAnalysis/ranking', {
      templateUrl: './static/html/manage/CommodityAnalysis/ranking.html',
      controller: 'rankingCtrl'
    })
    //猜你喜欢--权重
    .when('/CommodityAnalysis/quanzhong', {
      templateUrl: './static/html/manage/CommodityAnalysis/quanzhong.html',
      controller: 'quanZhongCtrl'
    })
    //猜你喜欢--商品分值
    .when('/CommodityAnalysis/profenzhi', {
      templateUrl: './static/html/manage/CommodityAnalysis/product-fenzhi.html',
      controller: 'proFenZhiCtrl'
    })
    //猜你喜欢--客户分值
    .when('/CommodityAnalysis/customerfenzhi', {
      templateUrl: './static/html/manage/CommodityAnalysis/customer-fenzhi.html',
      controller: 'customerFenZhiCtrl'
    })
    //猜你喜欢--客户分值详情
    .when('/CommodityAnalysis/customerfzdetail/:id?', {
      templateUrl: './static/html/manage/CommodityAnalysis/customer-detail.html',
      controller: 'customerFenZhiDetailCtrl'
    })
    // .when('/order',{
    //   templateUrl:'static/html/erp-orders/customer-ord.html',
    //   controller:'customer-controller'
    // })
    .when('/custom-ord', {//客户店铺订单 母订单
      templateUrl: 'static/html/erp-orders/erp-cmu-ord.html',
      controller: 'custom-muord-controller as ctrl'
    })
    // .when('/custom-pod-ord/:stu?', {//pod 母订单
    //     templateUrl: 'static/html/mu-ord/pod-muord.html',
    //     controller: 'custom-podmuord-controller'
    // })
    // .when('/custom-podzi-ord/0', {//pod 待处理子订单
    //   templateUrl: 'static/html/zi-ord/pod-dcl-zi.html',
    //   controller: 'custom-podzidcl-controller as ctrl'
    // })
    .when('/custom-podzi-ord/1/:muId?', {//pod 待发货子订单
      templateUrl: 'static/html/zi-ord/pod-zi-two.html',
      controller: 'pod-zitwo-controller as ctrl'
    })
    // .when('/custom-podzi-ord/2', {//pod 已出库子订单
    //   templateUrl: 'static/html/zi-ord/pod-zi-three.html',
    //   controller: 'pod-zithree-controller as ctrl'
    // })
    // .when('/custom-podzi-ord/3', {//pod 已完成子订单
    //   templateUrl: 'static/html/zi-ord/pod-zi-four.html',
    //   controller: 'pod-zifour-controller as ctrl'
    // })
    // .when('/erp-czi-ord/:muId?/:muordstu?', {//客户店铺订单 子订单
    //   templateUrl: 'static/html/erp-orders/erp-czi-ord.html',
    //   controller: 'custom-ziord-controller as ctrl'
    // })
    .when('/erp-czi-ord/:muId?/:muordstu?', {//重构待处理订单
      templateUrl: 'static/html/zi-ord/zi-one.html',
      controller: 'custom-zione-controller as ctrl'
    })
    .when('/erp-zf-ord/:ordStatus?', {//直发订单
      templateUrl: 'static/html/erp-orders/erp-zf-ord.html',
      controller: 'zf-order-controller as ctrl'
    })   
    .when('/zf-interceptList', {// 直发拦截列表
      templateUrl: 'static/html/erp-orders/zf-interceptList.html',
      controller: 'zf-intercept-list as ctrl'
    })
    .when('/disputeOrder', {//纠纷订单
      templateUrl: 'static/html/erp-orders/disputeOrder.html',
      controller: 'dispute-order-contollor as ctrl'
    })
    .when('/erp-Weight-conf', {//重量待确认
      templateUrl: 'static/html/erp-orders/erp_Weight_conf.html',
      controller: 'WeightCtrl'
    })
    .when('/StatusQuery/:muId?', {//StatusQuery
      templateUrl: 'static/html/erp-orders/StatusQuery.html',
      controller: 'StatusQueryCtrl as ctrl'
    })
    .when('/chromeOrder/:orderStatus?', {//chrome插件订单
      templateUrl: 'static/html/erp-orders/chromeOrder.html',
      controller: 'chromeOrderCtrl'
    })
    .when('/erp-stock-ord/:ordStatus?', {//私有库存订单
      templateUrl: 'static/html/erp-orders/erp-stock-ord.html',
      controller: 'stock-order-controller'
    })
    //视频订单
    .when('/VideoOrderPaid', {
      templateUrl: 'static/html/erp-orders/VideoOrderPaid.html',
      controller: 'VideoOrderPaidCtrl'
    })
    .when('/VideoOrderUnPaid', {
      templateUrl: 'static/html/erp-orders/VideoOrderUnPaid.html',
      controller: 'VideoOrderUnPaidCtrl'
    })
    .when('/VideoOrderCompleted', {
      templateUrl: 'static/html/erp-orders/VideoOrderCompleted.html',
      controller: 'VideoOrderCompletedCtrl'
    })

      //母订单
      .when('/mu-clz', {
        templateUrl: 'static/html/mu-ord/mu-chulizhong.html',
        controller: 'custom-muclz-controller as ctrl',
      })
      .when('/mu-one', {
        templateUrl: 'static/html/mu-ord/mu-one.html',
        controller: 'custom-muone-controller as ctrl',
      })
      .when('/mu-fone', {
        templateUrl: 'static/html/mu-ord/mu-fone.html',
        controller: 'custom-mufone-controller as ctrl',
      })
      .when('/mu-two', {
        templateUrl: 'static/html/mu-ord/mu-two.html',
        controller: 'custom-mutwo-controller as ctrl',
      })
      .when('/mu-three', {
        templateUrl: 'static/html/mu-ord/mu-three.html',
        controller: 'custom-muthree-controller as ctrl',
      })
      .when('/mu-four', {
        templateUrl: 'static/html/mu-ord/mu-four.html',
        controller: 'custom-mufour-controller as ctrl',
      })
      .when('/zi-one/:muId?', {
        //重构待处理订单
        templateUrl: 'static/html/zi-ord/zi-one.html',
        controller: 'custom-zione-controller as ctrl',
      })
      // 采购缺货订单数
      .when('/out-of-stock', {
        templateUrl: 'static/html/out-of-stock/out-of-stock.html',
        controller: 'out-of-stock-controller as ctrl',
      })
      // 采购SKU缺货订单
      .when('/out-of-stock/orders', {
        templateUrl: 'static/html/out-of-stock/orders.html',
        controller: 'out-of-stock-orders-controller as ctrl', // ctrl = controller；html 里涉及到使用
      })
      // 采购SKU缺货客户
      .when('/out-of-stock/customs', {
        templateUrl: 'static/html/out-of-stock/customs.html',
        controller: 'out-of-stock-customs-controller as ctrl',
      })
      // 代发货订单
      .when('/zi-two/:muId?', {
        templateUrl: 'static/html/zi-ord/zi-two-new.html',
        controller: 'custom-newzitwo-controller as ctrl',
      })
      //子订单
      /* .when('/zi-two/:muId?', {
          templateUrl: 'static/html/zi-ord/zi-two.html',
          controller: 'custom-zitwo-controller as ctrl'
        }) */
      //拦截订单
      .when('/zi-lanjie/:stu?', {
        templateUrl: 'static/html/zi-ord/lan-jie.html',
        controller: 'custom-lanjie-controller as ctrl',
      })
      // 拦截列表
      .when('/zi-interceptList', {
        templateUrl: 'static/html/zi-ord/zi-interceptList.html',
        controller: 'intercept-list as ctrl',
      })
      .when('/zi-print', {
        templateUrl: 'static/html/zi-ord/print.html',
        controller: 'custom-print-controller as ctrl',
      })
      .when('/zi-three/:muId?', {
        templateUrl: 'static/html/zi-ord/zi-three.html',
        controller: 'custom-zithree-controller as ctrl',
      })
      .when('/zi-four/:muId?', {
        templateUrl: 'static/html/zi-ord/zi-four.html',
        controller: 'custom-zifour-controller as ctrl',
      })
      .when('/zi-five/:muId?', {
        templateUrl: 'static/html/zi-ord/zi-five.html',
        controller: 'custom-zifive-controller as ctrl',
      })
      // 履行列表
      .when('/zi-fulfil', {
        templateUrl: 'static/html/zi-ord/zi-fulfil.html',
        controller: 'custom-zifulfil-controller as ctrl',
      })
      .when('/zi-all/:muId?/:pici?', {
        templateUrl: 'static/html/zi-ord/zi-all.html',
        controller: 'custom-ziall-controller as ctrl',
      })
      .when('/zi-diaodu', {
        templateUrl: 'static/html/zi-ord/zi-diaodu.html',
        controller: 'custom-zidiaodu-controller as ctrl',
      })
      .when('/zxd', {
        //装箱单
        templateUrl: 'static/html/zi-ord/zxd.html',
        controller: 'zxd-controller',
      })
      .when('/bgmescx', {
        //包裹信息查询
        templateUrl: 'static/html/zi-ord/bgcx.html',
        controller: 'bgcx-controller',
      })
      .when('/pandian', {
        //商品盘点
        templateUrl: 'static/html/mycj/pandian.html',
        controller: 'pandian-controller',
      })
      .when('/StockStatistics', {
        //缺货商品统计
        templateUrl: 'static/html/zi-ord/StockStatistics.html',
        controller: 'StockStatisticscontroller',
      })
      .when('/stranded-order-query', {
        //滞留订单查询
        templateUrl: 'static/html/zi-ord/stranded-order-query.html',
        controller: 'stranded-order-query-controller',
      })
      .when('/excel-ord', {
        //excel订单总览
        templateUrl: 'static/html/erp-orders/erp-eall-ord.html',
        controller: 'excel-all-ctroller',
      })
      .when('/ecl-ord', {
        //excel 处理订单
        templateUrl: 'static/html/erp-orders/erp-ecl-ord.html',
        controller: 'excel-cl-ctroller',
      })
      .when('/supplier-gys', {
        templateUrl: './erp_otweb/erpsupplier/gys-list.html',
        controller: 'supplier-gys-manage',
      })
      .when('/supplier-gys/detail/:id?', {
        templateUrl: './erp_otweb/erpsupplier/gys-detail.html',
        controller: 'supplier-gys-detail',
      })
      .when('/supplier-manage/:orderStu?', {
        templateUrl: './erp_otweb/erpsupplier/supplier-manage.html',
        controller: 'supplier-manage',
      })
      .when('/edit-supplier', {
        templateUrl: './erp_otweb/erpsupplier/edit-supplier.html',
        controller: 'edit-supplier',
      })

	    // 搜品新做
	    .when('/newSourcing/:sourceStatus?', {
		    templateUrl: 'static/html/sourcing/sourcing.html',
		    controller: 'sourcingAllCtrl'
	    })

      .when('/sourcing', {//erp store搜品
        templateUrl: 'static/html/erp-sourcing/erp-sourcing.html',
        controller: 'estoresourcing-controller as ctrl'
      })
      .when('/sourcing/:tabstu?', {//erp store搜品
        templateUrl: 'static/html/erp-sourcing/erp-sourcing.html',
        controller: 'estoresourcing-controller as ctrl'
      })
      .when('/cumsourcing/:tabstu?', {//游客搜品
        templateUrl: 'static/html/erp-sourcing/erp-cumsourcing.html',
        controller: 'cumsourcing-controller as ctrl'
      })

    .when('/individualsourcing', {//erp individual搜品
      templateUrl: 'static/html/erp-sourcing/erp-individualsourcing.html',
      controller: 'eindividualsourcing-controller as ctrl'
    })
    .when('/individualsourcing/:indivStu?', {//erp individual搜品
      templateUrl: 'static/html/erp-sourcing/erp-individualsourcing.html',
      controller: 'eindividualsourcing-controller as ctrl'
    })
    .when('/cjsourcing', {//erp cj搜品
      templateUrl: 'static/html/erp-sourcing/erp-cjsourcing.html',
      controller: 'ecjsourcing-controller as ctrl'
    })
    .when('/cjsourcing/:cjStu?', {//erp cj搜品
      templateUrl: 'static/html/erp-sourcing/erp-cjsourcing.html',
      controller: 'ecjsourcing-controller as ctrl'
    })
    .when('/supplierSourcing', {//erp 供应商cj搜品
      templateUrl: 'static/html/erp-sourcing/erp-supplierSourcing.html',
      controller: 'supplierSourcing-controller'
    })
    .when('/supplierSourcing/:status', {//erp 供应商cj搜品
      templateUrl: 'static/html/erp-sourcing/erp-supplierSourcing.html',
      controller: 'supplierSourcing-controller'
    })
    .when('/distRecord', {//erp 供应商cj搜品
      templateUrl: 'static/html/erp-sourcing/erp-distRecord.html',
      controller: 'distRecord-controller'
    })
    .when('/sourceRecycle', {//erp 供应商cj搜品
      templateUrl: 'static/html/erp-sourcing/erp-supplierSourceRecycle.html',
      controller: 'sourceRecycle-controller'
    })
    .when('/sourcing-detail/:id/:sourcetype', {//erp 搜品详情
      templateUrl: 'static/html/erp-sourcing/erp-sourcedetail.html',
      controller: 'erp-searchd-control'
    })
    .when('/erppurchase/order/:stu?/:new?', {//采购订单
      templateUrl: 'erp_otweb/erppurchase/purchase-order.html',
      controller: 'purchaseOrdCtrl as ctrl'
    })
    .when('/purchase/order/abnormal', {//签收异常
      templateUrl: 'erp_otweb/receipt/abnormal-receipt.html',
      controller: 'abnormalReceiptCtrl'
    })
    .when('/erppurchase/management', {//签收异常
      templateUrl: 'erp_otweb/erppurchase/management.html',//erp_otweb\erppurchase\management.html
      controller: 'warehouseManagementCtrl'
    })
    .when('/erppurchase/needbuy', {  //erp采购  出单需采购 外包页面从这里开始插入
      templateUrl: 'erp_otweb/erppurchase/needbuy.html',
      controller: 'needbuyCtrl'// 此页面貌似无法使用
    })
    .when('/erppurchase/needbuycgd', {  //erp采购  出单需采购 导入导出数据
      templateUrl: 'erp_otweb/erppurchase/cgd-list.html',
      controller: 'needbuyCgdCtrl'
    })
    .when('/erppurchase/purhistory', {  //erp采购历史
      templateUrl: 'erp_otweb/erppurchase/purch-history.html',
      controller: 'purchaseHistoryCtrl'
    })
    .when('/erppurchase/purhistorydetail/:ghgsName?', {  //erp采购历史详情
      templateUrl: 'erp_otweb/erppurchase/purch-history-detail.html',
      controller: 'purchaseHistoryDetailCtrl'
    })
    .when('/erppurchase/cjcg', {  //erp采购  初级采购
      templateUrl: 'erp_otweb/erppurchase/chujicaigou.html',
      controller: 'cujicaigouCtrl'
    })
    .when('/mycj/fbjl', {  //分标记录
      templateUrl: 'erp_otweb/erpwarehouse/fenbiao.html',
      controller: 'fenBiaoCtrl'
    })
    .when('/erppurchase/cgdlist', {  //erp采购 采购单列表
      templateUrl: 'erp_otweb/erppurchase/cgdlist.html',
      controller: 'cgdlistCtrl'
    })
    .when('/erppurchase/arrivalabnormal', {  //erp采购_到货异常
      templateUrl: 'erp_otweb/erppurchase/arrivalabnormal.html',
      controller: 'arrivalabnormalCtrl'
    })
    .when('/erppurchase/financial', {  //erp采购_到货异常
      templateUrl: 'erp_otweb/erppurchase/Financial.html',
      controller: 'financialCtrl'
    })
    .when('/erppurchase/purchaseinventory', {  //erp采购库存
      templateUrl: 'erp_otweb/erppurchase/purchaseinventory.html',
      controller: 'purchaseinventoryCtrl'
    })
    .when('/erppurchase/addpurchase', {  //erp添加采购单
      templateUrl: 'erp_otweb/erppurchase/addpurchase.html',
      controller: 'addpurchaseCtrl'
    })
    .when('/erppurchase/purchaseover', {  //erp采购完成
      templateUrl: 'erp_otweb/erppurchase/purchaseover.html',
      controller: 'purchaseoverCtrl'
    })
    .when('/erppurchase/purchasebed', {  //erp采购失败
      templateUrl: 'erp_otweb/erppurchase/purchasebed.html',
      controller: 'purchasebedCtrl'
    })
    .when('/erppurchase/backmoney', {  //erp退货/退款
      templateUrl: 'erp_otweb/erppurchase/backmoney.html',
      controller: 'backmoneyCtrl'
    })
    // --> 采购新增
    .when('/erppurchase/purchase_old', {  //erp采购  出单需采购 外包页面从这里开始插入 之前的修改
      templateUrl: 'erp_otweb/erppurchase/purchase_order.html',
      controller: 'purchaseOrderCtrl'
    })
    .when('/erppurchase/purchase_order', {  //erp采购  出单需采购 外包页面从这里开始插入 12-26 1/3 提交 第一版 删除冗余代码
      templateUrl: 'erp_otweb/erppurchase/purchase_new.html',
      controller: 'purchaseCtrl'
    })
    .when('/erppurchase/batch_payment', {  //erp采购  出单需采购 外包页面从这里开始插入 12-26 1/3 提交 第一版 删除冗余代码
      templateUrl: 'erp_otweb/erppurchase/batch_payment.html',
      controller: 'batchPaymentCtrl'
    })
    .when('/erppurchase/online', {  //erp采购  线上采购 (tamll taobao not1688api)
      templateUrl: 'erp_otweb/erppurchase/new_online.html',
      controller: 'newOnlineCtrl'
    })
    .when('/erppurchase/1688api', {  //erp采购  线上采购 (tamll taobao not1688api)
      templateUrl: 'erp_otweb/erppurchase/new_1688api.html',
      controller: 'new1688ApiCtrl'
    })
    .when('/erppurchase/offline', {  //erp采购  线下采购
      templateUrl: 'erp_otweb/erppurchase/new_offline.html',
      controller: 'newOfflineCtrl'
    })
    .when('/erppurchase/confirm/:stu?', {  //erp采购  待确认
      templateUrl: 'erp_otweb/erppurchase/new_confim.html',
      controller: 'newToBeConfirmCtrl'
    })
    .when('/erppurchase/paying/:type?', {  //erp采购  待付款
      templateUrl: 'erp_otweb/erppurchase/new_paying.html',
      controller: 'newPayingCtrl'
    })
    .when('/erppurchase/paying-submit/:onlineType/:orderId', {  //erp采购  已付款
      templateUrl: 'erp_otweb/erppurchase/new_paying_for.html',
      controller: 'newPayingSubmitCtrl'
    })
    .when('/erppurchase/payed/:type?', {  //erp采购  已付款
      templateUrl: 'erp_otweb/erppurchase/new_payed.html',
      controller: 'newPayedCtrl'
    })
    .when('/erppurchase/all', {  //erp采购  全部采购查询列表
      templateUrl: 'erp_otweb/erppurchase/new_all.html',
      controller: 'allPurchaseCtrl'
    })
    .when('/erppurchase/weight-change-log', {
      templateUrl: 'erp_otweb/erppurchase/weight-change-log.html',
      controller: 'weightChangeLogCtrl'
    })
    // <-- 采购新增
    // -- > 采购异常
    .when('/erppurchase/error/refuse_to_pay', {//异常拒绝打款
      templateUrl: 'erp_otweb/erppurchase/error/refuse.html',
      controller: 'errRefuseToPayCtrl'
    })
    .when('/erppurchase/error/refund', {//异常退款
      templateUrl: 'erp_otweb/erppurchase/error/refund.html',
      controller: 'errRefundCtrl'
    })
    // < --  采购异常
    // <-- 采购下新增
    // -- > 盘点缺货记录
    .when('/erppurchase/stockout-log/:state?', {
      templateUrl: 'erp_otweb/erppurchase/stockout-log.html',
      controller: 'stockoutLogCtrl'
    })
    // < --  盘点缺货记录
    .when('/erpwarehouse/erpdepotIn/:stu?', {  //erp入库
      templateUrl: 'erp_otweb/erpwarehouse/erp_depotIn.html',
      controller: 'erpdepotInCtrl'
    })
    .when('/erpwarehouse/erpdepotkucun', {  //erp库存
      templateUrl: 'erp_otweb/erpwarehouse/erp_depot_kucun.html',
      controller: 'erpdepotkucunCtrl'
    })
    .when('/erpwarehouse/erpdepotOut', {  //erp出库
      templateUrl: 'erp_otweb/erpwarehouse/erp_depotOut.html',
      controller: 'erpdepotOutCtrl'
    })
    .when('/erpwarehouse/picihao/:stu?', {  //批次号
      templateUrl: 'erp_otweb/erpwarehouse/pici.html',
      controller: 'piciCtrl'
    })
    // .when('/erpwarehouse/privateruku',{  //erp私有库存
    //     templateUrl:'erp_otweb/erpwarehouse/privateware.html',
    //     controller:'privatewareCtrl'
    // })
    .when('/erpwarehouse/privatekucun', {  //erp私有库存
      templateUrl: 'erp_otweb/erpwarehouse/privateware.html',
      controller: 'privatewareCtrl'
    })
    .when('/erpwarehouse/warelist', {  //仓库列表
      templateUrl: 'erp_otweb/erpwarehouse/warelist.html',
      controller: 'warelistCtrl'
    })
    .when('/erpwarehouse/wareset', {  //仓库配置
      templateUrl: 'erp_otweb/erpwarehouse/wareset.html',
      controller: 'waresetCtrl'
    })
    
    .when('/erpwarehouse/arealist', { //区域列表
      templateUrl: 'erp_otweb/erpwarehouse/arealist.html',
      controller: 'arealistCtrl'
    })
    .when('/erpwarehouse/areacountrylist', { //区域国家列表
      templateUrl: 'erp_otweb/erpwarehouse/areacountrylist.html',
      controller: 'areacountrylistCtrl'
    })
    .when('/erpwarehouse/waredetail/:id', {  //erp私有库存
      templateUrl: 'erp_otweb/erpwarehouse/waredetail.html',
      controller: 'waredetailCtrl'
    })
    .when('/erpwarehouse/warestock', {  //erp私有库存
      templateUrl: 'erp_otweb/erpwarehouse/warestock.html',
      controller: 'warestockCtrl'
    })
    .when('/erpwarehouse/warelinkcate', {  //erp私有库存
      templateUrl: 'erp_otweb/erpwarehouse/warelinkcate.html',
      controller: 'warelinkcateCtrl'
    })
    .when('/erpwarehouse/qycdsz', {  //设置区域长度
      templateUrl: 'erp_otweb/erpwarehouse/szqycd.html',
      controller: 'qycdszCtrl'
    })
    .when('/erpwarehouse/xiaJiaKuCun', {  //下架sku库存
      templateUrl: 'erp_otweb/erpwarehouse/xiaJiaKuCun.html',
      controller: 'xiaJiaKuCunCtrl'
    })
    .when('/merchandise/repeatSku', {  //重复sku
      templateUrl: 'static/html/manage/merchandise/repeat-merchandis.html',
      controller: 'merchandiseRepeatCtrl'
    })
    // .when('/erpwarehouse/privatechuku',{  //erp私有库存
    //     templateUrl:'erp_otweb/erpwarehouse/privateware.html',
    //     controller:'privatewareCtrl'
    // })
    .when('/erpwarehouse/NoScheduled/:pelname?', {  //erp未添加调度任务
      templateUrl: 'erp_otweb/erpwarehouse/NoScheduled.html',
      controller: 'NoScheduledCtrl'
    })
    .when('/erpwarehouse/addPackage/:DDid?/:BGid?/:bgName?/:type?/:diQu?', {  //新增包裹
      templateUrl: 'erp_otweb/erpwarehouse/addPackage.html',
      controller: 'addPackageCtrl'
    })
    .when('/erpwarehouse/ScheduledAdd/:pelname?', {  //erp已添加调度任务
      templateUrl: 'erp_otweb/erpwarehouse/ScheduledAdd.html',
      controller: 'ScheduledAddCtrl'
    })
    .when('/erpwarehouse/ScheduledCompleted/:pelname?', {  //erp已完成调度任务
      templateUrl: 'erp_otweb/erpwarehouse/ScheduledCompleted.html',
	    controller: 'ScheduledCompletedCtrl'
    })
    .when('/preScheduling/isConfirmation', {  // 预调度 - 待确认
	    templateUrl: 'static/html/preScheduling/isConfirmation.html',
	    controller: 'isConfirmationCtrl'
    })
    .when('/preScheduling/confirmed', {  // 预调度 - 待确认
	    templateUrl: 'static/html/preScheduling/confirmed.html',
	    controller: 'confirmedCtrl'
    })
    .when('/preScheduling/addOrDetail/:type?/:id?', {  // 预调度 - 添加 / 查看详情
	    templateUrl: 'static/html/preScheduling/addOrDetail.html',
	    controller: 'addOrDetailCtrl'
    })
    .when('/erpwarehouse/NotShipped', {  //未发货
      templateUrl: 'erp_otweb/erpwarehouse/NotShipped.html',
      controller: 'NotShippedCtrl'
    })
    .when('/erpwarehouse/InDelivery', {  //发货中
      templateUrl: 'erp_otweb/erpwarehouse/InDelivery.html',
      controller: 'InDeliveryCtrl'
    })
    .when('/erplogistics/qswpp', {  //发货中
      templateUrl: 'erp_otweb/erpwarehouse/dd-qs.html',
      controller: 'qianshou-controller'
    })
    .when('/erpwarehouse/Received', {  //已收货
      templateUrl: 'erp_otweb/erpwarehouse/Received.html',
      controller: 'ReceivedCtrl'
    })
    .when('/erpwarehouse/Completed', {  //已完成
      templateUrl: 'erp_otweb/erpwarehouse/Completed.html',
      controller: 'CompletedCtrl'
    })
    // 滞留库存 wjw [19-03-28]
    .when('/erpwarehouse/retention-order', {
      templateUrl: 'static/html/erp-orders/retention-order.html',
      controller: 'retention-order'
    })
    .when('/erplogistics/logsearch', {  //erp物流
      templateUrl: 'erp_otweb/erplogistics/erp_logistics_channel_setmoney.html',
      controller: 'setmoneyCtrl'
    })
    .when('/erplogistics/waybillsearch', {  //erp运单查询
      templateUrl: 'erp_otweb/erplogistics/erp_logistics_channel_search.html',
      controller: 'waybillsearchCtrl'
    })
    .when('/erplogistics/setmoney', {  //erp物流运费设置
      templateUrl: 'erp_otweb/erplogistics/erp_logistics_channel_setmoney.html',
      controller: 'setmoneyCtrl'
    })
    .when('/erplogistics/channelset', {  //erp渠道设置
      templateUrl: 'erp_otweb/erplogistics/erp_logistics_channel_channelset.html',
      controller: 'channelset'
    })
    .when('/erplogistics/coopcompany', {  //erp物流公司管理
      templateUrl: 'erp_otweb/erplogistics/erp_logistics_channel_coopcompany.html',
      controller: 'coopcompanyCtrl'
    })
    .when('/erplogistics/channelsetStyle', {  //erp物流方式管理
      templateUrl: 'erp_otweb/erplogistics/erp_logistics_channel_channelsetStyle.html',
      controller: 'channelsetStyleCtrl'
    })
    .when('/erplogistics/trackstatistics', {  //erp追踪物流公司统计
      templateUrl: 'erp_otweb/erplogistics/erp_logistics_trackstatistics.html',
      controller: 'trackstatisticsCtrl'
    })
    .when('/erplogistics/finance', {  //erp物流财务
      templateUrl: 'erp_otweb/erplogistics/erp_logistics_finance.html',
      controller: 'finance'
    })
    .when('/erplogistics/proplempackage', {  //问题包裹
      templateUrl: 'erp_otweb/erplogistics/problem-package.html',
      controller: 'problemPackageCtrl'
    })
    .when('/erplogistics/pointsmall', {  //积分商城
      templateUrl: 'erp_otweb/erplogistics/points_mall.html',
      controller: 'pointsmallCtrl'
    })
    .when('/erplogistics/abnormalface', {  //异常面单 Abnormal face
      templateUrl: 'erp_otweb/erplogistics/abnormal-face.html',
      controller: 'abnormalfaceCtrl'
    })
    .when('/erplogistics/logististylel', {  //erp物流方式统计
      templateUrl: 'erp_otweb/erplogistics/logististylel.html',
      controller: 'logististylelCtrl'
    })
    .when('/erplogistics/freighttrial', {  //erp运费试算
      templateUrl: 'erp_otweb/erplogistics/erp_logistics_charging.html',
      controller: 'logisticsfreighttrialCtrl'
    })
    .when('/erplogistics/cslogisti', {  //erp客户物流统计
      templateUrl: 'erp_otweb/erplogistics/cslogisti.html',
      controller: 'cslogistiCtrl'
    })
    .when('/erplogistics/forwarding', {  //erp货代
      templateUrl: 'erp_otweb/erplogistics/erp_forwarding.html',
      controller: 'forwardingCtrl'
    })
    .when('/erplogistics/dppstu', {  //erp待匹配
      templateUrl: 'erp_otweb/erplogistics/erp-dppstu.html',
      controller: 'dpphdCtrl'
    })
    .when('/erplogistics/SpotCheck', {  //erp抽查记录
      templateUrl: 'erp_otweb/erplogistics/erp_SpotCheck.html',
      controller: 'SpotCheckCtrl'
    })
    .when('/erplogistics/chuku-statistics', {  //erp 出库统计
      templateUrl: 'erp_otweb/erplogistics/chuku-statistics.html',
      controller: 'chuku-statistics'
    })
    .when('/erplogistics/ReturnRecords', {  //erp退件记录 未妥投
      templateUrl: 'erp_otweb/erplogistics/erp_ReturnRecords.html',
      controller: 'ReturnRecordsCtrl'
    })
    .when('/erplogistics/yttrecord', {  //erp退件记录 已妥投
      templateUrl: 'erp_otweb/erplogistics/erp_returnrecord_ytt.html',
      controller: 'ReturnRecordsyttCtrl'
    })
    .when('/erplogistics/yttdetailrecord/:userid?/:trackNum?', {  //erp退件记录 已妥投的客户详情
      templateUrl: 'erp_otweb/erplogistics/erp_returnrecord_yttdetail.html',
      controller: 'ReturnRecordsyttdetailCtrl'
    })
    .when('/erplogistics/gnrecord', {  //erp退件记录 国内退件
      templateUrl: 'erp_otweb/erplogistics/erp_returnrecord_gntj.html',
      controller: 'ReturnRecordsgntjCtrl'
    })
    // 僵尸订单 wjw [19-03-25]
    .when('/erplogistics/zombie-order', {
      templateUrl: 'static/html/erp-orders/zombie-order.html',
      controller: 'zombie-order'
    })
    .when('/erpcustomer/ruzhucusList', {//入住客户列表
      templateUrl: './static/html/ruzhu-cus/ruzhucus-list.html',
      controller: 'ruZhuCusListCtrl'
    })
    .when('/erpcustomer/ruzhucusList/detail', {//入住客户列表详情
      templateUrl: './static/html/ruzhu-cus/ruzhulist-detail.html',
      controller: 'ruZhuCusListDetailCtrl'
    })
    .when('/erpcustomer/ruzhucuschecklist', {//入住客户审核列表
      templateUrl: './static/html/ruzhu-cus/ruzhucus-check.html',
      controller: 'ruZhuCusListCheckCtrl'
    })
    .when('/erpcustomer/ruzhucuswtglist', {//入住客户审核未通过列表
      templateUrl: './static/html/ruzhu-cus/ruzhucus-wtg.html',
      controller: 'ruZhuCusListWtgCtrl'
    })
    .when('/erpcustomer/ruzhubgysList', {//入住客户包裹请求
      templateUrl: './static/html/ruzhu-cus/rzcus-baoguo.html',
      controller: 'ruZhuCusBaoGuoQqCtrl'
    })
    .when('/erpcustomer/ruzhubgzhifuList', {//入住客户包裹支付
      templateUrl: './static/html/ruzhu-cus/ruzhubg-zhifu.html',
      controller: 'ruZhuCusBaoGuoZhiFuCtrl'
    })
    .when('/erpcustomer/gysbgdqs', {//入住客户包裹签收
      templateUrl: './static/html/ruzhu-cus/gys-qianshou.html',
      controller: 'ruZhuCusBaoGuoDqsCtrl'
    })
    .when('/erpcustomer/gysbgyqs', {//入住客户包裹签收
      templateUrl: './static/html/ruzhu-cus/gys-qianshou.html',
      controller: 'ruZhuCusBaoGuoDqsCtrl'
    })
    .when('/erpcustomer/gysbgycqs', {//入住客户包裹异常签收
      templateUrl: './static/html/ruzhu-cus/gys-ycqianshou.html',
      controller: 'ruZhuCusBaoGuoDqsCtrl'
    })
    .when('/erpcustomer/shoplist', {  //erp客户--店铺列表
      templateUrl: 'erp_otweb/erpcustomer/erp-shoplist.html',
      controller: 'shoplistCtrl'
    })
    .when('/erpcustomer/KeHuLieBiao/:type?', {  //erp客户--客户列表 无值=cj客户 2=cod客户
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_KeHuLieBiao.html',
      controller: 'KeHuLieBiaoCtrl'
    })
    .when('/erpcustomer/fpkh', {  //erp客户需审核
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_fpkh.html',
      controller: 'fpkhCtrl'
    })
    .when('/erpcustomer/xushenhe/:type?', {  //erp客户需审核 无值=cj客户 2=cod客户
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_XunShenHe.html',
      controller: 'xushenheCtrl'
    })
    //xiaoy -- 2019-6-25 推送功能
    .when('/erpcustomer/pushtable', {
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_push_table.html',
      controller: 'pushTableCtrl'
    })
    .when('/erpcustomer/pushnew', {
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_push_new.html',
      controller: 'pushNewCtrl'
    })
    .when('/erpcustomer/pushdetail', {
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_push_detail.html',
      controller: 'pushDetailCtrl'
    })
    /*业务员管理*/
    .when('/SalesmanManagement/DataStatistics', {  //数据统计
      templateUrl: 'erp_otweb/SalesmanManagement/DataStatistics.html',
      controller: 'DataStatisticsCtrl'
    })
    .when('/SalesmanManagement/OrderTracking', {  //订单查询
      templateUrl: 'erp_otweb/SalesmanManagement/OrderTracking.html',
      controller: 'OrderTrackingCtrl'
    })
    .when('/SalesmanManagement/SalesmanSetting', {  //业务员设置
      templateUrl: 'erp_otweb/SalesmanManagement/SalesmanSetting.html',
      controller: 'SalesmanSettingCtrl'
    })

    .when('/erpcustomer/shenhenopass/:type?', {  //erp客户未通过 无值=cj客户 2=cod客户
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_ShenHeNoPass.html',
      controller: 'shenhenopassCtrl'
    })
    .when('/erpcustomer/heimingdan', {  //erp客户黑名单
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_HeiMingDan.html',
      controller: 'heimingdanCtrl'
    })
    .when('/erpcustomer/erpshop', {  //erp客户店铺跳转
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_shop.html',
      controller: 'erpshopCtrl'
    })
    .when('/erpcustomer/customer-detail/:custId/:status', {  //erp客户详情
      templateUrl: 'erp_otweb/erpcustomer/customer-detail.html',
      controller: 'customerdetailCtrl as ctrl'
    })
    .when('/erpcustomer/exhibition', {  //erp客户黑名单
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_exhibition.html',
      controller: 'customerExhibitionCtrl'
    })
    .when('/erpcustomer/Affiliate', {  //erp客户分销
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_Affiliate.html',
      controller: 'customerAffiliateCtrl'
    })
    .when('/erpcustomer/review', {  //erp需审核
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_review.html',
      controller: 'customerreviewCtrl'
    })
    .when('/erpcustomer/unpass', {  //erp审核未通过
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_unpass.html',
      controller: 'customerunpassCtrl'
    })
    .when('/erpcustomer/blacklist', {  //erp黑名单
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_blacklist.html',
      controller: 'customerblacklistCtrl'
    })
    .when('/erpcustomer/yongjin', {  //erp客户佣金管理
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_yongjin.html',
      controller: 'customeryongjinCtrl'
    })
    .when('/erpcustomer/FAQ', {  //erpFAQ
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_FAQ.html',
      controller: 'customerFAQCtrl'
    })
    .when('/erpcustomer/GH', {  //erp客户公海
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_GH.html',
      controller: 'customerGHCtrl'
    })
    .when('/ResidentMerchant/ActivityConsultation', {  //erp入驻商户(活动咨询)
      templateUrl: 'erp_otweb/ResidentMerchant/ActivityConsultation.html',
      controller: 'ActivityConsultationCtrl'
    })
    .when('/ResidentMerchant/PostNewInformation', {  //erp入驻商户(新增活动咨询)
      templateUrl: 'erp_otweb/ResidentMerchant/PostNewInformation.html',
      controller: 'PostNewInformationCtrl'
    })
    .when('/ResidentMerchant/CommissionDetails', {  //erp入驻商户(佣金明细)
      templateUrl: 'erp_otweb/ResidentMerchant/CommissionDetails.html',
      controller: 'CommissionDetailsCtrl'
    })
    .when('/ResidentMerchant/FinancialStatistics', {  //erp入驻商户(财务统计)
      templateUrl: 'erp_otweb/ResidentMerchant/FinancialStatistics.html',
      controller: 'FinancialStatisticsCtrl'
    })
    .when('/ResidentMerchant/WithdrawalApplication', {  //erp入驻商户(提现)
      templateUrl: 'erp_otweb/ResidentMerchant/WithdrawalApplication.html',
      controller: 'WithdrawalApplicationCtrl'
    })
    .when('/ResidentMerchant/FreightReview', {  //erp入驻商户(充值管理)
      templateUrl: 'erp_otweb/ResidentMerchant/FreightReview.html',
      controller: 'FreightReviewCtrl'
    })
    .when('/ResidentMerchant/RechargeManagement', {  //erp入驻商户(运费审核)
      templateUrl: 'erp_otweb/ResidentMerchant/RechargeManagement.html',
      controller:  'RechargeManagementCtrl'
    })
    .when('/ResidentMerchant/CustomerList', {  //erp入驻商户(客户列表)
      templateUrl: 'erp_otweb/ResidentMerchant/CustomerList.html',
      controller: 'CustomerListCtrl'
    })
    .when('/ResidentMerchant/ExchangeRate', {  //erp入驻商户(汇率设置)
      templateUrl: 'erp_otweb/ResidentMerchant/ExchangeRate.html',
      controller: 'ExchangeRateCtrl'
    })
    .when('/ResidentMerchant/PackageBuy', {  //erp入驻商户(套餐购买)
      templateUrl: 'erp_otweb/ResidentMerchant/PackageBuy.html',
      controller: 'PackageBuyCtrl'
    })
    .when('/ResidentMerchant/PackageTrial', {  //erp入驻商户(套餐购买)
      templateUrl: 'erp_otweb/ResidentMerchant/TrialApplication.html',
      controller: 'PackageTrialCtrl'
    })
    .when('/Reconciliation/BillCollection', {  //COD(代收费用)
      templateUrl: 'erp_otweb/Reconciliation/BillCollection.html',
      controller: 'BillCollectionCtrl'
    })
    .when('/Reconciliation/BillCollectionList', {  //COD(代收费用明细)
      templateUrl: 'erp_otweb/Reconciliation/BillCollectionList.html',
      controller: 'BillCollectionListCtrl'
    })
    .when('/Reconciliation/BillCollectionAccount', {  //COD(代收费用对账单)
      templateUrl: 'erp_otweb/Reconciliation/BillCollectionAccount.html',
      controller: 'BillCollectionAccountCtrl'
    })

    .when('/Reconciliation/logisticsCosts', {  //COD(物流对账单) 物流费用
	    templateUrl: 'erp_otweb/Reconciliation/logisticsCosts.html',
	    controller: 'logisticsCostsCtrl'
    })
    .when('/Reconciliation/logisticsStatement', {  //COD(物流对账单) 物流对账单列表
	    templateUrl: 'erp_otweb/Reconciliation/logisticsStatement.html',
	    controller: 'logisticsStatementCtrl'
    })
    .when('/Reconciliation/logisticsStatementDetails/:batchNumber?/:logisticsCompany?/:statementName?/:status?', {  //COD(物流对账单) 物流对账单明细
	    templateUrl: 'erp_otweb/Reconciliation/logisticsStatementDetails.html',
	    controller: 'logisticsStatementDetailsCtrl'
    })
    .when('/reconciliation/detail/:id?', {      //COD(详情)
      templateUrl: 'erp_otweb/Reconciliation/reconciliation-detail.html',
      controller: 'ReconciliationDetailCtrl'
    })
    .when('/reconciliation/codRemit/waybillRemit', {  //erp财务-cod-物流打款单
      templateUrl: 'erp_otweb/Reconciliation/cod_waybillRemit.html',
      controller: 'CodWaybillRemitCtrl'
    })
    .when('/reconciliation/codRemit/businessAmount', {  //erp财务-cod-代收费用打款单
      templateUrl: 'erp_otweb/Reconciliation/cod_businessAmount.html',
      controller: 'CodBusinessAmountCtrl'
    })
    .when('/ResidentMerchant/StoreManagement', {  //erp入驻商户(黑名单)
      templateUrl: 'erp_otweb/ResidentMerchant/StoreManagement.html',
      controller: 'StoreManagementCtrl'
    })
    .when('/ResidentMerchant/BlackList', {  //erp入驻商户(店铺管理)
      templateUrl: 'erp_otweb/ResidentMerchant/blackList.html',
      controller: 'BlackListCtrl'
    })
    .when('/ResidentMerchant/packageManagement', {  //erp入驻商户(套餐管理)
      templateUrl: 'erp_otweb/ResidentMerchant/packageManagement.html',
      controller: 'packageListCtrl'
    })
    .when('/ResidentMerchant/packageControl', {
      templateUrl: 'erp_otweb/ResidentMerchant/packageControl.html',
      controller: 'packageControlCtrl'
    })
    .when('/erpfinance/incomeshould', {  //erp财务--收入管理
      templateUrl: 'erp_otweb/erpfinance/erp_finance_income_should.html',
      controller: 'incomeshouldCtrl'
    })

    .when('/erpfinance/walletcuslistdel/:type?', {  //erp财务--客户钱包管理
      templateUrl: 'erp_otweb/erpfinance/erp_finance_wallet_cuslist-del.html',
      controller: 'walletcuslistdelCtrl'
    })
    .when('/erpfinance/walletcusdetail/:cid', {  //erp财务--客户钱包管理
      templateUrl: 'erp_otweb/erpfinance/erp_finance_wallet_cusdetail.html',
      controller: 'walletcusdetailCtrl'
    })
    .when('/erpfinance/accountquery', {  //erp财务--对账查询
      templateUrl: 'erp_otweb/erpfinance/erp_finance_account_query.html',
      controller: 'accountqueryCtrl'
    })
    .when('/erpfinance/OrderProfit', {  //erp财务--订单利润
      templateUrl: 'erp_otweb/erpfinance/erp_finance_OrderProfit.html',
      controller: 'OrderProfitCtrl'
    })
    .when('/erpfinance/ziOrderProfit/:muOrdId?', {  //erp财务--子订单利润
      templateUrl: 'erp_otweb/erpfinance/erp_finance_ziOrderProfit.html',
      controller: 'ziOrderProfitCtrl'
    })
    .when('/erpfinance/CommodityProfit', {  //erp财务--订单利润
      templateUrl: 'erp_otweb/erpfinance/erp_finance_CommodityProfit.html',
      controller: 'CommodityProfitCtrl'
    })
    .when('/allmony', {  //erp财务--总销售额
      templateUrl: 'erp_otweb/erpfinance/erp_finance_allmoney.html',
      controller: 'allmoneyCon'
    })
    .when('/erpfinance/receivables', {  //erp财务--已收款项
      templateUrl: 'erp_otweb/erpfinance/erp_finance_income_receivables.html',
      controller: 'receivablesCtrl'
    })
    .when('/erpfinance/canceled', {  //erp财务--已取消订单金额
      templateUrl: 'erp_otweb/erpfinance/erp_finance_income_canceled.html',
      controller: 'canceledCtrl'
    })
    .when('/erpfinance/cwzc', {  //erp财务--退款金额
      templateUrl: 'erp_otweb/erpfinance/erp_finance_cwzc.html',
      controller: 'cwzcCtrl'
    })
    .when('/erpfinance/refund', {  //erp财务--退款金额
      templateUrl: 'erp_otweb/erpfinance/erp_finance_income_refund.html',
      controller: 'refundCtrl'
    })
    // .when('/erpfinance/incomeVIP', {  //erp财务--VIP通道额度管理
    //     templateUrl: 'erp_otweb/erpfinance/erp_finance_income_VIP.html',
    //     controller: 'incomeVIPCtrl'
    // })
    .when('/erpfinance/walletcash/:withdrawalType?', {  //erp财务--提现申请
      templateUrl: 'erp_otweb/erpfinance/erp_finance_wallet_cash.html',
      controller: 'walletcashCtrl'
    })
    .when('/erpfinance/wallet-recharge', {  //erp财务--提现申请
      templateUrl: 'erp_otweb/erpfinance/erp_finance_wallet_recharge.html',
      controller: 'walletRechargeCtrl'
    })
    .when('/erpfinance/billInquiry', {  //erp财务--提现申请
      templateUrl: 'erp_otweb/erpfinance/erp_finance_bill_inquiry.html',
      controller: 'billInquiryCtrl'
    })
    .when('/erpfinance/remit', {  //erp财务--汇款中
      templateUrl: 'erp_otweb/erpfinance/erp_finance_income_remit.html',
      controller: 'remitCtrl'
    })
    .when('/erpfinance/subscriber', {  //erp客户订阅
      templateUrl: 'erp_otweb/erpfinance/erp_finance_subscriber.html',
      controller: 'subscriberCtrl'
    })
    .when('/erpfinance/tixian', {  //erp分销提现管理
      templateUrl: 'erp_otweb/erpfinance/erp_finance_tixian.html',
      controller: 'tixianCtrl'
    })
    //- 财务打款 线下采购 ->
    .when('/erpfinance/payment/offline_purchase', {  //线下采购 财务打款
      templateUrl: 'erp_otweb/erpfinance/payment/offline_purchase.html',
      controller: 'paymentOfflinePurchaseCtrl'
    })
    //<- 财务打款 线下采购 -
    .when('/erpservice/csdisputePendingm', {  //erp客服---待您响应
      templateUrl: 'erp_otweb/erpservice/erp_cs_disputePending_m.html',
      controller: 'csdisputePendingmCtrl'
    })
    .when('/erpservice/csdisputePendingExamine', {  //erp客服---待您审核
      templateUrl: 'erp_otweb/erpservice/erp-disputePending-examine.html',
      controller: 'csdisputePendingExamineCtrl'
    })
    .when('/erpservice/disputeResolution', {  //erp客服---纠纷调解
      templateUrl: 'erp_otweb/erpservice/erp_cs_disputeResolution.html',
      controller: 'disputeResolutionCtrl'
    })
    .when('/erpservice/csdisputePendingc', {  //erp客服---待客户处理
      templateUrl: 'erp_otweb/erpservice/erp_cs_disputePending_c.html',
      controller: 'csdisputePendingcCtrl'
    })
    .when('/erpservice/csdisputeclose', {  //erp客服--纠纷已取消
      templateUrl: 'erp_otweb/erpservice/erp_cs_disputeclose.html',
      controller: 'csdisputecloseCtrl'
    })
    .when('/erpservice/csdisputeover', {  //erp客服--纠纷已完成
      templateUrl: 'erp_otweb/erpservice/erp_cs_disputeover.html',
      controller: 'csdisputeoverCtrl'
    })
    .when('/erpservice/tz', {  //erp客服--通知
      templateUrl: 'erp_otweb/erpservice/system-message.html',
      controller: 'tzctrl'
    })
    .when('/erpservice/tzedit/:type', {  //erp客服--写通知
      templateUrl: 'erp_otweb/erpservice/system-message-edit.html',
      controller: 'sysmessagectrl'
    })
    .when('/erpservice/sc/:flag?', {  //erp聊天
      templateUrl: 'erp_otweb/erpservice/severice-relation.html',
      controller: 'srCtrl'
    })
    .when('/erpservice/document', {  //erp客服-document
      templateUrl: 'erp_otweb/erpservice/severice-document.html',
      controller: 'serviceDocuCtrl'
    })
    .when('/erpservice/document/add/:type?/:id?', {  //erp客服-document
      templateUrl: 'erp_otweb/erpservice/severice-document-add.html',
      controller: 'serviceDocuAddCtrl'
    })
    .when('/erpservice/lookchart', {  //erp查看聊天
      templateUrl: 'erp_otweb/erpservice/lookchart.html',
      controller: 'lookchartCtrl'
    })
    .when('/erpservice/tzdraft', {  //erp客服--通知草稿
      templateUrl: 'erp_otweb/erpservice/system-message-draft.html',
      controller: 'tzdraftctrl'
    })
    .when('/erpservice/tztime', {  //erp客服--通知定时发送
      templateUrl: 'erp_otweb/erpservice/system-message-time.html',
      controller: 'tztimectrl'
    })
    .when('/erpservice/tztemplet', {  //erp客服--通知模板管理
      templateUrl: 'erp_otweb/erpservice/system-message-templet.html',
      controller: 'tztempletctrl'
    })
    .when('/erpservice/tztempletadd/:type', {  //erp客服--新增
      templateUrl: 'erp_otweb/erpservice/system-message-add.html',
      controller: 'sysmessageaddctrl'
    })
    .when('/staff/IntegrationSetting', {  //erp员工--积分规则设置
      templateUrl: 'erp_otweb/staff/IntegrationSetting.html',
      controller: 'IntegrationSettingCtrl'
    })
    .when('/staff/KPIAssessment', {  //erp员工--绩效考核KPI
      templateUrl: 'erp_otweb/staff/KPIAssessment.html',
      controller: 'KPIAssessmentCtrl'
    })
    .when('/staff/CatchingGoodsKPI', {  //erp员工--抓货绩效统计
      templateUrl: 'erp_otweb/staff/CatchingGoodsKPI.html',
      controller: 'CatchingGoodsKPICtrl'
    })
    .when('/staff/InspectionFormKPI', {  //erp员工--验单绩效统计
      templateUrl: 'erp_otweb/staff/InspectionFormKPI.html',
      controller: 'InspectionFormKPICtrl'
    })
    .when('/staff/rkjxtj', {  //erp员工--绩效考核KPI
      templateUrl: 'erp_otweb/staff/staff-rktj.html',
      controller: 'kpiRkjxTjCtrl'
    })
    .when('/staff/jxgzSetting', {  //erp员工--绩效规则添加
      templateUrl: 'erp_otweb/staff/new-jxgz-setting.html',
      controller: 'newJxgzSettingCtrl'
    })
    .when('/staff/jxgzadd', {  //erp员工--绩效规则添加
      templateUrl: 'erp_otweb/staff/spmenutree.html',
      controller: 'newSpAddTreeCtrl'
    })
    .when('/staff/newstorejxkh', {  //erp员工--新版绩效考核仓库组--绩效考核KPI
      templateUrl: 'erp_otweb/staff/new-jxtj.html',
      controller: 'newStoreJxtjCtrl'
    })
    .when('/staff/sourcingjxkh', {  //erp员工--新版绩效考核搜品组--绩效考核KPI
      templateUrl: 'erp_otweb/staff/sourcing-jxtj.html',
      controller: 'sourcingJxtjCtrl'
    })
    .when('/staff/detail', {  //erp员工--新版绩效考核查看详情-绩效考核KPI
      templateUrl: 'erp_otweb/staff/jxkh-detail.html',
      controller: 'jxtjDetailCtrl'
    })
    .when('/staff/setkpiassess', {  //erp员工--KPI考核标准
      templateUrl: 'erp_otweb/staff/set-kpiassess.html',
      controller: 'setkpiassessCtrl'
    })
    .when('/staff/stafffiles', {  //erp员工--员工账号管理
      templateUrl: 'erp_otweb/staff/staff-files.html',
      controller: 'stafffilesCtrl'
    })
    //      .when('/staff/client',{  //erp员工--员工客户关系表
    //          templateUrl:'erp_otweb/erpcustomer/staff-client.html',
    //          controller:'staffclientCtrl'
    //      })
    .when('/staff/stafffilesdetail', {  //erp员工--员工档案
      templateUrl: 'erp_otweb/staff/staff-files-detail.html',
      controller: 'stafffilesdetailCtrl'
    })
    .when('/staff/stafffilesadd', {  //erp员工--新增员工
      templateUrl: 'erp_otweb/staff/staff-files-add.html',
      controller: 'stafffilesaddCtrl'
    })
    .when('/staff/stafftable', {  //erp员工--详情
      templateUrl: 'erp_otweb/staff/staff-table.html',
      controller: 'stafftableCtrl'
    })
    .when('/staff/nbtz', {  //erp员工--内部通知--已发送
      templateUrl: 'erp_otweb/staff/staff-nbtz.html',
      controller: 'staffnbtzCtrl'
    })
    .when('/staff/cgx', {  //erp员工--内部通知--草稿箱
      templateUrl: 'erp_otweb/staff/staff-cgx.html',
      controller: 'staffcgxCtrl'
    })
    .when('/staff/dsfs', {  //erp员工--内部通知--定时发送
      templateUrl: 'erp_otweb/staff/staff-dsfs.html',
      controller: 'staffdsfsCtrl'
    })
    .when('/staff/write', {  //erp员工--内部通知--写通知
      templateUrl: 'erp_otweb/staff/staff-write.html',
      controller: 'staffwriteCtrl'
    })
    .when('/staff/recruit/:name?', {  //招聘
      templateUrl: 'erp_otweb/staff/staff-recruit.html',
      controller: 'recruitCtrl'
    })
    .when('/staff/linshigong', {  //临时工
      templateUrl: 'erp_otweb/staff/staff-linshigong.html',
      controller: 'linshigongCtrl'
    })
    .when('/staff/lsgGzjs', {  //临时工工资页面
      templateUrl: 'erp_otweb/staff/staff-lsgGz.html',
      controller: 'linshigongGzCtrl'
    })
    .when('/erpservice/gd', {  //erp客服--工单
      templateUrl: 'erp_otweb/erpservice/system-gongdan.html',
      controller: 'gdctrl'
    })
    .when('/erpservice/video', {  //erp客服--上传视频
      templateUrl: 'erp_otweb/erpservice/video-load.html',
      controller: 'videoctrl'
    })
    .when('/erpservice/article', {  //erp客服--上传文章
      templateUrl: 'erp_otweb/erpservice/article-load.html',
      controller: 'articlectrl'
    })
    .when('/erpservice/khbz', {  //erp客服--考核标准
      templateUrl: 'erp_otweb/erpservice/erp_assessstandard.html',
      controller: 'assessstandardctrl'
    })

    .when('/erpservice/gdcjreply', {  //erp工单--等待cj回复
      templateUrl: 'erp_otweb/erpservice/system-gongdan.html',
      controller: 'gdctrl'
    })
    .when('/erpservice/gdaccountreply', {  //erp工单--等待客户回复
      templateUrl: 'erp_otweb/erpservice/system-gongdan.html',
      controller: 'gdctrl'
    })
    .when('/erpservice/gdsuccess', {  //erp工单--已完成
      templateUrl: 'erp_otweb/erpservice/system-gongdan.html',
      controller: 'gdctrl'
    })
    .when('/erpservice/gdhangup', {  //erp工单--已挂起
      templateUrl: 'erp_otweb/erpservice/system-gongdan.html',
      controller: 'gdctrl'
    })
    .when('/erpservice/gdcancel', {  //erp工单--已取消
      templateUrl: 'erp_otweb/erpservice/system-gongdan.html',
      controller: 'gdctrl'
    })
    .when('/erpservice/gdautocancel', {  //erp工单--自动取消
      templateUrl: 'erp_otweb/erpservice/system-gongdan.html',
      controller: 'gdctrl'
    })
    .when('/erpservice/cusemailcancel', {  //erp工单--客户邮件工单
      templateUrl: 'erp_otweb/erpservice/system-gongdan.html',
      controller: 'gdctrl as ctrl'
    })
    .when('/erpservice/CustomerService', {  //erp服务客户
      templateUrl: 'erp_otweb/erpservice/CustomerService.html',
      controller: 'CustomerServicectrl'
    })
    .when('/erpservice/changeordid', {  //usps换订单号
      templateUrl: 'erp_otweb/erpservice/change-ordid.html',
      controller: 'changeOrdIdCtrl'
    })
    .when('/erpservice/commodityConsult/:status?', { //erp客服-商品咨询
      templateUrl: 'erp_otweb/erpservice/commodity-consult.html',
      controller: 'commodityConsultCtrl'
    })
    // .when('/erplogistics/print', {
    //     templateUrl: 'erp_otweb/erplogistics/print.html',
    //     controller: 'gdctrl'
    // })
    .when('/mine/myaccount', {
      templateUrl: 'erp_otweb/mine/my-account.html',
      controller: 'staffpersoncenterCtrl2'
    })
    .when('/mine/staffp2', {
      templateUrl: 'erp_otweb/mine/staff-personcenter2.html',
      controller: 'staffpersoncenterCtrl2'
    })
    .when('/sys/rolePer', {
      templateUrl: 'erp_otweb/systemSettings/rolePermission.html',
      controller: 'systemSettingsCtrl'
    })
    .when('/sys/authority', {
      templateUrl: 'erp_otweb/systemSettings/authorityManagement.html',
      controller: 'systemUserCtrl'
    })
    .when('/sys/updateNav', {
      templateUrl: 'erp_otweb/systemSettings/updateNavTree.html',
      controller: 'systemSettingsCtrl'
    })
    .when('/sys/lookTime', {
      templateUrl: 'erp_otweb/systemSettings/lookTime.html',
      controller: 'systemSettingsCtrl'
    })
    .when('/bank/bankAcount', {
      templateUrl: 'erp_otweb/erpbank/erpBankaccountmange.html',
      controller: 'bankacountCtrl'
    })
    .when('/bank/bankWater', {
      templateUrl: 'erp_otweb/erpbank/erpBankWater.html',
      controller: 'bankWaterCtrl'
    })
    .when('/bank/exchange', {
      templateUrl: 'erp_otweb/erpbank/erpBankexchange.html',
      controller: 'exchangeCtrl'
    })
    .when('/erpservice/erpMail', {  //erp邮件
      templateUrl: 'erp_otweb/erpservice/erp-mail.html',
      controller: 'mailCtrl'
    })
    .when('/erpservice/erpMailTemplate', {  //erp邮件
      templateUrl: 'erp_otweb/erpservice/erp-mail-template.html',
      controller: 'mailTemplateCtrl'
    })
    .when('/erpservice/erpPort', {  //erp邮件接口
      templateUrl: 'erp_otweb/erpservice/ero-portList.html',
      controller: 'PortCtrl'
    })
    .when('/erpservice/csdisputeWaite', {  //erp客服---纠纷等待
      templateUrl: 'erp_otweb/erpservice/erp_cs_disputewaite.html',
      controller: 'csdisputeWaiteCtrl'
    })
    .when('/erpservice/fastReply', {  //erp客服---快捷回复
      templateUrl: 'erp_otweb/erpservice/erp-fastReply.html',
      controller: 'fastReplyCtrl'
    })
    .when('/erpservice/erpSelfModel', {  //erp邮件接口
      templateUrl: 'erp_otweb/erpservice/erp-selfModel.html',
      controller: 'SelfMdoelCtrl'
    })
    .when('/mycj/ViewTheDifference', {  //erp邮件接口
      templateUrl: 'erp_otweb/mycj/ViewTheDifference.html',
      controller: 'ViewTheDifferenceCtrl'
    })
    .when('/mycj/copyhtml', {  //erp邮件接口
      templateUrl: 'erp_otweb/mycj/copyHtml.html',
      controller: 'CopyCtrl'
    })
    .when('/erpservice/csdisputeFastReply', {  //erp客服---纠纷快捷回复
      templateUrl: 'erp_otweb/erpservice/erp_cs_disputeFastReply.html',
      controller: 'csdisputeFastReplyCtrl'
    })
    .when('/staff/shelfLink', {  //erp 上架链接
      templateUrl: 'erp_otweb/staff/staff-shelfLink.html',
      controller: 'shelfLinkCtrl'
    })
    .when('/staff/myTask', {  //erp 我的任务
      templateUrl: 'erp_otweb/staff/staff-myTask.html',
      controller: 'myTaskCtrl'
    })
    .when('/staff/DifficultySetting', {  //erp 难度设置
      templateUrl: 'erp_otweb/staff/staff-difficultySetting.html',
      controller: 'diffSettingCtrl'
    })
    .when('/staff/getTask', {  //erp 领取任务
      templateUrl: 'erp_otweb/staff/staff-getTask.html',
      controller: 'getTaskCtrl'
    })
    .when('/erpservice/complaint', {  //erp 投诉建议
      templateUrl: 'erp_otweb/erpservice/erp-complaint.html',
      controller: 'complaintCtrl'
    })
    .when('/staff/linkAssessment', {  //erp 链接组考核
      templateUrl: 'erp_otweb/staff/staff-linkAssessment.html',
      controller: 'linkAssessmentCtrl'
    })
    .when('/staff/enterAssessment', {  //erp 绩效组考核
      templateUrl: 'erp_otweb/staff/staff-enterAssessment.html',
      controller: 'enterAssessmentCtrl'
    })
    .when('/erplogistics/singleRecord', {  //erp 分单
      templateUrl: 'erp_otweb/erplogistics/erp_logistics_singleRecord.html',
      controller: 'singleRecordCtrl'
    })
    .when('/erpservice/erpPageModel', {  //erp 页面模板
      templateUrl: 'erp_otweb/erpservice/erp-pageModel.html',
      controller: 'pageModelCtrl'
    })
    .when('/erpservice/codFaq', {  //cod和供应商FAQ
      templateUrl: 'erp_otweb/erpservice/cod-faq.html',
      controller: 'codFaqCtrl'
    })
    .when('/erpservice/MailSending', {  //erp 发送邮件
      templateUrl: 'erp_otweb/erpservice/erp-mailSending.html',
      controller: 'mailSendingCtrl'
    })
    .when('/erpservice/MailOutbox', {  //erp 发件箱
      templateUrl: 'erp_otweb/erpservice/erp-mailOutbox.html',
      controller: 'mailOutboxgCtrl as ctrl'
    })
    .when('/erpservice/MailGeting', {  //erp 收件箱
      templateUrl: 'erp_otweb/erpservice/erp-mailGeting.html',
      controller: 'mailGetingCtrl as ctrl'
    })
    .when('/erpcustomer/khgl/:type?', {  //erp 客户管理
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_khgl.html',
      controller: 'CustomerManagementCtrl'
    })
    .when('/erplogistics/dbtj', {  //erp 打包统计
      templateUrl: 'erp_otweb/erplogistics/erp_PackagingStatistics.html',
      controller: 'PackagingStatisticsCtrl'
    })
    .when('/erplogistics/dppstu/:dbrname?/:dppTtpe?', {  //erp待匹配
      templateUrl: 'erp_otweb/erplogistics/erp-dppstu.html',
      controller: 'dpphdCtrl'
    })
    .when('/erpcustomer/khtj/:id?/:name?/:type?', {  //erp 客户统计
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_kehutongji.html',
      controller: 'CustomerStatisticsCtrl'
    })
    .when('/mycj/PlaySingle', {  //erp 自动打单
      templateUrl: 'erp_otweb/mycj/mych-PlaySingle.html',
      controller: 'PlaySingleCtrl'
    })
    .when('/erpcustomer/khfxlb/:type?', {
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_fenxiList.html',
      controller: 'CustomerAnalysisListCtrl'
    })
    .when('/erpcustomer/khpj', {  //erp 客户评级
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_khpj.html',
      controller: 'customerGradingCtrl'
    })
    .when('/mycj/AutomaticInvoicing', {  //erp 自动生成发票
      templateUrl: 'erp_otweb/mycj/AutomaticInvoicing.html',
      controller: 'AutomaticInvoicingCtrl'
    })
    .when('/staff/xgygmm', {  //erp 修改员工密码
      templateUrl: 'erp_otweb/staff/staff-UpdateYGPwd.html',
      controller: 'UpdateYGPWdCtrl'
    })
    .when('/pod/ord-list', {  //erp--个性化pod订单
      templateUrl: 'static/html/gxh-gys/pod-ord.html',
      controller: 'pod-ord-control'
    })
    .when('/pod/supplier-list', {  //erp--个性化pod-供应商
      templateUrl: 'static/html/gxh-gys/supplier-list.html',
      controller: 'pod-supplier-list-control'
    })
    .when('/pod/ord-link-suplier-list', {  //erp--个性化pod订单-关联供应商
      templateUrl: 'static/html/gxh-gys/ord-link-suplier-list.html',
      controller: 'pod-ord-control'
    })
    .when('/pod/print-sheet', {  //erp--个性化pod订单-打印面单
      templateUrl: 'static/html/gxh-gys/print-sheet.html',
      controller: 'pod-ord-control'
    })
    .when('/pod/supplier-product-review', {  //erp--个性化pod-审核供应商商品
      templateUrl: 'static/html/gxh-gys/supplier-product-review.html',
      controller: 'pod-supplier-product-review-control'
    })
    .when('/erpcustomer/lost/:uid?', {  //erp 客户管理
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_lost.html',
      controller: 'LostCustomerManagementCtrl'
    })
    .when('/mycj/salesVolumeBySku', {  //检测ups+
      templateUrl: 'erp_otweb/mycj/salesVolumeBySku.html',
      controller: 'salesVolumeBySku'
    })
    .when('/mycj/joke', {  //cjpacket-笑话
      templateUrl: 'erp_otweb/mycj/cjpacket_joke.html',
      controller: 'joke-control'
    })
    .when('/mycj/checkUPS', {  //检测ups+
      templateUrl: 'erp_otweb/mycj/mycj-CheckUps.html',
      controller: 'CheckUpsCtrl'
    })
    .when('/erplogistics/orderLogisicsSearch', {  //订单物流查询
      templateUrl: 'erp_otweb/erplogistics/erp_logisics_search.html',
      controller: 'orderLogisicsSearchCtrl'
    })
    .when('/mycj/logisticsSelect', {
      templateUrl: 'erp_otweb/mycj/logistics_select.html',
      controller: 'logisticsSelectCtrl'
    })
    .when('/merchandise/SkuGroupList/:skuflag?', {  //组合sku
      templateUrl: 'static/html/manage/merchandise/skugrouplist.html',
      controller: 'skuGroupListCtrl'
    })
    .when('/merchandise/SkuRepeatList', {  //重复sku
      templateUrl: 'static/html/manage/merchandise/skuRepeatList.html',
      controller: 'skuRepeatListCtrl'
    })
    .when('/merchandise/editskumoney', {  //修改价格
      templateUrl: 'static/html/manage/merchandise/edit-skumoney.html',
      controller: 'skuChangePriceCtrl'
    })
    .when('/mycj/chuku', {
      templateUrl: 'erp_otweb/mycj/chuku.html',
      controller: 'chukuCtrl'
    })
    .when('/erpcustomer/lostCustomer', { //已流失客户
      templateUrl: 'erp_otweb/erpcustomer/erp_KeHu_lostCu.html',
      controller: 'lostCustomerCtrl'
    })
    .when('/erpservice/khbzbykf', {  //erp客服--考核标准
      templateUrl: 'erp_otweb/erpservice/erp_assessment.html',
      controller: 'assesmentctrl'
    })
    .when('/erpFinancing/incomeStatistics/:statisticsType?', {  //erp财务-收入统计
      templateUrl: 'erp_otweb/erpfinance/erp_financing_income_statistics.html',
      controller: 'financingIcomeStatisticsCtrl'
    })
    .when('/erpFinancing/otherIncome/:incomeType?', {  //erp财务-其他收入
      templateUrl: 'erp_otweb/erpfinance/erp_financing_other_income.html',
      controller: 'financingOtherIncomeCtrl'
    })
    .when('/erpFinancing/expendiure/cost', {  //erp财务-支出-销售成本
      templateUrl: 'erp_otweb/erpfinance/erp_financing_selling_cost.html',
      controller: 'financingExpendiureCtrl'
    })
    .when('/erpFinancing/expendiure/dispute', {  //erp财务-支出-销售费用-提成纠纷
      templateUrl: 'erp_otweb/erpfinance/erp_financing_selling_expenses.html',
      controller: 'financingExpendiureCtrl'
    })
    .when('/erpFinancing/expendiure/salary', {  //erp财务-支出-管理费用-工资
      templateUrl: 'erp_otweb/erpfinance/erp_financing_selling_salary.html',
      controller: 'financingExpendiureCtrl'
    })
    .when('/erpFinancing/expendiure/financialExpense', {  //erp财务-支出-财务费用
      templateUrl: 'erp_otweb/erpfinance/erp_financing_selling_financialExpense.html',
      controller: 'financingExpendiureCtrl'
    })
    .when('/erpFinancing/expendiure/other', {  //erp财务-支出-其他支出
      templateUrl: 'erp_otweb/erpfinance/erp_financing_selling_otherExpend.html',
      controller: 'financingExpendiureCtrl'
    })
    .when('/erpFinancing/expendiure/statistics', {  //erp财务-支出-支出统计
      templateUrl: 'erp_otweb/erpfinance/erp_financing_selling_statistics.html',
      controller: 'financingExpendiureCtrl'
    })
    .when('/erpFinancing/expendiure/disputeRefund', { //erp财务-纠纷退款
      templateUrl: 'erp_otweb/erpfinance/erp_financing_dispute_refund.html',
      controller: 'financingDisputeRefundCtrl'
    })
    .when('/erpFinancing/expendiure/commission', {  //erp财务-销售提成
      templateUrl: 'erp_otweb/erpfinance/erp_finance_sales_commision.html',
      controller: 'salesCommissionCtrl'
    })
    .when('/erpFinancing/expendiure/muOrder/:id', {  //erp财务-母订单
      templateUrl: 'erp_otweb/erpfinance/erp_finance_sales_ord.html',
      controller: 'salesCommissionOrdCtrl'
    })
    .when('/erpFinancing/expendiure/ziOrder/:id', {  //erp财务-子订单
      templateUrl: 'erp_otweb/erpfinance/erp_finance_sales_ziord.html',
      controller: 'salesCommissionZiOrderCtrl'
    })
    .when('/erpwarehouse/cuofa', {  //erp 仓库错发率
      templateUrl: 'erp_otweb/erpwarehouse/cuofalv.html',
      controller: 'cuofaCtrl'
    })
    .when('/staff/podIntegral', {  //erp pod商品积分统计
      templateUrl: 'erp_otweb/staff/podIntergral.html',
      controller: 'podIntergralCtrl'
    })
    .when('/appVideo/list', {  //erp app视频--视频列表
      templateUrl: 'static/html/manage/appVideo/appVideoList.html',
      controller: 'appVideoListCtrl'
    })
    .when('/appVideo/audit', {  //erp app视频--视频列表
      templateUrl: 'static/html/manage/appVideo/app_Video_audit.html',
      controller: 'appVideoAuditCtrl'
    })
    .when('/erpservice/nigthShift', {  //erp 晚班记录
      templateUrl: 'erp_otweb/erpservice/erp_night_shift.html',
      controller: 'nightShiftCtrl'
    })
    .when('/erpservice/cuteChatList', {  //erp 智能客服聊天记录列表  D:\git-project\erp-web\erp_otweb\erpservice\erp_cute_chatList.html
      templateUrl: 'erp_otweb/erpservice/erp_cute_chatList.html',
      controller: 'cuteChatListCtrl'
    })
    .when('/erpservice/cuteFAQ', {  //erp 智能客服 faq
      templateUrl: 'erp_otweb/erpservice/erp_cute_FAQ.html',
      controller: 'cuteFAQCtrl'
    })
    .when('/erpservice/exportFAQ', { // 知识库导出
      templateUrl: 'erp_otweb/erpservice/exportFAQ.html',
      controller: 'exportFAQCtrl'
    })
    // .when('/staff/staffpersoncenter',{  //erp员工--个人中心1
    //     templateUrl:'erp_otweb/staff/staff-personcenter.html',
    //     controller:'staffpersoncenterCtrl'
    // })
    .when('/analysis/personal', {//用户画像
      templateUrl: 'static/html/analysis/personal.html',
      controller: 'personalCtrl'
    })
    .when('/analysis/setemail', {//设置邮件
      templateUrl: 'static/html/analysis/setEmail.html',
      controller: 'setEmailCtrl'
    })
    .when('/analysis/emailmodel', {//邮件模板
      templateUrl: 'static/html/analysis/emailModel.html',
      controller: 'emailModelCtrl'
    })
    //var lang = window.localStorage.lang||'cn';
    // $translateProvider.preferredLanguage(lang);
    //$translateProvider.useStaticFilesLoader({
    //    prefix: '/svn-p3/webapp/static/angular-1.5.8/i18n/',//D:\svn-project\svn-p3\webapp\static\angular-1.5.8\i18n
    //    suffix: '.json'
    //});
    //$translateProvider.fallbackLanguage('cn');
    .when('/holiday/tips', {//节假日提示
      templateUrl: 'static/html/holiday/tiplist.html',
      controller: 'holidayTipListCtrl'
    })
    .when('/holiday/tipadd/:type', {//添加节假日提示
      templateUrl: 'static/html/holiday/tipadd.html',
      controller: 'holidayTipAddCtrl'
    })
    .when('/superdeal/list/:type?', {//erp store搜品
      templateUrl: 'static/html/superdeal/list.html',
      controller: 'superdealListCtrl'
    })
    .when('/superdeal/analysis', {//erp store搜品
      templateUrl: 'static/html/superdeal/analysis.html',
      controller: 'superdealAnalysisCtrl'
    })
    .when('/shortage/refund', {
      //erp财务 - 缺货退款
      templateUrl: 'erp_otweb/erpfinance/erp_shortage_refund.html',
      controller: 'shortageRefundCtrl',
    })
    .when('/internal/procurement', {
      //erp财务 - 内部采购
      templateUrl: 'erp_otweb/erpfinance/erp_in_procurement.html',
      controller: 'interProcurementCtrl',
    })
    .when('/staff/daywoker', {  //临时工-新
      templateUrl: 'static/html/staff/daywoker.html',
      controller: 'daywokerCtrl'
    })
    .when('/staff/timeWage', {  //临时工-新
      templateUrl: 'static/html/staff/time-wage.html',
      controller: 'timeWageCtrl'
    });

    //$translateProvider.translations('en',{
    //    '10001':'MyCJ',
    //    '10002':'Orders'
    //});
    //
    //$translateProvider.translations('cn',{
    //    '10001':'我的CJ',
    //    '10002':'订单'
    //});
    //
    // .when('/advancePurchase/list/:sku?',{
    //   templateUrl:'./static/newPages/advancePurchase/list/index.html',
    //   controller:'advancePurchaseList'
    // })
    
    // var routers = [ // 路由列表
    //   {
    //     route:'/advancePurchase/list/:sku?',// 预采购列表
    //     templateUrl:'./static/newPages/advancePurchase/list/index.html',
    //     controller:'advancePurchaseList'
    //   },
    //   {
    //     route:'/advancePurchase/apply/:sku?',// 预采购申请列表
    //     templateUrl:'./static/newPages/advancePurchase/apply/index.html',
    //     controller:'advancePurchaseApplyList'
    //   },
    //   {
    //     route:'/advancePurchase/cycle/:sku?',// 预采购周期设置
    //     templateUrl:'./static/newPages/advancePurchase/cycle/index.html',
    //     controller:'advancePurchaseCycleSetting'
    //   },
    //   {
    //     route:'/advancePurchase/warning/:sku?',// 预采预警管理
    //     templateUrl:'./static/newPages/advancePurchase/warning/index.html',
    //     controller:'advancePurchaseWarning'
    //   },
    //   {
    //     route:'/advancePurchase/stockout/:sku?',// 断货预警管理
    //     templateUrl:'./static/newPages/advancePurchase/stockout/index.html',
    //     controller:'advancePurchaseStockOutWarning'
    //   },
    //   {
    //     route:'/losslist',// 损耗列表
    //     templateUrl:'./static/newPages/losslist/index.html',
    //     controller:'ctrlLossList'
    //   },
    //   {
    //     route:'/settingSyncStorage',// 是否开启虚拟仓库
    //     templateUrl:'./static/newPages/syncStorage/index.html',
    //     controller:'ctrlSyncStorage'
    //   }
    // ]
    var setRouterPath = function (item) { // 设置一个路由
      $routeProvider.when(item.route, {
        templateUrl: item.templateUrl,
        controller: item.controller
      })
    }
    let routerList = [...window.xiaokyo_routerList,...window.purchaseRouter];
    routerList.forEach(function(item){ // 循环router列表
      setRouterPath(item)
    })
    $translateProvider.preferredLanguage('cn');
    //默认的语言
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.useStaticFilesLoader({
      files: [{
        prefix: 'static/angular-1.5.8/i18n/', //语言包路径
        suffix: '.json' //语言包后缀名
      }]
    });
    //默认加载的语言包
    //$translateProvider.fallbackLanguage('cn');//默认加载语言包
  }]);

  app.directive('repeatFinish', function () {
    return {
      link: function (scope, element, attr) {
        if (scope.$last == true) {
          scope.$eval(attr.repeatFinish);
        }
      }
    }
  });
  app.directive('renderFinish', ['$timeout', function ($timeout) { //renderFinish自定义指令
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    };
  }]);
  app.controller('manageCtrl', ['$scope', '$window', '$location', 'erp', '$translate', '$rootScope', '$http', function ($scope, $window, $location, erp, $translate, $rootScope, $http) {
    var bs = new Base64();
    $scope.firstNavList = [];
    var loginJob = localStorage.getItem('job') ? bs.decode(localStorage.getItem('job')) : '';
    const userId = localStorage.getItem('erpuserId') ? bs.decode(localStorage.getItem('erpuserId')) : '';
    console.log(loginJob, userId)
    var cebianwidth;

    erp.setStorageToSession()

    getMenuFn()
    //获取导航
    function getMenuFn() {
      const localNav = localStorage.getItem('nav')
      const params = {
        // news: !localNav ? '1' : '0',
        news: '1',
        version: '2'
      }
      //获取导航 数字 对应字典json
      $http.get(`./static/js/manage/menuCount.json?v=${window.BUILD_VERSION}`).then(({ data: countJson }) => {
        $scope.countJson = countJson
        erp.postFun('control/api/getUserMenuTree', JSON.stringify({ sysId: 3, userId }), ({ data: res }) => {
          const { code, data: newMenu } = res
          if (code === 200) {
            $scope.firstNavList = newMenu.map(item => {
              item.name = item.code
              item.img = item.v1 || ''
              item.children = item.child.map(child => {
                child.name = child.code
                child.children = child.child.map(third => {
                  third.name = third.code
                  return third
                })
                return child
              })
              return item
            })
            $scope.disposeMenuByJob()
            erp.postFun('app/menu/getMenu', JSON.stringify(params), ({ data: result }) => {
              $scope.firstNavList = $scope.firstNavList.map(nav => { //遍历菜单，获取一级菜单
                const firstName = nav.name //获取一级菜单的name
                //如果一级菜单的name存在于字典中并且其对应的后台key存在，才需要遍历一级菜单,注：顾虑掉订单模块（100002）
                if (firstName !== '100002' && countJson[firstName] && result[countJson[firstName].javaName]) {
                  //获取字典对应key的后台数字集合
                  const countList = result[countJson[firstName].javaName]
                  //二级菜单字典集合
                  const secondChild = countJson[firstName].child
                  nav.children = nav.children.map(second => { //遍历一级菜单，获得二级菜单
                    //只有菜单二级名称存在于二级菜单字典集合中，才需要对其和子集添加数字
                    if (secondChild[second.name]) {
                      //客户模块 未通过，需审核，黑名单需要再从list中获取
                      if (['100892', '100608', '100891'].includes(second.name)) {
                        countList.list.forEach(_ => {
                          if (_.STATUS === secondChild[second.name].strName) second.count = _.num || 0
                        })
                      } else {
                        second.count = secondChild[second.name].strName ? countList[secondChild[second.name].strName] || 0 : ''
                      }
                      //如果二级菜单字典存在子集且菜单menu也存在子集，则遍历三级菜单
                      if (secondChild[second.name].child && second.children && second.children.length > 0) {
                        //三级菜单字典集合
                        const thirdChild = secondChild[second.name].child
                        second.children = second.children.map(third => {
                          third.count = thirdChild[third.name] ? countList[thirdChild[third.name]] || 0 : ''
                          return third
                        })
                      }
                    }
                    return second
                  })
                }
                return typeof handleModiftHref === 'undefined' ? nav : handleModiftHref(nav);
              })
              $scope.disposeOrder(result['100002'])
            })
          }
        })
      })
    }

    $scope.cebianList = []
    var count = 0;
    $scope.renderFinish = function () {
      var url = `#${$location.path()}`;
      getFirstNav(url)
    }
    // 通过监视锚点值动态的给当前nav添加类名active
    $scope.loca = $location;
    $scope.$watch('loca.url()', function (now, old) {
      var url = "#" + now;
      $scope.firstNavList && getFirstNav(url)
    })
    //根据当前路由匹配符合的以及类目和当前导航索引
    function getFirstNav(url) {
      let targetUrl = url.includes('?') ? url.split('?')[0] : url
      console.log(url, targetUrl)
      let navArr = [],
        documentName = '',
        hasActive = false
      $scope.firstNavList.forEach((item, idx) => {
        item.isActive = false
        if (item.href === targetUrl) { //匹配一级目录
          item.isActive = true
          hasActive = true
        }
        item.children && item.children.length > 0 && item.children.forEach((second, secondIdx) => {
          second.isActive = false
          if (second.href === targetUrl) { //匹配二级目录
            navArr = [idx, secondIdx, 0]
            item.isActive = true
            second.isActive = true
            documentName = `${$translate.instant(second.name)}`
            hasActive = true
          }
          second.children && second.children.length > 0 && second.children.forEach((third, thirdIdx) => {
            third.isActive = false
            if (third.href === targetUrl || (third.name === '老服务商品' && targetUrl.includes('#/merchandise/list/service'))) {//匹配三级目录
              navArr = [idx, secondIdx, thirdIdx]
              documentName = `${$translate.instant(third.name)}-${$translate.instant(second.name)}`
              item.isActive = true
              second.isActive = true
              third.isActive = true
              hasActive = true
            }
          })
        })
      })
      console.log('是否匹配到 =>', hasActive, sessionStorage.getItem('clickAddr'))
      if (!hasActive && sessionStorage.getItem('clickAddr')) {
        navArr = sessionStorage.getItem('clickAddr').split(',')
        console.log(navArr)
        $scope.firstNavList.map((_item, _idx) => {
          if (_idx === +navArr[0]) {
            _item.isActive = true
            _item.children = _item.children.map((_second, _sidx) => {
              if (_sidx === +navArr[1]) {
                _second.isActive = true
                documentName = `${$translate.instant(_second.name)}`
                _second.children = _second.children.map((_third, _tidx) => {
                  if (_tidx === +navArr[2]) {
                    _third.isActive = true
                    documentName = `${$translate.instant(_third.name)}-${$translate.instant(_second.name)}`
                  }
                  return _third
                })
              }
              return _second
            })
          }
          return _item
        })
      }
      if (url == '#/erpservice/sc' || url == '#/erpservice/lookchart') {
        document.title = '客户聊天室';
      } else {
        document.title = documentName;
      }
      const idx1 = +navArr[0]
      const idx2 = +navArr[1]
      const idx3 = +navArr[2]
      sessionStorage.setItem('clickAddr', navArr)
      if ($scope.firstNavList[idx1] &&
        $scope.firstNavList[idx1].children[idx2] &&
        $scope.firstNavList[idx1].children[idx2].children &&
        $scope.firstNavList[idx1].children[idx2].children.length > 0) {
        //获取侧边导航数组
        $scope.cebianList = $scope.firstNavList[idx1].children[idx2].children.map((cebian, idx) => {
          cebian.isActive = idx === idx3
          return cebian
        })
        $scope.isZhankai = localStorage.getItem('isZhankai') ? true : false
      } else {
        $scope.cebianList = []
      }
    }

    $scope.renderFinish2 = function () {
      clearTimeout(timeouters);
      timeouters = setTimeout(function () {
        var w = $('.cebian-content'); //[0].clientWidth
        var ew = w[0].clientWidth;
        cebianwidth = ew + 62 + 'px';
        localStorage.setItem('cebianWidth', cebianwidth);
        $('.cebian-nav').css('width', $scope.isZhankai ? cebianwidth : '25px')
      }, 1000);
    };

    $scope.$on('ngRepeatFinished', function () {
      setWaterFall();
    });

    function setWaterFall() {
      count++;
      if (count == $('.header-nav').find('.second-nav').length) {
        //console.log($('.header-nav').find('.second-nav'));
        var parentList = $('.header-nav').find('.second-nav');
        waterFall(parentList);
      }
    }

    function waterFall(parentList) {
      //console.log(parentList);
      var columns = 2; //3列
      var itemWidth = 300;
      $.each(parentList, function (i, v) {
        var target = $(v);
        var childList = target.find('.s-content');
        //console.log(childList);
        var arr = [];
        childList.each(function (i) {
          var boxheight = $(this).height(); //
          //console.log(boxheight);
          if (i < columns) {
            // 2- 确定第一行
            $(this).css({
              top: 0,
              left: (itemWidth) * i
            });
            arr.push(boxheight);
          } else {
            // 其他行
            // 3- 找到数组中最小高度  和 它的索引
            var minHeight = arr[0];
            var index = 0;
            for (var j = 0; j < arr.length; j++) {
              if (minHeight > arr[j]) {
                minHeight = arr[j];
                index = j;
              }
            }
            // 4- 设置下一行的第一个盒子位置
            // top值就是最小列的高度
            $(this).css({
              top: arr[index],
              left: target.find('.s-content').eq(index).css("left")
            });

            // 5- 修改最小列的高度
            // 最小列的高度 = 当前自己的高度 + 拼接过来的高度
            arr[index] = arr[index] + boxheight;
          }
        });
      });

    }
    /** 2019-12-21 导航 */
    //导航一级类目划入
    $scope.navMouseEnterFn = nav => {
      $scope.firstNavList = $scope.firstNavList.map(item => {
        item.isHover = item.href === nav.href
        return item
      })
    }
    //导航一级类目划出
    $scope.navMouseLeaveFn = () => {
      $scope.firstNavList = $scope.firstNavList.map(item => {
        item.isHover = false
        return item
      })
    }
    //点击类目
    $scope.clickMenu = (ev, item, type) => {
      ev.stopPropagation()
      // console.log($translate.instant(item.name))
      const name = $translate.instant(item.name)
      console.log(name)
      if (name.trim() == '退出' || name.trim() == 'Drop out') { //点击的是退出操作
        logout()
        sessionStorage.removeItem("clickAddr")
      } else if (['母订单', 'Bulk Order', '子订单', 'Sub Orders', '直发订单', 'Wholesale Orders', '私有库存订单', 'Private Pre-stock Orders', '视频订单'].includes(name.trim())) {
        erp.postFun('app/order/getOrderCount', {}, res => {
          res.data && $scope.disposeOrder(res.data)
        }, _ => _)
      } else if (['打印暗转明', '批量设置设计商品价格折扣', 'Bulky price discount setting', '直发商品折扣', 'Discount of wholesale product', 'Role rights management', '角色权限管理', 'IP查询', 'IP Inquiry'].includes(name.trim())) {
        printFun(name.trim())
      }

    }
    //对order菜单进行特殊处理
    $scope.disposeOrder = item => {
      const orderDictionaries = $scope.countJson['100002'].child
      $scope.firstNavList = $scope.firstNavList.map(nav => {
        if (nav.name === '100002') {
          nav.children = nav.children.map(second => {
            //当订单中的二级菜单名称存在于订单字典集合中时，才需要遍历赋值
            if (orderDictionaries[second.name]) {
              const orderCountList = item[orderDictionaries[second.name].strName]
              const orderThirdChild = orderDictionaries[second.name].child
              second.children = second.children.map(third => {
                third.count = orderThirdChild[third.name] ? orderCountList[orderThirdChild[third.name]] || 0 : ''
                return third
              })
            }
            return second
          })
        }
        return nav
      })
      localStorage.setItem('nav', JSON.stringify($scope.firstNavList))
    }
    //处理不同职位显示的不同路由
    $scope.disposeMenuByJob = () => {
      const loginJobList = ['销售', '管理', '人事', '客服']
      $scope.firstNavList = $scope.firstNavList.map(item => {
        if (item.name === '100001') {
          item.href = loginJobList.includes(loginJob) ? '#/mycj/ywyHome' : '#/mycj/commonHome'
          item.children = item.children.map(child => {
            if (child.code === 'Home') child.href = loginJobList.includes(loginJob) ? '#/mycj/ywyHome' : '#/mycj/commonHome'
            return child
          })
        }
        return item
      })
    }
    //侧边导航展开收起
    $scope.shrinkFn = type => {
      $scope.isZhankai = type === 'zhankai'
      console.log($scope.isZhankai)
      $('.cebian-nav').animate({ width: $scope.isZhankai ? cebianwidth : '25px' })
      type === 'zhankai' ?
        localStorage.setItem('isZhankai', '1') :
        localStorage.removeItem('isZhankai')
    }
    //点击侧边导航
    $scope.clickCebianfn = () => {
      const addr = sessionStorage.getItem('clickAddr')
      if (addr) {
        const clickArr = addr.split(',')
        if ($scope.firstNavList[clickArr[0]].name == '100002') {
          erp.postFun('app/order/getOrderCount', {}, res => {
            res.data && $scope.disposeOrder(res.data)
          }, _ => _);
        }
      }
    }

    //拖拽
    var mx = 0,
      my = 0; //鼠标x、y轴坐标（相对于left，top）
    var dx = 0,
      dy = 0; //对话框坐标（同上）
    var isDraging = false;
    var scrollheight = 0;
    var menu = $('#cebian-menu');
    //鼠标按下
    $('.zhankaiyidong').mousedown(function (e) {
      e.preventDefault();
      e = e || window.event;
      mx = e.pageX; //点击时鼠标X坐标
      my = e.pageY; //点击时鼠标Y坐标
      dx = menu.offset().left;
      dy = menu.offset().top;
      isDraging = true; //标记对话框可拖动
      var dialogW = menu.width();
      var dialogH = menu.height();
      //console.log('鼠标位置：'+mx+' , '+my);
      //console.log('元素位置：'+dx+' , '+dy);
      //console.log('元素宽高：'+dialogW+' , '+dialogH);
    });
    $('#yidong').mousedown(function (e) {
      e.preventDefault();
      e = e || window.event;
      mx = e.pageX; //点击时鼠标X坐标
      my = e.pageY; //点击时鼠标Y坐标
      dx = menu.offset().left;
      dy = menu.offset().top;
      isDraging = true; //标记对话框可拖动

      var dialogW = menu.width();
      var dialogH = menu.height();
      //console.log('鼠标位置：'+mx+' , '+my);
      //console.log('元素位置：'+dx+' , '+dy);
      //console.log('页面滚动：'+scrollheight);
      //console.log('元素宽高：'+dialogW+' , '+dialogH);
    });
    $(window).scroll(function () {
      //console.log($(window).scrollTop());
      scrollheight = $(window).scrollTop();
    });
    //鼠标移动更新窗口位置
    $(document).mousemove(function (e) {
      var e = e || window.event;
      var x = e.pageX; //移动时鼠标X坐标
      var y = e.pageY - scrollheight; //移动时鼠标Y坐标

      dy = dy - scrollheight;
      my = my - scrollheight;
      if (isDraging) { //判断对话框能否拖动
        //console.log(x+','+y);
        var moveX = dx + x - mx; //移动后对话框新的left值
        var moveY = dy + y - my; //移动后对话框新的top值
        //设置拖动范围
        var pageW = $(window).width();
        var pageH = $(window).height();
        var dialogW = menu.width();
        var dialogH = menu.height();
        var maxX = pageW - dialogW; //X轴可拖动最大值
        var maxY = pageH - dialogH; //Y轴可拖动最大值
        moveX = Math.min(Math.max(250, moveX), maxX); //X轴可拖动范围
        moveY = Math.min(Math.max(0, moveY), maxY); //Y轴可拖动范围
        //重新设置对话框的left、top

        menu.css({ "left": moveX + 'px', "top": moveY + 'px' });
      };
    });

    //鼠标离开
    $('.zhankaiyidong').mouseup(function () {
      isDraging = false;
    });
    $('#yidong').mouseup(function () {
      isDraging = false;
    });
    var timeouters;

    $scope.change_lang = 'en';
    $scope.changeLanguage = function (lang) {

      if (lang == 'cn') {
        $translate.use(lang);
        $scope.change_lang = 'en';
        //$('.header-nav>ul>li>a').css("padding", '0 25px');
        localStorage.setItem('lang', 'cn');
      } else if (lang == 'en') {
        $translate.use(lang);
        $scope.change_lang = 'cn';
        //$('.header-nav>ul>li>a').css("padding", '0 10px');
        localStorage.setItem('lang', 'en');
      }

      clearTimeout(timeouters);
      timeouters = setTimeout(function () {
        var cw = localStorage.getItem('cebianWidth');
        //if(cw=='' || cw==)
        var w = $('.cebian-content'); //[0].clientWidth
        var ew = w[0].clientWidth;


        // console.log(ew);

        var isshouqi = localStorage.getItem('isshouqi');


        // console.log(isshouqi);

        var cwidth = ew + 62 + 'px';
        cebianwidth = cwidth;
        if (isshouqi == '' || isshouqi == null || isshouqi == undefined) {
          //上次收起

          // console.log('收起');

        } else {
          //上次未收起
          //console.log('未收起');
          $('.cebian-nav').css('width', cwidth);

        }
      }, 2000);
    };

    $scope.iflang = function (lang) {
      var text;
      if (lang == 'cn') {
        text = '简体中文';
      } else if (lang == 'en') {
        text = 'English';
      }
      return text;
    };
    var lang = localStorage.getItem('lang');
    if (lang) {
      if (lang == 'en') {
        $scope.changeLanguage(lang);
        $scope.change_lang = 'cn';
      } else if (lang == 'cn') {
        $scope.changeLanguage(lang);
        $scope.change_lang = 'en';
      }
    } else {
      localStorage.setItem('lang', 'cn');
    }


    $scope.iscunzai = function (text) {
      //console.log(text);
      if (text == '' || text == null || text == undefined) {
        //console.log(text);
        if (text === 0) {
          //console.log('mayyu')
          return '(' + text + ')';
        } else {
          return '';
        }

      } else {
        //console.log(text);
        text = '(' + text + ')';
        return text;
      }
    };

    $("#logOut").click(function () {
      logout();
    });

    function logout() {
      var base64 = new Base64();
      var token = base64.decode(localStorage.getItem('erptoken') == undefined ? "" : localStorage.getItem('erptoken'));
      erp.postFun('app/employee/logOut', { token: token }, function (n) {
        if (n.data.code == 200) {
          location.href = "login.html";
        } else {
          layer.msg('退出失败！')
        }
      }, function (n) {
        console.log(n)
      })
    }

    function printFun(targetText) {
      console.log(targetText)
      switch (targetText) {
        case '打印暗转明':
          window.open('print.html')
          break
        case '批量设置设计商品价格折扣':
          window.open('fordesigns.html')
          break
        case 'Bulky price discount setting':
          window.open('fordesigns.html')
          break
        case '直发商品折扣':
          window.open('straight-hair-discount.html')
          break
        case 'IP查询':
          window.open('ip-inquiry.html')
          break
        case 'IP Inquiry':
          window.open('ip-inquiry.html')
          break
        case 'Discount of wholesale product':
          window.open('straight-hair-discount.html')
          break
        case '论坛管理后台':
          window.open('http://test.cjdropshipping.com/#/zh/login?from=')
          break
        case '角色权限管理':
          window.open('https://authority.cjdropshipping.cn/#/login')
          break
        case 'Role rights management':
          window.open('https://authority.cjdropshipping.cn/#/login')
          break
        default:
          break
      }

    }

    var b = new Base64();
    $scope.admin = b.decode($window.localStorage.getItem('erploginName') || '');

    // 通知
    $scope.isGetNotice = sessionStorage.getItem('isGetNotice')
    $scope.isShowNotice = false
    $scope.idx = 0
    console.log($scope.isGetNotice)

    function getList() {
      erp.postFun('app/notice/getAllNoticInfo', {}, (res => {
        const data = JSON.parse(res.data.result)
        $scope.isShowNotice = data.sys.length > 0 || data.dhlOrder.length > 0 || data.notice.length > 0
        const noticeData = data.notice.map(_ => {
          return { data: ['1'], title: _.title, info: _.info, type: '4' }
        })
        const sourceData = data.sys.find(_ => {
          return _.stype === 'sourceproductJiaJi'
        })
        const dataArr = [
          { data: data.sys, type: '1', title: '系统通知' },
          { data: data.dhlOrder || [], type: '2', title: 'DHL订单待处理通知' },
          { data: sourceData.count, type: '3', title: '搜品通知' },
          ...noticeData
        ]
        $scope.noticeData = dataArr.filter(_ => _.data.length > 0)
        $scope.showData = $scope.noticeData[$scope.idx]
      }), err => {
        console.log(err)
      });
    }

    if ($scope.isGetNotice !== 'close') {
      getList();
    }

    // 上一条
    $scope.preBtn = () => {
      if ($scope.idx > 0) {
        $scope.idx--
        $scope.showData = $scope.noticeData[$scope.idx]
      }
    }

    // 下一条
    $scope.nextBtn = () => {
      if ($scope.idx < $scope.noticeData.length - 1) {
        $scope.idx++
        $scope.showData = $scope.noticeData[$scope.idx]
      }
    }

    // 关闭
    $scope.closeNotice = () => {
      $scope.isShowNotice = false
      sessionStorage.setItem('isGetNotice', 'close')
    }
  }]);

})(angular, Base64);


//下方代码由 命令行生成 用于处理 新老页面 路由地址跳转
//-----*>
//<*-----
