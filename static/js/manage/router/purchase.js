window.purchaseRouter =[{//采购成本
    "route": "/erppurchase/cost",
    "templateUrl": "/static/html/purchase/cost.html",
    "controller": "purchaseCostCtrl as ctrl"
  },{//采购缺货
    "route": "/erppurchase/stockout",
    "templateUrl": "/static/html/purchase/stockout.html",
    "controller": "purchaseStockoutCtrl as ctrl"
  },{//签收
    "route": "/erppurchase/sign",
    "templateUrl": "/static/html/purchase/sign.html",
    "controller": "purchaseSignCtrl as ctrl"
  },{//分标
    "route": "/erppurchase/mark",
    "templateUrl": "/static/html/purchase/mark.html",
    "controller": "purchaseMarkCtrl as ctrl"
  },{//已关闭待签收
    "route": "/erppurchase/closelist",
    "templateUrl": "/static/html/purchase/close-list.html",
    "controller": "purchasecloseListCtrl as ctrl"
  }
]
