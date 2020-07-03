const development = {
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
  "cujiaOthers": "http://192.168.5.197:8121/"
}

/**
 * 设置代理格式
 * @param {*} obj 
 */
const setProxy = obj => {
  const result = {}
  for (let key in obj) {
    let value = obj[key]
    if (value.endsWith('/')) value = value.substr(0, value.length - 1)
    result[`/${key}`] = {
      target: value,
      secure: obj[key].indexOf('192') != -1 ? false : true,
      changeOrigin: true
    }
  }
  return result
}

module.exports = setProxy(development)