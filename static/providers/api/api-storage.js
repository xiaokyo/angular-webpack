/**
 * 仓库相关
 */

; (function() {
  var errMsg = '请求失败';

  function errFn(err) {
    console.warn(err);
    layer.msg(errMsg);
  }

  angular.module('api-storage', ['service']).service('api-storage', ['erp', '$q', function(erp, $q) { // 这里不能用箭头函数
    this.getStorageRetentionInfo = storageID => {
      var defered = $q.defer();
      erp.postFun('storage/storageRetention/getStorageRetentionInfo', { storageID }, res => {
        if (res.data.statusCode === '200') {
          defered.resolve(res.data.result); // {CkMoney: "0.00", ZlMoney: "-17.00", DckMoney: "17.00", dikouMoney: "0.00"}
        } else {
          layer.msg(res.data.message);
        }
      }, err => errFn(err), { layer: true });
      return defered.promise; // 把defered对象中的promise对象返回出来 **[用原生的Promise不会触发脏值检测]**
    };

    this.getSkuStorageRetentionInfo = json => {
      /* {
        stroageType  库存类型
        endSales  结束销量
        startSales  开始销量
        endStroageNum  结束库存数量
        startStroageNum  开始库存数量
        endRetention  结束滞留率
        startRetention  开始滞留率
        endRetentionDay  结束滞留率天数
        startRetentionDay  开始滞留率天数
        storageID 仓库编号
        page 当前页
        pageNum 条数
        name  SKU以及商品名称
        days 多少天之内
        startTime  开始时间
        endTime 结束时间
      } */
      var defered = $q.defer();

      erp.postFun('storage/storageRetention/getSkuStorageRetentionInfo', json, res => {
        if (res.data.statusCode === '200') {
          /* "result": {
            "count": 0,
            "list": []
          } */
          defered.resolve(res.data.result);
          /* {
            privateput 没用
            outDate 最后一次出货时间
            IMG 图片
            private 私有现在库存
            pulSales 公有销量
            privateout 没用
            NAME 商品名称
            COSTPRICE 成本
            priSales 私有销量
            public 公有现在库存
            priRetention 私有滞留率
            publicput 没用
            ID 商品编号
            publicout 没用
            pulRetention 公有滞留率
            SKU SKU
            priRetentionDay 私有滞留天数
            pulRetentionDay 公有滞留天数
            putDate 最后一次入库时间
          } */
        } else {
          layer.msg(res.data.message);
        }
      }, err => errFn(err), { layer: true });
      return defered.promise;
    };
  }]);
}());