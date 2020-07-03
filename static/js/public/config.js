(function () {
  window.PROXY = {
    development: {
      "app": "http://erp.test.com/",
      "cj-erp": "http://erp.test.com/",
	    "erp": "http://erp1.test.com/",
      "storage": "http://storage.test.com/",
      "caigou": "http://caigou.test.com/",
      "tool": "http://tools.test.com/",
      "order": "http://order.test.com/",
      "cj": "http://app1.test.com/",
      "fulfillment": "http://fulfillment.test.com/",
      "source": "http://sourcing.test.com/",
      "newlogistics": "http://logistics2.test.com/",
      "mail": "http://cjmail.test.com/",
      "_logistics": "http://192.168.5.37:8010/",
      "_logistics_com": "http://192.168.5.37:8010/",
      "_zflogistics": "http://dsp-logist.test.com/",
      "supplier": "http://192.168.5.239:8077/",
      "supplierPlanInfo": "http://192.168.5.239:8077/",
      "erpSupplierPlan": "http://192.168.5.239:8077/",
      "payOrder": "http://192.168.5.197:8022/",
      "robot": "http://chat.test.com/",
      "message": "http://chat.test.com/",
      "product": "http://47.254.77.240:8000/",
      "warehousereceipt": "http://erp.test.com/",
      "procurement": "http://192.168.5.197:8003/",
      "processOrder": "http://192.168.5.197:8007/",
      "control": "http://192.168.5.212:8183/",
      "storehouseSimple": "http://192.168.5.197:8004/",
      "storehouseUsa": "http://192.168.5.197:8026/",
      "storehouse": "http://192.168.5.197:8009/",
      "unsold": "http://erp1.test.com/",
      "media": "http://192.168.5.197:8045/",
      "integral": "http://192.168.100.12:8098/",
      "erpSupplierSourceAllocateRecording": "http://supplier1.test.com/",
      "erpSupplierSourceProduct": "http://supplier1.test.com/",
      "storehouseOutgoingWarehousing": "http://192.168.5.197:8008/",
      "warehouseBuildWeb": "http://192.168.5.197:8001/",
      "otherData": "http://192.168.5.197:8018/",
      "orderSyn": "http://192.168.5.197:8017/",
      "freight": "http://192.168.5.37:8001/",
      "linShiGong": "http://192.168.5.197:8020/",
      "cujiaOthers":"http://192.168.5.197:8121/"
    },
    // development: {
    //   "app": "https://app.cjdropshipping.com/",
    //   "cj-erp": "https://erp.cjdropshipping.cn/",//https://erp.cjdropshipping.com
    //   "erp": "https://erp1.cjdropshipping.com/",
    //   "storage": "https://storage.cjdropshipping.com/",
    //   "caigou": "https://erp.cjdropshipping.cn/",
    //   "procurement": "https://erp.cjdropshipping.cn/",
    //   "tool": 'https://tools.cjdropshipping.com/',
    //   'order': "https://order.cjdropshipping.com/",
    //   "cj": 'https://app1.cjdropshipping.com/',
    //   "fulfillment": "https://fulfillment.cjdropshipping.com/",
    //   "source": "https://sourcing.cjdropshipping.com/",
    //   "newlogistics": "https://logistics2.cjdropshipping.com/",
    //   "mail": "https://cjmail.cjdropshipping.com/",
    //   "_logistics": "https://logistics.cjdropshipping.com/",
    //   "_zflogistics": "https://miandan2.cjdropshipping.cn/",
    //   "supplier": "https://suppliers.cjdropshipping.cn/erp/",
    //   "log_recod": "http://jhmjjx.cn:4000/",
    //   "robot": "https://chat.cjdropshipping.com/",
    //   "message": "https://chat.cjdropshipping.com/",
    //   "product": "https://product.cjdropshipping.com/",// 商品档案线上环境
    //   "warehousereceipt": "https://erp.cjdropshipping.cn/",
    //   "warehouse": "https://erp.cjdropshipping.cn/",
    //   "warehouseBuildWeb": "https://erp.cjdropshipping.cn/",
    //   "control": "https://authority.cjdropshipping.cn/", //权限系统
    //   "processOrder": "https://erp.cjdropshipping.cn/",
    //   "storehouseSimple": "https://erp.cjdropshipping.cn/",
    //   "storehouseUsa": "https://erp.cjdropshipping.cn/",
    //   "storehouse": "https://erp.cjdropshipping.cn/",
    //   "orderSyn": "https://erp.cjdropshipping.cn/",
    //   "unsold": "/",
    //   "media": "https://app.cjdropshipping.com/",
    //   "integral": "https://erp.cjdropshipping.cn/", // 绩效考核规则相关
    //   "erpSupplierPlan": "https://suppliers.cjdropshipping.cn/erp/",
    //   "erpSupplierSourceAllocateRecording": "https://suppliers.cjdropshipping.cn/erp/",
    //   "erpSupplierSourceProduct": "https://suppliers.cjdropshipping.cn/erp/",
    //   "supplierPlanInfo": "https://suppliers.cjdropshipping.cn/erp/",
    //   "linShiGong": "https://erp.cjdropshipping.cn/"
    // },
    test: {
      "app": "http://erp.test.com/",
      "cj-erp": "http://erp.test.com/",
	    "erp": "http://erp1.test.com/",
      "storage": "http://storage.test.com/",
      "caigou": "http://caigou.test.com/",
      "tool": "http://tools.test.com/",
      "order": "http://order.test.com/",
      "cj": "http://app1.test.com/",
      "fulfillment": "http://fulfillment.test.com/",
      "source": "http://sourcing.test.com/",
      "newlogistics": "http://logistics2.test.com/",
      "mail": "http://cjmail.test.com/",
      "_logistics": "http://192.168.5.37:8010/",
      "_logistics_com": "http://192.168.5.37:8010/",
      "_zflogistics": "http://dsp-logist.test.com/",
      "supplier": "http://192.168.5.239:8077/",
      "supplierPlanInfo": "http://192.168.5.239:8077/",
      "erpSupplierPlan": "http://192.168.5.239:8077/",
      "payOrder": "http://192.168.5.197:8022/",
      "robot": "http://chat.test.com/",
      "message": "http://chat.test.com/",
      "product": "http://47.254.77.240:8000/",
      "warehousereceipt": "http://erp.test.com/",
      "procurement": "http://192.168.5.197:8003/",
      "processOrder": "http://192.168.5.197:8007/",
      "control": "http://192.168.5.212:8183/",
      "storehouseSimple": "http://192.168.5.197:8004/",
      "storehouseUsa": "http://192.168.5.197:8026/",
      "storehouse": "http://192.168.5.197:8009/",
      "unsold": "http://erp1.test.com/",
      "media": "http://192.168.5.197:8045/",
      "integral": "http://192.168.100.12:8098/",
      "erpSupplierSourceAllocateRecording": "http://supplier1.test.com/",
      "erpSupplierSourceProduct": "http://supplier1.test.com/",
      "storehouseOutgoingWarehousing": "http://192.168.5.197:8008/",
      "warehouseBuildWeb": "http://192.168.5.197:8001/",
      "otherData": "http://192.168.5.197:8018/",
      "orderSyn": "http://192.168.5.197:8017/",
      "freight": "http://192.168.5.37:8001/",
      "linShiGong": "http://192.168.5.197:8020/",
      "cujiaOthers":"http://192.168.5.197:8121/"
    },
    'test-new': {
      "app": "http://dsp-server.cj-1.com/",
      "cj-erp": "http://erp-server.cj-1.com/",
      "erp": "http://cucheng-erp-web.cj-1.com/",
      "storage": "http://cucheng-storage-web.cj-1.com/",
      "caigou": "http://cucheng-procurement-web.cj-1.com/",
      "tool": 'http://cucheng-tool-web.cj-1.com/',
      'order': "http://cucheng-order-web.cj-1.com/",
      // 'order':"http://192.168.5.70:8010/",
      "cj": 'http://cucheng-app-web.cj-1.com/',
      "fulfillment": "http://cucheng-fulfillment-web.cj-1.com/",
      "source": "http://cucheng-source-web.cj-1.com/",
      "newlogistics": "http://cucheng-logistics-web.cj-1.com/",
      "mail": "http://cucheng-mail-web.cj-1.com/",
      "_logistics": "http://dsp-logist.test.com/",
      "_logistics_com": "http://dsp-logist.test.com/",
      "_zflogistics": "http://dsp-logist.test.com/",
      "supplier": "http://cj-supplier-erp.cj-1.com/",
      "supplierPlanInfo": "http://cj-supplier-erp.cj-1.com/",
      "erpSupplierPlan": "http://cj-supplier-erp.cj-1.com/",
      "erpSupplierSourceAllocateRecording": "http://cj-supplier-erp.cj-1.com/",
      "payOrder": "http://cujia-pay-order-web.cj-1.com/",
      "robot": "http://test-chat-server.cj-1.com/",
      "message": "http://test-chat-server.cj-1.com/",
      "product": "http://47.254.77.240:8000/",
      "warehousereceipt": "http://cujia-storehouse-receipt-web.cj-1.com/",
      "procurement": "http://cujia-procurement-web.cj-1.com/",
      "processOrder": "http://cujia-order-process-web.cj-1.com/",
      "control": "http://jobs-auth.cj-1.com/",
      "storehouseSimple": "http://cujia-storehouse-simple-web.cj-1.com/",
      "storehouseUsa": "http://cujia-storehouse-usa-web.cj-1.com/",
      "storehouse": "http://cujia-storehouse-web.cj-1.com/",
      "orderSyn": "http://cujia-order-syn-web.cj-1.com/",
      "unsold": "http://cucheng-erp-web.cj-1.com/",
      "media": "http://cujia-order-media-web.cj-1.com/",
      "integral": "http://cujia-storehouse-integral-web.cj-1.com/",
      "erpSupplierSourceProduct": "http://cj-supplier-erp.cj-1.com/",
      "storehouseOutgoingWarehousing": "http://cujia-storehouse-outgoingwarehousing-web.cj-1.com/",
      "warehouseBuildWeb": "http://cujia-storehouse-build-web.cj-1.com/",
      "otherData": "http://cujia-others-data-web.cj-1.com/",
      "cujiaOthers":"http://cujia-others-usa-web.cj-1.com/"
    },
    'production': {
      "app": "/",
      "cj-erp": "/",
      "erp": "/",
      "storage": "/",
      "caigou": "/",
      "procurement": "/",
      "tool": '/',
      'order': "/",
      "cj": '/',
      "fulfillment": "/",
      "source": "/",
      "newlogistics": "/",
      "mail": "/",
      "_logistics": "/",
      "_logistics_com": "https://erp.cjdropshipping.com/",
      "_zflogistics": "https://miandan2.cjdropshipping.cn/",
      "supplier": "/",
      "log_recod": "http://jhmjjx.cn:4000/",
      "robot": "/",
      "message": "/",
      "product": "/",
      "warehousereceipt": "/",
      "warehouse": "/",
      "warehouseBuildWeb": "/",
      "control": "/", //权限系统
      "processOrder": "/",
      "storehouseSimple": "/",
      "storehouseUsa": "/",
      "orderSyn": "/",
      "storehouse": "https://erp.cjdropshipping.cn/",
      "unsold": "/",
      "media": "/",
      "integral": "/", // 绩效考核规则相关
      "storehouseOutgoingWarehousing": "/",
      "freight": "/",
      "otherData": "/",
      "payOrder": "/",
      "linShiGong":"/",
      "cujiaOthers":"/",
      "oldLogistics":"/"
    }
  }
})()
