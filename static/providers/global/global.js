/**
 * 全局函数
 */

; (function () {
  angular.module('global-fn', ['service']).service('global-fn', ['erp', function (erp) {
    this.toFrontDetail = function (id) {
      console.log('-------------------------------------------------------------------------------')
      var toUrl = window.open();
      erp.getFun('cj/locProduct/rollToken?id=' + id, function (data) {
        var data = data.data;
        if (data.statusCode != 200) {
          console.log(data);
          return;
        }
        var detailToken = data.result;
        console.log(detailToken);
        toUrl.location.href = 'https://app.cjdropshipping.com/product-detail.html?id=' + id + '&token=' + detailToken;
      }, function (err) {
        console.log(err);
      });
    };
  }]);
}());