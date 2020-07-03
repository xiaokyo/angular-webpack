/**
 * 公共 API
 */

; (function () {
  var errMsg = '请求失败';

  function errFn(err) {
    console.warn(err);
    layer.msg(errMsg);
  }

  angular.module('api', ['service']).service('api', ['erp', function (erp) {
    // 获取仓库
    this.getStorage = () => {
      return new Promise((resolve, reject) => {
        resolve(
          erp
            .getStorage()
            .map(_ => ({ id: _.dataId, storageName: _.dataName }))
        );
      });
    };

    /**
     * 去CJ详情
     */
    this.toFrontDetail = id => {
      // erp.getFun('https://app1.cjdropshipping.com/cj/locProduct/rollToken?id=' + id, res => { // 线上
      erp.getFun('cj/locProduct/rollToken?id=' + id, res => {
        if (res.data.statusCode === '200') {
          window.open().location.href = `https://app.cjdropshipping.com/product-detail.html?id=${id}&token=${res.data.result}`;
        }
      }, err => errFn(err), { layer: true });
    };
    
    /**
     * 去erp详情
     */
    this.showErpDetail = item => {
      // merchanStatus -> '3'已上架
      window.open(`manage.html#/merchandise/show-detail/${item.id || item.ID}/${item.isCopy || '0'}/${item.merchanStatus}/${item.productType || 0}`, '_blank', '');
    }
  }]);
}());