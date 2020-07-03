import echarts from 'echarts'

export default ($scope, erp) => {
  console.log('业务员首页')
  var myChart = echarts.init(document.getElementById('main'));
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
    console.log(data)
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
      console.log($scope.ordList)
    } else {
      layer.msg('获取订单数量失败')
    }
  }, function (data) {
    console.log(data)
  })
  var dayType = 0;
  $('.day-time').eq(0).addClass('day-act');
  $('.day-time').click(function () {
    var index = $(this).index();
    console.log(index)
    switch (index) {
      case 0:
        dayType = 0;
        break;
      case 1:
        dayType = 1;
        break;
      case 2:
        dayType = 7;
        break;
      case 3:
        dayType = 30;
        break;
    }
    $('.day-time').removeClass('day-act')
    $('.day-time').eq(index).addClass('day-act');
    erp.loadPercent($('.top-bang'), $('.top-bang').height() - 108, 108, 0)
    var upData1 = {};
    upData1.type = dayType;
    erp.postFun('erp/erphomepage/getOrderSellRanking', JSON.stringify(upData1), function (data) {
      console.log(data)
      $scope.phbList = data.data.data;
      if ($scope.phbList.length < 1) {
        erp.addNodataPic($('.top-bang'), $('.top-bang').height() - 108, 108, 0)
        // erp.closeLoadPercent($('.top-bang'))
      } else {
        erp.removeNodataPic($('.top-bang'))
      }
      // layer.closeAll('loading')
      erp.closeLoadPercent($('.top-bang'))
    }, function (data) {
      console.log(data)
      // layer.closeAll('loading')
      erp.closeLoadPercent($('.top-bang'))
    })
  })
  var monthArr = [];
  var xseArr = [];
  var upData = {};
  upData.type = dayType;
  erp.postFun('erp/erphomepage/getOrderSellRanking', JSON.stringify(upData), function (data) {
    console.log(data)
    $scope.phbList = data.data.data;
    if ($scope.phbList.length < 1) {
      erp.addNodataPic($('.top-bang'), $('.top-bang').height() - 108, 108, 0)
    } else {
      erp.removeNodataPic($('.top-bang'))
    }
    layer.closeAll('loading')
  }, function (data) {
    console.log(data)
    layer.closeAll('loading')
  })

  $scope.pageSize = '4';
  $scope.pageNum = '1';
  function getNoticeFun() {
    erp.loadPercent($('.ywy-gg'), $('.ywy-gg').height() - 62, 62, 0)
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
        erp.addNodataPic($('.ywy-gg'), $('.ywy-gg').height() - 62, 62, 0)
      } else {
        erp.removeNodataPic($('.ywy-gg'))
      }
      erp.closeLoadPercent($('.ywy-gg'))
    }, function (data) {
      console.log(data)
      erp.closeLoadPercent($('.ywy-gg'))
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
  var option = {
    backgroundColor: '#fff',
    title: {
      text: '总销售趋势',
      x: '2%',
      padding: 10
    },
    grid: {
      x: '8%',
      y: '17%',
      x2: '10%',
      y2: '10%'
    },
    tooltip: {},
    toolbox: {
      show: true,
      right: '20',
      feature: {
        magicType: {
          show: true,
          type: ['line', 'bar']
        },
        // restore : {
        //     show : true
        // },
        saveAsImage: {
          show: true,
          title: '保存为图片',
          type: 'png',
          lang: ['点击保存']
        }
      }
    },
    // legend: {
    //     data:['销量']
    // },
    xAxis: {
      data: [],
      name: '月份'
    },
    yAxis: {
      type: 'value',
      name: '金额 (万美元)'
    },
    series: [{
      name: '销量',
      type: 'bar',
      data: [],
      itemStyle: {
        normal: {
          color: '#4A90E2',
          lineStyle: {
            color: '#4A90E2'
          },
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: { //数值样式
              color: 'black',
              fontSize: 16
            }
          }
        }
      },
    }],
    //配置样式
    itemStyle: {
      normal: {
        color: function (params) {
          var colorList = ['#4A90E2', '#4A90E2'];
          return colorList[params.dataIndex];
        }
      },
      //鼠标悬停时：
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  };
  console.log(erp.isAdminLogin())
  if (erp.isAdminLogin()) {
    option.title = {
      text: '总销售趋势'
    }
  } else {
    option.title = {
      text: '个人销售额'
    }
  }
  myChart.showLoading(); //加载动画
  erp.postFun('erp/erphomepage/getMonthOrderSell', {}, function (data) {
    console.log(data)
    var monObj = data.data.data;
    for (var k in monObj) {
      monthArr.push(k)
      xseArr.push(monObj[k])
    }
    console.log(monthArr)
    console.log(xseArr)
    myChart.setOption({ //加载数据图表
      xAxis: {
        data: monthArr
      },
      series: [{
        data: xseArr
      }]
    });
    myChart.hideLoading();//关闭动画
    console.log(monObj)
  }, function (data) {
    console.log(data)
    myChart.hideLoading();//关闭动画
  })
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}