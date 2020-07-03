var rootPath = 'static/newPages/' // 根目录
var importModule = function (url) { return document.write("<script type='text/javascript' src='" + rootPath + url + "'></script>") }

var jsArr = [
  // 线下采购
  'offlinePurchase/confirm/index.js',// 待确认
  'offlinePurchase/detail/index.js',// 详情查看
  'offlinePurchase/refund/index.js',// 退款
  'losslist/index.js',// 损耗列表
  'syncStorage/index.js',// 同步库存
  'selfDelivery/index.js',// 自发货
  'transport/index.js',// 物流公司列表管理
  'offlinePurchase/abnormal/index.js',// 签收异常
  'returnList/index.js',// 退货列表
  'createStorageAll/index.js',// 一键建仓
  'purchaseThree/index.js',// 分配工作
  'updatePurLink/index.js',// 商品详情修改对手链接和采购链接
  'assignPersonToPurchase/index.js',// 组长分配任务给组员
  'sourcingLimit/index.js',// 搜品额度配置
]

  ; (function () {
    // 加上打包后的时间戳版本号
    const vDateTemp = !!window.BUILD_VERSION ? '?v=' + window.BUILD_VERSION : ''
    jsArr.forEach(function (item, index) { importModule(item + vDateTemp) })
  })()
