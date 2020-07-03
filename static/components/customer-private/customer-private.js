(function (angular) {

  angular.module('manage')
    .component('customerPrivate', {
      templateUrl: '/static/components/customer-private/customer-private.html',
      controller: customerPrivateCtrl,
      bindings: {
        customer:'='
      }
    })

  function customerPrivateCtrl($scope, erp, $timeout) {

    const lang = localStorage.getItem('lang') || 'cn';
    $scope.sendData = {
      discount: "",
      freightdiscount: ''
    };
    var gjh28;
    if (lang == 'cn' || lang == null) {
      gjh28 = '网络错误';
    } else if (lang == 'en') {
      gjh28 = 'Network Error';
    }
    
    $scope.$on('customer-list', function (ev, data) {
      if (data.flag == 'show-customer-private') {
        $scope.setWuliuItem = data.customer
        $scope.privatecom($scope.setWuliuItem);
      }
    })

    
    $scope.guanlianpagenum = 1;
    $scope.tanchuangpagesize = 10;
    $scope.shipDefaultProfitRate = 100;
    $scope.tanchuangpagenum = 1;

    $scope.searchinfoTan = '';
    $scope.searchtanlistTan = function () {
      extcommon($scope.guanlianitem);
    }
    $scope.enterSearchTan = function (e) {
      if (e.keyCode == 13) {
        $scope.searchtanlistTan();
      }
    }


    //指定可见商品
    $scope.privatecom = function (item) {
      if (item.autanum == 0) {
        return;
      }
      $scope.nowOpeUserId = item.id;
      $scope.curGuest = item;
      $scope.private = true;
      $scope.isProvateList = true;
      extcommon();
    }
    //刊登商品
    $scope.list = false;
    $scope.listcom = function (item) {
      if (item.listednum == 0) {
        return;
      }
      $scope.nowOpeUserId = item.id;
      $scope.curGuest = item;
      $scope.private = true;
      $scope.isLisedList = true;
      extcommon();
    }
    // 已关联商品详情
    $scope.toErpDetal = function (item) {
      window.open('manage.html#/merchandise/show-detail/' + item.PID + '/0/3/0', '_blank', '');
    }
    $scope.appHref = erp.getAppUrl();
    //指定可见,刊登，商品详情
    $scope.privatedetal = function (item) {
      var opeId;
      if ($scope.isProvateList) {
        opeId = item.ID;
      }
      if ($scope.isLisedList) {
        opeId = item.PID;
      }
      var toUrl = window.open();
      erp.getFun('cj/locProduct/rollToken?id=' + opeId, function (data) {
        var data = data.data;
        if (data.statusCode != 200) {
          console.log(data);
          return;
        }
        var detailToken = data.result;
        console.log(detailToken);
        toUrl.location.href = $scope.appHref + '/product-detail.html?id=' + opeId + '&token=' + detailToken;
      }, function (err) {
        console.log(err);
      });
    }

    $scope.closeTan = function () {
      $scope.guanlian = false;
      $scope.private = false;
      $scope.isInGuanEdit = false;
      $scope.excellist = [];
      $scope.isLisedList = false;
      $scope.isProvateList = false;
      $scope.searchinfoTan = '';
      $scope.curGuest = null;
      $scope.tanTotalNum = 0;
      $('.tanchuang-page').jqPaginator('destroy');
    }

    function err () {

    }

    function settleSendDataTan() {
      var sendDataObj = {};
      var postUrl;
      var sendData = {};

      if ($scope.isLisedList) {
        postUrl = "pojo/product/listingProductByAccounId";
        sendData.accountId = $scope.curGuest.id || $scope.curGuest.ID;
        sendData.pageSize = $scope.tanchuangpagesize;
        sendData.pageNum = $scope.tanchuangpagenum;
        sendData.inputStr = $scope.searchinfoTan;
      } else {
        sendData.data = {};
        sendData.data.pageSize = $scope.tanchuangpagesize;
        sendData.data.pageNum = $scope.tanchuangpagenum;
        sendData.data.userId = $scope.curGuest.id || $scope.curGuest.ID;
        sendData.data.shopId = $scope.shopId;
        if ($scope.isProvateList) {
          postUrl = "app/locProduct/getautaproducts";
          sendData.data.inputStr = $scope.searchinfoTan;
        }
        sendData.data = JSON.stringify(sendData.data);
      }
      sendData = JSON.stringify(sendData);

      sendDataObj.postUrl = postUrl;
      sendDataObj.sendData = sendData;

      return sendDataObj;

    }
    function extcommon() {
      // "app/rebate/getassignproduct"
      $scope.tanchuangpagenum = '1';
      var sendDataObj = settleSendDataTan();
      // erp.load();
      erp.loadPercent($('.erp-load-box'), 628);
      $scope.excellist = [];
      console.log(sendDataObj)
      erp.postFun(sendDataObj.postUrl, sendDataObj.sendData, function (data) {
        // erp.closeLoad();
        erp.closeLoadPercent($('.erp-load-box'));
        console.log(data.data);
        if (data.data.statusCode != 200) {
          erp.addNodataPic($('.erp-load-box'), 570, 55);
          layer.msg(gjh28);
          return;
        }
        if (!data.data.result) {
          erp.addNodataPic($('.erp-load-box'), 570, 55);
          $scope.tanTotalNum = 0;
          return;
        }
        var obj = JSON.parse(data.data.result)
        if (obj.count == 0) {
          erp.addNodataPic($('.erp-load-box'), 570, 55);
          $scope.tanTotalNum = 0;
          return;
        }
        erp.removeNodataPic($('.erp-load-box'));
        $scope.tanTotalNum = obj.count;
        // console.log(obj);
        settleTanList(obj);
        $('.tanchuang-page').jqPaginator({
          totalCounts: obj.count * 1,
          pageSize: $scope.tanchuangpagesize * 1,
          visiblePages: 5,
          currentPage: $scope.tanchuangpagenum * 1,
          activeClass: 'current',
          first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
          prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
          next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
          last: '<a class="prev" href="javascript:void(0);">&gt;&gt;<\/a>',
          page: '<a href="javascript:void(0);">{{page}}<\/a><\/li>',
          onPageChange: function (n, type) {
            if (type == 'init') return;
            $scope.tanchuangpagenum = n + '';
            var sendDataObj = settleSendDataTan();
            $scope.excellist = [];
            // erp.load();
            erp.loadPercent($('.erp-load-box'), 628);
            erp.postFun(sendDataObj.postUrl, sendDataObj.sendData, function (data) {
              // erp.closeLoad();
              erp.closeLoadPercent($('.erp-load-box'));
              var obj = JSON.parse(data.data.result)
              settleTanList(obj);
            }, err)
          }
        });

      }, err);

    }
    function settleTanList(obj) {
      console.log(obj);
      if ($scope.isProvateList || $scope.isLisedList) {
        for (var i = 0; i < obj.list.length; i++) {
          obj.list[i].flag = false;
          if ($scope.isLisedList) {
            obj.list[i].CREATEDATE = obj.list[i].LISTINGDATE;
            obj.list[i].SKU = obj.list[i].pSku;
            // obj.list[i].CREATEDATE = obj.list[i].LISTINGDATE;
          }
        }
      }
      console.log(obj.list)
      $scope.excellist = obj.list;
    }

  }
})(angular);