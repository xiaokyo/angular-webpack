import 'erp_otweb/css/erp-wa-KeHu-style.css'
import 'erp_otweb/css/erp-home.css'

export default ($scope, erp) => {
  console.log('公共首页')
  $('.good-nav').eq(0).addClass('botborder2px')
  $('.souce-nav').eq(0).addClass('botborder2px')
  $('.souce-show').eq(0).show()
  $('.goods-show').eq(0).show()
  $('.good-nav').mouseenter(function () {
    var index = $(this).index();
    $('.goods-show').hide();
    $('.goods-show').eq(index).show()
    console.log(index)
    $('.good-nav').removeClass('botborder2px')
    $('.good-nav').eq(index).addClass('botborder2px')
  })

  $('.souce-nav').mouseenter(function () {
    var index = $(this).index();
    $('.souce-show').hide();
    $('.souce-show').eq(index).show()
    console.log(index)
    $('.souce-nav').removeClass('botborder2px')
    $('.souce-nav').eq(index).addClass('botborder2px')
  })
  erp.load()
  erp.postFun('erp/erphomepage/StatsAccOrderSalesInfo', {}, function (data) {
    layer.closeAll('loading')
    if (data.data.code == 200) {
      var numObj = data.data.data;
      $scope.bmList = numObj.StatMessageList;//消息
      // $scope.ordList = numObj.StatOrderList;//订单
      $scope.spList0 = numObj.StatProductList;//代发商品
      $scope.spList1 = numObj.StatProductList;//服务商品
      $scope.seaList0 = numObj.searchProductList;//等待搜品
      $scope.seaList1 = numObj.searchProductList;//等待搜品
      $scope.cgList = numObj.statBuyerList;//采购
      $scope.kfList = numObj.statServiceList;//客服
    } else {
      layer.msg('获取数量失败')
    }
  }, function (data) {
    console.log(data)
    layer.closeAll('loading')
  })
  erp.postFun('processOrder/queryOrder/getStatOrderInfo', {}, function (data) {//订单查询迁移杭州
    if (data.data.code == 200) {
      $scope.ordList = data.data.data;//订单
    } else {
      layer.msg('获取数量失败')
    }
  }, function (data) {
    console.log(data)
  })
  $scope.pageSize = '4';
  $scope.pageNum = '1';
  function getNoticeFun() {
    erp.loadPercent($('.eccm-right'), $('.eccm-right').height() - 61, 61, 0)
    var eHomeObj = {};
    eHomeObj.pageSize = $scope.pageSize;
    eHomeObj.page = $scope.pageNum
    erp.postFun('erp/erphomepage/getNotice', JSON.stringify(eHomeObj), function (data) {
      console.log(data)
      if (data.data.code == 200) {
        $scope.noticeCount = data.data.data.count;
        $scope.noticeList = data.data.data.noticeList;
        pageFun()
      }
      if ($scope.noticeCount < 1) {
        erp.addNodataPic($('.eccm-right'), $('.eccm-right').height() - 61, 61, 0)
      } else {
        erp.removeNodataPic($('.eccm-right'))
      }
      erp.closeLoadPercent($('.eccm-right'))
    }, function (data) {
      console.log(data)
      erp.closeLoadPercent($('.eccm-right'))
    })
  }
  getNoticeFun()
  function pageFun() {
    if ($scope.noticeCount < 1) {
      return
    }
    $(".page-num").jqPaginator({
      totalCounts: $scope.noticeCount,//设置分页的总条目数
      pageSize: $scope.pageSize - 0,//设置每一页的条目数
      visiblePages: 5,//显示多少页
      currentPage: $scope.pageNum - 0,
      activeClass: 'active',
      prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
      next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
      page: '<a href="javascript:void(0);">{{page}}<\/a>',
      first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
      last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
      onPageChange: function (n, type) {
        if (type == 'init') {
          layer.closeAll("loading")
          return;
        }
        $scope.pageNum = n + '';
        getNoticeFun()
      }
    });
  }
  $scope.showNotFun = function (item) {
    $scope.ggTkFlag = true;
    $('.tk-notice-text').text(item.info);
  }
}